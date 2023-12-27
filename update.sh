git reset --hard origin/master
git pull
yarn install

bash createEnv.sh
pm2 restart pixelnode

echo -e "\033[32mPixelNode upgraded successfully. Running on PORT 8000. Open your server in the browser on the port 8000\033[0m"

