(function () {
  const root = document.getElementById("pulse-section");

  if (!root) {
    return;
  }

  const COPY = {
    en: {
      navPulse: "Pulse",
      pulseKicker: "Thailand Live Pulse",
      pulseTitle: "A clean live view of city conditions across Thailand.",
      pulseCopy:
        "Toggle air quality and quake layers, compare anchor cities, and keep live weather in the city readouts so the directory feels like a product demo instead of a static report.",
      pulseLayerTitle: "Live Layers",
      pulseCityTitle: "Anchor Cities",
      pulseFeedTitle: "Activity Feed",
      pulseMapKicker: "Live Map",
      pulseMapTitle: "Thailand conditions in one view.",
      waiting: "Waiting for live data",
      refreshing: "Refreshing",
      updated: (stamp) => `Updated ${stamp}`,
      offline: "Offline",
      apiHint: "Live pulse API unavailable. Run node server.js to enable the map layers.",
      noData: "No live data returned yet.",
      layers: {
        provinces: {
          label: "Province mesh",
          meta: "Show the admin grid from geoBoundaries",
        },
        air: {
          label: "Air quality",
          meta: "AQI and PM2.5 markers across city anchors",
        },
        quakes: {
          label: "Recent quakes",
          meta: "Regional seismic events around Thailand",
        },
      },
      kpis: {
        aqi: "Selected AQI",
        pm25: "PM2.5 ug/m3",
        projects: "Project keywords",
        quakes: "7-day quake count",
      },
      feed: {
        citySignal: (name) => `${name} live signal`,
        cityMeta: (aqi, pm25, temp, rain) =>
          `AQI ${aqi} | PM2.5 ${pm25} | ${temp} C | rain ${rain} mm`,
        trendTitle: (name, keyword) => `${name} trend: ${keyword}`,
        trendMeta: (pillar, score, projects) =>
          `${pillar} | score ${score} | ${projects} related projects`,
        quakeTitle: (magnitude, place) => `M${magnitude} near ${place}`,
        quakeMeta: (time, depth) => `${time} | depth ${depth} km`,
        partial: "One or more live sources are temporarily unavailable.",
      },
      summary: {
        provinces: (count) => `${count} provinces`,
        stations: (count) => `${count} city anchors`,
        quakes: (count) => `${count} quakes`,
      },
      legend: {
        boundary: "National boundary",
        province: "Province mesh",
        air: "AQI marker",
        quake: "Quake marker",
      },
      selected: "Selected",
      unavailable: "Live data temporarily unavailable",
    },
    th: {
      navPulse: "ภาพสด",
      pulseKicker: "Thailand Live Pulse",
      pulseTitle: "มุมมองข้อมูลสดของสภาพเมืองทั่วประเทศไทย",
      pulseCopy:
        "สลับเลเยอร์คุณภาพอากาศและแผ่นดินไหว เปรียบเทียบเมืองตัวอย่าง และดูสภาพอากาศสดในกล่องข้อมูลเมือง เพื่อให้หน้าเว็บดูเหมือนเดโมผลิตภัณฑ์มากกว่ารายงานนิ่ง",
      pulseLayerTitle: "เลเยอร์สด",
      pulseCityTitle: "เมืองตัวอย่าง",
      pulseFeedTitle: "ความเคลื่อนไหว",
      pulseMapKicker: "แผนที่สด",
      pulseMapTitle: "ดูสภาวะของไทยในมุมเดียว",
      waiting: "รอข้อมูลสด",
      refreshing: "กำลังอัปเดต",
      updated: (stamp) => `อัปเดต ${stamp}`,
      offline: "ออฟไลน์",
      apiHint: "Live pulse API ใช้งานไม่ได้ในขณะนี้ ให้รัน node server.js เพื่อเปิดเลเยอร์แผนที่",
      noData: "ยังไม่มีข้อมูลสดกลับมา",
      layers: {
        provinces: {
          label: "เส้นจังหวัด",
          meta: "แสดงกริดเขตการปกครองจาก geoBoundaries",
        },
        air: {
          label: "คุณภาพอากาศ",
          meta: "แสดง AQI และ PM2.5 ของเมืองตัวอย่าง",
        },
        quakes: {
          label: "แผ่นดินไหวล่าสุด",
          meta: "เหตุการณ์ในภูมิภาครอบประเทศไทย",
        },
      },
      kpis: {
        aqi: "AQI เมืองที่เลือก",
        pm25: "PM2.5 ไมโครกรัม",
        projects: "คีย์เวิร์ดโครงการ",
        quakes: "จำนวนแผ่นดินไหว 7 วัน",
      },
      feed: {
        citySignal: (name) => `สัญญาณสดของ ${name}`,
        cityMeta: (aqi, pm25, temp, rain) =>
          `AQI ${aqi} | PM2.5 ${pm25} | ${temp} C | ฝน ${rain} มม.`,
        trendTitle: (name, keyword) => `กระแส ${name}: ${keyword}`,
        trendMeta: (pillar, score, projects) =>
          `${pillar} | score ${score} | โครงการเกี่ยวข้อง ${projects}`,
        quakeTitle: (magnitude, place) => `M${magnitude} ใกล้ ${place}`,
        quakeMeta: (time, depth) => `${time} | ลึก ${depth} กม.`,
        partial: "มีบางแหล่งข้อมูลสดที่ใช้งานไม่ได้ชั่วคราว",
      },
      summary: {
        provinces: (count) => `${count} จังหวัด`,
        stations: (count) => `${count} เมือง`,
        quakes: (count) => `${count} เหตุการณ์`,
      },
      legend: {
        boundary: "ขอบเขตประเทศ",
        province: "เส้นจังหวัด",
        air: "จุด AQI",
        quake: "จุดแผ่นดินไหว",
      },
      selected: "ที่เลือก",
      unavailable: "ข้อมูลสดยังไม่พร้อมใช้งาน",
    },
    zh: {
      navPulse: "实时视图",
      pulseKicker: "Thailand Live Pulse",
      pulseTitle: "泰国城市态势的简洁实时视图",
      pulseCopy:
        "切换空气质量与地震图层，比较锚点城市，并把实时天气放进城市读数里，让目录更像产品演示而不是静态报告。",
      pulseLayerTitle: "实时图层",
      pulseCityTitle: "锚点城市",
      pulseFeedTitle: "动态流",
      pulseMapKicker: "实时地图",
      pulseMapTitle: "一屏查看泰国当前态势",
      waiting: "等待实时数据",
      refreshing: "刷新中",
      updated: (stamp) => `已更新 ${stamp}`,
      offline: "离线",
      apiHint: "实时 API 当前不可用。请运行 node server.js 以启用地图图层。",
      noData: "暂未返回实时数据",
      layers: {
        provinces: {
          label: "省级网格",
          meta: "显示 geoBoundaries 行政边界网格",
        },
        air: {
          label: "空气质量",
          meta: "展示 AQI 与 PM2.5 城市锚点",
        },
        quakes: {
          label: "近期地震",
          meta: "显示泰国周边区域地震事件",
        },
      },
      kpis: {
        aqi: "当前城市 AQI",
        pm25: "PM2.5 微克",
        projects: "项目关键词",
        quakes: "7天地震数",
      },
      feed: {
        citySignal: (name) => `${name} 实时信号`,
        cityMeta: (aqi, pm25, temp, rain) =>
          `AQI ${aqi} | PM2.5 ${pm25} | ${temp} C | 降雨 ${rain} mm`,
        trendTitle: (name, keyword) => `${name} 趋势: ${keyword}`,
        trendMeta: (pillar, score, projects) =>
          `${pillar} | 分数 ${score} | 相关项目 ${projects}`,
        quakeTitle: (magnitude, place) => `M${magnitude}，位置 ${place}`,
        quakeMeta: (time, depth) => `${time} | 深度 ${depth} km`,
        partial: "部分实时数据源暂时不可用。",
      },
      summary: {
        provinces: (count) => `${count} 个省级单元`,
        stations: (count) => `${count} 个城市锚点`,
        quakes: (count) => `${count} 次地震`,
      },
      legend: {
        boundary: "国家边界",
        province: "省级网格",
        air: "AQI 标记",
        quake: "地震标记",
      },
      selected: "已选",
      unavailable: "实时数据暂时不可用",
    },
  };

  const elements = {
    navPulse: document.getElementById("nav-pulse"),
    pulseKicker: document.getElementById("pulse-kicker"),
    pulseTitle: document.getElementById("pulse-title"),
    pulseCopy: document.getElementById("pulse-copy"),
    pulseStatus: document.getElementById("pulse-status"),
    pulseKpis: document.getElementById("pulse-kpis"),
    pulseLayerTitle: document.getElementById("pulse-layer-title"),
    pulseLayers: document.getElementById("pulse-layers"),
    pulseCityTitle: document.getElementById("pulse-city-title"),
    pulseCityList: document.getElementById("pulse-city-list"),
    pulseFeedTitle: document.getElementById("pulse-feed-title"),
    pulseFeed: document.getElementById("pulse-feed"),
    pulseMapKicker: document.getElementById("pulse-map-kicker"),
    pulseMapTitle: document.getElementById("pulse-map-title"),
    pulseMapSummary: document.getElementById("pulse-map-summary"),
    pulseMap: document.getElementById("pulse-map"),
    pulseMapLegend: document.getElementById("pulse-map-legend"),
  };

  const state = {
    language:
      localStorage.getItem("ascn-language") ||
      document.getElementById("language-select")?.value ||
      "en",
    payload: null,
    loading: false,
    error: "",
    selectedStationId: null,
    layers: {
      provinces: true,
      air: true,
      quakes: true,
    },
  };

  render();
  loadPulse();
  window.setInterval(loadPulse, 10 * 60 * 1000);

  document.getElementById("language-select")?.addEventListener("change", (event) => {
    state.language = event.target.value || "en";
    localStorage.setItem("ascn-language", state.language);
    render();
  });

  elements.pulseLayers?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-layer]");
    if (!button) {
      return;
    }

    const layer = button.dataset.layer;
    if (!layer || !(layer in state.layers)) {
      return;
    }

    state.layers[layer] = !state.layers[layer];
    render();
  });

  elements.pulseCityList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-station-id]");
    if (!button) {
      return;
    }

    state.selectedStationId = button.dataset.stationId || null;
    render();
  });

  function locale() {
    return COPY[state.language] || COPY.en;
  }

  function render() {
    renderStaticCopy();
    renderStatus();
    renderKpis();
    renderLayers();
    renderCities();
    renderFeed();
    renderMapSummary();
    renderMap();
    renderLegend();
  }

  function renderStaticCopy() {
    const copy = locale();

    if (elements.navPulse) {
      elements.navPulse.textContent = copy.navPulse;
    }

    if (elements.pulseKicker) {
      elements.pulseKicker.textContent = copy.pulseKicker;
    }
    if (elements.pulseTitle) {
      elements.pulseTitle.textContent = copy.pulseTitle;
    }
    if (elements.pulseCopy) {
      elements.pulseCopy.textContent = copy.pulseCopy;
    }
    if (elements.pulseLayerTitle) {
      elements.pulseLayerTitle.textContent = copy.pulseLayerTitle;
    }
    if (elements.pulseCityTitle) {
      elements.pulseCityTitle.textContent = copy.pulseCityTitle;
    }
    if (elements.pulseFeedTitle) {
      elements.pulseFeedTitle.textContent = copy.pulseFeedTitle;
    }
    if (elements.pulseMapKicker) {
      elements.pulseMapKicker.textContent = copy.pulseMapKicker;
    }
    if (elements.pulseMapTitle) {
      elements.pulseMapTitle.textContent = copy.pulseMapTitle;
    }
  }

  function renderStatus() {
    const copy = locale();

    if (!elements.pulseStatus) {
      return;
    }

    if (state.loading) {
      elements.pulseStatus.textContent = copy.refreshing;
      return;
    }

    if (state.error) {
      elements.pulseStatus.textContent = copy.offline;
      return;
    }

    if (!state.payload || !state.payload.generatedAt) {
      elements.pulseStatus.textContent = copy.waiting;
      return;
    }

    elements.pulseStatus.textContent = copy.updated(formatStamp(state.payload.generatedAt));
  }

  function renderKpis() {
    if (!elements.pulseKpis) {
      return;
    }

    const copy = locale();
    const station = getSelectedStation();

    if (!state.payload || !station) {
      elements.pulseKpis.innerHTML = `
        <div class="pulse-kpi">
          <strong>--</strong>
          <span>${escapeHtml(state.error || copy.noData)}</span>
        </div>
      `;
      return;
    }

    const cards = [
      {
        value: formatMetric(station.air?.usAqi, 0),
        label: copy.kpis.aqi,
      },
      {
        value: formatMetric(station.air?.pm2_5, 1),
        label: copy.kpis.pm25,
      },
      {
        value: String(station.trendKeywords?.length || 0),
        label: copy.kpis.projects,
      },
      {
        value: formatMetric((state.payload.earthquakes || []).length, 0),
        label: copy.kpis.quakes,
      },
    ];

    elements.pulseKpis.innerHTML = cards
      .map(
        (card) => `
          <div class="pulse-kpi">
            <strong>${escapeHtml(card.value)}</strong>
            <span>${escapeHtml(card.label)}</span>
          </div>
        `
      )
      .join("");
  }

  function renderLayers() {
    if (!elements.pulseLayers) {
      return;
    }

    const copy = locale();
    const layerOrder = ["provinces", "air", "quakes"];

    elements.pulseLayers.innerHTML = layerOrder
      .map((layerKey) => {
        const item = copy.layers[layerKey];
        const active = state.layers[layerKey];

        return `
          <button
            class="pulse-toggle ${active ? "is-active" : ""}"
            type="button"
            data-layer="${escapeHtml(layerKey)}"
          >
            <span>
              <span class="pulse-toggle-label">${escapeHtml(item.label)}</span>
              <span class="pulse-toggle-meta">${escapeHtml(item.meta)}</span>
            </span>
            <span class="pulse-toggle-pill">${active ? "ON" : "OFF"}</span>
          </button>
        `;
      })
      .join("");
  }

  function renderCities() {
    if (!elements.pulseCityList) {
      return;
    }

    const stations = state.payload?.stations || [];
    const copy = locale();

    if (!stations.length) {
      elements.pulseCityList.innerHTML = `
        <div class="pulse-feed-item">
          <strong>${escapeHtml(copy.unavailable)}</strong>
          <span>${escapeHtml(state.error || copy.noData)}</span>
        </div>
      `;
      return;
    }

    elements.pulseCityList.innerHTML = stations
      .map((station) => {
        const selected = station.id === state.selectedStationId;
        const aqi = formatMetric(station.air?.usAqi, 0);
        const projects = formatMetric(station.projectCount, 0);
        const trend = station.trendKeywords?.[0]?.term || "--";

        return `
          <button
            class="pulse-city-button ${selected ? "is-selected" : ""}"
            type="button"
            data-station-id="${escapeHtml(station.id)}"
          >
            <span class="pulse-city-name">${escapeHtml(localizeStationName(station))}</span>
            <span class="pulse-city-meta">
              ${escapeHtml(
                `${selected ? `${copy.selected} | ` : ""}AQI ${aqi} | ${projects} projects | ${trend}`
              )}
            </span>
          </button>
        `;
      })
      .join("");
  }

  function renderFeed() {
    if (!elements.pulseFeed) {
      return;
    }

    const copy = locale();
    const station = getSelectedStation();
    const items = [];

    if (station) {
      const firstTrend = station.trendKeywords?.[0];
      const firstPillar = station.pillars?.[0];

      items.push({
        title: copy.feed.citySignal(localizeStationName(station)),
        meta: copy.feed.cityMeta(
          formatMetric(station.air?.usAqi, 0),
          formatMetric(station.air?.pm2_5, 1),
          formatMetric(station.weather?.temperature_2m, 1),
          formatMetric(station.weather?.precipitation, 1)
        ),
      });

      if (firstTrend && firstPillar) {
        items.push({
          title: copy.feed.trendTitle(localizeStationName(station), firstTrend.term),
          meta: copy.feed.trendMeta(
            localizePillarLabel(firstPillar),
            formatMetric(firstPillar.score, 1),
            formatMetric(firstPillar.projectCount, 0)
          ),
        });
      }
    }

    (state.payload?.earthquakes || []).slice(0, 3).forEach((quake) => {
      items.push({
        title: copy.feed.quakeTitle(formatMetric(quake.magnitude, 1), quake.place),
        meta: copy.feed.quakeMeta(formatStamp(quake.time), formatMetric(quake.depthKm, 1)),
      });
    });

    if (state.payload?.errors?.length) {
      items.push({
        title: copy.feed.partial,
        meta: state.payload.errors[0],
      });
    }

    if (!items.length) {
      elements.pulseFeed.innerHTML = `
        <div class="pulse-feed-item">
          <strong>${escapeHtml(copy.unavailable)}</strong>
          <span>${escapeHtml(state.error || copy.noData)}</span>
        </div>
      `;
      return;
    }

    elements.pulseFeed.innerHTML = items
      .map(
        (item) => `
          <div class="pulse-feed-item">
            <strong>${escapeHtml(item.title)}</strong>
            <span>${escapeHtml(item.meta)}</span>
          </div>
        `
      )
      .join("");
  }

  function renderMapSummary() {
    if (!elements.pulseMapSummary) {
      return;
    }

    const copy = locale();
    const provinces = state.payload?.boundaries?.provinceCount || 0;
    const stations = (state.payload?.stations || []).length;
    const quakes = (state.payload?.earthquakes || []).length;

    const pills = [];

    if (provinces) {
      pills.push(copy.summary.provinces(provinces));
    }
    if (stations) {
      pills.push(copy.summary.stations(stations));
    }
    if (quakes || state.payload) {
      pills.push(copy.summary.quakes(quakes));
    }

    elements.pulseMapSummary.innerHTML = pills
      .map((label) => `<span class="pulse-summary-pill">${escapeHtml(label)}</span>`)
      .join("");
  }

  function renderMap() {
    if (!elements.pulseMap) {
      return;
    }

    const boundaries = state.payload?.boundaries;
    const stations = state.payload?.stations || [];
    const quakes = state.payload?.earthquakes || [];

    if (!boundaries?.adm0?.features?.length) {
      elements.pulseMap.innerHTML = `
        <rect x="0" y="0" width="1000" height="720" fill="transparent"></rect>
        <text x="500" y="330" text-anchor="middle" class="map-station-label">${escapeHtml(
          locale().unavailable
        )}</text>
        <text x="500" y="372" text-anchor="middle" class="map-station-tag">${escapeHtml(
          state.error || locale().apiHint
        )}</text>
      `;
      return;
    }

    const bounds = getBounds(boundaries, stations, quakes);
    const projector = createProjector(bounds);

    const adm0Paths = (boundaries.adm0.features || [])
      .map((feature) => createPathMarkup(feature.geometry, projector, "map-adm0"))
      .join("");

    const adm1Paths =
      state.layers.provinces && boundaries.adm1?.features?.length
        ? boundaries.adm1.features
            .map((feature) => createPathMarkup(feature.geometry, projector, "map-adm1"))
            .join("")
        : "";

    const quakeMarkup = state.layers.quakes
      ? quakes
          .map((quake) => {
            const point = projector(quake.longitude, quake.latitude);
            const radius = 3 + Math.min(Number(quake.magnitude) || 0, 6) * 1.25;

            return `
              <circle class="map-quake-ring" cx="${point.x}" cy="${point.y}" r="${radius + 5}"></circle>
              <circle class="map-quake-point" cx="${point.x}" cy="${point.y}" r="${radius}"></circle>
            `;
          })
          .join("")
      : "";

    const stationMarkup = state.layers.air
      ? stations
          .map((station) => {
            const point = projector(station.longitude, station.latitude);
            const aqi = Number(station.air?.usAqi);
            const pm25 = Number(station.air?.pm2_5);
            const fill = aqiColor(aqi);
            const radius = 8 + Math.max(0, Math.min(pm25 || 0, 48)) * 0.22;
            const isSelected = station.id === state.selectedStationId;

            return `
              <circle class="map-station-ring" cx="${point.x}" cy="${point.y}" r="${radius + 8}"></circle>
              <circle
                class="map-station-point"
                cx="${point.x}"
                cy="${point.y}"
                r="${radius}"
                fill="${escapeHtml(fill)}"
              ></circle>
              <text
                class="map-station-label"
                x="${point.x + 16}"
                y="${point.y - 6}"
              >${escapeHtml(localizeStationName(station))}</text>
              <text
                class="map-station-tag"
                x="${point.x + 16}"
                y="${point.y + 16}"
              >${escapeHtml(
                `${isSelected ? `${locale().selected} | ` : ""}AQI ${formatMetric(aqi, 0)}`
              )}</text>
            `;
          })
          .join("")
      : "";

    elements.pulseMap.innerHTML = `
      <g>${adm1Paths}</g>
      <g>${adm0Paths}</g>
      <g>${quakeMarkup}</g>
      <g>${stationMarkup}</g>
    `;
  }

  function renderLegend() {
    if (!elements.pulseMapLegend) {
      return;
    }

    const copy = locale();

    const items = [
      { label: copy.legend.boundary, color: "#1f3b5b" },
      { label: copy.legend.province, color: "#8ba7c4" },
      { label: copy.legend.air, color: "#0f766e" },
      { label: copy.legend.quake, color: "#ff8f3c" },
    ];

    elements.pulseMapLegend.innerHTML = items
      .map(
        (item) => `
          <div class="pulse-legend-item">
            <span
              class="pulse-legend-swatch"
              style="background:${escapeHtml(item.color)}"
            ></span>
            <span>${escapeHtml(item.label)}</span>
          </div>
        `
      )
      .join("");
  }

  async function loadPulse() {
    const copy = locale();

    if (window.location.protocol === "file:") {
      state.error = copy.apiHint;
      state.payload = null;
      render();
      return;
    }

    state.loading = true;
    state.error = "";
    renderStatus();

    try {
      const response = await fetch("/api/pulse", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      state.payload = data;

      if (!state.selectedStationId && data.stations?.length) {
        state.selectedStationId = data.stations[0].id;
      }

      if (
        state.selectedStationId &&
        !data.stations?.some((station) => station.id === state.selectedStationId)
      ) {
        state.selectedStationId = data.stations?.[0]?.id || null;
      }
    } catch (error) {
      state.payload = null;
      state.error = copy.apiHint;
    } finally {
      state.loading = false;
      render();
    }
  }

  function getSelectedStation() {
    const stations = state.payload?.stations || [];

    if (!stations.length) {
      return null;
    }

    return (
      stations.find((station) => station.id === state.selectedStationId) ||
      stations[0] ||
      null
    );
  }

  function localizeStationName(station) {
    if (state.language === "th") {
      return station.label_th || station.name;
    }
    if (state.language === "zh") {
      return station.label_zh || station.name;
    }
    return station.name;
  }

  function localizePillarLabel(pillar) {
    if (state.language === "th") {
      return pillar.label_th || pillar.label;
    }
    if (state.language === "zh") {
      return pillar.label_zh || pillar.label;
    }
    return pillar.label;
  }

  function createProjector(bounds) {
    const width = 1000;
    const height = 720;
    const pad = 54;
    const lonSpan = Math.max(bounds.maxLon - bounds.minLon, 1);
    const latSpan = Math.max(bounds.maxLat - bounds.minLat, 1);
    const scale = Math.min((width - pad * 2) / lonSpan, (height - pad * 2) / latSpan);
    const mapWidth = lonSpan * scale;
    const mapHeight = latSpan * scale;
    const offsetX = (width - mapWidth) / 2;
    const offsetY = (height - mapHeight) / 2;

    return (longitude, latitude) => ({
      x: round(offsetX + (longitude - bounds.minLon) * scale),
      y: round(height - offsetY - (latitude - bounds.minLat) * scale),
    });
  }

  function getBounds(boundaries, stations, quakes) {
    const points = [];

    collectCoordinates(boundaries?.adm0, points);
    collectCoordinates(boundaries?.adm1, points);

    stations.forEach((station) => {
      points.push([station.longitude, station.latitude]);
    });

    quakes.forEach((quake) => {
      points.push([quake.longitude, quake.latitude]);
    });

    const longitudes = points.map((point) => point[0]).filter(Number.isFinite);
    const latitudes = points.map((point) => point[1]).filter(Number.isFinite);

    return {
      minLon: Math.min(...longitudes),
      maxLon: Math.max(...longitudes),
      minLat: Math.min(...latitudes),
      maxLat: Math.max(...latitudes),
    };
  }

  function collectCoordinates(featureCollection, target) {
    (featureCollection?.features || []).forEach((feature) => {
      walkGeometry(feature.geometry, (longitude, latitude) => {
        target.push([longitude, latitude]);
      });
    });
  }

  function createPathMarkup(geometry, projector, className) {
    const path = geometryToPath(geometry, projector);
    if (!path) {
      return "";
    }

    return `<path class="${escapeHtml(className)}" d="${escapeHtml(path)}"></path>`;
  }

  function geometryToPath(geometry, projector) {
    if (!geometry) {
      return "";
    }

    if (geometry.type === "Polygon") {
      return polygonToPath(geometry.coordinates, projector);
    }

    if (geometry.type === "MultiPolygon") {
      return geometry.coordinates
        .map((polygon) => polygonToPath(polygon, projector))
        .filter(Boolean)
        .join(" ");
    }

    return "";
  }

  function polygonToPath(rings, projector) {
    return (rings || [])
      .map((ring) => {
        if (!ring || !ring.length) {
          return "";
        }

        const commands = ring
          .map((coord, index) => {
            const point = projector(coord[0], coord[1]);
            return `${index === 0 ? "M" : "L"}${point.x} ${point.y}`;
          })
          .join(" ");

        return `${commands} Z`;
      })
      .filter(Boolean)
      .join(" ");
  }

  function walkGeometry(geometry, visitor) {
    if (!geometry) {
      return;
    }

    if (geometry.type === "Polygon") {
      (geometry.coordinates || []).forEach((ring) => {
        (ring || []).forEach((coord) => {
          visitor(coord[0], coord[1]);
        });
      });
      return;
    }

    if (geometry.type === "MultiPolygon") {
      (geometry.coordinates || []).forEach((polygon) => {
        (polygon || []).forEach((ring) => {
          (ring || []).forEach((coord) => {
            visitor(coord[0], coord[1]);
          });
        });
      });
    }
  }

  function formatMetric(value, digits) {
    if (!Number.isFinite(Number(value))) {
      return "--";
    }

    return Number(value).toFixed(digits);
  }

  function formatStamp(value) {
    const parsed = Date.parse(value);
    if (!Number.isFinite(parsed)) {
      return value;
    }

    const localeCode =
      state.language === "th" ? "th-TH" : state.language === "zh" ? "zh-CN" : "en-US";

    return new Intl.DateTimeFormat(localeCode, {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    }).format(parsed);
  }

  function aqiColor(value) {
    if (!Number.isFinite(value)) {
      return "#6b7c93";
    }
    if (value <= 50) {
      return "#22c55e";
    }
    if (value <= 100) {
      return "#f59e0b";
    }
    if (value <= 150) {
      return "#f97316";
    }
    if (value <= 200) {
      return "#ef4444";
    }
    return "#8b5cf6";
  }

  function round(value) {
    return Number(value.toFixed(2));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
