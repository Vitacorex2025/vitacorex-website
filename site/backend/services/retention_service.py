
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class RetentionPolicy:
    source_files_days: int = 30
    generated_outputs_days: int = 365
    keep_evidence_if_user_requests: bool = True
    purge_after_successful_generation: bool = False


def current_policy() -> RetentionPolicy:
    return RetentionPolicy()


def policy_payload() -> dict[str, object]:
    policy = current_policy()
    return {
        "source_files_days": policy.source_files_days,
        "generated_outputs_days": policy.generated_outputs_days,
        "keep_evidence_if_user_requests": policy.keep_evidence_if_user_requests,
        "purge_after_successful_generation": policy.purge_after_successful_generation,
    }
