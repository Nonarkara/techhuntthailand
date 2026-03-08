const fsp = require("fs/promises");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist-pages");
const API_DIR = path.join(DIST, "api");

const COPY_FILES = [
  "index.html",
  "library.html",
  "resources.html",
  "network-news.html",
  "styles.css",
  "app.js",
  "live-pulse.js",
  "site-pages.js",
  "data.js",
];

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
      href: "index.html",
    },
    {
      title: "Knowledge Library",
      summary: "Pillar-level and domain-level project inventory for due diligence.",
      label: "Open Library",
      href: "library.html",
    },
    {
      title: "Network Mentions",
      summary: "Media and narrative monitoring for Smart City Thailand ecosystem visibility.",
      label: "Open Ecosystem News",
      href: "network-news.html",
    },
    {
      title: "Directory Source File",
      summary: "Original report source that the searchable directory was built from.",
      label: "View Report Record",
      href: "index.html#about-section",
    },
  ],
};

const STATIC_NEWS = {
  generatedAt: new Date().toISOString(),
  refreshMinutes: 0,
  fallback: true,
  warning: "Static GitHub Pages snapshot. Live feeds are available on Render or the local Node server.",
  startups: [
    {
      title: "Static Pages snapshot",
      link: "https://github.com/Nonarkara/techhuntthailand",
      source: "GitHub Pages",
      published: "Static deploy",
      summary:
        "This GitHub Pages deployment ships a static snapshot. For live startup feeds, use the Node server or Render deployment.",
    },
  ],
  government: [
    {
      title: "Static Pages snapshot",
      link: "https://github.com/Nonarkara/techhuntthailand",
      source: "GitHub Pages",
      published: "Static deploy",
      summary:
        "Government updates are shown as a static placeholder on GitHub Pages. Use the Node server or Render deployment for live feeds.",
    },
  ],
};

const STATIC_NETWORK_NEWS = {
  generatedAt: new Date().toISOString(),
  refreshMinutes: 0,
  fallback: true,
  warning:
    "Static GitHub Pages snapshot. Live ecosystem mentions are available on Render or the local Node server.",
  items: [
    {
      title: "Static ecosystem snapshot",
      link: "https://github.com/Nonarkara/techhuntthailand",
      source: "GitHub Pages",
      published: "Static deploy",
      summary:
        "This page is running from a static Pages bundle. Use the Node server or Render deployment for live ecosystem mention feeds.",
    },
  ],
};

const STATIC_PULSE = {
  generatedAt: new Date().toISOString(),
  refreshMinutes: 0,
  fallback: true,
  boundaries: null,
  stations: [
    { id: "bangkok", name: "Bangkok", label_th: "กรุงเทพฯ", label_zh: "曼谷", longitude: 100.5018, latitude: 13.7563, trendKeywords: [], trendSource: "Static snapshot", pillars: [], projectCount: 0, air: { usAqi: null, europeanAqi: null, pm2_5: null, pm10: null }, weather: { temperature_2m: null, precipitation: null, weather_code: null, wind_speed_10m: null } },
    { id: "chiang-mai", name: "Chiang Mai", label_th: "เชียงใหม่", label_zh: "清迈", longitude: 98.9853, latitude: 18.7883, trendKeywords: [], trendSource: "Static snapshot", pillars: [], projectCount: 0, air: { usAqi: null, europeanAqi: null, pm2_5: null, pm10: null }, weather: { temperature_2m: null, precipitation: null, weather_code: null, wind_speed_10m: null } },
    { id: "khon-kaen", name: "Khon Kaen", label_th: "ขอนแก่น", label_zh: "孔敬", longitude: 102.835, latitude: 16.4419, trendKeywords: [], trendSource: "Static snapshot", pillars: [], projectCount: 0, air: { usAqi: null, europeanAqi: null, pm2_5: null, pm10: null }, weather: { temperature_2m: null, precipitation: null, weather_code: null, wind_speed_10m: null } },
    { id: "phuket", name: "Phuket", label_th: "ภูเก็ต", label_zh: "普吉", longitude: 98.3923, latitude: 7.8804, trendKeywords: [], trendSource: "Static snapshot", pillars: [], projectCount: 0, air: { usAqi: null, europeanAqi: null, pm2_5: null, pm10: null }, weather: { temperature_2m: null, precipitation: null, weather_code: null, wind_speed_10m: null } },
    { id: "hat-yai", name: "Hat Yai", label_th: "หาดใหญ่", label_zh: "合艾", longitude: 100.4747, latitude: 7.0084, trendKeywords: [], trendSource: "Static snapshot", pillars: [], projectCount: 0, air: { usAqi: null, europeanAqi: null, pm2_5: null, pm10: null }, weather: { temperature_2m: null, precipitation: null, weather_code: null, wind_speed_10m: null } },
  ],
  earthquakes: [],
  pillars: [],
  errors: ["Static GitHub Pages snapshot. Use the Node server or Render deployment for live pulse data."],
  sources: {
    boundaries: "geoBoundaries",
    airQuality: "Open-Meteo Air Quality API",
    weather: "Open-Meteo Forecast API",
    earthquakes: "USGS Earthquake API",
    trends: "Google Trends",
  },
};

async function main() {
  const data = await loadDirectoryData();
  const library = buildLibraryPayload(data);

  await fsp.rm(DIST, { recursive: true, force: true });
  await fsp.mkdir(API_DIR, { recursive: true });

  for (const file of COPY_FILES) {
    await fsp.copyFile(path.join(ROOT, file), path.join(DIST, file));
  }

  await fsp.cp(path.join(ROOT, "public"), path.join(DIST, "public"), { recursive: true });
  await writeJson(path.join(API_DIR, "resources.json"), {
    generatedAt: new Date().toISOString(),
    ...RESOURCES,
  });
  await writeJson(path.join(API_DIR, "library.json"), library);
  await writeJson(path.join(API_DIR, "news.json"), STATIC_NEWS);
  await writeJson(path.join(API_DIR, "network-news.json"), STATIC_NETWORK_NEWS);
  await writeJson(path.join(API_DIR, "pulse.json"), STATIC_PULSE);
  await writeJson(path.join(DIST, "health.json"), {
    status: "ok",
    service: "smart-city-thailand-tech-hunt-pages",
    timestamp: new Date().toISOString(),
    mode: "static-pages",
  });
  await fsp.writeFile(path.join(DIST, ".nojekyll"), "");

  console.log(`Built GitHub Pages bundle in ${DIST}`);
}

async function loadDirectoryData() {
  const text = await fsp.readFile(path.join(ROOT, "data.js"), "utf8");
  const match = text.match(/window\.DIRECTORY_DATA\s*=\s*(\{[\s\S]*\});\s*$/);
  if (!match) {
    throw new Error("Could not parse DIRECTORY_DATA from data.js");
  }
  return JSON.parse(match[1]);
}

function buildLibraryPayload(data) {
  const solutions = data.solutions || [];
  const domainMap = new Map((data.domains || []).map((domain) => [domain.id, domain]));
  const pillarCatalog = buildPillarCatalog(domainMap, solutions);
  const keywordBank = buildKeywordBank(solutions, pillarCatalog.domainToPillar);

  return {
    generatedAt: new Date().toISOString(),
    pillars: pillarCatalog.pillars.map((pillar) => ({
      ...pillar,
      keywords: keywordBank[pillar.id] || [],
    })),
    domains: data.domains || [],
    tracks: (data.timeline || []).map((item) => ({
      name: item.step || item.name || "Program activity",
      description: item.detail || item.description || "",
      metric: item.value || "",
    })),
  };
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
    const projectCount = solutions.filter((solution) =>
      pillar.domains.includes(solution.domain)
    ).length;

    pillar.domains.forEach((domainId) => {
      domainToPillar[domainId] = pillar.id;
    });

    return {
      ...pillar,
      projectCount,
      domainCount: pillar.domains.length,
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

  return {
    id: cleaned.toLowerCase(),
    label: cleaned,
  };
}

async function writeJson(filePath, payload) {
  await fsp.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
});
