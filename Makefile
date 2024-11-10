DOCKER_COMPOSE_FILE=docker-compose.yml

run:
	AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) AWS_REGION=$(AWS_REGION) docker compose up --build -d

Compra_test:
	python3 -m unittest ./tests/Compra_test.py