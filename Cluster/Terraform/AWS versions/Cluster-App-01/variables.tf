variable "resource_group_name" {
  description = "The name of the resource group"
}

variable "vpc_id" {
  description = "The ID of the VPC"
}

variable "location" {
  description = "The AWS region"
  default     = "us-east-1"
}

variable "subnet_id" {
  description = "The ID of the subnet"
}

variable "virtualMachines_Cluster_App_01_name" {
  description = "The name of the virtual machine"
}

variable "admin_username" {
  description = "The admin username for the virtual machine"
}

variable "admin_password" {
  description = "The admin password for the virtual machine"
  sensitive   = true
}
