from __future__ import annotations

from backend.models.case_schema import CaseRecord, OfficialContact


CONTACTS_BY_ISSUE: dict[str, list[OfficialContact]] = {
    "irs_notice": [
        OfficialContact(
            authority_name="Internal Revenue Service",
            department_name="Notices and Letters",
            webform="https://www.irs.gov/individuals/understanding-your-irs-notice-or-letter",
            required_docs=["notice_copy", "supporting_tax_records"],
        )
    ],
    "ssa_overpayment_notice": [
        OfficialContact(
            authority_name="Social Security Administration",
            department_name="Overpayment and Appeal Support",
            webform="https://www.ssa.gov/overpayments/",
            required_docs=["notice_copy", "financial_information", "appeal_or_waiver_statement"],
        )
    ],
    "debt_collection_notice": [
        OfficialContact(
            authority_name="Consumer Financial Protection Bureau",
            department_name="Consumer Complaint Portal",
            webform="https://www.consumerfinance.gov/complaint/",
            required_docs=["collection_notice", "supporting_account_records"],
        )
    ],
    "vehicle_purchase_contract": [
        OfficialContact(
            authority_name="National Highway Traffic Safety Administration",
            department_name="VIN and Recall Lookup",
            webform="https://www.nhtsa.gov/recalls",
            required_docs=["vin", "buyer_order_optional"],
        )
    ],
}


def resolve_official_contacts(record: CaseRecord) -> list[OfficialContact]:
    issue = str(getattr(record, "issue_category", "") or "").strip().lower()
    contacts = CONTACTS_BY_ISSUE.get(issue, [])
    return [item.model_copy(deep=True) for item in contacts]
