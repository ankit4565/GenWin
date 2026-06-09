from fastapi import APIRouter

router = APIRouter(
    prefix="/chatbot",
    tags=["Chatbot"]
)

@router.get("/status")
async def get_status():
    return {
        "status": "ok",
        "service": "chatbot_service"
    }
