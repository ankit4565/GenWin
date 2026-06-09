import random
import string
from datetime import datetime
from uuid import UUID
from fastapi import HTTPException
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from grievances_services.app.models.grievance import Grievance, GrievanceSupport
from auth_services.app.models.user import User

async def create_grievance(db: AsyncSession, title: str, description: str, category: str, department: str, citizen_id: UUID) -> Grievance:
    """
    Creates a new citizen grievance.
    Generates a unique ticket number formatted as GRV-YYYYMMDD-XXXX (4 random digits)
    and sets the initial status to SUBMITTED and priority to LOW.
    """
    # Generate a unique ticket number
    date_prefix = datetime.utcnow().strftime("%Y%m%d")
    random_digits = "".join(random.choices(string.digits, k=4))
    ticket_number = f"GRV-{date_prefix}-{random_digits}"

    db_grievance = Grievance(
        ticket_number=ticket_number,
        citizen_id=citizen_id,
        title=title,
        description=description,
        category=category,
        department=department,
        status="SUBMITTED",
        priority="LOW"
    )

    db.add(db_grievance)
    await db.commit()
    await db.refresh(db_grievance)
    return db_grievance

async def recalculate_grievance_priority(db: AsyncSession, grievance_id: UUID) -> str:
    """
    Recalculates and updates the priority of a grievance based on the number of supports:
    - Under 3 supports: LOW
    - 3 to 5 supports: MEDIUM
    - 6 or more supports: HIGH
    """
    # Count the number of supports for this grievance
    count_query = await db.execute(
        select(func.count(GrievanceSupport.id)).where(GrievanceSupport.grievance_id == grievance_id)
    )
    support_count = count_query.scalar() or 0

    # Classify priority according to the rules
    if support_count >= 6:
        priority = "HIGH"
    elif support_count >= 3:
        priority = "MEDIUM"
    else:
        priority = "LOW"

    # Update priority field in database
    grievance = await db.get(Grievance, grievance_id)
    if grievance:
        grievance.priority = priority
        await db.commit()
        await db.refresh(grievance)
    
    return priority

async def support_grievance(db: AsyncSession, grievance_id: UUID, citizen_id: UUID) -> dict:
    """
    Allows a citizen to support (upvote) a complaint.
    Uses toggle behavior:
    - If the user already supports the grievance, their support is removed.
    - If the user doesn't support it, a new support record is added.
    Triggers dynamic priority recalculation.
    """
    # Check if the grievance exists
    grievance = await db.get(Grievance, grievance_id)
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")

    # Query if support record already exists
    result = await db.execute(
        select(GrievanceSupport).where(
            GrievanceSupport.grievance_id == grievance_id,
            GrievanceSupport.citizen_id == citizen_id
        )
    )
    existing_support = result.scalar()

    if existing_support:
        # User already supports it, so remove it (toggle off)
        await db.delete(existing_support)
        action = "removed"
    else:
        # Add a new support record (toggle on)
        new_support = GrievanceSupport(
            grievance_id=grievance_id,
            citizen_id=citizen_id
        )
        db.add(new_support)
        action = "added"

    await db.commit()

    # Recalculate priority dynamically
    new_priority = await recalculate_grievance_priority(db, grievance_id)

    # Count total support records
    count_query = await db.execute(
        select(func.count(GrievanceSupport.id)).where(GrievanceSupport.grievance_id == grievance_id)
    )
    total_supports = count_query.scalar() or 0

    return {
        "success": True,
        "action": action,
        "priority": new_priority,
        "supports_count": total_supports
    }

async def assign_grievance(db: AsyncSession, grievance_id: UUID, assigned_to: UUID) -> Grievance:
    """
    Assigns a grievance to a respective authority (officer).
    Automatically moves the status to UNDER_REVIEW if it was in SUBMITTED state.
    """
    grievance = await db.get(Grievance, grievance_id)
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")

    # Update assigned officer
    grievance.assigned_to = assigned_to
    
    # Progress status if it was just submitted
    if grievance.status == "SUBMITTED":
        grievance.status = "UNDER_REVIEW"

    await db.commit()
    await db.refresh(grievance)
    return grievance

async def update_grievance_status(db: AsyncSession, grievance_id: UUID, status: str, current_user: User) -> Grievance:
    """
    Updates the status of a grievance.
    Can only be performed by a Super Admin / City Admin, or the assigned authority.
    Automatically sets resolved_at if status changes to RESOLVED.
    """
    grievance = await db.get(Grievance, grievance_id)
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")

    # Authorization check
    is_admin = current_user.role in ["SUPER_ADMIN", "CITY_ADMIN"]
    is_assigned = grievance.assigned_to == current_user.id
    if not (is_admin or is_assigned):
        raise HTTPException(status_code=403, detail="Not authorized to update this grievance status")

    # Normalize status string
    status = status.upper()
    valid_statuses = ["SUBMITTED", "UNDER_REVIEW", "IN_PROGRESS", "RESOLVED", "REJECTED"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")

    grievance.status = status
    if status == "RESOLVED":
        grievance.resolved_at = datetime.utcnow()
    else:
        # Clear resolved timestamp if reverted
        grievance.resolved_at = None

    await db.commit()
    await db.refresh(grievance)
    return grievance

async def submit_grievance_feedback(db: AsyncSession, grievance_id: UUID, rating: int, citizen_id: UUID) -> Grievance:
    """
    Allows the citizen who raised the complaint to provide star-rating feedback (1 to 5)
    once the grievance has been resolved.
    """
    grievance = await db.get(Grievance, grievance_id)
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")

    # Ensure rating is within valid bounds
    if rating < 1 or rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    # Authorize: Only the creator of the grievance can rate it
    if grievance.citizen_id != citizen_id:
        raise HTTPException(status_code=403, detail="Only the citizen who raised this complaint can submit feedback")

    # Enforce status precondition
    if grievance.status != "RESOLVED":
        raise HTTPException(status_code=400, detail="Feedback can only be provided for RESOLVED grievances")

    grievance.rating = rating
    await db.commit()
    await db.refresh(grievance)
    return grievance

async def get_department_ratings(db: AsyncSession) -> list:
    """
    Calculates the performance rating of each department.
    Calculates the average rating (out of 5 stars) from all rated resolved complaints.
    """
    result = await db.execute(
        select(
            Grievance.department,
            func.avg(Grievance.rating).label("average_rating"),
            func.count(Grievance.rating).label("total_feedbacks")
        )
        .where(Grievance.rating.isnot(None))
        .group_by(Grievance.department)
    )

    ratings = []
    for row in result.all():
        ratings.append({
            "department": row.department,
            "average_rating": float(round(row.average_rating, 2)),
            "total_feedbacks": int(row.total_feedbacks)
        })
    
    return ratings
