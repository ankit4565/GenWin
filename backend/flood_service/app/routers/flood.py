import os
import joblib
import numpy as np
import warnings
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(
    prefix="/flood",
    tags=["Flood"]
)

class FloodRiskRequest(BaseModel):
    rainfall_24h: float = Field(..., ge=0)
    rainfall_72h: float = Field(..., ge=0)
    drain_capacity: float = Field(..., ge=0)
    elevation: float = Field(...)
    soil_permeability: float = Field(..., ge=0, le=1)
    drain_condition: float = Field(..., ge=0, le=10)

class FloodRiskResponse(BaseModel):
    risk_score: float
    risk_label: str

# Resolve model path relative to backend root
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
# Current dir is: backend/flood_service/app/routers
# Model is in: ai_models/flood/artifacts/flood_model.pkl
MODEL_PATH = os.path.abspath(os.path.join(CURRENT_DIR, "..", "..", "..", "..", "ai_models", "flood", "artifacts", "flood_model.pkl"))

_model = None

def get_model():
    global _model
    if _model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        _model = joblib.load(MODEL_PATH)
    return _model

@router.get("/status")
async def get_status():
    """
    Status and configuration details of the flood service.
    """
    return {
        "status": "ok",
        "service": "flood_service",
        "model_loaded": _model is not None or os.path.exists(MODEL_PATH)
    }

@router.post("/predict", response_model=FloodRiskResponse)
async def predict(request: FloodRiskRequest):
    """
    Predict flood risk score and return categorization label based on rainfall,
    elevation, and drainage parameters.
    """
    try:
        model = get_model()
        
        # Prepare inputs as 2D numpy array
        X = np.array([[
            request.rainfall_24h,
            request.rainfall_72h,
            request.drain_capacity,
            request.elevation,
            request.soil_permeability,
            request.drain_condition
        ]])
        
        # Suppress sklearn UserWarning regarding feature names
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            risk_score = float(model.predict(X)[0])
            
        # Classify the predicted score
        if risk_score <= 2.0:
            risk_label = "Low"
        elif risk_score <= 4.0:
            risk_label = "Moderate"
        elif risk_score <= 6.0:
            risk_label = "High"
        else:
            risk_label = "Extreme"
            
        return FloodRiskResponse(risk_score=risk_score, risk_label=risk_label)
        
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failure: {exc}")
