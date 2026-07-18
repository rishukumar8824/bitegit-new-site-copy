const API_BASE = '/api/admin';

const state = {
  currentView: 'overview',
  admin: null,
  charts: {
    overviewRevenue: null,
    revenue: null
  },
  users: [],
  spotPairs: [],
  walletFilters: {
    depositStatus: '',
    withdrawalStatus: 'PENDING'
  },
  support: {
    activeTicketId: null,
    pollInterval: null
  }
};

const dom = {
  sidebar: document.getElementById('adminSidebar'),
  sidebarOverlay: document.getElementById('sidebarOverlay'),
  menuToggleBtn: document.getElementById('menuToggleBtn'),
  logoutBtnSide: document.getElementById('logoutBtnSide'),
  sidebarNav: document.getElementById('sidebarNav'),
  panels: Array.from(document.querySelectorAll('[data-panel]')),
  pageTitle: document.getElementById('pageTitle'),
  adminIdentity: document.getElementById('adminIdentity'),
  globalMessage: document.getElementById('globalMessage'),
  refreshCurrentBtn: document.getElementById('refreshCurrentBtn'),
  logoutBtn: document.getElementById('logoutBtn'),
  liveTime: document.getElementById('liveTime')
};

const viewLoaders = {
  overview: loadOverview,
  kyc: loadKyc,
  users: loadUsers,
  wallet: loadWallet,
  spot: loadSpot,
  p2p: loadP2P,
  support: loadSupport,
  revenue: loadRevenue,
  risk: loadRisk,
  features: loadFeatures,
  notifications: loadNotifications,
  blockchain: loadBlockchain,
  compliance: loadCompliance,
  settings: loadSettings,
  monitoring: loadMonitoring,
  audit: loadAudit,
  adminusers: loadAdminUsers,
  merchants: loadMerchants,
  futures: loadFutures,
  ledger: loadLedger,
  apikeys: loadApiKeys
};

const PAGE_TITLES = {
  overview: 'Overview',
  kyc: 'KYC Management',
  users: 'User Management',
  wallet: 'Wallet Management',
  spot: 'Spot Trading',
  p2p: 'P2P Control',
  support: 'Support Tickets',
  revenue: 'Revenue',
  risk: 'Risk Management',
  features: 'Feature Flags',
  notifications: 'Notifications',
  blockchain: 'Blockchain',
  compliance: 'Compliance',
  settings: 'Platform Settings',
  monitoring: 'Monitoring',
  audit: 'Audit Logs',
  adminusers: 'Admin Users',
  merchants: 'Merchant Applications',
  futures: 'Futures & Derivatives',
  ledger: 'Transaction Ledger',
  apikeys: 'API Keys Management'
};

function formatNumber(value, digits = 2) {
  const num = Number(value || 0);
  if (!Number.isFinite(num)) {
    return '0';
  }
  return num.toLocaleString('en-IN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
}

function formatDate(value) {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function statusBadge(status) {
  const normalized = String(status || '').trim().toUpperCase();
  let css = 'badge';
  if (['ACTIVE', 'APPROVED', 'OPEN', 'SUCCESS', 'RELEASED', 'CONNECTED', 'ENABLED', 'VERIFIED', 'COMPLETED'].includes(normalized)) {
    css += ' success';
  } else if (['PENDING', 'IN_PROGRESS', 'PAID', 'PENDING_REVIEW', 'NORMAL'].includes(normalized)) {
    css += ' warning';
  } else if (['BANNED', 'REJECTED', 'FAILURE', 'CANCELLED', 'DISPUTED', 'DISABLED', 'ERROR', 'CLOSED', 'CRITICAL'].includes(normalized)) {
    css += ' danger';
  }
  return `<span class="${css}">${normalized || '-'}</span>`;
}

function showMessage(text, type = 'info') {
  dom.globalMessage.textContent = text;
  dom.globalMessage.classList.remove('hidden', 'border-emerald-500/40', 'text-emerald-300', 'bg-emerald-500/10', 'border-rose-500/40', 'text-rose-300', 'bg-rose-500/10', 'border-slate-700', 'text-slate-300', 'bg-slate-900/60');
  if (type === 'error') {
    dom.globalMessage.classList.add('border-rose-500/40', 'text-rose-300', 'bg-rose-500/10');
  } else if (type === 'success') {
    dom.globalMessage.classList.add('border-emerald-500/40', 'text-emerald-300', 'bg-emerald-500/10');
  } else {
    dom.globalMessage.classList.add('border-slate-700', 'text-slate-300', 'bg-slate-900/60');
  }
}

function setActionButtonLoading(button, loading, loadingText = 'Processing...') {
  if (!button) {
    return;
  }
  if (loading) {
    if (!button.dataset.originalLabel) {
      button.dataset.originalLabel = button.textContent || 'Action';
    }
    button.disabled = true;
    button.textContent = loadingText;
    return;
  }
  button.disabled = false;
  if (button.dataset.originalLabel) {
    button.textContent = button.dataset.originalLabel;
    delete button.dataset.originalLabel;
  }
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (response.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }

  const contentType = String(response.headers.get('content-type') || '').toLowerCase();
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json().catch(() => ({})) : await response.text();

  if (!response.ok) {
    const message = isJson ? String(payload?.message || 'Request failed') : `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

function setSidebarOpen(open) {
  if (window.innerWidth >= 1024) {
    return;
  }
  if (open) {
    dom.sidebar.classList.add('open');
    if (dom.sidebarOverlay) dom.sidebarOverlay.classList.add('show');
  } else {
    dom.sidebar.classList.remove('open');
    if (dom.sidebarOverlay) dom.sidebarOverlay.classList.remove('show');
  }
}

function startLiveClock() {
  function tick() {
    if (!dom.liveTime) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    dom.liveTime.textContent = `${h}:${m}:${s}`;
  }
  tick();
  setInterval(tick, 1000);
}

function setActiveNav(view) {
  const buttons = dom.sidebarNav.querySelectorAll('[data-view]');
  buttons.forEach((button) => {
    const isActive = button.getAttribute('data-view') === view;
    button.classList.toggle('active', isActive);
  });
}

function showPanel(view) {
  dom.panels.forEach((panel) => {
    const isActive = panel.getAttribute('data-panel') === view;
    panel.classList.toggle('hidden', !isActive);
  });
  dom.pageTitle.textContent = PAGE_TITLES[view] || (view.charAt(0).toUpperCase() + view.slice(1));
}

async function loadCurrentView(options = {}) {
  const loader = viewLoaders[state.currentView];
  if (!loader) {
    return;
  }
  try {
    await loader(options);
  } catch (error) {
    if (!options.silent) {
      showMessage(error.message || 'Failed to load section.', 'error');
    }
  }
}

async function changeView(view) {
  if (!viewLoaders[view]) {
    return;
  }
  // Always close user profile drawer when switching views
  closeUserProfile();
  // Clear support polling when leaving support view
  if (state.currentView === 'support' && view !== 'support') {
    if (state.support.pollInterval) {
      clearInterval(state.support.pollInterval);
      state.support.pollInterval = null;
    }
  }
  state.currentView = view;
  setActiveNav(view);
  showPanel(view);
  setSidebarOpen(false);
  await loadCurrentView();
}

function renderCards(containerId, cards) {
  const container = document.getElementById(containerId);
  if (!container) {
    return;
  }
  container.innerHTML = cards
    .map(
      (card) => `
      <div class="stat-card">
        <div class="stat-icon">${card.icon || '📊'}</div>
        <div class="stat-info">
          <div class="stat-label">${card.label}</div>
          <div class="stat-value">${card.value}</div>
          ${card.meta ? `<div class="stat-meta">${card.meta}</div>` : ''}
        </div>
      </div>
    `
    )
    .join('');
}

function drawChart(instanceKey, canvasId, labels, values, color = '#22c55e') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    return;
  }

  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  if (state.charts[instanceKey]) {
    state.charts[instanceKey].destroy();
  }

  state.charts[instanceKey] = new Chart(context, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          data: values,
          borderColor: color,
          backgroundColor: (ctx) => {
            const c = ctx.chart.ctx;
            const g = c.createLinearGradient(0, 0, 0, ctx.chart.height || 200);
            g.addColorStop(0, color + '55');
            g.addColorStop(1, color + '00');
            return g;
          },
          borderWidth: 2.5,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: color,
          fill: true,
          tension: 0.8,
          cubicInterpolationMode: 'default',
          capBezierPoints: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a2030',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          titleColor: '#94a3b8',
          bodyColor: '#eaecef',
          padding: 10,
          cornerRadius: 8
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8', font: { size: 11 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { display: false }
        },
        y: {
          ticks: { color: '#94a3b8', font: { size: 11 } },
          grid: { color: 'rgba(255,255,255,0.04)' },
          border: { display: false }
        }
      },
      animation: { duration: 600, easing: 'easeInOutQuart' }
    }
  });
}

async function ensureAdminSession() {
  const payload = await apiRequest('/auth/me');
  state.admin = payload.admin;
  dom.adminIdentity.textContent = `${state.admin.email} • ${state.admin.role}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Overview
// ─────────────────────────────────────────────────────────────────────────────

async function loadOverview() {
  const payload = await apiRequest('/dashboard/overview');

  const revenue = payload.revenue || {};
  const wallet = payload.wallet || {};
  const monitoring = payload.monitoring || {};

  renderCards('overviewCards', [
    {
      icon: '💰',
      label: 'Revenue Today',
      value: `₹${formatNumber(revenue.totalRevenue?.today || 0, 2)}`,
      meta: `Week: ₹${formatNumber(revenue.totalRevenue?.week || 0, 2)}`
    },
    {
      icon: '📅',
      label: 'Revenue Month',
      value: `₹${formatNumber(revenue.totalRevenue?.month || 0, 2)}`,
      meta: `Spot Fees: ₹${formatNumber(revenue.spotFeeEarnings || 0, 2)}`
    },
    {
      icon: '📈',
      label: 'Trading Volume',
      value: `USDT ${formatNumber(revenue.totalTradingVolume || 0, 2)}`,
      meta: `Active users: ${Number(revenue.totalActiveUsers || 0)}`
    },
    {
      icon: '🏦',
      label: 'Platform Wallet',
      value: `₹${formatNumber(wallet.totalBalance || 0, 2)}`,
      meta: `Locked: ₹${formatNumber(wallet.totalLockedBalance || 0, 2)}`
    }
  ]);

  const trend = Array.isArray(revenue.trend) ? revenue.trend : [];
  drawChart(
    'overviewRevenue',
    'overviewRevenueChart',
    trend.map((row) => row.date),
    trend.map((row) => Number(row.revenue || 0)),
    '#22c55e'
  );

  // ── Donut chart: Revenue Breakdown ──
  const p2p    = Number(revenue.p2pEarnings || 0);
  const spot   = Number(revenue.spotFeeEarnings || 0);
  const wdfee  = Number(revenue.withdrawalFeeEarnings || 0);
  const other  = Math.max(0, Number(revenue.totalRevenue?.month || 0) - p2p - spot - wdfee);
  const donutData  = [p2p, spot, wdfee, other];
  const donutLabels = ['P2P', 'Spot Fees', 'Withdrawal', 'Other'];
  const donutColors = ['#00b8d4', '#f0b90b', '#0ecb81', '#a78bfa'];
  const donutTotal = p2p + spot + wdfee + other;

  const dtEl = document.getElementById('donutTotal');
  if (dtEl) dtEl.textContent = '₹' + formatNumber(donutTotal, 2);

  const donutCanvas = document.getElementById('revenueDonutChart');
  if (donutCanvas) {
    if (state.charts['revenueDonut']) state.charts['revenueDonut'].destroy();
    state.charts['revenueDonut'] = new Chart(donutCanvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: donutLabels,
        datasets: [{
          data: donutTotal > 0 ? donutData : [1, 1, 1, 1],
          backgroundColor: donutColors,
          borderWidth: 0,
          borderRadius: 10,
          spacing: 5,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { display: false }, tooltip: {
          backgroundColor: '#141821',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          callbacks: {
            label: function(ctx) {
              var pct = donutTotal > 0 ? ((ctx.parsed / donutTotal) * 100).toFixed(1) : '0.0';
              return '  ₹' + formatNumber(ctx.parsed, 2) + '  (' + pct + '%)';
            }
          }
        }}
      }
    });
  }

  const legend = document.getElementById('donutLegend');
  if (legend) {
    legend.innerHTML = donutLabels.map(function(lbl, i) {
      var pct = donutTotal > 0 ? ((donutData[i] / donutTotal) * 100).toFixed(1) : '0.0';
      return '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">'
        + '<span style="display:flex;align-items:center;gap:8px;">'
        + '<span style="width:12px;height:12px;border-radius:4px;background:' + donutColors[i] + ';flex-shrink:0;display:inline-block;box-shadow:0 0 6px ' + donutColors[i] + '80;"></span>'
        + '<span style="font-size:12px;color:rgba(255,255,255,0.6);">' + lbl + '</span></span>'
        + '<span style="font-size:12px;font-weight:700;color:#fff;">₹' + formatNumber(donutData[i], 2)
        + ' <span style="font-size:10px;font-weight:500;color:' + donutColors[i] + ';">(' + pct + '%)</span></span>'
        + '</div>';
    }).join('');
  }

  const health = document.getElementById('overviewHealth');
  health.innerHTML = [
    ['DB Connection', monitoring.dbConnected ? 'Connected' : 'Disconnected'],
    ['Active Users', Number(monitoring.activeUsers || 0)],
    ['Active Admins', Number(monitoring.activeAdmins || 0)],
    ['Failed Login (10m)', Number(monitoring.failedLoginAttemptsLast10Min || 0)],
    ['API Requests (10m)', Number(monitoring.apiRequestsLast10Min || 0)]
  ]
    .map(
      ([key, value]) => `
      <div class="flex items-center justify-between border-b border-slate-800 pb-2">
        <dt class="text-slate-400">${key}</dt>
        <dd class="font-medium">${value}</dd>
      </div>
    `
    )
    .join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// KYC Management
// ─────────────────────────────────────────────────────────────────────────────

async function loadKyc() {
  const statusFilter = document.getElementById('kycStatusFilter')?.value || '';
  const query = new URLSearchParams({ limit: '100' });
  if (statusFilter) query.set('kycStatus', statusFilter);

  const payload = await apiRequest(`/users?${query.toString()}`);
  const users = Array.isArray(payload.users) ? payload.users : [];

  // Update stats cards
  const allKycUsers = statusFilter ? users : users;
  // Fetch counts for all statuses for stats (best-effort from current result)
  const pending  = users.filter(u => (u.kycStatus||'').toUpperCase().includes('PENDING')).length;
  const approved = users.filter(u => (u.kycStatus||'').toUpperCase() === 'VERIFIED').length;
  const rejected = users.filter(u => (u.kycStatus||'').toUpperCase() === 'REJECTED').length;
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  if (!statusFilter) {
    setEl('kycStatPending', pending);
    setEl('kycStatApproved', approved);
    setEl('kycStatRejected', rejected);
    // Update nav badge
    const badge = document.getElementById('kycPendingBadge');
    if (badge) { badge.textContent = pending; badge.style.display = pending > 0 ? 'inline-flex' : 'none'; }
  }

  const countEl = document.getElementById('kycCount');
  if (countEl) countEl.textContent = `${users.length} users`;

  const body = document.getElementById('kycTableBody');
  if (!body) return;

  if (users.length === 0) {
    body.innerHTML = '<tr><td class="admin-td" colspan="7" style="text-align:center;color:var(--text-2);padding:32px;">No users found.</td></tr>';
    return;
  }

  body.innerHTML = users.map((user) => {
    const kyc = user.kyc || {};
    const name = kyc.fullName || user.fullName || '—';
    const aadhaarLast4 = kyc.aadhaarLast4 || '••••';
    return `<tr>
      <td class="admin-td" style="font-family:monospace;font-size:11px;">${escH(user.userId)}</td>
      <td class="admin-td">${escH(name)}</td>
      <td class="admin-td">${escH(user.email || '—')}</td>
      <td class="admin-td" style="font-family:monospace;letter-spacing:2px;">••••&nbsp;${escH(aadhaarLast4)}</td>
      <td class="admin-td">${formatDate(user.updatedAt)}</td>
      <td class="admin-td">${statusBadge(user.kycStatus)}</td>
      <td class="admin-td">
        <button class="btn-secondary btn-sm" data-kyc-action="view-docs" data-user-id="${escH(user.userId)}">Review</button>
      </td>
    </tr>`;
  }).join('');
}

async function viewKycDocuments(userId) {
  const modal = document.getElementById('kycDocModal');
  const aadhaarContainer = document.getElementById('kycDocAadhaarContainer');
  const aadhaarBackContainer = document.getElementById('kycDocAadhaarBackContainer');
  const selfieContainer = document.getElementById('kycDocSelfieContainer');

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  const loading = '<div style="padding:24px;color:var(--text-2);font-size:12px;">Loading…</div>';
  aadhaarContainer.innerHTML = loading;
  aadhaarBackContainer.innerHTML = loading;
  selfieContainer.innerHTML = loading;

  // Clear user info fields
  ['kycInfoName','kycInfoEmail','kycInfoDob','kycInfoAddress','kycDocAadhaar','kycDocStatus'].forEach(id => {
    const el = document.getElementById(id); if (el) el.textContent = '—';
  });
  document.getElementById('kycReviewRemarks').value = '';

  try {
    // Fetch KYC documents metadata
    const data = await apiRequest(`/users/${encodeURIComponent(userId)}/kyc/documents`);
    // Also fetch user profile for name/email/dob/address
    const userPayload = await apiRequest(`/users/${encodeURIComponent(userId)}`).catch(() => ({}));
    const user = userPayload.user || userPayload || {};
    const kyc  = data || {};

    document.getElementById('kycDocModalMeta').textContent = `User: ${userId} • Submitted: ${formatDate(kyc.submittedAt)}`;
    document.getElementById('kycInfoName').textContent    = kyc.fullName  || user.fullName  || '—';
    document.getElementById('kycInfoEmail').textContent   = user.email    || '—';
    document.getElementById('kycInfoDob').textContent     = kyc.dob       || user.dob       || '—';
    document.getElementById('kycInfoAddress').textContent = kyc.address   || user.address   || '—';
    document.getElementById('kycDocStatus').textContent   = kyc.status    || user.kycStatus || 'UNKNOWN';
    document.getElementById('kycDocAadhaar').textContent  = kyc.aadhaarMasked
      ? `${kyc.aadhaarMasked} (Last 4: ${kyc.aadhaarLast4 || '—'})`
      : (kyc.aadhaarLast4 ? `•••• •••• •••• ${kyc.aadhaarLast4}` : '—');

    // Load images via binary endpoint: /api/admin/users/:id/kyc/image/:type
    // Supported types: 'aadhaar' | 'aadhaar-back' | 'selfie'
    const imgStyle = 'width:100%;height:auto;object-fit:contain;max-height:200px;border-radius:6px;';
    const noImg = (label) => `<div style="padding:20px;text-align:center;color:var(--text-2);font-size:12px;">No ${label} image</div>`;

    if (kyc.hasAadhaarFront) {
      // Use binary endpoint if available; fall back to base64 from documents response
      const src = kyc.aadhaarFront || `/api/admin/users/${encodeURIComponent(userId)}/kyc/image/aadhaar`;
      aadhaarContainer.innerHTML = `<img src="${src}" alt="Aadhaar Front" style="${imgStyle}" onerror="this.parentElement.innerHTML='<div style=\\'padding:16px;text-align:center;color:var(--red);font-size:12px;\\'>Image failed to load</div>'" />`;
    } else {
      aadhaarContainer.innerHTML = noImg('Aadhaar Front');
    }

    if (kyc.hasAadhaarBack) {
      const src = kyc.aadhaarBack || `/api/admin/users/${encodeURIComponent(userId)}/kyc/image/aadhaar-back`;
      aadhaarBackContainer.innerHTML = `<img src="${src}" alt="Aadhaar Back" style="${imgStyle}" onerror="this.parentElement.innerHTML='<div style=\\'padding:16px;text-align:center;color:var(--red);font-size:12px;\\'>Image failed to load</div>'" />`;
    } else {
      aadhaarBackContainer.innerHTML = noImg('Aadhaar Back');
    }

    if (kyc.hasSelfie || kyc.selfie) {
      const src = kyc.selfie || `/api/admin/users/${encodeURIComponent(userId)}/kyc/image/selfie`;
      selfieContainer.innerHTML = `<img src="${src}" alt="Selfie" style="${imgStyle}" onerror="this.parentElement.innerHTML='<div style=\\'padding:16px;text-align:center;color:var(--red);font-size:12px;\\'>Image failed to load</div>'" />`;
    } else {
      selfieContainer.innerHTML = noImg('Selfie');
    }

    document.getElementById('kycDocActions').innerHTML = `
      <button class="btn-primary" style="flex:1;" data-kyc-doc-action="approve" data-user-id="${escH(userId)}">✓ Approve KYC</button>
      <button class="btn-danger"  style="flex:1;" data-kyc-doc-action="reject"  data-user-id="${escH(userId)}">✕ Reject KYC</button>
    `;
  } catch (error) {
    aadhaarContainer.innerHTML = `<div style="padding:16px;color:var(--red);font-size:12px;">Error: ${escH(error.message)}</div>`;
    aadhaarBackContainer.innerHTML = '';
    selfieContainer.innerHTML = '';
    showMessage(error.message || 'Failed to load KYC documents.', 'error');
  }
}

async function reviewKyc(userId, decision, reason) {
  await apiRequest(`/users/${encodeURIComponent(userId)}/kyc/review`, {
    method: 'POST',
    body: JSON.stringify({ decision, remarks: reason || '' })
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// User Management
// ─────────────────────────────────────────────────────────────────────────────

const BADGE_COLORS = { 1: '#1a6ff4', 2: '#f7931a', 3: '#f5a623' };
const BADGE_ICONS  = { 1: '◆ Blue V', 2: '♛ Crown', 3: '❖ Shield' };

async function loadUsers(options = {}) {
  const search = options?.search ?? document.getElementById('userSearchInput').value.trim();
  const query = search ? `?email=${encodeURIComponent(search)}` : '';
  const payload = await apiRequest(`/users${query}`);

  state.users = Array.isArray(payload.users) ? payload.users : [];

  // Render table immediately — merchant badges load async after
  renderUsersTable(state.users, {});

  // Then fetch merchant badges in background and update cells
  state.users.forEach(async (user) => {
    try {
      const r = await fetch(`/api/admin/users/${encodeURIComponent(user.userId)}/merchant-badge`, { credentials: 'include' });
      const d = await r.json();
      const badge = (d.status === 'approved' && d.badge) ? d.badge : null;
      const cell = document.getElementById(`mbadge-${user.userId}`);
      if (cell) {
        cell.innerHTML = badge
          ? `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;background:${BADGE_COLORS[badge]}22;color:${BADGE_COLORS[badge]};border:1px solid ${BADGE_COLORS[badge]}55;white-space:nowrap;">${BADGE_ICONS[badge]}</span>`
          : `<span style="font-size:11px;color:var(--text-2);">—</span>`;
      }
    } catch (_) {}
  });
}

function isUserOnline(lastActiveAt, isMerchant) {
  if (!lastActiveAt) return false;
  const threshold = isMerchant ? 3600000 : 300000; // merchant: 1hr, normal: 5min
  return (Date.now() - new Date(lastActiveAt).getTime()) < threshold;
}
function formatLastSeen(lastActiveAt) {
  if (!lastActiveAt) return 'Never';
  const diff = Date.now() - new Date(lastActiveAt).getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return Math.floor(diff / 86400000) + 'd ago';
}

function renderUsersTable(users, merchantMap) {
  const body = document.getElementById('usersTableBody');
  if (users.length === 0) {
    body.innerHTML = '<tr><td class="admin-td text-slate-500" colspan="9">No users found.</td></tr>';
    return;
  }
  body.innerHTML = users.map((user) => {
    const mb = merchantMap[user.userId];
    const merchantCell = mb
      ? `<span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;background:${BADGE_COLORS[mb]}22;color:${BADGE_COLORS[mb]};border:1px solid ${BADGE_COLORS[mb]}55;white-space:nowrap;">${BADGE_ICONS[mb]}</span>`
      : `<span style="font-size:11px;color:var(--text-2);">—</span>`;
    const online = isUserOnline(user.lastActiveAt, user.isMerchant);
    const lastSeenTxt = formatLastSeen(user.lastActiveAt);
    const onlineLabel = online ? 'Online (active <5min)' : `Last seen: ${lastSeenTxt}`;
    const onlineDot = online
      ? `<span title="${onlineLabel}" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#22c55e;margin-right:5px;vertical-align:middle;box-shadow:0 0 4px #22c55e99;"></span>`
      : `<span title="${onlineLabel}" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#64748b44;margin-right:5px;vertical-align:middle;"></span>`;
    return `
    <tr class="user-row" data-profile-id="${user.userId}" style="cursor:pointer;transition:background 0.15s;" title="Click to view full profile">
      <td class="admin-td" style="font-family:monospace;font-size:11px;color:var(--accent);">${user.userId}</td>
      <td class="admin-td" style="font-weight:500;">${onlineDot}${user.email}<br><span style="font-size:10px;color:var(--text-2);">${onlineLabel}</span></td>
      <td class="admin-td">${statusBadge(user.role)}</td>
      <td class="admin-td">${statusBadge(user.status)}</td>
      <td class="admin-td">${statusBadge(user.kycStatus)}</td>
      <td class="admin-td" id="mbadge-${user.userId}">${merchantCell}</td>
      <td class="admin-td" style="text-align:right;color:var(--green);font-weight:600;">${formatNumber(user.balance, 4)}</td>
      <td class="admin-td">
        <div style="display:flex;flex-wrap:wrap;gap:4px;">
          <button class="btn-primary btn-sm" data-user-action="profile" data-user-id="${user.userId}">👤 Profile</button>
          <button class="btn-secondary btn-sm" data-user-action="freeze" data-user-id="${user.userId}">Freeze</button>
          <button class="btn-danger btn-sm" data-user-action="ban" data-user-id="${user.userId}">Ban</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ─────────────────────────────────────────────────────────────────────────────
// Wallet
// ─────────────────────────────────────────────────────────────────────────────

async function loadWallet() {
  const depositStatusSelect = document.getElementById('walletDepositStatusFilter');
  const withdrawalStatusSelect = document.getElementById('walletWithdrawalStatusFilter');
  const selectedDepositStatus = String(depositStatusSelect?.value || '').trim().toUpperCase();
  const selectedWithdrawalStatus = String(withdrawalStatusSelect?.value || '').trim().toUpperCase();

  state.walletFilters.depositStatus = selectedDepositStatus;
  state.walletFilters.withdrawalStatus = selectedWithdrawalStatus;

  const depositsQuery = new URLSearchParams({ limit: '25' });
  const withdrawalsQuery = new URLSearchParams({ limit: '25' });

  if (selectedDepositStatus) {
    depositsQuery.set('status', selectedDepositStatus);
  }

  if (selectedWithdrawalStatus) {
    withdrawalsQuery.set('status', selectedWithdrawalStatus);
  }

  const [overview, deposits, withdrawals, hotBalances, usdtConfigPayload] = await Promise.all([
    apiRequest('/wallet/overview'),
    apiRequest(`/wallet/deposits?${depositsQuery.toString()}`),
    apiRequest(`/wallet/withdrawals?${withdrawalsQuery.toString()}`),
    apiRequest('/wallet/hot-balances'),
    apiRequest('/wallet/config/USDT').catch(() => ({
      config: {
        coin: 'USDT',
        defaultNetwork: 'TRC20',
        withdrawalsEnabled: true,
        depositsEnabled: true,
        networkFee: 1,
        minWithdrawal: 10,
        maxWithdrawal: 100000,
        depositAddresses: { TRC20: '', ERC20: '', BEP20: '' },
        minDepositConfirmations: { TRC20: 20, ERC20: 12, BEP20: 15 }
      }
    }))
  ]);

  const depositRows = Array.isArray(deposits.deposits) ? deposits.deposits : [];
  const withdrawalRows = Array.isArray(withdrawals.withdrawals) ? withdrawals.withdrawals : [];
  const pendingDeposits = depositRows.filter((row) => String(row.status || '').toUpperCase() === 'PENDING');
  const pendingDepositAmount = pendingDeposits.reduce((sum, row) => sum + Number(row.amount || 0), 0);

  renderCards('walletCards', [
    { icon: '💎', label: 'Total Balance', value: `₹${formatNumber(overview.totalBalance || 0, 2)}` },
    { icon: '🔒', label: 'Locked Balance', value: `₹${formatNumber(overview.totalLockedBalance || 0, 2)}` },
    { icon: '⬇️', label: 'Pending Deposits', value: `${pendingDeposits.length}`, meta: `Amount: ${formatNumber(pendingDepositAmount || 0, 6)}` },
    { icon: '⬆️', label: 'Pending Withdrawal', value: `₹${formatNumber(overview.pendingWithdrawalAmount || 0, 2)}` }
  ]);

  const depositsList = document.getElementById('depositsList');
  depositsList.innerHTML = depositRows
    .map((row) => {
      const status = String(row.status || 'PENDING').trim().toUpperCase();
      const canReview = status === 'PENDING';
      const disabledClass = canReview ? '' : ' opacity-60';
      const disabledAttr = canReview ? '' : ' disabled';
      return `
      <article class="list-item">
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="text-sm font-semibold">${row.id}</p>
            <p class="text-xs text-slate-400">User: ${row.userId || '-'}</p>
            <p class="text-xs text-slate-500">${formatDate(row.createdAt)}</p>
          </div>
          ${statusBadge(status)}
        </div>
        <p class="mt-2 text-sm text-slate-200">${row.coin || 'USDT'} • ${formatNumber(row.amount || 0, 6)}</p>
        <p class="mt-1 text-xs text-slate-500">Type: ${row.type || 'ONCHAIN'} • Tx: ${row.txHash || row.txid || '-'}</p>
        <div class="mt-2 flex gap-2">
          <button class="btn-primary${disabledClass}" data-deposit-action="approve" data-deposit-id="${row.id}"${disabledAttr}>Approve</button>
          <button class="btn-danger${disabledClass}" data-deposit-action="reject" data-deposit-id="${row.id}"${disabledAttr}>Reject</button>
        </div>
      </article>
    `;
    })
    .join('');

  if (depositRows.length === 0) {
    depositsList.innerHTML = '<p class="text-sm text-slate-500">No deposits available.</p>';
  }

  const withdrawalsList = document.getElementById('withdrawalsList');
  withdrawalsList.innerHTML = withdrawalRows
    .map((row) => {
      const status = String(row.status || 'PENDING').trim().toUpperCase();
      const canReview = status === 'PENDING';
      const disabledClass = canReview ? '' : ' opacity-60';
      const disabledAttr = canReview ? '' : ' disabled';
      const withdrawalId = String(row.requestId || row.id || '').trim();
      const network = String(row.network || row.chain || '-').trim().toUpperCase() || '-';
      const address = String(row.address || row.toAddress || row.to || '-').trim();
      const userLabel = String(row.username || row.userId || '-').trim();
      return `
      <article class="list-item">
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="text-sm font-semibold">${escapeHtml(row.coin || row.currency || 'USDT')} • ${formatNumber(row.amount || 0, 6)}</p>
            <p class="text-xs text-slate-400">Request: ${escapeHtml(withdrawalId || '-')}</p>
            <p class="text-xs text-slate-500">${formatDate(row.createdAt)}</p>
          </div>
          ${statusBadge(status)}
        </div>
        <div class="mt-3 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300" style="display:grid;gap:7px;">
          <div><span class="text-slate-500">User:</span> ${escapeHtml(userLabel)}</div>
          <div><span class="text-slate-500">User ID:</span> ${escapeHtml(row.userId || '-')}</div>
          <div><span class="text-slate-500">Network:</span> ${escapeHtml(network)}</div>
          <div style="word-break:break-all;"><span class="text-slate-500">Address:</span> ${escapeHtml(address)}</div>
          <div><span class="text-slate-500">Created:</span> ${escapeHtml(formatDate(row.createdAt))}</div>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <button class="btn-primary${disabledClass}" data-withdrawal-action="approve" data-withdrawal-id="${escapeHtml(withdrawalId || row.id)}"${disabledAttr}>Approve</button>
          <button class="btn-danger${disabledClass}" data-withdrawal-action="reject" data-withdrawal-id="${escapeHtml(withdrawalId || row.id)}"${disabledAttr}>Reject</button>
        </div>
      </article>
    `;
    })
    .join('');

  if (withdrawalRows.length === 0) {
    withdrawalsList.innerHTML = '<p class="text-sm text-slate-500">No withdrawals available.</p>';
  }

  const hotWalletList = document.getElementById('hotWalletList');
  const wallets = Array.isArray(hotBalances.hotWallets) ? hotBalances.hotWallets : [];
  hotWalletList.innerHTML = wallets
    .map(
      (wallet) => `
      <div class="list-item">
        <p class="text-sm font-semibold">${wallet.coin}</p>
        <p class="text-xs text-slate-400">Network: ${wallet.network || '-'}</p>
        <p class="mt-1 text-sm">Balance: ${formatNumber(wallet.balance || 0, 8)}</p>
      </div>
    `
    )
    .join('');

  if (wallets.length === 0) {
    hotWalletList.innerHTML = '<p class="text-sm text-slate-500">No hot wallets configured.</p>';
  }

  const coinConfigForm = document.getElementById('coinConfigForm');
  const usdtConfig = usdtConfigPayload?.config || {};
  const depositAddresses = usdtConfig.depositAddresses || {};
  const confirmations = usdtConfig.minDepositConfirmations || {};
  if (coinConfigForm) {
    coinConfigForm.coin.value = usdtConfig.coin || 'USDT';
    coinConfigForm.defaultNetwork.value = usdtConfig.defaultNetwork || 'TRC20';
    coinConfigForm.networkFee.value = usdtConfig.networkFee ?? 1;
    coinConfigForm.minWithdrawal.value = usdtConfig.minWithdrawal ?? 10;
    coinConfigForm.maxWithdrawal.value = usdtConfig.maxWithdrawal ?? 100000;
    coinConfigForm.withdrawalsEnabled.checked = Boolean(usdtConfig.withdrawalsEnabled !== false);
    coinConfigForm.depositsEnabled.checked = Boolean(usdtConfig.depositsEnabled !== false);
    coinConfigForm.trc20Address.value = String(depositAddresses.TRC20 || '');
    coinConfigForm.erc20Address.value = String(depositAddresses.ERC20 || '');
    coinConfigForm.bep20Address.value = String(depositAddresses.BEP20 || '');
    coinConfigForm.trc20Confirmations.value = Number(confirmations.TRC20 || 20);
    coinConfigForm.erc20Confirmations.value = Number(confirmations.ERC20 || 12);
    coinConfigForm.bep20Confirmations.value = Number(confirmations.BEP20 || 15);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Spot
// ─────────────────────────────────────────────────────────────────────────────

async function loadSpot() {
  const payload = await apiRequest('/spot/pairs');
  state.spotPairs = Array.isArray(payload.pairs) ? payload.pairs : [];

  const body = document.getElementById('spotPairsTableBody');
  body.innerHTML = state.spotPairs
    .map(
      (pair) => `
      <tr>
        <td class="admin-td">${pair.symbol}</td>
        <td class="admin-td">${pair.enabled ? statusBadge('ENABLED') : statusBadge('DISABLED')}</td>
        <td class="admin-td">
          <input class="input-dark" type="number" step="0.0001" data-spot-field="makerFee" data-symbol="${pair.symbol}" value="${pair.makerFee}" />
        </td>
        <td class="admin-td">
          <input class="input-dark" type="number" step="0.0001" data-spot-field="takerFee" data-symbol="${pair.symbol}" value="${pair.takerFee}" />
        </td>
        <td class="admin-td">
          <input class="input-dark" type="number" step="1" data-spot-field="pricePrecision" data-symbol="${pair.symbol}" value="${pair.pricePrecision}" />
        </td>
        <td class="admin-td">
          <div class="flex flex-wrap gap-1">
            <button class="btn-secondary" data-spot-action="toggle" data-symbol="${pair.symbol}" data-enabled="${pair.enabled ? '1' : '0'}">${pair.enabled ? 'Disable' : 'Enable'}</button>
            <button class="btn-primary" data-spot-action="save" data-symbol="${pair.symbol}">Save</button>
          </div>
        </td>
      </tr>
    `
    )
    .join('');

  if (state.spotPairs.length === 0) {
    body.innerHTML = '<tr><td class="admin-td text-slate-500" colspan="6">No spot pairs configured.</td></tr>';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// P2P
// ─────────────────────────────────────────────────────────────────────────────

function buildDisputeMsgBubble(msg, buyerLabel, sellerLabel) {
  const rawSender = String(msg.senderRole || msg.role || msg.sender || '').toLowerCase();
  const text = escapeHtml(msg.text || msg.message || '');
  const isImage = msg.messageType === 'image' || (!msg.text && msg.imageUrl);
  const imageUrl = msg.imageUrl || '';
  const ts = msg.createdAt
    ? new Date(Number.isFinite(msg.createdAt) ? Number(msg.createdAt) : msg.createdAt)
        .toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })
    : '';
  let roleLabel, roleColor, bubble;
  if (rawSender.startsWith('admin') || rawSender === 'admin' || msg.sender === 'Support') {
    roleLabel = 'BX Support'; roleColor = '#00b8d4'; bubble = 'rgba(0,229,255,0.10)';
  } else if (rawSender === 'buyer' || rawSender.includes('buyer')) {
    roleLabel = '🟦 Buyer (' + escapeHtml(buyerLabel) + ')'; roleColor = '#3b82f6'; bubble = 'rgba(59,130,246,0.10)';
  } else if (rawSender === 'seller' || rawSender.includes('seller')) {
    roleLabel = '🟩 Seller (' + escapeHtml(sellerLabel) + ')'; roleColor = '#22c55e'; bubble = 'rgba(34,197,94,0.10)';
  } else {
    const snd = String(msg.sender || '').toLowerCase();
    const byr = String(buyerLabel || '').toLowerCase();
    const slr = String(sellerLabel || '').toLowerCase();
    if (byr && snd === byr) {
      roleLabel = '🟦 Buyer (' + escapeHtml(buyerLabel) + ')'; roleColor = '#3b82f6'; bubble = 'rgba(59,130,246,0.10)';
    } else if (slr && snd === slr) {
      roleLabel = '🟩 Seller (' + escapeHtml(sellerLabel) + ')'; roleColor = '#22c55e'; bubble = 'rgba(34,197,94,0.10)';
    } else {
      roleLabel = escapeHtml(msg.sender || 'System'); roleColor = '#94a3b8'; bubble = 'rgba(148,163,184,0.08)';
    }
  }
  // Image content
  const imgMarkup = isImage && imageUrl
    ? '<a href="' + escapeHtml(imageUrl) + '" target="_blank" rel="noopener" style="display:block;margin-top:6px;">'
      + '<img src="' + escapeHtml(imageUrl) + '" alt="Payment screenshot" '
      + 'style="max-width:180px;max-height:160px;border-radius:6px;border:1px solid rgba(255,255,255,0.1);cursor:pointer;" />'
      + '</a>'
    : '';
  const textMarkup = text ? '<p style="font-size:12px;color:#e2e8f0;margin:4px 0 0;white-space:pre-wrap;">' + text + '</p>' : '';
  return '<div style="margin-bottom:7px;padding:7px 10px;border-radius:8px;background:' + bubble + ';border-left:3px solid ' + roleColor + ';">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;">'
    + '<span style="font-size:11px;font-weight:600;color:' + roleColor + ';">' + roleLabel + '</span>'
    + '<span style="font-size:10px;color:#64748b;">' + ts + '</span>'
    + '</div>'
    + imgMarkup + textMarkup
    + '</div>';
}

const ADMIN_QUICK_REPLIES = [
  { label: '📋 Investigating', text: 'We have received your appeal and are investigating. Please allow 24-48 hours.' },
  { label: '📸 Upload Proof', text: 'Please upload your payment proof (screenshot) to help us resolve this faster.' },
  { label: '✅ Resolved — Buyer', text: 'This dispute has been resolved in your favor. Escrow will be released to the buyer shortly.' },
  { label: '✅ Resolved — Seller', text: 'This dispute has been resolved in your favor. Escrow has been released to the seller.' },
  { label: '🔒 Escalated', text: 'A policy violation has been found. This order has been escalated to compliance.' },
  { label: '⛔ No Payments', text: 'Please do not make any further payments until this dispute is fully resolved.' },
  { label: '🚫 No Chargeback', text: 'Both parties: please avoid chargeback requests while this case is under review.' },
  { label: '🔓 Case Closed', text: 'Case closed. No policy violation found. Please proceed as mutually agreed.' },
];

function adminQuickReply(orderId, idx) {
  var item = ADMIN_QUICK_REPLIES[idx];
  if (!item) return;
  var input = document.getElementById('disputeReplyInput_' + orderId);
  if (input) { input.value = item.text; input.focus(); }
  // Do NOT auto-send — admin clicks Send manually
}

function renderP2PDisputeCard(order = {}) {
  const appeal = order.appealDetails && typeof order.appealDetails === 'object' ? order.appealDetails : {};
  const attachments = Array.isArray(appeal.attachments) ? appeal.attachments : [];
  const allMessages = Array.isArray(order.chatMessages)
    ? order.chatMessages
    : Array.isArray(order.messages)
      ? order.messages
      : [];

  const appealType = appeal.type || order.disputeReason || 'Appeal';
  const appealReason = appeal.reason || order.disputeReason || 'No appeal details submitted.';
  const submittedBy = appeal.submittedBy?.username || appeal.submittedBy?.userId || order.disputedBy || '-';
  const submittedAt = appeal.submittedAt || order.disputedAt || order.updatedAt;
  const buyerLabel = order.buyerUsername || order.buyerUserId || '-';
  const sellerLabel = order.sellerUsername || order.sellerUserId || '-';
  const orderId = escapeHtml(order.id || '');

  const attachmentMarkup = attachments.length
    ? '<div class="mt-2 grid grid-cols-3 gap-2">'
        + attachments.map((item) =>
            '<a href="' + escapeHtml(item.dataUrl) + '" target="_blank" rel="noopener" class="block overflow-hidden rounded-lg border border-slate-700 bg-slate-950">'
            + '<img src="' + escapeHtml(item.dataUrl) + '" alt="Appeal attachment" style="height:72px;width:100%;object-fit:cover;" /></a>'
          ).join('')
        + '</div>'
    : '<p class="mt-2 text-xs text-slate-500">No screenshots attached.</p>';

  // ALL messages, scrollable
  const messageMarkup = allMessages.length
    ? allMessages.map((msg) => buildDisputeMsgBubble(msg, buyerLabel, sellerLabel)).join('')
    : '<p style="font-size:12px;color:#64748b;padding:6px 0;">No chat messages yet.</p>';

  return `
    <article class="list-item" style="border-color:rgba(245,158,11,.35);background:rgba(15,23,42,.72);">
      <div class="flex items-start justify-between gap-2">
        <div>
          <p class="text-sm font-semibold">${escapeHtml(order.reference || order.id || 'P2P order')}</p>
          <p class="text-xs text-slate-400">${escapeHtml(order.id || '-')} • ${escapeHtml(order.asset || 'USDT')} • ₹${formatNumber(order.amountInr || 0, 2)}</p>
        </div>
        ${statusBadge(order.status || 'DISPUTED')}
      </div>

      <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400">
        <div><span class="text-slate-500">Buyer:</span> <span style="color:#3b82f6;font-weight:600;">${escapeHtml(buyerLabel)}</span></div>
        <div><span class="text-slate-500">Seller:</span> <span style="color:#22c55e;font-weight:600;">${escapeHtml(sellerLabel)}</span></div>
        <div><span class="text-slate-500">Asset Amt:</span> <span class="text-white">${formatNumber(order.assetAmount || order.escrowAmount || 0, 6)}</span></div>
        <div><span class="text-slate-500">Price:</span> <span class="text-white">₹${formatNumber(order.price || 0, 2)}</span></div>
        <div><span class="text-slate-500">Payment:</span> ${escapeHtml(order.paymentMethod || 'UPI')}</div>
        <div><span class="text-slate-500">Raised:</span> ${escapeHtml(formatDate(submittedAt))}</div>
      </div>

      <div class="mt-3 rounded-lg border border-amber-500/20 bg-amber-500/10 p-3">
        <p class="text-xs font-semibold text-amber-300">Appeal by ${escapeHtml(submittedBy)}</p>
        <p class="mt-1 text-xs text-slate-300"><span class="text-slate-500">Type:</span> ${escapeHtml(appealType)}</p>
        <p class="mt-1 text-xs text-slate-200 whitespace-pre-wrap">${escapeHtml(appealReason)}</p>
        ${attachmentMarkup}
      </div>

      <div class="mt-3 rounded-lg border border-slate-700 bg-slate-950/60 p-3">
        <p style="font-size:12px;font-weight:600;color:#cbd5e1;margin:0 0 8px;">Full Chat (${allMessages.length} messages)</p>
        <div id="disputeChat_${orderId}" style="max-height:220px;overflow-y:auto;padding-right:2px;">${messageMarkup}</div>

        <p style="font-size:10px;color:#64748b;margin:10px 0 4px;font-weight:700;letter-spacing:.5px;">QUICK REPLY</p>
        <div style="display:flex;flex-wrap:nowrap;overflow-x:auto;gap:6px;margin-bottom:10px;padding-bottom:2px;">
          ${ADMIN_QUICK_REPLIES.map((q, i) =>
            '<button onclick="adminQuickReply(\'' + orderId + '\',' + i + ')" '
            + 'style="flex-shrink:0;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.35);'
            + 'color:#fbbf24;font-size:11px;border-radius:16px;padding:4px 12px;cursor:pointer;white-space:nowrap;font-weight:500;">'
            + escapeHtml(q.label) + '</button>'
          ).join('')}
        </div>

        <div id="disputeStatus_${orderId}" style="font-size:12px;min-height:18px;margin-bottom:6px;"></div>
        <div style="display:flex;gap:8px;align-items:flex-end;">
          <textarea id="disputeReplyInput_${orderId}" placeholder="Or type a custom reply…" rows="2"
            style="flex:1;background:#0f172a;border:1px solid #334155;border-radius:8px;padding:8px 10px;
            color:#e2e8f0;font-size:12px;resize:none;outline:none;"></textarea>
          <button id="disputeSendBtn_${orderId}" onclick="adminSendDisputeReply('${orderId}')"
            style="background:#f59e0b;color:#000;font-size:12px;font-weight:700;border:none;
            border-radius:8px;padding:9px 16px;cursor:pointer;white-space:nowrap;min-width:64px;">
            Send ↑
          </button>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <button onclick="adminReleaseEscrow('${orderId}',this)"
          style="background:#22c55e;color:#000;font-size:12px;font-weight:700;border:none;border-radius:8px;padding:8px 16px;cursor:pointer;">
          ✅ Release Escrow
        </button>
        <button onclick="adminFreezeEscrow('${orderId}',this)"
          style="background:#ef4444;color:#fff;font-size:12px;font-weight:700;border:none;border-radius:8px;padding:8px 16px;cursor:pointer;">
          🔒 Freeze Escrow
        </button>
      </div>
    </article>
  `;
}

async function adminSendDisputeReply(orderId) {
  var input = document.getElementById('disputeReplyInput_' + orderId);
  var btn   = document.getElementById('disputeSendBtn_' + orderId);
  var statusEl = document.getElementById('disputeStatus_' + orderId);
  var message = input ? input.value.trim() : '';
  if (!message) {
    if (statusEl) { statusEl.style.color='#f87171'; statusEl.textContent='⚠ Enter a message first.'; }
    return;
  }
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
  if (statusEl) { statusEl.style.color='#94a3b8'; statusEl.textContent='Sending…'; }
  try {
    var res = await fetch('/api/admin/p2p/orders/' + encodeURIComponent(orderId) + '/admin-reply', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message })
    });
    var data = await res.json().catch(function(){ return {}; });
    if (!res.ok) throw new Error(data.message || 'HTTP ' + res.status);

    if (input) input.value = '';
    if (statusEl) { statusEl.style.color='#4ade80'; statusEl.textContent='✓ Sent successfully'; setTimeout(function(){ if(statusEl) statusEl.textContent=''; }, 3000); }

    // Refresh all messages inline
    var chatWrap = document.getElementById('disputeChat_' + orderId);
    if (chatWrap) {
      var rawOrder = data.order || {};
      var allMsgs = Array.isArray(rawOrder.messages) ? rawOrder.messages : [];
      var buyerL = rawOrder.buyerUsername || rawOrder.buyerUserId || '-';
      var sellerL = rawOrder.sellerUsername || rawOrder.sellerUserId || '-';
      chatWrap.innerHTML = allMsgs.length
        ? allMsgs.map(function(m){ return buildDisputeMsgBubble(m, buyerL, sellerL); }).join('')
        : '<p style="font-size:12px;color:#64748b;">No messages.</p>';
      chatWrap.scrollTop = chatWrap.scrollHeight;
    }
  } catch (err) {
    if (statusEl) { statusEl.style.color='#f87171'; statusEl.textContent='✗ ' + (err.message || 'Failed to send'); }
    console.error('[AdminReply]', err);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Send ↑'; }
  }
}

async function adminReleaseEscrow(orderId, btn) {
  if (btn) { btn.disabled = true; btn.textContent = 'Releasing…'; btn.style.background = '#16a34a'; }
  try {
    var res = await fetch('/api/admin/p2p/orders/' + encodeURIComponent(orderId) + '/admin-release', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    var data = await res.json().catch(function(){ return {}; });
    if (!res.ok) throw new Error(data.message || 'HTTP ' + res.status);
    showMessage('✅ Escrow released. Dispute resolved.', 'success');
    // Remove card from DOM immediately
    var card = btn ? btn.closest('article') : null;
    if (card) {
      card.style.transition = 'opacity 0.3s';
      card.style.opacity = '0';
      setTimeout(function(){ card.remove(); }, 300);
    }
    // Also reload full list in background
    setTimeout(function(){ loadP2P().catch(function(){}); }, 500);
  } catch (err) {
    showMessage('Release failed: ' + (err.message || 'Unknown error'), 'error');
    if (btn) { btn.disabled = false; btn.textContent = '✅ Release Escrow'; btn.style.background = '#22c55e'; }
  }
}

async function adminFreezeEscrow(orderId, btn) {
  if (btn) { btn.disabled = true; btn.textContent = '…'; }
  try {
    var res = await fetch('/api/admin/p2p/orders/' + encodeURIComponent(orderId) + '/freeze', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    var data = await res.json().catch(function(){ return {}; });
    if (!res.ok) throw new Error(data.message || 'HTTP ' + res.status);
    showMessage('🔒 Escrow frozen.', 'success');
    await loadP2P();
  } catch (err) {
    showMessage('Freeze failed: ' + (err.message || 'Unknown error'), 'error');
    if (btn) { btn.disabled = false; btn.textContent = '🔒 Freeze Escrow'; }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// P2P — Tabbed Control Panel
// ─────────────────────────────────────────────────────────────────────────────

let _p2pActiveTab = 'trades';

function p2pStatusBadge(status) {
  const s = String(status || '').toUpperCase();
  const map = {
    DISPUTED:     'background:rgba(246,70,93,0.15);color:#f6465d;border:1px solid rgba(246,70,93,0.35);',
    PAYMENT_SENT: 'background:rgba(168,85,247,0.15);color:#a855f7;border:1px solid rgba(168,85,247,0.35);',
    ACTIVE:       'background:rgba(2,192,118,0.15);color:#02c076;border:1px solid rgba(2,192,118,0.35);',
    COMPLETED:    'background:rgba(100,116,139,0.15);color:#64748b;border:1px solid rgba(100,116,139,0.35);',
    CANCELLED:    'background:rgba(100,116,139,0.10);color:#94a3b8;border:1px solid rgba(100,116,139,0.2);',
    PENDING:      'background:rgba(245,158,11,0.15);color:#f59e0b;border:1px solid rgba(245,158,11,0.35);',
    IN_PROGRESS:  'background:rgba(59,130,246,0.15);color:#3b82f6;border:1px solid rgba(59,130,246,0.35);',
  };
  const style = map[s] || map[s.replace(/ /g,'_')] || 'background:rgba(255,255,255,0.06);color:var(--text-2);border:1px solid var(--border);';
  return `<span style="padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;${style}">${s || '—'}</span>`;
}

function renderP2PTradesTable(orders, tab) {
  const tbody = document.getElementById('p2pTradesTableBody');
  if (!tbody) return;
  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-2);padding:40px;">No ${tab} orders found.</td></tr>`;
    return;
  }
  tbody.innerHTML = orders.map(o => {
    const id = escapeHtml(o.id || o.reference || '-');
    const buyer  = escapeHtml(o.buyerUsername  || o.buyerUserId  || '-');
    const seller = escapeHtml(o.sellerUsername || o.sellerUserId || '-');
    const amount = o.amountInr ? `₹${formatNumber(o.amountInr, 2)}` : formatNumber(o.assetAmount || o.escrowAmount || 0, 4);
    const asset  = escapeHtml(o.asset || 'USDT');
    const status = String(o.status || '').toUpperCase();
    const created = formatDate(o.createdAt);

    // Action buttons based on status and tab
    let actions = `<button onclick="openP2PChat('${escapeHtml(o.id)}')" style="padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:none;color:var(--text-2);font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;">💬 Chat</button>`;
    if (status === 'DISPUTED') {
      actions += ` <button onclick="openP2PChat('${escapeHtml(o.id)}')" style="padding:4px 10px;border-radius:6px;border:1px solid rgba(245,158,11,0.4);background:rgba(245,158,11,0.1);color:#f59e0b;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;">Dispute ⚠️</button>`;
    } else if (status === 'PAYMENT_SENT' || status === 'PAID') {
      actions += ` <button onclick="adminReleaseEscrow('${escapeHtml(o.id)}',this)" style="padding:4px 10px;border-radius:6px;border:1px solid rgba(2,192,118,0.4);background:rgba(2,192,118,0.12);color:#02c076;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;">Release</button>`;
    } else if (status === 'ACTIVE') {
      actions += ` <button onclick="adminP2PCancelOrder('${escapeHtml(o.id)}',this)" style="padding:4px 10px;border-radius:6px;border:1px solid var(--border);background:rgba(100,116,139,0.1);color:#94a3b8;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;">Cancel</button>`;
    }

    return `<tr>
      <td class="admin-td" style="font-family:monospace;font-size:11px;color:var(--accent);">${id.slice(0,12)}…</td>
      <td class="admin-td" style="font-size:12px;color:#3b82f6;font-weight:600;">${buyer}</td>
      <td class="admin-td" style="font-size:12px;color:#22c55e;font-weight:600;">${seller}</td>
      <td class="admin-td" style="font-weight:700;">${amount}</td>
      <td class="admin-td">${asset}</td>
      <td class="admin-td">${p2pStatusBadge(o.status)}</td>
      <td class="admin-td" style="font-size:11px;white-space:nowrap;">${created}</td>
      <td class="admin-td" style="white-space:nowrap;">${actions}</td>
    </tr>`;
  }).join('');
}

function switchP2PTab(tab) {
  _p2pActiveTab = tab;
  // Update tab button styles
  document.querySelectorAll('.p2p-tab').forEach(btn => {
    const isActive = btn.getAttribute('data-p2p-tab') === tab;
    btn.style.color = isActive ? 'var(--text-1)' : 'var(--text-2)';
    btn.style.borderBottom = isActive ? '2px solid var(--accent)' : '2px solid transparent';
  });
  // Show/hide sub-filters
  const subFilters = document.getElementById('p2pSubFilters');
  if (subFilters) subFilters.style.display = tab === 'trades' ? 'flex' : 'none';
  loadP2PTab(tab);
}

async function loadP2PTab(tab) {
  const tbody = document.getElementById('p2pTradesTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-2);padding:32px;"><div class="spin" style="margin:auto;"></div></td></tr>';

  try {
    let orders = [];
    if (tab === 'trades') {
      const data = await apiRequest('/p2p/trades?status=ACTIVE&limit=50').catch(() => apiRequest('/p2p/orders?status=ACTIVE&limit=50').catch(() => ({ trades: [], orders: [] })));
      orders = Array.isArray(data.trades) ? data.trades : Array.isArray(data.orders) ? data.orders : [];
    } else if (tab === 'ads') {
      const data = await apiRequest('/p2p/ads?status=ACTIVE&limit=50').catch(() => ({ ads: [] }));
      orders = Array.isArray(data.ads) ? data.ads : [];
      // Render ads as table rows (slightly different fields)
      if (!orders.length) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-2);padding:40px;">No active ads found.</td></tr>';
        return;
      }
      tbody.innerHTML = orders.map(ad => {
        const id = escapeHtml(ad.id || '-');
        const advertiser = escapeHtml(ad.advertiser || ad.userId || '-');
        const side = (ad.side || '').toUpperCase();
        const sideColor = side === 'BUY' ? '#02c076' : '#f6465d';
        return `<tr>
          <td class="admin-td" style="font-family:monospace;font-size:11px;color:var(--accent);">${id.slice(0,12)}…</td>
          <td class="admin-td" style="color:${sideColor};font-weight:700;">${side}</td>
          <td class="admin-td">${advertiser}</td>
          <td class="admin-td">₹${formatNumber(ad.price, 2)}</td>
          <td class="admin-td">${escapeHtml(ad.asset || 'USDT')}</td>
          <td class="admin-td">${p2pStatusBadge(ad.moderationStatus || ad.status || 'ACTIVE')}</td>
          <td class="admin-td" style="font-size:11px;">₹${formatNumber(ad.minLimit,2)} – ₹${formatNumber(ad.maxLimit,2)}</td>
          <td class="admin-td">
            <button class="btn-primary btn-sm" data-p2p-action="approve-ad" data-offer-id="${id}">Approve</button>
            <button class="btn-secondary btn-sm" data-p2p-action="suspend-ad" data-offer-id="${id}">Suspend</button>
            <button class="btn-danger btn-sm" data-p2p-action="reject-ad" data-offer-id="${id}">Reject</button>
          </td>
        </tr>`;
      }).join('');
      return;
    } else if (tab === 'completed') {
      const data = await apiRequest('/p2p/trades?status=COMPLETED&limit=50').catch(() => apiRequest('/p2p/orders?status=COMPLETED&limit=50').catch(() => ({ trades: [], orders: [] })));
      orders = Array.isArray(data.trades) ? data.trades : Array.isArray(data.orders) ? data.orders : [];
    } else if (tab === 'disputed') {
      const data = await apiRequest('/p2p/disputes?limit=50').catch(() => apiRequest('/p2p/trades?status=DISPUTED&limit=50').catch(() => ({ disputes: [], trades: [] })));
      orders = Array.isArray(data.disputes) ? data.disputes : Array.isArray(data.trades) ? data.trades : [];
    } else if (tab === 'cancelled') {
      const data = await apiRequest('/p2p/trades?status=CANCELLED&limit=50').catch(() => apiRequest('/p2p/orders?status=CANCELLED&limit=50').catch(() => ({ trades: [], orders: [] })));
      orders = Array.isArray(data.trades) ? data.trades : Array.isArray(data.orders) ? data.orders : [];
    }

    // Update sub-filter counts for trades tab
    if (tab === 'trades') {
      const disputed = orders.filter(o => (o.status||'').toUpperCase() === 'DISPUTED').length;
      const paymentSent = orders.filter(o => ['PAYMENT_SENT','PAID'].includes((o.status||'').toUpperCase())).length;
      const dispEl = document.getElementById('p2pSubFilter-disputed');
      const payEl  = document.getElementById('p2pSubFilter-payment');
      if (dispEl) { dispEl.style.display = disputed > 0 ? '' : 'none'; dispEl.textContent = `DISPUTED: ${disputed}`; }
      if (payEl)  { payEl.style.display  = paymentSent > 0 ? '' : 'none'; payEl.textContent = `PAYMENT SENT: ${paymentSent}`; }
    }

    renderP2PTradesTable(orders, tab);
  } catch (err) {
    if (tbody) tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--red);padding:32px;">Error: ${escapeHtml(err.message)}</td></tr>`;
  }
}

async function openP2PChat(orderId) {
  const modal = document.getElementById('p2pChatModal');
  const metaEl = document.getElementById('p2pChatModalMeta');
  const messagesEl = document.getElementById('p2pChatMessages');
  if (!modal || !messagesEl) return;

  metaEl.textContent = `Order: ${orderId}`;
  messagesEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-2);">Loading chat…</div>';
  modal.style.display = 'flex';
  modal._orderId = orderId;

  try {
    const data = await apiRequest(`/p2p/trades/${encodeURIComponent(orderId)}/chat`).catch(() =>
      apiRequest(`/p2p/orders/${encodeURIComponent(orderId)}/messages`).catch(() => ({ messages: [], chatMessages: [] }))
    );
    const msgs = Array.isArray(data.messages) ? data.messages : Array.isArray(data.chatMessages) ? data.chatMessages : [];
    const buyerLabel  = data.buyerUsername  || data.buyerUserId  || 'Buyer';
    const sellerLabel = data.sellerUsername || data.sellerUserId || 'Seller';
    metaEl.textContent = `Order: ${orderId} • Buyer: ${buyerLabel} • Seller: ${sellerLabel}`;

    if (!msgs.length) {
      messagesEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-2);">No chat messages yet.</div>';
    } else {
      messagesEl.innerHTML = msgs.map(msg => buildDisputeMsgBubble(msg, buyerLabel, sellerLabel)).join('');
      setTimeout(() => { messagesEl.scrollTop = messagesEl.scrollHeight; }, 50);
    }
  } catch (err) {
    messagesEl.innerHTML = `<div style="text-align:center;padding:40px;color:var(--red);">Error: ${escapeHtml(err.message)}</div>`;
  }
}

async function sendP2PChatMessage() {
  const modal = document.getElementById('p2pChatModal');
  const input = document.getElementById('p2pChatInput');
  if (!modal || !input) return;
  const orderId = modal._orderId;
  const message = (input.value || '').trim();
  if (!orderId || !message) return;
  input.value = '';
  try {
    await apiRequest(`/p2p/trades/${encodeURIComponent(orderId)}/chat`, { method: 'POST', body: JSON.stringify({ message }) })
      .catch(() => apiRequest(`/p2p/orders/${encodeURIComponent(orderId)}/admin-reply`, { method: 'POST', body: JSON.stringify({ message }) }));
    await openP2PChat(orderId);
  } catch (err) {
    showMessage(err.message || 'Failed to send message.', 'error');
  }
}

async function adminP2PCancelOrder(orderId, btn) {
  if (!confirm('Cancel this P2P order?')) return;
  if (btn) { btn.disabled = true; btn.textContent = '…'; }
  try {
    await apiRequest(`/p2p/orders/${encodeURIComponent(orderId)}/cancel`, { method: 'POST', body: JSON.stringify({}) });
    showMessage('Order cancelled.', 'success');
    loadP2PTab(_p2pActiveTab);
  } catch (err) {
    showMessage(err.message || 'Cancel failed.', 'error');
    if (btn) { btn.disabled = false; btn.textContent = 'Cancel'; }
  }
}

async function loadP2P() {
  // Load all tabs counts first (parallel)
  const [tradesData, adsData, completedData, disputesData, cancelledData, settingsPayload] = await Promise.all([
    apiRequest('/p2p/trades?status=ACTIVE&limit=50').catch(() => apiRequest('/p2p/orders?status=ACTIVE&limit=50').catch(() => ({}))),
    apiRequest('/p2p/ads?status=ACTIVE&limit=50').catch(() => ({ ads: [] })),
    apiRequest('/p2p/trades?status=COMPLETED&limit=5').catch(() => apiRequest('/p2p/orders?status=COMPLETED&limit=5').catch(() => ({}))),
    apiRequest('/p2p/disputes?limit=50').catch(() => apiRequest('/p2p/trades?status=DISPUTED&limit=50').catch(() => ({}))),
    apiRequest('/p2p/trades?status=CANCELLED&limit=5').catch(() => apiRequest('/p2p/orders?status=CANCELLED&limit=5').catch(() => ({}))),
    apiRequest('/p2p/settings').catch(() => ({ settings: {} }))
  ]);

  const tradesCount   = (tradesData.trades || tradesData.orders || []).length;
  const adsCount      = (adsData.ads || []).length;
  const completedCount = (completedData.trades || completedData.orders || []).length;
  const disputesArr   = disputesData.disputes || disputesData.trades || [];
  const cancelledCount = (cancelledData.trades || cancelledData.orders || []).length;

  // Update tab count badges
  const setCount = (tabName, count) => {
    const el = document.getElementById(`p2pTabCount-${tabName}`);
    if (el) el.textContent = count;
  };
  setCount('trades', tradesCount);
  setCount('ads', adsCount);
  setCount('completed', completedCount);
  setCount('disputed', disputesArr.length);
  setCount('cancelled', cancelledCount);

  // Update P2P dispute sidebar badge
  const p2pBadge = document.getElementById('p2pDisputeBadge');
  if (p2pBadge) {
    if (disputesArr.length > 0) { p2pBadge.textContent = disputesArr.length; p2pBadge.style.display = ''; }
    else { p2pBadge.style.display = 'none'; }
  }

  // Keep old dispute cards data available for backward compat
  const disputesList = document.getElementById('p2pDisputesList');
  if (disputesList) {
    disputesList.innerHTML = disputesArr.map(order => renderP2PDisputeCard(order)).join('');
  }

  // Save settings
  const settings = settingsPayload.settings || {};
  const form = document.getElementById('p2pSettingsForm');
  if (form) {
    form.p2pFeePercent.value = settings.p2pFeePercent ?? 0;
    form.minOrderLimit.value = settings.minOrderLimit ?? 0;
    form.maxOrderLimit.value = settings.maxOrderLimit ?? 0;
    form.autoExpiryMinutes.value = settings.autoExpiryMinutes ?? 15;
  }

  // Load current active tab
  loadP2PTab(_p2pActiveTab);
}

// ─────────────────────────────────────────────────────────────────────────────
// Support Tickets — Full Chat Interface
// ─────────────────────────────────────────────────────────────────────────────

async function loadSupport() {
  const statusFilter = document.getElementById('supportStatusFilter')?.value || '';
  const query = new URLSearchParams({ limit: '50' });
  if (statusFilter) query.set('status', statusFilter);

  let payload;
  try {
    payload = await apiRequest(`/support/tickets?${query.toString()}`);
  } catch (e) {
    document.getElementById('supportTicketsList').innerHTML =
      `<div style="padding:24px;color:var(--red);font-size:13px;text-align:center;">⚠️ Failed to load: ${e.message}</div>`;
    return;
  }

  const tickets = Array.isArray(payload.tickets) ? payload.tickets : [];
  const list = document.getElementById('supportTicketsList');

  // Update sidebar badge
  const openCount = tickets.filter(t => (t.status || '').toUpperCase() !== 'CLOSED').length;
  const badge = document.getElementById('supportBadge');
  if (badge) { badge.style.display = openCount > 0 ? '' : 'none'; badge.textContent = openCount; }
  const countEl = document.getElementById('supportOpenCount');
  if (countEl) countEl.textContent = openCount > 0 ? `${openCount} open` : '';

  if (tickets.length === 0) {
    list.innerHTML = `<div style="padding:48px 16px;text-align:center;color:var(--text-2);">
      <div style="font-size:40px;margin-bottom:10px;">🎉</div>
      <p style="font-size:13px;font-weight:600;margin:0 0 4px;">All clear!</p>
      <p style="font-size:11px;opacity:.6;margin:0;">No support tickets found</p>
    </div>`;
    return;
  }

  list.innerHTML = tickets.map((ticket) => {
    const messages = Array.isArray(ticket.messages) ? ticket.messages : [];
    const lastMsg = messages[messages.length - 1];
    const isActive = ticket.id === state.support.activeTicketId;
    const statusStr = (ticket.status || '').toUpperCase();
    const unread = statusStr === 'OPEN';
    const priorityColor = ticket.priority === 'HIGH' ? 'var(--red)' : ticket.priority === 'MEDIUM' ? 'var(--accent)' : 'var(--text-2)';

    // User label: use email if available, otherwise make userId readable
    const userId = ticket.userId || '';
    const userLabel = ticket.email || ticket.userEmail ||
      (userId ? userId.replace('usr_', '').slice(0,16) : 'Unknown User');

    // Last message preview
    const lastSenderIsAdmin = lastMsg && lastMsg.sender !== 'user';
    const preview = lastMsg
      ? `${lastSenderIsAdmin ? '🛡 You: ' : '👤 '}${String(lastMsg.text || '').slice(0, 48)}${lastMsg.text?.length > 48 ? '…' : ''}`
      : 'No messages yet…';

    // User avatar (first letter of userId or email)
    const avatarChar = (userLabel[0] || '?').toUpperCase();
    const avatarColors = ['#00b8d4','#02c076','#4263eb','#f6465d','#a855f7'];
    const avatarColor = avatarColors[avatarChar.charCodeAt(0) % avatarColors.length];

    return `<div class="support-ticket-item${isActive ? ' active' : ''}"
         data-support-ticket-id="${ticket.id}"
         style="cursor:pointer;display:flex;gap:10px;align-items:flex-start;">
      <!-- Avatar -->
      <div style="width:34px;height:34px;border-radius:50%;background:${avatarColor}20;border:2px solid ${avatarColor}40;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:${avatarColor};flex-shrink:0;margin-top:1px;">${avatarChar}</div>
      <!-- Content -->
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;margin-bottom:2px;">
          <span style="font-size:13px;font-weight:700;color:var(--text-1);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${userLabel}</span>
          <span style="font-size:10px;color:var(--text-2);flex-shrink:0;">${formatDate(ticket.updatedAt)}</span>
        </div>
        <p style="font-size:11px;color:var(--text-2);margin:0 0 3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${ticket.subject || 'No Subject'}</p>
        <p style="font-size:11px;color:var(--text-2);margin:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;opacity:.65;">${preview}</p>
        <div style="display:flex;align-items:center;gap:5px;margin-top:4px;">
          ${statusBadge(ticket.status || 'OPEN')}
          ${ticket.priority ? `<span style="font-size:10px;color:${priorityColor};font-weight:600;">${ticket.priority}</span>` : ''}
        </div>
      </div>
      ${unread ? '<span style="position:absolute;top:11px;right:10px;width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 6px var(--accent);"></span>' : ''}
    </div>`;
  }).join('');
}

async function openTicket(ticketId) {
  state.support.activeTicketId = ticketId;

  // Highlight active ticket in list
  document.querySelectorAll('[data-support-ticket-id]').forEach((el) => {
    el.classList.toggle('active', el.getAttribute('data-support-ticket-id') === ticketId);
  });

  // Show chat, hide empty state
  const emptyEl = document.getElementById('supportChatEmpty');
  const activeEl = document.getElementById('supportChatActive');
  if (emptyEl) { emptyEl.style.display = 'none'; emptyEl.classList.add('hidden'); }
  if (activeEl) {
    activeEl.classList.remove('hidden');
    activeEl.style.removeProperty('display'); // let CSS class handle it
    activeEl.style.display = 'flex';          // force show as flex
  }

  // Show loading in messages area
  const chatMessages = document.getElementById('supportChatMessages');
  if (chatMessages) chatMessages.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-2);">
    <div class="spin" style="margin:auto;"></div><p style="margin-top:12px;font-size:13px;">Loading conversation…</p></div>`;

  await renderTicketChat(ticketId);

  // Poll every 10 seconds
  if (state.support.pollInterval) clearInterval(state.support.pollInterval);
  state.support.pollInterval = setInterval(async () => {
    if (state.support.activeTicketId === ticketId && state.currentView === 'support') {
      await renderTicketChat(ticketId, true);
    }
  }, 10000);
}

async function renderTicketChat(ticketId, silent = false) {
  try {
    const ticket = await apiRequest(`/support/tickets/${encodeURIComponent(ticketId)}`);

    // ─── Header ───
    const nameEl = document.getElementById('chatUserName');
    const subjectEl = document.getElementById('chatTicketSubject');
    const metaEl = document.getElementById('chatTicketMeta');
    const badgeEl = document.getElementById('chatTicketStatusBadge');

    if (nameEl) {
      // Try to get user email from ticket or fallback to userId
      const userLabel = ticket.email || ticket.userEmail || ticket.userId || 'Unknown User';
      nameEl.textContent = userLabel;
      nameEl.title = userLabel;
    }
    if (subjectEl) subjectEl.textContent = ticket.subject || 'No Subject';
    if (metaEl) metaEl.textContent = `ID: ${ticket.id} • Priority: ${ticket.priority || 'NORMAL'}`;
    if (badgeEl) badgeEl.innerHTML = statusBadge(ticket.status || 'OPEN');

    // ─── Messages ───
    const messages = Array.isArray(ticket.messages) ? ticket.messages : [];
    const chatMessages = document.getElementById('supportChatMessages');
    const wasAtBottom = !chatMessages || (chatMessages.scrollHeight - chatMessages.clientHeight - chatMessages.scrollTop < 60);

    if (chatMessages) {
      chatMessages.innerHTML = messages.length === 0
        ? `<div style="text-align:center;padding:48px 20px;color:var(--text-2);">
            <div style="font-size:36px;margin-bottom:10px;">💬</div>
            <p style="font-size:13px;font-weight:600;margin:0 0 4px;">No messages yet</p>
            <p style="font-size:12px;opacity:.6;margin:0;">Start the conversation with the user</p>
          </div>`
        : messages.map((msg) => {
            const isAdmin = msg.sender !== 'user';
            const senderName = isAdmin
              ? (msg.senderRole ? `${msg.sender || 'Admin'} (${msg.senderRole})` : (msg.sender || 'Admin'))
              : '👤 User';
            const text = String(msg.text || '').replace(/</g,'&lt;').replace(/>/g,'&gt;');
            return `<div style="display:flex;flex-direction:column;max-width:80%;
                    ${isAdmin ? 'align-self:flex-end;align-items:flex-end;' : 'align-self:flex-start;align-items:flex-start;'}">
              <div style="background:${isAdmin ? 'rgba(0,229,255,0.10)' : 'var(--bg-card2)'};
                           border:1px solid ${isAdmin ? 'rgba(0,229,255,0.25)' : 'var(--border)'};
                           border-radius:${isAdmin ? '14px 14px 2px 14px' : '14px 14px 14px 2px'};
                           padding:9px 14px;">
                <p style="font-size:11px;font-weight:700;margin:0 0 4px;color:${isAdmin ? 'var(--accent)' : 'var(--green)'};">${senderName}</p>
                <p style="font-size:13px;color:var(--text-1);margin:0;white-space:pre-wrap;line-height:1.55;">${text}</p>
              </div>
              <span style="font-size:10px;color:var(--text-2);margin-top:4px;opacity:.55;">${formatDate(msg.createdAt)}</span>
            </div>`;
          }).join('');

      if (wasAtBottom || !silent) chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ─── Button states ───
    const isClosed = String(ticket.status || '').toUpperCase() === 'CLOSED';
    const closeBtn  = document.getElementById('chatCloseTicketBtn');
    const resolveBtn = document.getElementById('chatResolveBtn');
    const sendBtn   = document.getElementById('sendReplyBtn');
    const input     = document.getElementById('supportChatInput');
    const qbar      = document.getElementById('quickRepliesBar');

    if (closeBtn)   closeBtn.disabled   = isClosed;
    if (resolveBtn) resolveBtn.disabled = isClosed;
    if (sendBtn)    sendBtn.disabled    = isClosed;
    if (qbar)       qbar.style.opacity  = isClosed ? '0.4' : '1';
    if (input) {
      input.disabled = isClosed;
      input.placeholder = isClosed ? '🔒 Ticket is closed — cannot reply' : 'Type your reply… (Ctrl+Enter to send)';
    }

    if (silent) loadSupport();
  } catch (error) {
    if (!silent) {
      const chatMessages = document.getElementById('supportChatMessages');
      if (chatMessages) chatMessages.innerHTML = `<div style="color:var(--red);text-align:center;padding:40px;font-size:13px;">
        ❌ ${error.message || 'Failed to load conversation'}</div>`;
      showMessage(error.message || 'Failed to load ticket.', 'error');
    }
  }
}

function useQuickReply(text) {
  const input = document.getElementById('supportChatInput');
  if (!input || input.disabled) return;
  input.value = text;
  input.focus();
  input.setSelectionRange(text.length, text.length);
}

async function sendAdminReply() {
  const ticketId = state.support.activeTicketId;
  if (!ticketId) return;

  const input = document.getElementById('supportChatInput');
  const message = String(input?.value || '').trim();
  if (!message) { input?.focus(); return; }

  const sendBtn = document.getElementById('sendReplyBtn');
  setActionButtonLoading(sendBtn, true, 'Sending…');

  try {
    await apiRequest(`/support/tickets/${encodeURIComponent(ticketId)}/reply`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
    if (input) input.value = '';
    await renderTicketChat(ticketId);
    await loadSupport();
  } catch (error) {
    showMessage(error.message || 'Failed to send reply.', 'error');
  } finally {
    setActionButtonLoading(sendBtn, false);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Revenue
// ─────────────────────────────────────────────────────────────────────────────

async function loadRevenue() {
  const payload = await apiRequest('/revenue/summary');

  renderCards('revenueCards', [
    { icon: '📆', label: 'Total Revenue (Today)', value: `₹${formatNumber(payload.totalRevenue?.today || 0, 2)}` },
    { icon: '📊', label: 'Total Revenue (Week)', value: `₹${formatNumber(payload.totalRevenue?.week || 0, 2)}` },
    { icon: '💹', label: 'Total Revenue (Month)', value: `₹${formatNumber(payload.totalRevenue?.month || 0, 2)}` },
    { icon: '🔁', label: 'Spot Fee Earnings', value: `₹${formatNumber(payload.spotFeeEarnings || 0, 2)}` },
    { icon: '🤝', label: 'P2P Earnings', value: `₹${formatNumber(payload.p2pEarnings || 0, 2)}` },
    { icon: '⚡', label: 'Withdrawal Fee Earnings', value: `₹${formatNumber(payload.withdrawalFeeEarnings || 0, 2)}` }
  ]);

  const trend = Array.isArray(payload.trend) ? payload.trend : [];
  drawChart(
    'revenue',
    'revenueChart',
    trend.map((point) => point.date),
    trend.map((point) => Number(point.revenue || 0)),
    '#00b8d4'
  );

  // ── Revenue Donut Chart ──
  const rp2p   = Number(payload.p2pEarnings || 0);
  const rspot  = Number(payload.spotFeeEarnings || 0);
  const rwdfee = Number(payload.withdrawalFeeEarnings || 0);
  const rother = Math.max(0, Number(payload.totalRevenue?.month || 0) - rp2p - rspot - rwdfee);
  const rdData   = [rp2p, rspot, rwdfee, rother];
  const rdLabels = ['P2P', 'Spot Fees', 'Withdrawal', 'Other'];
  const rdColors = ['#00b8d4', '#0099a8', '#38bdf8', '#0ea5e9'];
  const rdTotal  = rp2p + rspot + rwdfee + rother;

  const rdTotalEl = document.getElementById('revDonutTotal');
  if (rdTotalEl) rdTotalEl.textContent = '₹' + formatNumber(rdTotal, 2);

  const rdCanvas = document.getElementById('revDonutChart');
  if (rdCanvas) {
    if (state.charts['revDonut']) state.charts['revDonut'].destroy();
    state.charts['revDonut'] = new Chart(rdCanvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: rdLabels,
        datasets: [{
          data: rdTotal > 0 ? rdData : [1,1,1,1],
          backgroundColor: rdColors,
          borderWidth: 0,
          borderRadius: 8,
          spacing: 4,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: { legend: { display: false }, tooltip: {
          backgroundColor: '#141821',
          borderColor: 'rgba(0,229,255,0.2)',
          borderWidth: 1,
          callbacks: { label: function(ctx) { return ' ₹' + formatNumber(ctx.parsed, 2); } }
        }}
      }
    });
  }

  const rdLegend = document.getElementById('revDonutLegend');
  if (rdLegend) {
    rdLegend.innerHTML = rdLabels.map(function(lbl, i) {
      var pct = rdTotal > 0 ? ((rdData[i] / rdTotal) * 100).toFixed(1) : '0.0';
      return '<div style="display:flex;align-items:center;justify-content:space-between;font-size:11px;">'
        + '<span style="display:flex;align-items:center;gap:6px;color:var(--text-2);">'
        + '<span style="width:9px;height:9px;border-radius:3px;background:' + rdColors[i] + ';flex-shrink:0;display:inline-block;"></span>' + lbl + '</span>'
        + '<span style="color:#fff;font-weight:700;">₹' + formatNumber(rdData[i], 2) + ' <span style="color:' + rdColors[i] + ';font-size:10px;">(' + pct + '%)</span></span></div>';
    }).join('');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Risk Management
// ─────────────────────────────────────────────────────────────────────────────

function saveAutoFlagRules() {
  // console.warn: no backend endpoint for auto-flag rules yet — stored client-side only
  console.warn('[Risk] Auto-flag rules: no backend endpoint — changes are not persisted');
  showMessage('Auto-flag rules saved (client-side only — no backend endpoint yet).', 'success');
}

async function loadRisk() {
  const [configPayload, blockedIpsPayload, suspiciousPayload, flaggedPayload] = await Promise.all([
    apiRequest('/risk/config').catch(() => ({ config: {} })),
    apiRequest('/risk/blocked-ips').catch(() => ({ blockedIPs: [] })),
    apiRequest('/risk/suspicious').catch(() => ({ alerts: [] })),
    // console.warn: /api/admin/risk/flagged may not exist
    apiRequest('/risk/flagged').catch(() => ({ flagged: [] }))
  ]);

  const config = configPayload.config || {};
  const form = document.getElementById('riskConfigForm');
  if (form) {
    form.maxLeverage.value = config.maxLeverage ?? '';
    form.maxWithdrawalAmount.value = config.maxWithdrawalAmount ?? '';
    if (form.maxSingleTx) form.maxSingleTx.value = config.maxSingleTx ?? '';
    form.minWithdrawalAmount.value = config.minWithdrawalAmount ?? '';
    if (form.minKycLevel) form.minKycLevel.value = config.minKycLevel ?? 'FULL';
    form.amlRiskThreshold.value = config.amlRiskThreshold ?? 75;
  }

  const blockedIps = Array.isArray(blockedIpsPayload.blockedIPs) ? blockedIpsPayload.blockedIPs : [];
  const blockedList = document.getElementById('blockedIpsList');
  if (blockedList) {
    blockedList.innerHTML = blockedIps.length === 0
      ? '<p class="text-sm text-slate-500">No blocked IPs.</p>'
      : blockedIps.map((item) => `
        <div class="list-item flex items-center justify-between gap-2">
          <div>
            <p class="text-sm font-semibold font-mono">${item.ip || item.ipAddress || '-'}</p>
            <p class="text-xs text-slate-400">${item.reason || '-'}</p>
            <p class="text-xs text-slate-500">${formatDate(item.blockedAt || item.createdAt)}</p>
          </div>
          <button class="btn-danger !py-1 !text-xs flex-shrink-0" data-risk-action="unblock" data-block-id="${item.id || item._id}">Unblock</button>
        </div>
      `).join('');
  }

  const alerts = Array.isArray(suspiciousPayload.alerts) ? suspiciousPayload.alerts : [];
  const alertsList = document.getElementById('suspiciousAlertsList');
  if (alertsList) {
    alertsList.innerHTML = alerts.length === 0
      ? '<p style="font-size:12px;color:var(--text-2);padding:8px;">No suspicious activity alerts.</p>'
      : alerts.map((alert) => `
        <div class="list-item">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;">
            <p style="font-size:13px;font-weight:600;color:var(--text-1);margin:0;">${escH(alert.type || 'Alert')}</p>
            ${statusBadge(alert.severity || 'MEDIUM')}
          </div>
          <p style="font-size:12px;color:var(--text-2);margin:4px 0 0;">User: ${escH(alert.userId || '—')}</p>
          <p style="font-size:12px;color:var(--text-2);margin:2px 0 0;">${escH(alert.reason || '—')}</p>
          <p style="font-size:11px;color:var(--text-2);opacity:.6;margin:2px 0 0;">${formatDate(alert.createdAt)}</p>
        </div>
      `).join('');
  }

  // Flagged accounts table
  const flagged = Array.isArray(flaggedPayload.flagged) ? flaggedPayload.flagged
    : Array.isArray(flaggedPayload.accounts) ? flaggedPayload.accounts : [];
  const flaggedBody = document.getElementById('flaggedAccountsBody');
  if (flaggedBody) {
    if (flagged.length === 0) {
      flaggedBody.innerHTML = '<tr><td class="admin-td" colspan="6" style="text-align:center;color:var(--text-2);padding:28px;">No flagged accounts.</td></tr>';
    } else {
      flaggedBody.innerHTML = flagged.map((acct) => {
        const score = Number(acct.riskScore || acct.score || 0);
        const scoreColor = score > 80 ? '#f6465d' : score > 50 ? '#F68F15' : '#02c076';
        const isBlocked = (acct.status || '').toUpperCase() === 'BLOCKED';
        return `<tr>
          <td class="admin-td" style="font-family:monospace;font-size:11px;">${escH(acct.userId||'—')}</td>
          <td class="admin-td">${escH(acct.email||'—')}</td>
          <td class="admin-td"><span style="font-size:13px;font-weight:700;color:${scoreColor};">${score}</span></td>
          <td class="admin-td" style="font-size:12px;">${escH(acct.reason||acct.flagReason||'—')}</td>
          <td class="admin-td">${formatDate(acct.flaggedAt||acct.createdAt)}</td>
          <td class="admin-td">
            ${isBlocked
              ? `<button class="btn-secondary btn-sm" data-risk-action="unblock-user" data-user-id="${escH(acct.userId)}">Unblock</button>`
              : `<button class="btn-danger btn-sm" data-risk-action="block-user" data-user-id="${escH(acct.userId)}">Block</button>`
            }
          </td>
        </tr>`;
      }).join('');
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature Flags
// ─────────────────────────────────────────────────────────────────────────────

async function loadFeatures() {
  const [flagsPayload, networkPayload] = await Promise.all([
    apiRequest('/features').catch(() => ({ flags: [] })),
    apiRequest('/features/network-status').catch(() => ({ networks: {} }))
  ]);

  const flags = Array.isArray(flagsPayload.flags) ? flagsPayload.flags : [];
  const togglesList = document.getElementById('featureTogglesList');
  if (togglesList) {
    if (flags.length === 0) {
      togglesList.innerHTML = '<p class="text-sm text-slate-500">No feature flags configured.</p>';
    } else {
      togglesList.innerHTML = flags.map((flag) => `
        <div class="flex items-center justify-between gap-3 rounded-xl border border-slate-800 px-4 py-3">
          <div>
            <p class="text-sm font-semibold">${flag.name || flag.key}</p>
            <p class="text-xs text-slate-400">${flag.description || flag.key}</p>
          </div>
          <label class="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" class="sr-only peer" ${flag.enabled ? 'checked' : ''}
                   onchange="toggleFeature('${flag.key}', this.checked)" />
            <div class="peer h-6 w-11 rounded-full bg-slate-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand peer-checked:after:translate-x-full"></div>
          </label>
        </div>
      `).join('');
    }
  }

  const networks = networkPayload.networks || {};
  const networkList = document.getElementById('networkStatusList');
  if (networkList) {
    const networkKeys = ['TRC20', 'ERC20', 'BEP20'];
    if (Object.keys(networks).length === 0 && !networkKeys.some((k) => networks[k])) {
      networkList.innerHTML = '<p class="text-sm text-slate-500">No network status data.</p>';
    } else {
      networkList.innerHTML = networkKeys.map((network) => {
        const net = networks[network] || {};
        return `
        <div class="rounded-xl border border-slate-800 px-4 py-3">
          <p class="text-sm font-semibold mb-2">${network}</p>
          <div class="flex gap-6">
            <label class="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" ${net.depositEnabled !== false ? 'checked' : ''}
                     onchange="setNetworkDeposit('${network}', this.checked)" class="h-4 w-4" />
              Deposits
            </label>
            <label class="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" ${net.withdrawalEnabled !== false ? 'checked' : ''}
                     onchange="setNetworkWithdrawal('${network}', this.checked)" class="h-4 w-4" />
              Withdrawals
            </label>
          </div>
        </div>
      `;
      }).join('');
    }
  }
}

async function toggleFeature(key, enabled) {
  try {
    await apiRequest(`/features/${encodeURIComponent(key)}`, {
      method: 'PUT',
      body: JSON.stringify({ enabled })
    });
    showMessage(`Feature '${key}' ${enabled ? 'enabled' : 'disabled'}.`, 'success');
  } catch (error) {
    showMessage(error.message || 'Failed to update feature flag.', 'error');
    await loadFeatures();
  }
}

async function setNetworkDeposit(network, enabled) {
  try {
    await apiRequest(`/features/network/${encodeURIComponent(network)}/deposit`, {
      method: 'PUT',
      body: JSON.stringify({ enabled })
    });
    showMessage(`${network} deposits ${enabled ? 'enabled' : 'disabled'}.`, 'success');
  } catch (error) {
    showMessage(error.message || 'Failed to update network deposit.', 'error');
  }
}

async function setNetworkWithdrawal(network, enabled) {
  try {
    await apiRequest(`/features/network/${encodeURIComponent(network)}/withdrawal`, {
      method: 'PUT',
      body: JSON.stringify({ enabled })
    });
    showMessage(`${network} withdrawals ${enabled ? 'enabled' : 'disabled'}.`, 'success');
  } catch (error) {
    showMessage(error.message || 'Failed to update network withdrawal.', 'error');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────────────────────

async function loadNotifications() {
  // console.warn: /api/admin/notifications may not exist — verify endpoint
  console.warn('[Notifications] GET /api/admin/notifications — verify this endpoint exists');
  const payload = await apiRequest('/notifications?limit=30').catch(() => ({ notifications: [] }));
  const notifs = Array.isArray(payload.notifications) ? payload.notifications : [];

  const tbody = document.getElementById('notificationsTableBody');
  if (tbody) {
    if (notifs.length === 0) {
      tbody.innerHTML = '<tr><td class="admin-td" colspan="7" style="text-align:center;color:var(--text-2);padding:28px;">No notifications sent yet.</td></tr>';
    } else {
      const typeColor = { INFO: '#00b8d4', WARNING: '#F68F15', SUCCESS: '#02c076', ALERT: '#f6465d' };
      tbody.innerHTML = notifs.map((n) => {
        const tCol = typeColor[(n.type||'INFO').toUpperCase()] || 'var(--text-2)';
        return `<tr>
          <td class="admin-td" style="font-family:monospace;font-size:11px;">${escH(String(n.id||'').slice(0,10))}</td>
          <td class="admin-td" style="font-size:13px;font-weight:600;">${escH(n.title||'—')}</td>
          <td class="admin-td" style="font-size:12px;">${escH(n.target||n.userId||'All')}</td>
          <td class="admin-td"><span style="font-size:11px;font-weight:700;color:${tCol};">${escH(n.type||'INFO')}</span></td>
          <td class="admin-td">${statusBadge(n.priority||'NORMAL')}</td>
          <td class="admin-td">${formatDate(n.createdAt||n.sentAt)}</td>
          <td class="admin-td" style="font-size:12px;">${n.recipientCount != null ? n.recipientCount : '—'}</td>
        </tr>`;
      }).join('');
    }
  }
}

async function broadcastNotification(title, message, priority, type, target, userId) {
  const body = { title, message, priority, type };
  if (target === 'specific' && userId) body.userId = userId;
  else body.target = 'all';
  // console.warn: /api/admin/notifications/broadcast — verify endpoint
  console.warn('[Notifications] POST /api/admin/notifications/broadcast — verify this endpoint exists');
  await apiRequest('/notifications/broadcast', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Blockchain
// ─────────────────────────────────────────────────────────────────────────────

async function loadBlockchain() {
  const [statsPayload, scannerPayload, queuePayload, txPayload] = await Promise.all([
    apiRequest('/blockchain/stats').catch(() => ({ stats: {} })),
    apiRequest('/blockchain/scanner-status').catch(() => ({ scanners: [] })),
    apiRequest('/blockchain/withdrawal-queue').catch(() => ({ queue: [] })),
    apiRequest('/blockchain/transactions?limit=20').catch(() => ({ transactions: [] }))
  ]);

  const scanners = Array.isArray(scannerPayload.scanners) ? scannerPayload.scanners
    : (scannerPayload.scanners ? Object.entries(scannerPayload.scanners).map(([k, v]) => ({ network: k, ...v })) : []);
  const cards = document.getElementById('blockchainScannerCards');
  if (cards) {
    if (scanners.length === 0) {
      cards.innerHTML = '<p class="text-sm text-slate-500 col-span-3">No scanner status data.</p>';
    } else {
      cards.innerHTML = scanners.map((s) => `
        <div class="stat-card">
          <div class="stat-icon">⛓️</div>
          <div class="stat-info">
            <div class="stat-label">${s.network || 'Scanner'}</div>
            <div class="stat-value" style="font-size:13px;">${statusBadge(s.status || s.connected ? 'CONNECTED' : 'ERROR')}</div>
            <div class="stat-meta">Block: ${s.latestBlock || s.blockHeight || '-'}</div>
          </div>
        </div>
      `).join('');
    }
  }

  const queue = Array.isArray(queuePayload.queue) ? queuePayload.queue : [];
  const queueBody = document.getElementById('withdrawalQueueBody');
  if (queueBody) {
    queueBody.innerHTML = queue.length === 0
      ? '<tr><td class="admin-td text-slate-500" colspan="5">Queue is empty.</td></tr>'
      : queue.map((item) => `
        <tr>
          <td class="admin-td font-mono text-xs">${String(item.id || '-').slice(0, 16)}</td>
          <td class="admin-td">${formatNumber(item.amount || 0, 6)} ${item.coin || 'USDT'}</td>
          <td class="admin-td">${item.network || '-'}</td>
          <td class="admin-td">${statusBadge(item.status || 'PENDING')}</td>
          <td class="admin-td">
            <button class="btn-secondary !py-1 !text-xs" data-blockchain-action="prioritize" data-id="${item.id}">Prioritize</button>
          </td>
        </tr>
      `).join('');
  }

  const txs = Array.isArray(txPayload.transactions) ? txPayload.transactions : [];
  const txBody = document.getElementById('blockchainTxBody');
  if (txBody) {
    txBody.innerHTML = txs.length === 0
      ? '<tr><td class="admin-td text-slate-500" colspan="5">No transactions.</td></tr>'
      : txs.map((tx) => `
        <tr>
          <td class="admin-td font-mono text-xs">${String(tx.txHash || tx.id || '-').slice(0, 16)}...</td>
          <td class="admin-td">${formatNumber(tx.amount || 0, 6)}</td>
          <td class="admin-td">${tx.network || '-'}</td>
          <td class="admin-td">${statusBadge(tx.status || 'PENDING')}</td>
          <td class="admin-td">
            ${String(tx.status || '').toUpperCase() === 'FAILED'
              ? `<button class="btn-secondary !py-1 !text-xs" data-blockchain-action="retry" data-id="${tx.id || tx.txHash}">Retry</button>`
              : '-'}
          </td>
        </tr>
      `).join('');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Compliance
// ─────────────────────────────────────────────────────────────────────────────

// Active compliance flag being reviewed
let _activeComplianceFlag = null;

async function loadCompliance() {
  const typeFilter = document.getElementById('compFlagTypeFilter')?.value || '';
  const query = new URLSearchParams({ limit: '60' });
  if (typeFilter) query.set('type', typeFilter);

  const payload = await apiRequest(`/compliance/flags?${query.toString()}`).catch(() => ({ flags: [] }));
  const flags = Array.isArray(payload.flags) ? payload.flags : [];

  // Stats
  const total    = flags.length;
  const highRisk = flags.filter(f => ['HIGH','CRITICAL'].includes((f.severity||'').toUpperCase())).length;
  const pending  = flags.filter(f => !['REVIEWED','CLEARED'].includes((f.status||'').toUpperCase())).length;
  const resolved = flags.filter(f => ['REVIEWED','CLEARED'].includes((f.status||'').toUpperCase())).length;
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('compStatTotal',   total);
  setEl('compStatHigh',    highRisk);
  setEl('compStatPending', pending);
  setEl('compStatResolved',resolved);

  const body = document.getElementById('complianceFlagsTableBody');
  if (!body) return;

  if (flags.length === 0) {
    body.innerHTML = '<tr><td class="admin-td" colspan="7" style="text-align:center;color:var(--text-2);padding:28px;">No compliance flags found.</td></tr>';
    return;
  }

  body.innerHTML = flags.map((flag) => {
    const sev = (flag.severity || 'MEDIUM').toUpperCase();
    const sevColor = sev === 'CRITICAL' || sev === 'HIGH' ? '#f6465d' : sev === 'MEDIUM' ? '#F68F15' : '#02c076';
    return `<tr>
      <td class="admin-td" style="font-family:monospace;font-size:11px;">${escH(String(flag.id||'').slice(0,12))}</td>
      <td class="admin-td" style="font-family:monospace;font-size:11px;">${escH(flag.userId||'—')}</td>
      <td class="admin-td" style="font-size:12px;">${escH(flag.type||'—')}</td>
      <td class="admin-td"><span style="font-size:11px;font-weight:700;color:${sevColor};">${sev}</span></td>
      <td class="admin-td">${statusBadge(flag.status||'PENDING')}</td>
      <td class="admin-td">${formatDate(flag.createdAt)}</td>
      <td class="admin-td">
        <button class="btn-secondary btn-sm" onclick="openComplianceFlagModal(${JSON.stringify(flag).replace(/"/g,'&quot;')})">Review</button>
      </td>
    </tr>`;
  }).join('');
}

function openComplianceFlagModal(flag) {
  _activeComplianceFlag = flag;
  const modal = document.getElementById('complianceFlagModal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.getElementById('compFlagModalMeta').textContent = `Flag ID: ${flag.id} • Created: ${formatDate(flag.createdAt)}`;
  document.getElementById('compFlagType').textContent     = flag.type     || '—';
  document.getElementById('compFlagSeverity').textContent = flag.severity || '—';
  document.getElementById('compFlagUserId').textContent   = flag.userId   || '—';
  document.getElementById('compFlagStatus').textContent   = flag.status   || '—';
  document.getElementById('compFlagReason').textContent   = flag.reason   || '—';
  document.getElementById('compFlagNotes').value = '';
}

async function resolveComplianceFlag(resolution) {
  if (!_activeComplianceFlag) return;
  const notes = document.getElementById('compFlagNotes')?.value || '';
  try {
    // console.warn: PATCH /api/admin/compliance/flags/:id may not exist — using best-guess path
    console.warn('[Compliance] PATCH /api/admin/compliance/flags/:id — verify this endpoint exists');
    await apiRequest(`/compliance/flags/${encodeURIComponent(_activeComplianceFlag.id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: resolution, notes })
    });
    showMessage(`Flag marked as ${resolution}.`, 'success');
    document.getElementById('complianceFlagModal').style.display = 'none';
    _activeComplianceFlag = null;
    await loadCompliance();
  } catch (e) {
    showMessage(e.message || 'Failed to update flag.', 'error');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────────────────────────────────

async function loadSettings() {
  const payload = await apiRequest('/settings/platform');
  const settings = payload.settings || {};
  const form = document.getElementById('platformSettingsForm');
  form.siteName.value = settings.siteName || '';
  form.logoUrl.value = settings.logoUrl || '';
  form.announcementBanner.value = settings.announcementBanner || '';
  form.referralCommissionPercent.value = settings.referralCommissionPercent ?? 0;
  form.signupBonusUsdt.value = settings.signupBonusUsdt ?? 0;
  form.smtpHost.value = settings.smtpHost || '';
  form.smtpPort.value = settings.smtpPort ?? 587;
  form.smtpUser.value = settings.smtpUser || '';
  form.smtpSecure.checked = Boolean(settings.smtpSecure);
  form.makerFee.value = settings.globalTradingFees?.maker ?? 0.001;
  form.takerFee.value = settings.globalTradingFees?.taker ?? 0.001;
  form.maintenanceMode.checked = Boolean(settings.maintenanceMode);
  form.requireKycBeforeWithdrawal.checked = Boolean(settings.compliance?.requireKycBeforeWithdrawal);
  form.spotEnabled.checked = Boolean(settings.features?.spotEnabled);
  form.p2pEnabled.checked = Boolean(settings.features?.p2pEnabled);
  form.walletEnabled.checked = Boolean(settings.features?.walletEnabled);
  form.referralsEnabled.checked = Boolean(settings.features?.referralsEnabled);
  form.supportEnabled.checked = Boolean(settings.features?.supportEnabled);
}

// ─────────────────────────────────────────────────────────────────────────────
// Monitoring
// ─────────────────────────────────────────────────────────────────────────────

async function loadMonitoring() {
  const [overview, apiLogs] = await Promise.all([
    apiRequest('/monitoring/overview'),
    apiRequest('/monitoring/api-logs?limit=30')
  ]);

  renderCards('monitoringCards', [
    { icon: '👥', label: 'Active Users', value: Number(overview.activeUsers || 0) },
    { icon: '🛡️', label: 'Active Admins', value: Number(overview.activeAdmins || 0) },
    { icon: '⚠️', label: 'Failed Logins (10m)', value: Number(overview.failedLoginAttemptsLast10Min || 0) },
    { icon: '🌐', label: 'API Requests (10m)', value: Number(overview.apiRequestsLast10Min || 0), meta: `DB: ${overview.dbConnected ? 'Connected' : 'Disconnected'}` }
  ]);

  const body = document.getElementById('monitoringApiLogsBody');
  const rows = Array.isArray(apiLogs.logs) ? apiLogs.logs : [];
  body.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td class="admin-td">${formatDate(row.createdAt)}</td>
        <td class="admin-td">${row.module || '-'}</td>
        <td class="admin-td">${row.action || '-'}</td>
        <td class="admin-td">${row.method || '-'}</td>
        <td class="admin-td">${statusBadge(row.statusCode && row.statusCode < 400 ? 'SUCCESS' : 'FAILURE')}</td>
        <td class="admin-td">${row.durationMs || 0} ms</td>
      </tr>
    `
    )
    .join('');

  if (rows.length === 0) {
    body.innerHTML = '<tr><td class="admin-td text-slate-500" colspan="6">No API logs available.</td></tr>';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Audit Logs
// ─────────────────────────────────────────────────────────────────────────────

async function loadAudit() {
  const payload = await apiRequest('/audit/logs?limit=40');
  const rows = Array.isArray(payload.logs) ? payload.logs : [];
  const body = document.getElementById('auditLogsBody');
  body.innerHTML = rows
    .map(
      (row) => `
      <tr>
        <td class="admin-td">${formatDate(row.createdAt)}</td>
        <td class="admin-td">${row.adminEmail || row.adminId || '-'}</td>
        <td class="admin-td">${row.module || '-'}</td>
        <td class="admin-td">${row.action || '-'}</td>
        <td class="admin-td">${statusBadge(row.status || 'SUCCESS')}</td>
        <td class="admin-td">${row.reason || '-'}</td>
      </tr>
    `
    )
    .join('');

  if (rows.length === 0) {
    body.innerHTML = '<tr><td class="admin-td text-slate-500" colspan="6">No audit logs available.</td></tr>';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Users
// ─────────────────────────────────────────────────────────────────────────────

async function loadAdminUsers() {
  const payload = await apiRequest('/admins').catch(() => ({ admins: [] }));
  const admins = Array.isArray(payload.admins) ? payload.admins : [];
  const body = document.getElementById('adminUsersTableBody');
  if (!body) {
    return;
  }

  body.innerHTML = admins
    .map(
      (admin) => `
      <tr>
        <td class="admin-td">${admin.email}</td>
        <td class="admin-td">${admin.username || '-'}</td>
        <td class="admin-td">${statusBadge(admin.role)}</td>
        <td class="admin-td">${statusBadge(admin.status || 'ACTIVE')}</td>
        <td class="admin-td">${formatDate(admin.lastLoginAt || admin.updatedAt)}</td>
        <td class="admin-td">
          <div class="flex gap-1">
            <button class="btn-secondary !py-1 !text-xs" data-admin-action="disable" data-admin-id="${admin.id}">
              ${String(admin.status || '').toUpperCase() === 'DISABLED' ? 'Enable' : 'Disable'}
            </button>
          </div>
        </td>
      </tr>
    `
    )
    .join('');

  if (admins.length === 0) {
    body.innerHTML = '<tr><td class="admin-td text-slate-500" colspan="6">No admin accounts found.</td></tr>';
  }
}

async function createAdmin(email, username, password, role) {
  return apiRequest('/admins', {
    method: 'POST',
    body: JSON.stringify({ email, username, password, role })
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Merchant Applications
// ─────────────────────────────────────────────────────────────────────────────

async function loadMerchants() {
  // Delegate to the inline loadMerchantApplications function defined in admin-dashboard.html
  if (typeof loadMerchantApplications === 'function') {
    try { await loadMerchantApplications(); } catch(e) { /* ignore */ }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Handlers
// ─────────────────────────────────────────────────────────────────────────────

async function handleUsersAction(event) {
  // Row click — open profile drawer
  const row = event.target.closest('tr.user-row');
  const button = event.target.closest('[data-user-action]');

  // If clicked on a button, handle that; otherwise open profile from row click
  if (!button) {
    if (row) {
      const profileId = row.getAttribute('data-profile-id');
      if (profileId) openUserProfile(profileId);
    }
    return;
  }

  const userId = button.getAttribute('data-user-id');
  const action = button.getAttribute('data-user-action');

  // Profile button
  if (action === 'profile') {
    openUserProfile(userId);
    return;
  }

  try {
    if (action === 'freeze' || action === 'unfreeze' || action === 'ban') {
      const status = action === 'freeze' ? 'FROZEN' : action === 'ban' ? 'BANNED' : 'ACTIVE';
      const reason = window.prompt(`Reason for ${status} (optional):`, '') || '';
      await apiRequest(`/users/${encodeURIComponent(userId)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reason })
      });
      showMessage(`User ${status.toLowerCase()} successfully.`, 'success');
      await loadUsers();
      return;
    }

    if (action === 'adjust') {
      const amount = window.prompt('Enter adjustment amount (e.g. 100 or -50):', '0');
      const reason = window.prompt('Reason for adjustment:', 'manual correction');
      if (!amount || !reason) {
        return;
      }
      await apiRequest(`/users/${encodeURIComponent(userId)}/adjust-balance`, {
        method: 'POST',
        body: JSON.stringify({ amount: Number(amount), reason, coin: 'USDT' })
      });
      showMessage('Balance adjusted successfully.', 'success');
      await loadUsers();
      return;
    }

    if (action === 'reset') {
      const newPassword = window.prompt('Enter new password (min 8 chars):');
      if (!newPassword) {
        return;
      }
      await apiRequest(`/users/${encodeURIComponent(userId)}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ newPassword })
      });
      showMessage('Password reset complete.', 'success');
      return;
    }

    if (action === 'kyc') {
      const payload = await apiRequest(`/users/${encodeURIComponent(userId)}/kyc`);
      const decision = window.prompt(`Current KYC: ${payload.kycStatus}. Enter decision (APPROVED/REJECTED/PENDING):`, payload.kycStatus || 'PENDING');
      if (!decision) {
        return;
      }
      const remarks = window.prompt('Remarks:', payload.remarks || '') || '';
      await reviewKyc(userId, decision, remarks);
      showMessage('KYC review saved.', 'success');
      await loadUsers();
    }

    if (action === 'view-docs') {
      await viewKycDocuments(userId);
    }
  } catch (error) {
    showMessage(error.message || 'User action failed.', 'error');
  }
}

async function handleKycAction(event) {
  const button = event.target.closest('[data-kyc-action]');
  if (!button) {
    return;
  }

  const action = button.getAttribute('data-kyc-action');
  const userId = button.getAttribute('data-user-id');

  try {
    if (action === 'view-docs') {
      await viewKycDocuments(userId);
      return;
    }

    if (action === 'approve') {
      const remarks = window.prompt('Approval remarks (optional):', '') || '';
      await reviewKyc(userId, 'APPROVED', remarks);
      showMessage('KYC approved.', 'success');
      await loadKyc();
      return;
    }

    if (action === 'reject') {
      const reason = window.prompt('Rejection reason:', '') || '';
      if (!reason) {
        return;
      }
      await reviewKyc(userId, 'REJECTED', reason);
      showMessage('KYC rejected.', 'success');
      await loadKyc();
    }
  } catch (error) {
    showMessage(error.message || 'KYC action failed.', 'error');
  }
}

async function handleKycDocAction(event) {
  const button = event.target.closest('[data-kyc-doc-action]');
  if (!button) return;

  const action = button.getAttribute('data-kyc-doc-action');
  const userId = button.getAttribute('data-user-id');
  // Use remarks textarea instead of prompt
  const remarks = (document.getElementById('kycReviewRemarks')?.value || '').trim();

  try {
    if (action === 'approve') {
      await reviewKyc(userId, 'APPROVED', remarks);
      showMessage('KYC approved.', 'success');
      document.getElementById('kycDocModal').classList.add('hidden');
      document.getElementById('kycDocModal').classList.remove('flex');
      if (state.currentView === 'kyc') await loadKyc();
    } else if (action === 'reject') {
      if (!remarks) {
        showMessage('Please enter rejection remarks before rejecting.', 'error');
        document.getElementById('kycReviewRemarks')?.focus();
        return;
      }
      await reviewKyc(userId, 'REJECTED', remarks);
      showMessage('KYC rejected.', 'success');
      document.getElementById('kycDocModal').classList.add('hidden');
      document.getElementById('kycDocModal').classList.remove('flex');
      if (state.currentView === 'kyc') await loadKyc();
    }
  } catch (error) {
    showMessage(error.message || 'KYC action failed.', 'error');
  }
}

async function handleWithdrawalAction(event) {
  const button = event.target.closest('[data-withdrawal-action]');
  if (!button || button.disabled) {
    return;
  }
  const action = button.getAttribute('data-withdrawal-action');
  const withdrawalId = button.getAttribute('data-withdrawal-id');
  const decision = action === 'approve' ? 'APPROVED' : 'REJECTED';
  const reason =
    window.prompt(`Reason for ${decision}:`, decision === 'APPROVED' ? 'manual review approved' : 'manual review rejected') || '';

  try {
    setActionButtonLoading(button, true, decision === 'APPROVED' ? 'Approving...' : 'Rejecting...');
    await apiRequest(`/wallet/withdrawals/${encodeURIComponent(withdrawalId)}/review`, {
      method: 'POST',
      body: JSON.stringify({ decision, reason })
    });
    showMessage(`Withdrawal ${decision.toLowerCase()} successfully.`, 'success');
    await loadWallet();
  } catch (error) {
    showMessage(error.message || 'Withdrawal action failed.', 'error');
  } finally {
    setActionButtonLoading(button, false);
  }
}

async function handleDepositAction(event) {
  const button = event.target.closest('[data-deposit-action]');
  if (!button || button.disabled) {
    return;
  }

  const action = button.getAttribute('data-deposit-action');
  const depositId = button.getAttribute('data-deposit-id');
  const decision = action === 'approve' ? 'APPROVED' : 'REJECTED';
  const reason =
    window.prompt(`Reason for ${decision}:`, decision === 'APPROVED' ? 'manual review approved' : 'deposit review rejected') || '';

  try {
    setActionButtonLoading(button, true, decision === 'APPROVED' ? 'Approving...' : 'Rejecting...');
    await apiRequest(`/wallet/deposits/${encodeURIComponent(depositId)}/review`, {
      method: 'POST',
      body: JSON.stringify({ decision, reason })
    });
    showMessage(`Deposit ${decision.toLowerCase()} successfully.`, 'success');
    await loadWallet();
  } catch (error) {
    showMessage(error.message || 'Deposit action failed.', 'error');
  } finally {
    setActionButtonLoading(button, false);
  }
}

async function handleSpotAction(event) {
  const button = event.target.closest('[data-spot-action]');
  if (!button) {
    return;
  }
  const action = button.getAttribute('data-spot-action');
  const symbol = button.getAttribute('data-symbol');

  try {
    if (action === 'toggle') {
      const enabled = button.getAttribute('data-enabled') === '1';
      setActionButtonLoading(button, true, enabled ? 'Disabling...' : 'Enabling...');
      await apiRequest(`/spot/pairs/${encodeURIComponent(symbol)}`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: !enabled })
      });
      showMessage(`${symbol} ${enabled ? 'disabled' : 'enabled'} successfully.`, 'success');
      await loadSpot();
    } else if (action === 'save') {
      setActionButtonLoading(button, true, 'Saving...');
      const makerInput = document.querySelector(`[data-spot-field="makerFee"][data-symbol="${symbol}"]`);
      const takerInput = document.querySelector(`[data-spot-field="takerFee"][data-symbol="${symbol}"]`);
      const precisionInput = document.querySelector(`[data-spot-field="pricePrecision"][data-symbol="${symbol}"]`);
      await apiRequest(`/spot/pairs/${encodeURIComponent(symbol)}`, {
        method: 'PUT',
        body: JSON.stringify({
          makerFee: Number(makerInput?.value || 0),
          takerFee: Number(takerInput?.value || 0),
          pricePrecision: Number(precisionInput?.value || 0)
        })
      });
      showMessage(`${symbol} settings updated.`, 'success');
      await loadSpot();
    }
  } catch (error) {
    showMessage(error.message || 'Spot update failed.', 'error');
  } finally {
    setActionButtonLoading(button, false);
  }
}

async function handleP2PActions(event) {
  const button = event.target.closest('[data-p2p-action]');
  if (!button) {
    return;
  }

  const action = button.getAttribute('data-p2p-action');
  const offerId = button.getAttribute('data-offer-id');
  const orderId = button.getAttribute('data-order-id');

  try {
    if (action === 'approve-ad' || action === 'suspend-ad' || action === 'reject-ad') {
      const decisionMap = { 'approve-ad': 'APPROVED', 'suspend-ad': 'SUSPENDED', 'reject-ad': 'REJECTED' };
      const decision = decisionMap[action];
      const reason = window.prompt(`Reason for ${decision}:`, '') || '';
      await apiRequest(`/p2p/ads/${encodeURIComponent(offerId)}/review`, {
        method: 'POST',
        body: JSON.stringify({ decision, reason })
      });
      showMessage(`P2P ad ${decision.toLowerCase()} successfully.`, 'success');
      await loadP2P();
      return;
    }

    if (action === 'release-order') {
      await apiRequest(`/p2p/orders/${encodeURIComponent(orderId)}/release`, {
        method: 'POST',
        body: JSON.stringify({})
      });
      showMessage('Escrow released successfully.', 'success');
      await loadP2P();
      return;
    }

    if (action === 'freeze-order') {
      await apiRequest(`/p2p/orders/${encodeURIComponent(orderId)}/freeze`, {
        method: 'POST',
        body: JSON.stringify({})
      });
      showMessage('Escrow frozen successfully.', 'success');
      await loadP2P();
    }
  } catch (error) {
    showMessage(error.message || 'P2P action failed.', 'error');
  }
}

async function handleRiskActions(event) {
  const button = event.target.closest('[data-risk-action]');
  if (!button) {
    return;
  }
  const action = button.getAttribute('data-risk-action');
  const blockId = button.getAttribute('data-block-id');

  try {
    if (action === 'unblock') {
      await apiRequest(`/risk/block-ip/${encodeURIComponent(blockId)}`, { method: 'DELETE' });
      showMessage('IP unblocked successfully.', 'success');
      await loadRisk();
    }
  } catch (error) {
    showMessage(error.message || 'Risk action failed.', 'error');
  }
}

async function handleBlockchainActions(event) {
  const button = event.target.closest('[data-blockchain-action]');
  if (!button) {
    return;
  }
  const action = button.getAttribute('data-blockchain-action');
  const id = button.getAttribute('data-id');

  try {
    if (action === 'prioritize') {
      await apiRequest(`/blockchain/withdrawal-queue/${encodeURIComponent(id)}/prioritize`, { method: 'POST' });
      showMessage('Withdrawal prioritized.', 'success');
      await loadBlockchain();
    } else if (action === 'retry') {
      await apiRequest(`/blockchain/transactions/${encodeURIComponent(id)}/retry`, { method: 'POST' });
      showMessage('Transaction retry queued.', 'success');
      await loadBlockchain();
    }
  } catch (error) {
    showMessage(error.message || 'Blockchain action failed.', 'error');
  }
}

async function handleAdminUsersActions(event) {
  const button = event.target.closest('[data-admin-action]');
  if (!button) {
    return;
  }
  const action = button.getAttribute('data-admin-action');
  const adminId = button.getAttribute('data-admin-id');

  try {
    if (action === 'disable') {
      const currentLabel = button.textContent.trim();
      const newStatus = currentLabel === 'Disable' ? 'DISABLED' : 'ACTIVE';
      await apiRequest(`/admins/${encodeURIComponent(adminId)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      showMessage(`Admin ${newStatus.toLowerCase()} successfully.`, 'success');
      await loadAdminUsers();
    }
  } catch (error) {
    showMessage(error.message || 'Admin action failed.', 'error');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// User Profile Drawer
// ─────────────────────────────────────────────────────────────────────────────

let _upUserId = null;

function _showPanel(tabId) {
  // Must toggle hidden class (not just style.display) because CSS has display:none !important
  const ALL_TABS = ['overview','balance','kyc','logins','devices','actions'];
  ALL_TABS.forEach(t => {
    const panel = document.getElementById(`upTab-${t}`);
    if (!panel) return;
    if (t === tabId) {
      panel.classList.remove('hidden');
      panel.style.removeProperty('display');
    } else {
      panel.classList.add('hidden');
    }
  });
}

function openUserProfile(userId) {
  _upUserId = userId;

  // Set loading state in header
  const emailEl = document.getElementById('upEmail');
  const uidEl   = document.getElementById('upUserId');
  const badgeEl = document.getElementById('upStatusBadge');
  if (emailEl) emailEl.textContent = 'Loading…';
  if (uidEl)   uidEl.textContent   = userId;
  if (badgeEl) badgeEl.innerHTML   = '';

  // Pre-fill email from already-loaded user list (instant display)
  const knownUser = Array.isArray(state.users) ? state.users.find(u => u.userId === userId) : null;
  if (knownUser?.email && emailEl) emailEl.textContent = knownUser.email;

  // Reset all tab content to loading spinner
  ['upOverviewContent','upBalanceContent','upKycContent','upLoginsContent','upDevicesContent'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-2);">
      <div class="spin" style="margin:auto;"></div></div>`;
  });

  // Show overlay and fade drawer in (no slide)
  const overlay = document.getElementById('userProfileOverlay');
  const drawer  = document.getElementById('userProfileDrawer');
  if (overlay) {
    const drawerW = Math.min(560, window.innerWidth);
    overlay.style.right = drawerW + 'px';
    overlay.style.display = 'block';
    overlay.classList.remove('hidden');
  }
  if (drawer) {
    drawer.style.opacity = '1';
    drawer.style.visibility = 'visible';
    drawer.style.pointerEvents = 'auto';
  }

  // Show overview tab by default
  document.querySelectorAll('.up-tab').forEach(b =>
    b.classList.toggle('active', b.getAttribute('data-up-tab') === 'overview')
  );
  _showPanel('overview');
  loadUpTab('overview');
}

function closeUserProfile() {
  const overlay = document.getElementById('userProfileOverlay');
  const drawer  = document.getElementById('userProfileDrawer');
  if (overlay) { overlay.style.display = 'none'; overlay.classList.add('hidden'); }
  if (drawer) {
    drawer.style.opacity = '0';
    drawer.style.visibility = 'hidden';
    drawer.style.pointerEvents = 'none';
  }
  _upUserId = null;
}

function switchUpTab(tab) {
  // Switch tab button active state
  document.querySelectorAll('.up-tab').forEach(b =>
    b.classList.toggle('active', b.getAttribute('data-up-tab') === tab)
  );
  // Show/hide panels via style.display (bypasses any CSS class conflicts)
  _showPanel(tab);
  // Load content
  if (_upUserId) loadUpTab(tab);
}

async function loadUpTab(tab) {
  try {
    if (tab === 'overview') await loadUpOverview();
    else if (tab === 'balance')  await loadUpBalance();
    else if (tab === 'kyc')      await loadUpKyc();
    else if (tab === 'logins')   await loadUpLogins();
    else if (tab === 'devices')  await loadUpDevices();
  } catch (err) {
    const capTab = tab.charAt(0).toUpperCase() + tab.slice(1);
    const el = document.getElementById(`up${capTab}Content`);
    if (el) el.innerHTML = `<div style="color:var(--red);padding:20px;text-align:center;font-size:13px;">${err.message || 'Failed to load'}</div>`;
  }
}

async function loadUpOverview() {
  const data = await apiRequest(`/users/${encodeURIComponent(_upUserId)}`);
  const user = data.user || data;
  // Handle both flat and nested wallet structure
  const bal     = Number(user.wallet?.balance ?? user.balance ?? 0);
  const locked  = Number(user.wallet?.lockedBalance ?? user.lockedBalance ?? 0);
  const p2pCnt  = user.stats?.p2pOrderCount ?? '-';
  const tradeCnt = user.stats?.tradeOrderCount ?? '-';

  document.getElementById('upEmail').textContent = user.email || '-';
  document.getElementById('upStatusBadge').innerHTML = statusBadge(user.status || 'UNKNOWN');
  const el = document.getElementById('upOverviewContent');
  // Copyable user ID helper
  const copyUserId = `<button onclick="navigator.clipboard.writeText('${escapeHtml(user.userId||'')}').then(()=>showMessage('User ID copied!','success'))" style="background:none;border:none;cursor:pointer;color:var(--accent);font-size:11px;padding:0 4px;" title="Copy User ID">⧉</button>`;

  el.innerHTML = `
    <div style="background:var(--bg-card);border-radius:10px;border:1px solid var(--border);padding:14px 16px;margin-bottom:10px;">
      <div class="up-info-row"><span class="up-info-label">User ID</span><span class="up-info-value" style="display:flex;align-items:center;gap:4px;"><span style="font-family:monospace;color:var(--accent);font-size:11px;">${user.userId||'-'}</span>${copyUserId}</span></div>
      <div class="up-info-row"><span class="up-info-label">Email</span><span class="up-info-value">${user.email||'-'}</span></div>
      <div class="up-info-row"><span class="up-info-label">Full Name</span><span class="up-info-value">${user.fullName||user.kyc?.fullName||'-'}</span></div>
      <div class="up-info-row"><span class="up-info-label">Mobile</span><span class="up-info-value" style="font-family:monospace;">${user.mobile||user.phone||user.phoneNumber||'-'}</span></div>
      <div class="up-info-row"><span class="up-info-label">Address</span><span class="up-info-value" style="font-size:12px;">${user.address||user.kyc?.address||'-'}</span></div>
      <div class="up-info-row"><span class="up-info-label">Country</span><span class="up-info-value">${user.country||'-'}</span></div>
      <div class="up-info-row"><span class="up-info-label">Date of Birth</span><span class="up-info-value">${user.dob||user.dateOfBirth||user.kyc?.dob||'-'}</span></div>
      <div class="up-info-row"><span class="up-info-label">Role</span><span class="up-info-value">${statusBadge(user.role||'USER')}</span></div>
      <div class="up-info-row"><span class="up-info-label">Account Status</span><span class="up-info-value">${statusBadge(user.status||'ACTIVE')}</span></div>
      <div class="up-info-row"><span class="up-info-label">KYC Status</span><span class="up-info-value">${statusBadge(user.kycStatus||'NOT_SUBMITTED')}</span></div>
      <div class="up-info-row"><span class="up-info-label">KYC Remarks</span><span class="up-info-value" style="color:var(--text-2);font-size:12px;">${user.kycRemarks||'-'}</span></div>
      <div class="up-info-row"><span class="up-info-label">Registered At</span><span class="up-info-value" style="font-size:12px;">${user.createdAt ? formatDate(user.createdAt) : '<span style="color:var(--text-2);">—</span>'}</span></div>
      <div class="up-info-row"><span class="up-info-label">Last Active</span><span class="up-info-value" style="font-size:12px;">${user.lastActiveAt ? `<span style="color:${isUserOnline(user.lastActiveAt)?'#22c55e':'var(--text-1)'};">${isUserOnline(user.lastActiveAt)?'🟢 Online now':'🕐 '+Math.round((Date.now()-new Date(user.lastActiveAt).getTime())/60000)+' min ago'}</span><span style="color:var(--text-2);font-size:10px;"> (${formatDate(user.lastActiveAt)})</span>` : '<span style="color:var(--text-2);">Never seen</span>'}</span></div>
      <div class="up-info-row"><span class="up-info-label">Flags</span><span class="up-info-value">${(user.flags||[]).length ? user.flags.map(f=>`<span class="badge badge-red" style="font-size:10px;">${f}</span>`).join(' ') : '<span style="color:var(--text-2);">None</span>'}</span></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
      <div class="stat-card"><div class="stat-icon">💎</div><div class="stat-info"><div class="stat-label">Available</div><div class="stat-value" style="color:var(--green);font-size:15px;">${formatNumber(bal,4)}</div><div class="stat-meta">USDT</div></div></div>
      <div class="stat-card"><div class="stat-icon">🔒</div><div class="stat-info"><div class="stat-label">Locked</div><div class="stat-value" style="color:var(--red);font-size:15px;">${formatNumber(locked,4)}</div><div class="stat-meta">USDT</div></div></div>
      <div class="stat-card"><div class="stat-icon">🔄</div><div class="stat-info"><div class="stat-label">P2P Orders</div><div class="stat-value" style="font-size:18px;">${p2pCnt}</div></div></div>
      <div class="stat-card"><div class="stat-icon">📈</div><div class="stat-info"><div class="stat-label">Trade Orders</div><div class="stat-value" style="font-size:18px;">${tradeCnt}</div></div></div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn-primary" style="flex:1;" data-up-tab="kyc">🪪 View KYC</button>
      <button class="btn-secondary" style="flex:1;" data-up-tab="logins">🔐 Login History</button>
      <button class="btn-danger" style="flex:1;" data-up-tab="actions">⚙️ Actions</button>
    </div>`;

  // Load and render merchant badge section separately (async)
  loadUpMerchantBadge();
}

async function loadUpMerchantBadge() {
  const userId = _upUserId;
  if (!userId) return;
  // Inject placeholder card below existing content
  const el = document.getElementById('upOverviewContent');
  if (!el) return;
  let card = document.getElementById('upMerchantBadgeCard');
  if (!card) {
    card = document.createElement('div');
    card.id = 'upMerchantBadgeCard';
    card.style.cssText = 'margin-top:10px;background:var(--bg-card);border-radius:10px;border:1px solid var(--border);padding:14px 16px;';
    el.appendChild(card);
  }
  card.innerHTML = '<div style="color:var(--text-2);font-size:12px;text-align:center;">Loading merchant status…</div>';

  try {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/merchant-badge`, { credentials: 'include' });
    const data = await res.json();
    const BADGE_INFO = { 1: { label: 'Blue V (Verified)', color: '#1a6ff4', icon: '◆' }, 2: { label: 'Crown (Pro)', color: '#f7931a', icon: '♛' }, 3: { label: 'Shield (Elite)', color: '#f5a623', icon: '❖' } };
    const currentBadge = (data.status === 'approved' && data.badge) ? data.badge : null;
    const bi = currentBadge ? BADGE_INFO[currentBadge] : null;
    const stats = data.stats || {};
    const secDep = Number(stats.securityDeposit || 0);
    const compRate = Number(stats.completionRate || 0);
    const totalOrders = Number(stats.totalOrders || 0);
    const badgeEligible = stats.badgeEligible || secDep >= 500;

    // Security deposit status chip
    let secDepChip = '';
    if (secDep >= 500) secDepChip = `<span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:20px;background:rgba(247,147,26,0.15);color:#f7931a;border:1px solid rgba(247,147,26,0.3);">Badge Eligible</span>`;
    else if (secDep >= 200) secDepChip = `<span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:20px;background:rgba(22,199,132,0.12);color:#16c784;border:1px solid rgba(22,199,132,0.3);">Can Post Ads</span>`;
    else secDepChip = `<span style="font-size:10px;font-weight:700;padding:1px 7px;border-radius:20px;background:rgba(246,70,93,0.12);color:#f6465d;border:1px solid rgba(246,70,93,0.3);">No Deposit</span>`;

    card.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <span style="font-size:12px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.5px;">🏪 Merchant Badge</span>
        ${bi
          ? `<span style="font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;background:${bi.color}22;color:${bi.color};border:1px solid ${bi.color}55;">${bi.icon} ${bi.label}</span>`
          : `<span style="font-size:12px;color:var(--text-2);">No badge assigned</span>`
        }
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-bottom:10px;">
        <div style="background:var(--bg-card2);border-radius:8px;padding:8px 10px;text-align:center;border:1px solid var(--border);">
          <div style="font-size:10px;color:var(--text-2);margin-bottom:2px;">Security Deposit</div>
          <div style="font-size:14px;font-weight:700;color:${secDep>=500?'#f7931a':secDep>=200?'#16c784':'#f6465d'};">${formatNumber(secDep,0)} USDT</div>
          <div style="margin-top:3px;">${secDepChip}</div>
        </div>
        <div style="background:var(--bg-card2);border-radius:8px;padding:8px 10px;text-align:center;border:1px solid var(--border);">
          <div style="font-size:10px;color:var(--text-2);margin-bottom:2px;">Completion Rate</div>
          <div style="font-size:14px;font-weight:700;color:${compRate>=80?'#16c784':compRate>=50?'#f7931a':'#f6465d'};">${compRate}%</div>
          <div style="font-size:10px;color:var(--text-2);margin-top:2px;">${totalOrders} orders</div>
        </div>
        <div style="background:var(--bg-card2);border-radius:8px;padding:8px 10px;text-align:center;border:1px solid var(--border);">
          <div style="font-size:10px;color:var(--text-2);margin-bottom:2px;">Badge Criteria</div>
          <div style="font-size:12px;font-weight:600;color:${badgeEligible?'#16c784':'var(--text-2)'};">${badgeEligible?'✓ Eligible':'✗ Not Yet'}</div>
          <div style="font-size:10px;color:var(--text-2);margin-top:2px;">≥500 USDT + good rate</div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-2);margin-bottom:8px;">200 USDT deposit → can post ads. 500 USDT + good completion → badge eligible. Admin assigns badge manually.</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button onclick="adminAssignMerchantBadge('${userId}',4)" style="flex:1;min-width:72px;padding:8px 4px;border-radius:8px;background:rgba(229,53,96,0.13);color:#e53560;border:1px solid rgba(229,53,96,0.45);font-size:12px;font-weight:800;cursor:pointer;${currentBadge===4?'outline:2px solid #e53560;':''}" title="PRO Merchant — professional local crypto exchange">
          <span style="display:inline-flex;align-items:center;gap:4px;"><svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:14px;height:14px;vertical-align:middle;"><path d="M4 3 C3.4 3 3 3.4 3 4 L3 40 C3 40.6 3.4 41 4 41 L40 41 C40.6 41 41 40.6 41 40 L41 14 L30 3 Z" fill="#e53560"/><path d="M30 3 L30 13 C30 13.6 30.4 14 31 14 L41 14 Z" fill="rgba(0,0,0,0.18)"/><text x="21" y="28" text-anchor="middle" font-size="14" font-weight="800" fill="#fff" font-family="Arial,sans-serif" font-style="italic">Pro</text></svg> PRO</span>
        </button>
        <button onclick="adminAssignMerchantBadge('${userId}',1)" style="flex:1;min-width:72px;padding:8px 4px;border-radius:8px;background:rgba(26,111,244,0.12);color:#1a6ff4;border:1px solid rgba(26,111,244,0.35);font-size:12px;font-weight:700;cursor:pointer;${currentBadge===1?'outline:2px solid #1a6ff4;':''}" title="High-quality verified merchant">◆ Blue V</button>
        <button onclick="adminAssignMerchantBadge('${userId}',2)" style="flex:1;min-width:72px;padding:8px 4px;border-radius:8px;background:rgba(247,147,26,0.12);color:#f7931a;border:1px solid rgba(247,147,26,0.35);font-size:12px;font-weight:700;cursor:pointer;${currentBadge===2?'outline:2px solid #f7931a;':''}" title="Top-level certified merchant">♛ Crown</button>
        <button onclick="adminAssignMerchantBadge('${userId}',3)" style="flex:1;min-width:72px;padding:8px 4px;border-radius:8px;background:rgba(245,166,35,0.12);color:#f5a623;border:1px solid rgba(245,166,35,0.35);font-size:12px;font-weight:700;cursor:pointer;${currentBadge===3?'outline:2px solid #f5a623;':''}" title="Compensation-protected merchant">❖ Shield</button>
        ${currentBadge ? `<button onclick="adminRevokeMerchantBadge('${userId}')" style="flex:1;min-width:72px;padding:8px 4px;border-radius:8px;background:rgba(246,70,93,0.12);color:#f6465d;border:1px solid rgba(246,70,93,0.35);font-size:12px;font-weight:700;cursor:pointer;">✕ Revoke</button>` : ''}
      </div>`;
  } catch (e) {
    card.innerHTML = '<div style="color:var(--red);font-size:12px;">Failed to load merchant status.</div>';
  }
}

async function adminAssignMerchantBadge(userId, badge) {
  const BADGE_LABELS = { 4: 'PRO Merchant', 1: 'Blue V (Verified)', 2: 'Crown (Pro)', 3: 'Shield (Elite)' };
  if (!confirm(`Assign Badge ${badge} — ${BADGE_LABELS[badge]} to this user?\nThis grants them merchant privileges and the ability to post P2P ads.`)) return;
  try {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/merchant-badge`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ badge, action: 'assign' })
    });
    const data = await res.json();
    if (!data.success) { alert('Error: ' + data.message); return; }
    alert(`Badge ${badge} assigned successfully!`);
    loadUpMerchantBadge();
  } catch (e) { alert('Network error.'); }
}

async function adminRevokeMerchantBadge(userId) {
  if (!confirm('Revoke merchant badge from this user?\nThey will no longer be able to post P2P ads.')) return;
  try {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}/merchant-badge`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'revoke' })
    });
    const data = await res.json();
    if (!data.success) { alert('Error: ' + data.message); return; }
    alert('Merchant badge revoked.');
    loadUpMerchantBadge();
  } catch (e) { alert('Network error.'); }
}

async function loadUpBalance() {
  const data = await apiRequest(`/users/${encodeURIComponent(_upUserId)}`);
  const user = data.user || data;
  const bal    = Number(user.wallet?.balance ?? user.balance ?? 0);
  const locked = Number(user.wallet?.lockedBalance ?? user.lockedBalance ?? 0);
  const el = document.getElementById('upBalanceContent');
  el.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <div class="stat-card"><div class="stat-icon">💎</div><div class="stat-info"><div class="stat-label">Available</div><div class="stat-value" style="color:var(--green);font-size:17px;">${formatNumber(bal,4)}</div><div class="stat-meta">USDT</div></div></div>
      <div class="stat-card"><div class="stat-icon">🔒</div><div class="stat-info"><div class="stat-label">Locked</div><div class="stat-value" style="color:var(--red);font-size:17px;">${formatNumber(locked,4)}</div><div class="stat-meta">USDT</div></div></div>
    </div>
    <div style="background:var(--bg-card);border-radius:10px;border:1px solid var(--border);padding:14px 16px;margin-bottom:12px;">
      <div class="up-info-row"><span class="up-info-label">Available Balance</span><span class="up-info-value" style="color:var(--green);font-weight:700;">${formatNumber(bal,6)} USDT</span></div>
      <div class="up-info-row"><span class="up-info-label">Locked Balance</span><span class="up-info-value" style="color:var(--red);">${formatNumber(locked,6)} USDT</span></div>
      <div class="up-info-row"><span class="up-info-label">Total Balance</span><span class="up-info-value" style="font-weight:700;">${formatNumber(bal+locked,6)} USDT</span></div>
    </div>
    <div style="background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.3);border-radius:10px;padding:14px 16px;">
      <div style="font-size:12px;font-weight:700;color:var(--green);margin-bottom:10px;">⬇ Deposit to Wallet</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;gap:8px;">
          <input id="upDepositAmt" class="input-dark" type="number" min="0.01" step="0.01" placeholder="Amount (USDT)" style="flex:1;height:36px;" />
        </div>
        <input id="upDepositNote" class="input-dark" placeholder="Note (e.g. Manual top-up)" style="height:36px;" value="Admin manual deposit" />
        <button class="btn-primary" style="background:var(--green);border-color:var(--green);padding:10px;" onclick="upDirectDeposit()">✅ Deposit to User Wallet</button>
      </div>
    </div>`;
}

async function upDirectDeposit() {
  if (!_upUserId) return;
  const amt = parseFloat(document.getElementById('upDepositAmt')?.value || '0');
  const note = document.getElementById('upDepositNote')?.value?.trim() || 'Admin manual deposit';
  if (!amt || amt <= 0) return showMessage('Enter a valid amount', 'error');
  try {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(_upUserId)}/deposit`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amt, coin: 'USDT', note })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Deposit failed');
    showMessage(`✅ ${amt} USDT deposited. New balance: ${data.balance} USDT`, 'success');
    document.getElementById('upDepositAmt').value = '';
    await loadUpBalance();
  } catch (e) {
    showMessage(e.message || 'Deposit failed', 'error');
  }
}

// Helper: ensure image src is a proper data URL
function ensureDataUrl(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;
  // Already a data URL
  if (s.startsWith('data:')) return s;
  // Already an http URL
  if (s.startsWith('http')) return s;
  // Assume it's raw base64 JPEG
  return `data:image/jpeg;base64,${s}`;
}

function kycImageBox(title, src) {
  // src can be a /api/admin URL or a data URL
  const imgSrc = src || null;
  return `<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;overflow:hidden;">
    <div style="padding:8px 12px;font-size:11px;font-weight:700;color:var(--text-2);text-transform:uppercase;letter-spacing:.5px;border-bottom:1px solid var(--border);background:var(--bg-card2);">${title}</div>
    <div style="min-height:160px;display:flex;align-items:center;justify-content:center;padding:10px;background:var(--bg-input);">
      ${imgSrc
        ? `<img src="${imgSrc}" style="max-width:100%;max-height:200px;border-radius:6px;object-fit:contain;cursor:zoom-in;"
             onclick="window.open('${imgSrc}','_blank')"
             onerror="this.parentElement.innerHTML='<div style=\\'color:var(--red);font-size:12px;text-align:center;padding:20px;\\'>⚠️ Image failed to load<br><small style=\\'opacity:.6;\\'>Decryption error or no data</small></div>'" />`
        : '<div style="color:var(--text-2);font-size:12px;text-align:center;padding:24px;">📄 Not uploaded</div>'
      }
    </div>
    ${imgSrc ? `<div style="padding:6px 10px;font-size:10px;color:var(--text-2);text-align:center;background:var(--bg-card2);">Click to open full size</div>` : ''}
  </div>`;
}

async function loadUpKyc() {
  const el = document.getElementById('upKycContent');
  el.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-2);"><div class="spin" style="margin:auto;"></div></div>`;
  try {
    const [kycData, docData] = await Promise.all([
      apiRequest(`/users/${encodeURIComponent(_upUserId)}/kyc`),
      apiRequest(`/users/${encodeURIComponent(_upUserId)}/kyc/documents`).catch(e => ({ _error: e.message }))
    ]);

    const kycStatus = kycData.kycStatus || kycData.status || 'NOT_SUBMITTED';
    const remarks   = kycData.remarks   || kycData.kycRemarks || '';
    const isPending = kycStatus === 'PENDING';
    const isApproved = kycStatus === 'APPROVED';

    const doc        = (docData && !docData._error) ? docData : {};
    const docError   = docData?._error || null;
    const aadhaarNum = doc.aadhaarMasked || '';
    const submittedAt = doc.submittedAt || '';
    // Use hasAadhaarFront/hasSelfie flags (new API) OR fall back to checking base64 blobs
    const hasAadhaar = !!(doc.hasAadhaarFront || doc.aadhaarFront);
    const hasAadhaarBack = !!(doc.hasAadhaarBack || doc.aadhaarBack);
    const hasSelfie  = !!(doc.hasSelfie || doc.selfie);
    const hasAnyDoc  = hasAadhaar || hasAadhaarBack || hasSelfie;
    // Use direct image URL endpoint (binary, no base64 size issues)
    const aadhaarImgUrl = hasAadhaar ? `${API_BASE}/users/${encodeURIComponent(_upUserId)}/kyc/image/aadhaar` : null;
    const aadhaarBackImgUrl = hasAadhaarBack ? `${API_BASE}/users/${encodeURIComponent(_upUserId)}/kyc/image/aadhaar-back` : null;
    const selfieImgUrl  = hasSelfie  ? `${API_BASE}/users/${encodeURIComponent(_upUserId)}/kyc/image/selfie`  : null;

    const statusColor = kycStatus === 'APPROVED' ? 'var(--green)' : kycStatus === 'REJECTED' ? 'var(--red)' : kycStatus === 'PENDING' ? 'var(--accent)' : 'var(--text-2)';

    el.innerHTML = `
      <!-- KYC Status Banner -->
      <div style="background:${statusColor}14;border:1px solid ${statusColor}30;border-radius:10px;padding:12px 16px;margin-bottom:12px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:26px;">${kycStatus==='APPROVED'?'✅':kycStatus==='REJECTED'?'❌':kycStatus==='PENDING'?'🕐':'📋'}</span>
        <div>
          <div style="font-size:14px;font-weight:700;color:${statusColor};">${kycStatus}</div>
          <div style="font-size:12px;color:var(--text-2);margin-top:2px;">${remarks || (kycStatus==='APPROVED'?'Identity verified':'KYC ' + kycStatus.toLowerCase())}</div>
        </div>
      </div>

      <!-- KYC Info -->
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:12px 16px;margin-bottom:12px;">
        <div class="up-info-row"><span class="up-info-label">KYC Status</span><span class="up-info-value">${statusBadge(kycStatus)}</span></div>
        ${aadhaarNum ? `<div class="up-info-row"><span class="up-info-label">Aadhaar Number</span><span class="up-info-value" style="font-family:monospace;letter-spacing:1px;">${aadhaarNum}</span></div>` : ''}
        ${submittedAt ? `<div class="up-info-row"><span class="up-info-label">Submitted At</span><span class="up-info-value">${formatDate(submittedAt)}</span></div>` : ''}
        <div class="up-info-row"><span class="up-info-label">Remarks</span><span class="up-info-value" style="color:${remarks?'var(--text-1)':'var(--text-2)'};">${remarks||'—'}</span></div>
        <div class="up-info-row"><span class="up-info-label">Aadhaar Doc</span><span class="up-info-value">${hasAadhaar?'<span style="color:var(--green);">✅ Uploaded</span>':'<span style="color:var(--text-2);">Not uploaded</span>'}</span></div>
        <div class="up-info-row"><span class="up-info-label">Aadhaar Back</span><span class="up-info-value">${hasAadhaarBack?'<span style="color:var(--green);">✅ Uploaded</span>':'<span style="color:var(--text-2);">Not uploaded</span>'}</span></div>
        <div class="up-info-row" style="border:none;"><span class="up-info-label">Selfie</span><span class="up-info-value">${hasSelfie?'<span style="color:var(--green);">✅ Uploaded</span>':'<span style="color:var(--text-2);">Not uploaded</span>'}</span></div>
      </div>

      ${docError ? `<div style="background:var(--red-dim);border:1px solid var(--red);border-radius:8px;padding:10px 14px;margin-bottom:12px;font-size:12px;color:var(--red);">⚠️ Document fetch error: ${docError}</div>` : ''}

      <!-- Document Images -->
      ${hasAnyDoc ? `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:12px;">
        ${kycImageBox('🪪 Aadhaar Front', aadhaarImgUrl)}
        ${kycImageBox('🪪 Aadhaar Back', aadhaarBackImgUrl)}
        ${kycImageBox('🤳 Selfie with Doc', selfieImgUrl)}
      </div>` : `
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:24px;text-align:center;margin-bottom:12px;">
        <div style="font-size:32px;margin-bottom:8px;">📋</div>
        <p style="font-size:13px;color:var(--text-2);margin:0;">${docError ? '⚠️ Could not load documents — ' + docError : 'No KYC documents uploaded yet'}</p>
      </div>`}

      <!-- Action Buttons -->
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${hasAnyDoc ? `<button class="btn-secondary" style="flex:1;" onclick="viewKycDocuments('${_upUserId}')">🔍 Full Screen</button>` : ''}
        ${isPending ? `
          <button class="btn-secondary" style="flex:1;" onclick="upApproveKyc()">✅ Approve KYC</button>
          <button class="btn-danger"    style="flex:1;" onclick="upRejectKyc()">❌ Reject KYC</button>
        ` : isApproved ? `
          <button class="btn-secondary" style="flex:1;" onclick="upRejectKyc()">🔄 Re-review KYC</button>
        ` : `
          <button class="btn-secondary" style="flex:1;" onclick="upApproveKyc()">✅ Approve KYC</button>
          <button class="btn-danger"    style="flex:1;" onclick="upRejectKyc()">❌ Reject KYC</button>
        `}
      </div>`;
  } catch(err) {
    el.innerHTML = `<div style="text-align:center;padding:40px;">
      <div style="font-size:32px;margin-bottom:10px;">⚠️</div>
      <p style="font-size:13px;color:var(--text-2);margin:0 0 4px;">KYC data unavailable</p>
      <small style="color:var(--red);font-size:11px;">${err.message||'Unknown error'}</small>
    </div>`;
  }
}

async function upApproveKyc() {
  try {
    await reviewKyc(_upUserId, 'APPROVED', '');
    showMessage('KYC Approved ✅', 'success');
    await loadUpKyc();
    await loadUpOverview();
  } catch(err) { showMessage(err.message||'Failed','error'); }
}

async function upRejectKyc() {
  const reason = window.prompt('Enter rejection reason:');
  if (!reason || !reason.trim()) return;
  try {
    await reviewKyc(_upUserId, 'REJECTED', reason.trim());
    showMessage('KYC Rejected', 'success');
    await loadUpKyc();
    await loadUpOverview();
  } catch(err) { showMessage(err.message||'Failed','error'); }
}

async function loadUpLogins() {
  const el = document.getElementById('upLoginsContent');
  el.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-2);"><div class="spin" style="margin:auto;"></div></div>`;
  try {
    const data = await apiRequest(`/users/${encodeURIComponent(_upUserId)}/login-history`);
    // Handle both collection formats
    const logs = Array.isArray(data.history)  ? data.history
               : Array.isArray(data.logs)     ? data.logs
               : Array.isArray(data.records)  ? data.records
               : [];
    const total = data.pagination?.total || logs.length;

    if (!logs.length) {
      el.innerHTML = `<div style="text-align:center;padding:48px 20px;color:var(--text-2);">
        <div style="font-size:38px;margin-bottom:10px;">🔐</div>
        <p style="font-size:13px;font-weight:600;margin:0 0 4px;">No login history</p>
        <p style="font-size:11px;opacity:.6;margin:0;">This user hasn't logged in yet</p>
      </div>`;
      return;
    }

    el.innerHTML = `
      <div style="font-size:11px;color:var(--text-2);margin-bottom:10px;padding:0 2px;">
        Showing ${Math.min(logs.length,50)} of ${total} logins
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${logs.slice(0,50).map(log => {
          const isSuccess = log.success === true || log.action === 'login_success';
          const isFailed  = log.success === false || log.action === 'login_failed';
          const isSignup  = log.action === 'register_success';
          const ip        = log.ip || '-';
          const country   = log.country || '';
          const city      = log.city    || '';
          const region    = log.region  || '';
          const timezone  = log.timezone || '';
          const browser   = log.browser || '';
          const device    = log.device  || '';
          const ua        = log.userAgent || '';
          const time      = log.createdAt;
          const mapsUrl   = log.mapsUrl || '';

          // Country flag emoji from code
          const flag = country && country.length === 2
            ? String.fromCodePoint(...[...country.toUpperCase()].map(c => 0x1F1E0 - 65 + c.charCodeAt(0)))
            : '';

          const locationParts = [city, region, country].filter(Boolean);
          const locationStr   = locationParts.join(', ');

          const icon  = isSignup ? '🆕' : isSuccess ? '✅' : isFailed ? '❌' : '🔵';
          const color = isSignup ? '#a78bfa' : isSuccess ? 'var(--green)' : isFailed ? 'var(--red)' : 'var(--text-2)';
          const label = isSignup ? 'Account Created' : isSuccess ? 'Login Success' : isFailed ? 'Login Failed' : (log.action || 'Activity');

          const deviceStr = [device, browser].filter(Boolean).join(' • ');

          return `<div class="up-login-row">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <span style="font-weight:700;font-size:12px;color:${color};">${icon} ${label}</span>
              <span style="font-size:10px;color:var(--text-2);white-space:nowrap;">${formatDate(time)}</span>
            </div>
            <div style="display:flex;gap:12px;margin-top:6px;flex-wrap:wrap;align-items:center;">
              <span style="font-size:11px;color:var(--text-2);">🌐 <span style="color:#00b8d4;font-family:monospace;font-size:11px;">${ip}</span></span>
              ${locationStr
                ? `<span style="font-size:11px;color:var(--text-2);">${flag} <span style="color:var(--text-1);">${locationStr}</span></span>`
                : '<span style="font-size:11px;color:rgba(255,255,255,0.2);">📍 Location unavailable</span>'}
              ${timezone ? `<span style="font-size:10px;color:rgba(255,255,255,0.35);">🕐 ${timezone}</span>` : ''}
            </div>
            <div style="display:flex;gap:12px;margin-top:4px;flex-wrap:wrap;align-items:center;">
              ${deviceStr ? `<span style="font-size:10px;color:rgba(255,255,255,0.4);">📱 ${deviceStr}</span>` : ''}
              ${mapsUrl ? `<a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="font-size:10px;color:#00b8d4;text-decoration:none;">🗺️ View on Map</a>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>`;
  } catch(err) {
    el.innerHTML = `<div style="text-align:center;padding:40px;">
      <div style="font-size:32px;margin-bottom:10px;">⚠️</div>
      <p style="color:var(--red);font-size:13px;margin:0 0 4px;">Failed to load history</p>
      <small style="color:var(--text-2);">${err.message||'Unknown error'}</small>
    </div>`;
  }
}

async function loadUpDevices() {
  const el = document.getElementById('upDevicesContent');
  el.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-2);"><div class="spin" style="margin:auto;"></div></div>`;
  try {
    const data = await apiRequest(`/users/${encodeURIComponent(_upUserId)}/devices`);
    const devices = Array.isArray(data.devices) ? data.devices : Array.isArray(data) ? data : [];

    if (!devices.length) {
      el.innerHTML = `<div style="text-align:center;padding:48px 20px;color:var(--text-2);">
        <div style="font-size:38px;margin-bottom:10px;">📱</div>
        <p style="font-size:13px;font-weight:600;margin:0 0 4px;">No devices found</p>
        <p style="font-size:11px;opacity:.6;margin:0;">User hasn't logged in from any tracked device</p>
      </div>`;
      return;
    }

    el.innerHTML = `<div style="display:flex;flex-direction:column;gap:8px;">` +
      devices.map((d, i) => {
        const osLower = (d.os || d.platform || '').toLowerCase();
        const nameLower = (d.deviceName || d.name || '').toLowerCase();
        const emoji = (osLower.includes('android') || nameLower.includes('android')) ? '🤖'
                    : (osLower.includes('ios') || nameLower.includes('iphone') || nameLower.includes('ipad')) ? '🍎'
                    : (osLower.includes('windows')) ? '🖥'
                    : (osLower.includes('mac')) ? '🍎'
                    : '💻';
        const trusted = d.trusted || d.isTrusted || d.is_trusted;
        const name    = d.deviceName || d.name || d.browser || `Device ${i + 1}`;
        const ip      = d.ip || d.lastIp || d.ipAddress || '-';
        const lastSeen = d.lastSeenAt || d.lastSeen || d.last_seen_at || d.updatedAt || d.createdAt;
        return `<div class="up-device-card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-size:22px;">${emoji}</span>
              <div>
                <div style="font-weight:700;color:var(--text-1);font-size:13px;">${name}</div>
                <div style="font-size:10px;color:var(--text-2);">${d.os||d.platform||'Unknown OS'}</div>
              </div>
            </div>
            <span class="badge ${trusted ? 'badge-green' : 'badge-gray'}">${trusted ? '✓ Trusted' : 'Untrusted'}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;">
            <div style="color:var(--text-2);">Browser: <span style="color:var(--text-1);">${d.browser || '-'}</span></div>
            <div style="color:var(--text-2);">IP: <span style="color:var(--text-1);font-family:monospace;">${ip}</span></div>
            <div style="color:var(--text-2);">Last seen: <span style="color:var(--text-1);">${formatDate(lastSeen)}</span></div>
            <div style="color:var(--text-2);">Added: <span style="color:var(--text-1);">${formatDate(d.createdAt)}</span></div>
          </div>
          ${d.fingerprint ? `<div style="margin-top:8px;padding:5px 8px;background:var(--bg-input);border-radius:4px;font-size:10px;color:var(--text-2);font-family:monospace;overflow:hidden;text-overflow:ellipsis;">🔑 ${d.fingerprint}</div>` : ''}
        </div>`;
      }).join('') + `</div>`;
  } catch(err) {
    el.innerHTML = `<div style="text-align:center;padding:40px;">
      <div style="font-size:32px;margin-bottom:10px;">⚠️</div>
      <p style="color:var(--red);font-size:13px;margin:0 0 4px;">Failed to load devices</p>
      <small style="color:var(--text-2);">${err.message||'Unknown error'}</small>
    </div>`;
  }
}

async function upAction(action) {
  if (!_upUserId) return;
  try {
    if (action === 'freeze') {
      await apiRequest(`/users/${encodeURIComponent(_upUserId)}/status`, { method:'PATCH', body:JSON.stringify({status:'FROZEN'}) });
      showMessage('Account frozen.','success');
      await loadUpOverview();
    } else if (action === 'unfreeze') {
      await apiRequest(`/users/${encodeURIComponent(_upUserId)}/status`, { method:'PATCH', body:JSON.stringify({status:'ACTIVE'}) });
      showMessage('Account unfrozen.','success');
      await loadUpOverview();
    } else if (action === 'ban') {
      if (!confirm('Ban this user permanently?')) return;
      await apiRequest(`/users/${encodeURIComponent(_upUserId)}/status`, { method:'PATCH', body:JSON.stringify({status:'BANNED'}) });
      showMessage('User banned.','success');
      await loadUpOverview();
    } else if (action === 'login-as') {
      if (!confirm('Login as this user? This will open the main site in a new tab with this user\'s session.')) return;
      const data = await apiRequest(`/users/${encodeURIComponent(_upUserId)}/login-as`, { method:'POST', body:JSON.stringify({}) });
      showMessage(`Impersonating ${data.user?.email || 'user'}. Opening dashboard...`, 'success');
      window.open('/', '_blank');
    } else if (action === 'unban') {
      await apiRequest(`/users/${encodeURIComponent(_upUserId)}/status`, { method:'PATCH', body:JSON.stringify({status:'ACTIVE'}) });
      showMessage('User unbanned.','success');
      await loadUpOverview();
    } else if (action === 'force-logout') {
      await apiRequest(`/users/${encodeURIComponent(_upUserId)}/force-logout`, { method:'POST', body:JSON.stringify({}) });
      showMessage('User force logged out.','success');
    } else if (action === 'block-ip') {
      await apiRequest(`/users/${encodeURIComponent(_upUserId)}/block-ip`, { method:'POST', body:JSON.stringify({}) });
      showMessage('IP blocked.','success');
    } else if (action === 'unblock-ip') {
      await apiRequest(`/users/${encodeURIComponent(_upUserId)}/unblock-ip`, { method:'POST', body:JSON.stringify({}) });
      showMessage('IP unblocked.','success');
    } else if (action === 'block-device') {
      await apiRequest(`/users/${encodeURIComponent(_upUserId)}/block-device`, { method:'POST', body:JSON.stringify({}) });
      showMessage('Device blocked.','success');
    } else if (action === 'unblock-device') {
      await apiRequest(`/users/${encodeURIComponent(_upUserId)}/unblock-device`, { method:'POST', body:JSON.stringify({}) });
      showMessage('Device unblocked.','success');
    } else if (action === 'block-all') {
      if (!confirm('Block IP + Device for this user?')) return;
      await Promise.all([
        apiRequest(`/users/${encodeURIComponent(_upUserId)}/block-ip`, { method:'POST', body:JSON.stringify({}) }).catch(()=>{}),
        apiRequest(`/users/${encodeURIComponent(_upUserId)}/block-device`, { method:'POST', body:JSON.stringify({}) }).catch(()=>{})
      ]);
      showMessage('IP and Device blocked.','success');
    } else if (action === 'unblock-all') {
      await Promise.all([
        apiRequest(`/users/${encodeURIComponent(_upUserId)}/unblock-ip`, { method:'POST', body:JSON.stringify({}) }).catch(()=>{}),
        apiRequest(`/users/${encodeURIComponent(_upUserId)}/unblock-device`, { method:'POST', body:JSON.stringify({}) }).catch(()=>{})
      ]);
      showMessage('IP and Device unblocked.','success');
    } else if (action === 'adjust') {
      const type   = document.getElementById('upAdjustType').value;
      const amount = parseFloat(document.getElementById('upAdjustAmount').value);
      const reason = document.getElementById('upAdjustReason').value.trim();
      if (!amount || amount <= 0) return showMessage('Enter a valid amount.','error');
      if (!reason) return showMessage('Reason is required.','error');
      await apiRequest(`/users/${encodeURIComponent(_upUserId)}/adjust-balance`, { method:'POST', body:JSON.stringify({type,amount,reason}) });
      showMessage(`Balance ${type==='ADD'?'added':'subtracted'} successfully.`,'success');
      document.getElementById('upAdjustAmount').value='';
      document.getElementById('upAdjustReason').value='';
      await loadUpOverview(); await loadUpBalance();
    } else if (action === 'reset') {
      const pwd = document.getElementById('upNewPassword').value.trim();
      if (pwd.length < 8) return showMessage('Password must be at least 8 characters.','error');
      await apiRequest(`/users/${encodeURIComponent(_upUserId)}/reset-password`, { method:'POST', body:JSON.stringify({newPassword:pwd}) });
      showMessage('Password reset successfully.','success');
      document.getElementById('upNewPassword').value='';
    }
  } catch (err) {
    showMessage(err.message || 'Action failed.','error');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Wire All Event Listeners
// ─────────────────────────────────────────────────────────────────────────────

function wireEventListeners() {
  if (dom.menuToggleBtn) {
    dom.menuToggleBtn.addEventListener('click', () => {
      const isOpen = dom.sidebar.classList.contains('open');
      setSidebarOpen(!isOpen);
    });
  }
  if (dom.sidebarOverlay) {
    dom.sidebarOverlay.addEventListener('click', () => setSidebarOpen(false));
  }

  dom.sidebarNav.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-view]');
    if (!button) {
      return;
    }
    setSidebarOpen(false); // close on mobile after nav click
    await changeView(button.getAttribute('data-view'));
  });

  dom.refreshCurrentBtn.addEventListener('click', async () => {
    await loadCurrentView();
    showMessage('Section refreshed.', 'success');
  });

  const doLogout = async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST', body: JSON.stringify({}) });
    } catch (_error) {
      // Ignore
    } finally {
      window.location.href = '/admin/login';
    }
  };

  dom.logoutBtn.addEventListener('click', doLogout);
  if (dom.logoutBtnSide) {
    dom.logoutBtnSide.addEventListener('click', doLogout);
  }

  // KYC modal close
  document.getElementById('kycDocModalClose').addEventListener('click', () => {
    document.getElementById('kycDocModal').classList.add('hidden');
    document.getElementById('kycDocModal').classList.remove('flex');
  });
  document.getElementById('kycDocModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.add('hidden');
      e.currentTarget.classList.remove('flex');
    }
  });

  // KYC
  document.getElementById('kycTableBody').addEventListener('click', handleKycAction);
  document.getElementById('kycDocActions').addEventListener('click', handleKycDocAction);
  document.getElementById('kycReloadBtn').addEventListener('click', async () => loadKyc());
  document.getElementById('kycStatusFilter').addEventListener('change', async () => loadKyc());

  // Users
  document.getElementById('usersTableBody').addEventListener('click', handleUsersAction);
  document.getElementById('userSearchBtn').addEventListener('click', async () => loadUsers());
  document.getElementById('userSearchResetBtn').addEventListener('click', async () => {
    document.getElementById('userSearchInput').value = '';
    await loadUsers({ search: '' });
  });
  document.getElementById('usersReloadBtn').addEventListener('click', async () => loadUsers());

  // Wallet
  document.getElementById('depositsList').addEventListener('click', handleDepositAction);
  document.getElementById('withdrawalsList').addEventListener('click', handleWithdrawalAction);
  document.getElementById('walletDepositsReloadBtn').addEventListener('click', async () => loadWallet());
  document.getElementById('walletWithdrawalsReloadBtn').addEventListener('click', async () => loadWallet());
  document.getElementById('walletDepositStatusFilter').addEventListener('change', async () => loadWallet());
  document.getElementById('walletWithdrawalStatusFilter').addEventListener('change', async () => loadWallet());

  // Spot
  document.getElementById('spotPairsTableBody').addEventListener('click', handleSpotAction);
  document.getElementById('spotReloadBtn').addEventListener('click', async () => loadSpot());

  // P2P
  document.getElementById('p2pAdsList').addEventListener('click', handleP2PActions);
  document.getElementById('p2pDisputesList').addEventListener('click', handleP2PActions);
  document.getElementById('p2pReloadBtn').addEventListener('click', async () => loadP2P());

  // P2P Tab switching
  const p2pTabBar = document.getElementById('p2pTabBar');
  if (p2pTabBar) {
    p2pTabBar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-p2p-tab]');
      if (btn) switchP2PTab(btn.getAttribute('data-p2p-tab'));
    });
  }

  // P2P Trades table — actions delegated
  const p2pTradesBody = document.getElementById('p2pTradesTableBody');
  if (p2pTradesBody) {
    p2pTradesBody.addEventListener('click', handleP2PActions);
  }

  // User profile drawer - tab switching + close via event delegation
  document.getElementById('userProfileDrawer').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-up-tab]');
    if (btn) {
      switchUpTab(btn.getAttribute('data-up-tab'));
      return;
    }
  });
  document.getElementById('upCloseBtn').addEventListener('click', () => closeUserProfile());
  document.getElementById('userProfileOverlay').addEventListener('click', () => closeUserProfile());

  // Support ticket list - click delegation (ticket cards are rendered via innerHTML)
  document.getElementById('supportTicketsList').addEventListener('click', (e) => {
    const item = e.target.closest('[data-support-ticket-id]');
    if (!item) return;
    openTicket(item.getAttribute('data-support-ticket-id'));
  });

  // Support chat
  document.getElementById('supportReloadBtn').addEventListener('click', async () => loadSupport());
  document.getElementById('supportStatusFilter').addEventListener('change', async () => loadSupport());
  document.getElementById('sendReplyBtn').addEventListener('click', async () => sendAdminReply());
  document.getElementById('chatCloseTicketBtn').addEventListener('click', async () => {
    const ticketId = state.support.activeTicketId;
    if (!ticketId) {
      return;
    }
    try {
      await apiRequest(`/support/tickets/${encodeURIComponent(ticketId)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'CLOSED' })
      });
      showMessage('Ticket closed.', 'success');
      await loadSupport();
      await renderTicketChat(ticketId);
    } catch (error) {
      showMessage(error.message || 'Failed to close ticket.', 'error');
    }
  });
  document.getElementById('chatResolveBtn').addEventListener('click', async () => {
    const ticketId = state.support.activeTicketId;
    if (!ticketId) {
      return;
    }
    try {
      await apiRequest(`/support/tickets/${encodeURIComponent(ticketId)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'CLOSED' })
      });
      showMessage('Ticket resolved and closed.', 'success');
      await loadSupport();
      await renderTicketChat(ticketId);
    } catch (error) {
      showMessage(error.message || 'Failed to resolve ticket.', 'error');
    }
  });

  // Revenue
  // (no extra listeners beyond nav)

  // Risk
  document.getElementById('riskReloadBtn').addEventListener('click', async () => loadRisk());
  document.getElementById('blockedIpsList').addEventListener('click', handleRiskActions);
  document.getElementById('blockIpBtn').addEventListener('click', async () => {
    const ip = document.getElementById('blockIpInput').value.trim();
    const reason = document.getElementById('blockIpReason').value.trim();
    if (!ip) {
      return showMessage('IP address is required.', 'error');
    }
    try {
      await apiRequest('/risk/block-ip', {
        method: 'POST',
        body: JSON.stringify({ ip, reason: reason || 'Admin blocked' })
      });
      showMessage(`IP ${ip} blocked.`, 'success');
      document.getElementById('blockIpInput').value = '';
      document.getElementById('blockIpReason').value = '';
      await loadRisk();
    } catch (error) {
      showMessage(error.message || 'Failed to block IP.', 'error');
    }
  });

  document.getElementById('riskConfigForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      await apiRequest('/risk/config', {
        method: 'PUT',
        body: JSON.stringify({
          maxLeverage: Number(form.maxLeverage.value) || undefined,
          maxWithdrawalAmount: Number(form.maxWithdrawalAmount.value) || undefined,
          maxSingleTx: Number(form.maxSingleTx?.value) || undefined,
          minWithdrawalAmount: Number(form.minWithdrawalAmount.value) || undefined,
          minKycLevel: form.minKycLevel?.value || undefined,
          amlRiskThreshold: Number(form.amlRiskThreshold.value) || undefined
        })
      });
      showMessage('Risk config saved.', 'success');
    } catch (error) {
      showMessage(error.message || 'Failed to save risk config.', 'error');
    }
  });

  // Features
  document.getElementById('featuresReloadBtn').addEventListener('click', async () => loadFeatures());

  // Notifications
  document.getElementById('notifReloadBtn').addEventListener('click', async () => loadNotifications());

  document.getElementById('broadcastNotifForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const target = form.target ? form.target.value : 'all';
    const userId = form.userId ? form.userId.value : '';
    try {
      await broadcastNotification(form.title.value, form.message.value, form.priority.value, form.type.value, target, userId);
      showMessage('Broadcast notification sent.', 'success');
      form.reset();
      document.getElementById('notifUserIdWrap').style.display = 'none';
      await loadNotifications();
    } catch (error) {
      showMessage(error.message || 'Failed to broadcast notification.', 'error');
    }
  });

  // KYC filter tabs
  document.querySelectorAll('.kyc-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.kyc-tab-btn').forEach(b => {
        b.style.background = 'transparent';
        b.style.color = 'var(--text-2)';
      });
      btn.style.background = 'var(--accent)';
      btn.style.color = '#fff';
      const filterEl = document.getElementById('kycStatusFilter');
      if (filterEl) filterEl.value = btn.getAttribute('data-kyc-tab') || '';
      loadKyc();
    });
  });

  // Compliance flag type filter
  const compFlagTypeFilter = document.getElementById('compFlagTypeFilter');
  if (compFlagTypeFilter) compFlagTypeFilter.addEventListener('change', () => loadCompliance());

  // Blockchain
  document.getElementById('blockchainReloadBtn').addEventListener('click', async () => loadBlockchain());
  document.getElementById('withdrawalQueueBody').addEventListener('click', handleBlockchainActions);
  document.getElementById('blockchainTxBody').addEventListener('click', handleBlockchainActions);

  // Compliance
  document.getElementById('complianceReloadBtn').addEventListener('click', async () => loadCompliance());
  document.getElementById('complianceFlagForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      await apiRequest('/compliance/flags', {
        method: 'POST',
        body: JSON.stringify({
          userId: form.userId.value,
          type: form.type.value,
          severity: form.severity.value,
          reason: form.reason.value
        })
      });
      showMessage('Compliance flag created.', 'success');
      form.reset();
      await loadCompliance();
    } catch (error) {
      showMessage(error.message || 'Failed to create compliance flag.', 'error');
    }
  });
  document.getElementById('exportCsvBtn').addEventListener('click', () => {
    window.open('/api/admin/compliance/export/transactions.csv', '_blank');
  });

  // Settings
  document.getElementById('platformSettingsForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      await apiRequest('/settings/platform', {
        method: 'PUT',
        body: JSON.stringify({
          siteName: form.siteName.value,
          logoUrl: form.logoUrl.value,
          announcementBanner: form.announcementBanner.value,
          referralCommissionPercent: Number(form.referralCommissionPercent.value),
          signupBonusUsdt: Number(form.signupBonusUsdt.value),
          smtpHost: form.smtpHost.value,
          smtpPort: Number(form.smtpPort.value),
          smtpUser: form.smtpUser.value,
          smtpSecure: Boolean(form.smtpSecure.checked),
          maintenanceMode: Boolean(form.maintenanceMode.checked),
          globalTradingFees: {
            maker: Number(form.makerFee.value),
            taker: Number(form.takerFee.value)
          },
          features: {
            spotEnabled: Boolean(form.spotEnabled.checked),
            p2pEnabled: Boolean(form.p2pEnabled.checked),
            walletEnabled: Boolean(form.walletEnabled.checked),
            referralsEnabled: Boolean(form.referralsEnabled.checked),
            supportEnabled: Boolean(form.supportEnabled.checked)
          },
          compliance: {
            requireKycBeforeWithdrawal: Boolean(form.requireKycBeforeWithdrawal.checked)
          }
        })
      });
      showMessage('Platform settings saved.', 'success');
    } catch (error) {
      showMessage(error.message || 'Failed to save platform settings.', 'error');
    }
  });

  // Coin config
  document.getElementById('coinConfigForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      await apiRequest(`/wallet/config/${encodeURIComponent(String(form.coin.value || '').trim().toUpperCase())}`, {
        method: 'PUT',
        body: JSON.stringify({
          networkFee: Number(form.networkFee.value),
          minWithdrawal: Number(form.minWithdrawal.value),
          maxWithdrawal: Number(form.maxWithdrawal.value),
          withdrawalsEnabled: Boolean(form.withdrawalsEnabled.checked),
          depositsEnabled: Boolean(form.depositsEnabled.checked),
          defaultNetwork: String(form.defaultNetwork.value || 'TRC20').trim().toUpperCase(),
          depositAddresses: {
            TRC20: String(form.trc20Address.value || '').trim(),
            ERC20: String(form.erc20Address.value || '').trim(),
            BEP20: String(form.bep20Address.value || '').trim()
          },
          minDepositConfirmations: {
            TRC20: Number(form.trc20Confirmations.value || 20),
            ERC20: Number(form.erc20Confirmations.value || 12),
            BEP20: Number(form.bep20Confirmations.value || 15)
          },
          supportedNetworks: ['TRC20', 'ERC20', 'BEP20']
        })
      });
      showMessage('Coin wallet config updated.', 'success');
      await loadWallet();
    } catch (error) {
      showMessage(error.message || 'Failed to update coin config.', 'error');
    }
  });

  // P2P settings
  document.getElementById('p2pSettingsForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      await apiRequest('/p2p/settings', {
        method: 'PUT',
        body: JSON.stringify({
          p2pFeePercent: Number(form.p2pFeePercent.value),
          minOrderLimit: Number(form.minOrderLimit.value),
          maxOrderLimit: Number(form.maxOrderLimit.value),
          autoExpiryMinutes: Number(form.autoExpiryMinutes.value)
        })
      });
      showMessage('P2P settings saved.', 'success');
      await loadP2P();
    } catch (error) {
      showMessage(error.message || 'Failed to save P2P settings.', 'error');
    }
  });

  // Admin Users
  document.getElementById('adminUsersReloadBtn').addEventListener('click', async () => loadAdminUsers());
  document.getElementById('adminUsersTableBody').addEventListener('click', handleAdminUsersActions);
  document.getElementById('createAdminForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      await createAdmin(form.email.value, form.username.value, form.password.value, form.role.value);
      showMessage('Admin account created successfully.', 'success');
      form.reset();
      await loadAdminUsers();
    } catch (error) {
      showMessage(error.message || 'Failed to create admin account.', 'error');
    }
  });

  // Monitoring + Audit reload
  document.getElementById('monitoringReloadBtn').addEventListener('click', async () => loadMonitoring());
  document.getElementById('auditReloadBtn').addEventListener('click', async () => loadAudit());
}

// ─── Support ticket live-notify via SSE ─────────────────────────────────────
let _lastKnownOpenTicketCount = 0;
let _supportSSE = null;

function connectSupportSSE() {
  if (_supportSSE) { try { _supportSSE.close(); } catch(_) {} }
  _supportSSE = new EventSource('/api/admin/support/live-notify');
  _supportSSE.onmessage = (ev) => {
    try {
      const info = JSON.parse(ev.data);
      if (info && info.type === 'dispute') {
        // Dispute/appeal filed — show orange popup and badge on P2P section
        showDisputeNotification(info);
        const p2pBadge = document.getElementById('p2pDisputeBadge');
        if (p2pBadge) { p2pBadge.style.display = ''; p2pBadge.textContent = (parseInt(p2pBadge.textContent || '0') || 0) + 1; }
        if (state.currentView === 'p2p') { loadP2P().catch(() => {}); }
      } else {
        // Support ticket
        _lastKnownOpenTicketCount++;
        const badge = document.getElementById('supportBadge');
        if (badge) { badge.style.display = ''; badge.textContent = _lastKnownOpenTicketCount; }
        showSupportNotification(info);
        if (state.currentView === 'support' && !state.support.activeTicketId) {
          loadSupport().catch(() => {});
        }
      }
    } catch (_) {}
  };
  _supportSSE.onerror = () => {
    // Reconnect after 5s on error
    setTimeout(connectSupportSSE, 5000);
  };
}

async function pollSupportTickets() {
  try {
    const payload = await apiRequest('/support/tickets?limit=50');
    const tickets = Array.isArray(payload.tickets) ? payload.tickets : [];
    const openCount = tickets.filter(t => (t.status || '').toUpperCase() !== 'CLOSED').length;

    // Update sidebar badge
    const badge = document.getElementById('supportBadge');
    if (badge) {
      badge.style.display = openCount > 0 ? '' : 'none';
      badge.textContent = openCount;
    }
    _lastKnownOpenTicketCount = openCount;

    // If currently on support view, refresh list
    if (state.currentView === 'support' && !state.support.activeTicketId) {
      await loadSupport();
    }
  } catch (e) { /* silent */ }
}

function showSupportNotification(info) {
  // info can be string (legacy) or object { ticketId, subject, agentName, email }
  const isObj = info && typeof info === 'object';
  const agentName = isObj ? (info.agentName || 'Support Agent') : '';
  const subject   = isObj ? (info.subject || 'New support request') : String(info);
  const ticketId  = isObj ? info.ticketId : null;
  const userLabel = isObj ? (info.email || 'User') : '';

  const n = document.createElement('div');
  n.style.cssText = `position:fixed;top:18px;right:18px;z-index:9999;
    background:var(--bg-card);border:1px solid var(--accent);border-radius:14px;
    padding:14px 18px;display:flex;align-items:flex-start;gap:12px;cursor:pointer;
    box-shadow:0 8px 32px rgba(0,0,0,0.7);animation:fadeIn 0.22s ease;max-width:320px;`;

  const avatarColor = '#00b8d4';
  n.innerHTML = `
    <div style="width:38px;height:38px;border-radius:50%;background:${avatarColor}20;border:2px solid ${avatarColor}40;
                display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">🎧</div>
    <div style="flex:1;min-width:0;">
      <p style="margin:0 0 2px;font-size:12px;font-weight:700;color:var(--accent);">New Live Support Request</p>
      ${agentName ? `<p style="margin:0 0 2px;font-size:13px;font-weight:600;color:var(--text-1);">Agent: ${agentName}</p>` : ''}
      <p style="margin:0;font-size:11px;color:var(--text-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${subject}</p>
      ${userLabel ? `<p style="margin:2px 0 0;font-size:10px;color:var(--text-2);opacity:.7;">${userLabel}</p>` : ''}
      <p style="margin:4px 0 0;font-size:11px;color:var(--accent);font-weight:600;">👆 Click to respond</p>
    </div>
    <button onclick="event.stopPropagation();this.closest('[style]').remove();"
      style="background:none;border:none;color:var(--text-2);cursor:pointer;font-size:16px;padding:0;flex-shrink:0;">✕</button>`;

  n.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    n.remove();
    changeView('support').then(() => {
      if (ticketId) setTimeout(() => openTicket(ticketId), 400);
    });
  });

  document.body.appendChild(n);
  // Pulse the sidebar badge
  const badge = document.getElementById('supportBadge');
  if (badge) { badge.style.animation = 'none'; badge.style.transform = 'scale(1.4)'; setTimeout(() => { badge.style.transform = ''; }, 300); }
  setTimeout(() => { if (n.isConnected) n.remove(); }, 10000);
}

function showDisputeNotification(info) {
  const user = info.agentName || info.email || 'A user';
  const orderId = info.orderId || '';
  const ref = info.reference || orderId;
  const reason = info.message || info.appealType || 'No details';

  const n = document.createElement('div');
  n.style.cssText = `position:fixed;top:18px;right:18px;z-index:9999;
    background:var(--bg-card);border:1px solid #f97316;border-radius:14px;
    padding:14px 18px;display:flex;align-items:flex-start;gap:12px;cursor:pointer;
    box-shadow:0 8px 32px rgba(0,0,0,0.7);animation:fadeIn 0.22s ease;max-width:340px;`;
  n.innerHTML = `
    <div style="width:38px;height:38px;border-radius:50%;background:#f9731620;border:2px solid #f9731640;
                display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">⚠️</div>
    <div style="flex:1;min-width:0;">
      <p style="margin:0 0 2px;font-size:12px;font-weight:700;color:#f97316;">Dispute / Appeal Filed!</p>
      <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:var(--text-1);">${user}</p>
      <p style="margin:0;font-size:11px;color:var(--text-2);">Order: <b>#${ref}</b></p>
      <p style="margin:2px 0 0;font-size:11px;color:var(--text-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${reason}</p>
      <p style="margin:4px 0 0;font-size:11px;color:#f97316;font-weight:600;">👆 Click to view disputes</p>
    </div>
    <button onclick="event.stopPropagation();this.closest('[style]').remove();"
      style="background:none;border:none;color:var(--text-2);cursor:pointer;font-size:16px;padding:0;flex-shrink:0;">✕</button>`;

  n.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    n.remove();
    changeView('p2p');
  });

  document.body.appendChild(n);
  setTimeout(() => { if (n.isConnected) n.remove(); }, 15000);
}

async function init() {
  try {
    startLiveClock();
    await ensureAdminSession();
    wireEventListeners();
    await changeView('overview');

    // Refresh current view every 30s
    setInterval(async () => {
      await loadCurrentView({ silent: true });
    }, 30000);

    // SSE for instant new-ticket alerts
    connectSupportSSE();
    connectWithdrawalSSE();
    connectNewUserSSE();
    connectDepositSSE();
    connectKycSSE();
    // Poll support tickets every 15s for badge count sync
    await pollSupportTickets();
    await refreshWithdrawalNotifications({ silent: true });
    setInterval(pollSupportTickets, 15000);
    setInterval(() => refreshWithdrawalNotifications({ silent: true }), 15000);

    showMessage('Admin dashboard loaded.', 'success');
  } catch (error) {
    showMessage(error.message || 'Unable to load admin dashboard.', 'error');
  }
}

init();

// ─── Withdrawal Notifications ─────────────────────────────────────────────────
let _wdSSE = null;
let _wdPendingCount = 0;
let _wdPendingList = [];

function connectWithdrawalSSE() {
  if (_wdSSE) { try { _wdSSE.close(); } catch(_) {} }
  _wdSSE = new EventSource('/api/admin/withdrawal/live-notify');
  _wdSSE.onmessage = (ev) => {
    try {
      const info = JSON.parse(ev.data);
      if (info.type === 'new_withdrawal') {
        _wdPendingList.unshift(info);
        _wdPendingCount++;
        updateWithdrawalBadge();
        addNotif('withdrawal', 'New Withdrawal Request', `${info.amount || ''} ${info.currency || 'USDT'} from ${info.username || info.userId || 'User'}`);
        showWithdrawalNotification(info);
        if (state.currentView === 'wallet') {
          loadWallet().catch(() => {});
        }
      }
    } catch(_) {}
  };
  _wdSSE.onerror = () => setTimeout(connectWithdrawalSSE, 5000);
}

// ── New User SSE ──────────────────────────────────────────────────────────────
let _newUserSSE = null;
function connectNewUserSSE() {
  if (_newUserSSE) { try { _newUserSSE.close(); } catch(_) {} }
  _newUserSSE = new EventSource('/api/admin/user/live-notify');
  _newUserSSE.onmessage = (ev) => {
    try {
      const info = JSON.parse(ev.data);
      if (info.type === 'new_user') {
        showNewUserNotification(info);
        addNotif('user', 'New User Registered', info.email || info.username || 'Unknown');
        const badge = document.getElementById('usersBadge');
        if (badge) { badge.style.display = ''; badge.textContent = (parseInt(badge.textContent || '0') || 0) + 1; }
        if (state.currentView === 'users') loadUsers({ silent: true }).catch(() => {});
      }
    } catch(_) {}
  };
  _newUserSSE.onerror = () => setTimeout(connectNewUserSSE, 5000);
}
function showNewUserNotification(info) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#0f172a;border:1.5px solid #22c55e;border-radius:12px;padding:14px 18px;z-index:99999;min-width:260px;max-width:340px;box-shadow:0 8px 32px #0008;animation:slideInRight .3s ease;';
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
      <span style="font-size:20px;">👤</span>
      <span style="font-weight:700;color:#22c55e;font-size:13px;">New User Registered</span>
      <button onclick="this.parentElement.parentElement.remove()" style="margin-left:auto;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;line-height:1;">×</button>
    </div>
    <div style="font-size:12px;color:#e2e8f0;">${info.email || info.username || 'Unknown'}</div>
    <div style="font-size:11px;color:#64748b;margin-top:3px;">${info.userId ? 'ID: ' + info.userId.slice(0,16) + '...' : ''}</div>`;
  document.body.appendChild(el);
  setTimeout(() => { try { el.remove(); } catch(_) {} }, 7000);
}

// ── New Deposit SSE ───────────────────────────────────────────────────────────
let _depositSSE = null;
function connectDepositSSE() {
  if (_depositSSE) { try { _depositSSE.close(); } catch(_) {} }
  _depositSSE = new EventSource('/api/admin/deposit/live-notify');
  _depositSSE.onmessage = (ev) => {
    try {
      const info = JSON.parse(ev.data);
      if (info.type === 'new_deposit') {
        showDepositNotification(info);
        addNotif('deposit', 'New Deposit Request', `${info.amount || ''} ${info.coin || 'USDT'} from ${info.username || info.email || 'User'}`);
        if (state.currentView === 'wallet') loadWallet().catch(() => {});
      }
    } catch(_) {}
  };
  _depositSSE.onerror = () => setTimeout(connectDepositSSE, 5000);
}
function showDepositNotification(info) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#0f172a;border:1.5px solid #3b82f6;border-radius:12px;padding:14px 18px;z-index:99999;min-width:260px;max-width:340px;box-shadow:0 8px 32px #0008;animation:slideInRight .3s ease;';
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
      <span style="font-size:20px;">💰</span>
      <span style="font-weight:700;color:#3b82f6;font-size:13px;">New Deposit Request</span>
      <button onclick="this.parentElement.parentElement.remove()" style="margin-left:auto;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;line-height:1;">×</button>
    </div>
    <div style="font-size:13px;color:#e2e8f0;font-weight:600;">${info.amount || ''} ${info.coin || 'USDT'}</div>
    <div style="font-size:12px;color:#94a3b8;margin-top:3px;">From: ${info.email || info.username || 'Unknown'}</div>`;
  document.body.appendChild(el);
  setTimeout(() => { try { el.remove(); } catch(_) {} }, 8000);
}

// ── KYC Submission SSE ────────────────────────────────────────────────────────
let _kycSSE = null;
function connectKycSSE() {
  if (_kycSSE) { try { _kycSSE.close(); } catch(_) {} }
  _kycSSE = new EventSource('/api/admin/kyc/live-notify');
  _kycSSE.onmessage = (ev) => {
    try {
      const info = JSON.parse(ev.data);
      if (info.type === 'kyc_submitted') {
        showKycNotification(info);
        addNotif('kyc', 'KYC Documents Submitted', `${info.email || info.username || 'User'} — Status: ${info.status || 'PENDING'}`);
        if (state.currentView === 'users') loadUsers({ silent: true }).catch(() => {});
      }
    } catch(_) {}
  };
  _kycSSE.onerror = () => setTimeout(connectKycSSE, 5000);
}
function showKycNotification(info) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#0f172a;border:1.5px solid #f59e0b;border-radius:12px;padding:14px 18px;z-index:99999;min-width:260px;max-width:340px;box-shadow:0 8px 32px #0008;animation:slideInRight .3s ease;';
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
      <span style="font-size:20px;">📋</span>
      <span style="font-weight:700;color:#f59e0b;font-size:13px;">KYC Documents Submitted</span>
      <button onclick="this.parentElement.parentElement.remove()" style="margin-left:auto;background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;line-height:1;">×</button>
    </div>
    <div style="font-size:12px;color:#e2e8f0;">${info.email || info.username || 'Unknown'}</div>
    <div style="font-size:11px;color:#64748b;margin-top:3px;">Status: ${info.status || 'PENDING_REVIEW'}</div>`;
  document.body.appendChild(el);
  setTimeout(() => { try { el.remove(); } catch(_) {} }, 8000);
}

async function refreshWithdrawalNotifications({ silent = false } = {}) {
  try {
    const data = await apiRequest('/wallet/withdrawals?status=pending&limit=50');
    const rows = Array.isArray(data.withdrawals) ? data.withdrawals : [];
    _wdPendingList = rows;
    _wdPendingCount = rows.length;
    updateWithdrawalBadge();
    if (rows.length > 0) {
      addNotif('withdrawal', 'Pending Withdrawals', `${rows.length} withdrawal request(s) awaiting approval`);
    }
    if (!silent && state.currentView === 'wallet') {
      await loadWallet();
    }
  } catch (_) {}
}

// ── Notification Bell ──────────────────────────────────────────
var _notifs = [];

function toggleNotifPanel() {
  var panel = document.getElementById('notifPanel');
  if (!panel) return;
  var open = panel.style.display !== 'none';
  panel.style.display = open ? 'none' : 'block';
  if (!open) renderNotifPanel();
}

// Close panel on outside click
document.addEventListener('click', function(e) {
  var wrap = document.getElementById('notifBellWrap');
  if (wrap && !wrap.contains(e.target)) {
    var panel = document.getElementById('notifPanel');
    if (panel) panel.style.display = 'none';
  }
});

function addNotif(type, title, body, time) {
  // avoid duplicates by title+type
  if (_notifs.find(function(n){ return n.title === title && n.type === type; })) return;
  _notifs.unshift({ type: type, title: title, body: body, time: time || new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) });
  if (_notifs.length > 50) _notifs.length = 50;
  updateNotifBadge();
}

function updateNotifBadge() {
  var badge = document.getElementById('notifBellBadge');
  if (!badge) return;
  if (_notifs.length > 0) {
    badge.style.display = 'flex';
    badge.textContent = _notifs.length > 99 ? '99+' : _notifs.length;
  } else {
    badge.style.display = 'none';
  }
}

function clearAllNotifs() {
  _notifs = [];
  updateNotifBadge();
  renderNotifPanel();
}

function renderNotifPanel() {
  var list = document.getElementById('notifList');
  var empty = document.getElementById('notifEmpty');
  if (!list) return;
  if (_notifs.length === 0) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  var icons = { withdrawal:'💸', deposit:'⬇️', kyc:'🪪', support:'💬', system:'⚙️' };
  var colors = { withdrawal:'#f6465d', deposit:'#0ecb81', kyc:'#f0b90b', support:'#00b8d4', system:'#a78bfa' };
  list.innerHTML = _notifs.map(function(n, i) {
    var ic = icons[n.type] || '🔔';
    var cl = colors[n.type] || '#fff';
    return '<div onclick="handleNotifClick(\''+n.type+'\')" style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,0.04);cursor:pointer;transition:background 0.1s;" onmouseenter="this.style.background=\'rgba(255,255,255,0.04)\'" onmouseleave="this.style.background=\'\'">'
      + '<div style="width:32px;height:32px;border-radius:50%;background:'+cl+'18;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;">'+ic+'</div>'
      + '<div style="flex:1;min-width:0;">'
      + '<div style="font-size:12px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+n.title+'</div>'
      + '<div style="font-size:11px;color:rgba(255,255,255,0.45);margin-top:2px;line-height:1.4;">'+n.body+'</div>'
      + '</div>'
      + '<div style="font-size:10px;color:rgba(255,255,255,0.25);flex-shrink:0;margin-top:1px;">'+n.time+'</div>'
      + '</div>';
  }).join('');
}

function handleNotifClick(type) {
  document.getElementById('notifPanel').style.display = 'none';
  if (type === 'withdrawal') openWithdrawalPanel();
  else if (type === 'kyc') showPanel('kyc');
  else if (type === 'support') showPanel('notifications');
  else if (type === 'deposit') showPanel('wallet');
}

// Poll for new alerts every 30s
function pollNotifAlerts() {
  apiRequest('/wallet/overview').then(function(data) {
    if (!data) return;
    if ((data.pendingWithdrawals || 0) > 0) addNotif('withdrawal', 'Pending Withdrawals', (data.pendingWithdrawals||0)+' withdrawal request(s) awaiting approval');
  }).catch(function(){});
  apiRequest('/wallet/withdrawals?status=PENDING&limit=50').then(function(data) {
    var arr = data && (data.withdrawals || data.rows || []);
    if (arr && arr.length > 0) addNotif('withdrawal', 'Pending Withdrawals', arr.length+' withdrawal request(s) awaiting approval');
  }).catch(function(){});
  apiRequest('/wallet/deposits?status=pending&limit=1').then(function(data) {
    var arr = data && (data.deposits || data.rows || []);
    if (arr && arr.length > 0) addNotif('deposit', 'Pending Deposits', arr.length+' deposit(s) need review');
  }).catch(function(){});
}
setTimeout(pollNotifAlerts, 2000);
setInterval(pollNotifAlerts, 30000);

function updateWithdrawalBadge() {
  const badge = document.getElementById('withdrawalBadge');
  if (!badge) return;
  if (_wdPendingCount > 0) {
    badge.style.display = 'flex';
    badge.textContent = _wdPendingCount;
    addNotif('withdrawal', 'Pending Withdrawals', _wdPendingCount + ' withdrawal request(s) awaiting approval');
  } else {
    badge.style.display = 'none';
  }
}

function showWithdrawalNotification(info) {
  const n = document.createElement('div');
  n.style.cssText = `position:fixed;top:18px;right:18px;z-index:10000;
    background:#141821;border:1px solid rgba(0,229,255,0.3);border-radius:14px;
    padding:14px 18px;display:flex;align-items:flex-start;gap:12px;cursor:pointer;
    box-shadow:0 8px 32px rgba(0,0,0,0.7);animation:fadeIn 0.22s ease;max-width:340px;`;
  n.innerHTML = `
    <div style="width:38px;height:38px;border-radius:50%;background:rgba(0,229,255,0.1);border:2px solid rgba(0,229,255,0.3);
                display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">💸</div>
    <div style="flex:1;min-width:0;">
      <p style="margin:0 0 2px;font-size:12px;font-weight:700;color:#00b8d4;">New Withdrawal Request</p>
      <p style="margin:0 0 2px;font-size:13px;font-weight:600;color:#eaecef;">${info.username || 'User'}</p>
      <p style="margin:0 0 2px;font-size:13px;color:#eaecef;font-weight:700;">${info.amount} ${info.currency || 'USDT'} <span style="font-size:11px;color:#848e9c;">(${info.network || ''})</span></p>
      <p style="margin:2px 0 0;font-size:10px;color:#848e9c;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${info.address || ''}</p>
      <p style="margin:4px 0 0;font-size:11px;color:#00b8d4;font-weight:600;">👆 Click to review</p>
    </div>
    <button onclick="event.stopPropagation();this.closest('[style]').remove();"
      style="background:none;border:none;color:#848e9c;cursor:pointer;font-size:16px;padding:0;flex-shrink:0;">✕</button>`;
  n.addEventListener('click', (e) => { if (e.target.tagName === 'BUTTON') return; n.remove(); openWithdrawalPanel(); });
  document.body.appendChild(n);
  setTimeout(() => { if (n.isConnected) n.remove(); }, 12000);
}

function _wdRenderRows(withdrawals) {
  if (withdrawals.length === 0) {
    return `<div style="padding:2rem;text-align:center;color:#848e9c;">No pending withdrawals 🎉</div>`;
  }
  return withdrawals.map((w, idx) => {
    const id = String(w.requestId || w.id || '').trim();
    const address = String(w.address || w.toAddress || w.to || '-').trim();
    const detailId = 'wdDetail_' + idx;
    const fee = w.fee != null ? String(w.fee) : '0';
    const createdAt = w.createdAt ? formatDate(w.createdAt) : '-';
    const processedAt = w.processedAt ? formatDate(w.processedAt) : '-';
    const userName = escapeHtml(w.username || w.userId || 'User');
    const displayName = escapeHtml(w.name || w.username || w.userId || 'User');
    const userEmail = escapeHtml(w.email || '-');
    return `
    <div style="border-bottom:1px solid rgba(255,255,255,0.06);">
      <div onclick="wdToggleDetail('${detailId}')" style="padding:14px 16px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px;">
        <div style="flex:1;min-width:0;">
          <div style="font-size:16px;font-weight:800;color:#eaecef;">${escapeHtml(String(w.amount))} <span style="color:#00e5ff;">${escapeHtml(w.currency || w.coin || 'USDT')}</span></div>
          <div style="font-size:11px;color:#848e9c;margin-top:2px;">${displayName} &nbsp;·&nbsp; ${escapeHtml(createdAt)}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          ${statusBadge(w.status || 'pending')}
          <span style="color:#848e9c;font-size:16px;" id="${detailId}_arr">▸</span>
        </div>
      </div>
      <div id="${detailId}" style="display:none;padding:0 16px 14px;">
        <div style="padding:12px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;background:rgba(255,255,255,0.03);display:grid;gap:7px;font-size:12px;color:#c9d1d9;margin-bottom:10px;">
          <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Name:</span> <b style="color:#eaecef;">${escapeHtml(w.name || userName)}</b></div>
          <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Username:</span> <span style="color:#c9d1d9;">${userName}</span></div>
          <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Email:</span> <span style="color:#00e5ff;">${userEmail !== '-' ? userEmail : '<span style="color:#848e9c;">-</span>'}</span></div>
          <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Network:</span> ${escapeHtml(w.network || '-')}</div>
          <div style="word-break:break-all;"><span style="color:#848e9c;min-width:90px;display:inline-block;">Address:</span> ${escapeHtml(address)}</div>
          <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Fee:</span> ${escapeHtml(fee)} USDT</div>
          <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Request ID:</span> <span style="font-size:10px;word-break:break-all;">${escapeHtml(id || '-')}</span></div>
          <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Submitted:</span> ${escapeHtml(createdAt)}</div>
          <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Processed:</span> ${escapeHtml(processedAt)}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <button onclick="wdAction('${escapeHtml(id)}','APPROVED',this)"
            style="background:#02c076;color:#fff;border:none;border-radius:8px;padding:10px 14px;font-size:12px;font-weight:800;cursor:pointer;">✓ Approve</button>
          <button onclick="wdAction('${escapeHtml(id)}','REJECTED',this)"
            style="background:#f6465d;color:#fff;border:none;border-radius:8px;padding:10px 14px;font-size:12px;font-weight:800;cursor:pointer;">✕ Reject</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

async function _wdLoadIntoPanel() {
  const panelBody = document.getElementById('wdPanelBody');
  const panelSub = document.getElementById('wdPanelSub');
  if (!panelBody) return;
  panelBody.innerHTML = '<div style="padding:2rem;text-align:center;color:#848e9c;">Loading...</div>';
  let withdrawals = [];
  try {
    const data = await apiRequest('/wallet/withdrawals?status=pending&limit=50');
    withdrawals = Array.isArray(data.withdrawals) ? data.withdrawals : [];
  } catch(e) {}
  _wdPendingCount = withdrawals.length;
  updateWithdrawalBadge();
  if (panelSub) panelSub.textContent = withdrawals.length + ' pending';
  panelBody.innerHTML = _wdRenderRows(withdrawals);
}

async function openWithdrawalPanel() {
  const existing = document.getElementById('wdPanel');
  if (existing) { existing.remove(); return; }

  const panel = document.createElement('div');
  panel.id = 'wdPanel';
  panel.style.cssText = 'position:fixed;top:0;right:0;width:420px;max-width:100vw;height:100vh;background:#0d1117;border-left:1px solid rgba(255,255,255,0.07);z-index:99999;display:flex;flex-direction:column;overflow:hidden;box-shadow:-4px 0 24px rgba(0,0,0,0.5);';
  panel.innerHTML = `
    <div style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:space-between;">
      <div><div style="font-size:15px;font-weight:700;color:#eaecef;">💸 Withdrawal Requests</div><div style="font-size:12px;color:#848e9c;" id="wdPanelSub">Loading...</div></div>
      <button onclick="document.getElementById('wdPanel').remove();" style="background:none;border:none;color:#848e9c;cursor:pointer;font-size:20px;">✕</button>
    </div>
    <div style="flex:1;overflow-y:auto;" id="wdPanelBody"><div style="padding:2rem;text-align:center;color:#848e9c;">Loading...</div></div>`;
  document.body.appendChild(panel);

  // Load pending withdrawals from server
  let withdrawals = [];
  try {
    const data = await apiRequest('/wallet/withdrawals?status=PENDING&limit=50');
    withdrawals = (data.withdrawals || []);
  } catch(e) {}

  const panelBody = document.getElementById('wdPanelBody');
  const panelSub = document.getElementById('wdPanelSub');
  if (!panelBody) return;

  if (panelSub) panelSub.textContent = withdrawals.length + ' pending';

  const rows = withdrawals.length === 0
    ? `<div style="padding:2rem;text-align:center;color:#848e9c;">No pending withdrawals 🎉</div>`
    : withdrawals.map((w, idx) => {
      const id = String(w.requestId || w.id || '').trim();
      const address = String(w.address || w.toAddress || w.to || '-').trim();
      const detailId = 'wdDetail_' + idx;
      const fee = w.fee != null ? String(w.fee) : '0';
      const createdAt = w.createdAt ? formatDate(w.createdAt) : '-';
      const processedAt = w.processedAt ? formatDate(w.processedAt) : '-';
      const userName = escapeHtml(w.username || w.userId || 'User');
      const userEmail = escapeHtml(w.email || '-');
      return `
      <div style="border-bottom:1px solid rgba(255,255,255,0.06);">
        <div onclick="wdToggleDetail('${detailId}')" style="padding:14px 16px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:10px;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:16px;font-weight:800;color:#eaecef;">${escapeHtml(String(w.amount))} <span style="color:#00b8d4;">${escapeHtml(w.currency || w.coin || 'USDT')}</span></div>
            <div style="font-size:11px;color:#848e9c;margin-top:2px;">${userName} &nbsp;·&nbsp; ${escapeHtml(createdAt)}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            ${statusBadge(w.status || 'PENDING')}
            <span style="color:#848e9c;font-size:16px;" id="${detailId}_arr">▸</span>
          </div>
        </div>
        <div id="${detailId}" style="display:none;padding:0 16px 14px;">
          <div style="padding:12px;border:1px solid rgba(255,255,255,0.08);border-radius:10px;background:rgba(255,255,255,0.03);display:grid;gap:7px;font-size:12px;color:#c9d1d9;margin-bottom:10px;">
            <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Username:</span> <b style="color:#eaecef;">${userName}</b></div>
            <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Email:</span> ${userEmail}</div>
            <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Network:</span> ${escapeHtml(w.network || '-')}</div>
            <div style="word-break:break-all;"><span style="color:#848e9c;min-width:90px;display:inline-block;">Address:</span> ${escapeHtml(address)}</div>
            <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Fee:</span> ${escapeHtml(fee)} USDT</div>
            <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Request ID:</span> <span style="font-size:10px;word-break:break-all;">${escapeHtml(id || '-')}</span></div>
            <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Submitted:</span> ${escapeHtml(createdAt)}</div>
            <div><span style="color:#848e9c;min-width:90px;display:inline-block;">Processed:</span> ${escapeHtml(processedAt)}</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            <button onclick="wdAction('${escapeHtml(id)}','APPROVED',this)"
              style="background:#02c076;color:#fff;border:none;border-radius:8px;padding:10px 14px;font-size:12px;font-weight:800;cursor:pointer;">Approve</button>
            <button onclick="wdAction('${escapeHtml(id)}','REJECTED',this)"
              style="background:#f6465d;color:#fff;border:none;border-radius:8px;padding:10px 14px;font-size:12px;font-weight:800;cursor:pointer;">Reject</button>
          </div>
        </div>
      </div>`;
    }).join('');

  panelBody.innerHTML = rows;
}

function wdToggleDetail(detailId) {
  const el = document.getElementById(detailId);
  const arr = document.getElementById(detailId + '_arr');
  if (!el) return;
  const open = el.style.display !== 'none';
  el.style.display = open ? 'none' : 'block';
  if (arr) arr.textContent = open ? '▸' : '▾';
}

async function wdAction(withdrawalId, decision, btn) {
  btn.disabled = true;
  btn.textContent = '…';
  try {
    await apiRequest(`/wallet/withdrawals/${encodeURIComponent(withdrawalId)}/review`, {
      method: 'POST',
      body: JSON.stringify({ decision, reason: decision === 'APPROVED' ? 'Approved by admin' : 'Rejected by admin' })
    });
    showMessage(
      decision === 'APPROVED' ? 'Withdrawal approved. Balance deducted.' : 'Withdrawal rejected. Funds returned to user.',
      decision === 'APPROVED' ? 'success' : 'error'
    );
    // Reload panel with fresh data so badge count and list stay accurate
    await _wdLoadIntoPanel();
  } catch(e) {
    showMessage(e.message || 'Action failed', 'error');
    btn.disabled = false;
    btn.textContent = decision === 'APPROVED' ? '✓ Approve' : '✕ Reject';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FUTURES / DERIVATIVES
// ─────────────────────────────────────────────────────────────────────────────

let _futuresPage = 0;

async function loadFutures() {
  const userFilter = (document.getElementById('futuresUserSearch')?.value || '').trim();
  const tbody = document.getElementById('futuresPositionsBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:var(--text-2);padding:20px;">Loading…</td></tr>';

  try {
    const q = new URLSearchParams({ limit: '50' });
    if (userFilter) q.set('userId', userFilter);
    const data = await apiRequest('/futures/positions?' + q.toString());
    const positions = Array.isArray(data.positions) ? data.positions : [];

    // Stats cards
    const openCount = positions.filter(p => p.status === 'OPEN').length;
    const totalPnl = positions.reduce((s, p) => s + Number(p.unrealizedPnl || p.pnl || 0), 0);
    renderCards('futuresCards', [
      { icon: '📊', label: 'Total Positions', value: String(positions.length) },
      { icon: '✅', label: 'Open Positions', value: String(openCount) },
      { icon: '💰', label: 'Total Unrealized PnL', value: `₹${formatNumber(totalPnl, 2)}` }
    ]);

    if (!positions.length) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center;color:var(--text-2);padding:20px;">No futures positions found.</td></tr>';
      return;
    }

    tbody.innerHTML = positions.map(p => {
      const pnl = Number(p.unrealizedPnl || p.pnl || 0);
      const pnlColor = pnl >= 0 ? 'var(--green)' : 'var(--red)';
      const statusColor = p.status === 'OPEN' ? '#1bd67d' : p.status === 'LIQUIDATED' ? '#f6465d' : 'var(--text-2)';
      return `<tr>
        <td class="admin-td" style="font-family:monospace;font-size:11px;">${escapeHtml(p.id || '-')}</td>
        <td class="admin-td" style="font-size:12px;">${escapeHtml(p.userId || p.username || '-')}</td>
        <td class="admin-td" style="font-weight:700;color:#00b8d4;">${escapeHtml(p.symbol || '-')}</td>
        <td class="admin-td"><span style="color:${p.side === 'LONG' ? '#1bd67d' : '#f6465d'};font-weight:700;">${escapeHtml(p.side || '-')}</span></td>
        <td class="admin-td">${formatNumber(p.size || p.quantity || 0, 4)}</td>
        <td class="admin-td">₹${formatNumber(p.entryPrice || 0, 4)}</td>
        <td class="admin-td">${escapeHtml(String(p.leverage || '-'))}x</td>
        <td class="admin-td" style="color:${pnlColor};font-weight:700;">₹${formatNumber(pnl, 2)}</td>
        <td class="admin-td"><span style="color:${statusColor};font-weight:700;">${escapeHtml(p.status || '-')}</span></td>
        <td class="admin-td">
          ${p.status === 'OPEN' ? `<button onclick="forceCloseFuturesPosition('${escapeHtml(p.id)}',this)" style="padding:4px 10px;border-radius:6px;background:rgba(246,70,93,0.12);color:#f6465d;border:1px solid rgba(246,70,93,0.3);font-size:11px;font-weight:700;cursor:pointer;">Force Close</button>` : '<span style="color:var(--text-2);font-size:11px;">—</span>'}
        </td>
      </tr>`;
    }).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:var(--red);padding:20px;">Error: ${escapeHtml(e.message)}</td></tr>`;
  }

  // Also load liquidations
  loadFuturesLiquidations();
}

async function loadFuturesLiquidations() {
  const tbody = document.getElementById('futuresLiquidationsBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-2);padding:20px;">Loading…</td></tr>';
  try {
    const data = await apiRequest('/futures/liquidations?limit=30');
    const liquidations = Array.isArray(data.liquidations) ? data.liquidations : [];
    if (!liquidations.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-2);padding:20px;">No recent liquidations.</td></tr>';
      return;
    }
    tbody.innerHTML = liquidations.map(l => `<tr>
      <td class="admin-td" style="font-family:monospace;font-size:11px;">${escapeHtml(l.id || '-')}</td>
      <td class="admin-td" style="font-size:12px;">${escapeHtml(l.userId || '-')}</td>
      <td class="admin-td" style="color:#00b8d4;font-weight:700;">${escapeHtml(l.symbol || '-')}</td>
      <td class="admin-td">${formatNumber(l.size || l.quantity || 0, 4)}</td>
      <td class="admin-td">₹${formatNumber(l.liquidationPrice || l.price || 0, 4)}</td>
      <td class="admin-td" style="color:var(--red);font-weight:700;">₹${formatNumber(l.loss || l.realizedLoss || 0, 2)}</td>
      <td class="admin-td" style="font-size:11px;">${formatDate(l.createdAt || l.liquidatedAt)}</td>
    </tr>`).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--red);padding:20px;">Error: ${escapeHtml(e.message)}</td></tr>`;
  }
}

async function forceCloseFuturesPosition(positionId, btn) {
  if (!confirm('Force close this futures position? This cannot be undone.')) return;
  btn.disabled = true;
  btn.textContent = '…';
  try {
    await apiRequest(`/futures/positions/${encodeURIComponent(positionId)}/force-close`, { method: 'POST', body: JSON.stringify({}) });
    showMessage('Position force-closed successfully.', 'success');
    loadFutures();
  } catch(e) {
    showMessage(e.message || 'Force close failed.', 'error');
    btn.disabled = false;
    btn.textContent = 'Force Close';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const futuresReloadBtn = document.getElementById('futuresReloadBtn');
  if (futuresReloadBtn) futuresReloadBtn.addEventListener('click', function() { loadFutures(); });
});


// ─────────────────────────────────────────────────────────────────────────────
// LEDGER
// ─────────────────────────────────────────────────────────────────────────────

let _ledgerPage = 1;
const _ledgerPageSize = 50;

async function loadLedger(page) {
  if (typeof page === 'number') _ledgerPage = page;
  const tbody = document.getElementById('ledgerTableBody');
  const countEl = document.getElementById('ledgerCount');
  const pageEl = document.getElementById('ledgerPageInfo');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-2);padding:20px;">Loading…</td></tr>';

  const userId = (document.getElementById('ledgerUserFilter')?.value || '').trim();
  const type   = (document.getElementById('ledgerTypeFilter')?.value || '').trim();

  // Build export URL with current filters
  const exportLink = document.getElementById('ledgerExportBtn');
  if (exportLink) {
    const ep = new URLSearchParams();
    if (userId) ep.set('userId', userId);
    if (type)   ep.set('type', type);
    exportLink.href = `/api/admin/ledger/export.csv?${ep.toString()}`;
  }

  try {
    const q = new URLSearchParams({ limit: String(_ledgerPageSize), offset: String((_ledgerPage - 1) * _ledgerPageSize) });
    if (userId) q.set('userId', userId);
    if (type)   q.set('type', type);

    const data = await apiRequest('/ledger?' + q.toString());
    const entries = Array.isArray(data.entries) ? data.entries : (Array.isArray(data.transactions) ? data.transactions : []);
    const total   = Number(data.total || data.count || entries.length);

    if (countEl) countEl.textContent = `${total.toLocaleString()} entries`;
    if (pageEl) pageEl.textContent = `Page ${_ledgerPage}`;

    const prevBtn = document.getElementById('ledgerPrevBtn');
    const nextBtn = document.getElementById('ledgerNextBtn');
    if (prevBtn) prevBtn.disabled = _ledgerPage <= 1;
    if (nextBtn) nextBtn.disabled = entries.length < _ledgerPageSize;

    if (!entries.length) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-2);padding:20px;">No ledger entries found.</td></tr>';
      return;
    }

    tbody.innerHTML = entries.map(e => {
      const amount = Number(e.amount || e.credit || e.debit || 0);
      const isCredit = e.type === 'DEPOSIT' || e.type === 'REFERRAL_BONUS' || e.type === 'ADJUSTMENT' || e.credit;
      const amountColor = isCredit ? 'var(--green)' : 'var(--red)';
      const amountPrefix = isCredit ? '+' : '-';
      return `<tr>
        <td class="admin-td" style="font-family:monospace;font-size:11px;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(e.id||'-')}">${escapeHtml(String(e.id||'-').slice(0,12))}…</td>
        <td class="admin-td" style="font-size:12px;">${escapeHtml(e.userId || e.username || '-')}</td>
        <td class="admin-td"><span style="padding:2px 8px;border-radius:6px;background:rgba(0,184,212,0.1);color:#00b8d4;font-size:11px;font-weight:700;">${escapeHtml(e.type || '-')}</span></td>
        <td class="admin-td" style="font-weight:700;">${escapeHtml(e.asset || e.coin || e.currency || 'USDT')}</td>
        <td class="admin-td" style="text-align:right;color:${amountColor};font-weight:700;font-family:monospace;">${amountPrefix}${formatNumber(Math.abs(amount), 6)}</td>
        <td class="admin-td" style="text-align:right;font-family:monospace;font-size:12px;">${e.balanceAfter != null ? formatNumber(e.balanceAfter, 6) : '—'}</td>
        <td class="admin-td" style="font-family:monospace;font-size:11px;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(e.reference||e.txHash||'-')}">${escapeHtml(String(e.reference || e.txHash || e.orderId || '—').slice(0,14))}</td>
        <td class="admin-td" style="font-size:11px;white-space:nowrap;">${formatDate(e.createdAt || e.timestamp)}</td>
      </tr>`;
    }).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--red);padding:20px;">Error: ${escapeHtml(e.message)}</td></tr>`;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const ledgerReloadBtn = document.getElementById('ledgerReloadBtn');
  if (ledgerReloadBtn) ledgerReloadBtn.addEventListener('click', function() { _ledgerPage = 1; loadLedger(1); });

  const prevBtn = document.getElementById('ledgerPrevBtn');
  if (prevBtn) prevBtn.addEventListener('click', function() { if (_ledgerPage > 1) loadLedger(_ledgerPage - 1); });

  const nextBtn = document.getElementById('ledgerNextBtn');
  if (nextBtn) nextBtn.addEventListener('click', function() { loadLedger(_ledgerPage + 1); });
});


// ─────────────────────────────────────────────────────────────────────────────
// API KEYS MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

async function loadApiKeys() {
  // Load stats
  const statsBody = document.getElementById('apikeysStatsBody');
  if (statsBody) {
    try {
      const stats = await apiRequest('/apikeys/stats');
      statsBody.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:12px 0;">
          <div style="background:var(--bg-input);border-radius:10px;padding:14px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:var(--text-1);">${escapeHtml(String(stats.total || 0))}</div>
            <div style="font-size:11px;color:var(--text-2);margin-top:4px;">Total Keys</div>
          </div>
          <div style="background:var(--bg-input);border-radius:10px;padding:14px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:#1bd67d;">${escapeHtml(String(stats.active || 0))}</div>
            <div style="font-size:11px;color:var(--text-2);margin-top:4px;">Active</div>
          </div>
          <div style="background:var(--bg-input);border-radius:10px;padding:14px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:#f6465d;">${escapeHtml(String(stats.revoked || 0))}</div>
            <div style="font-size:11px;color:var(--text-2);margin-top:4px;">Revoked</div>
          </div>
          <div style="background:var(--bg-input);border-radius:10px;padding:14px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:#ffd87a;">${escapeHtml(String(stats.usersWithKeys || stats.uniqueUsers || 0))}</div>
            <div style="font-size:11px;color:var(--text-2);margin-top:4px;">Users</div>
          </div>
        </div>`;
    } catch(e) {
      statsBody.innerHTML = `<div style="color:var(--red);padding:12px;font-size:12px;">Failed to load stats: ${escapeHtml(e.message)}</div>`;
    }
  }

  // Load all keys
  const tbody = document.getElementById('apikeysTableBody');
  const countEl = document.getElementById('apikeysCount');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-2);padding:20px;">Loading…</td></tr>';

  try {
    const statusFilter = (document.getElementById('apikeyStatusFilter')?.value || '').trim();
    const q = new URLSearchParams({ limit: '100' });
    if (statusFilter) q.set('status', statusFilter);

    const data = await apiRequest('/apikeys?' + q.toString());
    const keys = Array.isArray(data.keys) ? data.keys : (Array.isArray(data.apiKeys) ? data.apiKeys : []);

    if (countEl) countEl.textContent = `${keys.length} keys`;

    if (!keys.length) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--text-2);padding:20px;">No API keys found.</td></tr>';
      return;
    }

    tbody.innerHTML = keys.map(k => {
      const statusColor = k.status === 'ACTIVE' ? '#1bd67d' : k.status === 'REVOKED' ? '#f6465d' : '#ffd87a';
      const perms = Array.isArray(k.permissions) ? k.permissions.join(', ') : (k.permissions || k.scopes || '—');
      const keyId = escapeHtml(k.id || k.keyId || '-');
      const canRevoke = k.status === 'ACTIVE';
      return `<tr>
        <td class="admin-td" style="font-family:monospace;font-size:11px;">${keyId.slice(0,16)}…</td>
        <td class="admin-td" style="font-size:12px;">${escapeHtml(k.userId || '-')}</td>
        <td class="admin-td">${escapeHtml(k.label || k.name || '—')}</td>
        <td class="admin-td" style="font-size:11px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeHtml(String(perms))}">${escapeHtml(String(perms))}</td>
        <td class="admin-td"><span style="color:${statusColor};font-weight:700;">${escapeHtml(k.status || '-')}</span></td>
        <td class="admin-td" style="font-size:11px;">${k.lastUsedAt ? formatDate(k.lastUsedAt) : '—'}</td>
        <td class="admin-td" style="font-size:11px;">${formatDate(k.createdAt)}</td>
        <td class="admin-td">
          ${canRevoke
            ? `<button onclick="revokeApiKey('${escapeHtml(k.id || k.keyId)}',this)" style="padding:4px 10px;border-radius:6px;background:rgba(246,70,93,0.12);color:#f6465d;border:1px solid rgba(246,70,93,0.3);font-size:11px;font-weight:700;cursor:pointer;">Revoke</button>`
            : '<span style="color:var(--text-2);font-size:11px;">—</span>'
          }
        </td>
      </tr>`;
    }).join('');
  } catch(e) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--red);padding:20px;">Error: ${escapeHtml(e.message)}</td></tr>`;
  }
}

async function revokeApiKey(keyId, btn) {
  if (!confirm('Revoke this API key? The user will lose access immediately.')) return;
  btn.disabled = true;
  btn.textContent = '…';
  try {
    await apiRequest(`/apikeys/key/${encodeURIComponent(keyId)}/revoke`, { method: 'POST', body: JSON.stringify({}) });
    showMessage('API key revoked successfully.', 'success');
    loadApiKeys();
  } catch(e) {
    // Try alternate endpoint pattern
    try {
      // Extract userId from table row if needed, try user-level revoke
      showMessage(e.message || 'Revoke failed.', 'error');
    } catch(_) {}
    btn.disabled = false;
    btn.textContent = 'Revoke';
  }
}

async function searchApiKeysByUser(userId) {
  const resultsEl = document.getElementById('apikeyUserResults');
  if (!resultsEl) return;
  if (!userId.trim()) { resultsEl.innerHTML = ''; return; }
  resultsEl.innerHTML = '<div style="color:var(--text-2);font-size:12px;padding:8px 0;">Loading…</div>';
  try {
    const data = await apiRequest(`/apikeys/user/${encodeURIComponent(userId.trim())}`);
    const keys = Array.isArray(data.keys) ? data.keys : (Array.isArray(data.apiKeys) ? data.apiKeys : []);
    if (!keys.length) {
      resultsEl.innerHTML = '<div style="color:var(--text-2);font-size:12px;padding:8px 0;">No API keys for this user.</div>';
      return;
    }
    resultsEl.innerHTML = keys.map(k => {
      const statusColor = k.status === 'ACTIVE' ? '#1bd67d' : k.status === 'REVOKED' ? '#f6465d' : '#ffd87a';
      return `<div style="border:1px solid var(--border);border-radius:10px;padding:12px;margin-bottom:8px;background:var(--bg-input);">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <div>
            <div style="font-size:12px;font-weight:700;color:var(--text-1);">${escapeHtml(k.label || k.name || 'Unnamed Key')}</div>
            <div style="font-size:11px;font-family:monospace;color:var(--text-2);margin-top:2px;">${escapeHtml((k.id || k.keyId || '').slice(0,20))}…</div>
          </div>
          <span style="color:${statusColor};font-size:11px;font-weight:700;">${escapeHtml(k.status || '-')}</span>
        </div>
        <div style="margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <span style="font-size:11px;color:var(--text-2);">Last used: ${k.lastUsedAt ? formatDate(k.lastUsedAt) : 'Never'}</span>
          ${k.status === 'ACTIVE'
            ? `<button onclick="revokeApiKey('${escapeHtml(k.id||k.keyId)}',this);this.closest('.apikeyUserResults')&&searchApiKeysByUser('${escapeHtml(userId)}')" style="padding:3px 10px;border-radius:6px;background:rgba(246,70,93,0.12);color:#f6465d;border:1px solid rgba(246,70,93,0.3);font-size:11px;font-weight:700;cursor:pointer;">Revoke</button>`
            : ''}
          ${k.status === 'ACTIVE'
            ? `<button onclick="revokeAllUserApiKeys('${escapeHtml(userId)}')" style="padding:3px 10px;border-radius:6px;background:rgba(246,70,93,0.18);color:#f6465d;border:1px solid rgba(246,70,93,0.4);font-size:11px;font-weight:700;cursor:pointer;">Revoke All</button>`
            : ''}
        </div>
      </div>`;
    }).join('');
  } catch(e) {
    resultsEl.innerHTML = `<div style="color:var(--red);font-size:12px;padding:8px 0;">Error: ${escapeHtml(e.message)}</div>`;
  }
}

async function revokeAllUserApiKeys(userId) {
  if (!confirm(`Revoke ALL API keys for user ${userId}? This cannot be undone.`)) return;
  try {
    await apiRequest(`/apikeys/user/${encodeURIComponent(userId)}/revoke-all`, { method: 'POST', body: JSON.stringify({}) });
    showMessage('All API keys revoked for user.', 'success');
    searchApiKeysByUser(userId);
    loadApiKeys();
  } catch(e) {
    showMessage(e.message || 'Revoke all failed.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const searchBtn = document.getElementById('apikeySearchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      const userId = (document.getElementById('apikeyUserInput')?.value || '').trim();
      searchApiKeysByUser(userId);
    });
  }

  const apikeyUserInput = document.getElementById('apikeyUserInput');
  if (apikeyUserInput) {
    apikeyUserInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') searchApiKeysByUser(this.value.trim());
    });
  }

  const apikeysReloadBtn = document.getElementById('apikeysReloadBtn');
  if (apikeysReloadBtn) apikeysReloadBtn.addEventListener('click', function() { loadApiKeys(); });

  const apikeyStatusFilter = document.getElementById('apikeyStatusFilter');
  if (apikeyStatusFilter) apikeyStatusFilter.addEventListener('change', function() { loadApiKeys(); });
});
