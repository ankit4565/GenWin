from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    """
    Pydantic schema for user registration requests.
    Validates input data types and ensures valid email structure.
    """
    email: EmailStr
    full_name: str
    password: str


class LoginRequest(BaseModel):
    """
    Pydantic schema for user login requests.
    """
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    """
    Pydantic schema for access token refresh requests.
    """
    refresh_token: str


class ChangeRoleRequest(BaseModel):
    """
    Pydantic schema to request a user role update.
    """
    role: str