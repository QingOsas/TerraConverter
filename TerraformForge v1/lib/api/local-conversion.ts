import type { CloudProvider } from "@/lib/types"

// Function to convert ARM/Bicep to Terraform without Firebase
export async function localConvertToTerraform(
  file: File,
  cloudProvider: CloudProvider,
): Promise<{ name: string; content: string }[]> {
  try {
    // Read the file content
    const fileContent = await file.text()

    // For demonstration purposes, we'll generate sample Terraform files
    // In a real implementation, you would parse the ARM/Bicep content here

    // Derive a project name from the input file name
    const projectName = file.name
      .split(".")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")

    // Common basic structure for terraform.tf
    const terraformTfContent = `terraform {
  required_providers {
    ${cloudProvider}rm = {
      source  = "hashicorp/${cloudProvider}rm"
      version = ">= 2.0.0"
    }
  }
  
  backend "local" {
    path = "terraform.tfstate"
  }
}`

    // Provider configuration
    const providerTfContent =
      cloudProvider === "azure"
        ? `provider "azurerm" {
  features {}
  subscription_id = "c04a4c5c-484c-4b8d-865d-ad07f93a3dcd"
}`
        : cloudProvider === "aws"
          ? `provider "aws" {
  region = "us-west-2"
}`
          : `provider "google" {
  project = "my-project-id"
  region  = "us-central1"
}`

    // Variables file
    const variablesTfContent =
      cloudProvider === "azure"
        ? `variable "resource_group_name" {
  description = "The name of the resource group"
}

variable "vnet_resource_group_name" {
  description = "The name of the resource group for the virtual network"
  default     = "APPZONESECURENETWORKRSG-CSP"
}

variable "location" {
  description = "The location of the resource group"
  default     = "eastus"
}

variable "virtual_network_name" {
  description = "The name of the virtual network"
  default     = "AppzoneSecureNetwork"
}

variable "subnet_name" {
  description = "The name of the subnet"
}

variable "virtualMachines_Cluster_App_01_name" {
  description = "The name of the virtual machine"
}`
        : `variable "region" {
  description = "The region to deploy resources"
  default     = "us-west-2"
}

variable "project_name" {
  description = "Name of the project"
  default     = "${projectName}"
}`

    // Main.tf with resources
    const mainTfContent =
      cloudProvider === "azure"
        ? `resource "azurerm_network_interface" "nic" {
  name                = "\${var.virtualMachines_Cluster_App_01_name}-nic"
  location            = var.location
  resource_group_name = var.resource_group_name
  
  ip_configuration {
    name                          = "internal"
    subnet_id                     = data.azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
  }
}

data "azurerm_virtual_network" "vnet" {
  name                = var.virtual_network_name
  resource_group_name = var.vnet_resource_group_name
}

data "azurerm_subnet" "subnet" {
  name                 = var.subnet_name
  virtual_network_name = data.azurerm_virtual_network.vnet.name
  resource_group_name  = var.vnet_resource_group_name
}

resource "azurerm_virtual_machine" "Cluster_App_01" {
  name                  = var.virtualMachines_Cluster_App_01_name
  location              = var.location
  resource_group_name   = var.resource_group_name
  network_interface_ids = [azurerm_network_interface.nic.id]
  vm_size               = "Standard_D4s_v3"
  
  storage_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
  
  storage_os_disk {
    name              = "\${var.virtualMachines_Cluster_App_01_name}-osdisk"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Premium_LRS"
  }
  
  os_profile {
    computer_name  = var.virtualMachines_Cluster_App_01_name
    admin_username = "adminuser"
  }
  
  os_profile_linux_config {
    disable_password_authentication = true
    ssh_keys {
      path     = "/home/adminuser/.ssh/authorized_keys"
      key_data = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC..."
    }
  }
}`
        : cloudProvider === "aws"
          ? `resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "\${var.project_name}-vpc"
  }
}

resource "aws_subnet" "main" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.1.0/24"
  
  tags = {
    Name = "\${var.project_name}-subnet"
  }
}

resource "aws_instance" "app_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.main.id
  
  tags = {
    Name = "\${var.project_name}-app-server"
  }
}`
          : `resource "google_compute_network" "vpc" {
  name                    = "\${var.project_name}-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name          = "\${var.project_name}-subnet"
  ip_cidr_range = "10.0.1.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
}

resource "google_compute_instance" "app_server" {
  name         = "\${var.project_name}-app-server"
  machine_type = "e2-medium"
  zone         = "\${var.region}-a"
  
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-10"
    }
  }
  
  network_interface {
    subnetwork = google_compute_subnetwork.subnet.id
  }
}`

    // Output file
    const outputsTfContent = `output "resource_group_name" {
  value = var.resource_group_name
}

output "virtual_machine_id" {
  value = ${cloudProvider === "azure" ? "azurerm_virtual_machine.Cluster_App_01.id" : cloudProvider === "aws" ? "aws_instance.app_server.id" : "google_compute_instance.app_server.id"}
}`

    return [
      { name: "terraform.tf", content: terraformTfContent },
      { name: "provider.tf", content: providerTfContent },
      { name: "variables.tf", content: variablesTfContent },
      { name: "main.tf", content: mainTfContent },
      { name: "outputs.tf", content: outputsTfContent },
    ]
  } catch (error) {
    console.error("Error in local conversion:", error)
    throw error
  }
}
