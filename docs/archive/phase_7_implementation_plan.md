# Phase 7: Usability Testing & Accessibility Implementation Plan

## Goal
Conduct usability testing with real users, implement feedback-driven improvements, and ensure WCAG 2.1 Level AA accessibility compliance.

## User Review Required
> [!WARNING]
> **Focus Trap Limitation**: The focus-trap-react library integration caused breaking issues (Quiz not opening). After multiple attempts, this fix was reverted. Modal focus management remains a known limitation.

## Proposed Changes

### Usability Testing
#### Testing Protocol
- Recruit 5 participants (students/learners)
- Task-based evaluation with think-aloud protocol
- Tasks: Upload document, generate flashcards/quiz, use chat, review dashboard
- 20-30 minute sessions
- Post-task questionnaire (SUS scale)

### Bug Fixes from Feedback
#### [MODIFY] [DocumentList.jsx](file:///Users/chris/git/cpsc8740-final/frontend/src/components/DocumentList.jsx)
- **Issue #5**: Add spinner with "Generating..." text during flashcard/quiz generation
- **Issue #3**: Add dialog to select flashcard count (5, 10, 15 cards)
- Track `generatingState` object with `{docId, type}` to show spinner only on active button

#### [MODIFY] [study_tools.py](file:///Users/chris/git/cpsc8740-final/backend/api/study_tools.py)
- **Issue #3**: Accept `num_cards` query parameter in `create_flashcards` endpoint

#### [MODIFY] [ai.py](file:///Users/chris/git/cpsc8740-final/backend/services/ai.py)
- **Issue #3**: Update `generate_flashcards` to accept and use `num_cards` parameter

### WCAG 2.1 Level AA Compliance
#### [NEW] [wcag-compliance.md](file:///Users/chris/git/cpsc8740-final/docs/wcag-compliance.md)
- Comprehensive accessibility audit document
- Component-by-component findings
- Priority action items

#### High-Priority Accessibility Fixes

**1. Keyboard Support for UploadZone**
#### [MODIFY] [UploadZone.jsx](file:///Users/chris/git/cpsc8740-final/frontend/src/components/UploadZone.jsx)
- Add `role="button"`, `tabIndex={0}`
- Add `onKeyDown` handler for Enter/Space keys
- Add descriptive `aria-label`
- Add `focus:ring-2 focus:ring-blue-500`

**2. Focus Indicators on All Interactive Elements**
#### [MODIFY] Multiple components
- Add `focus:outline-none focus:ring-2 focus:ring-blue-500` to all buttons
- Add `aria-current` to navigation tabs
- Components: App.jsx, DocumentList.jsx, FlashcardView.jsx, QuizView.jsx, ChatInterface.jsx

**3. ARIA Labels for Icon-Only Buttons**
#### [MODIFY] Multiple components
- Add descriptive `aria-label` to close buttons (X icons)
- Add `aria-label` to action buttons (Chat, Flashcards, Quiz, Delete)
- Add `aria-label` to send button in chat
- Format: `aria-label="Chat with ${doc.filename}"`

**4. Non-Color Indicators for Quiz Results**
#### [MODIFY] [QuizView.jsx](file:///Users/chris/git/cpsc8740-final/frontend/src/components/QuizView.jsx)
- Add checkmark (✓) icon for correct answers
- Add X (✗) icon for incorrect answers
- Include alongside color (green/red) indicators

**5. Focus Trap in Modals** ❌ Deferred
- Attempted with `focus-trap-react` library
- Caused breaking issues (Quiz wouldn't open, Tab behavior broken)
- Reverted all changes
- Marked as future work

### Medium-Priority Fixes (Deferred to Future Work)
- ARIA live regions for dynamic content
- Color contrast verification (all ratios 4.5:1+)
- Text alternatives for dashboard charts
- Skip-to-content link

## Verification Plan

### Usability Testing
1. Conduct 5 user sessions
2. Analyze feedback and identify pain points
3. Implement high-priority fixes
4. Re-test with subset of users

### Accessibility Testing
1. Run axe DevTools automated scan
2. Manual keyboard navigation (Tab through entire app)
3. Screen reader testing (VoiceOver on Mac / NVDA on Windows)
4. Verify 200% zoom usability
5. Color contrast validation with WebAIM tool

### Success Metrics
- WCAG compliance: 70% → 85% (4/5 high-priority fixes)
- Zero axe DevTools violations for implemented fixes
- All interactive elements keyboard-accessible
- All icon-only buttons have descriptive labels
