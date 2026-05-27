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
