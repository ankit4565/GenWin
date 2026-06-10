from fastapi import APIRouter
from shared.heatmap_data import get_heatmap_geojson

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get("/status")
async def get_status():
    return {
        "status": "ok",
        "service": "analytics_service"
    }

@router.get("/heatmap")
async def get_heatmap_data():
    """
    Returns standard GeoJSON FeatureCollection of composite city heatmap indicators.
    """
    return get_heatmap_geojson()

@router.get("/heatmap/{heatmap_type}")
async def get_filtered_heatmap_data(heatmap_type: str):
    """
    Returns standard GeoJSON FeatureCollection of filtered heatmap indicators by type.
    Allowed types: 'grievance', 'traffic', 'flooding', 'pollution'.
    """
    return get_heatmap_geojson(layer_type=heatmap_type)

