# =============================================================================
# Evolution Todo - Cloud Infrastructure (AWS)
# =============================================================================

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge(
      {
        Project     = var.project_name
        Environment = var.environment
        ManagedBy   = "Terraform"
      },
      var.tags
    )
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

# Local variables
locals {
  name_prefix = "${var.project_name}-${var.environment}"

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
  }
}

# =============================================================================
# Networking Module
# =============================================================================

module "networking" {
  source = "./modules/networking"

  project_name       = var.project_name
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  enable_nat_gateway = var.enable_nat_gateway
  single_nat_gateway = var.single_nat_gateway

  tags = local.common_tags
}

# =============================================================================
# EKS Module
# =============================================================================

module "eks" {
  source = "./modules/eks"

  project_name       = var.project_name
  environment        = var.environment
  kubernetes_version = var.kubernetes_version

  vpc_id             = module.networking.vpc_id
  private_subnet_ids = module.networking.private_subnet_ids
  public_subnet_ids  = module.networking.public_subnet_ids

  node_instance_types = var.eks_node_instance_types
  node_desired_size   = var.eks_node_desired_size
  node_min_size       = var.eks_node_min_size
  node_max_size       = var.eks_node_max_size
  node_disk_size      = var.eks_node_disk_size

  enable_cluster_autoscaler = var.enable_cluster_autoscaler
  enable_cloudwatch_logs    = var.enable_cloudwatch_logs

  tags = local.common_tags
}

# =============================================================================
# RDS Module
# =============================================================================

module "rds" {
  source = "./modules/rds"

  project_name = var.project_name
  environment  = var.environment

  vpc_id             = module.networking.vpc_id
  private_subnet_ids = module.networking.private_subnet_ids
  eks_security_group_id = module.eks.cluster_security_group_id

  instance_class          = var.db_instance_class
  allocated_storage       = var.db_allocated_storage
  max_allocated_storage   = var.db_max_allocated_storage
  database_name           = var.db_name
  master_username         = var.db_username
  master_password         = var.db_password
  multi_az                = var.db_multi_az
  backup_retention_period = var.db_backup_retention_period
  deletion_protection     = var.db_deletion_protection

  tags = local.common_tags
}

# =============================================================================
# S3 Module
# =============================================================================

module "s3" {
  source = "./modules/s3"
  count  = var.enable_s3_bucket ? 1 : 0

  project_name = var.project_name
  environment  = var.environment
  versioning   = var.s3_versioning

  tags = local.common_tags
}

# =============================================================================
# ECR Module
# =============================================================================

module "ecr" {
  source = "./modules/ecr"

  project_name         = var.project_name
  environment          = var.environment
  repositories         = var.ecr_repositories
  image_retention_count = var.ecr_image_retention_count

  tags = local.common_tags
}

# =============================================================================
# Monitoring Module
# =============================================================================

module "monitoring" {
  source = "./modules/monitoring"

  project_name           = var.project_name
  environment            = var.environment
  eks_cluster_name       = module.eks.cluster_name
  log_retention_days     = var.cloudwatch_log_retention_days
  alert_email            = var.alert_email
  monthly_budget_limit   = var.monthly_budget_limit

  tags = local.common_tags
}

# =============================================================================
# Kubernetes Provider Configuration
# =============================================================================

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_ca_certificate)

  exec {
    api_version = "client.authentication.k8s.io/v1beta1"
    command     = "aws"
    args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
  }
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_ca_certificate)

    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args        = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
    }
  }
}
