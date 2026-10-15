"""vcx-api v2 — notification texts (owner: English; customer: en/ru/es).

Rules: no SSN/documents/tokens in subjects; owner summary <= 300 chars;
every non-production message carries a visible TEST marker.
"""

import html
import re
from urllib.parse import quote as urlquote

from . import v2_catalog
from .v2_config import api_base, is_production, parse_iso, site_base, subject_prefix

try:  # zoneinfo needs tzdata on Windows; fall back to UTC display if missing
    from zoneinfo import ZoneInfo
    _NY = ZoneInfo("America/New_York")
except Exception:  # pragma: no cover
    _NY = None

LANGUAGE_NAMES = {"en": "English", "ru": "Russian", "es": "Spanish"}

OWNER_DETAIL_KEYS = [
    "tax_year", "tax_type", "tax_state", "b2b_state", "county_court", "claim_amount",
    "entity_type_b2b", "party_role", "jurisdiction_state", "formation_state", "entity_type",
    "issuing_state", "destination_country", "signer_location", "source_language",
    "target_language", "form_number", "deadline", "entity_name", "document_number",
    "proposed_name", "filing_year", "document_type", "active_cases",
]

COMPANY_FOOTER = "VitaCoreX LLC · (888) 794-8292"


# ── helpers ───────────────────────────────────────────────────────────

def ny_time(iso_value: str) -> str:
    try:
        dt = parse_iso(iso_value)
    except (TypeError, ValueError):
        return str(iso_value)
    if _NY is None:
        return dt.strftime("%Y-%m-%d %H:%M UTC")
    local = dt.astimezone(_NY)
    return f"{local.strftime('%Y-%m-%d %H:%M %Z')} (America/New_York)"


def ny_date(iso_value: str) -> str:
    try:
        dt = parse_iso(iso_value)
    except (TypeError, ValueError):
        return str(iso_value)
    return (dt.astimezone(_NY) if _NY else dt).strftime("%Y-%m-%d")


def status_link(request_id: str, token: str) -> str:
    return f"{site_base()}/order-status.html?r={urlquote(request_id)}&t={urlquote(token)}"


def quote_link(quote_id: str, token: str) -> str:
    return f"{site_base()}/quote.html?q={urlquote(quote_id)}&t={urlquote(token)}"


def desk_link(request_id: str) -> str:
    return f"{api_base()}/owner/requests/{urlquote(request_id)}"


def _short(text, limit: int) -> str:
    text = re.sub(r"\s+", " ", str(text or "")).strip()
    return text if len(text) <= limit else text[: limit - 1].rstrip() + "…"


def text_to_html(text: str) -> str:
    parts = []
    for para in text.split("\n\n"):
        lines = []
        for line in para.split("\n"):
            esc = html.escape(line)
            esc = re.sub(r"(https?://[^\s<]+)", r'<a href="\1" style="color:#0f6f7a;">\1</a>', esc)
            lines.append(esc)
        parts.append('<p style="margin:0 0 14px;">' + "<br>".join(lines) + "</p>")
    return (
        '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;'
        'color:#10202b;max-width:640px;margin:0 auto;padding:16px;">' + "".join(parts) + "</div>"
    )


def _subject(*tags_and_ref: str) -> str:
    *tags, ref = tags_and_ref
    return f"{subject_prefix()}{''.join(f'[{t}]' for t in tags)} {ref}"


def service_name(service_id: str, locale: str) -> str:
    svc = v2_catalog.get_service(service_id)
    return v2_catalog.loc(svc.get("name"), locale) if svc else service_id


def owner_kind(req: dict) -> str:
    if req.get("lane") == "business":
        return "B2B CASE"
    return {
        "quote": "QUOTE REQUEST",
        "scope": "SCOPE REQUEST",
        "checkout": "ORDER",
        "book_checkout": "ORDER",
    }.get(req.get("next_action"), "REQUEST")


OWNER_NEXT_ACTION = {
    "quote": "Review scope and send a quote from the owner desk.",
    "scope": "Review the scope request; reply or reclassify. No charge applies.",
    "checkout": "Check eligibility; customer can pay the fixed catalog price.",
    "book_checkout": "Check eligibility; customer can pay, then agree an appointment time.",
    "b2b_review": "Check state/court eligibility, then quote or decline from the owner desk.",
}


# ── owner messages ────────────────────────────────────────────────────

def _test_banner_owner() -> list[str]:
    return [] if is_production() else ["TEST RECORD — preview environment, not a real client request.", ""]


def _owner_core(req: dict, details: dict) -> list[str]:
    lines = [
        f"Reference: {req['request_id']}",
        f"Service: {service_name(req['service_id'], 'en')} ({req['service_id']})"
        + (f" / subtype: {req['subtype']}" if req.get("subtype") else " / subtype: not specified"),
        f"Queue: {req['queue']}   Lane: {req['lane']}   Channel: {req['source_channel']}",
        f"Language: {LANGUAGE_NAMES.get(req['locale'], req['locale'])} ({req['locale']})",
        "Contact: " + ", ".join(x for x in [req.get("contact_name"), req.get("contact_email"), req.get("contact_phone")] if x),
    ]
    rel = [f"{k}: {_short(details[k], 60)}" for k in OWNER_DETAIL_KEYS if details.get(k) not in (None, "")]
    if req.get("lane") == "business" and not details.get("b2b_state"):
        rel.append("b2b_state: not given (jurisdiction REVIEW_REQUIRED)")
    if rel:
        lines.append("Details: " + "; ".join(rel))
    return lines


def owner_request_received(req: dict, details: dict, quote_state: str = "none") -> tuple[str, str, str]:
    subject = _subject("VitaCoreX", req["queue"], owner_kind(req), req["request_id"])
    lines = _test_banner_owner() + _owner_core(req, details) + [
        f"Status: {req['status']}   Quote: {quote_state}   Payment: {req['payment_status']}   Appointment: not booked",
        f"Summary: {_short(req.get('summary'), 300) or '(none)'}",
        f"Next action: {OWNER_NEXT_ACTION.get(req['next_action'], 'Review on the owner desk.')}",
        f"Owner desk: {desk_link(req['request_id'])}",
        f"Received: {ny_time(req['created_at'])}",
    ]
    text = "\n".join(lines)
    return subject, text, text_to_html(text)


def owner_paid(req: dict, details: dict, order_id: str, amount_cents: int, quote_label: str) -> tuple[str, str, str]:
    subject = _subject("VitaCoreX", req["queue"], "PAID", req["request_id"])
    lines = _test_banner_owner() + _owner_core(req, details) + [
        f"Order: {order_id}   Amount: {v2_catalog.money_text(amount_cents, 'en')} (verified provider event)",
        f"Quote: {quote_label}   Payment: PAID   Appointment: not booked",
        "Next action: Confirm requirements with the customer and start the order.",
        f"Owner desk: {desk_link(req['request_id'])}",
        f"Received: {ny_time(req['created_at'])}",
    ]
    text = "\n".join(lines)
    return subject, text, text_to_html(text)


def owner_payment_exception(req: dict, code: str, detail: str, at_iso: str) -> tuple[str, str, str]:
    subject = _subject("VitaCoreX", "PAYMENT_EXCEPTION", "PAYMENT EXCEPTION", req["request_id"])
    lines = _test_banner_owner() + [
        f"Reference: {req['request_id']}",
        f"Service: {service_name(req['service_id'], 'en')} ({req['service_id']})",
        f"Exception: {code}",
        f"Detail: {_short(detail, 300)}",
        f"Payment: {req['payment_status']}   Status: {req['status']}",
        "Next action: Review the payment on the owner desk and resolve (refund or fulfil).",
        f"Owner desk: {desk_link(req['request_id'])}",
        f"Detected: {ny_time(at_iso)}",
    ]
    text = "\n".join(lines)
    return subject, text, text_to_html(text)


# ── customer messages (localized) ─────────────────────────────────────

CUSTOMER_NEXT = {
    "en": {
        "quote": "We will review your request and send you a written quote with the scope and price. Nothing is charged until you accept a quote.",
        "scope": "We will review what you need and reply with the scope we can offer. Sending a request is free and does not create an engagement.",
        "checkout": "You can complete payment from the status page. Work starts after the payment is confirmed and your details are checked.",
        "book_checkout": "You can complete payment from the status page. We will then agree on a time with you; an appointment counts as confirmed only after you receive a separate confirmation.",
        "b2b_review": "We will check the state, court and claim details and reply with what we can do and a quote.",
    },
    "ru": {
        "quote": "Мы изучим заявку и пришлём письменную смету с объёмом работ и ценой. Оплата не списывается, пока вы не примете смету.",
        "scope": "Мы разберёмся, что вам нужно, и ответим, в каком объёме можем помочь. Отправка заявки бесплатна и не означает заключения договора.",
        "checkout": "Оплатить заказ можно на странице статуса. Работа начинается после подтверждения оплаты и проверки данных.",
        "book_checkout": "Оплатить можно на странице статуса. Затем мы согласуем с вами время; встреча считается подтверждённой только после отдельного письма-подтверждения.",
        "b2b_review": "Мы проверим штат, суд и данные по требованию и ответим, чем можем помочь, вместе со сметой.",
    },
    "es": {
        "quote": "Revisaremos su solicitud y le enviaremos un presupuesto por escrito con el alcance y el precio. No se cobra nada hasta que usted acepte el presupuesto.",
        "scope": "Revisaremos lo que necesita y le responderemos con el alcance que podemos ofrecer. Enviar la solicitud es gratis y no crea un compromiso de servicio.",
        "checkout": "Puede completar el pago desde la página de estado. El trabajo comienza cuando se confirma el pago y se revisan sus datos.",
        "book_checkout": "Puede completar el pago desde la página de estado. Después acordaremos la hora con usted; la cita solo queda confirmada cuando reciba una confirmación aparte.",
        "b2b_review": "Revisaremos el estado, el tribunal y los datos del reclamo y le responderemos con lo que podemos hacer y un presupuesto.",
    },
}

T = {
    "en": {
        "test": "TEST MESSAGE — sent from a preview environment. Nothing has been booked or charged.",
        "hello": "Hello {name},",
        "received_subject": "VitaCoreX — we received your request {ref}",
        "received_intro": "Thank you — your request has been recorded.",
        "ref": "Reference", "service": "Service", "status": "Status", "status_received": "received",
        "next": "What happens next:",
        "status_here": "You can check the status here:",
        "no_sensitive": "Please do not send Social Security numbers, tax forms, ID documents or bank details by email or through the website form. If documents are needed, we will send you a secure link.",
        "not_you": "If you did not send this request, you can ignore this email.",
        "quote_subject": "VitaCoreX — your quote for request {ref}",
        "quote_intro": "We have prepared a quote for your request {ref}.",
        "amount": "Amount", "scope": "Scope", "external": "External costs", "external_none": "none listed",
        "valid_until": "Valid until", "ny": "(New York time)", "revision": "Revision",
        "quote_here": "Review and accept the quote here:",
        "quote_nocharge": "Nothing is charged until you accept the quote and complete payment.",
        "paid_subject": "VitaCoreX — payment received for request {ref}",
        "paid_intro": "We have received your payment of {amount} for “{service}”.",
        "order": "Order number",
        "paid_next": "Next, our team will check your details and contact you about the next step.",
    },
    "ru": {
        "test": "ТЕСТОВОЕ ПИСЬМО — отправлено из тестовой среды. Ничего не забронировано и не оплачено.",
        "hello": "Здравствуйте, {name}!",
        "received_subject": "VitaCoreX — заявка {ref} получена",
        "received_intro": "Спасибо, ваша заявка зарегистрирована.",
        "ref": "Номер заявки", "service": "Услуга", "status": "Статус", "status_received": "получена",
        "next": "Что дальше:",
        "status_here": "Статус заявки можно посмотреть здесь:",
        "no_sensitive": "Пожалуйста, не присылайте номер SSN, налоговые формы, документы, удостоверяющие личность, и банковские реквизиты по email или через форму сайта. Если понадобятся документы, мы пришлём защищённую ссылку.",
        "not_you": "Если вы не отправляли эту заявку, просто проигнорируйте это письмо.",
        "quote_subject": "VitaCoreX — смета по заявке {ref}",
        "quote_intro": "Мы подготовили смету по вашей заявке {ref}.",
        "amount": "Сумма", "scope": "Объём работ", "external": "Внешние расходы", "external_none": "не указаны",
        "valid_until": "Действует до", "ny": "(по времени Нью-Йорка)", "revision": "Версия сметы",
        "quote_here": "Посмотреть и принять смету можно здесь:",
        "quote_nocharge": "Оплата не списывается, пока вы не примете смету и не оплатите заказ.",
        "paid_subject": "VitaCoreX — оплата по заявке {ref} получена",
        "paid_intro": "Мы получили вашу оплату {amount} за услугу «{service}».",
        "order": "Номер заказа",
        "paid_next": "Дальше мы проверим ваши данные и свяжемся с вами по следующему шагу.",
    },
    "es": {
        "test": "MENSAJE DE PRUEBA: enviado desde un entorno de vista previa. No se ha reservado ni cobrado nada.",
        "hello": "Hola, {name}:",
        "received_subject": "VitaCoreX — hemos recibido su solicitud {ref}",
        "received_intro": "Gracias. Hemos registrado su solicitud.",
        "ref": "Referencia", "service": "Servicio", "status": "Estado", "status_received": "recibida",
        "next": "Próximos pasos:",
        "status_here": "Puede consultar el estado aquí:",
        "no_sensitive": "Por favor, no envíe números de Seguro Social, formularios fiscales, documentos de identidad ni datos bancarios por correo electrónico ni a través del formulario del sitio web. Si se necesitan documentos, le enviaremos un enlace seguro.",
        "not_you": "Si usted no envió esta solicitud, puede ignorar este correo.",
        "quote_subject": "VitaCoreX — su presupuesto para la solicitud {ref}",
        "quote_intro": "Hemos preparado un presupuesto para su solicitud {ref}.",
        "amount": "Importe", "scope": "Alcance", "external": "Costos externos", "external_none": "ninguno indicado",
        "valid_until": "Válido hasta", "ny": "(hora de Nueva York)", "revision": "Revisión",
        "quote_here": "Revise y acepte el presupuesto aquí:",
        "quote_nocharge": "No se cobra nada hasta que acepte el presupuesto y complete el pago.",
        "paid_subject": "VitaCoreX — hemos recibido el pago de la solicitud {ref}",
        "paid_intro": "Hemos recibido su pago de {amount} por el servicio «{service}».",
        "order": "Número de pedido",
        "paid_next": "A continuación revisaremos sus datos y nos pondremos en contacto con usted para el siguiente paso.",
    },
}


def _t(locale: str) -> dict:
    return T.get(locale, T["en"])


def _customer_subject(text: str) -> str:
    prefix = subject_prefix()
    return f"{prefix} {text}" if prefix else text


def _customer_wrap(locale: str, body_lines: list[str]) -> str:
    t = _t(locale)
    head = [] if is_production() else [t["test"], ""]
    return "\n".join(head + body_lines + ["", COMPANY_FOOTER])


def customer_request_received(req: dict) -> tuple[str, str, str]:
    lc = req["locale"]
    t = _t(lc)
    nxt = CUSTOMER_NEXT.get(lc, CUSTOMER_NEXT["en"]).get(req["next_action"], CUSTOMER_NEXT["en"]["quote"])
    lines = [
        t["hello"].format(name=req["contact_name"]), "",
        t["received_intro"], "",
        f"{t['ref']}: {req['request_id']}",
        f"{t['service']}: {service_name(req['service_id'], lc)}",
        f"{t['status']}: {t['status_received']}", "",
        t["next"], nxt, "",
        t["status_here"], status_link(req["request_id"], req["access_token"]), "",
        t["no_sensitive"], "",
        t["not_you"],
    ]
    text = _customer_wrap(lc, lines)
    return _customer_subject(t["received_subject"].format(ref=req["request_id"])), text, text_to_html(text)


def customer_quote_sent(req: dict, quote: dict) -> tuple[str, str, str]:
    lc = req["locale"]
    t = _t(lc)
    lines = [
        t["hello"].format(name=req["contact_name"]), "",
        t["quote_intro"].format(ref=req["request_id"]), "",
        f"{t['service']}: {service_name(req['service_id'], lc)}",
        f"{t['amount']}: {v2_catalog.money_text(quote['amount_cents'], lc)}",
        f"{t['scope']}: {quote['scope_text']}",
        f"{t['external']}: {quote.get('external_costs_text') or t['external_none']}",
        f"{t['valid_until']}: {ny_date(quote['expires_at'])} {t['ny']}",
        f"{t['revision']}: {quote['revision']}", "",
        t["quote_here"], quote_link(quote["quote_id"], req["access_token"]), "",
        t["quote_nocharge"], "",
        t["no_sensitive"],
    ]
    text = _customer_wrap(lc, lines)
    return _customer_subject(t["quote_subject"].format(ref=req["request_id"])), text, text_to_html(text)


def customer_paid(req: dict, order_id: str, amount_cents: int) -> tuple[str, str, str]:
    lc = req["locale"]
    t = _t(lc)
    lines = [
        t["hello"].format(name=req["contact_name"]), "",
        t["paid_intro"].format(amount=v2_catalog.money_text(amount_cents, lc), service=service_name(req["service_id"], lc)), "",
        f"{t['ref']}: {req['request_id']}",
        f"{t['order']}: {order_id}", "",
        t["paid_next"], "",
        t["status_here"], status_link(req["request_id"], req["access_token"]), "",
        t["no_sensitive"],
    ]
    text = _customer_wrap(lc, lines)
    return _customer_subject(t["paid_subject"].format(ref=req["request_id"])), text, text_to_html(text)


# ── voice ─────────────────────────────────────────────────────────────

VOICE_NEXT = {
    "en": {
        "quote": "Your request is recorded. Your reference is {ref}. A team member will review it and send you a written quote. Nothing has been booked or charged.",
        "scope": "Your request is recorded. Your reference is {ref}. We will review it and get back to you. Sending a request is free. Nothing has been booked.",
        "checkout": "Your request is recorded. Your reference is {ref}. We will send you a secure link to complete payment. Nothing has been charged yet.",
        "book_checkout": "Your request is recorded. Your reference is {ref}. We will send you a secure link to pay and then agree on a time. No appointment is booked yet.",
        "b2b_review": "Your request is recorded. Your reference is {ref}. We will check the state and court details and get back to you with a quote. Nothing has been booked or charged.",
    },
    "ru": {
        "quote": "Заявка зарегистрирована. Номер заявки: {ref}. Специалист её изучит и пришлёт письменную смету. Ничего не забронировано и не оплачено.",
        "scope": "Заявка зарегистрирована. Номер заявки: {ref}. Мы её изучим и свяжемся с вами. Отправка заявки бесплатна. Ничего не забронировано.",
        "checkout": "Заявка зарегистрирована. Номер заявки: {ref}. Мы пришлём защищённую ссылку для оплаты. Пока ничего не списано.",
        "book_checkout": "Заявка зарегистрирована. Номер заявки: {ref}. Мы пришлём защищённую ссылку для оплаты, а затем согласуем время. Встреча пока не назначена.",
        "b2b_review": "Заявка зарегистрирована. Номер заявки: {ref}. Мы проверим штат и суд и вернёмся к вам со сметой. Ничего не забронировано и не оплачено.",
    },
    "es": {
        "quote": "Su solicitud quedó registrada. Su referencia es {ref}. Un miembro del equipo la revisará y le enviará un presupuesto por escrito. No se ha reservado ni cobrado nada.",
        "scope": "Su solicitud quedó registrada. Su referencia es {ref}. La revisaremos y nos pondremos en contacto con usted. Enviar la solicitud es gratis. No se ha reservado nada.",
        "checkout": "Su solicitud quedó registrada. Su referencia es {ref}. Le enviaremos un enlace seguro para completar el pago. Todavía no se ha cobrado nada.",
        "book_checkout": "Su solicitud quedó registrada. Su referencia es {ref}. Le enviaremos un enlace seguro para pagar y luego acordaremos la hora. Todavía no hay ninguna cita reservada.",
        "b2b_review": "Su solicitud quedó registrada. Su referencia es {ref}. Revisaremos el estado y el tribunal y le responderemos con un presupuesto. No se ha reservado ni cobrado nada.",
    },
}

VOICE_ERRORS = {
    "sensitive_data": {
        "en": "For your security, please don't share Social Security or card numbers by phone. We will send a secure link if anything like that is needed.",
        "ru": "Ради вашей безопасности, пожалуйста, не называйте по телефону номер SSN или номер карты. Если это понадобится, мы пришлём защищённую ссылку.",
        "es": "Por su seguridad, no comparta por teléfono números de Seguro Social ni de tarjeta. Si hiciera falta, le enviaremos un enlace seguro.",
    },
    "jurisdiction_excluded": {
        "en": "I'm sorry, we don't offer this business small-claims service for New York.",
        "ru": "К сожалению, эту услугу по small claims для компаний мы не оказываем в штате Нью-Йорк.",
        "es": "Lo siento, no ofrecemos este servicio de small claims para empresas en Nueva York.",
    },
}


def spoken_reference(request_id: str) -> str:
    code = request_id.split("-")[-1]
    return " ".join(code)


def voice_next_step(next_action: str, request_id: str, locale: str) -> str:
    table = VOICE_NEXT.get(locale, VOICE_NEXT["en"])
    return table.get(next_action, table["quote"]).format(ref=spoken_reference(request_id))
