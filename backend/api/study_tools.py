from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from .. import models, database
from ..services import parser, ai
import os
import datetime

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
    
    # Check if flashcards already exist
    existing_cards = db.query(models.Flashcard).filter(models.Flashcard.document_id == document_id).all()
    if existing_cards:
        return existing_cards

    # Generate flashcards
    flashcards_data = ai.generate_flashcards(text)
    
    # Save to DB
    new_cards = []
    for card in flashcards_data:
        new_card = models.Flashcard(
            document_id=document_id,
            front=card["front"],
            back=card["back"]
        )
        db.add(new_card)
        new_cards.append(new_card)
    
    db.commit()
    for card in new_cards:
        db.refresh(card)
        
    return new_cards

from pydantic import BaseModel
from ..services import srs

class ReviewData(BaseModel):
    grade: int # 0-5

@router.post("/flashcards/{card_id}/review")
def review_flashcard(card_id: int, review: ReviewData, db: Session = Depends(database.get_db)):
    card = db.query(models.Flashcard).filter(models.Flashcard.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
        
    result = srs.calculate_review(
        grade=review.grade,
        repetitions=card.repetitions,
        ease_factor=card.ease_factor,
        interval=card.interval
    )
    
    card.repetitions = result["repetitions"]
    card.ease_factor = result["ease_factor"]
    card.interval = result["interval"]
    card.next_review = result["next_review"]
    
    db.commit()
    return result

@router.get("/flashcards/due")
def get_due_flashcards(db: Session = Depends(database.get_db)):
    now = datetime.datetime.utcnow()
    due_cards = db.query(models.Flashcard).filter(models.Flashcard.next_review <= now).all()
    return due_cards

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
