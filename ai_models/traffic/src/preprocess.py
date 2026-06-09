
from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent

# CHANGED: Use final_dataset.csv instead of live_traffic.csv
RAW_DATA_PATH = BASE_DIR.parent / "data" / "raw" / "final_dataset.csv"

PROCESSED_DATA_PATH = (
    BASE_DIR.parent
    / "data"
    / "processed"
    / "processed_traffic.csv"
)

FEATURE_COLUMNS = [
    "current_speed",
    "free_flow_speed",
    "travel_time",
    "area",
]

TARGET_COLUMN = "congestion_ratio"


def preprocess_traffic_data(
    source_path: Path = RAW_DATA_PATH,
) -> pd.DataFrame:

    df = pd.read_csv(source_path)

    print("Dataset Shape:", df.shape)

    # Timestamp features
    if "timestamp" in df.columns:
        df["timestamp"] = pd.to_datetime(
            df["timestamp"],
            errors="coerce"
        )

        df["hour"] = (
            df["timestamp"]
            .dt.hour
            .fillna(0)
            .astype(int)
        )

        df["day_of_week"] = (
            df["timestamp"]
            .dt.dayofweek
            .fillna(0)
            .astype(int)
        )

        df["is_weekend"] = (
            df["day_of_week"] >= 5
        ).astype(int)

    # Create congestion ratio if missing
    if TARGET_COLUMN not in df.columns:

        safe_speed = (
            df["free_flow_speed"]
            .replace(0, np.nan)
        )

        df[TARGET_COLUMN] = (
            (
                df["free_flow_speed"]
                - df["current_speed"]
            )
            / safe_speed
        ).fillna(0.0).clip(
            lower=0.0,
            upper=1.0
        )

    # Clean area
    df["area"] = (
        df["area"]
        .fillna("unknown")
        .astype(str)
    )


    # ========================== # Create Future Congestion Target # ========================== 
    df = df.sort_values( ["area", "timestamp"] 
    ) 
    df["future_congestion"] = ( df.groupby("area")["congestion_ratio"] .shift(-6)
                               
                               
    ) 
    df.dropna( subset=["future_congestion"], inplace=True
    ) 
    print( 
        "After future target creation:",
          df.shape 
    )

    # Save processed data
    PROCESSED_DATA_PATH.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    df.to_csv(
        PROCESSED_DATA_PATH,
        index=False
    )

    return df


if __name__ == "__main__":

    processed = preprocess_traffic_data()

    print("\nPreprocessing complete")
    print("Final Shape:", processed.shape)
    print(processed.head())

