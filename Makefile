DOCKER_COMPOSE_FILE=docker-compose.yml

run:
	docker compose up --build

Compra_test:
	python3 -m unittest ./tests/Compra_test.py