from fastapi import APIRouter

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
