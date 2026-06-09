
import requests
import pandas as pd
import time
import os
from datetime import datetime

API_KEY = os.getenv("TOMTOM_API_KEY")

POINTS = [
    ("MP Nagar", "23.2330,77.4340"),
    ("New Market", "23.2324,77.4015"),
    ("Kolar Road", "23.1660,77.4530"),
]

csv_path = "../data/raw/live_traffic.csv"

while True:

    rows = []

    for area, point in POINTS:

        url = "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json"

        params = {
            "key": API_KEY,
            "point": point
        }

        response = requests.get(url, params=params)

        data_json = response.json()

        # Error handling
        if "flowSegmentData" not in data_json:
            print("API Error:", data_json)
            continue

        data = data_json["flowSegmentData"]

        rows.append({
            "timestamp": datetime.now(),
            "area": area,
            "current_speed": data["currentSpeed"],
            "free_flow_speed": data["freeFlowSpeed"],
            "travel_time": data["currentTravelTime"]
        })

    df = pd.DataFrame(rows)

    df.to_csv(
        csv_path,
        mode="a",
        header=not os.path.exists(csv_path),
        index=False
    )

    print("Saved batch")

    time.sleep(300)

