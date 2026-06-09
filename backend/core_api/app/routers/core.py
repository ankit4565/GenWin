from fastapi import APIRouter

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
