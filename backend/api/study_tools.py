from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from .. import models, database
from ..services import parser, ai
import os

router = APIRouter(
    prefix="/api/study",
    tags=["study-tools"]
)

@router.post("/flashcards/{document_id}")
async def create_flashcards(document_id: int, db: Session = Depends(database.get_db)):
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Extract text
    text = parser.extract_text(document.file_path, document.file_type)
    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text from document")
    
    # Generate flashcards
    flashcards = ai.generate_flashcards(text)
    
    # In a real app, we would save these to the DB. For now, just return them.
    return flashcards

@router.post("/quiz/{document_id}")
async def create_quiz(document_id: int, db: Session = Depends(database.get_db)):
    document = db.query(models.Document).filter(models.Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    text = parser.extract_text(document.file_path, document.file_type)
    if not text:
        raise HTTPException(status_code=400, detail="Could not extract text from document")
    
    quiz = ai.generate_quiz(text)
    return quiz
