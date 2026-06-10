from fastapi import APIRouter, Depends
from shared.traffic_data import get_traffic_geojson
from auth_services.app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/traffic",
    tags=["Traffic"]
)

@router.get("/status")
async def get_status():
    return {
        "status": "ok",
        "service": "traffic_service"
    }

@router.get("/geojson")
async def get_traffic_data(current_user = Depends(get_current_user)):
    """
    Returns live GeoJSON traffic density features for Bhopal road segments.
    """
    return get_traffic_geojson()

