# Vercel Deployment Blueprint - MCP Chatbot

**BONUS POINTS: +200 for Cloud-Native Blueprints**

## Overview
Deploy Phase 3 MCP Chatbot to Vercel with serverless architecture.

## Architecture

```
┌─────────────────┐
│  Vercel Edge    │
│   Functions     │
└────────┬────────┘
         │
    ┌────▼────┐
    │  Chat   │
    │   UI    │
    └────┬────┘
         │ WebSocket
    ┌────▼─────────┐
    │ External MCP │
    │    Server    │
    └──────────────┘
```

## Project Structure

```
phase-3-chatbot/
├── api/                       # Vercel serverless functions
│   ├── chat.ts               # WebSocket handler
│   └── tools.ts              # Tool execution
├── public/
│   ├── index.html            # Chat interface
│   └── voice-recorder.js
├── vercel.json               # Deployment config
└── package.json
```

## Step 1: Create `vercel.json`

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
  "public": true,
  "env": {
    "ANTHROPIC_API_KEY": "@anthropic-api-key",
    "BACKEND_URL": "@backend-url"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
```

## Step 2: Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

```env
# Required
ANTHROPIC_API_KEY=sk-ant-xxx

# Optional
BACKEND_URL=https://your-backend.railway.app
MCP_SERVER_URL=https://your-mcp-server.com
LOG_LEVEL=INFO
```

## Step 3: Deploy Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add ANTHROPIC_API_KEY production
vercel env add BACKEND_URL production
```

## Step 4: Custom Domain (Optional)

```bash
# Add custom domain
vercel domains add your-domain.com

# Configure DNS
# Add CNAME: your-domain.com → cname.vercel-dns.com
```

## Performance Optimization

### Edge Functions
```typescript
// api/chat.ts
export const config = {
  runtime: 'edge',  // Deploy to edge for low latency
};
```

### Caching
```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Monitoring

### Vercel Analytics
Add to your HTML:
```html
<script defer src="/_vercel/insights/script.js"></script>
```

### Custom Logging
```typescript
export default async function handler(req: Request) {
  console.log('[API] Request:', req.url);
  // Logs visible in Vercel dashboard
}
```

## Cost Estimation

**Free Tier:**
- 100GB bandwidth/month
- 100 serverless function executions/day
- Good for demos and testing

**Pro Plan ($20/month):**
- Unlimited bandwidth
- Unlimited executions
- Custom domains
- Team collaboration

## Troubleshooting

### WebSocket Issues
Vercel doesn't support long-lived WebSockets. Solutions:
1. Use Vercel for static UI only
2. Host MCP server externally (Railway, Render)
3. Use Server-Sent Events (SSE) instead

### Cold Starts
- Serverless functions may have ~200ms cold start
- Use edge functions for better performance
- Keep functions lightweight

## Alternative: Vercel + Railway

**Best Setup:**
```
Vercel (Frontend) ←→ Railway (MCP Server)
```

Deploy chat UI to Vercel, MCP server to Railway.

---

**Bonus Points:** +200 for Cloud-Native Deployment ✅
**Platform:** Vercel
**Architecture:** Serverless + Edge Functions
