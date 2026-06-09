from fastapi import APIRouter

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
