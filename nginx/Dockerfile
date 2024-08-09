FROM debian:bullseye
RUN apt-get -y update
RUN apt-get install nginx -y &&\
    apt-get install openssl -y &&\
    apt-get install curl  -y 

# Generate a Self-Signed Certificate:
RUN openssl req -x509 -newkey rsa:4096 -keyout /etc/ssl/private/server.key -out /etc/ssl/certs/server.crt -days 365 -nodes \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=yourdomain.com/emailAddress=email@example.com"

COPY conf/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
