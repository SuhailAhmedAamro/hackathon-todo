# Deployment Guide: Railway + Vercel

## 🚂 PART 1: Deploy Backend to Railway

### Method 1: Web Interface (Easiest - Recommended)

1. **Go to Railway**
   - Visit: https://railway.app/
   - Click "Login" (use GitHub account)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `SuhailAhmedAamro/hackathon-todo`
   - Railway will detect the repository

3. **Configure Service**
   - Click "Add Service"
   - Select "Backend" folder path: `phase-2-web/backend`
   - Railway will auto-detect Python/FastAPI

4. **Set Environment Variables**
   Click "Variables" tab and add:
   ```
   SECRET_KEY=your-super-secret-key-min-32-chars-change-this
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   CORS_ORIGINS=["https://your-app.vercel.app","http://localhost:3000"]
   DEBUG=false
   ENVIRONMENT=production
   ```

5. **Add PostgreSQL Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically set DATABASE_URL

6. **Deploy**
   - Railway will auto-deploy
   - Get your URL: `https://your-app.up.railway.app`
   - Copy this URL for Vercel deployment!

7. **Verify Deployment**
   - Visit: `https://your-app.up.railway.app/health`
   - Should see: `{"status":"healthy",...}`

---

### Method 2: Railway CLI (Alternative)

```bash
# Login to Railway
railway login

# Link to project (in backend directory)
cd phase-2-web/backend
railway link

# Add PostgreSQL
railway add

# Set environment variables
railway variables set SECRET_KEY="your-secret-key-here"
railway variables set CORS_ORIGINS='["https://your-app.vercel.app"]'
railway variables set DEBUG=false
railway variables set ENVIRONMENT=production

# Deploy
railway up

# Get deployment URL
railway status
```

---

## ▲ PART 2: Deploy Frontend to Vercel

### Method 1: Web Interface (Easiest - Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com/
   - Click "Login" (use GitHub account)

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select: `SuhailAhmedAamro/hackathon-todo`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `phase-2-web/frontend`
   - Click "Edit" next to Root Directory
   - Set to: `phase-2-web/frontend`

4. **Set Environment Variables**
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_API_URL=https://your-app.up.railway.app
   NEXT_PUBLIC_APP_NAME=Todo App
   NEXT_PUBLIC_APP_VERSION=2.0.0
   ```
   **IMPORTANT:** Replace `your-app.up.railway.app` with your actual Railway URL!

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your URL: `https://your-app.vercel.app`

6. **Update Railway CORS**
   - Go back to Railway
   - Update CORS_ORIGINS with your Vercel URL:
   ```
   CORS_ORIGINS=["https://your-app.vercel.app"]
   ```

7. **Verify Deployment**
   - Visit: `https://your-app.vercel.app`
   - Should see your Todo App!
   - Try creating an account and logging in

---

### Method 2: Vercel CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Deploy frontend (from frontend directory)
cd phase-2-web/frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Link to existing project? No
# - Project name: hackathon-todo-frontend
# - Directory: ./
# - Override settings? No

# Add environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-app.up.railway.app

vercel env add NEXT_PUBLIC_APP_NAME production
# Enter: Todo App

# Deploy to production
vercel --prod
```

---

## 🔧 Post-Deployment Configuration

### Update Backend CORS (Railway)

After deploying frontend to Vercel, update Railway CORS:

1. Go to Railway project
2. Click "Variables"
3. Update `CORS_ORIGINS`:
   ```
   ["https://your-actual-vercel-url.vercel.app","http://localhost:3000"]
   ```
4. Redeploy (automatic)

### Test Full Integration

1. **Backend Health Check**
   ```
   https://your-app.up.railway.app/health
   ```

2. **Backend API Docs**
   ```
   https://your-app.up.railway.app/docs
   ```

3. **Frontend App**
   ```
   https://your-app.vercel.app
   ```

4. **Register & Login**
   - Create account
   - Login
   - Create tasks
   - Test chatbot!

---

## 📝 Environment Variables Checklist

### Railway (Backend)
- [x] SECRET_KEY
- [x] DATABASE_URL (auto-set by Railway)
- [x] CORS_ORIGINS
- [x] DEBUG=false
- [x] ENVIRONMENT=production
- [ ] REDIS_URL (optional)

### Vercel (Frontend)
- [x] NEXT_PUBLIC_API_URL (Railway URL)
- [x] NEXT_PUBLIC_APP_NAME
- [x] NEXT_PUBLIC_APP_VERSION

---

## 🐛 Troubleshooting

### Frontend can't connect to Backend
- Check NEXT_PUBLIC_API_URL is correct
- Check Railway CORS includes Vercel URL
- Check Railway app is running (not sleeping)

### 401 Unauthorized errors
- Check SECRET_KEY is set on Railway
- Check DATABASE_URL is connected

### Database connection errors
- Make sure PostgreSQL is added in Railway
- Check DATABASE_URL variable exists

### CORS errors
- Update CORS_ORIGINS in Railway
- Must include your Vercel URL
- Format: `["https://your-app.vercel.app"]`

---

## ✅ Success Indicators

### Backend (Railway)
- ✅ Health endpoint returns `{"status":"healthy"}`
- ✅ API docs accessible at `/docs`
- ✅ No errors in Railway logs
- ✅ Database connected

### Frontend (Vercel)
- ✅ App loads without errors
- ✅ Can register new user
- ✅ Can login
- ✅ Can create tasks
- ✅ Chatbot connects

---

## 🎉 You're Done!

Your Todo App is now live:
- 🚂 Backend: `https://your-app.up.railway.app`
- ▲ Frontend: `https://your-app.vercel.app`

Share the frontend URL with anyone to try your app!

---

## 📌 Quick Commands Reference

### Railway
```bash
railway login              # Login
railway link              # Link project
railway logs              # View logs
railway status            # Check status
railway open              # Open in browser
```

### Vercel
```bash
vercel login              # Login
vercel                    # Deploy
vercel --prod             # Deploy to production
vercel logs               # View logs
vercel ls                 # List deployments
vercel open               # Open in browser
```
