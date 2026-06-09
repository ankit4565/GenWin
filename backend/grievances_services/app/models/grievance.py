import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    ForeignKey,
    DateTime,
    Numeric,
    Enum,
    Text,
    CheckConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from shared.db import Base

class Grievance(Base):
    """
    SQLAlchemy model representing the 'grievances' table in PostgreSQL.
    Tracks citizen complaints, their department, priority, status, assigned authority, and citizen rating feedback.
    """
    __tablename__ = "grievances"

    # Unique identifier for the grievance
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Unique ticket number generated upon grievance creation
    ticket_number = Column(String(20), unique=True, nullable=True)
    
    # The citizen who raised the complaint
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Title of the complaint
    title = Column(String(200), nullable=False)
    
    # Detailed description of the problem
    description = Column(Text, nullable=False)
    
    # Category of the complaint (e.g. sanitation, lighting)
    category = Column(String(50), nullable=False)
    
    # Department handling the complaint
    department = Column(String(50), nullable=False)
    
    # Priority level, dynamically calculated: LOW, MEDIUM, or HIGH
    priority = Column(String(20), default="LOW")
    
    # Status enum value tracking the progress of resolution
    status = Column(
        Enum('SUBMITTED', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', name='grievance_status'),
        default='SUBMITTED'
    )
    
    # The city zone where the problem is located (if applicable)
    zone_id = Column(UUID(as_uuid=True), nullable=True)
    
    # Respective authority/officer assigned to handle the complaint
    assigned_to = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # AI confidence score if automatically processed/assigned
    ai_confidence = Column(Numeric(4, 3), nullable=True)
    
    # Timestamp when the complaint was created
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Links to another complaint if this is marked as a duplicate
    duplicate_of = Column(UUID(as_uuid=True), nullable=True)
    
    # Timestamp when the complaint was resolved
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    
    # Feedback star rating (from 1 to 5) given by the citizen once resolved
    rating = Column(Integer, CheckConstraint('rating >= 1 AND rating <= 5'), nullable=True)


class GrievanceSupport(Base):
    """
    SQLAlchemy model representing the 'grievance_supports' table.
    Tracks citizens who support/upvote a specific complaint to calculate its dynamic priority.
    """
    __tablename__ = "grievance_supports"

    # Unique identifier for the support record
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # The grievance being supported
    grievance_id = Column(UUID(as_uuid=True), ForeignKey("grievances.id", ondelete="CASCADE"), nullable=False)
    
    # The citizen who supports this grievance
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Timestamp when support was added
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
