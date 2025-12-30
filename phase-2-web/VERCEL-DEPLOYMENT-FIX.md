# Vercel Deployment - Configuration Guide

## Issue
When deploying from a monorepo (repository with multiple projects), Vercel needs to know which subdirectory contains the frontend code.

## Solution: Configure Root Directory in Vercel Dashboard

### Step-by-Step Instructions

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Your Repository**
   - Click "Import" next to your GitHub repository
   - Authorize Vercel to access your repo if needed

3. **Configure Build Settings** ⭐ IMPORTANT
   ```
   Framework Preset: Next.js
   Root Directory: phase-2-web/frontend     👈 SET THIS!
   Build Command: npm run build (auto-detected)
   Output Directory: .next (auto-detected)
   Install Command: npm install (auto-detected)
   ```

4. **Add Environment Variables**
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://your-backend-url.up.railway.app
   ```
   (You'll get this URL after deploying the backend to Railway)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! 🎉

## Why This Works

Setting **Root Directory** to `phase-2-web/frontend` tells Vercel:
- Install dependencies from `phase-2-web/frontend/package.json`
- Run build from `phase-2-web/frontend` directory
- Resolve path aliases (`@/lib/*`) correctly from frontend root

## Common Errors & Fixes

### Error: "Module not found: Can't resolve '@/lib/auth'"

**Cause**: Root Directory not set correctly

**Fix**:
1. Go to Project Settings → General
2. Set Root Directory: `phase-2-web/frontend`
3. Redeploy

### Error: "No package.json found"

**Cause**: Root Directory pointing to wrong location

**Fix**:
- Ensure Root Directory is exactly: `phase-2-web/frontend` (no trailing slash)

### Error: "Build failed with exit code 1"

**Cause**: Environment variables missing

**Fix**:
1. Go to Project Settings → Environment Variables
2. Add: `NEXT_PUBLIC_API_URL` = your Railway backend URL
3. Redeploy

## Alternative: Deploy via Vercel CLI

If you prefer command line:

```bash
# Navigate to frontend directory
cd phase-2-web/frontend

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Follow prompts and enter environment variables when asked
```

## Verification

After successful deployment:

1. ✅ Build completes without errors
2. ✅ All pages load correctly
3. ✅ API calls work (check browser console)
4. ✅ No 404 errors for static assets

## Next Steps

Once frontend is deployed:
1. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Update Railway backend CORS_ORIGINS to include this URL
3. Test the complete application

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Check build logs in Vercel dashboard for detailed errors
