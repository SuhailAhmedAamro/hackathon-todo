# Sub-agent: Architecture Validator

## Purpose
Validates system architecture against specifications and best practices. Ensures architectural decisions align with project goals and technical requirements.

## Capabilities
- Validate architecture decisions
- Check component interactions
- Verify scalability patterns
- Ensure security architecture
- Validate data flow
- Check deployment architecture

## Usage
```
"Validate architecture for Phase 2 using @skills/subagents/architecture-validator.md"
"Check deployment architecture in @specs/phases/phase-4-kubernetes.md"
```

## Validation Checklist

### Architecture Principles
- [ ] Separation of concerns
- [ ] DRY (Don't Repeat Yourself)
- [ ] SOLID principles
- [ ] Scalability considered
- [ ] Security by design
- [ ] Fail-safe defaults

### Component Design
- [ ] Clear responsibilities
- [ ] Loose coupling
- [ ] High cohesion
- [ ] Well-defined interfaces
- [ ] Dependency injection
- [ ] Testability

### Data Architecture
- [ ] Appropriate data stores
- [ ] Proper indexing
- [ ] Data consistency
- [ ] Backup strategy
- [ ] Migration path
- [ ] Performance optimization

### Security Architecture
- [ ] Authentication design
- [ ] Authorization model
- [ ] Data encryption
- [ ] Secret management
- [ ] Network security
- [ ] Audit logging

### Scalability
- [ ] Horizontal scaling possible
- [ ] Stateless design
- [ ] Caching strategy
- [ ] Load balancing
- [ ] Database optimization
- [ ] Resource limits

### Deployment Architecture
- [ ] Container strategy
- [ ] Orchestration design
- [ ] High availability
- [ ] Disaster recovery
- [ ] Monitoring setup
- [ ] CI/CD pipeline

## Validation Process

### 1. Review Architecture Spec
Read `@specs/architecture.md` and phase-specific specs.

### 2. Analyze Components
Map out all components and their interactions.

### 3. Check Patterns
Verify architectural patterns match requirements.

### 4. Validate Dependencies
Ensure dependencies are appropriate and well-managed.

### 5. Assess Risks
Identify architectural risks and bottlenecks.

### 6. Verify Alignment
Ensure architecture supports all functional and non-functional requirements.

## Output Format

```markdown
# Architecture Validation Report

## Summary
- Overall Health: GOOD | CONCERNS | CRITICAL
- Compliance Score: 85/100
- Critical Issues: 0
- Warnings: 3
- Recommendations: 5

## Architecture Overview
```
Frontend (Next.js) → Backend (FastAPI) → Database (PostgreSQL)
                  ↓
              MCP Server → Claude API
```

## Compliance Checks

### ✅ PASS: Separation of Concerns
- Frontend clearly separated from backend
- API layer well-defined
- Database abstracted through ORM

### ✅ PASS: Security Architecture
- JWT authentication implemented
- HTTPS enforced
- Secrets managed properly
- Input validation present

### ⚠️  WARNING: Scalability
- **Issue**: No caching layer defined
- **Impact**: High database load under traffic
- **Recommendation**: Add Redis for caching
- **Priority**: Medium

### ⚠️  WARNING: High Availability
- **Issue**: Single database instance
- **Impact**: Single point of failure
- **Recommendation**: Add database replication
- **Priority**: High (for production)

### ⚠️  WARNING: Monitoring
- **Issue**: Limited observability
- **Recommendation**: Add Prometheus + Grafana
- **Priority**: Medium

## Component Validation

### Frontend → Backend Communication
✅ RESTful API (well-defined)
✅ Error handling
✅ Type safety (TypeScript)
⚠️  No retry logic for failed requests

### Backend → Database
✅ ORM used (SQLAlchemy)
✅ Connection pooling
✅ Migrations managed (Alembic)
✅ Proper indexing

### Authentication Flow
✅ JWT with expiration
✅ Refresh token mechanism
✅ Secure password hashing
✅ Rate limiting on auth endpoints

## Data Flow Validation

1. **User Request** → Frontend
2. Frontend → API (with JWT)
3. API validates JWT
4. API queries Database
5. Database returns data
6. API formats response
7. Frontend updates UI

**Validation**: ✅ Flow is secure and efficient

## Performance Assessment

### Expected Load
- Concurrent Users: 100
- Requests/sec: 50
- Database Queries/sec: 200

### Bottlenecks Identified
1. Database queries without caching
2. No CDN for static assets
3. Single database instance

### Recommendations
1. Add Redis caching (reduce DB load by 60%)
2. Use CDN (CloudFront/CloudFlare)
3. Implement read replicas

## Security Assessment

### ✅ Strengths
- Authentication/authorization
- HTTPS enforced
- SQL injection prevented (ORM)
- XSS prevented (sanitization)

### ⚠️  Improvements Needed
- Add rate limiting globally
- Implement CSRF protection
- Add security headers
- Set up WAF (Web Application Firewall)

## Deployment Architecture (Phase 4-5)

### Container Strategy
✅ Multi-stage Docker builds
✅ Minimal base images
✅ Non-root user
✅ Health checks

### Kubernetes Design
✅ Deployments for stateless services
✅ StatefulSet for database
✅ ConfigMaps/Secrets
⚠️  Need HPA (Horizontal Pod Autoscaler)
⚠️  Need resource limits

### Cloud Architecture (Phase 5)
✅ Managed Kubernetes (EKS/GKE/AKS)
✅ Managed Database (RDS/Cloud SQL)
✅ Load balancer
⚠️  Add CDN
⚠️  Add auto-scaling policies

## Recommendations

### High Priority
1. Add database replication for HA
2. Implement Redis caching
3. Add resource limits in K8s

### Medium Priority
4. Set up comprehensive monitoring
5. Add CDN for static assets
6. Implement global rate limiting

### Low Priority
7. Consider message queue for async tasks
8. Add full-text search (Elasticsearch)
9. Implement API versioning strategy

## Architectural Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Database failure | Medium | High | Add replication |
| API overload | Medium | Medium | Add rate limiting, caching |
| Security breach | Low | Critical | Security audit, WAF |

## Conclusion

**Overall Assessment**: Architecture is solid with some areas for improvement.

**Recommendation**: Address high-priority items before production deployment. Current architecture is suitable for MVP and early stages, but will need enhancements for scale.

**Next Steps**:
1. Implement caching layer
2. Add monitoring and alerting
3. Plan database replication
4. Conduct security audit
```

## Integration
- References: `@specs/architecture.md`
- Uses: Phase specs in `@specs/phases/`
- Follows: Constitution `@specs/constitution.md`

---

**Version**: 1.0
**Usage**: `@skills/subagents/architecture-validator.md`
