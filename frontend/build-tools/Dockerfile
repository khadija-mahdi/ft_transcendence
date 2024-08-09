FROM node:alpine

RUN npm install -g serve

WORKDIR /var/www/html/src

COPY . .

ENTRYPOINT ["serve", "-s", ".", "-l", "3000"]
