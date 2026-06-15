(function buildTrendingAnimationSampleData() {
  const terms = [
    "Artificial Intelligence",
    "Nvidia",
    "ChatGPT",
    "Semiconductors",
    "OpenAI",
    "Data Centers",
    "CUDA",
    "Interest Rates",
    "Oil Prices",
  ];

  const phases = [
    {
      duration: 52,
      name: "AI attention wave",
      scores: {
        "Artificial Intelligence": 86,
        Nvidia: 72,
        ChatGPT: 65,
        Semiconductors: 58,
        OpenAI: 55,
        "Data Centers": 50,
        "Interest Rates": 42,
        CUDA: 40,
        "Oil Prices": 34,
      },
    },
    {
      duration: 48,
      name: "Nvidia earnings attention",
      scores: {
        Nvidia: 88,
        "Artificial Intelligence": 78,
        Semiconductors: 67,
        "Data Centers": 58,
        ChatGPT: 55,
        CUDA: 51,
        OpenAI: 49,
        "Interest Rates": 41,
        "Oil Prices": 35,
      },
    },
    {
      duration: 57,
      name: "Data center buildout",
      scores: {
        "Data Centers": 84,
        Nvidia: 70,
        "Artificial Intelligence": 68,
        Semiconductors: 62,
        CUDA: 55,
        OpenAI: 50,
        "Interest Rates": 43,
        ChatGPT: 42,
        "Oil Prices": 36,
      },
    },
    {
      duration: 45,
      name: "Semiconductor supply focus",
      scores: {
        Semiconductors: 87,
        Nvidia: 70,
        "Artificial Intelligence": 65,
        "Data Centers": 60,
        "Oil Prices": 58,
        CUDA: 54,
        "Interest Rates": 45,
        ChatGPT: 50,
        OpenAI: 39,
      },
    },
    {
      duration: 60,
      name: "Consumer AI cycle",
      scores: {
        ChatGPT: 88,
        OpenAI: 78,
        "Artificial Intelligence": 70,
        Nvidia: 64,
        "Data Centers": 60,
        Semiconductors: 58,
        CUDA: 48,
        "Interest Rates": 43,
        "Oil Prices": 34,
      },
    },
    {
      duration: 50,
      name: "GPU developer cycle",
      scores: {
        Nvidia: 92,
        CUDA: 77,
        "Data Centers": 72,
        "Artificial Intelligence": 70,
        Semiconductors: 66,
        ChatGPT: 55,
        OpenAI: 52,
        "Interest Rates": 42,
        "Oil Prices": 37,
      },
    },
    {
      duration: 53,
      name: "AI infrastructure consolidation",
      scores: {
        "Artificial Intelligence": 90,
        Semiconductors: 82,
        Nvidia: 74,
        "Data Centers": 70,
        OpenAI: 62,
        ChatGPT: 58,
        CUDA: 54,
        "Interest Rates": 46,
        "Oil Prices": 35,
      },
    },
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value, digits = 2) {
    return Number(value.toFixed(digits));
  }

  function smoothstep(value) {
    const progress = clamp(value, 0, 1);
    return progress * progress * (3 - 2 * progress);
  }

  function seedForTerm(term) {
    return [...term].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  }

  function addDays(date, days) {
    const nextDate = new Date(date);
    nextDate.setUTCDate(nextDate.getUTCDate() + days);
    return nextDate;
  }

  function toDateString(date) {
    return date.toISOString().slice(0, 10);
  }

  function phaseForDay(dayIndex) {
    let cursor = 0;

    for (let index = 0; index < phases.length; index += 1) {
      const phase = phases[index];
      const nextCursor = cursor + phase.duration;

      if (dayIndex < nextCursor) {
        return {
          index,
          localDay: dayIndex - cursor,
          phase,
          progress: (dayIndex - cursor) / Math.max(1, phase.duration - 1),
        };
      }

      cursor = nextCursor;
    }

    const lastPhase = phases.at(-1);
    return {
      index: phases.length - 1,
      localDay: lastPhase.duration - 1,
      phase: lastPhase,
      progress: 1,
    };
  }

  function scoreForTerm(term, dayIndex, phaseInfo) {
    const nextPhase = phases[phaseInfo.index + 1] ?? phaseInfo.phase;
    const currentScore = phaseInfo.phase.scores[term] ?? 30;
    const nextScore = nextPhase.scores[term] ?? currentScore;
    const transitionBlend = smoothstep((phaseInfo.progress - 0.88) / 0.12);
    const trendScore = currentScore * (1 - transitionBlend) + nextScore * transitionBlend;
    const seed = seedForTerm(term);
    const gentlePulse = Math.sin((dayIndex + seed) / 18) * 1.35
      + Math.sin((dayIndex + seed * 3) / 47) * 0.9;

    return Math.round(clamp(trendScore + gentlePulse, 18, 96));
  }

  function marketForDay(dayIndex, trends) {
    const nvidiaScore = trends.find((trend) => trend.word === "Nvidia")?.score ?? 70;
    const aiScore = trends.find((trend) => trend.word === "Artificial Intelligence")?.score ?? 70;
    const dataCenterScore = trends.find((trend) => trend.word === "Data Centers")?.score ?? 60;
    const semiconductorScore = trends.find((trend) => trend.word === "Semiconductors")?.score ?? 60;
    const interestRatesScore = trends.find((trend) => trend.word === "Interest Rates")?.score ?? 45;
    const oilScore = trends.find((trend) => trend.word === "Oil Prices")?.score ?? 40;

    const sp500Close = 5850
      + dayIndex * 1.55
      + Math.sin(dayIndex / 28) * 38
      + Math.sin(dayIndex / 91) * 64
      + (aiScore - 70) * 1.25
      + (semiconductorScore - 65) * 0.8;

    const nvdaClose = 122
      + dayIndex * 0.16
      + Math.sin(dayIndex / 16) * 4.4
      + Math.sin(dayIndex / 53) * 7.2
      + (nvidiaScore - 70) * 0.55
      + (dataCenterScore - 60) * 0.24;

    const financialsClose = 42
      + dayIndex * 0.024
      + Math.sin(dayIndex / 35) * 1.45
      + Math.sin(dayIndex / 88) * 1.1
      + (interestRatesScore - 45) * 0.06
      + (sp500Close - 5850) * 0.0021;

    const energyClose = 86
      + dayIndex * 0.014
      + Math.sin(dayIndex / 24) * 2.9
      + Math.sin(dayIndex / 71) * 3.2
      + (oilScore - 40) * 0.28;

    const healthcareClose = 146
      + dayIndex * 0.055
      + Math.sin(dayIndex / 46) * 2.15
      + Math.sin(dayIndex / 117) * 2.4
      - (interestRatesScore - 45) * 0.035
      + Math.max(0, 60 - aiScore) * 0.05;

    const utilitiesClose = 66
      + dayIndex * 0.012
      + Math.sin(dayIndex / 58) * 1.95
      - (interestRatesScore - 45) * 0.11
      + Math.sin(dayIndex / 19) * 0.9;

    return {
      sp500Close: round(sp500Close),
      nvdaClose: round(nvdaClose),
      sectorEtfs: {
        financials: round(financialsClose),
        energy: round(energyClose),
        healthcare: round(healthcareClose),
        utilities: round(utilitiesClose),
      },
    };
  }

  function buildSnapshot(dayIndex) {
    const startDate = new Date(Date.UTC(2025, 5, 15));
    const phaseInfo = phaseForDay(dayIndex);
    const date = addDays(startDate, dayIndex);
    const trends = terms
      .map((word) => ({
        word,
        score: scoreForTerm(word, dayIndex, phaseInfo),
      }))
      .sort((a, b) => b.score - a.score);

    return {
      date: toDateString(date),
      label: `Day ${String(dayIndex + 1).padStart(3, "0")}`,
      phase: phaseInfo.phase.name,
      market: marketForDay(dayIndex, trends),
      trends,
    };
  }

  window.TREND_SNAPSHOTS = Array.from({ length: 365 }, (_, index) => buildSnapshot(index));
  window.TREND_DEMO_META = {
    description: "Deterministic one-year mock dataset with slow trend-ranking phases.",
    generatedRecords: window.TREND_SNAPSHOTS.length,
    phaseDurations: phases.map((phase) => phase.duration),
  };
}());
