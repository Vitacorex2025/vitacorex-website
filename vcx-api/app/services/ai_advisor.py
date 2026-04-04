"""AI Advisor service — GPT-4o-mini powered analysis for all VitaCoreX apps.

Provides AI-enhanced analysis for:
- Contract review and improvement suggestions
- Immigration packet guidance
- Auto deal analysis and negotiation tips

Uses the same OpenAI client as the chat module, with app-specific system prompts.
Falls back gracefully if API key is missing or on errors.
"""

import logging
import os
from typing import Optional

logger = logging.getLogger("vcx.ai_advisor")

_API_KEY = os.getenv("OPENAI_API_KEY", "")
_MODEL = os.getenv("VCX_LLM_MODEL", "gpt-4o-mini")
_client = None


def _get_client():
    """Lazy-init OpenAI client (shared with chat module)."""
    global _client
    if _client is not None:
        return _client
    if not _API_KEY:
        return None
    try:
        from openai import OpenAI
        _client = OpenAI(api_key=_API_KEY)
        logger.info("AI Advisor client initialized (model=%s)", _MODEL)
        return _client
    except Exception as exc:
        logger.warning("Failed to init AI Advisor client: %s", exc)
        return None


def is_available() -> bool:
    return bool(_API_KEY) and _get_client() is not None


# ── Contract Analysis AI ──────────────────────────────────────────────

CONTRACT_SYSTEM_PROMPT = """You are the VitaCoreX Contract Advisor — an expert contract analyst.

TASK: Analyze the provided contract text and give a professional assessment.

YOUR OUTPUT MUST INCLUDE:
1. **Overall Risk Assessment** (Low / Medium / High / Critical) with brief explanation
2. **Key Findings** — List the 5-8 most important clauses or issues found, each with:
   - What the clause says (brief)
   - Risk level (🟢 Low, 🟡 Medium, 🔴 High)
   - What to watch for or negotiate
3. **Missing Protections** — Critical clauses that SHOULD be in this contract but are missing
4. **Recommended Actions** — 3-5 specific steps the user should take
5. **Improvement Suggestions** — How to strengthen weak clauses

RULES:
- Be specific and actionable — reference actual text from the contract
- Use professional but plain language
- You are NOT providing legal advice — you provide contract intelligence
- Always recommend consulting licensed counsel for final decisions
- Keep the analysis concise but thorough (under 800 words)
- Format with markdown headers and bullet points

LANGUAGE: Respond in the same language the user writes in."""


def analyze_contract_ai(
    contract_text: str,
    contract_type: Optional[str] = None,
    concerns: Optional[str] = None,
    language: str = "en",
) -> Optional[str]:
    """AI-powered contract analysis."""
    client = _get_client()
    if not client:
        return None

    # Truncate very long contracts to fit context
    max_chars = 12000
    text = contract_text[:max_chars]
    if len(contract_text) > max_chars:
        text += "\n\n[... document truncated for analysis ...]"

    user_msg = f"Please analyze this contract:\n\n{text}"
    if contract_type:
        user_msg = f"Contract type: {contract_type}\n\n{user_msg}"
    if concerns:
        user_msg += f"\n\nUser's specific concerns: {concerns}"

    try:
        response = client.chat.completions.create(
            model=_MODEL,
            messages=[
                {"role": "system", "content": CONTRACT_SYSTEM_PROMPT},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=1200,
            temperature=0.4,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:
        logger.warning("Contract AI analysis failed: %s", exc)
        return None


# ── Contract Improvement AI ───────────────────────────────────────────

CONTRACT_IMPROVE_PROMPT = """You are the VitaCoreX Contract Advisor. The user has a contract that was analyzed and needs IMPROVED clause language.

TASK: Generate improved, stronger versions of the problematic or weak clauses in the contract.

For each weak clause:
1. Show the ORIGINAL clause (brief quote)
2. Explain WHY it's weak or risky
3. Provide a STRONGER replacement clause that better protects the user

Also generate any MISSING clauses that should be added.

RULES:
- Write clauses in professional legal language
- Each replacement should be a complete, ready-to-use clause
- Focus on protecting the user's interests
- Include standard protective provisions
- This is contract intelligence, NOT legal advice
- Keep it actionable and professional

LANGUAGE: Respond in the same language the contract is written in."""


def improve_contract_ai(
    contract_text: str,
    analysis_summary: Optional[str] = None,
    contract_type: Optional[str] = None,
) -> Optional[str]:
    """Generate improved clause suggestions for a contract."""
    client = _get_client()
    if not client:
        return None

    max_chars = 10000
    text = contract_text[:max_chars]

    user_msg = f"Here is the contract to improve:\n\n{text}"
    if analysis_summary:
        user_msg += f"\n\nPrevious analysis findings:\n{analysis_summary}"
    if contract_type:
        user_msg = f"Contract type: {contract_type}\n\n{user_msg}"

    try:
        response = client.chat.completions.create(
            model=_MODEL,
            messages=[
                {"role": "system", "content": CONTRACT_IMPROVE_PROMPT},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=1500,
            temperature=0.3,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:
        logger.warning("Contract improvement AI failed: %s", exc)
        return None


# ── Immigration Packet AI ─────────────────────────────────────────────

IMMIGRATION_SYSTEM_PROMPT = """You are the VitaCoreX Immigration Packet Advisor — an expert in US immigration documentation.

TASK: Analyze the uploaded immigration document/packet and provide guidance.

YOUR OUTPUT MUST INCLUDE:
1. **Document Identification** — What form(s) or document type was detected
2. **Completeness Check** — Fields that appear filled vs missing/incomplete
3. **Common Issues Found** — Typical problems spotted in this type of document
4. **Required Supporting Documents** — What evidence/documents need to accompany this form
5. **Filing Checklist** — Step-by-step filing preparation checklist
6. **Important Deadlines & Fees** — Current filing fees and processing timeline estimates

RULES:
- Be specific to the detected form type (I-130, I-485, I-765, N-400, etc.)
- Reference USCIS requirements accurately
- Do NOT provide legal advice or case strategy
- Always recommend consulting an immigration attorney for complex situations
- If you can't identify the form, explain what you need to provide better guidance
- Keep it practical and actionable

LANGUAGE: Respond in the same language the user writes in."""


def analyze_immigration_ai(
    document_text: str,
    form_type: Optional[str] = None,
    language: str = "en",
) -> Optional[str]:
    """AI-powered immigration document analysis."""
    client = _get_client()
    if not client:
        return None

    max_chars = 10000
    text = document_text[:max_chars]

    user_msg = f"Please analyze this immigration document:\n\n{text}"
    if form_type:
        user_msg = f"Expected form type: {form_type}\n\n{user_msg}"

    try:
        response = client.chat.completions.create(
            model=_MODEL,
            messages=[
                {"role": "system", "content": IMMIGRATION_SYSTEM_PROMPT},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=1200,
            temperature=0.3,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:
        logger.warning("Immigration AI analysis failed: %s", exc)
        return None


# ── Auto Deal Analysis AI ─────────────────────────────────────────────

AUTO_DEAL_SYSTEM_PROMPT = """You are the VitaCoreX Auto Deal Advisor — an expert in vehicle purchase analysis.

TASK: Analyze the vehicle deal numbers provided and give a thorough assessment.

YOUR OUTPUT MUST INCLUDE:
1. **Deal Summary** — Brief overview of the deal terms
2. **Price Assessment** — Is the price fair relative to MSRP? Compare to typical market discounts
3. **Fee Analysis** — Break down each fee and flag anything unusual:
   - Documentation/dealer fees (typical range: $200-$700)
   - GAP insurance (typical range: $400-$800, flagged if over $1,000)
   - Extended warranty (typical range: $1,500-$2,500, flagged if over $3,000)
   - Other add-ons
4. **Financing Assessment** — Evaluate the APR and loan terms
5. **Monthly Payment Check** — Verify the payment calculation
6. **Negotiation Tips** — Specific suggestions for what to negotiate down
7. **Overall Verdict** — 🟢 Good Deal / 🟡 Fair Deal / 🔴 Overpriced + explanation

RULES:
- Be specific with dollar amounts and percentages
- Compare to industry averages where possible
- Provide concrete negotiation talking points
- This is deal intelligence, NOT financial advice
- Be direct about unfair fees or pricing

LANGUAGE: Respond in the same language the user writes in."""


def analyze_auto_deal_ai(
    deal_data: dict,
    language: str = "en",
) -> Optional[str]:
    """AI-powered auto deal analysis."""
    client = _get_client()
    if not client:
        return None

    # Format deal data into readable text
    parts = ["Vehicle Deal Details:"]
    field_labels = {
        "msrp": "MSRP",
        "agreed_price": "Agreed Price",
        "doc_fee": "Documentation Fee",
        "gap_insurance": "GAP Insurance",
        "extended_warranty": "Extended Warranty",
        "apr": "APR (%)",
        "loan_term": "Loan Term (months)",
        "down_payment": "Down Payment",
        "trade_in": "Trade-In Value",
        "other_fees": "Other Fees/Add-ons",
        "vehicle": "Vehicle",
        "year": "Year",
        "make": "Make",
        "model": "Model",
    }
    for key, label in field_labels.items():
        val = deal_data.get(key)
        if val is not None and val != "" and val != 0:
            if key in ("msrp", "agreed_price", "doc_fee", "gap_insurance",
                       "extended_warranty", "down_payment", "trade_in", "other_fees"):
                parts.append(f"- {label}: ${val:,.2f}" if isinstance(val, (int, float)) else f"- {label}: ${val}")
            elif key == "apr":
                parts.append(f"- {label}: {val}%")
            else:
                parts.append(f"- {label}: {val}")

    user_msg = "\n".join(parts)
    user_msg += "\n\nPlease provide a comprehensive deal analysis."

    try:
        response = client.chat.completions.create(
            model=_MODEL,
            messages=[
                {"role": "system", "content": AUTO_DEAL_SYSTEM_PROMPT},
                {"role": "user", "content": user_msg},
            ],
            max_tokens=1000,
            temperature=0.4,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:
        logger.warning("Auto deal AI analysis failed: %s", exc)
        return None
