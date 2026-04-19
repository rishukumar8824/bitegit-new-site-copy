const assetsStatus = document.getElementById('assetsStatus');
const assetsActionMessage = document.getElementById('assetsActionMessage');

const totalBalanceEl = document.getElementById('assetsTotalBalance');
const spotBalanceEl = document.getElementById('assetsSpotBalance');
const fundingBalanceEl = document.getElementById('assetsFundingBalance');
const spotInlineEl = document.getElementById('assetsSpotInline');
const fundingInlineEl = document.getElementById('assetsFundingInline');
const overviewCoinListEl = document.getElementById('assetsCoinListOverview');
const spotCoinListEl = document.getElementById('assetsCoinListSpot');
const fundingCoinListEl = document.getElementById('assetsCoinListFunding');

const tabs = Array.from(document.querySelectorAll('[data-assets-tab]'));
const panels = Array.from(document.querySelectorAll('[data-assets-panel]'));

const depositBtn = document.getElementById('assetsDepositBtn');
const withdrawBtn = document.getElementById('assetsWithdrawBtn');
const transferBtn = document.getElementById('assetsTransferBtn');

const depositModal = document.getElementById('depositModal');
const withdrawModal = document.getElementById('withdrawModal');
const depositNetworkSelect = document.getElementById('assetsDepositNetwork');
const depositAddressValueEl = document.getElementById('assetsDepositAddressValue');
const depositNetworkWarningEl = document.getElementById('assetsDepositNetworkWarning');
const depositConfirmationsEl = document.getElementById('assetsDepositConfirmations');
const depositQrImageEl = document.getElementById('assetsDepositQrImage');
const depositQrMetaEl = document.getElementById('assetsDepositQrMeta');
const depositCopyBtn = document.getElementById('assetsDepositCopyBtn');
const depositContractValueEl = document.getElementById('assetsDepositContractValue');

const withdrawNetworkSelect = document.getElementById('assetsWithdrawNetwork');
const withdrawForm = document.getElementById('assetsWithdrawForm');
const withdrawAddressInput = document.getElementById('assetsWithdrawAddress');
const withdrawScanBtn = document.getElementById('assetsWithdrawScanBtn');
const withdrawScannerEl = document.getElementById('assetsWithdrawScanner');
const withdrawScannerVideoEl = document.getElementById('assetsWithdrawScannerVideo');
const withdrawScannerHintEl = document.getElementById('assetsWithdrawScannerHint');
const withdrawScannerCloseBtn = document.getElementById('assetsWithdrawScannerCloseBtn');
const withdrawAmountInput = document.getElementById('assetsWithdrawAmount');
const withdrawResultEl = document.getElementById('assetsWithdrawResult');
const withdrawSubmitBtn = document.getElementById('assetsWithdrawSubmitBtn');
const withdrawHistoryListEl = document.getElementById('assetsWithdrawHistoryList');
const withdrawHistoryRefreshBtn = document.getElementById('assetsWithdrawHistoryRefreshBtn');

const WALLET_ENDPOINTS = ['/api/wallet/summary', '/api/wallet', '/api/p2p/wallet'];
const WITHDRAW_ENDPOINTS = [
  {
    url: '/api/withdrawals',
    buildBody: (amount, address, network) => ({
      amount,
      currency: 'USDT',
      address,
      network
    })
  },
  {
    url: '/api/withdraw/request',
    buildBody: (amount, address, network) => ({
      amount,
      coin: 'USDT',
      to_address: address,
      network
    })
  }
];

const SUPPORTED_USDT_NETWORKS = ['TRC20', 'ERC20', 'BEP20'];
const NETWORK_LABELS = {
  TRC20: 'TRON (TRC20)',
  ERC20: 'Ethereum (ERC20)',
  BEP20: 'BNB Smart Chain (BEP20)'
};
const USDT_CONTRACT_ADDRESSES = {
  TRC20: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
  ERC20: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  BEP20: '0x55d398326f99059fF775485246999027B319795'
};
const MAJOR_ASSET_CATALOG = [
  { symbol: 'USDT', name: 'Tether', icon: 'usdt', accent: '#26a17b' },
  { symbol: 'BTC', name: 'Bitcoin', icon: 'btc', accent: '#f7931a' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'eth', accent: '#627eea' },
  { symbol: 'BNB', name: 'BNB', icon: 'bnb', accent: '#f3ba2f' },
  { symbol: 'TRX', name: 'TRON', icon: 'trx', accent: '#eb0029' },
  { symbol: 'USDC', name: 'USD Coin', icon: 'usdc', accent: '#2775ca' },
  { symbol: 'SOL', name: 'Solana', icon: 'sol', accent: '#14f195' },
  { symbol: 'DOGE', name: 'Dogecoin', icon: 'doge', accent: '#c2a633' },
  { symbol: 'XRP', name: 'XRP', icon: 'xrp', accent: '#23292f' },
  { symbol: 'SHIB', name: 'Shiba Inu', icon: 'shib', accent: '#f15a29' },
  { symbol: 'LINK', name: 'Chainlink', icon: 'link', accent: '#2a5ada' },
  { symbol: 'GALA', name: 'GALA', icon: 'gala', accent: '#00d4ff' },
  { symbol: 'UNI', name: 'Uniswap', icon: 'uni', accent: '#ff007a' },
  { symbol: 'SAND', name: 'The Sandbox', icon: 'sand', accent: '#00adef' }
];

const state = {
  activeTab: 'overview',
  loading: false,
  walletApiEndpoint: '',
  depositConfig: {
    defaultNetwork: 'TRC20',
    networks: []
  },
  selectedDepositNetwork: 'TRC20',
  selectedWithdrawNetwork: 'TRC20',
  balances: {
    total: 0,
    spot: 0,
    funding: 0
  },
  assetBalances: {
    USDT: 0
  },
  depositWallets: [],
  withdrawals: [],
  scanner: {
    active: false,
    stream: null,
    frameId: null
  }
};

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function hasValue(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

function pickString(...candidates) {
  for (const candidate of candidates) {
    if (hasValue(candidate)) {
      return String(candidate).trim();
    }
  }
  return '';
}

function pickNumber(...candidates) {
  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return 0;
}

function normalizeNetwork(network) {
  const normalized = String(network || '')
    .trim()
    .toUpperCase();
  if (SUPPORTED_USDT_NETWORKS.includes(normalized)) {
    return normalized;
  }
  return '';
}

function normalizeNetworkAddress(address) {
  const normalized = String(address || '').trim();
  if (!normalized) {
    return '';
  }
  if (normalized.length < 6 || normalized.length > 256) {
    return '';
  }
  return normalized;
}

function normalizeDepositNetworks(rawNetworks = []) {
  const source = Array.isArray(rawNetworks) ? rawNetworks : [];
  const result = [];

  for (const candidate of source) {
    const network = normalizeNetwork(candidate?.network || candidate?.chain || candidate?.name || candidate);
    if (!network) {
      continue;
    }

    const address = normalizeNetworkAddress(candidate?.address);
    const confirmations = Math.max(1, Number.parseInt(String(candidate?.minConfirmations || candidate?.confirmations || 1), 10) || 1);
    const enabled = candidate?.enabled !== undefined ? Boolean(candidate.enabled) : Boolean(address);
    const qrCodeUrl = pickString(candidate?.qrCodeUrl, candidate?.qrUrl, candidate?.qr);

    if (!result.some((item) => item.network === network)) {
      result.push({
        network,
        address,
        minConfirmations: confirmations,
        enabled,
        qrCodeUrl
      });
    }
  }

  for (const network of SUPPORTED_USDT_NETWORKS) {
    if (!result.some((item) => item.network === network)) {
      result.push({
        network,
        address: '',
        minConfirmations: network === 'TRC20' ? 20 : network === 'ERC20' ? 12 : 15,
        enabled: false,
        qrCodeUrl: ''
      });
    }
  }

  return result;
}

function normalizeAssetBalances(...candidates) {
  const result = {};

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
      continue;
    }

    Object.entries(candidate).forEach(([symbol, value]) => {
      const normalizedSymbol = String(symbol || '').trim().toUpperCase();
      if (!normalizedSymbol) {
        return;
      }
      result[normalizedSymbol] = toNumber(value);
    });
  }

  return result;
}

function normalizeDepositWalletCatalog(rawCatalog = [], fallbackWallet = null) {
  const source = Array.isArray(rawCatalog) ? rawCatalog : [];
  const result = source
    .map((item) => {
      const coin = String(item?.coin || item?.token || '').trim().toUpperCase();
      if (!coin) {
        return null;
      }

      const networks = normalizeDepositNetworks(item?.networks);
      const activeNetwork =
        networks.find((networkItem) => networkItem.enabled && networkItem.address) || {
          network: normalizeNetwork(item?.defaultNetwork) || 'TRC20',
          address: '',
          minConfirmations: 1,
          enabled: false,
          qrCodeUrl: ''
        };

      return {
        coin,
        token: coin,
        depositsEnabled: item?.depositsEnabled !== false,
        defaultNetwork: normalizeNetwork(item?.defaultNetwork) || activeNetwork.network,
        networks,
        activeNetwork,
        depositAddress: normalizeNetworkAddress(item?.depositAddress || activeNetwork.address || '')
      };
    })
    .filter(Boolean);

  if (fallbackWallet && !result.some((item) => item.coin === fallbackWallet.coin)) {
    result.unshift(fallbackWallet);
  }

  return result.length ? result : (fallbackWallet ? [fallbackWallet] : []);
}

function findNetworkConfig(network) {
  const normalizedNetwork = normalizeNetwork(network) || state.depositConfig.defaultNetwork || 'TRC20';
  const networks = Array.isArray(state.depositConfig.networks) ? state.depositConfig.networks : [];
  return (
    networks.find((item) => item.network === normalizedNetwork) || {
      network: normalizedNetwork,
      address: '',
      minConfirmations: 1,
      enabled: false
    }
  );
}

function getCurrentDepositNetworkConfig() {
  return findNetworkConfig(state.selectedDepositNetwork);
}

function getCurrentWithdrawNetwork() {
  return normalizeNetwork(state.selectedWithdrawNetwork) || state.depositConfig.defaultNetwork || 'TRC20';
}

function buildQrUrl(payload) {
  const text = String(payload || '').trim();
  if (!text) {
    return '';
  }
  return `https://quickchart.io/qr?size=240&margin=1&text=${encodeURIComponent(text)}`;
}

function getNetworkLabel(network) {
  const normalized = normalizeNetwork(network);
  return NETWORK_LABELS[normalized] || normalized || 'Unknown network';
}

function formatUsdt(value) {
  return `${toNumber(value).toFixed(2)} USDT`;
}

function formatAssetAmount(value) {
  const normalized = toNumber(value);
  const digits = normalized >= 1000 ? 2 : normalized >= 1 ? 4 : 6;
  return normalized.toLocaleString('en-US', {
    minimumFractionDigits: normalized === 0 ? 2 : 0,
    maximumFractionDigits: digits
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

function formatAssetDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function shortenValue(value, start = 8, end = 6) {
  const text = String(value || '').trim();
  if (text.length <= start + end + 3) {
    return text;
  }
  return `${text.slice(0, start)}...${text.slice(-end)}`;
}

function getWithdrawalStatusView(rawStatus) {
  const normalized = String(rawStatus || 'pending').trim().toLowerCase();
  if (['approved', 'sent', 'completed', 'complete', 'success'].includes(normalized)) {
    return { label: 'Approved', tone: 'approved' };
  }
  if (['rejected', 'cancelled', 'canceled', 'failed'].includes(normalized)) {
    return { label: 'Rejected', tone: 'rejected' };
  }
  return { label: 'Pending', tone: 'pending' };
}

function getAssetIconUrl(iconKey) {
  const normalized = String(iconKey || '').trim().toLowerCase();
  if (!normalized) {
    return '';
  }
  return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/${normalized}.svg`;
}

function setStatus(text, type = '') {
  if (!assetsStatus) {
    return;
  }

  assetsStatus.textContent = text;
  assetsStatus.className = 'assets-status';
  if (type) {
    assetsStatus.classList.add(type);
  }
}

function setActionMessage(text = '') {
  if (!assetsActionMessage) {
    return;
  }
  assetsActionMessage.textContent = text;
}

function setWithdrawResult(text = '', type = '') {
  if (!withdrawResultEl) {
    return;
  }
  withdrawResultEl.textContent = text;
  withdrawResultEl.className = 'assets-summary-line';
  if (type) {
    withdrawResultEl.classList.add(type);
  }
}

function normalizeWalletPayload(payload) {
  const root = payload?.data && typeof payload.data === 'object' ? payload.data : payload || {};
  const wallet = root?.wallet && typeof root.wallet === 'object' ? root.wallet : {};
  const summary = root?.summary && typeof root.summary === 'object' ? root.summary : root;
  const depositConfigRoot = root?.depositConfig && typeof root.depositConfig === 'object' ? root.depositConfig : {};

  const available = pickNumber(
    summary.available_balance,
    summary.availableBalance,
    summary.spot_balance,
    summary.spotBalance,
    wallet.available_balance,
    wallet.availableBalance,
    wallet.balance
  );

  const locked = pickNumber(
    summary.locked_balance,
    summary.lockedBalance,
    wallet.locked_balance,
    wallet.lockedBalance,
    wallet.p2pLocked
  );

  const total = pickNumber(
    summary.total_balance,
    summary.totalBalance,
    summary.total,
    wallet.total_balance,
    wallet.totalBalance,
    available + locked
  );

  const spot = pickNumber(
    summary.spot_balance,
    summary.spotBalance,
    summary.spot,
    available
  );

  const funding = pickNumber(
    summary.funding_balance,
    summary.fundingBalance,
    summary.funding,
    wallet.funding_balance,
    wallet.fundingBalance,
    available
  );

  const defaultNetwork = normalizeNetwork(
    pickString(
      depositConfigRoot.defaultNetwork,
      summary.deposit_network,
      summary.depositNetwork,
      wallet.deposit_network,
      wallet.depositNetwork,
      'TRC20'
    )
  ) || 'TRC20';

  const networksPayload =
    depositConfigRoot.networks ||
    summary.deposit_networks ||
    summary.depositNetworks ||
    wallet.deposit_networks ||
    wallet.depositNetworks ||
    payload?.deposit_networks ||
    payload?.depositNetworks ||
    [];

  const normalizedNetworks = normalizeDepositNetworks(networksPayload);

  const legacyAddress = normalizeNetworkAddress(
    pickString(
      depositConfigRoot.depositAddress,
      summary.deposit_address,
      summary.depositAddress,
      wallet.deposit_address,
      wallet.depositAddress,
      payload?.deposit_address,
      payload?.depositAddress
    )
  );

  if (legacyAddress) {
    const match = normalizedNetworks.find((item) => item.network === defaultNetwork);
    if (match && !match.address) {
      match.address = legacyAddress;
      match.enabled = true;
    }
  }

  const activeNetwork =
    normalizedNetworks.find((item) => item.network === defaultNetwork && item.enabled && item.address) ||
    normalizedNetworks.find((item) => item.enabled && item.address) || {
      network: defaultNetwork,
      address: '',
      minConfirmations: 1,
      enabled: false,
      qrCodeUrl: ''
    };

  const fallbackWallet = {
    coin: 'USDT',
    token: 'USDT',
    depositsEnabled: true,
    defaultNetwork,
    networks: normalizedNetworks,
    activeNetwork,
    depositAddress: normalizeNetworkAddress(activeNetwork.address || legacyAddress)
  };

  const assetBalances = normalizeAssetBalances(
    summary.asset_balances,
    summary.assetBalances,
    wallet.asset_balances,
    wallet.assetBalances
  );

  if (!Object.keys(assetBalances).length || !Number.isFinite(assetBalances.USDT)) {
    assetBalances.USDT = toNumber(spot);
  }

  return {
    balances: {
      total: toNumber(total),
      spot: toNumber(spot),
      funding: toNumber(funding)
    },
    assetBalances,
    depositConfig: {
      defaultNetwork,
      networks: normalizedNetworks
    },
    depositWallets: normalizeDepositWalletCatalog(root?.depositWallets || payload?.depositWallets, fallbackWallet)
  };
}

function renderDepositAddress() {
  if (!depositAddressValueEl) {
    return;
  }
  const current = getCurrentDepositNetworkConfig();
  const hasAddress = Boolean(current.address);

  depositAddressValueEl.textContent = hasAddress ? current.address : 'Admin will provide deposit address shortly.';
  if (depositCopyBtn) {
    depositCopyBtn.disabled = !hasAddress;
  }

  if (depositNetworkWarningEl) {
    depositNetworkWarningEl.textContent = `Send only USDT on ${getNetworkLabel(current.network)} to this address.`;
  }
  if (depositConfirmationsEl) {
    depositConfirmationsEl.textContent = `Required confirmations: ${current.minConfirmations}`;
  }
  if (depositContractValueEl) {
    depositContractValueEl.textContent =
      USDT_CONTRACT_ADDRESSES[current.network] || 'Contract information unavailable.';
  }

  if (depositQrImageEl) {
    const qrUrl = hasAddress ? (pickString(current.qrCodeUrl) || buildQrUrl(current.address)) : '';
    depositQrImageEl.src = qrUrl || 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
    depositQrImageEl.style.opacity = hasAddress ? '1' : '0.45';
  }
  if (depositQrMetaEl) {
    depositQrMetaEl.textContent = hasAddress
      ? `Scan QR in your wallet app for ${getNetworkLabel(current.network)}`
      : 'QR will appear after address is configured.';
  }
}

function renderNetworkSelectOptions() {
  const networks = Array.isArray(state.depositConfig.networks) && state.depositConfig.networks.length
    ? state.depositConfig.networks
    : normalizeDepositNetworks([]);

  const optionsMarkup = networks
    .map((item) => `<option value="${item.network}">${getNetworkLabel(item.network)}</option>`)
    .join('');

  [depositNetworkSelect, withdrawNetworkSelect].forEach((selectEl) => {
    if (!selectEl) {
      return;
    }
    selectEl.innerHTML = optionsMarkup;
  });

  if (depositNetworkSelect) {
    state.selectedDepositNetwork =
      normalizeNetwork(state.selectedDepositNetwork) || state.depositConfig.defaultNetwork || networks[0]?.network || 'TRC20';
    depositNetworkSelect.value = state.selectedDepositNetwork;
  }

  if (withdrawNetworkSelect) {
    state.selectedWithdrawNetwork =
      normalizeNetwork(state.selectedWithdrawNetwork) || state.depositConfig.defaultNetwork || networks[0]?.network || 'TRC20';
    withdrawNetworkSelect.value = state.selectedWithdrawNetwork;
  }
}

function resolveAssetRows() {
  const rows = [];
  const seen = new Set();
  const depositEnabledCoins = new Set(
    (Array.isArray(state.depositWallets) ? state.depositWallets : [])
      .filter((wallet) => Boolean(wallet?.depositAddress))
      .map((wallet) => String(wallet.coin || '').trim().toUpperCase())
  );

  const pushRow = (entry, order) => {
    const symbol = String(entry?.symbol || entry?.coin || '').trim().toUpperCase();
    if (!symbol || seen.has(symbol)) {
      return;
    }
    seen.add(symbol);
    rows.push({
      symbol,
      name: entry?.name || symbol,
      accent: entry?.accent || '#1f6feb',
      icon: entry?.icon || symbol.toLowerCase(),
      order,
      balance: toNumber(state.assetBalances[symbol]),
      hasDeposit: depositEnabledCoins.has(symbol)
    });
  };

  MAJOR_ASSET_CATALOG.forEach((entry, index) => pushRow(entry, index));

  Object.keys(state.assetBalances)
    .sort()
    .forEach((symbol) => pushRow({ symbol, name: symbol, icon: symbol.toLowerCase(), accent: '#1f6feb' }, MAJOR_ASSET_CATALOG.length + rows.length));

  return rows.sort((left, right) => left.order - right.order);
}

function renderAssetList(container, panelKey) {
  if (!container) {
    return;
  }

  const rows = resolveAssetRows();
  if (!rows.length) {
    container.innerHTML = '<div class="asset-empty">No assets available yet.</div>';
    return;
  }

  // Only show coins with balance > 0 (or deposit configured)
  const visibleRows = rows.filter((item) => {
    const balance = panelKey === 'funding' && item.symbol === 'USDT'
      ? toNumber(state.balances.funding)
      : item.balance;
    return balance > 0 || item.hasDeposit;
  });

  if (!visibleRows.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = visibleRows.map((item) => {
    const balance = panelKey === 'funding' && item.symbol === 'USDT'
      ? toNumber(state.balances.funding)
      : item.balance;
    const badgeLabel = item.hasDeposit ? 'Live' : balance > 0 ? 'Held' : 'Watch';
    const badgeTone = item.hasDeposit ? 'live' : balance > 0 ? 'held' : 'watch';
    const subtitle =
      item.hasDeposit
        ? 'Admin deposit ready'
        : panelKey === 'funding'
          ? 'Funding wallet preview'
          : 'Market asset';

    return `
      <div class="asset-row">
        <div class="asset-row-main">
          <span class="asset-row-icon" style="background:${item.accent}18;border-color:${item.accent}40;">
            <img src="${getAssetIconUrl(item.icon)}" alt="${item.symbol}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()" />
            <span class="asset-row-fallback">${item.symbol.slice(0, 4)}</span>
          </span>
          <span class="asset-row-copy">
            <strong>${item.symbol}</strong>
            <small>${item.name} • ${subtitle}</small>
          </span>
        </div>
        <div class="asset-row-side">
          <span class="asset-row-amount">${formatAssetAmount(balance)}</span>
          <span class="asset-row-badge ${badgeTone}">${badgeLabel}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderAssetLists() {
  renderAssetList(overviewCoinListEl, 'overview');
  renderAssetList(spotCoinListEl, 'spot');
  renderAssetList(fundingCoinListEl, 'funding');
}

function renderBalances() {
  if (totalBalanceEl) {
    totalBalanceEl.textContent = formatUsdt(state.balances.total);
  }
  if (spotBalanceEl) {
    spotBalanceEl.textContent = formatUsdt(state.balances.spot);
  }
  if (fundingBalanceEl) {
    fundingBalanceEl.textContent = formatUsdt(state.balances.funding);
  }
  if (spotInlineEl) {
    spotInlineEl.textContent = formatUsdt(state.balances.spot);
  }
  if (fundingInlineEl) {
    fundingInlineEl.textContent = formatUsdt(state.balances.funding);
  }
  renderNetworkSelectOptions();
  renderAssetLists();
  renderDepositAddress();
}

function renderWithdrawNetworkUi() {
  const network = getCurrentWithdrawNetwork();
  if (withdrawNetworkSelect) {
    withdrawNetworkSelect.value = network;
  }
  if (withdrawAddressInput) {
    withdrawAddressInput.placeholder = network === 'TRC20' ? 'T...' : '0x...';
  }
}

function setActiveTab(tab) {
  const resolved = ['overview', 'spot', 'funding'].includes(tab) ? tab : 'overview';
  state.activeTab = resolved;

  tabs.forEach((tabButton) => {
    const isActive = tabButton.getAttribute('data-assets-tab') === resolved;
    tabButton.classList.toggle('active', isActive);
    tabButton.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  panels.forEach((panel) => {
    const panelKey = panel.getAttribute('data-assets-panel');
    panel.classList.toggle('hidden', panelKey !== resolved);
  });
}

function modalIsOpen(modal) {
  return Boolean(modal) && !modal.classList.contains('hidden');
}

function syncBodyInteractionState() {
  const hasOpenModal = modalIsOpen(depositModal) || modalIsOpen(withdrawModal);
  document.body.style.overflow = hasOpenModal ? 'hidden' : 'auto';
  document.body.style.pointerEvents = 'auto';
}

function setModalOpen(modal, open) {
  if (!modal) {
    return;
  }

  const shouldOpen = Boolean(open);
  modal.classList.toggle('hidden', !shouldOpen);
  modal.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
  syncBodyInteractionState();
}

function closeAllModals() {
  stopWithdrawScanner();
  setModalOpen(depositModal, false);
  setModalOpen(withdrawModal, false);
  document.body.style.overflow = 'auto';
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json().catch(() => ({}));
  return { response, payload };
}

async function loadWalletSummary() {
  if (state.loading) {
    return;
  }

  state.loading = true;
  setStatus('Loading balances...');

  try {
    let loaded = false;
    let fallbackErrorMessage = 'Wallet API not available.';

    for (const endpoint of WALLET_ENDPOINTS) {
      const { response, payload } = await requestJson(endpoint, { method: 'GET' });

      if (response.status === 404) {
        continue;
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error('Please login to view wallet balances.');
      }

      if (!response.ok) {
        const serverMessage = String(payload?.message || '').trim();
        fallbackErrorMessage = serverMessage || `Unable to load wallet (${response.status})`;
        continue;
      }

      const normalized = normalizeWalletPayload(payload);
      state.walletApiEndpoint = endpoint;
      state.balances = normalized.balances;
      state.assetBalances = normalized.assetBalances;
      state.depositConfig = normalized.depositConfig;
      state.depositWallets = normalized.depositWallets;
      state.selectedDepositNetwork =
        normalizeNetwork(state.selectedDepositNetwork) ||
        normalized.depositConfig.defaultNetwork ||
        'TRC20';
      state.selectedWithdrawNetwork =
        normalizeNetwork(state.selectedWithdrawNetwork) ||
        normalized.depositConfig.defaultNetwork ||
        'TRC20';
      loaded = true;
      break;
    }

    if (!loaded) {
      throw new Error(fallbackErrorMessage);
    }

    renderBalances();
    if (depositNetworkSelect) {
      depositNetworkSelect.value = state.selectedDepositNetwork;
    }
    renderWithdrawNetworkUi();
    setStatus('Balances synced.');
  } catch (error) {
    console.error(error);
    const message = String(error?.message || 'Failed to load balances.');
    if (/route[_\s-]*not[_\s-]*found|api route not found|not found/i.test(message)) {
      setStatus('Wallet API route is not available yet.', 'error');
    } else {
      setStatus(message, 'error');
    }
  } finally {
    state.loading = false;
  }
}

function renderWithdrawalHistory() {
  if (!withdrawHistoryListEl) {
    return;
  }

  const rows = Array.isArray(state.withdrawals) ? state.withdrawals : [];
  if (!rows.length) {
    withdrawHistoryListEl.innerHTML = '<p class="withdraw-history-empty">No withdrawal requests yet.</p>';
    return;
  }

  withdrawHistoryListEl.innerHTML = rows
    .map((row) => {
      const status = getWithdrawalStatusView(row.status);
      const requestId = String(row.requestId || row.id || '').trim();
      const address = String(row.address || row.toAddress || row.to || '').trim();
      const network = normalizeNetwork(row.network || row.chain || row.metadata?.network) || 'USDT';
      const currency = String(row.currency || row.coin || 'USDT').trim().toUpperCase();
      const createdAt = formatAssetDate(row.createdAt || row.created_at);

      return `
        <article class="withdraw-history-row">
          <div class="withdraw-history-main">
            <div>
              <p class="withdraw-history-amount">${escapeHtml(formatAssetAmount(row.amount))} ${escapeHtml(currency)}</p>
              <p class="withdraw-history-id">#${escapeHtml(shortenValue(requestId || 'withdrawal', 12, 6))}</p>
            </div>
            <span class="withdraw-status ${escapeHtml(status.tone)}">${escapeHtml(status.label)}</span>
          </div>
          <div class="withdraw-history-meta">
            <p class="withdraw-history-date">${escapeHtml(network)}${createdAt ? ` - ${escapeHtml(createdAt)}` : ''}</p>
            <p class="withdraw-history-address">${escapeHtml(shortenValue(address || 'Address pending', 10, 8))}</p>
          </div>
        </article>
      `;
    })
    .join('');
}

async function loadWithdrawalHistory() {
  if (!withdrawHistoryListEl) {
    return;
  }

  try {
    withdrawHistoryListEl.innerHTML = '<p class="withdraw-history-empty">Loading withdrawal history...</p>';
    const { response, payload } = await requestJson('/api/withdrawals?limit=25', { method: 'GET' });

    if (response.status === 404) {
      state.withdrawals = [];
      renderWithdrawalHistory();
      return;
    }

    if (response.status === 401 || response.status === 403) {
      withdrawHistoryListEl.innerHTML = '<p class="withdraw-history-empty">Login to view withdrawal history.</p>';
      return;
    }

    if (!response.ok) {
      throw new Error(String(payload?.message || 'Unable to load withdrawal history.'));
    }

    const withdrawals = Array.isArray(payload?.withdrawals)
      ? payload.withdrawals
      : Array.isArray(payload?.data?.withdrawals)
        ? payload.data.withdrawals
        : Array.isArray(payload)
          ? payload
          : [];
    state.withdrawals = withdrawals;
    renderWithdrawalHistory();
  } catch (error) {
    console.error(error);
    withdrawHistoryListEl.innerHTML = '<p class="withdraw-history-empty">Withdrawal history is unavailable right now.</p>';
  }
}

async function requestWithdrawal(amount, address, network) {
  let fallbackError = 'Unable to submit withdrawal request.';

  for (const endpoint of WITHDRAW_ENDPOINTS) {
    const { response, payload } = await requestJson(endpoint.url, {
      method: 'POST',
      body: JSON.stringify(endpoint.buildBody(amount, address, network))
    });

    if (response.status === 404) {
      continue;
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error('Please login to submit withdrawal.');
    }

    if (!response.ok) {
      fallbackError = String(payload?.message || fallbackError);
      continue;
    }

    return payload;
  }

  throw new Error(fallbackError);
}

function isValidAddressForNetwork(address, network) {
  const normalizedAddress = String(address || '').trim();
  const normalizedNetwork = normalizeNetwork(network) || 'TRC20';
  if (normalizedNetwork === 'TRC20') {
    return /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(normalizedAddress);
  }
  return /^0x[a-fA-F0-9]{40}$/.test(normalizedAddress);
}

async function handleWithdrawSubmit(event) {
  event.preventDefault();

  const address = String(withdrawAddressInput?.value || '').trim();
  const amount = toNumber(withdrawAmountInput?.value);
  const network = getCurrentWithdrawNetwork();

  if (!isValidAddressForNetwork(address, network)) {
    setWithdrawResult(`Enter a valid ${network} address.`, 'error');
    return;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    setWithdrawResult('Enter a valid withdrawal amount.', 'error');
    return;
  }

  if (withdrawSubmitBtn) {
    withdrawSubmitBtn.disabled = true;
    withdrawSubmitBtn.textContent = 'Submitting...';
  }
  setWithdrawResult('');

  try {
    await requestWithdrawal(amount, address, network);
    setWithdrawResult('Withdrawal request submitted. Status: Pending admin approval.', 'success');
    if (withdrawForm) {
      withdrawForm.reset();
    }
    await Promise.all([loadWalletSummary(), loadWithdrawalHistory()]);
  } catch (error) {
    console.error(error);
    setWithdrawResult(String(error?.message || 'Withdrawal request failed.'), 'error');
  } finally {
    if (withdrawSubmitBtn) {
      withdrawSubmitBtn.disabled = false;
      withdrawSubmitBtn.textContent = 'Submit Withdrawal';
    }
  }
}

function extractAddressFromQrPayload(rawValue) {
  const raw = String(rawValue || '').trim();
  if (!raw) {
    return '';
  }

  let parsed = raw;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(parsed)) {
    const withoutScheme = parsed.split(':').slice(1).join(':');
    parsed = withoutScheme || parsed;
  }

  parsed = parsed.replace(/^\/\//, '');
  if (parsed.includes('?')) {
    parsed = parsed.split('?')[0];
  }
  if (parsed.includes('@')) {
    parsed = parsed.split('@')[0];
  }

  return String(parsed || raw).trim();
}

function stopWithdrawScanner() {
  if (state.scanner.frameId) {
    cancelAnimationFrame(state.scanner.frameId);
    state.scanner.frameId = null;
  }

  if (state.scanner.stream) {
    for (const track of state.scanner.stream.getTracks()) {
      track.stop();
    }
    state.scanner.stream = null;
  }

  state.scanner.active = false;
  if (withdrawScannerVideoEl) {
    withdrawScannerVideoEl.srcObject = null;
  }
  if (withdrawScannerEl) {
    withdrawScannerEl.classList.add('hidden');
    withdrawScannerEl.setAttribute('aria-hidden', 'true');
  }
}

async function startWithdrawScanner() {
  if (!withdrawScannerEl || !withdrawScannerVideoEl) {
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    setWithdrawResult('Camera scan is not supported on this browser.', 'error');
    return;
  }

  if (typeof window.BarcodeDetector !== 'function') {
    const manualValue = window.prompt('QR scan not supported. Paste wallet address:', '') || '';
    if (manualValue) {
      withdrawAddressInput.value = manualValue.trim();
      setWithdrawResult('Address pasted from manual input.', 'success');
    }
    return;
  }

  stopWithdrawScanner();

  try {
    const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });

    state.scanner.active = true;
    state.scanner.stream = stream;
    withdrawScannerVideoEl.srcObject = stream;
    await withdrawScannerVideoEl.play().catch(() => {});

    withdrawScannerEl.classList.remove('hidden');
    withdrawScannerEl.setAttribute('aria-hidden', 'false');
    if (withdrawScannerHintEl) {
      withdrawScannerHintEl.textContent = 'Point camera to address QR code.';
    }

    const scanFrame = async () => {
      if (!state.scanner.active || !withdrawScannerVideoEl) {
        return;
      }

      try {
        if (withdrawScannerVideoEl.readyState >= 2) {
          const barcodes = await detector.detect(withdrawScannerVideoEl);
          if (Array.isArray(barcodes) && barcodes.length > 0) {
            const rawValue = String(barcodes[0]?.rawValue || '').trim();
            const extracted = extractAddressFromQrPayload(rawValue);
            if (extracted) {
              withdrawAddressInput.value = extracted;
              setWithdrawResult('QR scanned. Verify network and address before submitting.', 'success');
              stopWithdrawScanner();
              return;
            }
          }
        }
      } catch (_) {
        // Ignore frame decode errors, continue scanning.
      }

      state.scanner.frameId = requestAnimationFrame(scanFrame);
    };

    state.scanner.frameId = requestAnimationFrame(scanFrame);
  } catch (error) {
    stopWithdrawScanner();
    setWithdrawResult('Unable to access camera for scanning.', 'error');
  }
}

function bindEvents() {
  tabs.forEach((tabButton) => {
    tabButton.addEventListener('click', () => {
      setActiveTab(tabButton.getAttribute('data-assets-tab'));
    });
  });

  depositBtn?.addEventListener('click', () => {
    setActionMessage('');
    renderDepositAddress();
    setModalOpen(depositModal, true);
  });

  withdrawBtn?.addEventListener('click', () => {
    setActionMessage('');
    setWithdrawResult('');
    renderWithdrawNetworkUi();
    setModalOpen(withdrawModal, true);
  });

  transferBtn?.addEventListener('click', () => {
    setActionMessage('Transfer flow will be enabled in next release.');
  });

  document.querySelectorAll('[data-modal-close]').forEach((node) => {
    node.addEventListener('click', () => {
      const modalId = node.getAttribute('data-modal-close');
      if (modalId === 'depositModal') {
        setModalOpen(depositModal, false);
      } else if (modalId === 'withdrawModal') {
        stopWithdrawScanner();
        setModalOpen(withdrawModal, false);
      }
    });
  });

  depositNetworkSelect?.addEventListener('change', () => {
    state.selectedDepositNetwork = normalizeNetwork(depositNetworkSelect.value) || state.depositConfig.defaultNetwork || 'TRC20';
    renderDepositAddress();
  });

  withdrawNetworkSelect?.addEventListener('change', () => {
    state.selectedWithdrawNetwork = normalizeNetwork(withdrawNetworkSelect.value) || state.depositConfig.defaultNetwork || 'TRC20';
    renderWithdrawNetworkUi();
    setWithdrawResult('');
  });

  depositCopyBtn?.addEventListener('click', async () => {
    const current = getCurrentDepositNetworkConfig();
    if (!current.address) {
      return;
    }

    try {
      await navigator.clipboard.writeText(current.address);
      setActionMessage('Deposit address copied.');
    } catch (_) {
      setActionMessage('Unable to copy address on this device.');
    }
  });

  withdrawScanBtn?.addEventListener('click', async () => {
    await startWithdrawScanner();
  });
  withdrawScannerCloseBtn?.addEventListener('click', () => {
    stopWithdrawScanner();
  });

  withdrawHistoryRefreshBtn?.addEventListener('click', () => {
    loadWithdrawalHistory();
  });

  withdrawForm?.addEventListener('submit', handleWithdrawSubmit);

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      stopWithdrawScanner();
      closeAllModals();
    }
  });

  window.addEventListener('pagehide', () => {
    stopWithdrawScanner();
    document.body.style.overflow = 'auto';
    document.body.style.pointerEvents = 'auto';
  });
}

(function initAssetsPage() {
  setActiveTab('overview');
  renderDepositAddress();
  renderBalances();
  renderWithdrawNetworkUi();
  renderWithdrawalHistory();
  bindEvents();
  loadWalletSummary();
  loadWithdrawalHistory();
})();
