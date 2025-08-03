from fastapi import APIRouter
from app.api.v1.endpoints import auth, deals, documents, due_diligence, pitchbooks, users, analytics

# Create main API router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(deals.router, prefix="/deals", tags=["Deals"])
api_router.include_router(documents.router, prefix="/documents", tags=["Documents"])
api_router.include_router(due_diligence.router, prefix="/due-diligence", tags=["Due Diligence"])
api_router.include_router(pitchbooks.router, prefix="/pitchbooks", tags=["Pitchbooks"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"]) 