# 3. AI Tool Setup Summary

## Tool Selection & Rationale

### 1. Large Language Models (LLMs)
*   **Primary Model: Anthropic Claude 3 Haiku**
    *   **Reason**: Selected for its balance of speed, cost-effectiveness, and high performance in text summarization and structured data generation (JSON). It excels at following complex instructions for creating flashcards and quizzes.
*   **Secondary/Local Option: Ollama (Llama 3)**
    *   **Reason**: Included to provide a privacy-focused, offline-capable alternative. It allows users to run the application without external API dependencies if they have sufficient hardware.

### 2. Backend Framework: FastAPI (Python)
*   **Reason**: Chosen for its native support for asynchronous programming (critical for AI requests), automatic OpenAPI documentation (Swagger UI), and high performance. It integrates seamlessly with Python's rich AI/ML ecosystem.

### 3. Frontend Library: React.js + Vite
*   **Reason**: React's component-based architecture is ideal for building dynamic, interactive interfaces like the Chat and Dashboard. Vite provides a lightning-fast development experience.
*   **Styling**: Tailwind CSS was selected for rapid UI development and consistent design tokens.
*   **Visualization**: Recharts was chosen for the Analytics Dashboard due to its composable React components and good default aesthetics.

### 4. Database: SQLAlchemy + SQLite (Dev) / PostgreSQL (Prod)
*   **Reason**: SQLAlchemy ORM provides a robust abstraction layer, allowing for easy switching between SQLite for development and PostgreSQL for production.

## Setup Process

1.  **Environment Configuration**:
    *   Created a `.env` file to securely manage API keys (`ANTHROPIC_API_KEY`) and configuration toggles (`DEFAULT_SUMMARY_METHOD`).
    *   Used `python-dotenv` to load these variables into the application context.

2.  **Dependency Management**:
    *   **Backend**: Used `pip` with `requirements.txt` to install `fastapi`, `uvicorn`, `sqlalchemy`, `anthropic`, `pypdf2`, `python-pptx`, etc.
    *   **Frontend**: Used `npm` to manage React dependencies.

3.  **AI Integration**:
    *   Implemented a service layer (`backend/services/ai.py`) to abstract the AI provider.
    *   Created specific prompt templates for "Flashcard Generation", "Quiz Generation", and "Chat" to ensure consistent JSON output.

## Challenges & Solutions

*   **Challenge**: **JSON Parsing Reliability**. LLMs sometimes return markdown text along with JSON, breaking the parser.
    *   **Solution**: Implemented a robust cleaning function in `backend/services/ai.py` to strip markdown code blocks (```json ... ```) before parsing.

*   **Challenge**: **Response Latency**. Generating study aids for large documents can be slow.
    *   **Solution**: Used FastAPI's asynchronous endpoints (`async def`) to prevent blocking the main thread, allowing the server to handle other requests while waiting for the AI.

*   **Challenge**: **Context Window Limits**. Large PDFs exceed the token limit of some models.
    *   **Solution**: Implemented text chunking (though currently simplified for the MVP) and focused on extracting text from specific pages/sections.

## Setup Verification (Screenshots Placeholder)
*   [Insert Screenshot: Terminal showing `uvicorn` startup success]
*   [Insert Screenshot: Swagger UI (`/docs`) showing available endpoints]
*   [Insert Screenshot: `.env` file structure (keys redacted)]
