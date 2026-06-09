from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from uuid import UUID

from shared.db import get_db
from shared.constants import Roles
from auth_services.app.dependencies.auth import get_current_user
from auth_services.app.middleware.rbac import require_roles
from auth_services.app.models.user import User

from grievances_services.app.models.grievance import Grievance, GrievanceSupport
from grievances_services.app.schemas.grievance_schema import (
    GrievanceCreate,
    GrievanceResponse,
    GrievanceAssign,
    GrievanceStatusUpdate,
    GrievanceFeedback,
    DepartmentRatingResponse
)
from grievances_services.app.services import grievance_service

router = APIRouter(
    prefix="/grievances",
    tags=["Grievance Redressal System"]
)


@router.post("", response_model=GrievanceResponse)
async def raise_complaint(
    payload: GrievanceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint for a citizen to raise a new complaint.
    Returns the created grievance details.
    """
    db_grievance = await grievance_service.create_grievance(
        db=db,
        title=payload.title,
        description=payload.description,
        category=payload.category,
        department=payload.department,
        citizen_id=current_user.id
    )

    # Convert to response dictionary
    return GrievanceResponse(
        id=db_grievance.id,
        ticket_number=db_grievance.ticket_number,
        citizen_id=db_grievance.citizen_id,
        title=db_grievance.title,
        description=db_grievance.description,
        category=db_grievance.category,
        department=db_grievance.department,
        priority=db_grievance.priority,
        status=db_grievance.status,
        created_at=db_grievance.created_at,
        resolved_at=db_grievance.resolved_at,
        rating=db_grievance.rating,
        supports_count=0,
        is_supported_by_me=False,
        assigned_to=None  # Set to None for citizens
    )


@router.post("/{grievance_id}/support")
async def support_complaint(
    grievance_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint for citizens to support (upvote) a specific grievance.
    Toggles the support and updates priority.
    """
    return await grievance_service.support_grievance(
        db=db,
        grievance_id=grievance_id,
        citizen_id=current_user.id
    )


@router.get("", response_model=List[GrievanceResponse])
async def list_grievances(
    my_only: bool = Query(False, description="Filter to retrieve only complaints raised by the current user"),
    department: str = Query(None, description="Filter by department"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint to list grievances.
    - Citizens see complaints with authority assignment details hidden.
    - Admins see complaints with all details visible.
    - 'my_only' query parameter allows filtering to just own complaints.
    """
    query = select(Grievance)

    # Apply filters
    if my_only:
        query = query.where(Grievance.citizen_id == current_user.id)
    if department:
        query = query.where(Grievance.department.ilike(f"%{department}%"))

    # Order by creation date desc
    query = query.order_by(Grievance.created_at.desc())
    result = await db.execute(query)
    db_grievances = result.scalars().all()

    response_list = []
    is_admin = current_user.role in [Roles.SUPER_ADMIN, Roles.CITY_ADMIN, Roles.OFFICER]

    for g in db_grievances:
        # Count supports
        cnt_res = await db.execute(
            select(func.count(GrievanceSupport.id)).where(GrievanceSupport.grievance_id == g.id)
        )
        supports_count = cnt_res.scalar() or 0

        # Check if current user supported it
        me_res = await db.execute(
            select(GrievanceSupport).where(
                GrievanceSupport.grievance_id == g.id,
                GrievanceSupport.citizen_id == current_user.id
            )
        )
        is_supported_by_me = me_res.scalar() is not None

        # Rule: assigned_to is visible to admin only (hidden from citizens)
        assigned_val = g.assigned_to if is_admin else None

        response_list.append(
            GrievanceResponse(
                id=g.id,
                ticket_number=g.ticket_number,
                citizen_id=g.citizen_id,
                title=g.title,
                description=g.description,
                category=g.category,
                department=g.department,
                priority=g.priority,
                status=g.status,
                created_at=g.created_at,
                resolved_at=g.resolved_at,
                rating=g.rating,
                supports_count=supports_count,
                is_supported_by_me=is_supported_by_me,
                assigned_to=assigned_val
            )
        )

    return response_list


@router.get("/{grievance_id}", response_model=GrievanceResponse)
async def get_grievance_detail(
    grievance_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves the details of a single grievance complaint.
    Enforces privacy rule: assigned authority (assigned_to) is hidden from standard citizens.
    """
    g = await db.get(Grievance, grievance_id)
    if not g:
        raise HTTPException(status_code=404, detail="Grievance not found")

    # Count supports
    cnt_res = await db.execute(
        select(func.count(GrievanceSupport.id)).where(GrievanceSupport.grievance_id == g.id)
    )
    supports_count = cnt_res.scalar() or 0

    # Check if supported by me
    me_res = await db.execute(
        select(GrievanceSupport).where(
            GrievanceSupport.grievance_id == g.id,
            GrievanceSupport.citizen_id == current_user.id
        )
    )
    is_supported_by_me = me_res.scalar() is not None

    # Check authorization for authority details
    is_admin = current_user.role in [Roles.SUPER_ADMIN, Roles.CITY_ADMIN, Roles.OFFICER]
    assigned_val = g.assigned_to if is_admin else None

    return GrievanceResponse(
        id=g.id,
        ticket_number=g.ticket_number,
        citizen_id=g.citizen_id,
        title=g.title,
        description=g.description,
        category=g.category,
        department=g.department,
        priority=g.priority,
        status=g.status,
        created_at=g.created_at,
        resolved_at=g.resolved_at,
        rating=g.rating,
        supports_count=supports_count,
        is_supported_by_me=is_supported_by_me,
        assigned_to=assigned_val
    )


@router.put("/{grievance_id}/assign", response_model=GrievanceResponse)
async def assign_authority(
    grievance_id: UUID,
    payload: GrievanceAssign,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_roles([Roles.SUPER_ADMIN, Roles.CITY_ADMIN]))
):
    """
    Endpoint for admins to assign a grievance to a respective authority/officer.
    """
    # Verify the target officer exists and is actually an officer/admin
    officer = await db.get(User, payload.assigned_to)
    if not officer:
        raise HTTPException(status_code=404, detail="Assigned officer/user not found")
    if officer.role not in [Roles.SUPER_ADMIN, Roles.CITY_ADMIN, Roles.OFFICER]:
        raise HTTPException(status_code=400, detail="Assigned user is not an officer or authority")

    g = await grievance_service.assign_grievance(
        db=db,
        grievance_id=grievance_id,
        assigned_to=payload.assigned_to
    )

    # Count supports
    cnt_res = await db.execute(
        select(func.count(GrievanceSupport.id)).where(GrievanceSupport.grievance_id == g.id)
    )
    supports_count = cnt_res.scalar() or 0

    return GrievanceResponse(
        id=g.id,
        ticket_number=g.ticket_number,
        citizen_id=g.citizen_id,
        title=g.title,
        description=g.description,
        category=g.category,
        department=g.department,
        priority=g.priority,
        status=g.status,
        created_at=g.created_at,
        resolved_at=g.resolved_at,
        rating=g.rating,
        supports_count=supports_count,
        is_supported_by_me=False,
        assigned_to=g.assigned_to  # Admins can see this since they are assigned it
    )


@router.put("/{grievance_id}/status", response_model=GrievanceResponse)
async def update_status(
    grievance_id: UUID,
    payload: GrievanceStatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint for Admins or the assigned authority to progress the status of a grievance.
    """
    g = await grievance_service.update_grievance_status(
        db=db,
        grievance_id=grievance_id,
        status=payload.status,
        current_user=current_user
    )

    # Count supports
    cnt_res = await db.execute(
        select(func.count(GrievanceSupport.id)).where(GrievanceSupport.grievance_id == g.id)
    )
    supports_count = cnt_res.scalar() or 0

    # Display assigned authority details based on role
    is_admin = current_user.role in [Roles.SUPER_ADMIN, Roles.CITY_ADMIN, Roles.OFFICER]
    assigned_val = g.assigned_to if is_admin else None

    return GrievanceResponse(
        id=g.id,
        ticket_number=g.ticket_number,
        citizen_id=g.citizen_id,
        title=g.title,
        description=g.description,
        category=g.category,
        department=g.department,
        priority=g.priority,
        status=g.status,
        created_at=g.created_at,
        resolved_at=g.resolved_at,
        rating=g.rating,
        supports_count=supports_count,
        is_supported_by_me=False,
        assigned_to=assigned_val
    )


@router.post("/{grievance_id}/feedback", response_model=GrievanceResponse)
async def submit_feedback(
    grievance_id: UUID,
    payload: GrievanceFeedback,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint for the citizen who raised the complaint to submit 1-5 star feedback rating
    once resolved.
    """
    g = await grievance_service.submit_grievance_feedback(
        db=db,
        grievance_id=grievance_id,
        rating=payload.rating,
        citizen_id=current_user.id
    )

    # Count supports
    cnt_res = await db.execute(
        select(func.count(GrievanceSupport.id)).where(GrievanceSupport.grievance_id == g.id)
    )
    supports_count = cnt_res.scalar() or 0

    return GrievanceResponse(
        id=g.id,
        ticket_number=g.ticket_number,
        citizen_id=g.citizen_id,
        title=g.title,
        description=g.description,
        category=g.category,
        department=g.department,
        priority=g.priority,
        status=g.status,
        created_at=g.created_at,
        resolved_at=g.resolved_at,
        rating=g.rating,
        supports_count=supports_count,
        is_supported_by_me=False,
        assigned_to=None  # Set to None for citizens
    )


@router.get("/departments/ratings", response_model=List[DepartmentRatingResponse])
async def get_all_department_ratings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Endpoint to retrieve computed average star ratings and total feedback counts
    for each department.
    """
    return await grievance_service.get_department_ratings(db)
