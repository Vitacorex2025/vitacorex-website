"""Email notification service — SMTP-based, fire-and-forget.

Phase 4A: All email functions log failures but NEVER raise exceptions.
Missing SMTP config => warning log, email skipped silently.
"""

import logging
import os
import smtplib
import threading
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger("vcx.email")

# --- Configuration -------------------------------------------------------

SMTP_HOST = os.getenv("VCX_SMTP_HOST", "")
SMTP_PORT = int(os.getenv("VCX_SMTP_PORT", "587"))
SMTP_USER = os.getenv("VCX_SMTP_USER", "")
SMTP_PASS = os.getenv("VCX_SMTP_PASS", "")
ADMIN_EMAIL = os.getenv("VCX_ADMIN_EMAIL", "")
FROM_EMAIL = os.getenv("VCX_FROM_EMAIL", "noreply@vitacorexllc.com")
BASE_URL = os.getenv("VCX_BASE_URL", "https://vitacorexllc.com")


# --- Internal helpers ----------------------------------------------------

def _smtp_configured() -> bool:
    """Return True if all required SMTP credentials are set."""
    return bool(SMTP_HOST and SMTP_USER and SMTP_PASS)


def _send_email(to: str, subject: str, body_html: str, body_text: str = ""):
    """Send an email via SMTP in a background thread. Never raises."""
    if not _smtp_configured():
        logger.warning(
            "SMTP not configured — skipping email to %s: %s", to, subject
        )
        return

    def _worker():
        try:
            msg = MIMEMultipart("alternative")
            msg["From"] = FROM_EMAIL
            msg["To"] = to
            msg["Subject"] = subject

            if body_text:
                msg.attach(MIMEText(body_text, "plain"))
            msg.attach(MIMEText(body_html, "html"))

            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
                server.ehlo()
                if SMTP_PORT != 25:
                    server.starttls()
                    server.ehlo()
                server.login(SMTP_USER, SMTP_PASS)
                server.send_message(msg)

            logger.info("Email sent to %s: %s", to, subject)
        except Exception:
            logger.exception("Failed to send email to %s: %s", to, subject)

    thread = threading.Thread(target=_worker, daemon=True)
    thread.start()


def _esc(s) -> str:
    """Escape HTML entities."""
    return (
        str(s or "")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def _format_status(status: str) -> str:
    """Format status string for display: 'under_review' -> 'Under Review'."""
    return (status or "unknown").replace("_", " ").title()


# --- Public email functions ----------------------------------------------


def send_client_intake_confirmation(
    to_email: str,
    client_name: str,
    matter_id: str,
    magic_link: str,
    next_step: str,
):
    """Send confirmation email to client after intake submission."""
    subject = f"VitaCoreX — Matter {matter_id} Received"
    body_html = f"""\
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h2 style="color:#173A63;margin-bottom:16px;">Matter Received</h2>
  <p>Dear {_esc(client_name)},</p>
  <p>Your intake has been received and assigned matter number
     <strong>{_esc(matter_id)}</strong>.</p>
  <p><strong>Next step:</strong> {_esc(next_step)}</p>
  <div style="margin:24px 0;padding:16px 20px;background:#EEF6F5;border-radius:8px;">
    <p style="margin:0 0 8px;font-weight:600;">Your Secure Status Page</p>
    <p style="margin:0 0 10px;font-size:14px;color:#5E6C7B;">
      Bookmark this link to check your matter status and upload documents.
    </p>
    <a href="{_esc(magic_link)}"
       style="color:#173A63;word-break:break-all;">{_esc(magic_link)}</a>
  </div>
  <p style="font-size:13px;color:#5E6C7B;">
    If you did not submit this intake, please disregard this email.
  </p>
  <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;">
  <p style="font-size:12px;color:#999;">
    VitaCoreX LLC | (888) 794-8292 | vitacorexllc@gmail.com
  </p>
</div>"""
    body_text = (
        f"Dear {client_name},\n\n"
        f"Your intake has been received. Matter ID: {matter_id}\n"
        f"Next step: {next_step}\n\n"
        f"Secure status page: {magic_link}\n\n"
        f"VitaCoreX LLC | (888) 794-8292"
    )
    _send_email(to_email, subject, body_html, body_text)


def send_admin_intake_notification(
    client_name: str,
    client_email: str,
    matter_id: str,
    service_type: str,
    triage_score: int,
):
    """Send admin notification of new intake submission."""
    if not ADMIN_EMAIL:
        logger.warning(
            "VCX_ADMIN_EMAIL not set — skipping admin notification for %s",
            matter_id,
        )
        return

    subject = f"[VCX Intake] New matter {matter_id} — Score {triage_score}"
    body_html = f"""\
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h2 style="color:#173A63;margin-bottom:16px;">New Intake Submission</h2>
  <table style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">
        Matter ID</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">
        {_esc(matter_id)}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">
        Client</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">
        {_esc(client_name)} ({_esc(client_email)})</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">
        Service</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">
        {_esc(service_type)}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">
        Triage Score</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">
        {triage_score}/100</td>
    </tr>
  </table>
  <p style="margin-top:20px;">
    <a href="{BASE_URL}/app/review/" style="color:#173A63;">Open Review Queue</a>
  </p>
</div>"""
    _send_email(ADMIN_EMAIL, subject, body_html)


def send_status_change_notification(
    to_email: str,
    client_name: str,
    matter_id: str,
    old_status: str,
    new_status: str,
    note: str = "",
):
    """Send email to client when matter status changes."""
    subject = f"VitaCoreX — Matter {matter_id} Status Update"

    note_block = ""
    if note:
        note_block = (
            f'<p style="margin:12px 0;padding:12px 16px;background:#EEF6F5;'
            f'border-radius:6px;font-size:14px;">{_esc(note)}</p>'
        )

    body_html = f"""\
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h2 style="color:#173A63;margin-bottom:16px;">Status Update</h2>
  <p>Dear {_esc(client_name)},</p>
  <p>Your matter <strong>{_esc(matter_id)}</strong> has been updated:</p>
  <div style="margin:16px 0;padding:16px;border:1px solid #e0e0e0;border-radius:8px;">
    <p style="margin:0;font-size:14px;color:#5E6C7B;">
      Previous: <strong>{_esc(_format_status(old_status))}</strong></p>
    <p style="margin:8px 0 0;font-size:16px;color:#173A63;">
      New status: <strong>{_esc(_format_status(new_status))}</strong></p>
  </div>
  {note_block}
  <p style="font-size:13px;color:#5E6C7B;">
    Log in to your
    <a href="{BASE_URL}/app/sign-in/" style="color:#173A63;">client portal</a>
    to view full details.
  </p>
  <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;">
  <p style="font-size:12px;color:#999;">
    VitaCoreX LLC | (888) 794-8292 | vitacorexllc@gmail.com
  </p>
</div>"""
    body_text = (
        f"Dear {client_name},\n\n"
        f"Matter {matter_id} status update:\n"
        f"  {_format_status(old_status)} -> {_format_status(new_status)}\n"
        + (f"Note: {note}\n" if note else "")
        + f"\nVitaCoreX LLC | (888) 794-8292"
    )
    _send_email(to_email, subject, body_html, body_text)


OWNER_EMAIL = os.getenv("VCX_OWNER_EMAIL", "stevenmiller@vitacorexllc.com")


def send_owner_lead_notification(
    name: str,
    email: str,
    phone: str,
    service: str,
    message: str,
    matter_id: str = "",
    urgency: str = "",
    state: str = "",
):
    """Send full lead details to the business owner. Fire-and-forget."""
    to = OWNER_EMAIL
    if not to:
        logger.warning("VCX_OWNER_EMAIL not set — skipping owner notification")
        return

    subject = f"[VCX] New Lead: {name} — {service}"
    body_html = f"""\
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h2 style="color:#173A63;margin-bottom:16px;">New Website Lead</h2>
  <table style="width:100%;border-collapse:collapse;">
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">Name</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">{_esc(name)}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">Email</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">
        <a href="mailto:{_esc(email)}">{_esc(email)}</a></td>
    </tr>
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">Phone</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">
        <a href="tel:{_esc(phone)}">{_esc(phone)}</a></td>
    </tr>
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">Service</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">{_esc(service)}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">Urgency</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">{_esc(urgency)}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">State</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">{_esc(state)}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;">Matter</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">{_esc(matter_id)}</td>
    </tr>
  </table>
  <div style="margin:20px 0;padding:16px;background:#EEF6F5;border-radius:8px;">
    <p style="margin:0 0 8px;font-weight:600;">Client Message</p>
    <p style="margin:0;white-space:pre-wrap;">{_esc(message)}</p>
  </div>
  <p style="font-size:12px;color:#999;margin-top:24px;">
    Auto-generated by VitaCoreX intake system.
  </p>
</div>"""
    body_text = (
        f"New Lead: {name}\n"
        f"Email: {email}\nPhone: {phone}\n"
        f"Service: {service}\nUrgency: {urgency}\nState: {state}\n"
        f"Matter: {matter_id}\n\n"
        f"Message:\n{message}"
    )
    _send_email(to, subject, body_html, body_text)


def send_portal_access_link(to_email: str, portal_link: str):
    """Send portal access link to client."""
    subject = "VitaCoreX — Your Portal Access Link"
    body_html = f"""\
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
  <h2 style="color:#173A63;margin-bottom:16px;">Portal Access</h2>
  <p>You requested access to the VitaCoreX client portal.</p>
  <div style="margin:24px 0;text-align:center;">
    <a href="{_esc(portal_link)}"
       style="display:inline-block;padding:14px 32px;background:#173A63;
              color:#fff;border-radius:8px;text-decoration:none;
              font-weight:600;">Access Your Portal</a>
  </div>
  <p style="font-size:13px;color:#5E6C7B;">
    This link expires in 24 hours. If you did not request this, please disregard.
  </p>
  <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;">
  <p style="font-size:12px;color:#999;">
    VitaCoreX LLC | (888) 794-8292 | vitacorexllc@gmail.com
  </p>
</div>"""
    body_text = (
        "You requested portal access.\n\n"
        f"Access your portal: {portal_link}\n\n"
        "This link expires in 24 hours.\n\n"
        "VitaCoreX LLC | (888) 794-8292"
    )
    _send_email(to_email, subject, body_html, body_text)
