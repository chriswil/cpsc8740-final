# 8. Final Project Report

**Project Title**: AI-Powered Personal Study Assistant
**Developer**: Chris Williams
**Course**: CPSC 8740

---

## 1. Project Overview

The **AI-Powered Personal Study Assistant** is a unified web platform designed to transform passive learning materials into active study experiences. In the modern educational landscape, students are often overwhelmed by dense textbooks, research papers, and unstructured lecture notes. Traditional study methods—like manual note-taking or flashcard creation—are time-consuming and inefficient.

This project solves that problem by using **Artificial Intelligence** to automate the creation of high-quality study aids. Users can upload documents (PDF, PPTX, DOCX), and the system immediately generates **Flashcards**, **Quizzes**, and **Summaries**. Furthermore, a **Conversational AI** interface allows users to "chat" with their documents, asking questions and receiving answers grounded specifically in the uploaded content.

## 2. Methodology & Architecture

### 2.1 Technology Stack
The application is built on a modern, scalable stack:
*   **Frontend**: React.js (Vite) + Tailwind CSS for a responsive, component-based UI.
*   **Backend**: FastAPI (Python) for high-performance, asynchronous API handling.
*   **Database**: SQLAlchemy with SQLite (Dev) / PostgreSQL (Prod) for relational data storage.
*   **AI Engine**: Anthropic Claude 3 Haiku (via API) or Ollama (Local Llama 3) for natural language processing.

### 2.2 System Architecture
The system follows a microservices-lite architecture:
1.  **Document Service**: Handles file uploads, storage, and text extraction (using `pypdf2`, `python-pptx`).
2.  **AI Service**: Abstracts the LLM provider, handling prompt engineering and JSON response parsing.
3.  **Study Service**: Manages the generation and persistence of Flashcards and Quizzes.
4.  **Analytics Service**: Tracks user activity (sessions, duration) and calculates metrics like "Streaks" and "Spaced Repetition" intervals.

## 3. AI Model Development

The core intelligence of the application relies on **Prompt Engineering** rather than fine-tuning. We utilized **Few-Shot Learning** techniques in our system prompts to ensure the LLM outputs data in strict JSON formats compatible with our frontend.

*   **Flashcard Prompt**: Instructs the AI to identify key terms and definitions, outputting a JSON array of `{front, back}` objects.
*   **Quiz Prompt**: Requests multiple-choice questions with distractors and correct answer indices.
*   **Chat Prompt**: Enforces a "Tutor" persona, restricting answers to the provided context to prevent hallucinations.

## 4. UI Design and Integration

The User Interface was designed with a focus on **Cognitive Load Reduction**.
*   **Dashboard**: Serves as the central hub, using **Data Visualization** (Recharts) to show progress at a glance. The "Streak" counter utilizes gamification psychology to encourage daily engagement.
*   **Study Views**: The Flashcard and Quiz interfaces are modal-based to minimize distractions. The "Review Mode" implements large, clear rating buttons ("Easy", "Hard") to facilitate the Spaced Repetition workflow.

## 5. Testing and Refinement

Development followed an iterative cycle. Key refinements included:
*   **Spaced Repetition (SRS)**: Initially, flashcards were static. We implemented the **SM-2 Algorithm** (SuperMemo-2) to dynamically schedule reviews based on user performance, significantly improving the learning value of the app.
*   **Timezone Handling**: User testing revealed discrepancies in daily activity tracking. We refactored the analytics engine to respect the user's local timezone, ensuring accurate "Streak" calculation.

## 6. Conclusion and Future Work

The AI-Powered Personal Study Assistant successfully demonstrates how LLMs can be integrated into educational workflows to save time and improve retention. The application meets all core requirements: multi-format support, automated content generation, and progress tracking.

**Future enhancements** will focus on:
1.  **Mobile App**: Developing a React Native version for on-the-go study.
2.  **Collaborative Features**: Allowing students to share flashcard decks and compete on quiz leaderboards.
3.  **Advanced OCR**: Improving support for handwritten notes and scanned images.

---
*See attached "Final Project Artifacts" for detailed screenshots, code snippets, and setup guides.*
