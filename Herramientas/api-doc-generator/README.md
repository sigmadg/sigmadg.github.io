# OpenAPI YAML → PDF

Página web que toma un YAML OpenAPI (como los de ejemplo en esta carpeta) y genera un PDF con:

- **Nombre de la API**
- Por cada **recurso** (path + método):
  - **Headers** (nombre, tipo, requerido)
  - **Atributos del body** (nombre, tipo de dato, regex/pattern)
  - **Códigos de respuesta** (código y descripción)

## Cómo usar

1. Abre `index.html` en el navegador (doble clic o arrastra al navegador).
2. Pega el contenido de tu archivo YAML OpenAPI en el cuadro de texto.
   - También puedes usar **"Cargar ejemplo"** para cargar un YAML de muestra.
3. Pulsa **"Generar PDF"**.
4. Se descargará un PDF con el nombre de la API (por ejemplo `adizes-users-management-v1.pdf`).

## YAML soportado

- OpenAPI 3.0.x
- Esquemas con `$ref` a `#/components/schemas/...` (se resuelven para mostrar propiedades del body).
- Si un atributo tiene `pattern` en el schema, se muestra como regex en el PDF.

## Ejecutar con servidor local (opcional)

Si quieres cargar YAML desde archivos de la carpeta padre (por ejemplo los `.yaml` de Arquitectura), sirve la carpeta con un servidor:

```bash
cd api-doc-generator
python3 -m http.server 8080
```

Luego abre: http://localhost:8080
