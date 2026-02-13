# Fintech

## Workflow: Conciliación de pagos y detección de anomalías

**Archivo:** `workflow-conciliacion-pagos.json`

### Objetivo

Comparar movimientos de un proveedor de pagos (Stripe, processor, banco) con registros internos y marcar discrepancias o transacciones sospechosas.

### Flujo

1. **Schedule** — Ejecución diaria (ej. 02:00).
2. **HTTP / API** — Obtener transacciones del proveedor de pagos.
3. **HTTP / BD** — Obtener transacciones internas del mismo rango de fechas.
4. **Code (Merge/Compare)** — Conciliar por ID o monto+fecha; listar faltantes o diferencias.
5. **IF** — Si hay discrepancias, continuar.
6. **Slack / Email** — Enviar reporte a finanzas y compliance.

### Configuración

- Credenciales: API del proveedor de pagos, base de datos o API interna, Slack/Email.
- Ajustar fechas en las peticiones según zona horaria y ventana de conciliación.

### Extensión posible

- Crear incidencias en Jira/Linear y bloquear retiros si la anomalía supera un monto.
