import pandas as pd
import numpy as np
from datetime import datetime, timedelta

areas = ["MP Nagar", "New Market", "Kolar Road"]

data = []

start = datetime(2025, 1, 1)

for i in range(10000):

    current_time = start + timedelta(minutes=5 * i)

    hour = current_time.hour

    for area in areas:

        # Peak traffic hours
        if 8 <= hour <= 11 or 17 <= hour <= 21:
            current_speed = np.random.randint(10, 30)
        else:
            current_speed = np.random.randint(30, 50)

        free_flow_speed = np.random.randint(40, 55)

        travel_time = np.random.randint(300, 1200)

        congestion_ratio = (
            free_flow_speed - current_speed
        ) / free_flow_speed

        data.append({
            "timestamp": current_time,
            "area": area,
            "current_speed": current_speed,
            "free_flow_speed": free_flow_speed,
            "travel_time": travel_time,
            "congestion_ratio": congestion_ratio
        })

df = pd.DataFrame(data)

df.to_csv(
    "../data/raw/synthetic_traffic.csv",
    index=False
)

print("Synthetic dataset generated!")
print("Shape:", df.shape)