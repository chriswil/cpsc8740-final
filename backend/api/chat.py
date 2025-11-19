from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, database
from ..services import parser, ai
import datetime

router = APIRouter(
    prefix="/api/chat",
    tags=["chat"]
)

@router.post("/send/{document_id}", response_model=schemas.ChatMessage)
async def send_message(
    document_id: int, 
    message: schemas.ChatMessageCreate, 
    db: Session = Depends(database.get_db)
):
    # 1. Verify document exists
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # 2. Save user message
    user_msg = models.ChatMessage(
        document_id=document_id,
        role="user",
        content=message.content,
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)
    
    # 3. Get context from document
    context_text = parser.extract_text(document.file_path, document.file_type)
    if not context_text:
        raise HTTPException(status_code=400, detail="Could not extract text from document")
    
    # 4. Get recent history (last 10 messages) for context
    history = db.query(models.ChatMessage).filter(
        models.ChatMessage.document_id == document_id
    ).order_by(models.ChatMessage.timestamp.desc()).limit(10).all()
    
    # Reverse to chronological order and format for AI
    chat_history = [
        {"role": msg.role, "content": msg.content} 
        for msg in reversed(history)
    ]
    
    # 5. Generate AI response
    ai_response_text = ai.generate_chat_response(chat_history, context_text)
    
    # 6. Save AI response
    ai_msg = models.ChatMessage(
        document_id=document_id,
        role="assistant",
        content=ai_response_text,
        timestamp=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)
    
    return ai_msg

@router.get("/history/{document_id}", response_model=List[schemas.ChatMessage])
async def get_chat_history(document_id: int, db: Session = Depends(database.get_db)):
    messages = db.query(models.ChatMessage).filter(
        models.ChatMessage.document_id == document_id
    ).order_by(models.ChatMessage.timestamp.asc()).all()
    return messages
