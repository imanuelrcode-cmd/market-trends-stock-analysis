# Docker Infrastructure Layout

This folder contains Docker-related assets that support the local project stack.

## Layout

- `config/`: mounted service configuration files

As the project grows, expected subfolders include:

- `config/kafka/`
- `config/airflow/`
- `config/nifi/`

## Current Convention

- Keep the main `docker-compose.yml` at the repository root.
- Keep service-specific Docker support files under `infrastructure/docker/`.
- Prefer default service ports internally and make host-port remapping easy in
  Compose when collisions appear.

## Kafka Direction

- Use Apache Kafka upstream Docker images.
- Use KRaft mode instead of ZooKeeper for new infrastructure work.
- Start with a local development and demo topology, not a full production
  deployment.
