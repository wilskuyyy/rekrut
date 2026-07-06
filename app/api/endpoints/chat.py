from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.schemas.chat import ChatRequest, ChatResponse
from app.db.session import SessionLocal
from app.ml.embedding import get_embedding
from app.ml.rag_engine import generate_answer

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ChatResponse)
def chat_with_ai(request: ChatRequest, db: Session = Depends(get_db)):
    # 1. Konversi pertanyaan user menjadi vector
    question_vector = get_embedding(request.question)
    
    # 2. Similarity Search menggunakan pgvector (Cosine Similarity)
    # Catatan: Di project riil kita menggunakan ORM, di sini menggunakan raw SQL untuk demonstrasi pgvector
    query = text("""
        SELECT content 
        FROM document_chunks 
        ORDER BY embedding <=> :vector 
        LIMIT 3
    """)
    
    # Format vector untuk PostgreSQL
    vector_str = f"[{','.join(map(str, question_vector))}]"
    result = db.execute(query, {"vector": vector_str}).fetchall()
    
    if not result:
        return ChatResponse(
            answer="Belum ada dokumen di dalam sistem.", 
            source_documents=[]
        )
    
    # 3. Kumpulkan konteks
    contexts = [row[0] for row in result]
    
    # 4. Generate jawaban dari LLM
    answer = generate_answer(request.question, contexts)
    
    return ChatResponse(
        answer=answer,
        source_documents=contexts
    )