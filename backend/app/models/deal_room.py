from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum
from datetime import datetime
from typing import Optional, List


class DealRoomStatus(str, enum.Enum):
    """Deal room status enumeration"""
    SETUP = "setup"
    ACTIVE = "active"
    DUE_DILIGENCE = "due_diligence"
    NEGOTIATION = "negotiation"
    CLOSING = "closing"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class TaskStatus(str, enum.Enum):
    """Task status enumeration"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    COMPLETED = "completed"
    BLOCKED = "blocked"


class DealRoom(Base):
    """Deal room model for collaborative deal management"""
    __tablename__ = "deal_rooms"
    
    id = Column(Integer, primary_key=True, index=True)
    deal_id = Column(Integer, ForeignKey("deals.id"), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(DealRoomStatus), default=DealRoomStatus.SETUP, nullable=False)
    
    # Team and collaboration
    team_members = Column(JSON, nullable=True)  # List of user IDs and roles
    external_contacts = Column(JSON, nullable=True)  # Client and advisor contacts
    permissions = Column(JSON, nullable=True)  # Granular permissions per user
    
    # Workflow tracking
    current_phase = Column(String(100), nullable=True)
    phase_progress = Column(Integer, default=0)  # 0-100 percentage
    next_milestone = Column(DateTime, nullable=True)
    last_activity = Column(DateTime, nullable=True)
    
    # AI assistance
    ai_recommendations = Column(JSON, nullable=True)  # AI-generated suggestions
    ai_insights = Column(JSON, nullable=True)  # Cross-deal insights
    automation_rules = Column(JSON, nullable=True)  # Custom automation rules
    
    # Communication
    comments = Column(JSON, nullable=True)  # Threaded comments
    activity_log = Column(JSON, nullable=True)  # Activity timeline
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    deal = relationship("Deal", back_populates="deal_room")
    tasks = relationship("DealRoomTask", back_populates="deal_room")
    documents = relationship("DealRoomDocument", back_populates="deal_room")
    
    def __repr__(self):
        return f"<DealRoom(id={self.id}, name='{self.name}', status='{self.status}')>"
    
    @property
    def is_active(self) -> bool:
        """Check if deal room is active"""
        return self.status in [DealRoomStatus.ACTIVE, DealRoomStatus.DUE_DILIGENCE, 
                              DealRoomStatus.NEGOTIATION, DealRoomStatus.CLOSING]
    
    @property
    def team_size(self) -> int:
        """Get number of team members"""
        if self.team_members:
            return len(self.team_members)
        return 0
    
    def to_dict(self) -> dict:
        """Convert deal room to dictionary"""
        return {
            "id": self.id,
            "deal_id": self.deal_id,
            "name": self.name,
            "description": self.description,
            "status": self.status.value,
            "current_phase": self.current_phase,
            "phase_progress": self.phase_progress,
            "team_size": self.team_size,
            "next_milestone": self.next_milestone.isoformat() if self.next_milestone else None,
            "last_activity": self.last_activity.isoformat() if self.last_activity else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


class DealRoomTask(Base):
    """Task model for deal room workflow management"""
    __tablename__ = "deal_room_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    deal_room_id = Column(Integer, ForeignKey("deal_rooms.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING, nullable=False)
    priority = Column(String(20), default="medium", nullable=False)  # low, medium, high, urgent
    
    # Assignment and tracking
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    due_date = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Task metadata
    task_type = Column(String(100), nullable=True)  # document_review, financial_analysis, etc.
    estimated_hours = Column(Integer, nullable=True)
    actual_hours = Column(Integer, nullable=True)
    dependencies = Column(JSON, nullable=True)  # List of task IDs this depends on
    
    # AI assistance
    ai_generated = Column(Boolean, default=False, nullable=False)
    ai_suggestions = Column(JSON, nullable=True)
    automation_enabled = Column(Boolean, default=False, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    deal_room = relationship("DealRoom", back_populates="tasks")
    assigned_user = relationship("User")
    created_user = relationship("User")
    
    def __repr__(self):
        return f"<DealRoomTask(id={self.id}, title='{self.title}', status='{self.status}')>"
    
    @property
    def is_overdue(self) -> bool:
        """Check if task is overdue"""
        if self.due_date and self.status != TaskStatus.COMPLETED:
            return datetime.utcnow() > self.due_date
        return False
    
    @property
    def is_completed(self) -> bool:
        """Check if task is completed"""
        return self.status == TaskStatus.COMPLETED
    
    def to_dict(self) -> dict:
        """Convert task to dictionary"""
        return {
            "id": self.id,
            "deal_room_id": self.deal_room_id,
            "title": self.title,
            "description": self.description,
            "status": self.status.value,
            "priority": self.priority,
            "assigned_to": self.assigned_to,
            "created_by": self.created_by,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "task_type": self.task_type,
            "estimated_hours": self.estimated_hours,
            "actual_hours": self.actual_hours,
            "is_overdue": self.is_overdue,
            "is_completed": self.is_completed,
            "ai_generated": self.ai_generated,
            "automation_enabled": self.automation_enabled,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }


class DealRoomDocument(Base):
    """Document model for deal room file management"""
    __tablename__ = "deal_room_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    deal_room_id = Column(Integer, ForeignKey("deal_rooms.id"), nullable=False)
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    
    # Deal room specific metadata
    folder_path = Column(String(500), nullable=True)  # Virtual folder structure
    tags = Column(JSON, nullable=True)  # Document tags for organization
    version = Column(Integer, default=1, nullable=False)
    is_latest = Column(Boolean, default=True, nullable=False)
    
    # Collaboration features
    shared_with = Column(JSON, nullable=True)  # List of user IDs with access
    comments = Column(JSON, nullable=True)  # Document-specific comments
    review_status = Column(String(50), nullable=True)  # pending, approved, rejected
    
    # AI processing
    ai_analysis = Column(JSON, nullable=True)  # AI-generated document insights
    auto_tags = Column(JSON, nullable=True)  # AI-generated tags
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    deal_room = relationship("DealRoom", back_populates="documents")
    document = relationship("Document")
    
    def __repr__(self):
        return f"<DealRoomDocument(id={self.id}, document_id={self.document_id})>"
    
    def to_dict(self) -> dict:
        """Convert deal room document to dictionary"""
        return {
            "id": self.id,
            "deal_room_id": self.deal_room_id,
            "document_id": self.document_id,
            "folder_path": self.folder_path,
            "tags": self.tags,
            "version": self.version,
            "is_latest": self.is_latest,
            "shared_with": self.shared_with,
            "review_status": self.review_status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        } 