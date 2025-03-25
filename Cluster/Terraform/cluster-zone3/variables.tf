variable "resource_group_name" {
  description = "The name of the resource group"
}

variable "vnet_resource_group_name" {
  description = "The name of the resource group for the virtual network"
  default = "APPZONESECURENETWORKRSG-CSP"
}

variable "location" {
  description = "The location of the resource group"
  default     = "eastus"
}

variable "virtual_network_name" {
  description = "The name of the virtual network"
  default = "AppzoneSecureNetwork"
}

variable "subnet_name" {
  description = "The name of the subnet"
}

variable "virtualMachines_cluster-zone3_name" {
  description = "The name of the virtual machine"
}

variable "admin_username" {
  description = "The admin username for the virtual machine"
}

variable "admin_password" {
  description = "The admin password for the virtual machine"
  sensitive   = true
}

variable "os_disk_size_gb" {
  description = "The size of the OS disk in GB"
  default     = 64
}
