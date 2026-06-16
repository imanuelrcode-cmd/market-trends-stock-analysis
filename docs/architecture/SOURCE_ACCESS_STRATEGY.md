# Source Access Strategy

This document is the memory anchor for external source decisions. Future
sessions should read this before adding ingestion code or changing source
priorities.

## Version 1 Source Direction

The dashboard direction is to compare public attention and narrative signals
against market instruments. Version 1 should therefore prioritize sources that
produce time-stamped terms, entities, headlines, attention counts, or topic
evidence.

Recommended first-source stack:

- GDELT for broad news/event and narrative discovery.
- Google News RSS for lightweight near-real-time headline ingestion and Kafka
  practice.
- Wikimedia Pageviews for clean public-attention counts around known entities.
- Google Trends or PyTrends for search-interest validation and trend scoring.
- Market close and ETF data from the market-data domain for comparison graphs.

## GDELT

Purpose:

- Discover news narratives, event clusters, entities, themes, locations, and
  headline evidence.
- Support the dashboard narrative markers, such as "Data center buildout" or
  "Semiconductor supply focus", with external news evidence.

Access:

- Main data page: https://www.gdeltproject.org/data.html
- GDELT 2.0 updates every 15 minutes and is available through raw files,
  BigQuery, and live JSON APIs.
- Useful starting API family: GDELT DOC 2.0 API for article search and timeline
  style queries.
- Example query shape:
  `https://api.gdeltproject.org/api/v2/doc/doc?query=semiconductor&mode=ArtList&format=json`

Implementation notes:

- Treat GDELT as a primary discovery source for narratives.
- Preserve raw payloads because GDELT schemas and API modes are broad.
- Store source timestamps, ingestion timestamps, query terms, mode, format,
  source collection URL, and result counts.
- For Version 1, start with keyword/topic queries tied to tracked terms and
  instruments rather than attempting full global ingestion.

## Wikimedia Pageviews

Purpose:

- Measure public attention for known entities and topics, such as `Nvidia`,
  `Semiconductor`, `Artificial_intelligence`, or sector/company pages.
- Provide a clean, explainable signal that can be charted alongside market
  instruments.

Access:

- Analytics API pageviews docs:
  https://doc.wikimedia.org/generated-data-platform/aqs/analytics-api/reference/page-views.html
- Data is available from July 1, 2015 onward.
- Useful endpoint shape:
  `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/{project}/{access}/{agent}/{article}/{granularity}/{start}/{end}`
- Example project values: `en.wikipedia.org`.
- Example access values: `all-access`, `desktop`, `mobile-app`, `mobile-web`.
- Example agent values: `user`, `spider`, `automated`, `all-agents`.
- Example granularity values: `daily`, `monthly`.

Implementation notes:

- Treat this as a clean supporting attention signal, not as narrative discovery.
- Store page title, normalized article key, project, access, agent,
  granularity, date, views, and ingestion metadata.
- Use a descriptive User-Agent in future collectors.
- Good first cadence is daily backfill plus periodic refresh, not every
  10 minutes, because pageview metrics naturally aggregate by day/month.

## Google News RSS

Purpose:

- Provide simple headline ingestion for Kafka practice.
- Capture timely headline-level evidence around project themes without needing
  a paid news API.

Access:

- Google News RSS is best treated as a practical RSS feed pattern, not as a
  formal guaranteed API contract.
- Search feed shape:
  `https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en`
- Topic/top-news feeds can also be explored, but query feeds are the better
  first fit for this project.

Implementation notes:

- Treat RSS as a lightweight headline source, not canonical article content.
- Store feed URL, query, feed item title, link, source/publisher if present,
  published timestamp, description/snippet if present, and ingestion timestamp.
- Use Kafka topics such as `raw.news.google_rss` or
  `raw.news.headlines.google_rss` once streaming is introduced.
- Expect deduplication work because RSS items can repeat, update, or redirect.

## Source Usage Boundaries

- Use GDELT for broad narrative discovery.
- Use Google News RSS for fast, simple headline streams and Kafka practice.
- Use Wikimedia Pageviews for entity-level attention metrics.
- Use Google Trends for search-interest validation and relative scoring.
- Use RapidAPI as a marketplace for optional provider discovery, not as a
  source-quality guarantee.
