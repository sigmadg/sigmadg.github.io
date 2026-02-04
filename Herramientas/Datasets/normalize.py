"""
Lógica de normalización para el dataset (basada en normalize_hf_jsonl.py).
- Detección de idioma
- Etiquetado regional (heurística es-MX)
- Limpieza de PII
- Formato JSONL consistente
"""

import re
from datetime import datetime
from typing import Dict

try:
    from langdetect import detect as langdetect_detect
    from langdetect import LangDetectException
except ImportError:
    langdetect_detect = None
    LangDetectException = Exception


def detect_language(text: str) -> str:
    """Detecta el idioma del texto."""
    if not text or not text.strip():
        return "es"
    try:
        if langdetect_detect is None:
            return "es"
        lang = langdetect_detect(text)
        if lang == "es":
            return "es"
        if lang == "en":
            return "en"
        return "es"
    except Exception:
        return "es"


def tag_regional_hint(text: str, source: str) -> str:
    """Etiqueta pista regional (heurística es-MX)."""
    mx_keywords = [
        "méxico", "mexico", "mexicano", "mexicana", "cdmx", "df",
        "guadalajara", "monterrey", "puebla", "tijuana", "mérida",
        "yucatán", "jalisco", "nuevo león", "veracruz", "gob.mx",
    ]
    text_lower = text.lower()
    matches = sum(1 for kw in mx_keywords if kw in text_lower)
    if matches >= 3:
        return "high"
    if matches >= 1:
        return "med"
    return "low"


def scrub_pii(text: str) -> str:
    """Limpia PII básico: emails y teléfonos."""
    if not text:
        return text
    # Emails
    text = re.sub(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b",
        "[EMAIL]",
        text,
    )
    # Teléfonos (10 dígitos, formatos comunes)
    text = re.sub(r"\b\d{2}[\s-]?\d{4}[\s-]?\d{4}\b", "[PHONE]", text)
    return text


def normalize_youtube_document(
    text: str,
    video_id: str,
    playlist_id: str,
    chunk_idx: int,
    title: str = "",
) -> Dict:
    """
    Normaliza un documento de transcripción de YouTube al formato JSONL.
    """
    text = (text or "").strip()
    if not text:
        return None

    text = scrub_pii(text)
    language = detect_language(text)
    regional_hint = tag_regional_hint(text, f"youtube_{playlist_id}")
    source_slug = f"youtube_playlist_{playlist_id}".replace("-", "_")
    source_url = f"https://www.youtube.com/watch?v={video_id}"
    chunk_id = f"{source_slug}_{video_id}_{chunk_idx}"

    return {
        "text": text,
        "source_url": source_url,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "license": "youtube-terms",
        "regional_hint": regional_hint,
        "language": language,
        "source": source_slug,
        "chunk_id": chunk_id,
        "video_id": video_id,
        "video_title": title or "",
    }
