#!/bin/bash

pm2 save
echo "Saved PM2 process list"

PM2_START_UP_CMD=$(pm2 startup | tail -n 1)
eval PM2_START_UP_CMD
echo "Configured PM2 to start on system boot"