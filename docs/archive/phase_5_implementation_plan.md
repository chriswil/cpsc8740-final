# Phase 5: Spaced Repetition & Smart Review

## Goal
Implement a Spaced Repetition System (SRS) to optimize learning retention. The system will schedule flashcard reviews based on user performance (e.g., "Easy", "Hard", "Again") using an algorithm like SM-2.

## Proposed Changes

### Backend
#### [NEW] [models.py](file:///Users/chris/git/cpsc8740-final/backend/models.py)
- Update `Flashcard` model (or create `FlashcardReview` association):
    - `next_review`: DateTime
    - `interval`: Integer (days)
    - `ease_factor`: Float (default 2.5)
    - `repetitions`: Integer

#### [NEW] [services/srs.py](file:///Users/chris/git/cpsc8740-final/backend/services/srs.py)
- Implement the **SM-2 Algorithm** logic:
    - Input: Current ease, interval, repetitions, and user grade (0-5).
    - Output: New ease, interval, and next review date.

#### [MODIFY] [api/study_tools.py](file:///Users/chris/git/cpsc8740-final/backend/api/study_tools.py)
- `POST /api/flashcards/{id}/review`: Record a review result.
    - Body: `{ "grade": "easy" | "good" | "hard" | "again" }`
- `GET /api/flashcards/due`: Get all flashcards due for review today.

### Frontend
#### [MODIFY] [components/FlashcardView.jsx](file:///Users/chris/git/cpsc8740-final/frontend/src/components/FlashcardView.jsx)
- **Review Mode**:
    - When flipping a card, show rating buttons: "Again", "Hard", "Good", "Easy".
    - Clicking a button sends the grade to the backend and advances to the next card.
- **Due Counter**: Show how many cards are due today.

#### [MODIFY] [components/Dashboard.jsx](file:///Users/chris/git/cpsc8740-final/frontend/src/components/Dashboard.jsx)
- Add a "Due for Review" widget.

## Verification Plan
### Manual Verification
1.  Generate Flashcards.
2.  Enter "Review Mode".
3.  Rate a card as "Easy".
4.  Check database/logs: Verify `next_review` is set to future.
5.  Rate a card as "Again".
6.  Check database/logs: Verify `next_review` is set to today/tomorrow (short interval).
