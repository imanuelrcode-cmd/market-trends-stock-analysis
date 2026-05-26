"""
Domains Package

This package contains the business domains of the platform.

Architectural Principle:
- Each domain owns its ingestion, transformations,
  schemas, validations, and business services.
- Domains should remain loosely coupled.
- Communication between domains should happen through:
    - data lake layers
    - streaming contracts
    - orchestration pipelines

Current domains:
- market_data
- trends
- news
- sentiment
- macro

Example:
    from domains.market_data.ingestion.yahoo_finance.yahoo_collector import fetch_prices
"""