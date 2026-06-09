import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure the backend directory is in the path for shared module and sub-services imports
backend_root = os.path.dirname(os.path.abspath(__file__))
if backend_root not in sys.path:
    sys.path.insert(0, backend_root)

# Import global exception handler
from shared.exceptions import global_exception_handler

# Import service routers
from auth_services.app.routers.auth import router as auth_router
from analytics_service.app.routers.analytics import router as analytics_router
from chatbot_service.app.routers.chatbot import router as chatbot_router
from core_api.app.routers.core import router as core_router
from drainage_service.app.routers.drainage import router as drainage_router
from simulation_service.app.routers.simulation import router as simulation_router
from traffic_service.app.routers.traffic import router as traffic_router
from web_service.app.routers.web import router as web_router
from grievances_services.app.routers.grievance import router as grievances_router

# Initialize the unified application server
server = FastAPI(
    title="GenWin Unified Server",
    description="Unified API Gateway routing to all GenWin services",
    version="1.0.0"
)

# Register CORS middleware to allow frontend connectivity
server.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register global exception handler
server.add_exception_handler(Exception, global_exception_handler)

# Include all service routers
server.include_router(auth_router)
server.include_router(analytics_router)
server.include_router(chatbot_router)
server.include_router(core_router)
server.include_router(drainage_router)
server.include_router(simulation_router)
server.include_router(traffic_router)
server.include_router(web_router)
server.include_router(grievances_router)

@server.get("/")
async def root():
    """
    Root endpoint listing all registered services.
    """
    return {
        "message": "GenWin Unified Server is running",
        "services": [
            "auth_service",
            "analytics_service",
            "chatbot_service",
            "core_api",
            "drainage_service",
            "simulation_service",
            "traffic_service",
            "web_service",
            "grievances_service"
        ]
    }

@server.get("/health")
async def health():
    """
    Generic health check endpoint.
    """
    return {
        "status": "ok",
        "server": "unified_server"
    }