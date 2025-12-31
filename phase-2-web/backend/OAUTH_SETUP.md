# OAuth Setup Guide - Google & GitHub Login

## Overview
This guide will help you configure Google and GitHub OAuth for your Todo application.

## Features Implemented
✅ Password Change API endpoint
✅ Google OAuth login
✅ GitHub OAuth login
✅ Automatic user creation from OAuth
✅ JWT token generation after OAuth
✅ Frontend OAuth buttons
✅ OAuth callback page

---

## 1. Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Create Project** or select existing project
3. Name your project (e.g., "Todo App")

### Step 2: Enable OAuth
1. Navigate to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Fill in:
   - App name: `Todo App`
   - User support email: Your email
   - Developer contact: Your email
4. Click **Save and Continue**
5. Skip **Scopes** (click Save and Continue)
6. Add test users (your email for testing)
7. Click **Save and Continue**

### Step 3: Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Todo App Web Client`
5. **Authorized redirect URIs** - Add:
   ```
   http://localhost:8000/api/auth/oauth/google/callback
   ```
6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

### Step 4: Add to .env File
```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

---

## 2. GitHub OAuth Setup

### Step 1: Create GitHub OAuth App
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: `Todo App`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**:
     ```
     http://localhost:8000/api/auth/oauth/github/callback
     ```
4. Click **Register application**

### Step 2: Generate Client Secret
1. On the OAuth app page, click **Generate a new client secret**
2. Copy the **Client ID** and **Client Secret** immediately (you won't see the secret again!)

### Step 3: Add to .env File
```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

---

## 3. Environment Configuration

### Complete .env File Example
Create or update `phase-2-web/backend/.env`:

```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://todouser:todopassword@localhost:5432/tododb

# JWT Authentication
SECRET_KEY=your-secret-key-min-32-characters-long-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS Configuration
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback

# Application Settings
APP_NAME=Todo API
DEBUG=true
```

---

## 4. Testing the Implementation

### Start Backend Server
```bash
cd phase-2-web/backend
uvicorn main:app --reload --port 8000
```

### Start Frontend Server
```bash
cd phase-2-web/frontend
npm run dev
```

### Test Password Change
1. Login to your account: `http://localhost:3000/auth/login`
2. Go to Settings: `http://localhost:3000/settings`
3. Fill in the password change form:
   - Current password
   - New password (min 8 chars, uppercase, lowercase, number)
   - Confirm new password
4. Click "Change Password"
5. ✅ You should see success message
6. Logout and login with new password to verify

### Test Google OAuth
1. Go to: `http://localhost:3000/auth/login`
2. Click **Continue with Google**
3. You'll be redirected to Google login
4. Choose your Google account
5. Grant permissions
6. ✅ You should be redirected back and logged in automatically

### Test GitHub OAuth
1. Go to: `http://localhost:3000/auth/login`
2. Click **Continue with GitHub**
3. You'll be redirected to GitHub login
4. Authorize the application
5. ✅ You should be redirected back and logged in automatically

---

## 5. API Endpoints

### Password Change
```http
POST /api/auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "current_password": "OldPass123",
  "new_password": "NewPass456",
  "confirm_password": "NewPass456"
}
```

**Response:**
```json
{
  "message": "Password changed successfully",
  "detail": "Your password has been updated. Please use your new password for future logins."
}
```

### Google OAuth Login
```http
GET /api/auth/oauth/google
```
Redirects to Google OAuth page.

### GitHub OAuth Login
```http
GET /api/auth/oauth/github
```
Redirects to GitHub OAuth page.

### OAuth Callback
```http
GET /api/auth/oauth/{provider}/callback
```
Automatically called by OAuth provider. Redirects to frontend with tokens.

---

## 6. Production Deployment

### Update Redirect URIs
When deploying to production, update the authorized redirect URIs:

**Google Cloud Console:**
```
https://yourdomain.com/api/auth/oauth/google/callback
```

**GitHub OAuth App:**
```
https://yourdomain.com/api/auth/oauth/github/callback
```

### Update .env for Production
```env
CORS_ORIGINS=["https://yourdomain.com"]
OAUTH_REDIRECT_URI=https://yourdomain.com/auth/callback
DEBUG=false
```

---

## 7. Troubleshooting

### Google OAuth Error: "redirect_uri_mismatch"
- **Fix**: Make sure the redirect URI in Google Cloud Console exactly matches:
  ```
  http://localhost:8000/api/auth/oauth/google/callback
  ```

### GitHub OAuth Error: "The redirect_uri MUST match"
- **Fix**: Verify the callback URL in GitHub OAuth App settings matches:
  ```
  http://localhost:8000/api/auth/oauth/github/callback
  ```

### Password Change Error: "Current password is incorrect"
- **Fix**: Make sure you're entering the correct current password
- Try logging out and back in first

### OAuth Login Creates Duplicate Users
- **Fix**: Users are matched by email. If same email, same user account is used.

### "Unable to retrieve email from OAuth provider"
- **Google**: Make sure email scope is included in OAuth consent screen
- **GitHub**: Make sure you have a verified email on your GitHub account

---

## 8. Security Notes

⚠️ **Important Security Practices:**

1. **Never commit `.env` file** to git
2. **Use strong SECRET_KEY** (min 32 characters)
3. **Keep OAuth secrets private** - never share Client Secrets
4. **Use HTTPS in production** - OAuth requires secure connections
5. **Regularly rotate secrets** - especially if exposed
6. **Limit OAuth scopes** - only request what you need
7. **Validate tokens** - backend validates all OAuth responses

---

## 9. How It Works

### OAuth Flow Diagram
```
User clicks "Google/GitHub Login"
    ↓
Frontend redirects to: /api/auth/oauth/{provider}
    ↓
Backend redirects to: Google/GitHub OAuth page
    ↓
User authorizes application
    ↓
OAuth provider redirects to: /api/auth/oauth/{provider}/callback
    ↓
Backend:
  - Exchanges code for access token
  - Fetches user info (email, name)
  - Creates user if not exists
  - Generates JWT tokens
  - Redirects to frontend /auth/callback with tokens
    ↓
Frontend:
  - Extracts tokens from URL
  - Stores in localStorage
  - Fetches user data
  - Redirects to dashboard
    ↓
✅ User is logged in!
```

### Password Change Flow
```
User fills password form in Settings
    ↓
Frontend sends: POST /api/auth/change-password
    ↓
Backend validates:
  - Current password is correct
  - New password meets requirements
  - New password != current password
  - Confirm password matches
    ↓
Backend hashes new password and updates database
    ↓
✅ Password changed successfully!
```

---

## Support

If you encounter any issues:
1. Check backend logs for detailed error messages
2. Verify all environment variables are set correctly
3. Make sure both frontend and backend servers are running
4. Check browser console for frontend errors
5. Test API endpoints directly using the Swagger docs at `http://localhost:8000/docs`
