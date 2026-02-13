# Aeroespacial

## Workflow: Monitoreo de telemetría y alertas de mantenimiento

**Archivo:** `workflow-telemetria-mantenimiento.json`

### Objetivo

Automatizar la supervisión de datos de telemetría (o simulados) y generar alertas cuando se superen umbrales, con notificación a equipos de mantenimiento.

### Flujo

1. **Trigger (Schedule)** — Ejecución cada X minutos para simular chequeos periódicos.
2. **HTTP Request / API** — Obtener datos de telemetría (temperatura, vibración, presión).
3. **IF** — Evaluar si algún parámetro supera umbrales definidos.
4. **Set / Formatear** — Preparar mensaje de alerta con ID de equipo y valores.
5. **Slack / Email / PagerDuty** — Enviar alerta al equipo de mantenimiento.

### Configuración

- Credenciales: API de telemetría (o mock), Slack/Email.
- Ajustar expresión en el nodo IF según tus umbrales (ej. `{{ $json.temperature }} > 85`).

### Extensión posible

- Integrar con sistema de órdenes de trabajo (crear ticket automático cuando hay alerta).
