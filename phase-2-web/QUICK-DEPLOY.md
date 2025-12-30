# 🚀 Quick Deploy Guide - Phase 2 Todo App

**Time Required**: ~15 minutes
**Difficulty**: Beginner-friendly

---

## ⚡ Super Quick Deploy (3 Steps)

### Step 1: Database (Neon) - 3 minutes
1. Go to https://console.neon.tech
2. Click "Create Project" → Name it `todo-app-db`
3. Copy the connection string (starts with `postgresql://...`)
4. **Save it** - you'll paste it in Step 2

### Step 2: Backend (Railway) - 5 minutes
1. Go to https://railway.app/dashboard
2. Click "New Project" → "Empty Project"
3. Click "GitHub Repo" → Select your repo → Set root: `phase-2-web/backend`
4. Go to **Variables** tab and add:
   ```
   DATABASE_URL = [paste your Neon connection string]
   SECRET_KEY = [generate random: python -c "import secrets; print(secrets.token_urlsafe(32))"]
   CORS_ORIGINS = http://localhost:3000
   ```
5. Click "Generate Domain" → **Copy the URL** (e.g., `https://xxx.up.railway.app`)
6. Verify: Open `https://xxx.up.railway.app/docs` in browser

### Step 3: Frontend (Vercel) - 7 minutes
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your Git repo
4. Configure:
   - Framework: **Next.js**
   - Root Directory: `phase-2-web/frontend`
   - Build Command: `npm run build`
5. Add Environment Variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: [paste your Railway URL from Step 2]
6. Click "Deploy"
7. Wait 2-3 minutes
8. **Your app is live!** 🎉

### Step 4: Final Configuration - 2 minutes
1. Go back to Railway (Step 2)
2. Update `CORS_ORIGINS` variable:
   ```
   CORS_ORIGINS = https://your-app.vercel.app
   ```
   (Replace with your actual Vercel URL)
3. Railway auto-redeploys
4. **Done!** Test your live app

---

## 🎯 What You'll Get

| Component | URL | Use For |
|-----------|-----|---------|
| **App** | `https://your-app.vercel.app` | Todo application |
| **API** | `https://xxx.up.railway.app/docs` | API documentation |
| **Database** | Neon Console | Data management |

---

## ✅ Verification Checklist

After deployment, test these:

- [ ] Open your Vercel URL
- [ ] Add a task
- [ ] Mark it complete
- [ ] Delete it
- [ ] No errors in browser console
- [ ] Check Railway logs (no errors)

---

## 🆘 Quick Troubleshooting

### Can't connect to backend?
- Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Verify Railway app is running: `https://your-railway-url/health`
- Update CORS_ORIGINS in Railway to include your Vercel URL

### Database errors?
- Verify DATABASE_URL in Railway is correct
- Check Neon database status (should be "Active")
- Ensure connection string ends with `?sslmode=require`

### Build failed?
- Check build logs in Vercel/Railway dashboard
- Test locally: `npm run build` (frontend) or `pip install -r requirements.txt` (backend)

---

## 📖 Detailed Guide

For detailed step-by-step instructions, see: **DEPLOYMENT.md**

---

## 🎉 You're Done!

Your Phase 2 Todo App is now live in production with:
- ✅ Next.js frontend on Vercel
- ✅ FastAPI backend on Railway
- ✅ PostgreSQL database on Neon
- ✅ HTTPS enabled automatically
- ✅ Auto-scaling enabled
- ✅ Ready for Phase 3 (Chatbot)

**Share your live URL**: `https://your-app.vercel.app`
