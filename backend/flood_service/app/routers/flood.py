from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from shared.flood_risk_data import predict_flood_risk, get_flood_risk_geojson
from auth_services.app.dependencies.auth import get_current_user

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

@router.get("/status")
async def get_status():
    """
    Status of the flood service.
    """
    return {
        "status": "ok",
        "service": "flood_service",
        "method": "deterministic_equation_logic"
    }

@router.get("/geojson")
async def get_flood_zones(current_user = Depends(get_current_user)):
    """
    Returns GeoJSON polygons of Bhopal zones with designated flood risk categories.
    """
    return get_flood_risk_geojson()

@router.post("/predict", response_model=FloodRiskResponse)
async def predict(request: FloodRiskRequest, current_user = Depends(get_current_user)):
    """
    Predict flood risk score and return categorization label based on rainfall,
    elevation, and drainage parameters using pure Python mathematical logic.
    """
    try:
        result = predict_flood_risk(
            rainfall_24h=request.rainfall_24h,
            rainfall_72h=request.rainfall_72h,
            drain_capacity=request.drain_capacity,
            elevation=request.elevation,
            soil_permeability=request.soil_permeability,
            drain_condition=request.drain_condition
        )
        return FloodRiskResponse(
            risk_score=result["risk_score"],
            risk_label=result["risk_label"]
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failure: {exc}")
