
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Relationships
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    
    user = relationship("User", back_populates="sessions")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, index=True)
    file_path = Column(String)
    file_type = Column(String)
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    category = Column(String, default="Uncategorized")
    summary = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="documents")
    chat_messages = relationship("ChatMessage", back_populates="document", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    role = Column(String) # "user" or "assistant"
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    
    document = relationship("Document", back_populates="chat_messages")

class StudySession(Base):
    __tablename__ = "study_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    activity_type = Column(String) # "flashcards", "quiz", "chat"
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    duration_seconds = Column(Integer, default=0)
    
    document = relationship("Document", back_populates="study_sessions")

class Flashcard(Base):
    __tablename__ = "flashcards"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id"))
    front = Column(String)
    back = Column(String)
    
    # SRS Fields
    next_review = Column(DateTime, default=datetime.datetime.utcnow)
    interval = Column(Integer, default=0) # Days
    ease_factor = Column(Float, default=2.5)
    repetitions = Column(Integer, default=0)
    
    document = relationship("Document", back_populates="flashcards")

# Update Document to include relationships
Document.study_sessions = relationship("StudySession", back_populates="document", cascade="all, delete-orphan")
Document.flashcards = relationship("Flashcard", back_populates="document", cascade="all, delete-orphan")
