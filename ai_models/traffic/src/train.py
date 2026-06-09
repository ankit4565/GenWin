from __future__ import annotations

import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from preprocess import preprocess_traffic_data


BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR.parent / "artifacts"
MODEL_PATH = MODEL_DIR / "traffic_congestion_model.joblib"
METRICS_PATH = MODEL_DIR / "traffic_congestion_metrics.json"

TARGET_COLUMN = "future_congestion"
FEATURE_COLUMNS = [
    
    "hour",
    "day_of_week",
    "is_weekend",
    "area",
    "current_speed",
	"free_flow_speed",
    "travel_time",
]
	 


def build_pipeline() -> Pipeline:
	numeric_features = [
		 "hour",
         "day_of_week",
         "is_weekend",
         "current_speed",
         "free_flow_speed",
         "travel_time",
		 
	]
		
	
	categorical_features = ["area"]

	preprocessor = ColumnTransformer(
		transformers=[
			(
				"numeric",
				Pipeline([
					("imputer", SimpleImputer(strategy="median")),
				]),
				numeric_features,
			),
			(
				"categorical",
				Pipeline([
					("imputer", SimpleImputer(strategy="most_frequent")),
					("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False)),
				]),
				categorical_features,
			),
		]
	)

	return Pipeline(
		steps=[
			("preprocessor", preprocessor),
			("model", RandomForestRegressor(n_estimators=200, random_state=42, n_jobs=-1)),
		]
	)


def train_model() -> dict[str, float]:
	data = preprocess_traffic_data()
	training_frame = data.dropna(subset=[TARGET_COLUMN]).copy()

	features = training_frame[FEATURE_COLUMNS]
	target = training_frame[TARGET_COLUMN]

	X_train, X_test, y_train, y_test = train_test_split(
		features,
		target,
		test_size=0.2,
		random_state=42,
	)

	pipeline = build_pipeline()
	pipeline.fit(X_train, y_train)

	predictions = pipeline.predict(X_test)

	metrics = {
		"mae": float(mean_absolute_error(y_test, predictions)),
		"rmse": float(np.sqrt(mean_squared_error(y_test, predictions))),
		"r2": float(r2_score(y_test, predictions)),
		"rows_trained": int(len(training_frame)),
	}

	MODEL_DIR.mkdir(parents=True, exist_ok=True)
	joblib.dump(pipeline, MODEL_PATH)

	with METRICS_PATH.open("w", encoding="utf-8") as metrics_file:
		json.dump(metrics, metrics_file, indent=2)

	return metrics


if __name__ == "__main__":
	metrics = train_model()
	print("Training complete")
	print(json.dumps(metrics, indent=2))
