# =============================================================================
# Networking Outputs
# =============================================================================

output "vpc_id" {
  description = "ID of the VPC"
  value       = module.networking.vpc_id
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = module.networking.vpc_cidr
}

output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = module.networking.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of private subnets"
  value       = module.networking.private_subnet_ids
}

# =============================================================================
# EKS Outputs
# =============================================================================

output "eks_cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  description = "Endpoint for the EKS cluster"
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_arn" {
  description = "ARN of the EKS cluster"
  value       = module.eks.cluster_arn
}

output "eks_cluster_security_group_id" {
  description = "Security group ID of the EKS cluster"
  value       = module.eks.cluster_security_group_id
}

output "eks_node_group_arn" {
  description = "ARN of the EKS node group"
  value       = module.eks.node_group_arn
}

output "eks_kubeconfig_command" {
  description = "Command to configure kubectl"
  value       = "aws eks update-kubeconfig --name ${module.eks.cluster_name} --region ${var.aws_region}"
}

# =============================================================================
# RDS Outputs
# =============================================================================

output "rds_endpoint" {
  description = "Endpoint of the RDS instance"
  value       = module.rds.endpoint
}

output "rds_port" {
  description = "Port of the RDS instance"
  value       = module.rds.port
}

output "rds_database_name" {
  description = "Name of the database"
  value       = module.rds.database_name
}

output "rds_connection_string" {
  description = "PostgreSQL connection string (without password)"
  value       = "postgresql://${var.db_username}:PASSWORD@${module.rds.endpoint}:${module.rds.port}/${module.rds.database_name}"
  sensitive   = true
}

# =============================================================================
# S3 Outputs
# =============================================================================

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = var.enable_s3_bucket ? module.s3[0].bucket_name : null
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = var.enable_s3_bucket ? module.s3[0].bucket_arn : null
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  value       = var.enable_s3_bucket ? module.s3[0].bucket_domain_name : null
}

# =============================================================================
# ECR Outputs
# =============================================================================

output "ecr_repository_urls" {
  description = "URLs of the ECR repositories"
  value       = module.ecr.repository_urls
}

output "ecr_registry_id" {
  description = "ID of the ECR registry"
  value       = module.ecr.registry_id
}

# =============================================================================
# Monitoring Outputs
# =============================================================================

output "cloudwatch_log_group_name" {
  description = "Name of the CloudWatch log group"
  value       = module.monitoring.log_group_name
}

output "sns_topic_arn" {
  description = "ARN of the SNS topic for alerts"
  value       = module.monitoring.sns_topic_arn
}

# =============================================================================
# Application Outputs
# =============================================================================

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "deployment_info" {
  description = "Deployment information for the application"
  value = {
    cluster_name      = module.eks.cluster_name
    ecr_repositories  = module.ecr.repository_urls
    database_endpoint = module.rds.endpoint
    s3_bucket         = var.enable_s3_bucket ? module.s3[0].bucket_name : null
  }
}
