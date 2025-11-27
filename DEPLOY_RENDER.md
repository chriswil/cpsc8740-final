# Render.com Deployment Guide

## Prerequisites
- Render.com account connected to GitHub repository `chriswil/cpsc8740-final`
- Branch `feature/issue-7-auth` pushed to GitHub ✅

## Step 1: Connect Repository (If Not Already Connected)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Blueprint**
3. Select your GitHub repository: `chriswil/cpsc8740-final`
4. Select branch: `feature/issue-7-auth`
5. Render will detect the `render.yaml` file automatically

## Step 2: Review and Deploy Services

Render will create 3 services from `render.yaml`:
- **studyai-db** (PostgreSQL database)
- **studyai-backend** (Python/FastAPI backend)
- **studyai-frontend** (React/Vite frontend)

Click **Apply** to create all services.

## Step 3: Configure Backend Environment Variables

Navigate to **studyai-backend** → **Environment** and add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | Your Anthropic API key |
| `ANTHROPIC_MODEL` | `claude-haiku-4-5` | AI model to use |
| `DEFAULT_SUMMARY_METHOD` | `anthropic` | Default AI provider |
| `OLLAMA_URL` | `http://localhost:11434` | Optional - for local AI |
| `OLLAMA_MODEL` | `llama3.2` | Optional - local AI model |
| `USER_1_USERNAME` | `demo` | First user account |
| `USER_1_PASSWORD` | `demo8740!` | First user password |
| `USER_2_USERNAME` | `student` | Second user account |
| `USER_2_PASSWORD` | `student8740!` | Second user password |
| `CORS_ORIGINS` | *Wait for Step 4* | Set after frontend deploys |

**Note:** `DATABASE_URL` is auto-populated by Render from the PostgreSQL service.

## Step 4: Configure Frontend Environment Variables

After the backend deploys, you'll get a URL like: `https://studyai-backend.onrender.com`

Navigate to **studyai-frontend** → **Environment** and set:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://studyai-backend.onrender.com` |

## Step 5: Update CORS Configuration

Go back to **studyai-backend** → **Environment** and add:

| Key | Value |
|-----|-------|
| `CORS_ORIGINS` | `https://studyai-frontend.onrender.com` |

(Replace with your actual frontend URL)

## Step 6: Initialize Database

After the backend successfully deploys, you need to initialize the database schema and create users.

### Option A: Using Render Shell (Recommended)

1. Go to **studyai-backend** → **Shell**
2. Run:
   ```bash
   python init_db.py
   ```
3. Press Enter when prompted to confirm

### Option B: Manual SQL (If shell doesn't work)

The database will auto-create tables on first API call due to SQLAlchemy, but users won't exist. You'll need to:
1. Connect to PostgreSQL database
2. Insert users manually or wait for first API call to auto-create tables
3. Then run a migration script

## Step 7: Trigger Redeployment

After setting all environment variables:
1. Go to **studyai-backend** → **Manual Deploy** → **Deploy latest commit**
2. Go to **studyai-frontend** → **Manual Deploy** → **Deploy latest commit**

This ensures all environment variables are loaded.

## Step 8: Verification

1. **Access Frontend URL:** `https://studyai-frontend.onrender.com`
2. **Test Login:**
   - Username: `demo`
   - Password: `demo8740!`
3. **Test Features:**
   - Upload a document
   - Generate flashcards
   - Create a quiz
   - Chat with document
   - Check analytics dashboard
4. **Test Data Isolation:**
   - Logout
   - Login as `student` / `student8740!`
   - Verify you don't see demo user's documents

## Troubleshooting

### Backend Won't Start
- Check **Logs** in Render dashboard
- Verify all environment variables are set
- Ensure database is running and `DATABASE_URL` is populated

### Frontend Shows Connection Error
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend URL doesn't have trailing slash

### Login Doesn't Work
- Confirm database was initialized with `init_db.py`
- Check backend logs for authentication errors
- Verify user credentials match environment variables

### Database Schema Errors
- Run `init_db.py` again from backend shell
- Check if PostgreSQL connection is working
- Review database logs

## Production Checklist

- [ ] All environment variables configured
- [ ] Database initialized and users created
- [ ] CORS properly configured
- [ ] Frontend can connect to backend
- [ ] Login functionality tested
- [ ] Data isolation verified between users
- [ ] All features working (upload, flashcards, quiz, chat, analytics)
- [ ] API keys are kept secret (not in git)

## Useful Commands

**View Backend Logs:**
```bash
# In Render dashboard: studyai-backend → Logs
```

**Restart Service:**
```bash
# In Render dashboard: Service → Manual Deploy → Deploy latest commit
```

**Database Connection:**
```bash
# Get from: studyai-db → Connection → External Connection String
```
