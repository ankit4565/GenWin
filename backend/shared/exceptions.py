from fastapi.responses import JSONResponse
from fastapi import Request

async def global_exception_handler(
    request: Request,
    exc: Exception
):
    """
    Global handler to intercept unhandled application exceptions.
    Ensures the client receives a structured JSON error response instead of a raw stack trace.
    """
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": str(exc)
        }
    )
