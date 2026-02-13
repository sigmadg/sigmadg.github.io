# Salud

## Workflow: Recordatorios de citas y flujo de consentimientos

**Archivo:** `workflow-recordatorios-consentimientos.json`

### Objetivo

Enviar recordatorios de citas (SMS/Email) y solicitar o registrar consentimientos informados antes de la cita.

### Flujo

1. **Schedule** — Cada mañana (ej. 08:00).
2. **Base de datos / API** — Citar citas del día siguiente que no tengan recordatorio enviado.
3. **Loop / Split** — Un ítem por cita.
4. **IF** — ¿Consentimiento ya firmado? Si no, enviar enlace al formulario.
5. **Email / Twilio** — Recordatorio de cita + enlace de consentimiento si aplica.
6. **Update BD** — Marcar “recordatorio enviado” y “consentimiento enviado”.

### Configuración

- Credenciales: PostgreSQL/MySQL, SMTP o Twilio, opcional API de formularios (Typeform, Tally).
- Cumplimiento: guardar logs de envío y de aceptación de consentimiento (LOPD/GDPR según jurisdicción).

### Extensión posible

- Webhook que reciba el “consentimiento firmado” y actualice la BD y envíe confirmación al paciente.
