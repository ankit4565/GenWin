import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables and the .env file.
    Utilizes Pydantic Settings for automated loading, parsing, and type validation.
    """
    # Database connection URIs
    DATABASE_URL: str          # Async connection (e.g. postgresql+asyncpg://...)
    SYNC_DATABASE_URL: str     # Synchronous connection (e.g. postgresql://...)

    # File paths to the RSA cryptographic keys used for JWT signing and verification
    JWT_PRIVATE_KEY: str
    JWT_PUBLIC_KEY: str

    # JWT configuration parameters
    JWT_ALGORITHM: str = "RS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    class Config:
        # Load environment variables from the .env file located in the parent directory (backend/.env)
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")

# Instantiate settings to be imported across the project
settings = Settings()
