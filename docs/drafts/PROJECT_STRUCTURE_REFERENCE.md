# Project Structure Reference

This document describes the intended repository layout during the scaffold
phase. It reflects the current folder structure, not the exploratory draft code.

## Top-Level Design

The repository is organized around:

- business domains
- shared platform utilities
- layered data storage
- orchestration and streaming boundaries
- infrastructure and documentation

## domains/

Contains business-aligned areas of ownership. Each domain can eventually own
its own ingestion, transformations, schemas, validations, and services.

### market_data/

Owns stock prices, OHLCV data, ticker metadata, and related market datasets.

- `ingestion/`: external market-data collection
- `transformations/`: cleaning and normalization
- `schemas/`: contracts and validation rules
- `validation/`: data-quality checks
- `services/`: domain orchestration logic
- `configs/`: domain-specific settings

### trends/

Owns trend and public-interest signals such as keyword popularity or related
search activity.

### news/

Reserved for news ingestion and event-oriented content processing.

### sentiment/

Reserved for NLP pipelines, scoring logic, and future model assets.

### macro/

Reserved for macroeconomic indicators and broader economic datasets.

## data/

Represents the storage lifecycle for datasets and analytical outputs.

### raw/

Immutable source data captured as close as possible to the original input.

### standardized/

Normalized datasets with consistent schemas and naming.

### curated/

Business-ready datasets, features, and enriched outputs.

### analytics/

Reports, derived insights, correlation outputs, or model-ready extracts.

### models/

Serialized model artifacts or experiment outputs when the project reaches that
stage.

## streaming/

Reserved for event-driven components and Kafka-oriented contracts.

- `producers/`: event publishers
- `consumers/`: event consumers
- `contracts/`: message schemas
- `topics/`: topic definitions and metadata

## orchestration/

Reserved for workflow scheduling and pipeline coordination.

- `jobs/`: standalone runnable jobs
- `pipelines/`: multi-step flows
- `schedules/`: scheduling metadata
- `airflow/`: Airflow DAGs and plugins

## processing/

Reserved for shared transformation or compute-heavy processing stages that do
not fit cleanly inside a single domain.

## shared/

Reusable utilities intended to stay domain-agnostic.

- `logging/`: shared logging configuration and logger helpers
- `configs/`: shared configuration loading
- `exceptions/`: common exception types
- `monitoring/`: metrics and observability helpers
- `utils/`: generic utilities
- `clients/`: reusable wrappers for external systems

## infrastructure/

Reserved for deployment and platform setup assets.

- `docker/`: container build assets
- `aws/`: cloud-specific definitions
- `terraform/`: infrastructure-as-code modules
- `kubernetes/`: manifests and deployment resources

## docs/

Project documentation and decision support materials.

- `architecture/`: architecture decisions and diagrams
- `data_contracts/`: dataset and event contract documentation
- `runbooks/`: operational notes
- `drafts/`: working notes while the design is still evolving

## notebooks/

Exploration-only area for research, validation, and experiments.

- `exploration/`: EDA and quick validation
- `experiments/`: temporary prototypes

## tests/

Reserved for tests once supported workflows are formalized.

- `unit/`: isolated tests
- `integration/`: cross-component tests
- `performance/`: benchmarking and load-oriented tests

## configs/

Environment-level configuration separated from implementation code.

- `local/`: local developer settings
- `dev/`: shared development settings
- `prod/`: production-oriented settings

## requirements/

Dependency placeholders during scaffolding.

- `requirements.txt`: root entrypoint
- `requirements/base.txt`: future runtime dependencies
- `requirements/dev.txt`: future development-only dependencies
