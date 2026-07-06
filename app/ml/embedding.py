from sentence_transformers import SentenceTransformer
from app.core.config import settings

# Menggunakan model open-source yang ringan dan cepat untuk embedding lokal
model = SentenceTransformer(settings.EMBEDDING_MODEL)

def get_embedding(text: str) -> list[float]:
    """Generate vector embedding dari teks menggunakan SentenceTransformers."""
    vector = model.encode(text)
    return vector.tolist()