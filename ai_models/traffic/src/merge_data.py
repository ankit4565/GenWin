import pandas as pd
import numpy as np

# Load datasets
historical = pd.read_csv("../data/raw/traffic_data.csv")
live = pd.read_csv("../data/raw/live_traffic.csv")
synthetic = pd.read_csv("../data/raw/synthetic_traffic.csv")

# ===========================
# Historical Dataset Conversion
# ===========================

historical["timestamp"] = pd.date_range(
    start="2025-01-01",
    periods=len(historical),
    freq="h"
)

historical["area"] = np.random.choice(
    ["MP Nagar", "New Market", "Kolar Road"],
    size=len(historical)
)

historical["current_speed"] = historical["avg_speed"]

historical["free_flow_speed"] = (
    historical["avg_speed"] + historical["density"] * 0.5
).clip(lower=40)

historical["travel_time"] = (
    1000 / historical["avg_speed"]
).clip(lower=60)

historical["congestion_ratio"] = (
    historical["density"] / 100
)

historical = historical[
    [
        "timestamp",
        "area",
        "current_speed",
        "free_flow_speed",
        "travel_time",
        "congestion_ratio",
    ]
]

# ===========================
# Live Dataset Conversion
# ===========================

live["congestion_ratio"] = (
    live["free_flow_speed"] - live["current_speed"]
) / live["free_flow_speed"]

live = live[
    [
        "timestamp",
        "area",
        "current_speed",
        "free_flow_speed",
        "travel_time",
        "congestion_ratio",
    ]
]

# ===========================
# Synthetic Dataset
# ===========================

synthetic = synthetic[
    [
        "timestamp",
        "area",
        "current_speed",
        "free_flow_speed",
        "travel_time",
        "congestion_ratio",
    ]
]

# ===========================
# Merge Everything
# ===========================

combined = pd.concat(
    [historical, live, synthetic],
    ignore_index=True
)

combined.drop_duplicates(inplace=True)

combined.to_csv(
    "../data/raw/final_dataset.csv",
    index=False
)

print("Historical:", historical.shape)
print("Live:", live.shape)
print("Synthetic:", synthetic.shape)
print("Final Dataset:", combined.shape)

print("\nDataset merged successfully!")