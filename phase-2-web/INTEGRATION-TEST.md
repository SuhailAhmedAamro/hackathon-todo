# Phase 2 - Full Integration Test Guide

## Overview

This guide will help you test the complete Phase 2 Todo Web Application with both backend and frontend working together.

---

## Prerequisites

Both servers must be running:
- ✅ Backend: http://localhost:8000
- ✅ Frontend: http://localhost:3000

---

## Test 1: Backend Health Check

**Test backend is running:**

1. Open browser: http://localhost:8000/health

**Expected Response:**
```json
{
  "status": "healthy",
  "phase": "Phase 2 - Web Application",
  "storage": "in-memory",
  "tasks_count": 0
}
```

✅ **Pass:** Backend is running and responding

---

## Test 2: API Documentation

**Test Swagger UI:**

1. Open browser: http://localhost:8000/docs

**Expected:**
- Interactive API documentation loads
- All endpoints visible:
  - GET /api/tasks
  - POST /api/tasks
  - GET /api/tasks/{task_id}
  - PUT /api/tasks/{task_id}
  - DELETE /api/tasks/{task_id}
  - PATCH /api/tasks/{task_id}/complete
  - GET /health

✅ **Pass:** API documentation accessible

---

## Test 3: Create Task via API

**Test backend task creation:**

1. In Swagger UI, click on `POST /api/tasks`
2. Click "Try it out"
3. Enter request body:
   ```json
   {
     "title": "Backend API Test",
     "description": "Testing the backend API",
     "priority": "high",
     "due_date": "2025-12-31"
   }
   ```
4. Click "Execute"

**Expected Response:**
```json
{
  "id": "uuid-string",
  "title": "Backend API Test",
  "description": "Testing the backend API",
  "priority": "high",
  "status": "pending",
  "due_date": "2025-12-31",
  "created_at": "2025-12-28T...",
  "updated_at": "2025-12-28T...",
  "completed_at": null
}
```

✅ **Pass:** Task created successfully via API

---

## Test 4: List Tasks via API

**Test backend task retrieval:**

1. In Swagger UI, click on `GET /api/tasks`
2. Click "Try it out"
3. Click "Execute"

**Expected Response:**
```json
[
  {
    "id": "uuid-string",
    "title": "Backend API Test",
    "description": "Testing the backend API",
    "priority": "high",
    "status": "pending",
    ...
  }
]
```

✅ **Pass:** Task retrieved from storage

---

## Test 5: Frontend Loads

**Test Next.js frontend:**

1. Open browser: http://localhost:3000

**Expected:**
- Page loads with title "Hackathon II - Phase 2"
- "Todo Web Application" subtitle
- "Demo Mode" yellow banner
- Task creation form visible:
  - Title input
  - Description textarea
  - Priority dropdown
  - Due date picker
  - "Add Task" button
- "My Tasks" section with filters:
  - All
  - Pending
  - In Progress
  - Completed
- Previously created task from API visible in list

✅ **Pass:** Frontend loads and displays existing task

---

## Test 6: Create Task via Frontend

**Test full-stack task creation:**

1. In frontend at http://localhost:3000
2. Fill in the form:
   - **Title:** "Frontend Test Task"
   - **Description:** "Testing frontend integration"
   - **Priority:** "medium"
   - **Due Date:** Select tomorrow's date
3. Click "Add Task"

**Expected:**
- Form clears immediately
- New task appears in list below
- Task shows:
  - Title: "Frontend Test Task"
  - Description: "Testing frontend integration"
  - Yellow "MEDIUM" priority badge
  - Gray "PENDING" status badge
  - Due date displayed
  - "Complete" button (green)
  - "Delete" button (red)

✅ **Pass:** Task created via frontend and displayed

---

## Test 7: Task Filters

**Test filtering functionality:**

1. In frontend, note you have 2 tasks (1 high, 1 medium priority)
2. Click "Pending" filter button

**Expected:**
- Button turns blue (active state)
- Both tasks still visible (both are pending)

3. Create another task and mark it complete (see Test 8)
4. Click "Completed" filter

**Expected:**
- Only completed task visible
- Completed tasks have green border and are slightly faded

5. Click "All" filter

**Expected:**
- All tasks visible again

✅ **Pass:** Filters work correctly

---

## Test 8: Mark Task Complete

**Test task completion:**

1. Find "Frontend Test Task" in the list
2. Click the green "Complete" button

**Expected:**
- Task immediately updates:
  - Status changes to green "COMPLETED" badge
  - Border becomes green
  - Text appears struck-through or faded
  - "Complete" button disappears
  - Completed timestamp shows

✅ **Pass:** Task marked as complete

---

## Test 9: Delete Task

**Test task deletion:**

1. Find any task in the list
2. Click the red "Delete" button

**Expected:**
- Browser confirmation dialog appears:
  "Are you sure you want to delete this task?"
3. Click "OK"

**Expected:**
- Task immediately removed from list
- Remaining tasks still visible

✅ **Pass:** Task deleted successfully

---

## Test 10: Priority Color Coding

**Test visual priority indicators:**

1. Create 3 tasks with different priorities:
   - Task 1: Priority "low"
   - Task 2: Priority "medium"
   - Task 3: Priority "high"

**Expected:**
- Low priority: Green badge, gray border
- Medium priority: Yellow badge, yellow border
- High priority: Red badge, red border

✅ **Pass:** Priority colors displayed correctly

---

## Test 11: Real-time Updates

**Test UI synchronization:**

1. Open frontend: http://localhost:3000
2. Open Swagger UI in another tab: http://localhost:8000/docs
3. Create a task via Swagger UI (POST /api/tasks)
4. Go back to frontend tab
5. Refresh the page

**Expected:**
- Task created via API appears in frontend

6. Create task via frontend
7. Check Swagger UI (GET /api/tasks)

**Expected:**
- Task created via frontend visible in API response

✅ **Pass:** Backend and frontend synchronized

---

## Test 12: Form Validation

**Test input validation:**

1. Try to submit empty form (no title)

**Expected:**
- "Add Task" button disabled or form shows validation error

2. Enter very long title (300 characters)

**Expected:**
- Backend returns error (max 200 characters)

✅ **Pass:** Validation working

---

## Test 13: Responsive Design

**Test mobile/desktop layouts:**

1. Open frontend: http://localhost:3000
2. Resize browser window to mobile size (< 768px)

**Expected:**
- Layout adjusts responsively
- Form remains usable
- Task list stacks vertically
- Buttons remain accessible

3. Resize to tablet size (768px - 1024px)

**Expected:**
- Layout optimized for tablet
- Good use of available space

4. Resize to desktop (> 1024px)

**Expected:**
- Full layout with optimal spacing
- Professional appearance

✅ **Pass:** Responsive design working

---

## Test 14: Due Date Functionality

**Test due date handling:**

1. Create task with due date in the past
2. Create task with due date today
3. Create task with due date in future
4. Create task without due date

**Expected:**
- All tasks created successfully
- Due dates displayed correctly
- Tasks without due dates show nothing (no error)

✅ **Pass:** Due dates handled correctly

---

## Test 15: Multiple Tasks Management

**Test bulk operations:**

1. Create 10 tasks with various:
   - Priorities (mix of low, medium, high)
   - Statuses (some pending, some completed)
   - Due dates (past, present, future, none)

**Expected:**
- All tasks created successfully
- List displays all tasks
- Scrolling works if needed
- Performance remains good

2. Filter by "Completed"

**Expected:**
- Only completed tasks visible

3. Delete all completed tasks

**Expected:**
- Only pending tasks remain

✅ **Pass:** Multiple tasks handled well

---

## Final Integration Test Summary

After completing all tests, verify:

### Backend ✅
- [x] Health check working
- [x] API documentation accessible
- [x] All CRUD endpoints functional
- [x] Data persists in memory
- [x] CORS configured correctly

### Frontend ✅
- [x] Application loads
- [x] Form submission works
- [x] Task list displays correctly
- [x] Filters function properly
- [x] Complete/Delete actions work
- [x] Real-time UI updates
- [x] Responsive design

### Integration ✅
- [x] Frontend connects to backend
- [x] Tasks sync between frontend/backend
- [x] No CORS errors
- [x] No console errors
- [x] Professional UI/UX

---

## Performance Metrics

Record these metrics:

- **Backend Response Time:** < 100ms (for simple operations)
- **Frontend Load Time:** < 3 seconds
- **Task Creation Time:** < 500ms
- **UI Update Time:** Immediate (< 100ms)

---

## Known Issues (Demo Mode)

These are expected and documented:

1. **Data Persistence:** Tasks cleared on server restart (in-memory storage)
2. **Authentication:** Not implemented (TODO for production)
3. **Multi-user:** Single shared task list (no user isolation)
4. **Database:** No PostgreSQL (in-memory only)

These are intentional for the hackathon demo and documented for production upgrade.

---

## Next Steps After Successful Test

1. ✅ Record 90-second demo video
2. ✅ Prepare hackathon submission
3. ✅ Document Phase 3 plans (MCP chatbot)
4. ✅ Plan production upgrades (Neon PostgreSQL, Better Auth)

---

## Troubleshooting

### Backend Not Responding

```bash
# Check if running
netstat -ano | findstr :8000

# Restart if needed
cd backend
uvicorn main:app --reload --port 8000
```

### Frontend Not Loading

```bash
# Check if running
netstat -ano | findstr :3000

# Restart if needed
cd frontend
npm run dev
```

### CORS Errors

Check backend CORS configuration in `main.py`:
```python
allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

---

## Success Criteria

✅ All 15 tests pass
✅ No console errors
✅ Professional appearance
✅ Follows hackathon requirements
✅ Ready for demo submission

**Congratulations! Your Phase 2 is fully functional and tested!** 🎉
