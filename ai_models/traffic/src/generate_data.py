import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

rows = []

start = datetime(2025, 1, 1)

for i in range(90 * 24):

    dt = start + timedelta(hours=i)

    hour = dt.hour
    day = dt.weekday()

    is_weekend = 1 if day >= 5 else 0

    rainfall = np.random.uniform(0, 30)

    # Peak traffic hours
    if 8 <= hour <= 10 or 17 <= hour <= 19:
        density = random.randint(70, 100)

    # Night traffic
    elif 1 <= hour <= 5:
        density = random.randint(10, 30)

    # Normal traffic
    else:
        density = random.randint(40, 70)

    speed = max(10, 80 - density + random.randint(-5, 5))

    rows.append({
        "hour": hour,
        "day": day,
        "is_weekend": is_weekend,
        "rainfall_mm": rainfall,
        "density": density,
        "avg_speed": speed
    })

df = pd.DataFrame(rows)

df.to_csv(
    "../data/raw/traffic_data.csv",
    index=False
)

print("Traffic dataset generated successfully")
print(df.head())