from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
import datetime
from pydantic import BaseModel
import models, database

router = APIRouter(
    prefix="/api/analytics",
    tags=["analytics"]
)

class SessionStart(BaseModel):
    document_id: int
    activity_type: str

class SessionEnd(BaseModel):
    session_id: int

class SessionResponse(BaseModel):
    id: int
    document_id: int
    activity_type: str
    start_time: datetime.datetime
    end_time: datetime.datetime | None = None
    duration_seconds: int

@router.post("/session/start", response_model=SessionResponse)
def start_session(session_data: SessionStart, db: Session = Depends(database.get_db)):
    # Check if document exists
    document = db.query(models.Document).filter(models.Document.id == session_data.document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
        
    new_session = models.StudySession(
        document_id=session_data.document_id,
        activity_type=session_data.activity_type,
        start_time=datetime.datetime.now(datetime.timezone.utc)
    )
    
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    return new_session

@router.post("/session/end", response_model=SessionResponse)
def end_session(session_data: SessionEnd, db: Session = Depends(database.get_db)):
    session = db.query(models.StudySession).filter(models.StudySession.id == session_data.session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if session.end_time:
        return session # Already ended
        
    end_time = datetime.datetime.now(datetime.timezone.utc)
    # Ensure start_time is timezone aware if it wasn't stored that way (SQLite issue sometimes)
    start_time = session.start_time
    if start_time.tzinfo is None:
        start_time = start_time.replace(tzinfo=datetime.timezone.utc)
        
    duration = int((end_time - start_time).total_seconds())
    
    session.end_time = end_time
    session.duration_seconds = duration
    
    db.commit()
    db.refresh(session)
    
    return session

@router.get("/stats")
def get_stats(timezone_offset: int = 0, db: Session = Depends(database.get_db)):
    # 1. Total Study Time
    total_seconds = db.query(func.sum(models.StudySession.duration_seconds)).scalar() or 0
    
    # 2. Activity Breakdown
    breakdown = db.query(
        models.StudySession.activity_type, 
        func.count(models.StudySession.id)
    ).group_by(models.StudySession.activity_type).all()
    
    activity_stats = {type_: count for type_, count in breakdown}
    
    # Calculate client-side "today"
    # timezone_offset is in minutes (e.g., 300 for EST).
    # MDN: offset is positive if local is behind UTC.
    # So Local = UTC - offset
    utc_now = datetime.datetime.now(datetime.timezone.utc)
    client_now = utc_now - datetime.timedelta(minutes=timezone_offset)
    today_local = client_now.date()
    
    # 3. Current Streak
    # Get all unique dates where a session occurred, converted to LOCAL time
    sessions = db.query(models.StudySession.start_time).order_by(models.StudySession.start_time.desc()).all()
    
    streak = 0
    if sessions:
        # Use calculated local today
        today = today_local
        
        # Convert all session timestamps to local dates
        # Note: session.start_time is UTC (tz-aware or naive-as-utc depending on driver)
        # We assume stored as UTC.
        local_dates = set()
        for s in sessions:
            utc_dt = s.start_time
            if utc_dt.tzinfo is None:
                utc_dt = utc_dt.replace(tzinfo=datetime.timezone.utc)
            local_dt = utc_dt.astimezone() # Converts to system local time
            local_dates.add(local_dt.date())
            
        dates = sorted(list(local_dates), reverse=True)
        
        # Check if we studied today or yesterday to keep streak alive
        if not dates:
            streak = 0
        elif dates[0] == today:
            streak = 1
            current_check = today - datetime.timedelta(days=1)
            idx = 1
        elif dates[0] == today - datetime.timedelta(days=1):
            streak = 1
            current_check = today - datetime.timedelta(days=2)
            idx = 1
        else:
            streak = 0
            idx = 0
            
        # Count backwards
        if streak > 0:
            while idx < len(dates):
                if dates[idx] == current_check:
                    streak += 1
                    current_check -= datetime.timedelta(days=1)
                    idx += 1
                else:
                    break
    
    # 4. Daily History (Last 7 days) - Using LOCAL time boundaries
    # Get local today
    today_local = datetime.datetime.now().date()
    
    daily_stats = []
    # Last 7 days including today
    for i in range(6, -1, -1):
        current_day_date = today_local - datetime.timedelta(days=i)
        
        # Create local datetime range for this day
        # midnight local
        start_of_day_local = datetime.datetime.combine(current_day_date, datetime.time.min)
        # next midnight local
        end_of_day_local = datetime.datetime.combine(current_day_date + datetime.timedelta(days=1), datetime.time.min)
        
        # Convert to UTC for DB query
        # astimezone() on naive datetime assumes local time, converts to target
        start_of_day_utc = start_of_day_local.astimezone(datetime.timezone.utc)
        end_of_day_utc = end_of_day_local.astimezone(datetime.timezone.utc)
        
        # Ensure db timestamps are treated as UTC for comparison if they are naive
        # (SQLAlchemy + SQLite often returns naive datetimes)
        
        daily_sum = db.query(func.sum(models.StudySession.duration_seconds)).filter(
            models.StudySession.start_time >= start_of_day_utc,
            models.StudySession.start_time < end_of_day_utc
        ).scalar() or 0
        
        daily_stats.append({
            "date": current_day_date.strftime("%Y-%m-%d"),
            "name": current_day_date.strftime("%a"), # Mon, Tue, etc.
            "minutes": int(daily_sum / 60)
        })
    
    return {
        "total_minutes": int(total_seconds / 60),
        "activity_breakdown": activity_stats,
        "current_streak": streak,
        "daily_history": daily_stats
    }
