# Course Project Priorities

## Primary Goal

This project should demonstrate an end-to-end data engineering workflow more
than it demonstrates predictive-model quality.

## Success Criteria

- show ingestion from multiple external sources
- show data movement through the chosen platform components
- show scheduling and orchestration
- show raw and processed storage layers
- show transformation and aggregation
- show queryable outputs or monitoring outputs
- show a believable analytical use case, even if predictive accuracy is modest

## Preferred Tool Story

The project should make deliberate use of the course technologies:

- Kafka: event transport or streaming boundary
- Airflow: scheduling and orchestration
- AWS services: cloud storage or deployment support
- MongoDB: document-oriented raw or semi-structured storage
- NiFi: flow-based ingestion and routing where appropriate
- Apache Spark: transformations, aggregations, or analytical preparation

## Local Infrastructure Approach

For version 1, local infrastructure should be introduced gradually and only
when each component has a clear story in the pipeline.

Recommended first local stack:

- Apache Kafka in KRaft mode
- a lightweight Kafka UI such as Kafdrop for development visibility

ZooKeeper should be treated as legacy course context, not the default choice
for new infrastructure unless a specific exercise requires it.

Use one unified local `docker-compose.yml` for the first working stack instead
of separate compose files per service.

Prefer upstream Apache Kafka images first so the local environment stays close
to the open-source Kafka distribution taught in the course.

## Dev Versus Production Framing

- A local Docker Compose stack is the right development and demo environment for
  version 1.
- Kafdrop is a development aid, not an important production component.
- A single-node or simplified Kafka plus ZooKeeper Docker setup is suitable for
  learning and course demonstration, but should not be presented as a
  production-grade deployment by industry standards.
- A single-node KRaft-based Kafka setup is also a demo environment, but it is
  closer to the direction of modern Kafka deployments.
- If the course requires a more production-like story later, the architecture
  can still use the same components while distinguishing between local demo
  infrastructure and cloud or scaled deployment targets.

## Version 1 Simplifications

- use a unified 10-minute polling cadence
- prefer aggregated activity signals over fine-grained entity intelligence
- start with a limited market universe
- prioritize observability and data lineage over prediction complexity
- treat predictions as optional or exploratory

## Anti-Goals For Version 1

- proving a high-accuracy trading strategy
- building a perfect real-time system
- ingesting every possible signal source before the first demo works
- overengineering infrastructure before the pipeline narrative is clear
