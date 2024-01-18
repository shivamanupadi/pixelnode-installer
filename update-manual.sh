pm2 delete pixelnode
git reset --hard origin/master
git stash
git pull
yarn install --ignore-engines

bash createEnv.sh
bash createDockerEnv.sh
PORT=8000 pm2 start ecosystem.config.js

echo -e "\033[32mPixelNode upgraded successfully. Running on PORT 8000. Open your server in the browser on the port 8000\033[0m"

