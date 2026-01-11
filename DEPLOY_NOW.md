# 🚀 One-Click Deployment

Your repository is ready for deployment!

## 🚂 Deploy Backend to Railway

Click this button to deploy:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/SuhailAhmedAamro/hackathon-todo)

Or visit directly:
```
https://railway.app/new?template=https://github.com/SuhailAhmedAamro/hackathon-todo
```

**After clicking:**
1. Select "Deploy from GitHub repo"
2. Choose: SuhailAhmedAamro/hackathon-todo
3. Add PostgreSQL database
4. Set environment variables:
   - SECRET_KEY=your-secret-key-min-32-chars
   - CORS_ORIGINS=["http://localhost:3000"]
   - DEBUG=false
5. Click "Deploy"
6. Copy your Railway URL

---

## ▲ Deploy Frontend to Vercel

Click this button to deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/SuhailAhmedAamro/hackathon-todo&root-directory=phase-2-web/frontend)

Or visit directly:
```
https://vercel.com/new/clone?repository-url=https://github.com/SuhailAhmedAamro/hackathon-todo&root-directory=phase-2-web/frontend
```

**After clicking:**
1. Click "Import"
2. Root Directory: `phase-2-web/frontend` (auto-set)
3. Add environment variable:
   - NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app
4. Click "Deploy"
5. Copy your Vercel URL

---

## 📋 Deployment Order

1. **Deploy Railway First** → Get backend URL
2. **Then Deploy Vercel** → Use Railway URL
3. **Update Railway CORS** → Add Vercel URL

---

## ✅ After Deployment

Update Railway CORS_ORIGINS:
```json
["https://your-vercel-url.vercel.app"]
```

Then test:
- Railway: https://your-app.up.railway.app/health
- Vercel: https://your-app.vercel.app
