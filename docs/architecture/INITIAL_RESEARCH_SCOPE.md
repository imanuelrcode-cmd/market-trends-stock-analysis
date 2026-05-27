# Initial Research Scope

## Goal

Define the first researchable slice of the platform without overcommitting to a
full production architecture.

## First Signal Families

- shipping and vessel movement activity
- airline and flight activity
- Google Trends trending-search snapshots

## First Instrument Universe

### Indexes

- S&P 500
- Nasdaq 100
- Tel Aviv 125

### Commodities

- gold
- silver
- oil
- wheat

### Foreign Exchange

- USD/ILS
- EUR/ILS
- JPY/ILS
- GBP/ILS

## Why This Scope Works

- It is broad enough to test cross-asset reactions.
- It keeps the market universe small enough to manage early on.
- It mixes global and Israel-relevant instruments.
- It supports both same-window and delayed-correlation research.

## Recommended Early Analysis Style

- collect raw snapshots first
- build baseline activity metrics for each source
- detect unusual changes relative to normal levels
- align signals using a shared 10-minute cadence
- evaluate delayed reactions across multiple lag windows

## Version 1 Cadence

- Poll all first-version sources every 10 minutes for a consistent pipeline.
- Build first-version aggregations on 10-minute windows.
- Preserve source-native timestamps even when normalizing to 10-minute buckets.

## Important Caveat

The unified 10-minute cadence is a version-1 simplification for consistency and
demonstration value. It should not be mistaken for the natural refresh
frequency or semantic granularity of every source.
