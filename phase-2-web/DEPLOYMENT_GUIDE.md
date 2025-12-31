# 🚀 Deployment Guide - Vercel + Railway

## 📋 Deployment Order (CRITICAL!)

```
Step 1: Deploy Backend FIRST (Railway/Render)
  ↓
Step 2: Get Backend URL
  ↓
Step 3: Deploy Frontend (Vercel)
  ↓
Step 4: Update CORS in Backend
  ↓
Step 5: Test Everything!
```

---

## 🔧 PART 1: Backend Deployment (Railway - Recommended)

### Why Railway?
- ✅ Free tier available
- ✅ Easy Python deployment
- ✅ Free PostgreSQL database
- ✅ Automatic HTTPS
- ✅ Easy environment variables

### Step 1.1: Sign Up & Create Project

1. **Go to:** https://railway.app
2. **Sign in** with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. **Authorize Railway** to access your GitHub
6. **Select your repository**

### Step 1.2: Configure Backend

1. **Select Service:**
   - Root Directory: `phase-2-web/backend`
   - Railway will auto-detect Python!

2. **Add PostgreSQL Database:**
   - Click **"New"** → **"Database"** → **"PostgreSQL"**
   - Railway will create free PostgreSQL database
   - Database URL will be auto-added to environment variables

### Step 1.3: Environment Variables

Click **"Variables"** tab and add:

```env
# Database (Auto-added by Railway PostgreSQL plugin)
DATABASE_URL=postgresql://...  (Auto-filled)

# JWT Secret (GENERATE NEW ONE!)
SECRET_KEY=generate-strong-random-key-min-32-characters-use-below-command
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS (Add your Vercel URL after frontend deployment)
CORS_ORIGINS=["https://your-app.vercel.app","https://your-app-git-main.vercel.app"]

# App Settings
APP_NAME=Todo API
DEBUG=False
```

**Generate SECRET_KEY:**
```bash
# Run this in terminal to generate secure key:
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 1.4: Deploy Backend

1. Railway will **auto-deploy** when you push to GitHub!
2. Wait for deployment (2-3 minutes)
3. **Copy Backend URL:**
   - Click "Settings" → Copy domain
   - Example: `https://your-backend.railway.app`
4. **Save this URL!** You'll need it for frontend.

### Step 1.5: Test Backend

Visit: `https://your-backend.railway.app/health`

Should see:
```json
{
  "status": "healthy",
  "phase": "Phase 2 - Web Application",
  "version": "2.0.0"
}
```

✅ **Backend Deployed!**

---

## 🌐 PART 2: Frontend Deployment (Vercel)

### Step 2.1: Prepare Frontend

1. **Create `.env.production` file** (already created!)
2. **Update with your backend URL:**

```env
# phase-2-web/frontend/.env.production
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

Replace `your-backend.railway.app` with your actual Railway URL!

### Step 2.2: Deploy to Vercel

**Option A: Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Go to frontend directory
cd phase-2-web/frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Option B: Vercel Dashboard**

1. **Go to:** https://vercel.com
2. **Sign in** with GitHub
3. Click **"Add New Project"**
4. **Import** your GitHub repository
5. **Configure:**
   - Framework Preset: **Next.js**
   - Root Directory: **phase-2-web/frontend**
   - Build Command: **npm run build** (auto-detected)
   - Output Directory: **.next** (auto-detected)

### Step 2.3: Environment Variables on Vercel

In Vercel project settings:

**Go to:** Settings → Environment Variables

**Add:**
```
Name: NEXT_PUBLIC_API_URL
Value: https://your-backend.railway.app
Environment: Production, Preview, Development
```

⚠️ **IMPORTANT:** Replace with your actual Railway backend URL!

### Step 2.4: Deploy Frontend

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. **Copy Frontend URL:**
   - Example: `https://your-app.vercel.app`

✅ **Frontend Deployed!**

---

## 🔄 PART 3: Connect Frontend & Backend

### Step 3.1: Update Backend CORS

Go back to **Railway** → Your backend → **Variables**

Update `CORS_ORIGINS`:
```env
CORS_ORIGINS=["https://your-app.vercel.app","https://your-app-git-main.vercel.app","https://*.vercel.app"]
```

⚠️ Replace `your-app` with your actual Vercel app name!

### Step 3.2: Redeploy Backend

Railway will auto-deploy when you save variables!

---

## ✅ PART 4: Final Testing

### Test Checklist:

1. **Backend Health:**
   ```
   Visit: https://your-backend.railway.app/health
   Should show: {"status": "healthy"}
   ```

2. **Frontend Loading:**
   ```
   Visit: https://your-app.vercel.app
   Should load homepage
   ```

3. **API Connection:**
   ```
   Try registration:
   https://your-app.vercel.app/auth/register

   Create account → Should work!
   ```

4. **Login:**
   ```
   Login with created account → Should work!
   Dashboard should load → Should work!
   ```

5. **Create Task:**
   ```
   Dashboard → Create new task → Should work!
   ```

---

## 📊 Environment Variables Summary

### Backend (Railway):
```env
DATABASE_URL=postgresql://... (auto-added)
SECRET_KEY=your-generated-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=["https://your-app.vercel.app"]
APP_NAME=Todo API
DEBUG=False
```

### Frontend (Vercel):
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## 🔧 Troubleshooting

### Issue: CORS Error
**Error:** "Access to fetch blocked by CORS policy"

**Fix:**
1. Go to Railway → Backend → Variables
2. Check `CORS_ORIGINS` includes your Vercel URL
3. Format: `["https://your-app.vercel.app"]`
4. Wait for auto-redeploy

### Issue: API Not Found
**Error:** "Failed to fetch" or 404

**Fix:**
1. Check `.env.production` in frontend
2. Verify `NEXT_PUBLIC_API_URL` is correct
3. Redeploy frontend on Vercel

### Issue: Database Connection Failed
**Error:** "Could not connect to database"

**Fix:**
1. Railway → Add PostgreSQL plugin
2. Check `DATABASE_URL` is set
3. Redeploy backend

### Issue: Environment Variables Not Working
**Fix:**
1. Vercel → Settings → Environment Variables
2. Make sure variables are set for "Production"
3. Redeploy

---

## 🎯 Alternative Backend Deployment Options

### Option 2: Render

1. **Go to:** https://render.com
2. **New Web Service**
3. **Connect GitHub repo**
4. **Settings:**
   - Root Directory: `phase-2-web/backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables:** Same as Railway
6. **Free PostgreSQL:** Add from Render dashboard

### Option 3: Vercel Serverless (Advanced)

Vercel can host FastAPI as serverless functions, but it's complex.
**Recommended:** Use Railway/Render for backend.

---

## 📝 Post-Deployment Checklist

```
□ Backend deployed to Railway/Render
□ PostgreSQL database created
□ Backend environment variables set
□ Backend health check working
□ Frontend deployed to Vercel
□ Frontend environment variables set
□ CORS configured correctly
□ Can register new user
□ Can login
□ Can create tasks
□ Dashboard loading
□ All features working
```

---

## 🚀 Continuous Deployment

**Auto-Deploy Setup:**

1. **Railway:** Auto-deploys on `git push` to main branch
2. **Vercel:** Auto-deploys on `git push` to main branch

**Workflow:**
```
1. Make changes locally
2. Test locally
3. git add .
4. git commit -m "Your message"
5. git push
6. ✅ Auto-deploy to production!
```

---

## 💡 Production Tips

1. **Generate Strong SECRET_KEY:**
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

2. **Use PostgreSQL in Production:**
   - Don't use SQLite
   - Railway provides free PostgreSQL

3. **Set DEBUG=False:**
   - Never use DEBUG=True in production
   - Exposes sensitive information

4. **Monitor Logs:**
   - Railway: View → Logs
   - Vercel: Deployments → Logs

5. **Custom Domain (Optional):**
   - Vercel: Settings → Domains
   - Railway: Settings → Domains

---

## 🎊 You're Done!

Your app is now live:
- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.railway.app
- **Database:** PostgreSQL on Railway

**Share your app with the world! 🚀**

---

## 📚 Useful Links

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- FastAPI Deployment: https://fastapi.tiangolo.com/deployment/

---

**Need help?** Check logs:
- Railway: Dashboard → Logs
- Vercel: Deployments → Functions → Logs
