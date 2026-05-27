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

## Course Project Framing

This repository is primarily a data engineering course project.

The main success criterion is to demonstrate an end-to-end data engineering
solution using the tools taught in the course, including:

- Kafka
- Airflow
- AWS services
- MongoDB
- NiFi
- Apache Spark

Analytical usefulness matters, but perfect predictive accuracy is not required.
The project is allowed to be exploratory as long as it clearly demonstrates
data ingestion, movement, orchestration, storage, processing, and analysis.

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

## Initial Instrument Scope

The first working market universe should start with broad, liquid benchmark
instruments across major categories:

- indexes:
  - S&P 500
  - Nasdaq 100
  - Tel Aviv 125
- commodities:
  - gold
  - silver
  - oil
  - wheat
- foreign exchange:
  - USD/ILS
  - EUR/ILS
  - JPY/ILS
  - GBP/ILS

These are the initial research instruments, not a fixed long-term list.

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

## Initial Signal Priorities

The first externally-oriented signal families to prioritize are:

- global shipping and vessel movement activity
- global airline and flight activity
- Google Trends trending-search snapshots

These sources are intended to support both broad monitoring and correlation
analysis against the selected market instruments.

## Initial Signal Handling Recommendations

For the first version of the platform:

- prefer aggregated shipping indicators over per-vessel intelligence
- prefer aggregated airline indicators over per-flight intelligence
- collect top Google Trends snapshots rather than trying to infer exact search
  counts
- start with correlation and lag monitoring before attempting prediction

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
- produce an end-to-end project narrative that clearly showcases data
  engineering capabilities

## Time Resolution Expectations

- Version 1 should use a unified 10-minute polling cadence for consistency
  across sources and downstream aggregations.
- Version 1 aggregations should align to 10-minute windows unless a source
  requires a coarser natural refresh cycle.
- Market data may still be analyzed intraday within this 10-minute resolution.
- External event sources may arrive at mixed frequencies, so time alignment and
  lag analysis are core design concerns.
- Google Trends snapshots should be collected on a 10-minute cadence, which
  matches the source's approximate refresh rhythm well enough for version 1.

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
- Prefer aggregated activity indicators first for shipping and airlines before
  attempting fine-grained per-asset or per-route intelligence models.
- Optimize version 1 for a coherent end-to-end course demonstration rather than
  maximum analytical sophistication.
- Treat the first Docker-based Kafka stack as a development and demo
  environment, not as a claim of production-grade operations.
- Prefer Kafka in KRaft mode for new infrastructure work unless a specific
  course deliverable requires demonstrating ZooKeeper-based Kafka.
- Prefer a first local Kafka topology with 3 brokers for replication-oriented
  learning and demonstration.
- Prefer Apache Kafka upstream Docker images for the initial Kafka environment
  so the project stays close to the open-source, vanilla Kafka distribution.
- Prefer default service ports internally and keep host-port remapping easy so
  the local stack can adapt as more services are added later.

## Suggested Next Decisions

- Define the first real version-1 workflow.
- Confirm the exact ticker or proxy mapping for the initial instrument list.
- Choose the first operational metrics for shipping and airline monitoring.
- Decide how Google Trends snapshots should be stored and versioned.
- Map each course tool to a deliberate role in the architecture.
- Define a common timestamp and metadata strategy across all sources.
- Decide what qualifies as raw, standardized, and curated output.
- Decide when Kafka, Spark, Airflow, and Docker become justified rather than
  aspirational.

## How To Use This File

In future sessions, use this file as the project memory anchor so discussions
start from the same assumptions even if chat memory is unavailable.
