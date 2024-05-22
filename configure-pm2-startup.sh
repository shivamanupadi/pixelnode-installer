#!/bin/bash

pm2 save
echo "Saved PM2 process list"

setup_linux_pm2() {
    pm2 startup
    echo "Configured PM2 to start on system boot"
}

# Detect the OS and run the appropriate setup
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    setup_linux_pm2
else
    echo "Unsupported OS: $OSTYPE"
    exit 1
fi


