from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum, Float, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum
from datetime import datetime
from typing import Optional, List


class DealType(str, enum.Enum):
    """Deal types enumeration"""
    MNA = "mna"  # Mergers & Acquisitions
    IPO = "ipo"  # Initial Public Offering
    PRIVATE_EQUITY = "private_equity"
    DEBT_FINANCING = "debt_financing"
    RESTRUCTURING = "restructuring"
    OTHER = "other"


class DealStatus(str, enum.Enum):
    """Deal status enumeration"""
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    DUE_DILIGENCE = "due_diligence"
    PITCHBOOK_READY = "pitchbook_ready"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class Deal(Base):
    """Deal model for managing investment banking transactions"""
    __tablename__ = "deals"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    deal_type = Column(Enum(DealType), nullable=False)
    status = Column(Enum(DealStatus), default=DealStatus.DRAFT, nullable=False)
    
    # Company information
    target_company = Column(String(255), nullable=True)
    target_industry = Column(String(100), nullable=True)
    target_sector = Column(String(100), nullable=True)
    target_revenue = Column(Float, nullable=True)  # in millions
    target_ebitda = Column(Float, nullable=True)   # in millions
    
    # Deal financials
    deal_value = Column(Float, nullable=True)      # in millions
    deal_currency = Column(String(3), default="USD", nullable=False)
    transaction_fee = Column(Float, nullable=True)  # in millions
    success_fee_rate = Column(Float, nullable=True) # percentage
    
    # Timeline
    expected_close_date = Column(DateTime, nullable=True)
    actual_close_date = Column(DateTime, nullable=True)
    due_diligence_deadline = Column(DateTime, nullable=True)
    
    # Team and stakeholders
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    deal_team = Column(Text, nullable=True)  # JSON string of team members
    client_contacts = Column(Text, nullable=True)  # JSON string of client contacts
    
    # Processing status
    due_diligence_completed = Column(Boolean, default=False, nullable=False)
    pitchbook_generated = Column(Boolean, default=False, nullable=False)
    risk_analysis_completed = Column(Boolean, default=False, nullable=False)
    
    # AI processing metadata
    ai_processing_status = Column(String(50), default="pending", nullable=False)
    ai_processing_started = Column(DateTime, nullable=True)
    ai_processing_completed = Column(DateTime, nullable=True)
    ai_processing_errors = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    created_by_user = relationship("User", back_populates="deals")
    documents = relationship("Document", back_populates="deal")
    due_diligence_reports = relationship("DueDiligenceReport", back_populates="deal")
    pitchbooks = relationship("Pitchbook", back_populates="deal")
    
    def __repr__(self):
        return f"<Deal(id={self.id}, name='{self.name}', type='{self.deal_type}', status='{self.status}')>"
    
    @property
    def is_active(self) -> bool:
        """Check if deal is active"""
        return self.status not in [DealStatus.COMPLETED, DealStatus.CANCELLED]
    
    @property
    def is_completed(self) -> bool:
        """Check if deal is completed"""
        return self.status == DealStatus.COMPLETED
    
    @property
    def processing_time(self) -> Optional[float]:
        """Calculate AI processing time in seconds"""
        if self.ai_processing_started and self.ai_processing_completed:
            return (self.ai_processing_completed - self.ai_processing_started).total_seconds()
        return None
    
    def to_dict(self) -> dict:
        """Convert deal to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "deal_type": self.deal_type.value,
            "status": self.status.value,
            "target_company": self.target_company,
            "target_industry": self.target_industry,
            "target_sector": self.target_sector,
            "target_revenue": self.target_revenue,
            "target_ebitda": self.target_ebitda,
            "deal_value": self.deal_value,
            "deal_currency": self.deal_currency,
            "transaction_fee": self.transaction_fee,
            "success_fee_rate": self.success_fee_rate,
            "expected_close_date": self.expected_close_date.isoformat() if self.expected_close_date else None,
            "actual_close_date": self.actual_close_date.isoformat() if self.actual_close_date else None,
            "due_diligence_deadline": self.due_diligence_deadline.isoformat() if self.due_diligence_deadline else None,
            "created_by": self.created_by,
            "due_diligence_completed": self.due_diligence_completed,
            "pitchbook_generated": self.pitchbook_generated,
            "risk_analysis_completed": self.risk_analysis_completed,
            "ai_processing_status": self.ai_processing_status,
            "ai_processing_started": self.ai_processing_started.isoformat() if self.ai_processing_started else None,
            "ai_processing_completed": self.ai_processing_completed.isoformat() if self.ai_processing_completed else None,
            "processing_time": self.processing_time,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        } 