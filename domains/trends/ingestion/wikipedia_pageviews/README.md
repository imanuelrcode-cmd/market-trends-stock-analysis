# Wikimedia Pageviews Ingestion

Purpose:

- Track public attention for known entities and topics using clean pageview
  counts.
- Provide supporting signals for the dashboard beside Google Trends and market
  prices.

Access:

- Docs: https://doc.wikimedia.org/generated-data-platform/aqs/analytics-api/reference/page-views.html
- Endpoint shape:
  `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/{project}/{access}/{agent}/{article}/{granularity}/{start}/{end}`
- Example project: `en.wikipedia.org`
- Example access: `all-access`
- Example agent: `user`
- Example granularity: `daily`

Version 1 approach:

- Start with daily pageviews for tracked entities such as Nvidia, artificial
  intelligence, semiconductors, data centers, sector ETFs, and key companies.
- Store page title, article key, project, access, agent, granularity, date,
  views, and ingestion metadata.
- Use a descriptive User-Agent when implementing the collector.
- Do not poll every 10 minutes; daily refresh/backfill better matches the
  natural data granularity.
