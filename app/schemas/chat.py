from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str
    user_id: int

class ChatResponse(BaseModel):
    answer: str
    source_documents: list[str]