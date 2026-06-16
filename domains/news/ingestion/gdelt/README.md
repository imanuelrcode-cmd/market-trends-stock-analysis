# GDELT Ingestion

Purpose:

- Discover market-relevant news narratives, events, entities, themes, and
  supporting headline evidence.
- Support dashboard narrative shifts and later curated theme labels.

Access:

- Data page: https://www.gdeltproject.org/data.html
- GDELT 2.0 data updates every 15 minutes.
- Initial API family to evaluate: DOC 2.0 JSON API.
- Example query shape:
  `https://api.gdeltproject.org/api/v2/doc/doc?query=semiconductor&mode=ArtList&format=json`

Version 1 approach:

- Start with query-based snapshots for tracked themes such as AI, Nvidia,
  semiconductors, data centers, energy, healthcare, utilities, finance, and
  macro events.
- Store raw responses with source URL, query, request time, response time,
  result count, and article-level metadata.
- Avoid broad full-dataset ingestion until the dashboard use case and storage
  layout are clearer.
