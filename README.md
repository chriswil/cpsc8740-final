# AI-Powered Personal Study Assistant 🎓

A unified platform that transforms how you learn from complex materials. By combining intelligent document processing with active learning techniques, this application provides a comprehensive study environment that adapts to your needs.

![Main Screen Wireframe](docs/main-screen-wireframe.png)

## 🚀 Features

### 1. 📄 Intelligent Document Processing
- **Multi-format Support**: Upload PDF, PowerPoint, Word, and text files.
- **Auto-Categorization**: AI automatically tags documents by subject (Math, Science, History, etc.).
- **Searchable Library**: Instantly find documents by keyword or category.

### 2. 🧠 AI Study Aids
- **Flashcards**: Automatically generate flashcards from your documents.
- **Quizzes**: Test your knowledge with AI-generated multiple-choice questions.
- **Study Guides**: Get structured summaries of key concepts.

### 3. 💬 Conversational AI
- **Chat with Documents**: Ask questions and get answers grounded in your specific materials.
- **Context-Aware**: The AI references the exact content from your uploads.

### 4. 📈 Progress Tracking
- **Dashboard**: Visualize your learning journey.
- **Streaks**: Track daily study habits.
- **Analytics**: Monitor time spent on flashcards, quizzes, and chat.

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS, Recharts
- **Backend**: FastAPI (Python), SQLAlchemy
- **Database**: SQLite (Dev) / PostgreSQL (Prod)
- **AI/ML**: Anthropic Claude / Ollama (Local LLM), PyPDF2, python-pptx

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- Anthropic API Key (or local Ollama setup)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/chriswil/cpsc8740-final.git
    cd cpsc8740-final
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # or venv\Scripts\activate on Windows
    pip install -r requirements.txt
    ```

3.  **Frontend Setup**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Environment Configuration**
    Create a `.env` file in the root directory:
    ```env
    ANTHROPIC_API_KEY=your_api_key_here
    ANTHROPIC_MODEL=claude-3-haiku-20240307
    # Optional: For local LLM
    # DEFAULT_SUMMARY_METHOD=ollama
    # OLLAMA_URL=http://localhost:11434
    # OLLAMA_MODEL=llama3
    ```

### Running the App

1.  **Start Backend**
    ```bash
    # In /backend
    source venv/bin/activate
    uvicorn main:app --reload --port 8000
    ```

2.  **Start Frontend**
    ```bash
    # In /frontend
    npm run dev
    ```

3.  Open [http://localhost:5173](http://localhost:5173) in your browser.

4.  **API Documentation**
    You can view the interactive API documentation (Swagger UI) at [http://localhost:8000/docs](http://localhost:8000/docs).

## 📄 License

This project is for educational purposes as part of CPSC 8740.
