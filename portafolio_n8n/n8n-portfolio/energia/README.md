# Energía

## Workflow: Lecturas de medidores y alertas de consumo

**Archivo:** `workflow-lecturas-alertas-consumo.json`

### Objetivo

Recibir o consultar lecturas de medidores (smart meters), guardarlas en BD y disparar alertas cuando el consumo supere umbrales o patrones anómalos.

### Flujo

1. **Schedule** — Cada hora (o cada 15 min).
2. **HTTP / API IoT** — Obtener lecturas de medidores (o Webhook si el concentrador envía datos a n8n).
3. **Set / Code** — Normalizar formato (medidor_id, kWh, timestamp).
4. **BD** — Insertar lecturas en tabla de historial.
5. **IF / Code** — Comparar con umbral del contrato o con consumo medio del cliente; si supera X %, marcar alerta.
6. **Slack / Email** — Notificar al cliente o al equipo comercial (riesgo de exceso en factura).

### Configuración

- Credenciales: API del sistema de medidores, PostgreSQL/InfluxDB, Slack o SMTP.
- Umbrales por tipo de contrato o por cliente en BD o en variables del workflow.

### Extensión posible

- Dashboard (Grafana, Metabase) leyendo la misma BD; o enviar resumen semanal por email.
