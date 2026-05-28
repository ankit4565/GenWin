import uuid

from sqlalchemy import Column, String, Boolean
from sqlalchemy.dialects.postgresql import UUID

from shared.db import Base

class User(Base):
    """
    SQLAlchemy model representing the 'users' table in PostgreSQL.
    """
    __tablename__ = "users"

    # Unique user identifier (UUIDv4)
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Unique user email
    email = Column(String, unique=True, nullable=False)

    # User's full name
    full_name = Column(String, nullable=False)

    # Hashed version of the password
    password_hash = Column(String, nullable=False)

    # User's role for authorization (defaults to 'CITIZEN')
    role = Column(String, default="CITIZEN")

    # Flag indicating whether the account is active
    is_active = Column(Boolean, default=True)
