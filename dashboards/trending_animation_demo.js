const trendSnapshots = Array.isArray(window.TREND_SNAPSHOTS)
  ? window.TREND_SNAPSHOTS
  : [];

const termColors = new Map([
  ["Artificial Intelligence", "#21a8ff"],
  ["Nvidia", "#29c95a"],
  ["ChatGPT", "#a06bff"],
  ["Semiconductors", "#ffc233"],
  ["OpenAI", "#ff6f9e"],
  ["Data Centers", "#46e0c2"],
  ["CUDA", "#f58b41"],
  ["Interest Rates", "#d4d9e2"],
  ["Oil Prices", "#ff9866"],
]);

const marketSeriesCatalog = [
  {
    color: "#56b6ff",
    description: "Broad market reference",
    formatter: formatIndex,
    getValue: (snapshot) => snapshot.market?.sp500Close,
    id: "sp500",
    label: "S&P 500",
    width: 3,
  },
  {
    color: "#29c95a",
    description: "Nvidia stock close",
    formatter: formatUsd,
    getValue: (snapshot) => snapshot.market?.nvdaClose,
    id: "nvda",
    label: "NVDA",
    width: 3,
  },
  {
    color: "#f2d16b",
    description: "Financials sector ETF",
    formatter: formatUsd,
    getValue: (snapshot) => snapshot.market?.sectorEtfs?.financials,
    id: "financials",
    label: "Financials ETF",
    width: 5,
  },
  {
    color: "#ff9866",
    description: "Energy sector ETF",
    formatter: formatUsd,
    getValue: (snapshot) => snapshot.market?.sectorEtfs?.energy,
    id: "energy",
    label: "Energy ETF",
    width: 5,
  },
  {
    color: "#ff6f9e",
    description: "Healthcare sector ETF",
    formatter: formatUsd,
    getValue: (snapshot) => snapshot.market?.sectorEtfs?.healthcare,
    id: "healthcare",
    label: "Healthcare ETF",
    width: 5,
  },
  {
    color: "#46e0c2",
    description: "Utilities sector ETF",
    formatter: formatUsd,
    getValue: (snapshot) => snapshot.market?.sectorEtfs?.utilities,
    id: "utilities",
    label: "Utilities ETF",
    width: 5,
  },
];

const state = {
  index: 0,
  topCount: 5,
  speedMs: 180,
  selectedTerm: "Nvidia",
  selectedSeries: new Set(["financials", "energy", "healthcare", "utilities"]),
  selectedNarrativeIndex: null,
  showPriceReadout: true,
  playing: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  timer: null,
};

const elements = {
  activeSeriesReadout: document.querySelector("#activeSeriesReadout"),
  activeDate: document.querySelector("#activeDate"),
  activeTitle: document.querySelector("#activeTitle"),
  chartRange: document.querySelector("#chartRange"),
  chartLegend: document.querySelector("#chartLegend"),
  chartTitle: document.querySelector("#chartTitle"),
  daySlider: document.querySelector("#daySlider"),
  focusTermLabel: document.querySelector("#focusTermLabel"),
  leaderLabel: document.querySelector("#leaderLabel"),
  leaderboard: document.querySelector("#leaderboard"),
  playIcon: document.querySelector("#playIcon"),
  playToggle: document.querySelector("#playToggle"),
  narrativeDetail: document.querySelector("#narrativeDetail"),
  readoutToggle: document.querySelector("#readoutToggle"),
  seriesControls: document.querySelector("#seriesControls"),
  seriesCountLabel: document.querySelector("#seriesCountLabel"),
  snapshotLabel: document.querySelector("#snapshotLabel"),
  sp500CloseLabel: document.querySelector("#sp500CloseLabel"),
  speedSelect: document.querySelector("#speedSelect"),
  timeline: document.querySelector("#timeline"),
  topCountOutput: document.querySelector("#topCountOutput"),
  topCountRange: document.querySelector("#topCountRange"),
  topSignalLabel: document.querySelector("#topSignalLabel"),
  trendChart: document.querySelector("#trendChart"),
  nvdaCloseLabel: document.querySelector("#nvdaCloseLabel"),
  wordStage: document.querySelector("#wordStage"),
};

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function colorForTerm(word) {
  return termColors.get(word) || "#edf4f8";
}

function getSortedTrends(snapshot) {
  return [...snapshot.trends].sort((a, b) => b.score - a.score);
}

function getTopTrends(snapshot) {
  return getSortedTrends(snapshot).slice(0, state.topCount);
}

function scoreForTerm(snapshot, word) {
  return snapshot.trends.find((trend) => trend.word === word)?.score ?? 0;
}

function formatIndex(value) {
  if (typeof value !== "number") {
    return "N/A";
  }

  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

function formatUsd(value) {
  if (typeof value !== "number") {
    return "N/A";
  }

  return new Intl.NumberFormat("en", {
    currency: "USD",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wordStageTextWidth(stageWidth) {
  return Math.max(180, stageWidth - 22);
}

function planWordTypography(word, score, stageWidth) {
  return {
    fontSize: clamp(26 + score * 0.48, 34, 70),
    wordWidth: `${wordStageTextWidth(stageWidth)}px`,
  };
}

function estimateWordLines(word, fontSize, stageWidth) {
  const usableWidth = wordStageTextWidth(stageWidth);
  const averageCharWidth = fontSize * 0.52;
  const maxCharsPerLine = Math.max(8, Math.floor(usableWidth / averageCharWidth));
  const tokens = word.split(/\s+/).filter(Boolean);
  let lineCount = 1;
  let currentLineLength = 0;

  tokens.forEach((token) => {
    if (token.length > maxCharsPerLine) {
      if (currentLineLength > 0) {
        lineCount += 1;
      }

      lineCount += Math.ceil(token.length / maxCharsPerLine) - 1;
      currentLineLength = token.length % maxCharsPerLine || maxCharsPerLine;
      return;
    }

    if (currentLineLength === 0) {
      currentLineLength = token.length;
      return;
    }

    if (currentLineLength + 1 + token.length <= maxCharsPerLine) {
      currentLineLength += 1 + token.length;
      return;
    }

    lineCount += 1;
    currentLineLength = token.length;
  });

  return lineCount;
}

function estimateWordHeight(word, fontSize, stageWidth) {
  const lineCount = estimateWordLines(word, fontSize, stageWidth);
  return fontSize * 1.04 * lineCount + 10;
}

function appendBreakableToken(container, token) {
  if (token.length <= 12) {
    container.append(document.createTextNode(token));
    return;
  }

  const chunkLength = Math.ceil(token.length / Math.ceil(token.length / 8));
  for (let index = 0; index < token.length; index += chunkLength) {
    container.append(document.createTextNode(token.slice(index, index + chunkLength)));

    if (index + chunkLength < token.length) {
      container.append(document.createElement("wbr"));
    }
  }
}

function setBreakableWordText(element, word) {
  element.replaceChildren();
  word.split(/(\s+)/).forEach((part) => {
    if (!part) {
      return;
    }

    if (/^\s+$/.test(part)) {
      element.append(document.createTextNode(part));
      return;
    }

    appendBreakableToken(element, part);
  });
  element.setAttribute("aria-label", word);
}

function setPlaying(nextPlaying) {
  state.playing = nextPlaying;
  elements.playIcon.textContent = state.playing ? "||" : "▶";
  elements.playToggle.setAttribute(
    "aria-label",
    state.playing ? "Pause animation" : "Play animation",
  );

  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }

  if (state.playing) {
    state.timer = window.setInterval(() => step(1), state.speedMs);
  }
}

function step(direction) {
  state.index = (state.index + direction + trendSnapshots.length) % trendSnapshots.length;
  state.selectedNarrativeIndex = null;
  render();
}

function setIndex(index) {
  state.index = clamp(Number(index), 0, trendSnapshots.length - 1);
  state.selectedNarrativeIndex = null;
  render();
}

function setSelectedTerm(word) {
  state.selectedTerm = word;
  render();
}

function toggleSeries(seriesId) {
  if (state.selectedSeries.has(seriesId)) {
    if (state.selectedSeries.size === 1) {
      render();
      return;
    }

    state.selectedSeries.delete(seriesId);
  } else {
    state.selectedSeries.add(seriesId);
  }

  render();
}

function selectedSeriesConfigs() {
  const selected = marketSeriesCatalog.filter((item) => state.selectedSeries.has(item.id));

  return selected.length ? selected : marketSeriesCatalog.slice(2, 3);
}

function setSelectedNarrative(markerIndex) {
  const markers = getNarrativeMarkers();
  const marker = markers[markerIndex];

  if (!marker) {
    return;
  }

  state.selectedNarrativeIndex = markerIndex;
  state.index = marker.index;
  render();
}

function togglePriceReadout() {
  state.showPriceReadout = !state.showPriceReadout;
  render();
}

function renderSummary(snapshot, topTrends) {
  const leader = topTrends[0];
  elements.activeDate.textContent = formatDate(snapshot.date);
  elements.activeTitle.textContent = `${snapshot.label} - ${snapshot.phase ?? "Demo phase"}`;
  elements.snapshotLabel.textContent = snapshot.label;
  elements.leaderLabel.textContent = leader.word;
  elements.topSignalLabel.textContent = leader.score;
  elements.focusTermLabel.textContent = state.selectedTerm;
  elements.sp500CloseLabel.textContent = formatIndex(snapshot.market?.sp500Close);
  elements.nvdaCloseLabel.textContent = formatUsd(snapshot.market?.nvdaClose);
  elements.topCountOutput.textContent = `Top ${state.topCount}`;
  elements.daySlider.value = state.index;
  elements.chartRange.textContent = `${trendSnapshots.length} daily closes`;
}

function renderWords(topTrends) {
  const activeWords = new Set(topTrends.map((trend) => trend.word));
  const measuredStageWidth = elements.wordStage.clientWidth
    || elements.wordStage.getBoundingClientRect().width;
  const stageWidth = measuredStageWidth || 300;
  const stageHeight = elements.wordStage.clientHeight || 470;
  const availableHeight = Math.max(280, stageHeight - 36);

  [...elements.wordStage.children].forEach((node) => {
    if (!activeWords.has(node.dataset.word)) {
      node.classList.add("fade-out");
      window.setTimeout(() => node.remove(), 280);
    }
  });

  const plannedWords = topTrends.map((trend, index) => {
    const typography = planWordTypography(trend.word, trend.score, stageWidth);
    return {
      fontSize: typography.fontSize,
      index,
      trend,
      wordHeight: estimateWordHeight(trend.word, typography.fontSize, stageWidth),
      wordWidth: typography.wordWidth,
    };
  });

  const baseGap = state.topCount > 5 ? 8 : 12;
  const totalHeight = plannedWords.reduce((sum, item) => sum + item.wordHeight, 0)
    + baseGap * Math.max(0, plannedWords.length - 1);
  const scale = clamp(availableHeight / totalHeight, 0.72, 1);
  elements.wordStage.style.setProperty("--word-gap", `${baseGap * scale}px`);

  plannedWords.forEach(({ fontSize, index, trend, wordWidth }) => {
    let wordElement = elements.wordStage.querySelector(`[data-word="${CSS.escape(trend.word)}"]`);
    if (!wordElement) {
      wordElement = document.createElement("div");
      wordElement.className = "trend-word";
      wordElement.dataset.word = trend.word;
      setBreakableWordText(wordElement, trend.word);
      elements.wordStage.append(wordElement);
    }

    const xDrift = index % 2 === 0 ? -4 : 4;
    const scaledFontSize = fontSize * scale;

    wordElement.classList.toggle("leader", index === 0);
    wordElement.classList.remove("fade-out");
    wordElement.style.setProperty("--term-color", colorForTerm(trend.word));
    wordElement.style.setProperty("--word-size", `${scaledFontSize}px`);
    wordElement.style.setProperty("--word-width", wordWidth);
    wordElement.style.setProperty("--word-scale", index === 0 ? "1.04" : "1");
    wordElement.style.setProperty("--word-x", `${xDrift}px`);
    wordElement.style.order = String(index);
    elements.wordStage.append(wordElement);
  });
}

function renderLeaderboard(topTrends) {
  elements.leaderboard.replaceChildren();

  topTrends.forEach((trend, index) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "rank-row";
    row.style.setProperty("--term-color", colorForTerm(trend.word));
    row.classList.toggle("active", trend.word === state.selectedTerm);
    row.setAttribute("aria-label", `Focus ${trend.word}`);

    const dot = document.createElement("span");
    dot.className = "rank-dot";

    const word = document.createElement("span");
    word.className = "rank-word";
    word.textContent = `${index + 1}. ${trend.word}`;

    const score = document.createElement("span");
    score.className = "rank-score";
    score.textContent = trend.score;

    row.append(dot, word, score);
    row.addEventListener("click", () => setSelectedTerm(trend.word));
    elements.leaderboard.append(row);
  });
}

function pointPath(points) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function areaPath(points, baseline) {
  if (!points.length) {
    return "";
  }

  return `${pointPath(points)} L ${points.at(-1).x} ${baseline} L ${points[0].x} ${baseline} Z`;
}

function normalize(values) {
  const numericValues = values.filter((value) => typeof value === "number");

  if (!numericValues.length) {
    return values.map(() => 0);
  }

  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return values.map(() => 0);
  }

  if (min === max) {
    return values.map((value) => (typeof value === "number" ? 50 : 0));
  }

  return values.map((value) => (typeof value === "number" ? ((value - min) / (max - min)) * 100 : 0));
}

function renderLegend(series) {
  elements.chartLegend.replaceChildren();

  series.forEach((item) => {
    const legend = document.createElement("span");
    legend.className = "legend-item";

    const dot = document.createElement("span");
    dot.className = "legend-dot";
    dot.style.setProperty("--series-color", item.color);

    const label = document.createElement("span");
    label.textContent = item.label;

    legend.append(dot, label);
    elements.chartLegend.append(legend);
  });
}

function renderSeriesControls() {
  elements.seriesControls.replaceChildren();

  marketSeriesCatalog.forEach((item) => {
    const label = document.createElement("label");
    label.className = "series-toggle";
    label.classList.toggle("active", state.selectedSeries.has(item.id));
    label.style.setProperty("--series-color", item.color);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = state.selectedSeries.has(item.id);
    input.addEventListener("change", () => toggleSeries(item.id));

    const text = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = item.label;

    const description = document.createElement("span");
    description.textContent = item.description;

    text.append(title, description);

    const swatch = document.createElement("span");
    swatch.className = "series-swatch";

    label.append(input, text, swatch);
    elements.seriesControls.append(label);
  });
}

function renderActiveSeriesReadout(series, snapshot) {
  elements.activeSeriesReadout.replaceChildren();
  elements.activeSeriesReadout.classList.toggle("hidden", !state.showPriceReadout);
  elements.readoutToggle.textContent = state.showPriceReadout ? "Hide price cards" : "Show price cards";

  series.forEach((item) => {
    const card = document.createElement("div");
    card.className = "readout-item";
    card.style.setProperty("--series-color", item.color);

    const label = document.createElement("span");
    label.textContent = item.label;

    const value = document.createElement("strong");
    value.textContent = item.formatter(item.getValue(snapshot));

    card.append(label, value);
    elements.activeSeriesReadout.append(card);
  });
}

function renderNarrativeDetail() {
  const markers = getNarrativeMarkers();
  const activeMarker = markers[state.selectedNarrativeIndex]
    ?? markers.find((marker) => marker.index <= state.index && marker.nextIndex > state.index)
    ?? markers.find((marker) => marker.index <= state.index);

  if (!activeMarker) {
    elements.narrativeDetail.classList.remove("visible");
    elements.narrativeDetail.replaceChildren();
    return;
  }

  const label = document.createElement("span");
  label.textContent = `${formatDate(activeMarker.snapshot.date)} | ${activeMarker.snapshot.label}`;

  const title = document.createElement("strong");
  title.textContent = activeMarker.toPhase;

  const description = document.createElement("p");
  description.textContent = activeMarker.fromPhase
    ? `Narrative shift from "${activeMarker.fromPhase}" into "${activeMarker.toPhase}". Use this as a human-readable checkpoint before comparing sector ETF reactions.`
    : `Starting narrative: "${activeMarker.toPhase}".`;

  elements.narrativeDetail.replaceChildren(label, title, description);
  elements.narrativeDetail.classList.add("visible");
}

function renderChart() {
  const width = 920;
  const height = 420;
  const padding = { top: 28, right: 30, bottom: 52, left: 54 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const baseline = padding.top + innerHeight;
  const selectedConfigs = selectedSeriesConfigs();
  const series = selectedConfigs.map((item) => {
    const rawValues = trendSnapshots.map((snapshot) => item.getValue(snapshot));

    return {
      ...item,
      rawValues,
      values: normalize(rawValues),
    };
  });
  const activeSnapshot = trendSnapshots[state.index];
  const activeX = padding.left + (state.index / Math.max(1, trendSnapshots.length - 1)) * innerWidth;

  elements.chartTitle.textContent = "Sector ETF Overlay";
  elements.seriesCountLabel.textContent = `${series.length} selected`;
  elements.trendChart.replaceChildren();
  renderSeriesControls();
  renderLegend(series);
  renderActiveSeriesReadout(selectedConfigs, activeSnapshot);
  renderNarrativeDetail();

  [0, 50, 100].forEach((score) => {
    const y = baseline - (score / 100) * innerHeight;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("class", score === 0 ? "chart-axis" : "chart-grid");
    line.setAttribute("x1", padding.left);
    line.setAttribute("x2", width - padding.right);
    line.setAttribute("y1", y);
    line.setAttribute("y2", y);
    elements.trendChart.append(line);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("class", "chart-label");
    label.setAttribute("x", 8);
    label.setAttribute("y", y + 4);
    label.textContent = score;
    elements.trendChart.append(label);
  });

  const markerLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  markerLine.setAttribute("class", "chart-marker-line");
  markerLine.setAttribute("x1", activeX);
  markerLine.setAttribute("x2", activeX);
  markerLine.setAttribute("y1", padding.top);
  markerLine.setAttribute("y2", baseline);
  elements.trendChart.append(markerLine);

  getNarrativeMarkers().forEach((marker, markerIndex) => {
    const x = padding.left + (marker.index / Math.max(1, trendSnapshots.length - 1)) * innerWidth;

    const markerGuide = document.createElementNS("http://www.w3.org/2000/svg", "line");
    markerGuide.setAttribute("class", "narrative-marker-line");
    markerGuide.setAttribute("x1", x);
    markerGuide.setAttribute("x2", x);
    markerGuide.setAttribute("y1", padding.top);
    markerGuide.setAttribute("y2", baseline);
    elements.trendChart.append(markerGuide);

    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", "narrative-marker");
    group.setAttribute("role", "button");
    group.setAttribute("tabindex", "0");
    group.setAttribute("aria-label", `Narrative shift to ${marker.toPhase}`);
    group.setAttribute("transform", `translate(${x}, ${padding.top + 14})`);
    group.addEventListener("click", () => setSelectedNarrative(markerIndex));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setSelectedNarrative(markerIndex);
      }
    });

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", markerIndex === state.selectedNarrativeIndex ? "11" : "9");

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "central");
    text.textContent = "i";

    const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    title.textContent = `${marker.snapshot.label}: ${marker.toPhase}`;

    group.append(circle, text, title);
    elements.trendChart.append(group);
  });

  series.forEach((item) => {
    const points = item.values.map((value, index) => {
      const x = padding.left + (index / Math.max(1, trendSnapshots.length - 1)) * innerWidth;
      const y = baseline - (value / 100) * innerHeight;
      return { x, y, rawValue: item.rawValues?.[index] ?? value, snapshot: trendSnapshots[index] };
    });

    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute("class", "chart-line");
    line.setAttribute("d", pointPath(points));
    line.style.setProperty("--series-color", item.color);
    line.style.setProperty("--series-width", `${item.width}px`);
    elements.trendChart.append(line);

    const activePoint = points[state.index];
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("class", "chart-point active");
    circle.setAttribute("cx", activePoint.x);
    circle.setAttribute("cy", activePoint.y);
    circle.setAttribute("r", "6");
    circle.style.setProperty("--series-color", item.color);
    elements.trendChart.append(circle);
  });

  getTimelineMarkers().forEach((marker) => {
    const x = padding.left + (marker.index / Math.max(1, trendSnapshots.length - 1)) * innerWidth;
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("class", "chart-label");
    label.setAttribute("x", x - 12);
    label.setAttribute("y", height - 12);
    label.textContent = marker.shortLabel;
    elements.trendChart.append(label);
  });

  const activeMarket = trendSnapshots[state.index].market ?? {};
  const valueLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  valueLabel.setAttribute("class", "chart-value-label");
  valueLabel.setAttribute("x", padding.left);
  valueLabel.setAttribute("y", 18);
  valueLabel.textContent = `${formatDate(trendSnapshots[state.index].date)} | S&P 500: ${formatIndex(activeMarket.sp500Close)} | NVDA: ${formatUsd(activeMarket.nvdaClose)}`;
  elements.trendChart.append(valueLabel);
}

function getTimelineMarkers() {
  const markers = [];
  let previousMonthKey = "";

  trendSnapshots.forEach((snapshot, index) => {
    const date = new Date(`${snapshot.date}T00:00:00`);
    const monthKey = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;

    if (monthKey !== previousMonthKey) {
      markers.push({
        index,
        label: new Intl.DateTimeFormat("en", { month: "short" }).format(date),
        shortLabel: new Intl.DateTimeFormat("en", { month: "short" }).format(date).slice(0, 3),
      });
      previousMonthKey = monthKey;
    }
  });

  return markers;
}

function getNarrativeMarkers() {
  const markers = [];
  let previousPhase = "";

  trendSnapshots.forEach((snapshot, index) => {
    if (snapshot.phase !== previousPhase) {
      markers.push({
        index,
        nextIndex: trendSnapshots.findIndex((candidate, candidateIndex) => (
          candidateIndex > index && candidate.phase !== snapshot.phase
        )),
        fromPhase: previousPhase,
        toPhase: snapshot.phase,
        snapshot,
      });
      previousPhase = snapshot.phase;
    }
  });

  return markers.map((marker, index) => ({
    ...marker,
    nextIndex: marker.nextIndex === -1 ? trendSnapshots.length : marker.nextIndex,
    markerNumber: index + 1,
  }));
}

function renderTimeline() {
  elements.timeline.replaceChildren();
  const markers = getTimelineMarkers();

  markers.forEach((marker, markerIndex) => {
    const nextMarker = markers[markerIndex + 1];
    const isActive = state.index >= marker.index
      && (!nextMarker || state.index < nextMarker.index);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = marker.label;
    button.classList.toggle("active", isActive);
    button.addEventListener("click", () => setIndex(marker.index));
    elements.timeline.append(button);
  });
}

function render() {
  const snapshot = trendSnapshots[state.index];
  const topTrends = getTopTrends(snapshot);

  renderSummary(snapshot, topTrends);
  renderWords(topTrends);
  renderLeaderboard(topTrends);
  renderChart();
  renderTimeline();
}

function setupControls() {
  elements.playToggle.addEventListener("click", () => setPlaying(!state.playing));
  document.querySelector("#prevStep").addEventListener("click", () => step(-1));
  document.querySelector("#nextStep").addEventListener("click", () => step(1));

  elements.daySlider.max = trendSnapshots.length - 1;
  elements.daySlider.addEventListener("input", (event) => setIndex(event.target.value));

  elements.topCountRange.addEventListener("input", (event) => {
    state.topCount = Number(event.target.value);
    render();
  });

  elements.speedSelect.addEventListener("change", (event) => {
    state.speedMs = Number(event.target.value);
    setPlaying(state.playing);
  });
  elements.readoutToggle.addEventListener("click", togglePriceReadout);
}

function initTrendAnimationDemo() {
  setupControls();
  render();
  setPlaying(state.playing);
}

window.trendAnimationDemo = {
  render,
  setIndex,
  setPlaying,
  snapshots: trendSnapshots,
};

initTrendAnimationDemo();
