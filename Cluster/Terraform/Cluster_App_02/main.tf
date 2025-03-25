resource "azurerm_network_interface" "nic" {
  name                = "${var.virtualMachines_Cluster_App_02_name}-nic"
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

resource "azurerm_virtual_machine" "Cluster_App_02" {
  name                  = var.virtualMachines_Cluster_App_02_name
  location              = var.location
  resource_group_name   = var.resource_group_name
  network_interface_ids = [azurerm_network_interface.nic.id]
  vm_size               = "Standard_B2s"

  identity {
    type = "SystemAssigned"
  }

  storage_image_reference {
    publisher = "MicrosoftWindowsServer"
    offer     = "WindowsServer"
    sku       = "2022-Datacenter"
    version   = "latest"
  }

  storage_os_disk {
    name              = "${var.virtualMachines_Cluster_App_02_name}_os_disk"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
    disk_size_gb      = 127
  }

  os_profile {
    computer_name  = var.virtualMachines_Cluster_App_02_name
    admin_username = var.admin_username
    admin_password = var.admin_password
  }

  os_profile_windows_config {
    provision_vm_agent        = true
    enable_automatic_upgrades = true
  }

  tags = {
    owner       = "Qore"
    environment = "Production"
    OpCo        = "Cluster"
  }
}
