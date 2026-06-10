from fastapi import APIRouter, Depends
from shared.drainage_data import get_drainage_geojson, get_blockages_geojson
from auth_services.app.dependencies.auth import get_current_user

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
async def get_drainage_data(current_user = Depends(get_current_user)):
    """
    Returns GeoJSON network for Bhopal stormwater drains, manholes and culverts.
    """
    return get_drainage_geojson()

@router.get("/blockages")
async def get_blockage_data(current_user = Depends(get_current_user)):
    """
    Returns GeoJSON feature collection of active blockages and overflows in drainage lines.
    """
    return get_blockages_geojson()


