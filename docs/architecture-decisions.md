# Architecture Decision Records (ADRs)

## ADR-001: Choose FastAPI over Flask/Django

**Status:** Accepted

**Context:**
Need to choose Python web framework for backend API.

**Decision:**
Use FastAPI.

**Rationale:**
- Modern async support (better performance)
- Automatic API documentation (OpenAPI/Swagger)
- Type hints and Pydantic validation
- Excellent developer experience
- Active community

**Alternatives Considered:**
- Flask: More mature but lacks async and auto-documentation
- Django: Too heavy for API-only backend

---

## ADR-002: Choose PostgreSQL over MySQL

**Status:** Accepted

**Context:**
Need production-grade relational database.

**Decision:**
Use PostgreSQL.

**Rationale:**
- Superior JSON support (JSONB)
- Better for complex queries
- Excellent full-text search
- Strong ACID compliance
- Better cloud provider support

**Alternatives Considered:**
- MySQL: Good but less feature-rich
- MongoDB: NoSQL not needed for structured data

---

## ADR-003: Choose Next.js over Create React App

**Status:** Accepted

**Context:**
Need React framework for frontend.

**Decision:**
Use Next.js 14 with App Router.

**Rationale:**
- Server-side rendering (SSR) for better SEO
- API routes for backend-for-frontend
- Built-in routing
- Image optimization
- Strong TypeScript support
- Vercel deployment optimized

**Alternatives Considered:**
- Create React App: Deprecated by React team
- Vite + React Router: More configuration needed

---

## ADR-004: Use JWT for Authentication

**Status:** Accepted

**Context:**
Need stateless authentication for API.

**Decision:**
Use JWT tokens with httpOnly cookies.

**Rationale:**
- Stateless (scales horizontally)
- Industry standard
- Works well with microservices
- No session storage needed

**Security Measures:**
- Short expiration (30 min)
- Refresh tokens (7 days)
- httpOnly cookies prevent XSS
- CSRF protection

**Alternatives Considered:**
- Session-based: Requires state storage
- OAuth: Overkill for our use case

---

## ADR-005: Use MCP for Chatbot Integration

**Status:** Accepted

**Context:**
Need protocol for Claude AI integration.

**Decision:**
Use Model Context Protocol (MCP).

**Rationale:**
- Standard protocol from Anthropic
- Tool-based architecture
- Extensible and maintainable
- Good documentation

**Alternatives Considered:**
- Direct API calls: Less structured
- LangChain: More complex than needed

---

## ADR-006: Use Kubernetes for Orchestration

**Status:** Accepted

**Context:**
Need container orchestration for Phase 4.

**Decision:**
Use Kubernetes with Helm charts.

**Rationale:**
- Industry standard
- Excellent for learning
- Cloud provider support (EKS/GKE/AKS)
- Rich ecosystem

**Alternatives Considered:**
- Docker Swarm: Less popular, limited features
- Nomad: Smaller ecosystem

---

## ADR-007: Use Terraform for Infrastructure as Code

**Status:** Accepted

**Context:**
Need IaC tool for cloud deployment.

**Decision:**
Use Terraform.

**Rationale:**
- Cloud-agnostic (works with AWS/GCP/Azure)
- Declarative syntax
- Large community
- Good documentation
- State management

**Alternatives Considered:**
- CloudFormation: AWS-only
- Pulumi: Less mature
- CDK: More complex

---

## ADR-008: Monorepo vs Multi-repo

**Status:** Accepted

**Decision:**
Use monorepo structure.

**Rationale:**
- All phases in one place
- Easier to share code (/skills/)
- Simpler for learning
- Single git history

**Trade-offs:**
- Larger repository size
- All phases bundled together
- But: Benefits outweigh drawbacks for educational project

---

## ADR-009: Use Tailwind CSS for Styling

**Status:** Accepted

**Context:**
Need CSS framework for frontend.

**Decision:**
Use Tailwind CSS.

**Rationale:**
- Utility-first approach
- Excellent Next.js integration
- Rapid development
- Customizable
- Small production bundle

**Alternatives Considered:**
- Bootstrap: Less flexible
- Material-UI: Opinionated design
- Styled Components: More verbose

---

## ADR-010: Progressive Enhancement Approach

**Status:** Accepted

**Context:**
How to structure the 5 phases.

**Decision:**
Each phase builds on previous, with code reuse via /skills/.

**Rationale:**
- Demonstrates evolution of architecture
- Maximizes learning
- Shows real-world progression
- Reusable patterns

**Implementation:**
- Phase 1: Foundation (models, patterns)
- Phase 2: Expands to web
- Phase 3: Adds AI
- Phase 4: Adds orchestration
- Phase 5: Adds cloud

This approach teaches not just technologies, but architectural evolution.
