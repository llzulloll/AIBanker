from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, UserRole
from app.models.deal import Deal, DealType, DealStatus

router = APIRouter()


class DealCreate(BaseModel):
    name: str
    description: Optional[str] = None
    deal_type: DealType
    target_company: Optional[str] = None
    target_industry: Optional[str] = None
    target_sector: Optional[str] = None
    target_revenue: Optional[float] = None
    target_ebitda: Optional[float] = None
    deal_value: Optional[float] = None
    deal_currency: str = "USD"
    transaction_fee: Optional[float] = None
    success_fee_rate: Optional[float] = None
    expected_close_date: Optional[datetime] = None
    due_diligence_deadline: Optional[datetime] = None


class DealUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    deal_type: Optional[DealType] = None
    target_company: Optional[str] = None
    target_industry: Optional[str] = None
    target_sector: Optional[str] = None
    target_revenue: Optional[float] = None
    target_ebitda: Optional[float] = None
    deal_value: Optional[float] = None
    deal_currency: Optional[str] = None
    transaction_fee: Optional[float] = None
    success_fee_rate: Optional[float] = None
    expected_close_date: Optional[datetime] = None
    actual_close_date: Optional[datetime] = None
    due_diligence_deadline: Optional[datetime] = None
    status: Optional[DealStatus] = None


class DealResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    deal_type: str
    status: str
    target_company: Optional[str]
    target_industry: Optional[str]
    target_sector: Optional[str]
    target_revenue: Optional[float]
    target_ebitda: Optional[float]
    deal_value: Optional[float]
    deal_currency: str
    transaction_fee: Optional[float]
    success_fee_rate: Optional[float]
    expected_close_date: Optional[str]
    actual_close_date: Optional[str]
    due_diligence_deadline: Optional[str]
    created_by: int
    due_diligence_completed: bool
    pitchbook_generated: bool
    risk_analysis_completed: bool
    ai_processing_status: str
    processing_time: Optional[float]
    created_at: str
    updated_at: str


@router.post("/", response_model=DealResponse)
async def create_deal(
    deal_data: DealCreate,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new deal"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create new deal
    new_deal = Deal(
        **deal_data.dict(),
        created_by=user.id,
        status=DealStatus.DRAFT
    )
    
    db.add(new_deal)
    await db.commit()
    await db.refresh(new_deal)
    
    return DealResponse(**new_deal.to_dict())


@router.get("/", response_model=List[DealResponse])
async def get_deals(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[DealStatus] = None,
    deal_type: Optional[DealType] = None,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get deals with optional filtering"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Build query
    query = select(Deal)
    
    # Apply filters
    if status:
        query = query.where(Deal.status == status)
    if deal_type:
        query = query.where(Deal.deal_type == deal_type)
    
    # Apply user permissions
    if not user.is_manager:
        query = query.where(Deal.created_by == user.id)
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    deals = result.scalars().all()
    
    return [DealResponse(**deal.to_dict()) for deal in deals]


@router.get("/{deal_id}", response_model=DealResponse)
async def get_deal(
    deal_id: int,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific deal by ID"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get deal
    result = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()
    
    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )
    
    # Check permissions
    if not user.can_access_deal(deal.created_by):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return DealResponse(**deal.to_dict())


@router.put("/{deal_id}", response_model=DealResponse)
async def update_deal(
    deal_id: int,
    deal_data: DealUpdate,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a deal"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get deal
    result = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()
    
    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )
    
    # Check permissions
    if not user.can_access_deal(deal.created_by):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Update deal
    update_data = deal_data.dict(exclude_unset=True)
    if update_data:
        await db.execute(
            update(Deal)
            .where(Deal.id == deal_id)
            .values(**update_data)
        )
        await db.commit()
        
        # Get updated deal
        result = await db.execute(select(Deal).where(Deal.id == deal_id))
        deal = result.scalar_one_or_none()
    
    return DealResponse(**deal.to_dict())


@router.delete("/{deal_id}")
async def delete_deal(
    deal_id: int,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a deal"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get deal
    result = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()
    
    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )
    
    # Check permissions (only creator or admin can delete)
    if not (user.is_admin or deal.created_by == user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Delete deal
    await db.execute(delete(Deal).where(Deal.id == deal_id))
    await db.commit()
    
    return {"message": "Deal deleted successfully"}


@router.post("/{deal_id}/start-processing")
async def start_ai_processing(
    deal_id: int,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Start AI processing for a deal"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get deal
    result = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()
    
    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )
    
    # Check permissions
    if not user.can_access_deal(deal.created_by):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Update processing status
    await db.execute(
        update(Deal)
        .where(Deal.id == deal_id)
        .values(
            ai_processing_status="processing",
            ai_processing_started=datetime.utcnow()
        )
    )
    await db.commit()
    
    # TODO: Trigger AI processing background task
    
    return {"message": "AI processing started", "deal_id": deal_id}


@router.get("/{deal_id}/status")
async def get_deal_status(
    deal_id: int,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get deal processing status"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get deal
    result = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()
    
    if not deal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deal not found"
        )
    
    # Check permissions
    if not user.can_access_deal(deal.created_by):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return {
        "deal_id": deal.id,
        "status": deal.status.value,
        "ai_processing_status": deal.ai_processing_status,
        "due_diligence_completed": deal.due_diligence_completed,
        "pitchbook_generated": deal.pitchbook_generated,
        "risk_analysis_completed": deal.risk_analysis_completed,
        "processing_time": deal.processing_time,
        "ai_processing_errors": deal.ai_processing_errors
    } 