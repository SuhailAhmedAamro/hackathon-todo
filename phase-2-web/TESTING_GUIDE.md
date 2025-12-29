# Phase 2 Web Application - End-to-End Testing Guide

## Server Status
✅ Backend: http://localhost:8000 (FastAPI + PostgreSQL)
✅ Frontend: http://localhost:3000 (Next.js)

---

## TEST SUITE 1: User Registration & Authentication

### 1.1 New User Registration

**Steps:**
1. Open browser and navigate to: `http://localhost:3000`
2. Should auto-redirect to: `http://localhost:3000/auth/login`
3. Click "Create one now" link at bottom
4. Should navigate to: `http://localhost:3000/auth/register`

**Fill Registration Form:**
- Username: `johndoe` (3-50 chars, alphanumeric + underscore only)
- Email: `john@example.com` (valid email format)
- Password: `SecurePass123` (min 8 chars, must have: uppercase, lowercase, number)
- Confirm Password: `SecurePass123` (must match)

**Expected Results:**
- ✅ Password strength indicator shows "Strong" (green bar)
- ✅ All validation passes (no red error messages)
- ✅ Click "Create Account" button
- ✅ Button shows "Creating account..." with spinner
- ✅ Toast notification appears (top-right): "Account created successfully! Welcome, johndoe!" 🔓
- ✅ Auto-redirects to `/dashboard`
- ✅ Dashboard shows user info with username "johndoe"

**Test Form Validation:**
- Try username < 3 chars → Error: "Username must be at least 3 characters"
- Try username with spaces → Error: "Username can only contain letters, numbers, and underscores"
- Try invalid email → Error: "Invalid email address"
- Try password < 8 chars → Error: "Password must be at least 8 characters"
- Try password without uppercase → Error: "Password must contain at least one uppercase letter"
- Try mismatched passwords → Error: "Passwords don't match"

---

### 1.2 User Login

**Steps:**
1. Click "Logout" button (top-right of dashboard)
2. Toast notification: "Logged out successfully. See you soon!" 🔓
3. Redirects to `/auth/login`

**Login with Registered User:**
- Username or Email: `johndoe` (or `john@example.com`)
- Password: `SecurePass123`
- Click "Sign In"

**Expected Results:**
- ✅ Button shows "Signing in..." with spinner
- ✅ Toast notification: "Welcome back, johndoe!" 🔓
- ✅ Redirects to `/dashboard`
- ✅ Dashboard loads with user data

**Test Invalid Credentials:**
- Wrong password → Toast: "Incorrect username/email or password" 🔒
- Non-existent user → Toast: "Incorrect username/email or password" 🔒

---

## TEST SUITE 2: Dashboard Features

### 2.1 Dashboard Overview

**URL:** `http://localhost:3000/dashboard`

**Expected Elements:**
- ✅ Header with:
  - Title: "Dashboard"
  - Welcome message: "Welcome back, johndoe!"
  - "My Tasks" button (blue)
  - Theme toggle button
  - "Logout" button (red)

- ✅ Three cards displayed:
  1. **Your Profile Card** (blue left border):
     - Username: johndoe
     - Email: john@example.com
     - Status: Active (green badge)
     - Member Since: [today's date]

  2. **Quick Stats Card** (green left border):
     - Total Tasks: 0 (initially)
     - Completed: 0
     - In Progress: 0
     - Pending: 0
     - Shows spinner while loading

  3. **Coming Soon Card** (purple left border):
     - Task Management ✓
     - Tags & Categories ✓
     - Search & Filtering ✓
     - Dark Mode ✓

- ✅ Success message at bottom:
  - Green background
  - "Authentication Successful!"
  - Message about JWT authentication

### 2.2 Theme Toggle Test

**Steps:**
1. Click theme toggle button (top-right, sun/moon icon)

**Expected Results - Dark Mode:**
- ✅ Background changes from light gray to dark gray
- ✅ Cards change from white to dark gray
- ✅ All text changes to light colors
- ✅ All badges adjust colors for dark mode
- ✅ Toggle icon changes from sun ☀️ to moon 🌙
- ✅ Smooth 300ms transition

**Test Persistence:**
1. Refresh page → Dark mode persists
2. Navigate to /tasks → Dark mode stays active
3. Toggle back to light mode → Changes persist

---

## TEST SUITE 3: Task Management (CRUD Operations)

### 3.1 Navigate to Tasks Page

**Steps:**
1. From dashboard, click "My Tasks" button
2. Should navigate to: `http://localhost:3000/tasks`

**Expected Layout:**
- ✅ Header shows "My Tasks" and "0 tasks total"
- ✅ Left sidebar: "Create Task" card with + button
- ✅ Right side: Empty state with message "No tasks found. Create your first task to get started!"

---

### 3.2 Create Tasks (Multiple Scenarios)

#### Task 1: High Priority, Urgent
**Click + button to show form**

**Fill in:**
- Title: `Complete project documentation`
- Description: `Write comprehensive API docs and deployment guide`
- Priority: `High`
- Status: `In Progress`
- Due Date: Tomorrow at 5 PM (use date picker)

**Click "Create Task"**

**Expected Results:**
- ✅ Toast: "Task created successfully!" (green)
- ✅ Form closes/resets
- ✅ Task appears in list with:
  - Red left border (high priority)
  - Title and description displayed
  - "HIGH" badge (red)
  - "In Progress" badge (blue)
  - Due date with calendar icon
  - Three action buttons: complete, edit, delete

#### Task 2: Medium Priority, Pending
**Click + button again**

**Fill in:**
- Title: `Review code changes`
- Description: Leave empty
- Priority: `Medium`
- Status: `Pending`
- Due Date: Leave empty

**Expected Results:**
- ✅ Task appears with yellow left border
- ✅ "MEDIUM" badge (yellow)
- ✅ "Pending" badge (gray)
- ✅ No due date shown
- ✅ No description shown

#### Task 3: Low Priority, Due Yesterday (Overdue)
**Fill in:**
- Title: `Send meeting notes`
- Priority: `Low`
- Status: `Pending`
- Due Date: Yesterday

**Expected Results:**
- ✅ Task shows RED left border (overdue)
- ✅ Due date shows in red with "(Overdue)" label
- ✅ "LOW" priority badge still shown

---

### 3.3 Complete/Incomplete Tasks

**Steps:**
1. Click the circle icon on "Review code changes" task
2. Watch the animation

**Expected Results:**
- ✅ Toast: "Task marked as complete!"
- ✅ Task updates immediately:
  - Title and description get strikethrough
  - Border changes to green
  - Status badge changes to "Completed" (green)
  - Circle icon fills in (becomes checkmark)
  - "Completed [date]" badge appears
  - Text becomes slightly faded

**Click circle icon again:**
- ✅ Toast: "Task marked as incomplete"
- ✅ Strikethrough removed
- ✅ Status changes back to original
- ✅ Border color reverts

---

### 3.4 Delete Task

**Steps:**
1. Click red trash icon on any task
2. Confirm in dialog

**Expected Results:**
- ✅ Confirmation dialog: "Are you sure you want to delete this task?"
- ✅ Click OK
- ✅ Toast: "Task deleted successfully!"
- ✅ Task disappears from list with smooth animation
- ✅ Task count decreases in header

**Cancel Deletion:**
- Click trash icon → Click Cancel → Task remains

---

### 3.5 Verify Dashboard Stats Update

**Steps:**
1. Navigate back to Dashboard (click "Dashboard" in header)

**Expected Results:**
- ✅ Quick Stats card shows updated numbers:
  - Total Tasks: 3 (or current count)
  - Completed: 1 (if you completed one)
  - In Progress: 1
  - Pending: 1
- ✅ Stats load with spinner first, then show numbers

---

## TEST SUITE 4: Toast Notifications

### 4.1 Success Toasts (Green)
- ✅ Account created
- ✅ Login successful
- ✅ Task created
- ✅ Task completed
- ✅ Task deleted
- Duration: 4 seconds
- Position: Top-right
- Icon: Green checkmark ✓

### 4.2 Error Toasts (Red)
**Test by turning off backend:**
1. Stop backend server
2. Try to create a task
- ✅ Toast: "Failed to create task"
- Duration: 5 seconds (longer than success)
- Icon: Red X

**Test authentication errors:**
- Wrong password → Toast with lock icon 🔒
- Duration: 5 seconds

### 4.3 Auth-Specific Toasts
- ✅ Login: "Welcome back, johndoe!" with 🔓
- ✅ Register: "Account created successfully! Welcome, johndoe!" with 🔓
- ✅ Logout: "Logged out successfully. See you soon!" with 🔓
- ✅ Auth errors with 🔒

---

## TEST SUITE 5: Dark Mode (Comprehensive)

### 5.1 Test All Pages in Dark Mode

**Login Page:**
1. Navigate to `/auth/login`
2. Toggle dark mode
- ✅ Gradient background (dark)
- ✅ Form card (dark gray)
- ✅ Input fields (dark with light text)
- ✅ Placeholders visible
- ✅ Errors readable
- ✅ Links blue and visible

**Register Page:**
1. Navigate to `/auth/register`
- ✅ Password strength indicator visible in dark mode
- ✅ All form fields styled correctly
- ✅ Password strength bar colors show properly

**Dashboard:**
- ✅ All three cards dark
- ✅ Status badges readable
- ✅ Success message has dark variant
- ✅ All text readable

**Tasks Page:**
- ✅ Task cards dark gray
- ✅ Badges adjusted for dark mode
- ✅ Priority colors still distinct
- ✅ Action buttons visible
- ✅ Form in sidebar styled correctly

---

## TEST SUITE 6: Navigation & Protected Routes

### 6.1 Unauthenticated Access

**Steps:**
1. Logout completely
2. Try to access: `http://localhost:3000/dashboard`

**Expected:**
- ✅ Immediately redirects to `/auth/login?redirect=%2Fdashboard`
- ✅ After login, redirects back to `/dashboard`

### 6.2 Navigation Flow

**Test all navigation paths:**
1. Login → Dashboard ✅
2. Dashboard → Tasks → Dashboard ✅
3. Tasks → Dashboard → Logout → Login ✅
4. Register → Dashboard (auto-login) ✅

---

## TEST SUITE 7: Form Validation & Error Handling

### 7.1 Registration Validation

Test each validation rule:
- [ ] Username too short
- [ ] Username with special chars
- [ ] Invalid email format
- [ ] Password too short
- [ ] Password without uppercase
- [ ] Password without lowercase
- [ ] Password without number
- [ ] Passwords don't match

All should show:
- ✅ Red error message below field
- ✅ Red border on field
- ✅ Submit button disabled until fixed

### 7.2 Login Validation

- [ ] Empty username → Error
- [ ] Empty password → Error
- [ ] Invalid credentials → Toast error

### 7.3 Task Form Validation

- [ ] Empty title → Error: "Title is required"
- [ ] Title > 255 chars → Error
- [ ] Valid form → Success

---

## TEST SUITE 8: Loading States

### 8.1 Page Loading

**Dashboard Loading:**
- ✅ Full-page spinner with "Loading dashboard..."
- ✅ Blue spinner, centered
- ✅ Gray text message

**Tasks Loading:**
- ✅ Quick Stats shows spinner while fetching
- ✅ Task list shows "Loading tasks..."

### 8.2 Button Loading

**All forms show loading:**
- Sign In → "Signing in..." with spinner
- Create Account → "Creating account..." with spinner
- Create Task → "Saving..." (button disabled)
- Delete Task → Button disabled during deletion

---

## TEST SUITE 9: Responsive Design (Optional)

### 9.1 Desktop (> 1024px)
- ✅ Three-column grid on dashboard
- ✅ Two-column layout on tasks page

### 9.2 Tablet (768px - 1024px)
- ✅ Two-column grid on dashboard
- ✅ Responsive cards

### 9.3 Mobile (< 768px)
- ✅ Single column layout
- ✅ Stacked cards
- ✅ Touch-friendly buttons

---

## TEST SUITE 10: Session Persistence

### 10.1 Token Persistence

**Steps:**
1. Login as johndoe
2. Refresh page (F5)
- ✅ Still logged in
- ✅ Dashboard loads immediately
- ✅ User data preserved

3. Close browser completely
4. Reopen and navigate to `http://localhost:3000`
- ✅ Still logged in
- ✅ Session restored from localStorage

### 10.2 Token Expiration (30 min)

**Note:** Access token expires after 30 minutes
- ✅ Auto-refresh using refresh token (7 days)
- ✅ Seamless re-authentication
- ✅ No interruption to user

---

## CHECKLIST: Complete Feature Set

### ✅ Authentication
- [x] User registration with validation
- [x] User login (username or email)
- [x] JWT token management
- [x] Auto-login after registration
- [x] Logout functionality
- [x] Protected routes
- [x] Session persistence
- [x] Token refresh (automatic)

### ✅ Dashboard
- [x] User profile display
- [x] Real-time task statistics
- [x] Welcome message
- [x] Navigation buttons
- [x] Quick access to tasks

### ✅ Task Management
- [x] Create tasks with validation
- [x] List all user tasks
- [x] Toggle task completion
- [x] Delete tasks with confirmation
- [x] Priority levels (Low, Medium, High)
- [x] Status tracking (Pending, In Progress, Completed)
- [x] Due dates with overdue detection
- [x] Task descriptions
- [x] Visual priority indicators
- [x] Task count tracking

### ✅ UI/UX Features
- [x] Dark mode (persistent)
- [x] Toast notifications (success/error)
- [x] Loading states (spinners)
- [x] Form validation
- [x] Error handling
- [x] Empty states
- [x] Confirmation dialogs
- [x] Smooth animations
- [x] Hover effects
- [x] Responsive design

### ✅ Technical Features
- [x] PostgreSQL database
- [x] JWT authentication
- [x] User isolation (can't see others' tasks)
- [x] RESTful API
- [x] Client-side routing
- [x] Auto-redirect on auth failure
- [x] Error boundaries
- [x] Type safety (TypeScript)

---

## Known Limitations & Future Enhancements

### Current Limitations
- ⏭️ Edit task not implemented (ready for integration)
- ⏭️ Search/filter not on tasks page yet
- ⏭️ Tags system (backend ready, frontend pending)
- ⏭️ Pagination controls not visible
- ⏭️ Sorting options not exposed

### Next Phase Features
- Phase 3: Chatbot interface (MCP)
- Phase 4: Kubernetes deployment
- Phase 5: Cloud hosting

---

## Quick Test Scenario (5 Minutes)

1. **Register** → Fill form → See toast → Auto-login → Dashboard ✅
2. **Toggle dark mode** → Everything adapts ✅
3. **Click "My Tasks"** → Navigate to tasks page ✅
4. **Create 3 tasks** → Different priorities → See toasts ✅
5. **Complete 1 task** → Click circle → See strikethrough ✅
6. **Delete 1 task** → Confirm → See it disappear ✅
7. **Back to Dashboard** → See updated stats (2 tasks) ✅
8. **Logout** → See toast → Redirect to login ✅
9. **Login again** → Toast → Dashboard with data ✅
10. **Refresh page** → Still logged in ✅

**Expected Time:** 3-5 minutes
**All Features Working:** 🎉 Yes!

---

## Troubleshooting

### Issue: "Failed to load tasks"
- **Check:** Backend server running on port 8000
- **Fix:** Run `uvicorn main:app --reload` in backend folder

### Issue: "Authentication expired"
- **Cause:** Tokens expired (30 min / 7 days)
- **Fix:** Login again, new tokens issued

### Issue: Dark mode not persisting
- **Check:** localStorage enabled in browser
- **Fix:** Allow cookies/storage for localhost

### Issue: Toast not showing
- **Check:** Toaster component in layout.tsx
- **Fix:** Already included, restart dev server

---

## Success Criteria

All tests passing means:
✅ Complete authentication flow working
✅ Task CRUD operations functional
✅ Dark mode implemented and persistent
✅ Toast notifications showing correctly
✅ Dashboard displaying real data
✅ Navigation working properly
✅ Error handling robust
✅ UI polished and responsive

**Phase 2 Complete!** 🎊
