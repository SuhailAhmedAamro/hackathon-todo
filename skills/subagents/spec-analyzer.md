# Sub-agent: Spec Analyzer

## Purpose
Analyzes and validates specifications for completeness, consistency, and quality. Ensures specs follow Spec-Kit conventions and are ready for implementation.

## Capabilities
- Validate spec completeness
- Check cross-references
- Ensure consistency
- Identify missing sections
- Verify phase applicability
- Generate quality report

## Usage
```
"Analyze spec at @specs/features/task-crud.md using @skills/subagents/spec-analyzer.md"
"Validate all specs in @specs/features/ using @skills/subagents/spec-analyzer.md"
```

## Analysis Checklist

### Structure Validation
- [ ] Title present and descriptive
- [ ] Overview/Purpose section exists
- [ ] All required sections present
- [ ] Proper Markdown formatting
- [ ] Consistent heading levels

### Content Validation
- [ ] Clear, unambiguous language
- [ ] Examples provided
- [ ] Edge cases documented
- [ ] Error conditions specified
- [ ] Success criteria defined
- [ ] Testing requirements specified

### Consistency Checks
- [ ] Terminology matches other specs
- [ ] Formatting follows standards
- [ ] Cross-references use @ syntax
- [ ] Phase markers consistent
- [ ] Data types match across specs

### Completeness Checks
- [ ] User stories (for features)
- [ ] Acceptance criteria
- [ ] Functional requirements
- [ ] Non-functional requirements
- [ ] Dependencies listed
- [ ] Related specs linked

## Validation Process

### 1. Read Spec
Load and parse the specification file.

### 2. Check Structure
Verify all required sections are present based on spec type.

### 3. Validate Content
Ensure each section has meaningful content, not just placeholders.

### 4. Verify Cross-References
Check that all `@` references point to existing files.

### 5. Ensure Consistency
Compare with related specs for consistent terminology and data structures.

### 6. Generate Report
Output findings with severity levels (Error, Warning, Info).

## Output Format

```markdown
# Spec Analysis Report: [spec-name]

## Summary
- Status: PASS | FAIL | WARNINGS
- Total Issues: X
- Errors: X
- Warnings: X
- Info: X

## Errors (Must Fix)
1. Missing required section: "Acceptance Criteria"
2. Invalid cross-reference: @specs/nonexistent.md
3. Phase applicability not marked

## Warnings (Should Fix)
1. No examples provided
2. Success criteria not measurable
3. Missing test requirements

## Info (Nice to Have)
1. Could add more detail to edge cases
2. Consider adding diagrams

## Cross-Reference Validation
✅ @specs/api/rest-endpoints.md - Valid
✅ @specs/database/schema.md - Valid
❌ @specs/ui/missing.md - File not found

## Recommendations
1. Add examples in "Functional Requirements" section
2. Make success criteria measurable (add metrics)
3. Link to test specification
```

## Integration
- Called by: Developers before implementation
- Uses: Spec templates from `@.spec-kit/prompts/`
- References: Constitution `@specs/constitution.md`

---

**Version**: 1.0
**Usage**: `@skills/subagents/spec-analyzer.md`
