(function () {
  const payload = window.DIRECTORY_DATA;

  if (!payload) {
    return;
  }

  const LOCALES = {
    en: {
      heroKicker: "Smart City Thailand Tech Hunt",
      heroTitle: "160 solutions across the 7 smart domains.",
      heroCopy:
        'A searchable directory built from the source <span id="source-file-inline"></span>, combining city-to-city learning evidence, verified partner websites, and live API signals for implementation tracking.',
      metricsKicker: "Directory Metrics",
      languageLabel: "Language",
      startupNewsKicker: "Live News API",
      startupNewsTitle: "Startup signal",
      governmentNewsKicker: "Live News API",
      governmentNewsTitle: "Government work",
      navNews: "Latest",
      navPulse: "Pulse",
      navDirectory: "Directory",
      navAbout: "About",
      navContact: "Add Startup",
      originKicker: "Built By Dr Non",
      originTitle: "Put together by me, Dr Non from depa, with partner collaboration.",
      originCopy:
        "I put this directory together to turn the original report into a usable public index. It is possible thanks to the collaboration with the partner organizations shown above.",
      usageKicker: "Open Use",
      usageCopy:
        "Anyone can use and reuse this directory as an open reference for scanning solutions, exploring providers, and understanding the current landscape.",
      contactKicker: "Add Your Startup",
      contactCopy:
        "If you want your startup added to the list, please contact me, Dr Non at depa, so we can review it and include it in the next update.",
      footerCopy:
        "Open reference directory. Reuse is welcome. Please verify any external website, news item, or vendor claim before formal procurement or policy decisions.",
      domainsKicker: "7 Smart Domains",
      timelineKicker: "Program Sequence",
      mouKicker: "Signed MOUs",
      searchLabel: "Search",
      searchPlaceholder: "Search by solution, company, or capability",
      domainSelectLabel: "7 Smart Domain",
      sortLabel: "Sort",
      resetLabel: "Reset",
      detailKicker: "Selected Entry",
      sortOptions: {
        curated: "Curated Order",
        name: "Solution A-Z",
        organization: "Organization A-Z",
        verified: "Verified Sites First",
      },
      metrics: [
        "Solutions Indexed",
        "Smart Domains",
        "Verified Sites",
        "Search Routes",
      ],
      timeline: [
        {
          step: "Research Intake",
          value: "160 entities",
          detail:
            "The report consolidates solution providers, agencies, and technology holders from multiple sources.",
        },
        {
          step: "Incubation",
          value: "16 startups",
          detail:
            "The program opened recruitment and shortlisted startups ready to develop city-scale solutions.",
        },
        {
          step: "Online Sessions",
          value: "6 sessions",
          detail:
            "Orientation plus five online class sessions were delivered on a dedicated digital platform.",
        },
        {
          step: "Onsite Workshop",
          value: "1 day",
          detail:
            "A collaborative workshop connected startups and city representatives at True Digital Park.",
        },
        {
          step: "Business Matching",
          value: "70-100 people",
          detail:
            "Pitching and negotiation zones were arranged for direct conversations in Bangkok.",
        },
      ],
      allDomainsOption: "All 7 Smart Domains",
      allDomainsLabel: "All Domains",
      allDomainsCopy: "Cross-domain scan across the full catalog.",
      activeDomainAll: "All 7 Smart Domains",
      activeLabels: {
        domain: "Domain",
        visible: "Visible",
        sites: "Sites",
        organizations: "Organizations",
        query: "Query",
        queryPool: "Query Pool",
      },
      visibleSuffix: "solutions",
      groupsSuffix: "groups",
      sitesSummary: (verified, search) => `${verified} verified / ${search} search`,
      queryPoolSummary: (count) => `${count} matches`,
      resultsAllLabel: "Full Inventory",
      resultsAllNote: (count) => `${count} domain cohorts`,
      verifiedSite: "Verified Site",
      searchRoute: "Search Route",
      emptyTitle: "No match.",
      emptyCopy: "Try a broader query or reset the active 7-domain filter.",
      noSelection:
        "No item selected. Reset the filters to restore the default selection.",
      missingSelection:
        "The selected record is no longer available in the current view.",
      openWebsite: "Open Website",
      searchMore: "Search More",
      findOfficialSite: "Find Official Site",
      verifiedAttached: "Verified website attached",
      searchAttached: "Search fallback attached",
      sourceRow: "Source row inside the report table",
      domainEntries: "Entries in this smart domain",
      orgMatches: "Matches for this organization",
      globalIndex: "Global directory index",
      peersKicker: "Adjacent In This Domain",
      noPeers: "No adjacent domain entries available.",
      newsWaiting: "Waiting for server",
      newsRefreshing: "Refreshing",
      newsUpdated: (stamp) => `Updated ${stamp}`,
      newsOffline: "Offline",
      newsServeHint: "Serve the project with node server.js to enable live feeds.",
      newsApiHint: "API unavailable. Run node server.js to load live news.",
      noStartupNews: "No startup news returned.",
      noGovernmentNews: "No government updates returned.",
    },
    th: {
      heroKicker: "บัญชีรายชื่อ Smart City Thailand Tech Hunt",
      heroTitle: "160 โซลูชัน ครอบคลุม 7 มิติเมืองอัจฉริยะ",
      heroCopy:
        'ไดเรกทอรีที่ค้นหาได้ สร้างจากไฟล์ต้นฉบับ <span id="source-file-inline"></span> ผสานหลักฐานการเรียนรู้ระหว่างเมือง เว็บไซต์พันธมิตรที่ยืนยันแล้ว และสัญญาณสดจาก API เพื่อติดตามการดำเนินงาน',
      metricsKicker: "ตัวชี้วัดไดเรกทอรี",
      languageLabel: "ภาษา",
      startupNewsKicker: "Live News API",
      startupNewsTitle: "สัญญาณข่าวสตาร์ตอัป",
      governmentNewsKicker: "Live News API",
      governmentNewsTitle: "ความเคลื่อนไหวภาครัฐ",
      navNews: "ข่าวล่าสุด",
      navPulse: "ภาพสด",
      navDirectory: "ไดเรกทอรี",
      navAbout: "ที่มา",
      navContact: "เพิ่มสตาร์ตอัป",
      originKicker: "จัดทำโดย Dr Non",
      originTitle: "ผม Dr Non จาก depa เป็นผู้จัดทำ โดยมีความร่วมมือจากพันธมิตร",
      originCopy:
        "ผมจัดทำไดเรกทอรีนี้ขึ้นเพื่อแปลงรายงานต้นฉบับให้เป็นดัชนีสาธารณะที่ใช้งานได้จริง และโครงการนี้เกิดขึ้นได้จากความร่วมมือกับหน่วยงานพันธมิตรที่แสดงอยู่ด้านบน",
      usageKicker: "เปิดใช้ได้",
      usageCopy:
        "ทุกคนสามารถใช้และนำไดเรกทอรีนี้ไปใช้ต่อได้ในฐานะข้อมูลอ้างอิงแบบเปิด เพื่อสำรวจโซลูชัน ทำความรู้จักผู้ให้บริการ และมองเห็นภาพรวมของระบบนิเวศปัจจุบัน",
      contactKicker: "เพิ่มสตาร์ตอัปของคุณ",
      contactCopy:
        "หากต้องการให้เพิ่มสตาร์ตอัปของคุณในรายการ โปรดติดต่อผม Dr Non ที่ depa เพื่อให้เราตรวจสอบและบรรจุในการอัปเดตรอบถัดไป",
      footerCopy:
        "เป็นไดเรกทอรีอ้างอิงแบบเปิด สามารถนำไปใช้ต่อได้ แต่ควรตรวจสอบเว็บไซต์ภายนอก ข่าวสาร และข้อมูลผู้ให้บริการอีกครั้งก่อนการจัดซื้อหรือการตัดสินใจเชิงนโยบาย",
      domainsKicker: "7 มิติเมืองอัจฉริยะ",
      timelineKicker: "ลำดับการดำเนินงาน",
      mouKicker: "MOU ที่ลงนาม",
      searchLabel: "ค้นหา",
      searchPlaceholder: "ค้นหาด้วยชื่อโซลูชัน บริษัท หรือความสามารถ",
      domainSelectLabel: "มิติเมืองอัจฉริยะ",
      sortLabel: "จัดเรียง",
      resetLabel: "ล้างค่า",
      detailKicker: "รายการที่เลือก",
      sortOptions: {
        curated: "ตามลำดับคัดสรร",
        name: "ชื่อโซลูชัน A-Z",
        organization: "ชื่อหน่วยงาน A-Z",
        verified: "เว็บยืนยันแล้วก่อน",
      },
      metrics: [
        "โซลูชันที่จัดทำดัชนี",
        "มิติเมืองอัจฉริยะ",
        "เว็บไซต์ที่ยืนยันแล้ว",
        "ลิงก์ค้นหา",
      ],
      timeline: [
        {
          step: "รวบรวมข้อมูล",
          value: "160 รายการ",
          detail:
            "รายงานรวบรวมผู้ให้บริการโซลูชัน หน่วยงาน และผู้ถือเทคโนโลยีจากหลายแหล่งข้อมูล",
        },
        {
          step: "Incubation",
          value: "16 สตาร์ตอัป",
          detail:
            "โครงการเปิดรับสมัครและคัดเลือกสตาร์ตอัปที่พร้อมพัฒนาโซลูชันระดับเมือง",
        },
        {
          step: "Online Sessions",
          value: "6 ครั้ง",
          detail:
            "มีทั้ง Orientation และคลาสออนไลน์รวมทั้งหมดหกครั้งบนแพลตฟอร์มดิจิทัล",
        },
        {
          step: "Onsite Workshop",
          value: "1 วัน",
          detail:
            "เวิร์กชอปเชื่อมสตาร์ตอัปกับตัวแทนเมืองเพื่อทดลองพัฒนาโซลูชันร่วมกันที่ True Digital Park",
        },
        {
          step: "Business Matching",
          value: "70-100 คน",
          detail:
            "จัดพื้นที่ Pitching และ Negotiation เพื่อให้เกิดการจับคู่ธุรกิจโดยตรงในกรุงเทพฯ",
        },
      ],
      allDomainsOption: "ทุกมิติทั้ง 7",
      allDomainsLabel: "ทุกมิติ",
      allDomainsCopy: "มุมมองภาพรวมข้ามทุกมิติของทั้งแค็ตตาล็อก",
      activeDomainAll: "ทุกมิติทั้ง 7",
      activeLabels: {
        domain: "มิติ",
        visible: "ที่แสดง",
        sites: "เว็บไซต์",
        organizations: "หน่วยงาน",
        query: "คำค้น",
        queryPool: "ผลการค้น",
      },
      visibleSuffix: "โซลูชัน",
      groupsSuffix: "หน่วยงาน",
      sitesSummary: (verified, search) => `ยืนยัน ${verified} / ค้นหา ${search}`,
      queryPoolSummary: (count) => `${count} รายการ`,
      resultsAllLabel: "ภาพรวมทั้งหมด",
      resultsAllNote: (count) => `${count} มิติ`,
      verifiedSite: "เว็บยืนยันแล้ว",
      searchRoute: "ลิงก์ค้นหา",
      emptyTitle: "ไม่พบรายการ",
      emptyCopy: "ลองขยายคำค้นหรือรีเซ็ตตัวกรอง 7 มิติ",
      noSelection: "ยังไม่มีรายการที่เลือก ลองรีเซ็ตตัวกรองเพื่อกลับสู่รายการเริ่มต้น",
      missingSelection: "รายการที่เลือกไม่อยู่ในมุมมองปัจจุบันแล้ว",
      openWebsite: "เปิดเว็บไซต์",
      searchMore: "ค้นหาเพิ่มเติม",
      findOfficialSite: "ค้นหาเว็บไซต์ทางการ",
      verifiedAttached: "แนบเว็บไซต์ที่ยืนยันแล้ว",
      searchAttached: "แนบลิงก์ค้นหาแทน",
      sourceRow: "ลำดับแถวจากตารางต้นฉบับ",
      domainEntries: "จำนวนรายการในมิตินี้",
      orgMatches: "จำนวนรายการของหน่วยงานนี้",
      globalIndex: "ลำดับรวมในไดเรกทอรี",
      peersKicker: "รายการใกล้เคียงในมิตินี้",
      noPeers: "ไม่มีรายการใกล้เคียงเพิ่มเติมในมิตินี้",
      newsWaiting: "รอเซิร์ฟเวอร์",
      newsRefreshing: "กำลังอัปเดต",
      newsUpdated: (stamp) => `อัปเดต ${stamp}`,
      newsOffline: "ออฟไลน์",
      newsServeHint: "ให้รัน node server.js เพื่อเปิดใช้ฟีดข่าวสด",
      newsApiHint: "ยังใช้ API ไม่ได้ ให้รัน node server.js เพื่อโหลดข่าวสด",
      noStartupNews: "ไม่มีข่าวสตาร์ตอัปที่ดึงมาได้",
      noGovernmentNews: "ไม่มีข่าวภาครัฐที่ดึงมาได้",
    },
    zh: {
      heroKicker: "Smart City Thailand Tech Hunt 目录",
      heroTitle: "160 个方案，覆盖 7 大智慧城市领域",
      heroCopy:
        '这是一个基于源文件 <span id="source-file-inline"></span> 构建的可搜索目录，整合城市间学习成果、已核实合作方网站以及本地 API 实时信号。',
      metricsKicker: "目录指标",
      languageLabel: "语言",
      startupNewsKicker: "实时新闻 API",
      startupNewsTitle: "创业动态",
      governmentNewsKicker: "实时新闻 API",
      governmentNewsTitle: "政府动态",
      navNews: "最新动态",
      navPulse: "实时视图",
      navDirectory: "目录",
      navAbout: "项目说明",
      navContact: "添加初创",
      originKicker: "由 Dr Non 统筹",
      originTitle: "本目录由我，depa 的 Dr Non，整理完成，并得到合作伙伴支持",
      originCopy:
        "我将原始报告整理成一个可直接使用的公开索引，而这个项目也得益于上方合作伙伴的协作支持。",
      usageKicker: "开放使用",
      usageCopy:
        "任何人都可以使用并转用本目录，作为开放参考来浏览方案、了解服务提供方以及理解当前生态格局。",
      contactKicker: "提交你的初创企业",
      contactCopy:
        "如果你希望将自己的初创企业加入目录，请联系我，depa 的 Dr Non，我们会在下一轮更新中进行审核与纳入。",
      footerCopy:
        "本目录为开放参考目录，欢迎使用与转引。但在正式采购或政策决策前，请再次核实外部网站、新闻与供应商信息。",
      domainsKicker: "7 大智慧城市领域",
      timelineKicker: "项目流程",
      mouKicker: "已签署 MOU",
      searchLabel: "搜索",
      searchPlaceholder: "按方案、机构或能力搜索",
      domainSelectLabel: "智慧城市领域",
      sortLabel: "排序",
      resetLabel: "重置",
      detailKicker: "当前条目",
      sortOptions: {
        curated: "按策展顺序",
        name: "方案名称 A-Z",
        organization: "机构名称 A-Z",
        verified: "已核实网站优先",
      },
      metrics: ["已索引方案", "智慧城市领域", "已核实网站", "搜索入口"],
      timeline: [
        {
          step: "资料收集",
          value: "160 项",
          detail:
            "报告整合了来自多个来源的方案提供方、机构与技术持有者信息",
        },
        {
          step: "孵化阶段",
          value: "16 家初创",
          detail:
            "项目开放招募并筛选出可推进城市级方案的初创团队",
        },
        {
          step: "线上课程",
          value: "6 场",
          detail:
            "包括一场说明会与五场线上课程，通过数字平台完成",
        },
        {
          step: "线下工作坊",
          value: "1 天",
          detail:
            "在 True Digital Park 组织线下协作工作坊，连接初创团队与城市代表",
        },
        {
          step: "商务对接",
          value: "70-100 人",
          detail:
            "设置路演与商务洽谈区域，促成在曼谷的直接合作交流",
        },
      ],
      allDomainsOption: "全部 7 个领域",
      allDomainsLabel: "全部领域",
      allDomainsCopy: "跨领域查看完整目录",
      activeDomainAll: "全部 7 个领域",
      activeLabels: {
        domain: "领域",
        visible: "当前显示",
        sites: "网站",
        organizations: "机构",
        query: "关键词",
        queryPool: "搜索命中",
      },
      visibleSuffix: "个方案",
      groupsSuffix: "家机构",
      sitesSummary: (verified, search) => `${verified} 已核实 / ${search} 搜索入口`,
      queryPoolSummary: (count) => `${count} 条`,
      resultsAllLabel: "完整目录",
      resultsAllNote: (count) => `${count} 个领域`,
      verifiedSite: "已核实网站",
      searchRoute: "搜索入口",
      emptyTitle: "没有匹配项",
      emptyCopy: "请扩大搜索范围，或重置 7 领域筛选",
      noSelection: "当前没有选中条目。重置筛选后可恢复默认选择",
      missingSelection: "当前视图中已无法找到所选条目",
      openWebsite: "打开网站",
      searchMore: "继续搜索",
      findOfficialSite: "查找官方网站",
      verifiedAttached: "已附核实网站",
      searchAttached: "已附搜索入口",
      sourceRow: "源表中的原始行号",
      domainEntries: "该领域中的条目数",
      orgMatches: "同机构条目数",
      globalIndex: "目录全局序号",
      peersKicker: "同领域相邻条目",
      noPeers: "该领域暂无更多相邻条目",
      newsWaiting: "等待服务器",
      newsRefreshing: "刷新中",
      newsUpdated: (stamp) => `已更新 ${stamp}`,
      newsOffline: "离线",
      newsServeHint: "请运行 node server.js 以启用实时新闻",
      newsApiHint: "API 当前不可用。请运行 node server.js 加载实时新闻",
      noStartupNews: "未返回创业新闻",
      noGovernmentNews: "未返回政府动态",
    },
  };

  const domainMap = new Map(payload.domains.map((domain) => [domain.id, domain]));
  let latestNewsPayload = null;

  const solutions = payload.solutions.map((solution, index) => ({
    ...solution,
    entryIndex: index + 1,
    signals: detectSignals(solution),
    searchBlob: [
      solution.name,
      solution.organization,
      solution.description_en || solution.description || "",
      solution.description_th || solution.description || "",
      solution.description_zh || solution.description_en || solution.description || "",
      solution.domain_label,
      solution.domain_label_th,
      solution.domain_label_zh,
      solution.cohort_label,
      solution.cohort_label_th,
      solution.cohort_label_zh,
    ]
      .join(" ")
      .toLowerCase(),
  }));

  const elements = {
    heroKicker: document.getElementById("hero-kicker"),
    heroTitle: document.getElementById("hero-title"),
    heroCopy: document.getElementById("hero-copy"),
    heroMetrics: document.getElementById("hero-metrics"),
    metricsKicker: document.getElementById("metrics-kicker"),
    languageLabel: document.getElementById("language-label"),
    languageSelect: document.getElementById("language-select"),
    startupNewsKicker: document.getElementById("startup-news-kicker"),
    startupNewsTitle: document.getElementById("startup-news-title"),
    governmentNewsKicker: document.getElementById("government-news-kicker"),
    governmentNewsTitle: document.getElementById("government-news-title"),
    navNews: document.getElementById("nav-news"),
    navPulse: document.getElementById("nav-pulse"),
    navDirectory: document.getElementById("nav-directory"),
    navAbout: document.getElementById("nav-about"),
    navContact: document.getElementById("nav-contact"),
    originKicker: document.getElementById("origin-kicker"),
    originTitle: document.getElementById("origin-title"),
    originCopy: document.getElementById("origin-copy"),
    usageKicker: document.getElementById("usage-kicker"),
    usageCopy: document.getElementById("usage-copy"),
    contactKicker: document.getElementById("contact-kicker"),
    contactCopy: document.getElementById("contact-copy"),
    footerCopy: document.getElementById("footer-copy"),
    domainsKicker: document.getElementById("domains-kicker"),
    timelineKicker: document.getElementById("timeline-kicker"),
    mouKicker: document.getElementById("mou-kicker"),
    searchLabel: document.getElementById("search-label"),
    searchInput: document.getElementById("search-input"),
    domainSelectLabel: document.getElementById("domain-select-label"),
    domainSelect: document.getElementById("domain-select"),
    sortLabel: document.getElementById("sort-label"),
    sortSelect: document.getElementById("sort-select"),
    resetButton: document.getElementById("reset-button"),
    detailKicker: document.getElementById("detail-kicker"),
    domainFilters: document.getElementById("domain-filters"),
    timeline: document.getElementById("timeline"),
    mouList: document.getElementById("mou-list"),
    activeState: document.getElementById("active-state"),
    signalStrip: document.getElementById("signal-strip"),
    resultsMeta: document.getElementById("results-meta"),
    resultsGrid: document.getElementById("results-grid"),
    detailBody: document.getElementById("detail-body"),
    newsStatus: document.getElementById("news-status"),
    startupNews: document.getElementById("startup-news"),
    governmentNews: document.getElementById("government-news"),
  };

  const state = {
    query: "",
    domain: "all",
    sort: "curated",
    language: localStorage.getItem("ascn-language") || "en",
    selectedId: solutions[0] ? solutions[0].id : null,
  };

  render();
  loadNews();
  window.setInterval(loadNews, 15 * 60 * 1000);

  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    render();
  });

  elements.domainSelect.addEventListener("change", (event) => {
    state.domain = event.target.value;
    render();
  });

  elements.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    render();
  });

  elements.languageSelect.addEventListener("change", (event) => {
    state.language = event.target.value;
    localStorage.setItem("ascn-language", state.language);
    render();
    renderNewsFromCache();
  });

  elements.resetButton.addEventListener("click", () => {
    state.query = "";
    state.domain = "all";
    state.sort = "curated";
    state.selectedId = solutions[0] ? solutions[0].id : null;
    elements.searchInput.value = "";
    elements.domainSelect.value = "all";
    elements.sortSelect.value = "curated";
    render();
    renderNewsFromCache();
  });

  elements.domainFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-domain]");
    if (!button) {
      return;
    }

    state.domain = button.dataset.domain;
    elements.domainSelect.value = state.domain;
    render();
  });

  elements.resultsGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-solution-id]");
    if (!button) {
      return;
    }

    state.selectedId = button.dataset.solutionId;
    render();
  });

  function render() {
    renderStaticLocale();
    const queryPool = getQueryPool();
    const filtered = applyDomainAndSort(queryPool);
    syncSelection(filtered);
    renderDomainFilters(queryPool);
    renderActiveState(queryPool, filtered);
    renderSignalStrip(filtered);
    renderResultsMeta(filtered);
    renderResultsGrid(filtered);
    renderDetail(filtered);
  }

  function renderStaticLocale() {
    const copy = locale();
    elements.languageSelect.value = state.language;

    elements.heroKicker.textContent = copy.heroKicker;
    elements.heroTitle.textContent = copy.heroTitle;
    elements.heroCopy.innerHTML = copy.heroCopy;
    const sourceInline = document.getElementById("source-file-inline");
    if (sourceInline) {
      sourceInline.textContent = payload.meta.source_file;
    }

    elements.metricsKicker.textContent = copy.metricsKicker;
    elements.languageLabel.textContent = copy.languageLabel;
    elements.startupNewsKicker.textContent = copy.startupNewsKicker;
    elements.startupNewsTitle.textContent = copy.startupNewsTitle;
    elements.governmentNewsKicker.textContent = copy.governmentNewsKicker;
    elements.governmentNewsTitle.textContent = copy.governmentNewsTitle;
    elements.navNews.textContent = copy.navNews;
    if (elements.navPulse) {
      elements.navPulse.textContent = copy.navPulse || LOCALES.en.navPulse;
    }
    elements.navDirectory.textContent = copy.navDirectory;
    elements.navAbout.textContent = copy.navAbout;
    elements.navContact.textContent = copy.navContact;
    elements.originKicker.textContent = copy.originKicker;
    elements.originTitle.textContent = copy.originTitle;
    elements.originCopy.textContent = copy.originCopy;
    elements.usageKicker.textContent = copy.usageKicker;
    elements.usageCopy.textContent = copy.usageCopy;
    elements.contactKicker.textContent = copy.contactKicker;
    elements.contactCopy.textContent = copy.contactCopy;
    elements.footerCopy.textContent = copy.footerCopy;
    if (!latestNewsPayload) {
      elements.newsStatus.textContent = copy.newsWaiting;
    }
    elements.domainsKicker.textContent = copy.domainsKicker;
    elements.timelineKicker.textContent = copy.timelineKicker;
    elements.mouKicker.textContent = copy.mouKicker;
    elements.searchLabel.textContent = copy.searchLabel;
    elements.searchInput.placeholder = copy.searchPlaceholder;
    elements.domainSelectLabel.textContent = copy.domainSelectLabel;
    elements.sortLabel.textContent = copy.sortLabel;
    elements.resetButton.textContent = copy.resetLabel;
    elements.detailKicker.textContent = copy.detailKicker;

    renderHeroMetrics();
    renderTimeline();
    renderMouList();
    renderSortOptions();
    renderDomainSelect(payload.domains);
  }

  function renderHeroMetrics() {
    const copy = locale();
    const heroMetrics = [
      { value: payload.stats.solutions, label: copy.metrics[0] },
      { value: payload.stats.domains, label: copy.metrics[1] },
      { value: payload.stats.verified_websites, label: copy.metrics[2] },
      { value: payload.stats.search_fallbacks, label: copy.metrics[3] },
    ];

    elements.heroMetrics.innerHTML = heroMetrics
      .map(
        (item) =>
          `<div class="hero-stat"><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span></div>`
      )
      .join("");
  }

  function renderTimeline() {
    const items = locale().timeline;
    elements.timeline.innerHTML = items
      .map(
        (item) => `
          <article class="timeline-item">
            <div class="timeline-step">${escapeHtml(item.step)}</div>
            <div class="timeline-value">${escapeHtml(item.value)}</div>
            <div class="timeline-detail">${escapeHtml(item.detail)}</div>
          </article>
        `
      )
      .join("");
  }

  function renderMouList() {
    elements.mouList.innerHTML = payload.mous
      .map(
        (item) => `
          <article class="mou-item">
            <div class="mou-code">${escapeHtml(item.code)}</div>
            <div class="mou-solution">${escapeHtml(item.solution)}</div>
            <div class="mou-city">${escapeHtml(item.city)}</div>
          </article>
        `
      )
      .join("");
  }

  function renderSortOptions() {
    const sortOptions = locale().sortOptions;
    elements.sortSelect.innerHTML = `
      <option value="curated">${escapeHtml(sortOptions.curated)}</option>
      <option value="name">${escapeHtml(sortOptions.name)}</option>
      <option value="organization">${escapeHtml(sortOptions.organization)}</option>
      <option value="verified">${escapeHtml(sortOptions.verified)}</option>
    `;
    elements.sortSelect.value = state.sort;
  }

  function getQueryPool() {
    return solutions.filter((solution) => {
      if (!state.query) {
        return true;
      }

      const terms = state.query.split(/\s+/).filter(Boolean);
      return terms.every((term) => solution.searchBlob.includes(term));
    });
  }

  function applyDomainAndSort(pool) {
    let filtered = pool.filter((solution) =>
      state.domain === "all" ? true : solution.domain === state.domain
    );

    if (state.sort === "name") {
      filtered = [...filtered].sort((left, right) =>
        left.name.localeCompare(right.name, "th", { sensitivity: "base" })
      );
    } else if (state.sort === "organization") {
      filtered = [...filtered].sort((left, right) =>
        left.organization.localeCompare(right.organization, "th", {
          sensitivity: "base",
        })
      );
    } else if (state.sort === "verified") {
      filtered = [...filtered].sort((left, right) => {
        const verifiedDelta =
          Number(right.has_verified_website) - Number(left.has_verified_website);
        if (verifiedDelta !== 0) {
          return verifiedDelta;
        }
        return left.entryIndex - right.entryIndex;
      });
    }

    return filtered;
  }

  function syncSelection(filtered) {
    const visible = filtered.some((item) => item.id === state.selectedId);
    if (!visible) {
      state.selectedId = filtered[0] ? filtered[0].id : null;
    }
  }

  function renderDomainSelect(domains) {
    const copy = locale();
    const options = [
      `<option value="all">${escapeHtml(copy.allDomainsOption)}</option>`,
      ...domains.map(
        (domain) =>
          `<option value="${escapeHtml(domain.id)}">${escapeHtml(localizedDomainLabel(domain))}</option>`
      ),
    ];

    elements.domainSelect.innerHTML = options.join("");
    elements.domainSelect.value = state.domain;
  }

  function renderDomainFilters(queryPool) {
    const counts = new Map(payload.domains.map((domain) => [domain.id, 0]));
    queryPool.forEach((item) => counts.set(item.domain, (counts.get(item.domain) || 0) + 1));

    const copy = locale();
    const allButton = `
      <button
        class="domain-button ${state.domain === "all" ? "is-active" : ""}"
        type="button"
        data-domain="all"
        style="--chip: ${escapeHtml("var(--accent)")}"
      >
        <span class="domain-name"><span class="domain-icon">ALL</span>${escapeHtml(
          copy.allDomainsLabel
        )}</span>
        <span class="domain-meta">${escapeHtml(queryPool.length)} / ${escapeHtml(
          payload.stats.solutions
        )}</span>
        <span class="domain-copy">${escapeHtml(copy.allDomainsCopy)}</span>
      </button>
    `;

    const domainButtons = payload.domains
      .map((domain) => {
        const visible = counts.get(domain.id) || 0;
        return `
          <button
            class="domain-button ${state.domain === domain.id ? "is-active" : ""}"
            type="button"
            data-domain="${escapeHtml(domain.id)}"
            style="--chip: ${escapeHtml(domain.accent)}"
          >
            <span class="domain-name">
              <span class="domain-icon">${escapeHtml(domain.icon)}</span>
              ${escapeHtml(localizedDomainLabel(domain))}
            </span>
            <span class="domain-meta">${escapeHtml(visible)} / ${escapeHtml(domain.count)}</span>
            <span class="domain-copy">${escapeHtml(localizedDomainDescription(domain))}</span>
          </button>
        `;
      })
      .join("");

    elements.domainFilters.innerHTML = allButton + domainButtons;
  }

  function renderActiveState(queryPool, filtered) {
    const copy = locale();
    const visibleOrganizations = new Set(filtered.map((item) => item.organization)).size;
    const verifiedVisible = filtered.filter((item) => item.has_verified_website).length;
    const activeDomain = state.domain === "all" ? null : domainMap.get(state.domain) || null;

    const chips = [
      {
        label: copy.activeLabels.domain,
        value: activeDomain ? localizedDomainLabel(activeDomain) : copy.activeDomainAll,
      },
      {
        label: copy.activeLabels.visible,
        value: `${filtered.length} ${copy.visibleSuffix}`,
      },
      {
        label: copy.activeLabels.sites,
        value: copy.sitesSummary(verifiedVisible, filtered.length - verifiedVisible),
      },
      {
        label: copy.activeLabels.organizations,
        value: `${visibleOrganizations} ${copy.groupsSuffix}`,
      },
    ];

    if (state.query) {
      chips.push({
        label: copy.activeLabels.query,
        value: state.query,
      });
      chips.push({
        label: copy.activeLabels.queryPool,
        value: copy.queryPoolSummary(queryPool.length),
      });
    }

    elements.activeState.innerHTML = chips
      .map(
        (chip) => `
          <div class="state-chip">
            <strong>${escapeHtml(chip.label)}</strong>
            <span>${escapeHtml(chip.value)}</span>
          </div>
        `
      )
      .join("");
  }

  function renderSignalStrip(filtered) {
    const signalCounts = new Map();
    filtered.forEach((item) => {
      item.signals.forEach((signal) => {
        signalCounts.set(signal, (signalCounts.get(signal) || 0) + 1);
      });
    });

    const chips = [...signalCounts.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 6);

    elements.signalStrip.innerHTML = chips.length
      ? chips
          .map(
            ([signal, count]) => `
              <div class="signal-chip">
                <strong>${escapeHtml(signal)}</strong>
                <span>${escapeHtml(`${count}`)}</span>
              </div>
            `
          )
          .join("")
      : `<div class="signal-chip"><strong>0</strong><span>0</span></div>`;
  }

  function renderResultsMeta(filtered) {
    const copy = locale();
    const activeDomain = state.domain === "all" ? null : domainMap.get(state.domain);
    const label = activeDomain ? localizedDomainLabel(activeDomain) : copy.resultsAllLabel;
    const note = activeDomain
      ? localizedDomainSecondaryLabel(activeDomain)
      : copy.resultsAllNote(payload.stats.domains);

    elements.resultsMeta.innerHTML = `
      <strong>${escapeHtml(filtered.length)}</strong>
      <span>${escapeHtml(label)} | ${escapeHtml(note)}</span>
    `;
  }

  function renderResultsGrid(filtered) {
    const copy = locale();
    if (!filtered.length) {
      elements.resultsGrid.innerHTML = `
        <div class="empty-state">
          <h2>${escapeHtml(copy.emptyTitle)}</h2>
          <p>${escapeHtml(copy.emptyCopy)}</p>
        </div>
      `;
      return;
    }

    elements.resultsGrid.innerHTML = filtered
      .map((solution) => {
        const selectedClass = solution.id === state.selectedId ? "is-selected" : "";
        const tags = [
          ...solution.signals,
          solution.has_verified_website ? copy.verifiedSite : copy.searchRoute,
        ]
          .slice(0, 4)
          .map((tag) => `<span class="card-tag">${escapeHtml(tag)}</span>`)
          .join("");

        return `
          <button
            class="solution-card ${selectedClass}"
            type="button"
            data-solution-id="${escapeHtml(solution.id)}"
            style="--card-accent: ${escapeHtml(solution.domain_accent)}"
          >
            <div class="card-topline">
              <span class="card-code">${escapeHtml(solution.source_order)}</span>
              <span class="card-domain">${escapeHtml(localizedSolutionDomainLabel(solution))}</span>
            </div>
            <h2>${escapeHtml(solution.name)}</h2>
            <p class="card-description">${escapeHtml(localizedSolutionDescription(solution))}</p>
            <p class="card-organization">${escapeHtml(solution.organization)}</p>
            <div class="card-tags">${tags}</div>
          </button>
        `;
      })
      .join("");
  }

  function renderDetail(filtered) {
    const copy = locale();
    if (!state.selectedId) {
      elements.detailBody.innerHTML = `<p class="detail-copy">${escapeHtml(
        copy.noSelection
      )}</p>`;
      return;
    }

    const selected =
      filtered.find((item) => item.id === state.selectedId) ||
      solutions.find((item) => item.id === state.selectedId);

    if (!selected) {
      elements.detailBody.innerHTML = `<p class="detail-copy">${escapeHtml(
        copy.missingSelection
      )}</p>`;
      return;
    }

    const sameDomain = solutions
      .filter((item) => item.domain === selected.domain && item.id !== selected.id)
      .slice(0, 3);

    const sameOrganization = solutions.filter(
      (item) => item.organization === selected.organization
    ).length;

    const actions = [];
    if (selected.website) {
      actions.push(
        `<a class="detail-link is-primary" href="${escapeHtml(selected.website)}" target="_blank" rel="noreferrer noopener">${escapeHtml(
          copy.openWebsite
        )}</a>`
      );
    }
    actions.push(
      `<a class="detail-link" href="${escapeHtml(selected.search_url)}" target="_blank" rel="noreferrer noopener">${escapeHtml(
        selected.website ? copy.searchMore : copy.findOfficialSite
      )}</a>`
    );

    elements.detailBody.innerHTML = `
      <div>
        <p class="kicker">${escapeHtml(localizedSolutionDomainLabel(selected))} | ${escapeHtml(
          localizedSolutionDomainSecondary(selected)
        )}</p>
        <h2 class="detail-title">${escapeHtml(selected.name)}</h2>
      </div>

      <p class="detail-copy">${escapeHtml(localizedSolutionDescription(selected))}</p>
      <p class="detail-organization">${escapeHtml(selected.organization)}</p>
      <p class="detail-focus">${escapeHtml(localizedSolutionDomainDescription(selected))}</p>

      <div class="detail-actions">${actions.join("")}</div>

      <div class="detail-tags">
        <span class="pill-tag">${escapeHtml(localizedCohortLabel(selected))}</span>
        <span class="pill-tag">${escapeHtml(
          selected.has_verified_website ? copy.verifiedAttached : copy.searchAttached
        )}</span>
        ${selected.tags
          .slice(0, 3)
          .map((tag) => `<span class="pill-tag">${escapeHtml(tag)}</span>`)
          .join("")}
      </div>

      <div class="detail-grid">
        <div class="detail-metric">
          <strong>${escapeHtml(selected.source_order)}</strong>
          <span>${escapeHtml(copy.sourceRow)}</span>
        </div>
        <div class="detail-metric">
          <strong>${escapeHtml(domainMap.get(selected.domain).count)}</strong>
          <span>${escapeHtml(copy.domainEntries)}</span>
        </div>
        <div class="detail-metric">
          <strong>${escapeHtml(sameOrganization)}</strong>
          <span>${escapeHtml(copy.orgMatches)}</span>
        </div>
        <div class="detail-metric">
          <strong>${escapeHtml(selected.entryIndex)}</strong>
          <span>${escapeHtml(copy.globalIndex)}</span>
        </div>
      </div>

      <div class="detail-peers">
        <p class="kicker">${escapeHtml(copy.peersKicker)}</p>
        ${
          sameDomain.length
            ? sameDomain
                .map(
                  (item) => `
                    <div class="peer-item">
                      <strong>${escapeHtml(item.name)}</strong>
                      <span>${escapeHtml(item.organization)}</span>
                    </div>
                  `
                )
                .join("")
            : `<p class="detail-copy">${escapeHtml(copy.noPeers)}</p>`
        }
      </div>
    `;
  }

  async function loadNews() {
    const copy = locale();

    if (window.location.protocol === "file:") {
      latestNewsPayload = null;
      renderNewsUnavailable(copy.newsServeHint);
      return;
    }

    elements.newsStatus.textContent = copy.newsRefreshing;

    try {
      const response = await fetch("/api/news", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      latestNewsPayload = await response.json();
      renderNewsFromCache();
    } catch (error) {
      latestNewsPayload = null;
      renderNewsUnavailable(copy.newsApiHint);
    }
  }

  function renderNewsFromCache() {
    const copy = locale();
    if (!latestNewsPayload) {
      return;
    }

    renderNewsSection(elements.startupNews, latestNewsPayload.startups, copy.noStartupNews);
    renderNewsSection(
      elements.governmentNews,
      latestNewsPayload.government,
      copy.noGovernmentNews
    );

    const stamp = latestNewsPayload.generatedAt
      ? new Date(latestNewsPayload.generatedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "updated";

    elements.newsStatus.textContent = copy.newsUpdated(stamp);
  }

  function renderNewsUnavailable(message) {
    const copy = locale();
    elements.newsStatus.textContent = copy.newsOffline;
    const markup = `<div class="news-empty"><p class="news-copy">${escapeHtml(
      message
    )}</p></div>`;
    elements.startupNews.innerHTML = markup;
    elements.governmentNews.innerHTML = markup;
  }

  function renderNewsSection(container, items, emptyMessage) {
    if (!items || !items.length) {
      container.innerHTML = `<div class="news-empty"><p class="news-copy">${escapeHtml(
        emptyMessage
      )}</p></div>`;
      return;
    }

    container.innerHTML = items
      .map(
        (item) => `
          <article class="news-item">
            <a href="${escapeHtml(item.link)}" target="_blank" rel="noreferrer noopener">
              <h3>${escapeHtml(item.title)}</h3>
            </a>
            <p class="news-meta">${escapeHtml(item.source)} | ${escapeHtml(item.published)}</p>
            <p class="news-copy">${escapeHtml(item.summary)}</p>
          </article>
        `
      )
      .join("");
  }

  function localizedDomainLabel(domain) {
    if (state.language === "th") {
      return domain.label_th || domain.label;
    }
    if (state.language === "zh") {
      return domain.label_zh || domain.label;
    }
    return domain.label;
  }

  function localizedDomainSecondaryLabel(domain) {
    if (state.language === "th") {
      return domain.label || domain.label_th;
    }
    if (state.language === "zh") {
      return domain.label_th || domain.label;
    }
    return domain.label_th || domain.label;
  }

  function localizedDomainDescription(domain) {
    if (state.language === "th") {
      return domain.description_th || domain.description;
    }
    if (state.language === "zh") {
      return domain.description_zh || domain.description;
    }
    return domain.description;
  }

  function localizedSolutionDomainLabel(solution) {
    if (state.language === "th") {
      return solution.domain_label_th || solution.domain_label;
    }
    if (state.language === "zh") {
      return solution.domain_label_zh || solution.domain_label;
    }
    return solution.domain_label;
  }

  function localizedSolutionDomainSecondary(solution) {
    if (state.language === "th") {
      return solution.domain_label || solution.domain_label_th;
    }
    if (state.language === "zh") {
      return solution.domain_label_th || solution.domain_label;
    }
    return solution.domain_label_th || solution.domain_label;
  }

  function localizedSolutionDomainDescription(solution) {
    if (state.language === "th") {
      return solution.domain_description_th || solution.domain_description;
    }
    if (state.language === "zh") {
      return solution.domain_description_zh || solution.domain_description;
    }
    return solution.domain_description;
  }

  function localizedCohortLabel(solution) {
    if (state.language === "th") {
      return solution.cohort_label_th || solution.cohort_label;
    }
    if (state.language === "zh") {
      return solution.cohort_label_zh || solution.cohort_label;
    }
    return solution.cohort_label;
  }

  function localizedSolutionDescription(solution) {
    if (state.language === "th") {
      return solution.description_th || solution.description || "";
    }
    if (state.language === "zh") {
      return (
        solution.description_zh ||
        solution.description_en ||
        solution.description_th ||
        solution.description ||
        ""
      );
    }
    return solution.description_en || solution.description || "";
  }

  function locale() {
    return LOCALES[state.language] || LOCALES.en;
  }

  function detectSignals(solution) {
    const source = `${solution.name} ${solution.description || ""} ${solution.organization}`.toLowerCase();
    const rules = [
      { label: "AI", terms: [" ai", "ai ", "อัจฉริยะ", "ปัญญาประดิษฐ์"] },
      { label: "IoT", terms: ["iot", "sensor", "เซนเซอร์"] },
      { label: "Analytics", terms: ["analytics", "วิเคราะห์", "ข้อมูล", "data"] },
      { label: "Platform", terms: ["platform", "แพลตฟอร์ม"] },
      { label: "App", terms: ["app", "แอป", "application", "แอปพลิเคชัน"] },
      { label: "Marketplace", terms: ["market", "จอง", "booking", "commerce", "ขาย"] },
      { label: "Telehealth", terms: ["telemedicine", "วิดีโอคอล", "consult", "แพทย์"] },
      { label: "Mapping", terms: ["map", "gis", "แผนที่"] },
      { label: "Learning", terms: ["เรียน", "คอร์ส", "education", "learning"] },
      { label: "Community", terms: ["community", "ชุมชน", "local", "care"] },
    ];

    const hits = rules
      .filter((rule) => rule.terms.some((term) => source.includes(term)))
      .map((rule) => rule.label)
      .slice(0, 3);

    return hits.length ? hits : ["Field Ready"];
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
})();
