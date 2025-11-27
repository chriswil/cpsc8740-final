from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
from models import Document, User
import models, schemas, database
from services import parser, ai
from middleware import get_current_user

router = APIRouter(
    prefix="/api/documents",
    tags=["documents"]
)

UPLOAD_DIR = "backend/uploads"

@router.post("/upload", response_model=schemas.Document)
async def upload_document(
    file: UploadFile = File(...), 
    db: Session = Depends(database.get_db),
    current_user: User = Depends(get_current_user)
):
    # Create upload directory if it doesn't exist
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Generate file path
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
    
    # Determine file type
    file_type = os.path.splitext(file.filename)[1].lower().replace(".", "").upper()
    
    # Create database record
    # Extract text for categorization
    text = parser.extract_text(file_path, file_type)
    category = "Uncategorized"
    if text:
        category = ai.suggest_category(text)

    db_document = models.Document(
        filename=file.filename,
        file_path=file_path,
        file_type=file_type,
        category=category,
        user_id=current_user.id
    )
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return db_document

@router.get("/", response_model=List[schemas.Document])
def read_documents(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(database.get_db),
    current_user: User = Depends(get_current_user)
):
    documents = db.query(models.Document).filter(
        models.Document.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return documents

@router.put("/{document_id}/category", response_model=schemas.Document)
async def update_category(
    document_id: int, 
    category: str, 
    db: Session = Depends(database.get_db),
    current_user: User = Depends(get_current_user)
):
    document = db.query(models.Document).filter(
        models.Document.id == document_id,
        models.Document.user_id == current_user.id
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    document.category = category
    db.commit()
    db.refresh(document)
    return document

@router.delete("/{document_id}")
def delete_document(
    document_id: int, 
    db: Session = Depends(database.get_db),
    current_user: User = Depends(get_current_user)
):
    document = db.query(models.Document).filter(
        models.Document.id == document_id,
        models.Document.user_id == current_user.id
    ).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Remove file from filesystem
    if os.path.exists(document.file_path):
        try:
            os.remove(document.file_path)
        except Exception as e:
            print(f"Error deleting file {document.file_path}: {e}")
            # Continue to delete from DB even if file delete fails
            
    db.delete(document)
    db.commit()
    
    return {"message": "Document deleted successfully"}
