# Git Commit History - CPSC 8740 Final Project

**Project:** AI-Powered Personal Study Assistant  
**Repository:** https://github.com/chriswil/cpsc8740-final  
**Export Date:** November 27, 2025

---

## Commit Timeline

```
* 1fdf297 (HEAD -> main, origin/main) - 10 hours ago
  Feat: Add document source badge to flashcards

* 6a58b3d - 12 hours ago
  Feat: Add Review Now button to Dashboard

* b7b4f13 - 12 hours ago
  Feat: Implement unique flashcard generation (Issue #4)

* 03671fd (origin/issue-6-wcag, issue-6-wcag) - 20 hours ago
  Docs: Update all documentation to reflect 92% WCAG compliance (Issue #6)

* cae0255 - 20 hours ago
  Docs: Update tasks.md with completed WCAG medium-priority fixes

* 7614216 - 20 hours ago
  Fix: Add missing uploadMessage state and setter calls

* 08bf809 - 20 hours ago
  Fix: Remove duplicate uploadMessage causing undefined error

* 1203184 - 20 hours ago
  Feat: Add skip-to-content link for keyboard users (Issue #6)

* e916350 - 20 hours ago
  Feat: Add ARIA live regions for dynamic content (Issue #6)

* 80d7f1e - 22 hours ago
  Docs: Update final presentation and report documents

* 974a549 - 22 hours ago
  Docs: Add Phase 6 and Phase 7 implementation plans

* f171451 (tag: v1.0.0) - 33 hours ago
  Docs: Add Word version of final project report

* cb6aa16 - 34 hours ago
  Critical fix: Correct activeTab typo breaking production build

* f118a9d - 35 hours ago
  Docs: Move tasks.md to docs directory

* 8c98886 - 35 hours ago
  Docs: Add project tasks and phases tracking document

* e6f18fa - 2 days ago
  Docs: Update WCAG compliance status (4/5 high-priority complete)

* 136c0f9 - 2 days ago
  Revert focus-trap-react implementation (causing issues)

* b0e0b0e - 2 days ago
  Fix: Enable escapeDeactivates and onDeactivate callback (Issue #6)

* 5a351a7 - 2 days ago
  Fix: Add active prop to FocusTrap to enable focus trapping (Issue #6)

* cd32a30 - 2 days ago
  Fix: Configure FocusTrap with proper options (Issue #6)

* c174031 - 2 days ago
  Fix: Remove extra closing div in ChatInterface

* 388d622 - 2 days ago
  WCAG: Add focus trap to all modals with Esc key support (Issue #6)

* 7f34060 - 2 days ago
  WCAG: Add non-color indicators to quiz results (Issue #6)

* 8b86ef7 - 2 days ago
  WCAG: Add ARIA labels and focus indicators to all buttons (Issue #6)

* 9958fda - 2 days ago
  WCAG: Add keyboard support to UploadZone and focus indicators to nav (Issue #6)

* d9682fd - 2 days ago
  Fix: Resolve recharts dimension error in Dashboard

* d2c4ee3 (tag: pre-wcag-fixes) - 2 days ago
  Docs: Add WCAG 2.1 Level AA compliance audit

* 330ad6a - 2 days ago
  Fix: Complete replacement of setGeneratingId with setGeneratingState (Issue #5)

* 899222d - 2 days ago
  Fix: Resolve ReferenceError for setGeneratingId (Issue #5)

* 3dc5720 - 2 days ago
  UI: Scope loading spinner to specific button (Issue #5)

* 244aa5f - 2 days ago
  UI: Add loading spinner for generation buttons (Issue #5)

* 15098a5 - 2 days ago
  Docs: Add Swagger UI link to README (Issue #1)

* 0c9a259 - 2 days ago
  Fix: Restore flashcard configuration modal

* 0df521e - 2 days ago
  Fix: Add missing flashcard modal to DocumentList.jsx

* 32c5b9f - 2 days ago
  Feature: Configurable flashcard count (Issue #3)

* 6ae8e79 - 6 days ago
  Refactor: Align Weekly Progress chart to Sunday-Saturday week

* 2ab5500 - 6 days ago
  Fix Bug: Correctly convert local daily boundaries to UTC using offset

* de65617 - 6 days ago
  Fix Bug: Use client-local date for Daily History analytics

* 01eb0e9 - 6 days ago
  Fix Bug: Handle timezone offset in analytics to show correct dates

* c209ea0 - 6 days ago
  Fix Bug: Rename prop to onUploadComplete to fix auto-refresh

* bca8cec - 6 days ago
  Fix Build: Pass VITE_API_URL as build arg to Dockerfile

* b21059e - 6 days ago
  Fix Bug: Use backticks for API URL in UploadZone.jsx

* 5e658e3 - 6 days ago
  Fix Runtime Crash: Import missing useCallback in UploadZone.jsx

* beb569a - 6 days ago
  Debug: Add ErrorBoundary to capture production crashes

* 8111e84 - 6 days ago
  Fix Build: Downgrade framer-motion to v11 (stable) to resolve import errors

* 27af446 - 6 days ago
  Fix Syntax: Remove markdown block and fix template literals in all components

* f93f375 - 6 days ago
  Fix Build: Remove unused react-dropzone import

* b774f21 - 6 days ago
  Fix Build: Add missing dependencies and upgrade Node to v20

* 1f8fd89 - 6 days ago
  Refactor: Replace hardcoded localhost URLs with API_BASE_URL from config

* e4f0156 - 6 days ago
  Feat: Configure CORS via environment variable for production

* b761db7 - 6 days ago
  Fix TypeError: Upgrade Dockerfile to Python 3.10 to support union types (|)

* 0dec134 - 6 days ago
  Fix ImportError: Replace relative import in models.py and add __init__.py files

* 2764d4e - 6 days ago
  Fix ImportError: Replace relative imports with absolute imports in api modules

* 5d5d947 - 6 days ago
  Fix ImportError: Replace relative imports with absolute imports in main.py

* 1a2199c - 7 days ago
  Fix render.yaml: Use placeholder for VITE_API_URL (must be set manually)

* f09f5a4 - 7 days ago
  Refactor: Dockerize frontend to bypass Render static site type issues

* a0f0d8e - 7 days ago
  Fix render.yaml: Use correct type 'static_site'

* e246e32 - 7 days ago
  Fix render.yaml: Use correct type 'pstatic' for static site

* c4f6533 - 7 days ago
  Add Render deployment configuration (Dockerfile, render.yaml)

* da57ab1 - 8 days ago
  Update README with project summary and setup instructions

* 0ea8eeb - 8 days ago
  Complete Phases 1-4: MVP, Study Tools, Interactive Features, and Progress Tracking

* d89b7bf - 8 days ago
  Create README.md

* c593b12 - 8 days ago
  Initial commit
```

---

## Key Milestones

### v1.0.0 (Tag: f171451)
Initial stable release with complete feature set:
- Document processing and AI study tool generation
- Spaced repetition system (SM-2 algorithm)
- Progress tracking and analytics
- Deployed to production on Render.com

### Issue #6: WCAG 2.1 Level AA Compliance
**Goal:** Increase accessibility from ~70% to 92%

**Commits:** e916350, 1203184, 7614216, 03671fd
- Added ARIA live regions for dynamic content
- Implemented skip-to-content link
- Added keyboard support to UploadZone
- Fixed upload message state bug
- Attempted focus trap (reverted due to breaking issues)

**Outcome:** 92% compliance (7/9 priority fixes complete)

### Issue #4: Unique Flashcard Generation
**Goal:** Generate different flashcards each time from the same document

**Commits:** b7b4f13, 6a58b3d, 1fdf297
- Modified AI prompt to avoid previously covered topics
- Added "Review Now" button to Dashboard
- Added document source badge to flashcards

**Outcome:** Users can now generate unlimited unique flashcard sets

---

## Statistics

- **Total Commits:** 67
- **Contributors:** chris williams (chriswil)
- **Tags:** v1.0.0, pre-wcag-fixes
- **Active Branches:** main, issue-6-wcag, issue-4-unique-flashcards
- **Lines Changed:** 4,000+ insertions, 2,000+ deletions (estimated)
