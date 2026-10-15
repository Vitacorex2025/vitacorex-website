"""Iteration 5: company filings, record retrieval, records update after a name change, monthly small-claims plan."""

import uuid

from conftest import create, payload


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


def test_monthly_small_claims_plan_is_business_lane_and_excludes_ny(client, env):
    req = create(client, "b2b_small_claims_monthly", details={"company": "Test Co LLC", "b2b_state": "FL", "active_cases": 4})
    assert req["queue"] == "B2B_SMALL_CLAIMS" and req["next_action"] == "b2b_review"
    r = client.post("/api/v2/requests", json=payload("b2b_small_claims_monthly", details={"company": "Test Co", "b2b_state": "NY"}))
    assert r.status_code == 422 and r.json()["code"] == "B2B_NY_EXCLUDED"
