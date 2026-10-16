"""v2 visitor counter and the owner's daily report (17:00 Eastern, once a day, through the outbox)."""

import json
from datetime import datetime, timezone

from conftest import db_rows

UA_PHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1"
UA_PC = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36"


def _hit(client, body, ua=UA_PC, ip="203.0.113.7"):
    return client.post("/api/v2/stats/hit", content=json.dumps(body),
                       headers={"Content-Type": "text/plain", "User-Agent": ua, "X-Forwarded-For": f"10.0.0.1, {ip}"})


def test_hits_count_visitors_time_and_drop_bots(client, env):
    assert _hit(client, {"t": "v", "pv": "aaaaaaaa1", "path": "/ru/", "ref": "https://www.google.com/search?q=x", "lang": "ru"},
                ua=UA_PHONE).json() == {"counted": True}
    assert _hit(client, {"t": "v", "pv": "aaaaaaaa2", "path": "/ru/pricing.html", "lang": "ru"}, ua=UA_PHONE).json() == {"counted": True}
    assert _hit(client, {"t": "e", "pv": "aaaaaaaa1", "s": 95}, ua=UA_PHONE).json() == {"counted": True}
    assert _hit(client, {"t": "e", "pv": "aaaaaaaa1", "s": 40}, ua=UA_PHONE).status_code == 202   # never goes down
    assert _hit(client, {"t": "e", "pv": "aaaaaaaa2", "s": 99999}, ua=UA_PHONE).status_code == 202  # capped at 1 h
    assert _hit(client, {"t": "v", "pv": "bbbbbbbb1", "path": "/", "ref": "https://chatgpt.com/"}, ip="198.51.100.9").status_code == 202
    assert _hit(client, {"t": "v", "pv": "cccccccc1", "path": "/"}, ua="Googlebot/2.1 (+http://www.google.com/bot.html)").json() == {"counted": False}
    assert _hit(client, {"t": "v", "pv": "x", "path": "/"}).status_code == 422
    assert _hit(client, {"t": "v", "pv": "dddddddd1", "path": "https://evil.example/"}).status_code == 422
    rows = {r["pv"]: r for r in db_rows(env, "SELECT * FROM v2_visits")}
    assert set(rows) == {"aaaaaaaa1", "aaaaaaaa2", "bbbbbbbb1"}
    assert rows["aaaaaaaa1"]["seconds"] == 95 and rows["aaaaaaaa2"]["seconds"] == 3600
    assert rows["aaaaaaaa1"]["vid"] == rows["aaaaaaaa2"]["vid"] != rows["bbbbbbbb1"]["vid"]
    assert rows["aaaaaaaa1"]["device"] == "mobile" and rows["bbbbbbbb1"]["device"] == "desktop"
    assert rows["aaaaaaaa1"]["ref"] == "www.google.com" and rows["aaaaaaaa2"]["ref"] is None
    assert "203.0.113.7" not in json.dumps(list(rows.values()))  # no raw IP stored

    from app.services import v2_stats
    now = datetime.now(timezone.utc)
    s = v2_stats.summary(now.replace(year=now.year - 1), now.replace(year=now.year + 1))
    assert s["visitors"] == 2 and s["views"] == 3 and s["mobile"] == 1
    assert s["sources"] == {"Google": 1, "ChatGPT": 1}
    assert s["avg_seconds"] == (95 + 3600) / 2


def test_daily_report_once_after_17_eastern(client, env, monkeypatch):
    from app.services import v2_outbox, v2_stats
    _hit(client, {"t": "v", "pv": "eeeeeeee1", "path": "/apostille.html", "ref": "https://www.bing.com/"})
    before = datetime(2026, 10, 16, 20, 59, tzinfo=timezone.utc)   # 16:59 EDT
    after = datetime(2026, 10, 16, 21, 1, tzinfo=timezone.utc)     # 17:01 EDT
    assert v2_stats.maybe_send(before) is False
    assert v2_stats.maybe_send(after) is True
    assert v2_stats.maybe_send(after) is False                      # once a day
    rows = db_rows(env, "SELECT recipient, subject, body_text FROM v2_outbox WHERE kind LIKE 'report.daily.%' ORDER BY id")
    assert [r["recipient"] for r in rows] == ["vitacorex2025@gmail.com", "owner@example.test"]
    assert rows[0]["subject"].startswith("[TEST][VitaCoreX] Сайт за сутки: ")
    body = rows[0]["body_text"]
    for needle in ("за сутки: с 15.10 17:00 до 16.10 17:00 (Eastern)", "Посетители:", "Время на сайте: в среднем",
                   "Откуда пришли:", "Разговоры в чате сайта: 0", "Cookies не используются"):
        assert needle in body, needle
    assert v2_outbox.process_due() == 2
    monkeypatch.setenv("VCX_DAILY_REPORT", "false")
    assert v2_stats.maybe_send(datetime(2026, 10, 17, 21, 1, tzinfo=timezone.utc)) is False


def test_source_names():
    from app.services.v2_stats import source_name
    assert source_name(None) == "напрямую или из закладок"
    assert source_name("www.google.de") == "Google" and source_name("google.com") == "Google"
    assert source_name("www.perplexity.ai") == "Perplexity" and source_name("chatgpt.com") == "ChatGPT"
    assert source_name("gemini.google.com") == "Gemini"   # before the generic Google rule
    assert source_name("yandex.ru") == "Яндекс" and source_name("t.co") == "X (Twitter)"
    assert source_name("example.org") == "example.org" and source_name("notgoogle.example") == "notgoogle.example"
