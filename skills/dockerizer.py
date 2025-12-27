#!/usr/bin/env python3
"""
Dockerizer - Automated Docker Image Creation
Generates optimized Dockerfiles for Evolution of Todo phases.
"""

from pathlib import Path
from typing import Literal

PhaseType = Literal["frontend", "backend", "mcp"]


def generate_dockerfile(phase: PhaseType, output_path: Path) -> None:
    """Generate Dockerfile for specified phase."""
    dockerfiles = {
        "frontend": """# Evolution Todo - Frontend Dockerfile
# Multi-stage build for Next.js application

FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set correct permissions
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
""",
        "backend": """# Evolution Todo - Backend Dockerfile
# Multi-stage build for FastAPI application

FROM python:3.11-slim AS base

# Set environment variables
ENV PYTHONUNBUFFERED=1 \\
    PYTHONDONTWRITEBYTECODE=1 \\
    PIP_NO_CACHE_DIR=1 \\
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install dependencies
FROM base AS deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production image
FROM base AS runner

# Create non-root user
RUN useradd -m -u 1001 appuser

# Copy dependencies from deps stage
COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin

# Copy application code
COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \\
    CMD python -c "import requests; requests.get('http://localhost:8000/health')"

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
""",
        "mcp": """# Evolution Todo - MCP Server Dockerfile
# Multi-stage build for MCP server

FROM python:3.11-slim AS base

ENV PYTHONUNBUFFERED=1 \\
    PYTHONDONTWRITEBYTECODE=1 \\
    PIP_NO_CACHE_DIR=1

WORKDIR /app

FROM base AS deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM base AS runner

RUN useradd -m -u 1001 appuser

COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=deps /usr/local/bin /usr/local/bin

COPY --chown=appuser:appuser . .

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \\
    CMD python -c "import requests; requests.get('http://localhost:3000/health')"

CMD ["python", "src/server.py"]
""",
    }

    dockerfile_content = dockerfiles.get(phase)
    if not dockerfile_content:
        raise ValueError(f"Unknown phase: {phase}")

    output_path.write_text(dockerfile_content)
    print(f"✅ Generated Dockerfile for {phase} at {output_path}")


def generate_dockerignore(output_path: Path) -> None:
    """Generate .dockerignore file."""
    dockerignore_content = """# Python
__pycache__
*.pyc
*.pyo
*.pyd
.Python
*.so
*.egg
*.egg-info
dist
build
.pytest_cache
.coverage
htmlcov

# Node
node_modules
.next
npm-debug.log*

# Environment
.env
.env.*
!.env.example

# IDE
.vscode
.idea
*.swp
*.swo

# Git
.git
.gitignore

# Docs
*.md
!README.md

# Tests
tests
*.test.js
*.test.ts
*.test.tsx

# CI/CD
.github
.gitlab-ci.yml

# Other
.DS_Store
Thumbs.db
"""
    output_path.write_text(dockerignore_content)
    print(f"✅ Generated .dockerignore at {output_path}")


def main():
    """Main function to generate all Dockerfiles."""
    import argparse

    parser = argparse.ArgumentParser(description="Generate Dockerfiles for Evolution of Todo")
    parser.add_argument(
        "phase",
        choices=["frontend", "backend", "mcp", "all"],
        help="Phase to generate Dockerfile for",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("."),
        help="Output directory for Dockerfile",
    )

    args = parser.parse_args()

    if args.phase == "all":
        for phase_type in ["frontend", "backend", "mcp"]:
            output_file = args.output_dir / f"Dockerfile.{phase_type}"
            generate_dockerfile(phase_type, output_file)  # type: ignore
        generate_dockerignore(args.output_dir / ".dockerignore")
    else:
        output_file = args.output_dir / "Dockerfile"
        generate_dockerfile(args.phase, output_file)  # type: ignore
        generate_dockerignore(args.output_dir / ".dockerignore")


if __name__ == "__main__":
    main()
