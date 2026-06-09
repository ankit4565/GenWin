from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession
)
from sqlalchemy.orm import declarative_base

from shared.config import settings

# Create the asynchronous SQLAlchemy engine using the async database URL
# echo=True prints out all executed SQL statements for development debugging
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True
)

# Async session factory to generate new asynchronous sessions for database operations
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False  # Do not expire attributes after commit to allow using models out of session context
)

# Base class for all SQLAlchemy declarative models
Base = declarative_base()

async def get_db():
    """
    Dependency generator to yield an async database session.
    Automatically handles session closing once the request/operation lifecycle ends.
    """
    async with AsyncSessionLocal() as session:
        yield session
