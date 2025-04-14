import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

// Sample Terraform file templates based on cloud provider
const getTerraformFiles = (provider: string, inputFileName: string) => {
  // Derive a project name from the input file name
  const projectName = inputFileName
    .split(".")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")

  // Common basic structure for terraform.tf
  const terraformTfContent = `terraform {
  required_providers {
    ${provider}rm = {
      source  = "hashicorp/${provider}rm"
      version = ">= 2.0.0"
    }
  }
  
  backend "local" {
    path = "terraform.tfstate"
  }
}`

  // Provider configuration
  const providerTfContent =
    provider === "azure"
      ? `provider "azurerm" {
  features {}
  subscription_id = "c04a4c5c-484c-4b8d-865d-ad07f93a3dcd"
}`
      : provider === "aws"
        ? `provider "aws" {
  region = "us-west-2"
}`
        : `provider "google" {
  project = "my-project-id"
  region  = "us-central1"
}`

  // Variables file
  const variablesTfContent =
    provider === "azure"
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
    provider === "azure"
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
      : provider === "aws"
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
  value = provider == "azure" ? azurerm_virtual_machine.Cluster_App_01.id : provider == "aws" ? aws_instance.app_server.id : google_compute_instance.app_server.id
}`

  return [
    { name: "terraform.tf", content: terraformTfContent },
    { name: "provider.tf", content: providerTfContent },
    { name: "variables.tf", content: variablesTfContent },
    { name: "main.tf", content: mainTfContent },
    { name: "outputs.tf", content: outputsTfContent },
  ]
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { fileUrl, fileName, cloudProvider } = body

    if (!fileUrl || !fileName || !cloudProvider) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Validate cloud provider
    const validProviders = ["azure", "aws", "gcp"]
    if (!validProviders.includes(cloudProvider)) {
      return NextResponse.json({ error: "Invalid cloud provider" }, { status: 400 })
    }

    // In a real-world scenario, we would:
    // 1. Fetch the file from the URL
    // 2. Parse the ARM/Bicep content
    // 3. Convert it to Terraform based on the cloud provider
    // 4. Return the generated Terraform files

    // For this demo, we'll return sample Terraform files
    const files = getTerraformFiles(cloudProvider, fileName)

    // Return the converted files
    return NextResponse.json({ files })
  } catch (error) {
    console.error("Error converting file:", error)
    return NextResponse.json({ error: "Failed to convert file" }, { status: 500 })
  }
}
