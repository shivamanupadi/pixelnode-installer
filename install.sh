#!/bin/bash

set -euo pipefail

# Function to setup needrestart configurations (Linux only)
function setup_needrestart_config() {
    export DEBIAN_FRONTEND=noninteractive
    needrestart_conf_dir="/etc/needrestart/conf.d"
    needrestart_conf_file="${needrestart_conf_dir}/temp-disable-for-pixelnode-install.conf"
    sudo mkdir -p "${needrestart_conf_dir}"
    echo "# Restart services (l)ist only, (i)nteractive or (a)utomatically.
    \$nrconf{restart} = 'l';
    # Disable hints on pending kernel upgrades.
    \$nrconf{kernelhints} = 0; " | sudo tee "${needrestart_conf_file}" > /dev/null
    trap "sudo rm -f ${needrestart_conf_file}" EXIT
}

# Function to check if a command is available on macOS or Linux
function is_command_available() {
    command -v "$1" &> /dev/null
}

# Function to install software using npm, only if it's not installed
function npm_install_if_not_installed() {
    if is_command_available "$1"; then
        echo "$1 is already installed. Skipping..."
    else
        echo "Installing $1 using npm..."
        sudo npm install -g "$1"
    fi
}

# Function to install git, only if it's not installed
function install_git_if_not_installed() {
    if is_command_available "git"; then
        echo "Git is already installed. Skipping..."
    else
        echo "Installing git..."
        if [ "$(uname)" == "Darwin" ]; then
            # macOS (brew)
            brew install git
        else
            # Linux (apt-get on Debian/Ubuntu, yum on CentOS)
            if [ -f /etc/debian_version ]; then
                sudo apt-get update
                sudo apt-get install --yes git
            elif [ -f /etc/redhat-release ]; then
                sudo yum install -y git
            else
                echo "Unsupported Linux distribution. Unable to install git."
                exit 1
            fi
        fi
    fi
}

# Function to install Docker, only if it's not installed
function install_docker_if_not_installed() {
    if is_command_available "docker"; then
        echo "Docker is already installed. Skipping..."
    else
        echo "Installing Docker..."
        if [ "$(uname)" == "Darwin" ]; then
            # macOS (brew)
            brew install docker
        else
            # Linux (apt-get on Debian/Ubuntu, yum on CentOS)
            if [ -f /etc/debian_version ]; then
                curl -fsSL https://get.docker.com | sudo sh
            elif [ -f /etc/redhat-release ]; then
                sudo yum install -y yum-utils
                sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
                sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            else
                echo "Unsupported Linux distribution. Unable to install Docker."
                exit 1
            fi
        fi
    fi
}

# Function to install Docker Compose, only if it's not installed
function install_docker_compose_if_not_installed() {
    if is_command_available "docker-compose"; then
        echo "Docker Compose is already installed. Skipping..."
    else
        echo "Installing Docker Compose..."
        if [ "$(uname)" == "Darwin" ]; then
            # macOS (brew)
            brew install docker-compose
        else
            # Linux (apt-get on Debian/Ubuntu, yum on CentOS)
            if [ -f /etc/debian_version ]; then
                sudo apt-get update
                sudo apt-get install --yes docker-compose
            elif [ -f /etc/redhat-release ]; then
                sudo curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                sudo chmod +x /usr/local/bin/docker-compose
            else
                echo "Unsupported Linux distribution. Unable to install Docker."
                exit 1
            fi
        fi
    fi
}


# Function to install Node.js, only if it's not installed
function install_nodejs_if_not_installed() {
    if is_command_available "node"; then
          echo "nodejs is already installed. Skipping..."
    else
          echo "Installing Node.js..."
          if [ "$(uname)" == "Darwin" ]; then
              # macOS (brew)
              brew install node
          else
              # Linux (apt-get on Debian/Ubuntu, yum on CentOS)
              if [ -f /etc/debian_version ]; then
                  sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg
                  curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
                  NODE_MAJOR=18
                  echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
                  sudo apt-get update && sudo apt-get install nodejs -y
              elif [ -f /etc/redhat-release ]; then
                  sudo yum install https://rpm.nodesource.com/pub_18.x/nodistro/repo/nodesource-release-nodistro-1.noarch.rpm -y
                  sudo yum install nodejs -y
              else
                  echo "Unsupported Linux distribution. Unable to install Node.js."
                  exit 1
              fi
          fi
    fi

}

# Function to clone Git repository, only if it's not cloned before
function clone_git_repo_if_not_cloned() {
    local repo_url="https://github.com/shivamanupadi/pixelnode-installer"
    local repo_dir="pixelnode-installer"
    if [ -d "$repo_dir" ]; then
        echo "Repository is already cloned. Skipping..."
    else
        echo "Cloning the Git repository..."
        git clone "$repo_url"
    fi
}

echo -e "-------------"
echo -e "Welcome to pixelnode beta installer!"
echo -e "This script will install everything for you."
echo -e "-------------"
echo "Installing required packages..."

# Setup needrestart configurations (Linux only)
setup_needrestart_config

# Install git
install_git_if_not_installed

# Install Docker
install_docker_if_not_installed

# Install Docker Compose
install_docker_compose_if_not_installed

# Install Node.js
install_nodejs_if_not_installed

# Install global npm packages if not already installed
npm_install_if_not_installed pm2
npm_install_if_not_installed yarn

# Clone the repository if not already cloned and run the commands
clone_git_repo_if_not_cloned
cd pixelnode-installer
git reset --hard origin/master
git pull
yarn install

bash createEnv.sh
PORT=8000 pm2 start ecosystem.config.js

docker-compose -f docker-compose.algorand.mainnet.yml pull
docker-compose -f docker-compose.algorand.testnet.yml pull
docker-compose -f docker-compose.algorand.betanet.yml pull

echo -e "\033[32m\nCongratulations! Your pixelnode instance is ready to use.\n\033[0m"
echo "\033[32mPlease visit http://$(curl -4s https://ifconfig.io):8000 to get started.\033[0m"