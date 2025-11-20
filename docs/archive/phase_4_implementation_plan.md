# Phase 4: Progress Tracking Implementation Plan

## Goal
Implement a system to track user study habits, including study streaks, total time spent, and activity logs, to motivate consistent learning.

## Proposed Changes

### Backend
#### [NEW] [models.py](file:///Users/chris/git/cpsc8740-final/backend/models.py)
- Add `StudySession` model:
    - `id`: Integer, PK
    - `document_id`: ForeignKey to Document
    - `activity_type`: String (e.g., "flashcards", "quiz", "chat")
    - `start_time`: DateTime
    - `end_time`: DateTime (nullable, updated on completion)
    - `duration_seconds`: Integer (calculated)

#### [NEW] [api/analytics.py](file:///Users/chris/git/cpsc8740-final/backend/api/analytics.py)
- `POST /api/analytics/session/start`: Start a timer.
- `POST /api/analytics/session/end`: Stop timer and save duration.
- `GET /api/analytics/stats`: Return:
    - Current Streak (days in a row)
    - Total Study Time (all time)
    - Activity Breakdown (e.g., 50% Flashcards, 30% Quiz)

### Frontend
#### [NEW] [components/Dashboard.jsx](file:///Users/chris/git/cpsc8740-final/frontend/src/components/Dashboard.jsx)
- **Install `recharts`** for beautiful, responsive charts.
- **Streak Counter**: A visual flame icon with the number of days.
- **Activity Distribution**: A **Pie Chart** showing time spent on Flashcards vs Quizzes vs Chat.
- **Study History**: A **Bar Chart** showing total study minutes for the last 7 days.

#### [MODIFY] [App.jsx](file:///Users/chris/git/cpsc8740-final/frontend/src/App.jsx)
- Add "Dashboard" tab/link in the header.
- Track active sessions when opening Flashcards/Quiz/Chat.

## Verification Plan
### Manual Verification
- Open a Flashcard set -> Verify session start request.
- Close Flashcard set -> Verify session end request.
- Check Dashboard -> Verify time added and streak updated.
