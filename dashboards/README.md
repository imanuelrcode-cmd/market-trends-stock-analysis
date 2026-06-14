# Dashboard Prototypes

## Trending Animation Demo

Open `trending_animation_demo.html` in a browser to run the animated trending
searches prototype.

The demo expects data in this shape:

```json
[
  {
    "date": "2026-06-01",
    "label": "Day 1",
    "market": {
      "sp500Close": 6250.14,
      "nvdaClose": 141.22
    },
    "trends": [
      { "word": "ChatGPT", "score": 65 },
      { "word": "Semiconductors", "score": 58 },
      { "word": "Artificial Intelligence", "score": 82 },
      { "word": "Nvidia", "score": 74 }
    ]
  }
]
```

For now, mock data is generated in `trending_animation_sample_data.js` as
`window.TREND_SNAPSHOTS`. The generator creates 365 daily snapshots from
`2025-06-15` through `2026-06-14`, with slow trend-score changes and ranking
phase changes roughly every 45-60 days.

Later this can be generated from curated trend data or served by a dashboard
backend.

The market close values are mock demo values. They are included to show S&P 500
and NVDA movement beside the shifting trend words; real values should come from
the market-data ingestion pipeline.

The graph intentionally shows only tracked market instruments. Trend scores are
represented by word size, ranking, and position in the animated stage.

The animated word stage uses a stacked layout instead of absolute positioning,
so terms do not overlap even when long phrases wrap onto multiple lines.
