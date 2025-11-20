# Presentation Content Outline (Slide Deck)

## Slide 1: Title Slide
*   **Title**: AI-Powered Personal Study Assistant
*   **Subtitle**: Transforming Passive Content into Active Learning
*   **Name**: Chris Williams
*   **Course**: CPSC 8740

## Slide 2: The Problem
*   **Information Overload**: Students drown in PDFs, textbooks, and lecture notes.
*   **Inefficient Study Methods**: Passive reading has low retention. Creating flashcards manually takes too long.
*   **Fragmentation**: Learning happens across too many disconnected apps (Drive, Quizlet, Notes).

## Slide 3: The Solution
*   **Unified Platform**: One place to Upload, Organize, and Study.
*   **AI Automation**: Instantly turns documents into Flashcards, Quizzes, and Summaries.
*   **Active Learning**: Chat with your notes and use Spaced Repetition to master concepts.

## Slide 4: System Architecture
*   **Frontend**: React.js + Tailwind CSS (Fast, Responsive).
*   **Backend**: FastAPI (Async Python).
*   **AI Engine**: Anthropic Claude 3 / Ollama (Intelligent Processing).
*   **Database**: SQLAlchemy (Reliable Storage).
*   *[Visual: Diagram showing Document -> API -> LLM -> JSON -> Frontend]*

## Slide 5: Key Feature 1 - Intelligent Document Processing
*   **Multi-Format**: Supports PDF, PPTX, DOCX.
*   **Auto-Categorization**: AI tags documents by subject (e.g., "Biology", "History").
*   **Search**: Full-text search across your entire library.

## Slide 6: Key Feature 2 - Automated Study Aids
*   **Flashcards**: Generated in seconds.
*   **Quizzes**: Multiple-choice questions to test understanding.
*   **Chat**: Ask specific questions and get cited answers from your text.

## Slide 7: Key Feature 3 - Progress Tracking & SRS
*   **Dashboard**: Visual analytics (Streaks, Time Spent).
*   **Spaced Repetition**: SM-2 Algorithm schedules reviews.
    *   *Rate a card "Hard" -> See it tomorrow.*
    *   *Rate a card "Easy" -> See it next week.*

## Slide 8: UI/UX Design
*   **Philosophy**: Clean, Distraction-Free, Modern.
*   **Tools**: Figma (Wireframing) -> React (Implementation).
*   **Accessibility**: High contrast, clear navigation, keyboard support.
*   *[Visual: Screenshot of the Dashboard]*

## Slide 9: Challenges & Solutions
*   **Challenge**: AI Hallucinations / Bad JSON.
    *   **Solution**: Robust parsing logic and "Tutor Persona" prompting.
*   **Challenge**: Timezone Analytics.
    *   **Solution**: Refactored backend to use Local Time for accurate streaks.

## Slide 10: Live Demo / Walkthrough
*   (Placeholder for live demo or video clip)
*   1. Upload Document.
*   2. Generate Flashcards.
*   3. Review & Rate.
*   4. Check Dashboard.

## Slide 11: Future Roadmap
*   📱 **Mobile App** (React Native).
*   🤝 **Collaboration** (Shared Decks).
*   📝 **OCR** (Handwritten Notes).

## Slide 12: Conclusion
*   **Impact**: Saves time, improves retention, makes studying engaging.
*   **Takeaway**: AI doesn't replace studying; it optimizes it.
*   **Q&A**
