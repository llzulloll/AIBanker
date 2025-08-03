from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.deal import Deal, DealStatus, DealType
from app.models.document import Document, DocumentStatus

router = APIRouter()


class DashboardStats(BaseModel):
    total_deals: int
    active_deals: int
    completed_deals: int
    documents_processed: int
    due_diligence_reports: int
    pitchbooks_generated: int
    total_deal_value: float
    avg_processing_time: float
    deals_by_status: Dict[str, int]
    deals_by_type: Dict[str, int]
    recent_activity: List[Dict[str, Any]]


class PerformanceMetrics(BaseModel):
    deals_closed_this_month: int
    deals_in_pipeline: int
    avg_deal_cycle_time: float
    success_rate: float
    revenue_generated: float
    time_saved_hours: float
    efficiency_improvement: float


class DealPipelineData(BaseModel):
    deal_id: int
    deal_name: str
    deal_type: str
    status: str
    deal_value: Optional[float]
    expected_close_date: Optional[str]
    progress_percentage: int
    days_in_current_stage: int


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get dashboard statistics"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Build base query based on user permissions
    deals_query = select(Deal)
    docs_query = select(Document)
    
    if not user.is_manager:
        deals_query = deals_query.where(Deal.created_by == user.id)
        docs_query = docs_query.where(Document.uploaded_by == user.id)
    
    # Get deal statistics
    total_deals_result = await db.execute(select(func.count(Deal.id)).select_from(deals_query.subquery()))
    total_deals = total_deals_result.scalar() or 0
    
    active_deals_result = await db.execute(
        select(func.count(Deal.id))
        .select_from(deals_query.where(Deal.status.in_([DealStatus.IN_PROGRESS, DealStatus.DUE_DILIGENCE])).subquery())
    )
    active_deals = active_deals_result.scalar() or 0
    
    completed_deals_result = await db.execute(
        select(func.count(Deal.id))
        .select_from(deals_query.where(Deal.status == DealStatus.COMPLETED).subquery())
    )
    completed_deals = completed_deals_result.scalar() or 0
    
    # Get document statistics
    docs_processed_result = await db.execute(
        select(func.count(Document.id))
        .select_from(docs_query.where(Document.status == DocumentStatus.COMPLETED).subquery())
    )
    documents_processed = docs_processed_result.scalar() or 0
    
    # Get due diligence and pitchbook counts
    dd_reports_result = await db.execute(
        select(func.count(Deal.id))
        .select_from(deals_query.where(Deal.due_diligence_completed == True).subquery())
    )
    due_diligence_reports = dd_reports_result.scalar() or 0
    
    pitchbooks_result = await db.execute(
        select(func.count(Deal.id))
        .select_from(deals_query.where(Deal.pitchbook_generated == True).subquery())
    )
    pitchbooks_generated = pitchbooks_result.scalar() or 0
    
    # Get total deal value
    deal_value_result = await db.execute(
        select(func.sum(Deal.deal_value))
        .select_from(deals_query.where(Deal.deal_value.isnot(None)).subquery())
    )
    total_deal_value = float(deal_value_result.scalar() or 0)
    
    # Calculate average processing time (mock data for now)
    avg_processing_time = 45.5  # minutes
    
    # Get deals by status
    deals_by_status = {}
    for status in DealStatus:
        count_result = await db.execute(
            select(func.count(Deal.id))
            .select_from(deals_query.where(Deal.status == status).subquery())
        )
        count = count_result.scalar() or 0
        if count > 0:
            deals_by_status[status.value] = count
    
    # Get deals by type
    deals_by_type = {}
    for deal_type in DealType:
        count_result = await db.execute(
            select(func.count(Deal.id))
            .select_from(deals_query.where(Deal.deal_type == deal_type).subquery())
        )
        count = count_result.scalar() or 0
        if count > 0:
            deals_by_type[deal_type.value] = count
    
    # Get recent activity (simplified)
    recent_activity = [
        {"type": "deal_created", "message": "New M&A deal created", "timestamp": datetime.utcnow().isoformat()},
        {"type": "document_processed", "message": "Due diligence document processed", "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat()},
        {"type": "pitchbook_generated", "message": "Pitchbook generated for TechCorp acquisition", "timestamp": (datetime.utcnow() - timedelta(hours=5)).isoformat()},
    ]
    
    return DashboardStats(
        total_deals=total_deals,
        active_deals=active_deals,
        completed_deals=completed_deals,
        documents_processed=documents_processed,
        due_diligence_reports=due_diligence_reports,
        pitchbooks_generated=pitchbooks_generated,
        total_deal_value=total_deal_value,
        avg_processing_time=avg_processing_time,
        deals_by_status=deals_by_status,
        deals_by_type=deals_by_type,
        recent_activity=recent_activity
    )


@router.get("/performance", response_model=PerformanceMetrics)
async def get_performance_metrics(
    period_days: int = Query(30, ge=1, le=365),
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get performance metrics for specified period"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Calculate date range
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=period_days)
    
    # Build base query
    deals_query = select(Deal)
    if not user.is_manager:
        deals_query = deals_query.where(Deal.created_by == user.id)
    
    # Get deals closed this period
    closed_deals_result = await db.execute(
        select(func.count(Deal.id))
        .select_from(
            deals_query.where(
                and_(
                    Deal.status == DealStatus.COMPLETED,
                    Deal.actual_close_date >= start_date,
                    Deal.actual_close_date <= end_date
                )
            ).subquery()
        )
    )
    deals_closed_this_month = closed_deals_result.scalar() or 0
    
    # Get deals in pipeline
    pipeline_deals_result = await db.execute(
        select(func.count(Deal.id))
        .select_from(
            deals_query.where(
                Deal.status.in_([DealStatus.IN_PROGRESS, DealStatus.DUE_DILIGENCE, DealStatus.PITCHBOOK_READY])
            ).subquery()
        )
    )
    deals_in_pipeline = pipeline_deals_result.scalar() or 0
    
    # Mock calculations for now (would be based on actual data)
    avg_deal_cycle_time = 45.2  # days
    success_rate = 0.72  # 72%
    revenue_generated = 1250000.0  # $1.25M
    time_saved_hours = 850.0  # hours
    efficiency_improvement = 0.45  # 45% improvement
    
    return PerformanceMetrics(
        deals_closed_this_month=deals_closed_this_month,
        deals_in_pipeline=deals_in_pipeline,
        avg_deal_cycle_time=avg_deal_cycle_time,
        success_rate=success_rate,
        revenue_generated=revenue_generated,
        time_saved_hours=time_saved_hours,
        efficiency_improvement=efficiency_improvement
    )


@router.get("/pipeline", response_model=List[DealPipelineData])
async def get_deal_pipeline(
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get deal pipeline data"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Build query for active deals
    query = select(Deal).where(
        Deal.status.in_([
            DealStatus.IN_PROGRESS,
            DealStatus.DUE_DILIGENCE,
            DealStatus.PITCHBOOK_READY
        ])
    )
    
    if not user.is_manager:
        query = query.where(Deal.created_by == user.id)
    
    # Execute query
    result = await db.execute(query)
    deals = result.scalars().all()
    
    pipeline_data = []
    for deal in deals:
        # Calculate progress percentage based on status
        progress_map = {
            DealStatus.DRAFT: 10,
            DealStatus.IN_PROGRESS: 35,
            DealStatus.DUE_DILIGENCE: 65,
            DealStatus.PITCHBOOK_READY: 85,
            DealStatus.COMPLETED: 100
        }
        
        # Calculate days in current stage
        days_in_stage = (datetime.utcnow() - deal.updated_at).days
        
        pipeline_data.append(DealPipelineData(
            deal_id=deal.id,
            deal_name=deal.name,
            deal_type=deal.deal_type.value,
            status=deal.status.value,
            deal_value=deal.deal_value,
            expected_close_date=deal.expected_close_date.isoformat() if deal.expected_close_date else None,
            progress_percentage=progress_map.get(deal.status, 0),
            days_in_current_stage=days_in_stage
        ))
    
    return pipeline_data