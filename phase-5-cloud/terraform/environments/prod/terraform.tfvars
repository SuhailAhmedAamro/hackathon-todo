# =============================================================================
# Production Environment Configuration
# =============================================================================

# Project
project_name = "evolution-todo"
environment  = "prod"
aws_region   = "us-east-1"

# Networking
vpc_cidr           = "10.2.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]
enable_nat_gateway = true
single_nat_gateway = false  # High availability - NAT per AZ

# EKS
kubernetes_version      = "1.28"
eks_node_instance_types = ["t3.large", "t3.xlarge"]
eks_node_desired_size   = 5
eks_node_min_size       = 3
eks_node_max_size       = 10
eks_node_disk_size      = 100
enable_cluster_autoscaler = true

# RDS
db_instance_class          = "db.t3.medium"
db_allocated_storage       = 50
db_max_allocated_storage   = 200
db_name                    = "evolution_todo"
db_username                = "todouser"
# db_password              = "SET_VIA_ENVIRONMENT_VARIABLE"  # Use TF_VAR_db_password
db_multi_az                = true  # High availability
db_backup_retention_period = 30
db_deletion_protection     = true

# S3
enable_s3_bucket = true
s3_versioning    = true

# ECR
ecr_repositories          = ["frontend", "backend", "mcp"]
ecr_image_retention_count = 50

# Monitoring
enable_cloudwatch_logs        = true
cloudwatch_log_retention_days = 90
alert_email                   = ""  # Set your email - REQUIRED for prod
monthly_budget_limit          = 500

# Domain (optional)
# domain_name        = "todo.yourdomain.com"
# create_route53_zone = false

# Tags
tags = {
  Team         = "Production"
  CostCenter   = "Production"
  Compliance   = "SOC2"
  BackupPolicy = "Daily"
}
