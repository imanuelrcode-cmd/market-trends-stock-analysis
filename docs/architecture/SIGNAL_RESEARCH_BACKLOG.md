# Signal Research Backlog

## Purpose

This document captures candidate signal families, research questions, and
ingestion ideas for future planning sessions. It is a brainstorming aid, not a
committed implementation roadmap.

## Initial Signal Families

### Market Data

- equities
- ETFs
- commodities
- FX pairs
- indexes

### Trend and Attention Signals

- search-interest data
- topic popularity
- social attention spikes

### Logistics and Mobility

- ship movement and voyage activity
- port congestion or traffic changes
- airline activity and route volume
- flight cancellations or unusual disruptions

### News and Events

- political news
- geopolitical developments
- regulatory changes
- company-specific news
- macroeconomic releases

### Sentiment and Narrative

- financial news sentiment
- event sentiment
- topic clustering
- narrative momentum

## Core Research Questions

- Which external signals move before specific market instruments?
- Which signals correlate only after a delay?
- Which signals are useful as anomaly detectors but not predictors?
- Which signals matter at daily resolution versus intraday resolution?
- Which sources are stable enough for long-term monitoring?

## Time Alignment Questions

- What is the true event timestamp?
- What is the publish timestamp?
- What is the ingestion timestamp?
- What is the relevant market reaction window?
- Should analysis compare immediate, delayed, and cumulative effects?

## Early Normalization Ideas

- keep source-native raw payloads immutable
- attach source metadata to every record
- store timezone information explicitly
- standardize instrument identifiers where possible
- capture expected latency and refresh frequency for each source

## Source Discovery Channels

- direct public APIs where available
- library-backed unofficial sources such as pytrends
- RapidAPI marketplace for shipping, airline, news, macro, and alternative
  market-data provider discovery

## RapidAPI Exploration Targets

- shipping and vessel activity APIs
- flight status, route, and airport activity APIs
- news and event feed APIs
- macroeconomic calendar or indicator APIs
- commodity, FX, or alternative market-data APIs

## Possible First Research Tracks

- track one or two instruments plus one event source family
- compare intraday price movement against event spikes
- build a baseline for "normal" activity before anomaly detection
- start with correlation and monitoring before prediction

## Current Front-Runner Scope

### First External Sources

- shipping and vessel activity
- airline and flight activity
- Google Trends trending snapshots

### First Market Universe

- indexes: S&P 500, Nasdaq 100, Tel Aviv 125
- commodities: gold, silver, oil, wheat
- FX: USD/ILS, EUR/ILS, JPY/ILS, GBP/ILS

### Initial Practical Notes

- Version 1 should use a unified 10-minute polling and aggregation cadence.
- Google Trends trending data fits well into a 10-minute snapshot schedule.
- Shipping and airline sources are likely most useful initially as aggregated
  activity signals, anomaly signals, and region/time-window counts.
- If RapidAPI providers are tested, capture provider-specific metadata,
  response-shape differences, and cost constraints from the start.
- The first implementation should optimize for end-to-end demonstrability as a
  data engineering course project, not for maximum model accuracy.
