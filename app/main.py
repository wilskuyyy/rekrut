from fastapi import FastAPI
from app.api.endpoints import chat
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise API untuk Knowledge Base dan RAG",
    version="1.0.0"
)

# Routing module
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}