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
- suitable for academic/research usage

---

# 2. Stock Market Data

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

# 3. RapidAPI Marketplace

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
- RSS feeds
- GDELT

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
| Stock Prices | yfinance |

This minimizes architectural complexity while still enabling meaningful analysis.

RapidAPI should be treated as an optional source-discovery path for future
shipping, airline, news, macro, and alternative market-signal experiments.

---

# Data Engineering Design Principle

The project should preserve:

```text
raw -> processed -> analytics
