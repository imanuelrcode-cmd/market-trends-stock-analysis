# Architecture Notes

## Current Phase

The project is currently in repository-design and scaffold-validation mode.
Exploratory scripts may exist, but they are not yet the architectural source of
truth.

## Planned Flow

External Sources -> Domain Ingestion -> Data Layers -> Processing/Orchestration
-> Analytics

Streaming components such as Kafka, and distributed processing components such
as Spark, will be introduced only when they are justified by a concrete
pipeline.

## Initial Goals

1. Finalize repository and ownership boundaries
2. Implement the first real ingestion workflow
3. Store datasets consistently in `data/raw/`
4. Add standardization and curated layers only after raw ingestion is stable
5. Introduce orchestration, streaming, and heavier infrastructure incrementally
