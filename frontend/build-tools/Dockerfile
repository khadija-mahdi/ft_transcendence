FROM node:alpine

WORKDIR /var/www/html

COPY . .

COPY script.sh .
# CMD [ "tail", "-f", "/dev/null" ]
ENTRYPOINT ["sh", "build-tools/script.sh"]