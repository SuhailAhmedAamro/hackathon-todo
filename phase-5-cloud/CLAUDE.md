# Phase 5: Cloud-Native Deployment - Claude Guide

## Overview
Deploy to AWS/GCP/Azure using Infrastructure as Code.

## Before You Start
1. Read: `@specs/phases/phase-5-cloud.md`
2. Choose cloud provider (AWS/GCP/Azure)
3. Set up cloud account and CLI tools
4. Install Terraform

## Implementation Order
1. Set up Terraform backend (S3 + DynamoDB)
2. Write Terraform modules (VPC, EKS/GKE, RDS, etc.)
3. Configure CI/CD pipeline (GitHub Actions)
4. Set up monitoring and logging
5. Deploy infrastructure
6. Deploy application
7. Configure auto-scaling
8. Set up cost monitoring

## Terraform Structure
```
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── modules/
│   ├── networking/
│   ├── eks/
│   ├── rds/
│   └── s3/
└── environments/
    ├── dev/
    ├── staging/
    └── prod/
```

## Deploy Infrastructure
```bash
cd terraform

# Initialize
terraform init

# Plan
terraform plan -var-file=environments/prod/terraform.tfvars

# Apply
terraform apply -var-file=environments/prod/terraform.tfvars
```

## Deploy Application
Use GitHub Actions workflow or manual deployment:
```bash
# Update kubeconfig
aws eks update-kubeconfig --name evolution-todo-cluster

# Deploy via Helm
helm upgrade --install evolution-todo ../phase-4-kubernetes/helm/evolution-todo
```

## Key Additions
- Infrastructure as Code (Terraform)
- Managed Kubernetes (EKS/GKE/AKS)
- Managed Database (RDS/Cloud SQL)
- CDN and Load Balancing
- Auto-scaling
- Monitoring and Alerting
- CI/CD Pipeline

## Cost Optimization
- Use Spot Instances where possible
- Set up billing alerts
- Right-size instances
- Use managed services efficiently
