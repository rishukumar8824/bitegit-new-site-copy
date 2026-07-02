// Bitcovex global connector — runs on EVERY page.
(function () {
  // Route API calls to dedicated Bitcovex backend
  const API_BASE = 'https://bitcovex-backend.onrender.com';

  const fmt = (n, d = 2) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const UP = '#2ebd85', DOWN = '#f6465d';

  const NAV = [
    { label: 'Buy Crypto', href: 'market.html', arrow: true },
    { label: 'Markets',    href: 'market.html', arrow: false },
    { label: 'P2P',        href: 'p2p.html',    arrow: false },
    { label: 'Trade',      href: 'trade.html',  arrow: true },
    { label: 'Futures',    href: 'futures_overview.html', arrow: true },
    { label: 'TradFi',     href: 'tradfi.html', arrow: true },
    { label: 'Finance',    href: 'finance.html',arrow: true },
    { label: 'Activity',   href: '#',           arrow: true },
    { label: 'Glory of Legends', href: '#',     arrow: false },
    { label: 'English / USD',    href: '#',     arrow: false },
  ];
  const NAV_MAP = { 'Markets': 'market.html', 'Trade': 'trade.html', 'Futures': 'futures_overview.html', 'TradFi': 'tradfi.html', 'Finance': 'finance.html', 'Buy Crypto': 'market.html', 'P2P': 'p2p.html' };

  function wireTopNav() {
    document.querySelectorAll('header a, nav a').forEach((a) => {
      const t = (a.textContent || '').trim();
      const href = a.getAttribute('href');
      if (NAV_MAP[t] && (!href || href === '#' || href === '')) a.setAttribute('href', NAV_MAP[t]);
    });
  }

  const COIN_IMG = {
    BTC:  '/cdn/1/currency/33ebcaab-99c9-47e0-a916-c08bada02cac-1774002719227.png',
    ETH:  '/cdn/1/currency/65b8e63b-5356-4d33-9cb8-aa19585ffaf0-1774002774151.png',
    SOL:  '/cdn/1/currency/0f9dbb43-7c86-456a-bcaa-64d5bb61a01e-1774002879582.png',
    HYPE: 'https://s2.coinmarketcap.com/static/img/coins/64x64/32196.png',
    XAU:  'https://s2.coinmarketcap.com/static/img/coins/64x64/4705.png',
    XRP:  'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
    BNB:  'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    DOGE: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
    ADA:  'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
    AVAX: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
    PAXG: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4705.png',
    LINK: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
    DOT:  'https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png',
    HBAR: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4642.png',
  };
  const SPOT_PAIRS    = ['BTC', 'ETH', 'SOL', 'HYPE', 'XAU'];
  const FUTURES_PAIRS = ['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'DOGE', 'ADA', 'AVAX'];
  const TRADFI_PAIRS  = ['PAXG', 'XAU', 'LINK', 'DOT', 'HBAR'];
  const COIN_COLORS = { BTC:'#F7931A', ETH:'#627EEA', SOL:'#9945FF', HYPE:'#4FAAFF', XAU:'#E5C55A',
    XRP:'#00AAE4', BNB:'#F3BA2F', DOGE:'#C3A634', ADA:'#0D1E2D', AVAX:'#E84142',
    PAXG:'#D4AF37', LINK:'#2A5ADA', DOT:'#E6007A', HBAR:'#222' };
  const COIN_NAME = { BTC:'Bitcoin', ETH:'Ethereum', SOL:'Solana', HYPE:'Hyperliquid', XAU:'Gold',
    XRP:'Ripple', BNB:'BNB', DOGE:'Dogecoin', ADA:'Cardano', AVAX:'Avalanche',
    PAXG:'PAX Gold', LINK:'Chainlink', DOT:'Polkadot', HBAR:'Hedera' };

  // ── 1. MOBILE CSS — hide desktop elements on mobile ──────────────────────
  function injectMobileCSS() {
    if (document.getElementById('cvx-mobile-css')) return;

    document.querySelectorAll('div').forEach(div => {
      const cls = div.className || '';
      if (cls.includes('justify-between') && cls.includes('max-w-[1200px]') && cls.includes('mx-auto') && cls.includes('gap-5') && !div.id)
        div.id = 'cvx-desktop-pairs';
    });

    const leftMain = document.querySelector('[data-nav-left-main="true"]');
    if (leftMain) {
      leftMain.id = 'cvx-nav-left-main';
      const navLinksDiv = leftMain.querySelector('div');
      if (navLinksDiv) navLinksDiv.setAttribute('data-cvx-nav-links', '1');
    }

    const rightBox = document.querySelector('[data-nav-right-box]');
    if (rightBox) {
      rightBox.querySelectorAll('.relative.group').forEach(el => el.setAttribute('data-cvx-icon-btn', '1'));
      const langPicker = rightBox.querySelector('.lang-currency-picker');
      if (langPicker) langPicker.setAttribute('data-cvx-icon-btn', '1');
    }

    document.querySelectorAll('div').forEach(div => {
      const cls = div.className || '';
      if ((cls.includes('mt-4') || cls.includes('mt-6')) && cls.includes('text-center')) {
        const link = div.querySelector('a[href="market.html"]');
        if (link && /More/.test(link.textContent)) div.setAttribute('data-cvx-html-more', '1');
      }
    });

    const s = document.createElement('style');
    s.id = 'cvx-mobile-css';
    s.textContent = `
      @media (max-width: 767px) {
        [data-cvx-nav-links] { display: none !important; }
        header a[href="login.html"] { display: none !important; }
        [data-nav-right-box] [role="separator"] { display: none !important; }
        [data-cvx-icon-btn] { display: none !important; }
        #cvx-desktop-pairs { display: none !important; }
        [data-cvx-html-more] { display: none !important; }
      }
    `;
    document.head.appendChild(s);
  }

  // ── 2. MOBILE APP BANNER (like Bitbase top banner) ────────────────────────
  function addMobileAppBanner() {
    if (document.getElementById('cvx-app-banner')) return;
    if (window.innerWidth > 767) return;
    const banner = document.createElement('div');
    banner.id = 'cvx-app-banner';
    banner.style.cssText = 'display:flex;align-items:center;padding:8px 12px;background:#1e2329;border-bottom:1px solid rgba(255,255,255,0.08);gap:10px;position:relative;z-index:9999;';
    banner.innerHTML = `
      <div style="width:36px;height:36px;border-radius:8px;background:#F0B90B;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg width="20" height="24" viewBox="0 0 22 26" fill="none"><path d="M5.40038 0H0.73112C0.327217 0 0 0.326486 0 0.729486V6.91749C0 7.32049 0.327217 7.64697 0.73112 7.64697H6.1315V0.729486C6.1315 0.326486 5.80429 0 5.40038 0Z" fill="#fff"/><path d="M6.13151 7.64698V13.0353C6.13151 13.4383 6.45872 13.7648 6.86262 13.7648H12.2891C13.9821 13.7648 15.3546 15.1342 15.3546 16.8235C15.3546 18.5127 13.9821 19.8822 12.2891 19.8822H7.6641C6.81758 19.8822 6.1315 19.1977 6.13113 18.353V14.4939C6.13113 14.0909 5.80392 13.7644 5.40001 13.7644H0.73112C0.327217 13.7644 0 14.0909 0 14.4939V19.1523C0 19.5553 0.327217 19.8818 0.73112 19.8818H4.59854C5.44506 19.8818 6.13151 20.5667 6.13151 21.4114V25.2701C6.13151 25.6731 6.45872 25.9996 6.86262 25.9996H11.9235C17.2048 25.9996 21.4861 21.7278 21.4861 16.4584C21.4861 11.5919 17.532 7.64661 12.6546 7.64661H6.13151V7.64698Z" fill="#fff"/></svg>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-weight:600;color:#fff;font-size:13px;line-height:1.3;">Bitcovex App</div>
        <div style="color:rgba(255,255,255,0.5);font-size:11px;">Trade Anywhere, Anytime</div>
      </div>
      <a href="app_download.html" style="padding:7px 16px;background:#F0B90B;color:#000;border-radius:6px;font-size:13px;font-weight:700;text-decoration:none;flex-shrink:0;">Open</a>
      <button id="cvx-banner-close" style="background:none;border:none;color:rgba(255,255,255,0.4);cursor:pointer;padding:4px 4px;font-size:20px;flex-shrink:0;line-height:1;">×</button>
    `;
    document.body.insertBefore(banner, document.body.firstChild);
    document.getElementById('cvx-banner-close').addEventListener('click', () => banner.remove());
  }

  // ── 3. MOBILE MARKET (Spot/Futures/TradFi tabs + live prices) ─────────────
  let _mobileRenderRows = null;
  function buildMobileMarket() {
    if (document.getElementById('cvx-mobile-market')) {
      if (_mobileRenderRows) _mobileRenderRows();
      return;
    }
    if (!tickerMap) return;
    const desktopPairs = document.getElementById('cvx-desktop-pairs');
    if (!desktopPairs) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'cvx-mobile-market';
    wrapper.style.cssText = 'display:block;padding:0 0 8px;width:100%;box-sizing:border-box;';

    const mobileOnlyStyle = document.createElement('style');
    mobileOnlyStyle.textContent = '@media (min-width: 768px) { #cvx-mobile-market { display: none !important; } }';
    document.head.appendChild(mobileOnlyStyle);

    // Main tabs — no sub-tabs (match bitbase)
    const TABS = ['Spot', 'Futures', 'TradFi', 'Volume Ranking >'];
    const tabBar = document.createElement('div');
    tabBar.style.cssText = 'display:flex;gap:0;padding:0 16px;overflow-x:auto;overflow-y:hidden;margin-bottom:0;border:none;outline:none;-webkit-overflow-scrolling:touch;';

    const rowsDiv = document.createElement('div');
    rowsDiv.style.cssText = 'display:flex;flex-direction:column;width:100%;';

    function fmtVol(v) {
      const n = Number(v);
      if (!n) return '—';
      if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
      if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
      if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
      return n.toFixed(2);
    }

    function makeIcon(sym) {
      const iconColor = COIN_COLORS[sym] || '#888';
      const imgSrc = COIN_IMG[sym] || '';
      const wrap = document.createElement('div');
      wrap.style.cssText = 'width:32px;height:32px;flex-shrink:0;';
      if (imgSrc) {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = sym;
        img.style.cssText = 'width:32px;height:32px;border-radius:50%;display:block;';
        img.onerror = function() {
          const circle = document.createElement('div');
          circle.style.cssText = `width:32px;height:32px;border-radius:50%;background:${iconColor};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;`;
          circle.textContent = sym[0];
          wrap.replaceChild(circle, img);
        };
        wrap.appendChild(img);
      } else {
        wrap.style.cssText += `border-radius:50%;background:${iconColor};display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;`;
        wrap.textContent = sym[0];
      }
      return wrap;
    }

    function renderRows() {
      rowsDiv.innerHTML = '';
      const pairsList = activeTab === 1 ? FUTURES_PAIRS : activeTab === 2 ? TRADFI_PAIRS : SPOT_PAIRS;
      pairsList.forEach(sym => {
        const t = tickerMap ? tickerMap[sym + 'USDT'] : null;
        const price = t ? fmt(t.lastPrice, t.lastPrice < 1 ? 4 : 2) : '—';
        const chg = t ? Number(t.change24h) : 0;
        const chgStr = t ? ((chg >= 0 ? '+' : '') + fmt(chg, 2) + '%') : '—';
        const vol = fmtVol(t ? (t.quoteVolume || 0) : 0);
        const chgColor = chg >= 0 ? UP : DOWN;

        const row = document.createElement('a');
        row.href = 'trade.html';
        row.style.cssText = 'display:flex;align-items:center;gap:0;padding:12px 8px;border-bottom:1px solid rgba(255,255,255,0.06);text-decoration:none;color:inherit;cursor:pointer;min-height:64px;width:100%;box-sizing:border-box;';

        row.appendChild(makeIcon(sym));

        // Col 1: pair name (flex:1, truncate)
        const nameCol = document.createElement('div');
        nameCol.style.cssText = 'flex:1;min-width:0;overflow:hidden;padding-left:8px;';
        nameCol.innerHTML = `<div style="font-size:15px;font-weight:600;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${sym}<span style="color:rgba(255,255,255,0.35);font-weight:400;">/USDT</span></div>`;
        row.appendChild(nameCol);

        // Col 2: price + change% (no volume column — match bitbase)
        const priceCol = document.createElement('div');
        priceCol.style.cssText = 'text-align:right;flex-shrink:0;min-width:90px;';
        priceCol.innerHTML = `<div style="font-size:15px;font-weight:600;">${price}</div>
          <div style="font-size:12px;font-weight:500;color:${chgColor};margin-top:3px;">${chgStr}</div>`;
        row.appendChild(priceCol);

        rowsDiv.appendChild(row);
      });

      const more = document.createElement('a');
      more.href = 'market.html';
      more.textContent = 'More >';
      more.style.cssText = 'display:block;text-align:center;padding:12px;color:rgba(255,255,255,0.5);font-size:14px;text-decoration:none;';
      rowsDiv.appendChild(more);
    }

    let activeTab = 0;
    TABS.forEach((label, i) => {
      const tab = document.createElement('div');
      tab.textContent = label;
      const setActive = () => {
        activeTab = i;
        tabBar.querySelectorAll('[data-cvxtab]').forEach((t, j) => {
          t.style.color = j === i ? '#fff' : 'rgba(255,255,255,0.45)';
          t.style.fontWeight = j === i ? '700' : '600';
        });
        renderRows();
      };
      tab.setAttribute('data-cvxtab', i);
      tab.style.cssText = 'padding:10px 12px;font-size:15px;cursor:pointer;white-space:nowrap;transition:color 0.2s;color:rgba(255,255,255,0.45);font-weight:600;';
      tab.addEventListener('click', setActive);
      tabBar.appendChild(tab);
      if (i === 0) setTimeout(setActive, 0);
    });

    _mobileRenderRows = renderRows;
    wrapper.appendChild(tabBar);
    wrapper.appendChild(rowsDiv);
    desktopPairs.parentElement.insertBefore(wrapper, desktopPairs);
  }

  // ── 4. DESKTOP PAIRS — update prices in-place (keep Bitbase HTML/size) ───────
  async function fixDesktopPairs() {
    if (document.getElementById('cvx-dp-fixed')) return;
    if (window.innerWidth <= 767) return;
    const dp = document.getElementById('cvx-desktop-pairs');
    if (!dp) return;

    const tdata = tickerMap || {};

    const fmtPrice = (v) => {
      const n = Number(v);
      if (n >= 1000) return '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
      if (n >= 1) return '$'+n.toFixed(4);
      return '$'+n.toFixed(6);
    };

    // Update each row in-place — keep Bitbase HTML layout exactly as-is
    dp.querySelectorAll('[style*="height: 64px"]').forEach(row => {
      // Identify coin by the /USDT quote slot
      const quoteEl = row.querySelector('[data-slot="quote"]');
      if (!quoteEl) return;
      const base = (quoteEl.previousElementSibling || {}).textContent?.trim();
      if (!base) return;
      const t = tdata[base + 'USDT'];
      if (!t || !Number(t.lastPrice)) return;

      // Price column (2nd child, contains a <div> with text)
      const priceDiv = row.children[1]?.querySelector('div');
      if (priceDiv) priceDiv.textContent = fmtPrice(t.lastPrice);

      // % change column (3rd child, contains a <span> with class)
      const pctSpan = row.children[2]?.querySelector('span');
      if (pctSpan) {
        const chg = Number(t.change24h || t.priceChangePercent || 0);
        const up = chg >= 0;
        pctSpan.textContent = (up ? '+' : '') + chg.toFixed(2) + '%';
        pctSpan.className = up ? 'text-fn_green_default' : 'text-fn_red_default';
        pctSpan.style.color = up ? '#2ebd85' : '#f6465d';
      }
    });

    const marker = document.createElement('span');
    marker.id = 'cvx-dp-fixed';
    marker.style.display = 'none';
    document.body.appendChild(marker);
  }

  // ── 5. GEM SVG ────────────────────────────────────────────────────────────
  function makeGemSVG(w, h) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 22 26');
    svg.setAttribute('width', w || '22'); svg.setAttribute('height', h || '26');
    svg.setAttribute('fill', 'none');
    svg.style.cssText = 'display:inline-block;vertical-align:middle;flex-shrink:0;';
    const p1 = document.createElementNS(ns, 'path');
    p1.setAttribute('d', 'M5.40038 0H0.73112C0.327217 0 0 0.326486 0 0.729486V6.91749C0 7.32049 0.327217 7.64697 0.73112 7.64697H6.1315V0.729486C6.1315 0.326486 5.80429 0 5.40038 0Z');
    p1.setAttribute('fill', '#F68F15');
    const p2 = document.createElementNS(ns, 'path');
    p2.setAttribute('d', 'M6.13151 7.64698V13.0353C6.13151 13.4383 6.45872 13.7648 6.86262 13.7648H12.2891C13.9821 13.7648 15.3546 15.1342 15.3546 16.8235C15.3546 18.5127 13.9821 19.8822 12.2891 19.8822H7.6641C6.81758 19.8822 6.1315 19.1977 6.13113 18.353V14.4939C6.13113 14.0909 5.80392 13.7644 5.40001 13.7644H0.73112C0.327217 13.7644 0 14.0909 0 14.4939V19.1523C0 19.5553 0.327217 19.8818 0.73112 19.8818H4.59854C5.44506 19.8818 6.13151 20.5667 6.13151 21.4114V25.2701C6.13151 25.6731 6.45872 25.9996 6.86262 25.9996H11.9235C17.2048 25.9996 21.4861 21.7278 21.4861 16.4584C21.4861 11.5919 17.532 7.64661 12.6546 7.64661H6.13151V7.64698Z');
    p2.setAttribute('fill', 'currentColor');
    svg.appendChild(p1); svg.appendChild(p2);
    return svg;
  }

  // ── 6. HEADER LOGO ────────────────────────────────────────────────────────
  function fixHeaderLogo() {
    const logoLink = document.querySelector('header a[href="index.html"]');
    if (!logoLink) return;
    // Always ensure only gem SVG shows — no text
    const hasGem = logoLink.querySelector('svg[data-cvx-gem]');
    if (!hasGem) {
      logoLink.innerHTML = '';
      const gem = makeGemSVG('26', '30');
      gem.setAttribute('data-cvx-gem', '1');
      logoLink.appendChild(gem);
    }
    // Hide any text nodes or spans that sneak back in
    logoLink.querySelectorAll('span, svg:not([data-cvx-gem])').forEach(el => {
      el.style.setProperty('display', 'none', 'important');
    });
    logoLink.style.cssText = 'display:inline-flex;align-items:center;padding:0 8px 0 12px;height:100%;';
    logoLink.dataset.cvxLogo = '1';
  }

  // ── 7. HAMBURGER MENU ─────────────────────────────────────────────────────
  function addHamburger() {
    const header = document.querySelector('header');
    if (!header || header.dataset.cvxBurger) return;
    header.dataset.cvxBurger = '1';
    const rightBox = header.querySelector('[data-nav-right-box]');
    if (!rightBox) return;

    const btn = document.createElement('button');
    btn.setAttribute('aria-label', 'Menu');
    btn.innerHTML = '<svg width="20" height="16" viewBox="0 0 20 16" fill="currentColor"><rect width="20" height="2.5" rx="1.2"/><rect y="6.75" width="20" height="2.5" rx="1.2"/><rect y="13.5" width="20" height="2.5" rx="1.2"/></svg>';
    btn.style.cssText = 'background:none;border:none;color:#fff;cursor:pointer;padding:6px 8px;display:flex;align-items:center;margin-left:4px;';

    btn.addEventListener('click', () => {
      const existing = document.getElementById('cvx-mobile-nav');
      if (existing) { existing.remove(); return; }

      const panel = document.createElement('div');
      panel.id = 'cvx-mobile-nav';
      panel.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000;display:flex;flex-direction:column;font-family:-apple-system,system-ui,sans-serif;-webkit-font-smoothing:antialiased;';

      // ── Top bar: logo + X ──
      const topBar = document.createElement('div');
      topBar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:14px 16px;flex-shrink:0;';
      const logoEl = makeGemSVG('22', '26');
      logoEl.style.color = 'white';
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
        <line x1="5" y1="5" x2="17" y2="17"/><line x1="17" y1="5" x2="5" y2="17"/>
      </svg>`;
      closeBtn.style.cssText = 'background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;padding:2px;display:flex;align-items:center;';
      closeBtn.addEventListener('click', () => panel.remove());
      topBar.appendChild(logoEl);
      topBar.appendChild(closeBtn);
      panel.appendChild(topBar);

      // ── Auth buttons ──
      const authRow = document.createElement('div');
      authRow.style.cssText = 'display:flex;gap:10px;padding:8px 16px 16px;flex-shrink:0;';
      const loginBtn = document.createElement('a');
      loginBtn.href = 'login.html'; loginBtn.textContent = 'Log in';
      loginBtn.style.cssText = 'flex:1;text-align:center;padding:11px 0;border-radius:6px;background:#2b2f36;color:#eaecef;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:0.01em;';
      const signupBtn = document.createElement('a');
      signupBtn.href = 'register.html'; signupBtn.textContent = 'Sign up';
      signupBtn.style.cssText = 'flex:1;text-align:center;padding:11px 0;border-radius:6px;background:#F0B90B;color:#181a20;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:0.01em;';
      authRow.appendChild(loginBtn);
      authRow.appendChild(signupBtn);
      panel.appendChild(authRow);

      // ── Nav list (scrollable) ──
      const navScroll = document.createElement('div');
      navScroll.style.cssText = 'flex:1;overflow-y:auto;';
      const CHEVRON = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.35;flex-shrink:0;"><polyline points="6,4 10,8 6,12"/></svg>`;
      NAV.forEach(({ label, href, arrow }) => {
        const row = document.createElement('a');
        row.href = href;
        row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:17px 20px;color:#eaecef;text-decoration:none;font-size:16px;font-weight:500;border-bottom:1px solid rgba(255,255,255,0.07);';
        const labelSpan = document.createElement('span');
        labelSpan.textContent = label;
        row.appendChild(labelSpan);
        if (arrow) row.insertAdjacentHTML('beforeend', CHEVRON);
        row.addEventListener('click', () => panel.remove());
        navScroll.appendChild(row);
      });
      panel.appendChild(navScroll);

      // ── APP Download bottom button ──
      const appBtn = document.createElement('a');
      appBtn.href = '#';
      appBtn.textContent = 'APP Download';
      appBtn.style.cssText = 'display:block;margin:16px;padding:14px 0;text-align:center;border-radius:8px;background:#2b2f36;color:#eaecef;text-decoration:none;font-size:15px;font-weight:600;flex-shrink:0;';
      appBtn.addEventListener('click', () => panel.remove());
      panel.appendChild(appBtn);

      document.body.appendChild(panel);
    });

    rightBox.appendChild(btn);
  }

  // ── 8. EARTH VIDEO ────────────────────────────────────────────────────────
  function addEarthVideo() {
    if (document.getElementById('cvx-globe-done')) return;
    const h2 = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Built on Stability'));
    if (!h2) return;
    const marker = document.createElement('span');
    marker.id = 'cvx-globe-done';
    marker.style.display = 'none';
    document.body.appendChild(marker);
    const section = h2.closest('section');
    if (!section) return;

    const makeVideo = (styles) => {
      const v = document.createElement('video');
      v.src = '/cdn/imgs/index-web/home/earth_video_v2_mini.mp4';
      v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true;
      v.style.cssText = styles;
      return v;
    };

    section.querySelectorAll('span').forEach(span => {
      if (!span.children.length && !span.textContent.trim()) {
        const p = span.parentElement;
        if (p && /flex-1/.test(p.className) && /opacity/.test(p.className))
          span.appendChild(makeVideo('width:100%;height:auto;max-height:580px;object-fit:contain;'));
      }
    });

    section.querySelectorAll('div > div').forEach(d => {
      if (!d.children.length && !d.textContent.trim()) {
        if (/absolute/.test(d.className) || /absolute/.test((d.parentElement || {}).className || ''))
          d.appendChild(makeVideo('width:220px;height:220px;object-fit:contain;'));
      }
    });
  }

  // ── 9. PAIRS TABS ─────────────────────────────────────────────────────────
  function wirePairsTabs() {
    if (document.getElementById('cvx-tabs-done')) return;
    const tabWrap = [...document.querySelectorAll('[class*="cursor-pointer"]')].find(el =>
      el.textContent.trim() === 'Spot' && el.nextElementSibling && /Futures/.test(el.nextElementSibling.textContent)
    );
    if (!tabWrap) return;
    const marker = document.createElement('span');
    marker.id = 'cvx-tabs-done';
    marker.style.display = 'none';
    document.body.appendChild(marker);

    const tabContainer = tabWrap.parentElement;
    const tabs = [...tabContainer.querySelectorAll('[class*="cursor-pointer"]')];
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.style.color = ''; t.style.borderBottom = ''; t.style.fontWeight = ''; });
        tab.style.color = 'var(--text_primary, #fff)';
        tab.style.fontWeight = '700';
      });
    });
    if (tabs[0]) tabs[0].click();
  }

  // ── 10. WORDMARKS ─────────────────────────────────────────────────────────
  function wireWordmarks() {
    document.querySelectorAll('svg[viewBox="0 0 131 26"]').forEach((s) => {
      if (s.dataset.cvxWm) return;
      s.dataset.cvxWm = '1';
      if (s.closest('header')) return;
      const cs = getComputedStyle(s);
      const rect = s.getBoundingClientRect();
      if (cs.display === 'none' || cs.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return;
      if (/Bitcovex/.test((s.closest('a, [class]') || {}).textContent || '')) return;
      const h = rect.height || parseFloat(s.getAttribute('height')) || 22;
      const span = document.createElement('span');
      span.textContent = 'Bitcovex';
      span.style.cssText = 'font-weight:800;font-size:' + (h * 0.92) + 'px;letter-spacing:-0.5px;color:currentColor;white-space:nowrap;line-height:1;display:inline-block';
      s.replaceWith(span);
    });
  }

  // ── 11. TICKER / PRICES ───────────────────────────────────────────────────
  const TICKER_CACHE_KEY = 'cvx_ticker_v1';
  const TICKER_CACHE_TTL = 30000; // 30s

  let tickerMap = null;

  // Load cached prices instantly from localStorage
  (function loadCachedTicker() {
    try {
      const raw = localStorage.getItem(TICKER_CACHE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts < TICKER_CACHE_TTL && parsed.data) {
        tickerMap = parsed.data;
      }
    } catch (e) {}
  })();

  async function loadTicker() {
    // All pairs needed (home page Popular Pairs + mini ticker)
    const ALL_LOAD_SYMS = ['BTCUSDT','BNBUSDT','SOLUSDT','ETHUSDT','DOTUSDT','HBARUSDT','LINKUSDT','XLMUSDT',
                           'XRPUSDT','DOGEUSDT','ADAUSDT','AVAXUSDT','HYPEUSDT','XAUUSDT','PAXGUSDT'];
    try {
      const url = 'https://api.binance.com/api/v3/ticker/24hr?symbols=' + encodeURIComponent(JSON.stringify(ALL_LOAD_SYMS));
      const data = await fetch(url).then(x => x.json());
      if (Array.isArray(data) && data.length) {
        tickerMap = {};
        data.forEach(item => {
          tickerMap[item.symbol] = {
            symbol: item.symbol,
            lastPrice: Number(item.lastPrice),
            priceChangePercent: item.priceChangePercent,
            change24h: Number(item.priceChangePercent),
            quoteVolume: Number(item.quoteVolume)
          };
        });
        // Cache to localStorage for instant next load
        try { localStorage.setItem(TICKER_CACHE_KEY, JSON.stringify({ ts: Date.now(), data: tickerMap })); } catch (e) {}
        return;
      }
    } catch (e) {}
    // Fallback: try backend exchange-ticker
    try {
      const r = await fetch(API_BASE + '/api/p2p/exchange-ticker').then((x) => x.json());
      if (r && r.ticker) {
        tickerMap = {};
        r.ticker.forEach((t) => { tickerMap[t.symbol] = t; });
      }
    } catch (e) {}
  }

  const PAIR = /\b([A-Z]{2,6})\s*\/\s*USDT\b/;
  function pairRows() {
    const cand = [];
    document.querySelectorAll('div,tr,li,a').forEach((el) => {
      const txt = el.innerText || '';
      if (PAIR.test(txt) && /\d[\d,]*\.\d/.test(txt) && txt.length < 140 && el.querySelectorAll('*').length < 60) cand.push(el);
    });
    return cand.filter((r) => !cand.some((o) => o !== r && r.contains(o)));
  }

  function applyPrices() {
    if (!tickerMap) return;
    pairRows().forEach((row) => {
      const m = (row.innerText || '').match(PAIR);
      if (!m) return;
      const t = tickerMap[m[1] + 'USDT'];
      if (!t) return;
      const leaves = [...row.querySelectorAll('*')].filter((e) => e.children.length === 0 && e.textContent.trim());
      for (const el of leaves) {
        const tx = el.textContent.trim().replace(/[$,]/g, '');
        if (/^\d+(\.\d+)?$/.test(tx) && parseFloat(tx) > 0) {
          el.textContent = (el.textContent.trim().startsWith('$') ? '$' : '') + fmt(t.lastPrice, t.lastPrice < 1 ? 4 : 2);
          break;
        }
      }
      for (const el of leaves) {
        if (/%\s*$/.test(el.textContent.trim()) && !/USDT/.test(el.textContent)) {
          const up = Number(t.change24h) >= 0;
          el.textContent = (up ? '+' : '') + fmt(t.change24h, 2) + '%';
          el.style.color = up ? UP : DOWN;
          break;
        }
      }
    });
  }

  function wireTrade() {
    pairRows().forEach((row) => {
      [...row.querySelectorAll('*')].forEach((el) => {
        if (el.children.length === 0 && el.textContent.trim() === 'Trade' && !el.dataset.cvxNav) {
          el.dataset.cvxNav = '1'; el.style.cursor = 'pointer';
          el.addEventListener('click', (e) => { e.stopPropagation(); location.href = 'trade.html'; });
        }
      });
      if (!row.dataset.cvxRow) {
        row.dataset.cvxRow = '1'; row.style.cursor = 'pointer';
        row.addEventListener('click', () => { location.href = 'trade.html'; });
      }
    });
  }

  // ── 12. REVEAL IMAGES ─────────────────────────────────────────────────────
  function revealImages() {
    document.querySelectorAll('img.opacity-0').forEach((img) => {
      const show = () => {
        img.classList.remove('opacity-0');
        img.classList.add('opacity-100');
        const wrapper = img.closest('span[class*="relative"]') || img.parentElement;
        if (wrapper) {
          const skeleton = wrapper.querySelector('.animate-pulse');
          if (skeleton) skeleton.style.display = 'none';
          const overlay = wrapper.querySelector('span[class*="absolute"]');
          if (overlay) overlay.style.display = 'none';
        }
      };
      if (img.complete) show(); else { img.addEventListener('load', show); img.addEventListener('error', show); }
    });
  }

  // ── 13. APP SECTION — fix text overflow ───────────────────────────────────
  function fixAppSection() {
    if (document.getElementById('cvx-app-fixed')) return;
    const h2 = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Trade with Confidence'));
    if (!h2) return;
    // Walk up and fix any overflow:hidden ancestor within max-w-[1200px] container
    let el = h2.parentElement;
    for (let i = 0; i < 6; i++) {
      if (!el) break;
      const cs = getComputedStyle(el);
      if (cs.overflow === 'hidden') el.style.overflow = 'visible';
      if (/max-w-\[1200px\]/.test(el.className || '')) break;
      el = el.parentElement;
    }
    const marker = document.createElement('span');
    marker.id = 'cvx-app-fixed';
    marker.style.display = 'none';
    document.body.appendChild(marker);
  }

  // ── 14. FOOTER ────────────────────────────────────────────────────────────
  function fixFooter() {
    const footer = document.querySelector('footer');
    if (!footer || footer.dataset.cvxFooter) return;
    footer.dataset.cvxFooter = '1';

    const flex = footer.querySelector('.flex.w-full.justify-between');
    if (!flex) return;
    const sections = [...flex.children];
    if (sections.length < 2) return;

    const mobileStyle = document.createElement('style');
    mobileStyle.textContent = `
      @media (max-width: 767px) {
        footer .flex.w-full.justify-between { flex-direction: column !important; gap: 0 !important; padding: 0 !important; }
        footer .flex.w-full.justify-between > section:first-child { max-width: 100% !important; margin: 0 0 16px 0 !important; padding-bottom: 16px !important; border-bottom: 1px solid rgba(255,255,255,0.1); }
        [data-cvx-footer-section] { margin: 0 !important; padding: 0 !important; border-bottom: 1px solid rgba(255,255,255,0.08) !important; width: 100% !important; max-width: 100% !important; }
        [data-cvx-footer-links] { display: none; padding: 0 0 4px !important; }
        [data-cvx-footer-links] a { padding: 10px 0 !important; display: block; font-size: 14px; color: rgba(255,255,255,0.6); }
        [data-cvx-footer-title] { display: flex !important; align-items: center !important; justify-content: space-between !important; width: 100% !important; padding: 14px 0 !important; margin: 0 !important; cursor: pointer; font-size: 15px !important; font-weight: 600 !important; }
        [data-cvx-footer-title] svg { flex-shrink: 0; transition: transform 0.2s; }
        [data-cvx-footer-title].open svg { transform: rotate(180deg); }
        footer .bg-bg_primary.w-full { padding-top: 20px !important; padding-bottom: 0 !important; }
        [data-cvx-footer-qr] { display: none !important; }
        [data-cvx-footer-community] { display: none !important; }
      }
    `;
    document.head.appendChild(mobileStyle);

    // Hide QR code and "Community" heading in footer logo section on mobile
    const logoSec = sections[0];
    if (logoSec) {
      // Hide img with alt="qrcode" and its w-39 container
      logoSec.querySelectorAll('img').forEach(img => {
        const alt = (img.alt || '').toLowerCase();
        if (alt === 'qrcode' || alt.includes('qr') || alt.includes('scan')) {
          // Walk up to find the outermost container of size (w-39 or similar)
          let container = img;
          for (let i = 0; i < 4; i++) {
            if (container.parentElement && container.parentElement !== logoSec) {
              container = container.parentElement;
            }
          }
          container.setAttribute('data-cvx-footer-qr', '1');
          img.setAttribute('data-cvx-footer-qr', '1');
        }
      });
      // Also hide any div containing base64 PNG (QR is base64 encoded)
      logoSec.querySelectorAll('div').forEach(el => {
        const img = el.querySelector('img[src^="data:image"]');
        if (img) el.setAttribute('data-cvx-footer-qr', '1');
      });
      // Hide "Scan to Download the APP" text and any similar download text
      logoSec.querySelectorAll('div, p, span').forEach(el => {
        const txt = (el.textContent || '').trim().toLowerCase();
        if (txt.includes('scan to download') || txt === 'scan to download the app') {
          el.setAttribute('data-cvx-footer-qr', '1');
        }
      });
      // Hide "Community" heading text
      logoSec.querySelectorAll('h1,h2,h3,h4,h5,p,span,div').forEach(el => {
        if (el.children.length === 0 && (el.textContent || '').trim().toLowerCase() === 'community') {
          el.setAttribute('data-cvx-footer-community', '1');
        }
      });
    }

    // Accordion only on mobile — desktop shows full expanded footer
    const isMobile = window.innerWidth <= 767;
    sections.slice(1).forEach(sec => {
      sec.setAttribute('data-cvx-footer-section', '1');
      const titleEl = sec.querySelector('h2, h3, h4, p, div.font-semibold, div.font-medium');
      if (!titleEl) return;
      titleEl.setAttribute('data-cvx-footer-title', '1');

      if (!isMobile) return; // Desktop: keep links visible, no accordion

      titleEl.insertAdjacentHTML('beforeend', '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M4 6l4 4 4-4"/></svg>');

      const linksWrap = document.createElement('div');
      linksWrap.setAttribute('data-cvx-footer-links', '1');
      linksWrap.style.display = 'none';
      const links = [...sec.children].slice(1);
      links.forEach(l => linksWrap.appendChild(l));
      sec.appendChild(linksWrap);

      titleEl.addEventListener('click', () => {
        const isOpen = linksWrap.style.display === 'block';
        linksWrap.style.display = isOpen ? 'none' : 'block';
        titleEl.classList.toggle('open', !isOpen);
      });
    });

    const footerLogoSection = sections[0];
    const footerSVG = footerLogoSection.querySelector('svg[viewBox="0 0 131 26"]');
    if (footerSVG) {
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:flex;align-items:center;gap:8px;';
      const gem = makeGemSVG('20', '24');
      const name = document.createElement('span');
      name.textContent = 'Bitcovex';
      name.style.cssText = 'font-weight:800;font-size:18px;letter-spacing:-0.5px;color:currentColor;';
      wrapper.appendChild(gem); wrapper.appendChild(name);
      footerSVG.replaceWith(wrapper);
    }
  }

  // ── 14b. FIX TRUNCATED TEXT IN SECURITY SECTION ──────────────────────────
  function fixSecurityText() {
    const h2 = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Your Assets'));
    if (!h2) return;
    const sec = h2.closest('section') || h2.parentElement;
    if (!sec) return;
    sec.querySelectorAll('p, span').forEach(el => {
      el.style.webkitLineClamp = 'unset';
      el.style.overflow = 'visible';
      el.style.display = el.tagName === 'SPAN' ? 'inline' : 'block';
    });
  }

  // ── 15. SECURITY SECTION ─────────────────────────────────────────────────
  function fixSecuritySection() {
    if (document.getElementById('cvx-security-done')) return;
    if (window.innerWidth > 767) {
      // Desktop: replace shield_v2.webp (dark/invisible) with shield_mobile.jpg (silver, visible)
      const desktopShield = document.querySelector('img[src*="shield_v2"]');
      if (desktopShield) {
        desktopShield.src = '/cdn/imgs/index-web/home/shield_mobile.jpg';
        desktopShield.style.cssText = 'opacity:1!important;width:100%;height:auto;border-radius:8px;';
        // Also fix the aspect-square container that clips it
        const container = desktopShield.closest('[class*="aspect-square"]');
        if (container) {
          container.style.setProperty('aspect-ratio', 'auto', 'important');
          container.style.setProperty('height', 'auto', 'important');
        }
        // Make sure parent hidden md:flex div is visible and centered
        const wrapper = desktopShield.closest('[class*="hidden md:flex"]');
        if (wrapper) {
          wrapper.style.setProperty('display', 'flex', 'important');
          // Remove translate-y that pushes shield down, center it vertically
          wrapper.style.setProperty('transform', 'translateY(-60px)', 'important');
          wrapper.style.setProperty('align-self', 'center', 'important');
        }
      }
      const marker = document.createElement('span');
      marker.id = 'cvx-security-done';
      marker.style.display = 'none';
      document.body.appendChild(marker);
      return;
    }
    const h2 = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Your Assets'));
    if (!h2) return;
    const sec = h2.closest('section') || h2.parentElement;
    if (!sec) return;

    // 1) Hide shrink-0 col + md:hidden image wrapper (aspect-square = 200px gap root cause)
    sec.querySelectorAll('div, span').forEach(el => {
      const cls = el.className || '';
      if (cls.includes('shrink-0') || cls.includes('md:hidden')) {
        el.style.setProperty('display','none','important');
      }
    });
    // Hide all existing imgs (including shield_v2.webp) — only our injected shield stays
    sec.querySelectorAll('img').forEach(img => {
      if (img.id !== 'cvx-mobile-shield') img.style.setProperty('display','none','important');
    });
    // Also zero any remaining height from hidden wrappers
    sec.querySelectorAll('*').forEach(el => {
      if (window.getComputedStyle(el).display === 'none') return;
      el.style.setProperty('aspect-ratio','auto','important');
    });

    // 2) Section itself — no fixed height
    sec.style.setProperty('min-height','0','important');
    sec.style.setProperty('height','auto','important');
    sec.style.setProperty('padding-top','28px','important');
    sec.style.setProperty('padding-bottom','28px','important');

    // 3) Inject shield between subtitle and bullet list
    if (!document.getElementById('cvx-mobile-shield')) {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'width:100%;display:flex;justify-content:center;padding:12px 0 8px;';
      const img = document.createElement('img');
      img.id = 'cvx-mobile-shield';
      img.src = '/cdn/imgs/index-web/home/shield_mobile.jpg';
      img.alt = 'Security Shield';
      img.style.cssText = 'display:block!important;width:220px;height:auto;border-radius:6px;';
      wrap.appendChild(img);

      const subtitleP = h2.parentElement ? h2.parentElement.querySelector('p') : sec.querySelector('p');
      const ul = sec.querySelector('ul');
      if (subtitleP && subtitleP.parentNode) {
        subtitleP.style.setProperty('margin-bottom','0','important');
        subtitleP.parentNode.insertBefore(wrap, subtitleP.nextSibling);
      } else if (ul) {
        ul.parentNode.insertBefore(wrap, ul);
      } else {
        sec.appendChild(wrap);
      }
      if (ul) {
        ul.style.setProperty('margin-top','8px','important');
        wrap.parentNode.insertBefore(ul, wrap.nextSibling);
      }
    }

    const marker = document.createElement('span');
    marker.id = 'cvx-security-done';
    marker.style.display = 'none';
    document.body.appendChild(marker);
  }

  // ── 16a. FOOTER ACCORDION (mobile — like Bitbase) ────────────────────────
  function fixFooterAccordion() {
    if (document.getElementById('cvx-footer-accordion')) return;
    if (window.innerWidth > 767) return;
    const footer = document.querySelector('footer');
    if (!footer) return;

    // Find section headings (Company, Product, Support, Service)
    footer.querySelectorAll('section, div').forEach(block => {
      const heading = block.querySelector('h3, h4, p, div');
      if (!heading) return;
      const txt = (heading.textContent || '').trim();
      if (!['Company','Product','Support','Service','Resources'].includes(txt)) return;
      if (block.dataset.cvxAccordion) return;
      block.dataset.cvxAccordion = '1';

      // Get list of links
      const linkList = block.querySelector('ul, ol, nav');
      if (!linkList) return;

      // Style heading as accordion trigger
      heading.style.cssText += ';display:flex;align-items:center;justify-content:space-between;cursor:pointer;padding:14px 0;font-size:15px;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.08);';
      const arrow = document.createElement('span');
      arrow.textContent = '›';
      arrow.style.cssText = 'font-size:18px;transform:rotate(90deg);transition:transform 0.2s;display:inline-block;color:rgba(255,255,255,0.5);';
      heading.appendChild(arrow);

      // Hide links by default
      linkList.style.cssText = 'max-height:0;overflow:hidden;transition:max-height 0.3s ease;';

      let open = false;
      heading.addEventListener('click', () => {
        open = !open;
        linkList.style.maxHeight = open ? (linkList.scrollHeight + 'px') : '0';
        arrow.style.transform = open ? 'rotate(-90deg)' : 'rotate(90deg)';
      });
    });

    const marker = document.createElement('span');
    marker.id = 'cvx-footer-accordion';
    marker.style.display = 'none';
    document.body.appendChild(marker);
  }

  // ── 16. CAROUSEL AUTO-SLIDE ───────────────────────────────────────────────
  function autoSlideCarousel() {
    if (document.getElementById('cvx-carousel-done')) return;

    // Find "Trade with Confidence" section — must NOT be carousel-animated
    const appH2 = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Trade with Confidence'));
    const appSection = appH2 ? (appH2.closest('section') || appH2.parentElement) : null;

    const candidates = [...document.querySelectorAll('div')].filter(div => {
      const cs = getComputedStyle(div);
      if (cs.overflow !== 'hidden' && !/(overflow-hidden)/.test(div.className || '')) return false;
      const inner = div.firstElementChild;
      if (!inner) return false;
      const ics = getComputedStyle(inner);
      return (ics.display === 'flex' || /\bflex\b/.test(inner.className || '')) && inner.children.length >= 2;
    });

    candidates.forEach(container => {
      // Skip any carousel that contains the app-download QR/phone content
      const hasQR = container.querySelector('img[alt="qrcode"], img[src^="data:image"]');
      const hasAppText = /scan.*download|ios.*android|trade with confidence/i.test(container.textContent || '');
      const nearAppSection = appSection && (appSection.contains(container) || container.contains(appSection) || (container.closest && container.closest('section') === appSection));
      if (hasQR || hasAppText || nearAppSection) {
        // Freeze at first slide (no animation)
        const track = container.firstElementChild;
        if (track) { track.style.transform = 'translateX(0)'; track.style.transition = 'none'; }
        return;
      }
      const track = container.firstElementChild;
      const slides = [...track.children];
      if (slides.length < 2) return;
      if (container.dataset.cvxCarousel) return;
      container.dataset.cvxCarousel = '1';

      track.style.transition = 'transform 0.5s ease';
      track.style.willChange = 'transform';

      let current = 0;
      const total = slides.length;

      const parent = container.parentElement;
      const dots = parent ? [...parent.querySelectorAll('[class*="rounded-full"],[class*="dot"]')].filter(d => {
        const r = d.getBoundingClientRect();
        return r.width <= 12 && r.height <= 12;
      }) : [];

      const goTo = (idx) => {
        current = (idx + total) % total;
        track.style.transform = `translateX(-${current * (100 / total)}%)`;
        dots.forEach((dot, i) => {
          dot.style.opacity = i === current ? '1' : '0.4';
          dot.style.transform = i === current ? 'scaleX(2.5)' : 'scaleX(1)';
        });
      };

      goTo(0);
      setInterval(() => goTo(current + 1), 3000);
    });

    const marker = document.createElement('span');
    marker.id = 'cvx-carousel-done';
    marker.style.display = 'none';
    document.body.appendChild(marker);
  }

  // ── 17. TRADE PAGE: LIVE PRICES + MOBILE UI ───────────────────────────────
  function fixTradePage() {
    const onTrade = /trade\.html/.test(location.href);
    if (!onTrade) return;

    // ── Patch desktop TradingView widget (from trade.js) to use Bitbase colors ──
    (function patchDesktopTV() {
      if (window._cvxTVPatched) return;
      window._cvxTVPatched = true;

      function applyPatch(tv) {
        if (!tv || !tv.widget || tv.widget._cvxPatched) return;
        const Orig = tv.widget;
        function PatchedWidget(config) {
          config = config || {};
          config.overrides = Object.assign({
            'mainSeriesProperties.candleStyle.upColor':        '#2ebd85',
            'mainSeriesProperties.candleStyle.downColor':      '#f6465d',
            'mainSeriesProperties.candleStyle.borderUpColor':  '#2ebd85',
            'mainSeriesProperties.candleStyle.borderDownColor':'#f6465d',
            'mainSeriesProperties.candleStyle.wickUpColor':    '#2ebd85',
            'mainSeriesProperties.candleStyle.wickDownColor':  '#f6465d',
          }, config.overrides || {});
          config.studies = config.studies || [];
          const hasEMA = config.studies.some(s => s && s.id && s.id.includes('MAExp'));
          if (!hasEMA) {
            config.studies.push(
              { id:'MAExp@tv-basicstudies', inputs:{length:7},  overrides:{'Plot.color':'#f6a609','Plot.linewidth':1} },
              { id:'MAExp@tv-basicstudies', inputs:{length:25}, overrides:{'Plot.color':'#9c27b0','Plot.linewidth':1} },
              { id:'MAExp@tv-basicstudies', inputs:{length:99}, overrides:{'Plot.color':'#2196f3','Plot.linewidth':1} }
            );
          }
          return new Orig(config);
        }
        PatchedWidget._cvxPatched = true;
        PatchedWidget.prototype = Orig.prototype;
        tv.widget = PatchedWidget;
      }

      if (window.TradingView) {
        applyPatch(window.TradingView);
        return;
      }
      // Intercept when TradingView library script sets window.TradingView
      let _tv;
      try {
        Object.defineProperty(window, 'TradingView', {
          configurable: true,
          get() { return _tv; },
          set(val) { _tv = val; applyPatch(_tv); }
        });
      } catch(e) {}
    })();

    const SYMBOL = 'BTCUSDT';
    let livePrice = 0, livePct = 0, liveHigh = 0, liveLow = 0, liveVol = 0, liveQuoteVol = 0;
    let activeTab = 'chart';
    let tvLoaded = false;

    async function fetchTradeTicker() {
      try {
        const d = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${SYMBOL}`).then(r=>r.json());
        livePrice = Number(d.lastPrice||0); livePct = Number(d.priceChangePercent||0);
        liveHigh = Number(d.highPrice||0); liveLow = Number(d.lowPrice||0);
        liveVol = Number(d.volume||0); liveQuoteVol = Number(d.quoteVolume||0);
      } catch(e) {}
    }
    async function fetchRecentTrades() {
      try { return await fetch(`https://api.binance.com/api/v3/trades?symbol=${SYMBOL}&limit=30`).then(r=>r.json()); }
      catch(e) { return []; }
    }
    function fmtP(p) {
      const n=Number(p);
      if(n>=1e9) return (n/1e9).toFixed(2)+'B';
      if(n>=1e6) return (n/1e6).toFixed(2)+'M';
      if(n>=1e3) return (n/1e3).toFixed(2)+'K';
      return n.toFixed(2);
    }
    function fmtTime(ts) {
      return new Date(ts).toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});
    }
    function genOrderBook(midPrice, numRows=14) {
      const tick = midPrice>10000?0.1:0.01;
      const asks=[],bids=[];
      let ra=0,rb=0;
      for(let i=1;i<=numRows;i++){
        const ap=(midPrice+i*tick).toFixed(2), bp=(midPrice-i*tick).toFixed(2);
        const aa=(Math.random()*2+0.01).toFixed(6), ba=(Math.random()*2+0.01).toFixed(6);
        ra+=Number(aa); rb+=Number(ba);
        asks.push({p:ap,a:aa,t:ra.toFixed(6)}); bids.push({p:bp,a:ba,t:rb.toFixed(6)});
      }
      return {asks:asks.reverse(), bids};
    }

    // ── BUILD MOBILE OVERLAY (always, hidden on desktop via CSS) ─────────────
    if (!document.getElementById('cvx-mobile-trade')) {
      // Inject CSS to hide overlay on desktop and original content on mobile
      const style = document.createElement('style');
      style.textContent = `
        #cvx-mobile-trade { display:flex!important; }
        @media(min-width:768px){ #cvx-mobile-trade { display:none!important; } }
        @media(max-width:767px){ #__next { display:none!important; } body>*:not(#cvx-mobile-trade):not(script):not(style) { visibility:hidden!important; } }
      `;
      document.head.appendChild(style);

      const ov = document.createElement('div');
      ov.id = 'cvx-mobile-trade';
      ov.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:2147483647;background:#0b0e11;flex-direction:column;overflow:hidden;font-family:-apple-system,system-ui,sans-serif;color:#fff;-webkit-font-smoothing:antialiased;';
      ov.innerHTML = `
        <div style="flex-shrink:0;background:#161a1e;">
          <!-- Row 1: pair + nav -->
          <div style="display:flex;align-items:center;padding:10px 12px 8px;gap:8px;border-bottom:1px solid rgba(255,255,255,0.06);">
            <img src="https://assets.coincap.io/assets/icons/btc@2x.png" width="24" height="24" style="border-radius:50%;flex-shrink:0;" onerror="this.style.display='none'"/>
            <div>
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="font-size:15px;font-weight:700;line-height:1.2;">BTC/USDT</span>
                <span style="background:rgba(240,185,11,0.15);color:#F0B90B;font-size:10px;padding:1px 5px;border-radius:3px;font-weight:600;">Perpetual</span>
              </div>
              <div id="cvx-t-idx-mark" style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:1px;">Index -- &nbsp;|&nbsp; Mark --</div>
            </div>
            <div style="flex:1;"></div>
            <a href="register.html" style="background:#F0B90B;color:#000;font-size:12px;font-weight:700;padding:6px 12px;border-radius:6px;text-decoration:none;">Sign up</a>
          </div>
          <!-- Row 2: price + stats grid -->
          <div style="display:flex;padding:8px 12px 8px;gap:0;align-items:flex-start;">
            <div style="flex:1;">
              <div id="cvx-trade-price" style="font-size:28px;font-weight:700;color:#2ebd85;letter-spacing:-0.5px;line-height:1.1;">--</div>
              <div id="cvx-trade-pct" style="font-size:12px;color:#2ebd85;margin-top:2px;">--</div>
              <div style="margin-top:6px;">
                <div style="font-size:10px;color:rgba(255,255,255,0.4);">Funding Rate / Countdown</div>
                <div style="font-size:11px;color:#2ebd85;margin-top:1px;">0.0075% / <span id="cvx-countdown">02:34:55</span></div>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 20px;font-size:10px;text-align:right;min-width:140px;">
              <div style="color:rgba(255,255,255,0.4);">24H High</div><div style="color:rgba(255,255,255,0.4);">24H Low</div>
              <div id="cvx-t-high" style="font-weight:500;">--</div><div id="cvx-t-low" style="font-weight:500;">--</div>
              <div style="color:rgba(255,255,255,0.4);">24H Vol (BTC)</div><div style="color:rgba(255,255,255,0.4);">24H Vol (USDT)</div>
              <div id="cvx-t-vol" style="font-weight:500;">--</div><div id="cvx-t-qvol" style="font-weight:500;">--</div>
            </div>
          </div>
          <!-- Tab bar -->
          <div style="display:flex;border-top:1px solid rgba(255,255,255,0.06);">
            <button data-cvx-tab="chart" style="flex:1;padding:9px 0;font-size:13px;font-weight:600;background:none;border:none;border-bottom:2px solid #F0B90B;color:#fff;cursor:pointer;">Chart</button>
            <button data-cvx-tab="book" style="flex:1;padding:9px 0;font-size:13px;font-weight:400;background:none;border:none;border-bottom:2px solid transparent;color:rgba(255,255,255,0.45);cursor:pointer;">Order Book</button>
            <button data-cvx-tab="trades" style="flex:1;padding:9px 0;font-size:13px;font-weight:400;background:none;border:none;border-bottom:2px solid transparent;color:rgba(255,255,255,0.45);cursor:pointer;">Trades</button>
          </div>
        </div>
        <!-- Content area -->
        <div style="flex:1;position:relative;overflow:hidden;min-height:0;">
          <div id="cvx-tab-chart" style="position:absolute;inset:0;"><div id="cvx-tv-container" style="width:100%;height:100%;"></div></div>
          <div id="cvx-tab-book" style="position:absolute;inset:0;display:none;overflow-y:auto;background:#0b0e11;">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;font-size:11px;color:rgba(255,255,255,0.4);padding:8px 12px 6px;position:sticky;top:0;background:#0b0e11;z-index:1;">
              <span>Price(USDT)</span><span style="text-align:center;">Size(BTC)</span><span style="text-align:right;">Total(BTC)</span>
            </div>
            <div id="cvx-asks"></div>
            <div id="cvx-mid" style="padding:7px 12px;font-size:15px;font-weight:700;color:#2ebd85;background:rgba(46,189,133,0.06);border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);">--</div>
            <div id="cvx-bids"></div>
          </div>
          <div id="cvx-tab-trades" style="position:absolute;inset:0;display:none;overflow-y:auto;background:#0b0e11;">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;font-size:11px;color:rgba(255,255,255,0.4);padding:8px 12px 6px;position:sticky;top:0;background:#0b0e11;z-index:1;">
              <span>Price(USDT)</span><span style="text-align:center;">Size(BTC)</span><span style="text-align:right;">Date</span>
            </div>
            <div id="cvx-trade-rows"></div>
          </div>
        </div>
        <!-- Bottom action buttons -->
        <div style="flex-shrink:0;display:flex;gap:8px;padding:10px 12px 14px;background:#161a1e;border-top:1px solid rgba(255,255,255,0.08);">
          <button id="cvx-btn-long" style="flex:1;height:46px;background:#2ebd85;border:none;border-radius:8px;color:#fff;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:0.2px;">Open Long</button>
          <button id="cvx-btn-short" style="flex:1;height:46px;background:#f6465d;border:none;border-radius:8px;color:#fff;font-size:15px;font-weight:700;cursor:pointer;letter-spacing:0.2px;">Open Short</button>
        </div>
        <!-- Order Placement panel (hidden by default) -->
        <div id="cvx-order-panel" style="display:none;position:absolute;left:0;right:0;bottom:0;background:#161a1e;border-top:1px solid rgba(255,255,255,0.1);z-index:10;padding:0 12px 16px;">
          <div style="display:flex;align-items:center;padding:12px 0 10px;">
            <span style="font-size:15px;font-weight:700;flex:1;">Order Placement</span>
            <button id="cvx-order-close" style="background:none;border:none;color:rgba(255,255,255,0.5);font-size:20px;cursor:pointer;padding:0;line-height:1;">&times;</button>
          </div>
          <div style="display:flex;gap:8px;margin-bottom:10px;">
            <button style="flex:1;padding:7px;background:#2b2f36;border:none;border-radius:6px;color:#fff;font-size:13px;cursor:pointer;">Cross ▾</button>
            <button style="flex:1;padding:7px;background:#2b2f36;border:none;border-radius:6px;color:#fff;font-size:13px;cursor:pointer;">20X ▾</button>
          </div>
          <div style="display:flex;gap:0;margin-bottom:10px;background:#2b2f36;border-radius:6px;overflow:hidden;">
            <button id="cvx-op-open" style="flex:1;padding:8px;background:#fff;border:none;color:#000;font-size:13px;font-weight:600;cursor:pointer;">Open</button>
            <button id="cvx-op-close" style="flex:1;padding:8px;background:transparent;border:none;color:rgba(255,255,255,0.5);font-size:13px;cursor:pointer;">Close</button>
          </div>
          <div style="display:flex;gap:16px;margin-bottom:10px;">
            <button id="cvx-type-limit" style="font-size:13px;font-weight:600;color:#fff;background:none;border:none;border-bottom:2px solid #F0B90B;padding:0 0 4px;cursor:pointer;">Limit</button>
            <button style="font-size:13px;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;padding:0 0 4px;cursor:pointer;">Market</button>
            <button style="font-size:13px;color:rgba(255,255,255,0.4);background:none;border:none;border-bottom:2px solid transparent;padding:0 0 4px;cursor:pointer;">Conditional ▾</button>
          </div>
          <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:8px;">Available <span style="color:#fff;">0.0000 USDT</span></div>
          <div style="display:flex;align-items:center;background:#2b2f36;border-radius:6px;padding:8px 10px;margin-bottom:8px;">
            <span style="font-size:12px;color:rgba(255,255,255,0.4);flex:1;">Last Price</span>
            <span id="cvx-op-price" style="font-size:13px;font-weight:600;">--</span>
            <span style="font-size:11px;color:rgba(255,255,255,0.4);margin-left:6px;">Last</span>
            <span style="font-size:14px;margin-left:6px;color:rgba(255,255,255,0.5);">⚡</span>
          </div>
          <div style="display:flex;align-items:center;background:#2b2f36;border-radius:6px;padding:8px 10px;margin-bottom:10px;">
            <span style="font-size:12px;color:rgba(255,255,255,0.4);flex:1;">Size</span>
            <span style="font-size:13px;color:rgba(255,255,255,0.3);">BTC ▾</span>
          </div>
          <input type="range" min="0" max="100" value="0" style="width:100%;accent-color:#F0B90B;margin-bottom:6px;"/>
          <div style="display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:10px;">
            <span id="cvx-op-sell-qty">Sell 0.0000 BTC</span>
            <span id="cvx-op-buy-qty">Buy 0.0000 BTC</span>
          </div>
          <button onclick="location.href='register.html'" style="width:100%;padding:13px;background:#fff;border:none;border-radius:8px;color:#000;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:8px;">Register Now</button>
          <div style="text-align:center;"><a href="login.html" style="color:rgba(255,255,255,0.5);font-size:13px;text-decoration:none;">Login</a></div>
        </div>
      `;
      document.body.appendChild(ov);

      // Order placement panel
      const orderPanel = document.getElementById('cvx-order-panel');
      const orderClose = document.getElementById('cvx-order-close');
      const opOpen = document.getElementById('cvx-op-open');
      const opClose = document.getElementById('cvx-op-close');
      function showOrderPanel(side) {
        if (!orderPanel) return;
        orderPanel.style.display = 'block';
        // Toggle Open/Close visual state based on long/short
        if (opOpen && opClose) {
          if (side === 'long') {
            opOpen.style.background = '#2ebd85'; opOpen.style.color = '#fff';
            opClose.style.background = 'transparent'; opClose.style.color = 'rgba(255,255,255,0.5)';
          } else {
            opOpen.style.background = '#fff'; opOpen.style.color = '#000';
            opClose.style.background = '#f6465d'; opClose.style.color = '#fff';
          }
        }
        const prEl = document.getElementById('cvx-op-price');
        if (prEl && livePrice) prEl.textContent = livePrice.toFixed(1);
      }
      document.getElementById('cvx-btn-long')?.addEventListener('click', () => showOrderPanel('long'));
      document.getElementById('cvx-btn-short')?.addEventListener('click', () => showOrderPanel('short'));
      orderClose?.addEventListener('click', () => { if (orderPanel) orderPanel.style.display = 'none'; });
      if (opOpen) opOpen.addEventListener('click', () => {
        opOpen.style.background='#fff'; opOpen.style.color='#000';
        if(opClose){opClose.style.background='transparent'; opClose.style.color='rgba(255,255,255,0.5)';}
      });
      if (opClose) opClose.addEventListener('click', () => {
        opClose.style.background='#f6465d'; opClose.style.color='#fff';
        if(opOpen){opOpen.style.background='transparent'; opOpen.style.color='rgba(255,255,255,0.5)';}
      });

      // Tab switching
      ov.querySelectorAll('[data-cvx-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
          activeTab = btn.dataset.cvxTab;
          ov.querySelectorAll('[data-cvx-tab]').forEach(b => {
            const on = b.dataset.cvxTab === activeTab;
            b.style.color = on ? '#fff' : 'rgba(255,255,255,0.45)';
            b.style.fontWeight = on ? '600' : '400';
            b.style.borderBottom = on ? '2px solid #F0B90B' : '2px solid transparent';
          });
          document.getElementById('cvx-tab-chart').style.display = activeTab==='chart' ? 'block' : 'none';
          document.getElementById('cvx-tab-book').style.display  = activeTab==='book'  ? 'block' : 'none';
          document.getElementById('cvx-tab-trades').style.display= activeTab==='trades'? 'block' : 'none';
          if (activeTab==='book') renderBook();
          if (activeTab==='trades') loadTrades();
          if (activeTab==='chart' && !tvLoaded) { tvLoaded=true; loadTVChart(); }
        });
      });

      // Countdown timer
      let cd = 2*3600+34*60+55;
      setInterval(()=>{
        cd = (cd-1+86400)%86400;
        const el = document.getElementById('cvx-countdown');
        if(el) el.textContent = [Math.floor(cd/3600),Math.floor((cd%3600)/60),cd%60].map(n=>String(n).padStart(2,'0')).join(':');
      }, 1000);

      // Load TradingView chart
      function loadTVChart() {
        const host = document.getElementById('cvx-tv-container');
        if (!host) return;
        const cid = 'cvx-tv-' + Date.now();
        host.innerHTML = `<div id="${cid}" style="width:100%;height:100%;"></div>`;
        function tryCreate() {
          if (window.TradingView && window.TradingView.widget) {
            new window.TradingView.widget({
              autosize:true, symbol:'BINANCE:BTCUSDT', interval:'15',
              timezone:'Etc/UTC', theme:'dark', style:'1', locale:'en',
              hide_top_toolbar:false, hide_side_toolbar:true,
              allow_symbol_change:false, enable_publishing:false,
              container_id:cid,
              disabled_features:['create_volume_indicator_by_default','header_symbol_search','header_compare'],
              studies:[
                { id:'MAExp@tv-basicstudies', inputs:{length:7},  overrides:{'Plot.color':'#f6a609','Plot.linewidth':1} },
                { id:'MAExp@tv-basicstudies', inputs:{length:25}, overrides:{'Plot.color':'#9c27b0','Plot.linewidth':1} },
                { id:'MAExp@tv-basicstudies', inputs:{length:99}, overrides:{'Plot.color':'#2196f3','Plot.linewidth':1} }
              ],
              overrides:{
                'mainSeriesProperties.candleStyle.upColor':'#2ebd85',
                'mainSeriesProperties.candleStyle.downColor':'#f6465d',
                'mainSeriesProperties.candleStyle.borderUpColor':'#2ebd85',
                'mainSeriesProperties.candleStyle.borderDownColor':'#f6465d',
                'mainSeriesProperties.candleStyle.wickUpColor':'#2ebd85',
                'mainSeriesProperties.candleStyle.wickDownColor':'#f6465d',
                'volumePaneSize':'tiny'
              },
              loading_screen:{backgroundColor:'#0b0e11'}
            });
          } else {
            const existing = document.querySelector('script[src*="tradingview.com/tv.js"]');
            if (!existing) {
              const s = document.createElement('script');
              s.src = 'https://s3.tradingview.com/tv.js';
              s.onload = tryCreate;
              document.head.appendChild(s);
            } else { setTimeout(tryCreate, 400); }
          }
        }
        tryCreate();
      }
      tvLoaded = true;
      loadTVChart();

      // Order book
      function renderBook() {
        if (!livePrice) return;
        const {asks,bids} = genOrderBook(livePrice,14);
        const askDiv=document.getElementById('cvx-asks');
        const bidDiv=document.getElementById('cvx-bids');
        const midDiv=document.getElementById('cvx-mid');
        if (!askDiv) return;
        const mkRow = (r, color, bg) => `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;font-size:12px;padding:4px 12px;position:relative;">
          <div style="position:absolute;right:0;top:0;bottom:0;background:${bg};width:${Math.min(85,Math.random()*60+15)}%;z-index:0;"></div>
          <span style="color:${color};font-weight:500;z-index:1;position:relative;">${r.p}</span>
          <span style="text-align:center;z-index:1;position:relative;">${r.a}</span>
          <span style="text-align:right;color:rgba(255,255,255,0.5);z-index:1;position:relative;">${r.t}</span>
        </div>`;
        if (midDiv) midDiv.textContent = livePrice.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
        askDiv.innerHTML = asks.map(r=>mkRow(r,'#f6465d','rgba(246,70,93,0.08)')).join('');
        bidDiv.innerHTML = bids.map(r=>mkRow(r,'#2ebd85','rgba(46,189,133,0.08)')).join('');
      }

      // Recent trades
      async function loadTrades() {
        const rowDiv=document.getElementById('cvx-trade-rows');
        if (!rowDiv) return;
        rowDiv.innerHTML='<div style="padding:16px;color:rgba(255,255,255,0.3);font-size:12px;text-align:center;">Loading...</div>';
        const trades=await fetchRecentTrades();
        rowDiv.innerHTML=[...trades].reverse().map(t=>{
          const buy=t.isBuyerMaker===false;
          return `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;font-size:12px;padding:5px 12px;">
            <span style="color:${buy?'#2ebd85':'#f6465d'};font-weight:500;">${Number(t.price).toFixed(2)}</span>
            <span style="text-align:center;">${Number(t.qty).toFixed(4)}</span>
            <span style="text-align:right;color:rgba(255,255,255,0.4);">${fmtTime(t.time)}</span>
          </div>`;
        }).join('');
      }

      // Store render functions on window for price update access
      window._cvxRenderBook = renderBook;
    }

    // Update prices in overlay
    function updateMobilePrices() {
      if (!livePrice) return;
      const isUp=livePct>=0, color=isUp?'#2ebd85':'#f6465d';
      const priceStr=livePrice.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
      const prEl=document.getElementById('cvx-trade-price');
      const ptEl=document.getElementById('cvx-trade-pct');
      if(prEl){prEl.textContent=priceStr;prEl.style.color=color;}
      if(ptEl){ptEl.textContent=(isUp?'+':'')+livePct.toFixed(2)+'%';ptEl.style.color=color;}
      const imEl=document.getElementById('cvx-t-idx-mark');
      if(imEl) imEl.textContent=`Index ${livePrice.toFixed(1)} | Mark ${(livePrice+0.3).toFixed(1)}`;
      const setTxt=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
      setTxt('cvx-t-high',liveHigh.toFixed(1)); setTxt('cvx-t-low',liveLow.toFixed(1));
      setTxt('cvx-t-vol',fmtP(liveVol)); setTxt('cvx-t-qvol',fmtP(liveQuoteVol));
      setTxt('cvx-mid',priceStr); setTxt('cvx-op-price',livePrice.toFixed(1));
      if(activeTab==='book' && window._cvxRenderBook) window._cvxRenderBook();
      // Also update desktop price elements
      updateDesktopPrices(isUp, color, priceStr);
    }

    async function updateDesktopPrices(isUp, color, priceStr) {
      // Update main price display
      const priceEl=document.querySelector('.ticker_price__pzh7e .up-color,.ticker_price__pzh7e .down-color');
      if(priceEl){
        priceEl.textContent=priceStr||livePrice.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
        priceEl.className=priceEl.className.replace(/up-color|down-color/,livePct>=0?'up-color':'down-color');
      }
      // Update 24H stats (the arrow_content divs)
      const statDivs=[...document.querySelectorAll('.arrow_content__rBT_Q > div')];
      if(statDivs.length>=4){
        const vals=[
          (livePct>=0?'+':'')+livePct.toFixed(2)+'%',
          liveHigh.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}),
          liveLow.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}),
          fmtP(liveVol)
        ];
        statDivs.forEach((d,i)=>{ const v=d.querySelector('div'); if(v&&vals[i]) v.textContent=vals[i]; });
      }
      // USD sub-price
      const usdEl=document.querySelector('.ticker_price__pzh7e div');
      if(usdEl&&livePrice) usdEl.textContent=livePrice.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' USD';
      // Update mid price row
      const midEl=document.getElementById('midPrice');
      if(midEl&&livePrice) midEl.textContent=livePrice.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
      // Fetch real order book from Binance
      try {
        const depth=await fetch(`https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=15`).then(r=>r.json());
        // Update ask rows (sell orders — red)
        const askCols=document.querySelectorAll('.depthNormal_scrollWindowAsk__hke1X .list_main__zCJtr');
        if(askCols.length&&depth.asks){
          const asks=[...depth.asks].slice(0,askCols.length);
          askCols.forEach((row,i)=>{
            const cells=row.querySelectorAll('.fontScale_sub__PN1Es');
            if(asks[i]&&cells.length>=2){
              cells[0].textContent=Number(asks[i][0]).toFixed(2);
              cells[0].style.color='#f6465d';
              cells[1].textContent=Number(asks[i][1]).toFixed(6);
              if(cells[2]) cells[2].textContent=(Number(asks[i][0])*Number(asks[i][1])).toFixed(6);
            }
          });
        }
        // Update bid rows (buy orders — green, below mid price)
        const allRows=document.querySelectorAll('.list_main__zCJtr');
        const bidRows=[...allRows].filter(r=>!r.closest('.depthNormal_scrollWindowAsk__hke1X'));
        if(bidRows.length&&depth.bids){
          const bids=depth.bids.slice(0,bidRows.length);
          bidRows.forEach((row,i)=>{
            const cells=row.querySelectorAll('.fontScale_sub__PN1Es');
            if(bids[i]&&cells.length>=2){
              cells[0].textContent=Number(bids[i][0]).toFixed(2);
              cells[0].style.color='#2ebd85';
              cells[1].textContent=Number(bids[i][1]).toFixed(6);
              if(cells[2]) cells[2].textContent=(Number(bids[i][0])*Number(bids[i][1])).toFixed(6);
            }
          });
        }
        // Update mid price span in order book
        const midPriceSpans=document.querySelectorAll('.ticker_mid__price, [class*="midPrice"]');
        midPriceSpans.forEach(el=>{ el.textContent=livePrice.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}); });
      } catch(e) {}
    }

    fetchTradeTicker().then(updateMobilePrices);
    setInterval(async()=>{ await fetchTradeTicker(); updateMobilePrices(); }, 2000);
  }

  // ── 17. HIDE BROKEN ELEMENTS ──────────────────────────────────────────────
  function hideBrokenElements() {
    // Hide any element showing garbled "33333..." exchange rate data
    document.querySelectorAll('div, p, span').forEach(el => {
      if (el.dataset.cvxChecked) return;
      el.dataset.cvxChecked = '1';
      const txt = (el.textContent || '').trim();
      // Garbled repeated characters (exchange rate ticker broken)
      if (txt.length > 20 && /^3+$/.test(txt.replace(/[.\s,]/g, ''))) {
        el.style.display = 'none';
      }
    });
  }

  // ── START ─────────────────────────────────────────────────────────────────
  function start() {
    injectMobileCSS();
    fixHeaderLogo(); addHamburger(); addEarthVideo(); wirePairsTabs();
    fixFooter(); fixSecuritySection(); fixSecurityText(); autoSlideCarousel();
    fixAppSection(); hideBrokenElements();
    wireTopNav(); wireWordmarks();
    // If we have cached prices, render instantly — no wait
    if (tickerMap) { applyPrices(); buildMobileMarket(); fixDesktopPairs(); }
    // Always fetch fresh in background and re-render
    loadTicker().then(() => { applyPrices(); buildMobileMarket(); fixDesktopPairs(); });
    wireTrade(); revealImages(); fixTradePage();
    setInterval(() => {
      fixHeaderLogo(); addHamburger(); wireTopNav(); wireWordmarks();
      wireTrade(); revealImages(); wirePairsTabs(); autoSlideCarousel();
      hideBrokenElements(); fixAppSection();
    }, 3000);
    setInterval(async () => { await loadTicker(); applyPrices(); fixDesktopPairs(); }, 5000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
