# Phase 2 - Production Deployment Guide

Complete step-by-step guide to deploy the Todo App to production.

---

## 🎯 Deployment Overview

| Component | Service | URL Pattern |
|-----------|---------|-------------|
| Frontend | Vercel | `https://your-app.vercel.app` |
| Backend | Railway | `https://your-app.up.railway.app` |
| Database | Neon | PostgreSQL connection string |

---

## 📋 Prerequisites

Before starting, create accounts on:
- ✅ [Vercel](https://vercel.com) - Frontend hosting
- ✅ [Railway](https://railway.app) - Backend hosting
- ✅ [Neon](https://neon.tech) - PostgreSQL database
- ✅ [GitHub](https://github.com) - Code repository (optional but recommended)

---

## Step 1: Set Up Neon PostgreSQL Database

### 1.1 Create Neon Project
1. Go to [Neon Console](https://console.neon.tech)
2. Click **"Create Project"**
3. Configure:
   - **Name**: `todo-app-db`
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 16 (latest)
4. Click **"Create Project"**

### 1.2 Get Connection String
1. In Neon Dashboard, go to **"Connection Details"**
2. Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. **Save this** - you'll need it for backend deployment

### 1.3 Create Database Tables
The backend will auto-create tables on first run, but you can verify:
```sql
-- Tables will be auto-created:
-- - users
-- - tasks
-- - tags
-- - task_tags
```

✅ **Checkpoint**: You have a Neon connection string

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Project
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Choose **"Deploy from GitHub repo"** OR **"Empty Project"**

### 2.2 Option A: Deploy from GitHub (Recommended)
1. Connect your GitHub repository
2. Select the repository
3. Railway will auto-detect Python
4. Set **Root Directory**: `phase-2-web/backend`

### 2.3 Option B: Deploy via Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to backend
cd phase-2-web/backend

# Initialize
railway init

# Deploy
railway up
```

### 2.4 Configure Environment Variables
In Railway Dashboard → **Variables** tab, add:

```env
# Database
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# JWT Secret (generate a random string)
SECRET_KEY=your-super-secret-key-here-change-this

# CORS Origins (add your Vercel URL later)
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000

# App Settings
DEBUG=False
ENVIRONMENT=production
```

### 2.5 Generate SECRET_KEY
```bash
# Option 1: Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Option 2: OpenSSL
openssl rand -base64 32
```

### 2.6 Deploy
1. Railway will auto-deploy on push
2. Wait for deployment to complete
3. Click **"Generate Domain"** to get your backend URL
4. **Save the URL**: `https://your-app.up.railway.app`

### 2.7 Verify Backend
```bash
# Test health endpoint
curl https://your-app.up.railway.app/health

# Should return:
# {"status": "healthy", "database": "connected"}
```

✅ **Checkpoint**: Backend is live and healthy

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend
1. Update environment variables:
```bash
cd phase-2-web/frontend
```

2. Create `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
```

### 3.2 Option A: Deploy via Vercel Dashboard (Easiest)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `phase-2-web/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-app.up.railway.app` (your Railway URL)

6. Click **"Deploy"**

### 3.3 Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd phase-2-web/frontend

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? todo-app-frontend
# - Directory? ./
# - Override settings? No
```

### 3.4 Add Environment Variable (if using CLI)
```bash
# Add production environment variable
vercel env add NEXT_PUBLIC_API_URL production

# Enter your Railway URL when prompted:
# https://your-app.up.railway.app
```

### 3.5 Get Frontend URL
After deployment completes, Vercel will provide:
- **Production URL**: `https://your-app.vercel.app`
- **Preview URLs**: For each branch/commit

✅ **Checkpoint**: Frontend is live on Vercel

---

## Step 4: Update CORS Origins in Backend

### 4.1 Update Railway Environment Variables
1. Go to Railway Dashboard → Your Project → **Variables**
2. Update `CORS_ORIGINS` to include your Vercel URL:
```env
CORS_ORIGINS=https://your-app.vercel.app,https://your-app-*.vercel.app,http://localhost:3000
```

3. Save and redeploy (Railway will auto-redeploy)

### 4.2 Verify CORS
```bash
# Test from browser console or terminal
curl -X OPTIONS https://your-app.up.railway.app/api/tasks \
  -H "Origin: https://your-app.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

✅ **Checkpoint**: CORS is configured correctly

---

## Step 5: Test Complete Application

### 5.1 Test Backend Endpoints
```bash
# Health check
curl https://your-app.up.railway.app/health

# Create task
curl -X POST https://your-app.up.railway.app/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Deployment",
    "description": "Testing production deployment",
    "priority": "high"
  }'

# List tasks
curl https://your-app.up.railway.app/api/tasks
```

### 5.2 Test Frontend
1. Open your Vercel URL: `https://your-app.vercel.app`
2. Test features:
   - ✅ Add a task
   - ✅ View tasks list
   - ✅ Mark task as complete
   - ✅ Edit task
   - ✅ Delete task
   - ✅ Filter by priority
   - ✅ Search tasks

### 5.3 Test Frontend-Backend Integration
1. Open browser DevTools → Network tab
2. Add a task in the UI
3. Verify:
   - Request goes to Railway backend
   - Response is successful (200/201)
   - Task appears in the UI
   - No CORS errors

✅ **Checkpoint**: Complete application is working

---

## Step 6: Monitor and Maintain

### 6.1 Monitor Backend (Railway)
- **Logs**: Railway Dashboard → Deployments → View Logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: Auto-deploy on git push

### 6.2 Monitor Frontend (Vercel)
- **Analytics**: Vercel Dashboard → Analytics
- **Logs**: Runtime logs and build logs
- **Deployments**: Auto-deploy on git push

### 6.3 Database Monitoring (Neon)
- **Connections**: Monitor active connections
- **Storage**: Check database size
- **Queries**: View slow queries
- **Backups**: Automatic daily backups

---

## 🎉 Deployment Complete!

Your application is now live:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | `https://your-app.vercel.app` | User interface |
| **Backend** | `https://your-app.up.railway.app` | REST API |
| **API Docs** | `https://your-app.up.railway.app/docs` | Swagger UI |
| **Database** | Neon Console | PostgreSQL |

---

## 🔧 Troubleshooting

### Issue: Frontend can't connect to backend

**Symptoms**: Network errors, CORS errors

**Solutions**:
1. Verify `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Check CORS_ORIGINS in Railway includes your Vercel URL
3. Verify backend is healthy: `curl https://your-app.up.railway.app/health`
4. Check Railway logs for errors

### Issue: Database connection failed

**Symptoms**: Backend health check fails, 500 errors

**Solutions**:
1. Verify DATABASE_URL in Railway is correct
2. Check Neon database is active (not suspended)
3. Ensure connection string includes `?sslmode=require`
4. Check Railway logs: `railway logs`

### Issue: Build failed on Vercel

**Symptoms**: Deployment fails during build

**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify all dependencies in package.json
3. Test build locally: `npm run build`
4. Check for TypeScript errors: `npm run type-check`

### Issue: 404 errors on API endpoints

**Symptoms**: Backend returns 404 for /api/tasks

**Solutions**:
1. Verify Railway root directory is set to `phase-2-web/backend`
2. Check Procfile or railway.json is correct
3. Verify routes in main.py are properly defined
4. Test locally first: `uvicorn main:app --reload`

---

## 📊 Performance Optimization

### Frontend (Vercel)
- ✅ Automatic CDN distribution
- ✅ Image optimization
- ✅ Static page generation
- 🔧 Enable Edge Functions (optional)
- 🔧 Add caching headers

### Backend (Railway)
- ✅ Auto-scaling based on traffic
- 🔧 Add Redis for caching (optional)
- 🔧 Enable connection pooling
- 🔧 Optimize database queries

### Database (Neon)
- ✅ Automatic scaling
- ✅ Connection pooling built-in
- 🔧 Add indexes for frequent queries
- 🔧 Monitor query performance

---

## 🔐 Security Checklist

- ✅ HTTPS enabled (automatic on Vercel/Railway)
- ✅ CORS properly configured
- ✅ Environment variables secured
- ✅ Database password strength
- ✅ JWT secret is random and secure
- 🔧 Enable rate limiting (optional)
- 🔧 Add request validation
- 🔧 Implement authentication (Phase 2.5)

---

## 🚀 Next Steps

### Phase 2.5 (Optional Improvements)
- [ ] Implement Better Auth for user authentication
- [ ] Add automated tests
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring and alerting
- [ ] Implement caching strategy
- [ ] Add rate limiting

### Phase 3 (Chatbot)
- [ ] Deploy MCP chatbot server
- [ ] Integrate Claude API
- [ ] Add WebSocket support
- [ ] Deploy chatbot UI

---

## 📚 Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Neon Docs**: https://neon.tech/docs
- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com

---

## 🆘 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review service status pages:
   - Vercel Status: https://www.vercel-status.com
   - Railway Status: https://status.railway.app
   - Neon Status: https://neon.tech/status
3. Check logs in respective dashboards
4. Review specs in `@specs/` directory

---

**Deployment Date**: 2025-12-30
**Version**: Phase 2 - Production Ready
**Status**: ✅ Deployed and Tested
