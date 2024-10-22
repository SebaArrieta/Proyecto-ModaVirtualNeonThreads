DOCKER_COMPOSE_FILE=docker-compose.yml

run:
	docker compose -f $(DOCKER_COMPOSE_FILE) up --build

Compra_test:
	docker compose -f $(DOCKER_COMPOSE_FILE) up --build -d server
	python3 -m unittest tests/Compra_test.py

User_test: 
	docker compose -f $(DOCKER_COMPOSE_FILE) up --build -d server
	python3 -m unittest tests/User_test.py