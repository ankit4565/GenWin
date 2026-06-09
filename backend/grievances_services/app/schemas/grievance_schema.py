from pydantic import BaseModel, Field, conint
from uuid import UUID
from datetime import datetime
from typing import Optional, List

class GrievanceCreate(BaseModel):
    """
    Pydantic schema for creating a new grievance complaint.
    """
    title: str = Field(..., min_length=3, max_length=200, description="Brief summary of the issue")
    description: str = Field(..., min_length=10, description="Detailed description of the problem")
    category: str = Field(..., min_length=2, max_length=50, description="General category of the grievance")
    department: str = Field(..., min_length=2, max_length=50, description="Responsible department name")

class GrievanceResponse(BaseModel):
    """
    Pydantic schema representing the response body for a grievance complaint.
    Note: 'assigned_to' will be returned as UUID or hidden dynamically based on client authorization.
    """
    id: UUID
    ticket_number: str
    citizen_id: Optional[UUID]
    title: str
    description: str
    category: str
    department: str
    priority: str
    status: str
    created_at: datetime
    resolved_at: Optional[datetime] = None
    rating: Optional[int] = None
    supports_count: int = 0
    is_supported_by_me: bool = False
    
    # Respective authority assigned to this complaint
    assigned_to: Optional[UUID] = None

    class Config:
        from_attributes = True

class GrievanceAssign(BaseModel):
    """
    Pydantic schema for assigning an authority (officer) to a grievance.
    """
    assigned_to: UUID = Field(..., description="UUID of the officer/authority to assign")

class GrievanceStatusUpdate(BaseModel):
    """
    Pydantic schema for updating the status of a grievance.
    """
    status: str = Field(..., description="One of: SUBMITTED, UNDER_REVIEW, IN_PROGRESS, RESOLVED, REJECTED")

class GrievanceFeedback(BaseModel):
    """
    Pydantic schema for citizen feedback rating. Must be between 1 and 5 stars.
    """
    rating: conint(ge=1, le=5) = Field(..., description="Star rating feedback from 1 to 5")

class DepartmentRatingResponse(BaseModel):
    """
    Pydantic schema for department performance ratings.
    """
    department: str
    average_rating: float = Field(..., description="Average rating score")
    total_feedbacks: int = Field(..., description="Total number of ratings submitted")
