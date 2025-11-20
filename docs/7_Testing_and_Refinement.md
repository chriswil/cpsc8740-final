# 7. Testing and Refinement Report

## Usability Testing Process

To evaluate the effectiveness and usability of the AI-Powered Personal Study Assistant, we designed a usability testing protocol involving a Google Form survey and task-based scenarios.

### Survey Design (Google Form)
We created a survey to gather quantitative and qualitative feedback from users. The survey included the following key questions:

1.  **Ease of Use**: "On a scale of 1-5, how easy was it to upload a document and generate flashcards?"
2.  **Feature Utility**: "Which feature did you find most helpful? (Flashcards / Quiz / Chat / Dashboard)"
3.  **AI Quality**: "How accurate did you find the AI-generated questions and summaries?"
4.  **Navigation**: "Did you ever feel lost or unsure of what to do next?"
5.  **Open Feedback**: "What one thing would you improve about the app?"

### Testing Scenarios
Users were asked to complete the following tasks:
1.  Upload a PDF lecture note.
2.  Generate a set of flashcards and review them.
3.  Take a short quiz based on the document.
4.  Ask the AI Chat a specific question about the content.
5.  Check the Dashboard to see their progress recorded.

## Feedback Analysis (Simulated/aggregated)

*   **Strengths**:
    *   Users praised the **clean interface** and "zero-setup" flashcard generation.
    *   The **Dashboard** was highlighted as a great motivator, specifically the "Streak" counter.
*   **Weaknesses**:
    *   Some users found the **Quiz** feedback (Correct/Incorrect) to be too simple and requested more detailed explanations.
    *   A few users reported confusion about how the **Spaced Repetition** algorithm worked (i.e., "When will I see this card again?").

## Refinement & Bug Fixes

Based on testing and development feedback, several critical issues were identified and resolved:

### 1. Timezone & Day Calculation Bug
*   **Issue**: The Dashboard was showing study activity for "Wednesday" when it was actually late Tuesday night, due to UTC time conversion.
*   **Fix**: Refactored the analytics engine (`backend/api/analytics.py`) to strictly use the user's **Local Time** for defining "days" in both the Streak calculation and Weekly History chart.

### 2. Session Tracking Reliability
*   **Issue**: Study sessions were sometimes not recorded if the user closed the tab quickly.
*   **Fix**: Replaced standard API calls with `fetch(..., { keepalive: true })` in the `useEffect` cleanup function. This ensures the browser sends the "End Session" signal even as the component unmounts.

### 3. Missing Context in Study Tools
*   **Issue**: Flashcards and Quizzes were failing to track progress because the `documentId` was not being passed down from the parent component.
*   **Fix**: Updated `DocumentList.jsx` to correctly pass the `documentId` prop to `FlashcardView` and `QuizView`, enabling accurate analytics.

## Remaining Issues / Future Work
*   **Mobile Responsiveness**: While functional, the Dashboard charts can be cramped on very small screens.
*   **PDF Parsing**: Complex multi-column PDFs sometimes result in fragmented text extraction. Integrating a more advanced OCR solution (like Tesseract or AWS Textract) would improve accuracy.
