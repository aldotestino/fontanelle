docker compose build &&
chmod +x init-letsencrypt.sh &&
./init-letsencrypt.sh &&
docker compose up