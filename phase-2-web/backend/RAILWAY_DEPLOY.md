# 🚀 Railway Deployment Fix

## ✅ Files Added/Updated:

1. ✅ `runtime.txt` - Python version specified
2. ✅ `nixpacks.toml` - Railway build configuration
3. ✅ `railway.json` - Updated deployment settings
4. ✅ `Procfile` - Start command
5. ✅ `requirements.txt` - Dependencies

---

## 📋 Deployment Steps:

### Step 1: Commit & Push Changes

```bash
git add phase-2-web/backend/runtime.txt
git add phase-2-web/backend/nixpacks.toml
git add phase-2-web/backend/railway.json
git commit -m "Fix Railway deployment configuration"
git push origin main
```

### Step 2: Railway Dashboard Settings

1. Go to: https://railway.app
2. Select project: **hackathon-todo**
3. Click **Settings**
4. Check these settings:

**Root Directory:**
```
phase-2-web/backend
```

**Build Command:** (Leave empty - nixpacks will handle it)
```
(empty)
```

**Start Command:** (Leave empty - Procfile will handle it)
```
(empty)
```

**Python Version:**
- Detected from `runtime.txt` automatically

### Step 3: Environment Variables

Click **Variables** tab and add:

```env
# Database (if using Railway PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT Configuration
SECRET_KEY=generate-new-secret-key-use-command-below
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS (update after getting Vercel URL)
CORS_ORIGINS=["https://your-app.vercel.app"]

# App Settings
APP_NAME=Todo API
DEBUG=False
PORT=8000
```

**Generate SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 4: Add PostgreSQL Database

1. In Railway project, click **New** → **Database** → **PostgreSQL**
2. Railway will auto-add `DATABASE_URL` to environment variables
3. No manual configuration needed!

### Step 5: Trigger Deployment

**Option A: Automatic (Recommended)**
- Railway auto-deploys when you push to GitHub
- Wait 2-3 minutes

**Option B: Manual**
1. Click **Deployments** tab
2. Click **Deploy** button
3. Select branch: **main**
4. Click **Deploy**

### Step 6: Monitor Build

Watch the build logs in real-time:

1. Click **Deployments** tab
2. Click the latest deployment
3. Click **View Logs**

**What to expect:**
```
✅ Cloning repository...
✅ Detecting Python 3.11...
✅ Installing dependencies from requirements.txt...
✅ Building with Nixpacks...
✅ Starting application...
✅ Health check passed (/health)
✅ Deployment successful!
```

### Step 7: Test Backend

Once deployed, test these URLs:

**Health Check:**
```
https://your-backend.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "phase": "Phase 2 - Web Application",
  "version": "2.0.0"
}
```

**API Docs:**
```
https://your-backend.railway.app/docs
```

Should show Swagger UI

---

## 🔧 Troubleshooting

### Error: "No Python version specified"

**Fix:** Make sure `runtime.txt` exists with:
```
python-3.11.0
```

### Error: "Module not found"

**Fix:** Check `requirements.txt` has all dependencies:
```bash
cd phase-2-web/backend
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update dependencies"
git push
```

### Error: "Build failed"

**Fix:**
1. Check Railway logs for specific error
2. Make sure Root Directory is: `phase-2-web/backend`
3. Clear build cache: Settings → Clear Cache → Redeploy

### Error: "Port already in use"

**Fix:** Railway automatically sets `$PORT` variable. Make sure:
- Procfile uses: `--port $PORT`
- Don't hardcode port 8000

### Error: "Database connection failed"

**Fix:**
1. Make sure PostgreSQL plugin is added
2. Check `DATABASE_URL` in Variables
3. Format should be: `postgresql://...` (not `postgresql+asyncpg://...`)
4. Update in code if needed

---

## ✅ Success Checklist

```
□ runtime.txt exists
□ nixpacks.toml exists
□ railway.json updated
□ Procfile exists
□ requirements.txt complete
□ Root directory set to phase-2-web/backend
□ Environment variables added
□ PostgreSQL database added
□ Build logs show success
□ Health check returns 200
□ /docs page loads
```

---

## 📊 Expected Build Time

- First build: 3-5 minutes
- Subsequent builds: 1-2 minutes
- If > 10 minutes: Check logs for errors

---

## 🎯 After Successful Deployment

1. **Copy Backend URL:**
   - Settings → Copy domain
   - Example: `https://hackathon-todo-production.up.railway.app`

2. **Update Frontend .env.production:**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```

3. **Update CORS in Railway:**
   ```env
   CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
   ```

4. **Deploy Frontend to Vercel!**

---

## 💡 Pro Tips

1. **Enable Auto-Deploy:**
   - Settings → Connect GitHub repo
   - Auto-deploys on push to main

2. **View Logs:**
   - Deployments → Latest → View Logs
   - Real-time log streaming

3. **Database Backups:**
   - Railway auto-backs up PostgreSQL
   - Can restore from Backups tab

4. **Custom Domain:**
   - Settings → Domains → Add Custom Domain
   - Free HTTPS included!

---

## 🆘 Still Not Working?

**Check these common issues:**

1. **Wrong Root Directory:**
   - Should be: `phase-2-web/backend`
   - NOT: `/` or `phase-2-web`

2. **Missing Files:**
   ```bash
   ls phase-2-web/backend/
   # Should show:
   # - main.py
   # - requirements.txt
   # - Procfile
   # - railway.json
   # - nixpacks.toml
   # - runtime.txt
   ```

3. **Python Version Mismatch:**
   - Check runtime.txt: `python-3.11.0`
   - Or use: `python-3.10.0` if needed

4. **Dependencies Missing:**
   ```bash
   pip freeze > requirements.txt
   ```

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check logs for detailed errors
