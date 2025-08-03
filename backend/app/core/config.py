from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from pathlib import Path


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "AIBanker"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AIBanker API"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost/aibanker"
    
    # AWS Configuration
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "us-east-1"
    AWS_S3_BUCKET: str = "aibanker-documents"
    AWS_S3_REGION: str = "us-east-1"
    
    # AI/ML Configuration
    HUGGINGFACE_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # External APIs
    REFINITIV_API_KEY: Optional[str] = None
    REFINITIV_BASE_URL: str = "https://api.refinitiv.com"
    SEC_EDGAR_BASE_URL: str = "https://data.sec.gov"
    
    # File Upload
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_FILE_TYPES: List[str] = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "text/plain"
    ]
    
    # Processing Limits
    MAX_DOCUMENTS_PER_DEAL: int = 100
    MAX_PROCESSING_TIME: int = 300  # 5 minutes
    
    # Email Configuration
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    FROM_EMAIL: str = "noreply@aibanker.com"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/aibanker.log"
    
    # Redis (for caching and session management)
    REDIS_URL: str = "redis://localhost:6379"
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    
    # Compliance
    GDPR_ENABLED: bool = True
    DATA_RETENTION_DAYS: int = 2555  # 7 years for financial records
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()

# Ensure log directory exists
log_dir = Path(settings.LOG_FILE).parent
log_dir.mkdir(parents=True, exist_ok=True) 