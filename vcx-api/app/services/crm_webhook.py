"""CRM Webhook Forwarder — fire-and-forget bridge to BloomlyTax VCX CRM.

Reads VCX_CRM_WEBHOOK_URL from env. If empty, all calls silently skip.
Runs in background thread — never blocks or crashes the intake flow.
"""

import logging
import os
import threading

import requests

logger = logging.getLogger("vcx.crm_webhook")

CRM_WEBHOOK_URL = os.getenv("VCX_CRM_WEBHOOK_URL", "")
CRM_WEBHOOK_SECRET = os.getenv("VCX_CRM_WEBHOOK_SECRET", "")


def forward_lead_to_crm(
    name: str,
    email: str | None = None,
    phone: str | None = None,
    service: str | None = None,
    message: str | None = None,
    source: str = "website",
    state: str | None = None,
    urgency: str | None = None,
    company: str | None = None,
) -> None:
    """POST lead data to BloomlyTax /api/vcx/email/lead. Fire-and-forget."""
    if not CRM_WEBHOOK_URL:
        logger.debug("VCX_CRM_WEBHOOK_URL not set — skipping CRM forward")
        return

    payload = {
        "name": name,
        "email": email,
        "phone": phone,
        "service": service,
        "message": message,
        "source": source,
        "state": state,
        "urgency": urgency,
        "company": company,
    }

    headers = {"Content-Type": "application/json"}
    if CRM_WEBHOOK_SECRET:
        headers["X-Webhook-Secret"] = CRM_WEBHOOK_SECRET

    def _worker():
        try:
            resp = requests.post(
                CRM_WEBHOOK_URL,
                json=payload,
                headers=headers,
                timeout=15,
            )
            if resp.ok:
                data = resp.json()
                logger.info(
                    "CRM lead forwarded: client=%s matter=%s new=%s",
                    data.get("data", {}).get("client_id"),
                    data.get("data", {}).get("matter_id"),
                    data.get("data", {}).get("new_client"),
                )
            else:
                logger.warning(
                    "CRM webhook returned %s: %s",
                    resp.status_code,
                    resp.text[:200],
                )
        except Exception:
            logger.exception("CRM webhook failed (non-fatal)")

    thread = threading.Thread(target=_worker, daemon=True)
    thread.start()
