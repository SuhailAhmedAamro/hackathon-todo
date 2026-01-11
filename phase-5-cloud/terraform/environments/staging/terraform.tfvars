# =============================================================================
# Staging Environment Configuration
# =============================================================================

# Project
project_name = "evolution-todo"
environment  = "staging"
aws_region   = "us-east-1"

# Networking
vpc_cidr           = "10.1.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]
enable_nat_gateway = true
single_nat_gateway = true  # Cost saving for staging

# EKS
kubernetes_version      = "1.28"
eks_node_instance_types = ["t3.medium", "t3.large"]
eks_node_desired_size   = 3
eks_node_min_size       = 2
eks_node_max_size       = 5
eks_node_disk_size      = 50
enable_cluster_autoscaler = true

# RDS
db_instance_class          = "db.t3.small"
db_allocated_storage       = 30
db_max_allocated_storage   = 100
db_name                    = "evolution_todo"
db_username                = "todouser"
# db_password              = "SET_VIA_ENVIRONMENT_VARIABLE"  # Use TF_VAR_db_password
db_multi_az                = false
db_backup_retention_period = 7
db_deletion_protection     = true

# S3
enable_s3_bucket = true
s3_versioning    = true

# ECR
ecr_repositories          = ["frontend", "backend", "mcp"]
ecr_image_retention_count = 20

# Monitoring
enable_cloudwatch_logs        = true
cloudwatch_log_retention_days = 14
alert_email                   = ""  # Set your email
monthly_budget_limit          = 100

# Tags
tags = {
  Team       = "QA"
  CostCenter = "Staging"
}
