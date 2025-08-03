from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum
from datetime import datetime
from typing import Optional, List


class CommentType(str, enum.Enum):
    """Comment types for collaboration"""
    GENERAL = "general"
    REVIEW = "review"
    APPROVAL = "approval"
    QUESTION = "question"
    SUGGESTION = "suggestion"
    AI_GENERATED = "ai_generated"


class TemplateType(str, enum.Enum):
    """Template types for knowledge sharing"""
    PROMPT = "prompt"
    WORKFLOW = "workflow"
    CHECKLIST = "checklist"
    REPORT = "report"
    PRESENTATION = "presentation"


class CollaborationComment(Base):
    """Comment model for team collaboration"""
    __tablename__ = "collaboration_comments"
    
    id = Column(Integer, primary_key=True, index=True)
    deal_room_id = Column(Integer, ForeignKey("deal_rooms.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    task_id = Column(Integer, ForeignKey("deal_room_tasks.id"), nullable=True)
    
    # Comment content
    content = Column(Text, nullable=False)
    comment_type = Column(Enum(CommentType), default=CommentType.GENERAL, nullable=False)
    parent_comment_id = Column(Integer, ForeignKey("collaboration_comments.id"), nullable=True)
    
    # Author and metadata
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_ai_generated = Column(Boolean, default=False, nullable=False)
    ai_confidence = Column(Integer, nullable=True)  # 0-100 confidence score
    
    # Collaboration features
    mentions = Column(JSON, nullable=True)  # List of mentioned user IDs
    tags = Column(JSON, nullable=True)  # Custom tags
    is_resolved = Column(Boolean, default=False, nullable=False)
    resolved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    deal_room = relationship("DealRoom")
    document = relationship("Document")
    task = relationship("DealRoomTask")
    author = relationship("User")
    parent_comment = relationship("CollaborationComment", remote_side=[id])
    child_comments = relationship("CollaborationComment")
    
    def __repr__(self):
        return f"<CollaborationComment(id={self.id}, type='{self.comment_type}', author_id={self.author_id})>"
    
    def to_dict(self) -> dict:
        """Convert comment to dictionary"""
        return {
            "id": self.id,
            "deal_room_id": self.deal_room_id,
            "document_id": self.document_id,
            "task_id": self.task_id,
            "content": self.content,
            "comment_type": self.comment_type.value,
            "parent_comment_id": self.parent_comment_id,
            "author_id": self.author_id,
            "is_ai_generated": self.is_ai_generated,
            "ai_confidence": self.ai_confidence,
            "mentions": self.mentions,
            "tags": self.tags,
            "is_resolved": self.is_resolved,
            "resolved_by": self.resolved_by,
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


class KnowledgeTemplate(Base):
    """Template model for knowledge sharing"""
    __tablename__ = "knowledge_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    template_type = Column(Enum(TemplateType), nullable=False)
    
    # Template content
    content = Column(JSON, nullable=False)  # Template structure and content
    variables = Column(JSON, nullable=True)  # Template variables
    validation_rules = Column(JSON, nullable=True)  # Validation rules
    
    # Usage and sharing
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Company-specific templates
    is_public = Column(Boolean, default=False, nullable=False)  # Share across network
    is_approved = Column(Boolean, default=False, nullable=False)  # Quality control
    
    # Usage statistics
    usage_count = Column(Integer, default=0, nullable=False)
    success_rate = Column(Integer, nullable=True)  # 0-100 success rate
    average_rating = Column(Integer, nullable=True)  # 1-5 rating
    
    # Tags and categorization
    tags = Column(JSON, nullable=True)
    industry = Column(String(100), nullable=True)
    deal_type = Column(String(100), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    creator = relationship("User")
    
    def __repr__(self):
        return f"<KnowledgeTemplate(id={self.id}, name='{self.name}', type='{self.template_type}')>"
    
    def to_dict(self) -> dict:
        """Convert template to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "template_type": self.template_type.value,
            "content": self.content,
            "variables": self.variables,
            "created_by": self.created_by,
            "company_id": self.company_id,
            "is_public": self.is_public,
            "is_approved": self.is_approved,
            "usage_count": self.usage_count,
            "success_rate": self.success_rate,
            "average_rating": self.average_rating,
            "tags": self.tags,
            "industry": self.industry,
            "deal_type": self.deal_type,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


class Benchmark(Base):
    """Benchmark model for cross-deal comparisons"""
    __tablename__ = "benchmarks"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Benchmark data
    metric_name = Column(String(100), nullable=False)
    metric_value = Column(Integer, nullable=False)
    metric_unit = Column(String(50), nullable=True)
    
    # Context
    deal_type = Column(String(100), nullable=True)
    industry = Column(String(100), nullable=True)
    company_size = Column(String(50), nullable=True)  # small, medium, large
    geographic_region = Column(String(100), nullable=True)
    
    # Source and reliability
    source_deal_id = Column(Integer, ForeignKey("deals.id"), nullable=True)
    source_company_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_aggregated = Column(Boolean, default=False, nullable=False)  # Individual vs aggregated
    confidence_level = Column(Integer, nullable=True)  # 0-100 confidence
    
    # Usage
    usage_count = Column(Integer, default=0, nullable=False)
    last_used = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    source_deal = relationship("Deal")
    source_company = relationship("User")
    
    def __repr__(self):
        return f"<Benchmark(id={self.id}, name='{self.name}', metric='{self.metric_name}')>"
    
    def to_dict(self) -> dict:
        """Convert benchmark to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "metric_name": self.metric_name,
            "metric_value": self.metric_value,
            "metric_unit": self.metric_unit,
            "deal_type": self.deal_type,
            "industry": self.industry,
            "company_size": self.company_size,
            "geographic_region": self.geographic_region,
            "source_deal_id": self.source_deal_id,
            "source_company_id": self.source_company_id,
            "is_aggregated": self.is_aggregated,
            "confidence_level": self.confidence_level,
            "usage_count": self.usage_count,
            "last_used": self.last_used.isoformat() if self.last_used else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


class LearningInsight(Base):
    """Learning insight model for continuous improvement"""
    __tablename__ = "learning_insights"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    insight_type = Column(String(100), nullable=False)  # process, performance, ai, client
    
    # Insight data
    data = Column(JSON, nullable=False)  # Insight data and metrics
    recommendations = Column(JSON, nullable=True)  # Actionable recommendations
    impact_score = Column(Integer, nullable=True)  # 0-100 impact score
    
    # Source and context
    source_deal_room_id = Column(Integer, ForeignKey("deal_rooms.id"), nullable=True)
    source_company_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    is_ai_generated = Column(Boolean, default=False, nullable=False)
    
    # Usage and feedback
    is_implemented = Column(Boolean, default=False, nullable=False)
    implementation_date = Column(DateTime, nullable=True)
    implementation_results = Column(JSON, nullable=True)
    
    # Sharing and collaboration
    is_shared = Column(Boolean, default=False, nullable=False)
    shared_companies = Column(JSON, nullable=True)  # List of company IDs
    feedback = Column(JSON, nullable=True)  # Feedback from other companies
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    source_deal_room = relationship("DealRoom")
    source_company = relationship("User")
    
    def __repr__(self):
        return f"<LearningInsight(id={self.id}, title='{self.title}', type='{self.insight_type}')>"
    
    def to_dict(self) -> dict:
        """Convert learning insight to dictionary"""
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "insight_type": self.insight_type,
            "data": self.data,
            "recommendations": self.recommendations,
            "impact_score": self.impact_score,
            "source_deal_room_id": self.source_deal_room_id,
            "source_company_id": self.source_company_id,
            "is_ai_generated": self.is_ai_generated,
            "is_implemented": self.is_implemented,
            "implementation_date": self.implementation_date.isoformat() if self.implementation_date else None,
            "implementation_results": self.implementation_results,
            "is_shared": self.is_shared,
            "shared_companies": self.shared_companies,
            "feedback": self.feedback,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


class NetworkEffect(Base):
    """Network effect model for cross-client learning"""
    __tablename__ = "network_effects"
    
    id = Column(Integer, primary_key=True, index=True)
    effect_type = Column(String(100), nullable=False)  # template_sharing, benchmark_creation, insight_sharing
    
    # Network data
    source_company_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_companies = Column(JSON, nullable=True)  # List of company IDs that benefited
    shared_content_id = Column(Integer, nullable=True)  # ID of shared template/benchmark/insight
    
    # Impact metrics
    adoption_rate = Column(Integer, nullable=True)  # 0-100 adoption rate
    time_savings = Column(Integer, nullable=True)  # Hours saved across network
    quality_improvement = Column(Integer, nullable=True)  # 0-100 quality improvement
    
    # Network growth
    new_connections = Column(Integer, default=0, nullable=False)
    network_size = Column(Integer, nullable=True)  # Total companies in network
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    source_company = relationship("User")
    
    def __repr__(self):
        return f"<NetworkEffect(id={self.id}, type='{self.effect_type}', source_company_id={self.source_company_id})>"
    
    def to_dict(self) -> dict:
        """Convert network effect to dictionary"""
        return {
            "id": self.id,
            "effect_type": self.effect_type,
            "source_company_id": self.source_company_id,
            "target_companies": self.target_companies,
            "shared_content_id": self.shared_content_id,
            "adoption_rate": self.adoption_rate,
            "time_savings": self.time_savings,
            "quality_improvement": self.quality_improvement,
            "new_connections": self.new_connections,
            "network_size": self.network_size,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        } 