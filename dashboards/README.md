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
    "phase": "AI attention wave",
    "market": {
      "sp500Close": 6250.14,
      "nvdaClose": 141.22,
      "sectorEtfs": {
        "financials": 42.85,
        "energy": 88.14,
        "healthcare": 151.62,
        "utilities": 67.43
      }
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

The `phase` value is mock curated metadata for demo readability. It should not
come from raw ingestion. In a real pipeline, labels such as "AI attention wave"
should be produced in a curated/enriched layer by rules first, and potentially
by a LangGraph or LLM helper later.

The market close values are mock demo values. They are included to show S&P 500,
NVDA, and sector ETF movement beside the shifting trend words; real values
should come from the market-data ingestion pipeline.

The graph intentionally shows only tracked market instruments. Trend scores are
represented by word size, ranking, and position in the animated stage.

Animation V2 uses a compact trend panel on the left and a larger configurable
overlay chart on the right. The graph can display any selected mix of the mock
S&P 500, NVDA, financials ETF, energy ETF, healthcare ETF, and utilities ETF
series. Lines are normalized independently to a 0-100 display range so their
patterns can be compared visually even when the underlying prices have
different scales.

The small price-reference cards above the graph are useful, but should remain
configurable. In this prototype they can be hidden or shown from the chart area;
future dashboard versions may move that preference into user settings instead
of keeping it as visible UI.

Narrative phase changes are marked directly on the graph. Each marker jumps the
animation to that day and opens a short human-readable explanation of the shift,
such as moving from "Nvidia earnings attention" to "Data center buildout".

The animated word stage uses a stacked layout instead of absolute positioning,
so terms do not overlap even when long phrases wrap onto multiple lines.
