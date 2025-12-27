# Phase 5: Cloud-Native Deployment

Deploy to cloud with Infrastructure as Code.

## Prerequisites
- Cloud provider account (AWS/GCP/Azure)
- Terraform installed
- Cloud CLI tools (aws-cli/gcloud/az)
- GitHub account (for CI/CD)

## Setup

### Configure Cloud Credentials
```bash
# AWS
aws configure

# GCP
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Azure
az login
```

### Initialize Terraform
```bash
cd terraform
terraform init
```

### Create Infrastructure
```bash
# Plan
terraform plan -var-file=environments/prod/terraform.tfvars

# Apply
terraform apply -var-file=environments/prod/terraform.tfvars
```

## CI/CD Pipeline
GitHub Actions automatically:
1. Runs tests on PR
2. Builds Docker images
3. Pushes to container registry
4. Deploys to EKS/GKE/AKS
5. Runs smoke tests

## Monitoring
- Logs: CloudWatch / Stackdriver / Azure Monitor
- Metrics: Prometheus + Grafana
- Alerts: SNS / Pub/Sub / Azure Alerts
- Tracing: X-Ray / Cloud Trace / App Insights

## Cost Management
- Set billing alerts
- Use cost explorer
- Review monthly costs
- Optimize unused resources

## Tech Stack
- **IaC**: Terraform
- **Cloud**: AWS / GCP / Azure
- **Kubernetes**: EKS / GKE / AKS
- **Database**: RDS / Cloud SQL / Azure DB
- **CI/CD**: GitHub Actions

## Specs
See `@specs/phases/phase-5-cloud.md`
