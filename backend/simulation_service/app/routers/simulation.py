from fastapi import APIRouter

router = APIRouter(
    prefix="/simulation",
    tags=["Simulation"]
)

@router.get("/status")
async def get_status():
    return {
        "status": "ok",
        "service": "simulation_service"
    }
