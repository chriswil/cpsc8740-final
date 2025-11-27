from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models import User, Session as SessionModel
import secrets
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/auth", tags=["auth"])
security = HTTPBearer()

# Load users from environment variables
def get_env_users():
    """Load username/password pairs from .env file"""
    users = {}
    i = 1
    while True:
        username_key = f"USER_{i}_USERNAME"
        password_key = f"USER_{i}_PASSWORD"
        
        username = os.getenv(username_key)
        password = os.getenv(password_key)
        
        if not username or not password:
            break
            
        users[username] = password
        i += 1
    
    return users

# Request/Response Models
class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    token: str
    username: str

class UserResponse(BaseModel):
    id: int
    username: str
    
    class Config:
        from_attributes = True

@router.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with hardcoded credentials from .env"""
    env_users = get_env_users()
    
    # Validate credentials against .env
    if credentials.username not in env_users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    if env_users[credentials.username] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Get or create user in database
    user = db.query(User).filter(User.username == credentials.username).first()
    if not user:
        user = User(username=credentials.username)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Create session token
    token = secrets.token_urlsafe(32)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(days=7)
    
    session = SessionModel(
        user_id=user.id,
        token=token,
        expires_at=expires_at
    )
    db.add(session)
    db.commit()
    
    return LoginResponse(token=token, username=user.username)

@router.post("/logout")
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Invalidate current session"""
    token = credentials.credentials
    
    session = db.query(SessionModel).filter(SessionModel.token == token).first()
    if session:
        db.delete(session)
        db.commit()
    
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get current authenticated user"""
    token = credentials.credentials
    
    session = db.query(SessionModel).filter(SessionModel.token == token).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session"
        )
    
    # Check if session expired
    if session.expires_at < datetime.datetime.utcnow():
        db.delete(session)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired"
        )
    
    user = db.query(User).filter(User.id == session.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user
