# Feature: User Authentication

## Overview
User registration, login, and session management using JWT tokens.

## User Stories

### As a new user, I want to register so that I can use the application
**Acceptance Criteria:**
- [ ] Can provide username, email, password
- [ ] Username must be unique
- [ ] Email must be valid and unique
- [ ] Password must meet security requirements
- [ ] Password is hashed before storage
- [ ] Receive confirmation after registration
- [ ] Auto-login after registration

### As a returning user, I want to login so that I can access my tasks
**Acceptance Criteria:**
- [ ] Can login with username/email and password
- [ ] Receive JWT token on successful login
- [ ] Invalid credentials show error
- [ ] Session persists across page reloads
- [ ] Redirected to dashboard after login

### As a logged-in user, I want to logout so that I can secure my account
**Acceptance Criteria:**
- [ ] Can logout from any page
- [ ] Session is cleared
- [ ] Redirected to login page
- [ ] Cannot access protected routes after logout

## Functional Requirements

### Registration
- **Username**: 3-50 characters, alphanumeric + underscore
- **Email**: Valid email format, max 255 characters
- **Password**: Min 8 characters, must contain uppercase, lowercase, number
- Password hashing: bcrypt with cost factor 12
- Validation errors returned with specific messages

### Login
- Accept username or email
- Validate password against hash
- Generate JWT token (30min expiration)
- Generate refresh token (7 days expiration)
- Return user info + tokens

### Session Management
- Store JWT in httpOnly cookie
- Include JWT in Authorization header
- Validate JWT on protected routes
- Refresh token endpoint for new JWT
- Logout clears tokens

## Security Requirements
- Passwords never stored in plain text
- JWT signed with secret key
- HTTPS only in production
- Rate limiting on auth endpoints (5 requests/minute)
- Account lockout after 5 failed attempts
- CSRF protection

## API Integration
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```
See `@specs/api/rest-endpoints.md` for details

## Data Model
See `@specs/database/schema.md` for User table

## UI Requirements
- Registration form
- Login form
- Forgot password (future)
- Profile page

## Phase Applicability
- [ ] Phase 1: Console (not applicable, single user)
- [x] Phase 2: Web Application
- [x] Phase 3: Chatbot
- [x] Phase 4: Kubernetes
- [x] Phase 5: Cloud

## Testing
- Test successful registration
- Test duplicate username/email
- Test weak passwords rejected
- Test successful login
- Test failed login
- Test token expiration
- Test token refresh
- Test logout

## Success Metrics
- Registration success rate > 95%
- Login time < 500ms
- Zero password leaks
- Token validation < 50ms
