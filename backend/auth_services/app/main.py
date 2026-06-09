from fastapi import FastAPI
import sys
import os

from fastapi.middleware.cors import CORSMiddleware

# Add the backend root directory to sys.path to allow importing the 'shared' module
# regardless of where uvicorn is executed from.
backend_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.insert(0, backend_root)

# Import the authentication router from the routers module
from auth_services.app.routers.auth import router as auth_router

# Import the global exception handler from shared module
from shared.exceptions import (
    global_exception_handler
)

# Initialize the FastAPI application for the Auth Service
app = FastAPI(
    title="Auth Service"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the authentication router in the application
app.include_router(auth_router)

# Register the global exception handler for unhandled exceptions
app.add_exception_handler(
    Exception,
    global_exception_handler
)


@app.get("/")
async def root():
    """
    Root endpoint to verify that the Auth Service is running.
    """
    return {
        "message": "Auth Service Running"
    }