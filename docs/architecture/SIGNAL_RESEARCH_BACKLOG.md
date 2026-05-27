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

## Possible First Research Tracks

- track one or two instruments plus one event source family
- compare intraday price movement against event spikes
- build a baseline for "normal" activity before anomaly detection
- start with correlation and monitoring before prediction
