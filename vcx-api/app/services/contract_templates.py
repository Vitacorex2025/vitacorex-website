"""Contract clause templates — reusable clause library for document generation.

Phase 8: Contract Generator — clause text per contract type.
Each template function accepts questionnaire parameters and returns
formatted clause text suitable for insertion into a DOCX document.

All clauses are generic starting-point language. They are NOT legal
advice. A prominent disclaimer is included in every generated document.

Clause types mirror the analyzer's 16-pattern taxonomy so that
generated contracts can be round-tripped through the analyzer.
"""

from datetime import date
from typing import Optional


# ── Contract type metadata ──────────────────────────────────────────

CONTRACT_TYPES = {
    "nda": {
        "label": "Non-Disclosure Agreement (NDA)",
        "clauses": [
            "preamble", "recitals", "confidentiality", "term_and_termination",
            "permitted_disclosure", "return_of_materials", "remedies",
            "governing_law", "assignment", "miscellaneous", "signatures",
        ],
    },
    "service": {
        "label": "Service Agreement",
        "clauses": [
            "preamble", "recitals", "scope_of_services", "payment_terms",
            "term_and_termination", "confidentiality", "ip_ownership",
            "indemnification", "liability_limitation", "warranty",
            "force_majeure", "governing_law", "assignment",
            "miscellaneous", "signatures",
        ],
    },
    "employment": {
        "label": "Employment Agreement",
        "clauses": [
            "preamble", "recitals", "position_and_duties", "compensation",
            "term_and_termination", "confidentiality", "ip_ownership",
            "non_compete", "non_solicitation", "warranty",
            "governing_law", "arbitration", "miscellaneous", "signatures",
        ],
    },
    "contractor": {
        "label": "Independent Contractor Agreement",
        "clauses": [
            "preamble", "recitals", "scope_of_services", "compensation_contractor",
            "term_and_termination", "independent_contractor_status",
            "confidentiality", "ip_ownership", "indemnification",
            "liability_limitation", "governing_law",
            "miscellaneous", "signatures",
        ],
    },
}


def get_contract_types() -> list[dict]:
    """Return list of available contract types for the questionnaire."""
    return [
        {"id": k, "label": v["label"]}
        for k, v in CONTRACT_TYPES.items()
    ]


# ── Shared clause builders ──────────────────────────────────────────

def _effective_date(params: dict) -> str:
    return params.get("effective_date") or date.today().isoformat()


def _party_a(params: dict) -> str:
    return params.get("party_a_name") or "[PARTY A NAME]"


def _party_b(params: dict) -> str:
    return params.get("party_b_name") or "[PARTY B NAME]"


def _state(params: dict) -> str:
    return params.get("governing_state") or "Florida"


def _term_months(params: dict) -> int:
    try:
        return int(params.get("term_months", 12))
    except (ValueError, TypeError):
        return 12


def _notice_days(params: dict) -> int:
    try:
        return int(params.get("notice_days", 30))
    except (ValueError, TypeError):
        return 30


# ── CLAUSE LIBRARY ─────────────────────────────────────────────────

def clause_preamble(params: dict) -> tuple[str, str]:
    """Returns (heading, body) for the preamble."""
    return ("Agreement", (
        f"This Agreement (\"Agreement\") is entered into as of "
        f"{_effective_date(params)} (the \"Effective Date\") by and between:\n\n"
        f"{_party_a(params)} (\"Party A\")\nand\n{_party_b(params)} (\"Party B\").\n\n"
        f"Party A and Party B are collectively referred to as the \"Parties\" "
        f"and individually as a \"Party.\""
    ))


def clause_recitals(params: dict) -> tuple[str, str]:
    purpose = params.get("purpose") or "enter into a business relationship"
    return ("Recitals", (
        f"WHEREAS, the Parties desire to {purpose};\n\n"
        f"WHEREAS, the Parties wish to set forth the terms and conditions "
        f"governing their relationship;\n\n"
        f"NOW, THEREFORE, in consideration of the mutual covenants and agreements "
        f"set forth herein, and for other good and valuable consideration, the "
        f"receipt and sufficiency of which are hereby acknowledged, the Parties "
        f"agree as follows:"
    ))


def clause_confidentiality(params: dict) -> tuple[str, str]:
    term = _term_months(params)
    return ("Confidentiality", (
        f"1. \"Confidential Information\" means all non-public information "
        f"disclosed by either Party to the other, whether orally, in writing, "
        f"or by any other means, that is designated as confidential or that "
        f"reasonably should be understood to be confidential given the nature "
        f"of the information and the circumstances of disclosure.\n\n"
        f"2. The Receiving Party shall not disclose any Confidential Information "
        f"to any third party without the prior written consent of the Disclosing "
        f"Party.\n\n"
        f"3. The Receiving Party shall use Confidential Information solely for "
        f"the purposes contemplated by this Agreement.\n\n"
        f"4. The obligations of confidentiality shall survive termination of "
        f"this Agreement for a period of {max(term, 24)} months."
    ))


def clause_term_and_termination(params: dict) -> tuple[str, str]:
    term = _term_months(params)
    notice = _notice_days(params)
    return ("Term and Termination", (
        f"1. This Agreement shall commence on the Effective Date and continue "
        f"for a period of {term} months (the \"Initial Term\"), unless earlier "
        f"terminated in accordance with this section.\n\n"
        f"2. Either Party may terminate this Agreement for convenience by "
        f"providing {notice} days' prior written notice to the other Party.\n\n"
        f"3. Either Party may terminate this Agreement immediately upon written "
        f"notice if the other Party commits a material breach of this Agreement "
        f"and fails to cure such breach within 15 days after receiving written "
        f"notice thereof.\n\n"
        f"4. Upon termination, all rights and obligations under this Agreement "
        f"shall cease, except for those provisions that by their nature are "
        f"intended to survive termination."
    ))


def clause_permitted_disclosure(params: dict) -> tuple[str, str]:
    return ("Permitted Disclosures", (
        "The obligations of confidentiality shall not apply to information that:\n\n"
        "(a) is or becomes publicly available through no fault of the Receiving Party;\n"
        "(b) was known to the Receiving Party prior to disclosure;\n"
        "(c) is independently developed by the Receiving Party without use of "
        "Confidential Information;\n"
        "(d) is lawfully received from a third party without restriction on disclosure; or\n"
        "(e) is required to be disclosed by law, regulation, or court order, "
        "provided that the Receiving Party gives prompt written notice to the "
        "Disclosing Party and cooperates in any effort to obtain a protective order."
    ))


def clause_return_of_materials(params: dict) -> tuple[str, str]:
    return ("Return of Materials", (
        "Upon termination of this Agreement or upon request by the Disclosing "
        "Party, the Receiving Party shall promptly return or destroy all "
        "Confidential Information in its possession, including all copies, "
        "notes, and derivative materials, and shall certify in writing that "
        "it has done so."
    ))


def clause_remedies(params: dict) -> tuple[str, str]:
    return ("Remedies", (
        "The Parties acknowledge that any breach of the confidentiality "
        "obligations herein may cause irreparable harm for which monetary "
        "damages would be inadequate. Accordingly, the Disclosing Party "
        "shall be entitled to seek equitable relief, including injunction "
        "and specific performance, in addition to any other remedies "
        "available at law or in equity."
    ))


def clause_scope_of_services(params: dict) -> tuple[str, str]:
    scope = params.get("scope_of_services") or "[Describe the services to be provided]"
    return ("Scope of Services", (
        f"Party B shall provide the following services to Party A "
        f"(the \"Services\"):\n\n{scope}\n\n"
        f"Party B shall perform the Services in a professional and "
        f"workmanlike manner, consistent with industry standards."
    ))


def clause_payment_terms(params: dict) -> tuple[str, str]:
    amount = params.get("payment_amount") or "[AMOUNT]"
    schedule = params.get("payment_schedule") or "monthly"
    net_days = params.get("payment_net_days") or "30"
    return ("Payment Terms", (
        f"1. Party A shall pay Party B {amount} on a {schedule} basis "
        f"for the Services rendered.\n\n"
        f"2. Invoices shall be payable within {net_days} days of receipt "
        f"(\"Net {net_days}\").\n\n"
        f"3. Late payments shall accrue interest at the rate of 1.5% per "
        f"month or the maximum rate permitted by law, whichever is less.\n\n"
        f"4. Either Party may dispute an invoice in good faith by providing "
        f"written notice within 10 days of receipt."
    ))


def clause_ip_ownership(params: dict) -> tuple[str, str]:
    owner = params.get("ip_owner") or "Party A"
    return ("Intellectual Property", (
        f"1. All intellectual property, work product, deliverables, inventions, "
        f"and materials created by Party B in the course of performing the "
        f"Services (\"Work Product\") shall be the sole and exclusive property "
        f"of {owner}.\n\n"
        f"2. Party B hereby assigns to {owner} all right, title, and interest "
        f"in and to the Work Product, including all copyrights, patents, trade "
        f"secrets, and other intellectual property rights.\n\n"
        f"3. Party B retains ownership of any pre-existing intellectual property "
        f"and grants {owner} a non-exclusive, perpetual, royalty-free license "
        f"to use such pre-existing materials as incorporated into the Work Product."
    ))


def clause_indemnification(params: dict) -> tuple[str, str]:
    return ("Indemnification", (
        "Each Party (\"Indemnifying Party\") shall indemnify, defend, and hold "
        "harmless the other Party and its officers, directors, employees, and "
        "agents (collectively, \"Indemnified Parties\") from and against any "
        "and all claims, damages, losses, liabilities, costs, and expenses "
        "(including reasonable attorneys' fees) arising out of or resulting "
        "from:\n\n"
        "(a) the Indemnifying Party's breach of any representation, warranty, "
        "or obligation under this Agreement;\n"
        "(b) the Indemnifying Party's negligence or willful misconduct; or\n"
        "(c) any third-party claim arising from the Indemnifying Party's "
        "performance or failure to perform under this Agreement."
    ))


def clause_liability_limitation(params: dict) -> tuple[str, str]:
    return ("Limitation of Liability", (
        "1. IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER PARTY FOR "
        "ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, "
        "INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR BUSINESS "
        "OPPORTUNITY, REGARDLESS OF THE CAUSE OF ACTION OR THE THEORY OF "
        "LIABILITY.\n\n"
        "2. THE AGGREGATE LIABILITY OF EITHER PARTY UNDER THIS AGREEMENT SHALL "
        "NOT EXCEED THE TOTAL AMOUNTS PAID OR PAYABLE UNDER THIS AGREEMENT "
        "DURING THE TWELVE (12) MONTH PERIOD PRECEDING THE CLAIM.\n\n"
        "3. The foregoing limitations shall not apply to: (a) breaches of "
        "confidentiality obligations; (b) indemnification obligations; or "
        "(c) liability arising from gross negligence or willful misconduct."
    ))


def clause_warranty(params: dict) -> tuple[str, str]:
    return ("Representations and Warranties", (
        "Each Party represents and warrants that:\n\n"
        "(a) it has the legal power and authority to enter into this Agreement;\n"
        "(b) the execution and performance of this Agreement does not conflict "
        "with any other agreement to which it is a party;\n"
        "(c) it shall comply with all applicable laws and regulations in the "
        "performance of its obligations hereunder.\n\n"
        "EXCEPT AS EXPRESSLY SET FORTH IN THIS AGREEMENT, NEITHER PARTY MAKES "
        "ANY WARRANTIES, EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES "
        "OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE."
    ))


def clause_force_majeure(params: dict) -> tuple[str, str]:
    return ("Force Majeure", (
        "Neither Party shall be liable for any failure or delay in performing "
        "its obligations under this Agreement if such failure or delay results "
        "from circumstances beyond the reasonable control of that Party, "
        "including but not limited to: acts of God, natural disasters, war, "
        "terrorism, riots, embargoes, acts of civil or military authorities, "
        "fire, floods, epidemics, pandemics, strikes, or supply chain "
        "disruptions (each a \"Force Majeure Event\").\n\n"
        "The affected Party shall provide prompt written notice of the Force "
        "Majeure Event and shall use commercially reasonable efforts to "
        "mitigate its effects. If a Force Majeure Event continues for more "
        "than 60 days, either Party may terminate this Agreement upon written "
        "notice."
    ))


def clause_governing_law(params: dict) -> tuple[str, str]:
    st = _state(params)
    return ("Governing Law", (
        f"This Agreement shall be governed by and construed in accordance "
        f"with the laws of the State of {st}, without regard to its conflict "
        f"of laws principles. Any legal action or proceeding arising under "
        f"this Agreement shall be brought exclusively in the state or federal "
        f"courts located in {st}, and the Parties hereby consent to the "
        f"personal jurisdiction and venue of such courts."
    ))


def clause_assignment(params: dict) -> tuple[str, str]:
    return ("Assignment", (
        "Neither Party may assign or transfer this Agreement or any rights "
        "or obligations hereunder without the prior written consent of the "
        "other Party, which consent shall not be unreasonably withheld. "
        "Notwithstanding the foregoing, either Party may assign this Agreement "
        "to an affiliate or in connection with a merger, acquisition, or sale "
        "of all or substantially all of its assets, provided that the assignee "
        "agrees in writing to be bound by the terms of this Agreement."
    ))


def clause_arbitration(params: dict) -> tuple[str, str]:
    st = _state(params)
    return ("Dispute Resolution", (
        f"1. The Parties shall first attempt to resolve any dispute arising "
        f"out of or relating to this Agreement through good faith negotiation.\n\n"
        f"2. If the dispute cannot be resolved within 30 days, it shall be "
        f"submitted to binding arbitration administered by the American "
        f"Arbitration Association in accordance with its Commercial Arbitration "
        f"Rules. The arbitration shall be conducted in {st}.\n\n"
        f"3. The arbitrator's decision shall be final and binding. Judgment "
        f"upon the award may be entered in any court of competent jurisdiction.\n\n"
        f"4. Notwithstanding the foregoing, either Party may seek injunctive "
        f"or other equitable relief in any court of competent jurisdiction."
    ))


def clause_non_compete(params: dict) -> tuple[str, str]:
    duration = params.get("non_compete_months") or "12"
    geography = params.get("non_compete_geography") or "the State of " + _state(params)
    return ("Non-Competition", (
        f"During the term of this Agreement and for a period of {duration} "
        f"months following its termination, Party B shall not, directly or "
        f"indirectly, engage in, own, manage, operate, or participate in any "
        f"business that competes with Party A within {geography}.\n\n"
        f"The Parties acknowledge that this restriction is reasonable in scope, "
        f"duration, and geographic area, and is necessary to protect Party A's "
        f"legitimate business interests."
    ))


def clause_non_solicitation(params: dict) -> tuple[str, str]:
    duration = params.get("non_solicit_months") or "12"
    return ("Non-Solicitation", (
        f"During the term of this Agreement and for a period of {duration} "
        f"months following its termination, Party B shall not, directly or "
        f"indirectly, solicit, recruit, or hire any employee, contractor, "
        f"or consultant of Party A, or induce any such person to terminate "
        f"their relationship with Party A."
    ))


def clause_position_and_duties(params: dict) -> tuple[str, str]:
    title = params.get("job_title") or "[JOB TITLE]"
    duties = params.get("job_duties") or "[Describe primary duties and responsibilities]"
    return ("Position and Duties", (
        f"1. Party A hereby employs Party B in the position of {title}.\n\n"
        f"2. Party B shall perform the following duties:\n{duties}\n\n"
        f"3. Party B shall devote full professional time and attention to "
        f"the performance of duties hereunder and shall comply with all "
        f"policies and procedures established by Party A."
    ))


def clause_compensation(params: dict) -> tuple[str, str]:
    salary = params.get("salary") or "[SALARY AMOUNT]"
    schedule = params.get("pay_schedule") or "bi-weekly"
    return ("Compensation and Benefits", (
        f"1. Party A shall pay Party B an annual salary of {salary}, "
        f"payable on a {schedule} basis, less applicable withholdings and "
        f"deductions.\n\n"
        f"2. Party B shall be eligible for benefits in accordance with "
        f"Party A's standard benefits program, as may be amended from time "
        f"to time.\n\n"
        f"3. Party A may, in its sole discretion, award bonuses or other "
        f"incentive compensation based on performance."
    ))


def clause_compensation_contractor(params: dict) -> tuple[str, str]:
    rate = params.get("contractor_rate") or "[RATE]"
    schedule = params.get("payment_schedule") or "monthly"
    return ("Compensation", (
        f"1. Party A shall pay Party B at the rate of {rate} for Services "
        f"rendered, payable on a {schedule} basis.\n\n"
        f"2. Party B shall submit invoices detailing the Services performed "
        f"and hours worked. Invoices shall be payable within 30 days of receipt.\n\n"
        f"3. Party B shall be responsible for all taxes, including self-employment "
        f"tax, arising from compensation received under this Agreement."
    ))


def clause_independent_contractor_status(params: dict) -> tuple[str, str]:
    return ("Independent Contractor Status", (
        "1. Party B is an independent contractor and is not an employee, "
        "agent, partner, or joint venturer of Party A.\n\n"
        "2. Party B shall have no authority to bind Party A or incur any "
        "obligations on Party A's behalf.\n\n"
        "3. Party B is responsible for providing its own tools, equipment, "
        "and workspace, except as specifically agreed otherwise.\n\n"
        "4. Party A shall not withhold taxes from payments to Party B. "
        "Party B shall receive an IRS Form 1099 as required by law."
    ))


def clause_miscellaneous(params: dict) -> tuple[str, str]:
    return ("Miscellaneous", (
        "1. ENTIRE AGREEMENT. This Agreement constitutes the entire agreement "
        "between the Parties and supersedes all prior agreements, understandings, "
        "and negotiations.\n\n"
        "2. AMENDMENTS. This Agreement may not be amended except by a written "
        "instrument signed by both Parties.\n\n"
        "3. WAIVER. The failure of either Party to enforce any provision of this "
        "Agreement shall not constitute a waiver of that Party's right to enforce "
        "such provision in the future.\n\n"
        "4. SEVERABILITY. If any provision of this Agreement is held invalid or "
        "unenforceable, the remaining provisions shall continue in full force and "
        "effect.\n\n"
        "5. NOTICES. All notices under this Agreement shall be in writing and "
        "shall be deemed given when delivered personally, sent by certified mail, "
        "or sent by email with confirmation of receipt.\n\n"
        "6. COUNTERPARTS. This Agreement may be executed in counterparts, each "
        "of which shall be deemed an original."
    ))


def clause_signatures(params: dict) -> tuple[str, str]:
    return ("Signatures", (
        f"IN WITNESS WHEREOF, the Parties have executed this Agreement as of "
        f"the Effective Date.\n\n"
        f"{_party_a(params)}\n"
        f"By: ________________________\n"
        f"Name: ______________________\n"
        f"Title: _____________________\n"
        f"Date: ______________________\n\n"
        f"{_party_b(params)}\n"
        f"By: ________________________\n"
        f"Name: ______________________\n"
        f"Title: _____________________\n"
        f"Date: ______________________"
    ))


# ── Clause registry ────────────────────────────────────────────────

CLAUSE_BUILDERS: dict[str, callable] = {
    "preamble": clause_preamble,
    "recitals": clause_recitals,
    "confidentiality": clause_confidentiality,
    "term_and_termination": clause_term_and_termination,
    "permitted_disclosure": clause_permitted_disclosure,
    "return_of_materials": clause_return_of_materials,
    "remedies": clause_remedies,
    "scope_of_services": clause_scope_of_services,
    "payment_terms": clause_payment_terms,
    "ip_ownership": clause_ip_ownership,
    "indemnification": clause_indemnification,
    "liability_limitation": clause_liability_limitation,
    "warranty": clause_warranty,
    "force_majeure": clause_force_majeure,
    "governing_law": clause_governing_law,
    "assignment": clause_assignment,
    "arbitration": clause_arbitration,
    "non_compete": clause_non_compete,
    "non_solicitation": clause_non_solicitation,
    "position_and_duties": clause_position_and_duties,
    "compensation": clause_compensation,
    "compensation_contractor": clause_compensation_contractor,
    "independent_contractor_status": clause_independent_contractor_status,
    "miscellaneous": clause_miscellaneous,
    "signatures": clause_signatures,
}


def build_contract_sections(
    contract_type: str,
    params: dict,
) -> list[tuple[str, str]]:
    """Assemble ordered list of (heading, body) tuples for a contract.

    Args:
        contract_type: Key from CONTRACT_TYPES (e.g., "nda", "service")
        params: Questionnaire answers dict

    Returns:
        List of (heading, body) pairs in document order.
    """
    spec = CONTRACT_TYPES.get(contract_type)
    if not spec:
        raise ValueError(f"Unknown contract type: {contract_type}")

    sections = []
    for clause_key in spec["clauses"]:
        builder = CLAUSE_BUILDERS.get(clause_key)
        if builder:
            sections.append(builder(params))

    return sections


DISCLAIMER_TEXT = (
    "DISCLAIMER: This document was generated by an automated system and is "
    "provided as a starting point only. It does NOT constitute legal advice. "
    "The clauses herein are generic templates and may not be suitable for your "
    "specific situation, jurisdiction, or legal requirements. You should consult "
    "with a licensed attorney before signing, modifying, or relying on this "
    "document. VitaCoreX LLC assumes no liability for the use of this document."
)
