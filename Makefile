DOCKER_COMPOSE_FILE=docker-compose.yml

run:
	docker compose up --build -d

Compra_test:
	python3 -m unittest ./tests/Compra_test.py

Product_test:
	npm test