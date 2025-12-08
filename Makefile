up:
	docker-compose up -d

up-dev:
	docker-compose up

down:
	docker-compose down

build:
	docker-compose build

# Client Web Management
client-web:
	docker-compose up client

client-web-detach:
	docker-compose up client -d

client-web-down:
	docker-compose down client


# Server Management
server-run:
	docker-compose up app

server-detach:
	docker-compose up app -d

server-down:
	docker-compose down app


# Database Management
db:
	docker-compose up mongodb -d

db-inspect:
	docker-compose up mongodb

db-down:
	docker-compose down mongodb
