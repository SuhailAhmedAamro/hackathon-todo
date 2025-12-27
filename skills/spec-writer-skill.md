# Skill: Spec Writer - Automated Specification Generation

## Purpose
Automates the creation of comprehensive, consistent Markdown specifications following Spec-Kit conventions. This skill enables rapid generation of feature specs, API specs, database schemas, and UI component documentation.

## Capabilities
- Generate feature specifications from user stories
- Create API endpoint documentation with examples
- Define database schemas with migrations
- Document UI components with props and states
- Ensure consistency across all specs
- Auto-generate cross-references
- Validate spec completeness

## Usage

### Command Syntax
```
"Write a feature spec for [feature name] using @skills/spec-writer-skill.md"
"Generate API spec for [endpoint] using @skills/spec-writer-skill.md"
"Create database schema spec using @skills/spec-writer-skill.md"
```

### Input Format
```yaml
type: feature|api|database|ui
name: "Feature/Component Name"
description: "What this does"
requirements:
  - "Requirement 1"
  - "Requirement 2"
phase: [1, 2, 3, 4, 5]  # Which phases this applies to
```

### Output Format
Complete Markdown specification following Spec-Kit templates in `/specs/` directory.

## Templates Used
- Feature: `@.spec-kit/prompts/feature-spec-template.md`
- API: `@.spec-kit/prompts/api-spec-template.md`
- Database: `@.spec-kit/prompts/database-spec-template.md`
- UI: `@.spec-kit/prompts/ui-spec-template.md`

## Generation Process

### Step 1: Analyze Requirements
```markdown
1. Parse user input or existing documentation
2. Identify spec type (feature/api/database/ui)
3. Extract key requirements
4. Determine phase applicability
5. Identify dependencies and cross-references
```

### Step 2: Select Template
```markdown
Based on spec type:
- Feature → feature-spec-template.md
- API → api-spec-template.md
- Database → database-spec-template.md
- UI → ui-spec-template.md
```

### Step 3: Populate Sections
```markdown
Required sections for ALL specs:
1. Overview/Purpose
2. Requirements/Specifications
3. Examples
4. Phase Applicability
5. Related Specs (cross-references)
6. Testing Requirements
7. Success Criteria
```

### Step 4: Generate Cross-References
```markdown
Auto-link to related specs:
- Features → API + Database + UI
- API → Features + Database
- Database → Features + API
- UI → Features + API
```

### Step 5: Validate Completeness
```markdown
Checklist:
- [ ] All required sections present
- [ ] Examples included
- [ ] Phase applicability marked
- [ ] Cross-references added
- [ ] Acceptance criteria defined
- [ ] Testing requirements specified
```

## Examples

### Example 1: Generate Feature Spec
**Input:**
```yaml
type: feature
name: "Task Filtering"
description: "Filter tasks by status, priority, and tags"
requirements:
  - "Filter by status (pending/in_progress/completed)"
  - "Filter by priority (low/medium/high)"
  - "Filter by multiple tags"
  - "Combine multiple filters"
phase: [2, 3, 4, 5]
```

**Command:**
```
"Create a feature spec for task filtering with multi-criteria support using @skills/spec-writer-skill.md"
```

**Output:** `specs/features/task-filtering.md`
```markdown
# Feature: Task Filtering

## Overview
Enable users to filter tasks by multiple criteria including status, priority, and tags.

## User Stories
As a user, I want to filter tasks by status so that I can focus on pending work.
As a user, I want to combine multiple filters so I can find exactly what I need.

## Functional Requirements
### Filter by Status
- Support: pending, in_progress, completed
- UI: Dropdown or button group
- API: Query parameter ?status=pending

### Filter by Priority
- Support: low, medium, high
- UI: Dropdown or button group
- API: Query parameter ?priority=high

### Filter by Tags
- Support: Multiple tag selection
- UI: Tag picker with checkboxes
- API: Query parameter ?tags=work,urgent

### Combine Filters
- All filters can be combined
- Results match ALL criteria (AND logic)
- Example: ?status=pending&priority=high&tags=urgent

## Acceptance Criteria
- [ ] Can filter by each criterion individually
- [ ] Can combine multiple filters
- [ ] Filter state persists in URL
- [ ] Clear filters button resets all
- [ ] Results update immediately

## API Integration
See `@specs/api/rest-endpoints.md` - GET /tasks endpoint

## Database Requirements
See `@specs/database/schema.md` - Indexed columns for filtering

## UI Requirements
See `@specs/ui/components.md` - FilterBar component

## Phase Applicability
- [ ] Phase 1: Console (basic filtering via CLI flags)
- [x] Phase 2: Web (full UI filtering)
- [x] Phase 3: Chatbot (natural language filtering)
- [x] Phase 4-5: Same as Phase 2

## Testing
- Unit: Filter logic functions
- Integration: API filtering
- E2E: Filter UI interactions

## Success Metrics
- Filter response time < 100ms
- All filter combinations work correctly
```

### Example 2: Generate API Spec
**Input:**
```yaml
type: api
name: "Task Filtering Endpoint"
endpoint: "GET /api/tasks"
description: "List tasks with filtering support"
```

**Command:**
```
"Create API spec for task filtering endpoint using @skills/spec-writer-skill.md"
```

**Output:** Added to `specs/api/rest-endpoints.md`
```markdown
### GET /tasks (with filters)
**Description**: List tasks with optional filtering

**Query Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | No | Filter by status (pending/in_progress/completed) |
| priority | string | No | Filter by priority (low/medium/high) |
| tags | string | No | Comma-separated tag IDs |
| page | integer | No | Page number (default: 1) |
| per_page | integer | No | Items per page (default: 20) |

**Request Example**:
```bash
GET /api/tasks?status=pending&priority=high&tags=work,urgent&page=1
```

**Response (200)**:
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "Review code",
      "status": "pending",
      "priority": "high",
      "tags": [
        {"id": "tag1", "name": "work"},
        {"id": "tag2", "name": "urgent"}
      ]
    }
  ],
  "total": 15,
  "page": 1,
  "pages": 1,
  "filters_applied": {
    "status": "pending",
    "priority": "high",
    "tags": ["work", "urgent"]
  }
}
```

**Error Responses**:
- 400: Invalid filter value
- 401: Unauthorized
```

### Example 3: Generate Database Schema
**Command:**
```
"Add indexes for task filtering to database schema using @skills/spec-writer-skill.md"
```

**Output:** Added to `specs/database/schema.md`
```sql
-- Indexes for efficient filtering
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_user_priority ON tasks(user_id, priority);
CREATE INDEX idx_task_tags_composite ON task_tags(task_id, tag_id);
```

## Spec Quality Checklist

### Completeness
- [ ] All sections from template filled
- [ ] Examples provided
- [ ] Edge cases documented
- [ ] Error conditions specified

### Consistency
- [ ] Terminology matches other specs
- [ ] Formatting follows standards
- [ ] Cross-references use @ syntax
- [ ] Phase markers consistent

### Clarity
- [ ] Clear, unambiguous language
- [ ] Technical terms defined
- [ ] Assumptions stated
- [ ] Success criteria measurable

### Traceability
- [ ] Links to related specs
- [ ] References implementation files
- [ ] Maps to user stories
- [ ] Connects to tests

## Dependencies
- Templates: `@.spec-kit/prompts/*.md`
- Configuration: `@.spec-kit/config.yaml`
- Existing specs: `@specs/`
- Constitution: `@specs/constitution.md`

## Best Practices

### 1. Always Include Examples
Every spec must have concrete examples:
- API specs: Request/response examples
- Database specs: Sample queries
- Feature specs: User scenarios
- UI specs: Component usage

### 2. Cross-Reference Extensively
Link related specs:
```markdown
## Related Specs
- Feature: `@specs/features/task-crud.md`
- API: `@specs/api/rest-endpoints.md`
- Database: `@specs/database/schema.md`
- UI: `@specs/ui/components.md`
```

### 3. Mark Phase Applicability
Always indicate which phases use this spec:
```markdown
## Phase Applicability
- [x] Phase 1: Console
- [x] Phase 2: Web
- [ ] Phase 3: Chatbot (not applicable)
- [x] Phase 4-5
```

### 4. Define Success Criteria
Make criteria measurable:
```markdown
## Success Criteria
- [ ] Response time < 200ms (p95)
- [ ] Code coverage ≥ 80%
- [ ] All acceptance criteria met
- [ ] Zero critical bugs
```

### 5. Version and Update
Track changes:
```markdown
## Change Log
| Date | Version | Changes |
|------|---------|---------|
| 2025-01-26 | 1.0.0 | Initial spec |
| 2025-01-27 | 1.1.0 | Added filtering support |
```

## Integration with Development

### Spec → Code Workflow
```
1. Write spec using this skill
2. Review spec for completeness
3. Generate code using @skills/subagents/code-generator.md
4. Validate implementation against spec
5. Update spec if implementation diverges
```

### Automated Validation
Use `@skills/subagents/spec-analyzer.md` to:
- Check spec completeness
- Validate cross-references
- Ensure consistency
- Find missing sections

## Output Locations

| Spec Type | Output Directory |
|-----------|------------------|
| Feature | `specs/features/` |
| API | `specs/api/` |
| Database | `specs/database/` |
| UI | `specs/ui/` |
| Phase | `specs/phases/` |

## Success Metrics
- Spec generation time < 5 minutes
- 100% template compliance
- All cross-references valid
- Zero missing required sections
- Specs pass validation (@skills/subagents/spec-analyzer.md)

## Notes for Claude Code
When using this skill:
1. Always read the template first
2. Gather all requirements before generating
3. Generate complete spec in one pass
4. Validate against checklist
5. Create cross-references
6. Save to correct directory
7. Update related specs if needed
