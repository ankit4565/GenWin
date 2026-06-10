from fastapi import APIRouter, Depends
from shared.infrastructure_data import get_infrastructure_geojson
from auth_services.app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/core",
    tags=["Core API"]
)

@router.get("/status")
async def get_status():
    return {
        "status": "ok",
        "service": "core_api"
    }

@router.get("/infrastructure/geojson")
async def get_infrastructure_data(current_user = Depends(get_current_user)):

    """
    Returns GeoJSON assets (bridges, dams, public buildings) and ongoing construction projects in Bhopal.
    """
    return get_infrastructure_geojson()

