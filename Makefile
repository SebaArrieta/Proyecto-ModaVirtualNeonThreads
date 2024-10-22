# Makefile

# Variable para definir el archivo de Docker Compose
DOCKER_COMPOSE_FILE=docker-compose.yml

# Comando para ejecutar docker-compose up --build
run:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up --build

# Comando para ejecutar unittest en el archivo compra_test.py
compra_test:
	python3 -m unittest tests/Compra_test.py

# Comando que combina ambos: ejecutar el entorno Docker y las pruebas
build_compra_test:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up --build -d server
	python3 -m unittest tests/Compra_test.py
