from fastapi import APIRouter
from shared.traffic_data import get_traffic_geojson

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
async def get_traffic_data():
    """
    Returns live GeoJSON traffic density features for Bhopal road segments.
    """
    return get_traffic_geojson()

