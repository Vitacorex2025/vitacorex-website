"""vcx-api v2 — visitor counter and the owner's daily report at 17:00 Eastern.

Owner 2026-10-16: «чтобы мне имейл приходил каждый день часов в 5 вечера: сколько человек посетили сайт и как долго
там были». The site pings /api/v2/stats/hit once per page view and again with the visible time when the page is hidden.
Nothing identifies a person: no cookies, no raw IP; a visitor is a hash of IP + user agent + a salt that changes daily.
Pages with Global Privacy Control / Do Not Track send nothing. The report goes through the durable outbox once a day
(dedupe key report:<date>), so a restart or a second worker can never send it twice.
"""

import hashlib
import re
import secrets
from collections import Counter
from datetime import timedelta
from urllib.parse import urlsplit

from ..db import get_conn
from . import v2_store
from .v2_config import env, iso, subject_prefix, utcnow
from .v2_contact_notify import recipients

try:
    from zoneinfo import ZoneInfo
    _NY = ZoneInfo("America/New_York")
except Exception:  # pragma: no cover
    _NY = None

PV_RE = re.compile(r"^[A-Za-z0-9]{8,32}$")
PATH_RE = re.compile(r"^/[A-Za-z0-9/_.-]{0,159}$")
BOT_RE = re.compile(r"bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|python|curl|wget|scrapy", re.I)
MOBILE_RE = re.compile(r"Mobi|Android|iPhone|iPad", re.I)
SITE_HOSTS = ("vitacorexllc.com", "www.vitacorexllc.com")
MAX_SECONDS = 3600
KEEP_DAYS = 120
_SALT = {"day": None, "salt": None}

SOURCES = (  # referring host suffix -> name in the report
    ("chatgpt.com", "ChatGPT"), ("chat.openai.com", "ChatGPT"), ("perplexity.ai", "Perplexity"),
    ("gemini.google.com", "Gemini"), ("copilot.microsoft.com", "Copilot"), ("claude.ai", "Claude"),
    ("google.", "Google"), ("bing.com", "Bing"), ("duckduckgo.com", "DuckDuckGo"), ("yahoo.", "Yahoo"),
    ("yandex.", "Яндекс"), ("facebook.com", "Facebook"), ("instagram.com", "Instagram"), ("t.co", "X (Twitter)"),
    ("linkedin.com", "LinkedIn"), ("youtube.com", "YouTube"), ("yelp.com", "Yelp"), ("nextdoor.com", "Nextdoor"),
)
LANG_RU = {"en": "английский", "ru": "русский", "es": "испанский"}


class HitRejected(Exception):
    pass


def _salt(day: str) -> str:
    if _SALT["day"] != day:  # kept in memory only: after a day (or a restart) old hashes cannot be recomputed
        _SALT["day"], _SALT["salt"] = day, secrets.token_hex(16)
    return _SALT["salt"]


def _ref_host(ref) -> str | None:
    if not isinstance(ref, str) or not ref.startswith(("http://", "https://")):
        return None
    host = (urlsplit(ref[:300]).hostname or "").lower()
    if not host or host in SITE_HOSTS or host.endswith(".vitacorexllc.com"):
        return None
    return host[:80]


def source_name(host: str | None) -> str:
    if not host:
        return "напрямую или из закладок"
    for suffix, name in SOURCES:
        if suffix.endswith("."):  # any country domain: google.com, www.google.de, yandex.ru
            if host.startswith(suffix) or ("." + suffix) in host:
                return name
        elif host == suffix or host.endswith("." + suffix):
            return name
    return host


def record_hit(payload, ip: str, user_agent: str) -> bool:
    """Returns True when counted; bots and malformed pings are silently dropped (False)."""
    if not isinstance(payload, dict) or not user_agent or BOT_RE.search(user_agent):
        return False
    pv = payload.get("pv")
    if not isinstance(pv, str) or not PV_RE.match(pv):
        raise HitRejected("invalid_pv")
    now = utcnow()
    with get_conn() as conn:
        if payload.get("t") == "e":
            try:
                seconds = max(0, min(MAX_SECONDS, int(payload.get("s") or 0)))
            except (TypeError, ValueError):
                raise HitRejected("invalid_seconds") from None
            cur = conn.execute("UPDATE v2_visits SET seconds=MAX(seconds, ?) WHERE pv=?", (seconds, pv))
            return cur.rowcount == 1
        path = payload.get("path")
        if not isinstance(path, str) or not PATH_RE.match(path):
            raise HitRejected("invalid_path")
        day = now.strftime("%Y-%m-%d")
        vid = hashlib.sha256(f"{_salt(day)}|{ip}|{user_agent[:300]}".encode()).hexdigest()[:24]
        lang = payload.get("lang") if payload.get("lang") in LANG_RU else "en"
        device = "mobile" if MOBILE_RE.search(user_agent) else "desktop"
        cur = conn.execute(
            "INSERT OR IGNORE INTO v2_visits (pv, day_salt, vid, path, ref, lang, device, seconds, created_at)"
            " VALUES (?,?,?,?,?,?,?,0,?)", (pv, day, vid, path, _ref_host(payload.get("ref")), lang, device, iso(now)))
        return cur.rowcount == 1


# ── daily report ──────────────────────────────────────────────────────

def _fmt_dur(seconds: float) -> str:
    s = int(round(seconds))
    return f"{s // 60} мин {s % 60:02d} с" if s >= 60 else f"{s} с"


def _local(dt):
    return dt.astimezone(_NY) if _NY else dt


def summary(start, end) -> dict:
    a, b = iso(start), iso(end)
    with get_conn() as conn:
        rows = [dict(r) for r in conn.execute(
            "SELECT vid, path, ref, lang, device, seconds FROM v2_visits WHERE created_at>=? AND created_at<?", (a, b))]
        chat_sources = conn.execute("SELECT DISTINCT source_event_id FROM v2_outbox WHERE kind LIKE 'contact.chat.%'"
                                    " AND created_at>=? AND created_at<?", (a, b)).fetchall()
        chats = len({r[0].rsplit(":", 1)[0] for r in chat_sources})  # chat:<session>:<messages> -> one per session
        calls = conn.execute("SELECT COUNT(DISTINCT source_event_id) FROM v2_outbox WHERE kind LIKE 'contact.call.%'"
                             " AND created_at>=? AND created_at<?", (a, b)).fetchone()[0]
        requests = conn.execute("SELECT COUNT(*) FROM v2_requests WHERE created_at>=? AND created_at<?", (a, b)).fetchone()[0]
    per_visitor: dict[str, dict] = {}
    for r in rows:
        v = per_visitor.setdefault(r["vid"], {"seconds": 0, "views": 0, "ref": None, "lang": r["lang"], "device": r["device"]})
        v["seconds"] += r["seconds"]
        v["views"] += 1
        v["ref"] = v["ref"] or r["ref"]
    visitors = list(per_visitor.values())
    times = sorted(v["seconds"] for v in visitors)
    return {
        "visitors": len(visitors),
        "views": len(rows),
        "avg_seconds": (sum(times) / len(times)) if times else 0,
        "median_seconds": times[len(times) // 2] if times else 0,
        "bounced": sum(1 for v in visitors if v["seconds"] < 10 and v["views"] == 1),
        "mobile": sum(1 for v in visitors if v["device"] == "mobile"),
        "langs": Counter(v["lang"] for v in visitors),
        "sources": Counter(source_name(v["ref"]) for v in visitors),
        "pages": Counter(r["path"] for r in rows),
        "chats": chats, "calls": calls, "requests": requests,
    }


def report_message(end) -> tuple[str, str, None]:
    start = end - timedelta(days=1)
    s, prev = summary(start, end), summary(start - timedelta(days=1), start)
    ls, le = _local(start), _local(end)
    subject = (f"{subject_prefix()}[VitaCoreX] Сайт за сутки: {s['visitors']} посетит., "
               f"в среднем {_fmt_dur(s['avg_seconds'])}")
    lines = [
        f"Отчёт о сайте vitacorexllc.com за сутки: с {ls:%d.%m %H:%M} до {le:%d.%m %H:%M} (Eastern).",
        "",
        f"Посетители: {s['visitors']} (сутками раньше: {prev['visitors']})",
        f"Просмотры страниц: {s['views']} (сутками раньше: {prev['views']})",
        f"Время на сайте: в среднем {_fmt_dur(s['avg_seconds'])}, у половины посетителей не меньше {_fmt_dur(s['median_seconds'])}",
        f"Ушли почти сразу (одна страница, меньше 10 секунд): {s['bounced']}",
        f"С телефона: {s['mobile']}, с компьютера: {s['visitors'] - s['mobile']}",
        "Языки: " + (", ".join(f"{LANG_RU.get(k, k)} {n}" for k, n in s["langs"].most_common()) or "—"),
        "",
        "Откуда пришли:",
        *([f"  {name}: {n}" for name, n in s["sources"].most_common(8)] or ["  —"]),
        "",
        "Самые просматриваемые страницы:",
        *([f"  {path}: {n}" for path, n in s["pages"].most_common(8)] or ["  —"]),
        "",
        f"Разговоры в чате сайта: {s['chats']}",
        f"Звонки на линию: {s['calls']}",
        f"Заявки через сайт и телефон: {s['requests']}",
        "",
        "Считаются только живые посетители: роботы поисковиков и боты не учитываются. Cookies не используются,",
        "личные данные не собираются; посетители с включённым запретом отслеживания (GPC / Do Not Track) не считаются.",
    ]
    return subject, "\n".join(lines), None


def report_hour() -> int:
    try:
        return min(23, max(0, int(env("VCX_DAILY_REPORT_HOUR", "17"))))
    except ValueError:
        return 17


def maybe_send(now=None) -> bool:
    """Called by the outbox worker every few seconds: once a day after the report hour (Eastern), queue the report."""
    if env("VCX_DAILY_REPORT", "true").lower() != "true":
        return False
    now = now or utcnow()
    local = _local(now)
    if local.hour < report_hour():
        return False
    source = f"report:{local:%Y-%m-%d}"
    with get_conn() as conn:
        if conn.execute("SELECT 1 FROM v2_outbox WHERE source_event_id=? LIMIT 1", (source,)).fetchone():
            return False
        end = local.replace(hour=report_hour(), minute=0, second=0, microsecond=0)
        message = report_message(end)
        queued = 0
        for i, rcpt in enumerate(recipients()):
            queued += v2_store.enqueue(conn, source, f"report.daily.r{i}", "owner", rcpt, message, None)
        conn.execute("DELETE FROM v2_visits WHERE created_at < ?", (iso(now - timedelta(days=KEEP_DAYS)),))
    return queued > 0
