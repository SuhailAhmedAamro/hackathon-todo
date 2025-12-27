# Phase 5: Cloud-Native Deployment - Specification

## Overview
Deploy the application to cloud using managed services and Infrastructure as Code (IaC).

## Goals
- Deploy to AWS/GCP/Azure using managed services
- Implement Infrastructure as Code with Terraform
- Set up CI/CD pipeline
- Implement monitoring and logging
- Optimize for cost and performance
- Enable auto-scaling and high availability

## Cloud Provider Options

### AWS
- **Compute**: EKS (Elastic Kubernetes Service)
- **Database**: RDS PostgreSQL
- **Cache**: ElastiCache (Redis)
- **Storage**: S3
- **CDN**: CloudFront
- **Monitoring**: CloudWatch
- **Secrets**: Secrets Manager

### GCP
- **Compute**: GKE (Google Kubernetes Engine)
- **Database**: Cloud SQL PostgreSQL
- **Cache**: Memorystore (Redis)
- **Storage**: Cloud Storage
- **CDN**: Cloud CDN
- **Monitoring**: Cloud Monitoring
- **Secrets**: Secret Manager

### Azure
- **Compute**: AKS (Azure Kubernetes Service)
- **Database**: Azure Database for PostgreSQL
- **Cache**: Azure Cache for Redis
- **Storage**: Blob Storage
- **CDN**: Azure CDN
- **Monitoring**: Azure Monitor
- **Secrets**: Key Vault

## Architecture (AWS Example)

```
┌──────────────────────────────────────────────┐
│             Route 53 (DNS)                   │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│       CloudFront (CDN)                       │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│   Application Load Balancer (ALB)           │
└────────────────┬─────────────────────────────┘
                 │
┌────────────────▼─────────────────────────────┐
│        EKS Cluster (Multiple AZs)            │
│  ┌──────────────┐  ┌──────────────┐         │
│  │   Frontend   │  │   Backend    │         │
│  │   Pods       │  │   Pods       │         │
│  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │
└─────────┼──────────────────┼─────────────────┘
          │                  │
          │  ┌───────────────▼─────────────┐
          │  │  RDS PostgreSQL (Multi-AZ)  │
          │  └─────────────────────────────┘
          │
          │  ┌─────────────────────────────┐
          └──│  S3 (Static Assets)         │
             └─────────────────────────────┘
```

## Terraform Configuration

### Directory Structure

```
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── versions.tf
├── modules/
│   ├── networking/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── eks/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── rds/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── s3/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── environments/
│   ├── dev/
│   │   └── terraform.tfvars
│   ├── staging/
│   │   └── terraform.tfvars
│   └── prod/
│       └── terraform.tfvars
└── README.md
```

### Example: VPC Configuration

```hcl
# modules/networking/main.tf
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

resource "aws_subnet" "public" {
  count                   = length(var.availability_zones)
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-${count.index + 1}"
    "kubernetes.io/role/elb" = "1"
  }
}

resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + 10)
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name = "${var.project_name}-private-${count.index + 1}"
    "kubernetes.io/role/internal-elb" = "1"
  }
}
```

### Example: EKS Cluster

```hcl
# modules/eks/main.tf
resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  role_arn = aws_iam_role.cluster.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = var.subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.cluster_AmazonEKSClusterPolicy,
  ]
}

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.cluster_name}-node-group"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.private_subnet_ids

  scaling_config {
    desired_size = var.desired_size
    max_size     = var.max_size
    min_size     = var.min_size
  }

  instance_types = var.instance_types

  depends_on = [
    aws_iam_role_policy_attachment.node_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.node_AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.node_AmazonEC2ContainerRegistryReadOnly,
  ]
}
```

### Example: RDS PostgreSQL

```hcl
# modules/rds/main.tf
resource "aws_db_instance" "main" {
  identifier     = var.db_identifier
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = var.instance_class

  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_encrypted     = true

  db_name  = var.database_name
  username = var.master_username
  password = var.master_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  multi_az               = var.multi_az
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"

  skip_final_snapshot       = false
  final_snapshot_identifier = "${var.db_identifier}-final-snapshot"

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = {
    Name = "${var.project_name}-rds"
  }
}
```

## CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to EKS

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: evolution-todo
  EKS_CLUSTER: evolution-todo-cluster

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Backend Tests
        run: |
          cd phase-2-web/backend
          pip install -r requirements.txt
          pytest

      - name: Run Frontend Tests
        run: |
          cd phase-2-web/frontend
          npm install
          npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and Push Docker Images
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:frontend-$IMAGE_TAG -f phase-4-kubernetes/docker/frontend.Dockerfile .
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:backend-$IMAGE_TAG -f phase-4-kubernetes/docker/backend.Dockerfile .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:frontend-$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:backend-$IMAGE_TAG

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig --name ${{ env.EKS_CLUSTER }} --region ${{ env.AWS_REGION }}

      - name: Deploy to EKS
        env:
          IMAGE_TAG: ${{ github.sha }}
        run: |
          helm upgrade --install evolution-todo \
            ./phase-4-kubernetes/helm/evolution-todo \
            --set frontend.image.tag=frontend-$IMAGE_TAG \
            --set backend.image.tag=backend-$IMAGE_TAG \
            --namespace production \
            --create-namespace
```

## Monitoring and Logging

### CloudWatch Logs
```hcl
resource "aws_cloudwatch_log_group" "app" {
  name              = "/aws/eks/${var.cluster_name}/application"
  retention_in_days = 30
}
```

### CloudWatch Alarms
```hcl
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "${var.project_name}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EKS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors EKS CPU utilization"
  alarm_actions       = [aws_sns_topic.alerts.arn]
}
```

## Cost Optimization

### Strategies
- Use Spot Instances for non-critical workloads
- Right-size instances based on metrics
- Use S3 lifecycle policies
- Enable RDS auto-scaling
- Use CloudFront for static assets
- Implement auto-scaling policies

### Cost Monitoring
```hcl
resource "aws_budgets_budget" "monthly" {
  name         = "${var.project_name}-monthly-budget"
  budget_type  = "COST"
  limit_amount = "100"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }
}
```

## Implementation Checklist

### Infrastructure
- [ ] Set up AWS/GCP/Azure account
- [ ] Configure Terraform backend (S3 + DynamoDB)
- [ ] Write Terraform modules
- [ ] Create VPC and networking
- [ ] Provision EKS/GKE/AKS cluster
- [ ] Provision RDS/Cloud SQL database
- [ ] Set up S3/GCS/Blob storage
- [ ] Configure CloudFront/CDN
- [ ] Set up monitoring and logging
- [ ] Configure alerting

### CI/CD
- [ ] Create GitHub Actions workflow
- [ ] Set up ECR/GCR/ACR
- [ ] Configure automated testing
- [ ] Implement deployment pipeline
- [ ] Set up staging environment
- [ ] Configure rollback mechanism

### Security
- [ ] Enable encryption at rest
- [ ] Enable encryption in transit
- [ ] Configure IAM roles and policies
- [ ] Set up Secrets Manager
- [ ] Enable VPC security groups
- [ ] Configure network ACLs
- [ ] Enable audit logging

## Success Criteria
- [ ] Infrastructure deployed via Terraform
- [ ] Application running on managed K8s
- [ ] Database on managed service (RDS/Cloud SQL)
- [ ] CI/CD pipeline functional
- [ ] Auto-scaling working
- [ ] Monitoring dashboards configured
- [ ] Alerts configured and tested
- [ ] Cost within budget
- [ ] Documentation complete
- [ ] Disaster recovery tested

## Project Structure

```
phase-5-cloud/
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── modules/
│   └── environments/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── scripts/
│   ├── setup-terraform-backend.sh
│   ├── deploy.sh
│   └── destroy.sh
└── README.md
```

## Future Enhancements
- Multi-region deployment
- Disaster recovery automation
- Advanced monitoring (APM)
- Cost optimization automation
- GitOps with ArgoCD/Flux
