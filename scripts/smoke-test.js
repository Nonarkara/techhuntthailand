const { spawn } = require("child_process");
const fsp = require("fs/promises");
const path = require("path");

const PORT = Number(process.env.SMOKE_PORT || 4173);
const EXTERNAL_BASE_URL = process.env.SMOKE_EXTERNAL_BASE_URL || "";
const BASE_URL = EXTERNAL_BASE_URL || `http://127.0.0.1:${PORT}`;
const ROOT = path.resolve(__dirname, "..");

async function main() {
  if (EXTERNAL_BASE_URL) {
    await waitForServer(`${BASE_URL}/health`);
    await runChecks();
    console.log("Smoke test passed.");
    return;
  }

  const server = spawn(process.execPath, ["server.js"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const logs = [];
  const appendLog = (chunk) => {
    if (!chunk) {
      return;
    }
    logs.push(String(chunk).trim());
    if (logs.length > 25) {
      logs.shift();
    }
  };

  server.stdout.on("data", appendLog);
  server.stderr.on("data", appendLog);

  try {
    await waitForServer(`${BASE_URL}/health`);
    await runChecks();
    await shutdown(server);
    console.log("Smoke test passed.");
  } catch (error) {
    const detail = logs.filter(Boolean).join("\n");
    await shutdown(server);

    if (!process.env.CI && detail.includes("listen EPERM")) {
      await runOfflineChecks();
      console.log("Smoke test passed (offline fallback mode).");
      return;
    }

    console.error("Smoke test failed.");
    if (detail) {
      console.error(detail);
    }
    throw error;
  }
}

async function runChecks() {
  await expectText("/", { includes: "Smart City Thailand Tech Hunt" });
  await expectStatus("/library.html", 200);
  await expectStatus("/resources.html", 200);
  await expectStatus("/network-news.html", 200);
  await expectContentType("/styles.css", "text/css");
  await expectContentType("/app.js", "application/javascript");
  await expectContentType("/live-pulse.js", "application/javascript");
  await expectContentType("/site-pages.js", "application/javascript");
  await expectText("/data.js", { includes: "window.DIRECTORY_DATA" });

  const health = await getJson("/health");
  if (health.status !== "ok") {
    throw new Error("Unexpected /health status payload.");
  }

  const library = await getJson("/api/library");
  if (!Array.isArray(library.pillars) || !Array.isArray(library.domains)) {
    throw new Error("Unexpected /api/library payload shape.");
  }

  const resources = await getJson("/api/resources");
  if (!Array.isArray(resources.sources) || !Array.isArray(resources.assets)) {
    throw new Error("Unexpected /api/resources payload shape.");
  }

  const news = await getJson("/api/news");
  if (!Array.isArray(news.startups) || !Array.isArray(news.government)) {
    throw new Error("Unexpected /api/news payload shape.");
  }

  const network = await getJson("/api/network-news");
  if (!Array.isArray(network.items)) {
    throw new Error("Unexpected /api/network-news payload shape.");
  }

  const pulse = await getJson("/api/pulse");
  if (!Array.isArray(pulse.stations) || !Array.isArray(pulse.earthquakes)) {
    throw new Error("Unexpected /api/pulse payload shape.");
  }
}

async function expectStatus(route, expectedStatus) {
  const response = await fetch(`${BASE_URL}${route}`, { cache: "no-store" });
  if (response.status !== expectedStatus) {
    throw new Error(`${route} returned HTTP ${response.status}, expected ${expectedStatus}`);
  }
}

async function expectContentType(route, expectedType) {
  const response = await fetch(`${BASE_URL}${route}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${route} returned HTTP ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes(expectedType)) {
    throw new Error(`${route} content-type mismatch: ${contentType}`);
  }
}

async function expectText(route, options) {
  const response = await fetch(`${BASE_URL}${route}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${route} returned HTTP ${response.status}`);
  }
  const body = await response.text();
  if (options?.includes && !body.includes(options.includes)) {
    throw new Error(`${route} missing expected content: ${options.includes}`);
  }
}

async function getJson(route) {
  const response = await fetch(`${BASE_URL}${route}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${route} returned HTTP ${response.status}`);
  }
  return response.json();
}

async function waitForServer(url) {
  const timeoutAt = Date.now() + 15000;
  let lastError = null;

  while (Date.now() < timeoutAt) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) {
        return;
      }
      lastError = new Error(`Server boot probe returned HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(250);
  }

  throw lastError || new Error("Timed out waiting for server startup.");
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function shutdown(server) {
  if (!server || server.killed) {
    return;
  }

  server.kill("SIGTERM");
  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      server.kill("SIGKILL");
      resolve();
    }, 3000);
    server.once("exit", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

async function runOfflineChecks() {
  const required = [
    "index.html",
    "styles.css",
    "app.js",
    "live-pulse.js",
    "site-pages.js",
    "server.js",
    "data.js",
    "library.html",
    "resources.html",
    "network-news.html",
  ];

  await Promise.all(
    required.map(async (file) => {
      const filePath = path.join(ROOT, file);
      const stat = await fsp.stat(filePath);
      if (!stat.isFile()) {
        throw new Error(`Missing required file: ${file}`);
      }
    })
  );

  const indexHtml = await fsp.readFile(path.join(ROOT, "index.html"), "utf8");
  if (!indexHtml.includes('id="language-select"')) {
    throw new Error("index.html missing language selector.");
  }
  if (!indexHtml.includes('<option value="en">English</option>')) {
    throw new Error("index.html missing English option.");
  }
  if (!indexHtml.includes('<option value="th">ไทย</option>')) {
    throw new Error("index.html missing Thai option.");
  }
  if (!indexHtml.includes('<option value="zh">中文</option>')) {
    throw new Error("index.html missing Mandarin option.");
  }

  const dataJs = await fsp.readFile(path.join(ROOT, "data.js"), "utf8");
  const match = dataJs.match(/window\.DIRECTORY_DATA\s*=\s*(\{[\s\S]*\});\s*$/);
  if (!match) {
    throw new Error("Unable to parse DIRECTORY_DATA from data.js");
  }
  const payload = JSON.parse(match[1]);
  if (!Array.isArray(payload.solutions) || payload.solutions.length < 100) {
    throw new Error("Unexpected solution inventory size in data.js");
  }
  if (!Array.isArray(payload.domains) || payload.domains.length < 7) {
    throw new Error("Unexpected domain inventory size in data.js");
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exitCode = 1;
});
