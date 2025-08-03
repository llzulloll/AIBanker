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
from app.models.document import Document

router = APIRouter()


class DueDiligenceRequest(BaseModel):
    deal_id: int
    document_ids: List[int]
    analysis_type: str = "comprehensive"  # comprehensive, financial, legal, operational
    priority: str = "medium"  # low, medium, high, urgent


class DueDiligenceReport(BaseModel):
    id: str
    deal_id: int
    status: str
    analysis_type: str
    risk_score: float
    risk_level: str
    key_findings: List[Dict[str, Any]]
    financial_analysis: Dict[str, Any]
    risk_flags: List[Dict[str, Any]]
    recommendations: List[str]
    processing_time: Optional[float]
    created_at: str
    completed_at: Optional[str]


class RiskAssessment(BaseModel):
    overall_risk_score: float
    risk_level: str  # low, medium, high, critical
    financial_risk: float
    operational_risk: float
    legal_risk: float
    market_risk: float
    key_risk_factors: List[str]
    mitigation_strategies: List[str]


@router.post("/analyze", response_model=Dict[str, Any])
async def start_due_diligence_analysis(
    request: DueDiligenceRequest,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Start due diligence analysis for a deal"""
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
    
    # Verify documents exist and belong to the deal
    for doc_id in request.document_ids:
        result = await db.execute(
            select(Document).where(
                Document.id == doc_id,
                Document.deal_id == request.deal_id
            )
        )
        document = result.scalar_one_or_none()
        if not document:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Document {doc_id} not found or not associated with deal"
            )
    
    # Generate analysis ID
    analysis_id = f"dd_{request.deal_id}_{int(datetime.utcnow().timestamp())}"
    
    # TODO: Trigger AI processing background task
    # For now, return mock response
    
    return {
        "analysis_id": analysis_id,
        "deal_id": request.deal_id,
        "status": "processing",
        "message": "Due diligence analysis started",
        "estimated_completion": "15-30 minutes",
        "document_count": len(request.document_ids)
    }


@router.get("/reports/{deal_id}", response_model=List[DueDiligenceReport])
async def get_due_diligence_reports(
    deal_id: int,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get due diligence reports for a deal"""
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
    
    # Mock reports for now
    mock_reports = [
        DueDiligenceReport(
            id=f"dd_{deal_id}_001",
            deal_id=deal_id,
            status="completed",
            analysis_type="comprehensive",
            risk_score=72.5,
            risk_level="medium",
            key_findings=[
                {"category": "Financial", "finding": "Strong revenue growth", "impact": "positive"},
                {"category": "Legal", "finding": "Pending litigation", "impact": "negative"},
                {"category": "Operational", "finding": "Efficient operations", "impact": "positive"}
            ],
            financial_analysis={
                "revenue": {"value": 50000000, "growth_rate": 0.15, "trend": "positive"},
                "ebitda": {"value": 12000000, "margin": 0.24, "trend": "stable"},
                "debt": {"value": 8000000, "debt_to_equity": 0.4, "trend": "decreasing"}
            },
            risk_flags=[
                {"type": "legal", "severity": "medium", "description": "Ongoing IP dispute"},
                {"type": "financial", "severity": "low", "description": "Customer concentration risk"}
            ],
            recommendations=[
                "Negotiate escrow for pending litigation",
                "Diversify customer base post-acquisition",
                "Implement enhanced financial controls"
            ],
            processing_time=1247.5,
            created_at=datetime.utcnow().isoformat(),
            completed_at=datetime.utcnow().isoformat()
        )
    ]
    
    return mock_reports


@router.get("/risk-assessment/{deal_id}", response_model=RiskAssessment)
async def get_risk_assessment(
    deal_id: int,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get risk assessment for a deal"""
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
    
    # Mock risk assessment
    return RiskAssessment(
        overall_risk_score=72.5,
        risk_level="medium",
        financial_risk=68.0,
        operational_risk=75.0,
        legal_risk=80.0,
        market_risk=67.5,
        key_risk_factors=[
            "Pending IP litigation could impact valuation",
            "Customer concentration in top 3 clients",
            "Regulatory changes in target market",
            "Key person dependency on CEO",
            "Technology infrastructure needs upgrade"
        ],
        mitigation_strategies=[
            "Structure deal with litigation escrow",
            "Develop customer diversification plan",
            "Include regulatory compliance warranties",
            "Implement succession planning",
            "Budget for IT infrastructure upgrade"
        ]
    )


@router.get("/analysis/{analysis_id}/status")
async def get_analysis_status(
    analysis_id: str,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get status of due diligence analysis"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Mock status response
    return {
        "analysis_id": analysis_id,
        "status": "completed",
        "progress": 100,
        "stage": "generating_report",
        "estimated_time_remaining": 0,
        "documents_processed": 5,
        "total_documents": 5,
        "last_updated": datetime.utcnow().isoformat()
    }


@router.post("/generate-report")
async def generate_due_diligence_report(
    deal_id: int,
    template: str = "standard",  # standard, comprehensive, executive
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Generate due diligence report"""
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
    
    # TODO: Generate actual report
    report_id = f"report_{deal_id}_{int(datetime.utcnow().timestamp())}"
    
    return {
        "report_id": report_id,
        "deal_id": deal_id,
        "template": template,
        "status": "generating",
        "estimated_completion": "5-10 minutes",
        "download_url": f"/api/v1/due-diligence/reports/{report_id}/download"
    }