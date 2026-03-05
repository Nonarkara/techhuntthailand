const http = require("http");
const fsp = require("fs/promises");
const path = require("path");

let googleTrends = null;
try {
  googleTrends = require("google-trends-api");
} catch {
  googleTrends = null;
}

const ROOT = process.cwd();
const PORT = Number(process.env.PORT || 4173);
const NEWS_CACHE_TTL_MS = 10 * 60 * 1000;
const PULSE_CACHE_TTL_MS = 10 * 60 * 1000;
const BOUNDARY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const NETWORK_CACHE_TTL_MS = 20 * 60 * 1000;
const TREND_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const DIRECTORY_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const OUTBOUND_FETCH_TIMEOUT_MS = 5000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".heic": "image/heic",
};

const NEWS_FEEDS = {
  startups: {
    url: "https://techcrunch.com/category/startups/feed/",
    limit: 6,
    filter: (item) =>
      !/techcrunch disrupt|techcrunch founder summit/i.test(item.title),
  },
  government: {
    url:
      "https://news.google.com/rss/search?q=site:thailand.go.th%20OR%20site:thaigov.go.th%20digital%20economy%20Thailand&hl=en-US&gl=US&ceid=US:en",
    limit: 6,
    minDate: "2025-01-01",
    filter: (item) =>
      !/^(all posts of tag|topics|public health)$/i.test(item.title),
  },
};

const NETWORK_FEED = {
  url:
    "https://news.google.com/rss/search?q=%22smart%20city%20Thailand%22%20OR%20depa%20startup%20Thailand%20government&hl=en-US&gl=US&ceid=US:en",
  limit: 20,
  minDate: "2024-01-01",
  filter: (item) => {
    const haystack = `${item.title} ${item.summary} ${item.source}`.toLowerCase();
    const hasSmartCityContext = /(smart city|thailand|depa|startup|digital economy)/.test(
      haystack
    );
    const isTickerNoise =
      /(coinmarketcap|crypto|price today|yahoo finance|stock|shares|alpha.?scan)/.test(
        haystack
      );
    return hasSmartCityContext && !isTickerNoise;
  },
};

const FALLBACK_NEWS = {
  startups: [
    {
      title: "Startup feed is temporarily unavailable",
      link: "https://www.depa.or.th/en",
      source: "Smart City Thailand Hub",
      published: "Live feed fallback",
      summary:
        "External startup sources did not respond. Service remains online and will refresh automatically.",
    },
  ],
  government: [
    {
      title: "Government feed is temporarily unavailable",
      link: "https://www.depa.or.th/en",
      source: "Smart City Thailand Hub",
      published: "Live feed fallback",
      summary:
        "External government sources did not respond. Service remains online and will refresh automatically.",
    },
  ],
};

const FALLBACK_NETWORK_ITEMS = [
  {
    title: "Network mention feed is temporarily unavailable",
    link: "https://www.depa.or.th/en",
    source: "Smart City Thailand Hub",
    published: "Live feed fallback",
    summary:
      "Ecosystem mention sources are currently unreachable. The page will auto-refresh once sources respond.",
  },
];

const TREND_TERMS = [
  {
    term: "PM2.5",
    label: "Air Quality",
    pillarId: "green-resilience",
  },
  {
    term: "น้ำท่วม",
    label: "Flood Risk",
    pillarId: "green-resilience",
  },
  {
    term: "รถติด",
    label: "Mobility Pressure",
    pillarId: "productive-mobility",
  },
  {
    term: "ท่องเที่ยว",
    label: "Tourism Flow",
    pillarId: "productive-mobility",
  },
  {
    term: "บริการดิจิทัล",
    label: "Digital Services",
    pillarId: "inclusive-services",
  },
];

const CITY_TREND_REGIONS = {
  bangkok: "TH-10",
  "chiang-mai": "TH-50",
  "khon-kaen": "TH-40",
  phuket: "TH-83",
  "hat-yai": "TH-90",
};

const CITY_PILLAR_PROFILE = {
  bangkok: ["productive-mobility", "inclusive-services", "green-resilience"],
  "chiang-mai": ["green-resilience", "inclusive-services", "productive-mobility"],
  "khon-kaen": ["productive-mobility", "green-resilience", "inclusive-services"],
  phuket: ["green-resilience", "productive-mobility", "inclusive-services"],
  "hat-yai": ["inclusive-services", "productive-mobility", "green-resilience"],
};

const THAILAND_STATIONS = [
  {
    id: "bangkok",
    name: "Bangkok",
    label_th: "กรุงเทพฯ",
    label_zh: "曼谷",
    latitude: 13.7563,
    longitude: 100.5018,
  },
  {
    id: "chiang-mai",
    name: "Chiang Mai",
    label_th: "เชียงใหม่",
    label_zh: "清迈",
    latitude: 18.7883,
    longitude: 98.9853,
  },
  {
    id: "khon-kaen",
    name: "Khon Kaen",
    label_th: "ขอนแก่น",
    label_zh: "孔敬",
    latitude: 16.4419,
    longitude: 102.835,
  },
  {
    id: "phuket",
    name: "Phuket",
    label_th: "ภูเก็ต",
    label_zh: "普吉",
    latitude: 7.8804,
    longitude: 98.3923,
  },
  {
    id: "hat-yai",
    name: "Hat Yai",
    label_th: "หาดใหญ่",
    label_zh: "合艾",
    latitude: 7.0084,
    longitude: 100.4747,
  },
];

const THAILAND_BOUNDS = {
  minLatitude: 4.5,
  maxLatitude: 21.5,
  minLongitude: 96,
  maxLongitude: 106.5,
};

const RESOURCES = {
  sources: [
    {
      name: "geoBoundaries",
      description: "Thailand ADM0 and ADM1 geometries used for the live map layers.",
      url: "https://www.geoboundaries.org/api.html",
    },
    {
      name: "Open-Meteo Air Quality",
      description: "City anchor AQI and PM2.5 signal for the pulse dashboard.",
      url: "https://open-meteo.com/en/docs/air-quality-api",
    },
    {
      name: "Open-Meteo Forecast",
      description: "Temperature, precipitation, and wind context for each city.",
      url: "https://open-meteo.com/en/docs",
    },
    {
      name: "USGS Earthquake API",
      description: "Recent regional seismic events around Thailand.",
      url: "https://earthquake.usgs.gov/fdsnws/event/1/",
    },
    {
      name: "Google Trends",
      description: "Search behavior signals by city-region for pulse keywords.",
      url: "https://trends.google.com",
    },
  ],
  assets: [
    {
      title: "Program Overview",
      summary: "Investor and policy entry point for current Thailand smart city momentum.",
      label: "Open Overview",
      href: "/index.html",
    },
    {
      title: "Knowledge Library",
      summary: "Pillar-level and domain-level project inventory for due diligence.",
      label: "Open Library",
      href: "/library.html",
    },
    {
      title: "Network Mentions",
      summary: "Media and narrative monitoring for Smart City Thailand ecosystem visibility.",
      label: "Open Ecosystem News",
      href: "/network-news.html",
    },
    {
      title: "Directory Source File",
      summary: "Original report source that the searchable directory was built from.",
      label: "View Report Record",
      href: "/index.html#about-section",
    },
  ],
};

let cachedNews = null;
let newsExpiry = 0;
let cachedPulse = null;
let pulseExpiry = 0;
let cachedBoundaries = null;
let boundaryExpiry = 0;
let cachedNetworkNews = null;
let networkExpiry = 0;
let cachedDirectoryCatalog = null;
let directoryExpiry = 0;
let cachedCityTrends = null;
let trendsExpiry = 0;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/health") {
    sendJson(res, 200, buildHealthPayload());
    return;
  }

  if (url.pathname === "/api/news") {
    await serveNews(res);
    return;
  }

  if (url.pathname === "/api/pulse") {
    await servePulse(res);
    return;
  }

  if (url.pathname === "/api/network-news") {
    await serveNetworkNews(res);
    return;
  }

  if (url.pathname === "/api/library") {
    await serveLibrary(res);
    return;
  }

  if (url.pathname === "/api/resources") {
    sendJson(res, 200, {
      generatedAt: new Date().toISOString(),
      ...RESOURCES,
    });
    return;
  }

  await serveStatic(url.pathname, res);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Smart City directory server listening on http://127.0.0.1:${PORT}`);
});

async function serveNews(res) {
  try {
    const payload = await getNewsPayload();
    sendJson(res, 200, payload);
  } catch (error) {
    const fallback = buildNewsFallback(error);
    cachedNews = fallback;
    newsExpiry = Date.now() + Math.min(NEWS_CACHE_TTL_MS, 2 * 60 * 1000);
    sendJson(res, 200, fallback);
  }
}

async function servePulse(res) {
  try {
    const payload = await getPulsePayload();
    sendJson(res, 200, payload);
  } catch (error) {
    sendJson(res, 200, buildPulseFallback(error));
  }
}

async function serveNetworkNews(res) {
  try {
    const payload = await getNetworkNewsPayload();
    sendJson(res, 200, payload);
  } catch (error) {
    const fallback = buildNetworkFallback(error);
    cachedNetworkNews = fallback;
    networkExpiry = Date.now() + Math.min(NETWORK_CACHE_TTL_MS, 2 * 60 * 1000);
    sendJson(res, 200, fallback);
  }
}

async function serveLibrary(res) {
  try {
    const payload = await getLibraryPayload();
    sendJson(res, 200, payload);
  } catch (error) {
    sendJson(res, 200, buildLibraryFallback(error));
  }
}

function buildHealthPayload() {
  const now = Date.now();

  return {
    status: "ok",
    service: "smart-city-thailand-tech-hunt",
    timestamp: new Date(now).toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    cache: {
      newsFresh: Boolean(cachedNews && now < newsExpiry),
      pulseFresh: Boolean(cachedPulse && now < pulseExpiry),
      networkFresh: Boolean(cachedNetworkNews && now < networkExpiry),
      libraryFresh: Boolean(cachedDirectoryCatalog && now < directoryExpiry),
    },
  };
}

function buildNewsFallback(error) {
  return {
    generatedAt: new Date().toISOString(),
    refreshMinutes: Math.round(NEWS_CACHE_TTL_MS / 60000),
    startups: FALLBACK_NEWS.startups,
    government: FALLBACK_NEWS.government,
    fallback: true,
    warning: `Live feed unavailable: ${errorMessage(error)}`,
  };
}

function buildNetworkFallback(error) {
  return {
    generatedAt: new Date().toISOString(),
    refreshMinutes: Math.round(NETWORK_CACHE_TTL_MS / 60000),
    items: FALLBACK_NETWORK_ITEMS,
    fallback: true,
    warning: `Live feed unavailable: ${errorMessage(error)}`,
  };
}

function buildPulseFallback(error) {
  return {
    generatedAt: new Date().toISOString(),
    refreshMinutes: Math.round(PULSE_CACHE_TTL_MS / 60000),
    boundaries: null,
    stations: THAILAND_STATIONS.map((station) => ({
      ...station,
      trendKeywords: [],
      trendSource: "Unavailable",
      pillars: [],
      projectCount: 0,
      air: {
        usAqi: null,
        europeanAqi: null,
        pm2_5: null,
        pm10: null,
      },
      weather: {
        temperature_2m: null,
        precipitation: null,
        weather_code: null,
        wind_speed_10m: null,
      },
    })),
    earthquakes: [],
    pillars: [],
    errors: [errorMessage(error)],
    fallback: true,
    sources: {
      boundaries: "geoBoundaries",
      airQuality: "Open-Meteo Air Quality API",
      weather: "Open-Meteo Forecast API",
      earthquakes: "USGS Earthquake API",
      trends: "Google Trends",
    },
  };
}

function buildLibraryFallback(error) {
  return {
    generatedAt: new Date().toISOString(),
    pillars: [],
    domains: [],
    tracks: [
      {
        name: "Catalog unavailable",
        description:
          "The directory catalog could not be parsed at startup. Check data.js generation and retry.",
        metric: errorMessage(error),
      },
    ],
    fallback: true,
  };
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

async function getNewsPayload() {
  const now = Date.now();
  if (cachedNews && now < newsExpiry) {
    return cachedNews;
  }

  const [startups, government] = await Promise.all([
    fetchFeed(NEWS_FEEDS.startups),
    fetchFeed(NEWS_FEEDS.government),
  ]);

  cachedNews = {
    generatedAt: new Date().toISOString(),
    refreshMinutes: Math.round(NEWS_CACHE_TTL_MS / 60000),
    startups,
    government,
  };
  newsExpiry = now + NEWS_CACHE_TTL_MS;
  return cachedNews;
}

async function getNetworkNewsPayload() {
  const now = Date.now();
  if (cachedNetworkNews && now < networkExpiry) {
    return cachedNetworkNews;
  }

  const items = await fetchFeed(NETWORK_FEED);

  cachedNetworkNews = {
    generatedAt: new Date().toISOString(),
    refreshMinutes: Math.round(NETWORK_CACHE_TTL_MS / 60000),
    items,
  };
  networkExpiry = now + NETWORK_CACHE_TTL_MS;
  return cachedNetworkNews;
}

async function getLibraryPayload() {
  const catalog = await getDirectoryCatalog();
  const timelineTracks = (catalog.data.timeline || []).map((item) => ({
    name: item.step || item.name || "Program activity",
    description: item.detail || item.description || "",
    metric: item.value || "",
  }));

  if (!timelineTracks.length) {
    timelineTracks.push(
      {
        name: "Research Intake",
        description: "Directory and program mapping from source stock report.",
        metric: `${catalog.data.stats?.solutions || 0} solutions`,
      },
      {
        name: "City Workshops",
        description: "Cross-city sessions with partners, agencies, and startups.",
        metric: `${catalog.data.stats?.online_sessions || 0} online + ${
          catalog.data.stats?.onsite_workshops || 0
        } onsite`,
      },
      {
        name: "Business Matching",
        description: "Pilot and investment conversations across the smart city ecosystem.",
        metric: `${catalog.data.stats?.business_matching_attendance || "70-100"} participants`,
      }
    );
  }

  return {
    generatedAt: new Date().toISOString(),
    pillars: catalog.pillarCatalog.pillars.map((pillar) => ({
      ...pillar,
      keywords: catalog.keywordBank[pillar.id] || [],
    })),
    domains: catalog.data.domains || [],
    tracks: timelineTracks.slice(0, 6),
  };
}

async function getPulsePayload() {
  const now = Date.now();
  if (cachedPulse && now < pulseExpiry) {
    return cachedPulse;
  }

  const [boundariesResult, stationsResult, quakesResult, trendsResult, catalogResult] =
    await Promise.allSettled([
      getThailandBoundaries(),
      fetchStationSignals(),
      fetchThailandEarthquakes(),
      fetchCityTrendSignals(),
      getDirectoryCatalog(),
    ]);

  const errors = [];

  const boundaries =
    boundariesResult.status === "fulfilled"
      ? boundariesResult.value
      : (errors.push(boundariesResult.reason?.message || String(boundariesResult.reason)), null);

  const stations =
    stationsResult.status === "fulfilled"
      ? stationsResult.value
      : (errors.push(stationsResult.reason?.message || String(stationsResult.reason)), []);

  const earthquakes =
    quakesResult.status === "fulfilled"
      ? quakesResult.value
      : (errors.push(quakesResult.reason?.message || String(quakesResult.reason)), []);

  const cityTrends =
    trendsResult.status === "fulfilled"
      ? trendsResult.value
      : (errors.push(trendsResult.reason?.message || String(trendsResult.reason)), []);

  const catalog =
    catalogResult.status === "fulfilled"
      ? catalogResult.value
      : (errors.push(catalogResult.reason?.message || String(catalogResult.reason)), null);

  const cityInsights = buildCityInsights(stations, cityTrends, catalog);

  cachedPulse = {
    generatedAt: new Date().toISOString(),
    refreshMinutes: Math.round(PULSE_CACHE_TTL_MS / 60000),
    boundaries,
    stations: cityInsights,
    earthquakes,
    pillars: catalog ? catalog.pillarCatalog.pillars : [],
    errors,
    sources: {
      boundaries: "geoBoundaries",
      airQuality: "Open-Meteo Air Quality API",
      weather: "Open-Meteo Forecast API",
      earthquakes: "USGS Earthquake API",
      trends: "Google Trends",
    },
  };
  pulseExpiry = now + PULSE_CACHE_TTL_MS;
  return cachedPulse;
}

async function getDirectoryCatalog() {
  const now = Date.now();
  if (cachedDirectoryCatalog && now < directoryExpiry) {
    return cachedDirectoryCatalog;
  }

  const filePath = path.join(ROOT, "data.js");
  const text = await fsp.readFile(filePath, "utf8");
  const match = text.match(/window\.DIRECTORY_DATA\s*=\s*(\{[\s\S]*\});\s*$/);

  if (!match) {
    throw new Error("Could not parse DIRECTORY_DATA from data.js");
  }

  const data = JSON.parse(match[1]);
  const solutions = data.solutions || [];
  const domainMap = new Map((data.domains || []).map((domain) => [domain.id, domain]));
  const pillarCatalog = buildPillarCatalog(domainMap, solutions);
  const keywordBank = buildKeywordBank(solutions, pillarCatalog.domainToPillar);

  cachedDirectoryCatalog = {
    data,
    solutions,
    domainMap,
    pillarCatalog,
    keywordBank,
  };
  directoryExpiry = now + DIRECTORY_CACHE_TTL_MS;
  return cachedDirectoryCatalog;
}

function buildPillarCatalog(domainMap, solutions) {
  const template = [
    {
      id: "inclusive-services",
      label: "Inclusive Services & Governance",
      label_th: "บริการเพื่อทุกคนและธรรมาภิบาล",
      label_zh: "包容性服务与治理",
      description:
        "Public services, trust, citizen inclusion, health, and people capability.",
      domains: ["governance", "people", "living"],
    },
    {
      id: "green-resilience",
      label: "Green Resilience",
      label_th: "ความยืดหยุ่นสีเขียว",
      label_zh: "绿色韧性",
      description:
        "Climate adaptation, environmental quality, and sustainable energy transition.",
      domains: ["environment", "energy"],
    },
    {
      id: "productive-mobility",
      label: "Productive Mobility & Economy",
      label_th: "การเดินทางและเศรษฐกิจที่สร้างผลผลิต",
      label_zh: "高效交通与经济",
      description:
        "Mobility systems, logistics, digital commerce, and investment-ready growth.",
      domains: ["mobility", "economy"],
    },
  ];

  const domainToPillar = {};

  const pillars = template.map((pillar) => {
    const domainCount = pillar.domains.length;
    const projectCount = solutions.filter((solution) =>
      pillar.domains.includes(solution.domain)
    ).length;

    pillar.domains.forEach((domainId) => {
      domainToPillar[domainId] = pillar.id;
    });

    return {
      ...pillar,
      projectCount,
      domainCount,
      domainLabels: pillar.domains.map(
        (domainId) => domainMap.get(domainId)?.label || domainId
      ),
    };
  });

  return { pillars, domainToPillar };
}

function buildKeywordBank(solutions, domainToPillar) {
  const buckets = {
    "inclusive-services": new Map(),
    "green-resilience": new Map(),
    "productive-mobility": new Map(),
  };

  solutions.forEach((solution) => {
    const pillarId = domainToPillar[solution.domain];
    if (!pillarId || !buckets[pillarId]) {
      return;
    }

    (solution.tags || []).forEach((tag) => {
      const normalized = normalizeKeyword(tag);
      if (!normalized) {
        return;
      }

      const current = buckets[pillarId].get(normalized.id) || {
        label: normalized.label,
        count: 0,
      };
      current.count += 1;
      buckets[pillarId].set(normalized.id, current);
    });
  });

  return Object.fromEntries(
    Object.entries(buckets).map(([pillarId, map]) => [
      pillarId,
      [...map.values()]
        .sort((left, right) => right.count - left.count)
        .slice(0, 10)
        .map((item) => item.label),
    ])
  );
}

function normalizeKeyword(tag) {
  if (!tag) {
    return null;
  }

  const cleaned = String(tag).replace(/\s+/g, " ").trim();
  if (!cleaned || cleaned.length < 2) {
    return null;
  }

  const id = cleaned.toLowerCase();
  return { id, label: cleaned };
}

async function fetchCityTrendSignals() {
  const now = Date.now();
  if (cachedCityTrends && now < trendsExpiry) {
    return cachedCityTrends;
  }

  if (!googleTrends) {
    cachedCityTrends = THAILAND_STATIONS.map((station) => ({
      id: station.id,
      region: "TH",
      keywords: TREND_TERMS.map((term) => ({
        term: term.label,
        score: 0,
        pillarId: term.pillarId,
      })).slice(0, 3),
      pillarScores: [
        { pillarId: "productive-mobility", score: 0 },
        { pillarId: "green-resilience", score: 0 },
        { pillarId: "inclusive-services", score: 0 },
      ],
      source: "Google Trends unavailable",
    }));
    trendsExpiry = now + TREND_CACHE_TTL_MS;
    return cachedCityTrends;
  }

  const startTime = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000);
  const endTime = new Date();

  const results = await Promise.all(
    THAILAND_STATIONS.map(async (station) => {
      const region = CITY_TREND_REGIONS[station.id] || "TH";
      const raw = await safeFetchTrends(region, startTime, endTime);
      const timeline = raw.default?.timelineData || [];
      const averages = averageTrendValues(timeline, TREND_TERMS.length);

      const keywordScores = TREND_TERMS.map((term, index) => ({
        term: term.label,
        score: averages[index] || 0,
        pillarId: term.pillarId,
      })).sort((left, right) => right.score - left.score);

      const pillarScores = aggregatePillarScores(keywordScores);

      return {
        id: station.id,
        region,
        keywords: keywordScores.slice(0, 3),
        pillarScores,
        source: "Google Trends",
      };
    })
  );

  cachedCityTrends = results;
  trendsExpiry = now + TREND_CACHE_TTL_MS;
  return cachedCityTrends;
}

async function safeFetchTrends(region, startTime, endTime) {
  try {
    const response = await googleTrends.interestOverTime({
      keyword: TREND_TERMS.map((item) => item.term),
      geo: region,
      startTime,
      endTime,
    });
    return parseTrendsResponse(response);
  } catch {
    const fallbackResponse = await googleTrends.interestOverTime({
      keyword: TREND_TERMS.map((item) => item.term),
      geo: "TH",
      startTime,
      endTime,
    });
    return parseTrendsResponse(fallbackResponse);
  }
}

function parseTrendsResponse(raw) {
  const text = String(raw || "");
  const cleaned = text.startsWith(")]}',") ? text.slice(5) : text;
  return JSON.parse(cleaned);
}

function averageTrendValues(timeline, expectedLength) {
  const recent = timeline.slice(-24);
  const sums = Array.from({ length: expectedLength }, () => 0);
  let count = 0;

  recent.forEach((point) => {
    if (!Array.isArray(point.value)) {
      return;
    }

    point.value.forEach((value, index) => {
      sums[index] += Number(value) || 0;
    });
    count += 1;
  });

  return sums.map((sum) => Math.round((count ? sum / count : 0) * 10) / 10);
}

function aggregatePillarScores(keywordScores) {
  const scoreByPillar = new Map();

  keywordScores.forEach((item) => {
    scoreByPillar.set(item.pillarId, (scoreByPillar.get(item.pillarId) || 0) + item.score);
  });

  return [...scoreByPillar.entries()]
    .map(([pillarId, score]) => ({ pillarId, score: Math.round(score * 10) / 10 }))
    .sort((left, right) => right.score - left.score);
}

function buildCityInsights(stations, cityTrends, catalog) {
  const trendMap = new Map(cityTrends.map((item) => [item.id, item]));
  const pillarMap = new Map((catalog?.pillarCatalog.pillars || []).map((item) => [item.id, item]));
  const keywordBank = catalog?.keywordBank || {};

  return stations.map((station) => {
    const trend = trendMap.get(station.id) || {
      keywords: [],
      pillarScores: [],
      source: "No trend source",
    };

    const adjustedScores = applyCityProfileToPillars(station.id, trend.pillarScores);

    const rankedPillars = adjustedScores.slice(0, 3).map((scoreItem) => {
      const pillar = pillarMap.get(scoreItem.pillarId);
      return {
        id: scoreItem.pillarId,
        label: pillar?.label || scoreItem.pillarId,
        label_th: pillar?.label_th || pillar?.label || scoreItem.pillarId,
        label_zh: pillar?.label_zh || pillar?.label || scoreItem.pillarId,
        score: scoreItem.score,
        projectCount: pillar?.projectCount || 0,
        keywords: (keywordBank[scoreItem.pillarId] || []).slice(0, 5),
      };
    });

    const prioritizedPillars = rankedPillars.slice(0, 2);

    return {
      ...station,
      trendKeywords: trend.keywords,
      trendSource: trend.source,
      pillars: rankedPillars,
      projectCount: prioritizedPillars.reduce((sum, pillar) => sum + pillar.projectCount, 0),
    };
  });
}

function applyCityProfileToPillars(cityId, pillarScores) {
  const profileOrder = CITY_PILLAR_PROFILE[cityId] || [
    "productive-mobility",
    "green-resilience",
    "inclusive-services",
  ];

  const current = new Map(pillarScores.map((item) => [item.pillarId, item.score]));
  const hasSignal =
    pillarScores.length &&
    Math.max(...pillarScores.map((item) => item.score)) -
      Math.min(...pillarScores.map((item) => item.score)) >
      2;

  return profileOrder.map((pillarId, index) => {
    const base = Number(current.get(pillarId) || 0);
    const profileBoost = (profileOrder.length - index) * 5;
    const score = hasSignal ? base + profileBoost : 80 - index * 12;
    return { pillarId, score: Math.round(score * 10) / 10 };
  });
}

async function fetchFeed(config) {
  const response = await fetchWithTimeout(
    config.url,
    {
      headers: {
        "user-agent": "smart-city-directory/1.0",
        accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    },
    OUTBOUND_FETCH_TIMEOUT_MS
  );

  if (!response.ok) {
    throw new Error(`${config.url} returned HTTP ${response.status}`);
  }

  const xml = await response.text();
  const items = parseRss(xml)
    .filter((item) => {
      if (!config.minDate || !item.publishedAt) {
        return true;
      }
      return item.publishedAt >= Date.parse(config.minDate);
    })
    .filter(config.filter || (() => true))
    .slice(0, config.limit);

  return items.map((item) => ({
    title: item.title,
    link: item.link,
    source: item.source || "News Feed",
    published: item.published || "Unknown date",
    summary: item.summary || "No summary available.",
  }));
}

async function getThailandBoundaries() {
  const now = Date.now();
  if (cachedBoundaries && now < boundaryExpiry) {
    return cachedBoundaries;
  }

  const [adm0Meta, adm1Meta] = await Promise.all([
    fetchJson("https://www.geoboundaries.org/api/current/gbOpen/THA/ADM0/"),
    fetchJson("https://www.geoboundaries.org/api/current/gbOpen/THA/ADM1/"),
  ]);

  const [adm0GeoJson, adm1GeoJson] = await Promise.all([
    fetchJson(adm0Meta.simplifiedGeometryGeoJSON || adm0Meta.gjDownloadURL),
    fetchJson(adm1Meta.simplifiedGeometryGeoJSON || adm1Meta.gjDownloadURL),
  ]);

  cachedBoundaries = {
    adm0: trimFeatureCollection(adm0GeoJson, 48),
    adm1: trimFeatureCollection(adm1GeoJson, 10),
    provinceCount: Array.isArray(adm1GeoJson.features) ? adm1GeoJson.features.length : 0,
  };
  boundaryExpiry = now + BOUNDARY_CACHE_TTL_MS;
  return cachedBoundaries;
}

async function fetchStationSignals() {
  const latitude = THAILAND_STATIONS.map((station) => station.latitude).join(",");
  const longitude = THAILAND_STATIONS.map((station) => station.longitude).join(",");

  const airParams = new URLSearchParams({
    latitude,
    longitude,
    current: "us_aqi,european_aqi,pm2_5,pm10",
    timezone: "Asia/Bangkok",
  });

  const weatherParams = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,precipitation,weather_code,wind_speed_10m",
    timezone: "Asia/Bangkok",
  });

  const [airRaw, weatherRaw] = await Promise.all([
    fetchJson(`https://air-quality-api.open-meteo.com/v1/air-quality?${airParams}`),
    fetchJson(`https://api.open-meteo.com/v1/forecast?${weatherParams}`),
  ]);

  const airSeries = normaliseMultiLocationPayload(airRaw);
  const weatherSeries = normaliseMultiLocationPayload(weatherRaw);

  return THAILAND_STATIONS.map((station, index) => {
    const air = airSeries[index] || {};
    const weather = weatherSeries[index] || {};

    return {
      ...station,
      air: {
        usAqi: air.current?.us_aqi ?? null,
        europeanAqi: air.current?.european_aqi ?? null,
        pm2_5: air.current?.pm2_5 ?? null,
        pm10: air.current?.pm10 ?? null,
      },
      weather: {
        temperature_2m: weather.current?.temperature_2m ?? null,
        precipitation: weather.current?.precipitation ?? null,
        weather_code: weather.current?.weather_code ?? null,
        wind_speed_10m: weather.current?.wind_speed_10m ?? null,
      },
    };
  });
}

async function fetchThailandEarthquakes() {
  const params = new URLSearchParams({
    format: "geojson",
    starttime: isoDateDaysAgo(7),
    endtime: new Date().toISOString(),
    minlatitude: String(THAILAND_BOUNDS.minLatitude),
    maxlatitude: String(THAILAND_BOUNDS.maxLatitude),
    minlongitude: String(THAILAND_BOUNDS.minLongitude),
    maxlongitude: String(THAILAND_BOUNDS.maxLongitude),
    orderby: "time",
    limit: "12",
  });

  const payload = await fetchJson(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`
  );

  return (payload.features || []).map((feature) => ({
    id: feature.id,
    place: feature.properties?.place || "Unnamed event",
    magnitude: feature.properties?.mag ?? null,
    time: feature.properties?.time ? new Date(feature.properties.time).toISOString() : null,
    longitude: feature.geometry?.coordinates?.[0] ?? null,
    latitude: feature.geometry?.coordinates?.[1] ?? null,
    depthKm: feature.geometry?.coordinates?.[2] ?? null,
  }));
}

async function fetchJson(url) {
  const response = await fetchWithTimeout(
    url,
    {
      headers: {
        "user-agent": "smart-city-directory/1.0",
        accept: "application/json, application/geo+json, */*",
      },
    },
    OUTBOUND_FETCH_TIMEOUT_MS
  );

  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }

  return response.json();
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    throw new Error(`${url} fetch failed: ${errorMessage(error)}`);
  } finally {
    clearTimeout(timer);
  }
}

function trimFeatureCollection(featureCollection, targetPointsPerRing) {
  return {
    type: "FeatureCollection",
    features: (featureCollection.features || []).map((feature) => ({
      type: "Feature",
      properties: {
        name:
          feature.properties?.shapeName ||
          feature.properties?.name ||
          feature.properties?.NAME_1 ||
          "",
      },
      geometry: simplifyGeometry(feature.geometry, targetPointsPerRing),
    })),
  };
}

function simplifyGeometry(geometry, targetPointsPerRing) {
  if (!geometry) {
    return geometry;
  }

  if (geometry.type === "Polygon") {
    return {
      type: "Polygon",
      coordinates: (geometry.coordinates || []).map((ring) =>
        simplifyRing(ring, targetPointsPerRing)
      ),
    };
  }

  if (geometry.type === "MultiPolygon") {
    return {
      type: "MultiPolygon",
      coordinates: (geometry.coordinates || []).map((polygon) =>
        (polygon || []).map((ring) => simplifyRing(ring, targetPointsPerRing))
      ),
    };
  }

  return geometry;
}

function simplifyRing(ring, targetPointsPerRing) {
  if (!Array.isArray(ring) || ring.length <= targetPointsPerRing) {
    return ring;
  }

  const step = Math.max(1, Math.ceil(ring.length / targetPointsPerRing));
  const simplified = [];

  for (let index = 0; index < ring.length; index += step) {
    simplified.push(compactCoordinate(ring[index]));
  }

  const lastPoint = ring[ring.length - 1];
  const tail = simplified[simplified.length - 1];
  const compactLastPoint = compactCoordinate(lastPoint);
  if (!tail || tail[0] !== compactLastPoint[0] || tail[1] !== compactLastPoint[1]) {
    simplified.push(compactLastPoint);
  }

  return simplified;
}

function compactCoordinate(coord) {
  return [Number(coord[0].toFixed(4)), Number(coord[1].toFixed(4))];
}

function normaliseMultiLocationPayload(payload) {
  return Array.isArray(payload) ? payload : [payload];
}

function parseRss(xml) {
  const blocks = [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map((match) => match[0]);

  return blocks
    .map((block) => {
      const title = cleanText(extractTag(block, "title"));
      const link = cleanText(extractTag(block, "link"));
      const source = cleanText(extractSource(block)) || inferSource(link);
      const summary = truncate(cleanText(extractTag(block, "description")), 200);
      const published = formatDate(cleanText(extractTag(block, "pubDate")));
      const publishedAt = Date.parse(cleanText(extractTag(block, "pubDate")));

      return {
        title,
        link,
        source,
        summary,
        published,
        publishedAt: Number.isFinite(publishedAt) ? publishedAt : null,
      };
    })
    .filter((item) => item.title && item.link);
}

function extractTag(block, tagName) {
  const tagPattern = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const cdataPattern = new RegExp(
    `<${tagName}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tagName}>`,
    "i"
  );
  const cdataMatch = block.match(cdataPattern);
  if (cdataMatch) {
    return cdataMatch[1];
  }

  const tagMatch = block.match(tagPattern);
  return tagMatch ? tagMatch[1] : "";
}

function extractSource(block) {
  const match = block.match(/<source[^>]*>([\s\S]*?)<\/source>/i);
  return match ? match[1] : "";
}

function cleanText(value) {
  if (!value) {
    return "";
  }

  let text = decodeEntities(value);
  text = text.replace(/<[^>]+>/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

function decodeEntities(value) {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };

  let decoded = value;

  for (let pass = 0; pass < 3; pass += 1) {
    const next = decoded.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (_, entity) => {
      if (entity[0] === "#") {
        const isHex = entity[1].toLowerCase() === "x";
        const numeric = parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);
        return Number.isFinite(numeric) ? String.fromCodePoint(numeric) : _;
      }

      return named[entity] || _;
    });

    if (next === decoded) {
      break;
    }
    decoded = next;
  }

  return decoded;
}

function inferSource(link) {
  try {
    const host = new URL(link).hostname.replace(/^www\./, "");
    return host;
  } catch {
    return "News Feed";
  }
}

function formatDate(value) {
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) {
    return value || "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsed);
}

function truncate(value, maxLength) {
  if (!value || value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trim()}...`;
}

function isoDateDaysAgo(days) {
  const offset = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return offset.toISOString();
}

async function serveStatic(urlPath, res) {
  const targetPath = resolvePath(urlPath);
  if (!targetPath) {
    sendText(res, 403, "Forbidden");
    return;
  }

  try {
    const stats = await fsp.stat(targetPath);
    const filePath = stats.isDirectory() ? path.join(targetPath, "index.html") : targetPath;
    const data = await fsp.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "content-type": MIME_TYPES[ext] || "application/octet-stream",
      "cache-control": filePath.includes(`${path.sep}public${path.sep}`)
        ? "public, max-age=3600"
        : "no-cache",
    });
    res.end(data);
  } catch {
    if (urlPath === "/") {
      sendText(res, 404, "index.html not found");
    } else {
      sendText(res, 404, "Not found");
    }
  }
}

function resolvePath(urlPath) {
  const pathname = urlPath === "/" ? "/index.html" : urlPath;
  const decoded = decodeURIComponent(pathname);
  const targetPath = path.join(ROOT, decoded);
  if (!targetPath.startsWith(ROOT)) {
    return null;
  }
  return targetPath;
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-cache",
  });
  res.end(JSON.stringify(payload, null, 2));
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-cache",
  });
  res.end(message);
}
