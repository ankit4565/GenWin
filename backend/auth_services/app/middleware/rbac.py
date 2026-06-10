from fastapi import Depends, HTTPException
from shared.constants import Roles
from auth_services.app.dependencies.auth import get_current_user

def require_roles(allowed_roles: list):
    """
    FastAPI dependency factory to restrict endpoint access to specific roles.
    """
    async def role_checker(
        current_user = Depends(get_current_user)
    ):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )
        return current_user
    return role_checker

# Helper dependencies for role verification
require_citizen = require_roles([Roles.CITIZEN])
require_officer = require_roles([Roles.OFFICER])
require_admin = require_roles([Roles.ADMINISTRATOR])