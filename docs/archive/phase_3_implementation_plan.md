# Phase 3: Interactive Features Implementation Plan

## Goal
Implement interactive study features including a conversational AI interface for "chatting" with documents, a search system, and document organization via categories.

## User Review Required
> [!IMPORTANT]
> **Chat Context Window**: Chatting with *all* documents might exceed token limits. I plan to implement "Chat with specific document" first, and later add "Chat with Library" using RAG (Retrieval Augmented Generation) if needed.

## Proposed Changes

### Backend
#### [MODIFY] [models.py](file:///Users/chris/git/cpsc8740-final/backend/models.py)
- Add `ChatMessage` model to store chat history.
- Add `tags` or `category` field to `Document` model (if not already present/sufficient).

#### [NEW] [chat.py](file:///Users/chris/git/cpsc8740-final/backend/api/chat.py)
- `POST /api/chat/send`: Endpoint to send a message and get an AI response.
- `GET /api/chat/history/{document_id}`: Retrieve chat history for a document.

#### [MODIFY] [ai.py](file:///Users/chris/git/cpsc8740-final/backend/services/ai.py)
- Add `generate_chat_response(messages, context_text)` function.
- Support both Anthropic and Ollama for chat.

### Frontend
#### [NEW] [ChatInterface.jsx](file:///Users/chris/git/cpsc8740-final/frontend/src/components/ChatInterface.jsx)
- Chat UI with message bubbles (user/AI).
- Input field for typing questions.
- Integration with `DocumentList` (e.g., "Chat" button on document card).

#### [MODIFY] [DocumentList.jsx](file:///Users/chris/git/cpsc8740-final/frontend/src/components/DocumentList.jsx)
- Add "Chat" button to document cards.
- Implement Search bar at the top to filter the list by filename/category.

## Verification Plan
### Automated Tests
- Verify new API endpoints using `curl`.

### Manual Verification
- Upload a document and verify "Chat" button appears.
- Test asking questions about the document content with both Anthropic and Ollama.
- Verify search bar filters the document list correctly.
