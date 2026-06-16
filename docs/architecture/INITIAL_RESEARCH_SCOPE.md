# Initial Research Scope

## Goal

Define the first researchable slice of the platform without overcommitting to a
full production architecture.

## First Signal Families

- Google Trends trending-search snapshots
- GDELT news/event discovery
- Google News RSS headline streams
- Wikimedia Pageviews public-attention metrics

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
- It matches the dashboard direction: public-attention and narrative signals
  compared against market instruments.

## Recommended Early Analysis Style

- collect raw snapshots first
- build baseline activity metrics for each source
- detect unusual changes relative to normal levels
- align signals using a shared 10-minute cadence
- evaluate delayed reactions across multiple lag windows

## Version 1 Cadence

- Use 10-minute windows as the first shared analytical alignment layer.
- Poll Google Trends around the 10-minute range only if access remains safe and
  rate-limit friendly.
- Poll GDELT around its natural 15-minute update rhythm or coarser.
- Poll Google News RSS conservatively and deduplicate items before downstream
  processing.
- Refresh Wikimedia Pageviews daily or through backfill jobs.
- Preserve source-native timestamps even when normalizing to 10-minute buckets.

## Important Caveat

The unified 10-minute cadence is a version-1 simplification for consistency and
demonstration value. It should not be mistaken for the natural refresh
frequency or semantic granularity of every source.

For API and access details, see `SOURCE_ACCESS_STRATEGY.md`.
