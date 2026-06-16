# News Domain

Owns news, headline, event, and narrative-discovery ingestion.

Initial source families:

- GDELT for broad news/event discovery.
- Google News RSS for lightweight headline streams and Kafka practice.

This domain should preserve raw source payloads first, then produce normalized
headline/event records for downstream trend labeling and dashboard evidence.
