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
      networkNews: "Ecosystem News",
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
      resourceTitle: "Operational resources for scaling Smart City Thailand pilots.",
      resourceCopy:
        "The resource library brings together data feeds, source references, and implementation assets used by the Tech Hunt directory hub.",
      liveData: "Live Data Sources",
      liveDataTitle: "APIs currently powering the hub.",
      programAssets: "Program Assets",
      programAssetsTitle: "Core materials for partner onboarding and due diligence.",
      newsKicker: "Ecosystem Mentions",
      newsTitle: "Smart City Thailand ecosystem signal monitoring.",
      newsCopy:
        "This page tracks mention trends relevant to Smart City Thailand implementation progress so partners can monitor visibility, narrative, and momentum.",
      ascnMentions: "Ecosystem Mentions",
      ascnMentionsTitle: "Articles mentioning Smart City Thailand priorities.",
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
    th: {
      overview: "ภาพรวม",
      library: "คลังความรู้",
      resources: "ทรัพยากร",
      networkNews: "ข่าวระบบนิเวศ",
      language: "ภาษา",
      libraryKicker: "คลังความรู้",
      libraryTitle: "ฐานข้อมูลโครงการสำหรับเมือง นักลงทุน และพันธมิตร",
      libraryCopy:
        "หน้านี้จัดโครงการตามเสาหลักการดำเนินงาน โดเมน และกิจกรรมโครงการ เพื่อใช้ในการวิเคราะห์ วางนโยบาย และต่อยอดข้ามเมือง",
      threePillars: "3 เสาหลักการลงทุน",
      pillarTitle: "จุดที่โครงการกำลังเติบโตเด่นชัด",
      domainPortfolio: "พอร์ตโฟลิโอรายโดเมน",
      domainTitle: "จำนวนโครงการและคำสำคัญตัวอย่างในแต่ละโดเมน",
      learningTracks: "แนวทางการเรียนรู้ร่วมกัน",
      learningTitle: "รูปแบบการทำงานร่วมกันระหว่างเมืองที่ใช้จริงในโครงการ",
      resourceKicker: "ทรัพยากรและแหล่งอ้างอิง",
      resourceTitle: "ทรัพยากรเพื่อขยายผลโครงการ Smart City Thailand",
      resourceCopy:
        "รวมแหล่งข้อมูลอ้างอิง ฟีดข้อมูล และทรัพยากรที่ใช้ในการดำเนินงานของ Tech Hunt Directory",
      liveData: "แหล่งข้อมูลสด",
      liveDataTitle: "API ที่ระบบใช้งานอยู่ในปัจจุบัน",
      programAssets: "เอกสารสำคัญโครงการ",
      programAssetsTitle: "ชุดข้อมูลหลักสำหรับการทำงานร่วมกับพันธมิตร",
      newsKicker: "สัญญาณระบบนิเวศ",
      newsTitle: "ติดตามสัญญาณข่าวของระบบนิเวศ Smart City Thailand",
      newsCopy:
        "หน้านี้ติดตามแนวโน้มข่าวที่เกี่ยวข้องกับการขับเคลื่อน Smart City Thailand เพื่อให้พันธมิตรเห็นภาพความเคลื่อนไหวและโมเมนตัม",
      ascnMentions: "ข่าวที่กล่าวถึงระบบนิเวศ",
      ascnMentionsTitle: "บทความที่กล่าวถึงประเด็น Smart City Thailand",
      thaiSignals: "สัญญาณประเทศไทย",
      thaiSignalsTitle: "อัปเดตสตาร์ตอัปและภาครัฐที่เกี่ยวข้องกับการขับเคลื่อนเมืองอัจฉริยะ",
      loading: "กำลังโหลด...",
      noData: "ยังไม่มีข้อมูล",
      source: "แหล่งที่มา",
      projects: "โครงการ",
      domains: "โดเมน",
      keywords: "คำสำคัญ",
    },
    zh: {
      overview: "总览",
      library: "资料库",
      resources: "资源",
      networkNews: "生态新闻",
      language: "语言",
      libraryKicker: "知识资料库",
      libraryTitle: "面向城市、投资方与合作伙伴的项目情报",
      libraryCopy:
        "本页按实施支柱、领域与项目活动组织内容，便于尽调、政策设计与跨城复制。",
      threePillars: "三大投资支柱",
      pillarTitle: "当前项目动能最集中的方向",
      domainPortfolio: "领域组合",
      domainTitle: "各领域项目数量与能力关键词样本",
      learningTracks: "学习路径",
      learningTitle: "项目中实际采用的城市协作模式",
      resourceKicker: "资源与参考",
      resourceTitle: "支持 Smart City Thailand 试点扩展的运营资源",
      resourceCopy:
        "整合本目录所使用的数据源、参考链接与实施资产。",
      liveData: "实时数据源",
      liveDataTitle: "当前驱动平台的 API",
      programAssets: "项目资产",
      programAssetsTitle: "用于合作方对接与尽调的核心材料",
      newsKicker: "生态提及",
      newsTitle: "Smart City Thailand 生态信号监测",
      newsCopy:
        "本页跟踪与 Smart City Thailand 执行进展相关的提及趋势，帮助合作方掌握可见度与动能。",
      ascnMentions: "生态提及",
      ascnMentionsTitle: "提及 Smart City Thailand 重点方向的文章",
      thaiSignals: "泰国信号",
      thaiSignalsTitle: "与智慧城市执行相关的创业与政府动态",
      loading: "加载中...",
      noData: "暂无数据",
      source: "来源",
      projects: "项目",
      domains: "领域",
      keywords: "关键词",
    },
  };
  const SUPPORTED_LANGUAGES = new Set(["en", "th", "zh"]);
  const LANGUAGE_STORAGE_KEY = "techhunt-language";
  const HTML_LANG = {
    en: "en",
    th: "th",
    zh: "zh-Hans",
  };

  const languageSelect = document.getElementById("language-select");
  const state = {
    language: sanitizeLanguage(
      localStorage.getItem(LANGUAGE_STORAGE_KEY)
    ),
  };

  if (languageSelect) {
    if (![...languageSelect.options].some((option) => option.value === state.language)) {
      state.language = "en";
    }
    languageSelect.value = state.language;
    languageSelect.addEventListener("change", (event) => {
      state.language = sanitizeLanguage(event.target.value);
      languageSelect.value = state.language;
      localStorage.setItem(LANGUAGE_STORAGE_KEY, state.language);
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
    document.documentElement.lang = HTML_LANG[state.language] || HTML_LANG.en;
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
    const payload = await fetchApiJson("library");

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
    const payload = await fetchApiJson("resources");

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
      fetchApiJson("network-news"),
      fetchApiJson("news"),
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

  async function fetchApiJson(name) {
    const urls = apiCandidates(name);
    let lastError = null;

    for (const url of urls) {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error(`Unable to load ${name}`);
  }

  function apiCandidates(name) {
    const relativeUrl = new URL(`api/${name}.json`, window.location.href).toString();
    return [`/api/${name}`, relativeUrl];
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

  function sanitizeLanguage(value) {
    return SUPPORTED_LANGUAGES.has(value) ? value : "en";
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
