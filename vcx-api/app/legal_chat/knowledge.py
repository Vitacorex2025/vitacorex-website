from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Optional

KB_DIR = Path(__file__).resolve().parent.parent.parent / "knowledge"


@dataclass
class Chunk:
    topic: str
    title: str
    text: str
    source: str


TOPIC_KEYWORDS = {
    "contracts": {
        "contract", "agreement", "clause", "terms", "terminate", "termination",
        "renewal", "fee", "liability", "indemnity", "nda", "vendor", "client",
    },
    "immigration_packets": {
        "uscis", "i-130", "i-485", "i-765", "packet", "evidence", "rfe",
        "immigration", "biometrics", "affidavit", "sponsor", "petition",
    },
    "auto_deal_review": {
        "dealer", "apr", "monthly", "doc fee", "warranty", "gap", "financing",
        "auto", "car", "vehicle", "loan", "payment", "trade-in",
    },
    "florida_official_sources": {
        "sunpass", "toll", "citation", "traffic", "clerk", "florida", "court",
        "county", "pacer", "record", "portal",
    },
}

OUT_OF_SCOPE_KEYWORDS = {
    "criminal", "arrest", "custody", "divorce", "domestic violence", "eviction",
    "bankruptcy", "asylum emergency", "deportation emergency", "appeal deadline",
    "injunction", "sue", "lawsuit strategy", "trial", "hearing tomorrow",
}

REQUIRES_STATE = {"contracts", "auto_deal_review", "florida_official_sources"}


def _normalize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z0-9\-']+", text.lower())


def _load_chunks() -> list[Chunk]:
    chunks: list[Chunk] = []
    if not KB_DIR.exists():
        return chunks

    for path in sorted(KB_DIR.glob("*.md")):
        topic = path.stem
        raw = path.read_text(encoding="utf-8")
        parts = re.split(r"^##\s+", raw, flags=re.MULTILINE)
        if not parts:
            continue

        preface = parts[0].strip()
        if preface:
            chunks.append(Chunk(topic=topic, title="Overview", text=preface, source=path.name))

        for part in parts[1:]:
            lines = part.strip().splitlines()
            if not lines:
                continue
            title = lines[0].strip()
            text = "\n".join(lines[1:]).strip()
            if text:
                chunks.append(Chunk(topic=topic, title=title, text=text, source=path.name))
    return chunks


CHUNKS = _load_chunks()


def detect_out_of_scope(message: str) -> bool:
    lower = message.lower()
    return any(keyword in lower for keyword in OUT_OF_SCOPE_KEYWORDS)


def infer_topic(message: str) -> Optional[str]:
    tokens = set(_normalize(message))
    best_topic = None
    best_score = 0
    for topic, keywords in TOPIC_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in message.lower() or kw in tokens)
        if score > best_score:
            best_topic = topic
            best_score = score
    return best_topic if best_score >= 2 else None


def topic_needs_state(topic: Optional[str]) -> bool:
    return topic in REQUIRES_STATE


def retrieve(topic: str, message: str, limit: int = 4) -> list[Chunk]:
    tokens = set(_normalize(message))
    scored: list[tuple[int, Chunk]] = []
    for chunk in CHUNKS:
        if chunk.topic != topic:
            continue
        haystack = f"{chunk.title}\n{chunk.text}".lower()
        score = sum(1 for token in tokens if token in haystack)
        if score > 0:
            scored.append((score, chunk))
    scored.sort(key=lambda item: item[0], reverse=True)
    return [chunk for _, chunk in scored[:limit]]


def summarize_chunks(chunks: Iterable[Chunk]) -> tuple[list[str], list[str]]:
    bullets: list[str] = []
    sources: list[str] = []
    for chunk in chunks:
        first_sentences = re.split(r"(?<=[.!?])\s+", chunk.text.strip())
        snippet = " ".join(first_sentences[:2]).strip()
        bullets.append(f"{chunk.title}: {snippet}")
        if chunk.source not in sources:
            sources.append(chunk.source)
    return bullets, sources
