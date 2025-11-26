# Phase 6: Deployment Implementation Plan

## Goal
Containerize and deploy the full-stack application to a production environment, ensuring all features work correctly with environment-specific configurations.

## User Review Required
> [!IMPORTANT]
> **Ephemeral Filesystem**: Render.com uses ephemeral containers, meaning uploaded documents in `backend/uploads/` will be lost on restarts. For MVP, we accept this limitation. Future work could migrate to S3 or Render Persistent Disks.

## Proposed Changes

### Backend
#### [NEW] [Dockerfile](file:///Users/chris/git/cpsc8740-final/backend/Dockerfile)
- Base image: `python:3.10-slim` (upgraded from 3.9 for type union support)
- Install system dependencies
- Copy `requirements.txt` and install Python packages
- Copy application code
- Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

#### [MODIFY] [main.py](file:///Users/chris/git/cpsc8740-final/backend/main.py)
- Configure CORS to use `CORS_ORIGINS` environment variable
- Default to `http://localhost:5173` for local development

#### [MODIFY] [database.py](file:///Users/chris/git/cpsc8740-final/backend/database.py)
- Support both PostgreSQL (production) and SQLite (local)
- Read `DATABASE_URL` from environment

### Frontend
#### [NEW] [Dockerfile](file:///Users/chris/git/cpsc8740-final/frontend/Dockerfile)
- **Build Stage**:
  - Base image: `node:20-alpine` (upgraded to meet Vite 7 requirements)
  - Install dependencies with `npm ci`
  - Accept `VITE_API_URL` build argument
  - Build production bundle with `npm run build`
- **Serve Stage**:
  - Base image: `nginx:alpine`
  - Copy build artifacts to `/usr/share/nginx/html`
  - Copy custom Nginx config

#### [NEW] [nginx.conf](file:///Users/chris/git/cpsc8740-final/frontend/nginx.conf)
- Configure SPA routing (all paths serve `index.html`)

#### [NEW] [config.js](file:///Users/chris/git/cpsc8740-final/frontend/src/config.js)
- Centralize API base URL configuration
- Use `VITE_API_URL` for production, fallback to localhost

#### [MODIFY] All frontend components
- Replace hardcoded `http://localhost:8000` with `API_BASE_URL` from config

### Infrastructure
#### [NEW] [render.yaml](file:///Users/chris/git/cpsc8740-final/render.yaml)
- Define PostgreSQL database service
- Define backend web service (Docker)
- Define frontend static site (Docker)
- Configure environment variables and build commands

#### [NEW] [docker-compose.yml](file:///Users/chris/git/cpsc8740-final/docker-compose.yml)
- Optional local development setup
- Orchestrate backend + frontend services

## Verification Plan

### Local Docker Testing
1. Build backend: `cd backend && docker build -t study-backend .`
2. Build frontend: `cd frontend && docker build -t study-frontend --build-arg VITE_API_URL=http://localhost:8000 .`
3. Run both containers and verify connectivity

### Production Deployment (Render.com)
1. Push code to GitHub
2. Connect repository to Render via `render.yaml` Blueprint
3. Set environment variables in Render Dashboard:
   - `ANTHROPIC_API_KEY`
   - `DATABASE_URL` (auto-generated)
   - `CORS_ORIGINS` = frontend URL
   - `VITE_API_URL` = backend URL
4. Trigger manual deploy
5. Test all features: upload, flashcards, quiz, chat, dashboard
