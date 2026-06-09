from fastapi import (
    Depends,
    HTTPException
)
from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from shared.db import get_db
from shared.jwt_utils import verify_token
from app.models.user import User

# Standard bearer scheme for decoding authorization header ("Bearer <token>")
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
):
    """
    Dependency to authenticate request access tokens.
    Decodes the Bearer token, validates key signature/claims, and fetches the user from DB.
    """
    token = credentials.credentials

    # Decode and verify the signature using the RS256 Public Key
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    # Ensure token claims specify it is an 'access' token, not a 'refresh' token
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=401,
            detail="Invalid access token"
        )

    user_id = payload.get("sub")

    # Fetch corresponding user from PostgreSQL database
    result = await db.execute(
        select(User).where(
            User.id == user_id
        )
    )
    user = result.scalar()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    if not user.is_active:
        raise HTTPException(
            status_code=403,
            detail="Inactive user"
    )
    return user