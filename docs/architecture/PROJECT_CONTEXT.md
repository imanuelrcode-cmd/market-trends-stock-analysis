# Project Context

## Purpose

This project is a data engineering and analytics platform scaffold focused on
studying relationships between external events, market signals, and financial
instrument behavior.

The long-term goal is to ingest many kinds of event and market data, organize
them into clear data layers, and support analytics that explain, monitor, and
possibly predict market movement.

## Current Reality

- The repository is intentionally scaffold-first.
- Existing Python collectors are exploratory drafts for connectivity only.
- Folder structure and documentation are the current source of truth.
- Requirements, Docker, and workflow files are placeholders until the first
  real pipeline is defined.

## Repository Design Principles

- Organize code by business domain first.
- Keep shared utilities separate from domain logic.
- Use layered storage in `data/`:
  - `raw/`
  - `standardized/`
  - `curated/`
  - `analytics/`
- Introduce orchestration, streaming, and heavier infrastructure only when they
  solve a concrete need.
- Preserve timestamps carefully and distinguish between event time, publish
  time, collection time, and market time.
- Prefer raw data retention first, with transformations added only after source
  behavior is understood.

## Target Instruments

The set of tracked instruments is expected to change over time and may include:

- equities and ETFs
- commodities
- foreign exchange pairs
- indexes or proxies where useful

Instrument selection is user-driven and may expand or rotate during research.

## Signal Families

The project is expected to ingest and compare many external signal types,
including but not limited to:

- market trend and search-interest data
- shipping and vessel movement activity
- airline activity and travel volume signals
- political news and geopolitical developments
- macroeconomic indicators
- news and sentiment signals
- supply-chain or logistics indicators

Additional event sources are expected to be added over time as research needs
become clearer.

## Business Domains

- `domains/market_data/`: stock-market and financial datasets
- `domains/trends/`: trend and public-interest signals
- `domains/news/`: future news ingestion and processing
- `domains/sentiment/`: future NLP and sentiment workflows
- `domains/macro/`: future macroeconomic datasets

The current domain list is not final. New domains may be introduced if specific
signal families become large enough to deserve clear ownership boundaries.

## Core Analysis Goals

- collect diverse event and market data before over-optimizing models
- monitor changes, anomalies, and unusual activity relative to normal baselines
- measure correlation between external signals and market movement
- evaluate delayed or lagged effects, not only same-time reactions
- compare signals across multiple time horizons, including intraday windows
- support exploratory research before committing to predictive claims

## Time Resolution Expectations

- Market data may eventually be analyzed at intraday resolution, including
  5-minute intervals when useful and available.
- External event sources may arrive at mixed frequencies, so time alignment and
  lag analysis are core design concerns.

## Current Agreements

- Ignore draft implementation details when discussing architecture.
- Use `data/` consistently as the storage root in documentation.
- Keep dependency files minimal until a supported workflow exists.
- Keep Git clean by ignoring logs, generated data, local environments, and
  notebook artifacts.
- Treat broad event collection and correlation monitoring as first-class goals,
  not just stock-price ingestion.
- Favor flexible schemas and source metadata so new signal types can be added
  without redesigning the whole repository.

## Suggested Next Decisions

- Define the first real version-1 workflow.
- Choose the first market instruments to track.
- Choose the first external event source family to ingest.
- Define a common timestamp and metadata strategy across all sources.
- Decide what qualifies as raw, standardized, and curated output.
- Decide when Kafka, Spark, Airflow, and Docker become justified rather than
  aspirational.

## How To Use This File

In future sessions, use this file as the project memory anchor so discussions
start from the same assumptions even if chat memory is unavailable.
