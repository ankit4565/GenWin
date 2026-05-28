import uuid
from datetime import datetime

from sqlalchemy import (
    Column,
    String,
    Boolean,
    ForeignKey,
    DateTime
)

from sqlalchemy.dialects.postgresql import UUID

from shared.db import Base


class RefreshToken(Base):
    """
    SQLAlchemy model representing the 'refresh_tokens' table.
    Used for storing hashed refresh tokens to allow session management and revocation.
    """
    __tablename__ = "refresh_tokens"

    # Unique token record identifier
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    # Reference to the user who owns this token (Cascade delete if user is removed)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    # SHA256 hashed refresh token string to prevent database compromises from exposing active tokens
    token_hash = Column(
        String,
        unique=True,
        nullable=False
    )

    # Expiration datetime of the refresh token
    expires_at = Column(
        DateTime,
        nullable=False
    )

    # Revocation status flag (True if session was logged out or revoked)
    revoked = Column(
        Boolean,
        default=False
    )

    # Token creation timestamp
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )