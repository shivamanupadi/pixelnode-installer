PORT=8000 pm2 start ecosystem.config.js

echo -e "\033[32m\nCongratulations! Your pixelnode instance is ready to use.\n\033[0m"
echo -e "\033[32m\nPlease visit http://$(curl -4s https://ifconfig.io):8000 to get started.\n\033[0m"