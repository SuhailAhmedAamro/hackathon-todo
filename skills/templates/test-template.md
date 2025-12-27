# Test Specification: [Feature/Component Name]

## Overview
[Brief description of what is being tested]

## Test Strategy

### Test Types
- [ ] Unit Tests
- [ ] Integration Tests
- [ ] End-to-End (E2E) Tests
- [ ] Performance Tests
- [ ] Security Tests
- [ ] Accessibility Tests

### Test Coverage Goals
- **Overall Coverage**: ≥ 80%
- **Critical Paths**: 100%
- **Edge Cases**: 100%
- **Error Handling**: 100%

## Unit Tests

### Backend (Python/FastAPI)

**File**: `tests/test_[module].py`

**Framework**: pytest

**Test Cases**:

#### Test 1: [Function Name] - Happy Path
```python
def test_function_name_success():
    """Test successful execution with valid input"""
    # Arrange
    input_data = {"field": "value"}
    expected_output = {"result": "expected"}

    # Act
    result = function_name(input_data)

    # Assert
    assert result == expected_output
    assert result["field"] == "value"
```

#### Test 2: [Function Name] - Invalid Input
```python
def test_function_name_invalid_input():
    """Test error handling with invalid input"""
    # Arrange
    invalid_input = {"field": ""}

    # Act & Assert
    with pytest.raises(ValidationError) as exc_info:
        function_name(invalid_input)

    assert "field is required" in str(exc_info.value)
```

#### Test 3: [Function Name] - Edge Case
```python
def test_function_name_edge_case():
    """Test edge case: maximum length"""
    # Arrange
    edge_input = {"field": "x" * 255}

    # Act
    result = function_name(edge_input)

    # Assert
    assert len(result["field"]) == 255
```

#### Test 4: Database Operations
```python
def test_create_task_database(db_session):
    """Test task creation in database"""
    # Arrange
    task_data = TaskCreate(title="Test Task", priority="high")

    # Act
    task = create_task(db_session, task_data)

    # Assert
    assert task.id is not None
    assert task.title == "Test Task"
    assert task.priority == "high"
    assert task.created_at is not None

    # Cleanup
    db_session.delete(task)
    db_session.commit()
```

### Frontend (TypeScript/React)

**File**: `components/[ComponentName].test.tsx`

**Framework**: Jest + React Testing Library

**Test Cases**:

#### Test 1: Component Renders
```typescript
test('renders component with props', () => {
  render(
    <ComponentName
      title="Test Title"
      items={mockItems}
      onItemSelect={jest.fn()}
    />
  );

  expect(screen.getByText('Test Title')).toBeInTheDocument();
  expect(screen.getByText('Item 1')).toBeInTheDocument();
});
```

#### Test 2: User Interaction
```typescript
test('calls callback when item clicked', () => {
  const mockCallback = jest.fn();

  render(
    <ComponentName
      title="Test"
      items={mockItems}
      onItemSelect={mockCallback}
    />
  );

  fireEvent.click(screen.getByText('Item 1'));

  expect(mockCallback).toHaveBeenCalledWith('item-1');
  expect(mockCallback).toHaveBeenCalledTimes(1);
});
```

#### Test 3: State Changes
```typescript
test('updates state on interaction', () => {
  render(<ComponentName title="Test" items={mockItems} />);

  const item = screen.getByText('Item 1');
  fireEvent.click(item);

  expect(item).toHaveClass('selected');
});
```

#### Test 4: Loading State
```typescript
test('shows loading spinner when isLoading is true', () => {
  render(
    <ComponentName
      title="Test"
      items={mockItems}
      isLoading={true}
    />
  );

  expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
});
```

#### Test 5: Error Handling
```typescript
test('displays error message when error prop is provided', () => {
  render(
    <ComponentName
      title="Test"
      items={mockItems}
      error="Something went wrong"
    />
  );

  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
});
```

## Integration Tests

### API Integration Tests

**File**: `tests/integration/test_api.py`

**Test Cases**:

#### Test 1: Complete Workflow
```python
def test_task_creation_workflow(client, auth_headers):
    """Test complete task creation workflow"""
    # Create task
    create_response = client.post(
        "/api/tasks",
        json={"title": "Integration Test Task", "priority": "high"},
        headers=auth_headers
    )
    assert create_response.status_code == 201
    task_id = create_response.json()["id"]

    # Retrieve task
    get_response = client.get(
        f"/api/tasks/{task_id}",
        headers=auth_headers
    )
    assert get_response.status_code == 200
    assert get_response.json()["title"] == "Integration Test Task"

    # Update task
    update_response = client.put(
        f"/api/tasks/{task_id}",
        json={"title": "Updated Task", "priority": "medium"},
        headers=auth_headers
    )
    assert update_response.status_code == 200
    assert update_response.json()["priority"] == "medium"

    # Delete task
    delete_response = client.delete(
        f"/api/tasks/{task_id}",
        headers=auth_headers
    )
    assert delete_response.status_code == 204

    # Verify deletion
    get_deleted = client.get(
        f"/api/tasks/{task_id}",
        headers=auth_headers
    )
    assert get_deleted.status_code == 404
```

#### Test 2: Authentication Flow
```python
def test_authentication_flow(client):
    """Test user registration and login"""
    # Register
    register_response = client.post(
        "/api/auth/register",
        json={
            "username": "testuser",
            "email": "test@example.com",
            "password": "SecurePass123"
        }
    )
    assert register_response.status_code == 201
    assert "token" in register_response.json()

    # Login
    login_response = client.post(
        "/api/auth/login",
        json={
            "username": "testuser",
            "password": "SecurePass123"
        }
    )
    assert login_response.status_code == 200
    assert "token" in login_response.json()
```

### Database Integration Tests

```python
def test_database_relationships(db_session):
    """Test database relationships"""
    # Create user
    user = User(username="testuser", email="test@example.com")
    db_session.add(user)
    db_session.commit()

    # Create task
    task = Task(title="Test Task", user_id=user.id)
    db_session.add(task)
    db_session.commit()

    # Verify relationship
    assert len(user.tasks) == 1
    assert user.tasks[0].title == "Test Task"
```

## End-to-End (E2E) Tests

**Framework**: Playwright or Cypress

**File**: `e2e/[feature].spec.ts`

**Test Cases**:

### Test 1: User Journey
```typescript
test('user can create and complete a task', async ({ page }) => {
  // Navigate to app
  await page.goto('http://localhost:3000');

  // Login
  await page.fill('[name="username"]', 'testuser');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Wait for dashboard
  await page.waitForSelector('[data-testid="dashboard"]');

  // Create task
  await page.click('[data-testid="add-task-button"]');
  await page.fill('[name="title"]', 'E2E Test Task');
  await page.selectOption('[name="priority"]', 'high');
  await page.click('button[type="submit"]');

  // Verify task appears
  await expect(page.locator('text=E2E Test Task')).toBeVisible();

  // Complete task
  await page.click('[data-testid="complete-task-button"]');

  // Verify completion
  await expect(page.locator('[data-testid="task-status"]')).toHaveText('completed');
});
```

### Test 2: Error Handling
```typescript
test('shows error for invalid input', async ({ page }) => {
  await page.goto('http://localhost:3000/tasks/new');

  // Try to submit empty form
  await page.click('button[type="submit"]');

  // Verify error message
  await expect(page.locator('.error-message')).toContainText('Title is required');
});
```

## Performance Tests

### Load Testing
```python
from locust import HttpUser, task, between

class TodoUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def list_tasks(self):
        self.client.get(
            "/api/tasks",
            headers={"Authorization": f"Bearer {self.token}"}
        )

    @task(3)
    def create_task(self):
        self.client.post(
            "/api/tasks",
            json={"title": "Load Test Task", "priority": "medium"},
            headers={"Authorization": f"Bearer {self.token}"}
        )
```

### Performance Benchmarks
- API response time (p95): < 200ms
- Page load time: < 2s
- Time to Interactive: < 3s
- First Contentful Paint: < 1s

## Security Tests

### Authentication Tests
```python
def test_unauthorized_access(client):
    """Test that protected routes require authentication"""
    response = client.get("/api/tasks")
    assert response.status_code == 401
```

### Authorization Tests
```python
def test_user_cannot_access_others_tasks(client, auth_headers, other_user_task_id):
    """Test users can only access their own tasks"""
    response = client.get(
        f"/api/tasks/{other_user_task_id}",
        headers=auth_headers
    )
    assert response.status_code == 403
```

### Input Validation Tests
```python
def test_sql_injection_prevention(client, auth_headers):
    """Test SQL injection is prevented"""
    malicious_input = {"title": "'; DROP TABLE tasks; --"}
    response = client.post(
        "/api/tasks",
        json=malicious_input,
        headers=auth_headers
    )
    # Should create task with literal string, not execute SQL
    assert response.status_code == 201
```

### XSS Prevention Tests
```typescript
test('sanitizes HTML in user input', () => {
  const maliciousInput = '<script>alert("XSS")</script>';

  render(<ComponentName title={maliciousInput} />);

  // Should render as text, not execute script
  expect(screen.getByText(/script/)).toBeInTheDocument();
  // Alert should not have been called
});
```

## Accessibility Tests

### Keyboard Navigation
```typescript
test('can navigate with keyboard', async ({ page }) => {
  await page.goto('http://localhost:3000/tasks');

  // Tab through elements
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-testid="first-button"]')).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(page.locator('[data-testid="second-button"]')).toBeFocused();

  // Press Enter to activate
  await page.keyboard.press('Enter');
});
```

### Screen Reader Tests
```typescript
test('has proper ARIA labels', () => {
  render(<ComponentName title="Test" items={mockItems} />);

  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveAttribute('aria-labelledby');

  const closeButton = screen.getByLabelText('Close');
  expect(closeButton).toBeInTheDocument();
});
```

### Color Contrast Tests
```typescript
test('meets WCAG color contrast requirements', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Use axe-core for automated accessibility testing
  const results = await axeCheck(page);
  expect(results.violations).toHaveLength(0);
});
```

## Test Data

### Fixtures
```python
# conftest.py
import pytest

@pytest.fixture
def sample_task():
    return {
        "title": "Test Task",
        "description": "Test Description",
        "priority": "high",
        "status": "pending"
    }

@pytest.fixture
def sample_user():
    return {
        "username": "testuser",
        "email": "test@example.com",
        "password": "SecurePass123"
    }

@pytest.fixture
def auth_headers(client, sample_user):
    # Create user and login
    client.post("/api/auth/register", json=sample_user)
    response = client.post("/api/auth/login", json={
        "username": sample_user["username"],
        "password": sample_user["password"]
    })
    token = response.json()["token"]

    return {"Authorization": f"Bearer {token}"}
```

### Mocks
```typescript
// mockData.ts
export const mockItems = [
  { id: '1', label: 'Item 1', value: 'value1' },
  { id: '2', label: 'Item 2', value: 'value2', disabled: true },
  { id: '3', label: 'Item 3', value: 'value3' },
];

export const mockUser = {
  id: 'user-1',
  username: 'testuser',
  email: 'test@example.com',
};
```

## Test Execution

### Run All Tests
```bash
# Backend
pytest

# Frontend
npm test

# E2E
npx playwright test
```

### Run Specific Tests
```bash
# Backend: Single file
pytest tests/test_tasks.py

# Backend: Single test
pytest tests/test_tasks.py::test_create_task

# Frontend: Watch mode
npm test -- --watch

# E2E: Specific browser
npx playwright test --project=chromium
```

### Coverage Report
```bash
# Backend
pytest --cov=src --cov-report=html

# Frontend
npm test -- --coverage
```

## Continuous Integration

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          pytest
          npm test
          npx playwright test
```

## Success Criteria

- [ ] All tests passing
- [ ] Code coverage ≥ 80%
- [ ] No critical accessibility violations
- [ ] Performance benchmarks met
- [ ] Security tests passing
- [ ] CI/CD pipeline green

## Change Log

| Date | Changes |
|------|---------|
| 2025-01-26 | Initial test specification |
| | |

---

**Template Version**: 1.0
**Last Updated**: 2025-01-26
**Usage**: `@skills/templates/test-template.md`
