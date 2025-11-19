from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api import documents, study_tools, chat, analytics

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Study Assistant API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router)
app.include_router(study_tools.router)
app.include_router(chat.router)
app.include_router(analytics.router)

@app.get("/")
async def root():
    return {"message": "Welcome to AI Study Assistant API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
