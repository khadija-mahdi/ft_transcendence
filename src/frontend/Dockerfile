FROM debian:bullseye

RUN apt-get update

RUN apt-get install -y zsh curl gnupg git

RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash -

RUN apt-get -y install nodejs

WORKDIR  /usr/src/app
RUN npm i

CMD ["npm", "start"]
