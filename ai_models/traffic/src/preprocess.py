
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import joblib

# Load dataset
df = pd.read_csv("../data/raw/live_traffic.csv")

print(df.head())

# Feature engineering
df["congestion_ratio"] = (
    df["free_flow_speed"] - df["current_speed"]
) / df["free_flow_speed"]

# Select features
features = [
    "current_speed",
    "free_flow_speed",
    "current_travel_time",
    "free_flow_travel_time",
    "confidence",
    "congestion_ratio"
]

scaler = MinMaxScaler()

df[features] = scaler.fit_transform(df[features])

# Save processed data
df.to_csv(
    "../data/processed/processed_traffic.csv",
    index=False
)

# Save scaler
joblib.dump(
    scaler,
    "../artifacts/scaler.pkl"
)

print("Preprocessing complete")
print(df.head())

