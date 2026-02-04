#!/usr/bin/env python3
"""
Aplicación web para generar un dataset JSONL a partir de transcripciones
de una lista de reproducción de YouTube. Usa core.py para la lógica.
"""

import json
from flask import Flask, render_template, request, Response, jsonify

from core import (
    pipeline_events,
    events_to_ndjson_bytes,
    extract_playlist_video_ids,
    apply_range,
    generate_docs_only,
)

app = Flask(__name__)
MAX_VIDEOS_PER_PLAYLIST = 100


def _parse_range_params(data):
    def _to_int(v):
        if v is None or v == "":
            return None
        try:
            n = int(v)
            return n if n >= 1 else None
        except (TypeError, ValueError):
            return None
    start_1based = _to_int(data.get("start_video") or data.get("start_index"))
    end_1based = _to_int(data.get("end_video") or data.get("end_index"))
    return start_1based, end_1based


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/generate-stream", methods=["POST"])
def api_generate_stream():
    """Genera el dataset y emite logs en tiempo real (NDJSON)."""
    data = request.get_json(silent=True) or request.form
    playlist_url = (data.get("playlist_url") or "").strip()
    if not playlist_url:
        return jsonify({"error": "Falta playlist_url"}), 400
    max_videos = int(data.get("max_videos", MAX_VIDEOS_PER_PLAYLIST) or MAX_VIDEOS_PER_PLAYLIST)
    max_videos = min(max(1, max_videos), 200)
    start_1based, end_1based = _parse_range_params(data)

    def stream():
        for chunk in events_to_ndjson_bytes(
            pipeline_events(playlist_url, max_videos, start_1based, end_1based)
        ):
            yield chunk

    return Response(
        stream(),
        mimetype="application/x-ndjson",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.route("/api/generate", methods=["POST"])
def api_generate():
    """Genera el dataset JSONL y lo devuelve como descarga."""
    data = request.get_json(silent=True) or request.form
    playlist_url = (data.get("playlist_url") or "").strip()
    if not playlist_url:
        return jsonify({"error": "Falta playlist_url"}), 400
    max_videos = int(data.get("max_videos", MAX_VIDEOS_PER_PLAYLIST) or MAX_VIDEOS_PER_PLAYLIST)
    max_videos = min(max(1, max_videos), 200)
    start_1based, end_1based = _parse_range_params(data)

    playlist_id, _title, video_list = extract_playlist_video_ids(playlist_url, max_videos=9999)
    if playlist_id is None:
        return jsonify({"error": video_list or "No se pudo extraer la playlist."}), 400
    if isinstance(video_list, str):
        return jsonify({"error": video_list}), 400
    if not video_list:
        return jsonify({"error": "No se encontraron videos en la playlist."}), 400
    to_process = apply_range(video_list, max_videos, start_1based, end_1based)

    def stream():
        for doc in generate_docs_only(playlist_id, to_process):
            yield json.dumps(doc, ensure_ascii=False).encode("utf-8") + b"\n"

    return Response(
        stream(),
        mimetype="application/x-ndjson",
        headers={
            "Content-Disposition": "attachment; filename=dataset_transcripciones.jsonl",
            "Cache-Control": "no-cache",
        },
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
