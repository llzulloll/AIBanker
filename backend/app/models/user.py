from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum
from datetime import datetime
from typing import Optional


class UserRole(str, enum.Enum):
    """User roles enumeration"""
    ADMIN = "admin"
    MANAGER = "manager"
    ANALYST = "analyst"
    VIEWER = "viewer"


class UserStatus(str, enum.Enum):
    """User status enumeration"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING = "pending"


class User(Base):
    """User model for authentication and authorization"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.ANALYST, nullable=False)
    status = Column(Enum(UserStatus), default=UserStatus.PENDING, nullable=False)
    
    # Company information
    company_name = Column(String(255), nullable=True)
    company_size = Column(String(50), nullable=True)
    job_title = Column(String(100), nullable=True)
    
    # Contact information
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    
    # Security and preferences
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    two_factor_enabled = Column(Boolean, default=False, nullable=False)
    last_login = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    deals = relationship("Deal", back_populates="created_by_user")
    documents = relationship("Document", back_populates="uploaded_by_user")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"
    
    @property
    def full_name(self) -> str:
        """Get user's full name"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        else:
            return self.username
    
    @property
    def is_admin(self) -> bool:
        """Check if user is admin"""
        return self.role == UserRole.ADMIN
    
    @property
    def is_manager(self) -> bool:
        """Check if user is manager or admin"""
        return self.role in [UserRole.ADMIN, UserRole.MANAGER]
    
    def can_access_deal(self, deal_user_id: int) -> bool:
        """Check if user can access a specific deal"""
        if self.is_admin or self.is_manager:
            return True
        return self.id == deal_user_id
    
    def to_dict(self) -> dict:
        """Convert user to dictionary"""
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "role": self.role.value,
            "status": self.status.value,
            "company_name": self.company_name,
            "company_size": self.company_size,
            "job_title": self.job_title,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "last_login": self.last_login.isoformat() if self.last_login else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        } 