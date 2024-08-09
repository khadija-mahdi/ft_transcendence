FROM node:alpine

WORKDIR /var/www/html/src
COPY . .
RUN npm install -g serve
COPY ./serve.json .
CMD ["serve", "-s", ".", "-l", "3000"]
