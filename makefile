all: up

up:
	docker-compose -f ./docker-compose.yml up --build

down:
	docker-compose -f ./docker-compose.yml down

db:
	docker exec backend python3 manage.py loaddata user/seed/seed.json
	docker exec backend python3 manage.py loaddata game/seed/seed.json

fclean: down
	docker rmi $$(docker images -a -q) &2>/dev/null
	docker network rm $$(docker network ls -q) &2>/dev/null
	docker volume rm $$(docker volume ls -q) &2>/dev/null

clean_cache: fclean
	docker system prune -a
	
clear_volume: down
	docker volume rm $$(docker volume ls -q) &2>/dev/null