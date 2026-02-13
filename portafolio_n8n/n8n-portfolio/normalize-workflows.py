#!/usr/bin/env python3
"""
Normaliza todos los workflows del portafolio para que se abran correctamente en n8n local:
- Quita referencias a credenciales (evita errores "credential not found" al importar)
- Quita webhookId fijo (n8n asigna uno nuevo al importar)
- Mantiene estructura y conexiones intactas
"""
import json
import os
from pathlib import Path

BASE = Path(__file__).resolve().parent

def normalize_node(node):
    """Elimina credentials y webhookId del nodo."""
    if "credentials" in node:
        del node["credentials"]
    if "webhookId" in node:
        del node["webhookId"]
    return node

def normalize_workflow(path):
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    data["nodes"] = [normalize_node(n.copy()) for n in data["nodes"]]
    data["meta"] = data.get("meta") or {}
    data["meta"]["templateCredsSetupCompleted"] = True
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("OK", path.relative_to(BASE))

def main():
    for j in BASE.rglob("workflow-*.json"):
        normalize_workflow(j)

if __name__ == "__main__":
    main()
