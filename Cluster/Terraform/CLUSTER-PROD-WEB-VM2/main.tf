resource "azurerm_network_interface" "nic" {
  name                = "${var.virtualMachines_CLUSTER-PROD-WEB-VM2_name}-nic"
  location            = var.location
  resource_group_name = var.resource_group_name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = data.azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.public_ip.id
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

resource "azurerm_virtual_machine" "CLUSTER-PROD-WEB-VM2" {
  name                  = var.virtualMachines_CLUSTER-PROD-WEB-VM2_name
  location              = var.location
  resource_group_name   = var.resource_group_name
  network_interface_ids = [azurerm_network_interface.nic.id]
  vm_size               = "Standard_B4ms"

  identity {
    type = "SystemAssigned"
  }

  storage_image_reference {
    publisher = "canonical"
    offer     = "0001-com-ubuntu-server-jammy"
    sku       = "22_04-lts"
    version   = "latest"
  }

  storage_os_disk {
    name              = "${var.virtualMachines_CLUSTER-PROD-WEB-VM2_name}_os_disk"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Premium_LRS"
    disk_size_gb      = var.os_disk_size_gb
  }

  os_profile {
    computer_name  = var.virtualMachines_CLUSTER-PROD-WEB-VM2_name
    admin_username = var.admin_username
    admin_password = var.admin_password
  }

  os_profile_linux_config {
    disable_password_authentication = false
  }

  tags = {
    Owner       = "Qore"
    OpCo        = "Cluster"
    Environment = "Production"
  }
}

resource "azurerm_public_ip" "public_ip" {
  name                = "${var.virtualMachines_CLUSTER-PROD-WEB-VM2_name}-public-ip"
  location            = var.location
  resource_group_name = var.resource_group_name
  allocation_method   = "Dynamic"
  sku                 = "Standard"
}
