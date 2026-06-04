const DATA = window.TFM2_META_DATA;

const roles = [
  ["all", "전체"],
  ["top", "탑"],
  ["jungle", "정글"],
  ["mid", "미드"],
  ["bot", "바텀"],
  ["support", "서포터"],
];

const scopes = [
  ["overall", "전체"],
  ["tournament", "대회"],
  ["solo", "솔랭"],
];

const views = [
  ["list", "메타 통계"],
  ["champion", "챔피언 정보"],
  ["matches", "리플레이 기록"],
];

const championTabs = [
  ["overview", "통계"],
  ["basic", "기본 정보"],
  ["patch", "패치 히스토리"],
  ["build", "상대·시너지·빌드"],
];

const patches = [["all", "전체 패치"], ...(DATA.patches || []).map((version) => [version, version])];
const defaultPatch = DATA.patches?.length ? DATA.patches[DATA.patches.length - 1] : "all";

const tierPresets = [
  ["classic", "클래식", { win: 1, pick: 0.2, ban: 0.2 }],
  ["fearless", "피어리스", { win: 1, pick: 0.18, ban: 0.55 }],
  ["hardFearless", "하드 피어리스", { win: 1, pick: 0.15, ban: 0.85 }],
];

const sampleModes = [
  ["auto", "자동 표본"],
  ["early", "초반 5픽"],
  ["normal", "일반 10픽"],
];

const tierPresetById = Object.fromEntries(tierPresets.map(([id, label, weights]) => [id, { id, label, weights }]));
const DEFAULT_SCORE_MODEL_SPEC = {
  modelVersion: "tfm2gg-meta-v1",
  posterior: {
    z: 0.84,
    fallbackPriorMean: 0.5,
    kappa: { early: [8, 50], normal: [12, 80], role: [18, 100] },
    ratePriorKappa: 20,
  },
  strength: { meanWeight: 0.7, lowerWeight: 0.3 },
  pressure: { eps: 0.001, scale: 16 },
  presets: {
    classic: { label: "classic", metaStrengthWeight: 0.84, metaPressureWeight: 0.16, lowerStrengthWeight: 0.88, lowerPressureWeight: 0.12 },
    fearless: { label: "fearless", metaStrengthWeight: 0.78, metaPressureWeight: 0.22, lowerStrengthWeight: 0.82, lowerPressureWeight: 0.18 },
    hardFearless: { label: "hardFearless", metaStrengthWeight: 0.72, metaPressureWeight: 0.28, lowerStrengthWeight: 0.78, lowerPressureWeight: 0.22 },
  },
  tiers: [
    { tier: "OP", minLower: 56, maxPercentile: 0.08 },
    { tier: "1", minLower: 51, maxPercentile: 0.22 },
    { tier: "2", minLower: 48, maxPercentile: 0.45 },
    { tier: "3", minLower: 44, maxPercentile: 0.7 },
  ],
  honey: {
    residualDivisor: 20,
    adaptiveResidualMinDivisor: 3,
    adaptiveResidualQuantile: 0.75,
    adaptiveResidualScale: 1.25,
    rankGapWeight: 0.72,
    residualGapWeight: 0.28,
  },
};
const scoreModelSpec = DATA.scoreModelSpec || DEFAULT_SCORE_MODEL_SPEC;

function readStoredSetting(key, fallback, allowed) {
  try {
    const value = window.localStorage?.getItem(key);
    return !allowed || allowed.includes(value) ? value : fallback;
  } catch (_err) {
    return fallback;
  }
}

function writeStoredSetting(key, value) {
  try {
    window.localStorage?.setItem(key, value);
  } catch (_err) {
    // localStorage can be unavailable in restricted webviews.
  }
}

const state = {
  view: "list",
  scope: "overall",
  role: "all",
  patch: defaultPatch,
  search: "",
  sort: "tier",
  tierPreset: readStoredSetting("tfm2:tierPreset", "classic", tierPresets.map(([id]) => id)),
  sampleMode: readStoredSetting("tfm2:sampleMode", "auto", sampleModes.map(([id]) => id)),
  tournamentSplit: readStoredSetting("tfm2:tournamentSplit", "all"),
  matchSearch: "",
  matchDate: "all",
  championTab: "overview",
  selected: DATA.champions[0]?.id,
  selectedMatch: DATA.matchAnalysis?.[0]?.id,
};

const championById = new Map(DATA.champions.map((champ) => [champ.id, champ]));
const roleLabels = Object.fromEntries(roles);
const scopeLabels = Object.fromEntries(scopes);
const leagueMeta = DATA.leagueMeta || {};
let metaTierCache = null;

function splitPayloadForScope(scope = state.scope) {
  if (scope === "overall") return DATA.combinedSplits || {};
  if (scope === "solo") return DATA.soloSplits || {};
  return DATA.tournamentSplits || {};
}

function countForSplit(axis, key, scope = state.scope) {
  const scopedCount = Number(splitPayloadForScope(scope).counts?.[axis]?.[key] || 0);
  if (scopedCount) return scopedCount;
  return Number(leagueMeta.counts?.[axis]?.[key] || 0);
}

function splitOptionLabel(label, axis, key) {
  const count = countForSplit(axis, key);
  return count ? `${label} (${fmt(count)}경기)` : label;
}

function tournamentSplitOptions() {
  const allLabel = state.scope === "solo" ? "솔랭 전체" : state.scope === "overall" ? "전체 지역" : "대회 전체";
  const options = [["all", allLabel]];
  for (const row of leagueMeta.regions || []) {
    options.push([`region:${row.regionKey}`, splitOptionLabel(`${row.label} 전체`, "region", row.regionKey)]);
  }
  if (state.scope !== "tournament") {
    return options;
  }
  for (const row of leagueMeta.divisions || []) {
    options.push([`division:${row.key}`, splitOptionLabel(`${row.label} 전체`, "division", row.key)]);
  }
  for (const row of leagueMeta.leagues || []) {
    const key = String(row.leagueId);
    options.push([`league:${key}`, splitOptionLabel(row.leagueLabel || `리그 ${key}`, "league", key)]);
  }
  for (const row of leagueMeta.competitions || []) {
    if (row.key === "unknown") continue;
    options.push([`competition:${row.key}`, splitOptionLabel(row.label, "competition", row.key)]);
  }
  return options;
}

function parseTournamentSplit(value = state.tournamentSplit, scope = state.scope) {
  if (!value || value === "all") return null;
  const divider = value.indexOf(":");
  if (divider < 0) return null;
  const axis = value.slice(0, divider);
  const key = value.slice(divider + 1);
  if (!axis || !key) return null;
  if (scope !== "tournament" && axis !== "region") return null;
  return { axis, key, value };
}

function activeTournamentSplit(scope = state.scope) {
  const split = parseTournamentSplit(state.tournamentSplit, scope);
  if (!split) return null;
  const source = splitPayloadForScope(scope);
  const stats = state.patch !== "all"
    ? source.statsByPatch?.[split.axis]?.[state.patch]?.[split.key]
    : source.stats?.[split.axis]?.[split.key];
  return stats ? split : null;
}

function splitKeyForMatch(match, axis) {
  if (axis === "league") return match.leagueId === null || match.leagueId === undefined ? null : String(match.leagueId);
  if (axis === "region") return match.regionKey || null;
  if (axis === "division") return match.division === null || match.division === undefined ? null : String(match.division);
  if (axis === "regionDivision") return match.regionKey && match.division !== null && match.division !== undefined ? `${match.regionKey}:${match.division}` : null;
  if (axis === "competition") return match.competitionKind || "unknown";
  return null;
}

function splitMatches(match, split = activeTournamentSplit()) {
  if (!split) return true;
  if (split.axis === "region") return splitKeyForMatch(match, split.axis) === split.key;
  return match.source === "tournament" && splitKeyForMatch(match, split.axis) === split.key;
}

function activeSplitLabel() {
  const option = tournamentSplitOptions().find(([value]) => value === state.tournamentSplit);
  return option ? option[1].replace(/\s*\([^)]*\)$/, "") : tournamentSplitOptions()[0][1];
}

function splitScopedPayload(kind, fallback, scope = state.scope) {
  const split = activeTournamentSplit(scope);
  if (!split) return fallback;
  const source = splitPayloadForScope(scope);
  if (state.patch !== "all") {
    return source[`${kind}ByPatch`]?.[split.axis]?.[state.patch]?.[split.key] || fallback;
  }
  return source[kind]?.[split.axis]?.[split.key] || fallback;
}

function scopedStats() {
  const split = activeTournamentSplit();
  if (split) {
    return splitScopedPayload("stats", {});
  }
  if (state.patch !== "all") {
    return DATA.statsByPatch?.[state.patch]?.[state.scope] || {};
  }
  return DATA.statsByScope?.[state.scope] || DATA.stats || {};
}

function scopedRelations() {
  const split = activeTournamentSplit();
  if (split) {
    return splitScopedPayload("relationships", { groups: 0, pairs: {}, counters: {} });
  }
  if (state.patch !== "all") {
    return DATA.relationshipsByPatch?.[state.patch]?.[state.scope] || { groups: 0, pairs: {}, counters: {} };
  }
  return DATA.relationshipsByScope?.[state.scope] || { pairs: DATA.relationships || {}, counters: {} };
}

function statOf(id, scope = state.scope) {
  const split = scope === state.scope ? activeTournamentSplit() : null;
  if (split) {
    return (splitScopedPayload("stats", {}) || {})[id] || {};
  }
  if (state.patch !== "all") {
    return (DATA.statsByPatch?.[state.patch]?.[scope] || {})[id] || {};
  }
  return (DATA.statsByScope?.[scope] || DATA.stats || {})[id] || {};
}

function scopedLaneSynergies() {
  const split = activeTournamentSplit();
  if (split) {
    return splitScopedPayload("laneSynergies", {});
  }
  if (state.patch !== "all") {
    return DATA.laneSynergiesByPatch?.[state.patch]?.[state.scope] || {};
  }
  return DATA.laneSynergiesByScope?.[state.scope] || {};
}

function roleTotalMatches(scope = state.scope, role = state.role) {
  const split = scope === state.scope ? activeTournamentSplit() : null;
  const stats = state.patch !== "all"
    ? split
      ? splitScopedPayload("stats", {})
      : DATA.statsByPatch?.[state.patch]?.[scope] || {}
    : split
      ? splitScopedPayload("stats", {})
      : DATA.statsByScope?.[scope] || DATA.stats || {};
  if (role === "all") {
    return Math.max(...Object.values(stats).map((row) => row.totalMatch || 0), 0);
  }
  return Object.values(stats).reduce(
    (sum, row) => sum + Number(row.byPosition?.[role]?.matches || 0),
    0
  );
}

function displayStatOf(id) {
  const stat = { ...statOf(id), championId: id };
  if (state.role === "all") return stat;
  const roleRow = stat.byPosition?.[state.role];
  if (!roleRow || !roleRow.matches) {
    return {
      ...stat,
      championId: id,
      pickCount: 0,
      wins: 0,
      losses: 0,
      winRate: null,
      pickRate: 0,
      dealt: 0,
      taken: 0,
      healing: 0,
      kills: 0,
      deaths: 0,
      assists: 0,
      cs: 0,
      rating: 0,
      level: 0,
      roleScoped: true,
    };
  }

  const matches = Number(roleRow.matches || 0);
  const wins = Number(roleRow.wins || 0);
  const total = roleTotalMatches();
  const pickRate = total ? Math.round((matches / total) * 1000) / 10 : null;
  const banRate = null;
  return {
    ...stat,
    championId: id,
    pickCount: matches,
    wins,
    losses: Math.max(0, matches - wins),
    winRate: matches ? Math.round((wins / matches) * 1000) / 10 : null,
    pickRate,
    banCount: stat.banCount ?? null,
    banRate,
    banPickRate: pickRate,
    pickOpportunities: total,
    banOpportunities: null,
    sourceMatchCounts: { role: total },
    sourcePickCounts: { role: matches },
    sourceBanCounts: { role: 0 },
    dealt: roleRow.dealing ?? roleRow.dealt ?? 0,
    taken: roleRow.tanking ?? roleRow.taken ?? 0,
    healing: roleRow.healing ?? 0,
    kills: roleRow.kills ?? 0,
    deaths: roleRow.deaths ?? 0,
    assists: roleRow.assists ?? 0,
    cs: roleRow.cs ?? 0,
    rating: roleRow.rating ?? 0,
    level: roleRow.level ?? 0,
    linePhase: roleRow.dealingLinePhase || roleRow.goldLinePhase ? {
      dealt: roleRow.dealingLinePhase || 0,
      taken: roleRow.tankingLinePhase || 0,
      healing: roleRow.healingLinePhase || 0,
      gold: roleRow.goldLinePhase || 0,
      cs: roleRow.csLinePhase || 0,
    } : null,
    roleScoped: true,
  };
}

function fmt(value) {
  if (value === null || value === undefined || value === "") return "수집 전";
  if (typeof value === "number") return Number.isInteger(value) ? value.toLocaleString() : value.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return `${value}`;
}

function shortFmt(value) {
  if (value === null || value === undefined || value === "") return "-";
  return fmt(value);
}

function pct(value) {
  if (value === null || value === undefined) return "수집 전";
  return `${value}%`;
}

function rateWithCount(rate, count) {
  if (rate === null || rate === undefined) return "수집 전";
  return `${rate}% (${fmt(count)})`;
}

function banRateDisplayLabel() {
  return state.role === "all" ? "밴률" : "밴률 (전체)";
}

function banRateDisplayTitle() {
  return state.role === "all" ? "" : "밴은 역할 의도를 구분할 수 없어 현재 범위 전체 기준으로 표시됩니다.";
}

function banRateDisplayForChampion(championId, roleScopedStat = null) {
  const stat = state.role === "all" ? roleScopedStat || statOf(championId) : statOf(championId);
  return {
    rate: stat?.banRate,
    count: stat?.banCount,
    title: banRateDisplayTitle(),
  };
}

function tierRank(tier) {
  return { OP: 0, "1": 1, "2": 2, "3": 3, "4": 4, "-": 9 }[tier || "-"] ?? 9;
}

function perGame(total, games) {
  const count = Number(games || 0);
  if (!count) return "-";
  return (Number(total || 0) / count).toFixed(1);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

function quantile(values, q) {
  const sorted = values
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  if (!sorted.length) return null;
  const index = clamp(Number(q ?? 0.5), 0, 1) * (sorted.length - 1);
  const low = Math.floor(index);
  const high = Math.ceil(index);
  if (low === high) return sorted[low];
  return sorted[low] + (sorted[high] - sorted[low]) * (index - low);
}

function percentileMap(items, valueFn) {
  const rows = items
    .map((item, index) => ({ item, index, value: Number(valueFn(item)) }))
    .filter((row) => Number.isFinite(row.value))
    .sort((a, b) => a.value - b.value);
  const map = new Map();
  if (!rows.length) return map;
  if (rows.length === 1) {
    map.set(rows[0].item, 0.5);
    return map;
  }
  let cursor = 0;
  while (cursor < rows.length) {
    let end = cursor + 1;
    while (end < rows.length && rows[end].value === rows[cursor].value) end += 1;
    const percentile = ((cursor + end - 1) / 2) / (rows.length - 1);
    for (let index = cursor; index < end; index += 1) {
      map.set(rows[index].item, percentile);
    }
    cursor = end;
  }
  return map;
}

function currentTierPreset() {
  return tierPresetById[state.tierPreset] || tierPresetById.classic;
}

function currentModelPreset() {
  return scoreModelSpec.presets?.[state.tierPreset] || scoreModelSpec.presets?.classic || DEFAULT_SCORE_MODEL_SPEC.presets.classic;
}

function finiteNumber(value, fallback = NaN) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function betaPosterior(successes, trials, priorMean, kappa, z) {
  const safeTrials = Math.max(0, Math.round(Number(trials || 0)));
  const safeSuccesses = clamp(Number(successes || 0), 0, safeTrials);
  const safePrior = clamp(Number(priorMean || 0.5), 0.001, 0.999);
  const safeKappa = Math.max(0.01, Number(kappa || 0.01));
  const alpha = safeSuccesses + safePrior * safeKappa;
  const beta = Math.max(0.001, safeTrials - safeSuccesses) + (1 - safePrior) * safeKappa;
  const total = alpha + beta;
  const mean = alpha / total;
  const sd = Math.sqrt((alpha * beta) / (total * total * (total + 1)));
  return { mean, sd, lower: clamp(mean - Number(z || 0.84) * sd, 0, 1) };
}

function betaRateMean(successes, trials, priorMean, kappa) {
  const safeTrials = Math.max(0, Math.round(Number(trials || 0)));
  const safeSuccesses = clamp(Number(successes || 0), 0, safeTrials);
  const safePrior = clamp(Number(priorMean || 0.5), 0.001, 0.999);
  const safeKappa = Math.max(0.01, Number(kappa || 0.01));
  return (safeSuccesses + safePrior * safeKappa) / (safeTrials + safeKappa);
}

function kappaBounds(sampleInfo, roleScoped = state.role !== "all") {
  const groups = scoreModelSpec.posterior?.kappa || {};
  const key = roleScoped ? "role" : sampleInfo.mode || "normal";
  return groups[key] || groups.normal || [12, 80];
}

function estimateWinPrior(rows, sampleInfo) {
  const candidates = [];
  let totalWins = 0;
  let totalPicks = 0;
  for (const row of rows) {
    const stat = row.stat || row;
    const picks = Math.max(0, Number(stat.pickCount || 0));
    const winRate = finiteNumber(stat.winRate);
    let wins = finiteNumber(stat.wins);
    if (!Number.isFinite(wins) && Number.isFinite(winRate)) {
      wins = picks * winRate / 100;
    }
    if (!picks || !Number.isFinite(wins)) continue;
    wins = clamp(wins, 0, picks);
    totalWins += wins;
    totalPicks += picks;
    candidates.push({ picks, rate: wins / picks });
  }
  const fallback = Number(scoreModelSpec.posterior?.fallbackPriorMean || 0.5);
  const mean = clamp(totalPicks ? totalWins / totalPicks : fallback, 0.001, 0.999);
  const [low, high] = kappaBounds(sampleInfo);
  if (candidates.length < 2) {
    return { mean, kappa: clamp(24, low, high) };
  }
  const observedVar = candidates.reduce((sum, row) => sum + Math.pow(row.rate - mean, 2), 0) / Math.max(1, candidates.length - 1);
  const noiseVar = candidates.reduce((sum, row) => sum + mean * (1 - mean) / Math.max(1, row.picks), 0) / candidates.length;
  const betweenVar = Math.max(observedVar - noiseVar, 0.0005);
  const kappa = mean * (1 - mean) / betweenVar - 1;
  return { mean, kappa: clamp(kappa, low, high) };
}

function sourceCounter(stat, field) {
  const value = stat?.[field];
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function estimateExposureBaseline(rows) {
  const totals = {};
  const picks = {};
  const bans = {};
  for (const row of rows) {
    const stat = row.stat || row;
    const sourceMatches = sourceCounter(stat, "sourceMatchCounts");
    const sourcePicks = sourceCounter(stat, "sourcePickCounts");
    const sourceBans = sourceCounter(stat, "sourceBanCounts");
    for (const [source, totalRaw] of Object.entries(sourceMatches)) {
      const total = Number(totalRaw || 0);
      if (!(total > 0)) continue;
      totals[source] = (totals[source] || 0) + total;
      picks[source] = (picks[source] || 0) + Number(sourcePicks[source] || 0);
      bans[source] = (bans[source] || 0) + Number(sourceBans[source] || 0);
    }
  }
  const bySource = {};
  for (const [source, total] of Object.entries(totals)) {
    const pick = clamp((picks[source] || 0) / total, 0.001, 0.999);
    const ban = source === "solo" || source === "role" ? null : clamp((bans[source] || 0) / total, 0.001, 0.999);
    const presence = source === "solo" || source === "role" ? pick : 1 - (1 - pick) * (1 - (ban || 0));
    bySource[source] = { pick, ban, presence: clamp(presence, 0.001, 0.999) };
  }
  if (!Object.keys(bySource).length) {
    bySource.overall = { pick: 0.1, ban: 0.05, presence: 0.145 };
  }
  const totalWeight = Object.values(totals).reduce((sum, value) => sum + value, 0) || 1;
  const presence =
    Object.entries(bySource).reduce((sum, [source, row]) => sum + row.presence * (totals[source] || 0), 0) / totalWeight ||
    bySource.overall?.presence ||
    0.145;
  return { bySource, presence: clamp(presence, 0.001, 0.999) };
}

function buildScoreModelContext(rows, sampleInfo) {
  return {
    winPrior: estimateWinPrior(rows, sampleInfo),
    exposure: estimateExposureBaseline(rows),
  };
}

function sourceNormalizedPresence(stat, context) {
  const rateKappa = Number(scoreModelSpec.posterior?.ratePriorKappa || 20);
  const sourceMatches = sourceCounter(stat, "sourceMatchCounts");
  const sourcePicks = sourceCounter(stat, "sourcePickCounts");
  const sourceBans = sourceCounter(stat, "sourceBanCounts");
  const baselines = context.exposure?.bySource || {};
  if (Object.keys(sourceMatches).length) {
    let weighted = 0;
    let totalWeight = 0;
    let noBanData = false;
    for (const [source, totalRaw] of Object.entries(sourceMatches)) {
      const total = Number(totalRaw || 0);
      if (!(total > 0)) continue;
      const baseline = baselines[source] || baselines.overall || { pick: 0.1, ban: 0.05 };
      const pickPost = betaRateMean(sourcePicks[source], total, baseline.pick || 0.1, rateKappa);
      let presence = pickPost;
      if (source === "solo" || source === "role") {
        noBanData = true;
      } else {
        const banPost = betaRateMean(sourceBans[source], total, baseline.ban || 0.05, rateKappa);
        presence = 1 - (1 - pickPost) * (1 - banPost);
      }
      weighted += presence * total;
      totalWeight += total;
    }
    if (totalWeight) {
      return { presence: clamp(weighted / totalWeight, 0, 1), noBanData };
    }
  }
  const pickRate = clamp(Number(stat?.pickRate || 0) / 100, 0, 1);
  const banRateRaw = finiteNumber(stat?.banRate);
  if (!Number.isFinite(banRateRaw)) return { presence: pickRate, noBanData: true };
  const banRate = clamp(banRateRaw / 100, 0, 1);
  return { presence: clamp(1 - (1 - pickRate) * (1 - banRate), 0, 1), noBanData: false };
}

function replayDateInferenceInfo() {
  return DATA.replayDateInference || DATA.sources?.replayDateInference || {};
}

function replayDateQualityTitle(info = replayDateInferenceInfo()) {
  const counts = info.confidenceCounts || {};
  const sources = info.assignedBySource || {};
  const sourceText = Object.entries(sources)
    .map(([key, value]) => `${key}: ${fmt(value)}`)
    .join(" · ");
  return [
    `날짜 배정 ${fmt(info.assigned || 0)} / ${fmt(info.sets || 0)}`,
    `exported ${fmt(counts.exported || 0)}`,
    `high ${fmt(counts.high || 0)}`,
    `medium ${fmt(counts.medium || 0)}`,
    `unknown ${fmt(info.unknown || 0)}`,
    sourceText,
  ]
    .filter(Boolean)
    .join(" · ");
}

function scopedSampleVolume() {
  const stats = Object.values(scopedStats());
  const totalMatches = roleTotalMatches();
  const totalPicks = stats.reduce((sum, row) => {
    if (state.role === "all") return sum + Number(row.pickCount || 0);
    return sum + Number(row.byPosition?.[state.role]?.matches || 0);
  }, 0);
  const estimatedMatches = state.role === "all" ? totalPicks / 10 : totalPicks / 2;
  return Math.max(totalMatches, estimatedMatches);
}

function effectiveSampleInfo() {
  if (state.sampleMode === "early") {
    return { minSample: 5, mode: "early", label: "초반 5픽", reason: "manual" };
  }
  if (state.sampleMode === "normal") {
    return { minSample: 10, mode: "normal", label: "일반 10픽", reason: "manual" };
  }

  const replayInfo = replayDateInferenceInfo();
  const daysSincePatch =
    replayInfo.daysSincePatch === null || replayInfo.daysSincePatch === undefined
      ? null
      : Number(replayInfo.daysSincePatch);
  if (Number.isFinite(daysSincePatch)) {
    return daysSincePatch >= 3
      ? { minSample: 10, mode: "normal", label: "자동: 일반 10픽", reason: `${daysSincePatch}일 경과` }
      : { minSample: 5, mode: "early", label: "자동: 초반 5픽", reason: `${daysSincePatch}일 경과` };
  }

  const matchCount = scopedSampleVolume();
  return matchCount >= 100
    ? { minSample: 10, mode: "normal", label: "자동: 일반 10픽", reason: `${fmt(matchCount)}경기` }
    : { minSample: 5, mode: "early", label: "자동: 초반 5픽", reason: `${fmt(matchCount)}경기` };
}

function metaScoreForStat(stat, sampleInfo = effectiveSampleInfo(), context = null) {
  const preset = currentTierPreset();
  const modelPreset = currentModelPreset();
  const sample = Number(stat.pickCount || 0);
  const rawWinRate = Number(stat.winRate);
  const minSample = sampleInfo.minSample;
  if (!Number.isFinite(rawWinRate) || sample < minSample) {
    return {
      eligible: false,
      tier: "-",
      score: null,
      metaLower: null,
      strengthScore: null,
      draftPressureScore: null,
      sample,
      minSample,
      preset: preset.label,
      reason: !Number.isFinite(rawWinRate) ? "승률 없음" : `표본 ${sample}/${minSample}`,
    };
  }

  const scoreContext = context || buildScoreModelContext([{ stat }], sampleInfo);
  const wins = Number.isFinite(Number(stat.wins)) ? Number(stat.wins) : sample * rawWinRate / 100;
  const posterior = betaPosterior(
    wins,
    sample,
    scoreContext.winPrior?.mean ?? 0.5,
    scoreContext.winPrior?.kappa ?? 24,
    scoreModelSpec.posterior?.z ?? 0.84
  );
  const strengthSpec = scoreModelSpec.strength || {};
  const strengthScore = 100 * (
    Number(strengthSpec.meanWeight ?? 0.7) * posterior.mean +
    Number(strengthSpec.lowerWeight ?? 0.3) * posterior.lower
  );
  const strengthLower = 100 * posterior.lower;
  const exposure = sourceNormalizedPresence(stat, scoreContext);
  const baselinePresence = scoreContext.exposure?.presence || 0.145;
  const pressureSpec = scoreModelSpec.pressure || {};
  const eps = Number(pressureSpec.eps || 0.001);
  const scale = Number(pressureSpec.scale || 16);
  const draftPressureScore = clamp(50 + scale * Math.log((exposure.presence + eps) / (baselinePresence + eps)), 0, 100);
  const score = clamp(
    Number(modelPreset.metaStrengthWeight ?? 0.78) * strengthScore +
      Number(modelPreset.metaPressureWeight ?? 0.22) * draftPressureScore,
    0,
    100
  );
  const metaLower = clamp(
    Number(modelPreset.lowerStrengthWeight ?? 0.82) * strengthLower +
      Number(modelPreset.lowerPressureWeight ?? 0.18) * draftPressureScore,
    0,
    100
  );
  const reliability = Math.sqrt(sample / Math.max(1, sample + minSample * 2));

  return {
    eligible: true,
    tier: "4",
    score: round1(score),
    metaLower: round1(metaLower),
    strengthScore: round1(strengthScore),
    strengthLower: round1(strengthLower),
    draftPressureScore: round1(draftPressureScore),
    presence: round1(exposure.presence * 100),
    baselinePresence: round1(baselinePresence * 100),
    reliability: round1(reliability * 100),
    noBanData: Boolean(exposure.noBanData),
    sample,
    minSample,
    preset: preset.label,
    winRate: rawWinRate,
    posteriorMean: round1(posterior.mean * 100),
    posteriorLower: round1(posterior.lower * 100),
    posteriorSd: round1(posterior.sd * 100),
    priorMean: round1((scoreContext.winPrior?.mean ?? 0.5) * 100),
    priorKappa: round1(scoreContext.winPrior?.kappa ?? 0),
  };
}

function tierForMetaRank(entry, index, total) {
  if (!entry.eligible || entry.metaLower === null || !total) return "-";
  const percentile = (index + 1) / total;
  for (const row of scoreModelSpec.tiers || DEFAULT_SCORE_MODEL_SPEC.tiers) {
    if (entry.metaLower >= Number(row.minLower || 0) && percentile <= Number(row.maxPercentile || 1)) {
      return row.tier || "4";
    }
  }
  return "4";
}

function metaTierCacheKey() {
  return [state.scope, state.patch, state.role, state.tierPreset, state.sampleMode, state.tournamentSplit, DATA.generatedAt || ""].join("|");
}

function buildMetaTierCache() {
  const sampleInfo = effectiveSampleInfo();
  const map = new Map();
  const rows = DATA.champions.map((champ) => ({
    championId: champ.id,
    championName: champ.name,
    stat: displayStatOf(champ.id),
  }));
  const context = buildScoreModelContext(rows, sampleInfo);
  for (const row of rows) {
    const stat = row.stat;
    row.entry = {
      championId: row.championId,
      championName: row.championName,
      ...metaScoreForStat(stat, sampleInfo, context),
      winRate: stat.winRate,
      pickCount: Number(stat.pickCount || 0),
    };
    map.set(row.championId, row.entry);
  }
  const eligible = rows
    .map((row) => row.entry)
    .filter((entry) => entry.eligible)
    .sort(
      (a, b) =>
        Number(b.metaLower || -1) - Number(a.metaLower || -1) ||
        Number(b.score || -1) - Number(a.score || -1) ||
        Number(b.winRate || -1) - Number(a.winRate || -1) ||
        Number(b.pickCount || 0) - Number(a.pickCount || 0) ||
        a.championName.localeCompare(b.championName, "ko")
    );
  eligible.forEach((entry, index) => {
    entry.rank = index + 1;
    entry.eligibleCount = eligible.length;
    entry.tier = tierForMetaRank(entry, index, eligible.length);
  });
  assignHoneyScores(rows.map((row) => row.entry), context, sampleInfo);
  metaTierCache = { key: metaTierCacheKey(), map, sampleInfo, eligibleCount: eligible.length, context };
  return metaTierCache;
}

function metaTierInfo(stat) {
  if (!metaTierCache || metaTierCache.key !== metaTierCacheKey()) {
    buildMetaTierCache();
  }
  if (!stat?.championId) {
    return metaScoreForStat(stat || {}, metaTierCache.sampleInfo, metaTierCache.context);
  }
  return metaTierCache.map.get(stat.championId) || metaScoreForStat(stat, metaTierCache.sampleInfo, metaTierCache.context);
}

function assignHoneyScores(entries, context, sampleInfo) {
  const valid = entries.filter(
    (entry) =>
      entry.eligible &&
      Number.isFinite(Number(entry.strengthScore)) &&
      Number.isFinite(Number(entry.presence))
  );
  const honeySpec = scoreModelSpec.honey || DEFAULT_SCORE_MODEL_SPEC.honey;
  if (!valid.length) {
    for (const entry of entries) {
      entry.honey = { eligible: false, score: null, reason: entry.reason || "표본 부족" };
    }
    return;
  }
  const meanX = valid.reduce((sum, entry) => sum + Number(entry.strengthScore || 0), 0) / valid.length;
  const meanY = valid.reduce((sum, entry) => sum + Number(entry.presence || 0), 0) / valid.length;
  const varX = valid.reduce((sum, entry) => sum + Math.pow(Number(entry.strengthScore || 0) - meanX, 2), 0);
  const covXY = valid.reduce(
    (sum, entry) => sum + (Number(entry.strengthScore || 0) - meanX) * (Number(entry.presence || 0) - meanY),
    0
  );
  const slope = varX > 0 ? Math.max(0, covXY / varX) : 0;
  const intercept = meanY - slope * meanX;
  const maxPresence = Math.max(...valid.map((entry) => Number(entry.presence || 0)), context.exposure?.presence || 0.1);
  const preliminary = [];
  for (const entry of entries) {
    if (!entry.eligible) {
      entry.honey = { eligible: false, score: null, reason: entry.reason || "표본 부족" };
      continue;
    }
    const expectedPresence = clamp(intercept + slope * Number(entry.strengthScore || 0), (context.exposure?.presence || 0.1) * 50, Math.max(5, maxPresence));
    const residual = expectedPresence - Number(entry.presence || 0);
    const reliability = Math.sqrt(Number(entry.sample || 0) / Math.max(1, Number(entry.sample || 0) + Number(sampleInfo.minSample || 5) * 2));
    preliminary.push({ entry, expectedPresence, residual, reliability });
  }

  const baseResidualDivisor = Math.max(1, Number(honeySpec.residualDivisor || 20));
  const positiveResiduals = preliminary
    .map((row) => Math.abs(row.residual))
    .filter((residual) => residual > 0);
  const adaptiveResidual = quantile(positiveResiduals, Number(honeySpec.adaptiveResidualQuantile ?? 0.75));
  const adaptiveResidualDivisor = adaptiveResidual === null
    ? baseResidualDivisor
    : clamp(
        adaptiveResidual * Number(honeySpec.adaptiveResidualScale ?? 1.25),
        Math.max(1, Number(honeySpec.adaptiveResidualMinDivisor ?? 3)),
        baseResidualDivisor
      );

  const strengthPercentiles = percentileMap(preliminary, (row) => row.entry.strengthScore);
  const exposurePercentiles = percentileMap(preliminary, (row) => row.entry.presence);
  const rankWeight = Math.max(0, Number(honeySpec.rankGapWeight ?? 0.72));
  const residualWeight = Math.max(0, Number(honeySpec.residualGapWeight ?? 0.28));
  const totalWeight = Math.max(0.001, rankWeight + residualWeight);
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  for (const row of preliminary) {
    const { entry, expectedPresence, residual, reliability } = row;
    const strengthPercentile = strengthPercentiles.get(row) ?? 0.5;
    const exposurePercentile = exposurePercentiles.get(row) ?? 0.5;
    const rankGap = strengthPercentile - exposurePercentile;
    const residualGap = clamp(residual / adaptiveResidualDivisor, -1, 1);
    const signedScore = clamp(
      100 * reliability * (
        (rankWeight / totalWeight) * rankGap +
          (residualWeight / totalWeight) * residualGap
      ),
      -100,
      100
    );
    if (signedScore > 0.05) positiveCount += 1;
    else if (signedScore < -0.05) negativeCount += 1;
    else neutralCount += 1;
    entry.honey = {
      eligible: true,
      score: round1(signedScore),
      rawScore: round1(signedScore),
      strengthScore: entry.strengthScore,
      exposureRate: entry.presence,
      expectedExposure: round1(expectedPresence),
      hiddenGap: round1(residual),
      reliability: round1(reliability * 100),
      strengthPercentile: round1(strengthPercentile * 100),
      exposurePercentile: round1(exposurePercentile * 100),
      rankGap: round1(rankGap * 100),
      residualFactor: round1(residualGap * 100),
      residualDivisor: round1(adaptiveResidualDivisor),
      sample: entry.sample,
      minSample: entry.minSample,
      scoreMode: "signed",
    };
  }
  for (const row of preliminary) {
    row.entry.honey.positiveCount = positiveCount;
    row.entry.honey.negativeCount = negativeCount;
    row.entry.honey.neutralCount = neutralCount;
  }
}

function honeyScoreInfo(stat) {
  if (!metaTierCache || metaTierCache.key !== metaTierCacheKey()) {
    buildMetaTierCache();
  }
  if (!stat?.championId) {
    return { eligible: false, score: null, reason: "표본 부족" };
  }
  return metaTierCache.map.get(stat.championId)?.honey || { eligible: false, score: null, reason: "표본 부족" };
}

function displayTier(stat) {
  return metaTierInfo(stat).tier || "-";
}

function tierClass(tier) {
  if (tier === "OP") return "tier-op";
  if (["1", "2", "3"].includes(tier)) return `tier-${tier}`;
  return "tier-default";
}

function scoreLabel(info) {
  return info?.score === null || info?.score === undefined ? "-" : info.score.toFixed(1);
}

function scoreTitle(info) {
  if (!info?.eligible) {
    return info?.reason || "표본 부족";
  }
  return [
    `${info.preset} 메타 스코어 ${scoreLabel(info)}`,
    `하한 점수 ${info.metaLower ?? "-"}`,
    `순수 강도 ${info.strengthScore ?? "-"}`,
    `승률 posterior ${info.posteriorMean ?? "-"}%`,
    `하한 승률 ${info.posteriorLower ?? "-"}%`,
    `드래프트 압박 ${info.draftPressureScore ?? "-"}`,
    `노출도 ${info.presence ?? "-"}%`,
    `신뢰도 ${info.reliability ?? "-"}%`,
    `표본 ${info.sample}/${info.minSample}`,
  ].join(" · ");
}

function honeyScoreLabel(info) {
  if (info?.score === null || info?.score === undefined) return "-";
  const score = Math.abs(Number(info.score)) < 0.05 ? 0 : Number(info.score);
  return score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1);
}

function honeyScoreClass(info) {
  const score = Number(info?.score);
  if (!Number.isFinite(score)) return "score-cell honey-score";
  if (score > 0.05) return "score-cell honey-score honey-positive";
  if (score < -0.05) return "score-cell honey-score honey-negative";
  return "score-cell honey-score honey-neutral";
}

function honeyScoreTitle(info) {
  if (!info?.eligible) {
    return info?.reason || "표본 부족";
  }
  const direction = Number(info.score || 0) > 0.05
    ? "저평가 후보"
    : Number(info.score || 0) < -0.05
      ? "과노출 후보"
      : "기대 노출과 유사";
  return [
    `꿀챔 점수 ${honeyScoreLabel(info)}`,
    `해석 ${direction}`,
    `산식 signed strength-exposure gap`,
    `순수 강도 ${info.strengthScore?.toFixed?.(1) ?? "-"}`,
    `강도 백분위 ${info.strengthPercentile ?? "-"}%`,
    `노출도 ${round1(info.exposureRate || 0)}%`,
    `노출 백분위 ${info.exposurePercentile ?? "-"}%`,
    `순위 차이 ${info.rankGap ?? 0}%`,
    `기대 노출도 ${info.expectedExposure ?? "-"}%`,
    `노출 차이 ${info.hiddenGap ?? 0}%`,
    `잔차 배율 ${info.residualFactor ?? 0}%`,
    `신뢰도 ${info.reliability ?? 0}%`,
    `+/${info.positiveCount ?? 0} · -/${info.negativeCount ?? 0} · 0/${info.neutralCount ?? 0}`,
    `표본 ${info.sample}/${info.minSample}`,
  ].join(" · ");
}

function roleLabel(role) {
  return roleLabels[role] || role;
}

function roleScore(champ, role) {
  if (role === "all") return 1;
  return Number(champ.roleFit?.[role] || 0);
}

function bestRole(champ) {
  const stat = statOf(champ.id);
  const byPosition = stat.byPosition || {};
  const fromData = Object.entries(byPosition)
    .map(([role, row]) => [role, Number(row.matches || 0)])
    .sort((a, b) => b[1] - a[1]);
  if (fromData[0]?.[1] > 0) return fromData[0][0];

  const fromBase = roles
    .filter(([role]) => role !== "all")
    .map(([role]) => [role, roleScore(champ, role)])
    .sort((a, b) => b[1] - a[1]);
  return fromBase[0]?.[0] || "all";
}

function filteredChampions() {
  const q = state.search.trim().toLowerCase();
  return DATA.champions
    .filter((champ) => {
      if (state.role !== "all") {
        const roleMatches = Number(statOf(champ.id).byPosition?.[state.role]?.matches || 0);
        if (!roleMatches && roleScore(champ, state.role) < 45 && bestRole(champ) !== state.role) return false;
      }
      if (!q) return true;
      return (
        champ.name.toLowerCase().includes(q) ||
        champ.id.includes(q) ||
        champ.tags.join(" ").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => compareChampions(a, b));
}

function compareChampions(a, b) {
  const as = displayStatOf(a.id);
  const bs = displayStatOf(b.id);
  const am = metaTierInfo(as);
  const bm = metaTierInfo(bs);
  const ah = honeyScoreInfo(as);
  const bh = honeyScoreInfo(bs);
  if (state.sort === "name") return a.name.localeCompare(b.name, "ko");
  if (state.sort === "tier") {
    return (
      tierRank(am.tier) - tierRank(bm.tier) ||
      Number(bm.metaLower ?? -1) - Number(am.metaLower ?? -1) ||
      Number(bm.score ?? -1) - Number(am.score ?? -1) ||
      Number(bs.winRate || -1) - Number(as.winRate || -1) ||
      Number(bs.pickCount || 0) - Number(as.pickCount || 0) ||
      a.name.localeCompare(b.name, "ko")
    );
  }
  if (state.sort === "metaScore") {
    return (
      Number(bm.score ?? -1) - Number(am.score ?? -1) ||
      Number(bs.winRate || -1) - Number(as.winRate || -1) ||
      Number(bs.pickCount || 0) - Number(as.pickCount || 0) ||
      a.name.localeCompare(b.name, "ko")
    );
  }
  if (state.sort === "honeyScore") {
    return (
      Number(bh.score ?? -Infinity) - Number(ah.score ?? -Infinity) ||
      Number(bm.score ?? -1) - Number(am.score ?? -1) ||
      Number(bs.winRate || -1) - Number(as.winRate || -1) ||
      Number(bs.pickCount || 0) - Number(as.pickCount || 0) ||
      a.name.localeCompare(b.name, "ko")
    );
  }
  return Number(bs[state.sort] || -1) - Number(as[state.sort] || -1) || a.name.localeCompare(b.name, "ko");
}

function spriteHtml(asset, className = "champion-sprite", targetHeight = 42) {
  if (!asset || !asset.frame) return `<div class="${className}"></div>`;
  const frame = asset.frame;
  const scale = targetHeight / Math.max(1, frame.h);
  const style = [
    `width:${Math.max(1, frame.w * scale)}px`,
    `height:${Math.max(1, frame.h * scale)}px`,
    `background-image:url('${asset.sheet}')`,
    `background-size:${asset.sheetWidth * scale}px ${asset.sheetHeight * scale}px`,
    `background-position:-${frame.x * scale}px -${frame.y * scale}px`,
  ].join(";");
  return `<div class="${className}" style="${style}"></div>`;
}

function championIcon(champ, size = 42) {
  return `<div class="sprite-frame">${spriteHtml(champ?.asset, "champion-sprite", size)}</div>`;
}

function skillIcon(iconKey) {
  const atlas = DATA.skillIconAtlas;
  const rect = atlas?.rects?.[iconKey];
  if (!atlas || !rect) return `<div class="skill-icon"></div>`;
  const scale = 36 / Math.max(1, rect.h);
  const style = [
    `width:${rect.w * scale}px`,
    `height:${rect.h * scale}px`,
    `background-image:url('${atlas.sheet}')`,
    `background-size:${atlas.sheetWidth * scale}px ${atlas.sheetHeight * scale}px`,
    `background-position:-${rect.x * scale}px -${rect.y * scale}px`,
  ].join(";");
  return `<div class="skill-icon" style="${style}"></div>`;
}

function sourceLabel(source) {
  return {
    combined_export: "대회+솔랭",
    meta_exporter_debug: "대회 DB",
    match_replay_split: "대회 세부",
    solo_rank_region_split: "지역 솔랭",
    solo_rank_export: "솔랭 기록",
    save_news_meta_report: "저장 파일 기사",
    not_collected: "수집 전",
  }[source] || source;
}

const championStatFields = [
  ["attack", "공격력"],
  ["magicPower", "주문력"],
  ["attackSpeed", "공격속도"],
  ["hp", "체력"],
  ["defence", "방어력"],
  ["magicResistance", "마법저항력"],
  ["range", "사거리"],
  ["moveSpeedDisplay", "이동속도"],
];

const patchFieldLabels = {
  attack: "공격력",
  magicPower: "주문력",
  hp: "체력",
  defence: "방어력",
  magicResistance: "마법저항력",
  moveSpeed: "이동속도",
  range: "사거리",
  cooldown: "재사용 대기시간",
  damage: "피해량",
  utility: "유틸",
};

const patchAssetLabels = {
  "stat.attack": "공격력",
  "stat.magic_power": "주문력",
  "stat.hp": "체력",
  "stat.defence": "방어력",
  "stat.magic_resistance": "마법저항력",
  "stat.move_speed": "이동속도",
  "stat.attack_speed": "공격속도",
  "stat.range": "사거리",
  "patch_key.growth_attack": "레벨당 공격력 상승",
  "patch_key.growth_magic_power": "레벨당 주문력 상승",
  "patch_key.growth_hp": "레벨당 체력 상승",
  "patch_key.growth_defence": "레벨당 방어력 상승",
  "patch_key.growth_magic_resistance": "레벨당 마법저항력 상승",
  "patch_key.growth_move_speed": "레벨당 이동속도",
  "patch_key.growth_range": "레벨당 사거리",
  "patch_key.cooltime": "재사용 대기시간",
  "patch_key.action": "행동 시간",
  "patch_key.attack_coef": "공격력 계수",
  "patch_key.ap_coef": "주문력 계수",
  "patch_key.hp_coef": "체력 계수",
  "patch_key.damage": "기본 피해량",
  "patch_key.heal": "기본 회복량",
  "patch_key.hit_box": "피격 판정 범위",
  "patch_key.damage_area": "피해 적용 범위",
  "patch_key.projectile_speed": "투사체 속도",
  "patch_key.move_range": "이동 거리",
  "patch_key.move_time": "이동 시간",
  "patch_key.airbone": "에어본 시간",
  "patch_key.buff_time": "효과 지속 시간",
  "patch_key.slow_ratio": "둔화율",
  "patch_key.slow_time": "둔화 지속 시간",
  "patch_key.shield": "기본 실드량",
  "patch_key.stun": "기절 시간",
  "patch_key.bind": "속박 시간",
};

const percentPatchAssets = new Set([
  "patch_key.attack_coef",
  "patch_key.ap_coef",
  "patch_key.hp_coef",
  "patch_key.slow_ratio",
]);

const statAssetMap = {
  "stat.attack": ["stats", "attack"],
  "stat.magic_power": ["stats", "magicPower"],
  "stat.hp": ["stats", "hp"],
  "stat.defence": ["stats", "defence"],
  "stat.magic_resistance": ["stats", "magicResistance"],
  "stat.attack_speed": ["stats", "attackSpeed"],
  "stat.range": ["stats", "range"],
};

function fmtStat(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
  const number = Number(value);
  return Number.isInteger(number) ? number.toLocaleString() : number.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function currentPatch() {
  return DATA.currentPatch || { meta: { versions: [], changeCount: 0 }, patches: {}, changes: [] };
}

function patchChangesFor(champ) {
  const changes = currentPatch().changes || [];
  return changes.filter((change) => change.champion === champ.id);
}

function patchVersionsForChampion(champ) {
  const versions = currentPatch().meta?.versions || [];
  const byVersion = new Map();
  const seen = new Set();
  patchChangesFor(champ).forEach((change) => {
    const version = change.version || "unknown";
    if (!byVersion.has(version)) byVersion.set(version, []);
    byVersion.get(version).push(change);
  });
  return versions
    .filter((entry) => {
      if (!byVersion.has(entry.version) || seen.has(entry.version)) return false;
      seen.add(entry.version);
      return true;
    })
    .map((entry) => ({ ...entry, changes: byVersion.get(entry.version) }))
    .reverse();
}

function skillTargetId(target) {
  return {
    skill: "skill",
    skill1: "skill",
    skill2: "skill2",
    ult: "ult",
  }[target] || null;
}

function skillTargetLabel(target) {
  return {
    skill: "Lv.1",
    skill1: "Lv.1",
    skill2: "Lv.3",
    ult: "Lv.5",
  }[target] || "";
}

function patchTargetLabel(target) {
  return {
    base_attack: "기본 공격",
    skill: "기술 1",
    skill1: "기술 1",
    skill2: "기술 2",
    ult: "궁극기",
  }[target] || "";
}

function patchChangeLabel(change) {
  const assetLabel = patchAssetLabels[change.asset];
  const target = patchTargetLabel(change.target);
  if (assetLabel) return target ? `${target} ${assetLabel}` : assetLabel;
  const fieldLabel = patchFieldLabels[change.field] || change.field || change.asset;
  return target ? `${target} ${fieldLabel}` : fieldLabel;
}

function patchValueText(change, value) {
  const suffix = percentPatchAssets.has(change.asset) ? "%" : "";
  return patchNumberText(value, suffix);
}

function patchNumberText(value, suffix = "") {
  return `${fmtStat(value)}${suffix}`;
}

function replaceFirstValue(text, oldValue, newValue, suffix = "") {
  const oldText = patchNumberText(oldValue, suffix);
  const newText = patchNumberText(newValue, suffix);
  if (!text || !oldText || oldText === newText) return text;
  if (text.includes(oldText)) return text.replace(oldText, newText);
  if (suffix === "%" && Number.isFinite(Number(oldValue))) {
    const looseOld = `${Number(oldValue).toLocaleString()}%`;
    if (text.includes(looseOld)) return text.replace(looseOld, newText);
  }
  return text;
}

function applySkillPatchDescription(description, change) {
  const asset = change.asset;
  if (["patch_key.attack_coef", "patch_key.ap_coef", "patch_key.hp_coef"].includes(asset)) {
    return replaceFirstValue(description, change.old, change.new, "%");
  }
  if (["patch_key.damage", "patch_key.heal", "patch_key.shield"].includes(asset)) {
    return replaceFirstValue(description, change.old, change.new);
  }
  if (["patch_key.stun", "patch_key.airbone", "patch_key.bind", "patch_key.slow_time", "patch_key.buff_time"].includes(asset)) {
    return replaceFirstValue(description, change.old, change.new);
  }
  return description;
}

function patchedChampionSkills(champ) {
  const skills = (champ.skills || []).map((skill) => ({ ...skill }));
  if (champ.currentInfoSource === "save_probe_champion_info") {
    return skills;
  }
  const byId = new Map(skills.map((skill) => [skill.id, skill]));
  patchChangesFor(champ).forEach((change) => {
    const skillId = skillTargetId(change.target);
    if (!skillId || !byId.has(skillId)) return;
    const skill = byId.get(skillId);
    if (change.asset === "patch_key.cooltime") {
      skill.cooltime = fmtStat(change.new);
      skill.changed = true;
      return;
    }
    const nextDescription = applySkillPatchDescription(skill.description, change);
    if (nextDescription !== skill.description) {
      skill.description = nextDescription;
      skill.changed = true;
    }
  });
  return skills;
}

function patchedChampionValues(champ) {
  const values = {
    stats: { ...(champ.stats || {}) },
    growth: { ...(champ.growth || {}) },
    changed: new Set(),
  };
  if (champ.currentInfoSource === "save_probe_champion_info") {
    return values;
  }
  patchChangesFor(champ).forEach((change) => {
    const target = statAssetMap[change.asset];
    if (!target || change.new === null || change.new === undefined) return;
    const [group, key] = target;
    values[group][key] = Number(change.new);
    values.changed.add(`${group}.${key}`);
  });
  return values;
}

function renderCurrentStats(champ) {
  const values = patchedChampionValues(champ);
  return `<div class="stat-table">
    <div class="stat-table-head"><span>스탯</span><span>Lv.1</span><span>Lv+</span><span>Lv.12</span></div>
    ${championStatFields
      .map(([key, label]) => {
        const base = Number(values.stats[key] ?? 0);
        const growth = Number(values.growth[key] ?? 0);
        const level12 = base + growth * 11;
        const changed = values.changed.has(`stats.${key}`) || values.changed.has(`growth.${key}`);
        return `<div class="stat-table-row ${changed ? "changed" : ""}">
          <span>${label}</span>
          <strong>${fmtStat(base)}</strong>
          <em>${fmtStat(growth)}</em>
          <strong>${fmtStat(level12)}</strong>
        </div>`;
      })
      .join("")}
  </div>`;
}

function patchVersionText() {
  const versions = currentPatch().meta?.versions || [];
  if (!versions.length) return "세이브 패치 내역 없음";
  return versions.map((entry) => entry.version).join(", ");
}

function formatPatchDelta(delta) {
  const number = Number(delta || 0);
  if (Math.abs(number) < 0.01) return "0%";
  return `${number > 0 ? "+" : ""}${fmtStat(number)}%`;
}

function renderPatchHistory(champ) {
  const groups = patchVersionsForChampion(champ);
  if (!groups.length) {
    return `<div class="patch-history empty">
      <p class="notice">이 세이브의 최근 패치 내역에서 ${champ.name} 변경점은 아직 찾지 못했어.</p>
    </div>`;
  }
  return `<div class="patch-history">
    <div class="patch-history-meta">최근 패치 ${patchVersionText()}</div>
    ${groups
      .map((group) => `<section class="patch-version-group">
        <h4>${group.version}</h4>
        ${group.changes
          .map((change) => {
            const label = patchChangeLabel(change);
            const values = change.old !== undefined && change.new !== undefined
              ? `<span>${patchValueText(change, change.old)} → ${patchValueText(change, change.new)}</span>`
              : "";
            return `<div class="patch-change ${Number(change.delta || 0) >= 0 ? "buff" : "nerf"}">
              <strong>${label}</strong>
              ${values}
              <em>${formatPatchDelta(change.delta)}</em>
            </div>`;
          })
          .join("")}
      </section>`)
      .join("")}
  </div>`;
}

function renderButtonGroup(targetId, items, key, className) {
  document.getElementById(targetId).innerHTML = items
    .map(([value, label]) => `<button class="${className} ${state[key] === value ? "active" : ""}" data-${key}="${value}">${label}</button>`)
    .join("");
  document.querySelectorAll(`[data-${key}]`).forEach((button) => {
    button.addEventListener("click", () => {
      state[key] = button.dataset[key];
      render();
    });
  });
}

function renderControls() {
  renderButtonGroup("viewTabs", views, "view", "view-btn");
  renderButtonGroup("scopeTabs", scopes, "scope", "scope-btn");
  renderButtonGroup("roleTabs", roles, "role", "role-btn");
  renderButtonGroup("sideRoles", roles, "role", "role-btn");
  const banRateHeader = document.getElementById("banRateHeader");
  if (banRateHeader) {
    banRateHeader.textContent = banRateDisplayLabel();
    banRateHeader.title = banRateDisplayTitle();
  }
  const patchSelect = document.getElementById("patchSelect");
  patchSelect.innerHTML = patches
    .map(([value, label]) => `<option value="${value}" ${state.patch === value ? "selected" : ""}>${label}</option>`)
    .join("");
  const tierPresetSelect = document.getElementById("tierPresetSelect");
  if (tierPresetSelect) {
    tierPresetSelect.innerHTML = tierPresets
      .map(([value, label]) => `<option value="${value}" ${state.tierPreset === value ? "selected" : ""}>${label}</option>`)
      .join("");
  }
  const sampleModeSelect = document.getElementById("sampleModeSelect");
  if (sampleModeSelect) {
    sampleModeSelect.innerHTML = sampleModes
      .map(([value, label]) => `<option value="${value}" ${state.sampleMode === value ? "selected" : ""}>${label}</option>`)
      .join("");
  }
  const tournamentSplitSelect = document.getElementById("tournamentSplitSelect");
  if (tournamentSplitSelect) {
    const options = tournamentSplitOptions();
    if (!options.some(([value]) => value === state.tournamentSplit)) {
      state.tournamentSplit = "all";
      writeStoredSetting("tfm2:tournamentSplit", state.tournamentSplit);
    }
    tournamentSplitSelect.innerHTML = options
      .map(([value, label]) => `<option value="${value}" ${state.tournamentSplit === value ? "selected" : ""}>${label}</option>`)
      .join("");
  }
}

function renderChampionGrid(champs) {
  document.getElementById("championGrid").innerHTML = champs
    .map(
      (champ) => `
        <button class="champion-tile ${state.selected === champ.id ? "active" : ""}" data-champ="${champ.id}">
          ${championIcon(champ, 34)}
          <span>${champ.name}</span>
        </button>`
    )
    .join("");
  document.querySelectorAll("[data-champ]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selected = button.dataset.champ;
      state.view = "champion";
      render();
    });
  });
}

function renderSummary(champs) {
  const stats = scopedStats();
  const collected = champs.filter((champ) => displayStatOf(champ.id).pickCount > 0).length;
  const totalPicks = champs.reduce((sum, champ) => sum + Number(displayStatOf(champ.id).pickCount || 0), 0);
  const relations = scopedRelations();
  const sampleInfo = effectiveSampleInfo();
  const replayInfo = replayDateInferenceInfo();
  const preset = currentTierPreset();
  const split = activeTournamentSplit();
  const splitLabel = split ? activeSplitLabel() : tournamentSplitOptions()[0][1];
  document.getElementById("summaryGrid").innerHTML = `
    <div class="summary-card"><span>범위</span><strong>${scopeLabels[state.scope]}</strong></div>
    <div class="summary-card"><span>지역/세부 범위</span><strong>${splitLabel}</strong></div>
    <div class="summary-card"><span>패치</span><strong>${state.patch === "all" ? "전체" : state.patch}</strong></div>
    <div class="summary-card"><span>통계 수집 챔피언</span><strong>${collected}</strong></div>
    <div class="summary-card"><span>픽 표본</span><strong>${totalPicks.toLocaleString()}</strong></div>
    <div class="summary-card"><span>관계 경기 표본</span><strong>${(relations.groups || 0).toLocaleString()}</strong></div>
    <div class="summary-card"><span>티어 기준</span><strong>${preset.label}</strong></div>
    <div class="summary-card"><span>표본 기준</span><strong>${sampleInfo.label}</strong></div>
    <div class="summary-card" title="${replayDateQualityTitle(replayInfo)}"><span>날짜 추정</span><strong>${fmt(replayInfo.assigned || 0)} / ${fmt(replayInfo.sets || 0)}</strong></div>
  `;
  const exportMismatched = Boolean(DATA.sources.metaExportMismatched);
  const exportIncompatible = DATA.sources.metaExportUsable === false && DATA.sources.metaExportReason;
  const saveProbeActive = Boolean(DATA.sources.saveProbe);
  const replayLookupMissing = Boolean(DATA.sources.metaExporter && !DATA.sources.exactReplayAthleteNames);
  const snapshotActive = DATA.sources.metaExporter || saveProbeActive;
  document.getElementById("exportStatus").className = `pill ${snapshotActive && !exportMismatched && !exportIncompatible && !replayLookupMissing ? "ok" : "warn"}`;
  document.getElementById("exportStatus").textContent = exportIncompatible
    ? "Meta Exporter 호환 오류"
    : exportMismatched
    ? "세이브/Exporter 불일치"
    : replayLookupMissing
      ? "리플레이 이름 재수집 필요"
    : DATA.sources.metaExporter
      ? "Meta Exporter 통계 사용 중"
    : saveProbeActive
      ? "Save Probe 세이브 데이터 사용 중"
      : "Meta Exporter 실행 전";
  document.getElementById("sampleStatus").className = "pill";
  document.getElementById("sampleStatus").textContent = `생성 ${DATA.generatedAt}`;
}

let autoRefreshBaseline = 0;
let autoRefreshBaselineSet = false;
let autoRefreshReloading = false;

function formatWatchStatusTime(epochSeconds) {
  const epoch = Number(epochSeconds || 0);
  if (!epoch) {
    return "";
  }
  const date = new Date(epoch * 1000);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function maybeReloadAfterAutoRefresh(status) {
  const refreshedAt = Number(status?.lastRefreshAt || 0);
  if (!refreshedAt) {
    return;
  }
  if (!autoRefreshBaselineSet) {
    autoRefreshBaseline = refreshedAt;
    autoRefreshBaselineSet = true;
    return;
  }
  if (refreshedAt <= autoRefreshBaseline || autoRefreshReloading) {
    return;
  }
  autoRefreshReloading = true;
  autoRefreshBaseline = refreshedAt;
  const pill = document.getElementById("watchStatus");
  if (pill) {
    pill.className = "pill busy";
    pill.textContent = "새 데이터 적용 중";
  }
  window.setTimeout(() => window.location.reload(), 250);
}

function renderWatchStatus(status = window.TFM2_AUTO_REFRESH_STATUS) {
  const pill = document.getElementById("watchStatus");
  if (!pill) {
    return;
  }
  if (!status) {
    pill.className = "pill";
    pill.textContent = "자동 갱신 대기";
    pill.title = "TFM2MetaDashboard.exe로 실행하면 선택한 세이브를 자동 감시합니다.";
    return;
  }

  maybeReloadAfterAutoRefresh(status);
  if (autoRefreshReloading) {
    return;
  }

  const stateName = status.state || "idle";
  const refreshedAt = formatWatchStatusTime(status.lastRefreshAt);
  if (stateName === "refreshing") {
    pill.className = "pill busy";
    pill.textContent = "자동 갱신 중";
  } else if (stateName === "updated") {
    pill.className = "pill ok";
    pill.textContent = refreshedAt ? `자동 갱신 ${refreshedAt}` : "자동 갱신 완료";
  } else if (stateName === "watching") {
    pill.className = "pill ok";
    pill.textContent = "자동 감시 중";
  } else if (stateName === "error") {
    pill.className = "pill error";
    pill.textContent = "자동 갱신 오류";
  } else {
    pill.className = "pill";
    pill.textContent = "자동 갱신 대기";
  }

  pill.title = [
    status.saveFile ? `Save: ${status.saveFile}` : "",
    status.message || "",
    status.error ? `Error: ${status.error}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function loadWatchStatus() {
  const oldScript = document.getElementById("autoRefreshStatusScript");
  if (oldScript) {
    oldScript.remove();
  }
  const script = document.createElement("script");
  script.id = "autoRefreshStatusScript";
  script.src = `data/auto-refresh-status.js?t=${Date.now()}`;
  script.onload = () => renderWatchStatus(window.TFM2_AUTO_REFRESH_STATUS);
  script.onerror = () => renderWatchStatus(null);
  document.body.appendChild(script);
}

function renderRows(champs) {
  document.getElementById("championRows").innerHTML = champs
    .map((champ, index) => {
      const stat = displayStatOf(champ.id);
      const tierInfo = metaTierInfo(stat);
      const honeyInfo = honeyScoreInfo(stat);
      const banDisplay = banRateDisplayForChampion(champ.id, stat);
      const tier = tierInfo.tier;
      return `
        <tr class="${state.selected === champ.id ? "active" : ""}" data-row="${champ.id}">
          <td>${index + 1}</td>
          <td><div class="champion-name">${championIcon(champ, 38)}<span>${champ.name}</span></div></td>
          <td><span class="tier ${tierClass(tier)}">${tier}</span></td>
          <td><span class="score-cell" title="${scoreTitle(tierInfo)}">${scoreLabel(tierInfo)}</span></td>
          <td><span class="${honeyScoreClass(honeyInfo)}" title="${honeyScoreTitle(honeyInfo)}">${honeyScoreLabel(honeyInfo)}</span></td>
          <td>${state.role === "all" ? roleLabel(bestRole(champ)) : roleLabel(state.role)}</td>
          <td>${pct(stat.winRate)}</td>
          <td>${rateWithCount(stat.pickRate, stat.pickCount)}</td>
          <td title="${banDisplay.title}">${rateWithCount(banDisplay.rate, banDisplay.count)}</td>
          <td>${pct(stat.banPickRate)}</td>
          <td><span class="source-pill">${sourceLabel(stat.source)}</span></td>
        </tr>`;
    })
    .join("");
  document.querySelectorAll("[data-row]").forEach((row) => {
    row.addEventListener("click", () => {
      state.selected = row.dataset.row;
      state.view = "champion";
      render();
    });
  });
}

function renderRelationList(title, rows, emptyText, difficult = false) {
  if (!rows || !rows.length) {
    return `<div class="relation-panel"><h3>${title}</h3><p class="notice">${emptyText}</p></div>`;
  }
  return `<div class="relation-panel">
    <h3>${title}</h3>
    <div class="relation-list">${rows
      .slice(0, 8)
      .map((rel) => {
        const other = championById.get(rel.champion);
        return `<div class="relation">
          ${championIcon(other, 34)}
          <strong>${other?.name || rel.champion}</strong>
          <span>${difficult ? "상대 승률" : "조합 승률"} ${pct(rel.winRate)} · ${fmt(rel.games)}판</span>
        </div>`;
      })
      .join("")}</div>
  </div>`;
}

const laneComboLabels = {
  bot_support: "바텀 듀오",
  top_jungle: "탑-정글",
  mid_jungle: "미드-정글",
};

function renderLanePairRow(row, selectedId) {
  const left = championById.get(row.leftChampion);
  const right = championById.get(row.rightChampion);
  const partnerId = row.leftChampion === selectedId ? row.rightChampion : row.leftChampion;
  const partner = championById.get(partnerId);
  return `<div class="lane-pair">
    <div class="lane-pair-icons">${championIcon(left, 30)}<span>+</span>${championIcon(right, 30)}</div>
    <strong>${left?.name || row.leftChampion} + ${right?.name || row.rightChampion}</strong>
    <span>${partner ? `${partner.name}와 ` : ""}${pct(row.winRate)} · ${fmt(row.games)}전</span>
  </div>`;
}

function renderLaneSynergyList(championId) {
  const lanes = scopedLaneSynergies();
  const panels = Object.entries(laneComboLabels).map(([combo, label]) => {
    const rows = (lanes[combo] || [])
      .filter((row) => row.leftChampion === championId || row.rightChampion === championId)
      .slice(0, 6);
    if (!rows.length) {
      return `<div class="relation-panel"><h3>${label}</h3><p class="notice">아직 역할 조합 표본이 부족해.</p></div>`;
    }
    return `<div class="relation-panel">
      <h3>${label}</h3>
      <div class="lane-pair-list">${rows.map((row) => renderLanePairRow(row, championId)).join("")}</div>
    </div>`;
  });
  return `<div class="lane-synergy-grid">${panels.join("")}</div>`;
}

function renderPositionBreakdown(stat) {
  const byPosition = stat.byPosition || {};
  const rows = Object.entries(byPosition)
    .map(([role, row]) => ({
      role,
      matches: row.matches || 0,
      wins: row.wins || 0,
      winRate: row.matches ? Math.round((row.wins / row.matches) * 1000) / 10 : null,
      kills: row.kills || 0,
      deaths: row.deaths || 0,
      assists: row.assists || 0,
      dealt: row.dealing ?? row.dealt ?? 0,
      taken: row.tanking ?? row.taken ?? 0,
      healing: row.healing || 0,
    }))
    .sort((a, b) => b.matches - a.matches);
  if (!rows.length) return `<p class="notice">포지션별 표본 수집 전</p>`;
  return `<div class="mini-table">${rows
    .map(
      (row) => `<div>
        <span>${roleLabel(row.role)}</span>
        <strong>${row.wins}승 ${Math.max(0, row.matches - row.wins)}패 · ${pct(row.winRate)}</strong>
        <em>${fmt(row.matches)}판 · KDA ${kda(row.kills, row.deaths, row.assists)} · 딜 ${fmt(row.dealt)}</em>
      </div>`
    )
    .join("")}</div>`;
}

function kda(kills, deaths, assists) {
  if (!deaths) return ((kills + assists) || 0).toFixed(1);
  return ((kills + assists) / deaths).toFixed(2);
}

function itemLabel(item) {
  return item?.name || item?.icon || item?.key || (item?.id !== undefined ? `item #${item.id}` : "item");
}

function itemBadgeText(item) {
  const match = String(item?.icon || "").match(/^t(\d+)_(\d+)$/);
  return match ? `T${match[1]}` : "IT";
}

function renderItemIcon(item) {
  const icon = String(item?.icon || "");
  const iconPath = item?.iconPath || (/^t\d+_\d+$/.test(icon) ? `assets/items/${icon}.png` : "");
  if (iconPath) {
    return `<img class="item-icon" src="${iconPath}" alt="" onerror="this.hidden=true">`;
  }
  return "";
}

function renderItemList(items, emptyText = "아이템 없음", options = {}) {
  const opts = typeof options === "boolean" ? { withCounts: options } : options;
  const rows = (items || []).filter(Boolean);
  if (!rows.length) return `<div class="item-list muted">${emptyText}</div>`;
  return `<div class="item-list">${rows
    .map((item, index) => {
      const label = itemLabel(item);
      const count = opts.withCounts && item.count ? ` x${fmt(item.count)}` : "";
      const icon = item.icon ? ` · ${item.icon}` : "";
      const badge = opts.showOrder ? String(item.order || index + 1) : itemBadgeText(item);
      const badgeClass = opts.showOrder ? "item-order" : "item-tier";
      return `<span class="item-pill" title="${label}${icon}">
        <b class="${badgeClass}">${badge}</b>${renderItemIcon(item)}<span class="item-name">${label}${count}</span>
      </span>`;
    })
    .join("")}</div>`;
}

function renderTopItems(stat) {
  const items = stat?.topItems || [];
  if (!items.length) return `<p class="notice">아이템 표본 수집 전</p>`;
  return renderItemList(items, "아이템 표본 수집 전", { withCounts: true });
}

function rateClass(value) {
  const rate = Number(value);
  if (!Number.isFinite(rate)) return "";
  if (rate >= 55) return "rate-good";
  if (rate <= 45) return "rate-bad";
  return "rate-mid";
}

function percentFrom(wins, games) {
  const count = Number(games || 0);
  if (!count) return null;
  return Math.round((Number(wins || 0) / count) * 1000) / 10;
}

function scopedMatchAnalysisRows(options = {}) {
  let rows = DATA.matchAnalysis || [];
  if (!options.ignorePatch && state.patch !== "all") {
    rows = rows.filter((row) => row.version === state.patch);
  }
  if (state.scope !== "all" && state.scope !== "overall") {
    rows = rows.filter((row) => row.source === state.scope);
  }
  const split = activeTournamentSplit();
  if (split) {
    rows = rows.filter((row) => splitMatches(row, split));
  }
  return rows;
}

function allPatchMatchRowsForScope() {
  return scopedMatchAnalysisRows({ ignorePatch: true });
}

function championReplayEntries(championId) {
  const rows = scopedMatchAnalysisRows();
  const entries = [];
  for (const match of rows) {
    for (const side of ["blue", "red"]) {
      const team = match[side];
      const enemy = match[side === "blue" ? "red" : "blue"];
      for (const player of team?.players || []) {
        if (player.champion !== championId) continue;
        if (state.role !== "all" && player.position !== state.role) continue;
        entries.push({
          match,
          side,
          player,
          won: match.winner === side,
          enemies: enemy?.players || [],
        });
      }
    }
  }
  return entries.sort((a, b) => matchChronologyValue(a.match) - matchChronologyValue(b.match));
}

function isKnownReplayDate(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  return !["unknown", "date not exported", "날짜 미수집"].includes(text.toLowerCase());
}

function knownReplayDate(match) {
  return [match?.dateKey, match?.date, match?.dateLabel].find(isKnownReplayDate) || null;
}

function replayTrendContext(matches) {
  const dated = matches.some((match) => knownReplayDate(match));
  if (dated) return { mode: "date" };
  const versions = new Set(matches.map((match) => match.version).filter(Boolean));
  if (state.patch === "all" && versions.size > 1) {
    const versionOrder = new Map((DATA.patches || []).map((version, index) => [version, index]));
    return { mode: "patch", versionOrder };
  }
  const ids = matches.map((match) => Number(match.id)).filter(Number.isFinite);
  const minId = ids.length ? Math.min(...ids) : 0;
  const maxId = ids.length ? Math.max(...ids) : 0;
  const bucketSize = Math.max(1, Math.ceil(Math.max(1, maxId - minId + 1) / 12));
  return { mode: "replay", minId, bucketSize };
}

function replayTrendBucket(match, context) {
  if (context.mode === "date") {
    const date = String(knownReplayDate(match) || matchDateLabel(match));
    const month = date.match(/(\d{4})[-./](\d{1,2})/);
    if (month) {
      const label = `${month[1]}-${month[2].padStart(2, "0")}`;
      return { key: `date:${label}`, label, order: label };
    }
    const label = date.slice(0, 10);
    return { key: `date:${label}`, label, order: label };
  }
  if (context.mode === "patch") {
    const label = match.version || "패치 미수집";
    const order = context.versionOrder?.has(label) ? context.versionOrder.get(label) : label;
    return { key: `patch:${label}`, label, order };
  }
  const id = Number(match.id || 0);
  const start = context.minId + Math.floor((id - context.minId) / context.bucketSize) * context.bucketSize;
  const end = start + context.bucketSize - 1;
  return {
    key: `replay:${start}`,
    label: context.bucketSize <= 1 ? `#${id}` : `#${start}-${end}`,
    order: start,
  };
}

function playersForChampion(match, championId) {
  const rows = [];
  for (const side of ["blue", "red"]) {
    for (const player of match?.[side]?.players || []) {
      if (player.champion !== championId) continue;
      if (state.role !== "all" && player.position !== state.role) continue;
      rows.push({ side, player, won: match.winner === side });
    }
  }
  return rows;
}

function matchBannedChampion(match, championId) {
  return ["blue", "red"].some((side) => (match?.[side]?.bans || []).includes(championId));
}

function statsForPatchScope(patch, scope = state.scope) {
  const split = scope === state.scope ? parseTournamentSplit(state.tournamentSplit, scope) : null;
  if (split) {
    return splitPayloadForScope(scope).statsByPatch?.[split.axis]?.[patch]?.[split.key] || {};
  }
  return DATA.statsByPatch?.[patch]?.[scope] || {};
}

function roleTotalMatchesForStats(stats, role = state.role) {
  if (role === "all") {
    return Math.max(...Object.values(stats).map((row) => Number(row.totalMatch || 0)), 0);
  }
  return Object.values(stats).reduce(
    (sum, row) => sum + Number(row.byPosition?.[role]?.matches || 0),
    0
  );
}

function trendMetricFromStat(stat, denominator) {
  if (state.role === "all") {
    return {
      picks: Number(stat.pickCount || 0),
      winRate: stat.winRate ?? percentFrom(stat.wins, stat.pickCount),
      pickRate: stat.pickRate ?? percentFrom(stat.pickCount, denominator || stat.totalMatch),
      banRate: stat.banRate ?? percentFrom(stat.banCount, stat.totalMatch),
    };
  }
  const roleRow = stat.byPosition?.[state.role];
  const picks = Number(roleRow?.matches || 0);
  return {
    picks,
    winRate: percentFrom(roleRow?.wins || 0, picks),
    pickRate: percentFrom(picks, denominator),
    banRate: stat.banRate ?? percentFrom(stat.banCount, stat.totalMatch),
  };
}

function championPatchStatTrend(championId) {
  const patchesForTrend = state.patch === "all"
    ? DATA.patches || []
    : (DATA.patches || []).filter((patch) => patch === state.patch);
  const rows = patchesForTrend
    .map((patch, index) => {
      const stats = statsForPatchScope(patch);
      const stat = stats[championId];
      if (!stat) return null;
      const denominator = roleTotalMatchesForStats(stats);
      const metric = trendMetricFromStat(stat, denominator);
      return {
        label: patch,
        order: index,
        games: Number(stat.totalMatch || denominator || 0),
        ...metric,
      };
    })
    .filter(Boolean);
  const pickedGames = rows.reduce((sum, row) => sum + Number(row.picks || 0), 0);
  if (!pickedGames) {
    return null;
  }
  return { mode: "statsPatch", rows };
}

function championTrendBuckets(championId) {
  const patchStatTrend = championPatchStatTrend(championId);
  if (patchStatTrend && (patchStatTrend.rows.length > 1 || state.patch !== "all")) {
    return patchStatTrend;
  }

  const matches = scopedMatchAnalysisRows().sort((a, b) => matchChronologyValue(a) - matchChronologyValue(b));
  const context = replayTrendContext(matches);
  const buckets = new Map();
  for (const match of matches) {
    const bucket = replayTrendBucket(match, context);
    const row = buckets.get(bucket.key) || {
      ...bucket,
      matches: 0,
      picks: 0,
      wins: 0,
      bans: 0,
    };
    const picks = playersForChampion(match, championId);
    row.matches += 1;
    row.picks += picks.length;
    row.wins += picks.filter((pick) => pick.won).length;
    row.bans += matchBannedChampion(match, championId) ? 1 : 0;
    buckets.set(bucket.key, row);
  }
  return {
    mode: context.mode,
    rows: [...buckets.values()]
      .sort((a, b) => (typeof a.order === "number" && typeof b.order === "number" ? a.order - b.order : String(a.order).localeCompare(String(b.order))))
      .map((row) => {
        const pickDenominator = state.role === "all" ? row.matches : row.matches * 2;
        return {
          label: row.label,
          games: row.matches,
          picks: row.picks,
          winRate: percentFrom(row.wins, row.picks),
          pickRate: percentFrom(row.picks, pickDenominator),
          banRate: percentFrom(row.bans, row.matches),
        };
      }),
  };
}

function chartText(value) {
  return String(value ?? "").replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[char]));
}

function shortAxisLabel(label) {
  const text = String(label || "");
  return text.length > 12 ? `${text.slice(0, 11)}...` : text;
}

function sparkChart(title, points, options = {}) {
  const color = options.color || "#69d7be";
  const suffix = options.suffix ?? "%";
  const rows = (points || []).filter((point) => point.value !== null && point.value !== undefined).slice(-(options.maxPoints || 14));
  if (rows.length < 2) {
    return `<div class="meta-chart"><h4>${title}</h4><p class="notice compact">표본 부족</p></div>`;
  }
  let min = options.min ?? Math.min(...rows.map((point) => Number(point.value)));
  let max = options.max ?? Math.max(...rows.map((point) => Number(point.value)));
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const width = 270;
  const height = 128;
  const padLeft = 42;
  const padRight = 14;
  const padTop = 18;
  const padBottom = 24;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const coords = rows.map((point, index) => {
    const x = padLeft + (plotW * index) / Math.max(1, rows.length - 1);
    const y = padTop + plotH - ((Number(point.value) - min) / (max - min)) * plotH;
    return { ...point, x, y };
  });
  const line = coords.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const last = rows[rows.length - 1];
  const labelIndexes = [...new Set([0, Math.floor((rows.length - 1) / 2), rows.length - 1])];
  return `<div class="meta-chart">
    <h4>${title}<strong>${fmt(last.value)}${suffix}</strong></h4>
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}">
      <g class="chart-grid">
        <line x1="${padLeft}" y1="${padTop}" x2="${width - padRight}" y2="${padTop}"></line>
        <line x1="${padLeft}" y1="${padTop + plotH / 2}" x2="${width - padRight}" y2="${padTop + plotH / 2}"></line>
        <line x1="${padLeft}" y1="${padTop + plotH}" x2="${width - padRight}" y2="${padTop + plotH}"></line>
      </g>
      <text class="chart-y-label" x="4" y="${padTop + 3}">${fmt(max)}${suffix}</text>
      <text class="chart-y-label" x="4" y="${padTop + plotH + 3}">${fmt(min)}${suffix}</text>
      <polyline class="chart-line" points="${line}" style="stroke:${color}"></polyline>
      ${coords.map((point) => `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3" style="fill:${color}"><title>${point.label}: ${fmt(point.value)}${suffix}${point.games ? ` · ${fmt(point.games)}판` : ""}</title></circle>`).join("")}
      ${labelIndexes.map((index) => {
        const point = coords[index];
        const anchor = index === 0 ? "start" : index === rows.length - 1 ? "end" : "middle";
        return `<text class="chart-x-label" x="${point.x.toFixed(1)}" y="${height - 4}" text-anchor="${anchor}">${chartText(shortAxisLabel(point.label))}</text>`;
      }).join("")}
    </svg>
  </div>`;
}

function renderChampionTrendPanel(championId) {
  const trend = championTrendBuckets(championId);
  const rows = trend.rows;
  const pickedGames = rows.reduce((sum, row) => sum + Number(row.picks || 0), 0);
  if (pickedGames < 3) {
    return `<div class="relation-panel"><h3>리플레이 통계</h3><p class="notice">리플레이 표본이 조금 더 쌓이면 승률, 픽률, 밴률 추세를 그릴 수 있어.</p></div>`;
  }
  const sourceNote = {
    statsPatch: "x축은 메타 통계 표와 같은 패치별 champion_patch_statistics 표본 기준이야.",
    date: "x축은 저장 데이터의 리플레이 날짜를 월 단위로 묶었어.",
    patch: "리플레이 날짜가 저장/export되지 않아 x축은 패치 버전 기준으로 묶었어.",
    replay: "리플레이 날짜가 저장/export되지 않아 x축은 리플레이 ID 구간 기준으로 묶었어.",
  }[trend.mode];
  const roleNote = state.role === "all" ? "" : ` 픽률은 ${roleLabel(state.role)} 슬롯 기준이야.`;
  const note = `${sourceNote}${roleNote} 분 단위 파워 커브 원본은 저장 데이터에서 확인되지 않아 제외했어.`;
  return `<div class="meta-report">
    <h3>리플레이 통계</h3>
    <div class="meta-chart-grid">
      ${sparkChart("최근 승률", rows.map((row) => ({ label: row.label, value: row.winRate, games: row.games })), { color: "#ff4d32", min: 0, max: 100 })}
      ${sparkChart("픽률", rows.map((row) => ({ label: row.label, value: row.pickRate, games: row.games })), { color: "#6e84e8", min: 0, max: 100 })}
      ${sparkChart("밴률", rows.map((row) => ({ label: row.label, value: row.banRate, games: row.games })), { color: "#ffc547", min: 0, max: 100 })}
    </div>
    <p class="meta-report-note">${note}</p>
  </div>`;
}

function opponentRow(row) {
  const champ = championById.get(row.champion);
  return `<div class="opponent-row">
    ${championIcon(champ, 36)}
    <strong>${champ?.name || row.champion}</strong>
    <span>${fmt(row.games)}게임</span>
    <em class="${rateClass(row.winRate)}">${pct(row.winRate)}</em>
  </div>`;
}

function renderOpponentSplit(rows) {
  const valid = (rows || []).filter((row) => Number(row.games || 0) > 0);
  if (!valid.length) {
    return `<div class="relation-panel"><h3>상대 챔피언</h3><p class="notice">아직 상대 표본이 부족해.</p></div>`;
  }
  const hard = [...valid].sort((a, b) => Number(a.winRate || 0) - Number(b.winRate || 0)).slice(0, 6);
  const easy = [...valid].sort((a, b) => Number(b.winRate || 0) - Number(a.winRate || 0)).slice(0, 6);
  return `<div class="relation-panel">
    <h3>상대 챔피언</h3>
    <div class="opponent-split">
      <section>
        <h4>상대하기 어려움</h4>
        <div class="opponent-list">${hard.map(opponentRow).join("")}</div>
      </section>
      <section>
        <h4>상대하기 쉬움</h4>
        <div class="opponent-list">${easy.map(opponentRow).join("")}</div>
      </section>
    </div>
  </div>`;
}

function renderDuoSynergyTable(championId) {
  const lanes = scopedLaneSynergies();
  const rows = Object.entries(lanes)
    .flatMap(([combo, values]) =>
      (values || [])
        .filter((row) => row.leftChampion === championId || row.rightChampion === championId)
        .map((row) => ({ ...row, combo }))
    )
    .sort((a, b) => Number(b.winRate || 0) - Number(a.winRate || 0) || Number(b.games || 0) - Number(a.games || 0))
    .slice(0, 10);
  if (!rows.length) {
    return `<div class="relation-panel"><h3>듀오 시너지</h3><p class="notice">아직 역할 조합 표본이 부족해.</p></div>`;
  }
  return `<div class="relation-panel">
    <h3>듀오 시너지</h3>
    <div class="duo-table">${rows
      .map((row) => {
        const left = championById.get(row.leftChampion);
        const right = championById.get(row.rightChampion);
        return `<div class="duo-row">
          <span>${laneComboLabels[row.combo] || row.combo}</span>
          <div class="duo-icons">${championIcon(left, 32)}${championIcon(right, 32)}</div>
          <strong>${left?.name || row.leftChampion} + ${right?.name || row.rightChampion}</strong>
          <em class="${rateClass(row.winRate)}">${pct(row.winRate)}</em>
          <b>${fmt(row.games)}판</b>
        </div>`;
      })
      .join("")}</div>
  </div>`;
}

function itemKey(item) {
  if (!item) return "";
  if (item.icon) return `icon:${item.icon}`;
  if (item.id !== undefined && item.id !== null) return `id:${item.id}`;
  return item.key || item.name || "";
}

function uniqueItems(items) {
  const seen = new Set();
  const out = [];
  for (const item of items || []) {
    const key = itemKey(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function collectItemStats(entries) {
  const total = entries.length;
  const byItem = new Map();
  for (const entry of entries) {
    for (const item of uniqueItems(entry.player.items)) {
      const key = itemKey(item);
      const row = byItem.get(key) || { item, games: 0, wins: 0 };
      row.games += 1;
      row.wins += entry.won ? 1 : 0;
      byItem.set(key, row);
    }
  }
  return [...byItem.values()]
    .map((row) => ({ ...row, winRate: percentFrom(row.wins, row.games), pickRate: total ? Math.round((row.games / total) * 1000) / 10 : null }))
    .sort((a, b) => Number(b.games || 0) - Number(a.games || 0) || Number(b.winRate || 0) - Number(a.winRate || 0))
    .slice(0, 10);
}

function collectCoreCombos(entries, size) {
  const byCombo = new Map();
  for (const entry of entries) {
    const items = (entry.player.items || []).filter(Boolean).slice(0, size);
    if (items.length < size) continue;
    const key = items.map(itemKey).join(">");
    const row = byCombo.get(key) || { items, games: 0, wins: 0 };
    row.games += 1;
    row.wins += entry.won ? 1 : 0;
    byCombo.set(key, row);
  }
  return [...byCombo.values()]
    .map((row) => ({ ...row, winRate: percentFrom(row.wins, row.games) }))
    .sort((a, b) => Number(b.games || 0) - Number(a.games || 0) || Number(b.winRate || 0) - Number(a.winRate || 0))
    .slice(0, 8);
}

function renderItemStatsRows(rows) {
  if (!rows.length) return `<p class="notice compact">아이템 표본 부족</p>`;
  return `<div class="item-stat-table">${rows
    .map((row) => `<div class="item-stat-row">
      <span>${renderItemIcon(row.item)}<strong>${itemLabel(row.item)}</strong></span>
      <em class="${rateClass(row.winRate)}">${pct(row.winRate)}</em>
      <b>${pct(row.pickRate)}</b>
      <small>${fmt(row.games)}판</small>
    </div>`)
    .join("")}</div>`;
}

function renderComboRows(rows) {
  if (!rows.length) return `<p class="notice compact">조합 표본 부족</p>`;
  return `<div class="combo-table">${rows
    .map((row) => `<div class="combo-row">
      <span class="combo-icons">${row.items.map((item) => renderItemIcon(item)).join("")}</span>
      <em class="${rateClass(row.winRate)}">${pct(row.winRate)}</em>
      <b>${fmt(row.games)}판</b>
    </div>`)
    .join("")}</div>`;
}

function renderCoreItemStats(championId, stat) {
  const entries = championReplayEntries(championId).filter((entry) => (entry.player.items || []).length);
  if (!entries.length) {
    return `<div class="relation-panel"><h3>코어템 통계</h3>${renderTopItems(stat)}<p class="notice compact">승률/조합 통계는 리플레이 상세 아이템이 있을 때 계산돼.</p></div>`;
  }
  return `<div class="relation-panel">
    <h3>코어템 통계</h3>
    <div class="item-stat-head"><span>아이템</span><span>승률</span><span>채택률</span><span>게임수</span></div>
    ${renderItemStatsRows(collectItemStats(entries))}
    <h3 class="subhead">코어템 조합 통계</h3>
    <div class="combo-grid">
      <section><h4>2코어 조합</h4>${renderComboRows(collectCoreCombos(entries, 2))}</section>
      <section><h4>3코어 조합</h4>${renderComboRows(collectCoreCombos(entries, 3))}</section>
    </div>
  </div>`;
}

function renderLinePhase(stat) {
  const phase = stat.linePhase;
  if (!phase) return `<p class="notice">라인 단계 지표 수집 전</p>`;
  const rows = [
    ["피해량", phase.dealt],
    ["받은 피해", phase.taken],
    ["회복량", phase.healing],
    ["골드", phase.gold],
    ["CS", phase.cs],
  ];
  return `<div class="phase-grid">${rows
    .map(([label, value]) => `<div class="phase-row"><span>${label}</span><strong>${fmt(value)}</strong></div>`)
    .join("")}</div>`;
}

function renderChampionTabNav() {
  return `<div class="champion-tabs">${championTabs
    .map(
      ([value, label]) =>
        `<button class="champion-tab-btn ${state.championTab === value ? "active" : ""}" data-champion-tab="${value}">${label}</button>`
    )
    .join("")}</div>`;
}

function renderChampionMetricRow(stat) {
  const games = Number(stat.pickCount || 0);
  const tierInfo = metaTierInfo(stat);
  const honeyInfo = honeyScoreInfo(stat);
  const banDisplay = banRateDisplayForChampion(stat.championId, stat);
  return `<div class="metric-row">
    <div class="metric"><span>메타 스코어</span><strong title="${scoreTitle(tierInfo)}">${scoreLabel(tierInfo)}</strong></div>
    <div class="metric"><span>꿀챔 점수</span><strong title="${honeyScoreTitle(honeyInfo)}">${honeyScoreLabel(honeyInfo)}</strong></div>
    <div class="metric"><span>승률</span><strong>${pct(stat.winRate)}</strong></div>
    <div class="metric"><span>승/패</span><strong>${fmt(stat.wins)} / ${fmt(stat.losses)}</strong></div>
    <div class="metric"><span>K/D/A</span><strong>${fmt(stat.kills)} / ${fmt(stat.deaths)} / ${fmt(stat.assists)}</strong></div>
    <div class="metric"><span>평균 K/D</span><strong>${perGame(stat.kills, games)} / ${perGame(stat.deaths, games)}</strong></div>
    <div class="metric"><span>픽률</span><strong>${rateWithCount(stat.pickRate, stat.pickCount)}</strong></div>
    <div class="metric" title="${banDisplay.title}"><span>${banRateDisplayLabel()}</span><strong>${rateWithCount(banDisplay.rate, banDisplay.count)}</strong></div>
    <div class="metric"><span>밴픽률</span><strong>${pct(stat.banPickRate)}</strong></div>
  </div>`;
}

function renderSkillList(champ) {
  const skills = patchedChampionSkills(champ);
  return `<div class="skill-list">
    ${skills
      .map(
        (skill) => `
          <div class="skill ${skill.changed ? "changed" : ""}">
            ${skillIcon(skill.iconKey)}
            <div><strong>Lv.${skill.level}</strong><p>${skill.description}</p></div>
            <span>${skill.cooltime ? `${skill.cooltime}s` : "-"}</span>
          </div>`
      )
      .join("")}
  </div>`;
}

function renderChampionOverviewTab(champ, stat, rawStat) {
  return `<div class="champion-tab-panel">
    ${renderChampionMetricRow(stat)}
    ${renderChampionTrendPanel(champ.id)}
    <div class="detail-body">
      <div class="section">
        <h3>포지션별 성과</h3>
        ${renderPositionBreakdown(rawStat)}
      </div>
      <div class="section">
        <h3>라인 단계 누적 지표</h3>
        ${renderLinePhase(stat)}
      </div>
    </div>
  </div>`;
}

function renderChampionBasicTab(champ) {
  return `<div class="champion-tab-panel">
    <div class="detail-body basic-info-layout">
      <div class="section">
        <h3>기본 능력치</h3>
        ${renderCurrentStats(champ)}
      </div>
      <div class="section">
        <h3>스킬</h3>
        ${renderSkillList(champ)}
      </div>
    </div>
  </div>`;
}

function renderChampionPatchTab(champ) {
  return `<div class="champion-tab-panel">
    <div class="section section-wide">
      <h3>패치 히스토리</h3>
      ${renderPatchHistory(champ)}
    </div>
  </div>`;
}

function renderChampionBuildTab(champ, rawStat, synergies, counters) {
  return `<div class="champion-tab-panel">
    <div class="detail-body">
      <div class="section">
        ${renderRelationList("같이 썼을 때 좋은 조합", synergies, "아직 조합 표본이 부족해. 솔랭/대회 기록이 쌓이면 자동으로 채워진다.")}
        ${renderOpponentSplit(counters)}
        ${renderDuoSynergyTable(champ.id)}
      </div>
      <div class="section">
        ${renderCoreItemStats(champ.id, rawStat)}
      </div>
    </div>
  </div>`;
}

function renderChampionTabContent(champ, stat, rawStat, synergies, counters) {
  if (state.championTab === "basic") {
    return renderChampionBasicTab(champ);
  }
  if (state.championTab === "patch") {
    return renderChampionPatchTab(champ);
  }
  if (state.championTab === "build") {
    return renderChampionBuildTab(champ, rawStat, synergies, counters);
  }
  return renderChampionOverviewTab(champ, stat, rawStat);
}

function bindChampionTabs() {
  document.querySelectorAll("[data-champion-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.championTab = button.dataset.championTab;
      render();
    });
  });
}

function renderChampionView() {
  const champ = championById.get(state.selected) || DATA.champions[0];
  if (!champ) {
    document.getElementById("championView").innerHTML = `<p class="notice">아직 생성된 통계가 없어. refresh_meta_dashboard.bat를 먼저 실행해줘.</p>`;
    return;
  }
  const stat = displayStatOf(champ.id);
  const rawStat = statOf(champ.id);
  const relations = scopedRelations();
  const synergies = relations.pairs?.[champ.id] || [];
  const counters = relations.counters?.[champ.id] || [];
  const tier = displayTier(stat);
  const splitLabel = activeTournamentSplit() ? ` · ${activeSplitLabel()}` : "";
  document.getElementById("championView").innerHTML = `
    <div class="detail-head">
      ${championIcon(champ, 76)}
      <div>
        <h2>${champ.name}</h2>
        <p>${champ.category} · ${champ.tags.join(", ")} · ${scopeLabels[state.scope]}${splitLabel}${state.role === "all" ? "" : ` · ${roleLabel(state.role)} 기록`} · ${sourceLabel(stat.source)}</p>
      </div>
      <span class="tier ${tierClass(tier)}">${tier}</span>
    </div>
    ${renderChampionTabNav()}
    ${renderChampionTabContent(champ, stat, rawStat, synergies, counters)}
  `;
  bindChampionTabs();
}

function patchFilteredMatches() {
  return scopedMatchAnalysisRows();
}

function matchDateKey(match) {
  return match?.dateKey || match?.date || "unknown";
}

function matchChronologyValue(match) {
  const parsed = Date.parse(match?.resultTime || match?.dateTime || match?.date || match?.dateKey || "");
  if (Number.isFinite(parsed)) return parsed;
  const sourceId = Number(match?.sourceId ?? match?.id);
  return Number.isFinite(sourceId) ? sourceId : 0;
}

function matchDateLabel(match) {
  return match?.dateLabel || match?.date || "날짜 미수집";
}

function matchDisplayId(match) {
  if (match?.source === "solo") return `Solo #${match.sourceId ?? String(match.id || "").replace(/^solo:/, "")}`;
  return `Replay #${match?.sourceId ?? match?.id ?? "-"}`;
}

function matchSearchText(match) {
  return [
    match.id,
    match.source,
    match.sourceId,
    match.version,
    matchDateLabel(match),
    match.dateSource,
    match.leagueLabel,
    match.regionLabel,
    match.divisionLabel,
    match.competitionKind,
    match.blueTeamId,
    match.redTeamId,
    teamLabel(match, "blue"),
    teamLabel(match, "red"),
  ]
    .join(" ")
    .toLowerCase();
}

function searchFilteredMatches(rows) {
  const query = state.matchSearch.trim().toLowerCase();
  if (!query) return rows;
  return rows.filter((row) => matchSearchText(row).includes(query));
}

function searchAndDateFilteredMatches(rows) {
  let filtered = searchFilteredMatches(rows);
  if (state.matchDate !== "all") {
    filtered = filtered.filter((row) => matchDateKey(row) === state.matchDate);
  }
  return filtered;
}

function shouldUseAllPatchReplaySearch() {
  if (state.patch === "all" || !state.matchSearch.trim()) return false;
  const strictSearch = searchFilteredMatches(patchFilteredMatches());
  if (strictSearch.length) return false;
  return searchFilteredMatches(allPatchMatchRowsForScope()).length > 0;
}

function matchRows() {
  const baseRows = shouldUseAllPatchReplaySearch() ? allPatchMatchRowsForScope() : patchFilteredMatches();
  return searchAndDateFilteredMatches(baseRows);
}

function matchDateOptions() {
  const seen = new Map();
  const baseRows = shouldUseAllPatchReplaySearch() ? allPatchMatchRowsForScope() : patchFilteredMatches();
  for (const match of searchFilteredMatches(baseRows)) {
    const key = matchDateKey(match);
    if (!seen.has(key)) {
      seen.set(key, matchDateLabel(match));
    }
  }
  return [...seen.entries()].map(([key, label]) => ({ key, label }));
}

function durationLabel(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return "-";
  const minute = Math.floor(value / 60);
  const second = String(value % 60).padStart(2, "0");
  return `${minute}:${second}`;
}

function teamLabel(match, side) {
  const id = side === "blue" ? match.blueTeamId : match.redTeamId;
  const team = match[side];
  return team?.name || `${side === "blue" ? "블루" : "레드"} 팀 #${id ?? "-"}`;
}

function matchContextLabel(match) {
  const parts = [];
  if (match.source === "solo" || match.competitionKind === "solo_rank") {
    if (match.regionLabel) parts.push(match.regionLabel);
    parts.push("솔로랭크");
    return parts.join(" · ");
  }
  if (match.leagueLabel) {
    parts.push(match.leagueLabel);
  } else if (match.regionLabel || match.divisionLabel) {
    parts.push([match.regionLabel, match.divisionLabel].filter(Boolean).join(" "));
  }
  if (match.competitionKind === "international") {
    parts.push("국제전");
  } else if (match.scheduleEvent === "LeaguePlayoff") {
    parts.push("플레이오프");
  }
  return parts.length ? parts.join(" · ") : "대회";
}

function totalDeaths(team) {
  return Number(team.deathsTotal || team.players?.reduce((sum, p) => sum + Number(p.deaths || 0), 0) || 0);
}

function matchMetricRow(label, blueValue, redValue, format = fmt) {
  const blue = Number(blueValue || 0);
  const red = Number(redValue || 0);
  const max = Math.max(blue, red, 1);
  return `<div class="team-metric-row">
    <span>${label}</span>
    <div class="side-bar blue"><em style="width:${Math.round((blue / max) * 100)}%"></em><strong>${format(blue)}</strong></div>
    <div class="side-bar red"><em style="width:${Math.round((red / max) * 100)}%"></em><strong>${format(red)}</strong></div>
  </div>`;
}

function matchChampionLine(players) {
  return `<div class="match-champs">${(players || [])
    .map((player) => {
      const champ = championById.get(player.champion);
      const playerName = player.name ? `${player.name} · ` : "";
      return `<span title="${playerName}${roleLabel(player.position)} · ${champ?.name || player.champion}">${championIcon(champ, 32)}</span>`;
    })
    .join("")}</div>`;
}

function matchBanLine(bans) {
  if (!bans || !bans.length) return `<div class="match-champs muted">밴 없음</div>`;
  return `<div class="match-champs bans">${bans
    .map((id) => `<span title="${championById.get(id)?.name || id}">${championIcon(championById.get(id), 28)}</span>`)
    .join("")}</div>`;
}

function renderTeamCard(match, side) {
  const team = match[side];
  const won = match.winner === side;
  return `<div class="match-team-card ${side} ${won ? "winner" : ""}">
    <div class="match-team-head">
      <span>${teamLabel(match, side)}</span>
      <strong>${won ? "승리" : "패배"}</strong>
    </div>
    ${matchChampionLine(team.players)}
    <dl>
      <div><dt>K/D</dt><dd>${fmt(team.killsTotal)} / ${fmt(totalDeaths(team))}</dd></div>
      <div><dt>골드</dt><dd>${fmt(team.gold)}</dd></div>
      <div><dt>Serpen</dt><dd>${fmt(team.serpen)}${team.firstSerpen ? " · 첫 Serpen" : ""}</dd></div>
      <div><dt>Epic</dt><dd>${fmt(team.epic)}${team.firstEpic ? " · 첫 Epic" : ""}</dd></div>
    </dl>
    <div class="ban-block"><span>밴</span>${matchBanLine(team.bans)}</div>
  </div>`;
}

function renderPlayerRows(match) {
  const roleOrder = roles.filter(([role]) => role !== "all").map(([role]) => role);
  const blueByRole = Object.fromEntries((match.blue.players || []).map((player) => [player.position, { ...player, side: "blue" }]));
  const redByRole = Object.fromEntries((match.red.players || []).map((player) => [player.position, { ...player, side: "red" }]));
  const rows = [...Object.values(blueByRole), ...Object.values(redByRole)];
  const maxDeal = Math.max(...rows.map((row) => Number(row.dealt || 0)), 1);

  const playerCard = (row, role, side) => {
    if (!row) {
      return `<div class="match-player-card ${side} empty">
        <span class="side-dot"></span>
        <strong>${roleLabel(role)}</strong>
        <span>기록 없음</span>
      </div>`;
    }
      const champ = championById.get(row.champion);
      const name = row.name && !String(row.name).startsWith("선수 #") ? row.name : "이름 미확인";
      const displayItems = (row.items || []).filter(Boolean);
      return `<div class="match-player-card ${side}">
        <span class="side-dot"></span>
        ${championIcon(champ, 34)}
        <div class="match-player-main">
          <strong>${roleLabel(row.position)} · ${name}</strong>
          <span>${champ?.name || row.champion}</span>
        </div>
        <div class="match-player-stats">
          <span>K/D/A ${shortFmt(row.kills)} / ${shortFmt(row.deaths)} / ${shortFmt(row.assists)}</span>
          <span>피해량 ${fmt(row.dealt)}</span>
          <span>라인전 골드 ${fmt(row.lineGold)}</span>
          <span>라인전 CS ${fmt(row.lineCs)}</span>
        </div>
        <div class="match-player-items">
          ${renderItemList(displayItems, "실제 아이템 기록 없음", { showOrder: true })}
        </div>
        <div class="damage-bar"><em style="width:${Math.round((Number(row.dealt || 0) / maxDeal) * 100)}%"></em><b>${fmt(row.dealt)}</b></div>
      </div>`;
  };

  const sideColumn = (side, label, team) => `<div class="match-player-side ${side}">
    <div class="match-player-side-head">
      <span>${label}</span>
      <strong>${teamLabel(match, side)}</strong>
    </div>
    ${roleOrder.map((role) => playerCard((side === "blue" ? blueByRole : redByRole)[role], role, side)).join("")}
  </div>`;

  return `<div class="match-player-split">
    ${sideColumn("blue", "블루팀", match.blue)}
    ${sideColumn("red", "레드팀", match.red)}
  </div>`;
}

function renderRoleGraph(match) {
  const rolesOnly = roles.filter(([role]) => role !== "all");
  const blueByRole = Object.fromEntries((match.blue.players || []).map((p) => [p.position, p]));
  const redByRole = Object.fromEntries((match.red.players || []).map((p) => [p.position, p]));
  const diffs = rolesOnly.map(([role, label]) => {
    const diff = Number(blueByRole[role]?.lineGold || 0) - Number(redByRole[role]?.lineGold || 0);
    return { role, label, diff };
  });
  const max = Math.max(...diffs.map((row) => Math.abs(row.diff)), 1);
  return `<div class="role-graph">
    <h3>라인전 골드 차이</h3>
    ${diffs
      .map((row) => {
        const width = Math.round((Math.abs(row.diff) / max) * 48);
        return `<div class="role-diff-row">
          <span>${row.label}</span>
          <div class="diff-track">
            <em class="${row.diff >= 0 ? "blue" : "red"}" style="width:${width}%;${row.diff >= 0 ? "left:50%" : `right:50%`}"></em>
          </div>
          <strong class="${row.diff >= 0 ? "blue-text" : "red-text"}">${row.diff >= 0 ? "+" : ""}${fmt(row.diff)}</strong>
        </div>`;
      })
      .join("")}
  </div>`;
}

function renderMatchList(rows) {
  if (!rows.length) {
    return `<div class="match-empty">조건에 맞는 리플레이가 없어.</div>`;
  }
  return `<div class="match-list">${rows
    .slice(0, 80)
    .map((match) => {
      const active = String(state.selectedMatch) === String(match.id);
      return `<button class="match-list-item ${active ? "active" : ""}" data-match="${match.id}">
        <span>${matchDisplayId(match)} · ${matchDateLabel(match)}</span>
        <strong>${teamLabel(match, "blue")} ${match.blue.killsTotal}:${match.red.killsTotal} ${teamLabel(match, "red")}</strong>
        <small>${matchContextLabel(match)} · 패치 ${match.version} · 경기시간 ${durationLabel(match.durationSec)} · ${match.winner === "blue" ? "블루 승" : "레드 승"}</small>
      </button>`;
    })
    .join("")}</div>`;
}

function matchFilterSummary(rows) {
  const currentPatchCount = patchFilteredMatches().length;
  const allPatchCount = allPatchMatchRowsForScope().length;
  const parts = [`${fmt(rows.length)}개 표시`];
  if (state.patch !== "all") {
    parts.push(`현재 패치 ${fmt(currentPatchCount)}개`);
    parts.push(`전체 패치 ${fmt(allPatchCount)}개`);
  } else {
    parts.push("최대 80개 목록 표시");
  }
  return parts.join(" · ");
}

function matchPatchNotice() {
  if (state.patch === "all") return "";
  const currentPatchCount = patchFilteredMatches().length;
  const allPatchCount = allPatchMatchRowsForScope().length;
  if (shouldUseAllPatchReplaySearch()) {
    return `<div class="notice compact">현재 선택한 패치 ${state.patch}에는 검색 결과가 없어서 전체 패치에서 찾은 리플레이를 보여주고 있어.</div>`;
  }
  if (allPatchCount > currentPatchCount) {
    return `<div class="notice compact">현재 패치 ${state.patch} 기준 ${fmt(currentPatchCount)}개만 표시 중이야. 전체 대회 리플레이는 ${fmt(allPatchCount)}개야.</div>`;
  }
  return "";
}

function renderMatchControls(rows, dateOptions) {
  const options = [{ key: "all", label: "전체 날짜" }, ...dateOptions]
    .map(
      (option) =>
        `<option value="${option.key}" ${state.matchDate === option.key ? "selected" : ""}>${option.label}</option>`
    )
    .join("");
  return `<div class="match-filter">
    <input id="matchSearch" class="match-search" type="search" placeholder="팀명 / 리플레이 번호 검색" value="${state.matchSearch}">
    <select id="matchDateSelect" class="match-date-select">${options}</select>
    <p class="match-count">${matchFilterSummary(rows)}</p>
  </div>`;
}

function bindMatchControls() {
  const search = document.getElementById("matchSearch");
  search?.addEventListener("input", (event) => {
    state.matchSearch = event.target.value;
    render();
    const next = document.getElementById("matchSearch");
    if (next) {
      next.focus();
      next.setSelectionRange(next.value.length, next.value.length);
    }
  });
  document.getElementById("matchDateSelect")?.addEventListener("change", (event) => {
    state.matchDate = event.target.value;
    render();
  });
}

function exportMismatchNotice() {
  if (!DATA.sources.metaExportMismatched) {
    return "";
  }
  const delta = Math.abs(Number(DATA.sources.metaExportSaveDeltaSeconds || 0));
  const minutes = delta ? Math.round(delta / 60) : null;
  const deltaText = minutes ? ` 약 ${minutes.toLocaleString()}분 차이` : "";
  return `<div class="notice warning-notice">
    선택한 세이브와 Meta Exporter 진단 파일의 수정 시간이${deltaText} 나. 이 상태에서는 팀명, 선수명, 리플레이 목록이 인게임과 다르게 보일 수 있어.
    게임에서 같은 세이브를 로드하고 Meta Exporter 모드를 켠 상태로 refresh_meta_dashboard를 다시 실행해줘.
  </div>`;
}

function replayNameNotice() {
  if (DATA.sources.exactReplayAthleteNames) {
    return "";
  }
  return `<div class="notice warning-notice">
    리플레이 선수명은 아직 정확한 exporter lookup이 없어서 ID로 표시해. 게임에서 Meta Exporter를 켠 상태로 refresh를 다시 돌리면 teams.debug.txt / athletes.debug.txt 기준으로 이름을 붙일 수 있어.
  </div>`;
}

function renderMatchView() {
  const rows = matchRows();
  const container = document.getElementById("matchView");
  const allRows = DATA.matchAnalysis || [];
  if (!allRows.length) {
    if (DATA.sources.metaExportUsable === false) {
      container.innerHTML = `<p class="notice warning-notice">Meta Exporter 또는 Save Probe가 현재 게임 0.4.9 DB 구조 일부와 맞지 않아 예전 리플레이 export 파일을 무시했어. 0.4.9용 진단 도구가 정상 추출될 때까지 신규 경기 분석은 제한될 수 있어.</p>`;
      return;
    }
    if (DATA.sources.saveProbe) {
      container.innerHTML = `<p class="notice">선택한 세이브는 정상 파싱됐지만 저장된 프로 경기 리플레이가 아직 없어. 솔랭 기록과 선수/팀 데이터는 세이브에서 읽어왔어.</p>`;
      return;
    }
    container.innerHTML = `<p class="notice">아직 리플레이 경기 분석 데이터가 없어. 게임에서 경기를 진행한 뒤 refresh_meta_dashboard.bat를 다시 실행해줘.</p>`;
    return;
  }
  const dateOptions = matchDateOptions();
  let match = rows.find((row) => String(row.id) === String(state.selectedMatch)) || rows[0];
  if (!match) {
    container.innerHTML = `
      <div class="match-layout">
        <aside class="match-picker">
          <h2>리플레이 목록</h2>
          ${renderMatchControls(rows, dateOptions)}
          ${renderMatchList(rows)}
        </aside>
        <section class="match-analysis">
          ${matchPatchNotice()}
          ${exportMismatchNotice()}
          ${replayNameNotice()}
          <p class="notice">검색 조건에 맞는 리플레이가 없어.</p>
        </section>
      </div>`;
    bindMatchControls();
    return;
  }
  state.selectedMatch = match.id;
  const blue = match.blue;
  const red = match.red;
  container.innerHTML = `
    <div class="match-layout">
      <aside class="match-picker">
        <h2>리플레이 목록</h2>
        ${renderMatchControls(rows, dateOptions)}
        ${renderMatchList(rows)}
      </aside>
      <section class="match-analysis">
        ${matchPatchNotice()}
        ${exportMismatchNotice()}
        ${replayNameNotice()}
        <div class="match-title">
          <div>
            <small>${matchDisplayId(match)} · ${matchDateLabel(match)} · ${matchContextLabel(match)} · 패치 ${match.version} · 경기시간 ${durationLabel(match.durationSec)}</small>
            <h2>${teamLabel(match, "blue")} vs ${teamLabel(match, "red")}</h2>
          </div>
          <span class="pill ${match.winner === "blue" ? "blue-pill" : "red-pill"}">${match.winner === "blue" ? "블루 승리" : "레드 승리"}</span>
        </div>
        <div class="match-team-grid">
          ${renderTeamCard(match, "blue")}
          ${renderTeamCard(match, "red")}
        </div>
        <div class="match-panels">
          <div class="match-panel">
            <h3>팀 분석</h3>
            ${matchMetricRow("챔피언 처치", blue.killsTotal, red.killsTotal)}
            ${matchMetricRow("골드 획득량", blue.gold, red.gold)}
            ${matchMetricRow("챔피언에게 가한 피해량", blue.dealtTotal, red.dealtTotal)}
            ${matchMetricRow("라인전 골드", blue.lineGoldTotal, red.lineGoldTotal)}
            ${matchMetricRow("CS", blue.lineCsTotal, red.lineCsTotal)}
            ${matchMetricRow("Serpen", blue.serpen, red.serpen)}
          </div>
          <div class="match-panel">
            ${renderRoleGraph(match)}
          </div>
        </div>
        <div class="match-panel">
          <h3>선수별 피해량 / 라인 지표</h3>
          ${renderPlayerRows(match)}
          <p class="notice compact">라인 골드는 리플레이 덤프의 <code>gold_line_phase</code> 값으로, 전체 골드가 아니라 라인전 단계에 기록된 역할별 골드다. CS도 같은 라인전 단계의 <code>cs_line_phase</code> 값이다.</p>
        </div>
        <p class="notice">현재 리플레이 덤프에는 결과창의 실제 시간별 골드 곡선이 직접 노출되지 않아, 대시보드는 최종 골드와 라인전 지표를 그래프로 요약한다.</p>
      </section>
    </div>
  `;
  document.querySelectorAll("[data-match]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedMatch = button.dataset.match;
      render();
    });
  });
  bindMatchControls();
}

function render() {
  renderControls();
  const champs = filteredChampions();
  if (!champs.some((champ) => champ.id === state.selected)) {
    state.selected = champs[0]?.id || DATA.champions[0]?.id;
  }
  renderChampionGrid(champs);
  renderSummary(champs);
  renderRows(champs);
  renderChampionView();
  renderMatchView();
  document.getElementById("listView").hidden = state.view !== "list";
  document.getElementById("championView").hidden = state.view !== "champion";
  document.getElementById("matchView").hidden = state.view !== "matches";
}

document.getElementById("search").addEventListener("input", (event) => {
  state.search = event.target.value;
  render();
});

document.getElementById("sortSelect").addEventListener("change", (event) => {
  state.sort = event.target.value;
  render();
});

document.getElementById("patchSelect").addEventListener("change", (event) => {
  state.patch = event.target.value;
  render();
});

document.getElementById("tierPresetSelect")?.addEventListener("change", (event) => {
  state.tierPreset = event.target.value;
  writeStoredSetting("tfm2:tierPreset", state.tierPreset);
  render();
});

document.getElementById("sampleModeSelect")?.addEventListener("change", (event) => {
  state.sampleMode = event.target.value;
  writeStoredSetting("tfm2:sampleMode", state.sampleMode);
  render();
});

document.getElementById("tournamentSplitSelect")?.addEventListener("change", (event) => {
  state.tournamentSplit = event.target.value;
  writeStoredSetting("tfm2:tournamentSplit", state.tournamentSplit);
  state.matchDate = "all";
  render();
});

document.getElementById("sourceLine").textContent = DATA.save.path
  ? `Save: ${DATA.save.lastModified}`
  : "Save: not found";

render();
renderWatchStatus();
loadWatchStatus();
window.setInterval(loadWatchStatus, 5000);
