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
- curated trend theme labels, such as "AI attention wave" or "Nvidia earnings
  attention"

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
- keep dashboard theme labels out of raw ingestion; add them only in curated or
  enriched datasets

## Theme Labeling Ideas

- start with deterministic rules that map dominant terms or term groups to a
  readable theme label
- include supporting terms and related instruments so labels are explainable
- track whether a label is a continuation of the previous phase or a new theme
- later evaluate a LangGraph or LLM helper for richer labels using trends, news,
  market movement, and recent phase history
- store confidence and evidence fields with any generated label

## Source Discovery Channels

- direct public APIs where available
- GDELT for open news/event discovery
- Wikimedia Analytics API for clean pageview attention metrics
- Google News RSS query feeds for lightweight headline ingestion and Kafka
  practice
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
- prototype curated theme labels for dashboard readability without implying
  predictive certainty

## Current Front-Runner Scope

### First External Sources

- Google Trends trending snapshots
- GDELT news/event snapshots
- Google News RSS headline snapshots
- Wikimedia Pageviews entity attention snapshots

### First Market Universe

- indexes: S&P 500, Nasdaq 100, Tel Aviv 125
- commodities: gold, silver, oil, wheat
- FX: USD/ILS, EUR/ILS, JPY/ILS, GBP/ILS

### Initial Practical Notes

- Version 1 should use a unified 10-minute polling and aggregation cadence.
- Google Trends trending data fits well into a 10-minute snapshot schedule.
- GDELT should follow its natural 15-minute update rhythm or a coarser demo
  schedule.
- Google News RSS is especially useful as a small Kafka producer source, but
  needs deduplication.
- Wikimedia Pageviews should be daily/backfill-oriented rather than 10-minute
  polling.
- If RapidAPI providers are tested, capture provider-specific metadata,
  response-shape differences, and cost constraints from the start.
- The first implementation should optimize for end-to-end demonstrability as a
  data engineering course project, not for maximum model accuracy.
