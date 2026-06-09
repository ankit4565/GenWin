from __future__ import annotations

import os
from datetime import datetime
from pathlib import Path

import pandas as pd
import requests
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parents[3]
RAW_DATA_PATH = BASE_DIR.parent / "data" / "raw" / "live_traffic.csv"

POINTS = [
    ("MP Nagar", "23.2330,77.4340"),
    ("New Market", "23.2324,77.4015"),
    ("Kolar Road", "23.1660,77.4530"),
]
CSV_COLUMNS = [
    "timestamp",
    "area",
    "current_speed",
    "free_flow_speed",
    "current_travel_time",
    "free_flow_travel_time",
    "confidence",
]
load_dotenv(PROJECT_ROOT / ".env")
API_KEY = os.getenv("TOMTOM_API_KEY")


def append_rows(rows: list[dict[str, object]]) -> None:
    incoming = pd.DataFrame(rows, columns=CSV_COLUMNS)

    if RAW_DATA_PATH.exists():
        existing = pd.read_csv(RAW_DATA_PATH)

        for column in CSV_COLUMNS:
            if column not in existing.columns:
                existing[column] = pd.NA

        existing = existing[CSV_COLUMNS]
        combined = pd.concat([existing, incoming], ignore_index=True)
    else:
        combined = incoming

    RAW_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    combined.to_csv(RAW_DATA_PATH, index=False)


def collect_once() -> None:
    if not API_KEY:
        raise RuntimeError("TOMTOM_API_KEY is not configured")

    rows: list[dict[str, object]] = []

    for area, point in POINTS:
        url = "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json"
        params = {"key": API_KEY, "point": point}

        try:
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
        except requests.exceptions.RequestException as exc:
            print(f"Network Error for {area}: {exc}")
            continue

        data_json = response.json()
        flow_segment = data_json.get("flowSegmentData")
        if not flow_segment:
            print(f"API Error for {area}: {data_json}")
            continue

        rows.append(
            {
                "timestamp": datetime.now().isoformat(timespec="seconds"),
                "area": area,
                "current_speed": flow_segment.get("currentSpeed"),
                "free_flow_speed": flow_segment.get("freeFlowSpeed"),
                "current_travel_time": flow_segment.get("currentTravelTime"),
                "free_flow_travel_time": flow_segment.get("freeFlowTravelTime"),
                "confidence": flow_segment.get("confidence"),
            }
        )

    if not rows:
        print("No valid traffic data received")
        return

    print("CSV Exists Before Save:", RAW_DATA_PATH.exists())
    print(pd.DataFrame(rows).head())

    append_rows(rows)
    print("Saved batch")


if __name__ == "__main__":
    collect_once()

