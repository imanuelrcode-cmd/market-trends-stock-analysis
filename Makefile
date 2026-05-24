run:
	docker-compose up

test:
	pytest

format:
	black .
