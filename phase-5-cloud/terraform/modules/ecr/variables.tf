variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "repositories" {
  description = "List of ECR repositories to create"
  type        = list(string)
  default     = ["frontend", "backend", "mcp"]
}

variable "image_retention_count" {
  description = "Number of images to retain"
  type        = number
  default     = 30
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}
