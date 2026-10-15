"""Iteration 5: company filings, record retrieval, records update after a name change, monthly small-claims plan."""

import uuid

from conftest import admin_headers, create, payload


def _checkout(client, req):
    body = {"request_id": req["request_id"], "access_token": req["access_token"], "idempotency_key": str(uuid.uuid4())}
    return client.post("/api/v2/checkout", json=body)


def test_annual_report_charges_service_fee_only(client, env, catalog):
    svc = catalog["services"]["company_annual_report_fl"]
    req = create(client, "company_annual_report_fl", details={
        "entity_name": "Test Co LLC", "document_number": "L26000123456", "entity_type_fl": "llc", "changes_requested": "nothing"})
    assert req["queue"] == "FORMATION_BUSINESS_PLAN" and req["amount_cents"] == svc["price"]["amount_cents"] == 7900
    r = _checkout(client, req)
    assert r.status_code == 200, r.text
    # the $138.75 state fee and the $400 late fee are paid to the state, never folded into our charge
    assert r.json()["amount_cents"] == 7900


def test_yearly_plan_is_a_one_time_payment(client, env):
    req = create(client, "company_annual_plan_fl", details={"entity_name": "Test Co LLC"})
    assert req["amount_cents"] == 11900
    assert _checkout(client, req).json()["amount_cents"] == 11900


def test_florida_company_operations_have_fixed_prices(client, env, catalog):
    for sid, cents, details in (("fl_fictitious_name", 6900, {"entity_name": "Test Person", "proposed_name": "Test Bakery", "florida_county": "Hillsborough"}),
                                ("fl_amendment", 8900, {"entity_name": "Test Co LLC", "changes_requested": "new principal address"}),
                                ("fl_certificate_status", 2900, {"entity_name": "Test Co LLC"}),
                                ("fl_certified_copy", 3900, {"entity_name": "Test Co LLC", "copies_count": 2})):
        req = create(client, sid, details=details)
        assert req["amount_cents"] == cents == catalog["services"][sid]["price"]["amount_cents"], sid


def test_other_state_filing_and_record_retrieval_are_quote_only(client, env):
    other = create(client, "business_filing_other_state", details={"entity_name": "Test Co LLC", "jurisdiction_state": "TX"})
    assert other["next_action"] == "quote" and other["amount_cents"] is None
    rec = create(client, "record_retrieval", subtype="vital_record", details={
        "document_type": "birth certificate", "issuing_authority": "Florida Department of Health", "requester_relation": "self", "destination_country": "Spain"})
    assert rec["queue"] == "TRANSLATION_NOTARY_APOSTILLE" and rec["next_action"] == "quote"
    assert _checkout(client, rec).status_code in (400, 409, 422)


def test_records_update_fixed_and_rejects_unknown_fields(client, env):
    req = create(client, "name_change_records_update", subtype="after_marriage", details={"passport_status": "recent", "dl_state": "FL", "letters_count": 6})
    assert req["amount_cents"] == 6900
    r = client.post("/api/v2/requests", json=payload("name_change_records_update", details={"ssn": "000-00-0000"}))
    assert r.status_code == 422


def test_retainer_is_per_case_business_lane_with_bonus_and_no_checkout(client, env, catalog):
    svc = catalog["services"]["b2b_small_claims_retainer"]
    assert svc["price"]["amount_cents"] == 74900 and svc["action"] == "b2b"
    assert any(x.startswith("Promotion") for x in svc["included"]["en"]) and any("2 hours in court" in x for x in svc["included"]["en"])
    req = create(client, "b2b_small_claims_retainer", subtype="unpaid_invoice",
                 details={"company": "Test Co LLC", "b2b_state": "FL", "claim_amount": "4200", "party_role": "claimant", "poa_ready": "template"})
    assert req["queue"] == "B2B_SMALL_CLAIMS" and req["next_action"] == "b2b_review"
    assert _checkout(client, req).status_code in (400, 409, 422)
    assert "b2b_small_claims_monthly" not in catalog["services"], "the multi-case back office duplicated the month of support"


def test_hourly_small_claims_is_business_lane_with_poa_question_and_no_checkout(client, env, catalog):
    svc = catalog["services"]["b2b_small_claims_hourly"]
    assert svc["price"]["display"] == "per_hour" and svc["action"] == "b2b"
    req = create(client, "b2b_small_claims_hourly", details={"company": "Test Co LLC", "b2b_state": "FL", "active_cases": 3, "poa_ready": "template"})
    assert req["queue"] == "B2B_SMALL_CLAIMS" and req["next_action"] == "b2b_review"
    assert _checkout(client, req).status_code in (400, 409, 422)
    r = client.post("/api/v2/requests", json=payload("b2b_small_claims_hourly", details={"company": "Test Co", "b2b_state": "NY"}))
    assert r.status_code == 201  # New York: accepted for a jurisdiction check


def test_court_hours_first_two_hours_paid_upfront(client, env, catalog):
    price = catalog["services"]["b2b_small_claims_hourly"]["price"]
    assert price["amount_cents"] == 6500 and price["minimum_units"] == 2 and price["prepay_units"] == 2
    req = create(client, "b2b_small_claims_hourly", locale="ru",
                 details={"company": "Test Co LLC", "b2b_state": "FL", "active_cases": 1, "poa_ready": "template"})
    rid, tok = req["request_id"], req["access_token"]
    one_hour = client.post(f"/api/v2/owner/requests/{rid}/quote", headers=admin_headers(),
                           json={"amount_cents": 6500, "scope_text": "TEST one hour", "expires_in_days": 7})
    assert one_hour.status_code == 422 and one_hour.json()["error"] == "below_minimum"
    q = client.post(f"/api/v2/owner/requests/{rid}/quote", headers=admin_headers(),
                    json={"amount_cents": 13000, "scope_text": "TEST hearing, first 2 hours", "expires_in_days": 7}).json()
    assert client.post(f"/api/v2/quotes/{q['quote_id']}/accept", json={"access_token": tok}).status_code == 200
    body = {"request_id": rid, "access_token": tok, "idempotency_key": str(uuid.uuid4()), "quote_id": q["quote_id"]}
    assert client.post("/api/v2/checkout", json=body).json()["amount_cents"] == 13000
    text = {s["id"]: s["price_display_text"] for s in client.get("/api/v2/catalog?locale=ru").json()["services"]}
    assert "первый платёж $130" in text["b2b_small_claims_hourly"]


def test_financial_recovery_is_reviewed_first_never_checked_out(client, env, catalog):
    for sid, cents in (("b2b_recovery_analysis", 39000), ("b2b_recovery_pilot", 79000)):
        svc = catalog["services"][sid]
        assert svc["price"]["amount_cents"] == cents and svc["lane"] == "business"
        req = create(client, sid, details={"company": "Test Supply LLC", "b2b_state": "FL", "overdue_count": 18, "overdue_total": 42000, "overdue_age": "lt180", "on_monthly_plan": "no"})
        assert req["next_action"] == "b2b_review"
        assert _checkout(client, req).status_code in (400, 409, 422)
    r = client.post("/api/v2/requests", json=payload("b2b_recovery_pilot", details={"company": "Test Co", "b2b_state": "NY"}))
    assert r.status_code == 201  # New York: accepted for a jurisdiction check
    for sid in ("b2b_recovery_analysis", "b2b_recovery_pilot"):
        assert any("retainer" in x for x in catalog["services"][sid]["extra"]["en"])


def test_financial_recovery_pilot_is_pre_court_and_extras_are_listed_separately(client, env, catalog):
    pl = catalog["services"]["b2b_recovery_pilot"]
    assert "Financial Recovery" in pl["name"]["en"]
    text = " ".join(pl["included"]["en"] + [pl["short"]["en"]]).lower()
    assert "small-claims packet" not in text and "small claims packet" not in text, "small claims is a separate service, not part of the pilot"
    extra = " ".join(pl["extra"]["en"]).lower()
    for word in ("certified mail", "skip tracing", "service on the debtor", "court fees", "promotion"):
        assert word in extra, word


def test_rollout_is_a_success_fee_never_checked_out_and_skip_trace_is_the_clients(client, env, catalog):
    from app.services.v2_catalog import price_display_text
    ro = catalog["services"]["b2b_recovery_rollout"]
    assert ro["price"]["display"] == "percent" and ro["price"]["percent"] == 12 and ro["price"]["percent_aged"] == 18
    assert ro["price"]["amount_cents"] is None and ro["action"] == "b2b"
    assert price_display_text(ro, "en").startswith("12% of the increase in net recovery")
    assert ro["price"]["basis"] == "net_recovery_increase_over_baseline" and ro["price"]["baseline_months"] == 3
    assert "after the pilot" in ro["name"]["en"] and "пилота" in ro["name"]["ru"]
    # debtor search is not our service: the client orders and pays for it directly
    assert "b2b_skip_trace" not in catalog["services"]
    assert all("b2b_skip_trace" not in g["services"] for g in catalog["groups"])
    for sid in ("b2b_recovery_pilot", "b2b_recovery_rollout"):
        line = next(x for x in catalog["services"][sid]["extra"]["en"] if "skip tracing" in x)
        assert "your company orders and pays" in line and "$" not in line
    req = create(client, "b2b_recovery_rollout", details={"company": "Test Supply LLC", "b2b_state": "FL", "overdue_count": 40, "on_monthly_plan": "no"})
    assert req["next_action"] == "b2b_review"
    assert _checkout(client, req).status_code in (400, 409, 422)
    assert client.post("/api/v2/requests", json=payload("b2b_skip_trace", details={"company": "Test Co"})).status_code in (400, 404, 422)
