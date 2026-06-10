from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from auth_services.app.models.user import User
from auth_services.app.models.refresh_tokens import RefreshToken

from auth_services.app.utils.password import (
    hash_password,
    verify_password
)

from auth_services.app.utils.token_hash import hash_token

from shared.jwt_utils import (
    create_access_token,
    create_refresh_token,
    verify_token
)

from shared.redis_client import redis_client


async def register_user(payload, db: AsyncSession):
    """
    Registers a new user in the database.
    Checks if email already exists and hashes the password before storing.
    """
    result = await db.execute(
        select(User).where(
            User.email == payload.email
        )
    )

    existing_user = result.scalar()

    # Check if a user with this email is already registered
    if existing_user:

        return {
            "success": False,
            "message": "Email already exists"
        }

    # Create user record with hashed password
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(
            payload.password
        )
    )

    db.add(user)

    await db.commit()

    await db.refresh(user)

    return {
        "success": True,
        "message": "User registered successfully"
    }


async def login_user(payload, db: AsyncSession):
    """
    Authenticates a user using email and password.
    Generates Access and Refresh Tokens, stores the hashed Refresh Token in Postgres,
    and caches the active session in Redis.
    """
    result = await db.execute(
        select(User).where(
            User.email == payload.email
        )
    )

    user = result.scalar()

    # Validate email presence
    if not user:

        return {
            "success": False,
            "message": "Invalid credentials"
        }

    # Validate password hash match
    if not verify_password(
        payload.password,
        user.password_hash
    ):

        return {
            "success": False,
            "message": "Invalid credentials"
        }

    # Generate cryptographically signed JWT keys
    access_token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    refresh_token = create_refresh_token({
        "sub": str(user.id),
        "role": user.role
    })

    # Record the refresh token hash in database for validation/revocation tracking
    db_token = RefreshToken(
        user_id=user.id,
        token_hash=hash_token(refresh_token),
        expires_at=datetime.utcnow() + timedelta(days=7)
    )

    db.add(db_token)

    await db.commit()

    # Store/Cache active session token in Redis with 24 hours expiry time
    # Wrapped in try/except to ensure login doesn't fail if Redis is down locally
    try:
        await redis_client.set(
            f"session:{user.id}",
            access_token,
            ex=86400
        )
    except Exception as e:
        print(f"Failed to cache session in Redis: {e}")

    return {
        "success": True,
        "access_token": access_token,
        "refresh_token": refresh_token
    }


async def refresh_access_token(
    refresh_token: str,
    db: AsyncSession
):
    """
    Validates a Refresh Token and generates a new Access and Refresh Token pair (Token Rotation).
    Revokes the old Refresh Token in the process to prevent replay attacks.
    """
    payload = verify_token(refresh_token)

    # Basic signature validation
    if not payload:

        return {
            "success": False,
            "message": "Invalid refresh token"
        }

    # Validate type claim is refresh
    if payload.get("type") != "refresh":

        return {
            "success": False,
            "message": "Invalid token type"
        }

    hashed = hash_token(refresh_token)

    # Verify presence of the token hash and ensure it is not already revoked
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token_hash == hashed,
            RefreshToken.revoked == False
        )
    )

    stored_token = result.scalar()

    if not stored_token:

        return {
            "success": False,
            "message": "Refresh token revoked"
        }

    # Revoke the old refresh token (Token Rotation)
    stored_token.revoked = True

    # Generate new Access/Refresh tokens
    new_access_token = create_access_token({
        "sub": payload["sub"],
        "role": payload["role"]
    })

    new_refresh_token = create_refresh_token({
        "sub": payload["sub"],
        "role": payload["role"]
    })

    # Store new refresh token hash
    new_db_token = RefreshToken(
        user_id=stored_token.user_id,
        token_hash=hash_token(new_refresh_token),
        expires_at=datetime.utcnow() + timedelta(days=7)
    )

    db.add(new_db_token)

    await db.commit()

    return {
        "success": True,
        "access_token": new_access_token,
        "refresh_token": new_refresh_token
    }


async def logout_user(
    refresh_token: str,
    db: AsyncSession
):
    """
    Logs out the user by revoking their Refresh Token in the database.
    """
    hashed = hash_token(refresh_token)

    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token_hash == hashed
        )
    )

    token = result.scalar()

    # Revoke the token record
    if token:

        token.revoked = True

        await db.commit()

    return {
        "success": True,
        "message": "Logged out successfully"
    }


async def update_user_role(
    user_id,
    role,
    db
):
    """
    Updates the role of a user. (Only ADMINISTRATOR users have authority to access this logic).
    """
    result = await db.execute(
        select(User).where(
            User.id == user_id
        )
    )

    user = result.scalar()

    if not user:

        return {
            "success": False,
            "message": "User not found"
        }

    # Update role field
    user.role = role

    await db.commit()

    return {
        "success": True,
        "message": "Role updated successfully"
    }
