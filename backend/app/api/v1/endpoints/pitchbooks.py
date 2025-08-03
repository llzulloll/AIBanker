from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.deal import Deal

router = APIRouter()


class PitchbookRequest(BaseModel):
    deal_id: int
    template_type: str = "standard"  # standard, comprehensive, teaser, executive
    target_audience: str = "client"  # client, internal, board
    slide_count: int = 15
    include_sections: List[str] = [
        "executive_summary",
        "company_overview", 
        "financial_analysis",
        "market_analysis",
        "valuation",
        "transaction_structure",
        "appendix"
    ]
    branding: Dict[str, str] = {}


class PitchbookResponse(BaseModel):
    id: str
    deal_id: int
    name: str
    template_type: str
    status: str
    slide_count: int
    created_by: int
    created_at: str
    updated_at: str
    download_url: Optional[str]
    preview_url: Optional[str]


class SlideContent(BaseModel):
    slide_number: int
    title: str
    content_type: str  # text, chart, table, image
    content: Dict[str, Any]
    notes: Optional[str]


class PitchbookTemplate(BaseModel):
    id: str
    name: str
    category: str
    description: str
    slide_count: int
    sections: List[str]
    is_premium: bool
    preview_image: Optional[str]


@router.post("/generate", response_model=Dict[str, Any])
async def generate_pitchbook(
    request: PitchbookRequest,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate a pitchbook for a deal"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get deal
    result = await db.execute(select(Deal).where(Deal.id == request.deal_id))
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
    
    # Generate pitchbook ID
    pitchbook_id = f"pb_{request.deal_id}_{int(datetime.utcnow().timestamp())}"
    
    # TODO: Trigger AI pitchbook generation
    
    # Update deal status
    await db.execute(
        update(Deal)
        .where(Deal.id == request.deal_id)
        .values(pitchbook_generated=True)
    )
    await db.commit()
    
    return {
        "pitchbook_id": pitchbook_id,
        "deal_id": request.deal_id,
        "status": "generating",
        "message": "Pitchbook generation started",
        "estimated_completion": "10-15 minutes",
        "template_type": request.template_type,
        "slide_count": request.slide_count
    }


@router.get("/", response_model=List[PitchbookResponse])
async def get_pitchbooks(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    deal_id: Optional[int] = None,
    status: Optional[str] = None,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get pitchbooks"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Mock pitchbooks for now
    mock_pitchbooks = []
    
    # Get deals the user can access
    deals_query = select(Deal)
    if not user.is_manager:
        deals_query = deals_query.where(Deal.created_by == user.id)
    
    if deal_id:
        deals_query = deals_query.where(Deal.id == deal_id)
    
    result = await db.execute(deals_query.offset(skip).limit(limit))
    deals = result.scalars().all()
    
    for deal in deals:
        if deal.pitchbook_generated:
            mock_pitchbooks.append(PitchbookResponse(
                id=f"pb_{deal.id}_001",
                deal_id=deal.id,
                name=f"{deal.name} - Investment Presentation",
                template_type="standard",
                status="completed",
                slide_count=15,
                created_by=deal.created_by,
                created_at=deal.created_at.isoformat(),
                updated_at=deal.updated_at.isoformat(),
                download_url=f"/api/v1/pitchbooks/pb_{deal.id}_001/download",
                preview_url=f"/api/v1/pitchbooks/pb_{deal.id}_001/preview"
            ))
    
    return mock_pitchbooks


@router.get("/{pitchbook_id}", response_model=PitchbookResponse)
async def get_pitchbook(
    pitchbook_id: str,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific pitchbook"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Extract deal_id from pitchbook_id (mock logic)
    try:
        deal_id = int(pitchbook_id.split('_')[1])
    except:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pitchbook not found"
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
    
    return PitchbookResponse(
        id=pitchbook_id,
        deal_id=deal_id,
        name=f"{deal.name} - Investment Presentation",
        template_type="standard",
        status="completed",
        slide_count=15,
        created_by=deal.created_by,
        created_at=deal.created_at.isoformat(),
        updated_at=deal.updated_at.isoformat(),
        download_url=f"/api/v1/pitchbooks/{pitchbook_id}/download",
        preview_url=f"/api/v1/pitchbooks/{pitchbook_id}/preview"
    )


@router.get("/{pitchbook_id}/slides", response_model=List[SlideContent])
async def get_pitchbook_slides(
    pitchbook_id: str,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get slides for a pitchbook"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Mock slides
    mock_slides = [
        SlideContent(
            slide_number=1,
            title="Executive Summary",
            content_type="text",
            content={
                "overview": "TechCorp acquisition opportunity",
                "key_metrics": {
                    "revenue": "$50M",
                    "ebitda": "$12M",
                    "employees": 250
                }
            },
            notes="Key investment highlights"
        ),
        SlideContent(
            slide_number=2,
            title="Company Overview", 
            content_type="text",
            content={
                "description": "Leading SaaS platform in fintech",
                "founded": "2018",
                "headquarters": "San Francisco, CA"
            },
            notes="Company background and history"
        ),
        SlideContent(
            slide_number=3,
            title="Financial Performance",
            content_type="chart",
            content={
                "chart_type": "revenue_growth",
                "data": [
                    {"year": 2021, "revenue": 30},
                    {"year": 2022, "revenue": 40},
                    {"year": 2023, "revenue": 50}
                ]
            },
            notes="Strong revenue growth trajectory"
        )
    ]
    
    return mock_slides


@router.get("/templates", response_model=List[PitchbookTemplate])
async def get_pitchbook_templates(
    category: Optional[str] = None,
    current_user_id: str = Depends(get_current_user)
):
    """Get available pitchbook templates"""
    # Mock templates
    templates = [
        PitchbookTemplate(
            id="standard_ma",
            name="Standard M&A Presentation",
            category="mna",
            description="Comprehensive M&A presentation template",
            slide_count=15,
            sections=["executive_summary", "company_overview", "financial_analysis", "valuation"],
            is_premium=False,
            preview_image="/templates/standard_ma_preview.png"
        ),
        PitchbookTemplate(
            id="ipo_roadshow",
            name="IPO Roadshow Presentation",
            category="ipo",
            description="Professional IPO roadshow template",
            slide_count=20,
            sections=["company_story", "market_opportunity", "financial_performance", "use_of_proceeds"],
            is_premium=True,
            preview_image="/templates/ipo_roadshow_preview.png"
        ),
        PitchbookTemplate(
            id="pe_investment",
            name="Private Equity Investment",
            category="private_equity",
            description="PE investment presentation template",
            slide_count=12,
            sections=["investment_thesis", "management_team", "growth_strategy", "returns"],
            is_premium=False,
            preview_image="/templates/pe_investment_preview.png"
        )
    ]
    
    if category:
        templates = [t for t in templates if t.category == category]
    
    return templates


@router.get("/{pitchbook_id}/status")
async def get_pitchbook_status(
    pitchbook_id: str,
    current_user_id: str = Depends(get_current_user)
):
    """Get pitchbook generation status"""
    # Mock status
    return {
        "pitchbook_id": pitchbook_id,
        "status": "completed",
        "progress": 100,
        "stage": "finalizing",
        "slides_completed": 15,
        "total_slides": 15,
        "estimated_time_remaining": 0,
        "last_updated": datetime.utcnow().isoformat()
    }


@router.delete("/{pitchbook_id}")
async def delete_pitchbook(
    pitchbook_id: str,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a pitchbook"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # TODO: Implement actual deletion
    
    return {"message": "Pitchbook deleted successfully"}