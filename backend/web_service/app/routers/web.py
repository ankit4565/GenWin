from fastapi import APIRouter

router = APIRouter(
    prefix="/web",
    tags=["Web Service"]
)

@router.get("/status")
async def get_status():
    return {
        "status": "ok",
        "service": "web_service"
    }
