pm2 delete pixelnode
PORT=8000 pm2 start ecosystem.config.js

echo -e "\033[32mPixelNode restarted successfully. Running on PORT 8000. Open your server in the browser on the port 8000\033[0m"

