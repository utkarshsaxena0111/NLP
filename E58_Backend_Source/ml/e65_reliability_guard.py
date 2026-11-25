"""
E65 Intent Reliability Guard
Post-inference diagnostics only.

Does not modify E58 scores, class IDs, out_of_scope flag,
weights, fusion, normalization, or prediction logic.
"""

from __future__ import annotations

import re
from typing import Any

VERSION = "E65-IRG-1.2"

_RULES = [
    (
        "banking_transfer",
        [
            r"\b(?:transfer|send|wire|move)\b.{0,55}\b(?:money|cash|funds|rupees?|inr|bank|account)\b",
            r"\b(?:money|cash|funds|rupees?|inr)\b.{0,55}\b(?:transfer|send|wire|deposit)\b",
            r"\b(?:upi|bank account|banking account)\b.{0,55}\b(?:send|pay|transfer|deposit|withdraw)\b",
            r"\b(?:send|pay|transfer|bhej(?:o|na)?|jama|nikaal(?:o)?)\b.{0,55}\b(?:paise|paisa|rupaye|rupees?|bank|upi)\b",
            r"\b(?:paise|paisa|rupaye)\b.{0,55}\b(?:bhej|transfer|jama|nikaal)\w*\b",
            r"\b(?:bank|upi)\b.{0,55}\b(?:paise|paisa|rupaye|money|funds)\b",
        ],
    ),
    (
        "loan_credit",
        [
            r"\b(?:apply|get|take|approve)\b.{0,40}\b(?:loan|credit card|personal loan|mortgage)\b",
            r"\b(?:loan|credit card|mortgage)\b.{0,40}\b(?:apply|approval|sanction|disburse)\b",
            r"\b(?:loan|karz|udhaar)\b.{0,40}\b(?:chahiye|apply|lene|mile)\b",
        ],
    ),
    (
        "bill_payment",
        [
            r"\b(?:pay|settle|clear)\b.{0,35}\b(?:electricity|water|gas|credit card|utility)\s+bill\b",
            r"\bbill\b.{0,35}\b(?:pay|settle|clear|jama)\b",
        ],
    ),
]

_COMPILED = [
    (domain, [re.compile(p, re.IGNORECASE) for p in patterns])
    for domain, patterns in _RULES
]


def _margin(result: dict[str, Any]) -> float | None:
    try:
        if result.get("margin") is not None:
            return float(result["margin"])

        top = result.get("top_intents") or []
        if len(top) >= 2:
            return float(top[0]["score"]) - float(top[1]["score"])
    except (TypeError, ValueError, KeyError):
        pass

    return None


def assess_reliability(
    query: str,
    inference: dict[str, Any],
) -> dict[str, Any]:
    """Assess reliability separately; never rewrite the E58 prediction."""

    q = str(query or "").strip()

    detected_domain = None
    for domain, patterns in _COMPILED:
        if any(pattern.search(q) for pattern in patterns):
            detected_domain = domain
            break

    intent_id = inference.get("intent_id")
    try:
        intent_id = int(intent_id)
    except (TypeError, ValueError):
        intent_id = None

    native_oos = (
        bool(inference.get("out_of_scope"))
        or intent_id == 55
    )

    agreement = inference.get("expert_agreement")
    margin = _margin(inference)

    reasons: list[str] = []

    if native_oos:
        reasons.append("native_e58_out_of_scope")

    if detected_domain:
        reasons.append(f"unsupported_domain_pattern:{detected_domain}")

    if agreement is False:
        reasons.append("neural_lexical_expert_disagreement")

    if margin is not None and margin < 0.15:
        reasons.append("low_top1_top2_decision_score_margin")

    # Only native E58 OOS or a configured unsupported-domain
    # pattern changes the guard status.
    if native_oos or detected_domain:
        status = "POTENTIALLY_UNSUPPORTED"
        action = (
            "Keep the original E58 prediction visible. "
            "Request clarification or route to a supported workflow."
        )
    else:
        status = "ACCEPTED"
        action = (
            "Present the original E58 prediction. "
            "Disagreement and margin are diagnostic signals only."
        )

    return {
        "version": VERSION,
        "status": status,
        "native_out_of_scope": native_oos,
        "triggered_reasons": reasons,
        "detected_domain": detected_domain,
        "recommended_action": action,
        "diagnostics": {
            "expert_agreement": agreement,
            "top1_top2_margin": margin,
            "margin_threshold": 0.15,
            "margin_threshold_is_provisional": True,
        },
        "prediction_unchanged": True,
    }