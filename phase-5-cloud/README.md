# Phase 5: Cloud-Native Deployment (AWS)

Deploy the Evolution Todo application to AWS using Infrastructure as Code with Terraform, managed Kubernetes (EKS), and CI/CD pipelines.

## Architecture

```
                          ┌─────────────────────────────────┐
                          │         Route 53 (DNS)          │
                          └───────────────┬─────────────────┘
                                          │
                          ┌───────────────▼─────────────────┐
                          │     CloudFront (CDN) [Future]   │
                          └───────────────┬─────────────────┘
                                          │
                          ┌───────────────▼─────────────────┐
                          │  Application Load Balancer (ALB)│
                          └───────────────┬─────────────────┘
                                          │
┌─────────────────────────────────────────┼─────────────────────────────────────────┐
│                                   VPC   │                                         │
│  ┌──────────────────────────────────────┼──────────────────────────────────────┐  │
│  │                              EKS Cluster                                    │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                         │  │
│  │  │  Frontend   │  │   Backend   │  │     MCP     │                         │  │
│  │  │  (Next.js)  │  │  (FastAPI)  │  │  (Chatbot)  │                         │  │
│  │  │  3 replicas │  │  3 replicas │  │  2 replicas │                         │  │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                         │  │
│  │         │                │                │                                 │  │
│  └─────────┼────────────────┼────────────────┼─────────────────────────────────┘  │
│            │                │                │                                    │
│            │         ┌──────▼────────────────▼──────┐                            │
│            │         │  RDS PostgreSQL (Multi-AZ)   │                            │
│            │         │  - Encrypted at rest         │                            │
│            │         │  - Automated backups         │                            │
│            │         └──────────────────────────────┘                            │
│            │                                                                      │
│            │         ┌──────────────────────────────┐                            │
│            └─────────│  S3 (Static Assets)          │                            │
│                      └──────────────────────────────┘                            │
└───────────────────────────────────────────────────────────────────────────────────┘

                       ┌──────────────────────────────┐
                       │  ECR (Container Registry)    │
                       └──────────────────────────────┘

                       ┌──────────────────────────────┐
                       │  CloudWatch (Monitoring)     │
                       │  - Logs, Metrics, Alarms     │
                       └──────────────────────────────┘

                       ┌──────────────────────────────┐
                       │  Secrets Manager             │
                       │  - DB credentials            │
                       │  - API keys                  │
                       └──────────────────────────────┘
```

## Prerequisites

- **AWS Account** with appropriate permissions
- **AWS CLI** v2 configured with credentials
- **Terraform** >= 1.5.0
- **kubectl** >= 1.28
- **Helm** >= 3.12
- **Docker** for building images

## Project Structure

```
phase-5-cloud/
├── terraform/
│   ├── main.tf                 # Main configuration
│   ├── variables.tf            # Input variables
│   ├── outputs.tf              # Output values
│   ├── versions.tf             # Provider versions
│   ├── modules/
│   │   ├── networking/         # VPC, Subnets, NAT, IGW
│   │   ├── eks/                # EKS Cluster, Node Groups
│   │   ├── rds/                # PostgreSQL Database
│   │   ├── s3/                 # Static Assets Bucket
│   │   ├── ecr/                # Container Registry
│   │   └── monitoring/         # CloudWatch, Alarms
│   └── environments/
│       ├── dev/terraform.tfvars
│       ├── staging/terraform.tfvars
│       └── prod/terraform.tfvars
├── .github/
│   └── workflows/
│       ├── ci.yml              # Test, lint, build
│       ├── deploy.yml          # Deploy to EKS
│       └── terraform.yml       # Infrastructure changes
├── scripts/
│   ├── setup-terraform-backend.sh
│   ├── deploy-infrastructure.sh
│   ├── deploy-application.sh
│   └── destroy.sh
├── CLAUDE.md
└── README.md
```

## Quick Start

### 1. Setup Terraform Backend

Run once to create S3 bucket and DynamoDB table for state management:

```bash
./scripts/setup-terraform-backend.sh
```

### 2. Configure Variables

Edit the environment file for your target environment:

```bash
# For development
vim terraform/environments/dev/terraform.tfvars
```

Set the database password:
```bash
export TF_VAR_db_password="your-secure-password"
```

### 3. Deploy Infrastructure

```bash
# Plan (review changes)
./scripts/deploy-infrastructure.sh -e dev -a plan

# Apply (create resources)
./scripts/deploy-infrastructure.sh -e dev -a apply
```

### 4. Deploy Application

```bash
./scripts/deploy-application.sh dev latest
```

## Terraform Modules

### Networking Module
- VPC with configurable CIDR
- Public subnets (3 AZs) for load balancers
- Private subnets (3 AZs) for EKS nodes
- Database subnets (3 AZs) for RDS
- NAT Gateway (single or per-AZ)
- VPC Endpoints for S3 and ECR

### EKS Module
- Managed Kubernetes cluster
- Managed node groups with auto-scaling
- OIDC provider for IAM roles (IRSA)
- Cluster Autoscaler IAM role
- AWS Load Balancer Controller IAM role
- CloudWatch logging

### RDS Module
- PostgreSQL 15 with Multi-AZ option
- Encrypted storage (AES-256)
- Automated backups
- Performance Insights
- Enhanced monitoring
- Secrets Manager integration

### S3 Module
- Encrypted bucket for static assets
- Versioning enabled
- Lifecycle rules for cost optimization
- CORS configuration

### ECR Module
- Container repositories (frontend, backend, mcp)
- Image scanning on push
- Lifecycle policies for cleanup

### Monitoring Module
- CloudWatch log groups
- CloudWatch alarms (CPU, memory, storage)
- SNS topic for alerts
- CloudWatch dashboard
- AWS Budget alerts

## Environment Configuration

### Development (dev)
- Single NAT Gateway (cost saving)
- `t3.medium` nodes (2-3 replicas)
- `db.t3.micro` RDS
- 7-day log retention
- No deletion protection

### Staging
- Single NAT Gateway
- `t3.medium/large` nodes (2-5 replicas)
- `db.t3.small` RDS
- 14-day log retention
- Deletion protection enabled

### Production (prod)
- NAT Gateway per AZ (HA)
- `t3.large/xlarge` nodes (3-10 replicas)
- `db.t3.medium` RDS with Multi-AZ
- 90-day log retention
- Full deletion protection

## CI/CD Pipelines

### CI Pipeline (ci.yml)
Runs on every push/PR:
- Backend tests (pytest)
- Frontend tests (jest)
- MCP server tests
- Security scan (Trivy)
- Terraform validation

### Deploy Pipeline (deploy.yml)
Triggered on main branch or manual dispatch:
- Build Docker images
- Push to ECR
- Deploy to EKS with Helm
- Verify deployment

### Terraform Pipeline (terraform.yml)
For infrastructure changes:
- Format check
- Validate configuration
- Plan (with PR comment)
- Apply (manual approval for prod)

## GitHub Secrets Required

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |
| `DB_PASSWORD` | Database password |

## Manual Deployment

### Deploy Infrastructure

```bash
cd terraform

# Initialize with backend
terraform init \
  -backend-config="bucket=evolution-todo-terraform-state" \
  -backend-config="key=dev/terraform.tfstate" \
  -backend-config="region=us-east-1" \
  -backend-config="dynamodb_table=evolution-todo-terraform-locks"

# Plan
terraform plan -var-file=environments/dev/terraform.tfvars

# Apply
terraform apply -var-file=environments/dev/terraform.tfvars
```

### Configure kubectl

```bash
aws eks update-kubeconfig \
  --name evolution-todo-dev-cluster \
  --region us-east-1
```

### Deploy Application

```bash
# Build and push images
./scripts/deploy-application.sh dev latest

# Or deploy with Helm directly
helm upgrade --install evolution-todo \
  ../phase-4-kubernetes/helm/evolution-todo \
  --namespace evolution-todo-dev \
  --create-namespace
```

## Cost Optimization

### Implemented Strategies
- Single NAT Gateway option for non-prod
- VPC Endpoints to reduce data transfer
- S3 lifecycle rules
- ECR lifecycle policies
- Right-sized instances per environment
- Budget alerts

### Estimated Monthly Costs

| Resource | Dev | Staging | Prod |
|----------|-----|---------|------|
| EKS Cluster | $73 | $73 | $73 |
| EC2 (nodes) | ~$60 | ~$120 | ~$300 |
| RDS | ~$15 | ~$30 | ~$100 |
| NAT Gateway | ~$32 | ~$32 | ~$96 |
| Load Balancer | ~$20 | ~$20 | ~$20 |
| S3/ECR | ~$5 | ~$10 | ~$20 |
| **Total** | ~$205 | ~$285 | ~$609 |

*Estimates vary based on usage*

## Monitoring & Observability

### CloudWatch Dashboard
Access via AWS Console or:
```bash
aws cloudwatch get-dashboard --dashboard-name evolution-todo-dev-dashboard
```

### View Logs
```bash
# EKS cluster logs
aws logs tail /aws/eks/evolution-todo-dev-cluster/cluster --follow

# Application logs
kubectl logs -f deployment/backend -n evolution-todo-dev
```

### Alarms
Configured alarms for:
- High CPU (> 80%)
- High memory (> 80%)
- RDS connections (> 100)
- Low storage (< 5GB)

## Cleanup

### Destroy All Resources

```bash
# Remove application first
helm uninstall evolution-todo -n evolution-todo-dev

# Destroy infrastructure
./scripts/destroy.sh dev
```

**Warning**: Production requires typing `destroy-production` to confirm.

## Troubleshooting

### EKS Connection Issues
```bash
# Verify cluster is running
aws eks describe-cluster --name evolution-todo-dev-cluster

# Update kubeconfig
aws eks update-kubeconfig --name evolution-todo-dev-cluster
```

### RDS Connection Issues
```bash
# Check security groups
aws ec2 describe-security-groups --group-ids <rds-sg-id>

# Test from EKS pod
kubectl run -it --rm debug --image=postgres:15 -- psql -h <rds-endpoint>
```

### Image Pull Errors
```bash
# Verify ECR login
aws ecr get-login-password | docker login --username AWS --password-stdin <registry>

# Check repository exists
aws ecr describe-repositories
```

## Security Best Practices

- [x] VPC with private subnets for workloads
- [x] RDS encryption at rest
- [x] Secrets Manager for credentials
- [x] IAM roles for service accounts (IRSA)
- [x] Security groups with least privilege
- [x] ECR image scanning
- [x] CloudWatch audit logging
- [ ] AWS WAF (future enhancement)
- [ ] GuardDuty (future enhancement)

## Specifications

See `@specs/phases/phase-5-cloud.md` for detailed requirements.
