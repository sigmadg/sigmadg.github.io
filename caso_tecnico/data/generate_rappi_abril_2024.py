#!/usr/bin/env python3
"""Genera Excel sintético abril 2024 (misma estructura que rappi_delivery_case_data.xlsx)."""

from pathlib import Path

import numpy as np
import pandas as pd

DATA_DIR = Path(__file__).resolve().parent
OUT_XLSX = DATA_DIR / "rappi_data_abril_2024.xlsx"
REF_XLSX = DATA_DIR / "rappi_delivery_case_data.xlsx"

RAW_COLUMNS = [
    "COUNTRY",
    "DATE",
    "HOUR",
    "CITY",
    "ZONE",
    "CONNECTED_RT",
    "ORDERS",
    "EARNINGS",
    "PRECIPITATION_MM",
]

# 1. Configuración básica
zonas = [
    "Centro",
    "Mitras Centro",
    "Apodaca Centro",
    "Escobedo",
    "Carretera Nacional",
    "MTY_Apodaca_Huinalá",
    "San Nicolás",
    "Santa Catarina",
    "San Pedro",
    "Cumbres Poniente",
    "La Fe",
    "MTY_Guadalupe",
    "Independencia",
    "Tec",
]
fechas_abril = pd.date_range(start="2024-04-01", end="2024-04-30")
horas = list(range(24))

data_list = []

# 2. Generación de datos sintéticos basados en patrones de marzo
np.random.seed(42)

for fecha in fechas_abril:
    es_fin_de_semana = 1 if fecha.weekday() >= 5 else 0
    for hora in horas:
        lluvia_prob = np.random.choice([0, 0.5, 2.5, 5.0], p=[0.85, 0.10, 0.04, 0.01])

        for zona in zonas:
            base_orders = 8 if es_fin_de_semana else 5
            hora_pico = 5 if hora in [13, 14, 19, 20, 21] else 0
            orders = max(0, int(np.random.poisson(base_orders + hora_pico)))

            rt_base = orders + np.random.randint(-2, 4)
            if lluvia_prob > 2:
                rt_base = max(1, rt_base - 3)

            connected_rt = max(1, rt_base)
            earnings = round(orders * np.random.uniform(45, 60), 1)

            data_list.append(
                {
                    "COUNTRY": "Mexico",
                    "DATE": fecha.strftime("%Y-%m-%d"),
                    "HOUR": hora,
                    "CITY": "Monterrey",
                    "ZONE": zona,
                    "CONNECTED_RT": connected_rt,
                    "ORDERS": orders,
                    "EARNINGS": earnings,
                    "PRECIPITATION_MM": lluvia_prob,
                }
            )

df_abril = pd.DataFrame(data_list)
df_abril = df_abril[RAW_COLUMNS]
df_abril["DATE"] = pd.to_datetime(df_abril["DATE"])

with pd.ExcelWriter(OUT_XLSX, engine="openpyxl") as writer:
    df_abril.to_excel(writer, sheet_name="RAW_DATA", index=False)
    if REF_XLSX.is_file():
        pd.read_excel(REF_XLSX, sheet_name="ZONE_INFO").to_excel(
            writer, sheet_name="ZONE_INFO", index=False
        )
        pd.read_excel(REF_XLSX, sheet_name="ZONE_POLYGONS").to_excel(
            writer, sheet_name="ZONE_POLYGONS", index=False
        )

print(f"Dataset generado: {OUT_XLSX}")
if REF_XLSX.is_file():
    print("(Incluye ZONE_INFO y ZONE_POLYGONS copiados del caso.)")
else:
    print(f"(Solo RAW_DATA; para las otras hojas coloca {REF_XLSX.name} en data/.)")
print(df_abril.head())
