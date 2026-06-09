from fastapi import APIRouter

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
