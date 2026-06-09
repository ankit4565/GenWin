from __future__ import annotations

from pathlib import Path

import joblib

from preprocess import RAW_DATA_PATH, preprocess_traffic_data
from train import MODEL_PATH


FEATURE_COLUMNS = [
	"hour",
	"day_of_week",
	"is_weekend",
	"area",
	"free_flow_speed",
	"current_travel_time",
	"free_flow_travel_time",
	"confidence",
]


def load_model():
	if not MODEL_PATH.exists():
		raise FileNotFoundError(f"Model artifact not found at {MODEL_PATH}. Run train.py first.")

	return joblib.load(MODEL_PATH)


def classify_congestion(ratio: float) -> str:
	if ratio < 0.2:
		return "low"
	if ratio < 0.45:
		return "moderate"
	return "high"


def predict_latest_sample(raw_path: Path | None = None) -> dict[str, float | str]:
	raw_source = raw_path if raw_path is not None else RAW_DATA_PATH
	processed = preprocess_traffic_data(raw_source)
	sample = processed[FEATURE_COLUMNS].tail(1)

	model = load_model()
	prediction = float(model.predict(sample)[0])

	return {
		"predicted_congestion_ratio": prediction,
		"severity": classify_congestion(prediction),
	}


if __name__ == "__main__":
	result = predict_latest_sample()
	print(result)
