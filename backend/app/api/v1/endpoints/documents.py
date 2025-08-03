from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.document import Document, DocumentType, DocumentStatus

router = APIRouter()


class DocumentResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    file_size: int
    status: str
    document_type: str
    uploaded_by: int
    deal_id: Optional[int]
    ai_analysis_completed: bool
    ocr_completed: bool
    nlp_completed: bool
    risk_flags: Optional[dict]
    extracted_data: Optional[dict]
    processing_time: Optional[float]
    created_at: str
    updated_at: str


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    deal_id: Optional[int] = None,
    document_type: DocumentType = DocumentType.OTHER,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload a document for processing"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # TODO: Save file to storage and create document record
    # For now, create a mock document record
    new_document = Document(
        filename=file.filename,
        file_type=file.content_type or "application/octet-stream",
        file_size=0,  # Would be actual file size
        document_type=document_type,
        uploaded_by=user.id,
        deal_id=deal_id,
        status=DocumentStatus.UPLOADED
    )
    
    db.add(new_document)
    await db.commit()
    await db.refresh(new_document)
    
    return {"message": "Document uploaded successfully", "document_id": new_document.id}


@router.get("/", response_model=List[DocumentResponse])
async def get_documents(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    deal_id: Optional[int] = None,
    document_type: Optional[DocumentType] = None,
    status: Optional[DocumentStatus] = None,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get documents with optional filtering"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Build query
    query = select(Document)
    
    # Apply filters
    if deal_id:
        query = query.where(Document.deal_id == deal_id)
    if document_type:
        query = query.where(Document.document_type == document_type)
    if status:
        query = query.where(Document.status == status)
    
    # Apply user permissions
    if not user.is_manager:
        query = query.where(Document.uploaded_by == user.id)
    
    # Apply pagination
    query = query.offset(skip).limit(limit)
    
    # Execute query
    result = await db.execute(query)
    documents = result.scalars().all()
    
    return [DocumentResponse(**doc.to_dict()) for doc in documents]


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: int,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific document by ID"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get document
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Check permissions
    if not user.is_manager and document.uploaded_by != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return DocumentResponse(**document.to_dict())


@router.post("/{document_id}/process")
async def process_document(
    document_id: int,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Start AI processing for a document"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get document
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Check permissions
    if not user.is_manager and document.uploaded_by != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Update processing status
    await db.execute(
        update(Document)
        .where(Document.id == document_id)
        .values(
            status=DocumentStatus.PROCESSING,
            ai_processing_started=datetime.utcnow()
        )
    )
    await db.commit()
    
    # TODO: Trigger AI processing background task
    
    return {"message": "Document processing started", "document_id": document_id}


@router.delete("/{document_id}")
async def delete_document(
    document_id: int,
    current_user_id: str = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a document"""
    # Get current user
    result = await db.execute(select(User).where(User.id == int(current_user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get document
    result = await db.execute(select(Document).where(Document.id == document_id))
    document = result.scalar_one_or_none()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Check permissions (only uploader or admin can delete)
    if not (user.is_admin or document.uploaded_by == user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Delete document
    await db.execute(delete(Document).where(Document.id == document_id))
    await db.commit()
    
    return {"message": "Document deleted successfully"}