"""vcx-api v2 — owner desk (server-rendered HTML) and owner JSON actions.

Auth: header X-Admin-Token or the HttpOnly SameSite=Strict session cookie set
by /owner/login. VCX_ADMIN_TOKEN unset -> 503 everywhere. Cookie-authenticated
writes also require a same-origin request and a CSRF token.
"""

import html
import json
from datetime import datetime, timedelta, timezone
from urllib.parse import quote as urlquote, urlencode

from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse

from ..rate_limit import limiter
from ..services import v2_auth, v2_catalog, v2_messages, v2_store
from ..services.v2_auth import COOKIE_NAME, AuthError
from ..services.v2_catalog import CatalogError
from ..services.v2_config import is_production, vcx_env
from ..services.v2_store import OWNER_TRANSITIONS, PAYMENT_STATUSES, REQUEST_STATUSES, StoreError
from ..services.v2_validation import contains_sensitive

router = APIRouter(tags=["v2-owner"])

e = html.escape

DESK_HEADERS = {
    "Cache-Control": "no-store",
    "X-Frame-Options": "DENY",
    "X-Robots-Tag": "noindex, nofollow",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; "
                               "frame-ancestors 'none'; base-uri 'none'",
}

QUEUES = ["TAX", "B2B_SMALL_CLAIMS", "DOCUMENTS_LEGAL_TOPIC", "TRANSLATION_NOTARY_APOSTILLE",
          "FORMATION_BUSINESS_PLAN", "GENERAL_TRIAGE", "EXISTING_CLIENT_RECOVERY"]

NEXT_STEP_SHORT = {
    "quote": "Send quote", "scope": "Review scope", "checkout": "Await payment",
    "book_checkout": "Await payment + time", "b2b_review": "B2B eligibility review",
}

FLASH = {
    "status_updated": "Status updated.", "quote_created": "Quote revision created and queued to the customer.",
    "reclassified": "Request reclassified (audit trail recorded).", "resolved": "Exception resolved.",
    "invalid_transition": "That status change is not allowed from the current state.",
    "locked_scope": "Scope is locked (accepted quote or payment). Not changed.",
    "referral_consent_missing": "Customer did not consent to referral.",
    "validation": "Some fields are invalid.", "unknown_service": "Unknown service.",
    "jurisdiction_excluded": "B2B small-claims service is excluded for NY.",
    "sensitive_data": "Text looks like it contains an SSN or card number. Not saved.",
    "not_found": "Not found.",
}

try:
    from zoneinfo import ZoneInfo
    _NY = ZoneInfo("America/New_York")
except Exception:  # pragma: no cover
    _NY = timezone.utc


# ── helpers ───────────────────────────────────────────────────────────

def _err(exc) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content=exc.body, headers={"Cache-Control": "no-store"})


def _page(title: str, body: str, status: int = 200, authed: bool = True, csrf: str = "") -> HTMLResponse:
    env_tag = "" if is_production() else f'<span class="tag tag-test">TEST · {e(vcx_env())}</span>'
    logout = (f'<form method="post" action="/owner/logout" class="inline"><input type="hidden" name="csrf" '
              f'value="{e(csrf)}"><button class="link" type="submit">Log out</button></form>') if authed and csrf else ""
    doc = f"""<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>{e(title)} · VitaCoreX owner desk</title><style>{CSS}</style></head><body>
<header><a class="brand" href="/owner">VitaCoreX · Owner desk</a><div class="hdr-right">{env_tag}{logout}</div></header>
<main>{body}</main></body></html>"""
    return HTMLResponse(doc, status_code=status, headers=DESK_HEADERS)


CSS = """
:root{--bg:#f2f6f9;--card:#fff;--ink:#0f1c26;--muted:#4a5b68;--line:#d3dfe8;--head:#0f2a3a;--accent:#136f79;
--accent-soft:#e3f4f6;--edge:#2BB3C0;--warn:#b42318;--warn-soft:#fdecea;--ok:#146c43;--ok-soft:#e6f4ec}
*{box-sizing:border-box}
body{margin:0;font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;background:var(--bg);color:var(--ink)}
header{background:var(--head);color:#fff;padding:12px 24px;display:flex;justify-content:space-between;align-items:center;
border-bottom:3px solid var(--edge)}
header a.brand{color:#fff;text-decoration:none;font-weight:700;font-size:18px}
.hdr-right{display:flex;gap:12px;align-items:center}
main{max-width:1320px;margin:0 auto;padding:20px 24px 48px}
h1{font-size:24px;margin:4px 0 16px} h2{font-size:19px;margin:28px 0 10px}
a{color:var(--accent)}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin-bottom:16px}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden}
th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);vertical-align:top;font-size:15px}
th{background:#e8f0f5;font-weight:600;color:#1d3343;white-space:nowrap}
tr:last-child td{border-bottom:none}
td.mono,.mono{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:14px}
.muted{color:var(--muted)}
.tag{display:inline-block;padding:1px 8px;border-radius:10px;font-size:12px;font-weight:700;letter-spacing:.02em;
vertical-align:middle}
.tag-test{background:#ece6fa;color:#4b2a9a}
.tag-warn{background:var(--warn-soft);color:var(--warn)}
.tag-ok{background:var(--ok-soft);color:var(--ok)}
.tag-info{background:var(--accent-soft);color:var(--accent)}
.filters{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px 14px;align-items:end}
label{display:block;font-size:13px;color:var(--muted);font-weight:600;margin-bottom:3px}
select,input,textarea{font:inherit;font-size:15px;width:100%;padding:7px 9px;border:1px solid #a9bccb;border-radius:7px;
background:#fff;color:var(--ink)}
textarea{min-height:76px}
button{font:inherit;font-size:15px;padding:8px 16px;border-radius:7px;border:1px solid var(--accent);background:var(--accent);
color:#fff;cursor:pointer}
button.secondary{background:#fff;color:var(--accent)}
button.link{background:none;border:none;color:#fff;text-decoration:underline;padding:0}
form.inline{display:inline}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px}
dl.kv{display:grid;grid-template-columns:190px 1fr;gap:6px 14px;margin:0}
dl.kv dt{color:var(--muted);font-weight:600} dl.kv dd{margin:0;word-break:break-word}
.flash{padding:10px 14px;border-radius:8px;margin-bottom:14px;background:var(--accent-soft);border:1px solid #b5dde2}
.flash.bad{background:var(--warn-soft);border-color:#f1b8b0}
.exceptions{border-left:4px solid var(--warn)}
.stack>*+*{margin-top:10px}
@media (max-width:720px){main{padding:14px}dl.kv{grid-template-columns:1fr}th,td{font-size:14px;padding:7px}}
"""


def _auth(request: Request) -> str:
    return v2_auth.owner_auth(request)


def _csrf_for(request: Request) -> str:
    cookie = request.cookies.get(COOKIE_NAME)
    return v2_auth.csrf_token(cookie) if cookie else ""


def _login_page(status: int, message: str = "") -> HTMLResponse:
    msg = f'<div class="flash bad">{e(message)}</div>' if message else ""
    body = f"""<div class="card" style="max-width:440px;margin:40px auto">{msg}
<h1>Owner sign-in</h1><form method="post" action="/owner/login" class="stack">
<div><label for="token">Owner access token</label><input id="token" name="token" type="password"
autocomplete="current-password" required></div><button type="submit">Sign in</button></form></div>"""
    return _page("Sign in", body, status=status, authed=False)


def _guard_html(request: Request):
    """Return (auth_kind, None) or (None, error response) for HTML pages."""
    try:
        return _auth(request), None
    except AuthError as exc:
        if exc.status_code == 503:
            return None, _page("Not configured", '<div class="card"><h1>Owner desk not configured</h1>'
                                                   '<p>VCX_ADMIN_TOKEN is not set on this server.</p></div>',
                               status=503, authed=False)
        return None, _login_page(401, "Sign in required." if request.headers.get("x-admin-token") is None
                                 else "Invalid token.")


def ny(iso_value) -> str:
    return v2_messages.ny_time(iso_value).replace(" (America/New_York)", "") if iso_value else ""


def _ny_day_bounds(day: str, end: bool) -> str | None:
    try:
        d = datetime.strptime(day, "%Y-%m-%d")
    except (TypeError, ValueError):
        return None
    if end:
        d = d + timedelta(days=1)
    return d.replace(tzinfo=_NY).astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _options(values, selected, blank: str = "Any") -> str:
    out = [f'<option value="">{e(blank)}</option>'] if blank is not None else []
    for v in values:
        label, val = (v if isinstance(v, tuple) else (v, v))
        sel = " selected" if val == selected else ""
        out.append(f'<option value="{e(val)}"{sel}>{e(label)}</option>')
    return "".join(out)


def _service_label(sid: str) -> str:
    return v2_messages.service_name(sid, "en")


def _flash(request: Request) -> str:
    ok, err = request.query_params.get("ok"), request.query_params.get("err")
    if ok in FLASH:
        return f'<div class="flash">{e(FLASH[ok])}</div>'
    if err in FLASH:
        return f'<div class="flash bad">{e(FLASH[err])}</div>'
    return ""


# ── login / logout ────────────────────────────────────────────────────

@router.get("/owner/login", response_class=HTMLResponse)
@limiter.limit("30/minute")
def owner_login_form(request: Request):
    if not v2_auth.admin_token():
        return _guard_html(request)[1] or _login_page(503)
    return _login_page(200)


@router.post("/owner/login")
@limiter.limit("10/minute")
async def owner_login(request: Request):
    if not v2_auth.admin_token():
        return _page("Not configured", '<div class="card"><h1>Owner desk not configured</h1></div>',
                     status=503, authed=False)
    form = await request.form()
    supplied = form.get("token")
    if not v2_auth._eq(supplied if isinstance(supplied, str) else None, v2_auth.admin_token()):
        return _login_page(401, "Invalid token.")
    resp = RedirectResponse("/owner", status_code=303, headers={"Cache-Control": "no-store"})
    resp.set_cookie(COOKIE_NAME, v2_auth.make_session_cookie(), max_age=v2_auth.SESSION_TTL_SECONDS,
                    httponly=True, samesite="strict", secure=request.url.scheme == "https", path="/")
    return resp


@router.post("/owner/logout")
async def owner_logout(request: Request):
    try:
        kind = _auth(request)
        form = await request.form()
        v2_auth.check_csrf(request, kind, form.get("csrf"))
    except AuthError as exc:
        return _err(exc)
    resp = RedirectResponse("/owner/login", status_code=303, headers={"Cache-Control": "no-store"})
    resp.delete_cookie(COOKIE_NAME, path="/")
    return resp


# ── desk list ─────────────────────────────────────────────────────────

@router.get("/owner", response_class=HTMLResponse)
@limiter.limit("120/minute")
def owner_desk(request: Request):
    kind, denied = _guard_html(request)
    if denied:
        return denied
    qp = request.query_params
    f = {k: (qp.get(k) or "").strip()[:60] for k in ("service", "queue", "status", "payment", "locale", "channel",
                                                   "date_from", "date_to")}
    filters = dict(f)
    filters["from_utc"] = _ny_day_bounds(f["date_from"], False) if f["date_from"] else None
    filters["to_utc"] = _ny_day_bounds(f["date_to"], True) if f["date_to"] else None
    try:
        service_ids = v2_catalog.all_service_ids()
    except CatalogError:
        service_ids = []
    rows = v2_store.list_requests(filters)
    excs = v2_store.open_exceptions()

    exc_html = ""
    if excs:
        items = "".join(
            f"<tr><td><span class='tag tag-warn'>{e(x['queue'])}</span></td><td>{e(x['code'])}</td>"
            f"<td class='mono'>{_req_link(x['request_id'])}</td><td>{e(x['detail'] or '')}</td><td>{e(ny(x['created_at']))}</td></tr>"
            for x in excs)
        exc_html = (f"<h2>Open exceptions ({len(excs)})</h2><table class='exceptions'><thead><tr><th>Queue</th><th>Code</th>"
                    f"<th>Reference</th><th>Detail</th><th>Detected (NY)</th></tr></thead><tbody>{items}</tbody></table>")

    filt = f"""<form class="card filters" method="get" action="/owner">
<div><label>Service</label><select name="service">{_options([(_service_label(s), s) for s in service_ids], f['service'])}</select></div>
<div><label>Queue</label><select name="queue">{_options(QUEUES, f['queue'])}</select></div>
<div><label>Status</label><select name="status">{_options(REQUEST_STATUSES, f['status'])}</select></div>
<div><label>Payment</label><select name="payment">{_options(PAYMENT_STATUSES, f['payment'])}</select></div>
<div><label>Language</label><select name="locale">{_options([('English','en'),('Russian','ru'),('Spanish','es')], f['locale'])}</select></div>
<div><label>Channel</label><select name="channel">{_options(['web','phone'], f['channel'])}</select></div>
<div><label>Received from (NY)</label><input type="date" name="date_from" value="{e(f['date_from'])}"></div>
<div><label>Received to (NY)</label><input type="date" name="date_to" value="{e(f['date_to'])}"></div>
<div><button type="submit">Filter</button> <a href="/owner">Reset</a></div></form>"""

    body_rows = []
    for r in rows:
        test = " <span class='tag tag-test'>TEST</span>" if r["is_test"] else ""
        exc_tag = f" <span class='tag tag-warn'>{r['open_exceptions']} exception</span>" if r["open_exceptions"] else ""
        contact = "<br>".join(e(x) for x in [r["contact_name"], r["contact_email"], r["contact_phone"]] if x)
        pay_tag = "tag-ok" if r["payment_status"] == "PAID" else ("tag-warn" if r["payment_status"] in ("FAILED", "EXPIRED") else "tag-info")
        body_rows.append(
            f"<tr><td class='mono'>{_req_link(r['request_id'])}{test}{exc_tag}</td>"
            f"<td>{e(_service_label(r['service_id']))}<br><span class='muted'>{e(r['subtype'] or 'no subtype')} · {e(r['queue'])}</span></td>"
            f"<td>{e(ny(r['created_at']))}<br><span class='muted'>{e(r['source_channel'])} · {e(r['locale'])}</span></td>"
            f"<td>{e(NEXT_STEP_SHORT.get(r['next_action'], r['next_action']))}<br><span class='muted'>{e(r['status'])}</span></td>"
            f"<td>Quote: {e(r['quote_state'] or 'none')}<br><span class='tag {pay_tag}'>{e(r['payment_status'])}</span></td>"
            f"<td>{contact}</td></tr>")
    table = ("<table><thead><tr><th>Reference</th><th>Service / subtype</th><th>Received (America/New_York)</th>"
             "<th>Next step</th><th>Quote / payment</th><th>Contact</th></tr></thead><tbody>"
             + ("".join(body_rows) or "<tr><td colspan='6' class='muted'>No requests match.</td></tr>")
             + "</tbody></table>")
    body = f"{_flash(request)}<h1>Requests <span class='muted' style='font-size:16px'>({len(rows)})</span></h1>{filt}{exc_html}<h2>Requests</h2>{table}"
    return _page("Requests", body, csrf=_csrf_for(request) if kind == "cookie" else "")


def _req_link(request_id) -> str:
    if not request_id:
        return "—"
    return f"<a href='/owner/requests/{urlquote(request_id)}'>{e(request_id)}</a>"


# ── desk detail ───────────────────────────────────────────────────────

@router.get("/owner/requests/{request_id}", response_class=HTMLResponse)
@limiter.limit("120/minute")
def owner_request_detail(request: Request, request_id: str):
    kind, denied = _guard_html(request)
    if denied:
        return denied
    d = v2_store.request_detail(request_id) if len(request_id) <= 40 else None
    if not d:
        return _page("Not found", "<div class='card'><h1>Request not found</h1><a href='/owner'>Back</a></div>", status=404,
                     csrf=_csrf_for(request) if kind == "cookie" else "")
    r = d["request"]
    csrf = _csrf_for(request) if kind == "cookie" else ""
    csrf_field = f'<input type="hidden" name="csrf" value="{e(csrf)}">' if csrf else ""
    rid = urlquote(r["request_id"])

    test = " <span class='tag tag-test'>TEST</span>" if r["is_test"] else ""
    overview = f"""<dl class="kv">
<dt>Service</dt><dd>{e(_service_label(r['service_id']))} <span class='muted mono'>({e(r['service_id'])})</span></dd>
<dt>Subtype</dt><dd>{e(r['subtype'] or 'not specified')}</dd>
<dt>Queue / lane</dt><dd>{e(r['queue'])} · {e(r['lane'])}</dd>
<dt>Status</dt><dd>{e(r['status'])}</dd>
<dt>Payment</dt><dd>{e(r['payment_status'])}</dd>
<dt>Amount</dt><dd>{e(v2_catalog.money_text(r['amount_cents'], 'en')) if r['amount_cents'] else '—'}</dd>
<dt>Next step</dt><dd>{e(v2_messages.OWNER_NEXT_ACTION.get(r['next_action'], r['next_action']))}</dd>
<dt>Language / channel</dt><dd>{e(v2_messages.LANGUAGE_NAMES.get(r['locale'], r['locale']))} · {e(r['source_channel'])}</dd>
<dt>Received</dt><dd>{e(v2_messages.ny_time(r['created_at']))}</dd>
<dt>Catalog version</dt><dd class="mono">{e(r['catalog_version'])}</dd></dl>"""
    contact = f"""<dl class="kv"><dt>Name</dt><dd>{e(r['contact_name'])}</dd>
<dt>Email</dt><dd>{e(r['contact_email'] or '—')}</dd><dt>Phone</dt><dd>{e(r['contact_phone'] or '—')}</dd>
<dt>Privacy consent</dt><dd>{'yes' if r['consent_privacy'] else 'no'} <span class='muted'>{e(r['consent_notice_version'] or '')}</span></dd>
<dt>Referral consent</dt><dd>{'yes' if r['consent_referral'] else 'no'}</dd></dl>"""
    det_rows = "".join(f"<dt>{e(str(k))}</dt><dd>{e(str(v))}</dd>" for k, v in r["details"].items()) or "<dt>—</dt><dd>none</dd>"
    details = f"<dl class='kv'>{det_rows}<dt>Summary</dt><dd>{e(r['summary'] or '—')}</dd></dl>"

    def table(headers, rows_html, empty):
        head = "".join(f"<th>{h}</th>" for h in headers)
        return f"<table><thead><tr>{head}</tr></thead><tbody>{rows_html or f'<tr><td colspan={len(headers)} class=muted>{empty}</td></tr>'}</tbody></table>"

    quotes = table(["Quote", "Rev", "Amount", "Status", "Expires (NY)", "Scope", "External costs"], "".join(
        f"<tr><td class='mono'>{e(q['quote_id'])}</td><td>{q['revision']}</td><td>{e(v2_catalog.money_text(q['amount_cents'], 'en'))}</td>"
        f"<td>{e(q['status'])}</td><td>{e(ny(q['expires_at']))}</td><td>{e(q['scope_text'])}</td><td>{e(q['external_costs_text'] or '—')}</td></tr>"
        for q in d["quotes"]), "No quotes yet.")
    payments = table(["Order ref", "Provider", "Amount", "Status", "Exception", "Created (NY)"], "".join(
        f"<tr><td class='mono'>{e(p['order_id'])}</td><td>{e(p['provider_mode'])}</td>"
        f"<td>{e(v2_catalog.money_text(p['amount_cents'], 'en'))}</td><td>{e(p['status'])}</td>"
        f"<td>{e(p['exception_code'] or '—')}</td><td>{e(ny(p['created_at']))}</td></tr>" for p in d["payments"]),
        "No checkout sessions.")
    order = d["order"]
    order_html = (f"<p>Order <span class='mono'>{e(order['order_id'])}</span> · {e(order['status'])} · "
                  f"{e(v2_catalog.money_text(order['amount_cents'], 'en'))}</p>") if order else "<p class='muted'>No order (created only from a verified payment event).</p>"
    notes = table(["#", "Kind", "To", "Status", "Attempts", "Next attempt (NY)", "Last error", "Provider ref"], "".join(
        f"<tr><td>{n['id']}</td><td>{e(n['kind'])}</td><td>{e(n['audience'])}: {e(n['recipient'] or '(not configured)')}</td>"
        f"<td><span class='tag {'tag-warn' if n['status'] in ('DEAD','FAILED') else ('tag-ok' if n['status'].startswith('ACCEPTED') else 'tag-info')}'>{e(n['status'])}</span></td>"
        f"<td>{n['attempts']}</td><td>{e(ny(n['next_attempt_at'])) if n['status'] in ('PENDING','FAILED') else '—'}</td>"
        f"<td>{e(n['last_error'] or '—')}</td><td class='mono'>{e(n['provider_ref'] or '—')}</td></tr>"
        for n in d["notifications"]), "No notifications.")
    events = table(["Time (NY)", "Event", "Actor", "Refs", "Data"], "".join(
        f"<tr><td>{e(ny(ev['occurred_at_utc']))}</td><td class='mono'>{e(ev['event_type'])}</td><td>{e(ev['actor'])}</td>"
        f"<td class='mono'>{e(' '.join(x for x in [ev['order_id'], ev['quote_id']] if x) or '—')}</td>"
        f"<td class='mono'>{e(_compact(ev['data_json']))}</td></tr>" for ev in d["events"]), "No events.")
    exc_rows = "".join(
        f"<tr><td>{e(x['queue'])}</td><td>{e(x['code'])}</td><td>{e(x['detail'] or '')}</td><td>{e(x['status'])}</td>"
        f"<td>{_resolve_form(x, csrf_field) if x['status'] == 'OPEN' else '—'}</td></tr>" for x in d["exceptions"])
    exceptions = table(["Queue", "Code", "Detail", "Status", ""], exc_rows, "No exceptions.")

    allowed = sorted(OWNER_TRANSITIONS.get(r["status"], set()))
    status_form = (f"""<form method="post" action="/api/v2/owner/requests/{rid}/status" class="stack">{csrf_field}
<div><label>New status</label><select name="status" required>{_options(allowed, None, blank="Choose new status…")}</select></div>
<div><label>Internal note (optional, not sent to the customer)</label><textarea name="note" maxlength="500"></textarea></div>
<button type="submit">Update status</button></form>""" if allowed else "<p class='muted'>No manual status changes from this state.</p>")
    quote_form = f"""<form method="post" action="/api/v2/owner/requests/{rid}/quote" class="stack">{csrf_field}
<div><label>Amount, USD (e.g. 149.00)</label><input name="amount_usd" inputmode="decimal" required></div>
<div><label>Scope (customer sees this)</label><textarea name="scope_text" maxlength="2000" required></textarea></div>
<div><label>External costs (state fees, shipping…)</label><textarea name="external_costs_text" maxlength="1000"></textarea></div>
<div><label>Valid for, days</label><input name="expires_in_days" value="14" inputmode="numeric"></div>
<button type="submit">Create quote revision</button></form>"""
    try:
        sids = v2_catalog.all_service_ids()
    except CatalogError:
        sids = []
    reclass_form = f"""<form method="post" action="/api/v2/owner/requests/{rid}/reclassify" class="stack">{csrf_field}
<div><label>Service</label><select name="service_id">{_options([(_service_label(s) + ' (' + s + ')', s) for s in sids], r['service_id'], blank=None)}</select></div>
<div><label>Subtype (must belong to the service; blank = none)</label><input name="subtype" value="{e(r['subtype'] or '')}"></div>
<div><label>Reason (audit trail)</label><input name="reason" maxlength="300" required></div>
<button type="submit" class="secondary">Reclassify</button></form>"""

    body = f"""{_flash(request)}<p><a href="/owner">← All requests</a></p>
<h1 class="mono">{e(r['request_id'])}{test}</h1>
<div class="grid2"><div class="card"><h2 style="margin-top:0">Overview</h2>{overview}</div>
<div class="card"><h2 style="margin-top:0">Contact &amp; consent</h2>{contact}</div></div>
<div class="card"><h2 style="margin-top:0">Request details</h2>{details}</div>
<div class="grid2"><div class="card"><h2 style="margin-top:0">Status</h2>{status_form}</div>
<div class="card"><h2 style="margin-top:0">Quote</h2>{quote_form}</div>
<div class="card"><h2 style="margin-top:0">Reclassify</h2>{reclass_form}</div></div>
<h2>Quotes</h2>{quotes}<h2>Payments</h2>{payments}<h2>Order</h2>{order_html}
<h2>Notifications (delivery state; ACCEPTED ≠ delivered)</h2>{notes}
<h2>Exceptions</h2>{exceptions}<h2>Event history</h2>{events}"""
    return _page(r["request_id"], body, csrf=csrf)


def _compact(data_json: str) -> str:
    try:
        data = json.loads(data_json or "{}")
    except ValueError:
        return ""
    return ", ".join(f"{k}={v}" for k, v in data.items() if v not in (None, ""))[:300]


def _resolve_form(x: dict, csrf_field: str) -> str:
    return (f"<form method='post' action='/api/v2/owner/exceptions/{x['id']}/resolve' class='inline'>{csrf_field}"
            f"<button class='secondary' type='submit'>Resolve</button></form>")


# ── owner JSON / form actions ─────────────────────────────────────────

async def _owner_body(request: Request) -> tuple[str, dict, bool]:
    """Authenticate + parse JSON or form body. Returns (auth_kind, data, is_form)."""
    kind = _auth(request)
    ctype = request.headers.get("content-type", "")
    if ctype.startswith("application/json"):
        raw = await request.body()
        if len(raw) > 16 * 1024:
            raise StoreError(413, "payload_too_large")
        try:
            data = json.loads(raw or b"{}")
        except ValueError:
            raise StoreError(422, "validation", fields={"body": "invalid_json"}) from None
        if not isinstance(data, dict):
            raise StoreError(422, "validation", fields={"body": "invalid_json"})
        is_form = False
    else:
        form = await request.form()
        data = {k: v for k, v in form.items() if isinstance(v, str)}
        is_form = True
    v2_auth.check_csrf(request, kind, data.get("csrf"))
    return kind, data, is_form


def _done(is_form: bool, request_id: str, ok: str, payload: dict) -> JSONResponse | RedirectResponse:
    if is_form:
        return RedirectResponse(f"/owner/requests/{urlquote(request_id)}?{urlencode({'ok': ok})}", status_code=303)
    return JSONResponse(payload, headers={"Cache-Control": "no-store"})


def _fail(is_form: bool, request_id: str, exc) -> JSONResponse | RedirectResponse:
    if is_form and getattr(exc, "status_code", 500) not in (401, 403, 503):
        return RedirectResponse(f"/owner/requests/{urlquote(request_id)}?{urlencode({'err': exc.body.get('error', '')})}",
                                status_code=303)
    return _err(exc)


def _text(data: dict, key: str, limit: int, required: bool = False):
    val = data.get(key)
    if val is None or (isinstance(val, str) and not val.strip()):
        if required:
            raise StoreError(422, "validation", fields={key: "required"})
        return None
    if not isinstance(val, str):
        raise StoreError(422, "validation", fields={key: "invalid_type"})
    val = val.strip()
    if len(val) > limit:
        raise StoreError(422, "validation", fields={key: "too_long"})
    return val


@router.post("/api/v2/owner/requests/{request_id}/status")
@limiter.limit("60/minute")
async def owner_set_status(request: Request, request_id: str):
    is_form = False
    try:
        _, data, is_form = await _owner_body(request)
        status = _text(data, "status", 40, required=True)
        note = _text(data, "note", 500)
        req = v2_store.set_status(request_id, status, note)
    except (AuthError, StoreError) as exc:
        return _fail(is_form, request_id, exc)
    return _done(is_form, request_id, "status_updated", {"request_id": request_id, "status": req["status"]})


def _parse_amount(data: dict) -> int:
    if "amount_cents" in data and data["amount_cents"] not in (None, ""):
        val = data["amount_cents"]
        if isinstance(val, str) and val.strip().isdigit():
            val = int(val.strip())
        if not isinstance(val, int) or isinstance(val, bool):
            raise StoreError(422, "validation", fields={"amount_cents": "invalid_type"})
        cents = val
    else:
        raw = str(data.get("amount_usd") or "").strip().replace("$", "").replace(",", "")
        try:
            whole, _, frac = raw.partition(".")
            if not whole.isdigit() or (frac and (not frac.isdigit() or len(frac) > 2)):
                raise ValueError
            cents = int(whole) * 100 + int((frac + "00")[:2] or 0)
        except ValueError:
            raise StoreError(422, "validation", fields={"amount_cents": "required"}) from None
    if not 100 <= cents <= 10_000_000:
        raise StoreError(422, "validation", fields={"amount_cents": "out_of_range"})
    return cents


@router.post("/api/v2/owner/requests/{request_id}/quote")
@limiter.limit("30/minute")
async def owner_create_quote(request: Request, request_id: str):
    is_form = False
    try:
        _, data, is_form = await _owner_body(request)
        cents = _parse_amount(data)
        scope = _text(data, "scope_text", 2000, required=True)
        external = _text(data, "external_costs_text", 1000)
        days_raw = data.get("expires_in_days", 14)
        try:
            days = int(days_raw) if not isinstance(days_raw, bool) else -1
        except (TypeError, ValueError):
            days = -1
        if not 1 <= days <= 90:
            raise StoreError(422, "validation", fields={"expires_in_days": "out_of_range"})
        if contains_sensitive(scope) or contains_sensitive(external or ""):
            raise StoreError(422, "sensitive_data")
        q = v2_store.create_quote(request_id, cents, scope, external, days)
    except (AuthError, StoreError) as exc:
        return _fail(is_form, request_id, exc)
    return _done(is_form, request_id, "quote_created", {
        "quote_id": q["quote_id"], "revision": q["revision"], "amount_cents": q["amount_cents"],
        "expires_at": q["expires_at"], "status": q["status"]})


@router.post("/api/v2/owner/requests/{request_id}/reclassify")
@limiter.limit("30/minute")
async def owner_reclassify(request: Request, request_id: str):
    is_form = False
    try:
        _, data, is_form = await _owner_body(request)
        service_id = _text(data, "service_id", 80, required=True)
        subtype = _text(data, "subtype", 80)
        reason = _text(data, "reason", 300, required=True)
        req = v2_store.reclassify(request_id, service_id, subtype, reason)
    except (AuthError, StoreError) as exc:
        return _fail(is_form, request_id, exc)
    return _done(is_form, request_id, "reclassified", {
        "request_id": request_id, "service_id": req["service_id"], "subtype": req["subtype"],
        "queue": req["queue"], "next_action": req["next_action"]})


@router.post("/api/v2/owner/exceptions/{exc_id}/resolve")
@limiter.limit("30/minute")
async def owner_resolve_exception(request: Request, exc_id: int):
    try:
        _, _, is_form = await _owner_body(request)
    except (AuthError, StoreError) as exc:
        return _err(exc)
    ok = v2_store.resolve_exception(exc_id)
    if is_form:
        return RedirectResponse("/owner?" + urlencode({"ok": "resolved"} if ok else {"err": "not_found"}), status_code=303)
    return JSONResponse({"resolved": ok}, status_code=200 if ok else 404)


@router.get("/api/v2/owner/requests")
@limiter.limit("60/minute")
def owner_list_json(request: Request, limit: int = 100):
    try:
        _auth(request)
    except AuthError as exc:
        return _err(exc)
    rows = v2_store.list_requests({}, limit=max(1, min(limit, 500)))
    keep = ("request_id", "service_id", "subtype", "queue", "lane", "status", "payment_status", "next_action",
            "locale", "source_channel", "amount_cents", "created_at", "is_test", "quote_state", "open_exceptions")
    return JSONResponse({"requests": [{k: r.get(k) for k in keep} for r in rows]}, headers={"Cache-Control": "no-store"})
