# News Ingestion

Source-specific news collectors live here.

Initial planned collectors:

- `gdelt/`: GDELT news/event and article-search ingestion.
- `google_news_rss/`: Google News RSS query-feed ingestion.

Collectors should use the shared project logging helpers and include source,
query, cadence, result counts, and rate-limit or access metadata in logs.
