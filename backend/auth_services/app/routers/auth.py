from fastapi import (
    APIRouter,
    Depends
)

from shared.constants import Roles

from sqlalchemy.ext.asyncio import AsyncSession

from shared.db import get_db

from auth_services.app.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest,
    RefreshRequest,
    ChangeRoleRequest
)

from auth_services.app.services.auth_service import (
    register_user,
    login_user,
    refresh_access_token,
    logout_user,
    update_user_role
)

from auth_services.app.dependencies.auth import get_current_user

from auth_services.app.middleware.rbac import require_roles


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/register")
async def register(
    payload: RegisterRequest,
    db: AsyncSession = Depends(get_db)
):

    return await register_user(
        payload,
        db
    )


@router.post("/login")
async def login(
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db)
):

    return await login_user(
        payload,
        db
    )


@router.post("/refresh")
async def refresh(
    payload: RefreshRequest,
    db: AsyncSession = Depends(get_db)
):

    return await refresh_access_token(
        payload.refresh_token,
        db
    )


@router.post("/logout")
async def logout(
    payload: RefreshRequest,
    db: AsyncSession = Depends(get_db)
):

    return await logout_user(
        payload.refresh_token,
        db
    )


@router.get("/me")
async def get_me(
    current_user = Depends(get_current_user)
):

    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role
    }


@router.get("/admin-only")
async def admin_only(
    current_user = Depends(
        require_roles([
            Roles.ADMINISTRATOR
        ])
    )
):

    return {
        "message": "Admin access granted",
        "user": current_user.email
    }


@router.put("/users/{user_id}/role")
async def change_role(

    user_id: str,
    payload: ChangeRoleRequest,

    db: AsyncSession = Depends(get_db),

    current_user = Depends(
        require_roles([Roles.ADMINISTRATOR])
    )

):

    return await update_user_role(
        user_id,
        payload.role,
        db
    )