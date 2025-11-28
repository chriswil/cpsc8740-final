from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from database import engine, Base
from api import documents, study_tools, chat, analytics, auth

# Create database tables
Base.metadata.create_all(bind=engine)

# Auto-sync users from environment variables on startup
def sync_users_from_env():
    """Create users from environment variables if they don't exist"""
    from database import SessionLocal
    from models import User
    
    db = SessionLocal()
    try:
        i = 1
        while True:
            username = os.getenv(f"USER_{i}_USERNAME")
            if not username:
                break
            
            # Check if user exists
            existing_user = db.query(User).filter(User.username == username).first()
            if not existing_user:
                user = User(username=username)
                db.add(user)
                print(f"✅ Created user: {username}")
            
            i += 1
        
        db.commit()
    except Exception as e:
        print(f"❌ Error syncing users: {e}")
        db.rollback()
    finally:
        db.close()

sync_users_from_env()

app = FastAPI(title="AI Study Assistant API")

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
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
