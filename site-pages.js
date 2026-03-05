(function () {
  const page = document.body.dataset.page;
  if (!page) {
    return;
  }

  const LOCALES = {
    en: {
      overview: "Overview",
      library: "Library",
      resources: "Resources",
      networkNews: "Network News",
      language: "Language",
      libraryKicker: "Knowledge Library",
      libraryTitle: "Program intelligence for cities, investors, and partners.",
      libraryCopy:
        "This library organizes projects by implementation pillar, domain, and program activity to support due diligence, policy design, and cross-city replication.",
      threePillars: "Three Investment Pillars",
      pillarTitle: "Where current project momentum is concentrated.",
      domainPortfolio: "Domain Portfolio",
      domainTitle: "Directory counts and sample capability keywords by domain.",
      learningTracks: "Learning Tracks",
      learningTitle: "City-to-city collaboration formats used in the program.",
      resourceKicker: "Resources & References",
      resourceTitle: "Operational resources for scaling ASEAN Smart City pilots.",
      resourceCopy:
        "The resource library brings together data feeds, source references, and implementation assets used by the Thailand program hub.",
      liveData: "Live Data Sources",
      liveDataTitle: "APIs currently powering the hub.",
      programAssets: "Program Assets",
      programAssetsTitle: "Core materials for partner onboarding and due diligence.",
      newsKicker: "Network Mentions",
      newsTitle: "ASEAN Smart Cities Network signal monitoring.",
      newsCopy:
        "This page tracks mention trends relevant to ASEAN Smart Cities and Thailand program progress so partners can monitor visibility, narrative, and momentum.",
      ascnMentions: "ASCN Mentions",
      ascnMentionsTitle: "Articles mentioning ASEAN Smart Cities Network.",
      thaiSignals: "Thailand Signals",
      thaiSignalsTitle:
        "Startup and government updates connected to smart city execution.",
      loading: "Loading...",
      noData: "No data available.",
      source: "Source",
      projects: "Projects",
      domains: "Domains",
      keywords: "Keywords",
    },
    id: {
      overview: "Ikhtisar",
      library: "Pustaka",
      resources: "Sumber Daya",
      networkNews: "Berita Jaringan",
      language: "Bahasa",
    },
    zh: {
      overview: "总览",
      library: "资料库",
      resources: "资源",
      networkNews: "网络新闻",
      language: "语言",
    },
    th: {
      overview: "ภาพรวม",
      library: "คลังความรู้",
      resources: "ทรัพยากร",
      networkNews: "ข่าวเครือข่าย",
      language: "ภาษา",
    },
    km: {
      overview: "ទិដ្ឋភាពទូទៅ",
      library: "បណ្ណាល័យ",
      resources: "ធនធាន",
      networkNews: "ព័ត៌មានបណ្តាញ",
      language: "ភាសា",
    },
    vi: {
      overview: "Tổng quan",
      library: "Thư viện",
      resources: "Tài nguyên",
      networkNews: "Tin tức mạng lưới",
      language: "Ngôn ngữ",
    },
  };

  const languageSelect = document.getElementById("language-select");
  const state = {
    language: localStorage.getItem("ascn-language") || "en",
  };

  if (languageSelect) {
    if (![...languageSelect.options].some((option) => option.value === state.language)) {
      state.language = "en";
    }
    languageSelect.value = state.language;
    languageSelect.addEventListener("change", (event) => {
      state.language = event.target.value || "en";
      localStorage.setItem("ascn-language", state.language);
      applyLocale();
    });
  }

  applyLocale();
  loadPageData().catch(() => {
    renderErrorBlocks();
  });

  async function loadPageData() {
    if (page === "library") {
      await renderLibrary();
      return;
    }

    if (page === "resources") {
      await renderResources();
      return;
    }

    if (page === "network-news") {
      await renderNetworkNews();
    }
  }

  function applyLocale() {
    document.documentElement.lang = state.language === "en" ? "en" : "en";
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });
  }

  async function renderLibrary() {
    const pillarsRoot = document.getElementById("library-pillars");
    const domainsRoot = document.getElementById("library-domains");
    const tracksRoot = document.getElementById("library-tracks");

    if (!pillarsRoot || !domainsRoot || !tracksRoot) {
      return;
    }

    setLoading([pillarsRoot, domainsRoot, tracksRoot]);
    const payload = await fetchJson("/api/library");

    pillarsRoot.innerHTML = (payload.pillars || [])
      .map(
        (pillar) => `
          <article class="sub-card">
            <h3>${escapeHtml(localizedValue(pillar))}</h3>
            <p>${escapeHtml(pillar.description)}</p>
            <div class="sub-metrics">
              <span>${escapeHtml(t("projects"))}: ${escapeHtml(String(pillar.projectCount))}</span>
              <span>${escapeHtml(t("domains"))}: ${escapeHtml(String(pillar.domainCount))}</span>
            </div>
            <p class="sub-keywords">${escapeHtml(t("keywords"))}: ${escapeHtml(
              (pillar.keywords || []).slice(0, 6).join(", ")
            )}</p>
          </article>
        `
      )
      .join("");

    domainsRoot.innerHTML = (payload.domains || [])
      .map(
        (domain) => `
          <article class="sub-card">
            <h3>${escapeHtml(localizedValue(domain))}</h3>
            <p>${escapeHtml(domain.description || "")}</p>
            <div class="sub-metrics">
              <span>${escapeHtml(t("projects"))}: ${escapeHtml(String(domain.count || 0))}</span>
            </div>
          </article>
        `
      )
      .join("");

    tracksRoot.innerHTML = (payload.tracks || [])
      .map(
        (track) => `
          <article class="sub-card">
            <h3>${escapeHtml(track.name)}</h3>
            <p>${escapeHtml(track.description)}</p>
            <div class="sub-metrics">
              <span>${escapeHtml(track.metric)}</span>
            </div>
          </article>
        `
      )
      .join("");
  }

  async function renderResources() {
    const sourceRoot = document.getElementById("resource-sources");
    const assetsRoot = document.getElementById("resource-assets");

    if (!sourceRoot || !assetsRoot) {
      return;
    }

    setLoading([sourceRoot, assetsRoot]);
    const payload = await fetchJson("/api/resources");

    sourceRoot.innerHTML = (payload.sources || [])
      .map(
        (source) => `
          <article class="sub-card">
            <h3>${escapeHtml(source.name)}</h3>
            <p>${escapeHtml(source.description)}</p>
            <a class="sub-link" href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer noopener">
              ${escapeHtml(t("source"))}
            </a>
          </article>
        `
      )
      .join("");

    assetsRoot.innerHTML = (payload.assets || [])
      .map(
        (asset) => `
          <article class="sub-card">
            <h3>${escapeHtml(asset.title)}</h3>
            <p>${escapeHtml(asset.summary)}</p>
            <a class="sub-link" href="${escapeHtml(asset.href)}">${escapeHtml(asset.label)}</a>
          </article>
        `
      )
      .join("");
  }

  async function renderNetworkNews() {
    const mentionsRoot = document.getElementById("network-mentions");
    const thailandSignalsRoot = document.getElementById("thailand-signals");

    if (!mentionsRoot || !thailandSignalsRoot) {
      return;
    }

    setLoading([mentionsRoot, thailandSignalsRoot]);

    const [mentionsPayload, newsPayload] = await Promise.all([
      fetchJson("/api/network-news"),
      fetchJson("/api/news"),
    ]);

    mentionsRoot.innerHTML = renderNewsCards(mentionsPayload.items || []);

    thailandSignalsRoot.innerHTML = renderNewsCards([
      ...(newsPayload.startups || []),
      ...(newsPayload.government || []),
    ]);
  }

  function renderNewsCards(items) {
    if (!items.length) {
      return `<article class="sub-card"><p>${escapeHtml(t("noData"))}</p></article>`;
    }

    return items
      .slice(0, 12)
      .map(
        (item) => `
          <article class="sub-card">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary || "")}</p>
            <div class="sub-metrics">
              <span>${escapeHtml(item.source || "")}</span>
              <span>${escapeHtml(item.published || "")}</span>
            </div>
            <a class="sub-link" href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer noopener">${escapeHtml(
              t("source")
            )}</a>
          </article>
        `
      )
      .join("");
  }

  function setLoading(nodes) {
    const label = escapeHtml(t("loading"));
    nodes.forEach((node) => {
      node.innerHTML = `<article class="sub-card"><p>${label}</p></article>`;
    });
  }

  function renderErrorBlocks() {
    document.querySelectorAll("#library-pillars, #library-domains, #library-tracks, #resource-sources, #resource-assets, #network-mentions, #thailand-signals").forEach((node) => {
      if (!node) {
        return;
      }
      node.innerHTML = `<article class="sub-card"><p>${escapeHtml(t("noData"))}</p></article>`;
    });
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  }

  function localizedValue(item) {
    if (state.language === "th") {
      return item.label_th || item.label || item.name || "";
    }
    if (state.language === "zh") {
      return item.label_zh || item.label || item.name || "";
    }
    return item.label || item.name || "";
  }

  function t(key) {
    return LOCALES[state.language]?.[key] || LOCALES.en[key] || key;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
