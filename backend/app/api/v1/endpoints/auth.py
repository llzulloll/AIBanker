from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

from app.core.database import get_db
from app.core.security import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    generate_token_pair,
    validate_password_strength,
    get_current_user
)
from app.models.user import User, UserStatus, UserRole
from app.core.config import settings

router = APIRouter()


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company_name: Optional[str] = None
    job_title: Optional[str] = None


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int
    user: dict


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    role: str
    status: str
    company_name: Optional[str]
    job_title: Optional[str]
    is_active: bool
    is_verified: bool
    created_at: str


@router.post("/login", response_model=TokenResponse)
async def login(
    user_credentials: UserLogin,
    db: AsyncSession = Depends(get_db)
):
    """User login endpoint"""
    # Find user by email
    result = await db.execute(select(User).where(User.email == user_credentials.email))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    await db.commit()
    
    # Generate tokens
    tokens = generate_token_pair(str(user.id), user.email)
    
    return TokenResponse(
        **tokens,
        user=user.to_dict()
    )


@router.post("/register", response_model=TokenResponse)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db)
):
    """User registration endpoint"""
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    result = await db.execute(select(User).where(User.username == user_data.username))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Validate password strength
    if not validate_password_strength(user_data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password does not meet security requirements"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        company_name=user_data.company_name,
        job_title=user_data.job_title,
        role=UserRole.ANALYST,
        status=UserStatus.PENDING,
        is_active=True,
        is_verified=False
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Generate tokens
    tokens = generate_token_pair(str(new_user.id), new_user.email)
    
    return TokenResponse(
        **tokens,
        user=new_user.to_dict()
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Refresh access token"""
    # Get user from database
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user or account deactivated"
        )
    
    # Generate new tokens
    tokens = generate_token_pair(str(user.id), user.email)
    
    return TokenResponse(
        **tokens,
        user=user.to_dict()
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get current user information"""
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(**user.to_dict())


@router.post("/logout")
async def logout():
    """User logout endpoint (client-side token removal)"""
    return {"message": "Successfully logged out"}


@router.post("/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Change user password"""
    # Get user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify current password
    if not verify_password(current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password strength
    if not validate_password_strength(new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password does not meet security requirements"
        )
    
    # Update password
    user.hashed_password = get_password_hash(new_password)
    await db.commit()
    
    return {"message": "Password changed successfully"} 