from datetime import datetime, timedelta
from jose import jwt, JWTError
import secrets
import os

from shared.config import settings

# Resolve the backend root directory (parent of 'shared' directory)
backend_root = os.path.dirname(os.path.dirname(__file__))

# Load cryptographic keys from local file system during application boot
with open(os.path.join(backend_root, settings.JWT_PRIVATE_KEY), "r") as f:
    PRIVATE_KEY = f.read()

with open(os.path.join(backend_root, settings.JWT_PUBLIC_KEY), "r") as f:
    PUBLIC_KEY = f.read()

ALGORITHM = settings.JWT_ALGORITHM

def create_access_token(data: dict):
    """
    Generate an asymmetric RS256-signed Access Token.
    Includes user identification, role, type (access), and expiration time.
    """
    payload = data.copy()

    # Set expiration time (short-lived)
    payload["exp"] = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload["type"] = "access"

    return jwt.encode(
        payload,
        PRIVATE_KEY,
        algorithm=ALGORITHM
    )

def create_refresh_token(data: dict):
    """
    Generate an asymmetric RS256-signed Refresh Token.
    Includes type (refresh) and a secure, unique token identifier (jti) to track and revoke sessions.
    """
    payload = data.copy()

    # Set expiration time (long-lived)
    payload["exp"] = datetime.utcnow() + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    payload["type"] = "refresh"
    
    # Generate unique identifier for refresh token tracking (jti claim)
    payload["jti"] = secrets.token_hex(16)

    return jwt.encode(
        payload,
        PRIVATE_KEY,
        algorithm=ALGORITHM
    )

def verify_token(token: str):
    """
    Decode and verify a JWT using the RS256 Public Key.
    Returns the parsed payload if valid, otherwise returns None.
    """
    try:
        payload = jwt.decode(
            token,
            PUBLIC_KEY,
            algorithms=[ALGORITHM]
        )
        return payload
    except JWTError:
        return None
