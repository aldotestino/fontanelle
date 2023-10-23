FROM nginx
COPY aldotestino.online /etc/nginx/sites-available/aldotestino.online
RUN htpasswd -c /etc/nginx/.htpasswd-aldotestino.online root
RUN sudo ln -s /etc/nginx/sites-available/aldotestino.online /etc/nginx/sites-enabled/
RUN sudo systemctl restart nginx
RUN sudo ufw allow 'Nginx Full'
RUN sudo apt-add-repository -r ppa:certbot/certbot
RUN sudo apt-get update
RUN sudo apt-get install python3-certbot-nginx
RUN sudo certbot --nginx -d fontanelleapi.aldotestino.online
RUN sudo certbot renew --dry-run