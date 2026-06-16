# Google News RSS Ingestion

Purpose:

- Provide simple, timely headline ingestion.
- Give the project a practical Kafka producer source without paid API access.
- Supply human-readable evidence for dashboard narrative markers.

Access:

- Treat Google News RSS as a practical RSS feed pattern, not a formal guaranteed
  API contract.
- Search feed shape:
  `https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en`

Version 1 approach:

- Poll a small list of tracked queries and publish raw feed items to Kafka later.
- Store item title, link, publisher/source, published timestamp, query, feed URL,
  and ingestion timestamp.
- Deduplicate by stable link or a hash of title, source, and published time.
- Prefer conservative polling and cache-aware behavior.
