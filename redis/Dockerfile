FROM debian:bullseye

RUN     apt-get update -y
RUN     apt-get upgrade -y
RUN     apt-get install redis-server -y

RUN service redis-server restart

CMD ["redis-server", "--protected-mode", "no", "--bind", "0.0.0.0"]