"""
Lógica compartida para generar dataset desde playlist de YouTube.
Usado por Flask (app.py) y por la función serverless (Vercel).
"""

import json
import re
from typing import Generator

import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)

from normalize import normalize_youtube_document

MAX_VIDEOS_DEFAULT = 100


def extract_playlist_video_ids(playlist_url: str, max_videos: int = 9999):
    """Obtiene los IDs de video de una playlist de YouTube con yt-dlp."""
    opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": True,
        "skip_download": True,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(playlist_url, download=False)
    if not info:
        return None, None, "No se pudo extraer información de la playlist."
    entries = info.get("entries") or []
    playlist_id = info.get("id") or "unknown"
    video_ids = []
    for e in entries:
        if e is None:
            continue
        vid = e.get("id")
        if vid:
            video_ids.append((vid, (e.get("title") or "").strip()))
        if len(video_ids) >= max_videos:
            break
    return playlist_id, info.get("title") or "playlist", video_ids


def fetch_transcript(video_id: str):
    """Obtiene la transcripción de un video. Retorna texto unificado o None."""
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(
            video_id, languages=["es", "es-419", "en", "en-US"]
        )
    except (TranscriptsDisabled, NoTranscriptFound, VideoUnavailable, Exception):
        return None
    if not transcript_list:
        return None
    parts = [seg.get("text", "").strip() for seg in transcript_list if seg.get("text")]
    text = " ".join(parts)
    return clean_transcript_text(text)


def clean_transcript_text(text: str) -> str:
    """Limpia el texto de la transcripción."""
    if not text:
        return ""
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def apply_range(video_list: list, max_videos: int, start_1based: int | None, end_1based: int | None):
    """Devuelve la sublista a procesar según rango (1-based) o máximo."""
    n = len(video_list)
    if start_1based is not None and end_1based is not None:
        start_1based = max(1, min(start_1based, n))
        end_1based = max(start_1based, min(end_1based, n))
        return video_list[start_1based - 1 : end_1based]
    if start_1based is not None:
        start_1based = max(1, min(start_1based, n))
        return video_list[start_1based - 1 : start_1based - 1 + max_videos]
    if end_1based is not None:
        end_1based = max(1, min(end_1based, n))
        return video_list[0:end_1based]
    return video_list[:max_videos]


def pipeline_events(
    playlist_url: str,
    max_videos: int,
    start_1based: int | None = None,
    end_1based: int | None = None,
) -> Generator[dict, None, None]:
    """
    Generador de eventos: {type: "log"|"doc"|"done"|"error", ...}.
    Usado por Flask (streaming) y por Vercel (acumular y devolver).
    """
    yield {"type": "log", "msg": "Obteniendo lista de videos de la playlist…"}
    playlist_id, _title, video_list = extract_playlist_video_ids(playlist_url, max_videos=9999)
    if playlist_id is None:
        yield {"type": "error", "msg": video_list or "No se pudo extraer la playlist."}
        return
    if isinstance(video_list, str):
        yield {"type": "error", "msg": video_list}
        return
    if not video_list:
        yield {"type": "error", "msg": "No se encontraron videos en la playlist."}
        return

    to_process = apply_range(video_list, max_videos, start_1based, end_1based)
    total = len(to_process)
    range_msg = ""
    if (start_1based is not None or end_1based is not None) and to_process:
        first_idx = video_list.index(to_process[0]) + 1
        last_idx = video_list.index(to_process[-1]) + 1
        range_msg = f" (rango: videos {first_idx}–{last_idx})"
    yield {"type": "log", "msg": f"Encontrados {len(video_list)} videos. Procesando {total}{range_msg}."}

    chunk_idx = 0
    for i, (video_id, title) in enumerate(to_process, 1):
        short_title = (title[:50] + "…") if len(title) > 50 else title
        yield {"type": "log", "msg": f"[{i}/{total}] Descargando transcripción: {short_title or video_id}"}
        text = fetch_transcript(video_id)
        if not text or len(text) < 10:
            yield {"type": "log", "msg": "  → Sin transcripción o texto muy corto, se omite."}
            continue
        yield {"type": "log", "msg": f"  → OK ({len(text)} caracteres). Normalizando…"}
        doc = normalize_youtube_document(
            text=text,
            video_id=video_id,
            playlist_id=playlist_id,
            chunk_idx=chunk_idx,
            title=title,
        )
        if doc:
            yield {"type": "doc", "doc": doc}
            chunk_idx += 1
    yield {"type": "done", "count": chunk_idx}


def events_to_ndjson_bytes(events: Generator[dict, None, None]) -> Generator[bytes, None, None]:
    """Convierte eventos a líneas NDJSON en bytes (para Flask streaming)."""
    for ev in events:
        yield json.dumps(ev, ensure_ascii=False).encode("utf-8") + b"\n"


def generate_docs_only(playlist_id: str, to_process: list) -> Generator[dict, None, None]:
    """Genera solo documentos normalizados (sin eventos log). Para descarga directa."""
    chunk_idx = 0
    for video_id, title in to_process:
        text = fetch_transcript(video_id)
        if not text or len(text) < 10:
            continue
        doc = normalize_youtube_document(
            text=text,
            video_id=video_id,
            playlist_id=playlist_id,
            chunk_idx=chunk_idx,
            title=title,
        )
        if doc:
            yield doc
            chunk_idx += 1
