#!/bin/bash

# Function to enable Docker to start on boot for Linux
setup_linux() {
    echo "Configuring Docker to start on boot for Linux..."
    sudo systemctl enable docker
    if [[ $? -eq 0 ]]; then
        echo "Docker is now configured to start on boot."
    else
        echo "Failed to configure Docker to start on boot."
    fi
}

# Function to enable Docker Desktop to start at login for macOS
setup_macos() {
    echo "Configuring Docker Desktop to start on login for macOS..."

    PLIST_FILE="$HOME/Library/LaunchAgents/com.docker.desktop.plist"

    # Create the plist file if it doesn't exist
    if [[ ! -f "$PLIST_FILE" ]]; then
        cat > "$PLIST_FILE" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.docker.desktop</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Applications/Docker.app/Contents/MacOS/Docker</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
EOF
    fi

    # Load the plist file
    launchctl load -w "$PLIST_FILE"
    if [[ $? -eq 0 ]]; then
        echo "Docker Desktop is now configured to start on login."
    else
        echo "Failed to configure Docker Desktop to start on login."
    fi
}

# Detect the OS and run the appropriate setup
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    setup_linux
elif [[ "$OSTYPE" == "darwin"* ]]; then
    setup_macos
else
    echo "Unsupported OS: $OSTYPE"
    exit 1
fi
