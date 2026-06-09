from __future__ import annotations

from datetime import datetime
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from predictor import classify_congestion, predict_latest_sample
from train import FEATURE_COLUMNS, MODEL_PATH


app = FastAPI(
    title="Traffic Congestion Model API",
    version="1.0.0",
    description="FastAPI service for the GenWin traffic congestion model.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TrafficSample(BaseModel):
    area: str = Field(..., examples=["MP Nagar"])
    current_speed: float = Field(..., ge=0)
    free_flow_speed: float = Field(..., ge=0)
    travel_time: float = Field(..., ge=0)
    timestamp: datetime | None = None


def load_model():
    if not MODEL_PATH.exists():
        raise HTTPException(
            status_code=503,
            detail=f"Model artifact not found at {MODEL_PATH}. Run train.py first.",
        )

    return joblib.load(MODEL_PATH)


def build_feature_frame(sample: TrafficSample) -> pd.DataFrame:
    timestamp = sample.timestamp or datetime.now()
    hour = timestamp.hour
    day_of_week = timestamp.weekday()
    is_weekend = 1 if day_of_week >= 5 else 0

    return pd.DataFrame(
        [
            {
                "hour": hour,
                "day_of_week": day_of_week,
                "is_weekend": is_weekend,
                "area": sample.area,
                "current_speed": sample.current_speed,
                "free_flow_speed": sample.free_flow_speed,
                "travel_time": sample.travel_time,
            }
        ],
        columns=FEATURE_COLUMNS,
    )


@app.get("/health")
def health() -> dict[str, str | bool]:
    return {
        "status": "ok",
        "model_ready": MODEL_PATH.exists(),
        "model_path": str(MODEL_PATH),
    }


@app.get("/predict/latest")
def predict_latest() -> dict[str, float | str]:
    try:
        return predict_latest_sample()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/predict")
def predict_sample(sample: TrafficSample) -> dict[str, float | str]:
    try:
        model = load_model()
        feature_frame = build_feature_frame(sample)
        prediction = float(model.predict(feature_frame)[0])

        return {
            "predicted_congestion_ratio": prediction,
            "severity": classify_congestion(prediction),
        }
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)