"""
Función serverless para Vercel: genera dataset desde playlist (sin servidor 24/7).
POST body: { playlist_url, max_videos?, start_video?, end_video? }
Respuesta: NDJSON (log, doc, done, error). Límite 30 videos en serverless.
"""
import json
import os
import sys

# Permitir importar core y normalize desde la raíz del proyecto
_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _root not in sys.path:
    sys.path.insert(0, _root)

from http.server import BaseHTTPRequestHandler


def _parse_body(body_bytes):
    try:
        return json.loads(body_bytes.decode("utf-8")) if body_bytes else {}
    except Exception:
        return {}


def _to_int(v):
    if v is None or v == "":
        return None
    try:
        n = int(v)
        return n if n >= 1 else None
    except (TypeError, ValueError):
        return None


# Límite en serverless (tiempo y tamaño de respuesta)
MAX_VIDEOS_SERVERLESS = 30


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        path = (self.path or "").split("?")[0]
        if path != "/api/generate_stream" and path != "/api/generate-stream" and "generate_stream" not in path and "generate-stream" not in path:
            self.send_response(404)
            self.end_headers()
            return
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length else b""
        data = _parse_body(body)
        playlist_url = (data.get("playlist_url") or "").strip()
        if not playlist_url:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Falta playlist_url"}).encode("utf-8"))
            return

        max_videos = min(
            int(data.get("max_videos") or 30),
            MAX_VIDEOS_SERVERLESS,
        )
        max_videos = max(1, max_videos)
        start_1based = _to_int(data.get("start_video") or data.get("start_index"))
        end_1based = _to_int(data.get("end_video") or data.get("end_index"))

        try:
            from core import pipeline_events
        except ImportError:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Error al cargar core"}).encode("utf-8"))
            return

        events = []
        for ev in pipeline_events(playlist_url, max_videos, start_1based, end_1based):
            events.append(ev)
            if ev.get("type") == "error":
                break

        ndjson = "\n".join(json.dumps(e, ensure_ascii=False) for e in events)
        self.send_response(200)
        self.send_header("Content-Type", "application/x-ndjson")
        self.send_header("Cache-Control", "no-cache")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(ndjson.encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
