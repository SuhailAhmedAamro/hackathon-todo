# =============================================================================
# Development Environment Configuration
# =============================================================================

# Project
project_name = "evolution-todo"
environment  = "dev"
aws_region   = "us-east-1"

# Networking
vpc_cidr           = "10.0.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b"]
enable_nat_gateway = true
single_nat_gateway = true  # Cost saving for dev

# EKS
kubernetes_version      = "1.28"
eks_node_instance_types = ["t3.medium"]
eks_node_desired_size   = 2
eks_node_min_size       = 1
eks_node_max_size       = 3
eks_node_disk_size      = 30
enable_cluster_autoscaler = true

# RDS
db_instance_class          = "db.t3.micro"
db_allocated_storage       = 20
db_max_allocated_storage   = 50
db_name                    = "evolution_todo"
db_username                = "todouser"
# db_password              = "SET_VIA_ENVIRONMENT_VARIABLE"  # Use TF_VAR_db_password
db_multi_az                = false
db_backup_retention_period = 1
db_deletion_protection     = false  # Allow easy cleanup in dev

# S3
enable_s3_bucket = true
s3_versioning    = false  # Not needed in dev

# ECR
ecr_repositories          = ["frontend", "backend", "mcp"]
ecr_image_retention_count = 10

# Monitoring
enable_cloudwatch_logs        = true
cloudwatch_log_retention_days = 7
alert_email                   = ""  # Set your email
monthly_budget_limit          = 50

# Tags
tags = {
  Team        = "Development"
  CostCenter  = "Dev"
  AutoShutdown = "true"
}
