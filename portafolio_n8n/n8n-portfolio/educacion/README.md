# Educación (EdTech)

## Workflow: Inscripciones y envío de certificados

**Archivo:** `workflow-inscripciones-certificados.json`

### Objetivo

Al completar un curso (evento desde LMS o BD), generar y enviar el certificado por email y registrar la emisión en base de datos.

### Flujo

1. **Webhook / Schedule** — Recibir evento “curso completado” o ejecutar diariamente y buscar graduados del día.
2. **BD** — Obtener datos del alumno y del curso (nombre, email, curso, fecha).
3. **HTTP / Google Docs / PDF** — Generar certificado (plantilla + datos) o llamar a servicio de PDF.
4. **Set** — Preparar asunto y cuerpo del email con enlace o adjunto.
5. **Email** — Enviar certificado al alumno.
6. **BD** — Actualizar registro: certificado_emitido = true, fecha_emision.

### Configuración

- Credenciales: BD (PostgreSQL/MySQL), servicio de generación de PDF o Google Docs, SMTP.
- Plantilla de certificado con placeholders (nombre, curso, fecha).

### Extensión posible

- Subir certificado a almacenamiento (S3) y guardar URL en BD; enlace de descarga en el email.
