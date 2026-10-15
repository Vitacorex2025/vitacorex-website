"""vcx-api v2 — durable notification outbox + background worker.

Delivery states: PENDING -> SENDING -> ACCEPTED (SMTP accepted) or
ACCEPTED_BY_SINK (TEST .eml sink); failures -> FAILED with exponential backoff
(30s, 2m, 10m, 30m, 2h) and DEAD after the max attempt count, which emits a
notification.failed event and opens a desk exception. "Accepted" never means
"delivered to a human".
"""

import logging
import re
import smtplib
import threading
from datetime import timedelta
from email.header import Header
from email.message import EmailMessage
from email.utils import format_datetime, make_msgid

from ..db import get_conn
from . import v2_store
from .v2_config import (
    from_email, is_production, iso, mail_sink_dir, now_iso, outbox_max_attempts,
    outbox_worker_enabled, smtp_settings, utcnow, vcx_env,
)

logger = logging.getLogger("vcx.v2.outbox")

BACKOFF_SECONDS = [30, 120, 600, 1800, 7200]
STALE_SENDING_SECONDS = 600
POLL_SECONDS = 5

_sender_override = None
_wake = threading.Event()
_stop = threading.Event()
_thread: threading.Thread | None = None


class DeliveryError(Exception):
    pass


def set_sender_override(sender) -> None:
    """Tests only: sender(row) -> (status, provider_ref) or raise."""
    global _sender_override
    _sender_override = sender


def _build_message(row: dict) -> EmailMessage:
    msg = EmailMessage()
    msg["From"] = from_email()
    msg["To"] = row["recipient"]
    _set_subject(msg, row["subject"])
    msg["Date"] = format_datetime(utcnow())
    msg["Message-ID"] = make_msgid(domain="vitacorexllc.com")
    msg["X-VCX-Env"] = vcx_env()
    msg["X-VCX-Outbox-Id"] = str(row["id"])
    if not is_production():
        msg["X-VCX-Test"] = "true"
    msg.set_content(row["body_text"])
    if row.get("body_html"):
        msg.add_alternative(row["body_html"], subtype="html")
    return msg


def _set_subject(msg: EmailMessage, subject: str) -> None:
    # The default folder can put an encoded space right after a fold ("…{ref}\n =?utf-8?q?_?=…"),
    # which mail clients show as a double space. Non-ASCII subjects are encoded whole instead:
    # RFC 2047 words of at most 75 characters, folded between words, decoded back exactly.
    if subject.isascii():
        msg["Subject"] = subject
    else:
        msg.set_raw("Subject", Header(subject, "utf-8", header_name="Subject").encode())


def _send_smtp(row: dict, cfg: dict) -> tuple[str, str]:
    msg = _build_message(row)
    try:
        with smtplib.SMTP(cfg["host"], cfg["port"], timeout=20) as server:
            server.ehlo()
            if cfg["port"] != 25:
                server.starttls()
                server.ehlo()
            server.login(cfg["user"], cfg["password"])
            refused = server.send_message(msg)
    except (smtplib.SMTPException, OSError) as exc:
        raise DeliveryError(f"smtp_error:{type(exc).__name__}") from exc
    if refused:
        raise DeliveryError("smtp_recipient_refused")
    return "ACCEPTED", str(msg["Message-ID"])


def _send_sink(row: dict) -> tuple[str, str]:
    if is_production():
        raise DeliveryError("sink_disabled_in_production")
    sink = mail_sink_dir()
    try:
        sink.mkdir(parents=True, exist_ok=True)
        stamp = utcnow().strftime("%Y%m%dT%H%M%SZ")
        kind = re.sub(r"[^a-z0-9_.-]", "_", row["kind"].lower())
        name = f"TEST_{stamp}_{row['id']:06d}_{kind}.eml"
        (sink / name).write_bytes(_build_message(row).as_bytes())
    except OSError as exc:
        raise DeliveryError(f"sink_write_failed:{type(exc).__name__}") from exc
    return "ACCEPTED_BY_SINK", name


def send(row: dict) -> tuple[str, str]:
    if _sender_override is not None:
        return _sender_override(row)
    if not row.get("recipient"):
        raise DeliveryError("recipient_not_configured")
    cfg = smtp_settings()
    if cfg:
        return _send_smtp(row, cfg)
    if is_production():
        raise DeliveryError("smtp_not_configured")
    return _send_sink(row)


def _claim(conn, row_id: int) -> bool:
    cur = conn.execute(
        "UPDATE v2_outbox SET status='SENDING', updated_at=? WHERE id=? AND status IN ('PENDING','FAILED')",
        (now_iso(), row_id))
    return cur.rowcount == 1


def _record_dead(conn, row: dict, error: str) -> None:
    req = v2_store._fetch_request(conn, row["request_id"]) if row.get("request_id") else None
    v2_store.add_event(conn, "notification.failed", req, actor="system",
                       correlation_id=row["event_id"],
                       data={"outbox_id": row["id"], "kind": row["kind"], "audience": row["audience"],
                             "attempts": row["attempts"] + 1, "last_error": error[:200]})
    queue = "PAYMENT_EXCEPTION" if "paid" in row["kind"] or "payment" in row["kind"] else "OPS"
    v2_store.add_exception(conn, queue, "NOTIFICATION_DEAD", row.get("request_id"), f"outbox:{row['id']}",
                           f"{row['kind']} to {row['audience']} failed after {row['attempts'] + 1} attempts: {error[:200]}")


def deliver(row: dict) -> str:
    """Attempt one delivery of a claimed row; returns the resulting status."""
    try:
        status, ref = send(row)
        with get_conn() as conn:
            conn.execute(
                "UPDATE v2_outbox SET status=?, attempts=attempts+1, provider_ref=?, last_error=NULL, updated_at=?"
                " WHERE id=?", (status, ref, now_iso(), row["id"]))
        return status
    except Exception as exc:  # any failure is retried, never raised to callers
        error = str(exc) if isinstance(exc, DeliveryError) else f"error:{type(exc).__name__}"
        attempts = row["attempts"] + 1
        with get_conn() as conn:
            if attempts >= outbox_max_attempts():
                conn.execute("UPDATE v2_outbox SET status='DEAD', attempts=?, last_error=?, updated_at=? WHERE id=?",
                             (attempts, error[:300], now_iso(), row["id"]))
                _record_dead(conn, row, error)
                logger.warning("outbox %s DEAD after %s attempts (%s)", row["id"], attempts, row["kind"])
                return "DEAD"
            delay = BACKOFF_SECONDS[min(attempts - 1, len(BACKOFF_SECONDS) - 1)]
            conn.execute(
                "UPDATE v2_outbox SET status='FAILED', attempts=?, last_error=?, next_attempt_at=?, updated_at=?"
                " WHERE id=?", (attempts, error[:300], iso(utcnow() + timedelta(seconds=delay)), now_iso(), row["id"]))
        return "FAILED"


def recover_stale() -> int:
    cutoff = iso(utcnow() - timedelta(seconds=STALE_SENDING_SECONDS))
    with get_conn() as conn:
        cur = conn.execute(
            "UPDATE v2_outbox SET status='FAILED', last_error='stale_sending_recovered', updated_at=?"
            " WHERE status='SENDING' AND updated_at<?", (now_iso(), cutoff))
        return cur.rowcount


def process_due(now_override: str | None = None, limit: int = 25) -> int:
    """Deliver every due row once. Returns number of rows attempted."""
    now = now_override or now_iso()
    with get_conn() as conn:
        rows = [dict(r) for r in conn.execute(
            "SELECT * FROM v2_outbox WHERE status IN ('PENDING','FAILED') AND next_attempt_at<=?"
            " ORDER BY id LIMIT ?", (now, limit)).fetchall()]
    done = 0
    for row in rows:
        with get_conn() as conn:
            if not _claim(conn, row["id"]):
                continue
        deliver(row)
        done += 1
    return done


def _loop():
    recover_stale()
    while not _stop.is_set():
        try:
            recover_stale()
            process_due()
        except Exception:  # pragma: no cover - keep the worker alive
            logger.exception("outbox worker iteration failed")
        _wake.wait(POLL_SECONDS)
        _wake.clear()


def kick() -> None:
    _wake.set()


def start_worker() -> None:
    global _thread
    if not outbox_worker_enabled() or (_thread and _thread.is_alive()):
        return
    _stop.clear()
    _thread = threading.Thread(target=_loop, name="vcx-v2-outbox", daemon=True)
    _thread.start()


def stop_worker() -> None:
    _stop.set()
    _wake.set()
    if _thread:
        _thread.join(timeout=5)
