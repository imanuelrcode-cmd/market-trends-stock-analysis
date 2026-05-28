# Logging Strategy

## Purpose

Logging is part of the ingestion platform, not just local debugging output.
Collectors, scheduled jobs, Airflow tasks, and future services should use one
shared logging approach so operational behavior is easy to follow later.

## Current Decision

- Use the standard Python `logging` package through the project helper in
  `shared/logging/`.
- Configure logging once at process entry points with `configure_logging(...)`.
- Create module loggers with `get_logger(__name__)`.
- Write logs to `stdout` so Airflow, Docker, cloud runtimes, and log shippers
  can collect them without each script managing log files.
- Prefer structured context through `extra={...}` fields.
- Use `logger.exception(...)` inside exception handlers so the traceback is
  preserved automatically.
- Avoid `print(...)` in ingestion, orchestration, and reusable project code.

## Usage Pattern

```python
from shared.logging import configure_logging, get_logger

logger = get_logger(__name__)


def fetch_source_data() -> None:
    logger.info("Fetching source data", extra={"source": "example"})

    try:
        ...
    except Exception:
        logger.exception("Source fetch failed", extra={"source": "example"})
        raise


if __name__ == "__main__":
    configure_logging(service_name="example_collector")
    fetch_source_data()
```

## Runtime Configuration

The shared logger supports environment-based configuration:

- `MARKET_TRENDS_LOG_LEVEL`: controls log level, defaulting to `INFO`.
- `MARKET_TRENDS_LOG_FORMAT`: use `text` locally or `json` for structured log
  collection.

Text logs are easier during local development. JSON logs are better once logs
are collected by Airflow, containers, cloud logging, or a future streaming
pipeline.

## Ingestion Guidelines

- Log the start and end of each ingestion run.
- Include source names, regions, tickers, provider names, output paths, record
  counts, rate-limit hints, and retry metadata where available.
- Do not log secrets, API tokens, full authorization headers, or sensitive raw
  payloads.
- Let exceptions propagate after logging them unless the caller intentionally
  handles partial failures.
- Keep business events and observability logs separate. Kafka topics should
  carry ingestion data or pipeline events; logs should first go through stdout
  and the runtime logging system.

## Future Streaming Direction

For version 1, stdout logging is the right foundation. Airflow and container
runtimes can capture those logs without extra code in every collector.

If the project later needs centralized log analytics, keep the collector code
unchanged and add collection infrastructure around it, such as Airflow log
storage, cloud logging, OpenTelemetry, or a log shipper that forwards JSON logs
to Kafka, Elasticsearch, S3, or another observability sink.
