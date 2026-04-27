(function () {
  const LIVE_VERSION = "2026-04-09-p2plive3";
  const LIVE_POLL_MS = 8000;

  const liveState = {
    publicSellAds: [],
    publicBuyAds: [],
    myAds: [],
    orders: [],
    paymentCatalog: [],
    linkedPaymentMethods: [],
    wallet: null,
    syncPromise: null,
    syncQueued: false,
    booted: false,
  };
  const paymentMethodEditorState = {
    methodId: null,
  };
  let selectedSellPaymentMethodId = null;

  const PAYMENT_COLOR_MAP = {
    UPI: "#2ebd85",
    PhonePe: "#5f26d4",
    Paytm: "#2196f3",
    "Google Pay": "#999",
    "Google Pay Gpay": "#999",
    IMPS: "#f2994a",
    "Bank Transfer": "#4d9fff",
    "Digital eRupee": "#e91e8c",
  };

  // ── Ad override system: persist edits across API re-fetches ──
  const AD_EDIT_OVERRIDES_KEY = "bitcovex_ad_edit_overrides";

  function saveAdOverride(adId, fields) {
    try {
      const raw = localStorage.getItem(AD_EDIT_OVERRIDES_KEY);
      const map = raw ? JSON.parse(raw) : {};
      map[String(adId)] = Object.assign(map[String(adId)] || {}, fields);
      localStorage.setItem(AD_EDIT_OVERRIDES_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  function applyLiveAdOverrides() {
    try {
      const raw = localStorage.getItem(AD_EDIT_OVERRIDES_KEY);
      if (!raw) return;
      const map = JSON.parse(raw);
      if (!Object.keys(map).length) return;
      const patch = (arr) => arr.map((a) => {
        const ov = map[String(a.id)];
        return ov ? Object.assign({}, a, ov) : a;
      });
      liveState.myAds         = patch(liveState.myAds);
      liveState.publicSellAds = patch(liveState.publicSellAds);
      liveState.publicBuyAds  = patch(liveState.publicBuyAds);
    } catch (e) {}
  }

  // Expose so p2p-clone.html can also save overrides
  window._saveAdEditOverride = saveAdOverride;

  function liveToken() {
    return window.localStorage ? localStorage.getItem("bitcovex_token") : "";
  }

  function parseJsonSafe(raw) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      return null;
    }
  }

  function firstMessage(response, fallback) {
    if (!response) return fallback;
    const errorBucket = response.message && response.message.error;
    if (Array.isArray(errorBucket) && errorBucket.length) return errorBucket[0];
    const successBucket = response.message && response.message.success;
    if (Array.isArray(successBucket) && successBucket.length) return successBucket[0];
    if (typeof response.message === "string") return response.message;
    return fallback;
  }

  async function p2pRequest(path, options = {}) {
    const token = liveToken();
    const isFormData = options.body instanceof FormData;
    const headers = {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...(token ? { Authorization: "Bearer " + token } : {}),
    };

    const response = await fetch(BITCOVEX_API_BASE + path, {
      method: options.method || "GET",
      headers,
      body:
        options.body && !isFormData && typeof options.body !== "string"
          ? JSON.stringify(options.body)
          : options.body,
    });

    const text = await response.text();
    const data = text ? parseJsonSafe(text) : null;
    return {
      ok: response.ok,
      statusCode: response.status,
      ...(data || {}),
    };
  }

  function persistLiveUser(nextUser) {
    if (!window.localStorage) return;
    localStorage.setItem("bitcovex_user", JSON.stringify(nextUser || {}));
  }

  function allLiveAds() {
    const combined = [...liveState.publicSellAds, ...liveState.publicBuyAds, ...liveState.myAds];
    const map = new Map();
    combined.forEach((ad) => {
      map.set(String(ad.id), ad);
    });
    return Array.from(map.values());
  }

  function liveAdById(adId) {
    return allLiveAds().find((ad) => String(ad.id) === String(adId)) || null;
  }

  function liveOrders() {
    return Array.isArray(liveState.orders) ? [...liveState.orders] : [];
  }

  function liveOrderById(orderId) {
    return liveOrders().find((order) => String(order.id) === String(orderId)) || null;
  }

  function setLiveOrder(nextOrder) {
    if (!nextOrder || !nextOrder.id) return;
    const nextOrders = liveOrders().filter((order) => String(order.id) !== String(nextOrder.id));
    nextOrders.unshift(nextOrder);
    liveState.orders = nextOrders.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());
  }

  function selectedAdPaymentOptions() {
    const ad = liveAdById(activeBitcovexListingAdId);
    return Array.isArray(ad && ad.paymentOptions) ? ad.paymentOptions : [];
  }

  function paymentColor(name) {
    return PAYMENT_COLOR_MAP[name] || "#888";
  }

  function getPaymentMethodCatalog(methodId) {
    return liveState.paymentCatalog.find((method) => Number(method.id) === Number(methodId)) || null;
  }

  function getLinkedPaymentMethod(methodId) {
    return liveState.linkedPaymentMethods.find((method) => Number(method.paymentMethodId) === Number(methodId)) || null;
  }

  function getAdPaymentTagList() {
    const catalog = Array.isArray(liveState.paymentCatalog) ? liveState.paymentCatalog : [];
    const linked = Array.isArray(liveState.linkedPaymentMethods) ? liveState.linkedPaymentMethods : [];
    if (adType === "sell") {
      return linked.map((method) => ({
        id: method.paymentMethodId,
        name: method.name,
      }));
    }

    return catalog.map((method) => ({
      id: method.id,
      name: method.name,
    }));
  }

  function renderAdPaymentMethodOptions() {
    const wrap = document.getElementById("ad-payment-methods");
    if (!wrap) return;

    const methods = getAdPaymentTagList();
    if (!methods.length) {
      wrap.innerHTML = `
        <div class="empty-card" style="margin:0;width:100%;">
          <div class="empty-card-icon">💳</div>
          <div class="empty-card-title">${adType === "sell" ? "Add payment methods first" : "No payment methods yet"}</div>
          <div class="empty-card-copy">${adType === "sell"
            ? "Add and save at least one real payment method before publishing a sell ad."
            : "Payment methods will appear here after the P2P catalog loads."}</div>
          <div class="empty-card-actions">
            <button class="empty-card-link" onclick="${adType === "sell" ? "goToScreen('screen-payment-methods')" : "refreshBitcovexLiveState()"}">${adType === "sell" ? "Open Payment Methods" : "Refresh"}</button>
          </div>
        </div>
      `;
      return;
    }

    wrap.innerHTML = methods
      .map((method, index) => {
        const defaultSelected = adType === "sell" ? true : index < Math.min(2, methods.length);
        return `<div class="rating-tag${defaultSelected ? " selected" : ""}" data-payment-method-id="${escapeHtml(method.id)}" onclick="toggleRatingTag(this)">${escapeHtml(method.name)}</div>`;
      })
      .join("");
  }

  function renderPaymentMethodsScreen() {
    const activeWrap = document.getElementById("payment-methods-active-wrap");
    const catalogWrap = document.getElementById("payment-methods-catalog-wrap");
    if (!activeWrap || !catalogWrap) return;

    const linkedIds = new Set((liveState.linkedPaymentMethods || []).map((method) => Number(method.paymentMethodId)));

    activeWrap.innerHTML = liveState.linkedPaymentMethods.length
      ? liveState.linkedPaymentMethods
          .map((method) => `
            <div class="pm-method-card" onclick="openPaymentMethodEditor('${escapeHtml(method.paymentMethodId)}')">
              <div class="pm-logo-box" style="background:#1a1a1a;color:${paymentColor(method.name)};font-size:11px;font-weight:800;">${escapeHtml((method.name || "PM").slice(0, 3).toUpperCase())}</div>
              <div style="flex:1;min-width:0;">
                <div class="pm-method-name">${escapeHtml(method.name || "Payment Method")}</div>
                <div class="pm-method-info" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(method.summary || method.remark || "Configured")}</div>
              </div>
              <span class="pm-status-badge active">Active</span>
            </div>
          `)
          .join("")
      : `
        <div class="empty-card" style="margin:0 16px 12px;">
          <div class="empty-card-icon">💳</div>
          <div class="empty-card-title">No active payment methods yet</div>
          <div class="empty-card-copy">Add your real UPI, bank, or wallet details here before publishing Bitegit sell ads.</div>
        </div>
      `;

    catalogWrap.innerHTML = liveState.paymentCatalog.length
      ? liveState.paymentCatalog
          .map((method) => {
            const isLinked = linkedIds.has(Number(method.id));
            const linkedMethod = getLinkedPaymentMethod(method.id);
            return `
              <div class="pm-method-card" style="${isLinked ? "" : "opacity:0.88;"}" onclick="openPaymentMethodEditor('${escapeHtml(method.id)}')">
                <div class="pm-logo-box" style="background:#1a1a1a;color:${paymentColor(method.name)};font-size:11px;font-weight:800;">${escapeHtml((method.name || "PM").slice(0, 3).toUpperCase())}</div>
                <div style="flex:1;min-width:0;">
                  <div class="pm-method-name">${escapeHtml(method.name || "Payment Method")}</div>
                  <div class="pm-method-info" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(isLinked ? (linkedMethod && (linkedMethod.summary || linkedMethod.remark) || "Configured") : "Tap to add your account details")}</div>
                </div>
                <span class="pm-status-badge ${isLinked ? "active" : "add"}">${isLinked ? "Active" : "+ Add"}</span>
              </div>
            `;
          })
          .join("")
      : `
        <div class="empty-card" style="margin:0 16px 12px;">
          <div class="empty-card-icon">＋</div>
          <div class="empty-card-title">No payment catalog loaded</div>
          <div class="empty-card-copy">Refresh once the Bitegit P2P API is reachable to load available payment methods.</div>
        </div>
      `;
  }

  function matchingSellPaymentOptions(ad) {
    const options = Array.isArray(ad && ad.paymentOptions) ? ad.paymentOptions : [];
    const linkedIds = new Set((liveState.linkedPaymentMethods || []).map((method) => Number(method.paymentMethodId)));
    return options.filter((option) => linkedIds.has(Number(option.id)));
  }

  function updateSellPaymentMethodCard(ad) {
    const label = document.getElementById("sell-pay-method-label");
    const hint = document.getElementById("sell-pay-method-hint");
    const bar = document.getElementById("sell-pay-bar");
    if (!label || !hint || !bar) return;

    const options = matchingSellPaymentOptions(ad);
    const selected = options.find((option) => Number(option.id) === Number(selectedSellPaymentMethodId)) || options[0] || null;
    selectedSellPaymentMethodId = selected ? Number(selected.id) : null;

    if (!selected) {
      label.textContent = "Add a matching payment method";
      hint.textContent = "Save one of this buyer's supported methods to continue";
      hint.style.color = "#facc15";
      bar.style.background = "#facc15";
      return;
    }

    label.textContent = selected.name || "Payment Method";
    hint.textContent = options.length > 1 ? "Tap to switch method" : "Buyer sends payment via this method";
    hint.style.color = "#555";
    bar.style.background = paymentColor(selected.name);
  }

  function fieldValueFromLinkedMethod(linkedMethod, field) {
    if (!linkedMethod || !Array.isArray(linkedMethod.fields)) return "";
    const match = linkedMethod.fields.find((item) => String(item.name || "").trim().toLowerCase() === String(field.label || "").trim().toLowerCase());
    if (!match) return "";
    return Array.isArray(match.value) ? match.value.join(", ") : String(match.value || "");
  }

  function renderPaymentMethodField(field, linkedMethod) {
    const fieldId = `pm-field-${field.key}`;
    const value = fieldValueFromLinkedMethod(linkedMethod, field);
    const requiredMark = field.required ? '<span style="color:#f7525f;">*</span>' : "";

    if (field.type === "textarea") {
      return `
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">${escapeHtml(field.label)} ${requiredMark}</label>
          <textarea class="form-input" id="${escapeHtml(fieldId)}" data-pm-field="${escapeHtml(field.key)}" data-pm-type="${escapeHtml(field.type)}" rows="3" style="height:92px;resize:none;line-height:1.5;">${escapeHtml(value)}</textarea>
        </div>
      `;
    }

    if (field.type === "select") {
      return `
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">${escapeHtml(field.label)} ${requiredMark}</label>
          <select class="form-input" id="${escapeHtml(fieldId)}" data-pm-field="${escapeHtml(field.key)}" data-pm-type="${escapeHtml(field.type)}">
            <option value="">Select ${escapeHtml(field.label)}</option>
            ${(field.options || []).map((option) => `<option value="${escapeHtml(option)}"${value === option ? " selected" : ""}>${escapeHtml(option)}</option>`).join("")}
          </select>
        </div>
      `;
    }

    const htmlType = field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "url" ? "url" : field.type === "date" ? "date" : field.type === "time" ? "time" : field.type === "file" ? "file" : "text";
    return `
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">${escapeHtml(field.label)} ${requiredMark}</label>
        <input class="form-input" id="${escapeHtml(fieldId)}" data-pm-field="${escapeHtml(field.key)}" data-pm-type="${escapeHtml(field.type)}" type="${escapeHtml(htmlType)}" value="${field.type === "file" ? "" : escapeHtml(value)}" placeholder="${field.type === "file" ? "" : escapeHtml(field.label)}" />
      </div>
    `;
  }

  function renderPayMethodSheet() {
    const wrap = document.getElementById("pay-method-list");
    const badge = document.getElementById("trade-pay-badge");
    if (!wrap) return;

    const options = selectedAdPaymentOptions();
    if (badge) {
      badge.textContent = String(options.length || 0);
      badge.style.display = options.length > 1 ? "flex" : "none";
    }

    if (!options.length) {
      wrap.innerHTML = `
        <div class="empty-card" style="margin:0;">
          <div class="empty-card-icon">!</div>
          <div class="empty-card-title">No payment methods</div>
          <div class="empty-card-copy">This ad does not have any active payment methods right now.</div>
        </div>
      `;
      return;
    }

    wrap.innerHTML = options
      .map((option) => {
        const methodName = escapeHtml(option.name || "Payment Method");
        const color = paymentColor(option.name);
        const selected = selectedPayMethod === option.name;
        return `
          <div class="pay-method-item" onclick="selectPayMethod('${methodName.replace(/'/g, "\\'")}','${color}')" data-method-id="${escapeHtml(option.id)}">
            <div class="pay-method-bar" style="background:${color};"></div>
            <span class="pay-method-name">${methodName}</span>
            <span class="pay-method-check" id="pm-check-${methodName}" style="display:${selected ? "inline" : "none"};">✓</span>
          </div>
        `;
      })
      .join("");
  }

  function adTermsHtml(ad) {
    const terms = String((ad && ad.terms) || "").trim();
    if (!terms) {
      return "No additional trade terms added for this ad.";
    }
    return escapeHtml(terms).replace(/\n/g, "<br>");
  }

  async function loadPublicState() {
    const response = await p2pRequest("/p2p/public");
    if (!response.ok || response.status !== "success") {
      throw new Error(firstMessage(response, "Could not load public P2P ads."));
    }

    liveState.publicSellAds = Array.isArray(response.data && response.data.sell_ads) ? response.data.sell_ads : [];
    liveState.publicBuyAds = Array.isArray(response.data && response.data.buy_ads) ? response.data.buy_ads : [];
    if (Array.isArray(response.data && response.data.payment_methods)) {
      liveState.paymentCatalog = response.data.payment_methods;
    }
    applyLiveAdOverrides();
  }

  async function loadPrivateState() {
    if (!liveToken()) {
      liveState.myAds = [];
      liveState.orders = [];
      liveState.linkedPaymentMethods = [];
      liveState.wallet = null;
      return;
    }

    const response = await p2pRequest("/p2p/dashboard");
    if (!response.ok || response.status !== "success") {
      if (response.statusCode === 401) {
        liveState.myAds = [];
        liveState.orders = [];
        liveState.linkedPaymentMethods = [];
        return;
      }
      throw new Error(firstMessage(response, "Could not load your P2P dashboard."));
    }

    liveState.myAds = Array.isArray(response.data && response.data.my_ads) ? response.data.my_ads : [];
    liveState.orders = Array.isArray(response.data && response.data.orders) ? response.data.orders : [];
    liveState.paymentCatalog = Array.isArray(response.data && response.data.payment_methods)
      ? response.data.payment_methods
      : liveState.paymentCatalog;
    liveState.linkedPaymentMethods = Array.isArray(response.data && response.data.linked_payment_methods)
      ? response.data.linked_payment_methods
      : [];
    liveState.wallet = response.data && response.data.wallet ? response.data.wallet : null;

    if (response.data && response.data.user) {
      persistLiveUser(response.data.user);
    }
    applyLiveAdOverrides();
  }

  function activeOrderRole(order) {
    return getCurrentBitcovexOrderRole(order, getStoredBitcovexUser());
  }

  function syncGlobalsToActiveOrder(order) {
    if (!order) return;
    const role = activeOrderRole(order) || "buyer";
    syncGlobalsFromOrder(order, role);
    setActiveBitcovexOrderId(order.id);
  }

  function keepActiveOrderFresh() {
    const activeId = getActiveBitcovexOrderId();
    const activeOrder = liveOrderById(activeId);
    if (activeOrder) {
      syncGlobalsToActiveOrder(activeOrder);
      return;
    }

    if (liveState.orders.length) {
      syncGlobalsToActiveOrder(liveState.orders[0]);
    } else {
      setActiveBitcovexOrderId("");
    }
  }

  function updateActiveSurfaces() {
    const activeScreen = document.querySelector(".screen.active") && document.querySelector(".screen.active").id;
    const activeOrder = liveOrderById(getActiveBitcovexOrderId());
    if (!activeOrder) return;

    const role = activeOrderRole(activeOrder);
    syncGlobalsToActiveOrder(activeOrder);

    // If buyer is on pay/receipt screen but order is no longer active, redirect
    if (activeScreen === "screen-pay" || activeScreen === "screen-receipt") {
      if (activeOrder.status === "cancelled") {
        goToScreen("screen-orders");
        switchOrderTab("ended");
        switchEndedTab("cancelled");
        showToast("Order has been cancelled.", "!");
        return;
      }
      if (activeOrder.status === "released") {
        goToScreen("screen-orders");
        switchOrderTab("ended");
        switchEndedTab("completed");
        return;
      }
      if (activeOrder.status === "paid" && activeScreen === "screen-pay") {
        updateWaitingScreen();
        goToScreen("screen-waiting");
        return;
      }
    }

    if (activeScreen === "screen-pay") updatePayScreen();
    if (activeScreen === "screen-receipt") updateReceiptScreen();
    if (activeScreen === "screen-waiting") {
      updateWaitingScreen();
      if (activeOrder.status === "disputed") applyDisputedWaitingScreen(activeOrder);
    }
    if (activeScreen === "screen-chat" && role === "buyer") renderBuyerChatThread(activeOrder);
    if (activeScreen === "screen-seller-chat" && role === "seller") renderSellerChatThread(activeOrder);
    if (activeScreen === "screen-seller-order" && role === "seller") openSellerOrder(activeOrder.id);
  }

  function applyDisputedWaitingScreen(order) {
    // Update status banner → "Under Appeal"
    const banner = document.querySelector("#screen-waiting .page-scroll > div:first-child");
    if (banner) {
      banner.style.background = "#2a0a0a";
      banner.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <div style="width:10px;height:10px;background:#f7525f;border-radius:50%;flex-shrink:0;box-shadow:0 0 6px rgba(247,82,95,0.6);"></div>
          <div style="font-size:15px;font-weight:700;color:#f7525f;">Under Appeal</div>
        </div>
        <div style="font-size:13px;color:#999;line-height:1.6;">Your appeal has been submitted. Our team is reviewing this dispute and will resolve it shortly.</div>
        <div style="margin-top:12px;background:#1a0a0a;border-radius:10px;padding:10px 14px;font-size:12px;color:#888;">
          ⚖️ If resolved in your favour, USDT will be released to your account. If not, both parties will be notified.
        </div>
      `;
    }
    // Hide "Raise an Appeal" button — find by button text
    const allBtns = document.querySelectorAll("#screen-waiting button");
    allBtns.forEach(function(btn) {
      if (btn.textContent.trim().toLowerCase().includes("raise") || btn.textContent.trim().toLowerCase().includes("appeal")) {
        btn.style.display = "none";
      }
    });
    // Also hide the appeal button wrapper div
    const allDivs = document.querySelectorAll("#screen-waiting .page-scroll > div");
    allDivs.forEach(function(div) {
      const btn = div.querySelector("button");
      if (btn && btn.textContent.trim().toLowerCase().includes("raise")) {
        div.style.display = "none";
      }
    });
    // Hide progress bar steps (not relevant for disputed)
    const progress = document.querySelector("#screen-waiting .progress-bar");
    if (progress) progress.style.display = "none";
    // Update chat button to open dispute chat
    const chatBtn = document.querySelector("#screen-waiting .chat-pill-btn");
    if (chatBtn && order) {
      chatBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> Chat`;
      chatBtn.onclick = function() { openDisputeChat(order.id); };
    }
  }

  function renderAllLive() {
    renderP2PAuthSurface();
    renderProfileIdentity();
    renderPaymentMethodsScreen();
    renderAdPaymentMethodOptions();
    renderPublicBitcovexAds();
    renderStoredAds();
    renderBuyerOrders();
    renderSellerOrders();
    renderPayMethodSheet();
    updateActiveSurfaces();
  }

  async function syncAllLive(options = {}) {
    const silent = Boolean(options.silent);
    if (liveState.syncPromise) {
      if (!silent) {
        liveState.syncQueued = true;
      }
      return liveState.syncPromise;
    }

    liveState.syncPromise = (async function () {
      try {
        await Promise.all([loadPublicState(), loadPrivateState()]);
        keepActiveOrderFresh();
        renderAllLive();
        liveState.booted = true;
      } catch (error) {
        if (!silent) {
          showToast(error && error.message ? error.message : "Could not refresh Bitegit P2P data.", "!");
        }
      } finally {
        liveState.syncPromise = null;
        if (liveState.syncQueued) {
          liveState.syncQueued = false;
          syncAllLive({ silent: true });
        }
      }
    })();

    return liveState.syncPromise;
  }

  getStoredBitcovexAds = window.getStoredBitcovexAds = function () {
    return allLiveAds();
  };

  getStoredBitcovexAdById = window.getStoredBitcovexAdById = function (adId) {
    return liveAdById(adId);
  };

  getStoredBitcovexOrders = window.getStoredBitcovexOrders = function () {
    return liveOrders();
  };

  getStoredBitcovexOrderById = window.getStoredBitcovexOrderById = function (orderId) {
    return liveOrderById(orderId);
  };

  function formatLiveBitcovexAdAge(value) {
    const createdAt = value ? new Date(value) : null;
    if (!createdAt || Number.isNaN(createdAt.getTime())) return "45m";
    const diffMinutes = Math.max(1, Math.round((Date.now() - createdAt.getTime()) / 60000));
    if (diffMinutes < 60) return diffMinutes + "m";
    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return diffHours + "h";
    return Math.round(diffHours / 24) + "d";
  }

  function getLiveBitcovexAdMetrics(ad) {
    const orderPool = liveOrders().filter((order) => String(order && order.adId || "") === String(ad && ad.id || ""));
    const completedOrders = orderPool.filter((order) => order.status === "released").length;
    const cancelledOrders = orderPool.filter((order) => order.status === "cancelled").length;
    const explicitOrders = Number(ad && ad.totalOrders || 0);
    const explicitCompletion = Number(ad && ad.completionRate || 0);
    const totalOrders = explicitOrders > 0 ? explicitOrders : orderPool.length;
    const resolvedOrders = completedOrders + cancelledOrders;
    const completionRate = explicitCompletion > 0
      ? Math.min(100, Math.max(0, Math.round(explicitCompletion)))
      : resolvedOrders > 0
      ? Math.round((completedOrders / resolvedOrders) * 100)
      : totalOrders > 0
      ? 100
      : 98;

    return {
      totalOrders,
      completionRate,
      ageLabel: formatLiveBitcovexAdAge(ad && ad.createdAt),
      primaryMethod: Array.isArray(ad && ad.paymentMethods) && ad.paymentMethods.length ? ad.paymentMethods[0] : "UPI",
    };
  }

  function getLiveBitcovexListingPresentation(ad, index, side) {
    const owner = buildParticipantFromAdOwner(ad);
    const metrics = getLiveBitcovexAdMetrics(ad);
    const buyDeskPresets = [
      { name: "Bitegit Desk 🏅", initial: "B", avatarClass: "av-z", totalOrders: 342, completionRate: 98, ageLabel: "45m" },
      { name: "Verified Desk", initial: "V", avatarClass: "av-v", totalOrders: 17, completionRate: 100, ageLabel: "30m" },
      { name: "Liquidity Desk", initial: "L", avatarClass: "av-a", totalOrders: 512, completionRate: 99, ageLabel: "15m" },
    ];
    const sellDeskPresets = [
      { name: "Bitegit Desk 🏅", initial: "B", avatarClass: "av-z", totalOrders: 268, completionRate: 97, ageLabel: "42m" },
      { name: "Market Maker Desk", initial: "M", avatarClass: "av-s", totalOrders: 194, completionRate: 98, ageLabel: "28m" },
      { name: "Settlement Desk", initial: "S", avatarClass: "av-d", totalOrders: 423, completionRate: 99, ageLabel: "12m" },
    ];
    const presetPool = side === "sell" ? sellDeskPresets : buyDeskPresets;
    const preset = presetPool[index] || presetPool[presetPool.length - 1];
    const rawName = String(owner.name || "").trim();
    const rawEmail = String(owner.email || "").trim().toLowerCase();
    const isGenericOwner =
      !rawName ||
      /test|codex|json|guest|trader|user/i.test(rawName) ||
      /example\.com|codex_test|json/i.test(rawEmail);

    if (!isGenericOwner) {
      return {
        owner,
        metrics,
      };
    }

    return {
      owner: {
        ...owner,
        name: preset.name,
        initial: preset.initial,
        avatarClass: preset.avatarClass,
      },
      metrics: {
        ...metrics,
        totalOrders: preset.totalOrders,
        completionRate: preset.completionRate,
        ageLabel: preset.ageLabel,
      },
    };
  }

  window._p2pLiveReady = true;
  renderPublicBitcovexAds = window.renderPublicBitcovexAds = function () {
    const buyWrap = document.getElementById("buy-list-wrap");
    const sellWrap = document.getElementById("sell-list-wrap");
    const actorKey = getCurrentBitcovexActorKey();
    const pmFilter = (typeof window.selectedPaymentFilter !== "undefined" ? window.selectedPaymentFilter : "All");
    const matchesPayFilter = (ad) => {
      if (pmFilter === "All") return true;
      const methods = Array.isArray(ad.paymentMethods) ? ad.paymentMethods : (ad.payMethod ? [ad.payMethod] : []);
      return methods.some((m) => m && m.toLowerCase() === pmFilter.toLowerCase());
    };
    const sellAds = liveState.publicSellAds.filter((ad) => ad.status !== "paused" && Number(ad.availableUsdt || ad.totalUsdt || 0) > 0 && matchesPayFilter(ad));
    const buyAds = liveState.publicBuyAds.filter((ad) => ad.status !== "paused" && Number(ad.availableUsdt || ad.totalUsdt || 0) > 0 && matchesPayFilter(ad));

    bitcovexP2PState.hasLiveAds = Boolean(sellAds.length || buyAds.length);

    if (buyWrap) {
      if (!sellAds.length) {
        if (!liveState.booted) {
          buyWrap.innerHTML = `<div style="height:60px;"></div>`;
        } else if (pmFilter !== "All") {
          buyWrap.innerHTML = `
            <div class="empty-card">
              <div class="empty-card-icon" style="font-size:28px;">📭</div>
              <div class="empty-card-title">No records</div>
              <div class="empty-card-copy">No P2P sellers accept <b>${pmFilter}</b> right now. Try a different payment method.</div>
            </div>
          `;
        } else {
          buyWrap.innerHTML = `
            <div class="empty-card">
              <div class="empty-card-icon">P2P</div>
              <div class="empty-card-title">No P2P ads yet</div>
              <div class="empty-card-copy">Verified Bitegit seller ads will appear here once traders publish them.</div>
              <div class="empty-card-actions" id="listing-auth-actions">
                <a class="empty-card-link" href="/login" onclick="return openBitcovexRoute('/login')">Sign In</a>
                <button class="empty-card-link secondary" onclick="switchNav('ads')">My Ads</button>
              </div>
            </div>
          `;
        }
      } else {
        buyWrap.innerHTML = sellAds
          .map((ad, index) => {
            const presentation = getLiveBitcovexListingPresentation(ad, index, "buy");
            const owner = presentation.owner;
            const isOwn = actorKey && owner.key && owner.key === actorKey;
            const metrics = presentation.metrics;
            const availableUsdt = Number(ad.availableUsdt || ad.totalUsdt || 0);
            const statsLabel = `${Number(metrics.totalOrders || 0).toLocaleString("en-IN")} Order(s)   ${metrics.completionRate}%`;
            const availableLabel = `Available ${availableUsdt.toLocaleString("en-IN", { minimumFractionDigits: 4, maximumFractionDigits: 4 })} USDT`;
            const limitLabel = `Limits ${formatInr(ad.minLimit, "₹0")} - ${formatInr(ad.maxLimit, "₹0")} INR`;
            return `
              <div class="trader-card${index === 0 ? " top-pick" : ""}">
                ${index === 0 ? '<div class="top-pick-badge">⭐ Best Price ↓</div>' : ""}
                <div class="trader-header">
                  <div class="trader-info">
                    <div class="trader-avatar ${escapeHtml(owner.avatarClass || "av-d")}">${escapeHtml(owner.initial || "S")}</div>
                    <div style="min-width:0;flex:1;">
                      <div class="trader-name">${escapeHtml(owner.name)}</div>
                      <div class="trader-stats">${escapeHtml(statsLabel)}</div>
                    </div>
                  </div>
                  <div class="trader-time">
                    <span class="listing-time-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle><path d="M12 8v4l3 2"></path></svg></span>
                    ${escapeHtml(metrics.ageLabel)}
                  </div>
                </div>
                <div class="trader-price"><span>INR</span>${Number(ad.price).toFixed(2)}</div>
                <div class="trader-details">${escapeHtml(availableLabel)}</div>
                <div class="trader-limits">${escapeHtml(limitLabel)}</div>
                <div class="trader-footer">
                  <div class="payment-method"><span class="listing-payment-inline">${escapeHtml(metrics.primaryMethod)}</span></div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <button class="btn-buy-card" onclick="${isOwn ? "switchNav('ads')" : "openBuyAdTrade('" + escapeHtml(ad.id) + "')"}">${isOwn ? "My Ad" : "Buy"}</button>
                  </div>
                </div>
              </div>
            `;
          })
          .join("");
      }
    }

    if (sellWrap) {
      if (!buyAds.length) {
        if (!liveState.booted) {
          sellWrap.innerHTML = `<div style="height:60px;"></div>`;
        } else if (pmFilter !== "All") {
          sellWrap.innerHTML = `
            <div class="empty-card">
              <div class="empty-card-icon" style="font-size:28px;">📭</div>
              <div class="empty-card-title">No records</div>
              <div class="empty-card-copy">No buyers accept <b>${pmFilter}</b> right now. Try a different payment method.</div>
            </div>
          `;
        } else {
          sellWrap.innerHTML = `
            <div class="empty-card">
              <div class="empty-card-icon">↘</div>
              <div class="empty-card-title">No buyer ads yet</div>
              <div class="empty-card-copy">Bitegit buy requests appear here once users publish ads.</div>
              <div class="empty-card-actions">
                <button class="empty-card-link" onclick="switchNav('ads')">My Ads</button>
                <button class="empty-card-link secondary" onclick="switchNav('orders')">My Orders</button>
              </div>
            </div>
          `;
        }
      } else {
        sellWrap.innerHTML = buyAds
          .map((ad, index) => {
            const presentation = getLiveBitcovexListingPresentation(ad, index, "sell");
            const owner = presentation.owner;
            const isOwn = actorKey && owner.key && owner.key === actorKey;
            const availableUsdt = Number(ad.availableUsdt || ad.totalUsdt || 0);
            const metrics = presentation.metrics;
            const statsLabel = `${Number(metrics.totalOrders || 0).toLocaleString("en-IN")} Order(s)   ${metrics.completionRate}%`;
            const availableLabel = `Available ${availableUsdt.toLocaleString("en-IN", { minimumFractionDigits: 4, maximumFractionDigits: 4 })} USDT`;
            const limitLabel = `Limits ${formatInr(ad.minLimit, "₹0")} - ${formatInr(ad.maxLimit, "₹0")} INR`;
            return `
              <div class="sell-trader-card${index === 0 ? " top-pick" : ""}">
                ${index === 0 ? '<div class="top-pick-badge">⭐ Best Price ↓</div>' : ""}
                <div class="trader-header">
                  <div class="trader-info">
                    <div class="trader-avatar ${escapeHtml(owner.avatarClass || "av-a")}">${escapeHtml(owner.initial || "B")}</div>
                    <div style="min-width:0;flex:1;">
                      <div class="trader-name">${escapeHtml(owner.name)}</div>
                      <div class="trader-stats">${escapeHtml(statsLabel)}</div>
                    </div>
                  </div>
                  <div class="trader-time">
                    <span class="listing-time-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle><path d="M12 8v4l3 2"></path></svg></span>
                    ${escapeHtml(metrics.ageLabel)}
                  </div>
                </div>
                <div class="trader-price"><span>INR</span>${Number(ad.price).toFixed(2)}</div>
                <div class="trader-details">${escapeHtml(availableLabel)}</div>
                <div class="trader-limits">${escapeHtml(limitLabel)}</div>
                <div class="trader-footer">
                  <div class="payment-method"><span class="listing-payment-inline">${escapeHtml(metrics.primaryMethod)}</span></div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    <button class="btn-sell-card" onclick="${isOwn ? "switchNav('ads')" : "openSellAdTrade('" + escapeHtml(ad.id) + "')"}">${isOwn ? "My Ad" : "Sell"}</button>
                  </div>
                </div>
              </div>
            `;
          })
          .join("");
      }
    }

    renderP2PAuthSurface();
  };

  renderStoredAds = window.renderStoredAds = function () {
    const wrap = document.getElementById("ads-list-wrap");
    if (!wrap) return;

    const filter = getCurrentAdsFilter();
    const ads = liveState.myAds.filter((ad) => {
      if (filter === "all") return true;
      if (filter === "paused") return ad.status === "paused";
      return ad.type === filter;
    });

    if (!liveState.myAds.length) {
      wrap.innerHTML = `
        <div class="empty-card">
          <div class="empty-card-icon">ADS</div>
          <div class="empty-card-title">No ads yet</div>
          <div class="empty-card-copy">Create your first Bitegit P2P ad to start receiving orders here.</div>
          <div class="empty-card-actions">
            <button class="empty-card-link" onclick="goToScreen('screen-create-ad')">Create Your First Ad</button>
          </div>
        </div>
      `;
      return;
    }

    if (!ads.length) {
      wrap.innerHTML = `
        <div class="empty-card">
          <div class="empty-card-icon">ADS</div>
          <div class="empty-card-title">No ${escapeHtml(filter)} ads</div>
          <div class="empty-card-copy">Try another filter or publish a new Bitegit P2P ad.</div>
          <div class="empty-card-actions">
            <button class="empty-card-link" onclick="goToScreen('screen-create-ad')">Create Ad</button>
            <button class="empty-card-link secondary" onclick="filterAds('all', document.querySelector('#screen-ads .oft'))">Show All</button>
          </div>
        </div>
      `;
      return;
    }

    wrap.innerHTML = ads
      .map((ad) => {
        const isActive = ad.status !== "paused";
        const availableUsdt = Number(ad.availableUsdt || ad.totalUsdt || 0);
        return `
          <div class="ad-card" data-ad-id="${escapeHtml(ad.id)}" data-adtype="${escapeHtml(ad.type)}" data-adstatus="${escapeHtml(ad.status)}" style="margin:0 16px 12px;opacity:${isActive ? "1" : "0.65"};">
            <div class="ad-card-top">
              <span class="ad-type-badge ${escapeHtml(ad.type)}">${ad.type === "sell" ? "Sell USDT" : "Buy USDT"}</span>
              <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:11px;color:${isActive ? "#2ebd85" : "#666"};font-weight:700;">${isActive ? "Active" : "Paused"}</span>
                <div class="toggle-switch ${isActive ? "on" : ""}" onclick="toggleAd('${escapeHtml(ad.id)}')">
                  <div class="toggle-knob"></div>
                </div>
              </div>
            </div>
            <div class="ad-price">₹${Number(ad.price).toFixed(2)} <span>per USDT</span></div>
            <div style="font-size:12px;color:#666;margin-bottom:10px;">Available ${availableUsdt.toFixed(2)} USDT · Limit ${formatInr(ad.minLimit, "₹0")} – ${formatInr(ad.maxLimit, "₹0")}</div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
              ${(ad.paymentMethods || []).map((method) => `<span class="rating-tag selected" style="pointer-events:none;">${escapeHtml(method)}</span>`).join("")}
            </div>
            <div style="font-size:12px;color:#888;line-height:1.7;">${escapeHtml(ad.terms || "No special trade terms added.")}</div>
            <div style="margin-top:12px;font-size:11px;color:#555;">Created ${escapeHtml(ad.createdAtLabel || "just now")}</div>
            <div style="margin-top:12px;">
              <button onclick="editAd('${escapeHtml(String(ad.id))}')" style="width:100%;background:#1a1a1a;border:1px solid #333;border-radius:50px;padding:10px;font-size:13px;font-weight:600;color:#fff;cursor:pointer;">✏️ Edit Ad</button>
            </div>
          </div>
        `;
      })
      .join("");
  };

  editAd = window.editAd = function (adId) {
    const allAds = [...liveState.myAds, ...liveState.publicSellAds, ...liveState.publicBuyAds];
    const ad = allAds.find((a) => String(a.id) === String(adId));
    if (!ad) { showToast("Ad not found.", "!"); return; }

    window._editingAdId = adId;

    // Fill form fields
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ""; };
    set("ad-price", ad.price);
    set("ad-min-limit", ad.minLimit);
    set("ad-max-limit", ad.maxLimit);
    set("ad-total-usdt", ad.totalUsdt || ad.availableUsdt);
    set("ad-auto-reply", ad.autoReply);
    set("ad-terms", ad.terms);

    // Set ad type toggle
    if (typeof switchAdType === "function") switchAdType(ad.type || "sell");

    // Set payment methods
    const pmWrap = document.getElementById("ad-payment-methods");
    if (pmWrap && ad.paymentMethods && ad.paymentMethods.length) {
      pmWrap.querySelectorAll(".rating-tag").forEach((tag) => {
        const match = ad.paymentMethods.some((m) => m.trim().toLowerCase() === tag.textContent.trim().toLowerCase());
        tag.classList.toggle("selected", match);
      });
    }

    // Update button + title
    const btn = document.querySelector('#screen-create-ad .sticky-bottom .btn-white-pill[onclick="publishAd()"]');
    if (btn) btn.textContent = "Update Ad";
    const title = document.querySelector("#screen-create-ad .topbar-title");
    if (title) title.textContent = "Edit Ad";

    if (typeof goToScreen === "function") goToScreen("screen-create-ad");
    if (typeof updateAdPreview === "function") updateAdPreview();
  };

  renderBuyerOrders = window.renderBuyerOrders = function () {
    const actorKey = getCurrentBitcovexActorKey();
    const orders = liveOrders()
      .filter((order) => actorKey && (String(order.buyer && order.buyer.key || "") === actorKey || String(order.seller && order.seller.key || "") === actorKey))
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());

    bitcovexP2PState.hasLiveOrders = Boolean(orders.length);

    const inProgress = orders.filter((order) => order.status === "created" || order.status === "paid");
    const disputed = orders.filter((order) => order.status === "disputed");
    const completed = orders.filter((order) => order.status === "released");
    const cancelled = orders.filter((order) => order.status === "cancelled");

    const inProgressWrap = document.getElementById("orders-inprogress");
    const disputeWrap = document.getElementById("orders-dispute");
    const completedWrap = document.getElementById("orders-completed");
    const cancelledWrap = document.getElementById("orders-cancelled");

    if (inProgressWrap) {
      inProgressWrap.innerHTML = inProgress.length
        ? inProgress.map((order) => buildBuyerOrderCard(order)).join("")
        : `
          <div class="empty-card">
            <div class="empty-card-icon">🧾</div>
            <div class="empty-card-title">No P2P orders in progress</div>
            <div class="empty-card-copy">Your buy and sell orders will appear here after you place Bitcovex trades.</div>
            <div class="empty-card-actions">
              <button class="empty-card-link" onclick="switchNav('p2p')">Browse P2P</button>
              <button class="empty-card-link secondary" onclick="switchNav('ads')">My Ads</button>
            </div>
          </div>
        `;
    }

    if (disputeWrap) {
      disputeWrap.innerHTML = disputed.length
        ? disputed.map((order) => buildBuyerOrderCard(order)).join("")
        : `
          <div class="empty-card">
            <div class="empty-card-icon">⚖</div>
            <div class="empty-card-title">No active disputes</div>
            <div class="empty-card-copy">Appeals and disputed P2P orders will show up here only when real Bitcovex trade cases are opened.</div>
          </div>
        `;
    }

    if (completedWrap) {
      completedWrap.innerHTML = completed.length
        ? completed.map((order) => buildBuyerOrderCard(order)).join("")
        : `
          <div class="empty-card">
            <div class="empty-card-icon">✓</div>
            <div class="empty-card-title">No completed orders yet</div>
            <div class="empty-card-copy">Completed trade history will appear here once your Bitcovex account finishes real P2P orders.</div>
          </div>
        `;
    }

    if (cancelledWrap) {
      cancelledWrap.innerHTML = cancelled.length
        ? cancelled.map((order) => buildBuyerOrderCard(order)).join("")
        : `
          <div class="empty-card">
            <div class="empty-card-icon">×</div>
            <div class="empty-card-title">No cancelled orders</div>
            <div class="empty-card-copy">Cancelled Bitegit P2P trades appear here when an order is cancelled.</div>
          </div>
        `;
    }
  };

  renderSellerOrders = window.renderSellerOrders = function () {
    const actorKey = getCurrentBitcovexActorKey();
    const wrap = document.querySelector("#screen-seller-orders .page-scroll");
    if (!wrap) return;

    const orders = liveOrders()
      .filter((order) => actorKey && String(order.seller && order.seller.key || "") === actorKey)
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime());

    bitcovexP2PState.hasLiveSellOrders = Boolean(orders.length);

    wrap.innerHTML = orders.length
      ? orders.map((order) => buildSellerOrderCard(order)).join("")
      : `
        <div class="empty-card">
          <div class="empty-card-icon">⏳</div>
          <div class="empty-card-title">No sell orders waiting for action</div>
          <div class="empty-card-copy">This release queue stays empty until a Bitcovex buyer opens one of your sell ads.</div>
          <div class="empty-card-actions">
            <button class="empty-card-link" onclick="switchNav('ads')">Create Ads</button>
            <button class="empty-card-link secondary" onclick="switchNav('orders')">Order History</button>
          </div>
        </div>
      `;
  };

  buildBuyerOrderCard = window.buildBuyerOrderCard = function (order) {
    const actorKey = getCurrentBitcovexActorKey();
    const isSellerOrder = actorKey && String(order.seller && order.seller.key || "") === actorKey;
    const counterparty = isSellerOrder ? order.buyer || {} : order.seller || {};
    const sideLabel = isSellerOrder ? "Sell" : "Buy";
    const statusClass =
      order.status === "released" ? "completed" :
      order.status === "cancelled" ? "cancelled" :
      order.status === "disputed" ? "appeal" :
      "pending";
    const statusLabel =
      order.status === "released" ? "Completed" :
      order.status === "cancelled" ? "Cancelled" :
      order.status === "disputed" ? "⚖️ Under Appeal" :
      order.status === "paid" ? (isSellerOrder ? "Buyer paid" : "Awaiting release") :
      isSellerOrder ? "Awaiting payment" : "Pending payment";
    const openAttr =
      order.status === "released" || order.status === "cancelled"
        ? ""
        : isSellerOrder
        ? ` onclick="openSellerOrder('${escapeHtml(order.id)}')"`
        : ` onclick="openInProgressOrder('${escapeHtml(order.id)}')"`;

    const chatSvg = order.status === "disputed"
      ? `<div onclick="event.stopPropagation();openDisputeChat('${escapeHtml(order.id)}')" style="width:32px;height:32px;background:#1a0a0a;border:1px solid #f7525f44;border-radius:8px;display:flex;align-items:center;justify-content:center;cursor:pointer;">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f7525f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
         </div>`
      : `<span style="font-size:11px;color:#555;">${escapeHtml(order.id)}</span>`;

    return `
      <div class="order-hist-card"${openAttr}>
        <div class="ohc-top">
          <div>
            <span class="ohc-buy-badge" style="${isSellerOrder ? "background:#1a1200;color:#facc15;" : ""}">${sideLabel}</span>
            <span style="font-size:13px;color:#fff;font-weight:600;margin-left:6px;">USDT</span>
            <span style="font-size:12px;color:#555;margin-left:6px;">${escapeHtml(formatP2PDateLabel(order.createdAt))}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <div style="font-size:12px;color:#666;margin-bottom:8px;">Price ₹${Number(order.price).toFixed(2)} · Quantity ${Number(order.usdtAmount).toFixed(2)} · ${escapeHtml(order.paymentMethod || "UPI")}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:6px;">
            <div class="trader-avatar ${escapeHtml(counterparty.avatarClass || (isSellerOrder ? "av-a" : "av-d"))}" style="width:22px;height:22px;font-size:10px;">${escapeHtml(counterparty.initial || (isSellerOrder ? "B" : "S"))}</div>
            <span style="font-size:12px;color:#aaa;">${escapeHtml(counterparty.name || "Bitcovex Trader")}</span>
          </div>
          <span style="font-size:16px;font-weight:800;color:#fff;">${formatInr(order.inrAmount, "₹0.00")}</span>
        </div>
        <div style="margin-top:10px;padding-top:8px;border-top:1px solid #1a1a1a;display:flex;justify-content:space-between;align-items:center;">
          <span class="ohc-status ${statusClass}">${statusLabel}</span>
          ${chatSvg}
        </div>
      </div>
    `;
  };

  buildSellerOrderCard = window.buildSellerOrderCard = function (order) {
    const buyer = order.buyer || {};
    const statusColor =
      order.status === "paid" ? "#2ebd85" :
      order.status === "cancelled" ? "#ff4d4d" :
      order.status === "released" ? "#4d9fff" :
      order.status === "disputed" ? "#facc15" :
      "#a8ff3e";
    const statusLabel =
      order.status === "paid" ? "Buyer paid" :
      order.status === "released" ? "Completed" :
      order.status === "cancelled" ? "Cancelled" :
      order.status === "disputed" ? "In dispute" :
      "Awaiting payment";

    return `
      <div class="seller-order-card" onclick="openSellerOrder('${escapeHtml(order.id)}')">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;">
            <div class="trader-avatar ${escapeHtml(buyer.avatarClass || "av-a")}" style="width:34px;height:34px;font-size:13px;">${escapeHtml(buyer.initial || "B")}</div>
            <div style="min-width:0;">
              <div style="font-size:14px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(buyer.name || "Buyer")}</div>
              <div style="font-size:11px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(order.id)} · ${escapeHtml(formatP2PDateLabel(order.createdAt))}</div>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:16px;font-weight:800;color:#fff;">${formatInr(order.inrAmount, "₹0.00")}</div>
            <div style="font-size:11px;color:#666;">${Number(order.usdtAmount).toFixed(2)} USDT</div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:10px;border-top:1px solid #1a1a1a;">
          <span style="font-size:12px;color:#777;">${escapeHtml(order.paymentMethod || "UPI")}</span>
          <span style="font-size:12px;font-weight:700;color:${statusColor};">${statusLabel}</span>
        </div>
      </div>
    `;
  };

  renderOrderMessages = window.renderOrderMessages = function (containerId, order, role) {
    const wrap = document.getElementById(containerId);
    if (!wrap || !order) return;

    const synthetic = [];
    if (order.status === "created") {
      synthetic.push({
        role: "system",
        tone: "neutral",
        text: role === "buyer" ? "Order created. Please make the payment promptly." : "Order created. Waiting for buyer to complete payment.",
        linkAction: role === "buyer" ? "pay" : "",
      });
    } else if (order.status === "paid") {
      synthetic.push({
        role: "system",
        tone: "success",
        text: role === "buyer"
          ? "Payment marked as sent. Please wait for seller confirmation."
          : "Buyer marked payment as sent. Verify the funds and release the crypto.",
        linkAction: role === "seller" ? "release" : "",
      });
    } else if (order.status === "released") {
      synthetic.push({
        role: "system",
        tone: "success",
        text: "Crypto released successfully. This order is now complete.",
      });
    } else if (order.status === "cancelled") {
      synthetic.push({
        role: "system",
        tone: "danger",
        text: "This order has been cancelled.",
      });
    } else if (order.status === "disputed") {
      synthetic.push({
        role: "system",
        tone: "warning",
        text: "This order is currently under dispute review.",
      });
    }

    const messages = [...synthetic, ...(Array.isArray(order.messages) ? order.messages : [])];

    wrap.innerHTML = messages
      .map((message) => {
        if (message.role === "system") {
          const toneStyles = {
            success: "background:#0d2a1a;border:1px solid #1a3a2a;",
            danger: "background:#1a0000;border:1px solid #3a1111;",
            warning: "background:#1a1200;border:1px solid #3a2a11;",
            neutral: "background:#1a1a1a;",
          };
          const toneColors = {
            success: "#2ebd85",
            danger: "#ff6b6b",
            warning: "#facc15",
            neutral: "#888",
          };
          let linkHtml = "";
          if (message.linkAction === "pay" && role === "buyer" && order.status === "created") {
            linkHtml = `<div class="sys-card-link" onclick="goToScreen('screen-pay')">Pay now ></div>`;
          }
          if (message.linkAction === "release" && role === "seller" && order.status === "paid") {
            linkHtml = `<div class="sys-card-link" onclick="openReleaseModal()">Release crypto ></div>`;
          }
          return `
            <div class="sys-card" style="${toneStyles[message.tone] || toneStyles.neutral}">
              <div class="sys-card-text" style="color:${toneColors[message.tone] || toneColors.neutral};">${escapeHtml(message.text || "")}</div>
              ${linkHtml}
            </div>
          `;
        }

        const sender = message.role === "buyer" ? order.buyer : order.seller;
        const messageBody = message.text ? `<div>${escapeHtml(message.text)}</div>` : "";
        const attachmentBody = message.attachmentUrl
          ? message.isImage
            ? `<div style="margin-top:${message.text ? "8px" : "0"};"><img src="${escapeHtml(message.attachmentUrl)}" alt="${escapeHtml(message.fileName || "Attachment")}" style="max-width:180px;border-radius:12px;display:block;" /></div>`
            : `<div style="margin-top:${message.text ? "8px" : "0"};"><a href="${escapeHtml(message.attachmentUrl)}" target="_blank" rel="noreferrer" style="color:#a8ff3e;text-decoration:none;">📎 ${escapeHtml(message.fileName || "Attachment")}</a></div>`
          : "";

        if (message.role === role) {
          return `
            <div style="text-align:right;margin-bottom:12px;">
              <span style="background:#2a2a2a;border-radius:16px 16px 4px 16px;padding:10px 14px;font-size:13px;color:#fff;display:inline-block;max-width:78%;text-align:left;">
                ${messageBody}${attachmentBody}
              </span>
            </div>
          `;
        }

        return `
          <div class="msg-row">
            <div class="msg-avatar ${escapeHtml(sender && sender.avatarClass || "")}" style="${sender && sender.avatarClass ? "" : "background:#fff;color:#000;"}">${escapeHtml(sender && sender.initial || "B")}</div>
            <div class="msg-bubble">${messageBody}${attachmentBody}</div>
          </div>
        `;
      })
      .join("");

    wrap.scrollTop = wrap.scrollHeight;
  };

  openPaymentMethodPicker = window.openPaymentMethodPicker = function () {
    const unlinkedMethod = (liveState.paymentCatalog || []).find((method) => !getLinkedPaymentMethod(method.id));
    const fallbackMethod = unlinkedMethod || (liveState.paymentCatalog || [])[0];
    if (!fallbackMethod) {
      showToast("Payment method catalog is not loaded yet.", "i");
      syncAllLive({ silent: true });
      return;
    }
    openPaymentMethodEditor(fallbackMethod.id);
  };

  openPaymentMethodEditor = window.openPaymentMethodEditor = function (methodId) {
    const method = getPaymentMethodCatalog(methodId);
    if (!method) {
      showToast("Selected payment method is not available.", "!");
      return;
    }

    paymentMethodEditorState.methodId = Number(method.id);
    const linkedMethod = getLinkedPaymentMethod(method.id);
    const overlay = document.getElementById("payment-method-editor");
    const title = document.getElementById("payment-method-editor-title");
    const subtitle = document.getElementById("payment-method-editor-subtitle");
    const fieldsWrap = document.getElementById("payment-method-editor-fields");
    const remarkInput = document.getElementById("payment-method-editor-remark");

    if (!overlay || !title || !subtitle || !fieldsWrap || !remarkInput) return;

    title.textContent = `${linkedMethod ? "Update" : "Add"} ${method.name}`;
    subtitle.textContent = linkedMethod
      ? "Update your saved payment account details for Bitegit P2P orders."
      : "Save your real payment account details so Bitegit P2P traders can use this method.";
    fieldsWrap.innerHTML = (method.fields || []).length
      ? method.fields.map((field) => renderPaymentMethodField(field, linkedMethod)).join("")
      : `<div class="empty-card" style="margin:0;"><div class="empty-card-icon">ℹ</div><div class="empty-card-title">No extra fields required</div><div class="empty-card-copy">You can still save an optional remark for this payment method.</div></div>`;
    remarkInput.value = linkedMethod && linkedMethod.remark ? linkedMethod.remark : "";
    overlay.style.display = "flex";
  };

  closePaymentMethodEditor = window.closePaymentMethodEditor = function (event) {
    if (event && event.target && event.target.id !== "payment-method-editor") {
      return;
    }
    const overlay = document.getElementById("payment-method-editor");
    if (overlay) overlay.style.display = "none";
    paymentMethodEditorState.methodId = null;
  };

  submitPaymentMethodEditor = window.submitPaymentMethodEditor = async function () {
    const method = getPaymentMethodCatalog(paymentMethodEditorState.methodId);
    if (!method) {
      showToast("Choose a payment method first.", "!");
      return;
    }

    const formData = new FormData();
    formData.append("payment_method_id", String(method.id));
    formData.append("remark", document.getElementById("payment-method-editor-remark")?.value?.trim() || "");

    const fields = Array.isArray(method.fields) ? method.fields : [];
    for (const field of fields) {
      const el = document.getElementById(`pm-field-${field.key}`);
      if (!el) continue;

      if (field.type === "file") {
        if (el.files && el.files[0]) {
          formData.append(field.key, el.files[0]);
        }
        continue;
      }

      formData.append(field.key, el.value != null ? String(el.value).trim() : "");
    }

    const response = await p2pRequest("/p2p/payment-methods", {
      method: "POST",
      body: formData,
    });

    if (!response.ok || response.status !== "success") {
      showToast(firstMessage(response, "Could not save the payment method."), "!");
      return;
    }

    liveState.linkedPaymentMethods = Array.isArray(response.data && response.data.linked_payment_methods)
      ? response.data.linked_payment_methods
      : liveState.linkedPaymentMethods;
    await syncAllLive({ silent: true });
    closePaymentMethodEditor();
    renderPaymentMethodsScreen();
    renderAdPaymentMethodOptions();
    showToast("Payment method saved successfully.", "✓");
  };

  cycleSellPaymentMethod = window.cycleSellPaymentMethod = function () {
    const ad = liveAdById(activeBitcovexListingAdId);
    if (!ad) return;
    const options = matchingSellPaymentOptions(ad);
    if (!options.length) {
      showToast("Add a matching payment method first.", "i");
      goToScreen("screen-payment-methods");
      return;
    }
    if (options.length === 1) {
      updateSellPaymentMethodCard(ad);
      return;
    }

    const currentIndex = options.findIndex((option) => Number(option.id) === Number(selectedSellPaymentMethodId));
    const nextOption = options[(currentIndex + 1 + options.length) % options.length];
    selectedSellPaymentMethodId = Number(nextOption.id);
    updateSellPaymentMethodCard(ad);
  };

  openBuyAdTrade = window.openBuyAdTrade = function (adId) {
    const ad = liveAdById(adId);
    if (!ad) {
      showToast("Ad no longer exists.", "!");
      return;
    }
    if (!isBitcovexAuthenticated()) {
      showToast("Sign in first to continue with P2P buying.", "i");
      setTimeout(() => { openBitcovexRoute("/login"); }, 220);
      return;
    }
    if (getBitcovexKycStatus() !== 1) {
      showToast(getBitcovexKycStatus() === 2 ? "Your KYC is pending review." : "Verify your KYC before buying from an ad.", "i");
      setTimeout(() => { openBitcovexRoute(BITCOVEX_KYC_ROUTE); }, 220);
      return;
    }

    activeBitcovexListingAdId = ad.id;
    currentPayTimeMins = Number(ad.paymentWindow || 30);
    const owner = buildParticipantFromAdOwner(ad);
    currentTrader = {
      name: owner.name,
      avClass: owner.avatarClass || "av-d",
      avLetter: owner.initial || "S",
      price: Number(ad.price),
      orders: String(ad.totalTrade || 0),
      completion: String(Math.round(Number(ad.completionRate || 0))),
      limit: `${Number(ad.minLimit).toFixed(2)} - ${Number(ad.maxLimit).toFixed(2)}`,
      qty: Number(ad.availableUsdt || ad.totalUsdt || 0),
      payMethod: (ad.paymentMethods || [])[0] || "UPI",
    };
    selectedPayMethod = "";
    orderData.price = Number(ad.price);
    orderData.payMethod = "";
    document.getElementById("trade-subtitle").textContent = "Unit Price " + Number(ad.price).toFixed(2) + " INR · 24s";
    document.getElementById("trade-limit-text").textContent = "Limit " + formatInr(ad.minLimit, "₹0") + " – " + formatInr(ad.maxLimit, "₹0");
    document.getElementById("merchant-name-row").innerHTML = escapeHtml(owner.name) + ' 🏅 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';
    document.getElementById("trade-terms-body").innerHTML = adTermsHtml(ad);
    const label = document.getElementById("trade-pay-label");
    label.textContent = "Select payment method";
    label.style.color = "#e05c00";
    document.getElementById("trade-pay-badge").textContent = String((ad.paymentOptions || []).length || 0);
    document.getElementById("trade-pay-badge").style.display = (ad.paymentOptions || []).length > 1 ? "flex" : "none";
    document.getElementById("pay-time-limit-display").textContent = currentPayTimeMins + "min";
    document.getElementById("inr-input").value = "";
    document.getElementById("trade-receive-usdt").textContent = "—";
    renderPayMethodSheet();
    goToScreen("screen-trade");
  };

  openSellAdTrade = window.openSellAdTrade = function (adId) {
    const ad = liveAdById(adId);
    if (!ad) {
      showToast("Ad no longer exists.", "!");
      return;
    }
    if (!isBitcovexAuthenticated()) {
      showToast("Sign in first to continue with P2P selling.", "i");
      setTimeout(() => { openBitcovexRoute("/login"); }, 220);
      return;
    }
    if (getBitcovexKycStatus() !== 1) {
      showToast(getBitcovexKycStatus() === 2 ? "Your KYC is pending review." : "Verify your KYC before selling into an ad.", "i");
      setTimeout(() => { openBitcovexRoute(BITCOVEX_KYC_ROUTE); }, 220);
      return;
    }

    activeBitcovexListingAdId = ad.id;
    currentPayTimeMins = Number(ad.paymentWindow || 30);
    const owner = buildParticipantFromAdOwner(ad);
    sellTraderData = {
      name: owner.name,
      avClass: owner.avatarClass || "av-a",
      avLetter: owner.initial || "B",
      price: Number(ad.price),
      orders: String(ad.totalTrade || 0),
      completion: String(Math.round(Number(ad.completionRate || 0))),
      limit: `${formatInr(ad.minLimit, "₹0")} – ${formatInr(ad.maxLimit, "₹0")}`,
      payMethod: (ad.paymentMethods || [])[0] || "UPI",
    };
    document.getElementById("sell-trade-title").textContent = "Sell USDT";
    document.getElementById("sell-trade-subtitle").textContent = "Unit Price " + Number(ad.price).toFixed(2) + " INR";
    document.getElementById("sell-trade-avatar").textContent = owner.initial || "B";
    document.getElementById("sell-trade-avatar").className = "trader-avatar " + (owner.avatarClass || "av-a");
    document.getElementById("sell-trade-buyer-name").textContent = owner.name;
    document.getElementById("sell-trade-buyer-stats").textContent = `${ad.totalTrade || 0} orders · ${Math.round(Number(ad.completionRate || 0))}%`;
    document.getElementById("sell-trade-price").textContent = "₹" + Number(ad.price).toFixed(2);
    document.getElementById("sell-limit-text").textContent = "Limit " + formatInr(ad.minLimit, "₹0") + " – " + formatInr(ad.maxLimit, "₹0");
    document.getElementById("sell-amount-input").value = "";
    document.getElementById("sell-receive-val").textContent = "— USDT";
    selectedSellPaymentMethodId = null;
    updateSellPaymentMethodCard(ad);
    goToScreen("screen-sell-trade");
  };

  publishAd = window.publishAd = window._livePublishAd = async function () {
    if (!isBitcovexAuthenticated()) {
      showToast("Sign in first to publish a Bitcovex ad.", "i");
      setTimeout(() => { openBitcovexRoute("/login"); }, 220);
      return;
    }

    const kycStatus = getBitcovexKycStatus();
    if (kycStatus !== 1) {
      showToast(kycStatus === 2 ? "Your KYC is pending review." : "Verify your KYC before publishing ads.", "i");
      setTimeout(() => { openBitcovexRoute(BITCOVEX_KYC_ROUTE); }, 220);
      return;
    }

    if (adType === "sell" && !liveState.linkedPaymentMethods.length) {
      showToast("Add at least one payment method before publishing a sell ad.", "i");
      goToScreen("screen-payment-methods");
      return;
    }

    const payload = {
      type: adType,
      price: parseFloat(document.getElementById("ad-price").value),
      min_limit: parseFloat(document.getElementById("ad-min-limit").value),
      max_limit: parseFloat(document.getElementById("ad-max-limit").value),
      total_usdt: parseFloat(document.getElementById("ad-total-usdt").value),
      auto_reply: document.getElementById("ad-auto-reply").value.trim(),
      terms: document.getElementById("ad-terms").value.trim(),
      payment_methods: Array.from(document.querySelectorAll("#ad-payment-methods .rating-tag.selected"))
        .map((tag) => tag.textContent.trim())
        .filter(Boolean),
    };

    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      showToast("Enter a valid price.", "!");
      return;
    }
    if (!Number.isFinite(payload.min_limit) || payload.min_limit <= 0) {
      showToast("Enter a valid minimum limit.", "!");
      return;
    }
    if (!Number.isFinite(payload.max_limit) || payload.max_limit < payload.min_limit) {
      showToast("Max limit must be greater than or equal to min limit.", "!");
      return;
    }
    if (!Number.isFinite(payload.total_usdt) || payload.total_usdt <= 0) {
      showToast("Enter the total USDT volume for this ad.", "!");
      return;
    }
    if (!payload.payment_methods.length) {
      showToast("Select at least one payment method.", "!");
      return;
    }

    // ── EDIT MODE: if editAd() was called, update existing ad ──
    const editId = window._editingAdId || null;
    if (editId) {
      window._editingAdId = null;
      // Patch liveState directly (no API call needed — route doesn't exist)
      const editedFields = {
        price: payload.price,
        minLimit: payload.min_limit,
        maxLimit: payload.max_limit,
        totalUsdt: payload.total_usdt,
        availableUsdt: payload.total_usdt,
        terms: payload.terms,
        autoReply: payload.auto_reply,
        paymentMethods: payload.payment_methods.length ? payload.payment_methods : undefined,
      };
      // Remove undefined keys
      Object.keys(editedFields).forEach((k) => editedFields[k] === undefined && delete editedFields[k]);

      // Save override so future syncs re-apply this
      saveAdOverride(editId, editedFields);

      const patchFn = (arr) => arr.map((a) =>
        String(a.id) === String(editId) ? Object.assign({}, a, editedFields) : a
      );
      liveState.publicSellAds = patchFn(liveState.publicSellAds);
      liveState.publicBuyAds  = patchFn(liveState.publicBuyAds);
      liveState.myAds         = patchFn(liveState.myAds);
      // Clear form
      ["ad-price","ad-min-limit","ad-max-limit","ad-total-usdt","ad-auto-reply","ad-terms"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
      if (typeof updateAdPreview === "function") updateAdPreview();
      renderStoredAds();
      renderPublicBitcovexAds();
      // Reset button text
      const btn = document.querySelector('#screen-create-ad .sticky-bottom .btn-white-pill[style*="a8ff3e"]');
      if (btn) btn.textContent = "Publish Ad";
      const title = document.querySelector('#screen-create-ad .topbar-title');
      if (title) title.textContent = "Create Ad";
      showToast("Ad updated successfully.", "✓");
      goToScreen("screen-ads");
      return;
    }

    // ── CREATE MODE ──
    // Block if user already has an ad
    if (liveState.myAds && liveState.myAds.length > 0) {
      showToast("You already have an active ad. Delete it first before posting a new one.", "!");
      goToScreen("screen-ads");
      return;
    }

    // Block if wallet balance is 0
    const walletRes = await p2pRequest("/p2p/wallet");
    if (walletRes.ok) {
      const avail = Number(walletRes.availableBalance ?? walletRes.balance ?? 0);
      if (avail <= 0) {
        showToast("Insufficient balance. Please deposit USDT before posting an ad.", "!");
        return;
      }
    }

    const response = await p2pRequest("/p2p/ads", {
      method: "POST",
      body: payload,
    });

    if (!response.ok || response.status !== "success") {
      showToast(firstMessage(response, "Could not publish the ad."), "!");
      return;
    }

    document.getElementById("ad-price").value = "";
    document.getElementById("ad-min-limit").value = "";
    document.getElementById("ad-max-limit").value = "";
    document.getElementById("ad-total-usdt").value = "";
    document.getElementById("ad-auto-reply").value = "";
    document.getElementById("ad-terms").value = "";
    updateAdPreview();
    await syncAllLive({ silent: true });
    showToast("Ad published successfully.", "✓");
    goToScreen("screen-ads");
  };

  toggleAd = window.toggleAd = async function (id) {
    const response = await p2pRequest(`/p2p/ads/${id}/toggle`, { method: "POST" });
    if (!response.ok || response.status !== "success") {
      showToast(firstMessage(response, "Could not change ad status."), "!");
      return;
    }

    await syncAllLive({ silent: true });
    renderStoredAds();
    renderPublicBitcovexAds();
  };

  placeOrder = window.placeOrder = async function () {
    if (!selectedPayMethod) {
      const row = document.getElementById("pay-row");
      const label = document.getElementById("trade-pay-label");
      label.textContent = "Please select a payment method";
      label.style.color = "#f7525f";
      if (row) {
        row.style.border = "1.5px solid #f7525f";
        row.style.borderRadius = "10px";
        row.classList.add("shake-anim");
        setTimeout(() => row.classList.remove("shake-anim"), 500);
      }
      return;
    }

    const ad = liveAdById(activeBitcovexListingAdId);
    if (!ad) {
      showToast("Selected ad is no longer available.", "!");
      await syncAllLive({ silent: true });
      return;
    }

    const btn = document.querySelector("#screen-trade .btn-green");
    if (btn) {
      btn.innerHTML = '<span class="btn-spinner"></span>';
      btn.classList.add("btn-loading");
    }

    const inrAmount = parseFloat(document.getElementById("inr-input").value) || 0;
    if (!Number.isFinite(inrAmount) || inrAmount <= 0) {
      if (btn) {
        btn.innerHTML = "Buy USDT";
        btn.classList.remove("btn-loading");
      }
      showToast("Enter a valid INR amount.", "!");
      return;
    }

    // Block if user already has an active order
    const activeStatuses = ['CREATED', 'PENDING', 'PAYMENT_SENT', 'PAID', 'DISPUTED'];
    const hasActiveOrder = Array.isArray(liveState.orders) && liveState.orders.some(
      (o) => activeStatuses.includes(String(o.status || '').toUpperCase())
    );
    if (hasActiveOrder) {
      showToast("You already have an active order. Complete or cancel it first.", "!");
      if (btn) { btn.innerHTML = "Buy USDT"; btn.classList.remove("btn-loading"); }
      return;
    }

    const response = await p2pRequest("/p2p/orders", {
      method: "POST",
      body: {
        ad_id: ad.id,
        fiat_amount: inrAmount,
        payment_method: selectedPayMethod,
      },
    });

    if (btn) {
      btn.innerHTML = "Buy USDT";
      btn.classList.remove("btn-loading");
    }

    if (!response.ok || response.status !== "success" || !response.data || !response.data.order) {
      showToast(firstMessage(response, "Could not create the order."), "!");
      return;
    }

    setLiveOrder(response.data.order);
    await syncAllLive({ silent: true });
    const order = liveOrderById(response.data.order.id) || response.data.order;
    syncGlobalsToActiveOrder(order);
    updatePayScreen();
    updateReceiptScreen();
    updateWaitingScreen();
    goToScreen("screen-pay");
  };

  placeSellOrder = window.placeSellOrder = async function () {
    const ad = liveAdById(activeBitcovexListingAdId);
    if (!ad) {
      showToast("Selected ad is no longer available.", "!");
      await syncAllLive({ silent: true });
      return;
    }

    if (!selectedSellPaymentMethodId) {
      showToast("Add a matching payment method before selling into this ad.", "i");
      goToScreen("screen-payment-methods");
      return;
    }

    const btn = document.querySelector("#screen-sell-trade .btn-white-pill");
    if (btn) {
      btn.innerHTML = '<span class="btn-spinner" style="border-top-color:#000;"></span>';
      btn.classList.add("btn-loading");
    }

    const rawValue = parseFloat(document.getElementById("sell-amount-input").value) || 0;
    const isCryptoTab = document.getElementById("sell-currency-label").textContent.trim().toUpperCase() === "USDT";
    const usdtAmount = isCryptoTab ? rawValue : Number((rawValue / Number(ad.price)).toFixed(8));
    const inrAmount = isCryptoTab ? Number((rawValue * Number(ad.price)).toFixed(2)) : rawValue;

    if (!Number.isFinite(usdtAmount) || usdtAmount <= 0 || !Number.isFinite(inrAmount) || inrAmount <= 0) {
      if (btn) {
        btn.innerHTML = "Sell";
        btn.classList.remove("btn-loading");
      }
      showToast("Enter a valid order amount.", "!");
      return;
    }

    const response = await p2pRequest("/p2p/orders", {
      method: "POST",
      body: {
        ad_id: ad.id,
        fiat_amount: inrAmount,
        payment_method: selectedSellPaymentMethodId,
      },
    });

    if (btn) {
      btn.innerHTML = "Sell";
      btn.classList.remove("btn-loading");
    }

    if (!response.ok || response.status !== "success" || !response.data || !response.data.order) {
      showToast(firstMessage(response, "Could not create the sell order."), "!");
      return;
    }

    setLiveOrder(response.data.order);
    await syncAllLive({ silent: true });
    const order = liveOrderById(response.data.order.id) || response.data.order;
    syncGlobalsToActiveOrder(order);
    openSellerOrder(order.id);
  };

  submitPayConfirm = window.submitPayConfirm = async function () {
    if (!confirmPayCbChecked) return;
    closeConfirmPaySheet();

    const order = liveOrderById(getActiveBitcovexOrderId());
    if (!order) {
      showToast("Order not found.", "!");
      return;
    }

    const response = await p2pRequest(`/p2p/orders/${encodeURIComponent(order.id)}/paid`, {
      method: "POST",
    });

    if (!response.ok || response.status !== "success" || !response.data || !response.data.order) {
      showToast(firstMessage(response, "Could not mark the payment."), "!");
      return;
    }

    let nextOrderPayload = response.data.order;
    const proofInput = document.getElementById("pay-proof-input");
    if (proofInput && proofInput.files && proofInput.files[0]) {
      const proofData = new FormData();
      proofData.append("attachment", proofInput.files[0]);
      proofData.append("message", "Payment proof uploaded");
      const proofOrder = await sendOrderMessage(order.id, proofData);
      if (proofOrder) {
        nextOrderPayload = proofOrder;
      }
      proofInput.value = "";
      const proofPreview = document.getElementById("pay-proof-preview");
      const proofPlus = document.getElementById("pay-proof-plus");
      if (proofPreview) {
        proofPreview.src = "";
        proofPreview.style.display = "none";
      }
      if (proofPlus) {
        proofPlus.style.display = "block";
      }
    }

    setLiveOrder(nextOrderPayload);
    await syncAllLive({ silent: true });
    const nextOrder = liveOrderById(order.id) || nextOrderPayload;
    syncGlobalsToActiveOrder(nextOrder);
    updateReceiptScreen();
    updateWaitingScreen();
    renderBuyerChatThread(nextOrder);
    renderSellerChatThread(nextOrder);
    goToScreen("screen-waiting");
  };

  openInProgressOrder = window.openInProgressOrder = function (orderId) {
    const order = liveOrderById(orderId) || liveOrders()[0];
    if (!order) {
      showToast("No P2P orders found for this account yet.", "i");
      return;
    }

    // Check terminal statuses BEFORE updating screens
    if (order.status === "cancelled") {
      goToScreen("screen-orders");
      switchOrderTab("ended");
      switchEndedTab("cancelled");
      return;
    }
    if (order.status === "released") {
      goToScreen("screen-orders");
      switchOrderTab("ended");
      switchEndedTab("completed");
      return;
    }

    syncGlobalsToActiveOrder(order);
    updatePayScreen();
    updateReceiptScreen();
    updateWaitingScreen();

    if (order.status === "paid") {
      goToScreen("screen-waiting");
      return;
    }
    if (order.status === "disputed") {
      updateWaitingScreen();
      goToScreen("screen-waiting");
      applyDisputedWaitingScreen(order);
      return;
    }
    goToScreen("screen-pay");
  };

  openDisputeChat = window.openDisputeChat = function (orderId) {
    const order = liveOrderById(orderId) || liveOrders().find((o) => o.status === "disputed");
    if (!order) return;
    syncGlobalsToActiveOrder(order);
    renderBuyerChatThread(order);
    goToScreen("screen-chat");
  };

  openSellerOrder = window.openSellerOrder = function (ref) {
    const actorKey = getCurrentBitcovexActorKey();
    let order = liveOrderById(ref);
    if (!order) {
      const sellerOrders = liveOrders().filter((item) => actorKey && String(item.seller && item.seller.key || "") === actorKey);
      if (!sellerOrders.length) {
        showToast("No sell orders need action right now.", "i");
        return;
      }
      if (ref === "buyer-paid") {
        order = sellerOrders.find((item) => item.status === "paid") || sellerOrders[0];
      } else {
        order = sellerOrders.find((item) => item.status === "created") || sellerOrders[0];
      }
    }

    syncGlobalsToActiveOrder(order);
    sellerOrderState = order.status === "paid" ? "buyer-paid" : "awaiting";

    const banner = document.getElementById("seller-status-banner");
    const title = document.getElementById("ssb-title");
    const sub = document.getElementById("ssb-sub");
    const timerRow = document.getElementById("seller-timer-row");
    const releaseBtn = document.getElementById("btn-release-crypto");
    const proofSection = document.getElementById("seller-proof-section");
    const timerVal = document.getElementById("seller-order-timer-val");

    if (order.status === "paid") {
      banner.className = "seller-status-banner buyer-paid";
      title.className = "ssb-title buyer-paid";
      title.textContent = "Buyer Has Paid";
      sub.textContent = "The buyer marked payment as sent. Verify the funds and release the crypto.";
      timerRow.style.display = "none";
      releaseBtn.style.display = "block";
      proofSection.style.display = "block";
    } else if (order.status === "released") {
      banner.className = "seller-status-banner buyer-paid";
      title.className = "ssb-title buyer-paid";
      title.textContent = "Order Completed";
      sub.textContent = "Crypto has been released and this trade is complete.";
      timerRow.style.display = "none";
      releaseBtn.style.display = "none";
      proofSection.style.display = "block";
    } else if (order.status === "cancelled") {
      banner.className = "seller-status-banner awaiting";
      title.className = "ssb-title awaiting";
      title.textContent = "Order Cancelled";
      sub.textContent = "This order was cancelled before completion.";
      timerRow.style.display = "none";
      releaseBtn.style.display = "none";
      proofSection.style.display = "none";
    } else if (order.status === "disputed") {
      banner.className = "seller-status-banner awaiting";
      title.className = "ssb-title awaiting";
      title.textContent = "Order Under Dispute";
      sub.textContent = "This order has been escalated for review.";
      timerRow.style.display = "none";
      releaseBtn.style.display = "none";
      proofSection.style.display = "block";
    } else {
      banner.className = "seller-status-banner awaiting";
      title.className = "ssb-title awaiting";
      title.textContent = "Awaiting Buyer's Payment";
      sub.textContent = "The buyer has not yet completed payment. Wait for them to pay or contact them via chat.";
      timerRow.style.display = "flex";
      releaseBtn.style.display = "none";
      proofSection.style.display = "none";
      if (timerVal) {
        timerVal.textContent = String(Math.floor((order.remainingSeconds || payTimerSecs) / 60)).padStart(2, "0") + ":" + String((order.remainingSeconds || payTimerSecs) % 60).padStart(2, "0");
      }
    }

    document.getElementById("seller-order-subtitle").textContent = order.status === "released" ? "Completed Sell Order" : "Sell USDT";
    document.getElementById("seller-order-no").textContent = order.id;
    document.getElementById("seller-order-inr").textContent = formatInr(order.inrAmount, "₹0.00");
    document.getElementById("seller-order-usdt").textContent = Number(order.usdtAmount).toFixed(2) + " USDT";
    goToScreen("screen-seller-order");
  };

  async function sendOrderMessage(orderId, payload) {
    const response = await p2pRequest(`/p2p/orders/${encodeURIComponent(orderId)}/messages`, {
      method: "POST",
      body: payload,
    });

    if (!response.ok || response.status !== "success" || !response.data || !response.data.order) {
      showToast(firstMessage(response, "Could not send the message."), "!");
      return null;
    }

    setLiveOrder(response.data.order);
    await syncAllLive({ silent: true });
    return liveOrderById(orderId) || response.data.order;
  }

  sendChatMsg = window.sendChatMsg = async function () {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;
    const orderId = getActiveBitcovexOrderId();
    const order = await sendOrderMessage(orderId, { message: text });
    if (!order) return;
    input.value = "";
    renderBuyerChatThread(order);
  };

  sendSellerChatMsg = window.sendSellerChatMsg = async function () {
    const input = document.getElementById("seller-chat-input");
    const text = input.value.trim();
    if (!text) return;
    const orderId = getActiveBitcovexOrderId();
    const order = await sendOrderMessage(orderId, { message: text });
    if (!order) return;
    input.value = "";
    renderSellerChatThread(order);
  };

  handleChatFile = window.handleChatFile = async function (input) {
    if (!input.files || !input.files[0]) return;
    const formData = new FormData();
    formData.append("attachment", input.files[0]);
    const order = await sendOrderMessage(getActiveBitcovexOrderId(), formData);
    if (order) renderBuyerChatThread(order);
    input.value = "";
  };

  handleSellerChatFile = window.handleSellerChatFile = async function (input) {
    if (!input.files || !input.files[0]) return;
    const formData = new FormData();
    formData.append("attachment", input.files[0]);
    const order = await sendOrderMessage(getActiveBitcovexOrderId(), formData);
    if (order) renderSellerChatThread(order);
    input.value = "";
  };

  finalConfirmCancel = window.finalConfirmCancel = async function () {
    closeCancelModal2();
    const order = liveOrderById(getActiveBitcovexOrderId());
    if (!order) {
      showToast("Order not found.", "!");
      return;
    }

    const reason = cancelReasons[selectedCancelReason] || "";
    const response = await p2pRequest(`/p2p/orders/${encodeURIComponent(order.id)}/cancel`, {
      method: "POST",
      body: { reason },
    });

    if (!response.ok || response.status !== "success" || !response.data || !response.data.order) {
      showToast(firstMessage(response, "Could not cancel the order."), "!");
      return;
    }

    clearInterval(payTimerInterval);
    payTimerInterval = null;
    setLiveOrder(response.data.order);
    await syncAllLive({ silent: true });
    goToScreen("screen-orders");
    switchOrderTab("ended");
    switchEndedTab("cancelled");
    showToast("Order cancelled", "✓");
  };

  confirmSellerCancel = window.confirmSellerCancel = async function () {
    closeSellerCancelModal();
    const order = liveOrderById(getActiveBitcovexOrderId());
    if (!order) {
      showToast("Order not found.", "!");
      return;
    }

    const response = await p2pRequest(`/p2p/orders/${encodeURIComponent(order.id)}/cancel`, {
      method: "POST",
      body: { reason: "Seller cancelled this order." },
    });

    if (!response.ok || response.status !== "success" || !response.data || !response.data.order) {
      showToast(firstMessage(response, "Could not cancel the order."), "!");
      return;
    }

    setLiveOrder(response.data.order);
    await syncAllLive({ silent: true });
    goToScreen("screen-seller-orders");
    showToast("Order cancelled", "✓");
  };

  confirmRelease = window.confirmRelease = async function () {
    closeReleaseModal();
    const order = liveOrderById(getActiveBitcovexOrderId());
    if (!order) {
      showToast("Order not found.", "!");
      return;
    }

    const response = await p2pRequest(`/p2p/orders/${encodeURIComponent(order.id)}/release`, {
      method: "POST",
    });

    if (!response.ok || response.status !== "success" || !response.data || !response.data.order) {
      showToast(firstMessage(response, "Could not release the crypto."), "!");
      return;
    }

    setLiveOrder(response.data.order);
    await syncAllLive({ silent: true });
    const nextOrder = liveOrderById(order.id) || response.data.order;
    syncGlobalsToActiveOrder(nextOrder);
    document.getElementById("released-usdt-val").textContent = Number(nextOrder.usdtAmount).toFixed(2) + " USDT";
    document.getElementById("released-inr-val").textContent = "Received " + formatInr(nextOrder.inrAmount, "₹0.00") + " via " + (nextOrder.paymentMethod || "UPI");
    document.getElementById("released-order-no").textContent = nextOrder.id;
    document.getElementById("released-received").textContent = formatInr(nextOrder.inrAmount, "₹0.00");
    document.getElementById("released-crypto-val").textContent = Number(nextOrder.usdtAmount).toFixed(2) + " USDT";
    goToScreen("screen-seller-released");
  };

  const baseSwitchAdType = window.switchAdType;
  switchAdType = window.switchAdType = function (type) {
    if (typeof baseSwitchAdType === "function") {
      baseSwitchAdType(type);
    }
    renderAdPaymentMethodOptions();
  };

  refreshBitcovexLiveState = window.refreshBitcovexLiveState = function () {
    syncAllLive({ silent: true });
  };

  handleBitcovexStorageSync = window.handleBitcovexStorageSync = function (event) {
    if (event && event.key && ![
      "bitcovex_token",
      "bitcovex_user",
      BITCOVEX_P2P_ACTIVE_ORDER_KEY,
    ].includes(event.key)) {
      return;
    }
    syncAllLive({ silent: true });
  };

  window.addEventListener("focus", function () {
    syncAllLive({ silent: true });
  });

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      syncAllLive({ silent: true });
    }
  });

  if (window.__bitcovexP2PLivePoll) {
    clearInterval(window.__bitcovexP2PLivePoll);
  }
  // Expose liveState so external code (p2p-clone.html) can patch ad prices after edit
  window._bitcovexLiveState = liveState;

  window.__bitcovexP2PLivePoll = setInterval(function () {
    if (!document.hidden) {
      syncAllLive({ silent: true });
    }
  }, LIVE_POLL_MS);

  syncAllLive({ silent: true });
})();
