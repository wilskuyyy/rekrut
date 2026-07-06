from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from app.core.config import settings

llm = ChatOpenAI(temperature=0, openai_api_key=settings.OPENAI_API_KEY, model_name="gpt-3.5-turbo")

PROMPT_TEMPLATE = """
Anda adalah AI HR Assistant perusahaan. Jawab pertanyaan karyawan HANYA berdasarkan konteks yang diberikan.
Jika jawabannya tidak ada di konteks, katakan "Maaf, saya tidak menemukan informasi tersebut di dokumen SOP perusahaan."
Jangan membuat-buat jawaban.

Konteks Dokumen:
{context}

Pertanyaan Karyawan:
{question}

Jawaban:
"""

prompt = PromptTemplate(template=PROMPT_TEMPLATE, input_variables=["context", "question"])
chain = LLMChain(llm=llm, prompt=prompt)

def generate_answer(question: str, retrieved_contexts: list[str]) -> str:
    """Menggabungkan konteks yang ditarik dari DB dan meminta LLM untuk menjawab."""
    context_str = "\n\n".join(retrieved_contexts)
    response = chain.run(context=context_str, question=question)
    return response