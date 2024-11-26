DOCKER_COMPOSE_FILE=docker-compose.yml

run:
	docker compose up --build

stop:
	docker stop proyecto-modavirtualneonthreads-server-1
	docker stop proyecto-modavirtualneonthreads-client-1

Compra_test:
	python3 -m unittest ./tests/Compra_test.py

User_test:
	python3 -m unittest ./tests/User_test.py