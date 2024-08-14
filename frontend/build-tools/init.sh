BACKEND_HOST_IP=$(hostname -i | awk '{print $1}')
PORT=443
ENV_FILE=.env

#check if .env file exists
if [ ! -f .env ]; then
    echo ".env file does not exist. Creating file..."
    touch .env
fi

#check if .env file is empty
if [ ! -s .env ]; then
    echo ".env is empty. Writing values..."
    echo "NEXT_PUBLIC_BACKEND_IP=$BACKEND_HOST_IP" > .env
	echo "NEXT_PUBLIC_BACKEND_PORT=$PORT" >> .env
	echo 'NEXT_PUBLIC_BACKEND_HOST=$NEXT_PUBLIC_BACKEND_IP:$NEXT_PUBLIC_BACKEND_PORT' >> .env
else
    sed -i "s|^NEXT_PUBLIC_BACKEND_IP=.*|NEXT_PUBLIC_BACKEND_IP=$BACKEND_HOST_IP|" .env
fi