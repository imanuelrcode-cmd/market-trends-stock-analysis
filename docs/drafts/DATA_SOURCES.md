# Data Sources Research

## Overview

This document describes the planned external data sources for the Market Trends & Stock Behavior Analysis Platform.

The goal is to combine trend-related public interest data with stock market data in order to analyze potential relationships and predictive patterns.

---

# Selected Data Sources

## 1. Google Trends

### Tool
- pytrends (unofficial Google Trends API)

### Repository
https://github.com/GeneralMills/pytrends

### Purpose
Used to collect:
- keyword popularity over time
- trend spikes
- regional interest
- related searches
- trending topics

### Potential Use Cases
| Trend Topic | Related Stocks |
|---|---|
| AI | NVDA, AMD, MSFT |
| Electric Vehicles | TSLA, RIVN |
| Bitcoin | COIN, MSTR |
| Weight Loss Drugs | LLY, NVO |

### Notes
- pytrends is unofficial
- Google rate limiting may occur
- Google introduced an official Trends API in alpha in 2025, but project access
  should still be treated as limited until verified
- suitable for academic/research usage

---

## 2. GDELT

### Tool
- GDELT DOC 2.0 API, GDELT raw data files, or BigQuery exports

### Website
https://www.gdeltproject.org/data.html

### Purpose
Used to collect:
- news article evidence
- event and narrative discovery signals
- entities, themes, locations, and media attention
- source evidence for dashboard narrative markers

### Why It Fits This Project
- broad free/open news and event source
- GDELT 2.0 updates every 15 minutes
- useful for discovering why a trend may be moving, not only that it is moving
- can later support curated labels such as "Data center buildout" with evidence

### Initial Access Pattern
Start with query-based DOC API snapshots rather than full global ingestion.

Example shape:
`https://api.gdeltproject.org/api/v2/doc/doc?query=semiconductor&mode=ArtList&format=json`

---

## 3. Google News RSS

### Tool
- RSS feed ingestion

### Access Pattern
`https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en`

### Purpose
Used to collect:
- timely headlines
- source/publisher snippets
- simple query-driven news streams
- Kafka practice data

### Important Notes
- Treat this as a practical RSS pattern, not a formal guaranteed API contract.
- Good for lightweight demo and streaming practice.
- Requires deduplication because headlines can repeat, update, or redirect.

---

## 4. Wikimedia Pageviews

### Tool
- Wikimedia Analytics API

### Documentation
https://doc.wikimedia.org/generated-data-platform/aqs/analytics-api/reference/page-views.html

### Purpose
Used to collect:
- public attention counts for known pages and entities
- daily attention around companies, topics, and sector themes
- clean supporting metrics for dashboard overlays or annotations

### Initial Access Pattern
Endpoint shape:
`https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/{project}/{access}/{agent}/{article}/{granularity}/{start}/{end}`

Example dimensions:
- project: `en.wikipedia.org`
- access: `all-access`
- agent: `user`
- granularity: `daily`

### Important Notes
- Best used as a supporting signal for known entities, not as primary narrative
  discovery.
- Use a descriptive User-Agent when implementing collectors.
- Daily refresh/backfill fits better than 10-minute polling.

---

# 5. Stock Market Data

## Tool
- yfinance

### Repository
https://github.com/ranaroussi/yfinance

### Purpose
Used to collect:
- historical stock prices
- trading volume
- stock metadata
- market indicators

### Advantages
- simple Python integration
- free usage
- widely used in data science projects

---

# 6. RapidAPI Marketplace

## Tool
- RapidAPI

### Website
https://rapidapi.com

### Purpose
Used to discover and test third-party APIs for:
- shipping and vessel activity
- airline and flight activity
- news and event feeds
- macroeconomic calendars and indicators
- alternative market, commodity, or FX datasets

### Why It Fits This Project
- gives one place to explore multiple providers quickly
- can accelerate early prototyping when direct public APIs are limited
- helps compare source options across several signal families

### Important Notes
- RapidAPI is a source marketplace, not a single canonical dataset
- pricing, rate limits, uptime, and schemas vary by provider
- each adopted API should still be evaluated for stability, coverage, and data quality

---

# Optional Future Sources

## Alpha Vantage
https://www.alphavantage.co

Potential usage:
- technical indicators
- fundamentals
- additional market APIs

---

## News APIs / Sentiment Sources

Potential future integrations:
- Reddit APIs
- NewsAPI

Purpose:
- sentiment analysis
- event correlation
- public opinion tracking

---

# Initial Scope Recommendation

Version 1 of the project should focus on:

| Data Type | Source |
|---|---|
| Trends | pytrends |
| News and events | GDELT |
| Headline stream | Google News RSS |
| Public attention | Wikimedia Pageviews |
| Stock Prices | yfinance |

This keeps the first dashboard close to the current demo: animated trend terms
and narrative markers on one side, market prices and ETFs on the other.

RapidAPI should be treated as an optional source-discovery path for future
shipping, airline, news, macro, and alternative market-signal experiments.

Detailed API access notes are maintained in
`docs/architecture/SOURCE_ACCESS_STRATEGY.md`.

---

# Data Engineering Design Principle

The project should preserve:

```text
raw -> processed -> analytics
