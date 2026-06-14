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

const state = {
  index: 0,
  topCount: 5,
  speedMs: 180,
  selectedTerm: "Nvidia",
  playing: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  timer: null,
};

const elements = {
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

function estimateWordLines(word, fontSize, stageWidth) {
  const usableWidth = Math.max(220, stageWidth - 64);
  const averageCharWidth = fontSize * 0.52;
  const maxCharsPerLine = Math.max(9, Math.floor(usableWidth / averageCharWidth));

  return Math.max(1, Math.ceil(word.length / maxCharsPerLine));
}

function estimateWordHeight(word, fontSize, stageWidth) {
  const lineCount = estimateWordLines(word, fontSize, stageWidth);
  return fontSize * 1.04 * lineCount + 10;
}

function setPlaying(nextPlaying) {
  state.playing = nextPlaying;
  elements.playIcon.textContent = state.playing ? "Pause" : "Play";
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
  render();
}

function setIndex(index) {
  state.index = clamp(Number(index), 0, trendSnapshots.length - 1);
  render();
}

function setSelectedTerm(word) {
  state.selectedTerm = word;
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
  const stageWidth = elements.wordStage.clientWidth || 900;
  const stageHeight = elements.wordStage.clientHeight || 470;
  const availableHeight = Math.max(280, stageHeight - 36);

  [...elements.wordStage.children].forEach((node) => {
    if (!activeWords.has(node.dataset.word)) {
      node.classList.add("fade-out");
      window.setTimeout(() => node.remove(), 280);
    }
  });

  const plannedWords = topTrends.map((trend, index) => {
    const rawSize = 26 + trend.score * 0.48;
    const fontSize = clamp(rawSize, 34, 70);
    return {
      fontSize,
      index,
      trend,
      wordHeight: estimateWordHeight(trend.word, fontSize, stageWidth),
    };
  });

  const baseGap = state.topCount > 5 ? 8 : 12;
  const totalHeight = plannedWords.reduce((sum, item) => sum + item.wordHeight, 0)
    + baseGap * Math.max(0, plannedWords.length - 1);
  const scale = clamp(availableHeight / totalHeight, 0.72, 1);
  elements.wordStage.style.setProperty("--word-gap", `${baseGap * scale}px`);

  plannedWords.forEach(({ fontSize, index, trend }) => {
    let wordElement = elements.wordStage.querySelector(`[data-word="${CSS.escape(trend.word)}"]`);
    if (!wordElement) {
      wordElement = document.createElement("div");
      wordElement.className = "trend-word";
      wordElement.dataset.word = trend.word;
      wordElement.textContent = trend.word;
      elements.wordStage.append(wordElement);
    }

    const xDrift = index % 2 === 0 ? -10 : 10;
    const scaledFontSize = fontSize * scale;

    wordElement.classList.toggle("leader", index === 0);
    wordElement.classList.remove("fade-out");
    wordElement.style.setProperty("--term-color", colorForTerm(trend.word));
    wordElement.style.setProperty("--word-size", `${scaledFontSize}px`);
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

function renderChart() {
  const width = 460;
  const height = 180;
  const padding = { top: 18, right: 24, bottom: 38, left: 42 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const baseline = padding.top + innerHeight;
  const sp500Values = trendSnapshots.map((snapshot) => snapshot.market?.sp500Close);
  const nvdaValues = trendSnapshots.map((snapshot) => snapshot.market?.nvdaClose);

  const series = [
    {
      color: "#f2d16b",
      formatter: formatIndex,
      label: "S&P 500 Close",
      values: normalize(sp500Values),
      rawValues: sp500Values,
      width: 3,
    },
    {
      color: "#29c95a",
      formatter: formatUsd,
      label: "NVDA Close",
      values: normalize(nvdaValues),
      rawValues: nvdaValues,
      width: 3,
    },
  ];

  elements.chartTitle.textContent = "Market Close Comparison";
  elements.trendChart.replaceChildren();
  renderLegend(series);

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

  const area = document.createElementNS("http://www.w3.org/2000/svg", "path");
  area.setAttribute("class", "chart-area");
  area.style.setProperty("--series-color", series[0].color);
  area.setAttribute(
    "d",
    areaPath(
      series[0].values.map((value, index) => {
        const x = padding.left + (index / Math.max(1, trendSnapshots.length - 1)) * innerWidth;
        const y = baseline - (value / 100) * innerHeight;
        return { x, y, snapshot: trendSnapshots[index] };
      }),
      baseline,
    ),
  );
  elements.trendChart.append(area);

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
  valueLabel.setAttribute("y", 14);
  valueLabel.textContent = `S&P 500: ${formatIndex(activeMarket.sp500Close)} | NVDA: ${formatUsd(activeMarket.nvdaClose)}`;
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
