from fastapi import APIRouter
from shared.drainage_data import get_drainage_geojson, get_blockages_geojson

router = APIRouter(
    prefix="/drainage",
    tags=["Drainage"]
)

@router.get("/status")
async def get_status():
    return {
        "status": "ok",
        "service": "drainage_service"
    }

@router.get("/geojson")
async def get_drainage_data():
    """
    Returns GeoJSON network for Bhopal stormwater drains, manholes and culverts.
    """
    return get_drainage_geojson()

@router.get("/blockages")
async def get_blockage_data():
    """
    Returns GeoJSON feature collection of active blockages and overflows in drainage lines.
    """
    return get_blockages_geojson()

