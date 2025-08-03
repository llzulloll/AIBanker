from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import uvicorn
from app.core.config import settings
from app.api.v1.api import api_router
from app.core.database import engine, Base
from app.core.security import create_access_token
from app.models.user import User
from app.models.deal import Deal
from app.models.document import Document


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🚀 Starting AIBanker API...")
    
    # Create database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    print("✅ Database tables created successfully")
    yield
    
    # Shutdown
    print("🛑 Shutting down AIBanker API...")


# Create FastAPI app instance
app = FastAPI(
    title="AIBanker API",
    description="AI-powered due diligence and pitchbook generation for investment banks",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to AIBanker API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AIBanker API",
        "version": "1.0.0"
    }


@app.get("/api-info")
async def api_info():
    """API information endpoint"""
    return {
        "name": "AIBanker API",
        "description": "AI-powered due diligence and pitchbook generation",
        "version": "1.0.0",
        "features": [
            "Due Diligence Automation",
            "Pitchbook Generation",
            "Document Processing",
            "Risk Analysis",
            "Market Data Integration"
        ],
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "health": "/health"
        }
    }


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 