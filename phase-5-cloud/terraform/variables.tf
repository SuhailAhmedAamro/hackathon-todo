# =============================================================================
# Project Configuration
# =============================================================================

variable "project_name" {
  description = "Name of the project (used for resource naming)"
  type        = string
  default     = "evolution-todo"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}

# =============================================================================
# Networking Configuration
# =============================================================================

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones to use"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = true
}

variable "single_nat_gateway" {
  description = "Use a single NAT Gateway (cost saving for non-prod)"
  type        = bool
  default     = false
}

# =============================================================================
# EKS Configuration
# =============================================================================

variable "kubernetes_version" {
  description = "Kubernetes version for EKS cluster"
  type        = string
  default     = "1.28"
}

variable "eks_node_instance_types" {
  description = "Instance types for EKS node groups"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "eks_node_desired_size" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}

variable "eks_node_min_size" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 1
}

variable "eks_node_max_size" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 5
}

variable "eks_node_disk_size" {
  description = "Disk size in GB for worker nodes"
  type        = number
  default     = 50
}

variable "enable_cluster_autoscaler" {
  description = "Enable Kubernetes Cluster Autoscaler"
  type        = bool
  default     = true
}

# =============================================================================
# RDS Configuration
# =============================================================================

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum storage for RDS auto-scaling in GB"
  type        = number
  default     = 100
}

variable "db_name" {
  description = "Name of the database"
  type        = string
  default     = "evolution_todo"
}

variable "db_username" {
  description = "Master username for the database"
  type        = string
  default     = "todouser"
  sensitive   = true
}

variable "db_password" {
  description = "Master password for the database"
  type        = string
  sensitive   = true
}

variable "db_multi_az" {
  description = "Enable Multi-AZ deployment for RDS"
  type        = bool
  default     = false
}

variable "db_backup_retention_period" {
  description = "Number of days to retain backups"
  type        = number
  default     = 7
}

variable "db_deletion_protection" {
  description = "Enable deletion protection for RDS"
  type        = bool
  default     = true
}

# =============================================================================
# S3 Configuration
# =============================================================================

variable "enable_s3_bucket" {
  description = "Create S3 bucket for static assets"
  type        = bool
  default     = true
}

variable "s3_versioning" {
  description = "Enable versioning for S3 bucket"
  type        = bool
  default     = true
}

# =============================================================================
# ECR Configuration
# =============================================================================

variable "ecr_repositories" {
  description = "List of ECR repositories to create"
  type        = list(string)
  default     = ["frontend", "backend", "mcp"]
}

variable "ecr_image_retention_count" {
  description = "Number of images to retain in ECR"
  type        = number
  default     = 30
}

# =============================================================================
# Monitoring Configuration
# =============================================================================

variable "enable_cloudwatch_logs" {
  description = "Enable CloudWatch Logs for EKS"
  type        = bool
  default     = true
}

variable "cloudwatch_log_retention_days" {
  description = "CloudWatch log retention period in days"
  type        = number
  default     = 30
}

variable "alert_email" {
  description = "Email address for alerts"
  type        = string
  default     = ""
}

variable "monthly_budget_limit" {
  description = "Monthly budget limit in USD"
  type        = number
  default     = 100
}

# =============================================================================
# Application Configuration
# =============================================================================

variable "domain_name" {
  description = "Domain name for the application (optional)"
  type        = string
  default     = ""
}

variable "create_route53_zone" {
  description = "Create Route 53 hosted zone"
  type        = bool
  default     = false
}

# =============================================================================
# Backend Configuration
# =============================================================================

variable "create_terraform_backend" {
  description = "Create S3 bucket and DynamoDB table for Terraform state (run once)"
  type        = bool
  default     = false
}
