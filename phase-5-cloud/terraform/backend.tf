# =============================================================================
# Terraform Backend Configuration
# =============================================================================
# This file configures remote state storage in S3 with DynamoDB locking.
#
# SETUP INSTRUCTIONS:
# 1. First, create the S3 bucket and DynamoDB table using the bootstrap script
# 2. Then uncomment the backend configuration below
# 3. Run: terraform init -reconfigure
#
# To create backend resources manually:
#   aws s3api create-bucket --bucket evolution-todo-terraform-state --region us-east-1
#   aws s3api put-bucket-versioning --bucket evolution-todo-terraform-state --versioning-configuration Status=Enabled
#   aws s3api put-bucket-encryption --bucket evolution-todo-terraform-state --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
#   aws dynamodb create-table --table-name evolution-todo-terraform-locks --attribute-definitions AttributeName=LockID,AttributeType=S --key-schema AttributeName=LockID,KeyType=HASH --billing-mode PAY_PER_REQUEST
# =============================================================================

# Uncomment below after creating backend resources:

# terraform {
#   backend "s3" {
#     bucket         = "evolution-todo-terraform-state"
#     key            = "environments/${terraform.workspace}/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "evolution-todo-terraform-locks"
#
#     # Optional: Use specific profile
#     # profile = "production"
#   }
# }

# =============================================================================
# Bootstrap Resources for State Management
# =============================================================================
# These resources create the S3 bucket and DynamoDB table for state management.
# Run this once, then move state to S3 using: terraform init -migrate-state

resource "aws_s3_bucket" "terraform_state" {
  count  = var.create_terraform_backend ? 1 : 0
  bucket = "${var.project_name}-terraform-state-${data.aws_caller_identity.current.account_id}"

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name        = "Terraform State"
    Project     = var.project_name
    ManagedBy   = "Terraform"
    Purpose     = "Terraform State Storage"
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  count  = var.create_terraform_backend ? 1 : 0
  bucket = aws_s3_bucket.terraform_state[0].id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  count  = var.create_terraform_backend ? 1 : 0
  bucket = aws_s3_bucket.terraform_state[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  count  = var.create_terraform_backend ? 1 : 0
  bucket = aws_s3_bucket.terraform_state[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "terraform_locks" {
  count        = var.create_terraform_backend ? 1 : 0
  name         = "${var.project_name}-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name        = "Terraform State Locks"
    Project     = var.project_name
    ManagedBy   = "Terraform"
    Purpose     = "Terraform State Locking"
  }
}

# =============================================================================
# Backend Bootstrap Outputs
# =============================================================================

output "terraform_state_bucket" {
  description = "S3 bucket for Terraform state"
  value       = var.create_terraform_backend ? aws_s3_bucket.terraform_state[0].id : null
}

output "terraform_locks_table" {
  description = "DynamoDB table for Terraform locks"
  value       = var.create_terraform_backend ? aws_dynamodb_table.terraform_locks[0].name : null
}
