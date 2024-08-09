FROM debian:bullseye
ENV PYTHONUNBUFFERED 1

# Install Python 3.9
RUN apt-get update && apt-get install -y python3.9 python3-pip zsh git curl
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

RUN mkdir -p /var/app
WORKDIR /var/app
COPY requirements.txt /var/requirements.txt
RUN pip3 install -r /var/requirements.txt
EXPOSE 8000

COPY start.sh /var/app/start.sh
ENTRYPOINT [ "sh", "build-tools/start.sh" ]

