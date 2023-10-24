mkdir nginx && 
cp app-nossl.conf ./nginx/app.conf &&
chmod +x init-letsencrypt.sh &&
docker compose build &&
./init-letsencrypt.sh &&
docker compose down && 

rm ./nginx/app.conf &&
cp app-ssl.conf ./nginx/app.conf
