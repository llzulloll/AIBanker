from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum
from datetime import datetime
from typing import Optional


class DocumentType(str, enum.Enum):
    """Document types enumeration"""
    FINANCIAL_STATEMENT = "financial_statement"
    LEGAL_DOCUMENT = "legal_document"
    CONTRACT = "contract"
    PRESENTATION = "presentation"
    MARKET_RESEARCH = "market_research"
    DUE_DILIGENCE = "due_diligence"
    PITCHBOOK = "pitchbook"
    OTHER = "other"


class DocumentStatus(str, enum.Enum):
    """Document processing status enumeration"""
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    PROCESSED = "processed"
    FAILED = "failed"
    ARCHIVED = "archived"


class Document(Base):
    """Document model for managing uploaded files and processing"""
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)  # S3 path
    file_size = Column(Integer, nullable=False)  # in bytes
    content_type = Column(String(100), nullable=False)
    document_type = Column(Enum(DocumentType), nullable=False)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.UPLOADED, nullable=False)
    
    # Deal association
    deal_id = Column(Integer, ForeignKey("deals.id"), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Processing metadata
    processing_started = Column(DateTime, nullable=True)
    processing_completed = Column(DateTime, nullable=True)
    processing_errors = Column(Text, nullable=True)
    processing_score = Column(Float, nullable=True)  # AI confidence score
    
    # OCR and NLP results
    extracted_text = Column(Text, nullable=True)
    ocr_confidence = Column(Float, nullable=True)
    nlp_analysis = Column(Text, nullable=True)  # JSON string of NLP results
    
    # Risk analysis
    risk_flags = Column(Text, nullable=True)  # JSON string of risk flags
    risk_score = Column(Float, nullable=True)  # Overall risk score
    risk_summary = Column(Text, nullable=True)
    
    # Financial data extraction
    financial_metrics = Column(Text, nullable=True)  # JSON string of financial data
    key_findings = Column(Text, nullable=True)
    
    # Security and compliance
    is_encrypted = Column(Boolean, default=True, nullable=False)
    encryption_key_id = Column(String(100), nullable=True)
    retention_date = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    deal = relationship("Deal", back_populates="documents")
    uploaded_by_user = relationship("User", back_populates="documents")
    
    def __repr__(self):
        return f"<Document(id={self.id}, filename='{self.filename}', type='{self.document_type}', status='{self.status}')>"
    
    @property
    def is_processed(self) -> bool:
        """Check if document is processed"""
        return self.status == DocumentStatus.PROCESSED
    
    @property
    def is_failed(self) -> bool:
        """Check if document processing failed"""
        return self.status == DocumentStatus.FAILED
    
    @property
    def processing_time(self) -> Optional[float]:
        """Calculate processing time in seconds"""
        if self.processing_started and self.processing_completed:
            return (self.processing_completed - self.processing_started).total_seconds()
        return None
    
    @property
    def file_size_mb(self) -> float:
        """Get file size in MB"""
        return self.file_size / (1024 * 1024)
    
    @property
    def is_financial_document(self) -> bool:
        """Check if document is financial in nature"""
        return self.document_type in [
            DocumentType.FINANCIAL_STATEMENT,
            DocumentType.DUE_DILIGENCE
        ]
    
    def to_dict(self) -> dict:
        """Convert document to dictionary"""
        return {
            "id": self.id,
            "filename": self.filename,
            "original_filename": self.original_filename,
            "file_size": self.file_size,
            "file_size_mb": self.file_size_mb,
            "content_type": self.content_type,
            "document_type": self.document_type.value,
            "status": self.status.value,
            "deal_id": self.deal_id,
            "uploaded_by": self.uploaded_by,
            "processing_started": self.processing_started.isoformat() if self.processing_started else None,
            "processing_completed": self.processing_completed.isoformat() if self.processing_completed else None,
            "processing_time": self.processing_time,
            "processing_score": self.processing_score,
            "ocr_confidence": self.ocr_confidence,
            "risk_score": self.risk_score,
            "risk_summary": self.risk_summary,
            "is_processed": self.is_processed,
            "is_failed": self.is_failed,
            "is_financial_document": self.is_financial_document,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        } 