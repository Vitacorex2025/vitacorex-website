"""Iteration 2: court name change and fee-waiver services, plus catalog ↔ form ↔ i18n consistency."""

import json
import re
import uuid
from pathlib import Path

from conftest import create, payload

SITE = Path(__file__).resolve().parents[2]
# Accepted from the phone channel; on the web form the subtype selector carries the same information.
API_ONLY_FIELDS = {"tax_type", "topic", "claim_category"}


def _checkout(client, req):
    body = {"request_id": req["request_id"], "access_token": req["access_token"], "idempotency_key": str(uuid.uuid4())}
    return client.post("/api/v2/checkout", json=body)


def test_name_change_adult_is_fixed_and_checkout_charges_service_fee_only(client, env, catalog):
    svc = catalog["services"]["name_change_adult_fl"]
    req = create(client, "name_change_adult_fl", subtype="adult_name_change",
                 details={"florida_county": "Hillsborough", "born_in_florida": "no"})
    assert req["queue"] == svc["queue"]
    assert req["amount_cents"] == svc["price"]["amount_cents"]
    r = _checkout(client, req)
    assert r.status_code == 200, r.text
    # court, background-check and copy fees are third-party fees: never part of the charged total
    assert r.json()["amount_cents"] == svc["price"]["amount_cents"]


def test_name_change_family_is_quote_only(client, env):
    req = create(client, "name_change_family_fl", subtype="minor_name_change", details={"florida_county": "Pinellas"})
    assert req["next_action"] == "quote" and req["amount_cents"] is None
    assert _checkout(client, req).status_code in (400, 409, 422)


def test_fee_waiver_fields_and_subtypes(client, env, catalog):
    req = create(client, "fee_waiver_application", subtype="uscis_i912",
                 details={"jurisdiction_state": "FL", "waiver_form": "USCIS I-912 with N-400"})
    assert req["amount_cents"] == catalog["services"]["fee_waiver_application"]["price"]["amount_cents"]
    r = client.post("/api/v2/requests", json=payload("fee_waiver_application", details={"form_number": "I-912"}))
    assert r.status_code == 422 and r.json()["fields"]["details.form_number"] == "unexpected_field"


def test_every_catalog_field_subtype_and_group_is_wired():
    cat = json.loads((SITE / "assets/data/vcx-catalog.json").read_text(encoding="utf-8"))
    form_js = (SITE / "assets/js/vcx-v2-request.js").read_text(encoding="utf-8")
    form_fields = set(re.findall(r"^\s{4}(\w+): \{ type:", form_js, flags=re.M))
    i18n = {l: json.loads((SITE / f"assets/i18n/{l}.json").read_text(encoding="utf-8")) for l in ("en", "ru", "es")}
    grouped = [sid for g in cat["groups"] for sid in g["services"]]
    assert sorted(grouped) == sorted(cat["services"]), "every service sits in exactly one group"
    for g in cat["groups"]:
        assert set(g.get("menu", [])) <= set(g["services"])
        for l in i18n:
            assert i18n[l].get(f"group.{g['id']}"), (g["id"], l)
    for sid, svc in cat["services"].items():
        assert svc["group"] in {g["id"] for g in cat["groups"]}, sid
        for f in svc.get("fields", []):
            if f in API_ONLY_FIELDS:
                continue
            assert f in form_fields, (sid, f)
            for l in i18n:
                assert i18n[l].get(f"fld.{f}"), (sid, f, l)
        for st in svc.get("subtypes", []):
            for l in i18n:
                assert i18n[l].get(f"subtype.{st}"), (sid, st, l)
        fl = (svc.get("price") or {}).get("fees_label")
        if fl:
            for l in i18n:
                assert "{amount}" in i18n[l].get(f"price.plus_fees_{fl}", ""), (sid, l)
