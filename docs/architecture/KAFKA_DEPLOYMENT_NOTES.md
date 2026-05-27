# Kafka Deployment Notes

## Current Decision

For new work in this project, prefer Kafka in KRaft mode over Kafka with
ZooKeeper.

Use Apache Kafka upstream Docker images as the default image family unless a
specific need appears later.

## Why

- KRaft is the modern Kafka direction.
- It removes the need to operate ZooKeeper for Kafka metadata management.
- It is a better architectural fit for later cloud deployment discussions.
- It keeps the project closer to current Kafka practice while still supporting
  the course narrative.
- Apache Kafka upstream images keep the project close to vanilla, open-source
  Kafka rather than a vendor-specific distribution.

## Course Context

- The course used ZooKeeper because that matched the Kafka version or teaching
  environment.
- That does not mean this project must continue with ZooKeeper.
- ZooKeeper should be treated as important background knowledge, not the
  preferred target architecture for this repo.

## Local Development Position

- A Docker-based KRaft stack is an appropriate local development and course demo
  environment.
- Kafdrop can be included as a development UI.
- This local setup should still be described as a demo or dev deployment, not a
  full production-grade environment.

## Image Choice

For the first local stack, prefer Apache Kafka upstream Docker images:

- `apache/kafka`

This matches the user's learning goals well because it is the open-source,
vanilla Kafka path rather than a platform-specific packaging choice.

## AWS Direction

- Choosing KRaft now does not hurt the later AWS story.
- It should make the cloud story cleaner because modern managed Kafka offerings
  also support KRaft-based clusters.

## Practical Implication

When infrastructure work starts, the first Kafka environment should likely be:

- Kafka in KRaft mode
- Kafdrop for inspection during development

Add more components only after their role in the pipeline is clearly defined.

## Recommended First Local Topology

For the first serious local learning and demo setup, prefer:

- 1 dedicated KRaft controller
- 3 Kafka brokers
- Kafdrop

This fits the course guidance well:

- it supports the "at least 3 brokers" principle
- it is more realistic for replication demonstrations
- it is still small enough for local development
- it is enough to practice topics, partitions, replication, producers, and
  consumers

## What Stays The Same For Learning Kafka

Most day-to-day Kafka learning remains the same in KRaft mode:

- creating topics
- choosing partition counts
- producing messages
- consuming messages
- consumer groups
- offsets
- replication concepts

The main differences are in cluster deployment and metadata management, not in
how application developers use Kafka clients.

## Docker Layout Recommendation

For this repository:

- keep one main `docker-compose.yml` at the project root for the local stack
- use `infrastructure/docker/` for Docker-related assets such as custom
  Dockerfiles, configs, or service-specific container resources
- treat the top-level `docker/` folder as redundant unless it is given a very
  specific purpose
- use `infrastructure/docker/config/` as the home for Docker-mounted config
  files, ideally organized by service when the stack grows
- start Kafka-related config under `infrastructure/docker/config/kafka/`

In short, `docker/` and `infrastructure/docker/` currently overlap in meaning.
The cleaner long-term structure is to keep the root compose file and standardize
supporting Docker assets under `infrastructure/docker/`.

## Port Strategy

For version 1:

- keep container-internal service ports on their defaults whenever practical
- avoid premature custom port schemes unless there is a collision
- keep host-port mapping easy to change later in Docker Compose

This gives a clean starting point while preserving flexibility as MongoDB,
NiFi, Airflow, and other services are added later.

## Deferred Decisions For The Next Session

- define port assignments across Kafka and future services
- define listener strategy for local development
- decide whether Kafka configs should be shared, templated, or split by broker
