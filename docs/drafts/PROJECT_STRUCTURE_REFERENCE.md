
# Project Structure Reference

## domains/
Contains business domains. Each domain owns its ingestion, transformations, schemas, and services.

### market_data/
Handles stock prices, OHLCV data, options data, and financial metadata.

- ingestion/
  Fetches external data from APIs like Yahoo Finance.

- transformations/
  Cleans and normalizes incoming data.

- schemas/
  Defines data contracts and validation schemas.

- validation/
  Quality checks and integrity validation.

- services/
  Business operations and orchestration logic.

- configs/
  Domain-specific settings and parameters.

### trends/
Handles market trends and external trend signals.

### news/
Handles news ingestion and news processing pipelines.

### sentiment/
Handles NLP pipelines, sentiment scoring, and sentiment models.

### macro/
Handles macroeconomic indicators and economic datasets.

---

## data_lake/
Centralized storage lifecycle.

### raw/
Immutable source data exactly as collected.

### standardized/
Normalized and cleaned datasets.

### curated/
Feature-engineered and business-ready datasets.

### analytics/
Aggregated insights, reports, and predictions.

### models/
Serialized ML models and training artifacts.

---

## streaming/
Kafka and event streaming architecture.

### producers/
Publish events into streaming infrastructure.

### consumers/
Consume and process stream events.

### contracts/
Message schemas and event contracts.

### topics/
Topic definitions and streaming metadata.

---

## orchestration/
Workflow scheduling and pipeline coordination.

### jobs/
Standalone executable jobs.

### pipelines/
Multi-step orchestration workflows.

### schedules/
Scheduling metadata and cron definitions.

### airflow/
Airflow DAGs and plugins.

---

## shared/
Reusable cross-domain utilities.

### logging/
Centralized logging utilities.

### configs/
Shared configuration loading.

### exceptions/
Custom exceptions and error handling.

### monitoring/
Metrics and observability helpers.

### utils/
Generic reusable utility functions.

### clients/
Shared API/database client wrappers.

---

## infrastructure/
Infrastructure-as-code and deployment definitions.

### docker/
Dockerfiles and compose configurations.

### aws/
AWS infrastructure definitions.

### terraform/
Terraform IaC modules.

### kubernetes/
Kubernetes manifests and deployment files.

---

## tests/
Testing strategy separated by scope.

### unit/
Small isolated tests.

### integration/
Cross-service and pipeline tests.

### performance/
Benchmarking and load testing.

---

## notebooks/
Research and experimentation only.

### exploration/
EDA and data understanding.

### experiments/
Temporary experiments and prototyping.

---

## docs/
Technical documentation.

### architecture/
Architecture diagrams and decisions.

### data_contracts/
Data schema documentation.

### runbooks/
Operational and troubleshooting guides.

---

## configs/
Environment-level configuration.

### local/
Local developer settings.

### dev/
Development environment settings.

### prod/
Production environment settings.

---

## requirements/
Dependency management.

### base.txt
Core dependencies.

### dev.txt
Development and testing dependencies.
