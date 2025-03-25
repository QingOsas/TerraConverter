resource "aws_instance" "Cluster_App_01" {
  ami           = "ami-0c55b159cbfafe1f0" // Example AMI ID for Windows Server 2022
  instance_type = "t3.medium"
  subnet_id     = var.subnet_id
  key_name      = "my-key-pair"

  tags = {
    Name        = var.virtualMachines_Cluster_App_01_name
    owner       = "Qore"
    environment = "Production"
    OpCo        = "Cluster"
  }

  user_data = <<-EOF
              <powershell>
              net user ${var.admin_username} ${var.admin_password} /add
              net localgroup administrators ${var.admin_username} /add
              </powershell>
              EOF
}

resource "aws_security_group" "Cluster_App_01_sg" {
  name        = "${var.virtualMachines_Cluster_App_01_name}-sg"
  description = "Security group for ${var.virtualMachines_Cluster_App_01_name}"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 3389
    to_port     = 3389
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
