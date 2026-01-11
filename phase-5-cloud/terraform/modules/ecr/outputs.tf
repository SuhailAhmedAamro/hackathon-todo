output "repository_urls" {
  description = "URLs of the ECR repositories"
  value       = { for k, v in aws_ecr_repository.main : k => v.repository_url }
}

output "repository_arns" {
  description = "ARNs of the ECR repositories"
  value       = { for k, v in aws_ecr_repository.main : k => v.arn }
}

output "registry_id" {
  description = "Registry ID"
  value       = data.aws_caller_identity.current.account_id
}
