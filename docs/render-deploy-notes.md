# Render Deployment Strategy: Infrastructure as Code (IaC)

## Overview
We will use Render's **Blueprints** feature to define our entire infrastructure in a single file (`render.yaml`). This ensures that our deployment is reproducible, version-controlled, and automated.

## The "Blueprint" Approach
Instead of manually creating a database, then a web service, then a static site in the Render dashboard, we define them as code. When we push changes to `render.yaml`, Render automatically updates our infrastructure.

### Architecture Components

#### 1. Database (PostgreSQL)
*   **Type**: Managed PostgreSQL (Free Tier).
*   **Name**: `studyai-db`.
*   **Configuration**:
    *   Region: Oregon (US West) - closest to most users.
    *   Plan: Free (1 GB storage).
    *   **Environment Variables**: Automatically exports `DATABASE_URL` to our backend service.

#### 2. Backend Service (FastAPI)
*   **Type**: Web Service.
*   **Runtime**: Docker.
*   **Build Context**: `./backend`.
*   **Dockerfile**: We will create a `backend/Dockerfile` to containerize the Python app.
*   **Environment Variables**:
    *   `DATABASE_URL`: (From the database component).
    *   `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`: (We must add these manually in the Dashboard for security).
    *   `CORS_ORIGINS`: Set to the frontend URL.

#### 3. Frontend Service (React)
*   **Type**: Static Site.
*   **Build Command**: `npm install && npm run build`.
*   **Publish Directory**: `dist`.
*   **Build Context**: `./frontend`.
*   **Environment Variables**:
    *   `VITE_API_URL`: Set to the backend service URL.

## Implementation Steps

### Step 1: Create `backend/Dockerfile`
We need to tell Render how to build our Python app.
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Step 2: Create `render.yaml`
This is the master plan file in the root of the repo.
```yaml
services:
  # Backend
  - type: web
    name: studyai-backend
    runtime: docker
    rootDir: backend
    plan: free
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: studyai-db
          property: connectionString

  # Frontend
  - type: static
    name: studyai-frontend
    rootDir: frontend
    buildCommand: npm install && npm run build
    publishDir: dist
    envVars:
      - key: VITE_API_URL
        fromService:
          type: web
          name: studyai-backend
          property: url

databases:
  - name: studyai-db
    plan: free
```

### Step 3: Deploy
1.  Commit these files to GitHub.
2.  Go to Render Dashboard -> "New Blueprint".
3.  Connect the GitHub repository.
4.  Render detects `render.yaml` and asks for approval to create the resources.

## Benefits
1.  **Zero Manual Config**: No copy-pasting database URLs.
2.  **Atomic Deploys**: Frontend and Backend deploy together.
3.  **Portability**: The architecture is documented in code, not in someone's head.
