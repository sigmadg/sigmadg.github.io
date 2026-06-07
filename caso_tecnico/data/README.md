# Datos

Coloca aquí `rappi_delivery_case_data.xlsx` (incluido en la raíz del proyecto como copia).

En el código Python (M2, M3, Django, recalibración) la ruta se toma de **`RAPPI_DATA_PATH`** o **`CASO_DATA_XLSX`** en `.env` (relativa a la raíz del repo o absoluta); si no están definidas, se usa `data/rappi_delivery_case_data.xlsx`. Los notebooks del Módulo 1 pueden seguir localizando el Excel por convención; si quieres el mismo criterio, define `RAPPI_DATA_PATH` y lee el mismo path desde el kernel.

**Validación Excel ↔ notebook:** importa `modulo1_diagnostico/excel/VBA_RappiMacros.bas` en una copia del libro guardada como `.xlsm` y sigue `modulo1_diagnostico/excel/README_MACROS.md`.
