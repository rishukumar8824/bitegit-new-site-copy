// Bitcovex global connector — runs on EVERY page.
(function () {
  const fmt = (n, d = 2) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const UP = '#2ebd85', DOWN = '#f6465d';

  const NAV = [
    { label: 'Buy Crypto', href: 'market.html', arrow: true },
    { label: 'Markets', href: 'market.html', arrow: false },
    { label: 'Trade', href: 'trade.html', arrow: true },
    { label: 'Futures', href: 'futures_overview.html', arrow: true },
    { label: 'TradFi', href: 'tradfi.html', arrow: true },
    { label: 'Finance', href: 'finance.html', arrow: true },
    { label: 'Activity', href: '#', arrow: true },
    { label: 'Glory of Legends', href: '#', arrow: false },
    { label: 'English / USD', href: '#', arrow: false },
    { label: 'APP Download', href: '#', arrow: false },
  ];
  const NAV_MAP = { 'Markets': 'market.html', 'Trade': 'trade.html', 'Futures': 'futures_overview.html', 'TradFi': 'tradfi.html', 'Finance': 'finance.html', 'Buy Crypto': 'market.html' };

  function wireTopNav() {
    document.querySelectorAll('header a, nav a').forEach((a) => {
      const t = (a.textContent || '').trim();
      const href = a.getAttribute('href');
      if (NAV_MAP[t] && (!href || href === '#' || href === '')) a.setAttribute('href', NAV_MAP[t]);
    });
  }

  // Coin image map for mobile market rows
  const COIN_IMG = {
    BTC: '/cdn/1/currency/33ebcaab-99c9-47e0-a916-c08bada02cac-1774002719227.png',
    BNB: '/cdn/1/currency/11628b76-313d-44a6-a87c-f2cc9e6ac75b-1774002833218.png',
    SOL: '/cdn/1/currency/0f9dbb43-7c86-456a-bcaa-64d5bb61a01e-1774002879582.png',
    ETH: '/cdn/1/currency/65b8e63b-5356-4d33-9cb8-aa19585ffaf0-1774002774151.png',
    XRP: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
    ADA: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
  };
  const SPOT_PAIRS = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA'];

  // Inject one-time CSS for mobile header cleanup and desktop pairs section hide on mobile
  function injectMobileCSS() {
    if (document.getElementById('cvx-mobile-css')) return;

    // Mark the desktop Popular Pairs flex container
    document.querySelectorAll('div').forEach(div => {
      const cls = div.className || '';
      if (cls.includes('justify-between') && cls.includes('max-w-[1200px]') && cls.includes('mx-auto') && cls.includes('gap-5') && !div.id) {
        div.id = 'cvx-desktop-pairs';
      }
    });

    // Mark desktop nav links container (first div inside left-main)
    const leftMain = document.querySelector('[data-nav-left-main="true"]');
    if (leftMain) {
      leftMain.id = 'cvx-nav-left-main';
      const navLinksDiv = leftMain.querySelector('div');
      if (navLinksDiv) navLinksDiv.setAttribute('data-cvx-nav-links', '1');
    }

    // Mark download + globe icon buttons in right box (they have .relative.group class)
    const rightBox = document.querySelector('[data-nav-right-box]');
    if (rightBox) {
      rightBox.querySelectorAll('.relative.group').forEach(el => el.setAttribute('data-cvx-icon-btn', '1'));
      // Also mark the lang-currency-picker (globe icon) which uses a different class
      const langPicker = rightBox.querySelector('.lang-currency-picker');
      if (langPicker) langPicker.setAttribute('data-cvx-icon-btn', '1');
    }

    // Mark the mobile "More >" link that comes from existing HTML (below the desktop pairs / mobile coin rows area)
    // It's a div.mt-4 with text-center containing an <a href="market.html"> with "More" text
    document.querySelectorAll('div').forEach(div => {
      const cls = div.className || '';
      if ((cls.includes('mt-4') || cls.includes('mt-6')) && cls.includes('text-center')) {
        const link = div.querySelector('a[href="market.html"]');
        if (link && /More/.test(link.textContent)) {
          div.setAttribute('data-cvx-html-more', '1');
        }
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

  // Build mobile-only market section (Spot/Futures/TradFi tabs + coin rows from ticker)
  function buildMobileMarket() {
    if (document.getElementById('cvx-mobile-market')) return;
    if (!tickerMap) return;

    // Find insertion point: after the desktop pairs container or its parent
    const desktopPairs = document.getElementById('cvx-desktop-pairs');
    if (!desktopPairs) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'cvx-mobile-market';
    wrapper.style.cssText = 'display:block;padding:0 0 8px;';

    // CSS to hide this on desktop
    const mobileOnlyStyle = document.createElement('style');
    mobileOnlyStyle.textContent = '@media (min-width: 768px) { #cvx-mobile-market { display: none !important; } }';
    document.head.appendChild(mobileOnlyStyle);

    // Tab bar
    const TABS = ['Spot', 'Futures', 'TradFi', 'Volume Ranking >'];
    const tabBar = document.createElement('div');
    tabBar.style.cssText = 'display:flex;gap:0;padding:0 16px;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:0;';

    const rowsDiv = document.createElement('div');
    rowsDiv.style.cssText = 'display:flex;flex-direction:column;';

    let activeTab = 0;
    function renderRows() {
      rowsDiv.innerHTML = '';
      const pairs = SPOT_PAIRS;
      pairs.forEach(sym => {
        const t = tickerMap ? tickerMap[sym + 'USDT'] : null;
        const price = t ? fmt(t.lastPrice, t.lastPrice < 1 ? 4 : 2) : '—';
        const chg = t ? Number(t.change24h) : 0;
        const chgStr = t ? ((chg >= 0 ? '+' : '') + fmt(chg, 2) + '%') : '—';
        const imgSrc = COIN_IMG[sym] || '';

        const COLORS = { BTC:'#F7931A',ETH:'#627EEA',BNB:'#F3BA2F',SOL:'#9945FF',XRP:'#346AA9',ADA:'#0033AD' };
        const iconColor = COLORS[sym] || '#888';
        const iconHtml = imgSrc
          ? `<img src="${imgSrc}" alt="${sym}" style="width:36px;height:36px;border-radius:50%;flex-shrink:0;" onerror="this.style.display='none';this.nextSibling.style.display='flex'">`
            + `<div style="display:none;width:36px;height:36px;border-radius:50%;background:${iconColor};flex-shrink:0;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;">${sym.slice(0,1)}</div>`
          : `<div style="width:36px;height:36px;border-radius:50%;background:${iconColor};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;">${sym.slice(0,1)}</div>`;

        const row = document.createElement('a');
        row.href = 'trade.html';
        row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid rgba(255,255,255,0.06);text-decoration:none;color:inherit;cursor:pointer;min-height:64px;';
        row.innerHTML = `
          <div style="display:flex;align-items:center;gap:12px;min-width:0;">
            ${iconHtml}
            <div style="font-size:15px;font-weight:500;">${sym}USDT</div>
          </div>
          <div style="text-align:right;flex-shrink:0;">
            <div style="font-size:16px;font-weight:500;">${price}</div>
            <div style="font-size:13px;color:${chg >= 0 ? UP : DOWN};margin-top:2px;">${chgStr}</div>
          </div>`;
        rowsDiv.appendChild(row);
      });
      // More link
      const more = document.createElement('a');
      more.href = 'market.html';
      more.textContent = 'More >';
      more.style.cssText = 'display:block;text-align:center;padding:12px;color:rgba(255,255,255,0.5);font-size:14px;text-decoration:none;';
      rowsDiv.appendChild(more);
    }

    TABS.forEach((label, i) => {
      const tab = document.createElement('div');
      tab.textContent = label;
      const setActive = () => {
        activeTab = i;
        tabBar.querySelectorAll('[data-cvxtab]').forEach((t, j) => {
          t.style.color = j === i ? '#fff' : 'rgba(255,255,255,0.4)';
          t.style.fontWeight = j === i ? '700' : '400';
          t.style.borderBottom = j === i ? '2px solid #F0B90B' : '2px solid transparent';
        });
        renderRows();
      };
      tab.setAttribute('data-cvxtab', i);
      tab.style.cssText = 'padding:12px 10px;font-size:15px;cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all 0.2s;color:rgba(255,255,255,0.4);font-weight:500;';
      tab.addEventListener('click', setActive);
      tabBar.appendChild(tab);
      if (i === 0) setTimeout(setActive, 0);
    });

    wrapper.appendChild(tabBar);
    wrapper.appendChild(rowsDiv);
    desktopPairs.parentElement.insertBefore(wrapper, desktopPairs);
  }

  // Create the gem SVG element (two paths only, no text bleed)
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

  // Header: show only the B-gem icon — no text
  function fixHeaderLogo() {
    const logoLink = document.querySelector('header a[href="index.html"]');
    if (!logoLink || logoLink.dataset.cvxLogo) return;
    logoLink.dataset.cvxLogo = '1';
    logoLink.innerHTML = '';
    logoLink.appendChild(makeGemSVG('22', '26'));
  }

  // Hamburger ≡ button + full Bitbase-style slide panel
  function addHamburger() {
    const header = document.querySelector('header');
    if (!header || header.dataset.cvxBurger) return;
    header.dataset.cvxBurger = '1';
    const rightBox = header.querySelector('[data-nav-right-box]');
    if (!rightBox) return;

    const btn = document.createElement('button');
    btn.setAttribute('aria-label', 'Menu');
    btn.innerHTML = '<svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor"><rect width="18" height="2" rx="1"/><rect y="6" width="18" height="2" rx="1"/><rect y="12" width="18" height="2" rx="1"/></svg>';
    btn.style.cssText = 'background:none;border:none;color:currentColor;cursor:pointer;padding:4px 8px;display:flex;align-items:center;margin-left:4px;';

    btn.addEventListener('click', () => {
      const existing = document.getElementById('cvx-mobile-nav');
      if (existing) { existing.remove(); return; }

      const panel = document.createElement('div');
      panel.id = 'cvx-mobile-nav';
      panel.style.cssText = 'position:fixed;inset:0;z-index:10000;background:#161A1E;display:flex;flex-direction:column;overflow-y:auto;font-family:inherit;';

      // Top bar
      const topBar = document.createElement('div');
      topBar.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.1);flex-shrink:0;';
      const logoEl = makeGemSVG('22', '26');
      logoEl.style.color = 'white';
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      closeBtn.style.cssText = 'background:none;border:none;color:#fff;cursor:pointer;padding:4px;display:flex;align-items:center;';
      closeBtn.addEventListener('click', () => panel.remove());
      topBar.appendChild(logoEl); topBar.appendChild(closeBtn);
      panel.appendChild(topBar);

      // Auth buttons
      const authRow = document.createElement('div');
      authRow.style.cssText = 'display:flex;gap:10px;padding:16px;flex-shrink:0;';
      const loginBtn = document.createElement('a');
      loginBtn.href = 'login.html'; loginBtn.textContent = 'Log in';
      loginBtn.style.cssText = 'flex:1;text-align:center;padding:10px;border-radius:6px;background:#2b2f36;color:#fff;text-decoration:none;font-size:15px;font-weight:600;';
      const signupBtn = document.createElement('a');
      signupBtn.href = 'register.html'; signupBtn.textContent = 'Sign up';
      signupBtn.style.cssText = 'flex:1;text-align:center;padding:10px;border-radius:6px;background:#F0B90B;color:#000;text-decoration:none;font-size:15px;font-weight:600;';
      authRow.appendChild(loginBtn); authRow.appendChild(signupBtn);
      panel.appendChild(authRow);

      // Nav links
      const navList = document.createElement('div');
      navList.style.cssText = 'flex:1;padding:0 0 24px;';
      NAV.forEach(({ label, href, arrow }) => {
        const row = document.createElement('a');
        row.href = href;
        row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:16px 20px;color:#fff;text-decoration:none;font-size:16px;font-weight:500;border-bottom:1px solid rgba(255,255,255,0.07);';
        row.innerHTML = label + (arrow ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="opacity:0.4"><path d="M6 12l4-4-4-4"/></svg>' : '');
        row.addEventListener('click', () => panel.remove());
        navList.appendChild(row);
      });
      panel.appendChild(navList);
      document.body.appendChild(panel);
    });

    rightBox.appendChild(btn);
  }

  // Add earth video to "Built on Stability" section
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

    // Desktop: empty span inside a flex-1 div
    section.querySelectorAll('span').forEach(span => {
      if (!span.children.length && !span.textContent.trim()) {
        const p = span.parentElement;
        if (p && /flex-1/.test(p.className) && /opacity/.test(p.className)) {
          span.appendChild(makeVideo('width:100%;height:auto;max-height:580px;object-fit:contain;'));
        }
      }
    });

    // Mobile: empty inner div
    section.querySelectorAll('div > div').forEach(d => {
      if (!d.children.length && !d.textContent.trim()) {
        if (/absolute/.test(d.className) || /absolute/.test((d.parentElement || {}).className || '')) {
          d.appendChild(makeVideo('width:220px;height:220px;object-fit:contain;'));
        }
      }
    });
  }

  // Make pairs tabs (Spot / Futures / TradFi / Volume Ranking) clickable
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

    // Find the rows container (parent section that holds the coin rows)
    const section = tabWrap.closest('section') || tabWrap.closest('[class*="container"]');
    const coinRows = section ? [...section.querySelectorAll('[class*="cursor-pointer"]')].filter(el => /USDT/.test(el.innerText || '')) : [];

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        // Update active tab styling
        tabs.forEach(t => {
          t.style.color = '';
          t.style.borderBottom = '';
          t.style.fontWeight = '';
          const inner = t.querySelector('div');
          if (inner) { inner.style.color = ''; inner.style.fontWeight = ''; }
        });
        tab.style.color = 'var(--text_primary, #fff)';
        tab.style.fontWeight = '700';
        const inner = tab.querySelector('div');
        if (inner) { inner.style.color = 'var(--text_primary, #fff)'; inner.style.fontWeight = '700'; }
      });
    });

    // Activate first tab by default
    if (tabs[0]) tabs[0].click();
  }

  // Replace Bitbase wordmark SVGs (outside header) with Bitcovex text
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

  let tickerMap = null;
  async function loadTicker() {
    try {
      const r = await fetch('/api/p2p/exchange-ticker').then((x) => x.json());
      if (r && r.ticker) { tickerMap = {}; r.ticker.forEach((t) => { tickerMap[t.symbol] = t; }); }
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
          const dollar = el.textContent.trim().startsWith('$') ? '$' : '';
          el.textContent = dollar + fmt(t.lastPrice, t.lastPrice < 1 ? 4 : 2);
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

  // Reveal images stuck at opacity-0 (Bitbase React fade-in replacement)
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
      if (img.complete) { show(); }
      else { img.addEventListener('load', show); img.addEventListener('error', show); }
    });
  }

  // Fix footer mobile layout — desktop uses flex justify-between (horizontal columns)
  // which breaks on mobile. Convert to vertical accordion sections.
  function fixFooter() {
    const footer = document.querySelector('footer');
    if (!footer || footer.dataset.cvxFooter) return;
    footer.dataset.cvxFooter = '1';

    // The main footer flex container
    const flex = footer.querySelector('.flex.w-full.justify-between');
    if (!flex) return;

    // Get all section children: first is logo+social, rest are link columns
    const sections = [...flex.children];
    if (sections.length < 2) return;

    // On mobile: make the container vertical
    const mobileStyle = document.createElement('style');
    mobileStyle.textContent = `
      @media (max-width: 767px) {
        footer .flex.w-full.justify-between { flex-direction: column !important; gap: 0 !important; }
        footer .flex.w-full.justify-between > section:first-child { max-width: 100% !important; margin-bottom: 24px; }
        [data-cvx-footer-links] { display: none; padding: 0 0 8px; }
        [data-cvx-footer-section] { border-bottom: 1px solid rgba(255,255,255,0.1); }
        [data-cvx-footer-title] { display: flex !important; align-items: center; justify-content: space-between; padding: 16px 0; cursor: pointer; font-size: 15px; font-weight: 500; }
        [data-cvx-footer-title] svg { flex-shrink: 0; transition: transform 0.2s; }
        [data-cvx-footer-title].open svg { transform: rotate(180deg); }
      }
    `;
    document.head.appendChild(mobileStyle);

    // Wire accordion click for each nav section (skip first = logo section)
    sections.slice(1).forEach(sec => {
      sec.setAttribute('data-cvx-footer-section', '1');
      const titleEl = sec.querySelector('p, h3, h4, div.font-semibold, div.font-medium, div.text-sm, div:first-child');
      if (!titleEl) return;
      titleEl.setAttribute('data-cvx-footer-title', '1');
      titleEl.insertAdjacentHTML('beforeend', '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 6l4 4 4-4"/></svg>');

      // Wrap all links in a collapsible div
      const linksWrap = document.createElement('div');
      linksWrap.setAttribute('data-cvx-footer-links', '1');
      const links = [...sec.children].slice(1);
      links.forEach(l => linksWrap.appendChild(l));
      sec.appendChild(linksWrap);

      titleEl.addEventListener('click', () => {
        const isOpen = linksWrap.style.display === 'block';
        linksWrap.style.display = isOpen ? 'none' : 'block';
        titleEl.classList.toggle('open', !isOpen);
      });
    });

    // Replace Bitbase SVG wordmark in footer logo with gem icon + "Bitcovex" text
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

  // Fix security section — make shield_v2.webp visible like Bitbase
  function fixSecuritySection() {
    if (document.getElementById('cvx-security-done')) return;
    const h2 = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Your Assets'));
    if (!h2) return;
    const sec = h2.closest('section') || h2.parentElement;
    if (!sec) return;

    // Fix the desktop shield: the img src=shield_v2.webp exists but its wrapping
    // span.inline-block.overflow-hidden has no dimensions (React managed them).
    // We fix every img in this section that points to shield_v2 or security_v7.
    sec.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src') || '';
      if (!src.includes('shield') && !src.includes('security')) return;

      // Make img visible & properly sized
      img.classList.remove('opacity-0');
      img.classList.add('opacity-100');
      img.style.cssText = 'width:100%;height:auto;object-fit:contain;display:block;opacity:1;';

      // Fix every ancestor span/div with overflow:hidden up to the section
      let el = img.parentElement;
      while (el && el !== sec) {
        const cs = getComputedStyle(el);
        if (cs.overflow === 'hidden' || /overflow-hidden/.test(el.className || '')) {
          el.style.overflow = 'visible';
        }
        if (el.tagName === 'SPAN' && cs.display === 'inline-block') {
          el.style.cssText = (el.style.cssText || '') + ';display:block!important;width:100%;';
        }
        // Hide the loading skeleton inside this ancestor
        const skeleton = el.querySelector('.animate-pulse');
        if (skeleton) skeleton.style.display = 'none';
        const absOverlay = el.querySelector('span.absolute');
        if (absOverlay && absOverlay !== img.parentElement) absOverlay.style.display = 'none';
        el = el.parentElement;
      }

      // The absolute wrapper div needs height too
      const absDiv = img.closest('div[class*="absolute"]');
      if (absDiv) absDiv.style.cssText = (absDiv.style.cssText || '') + ';height:100%;';
    });

    // Nuclear fallback: inject a fresh absolutely-positioned shield image directly in the section
    // This shows regardless of broken span/div structure
    if (!document.getElementById('cvx-shield-inject')) {
      const rightCol = [...sec.querySelectorAll('div')].find(d =>
        /shrink-0/.test(d.className || '') && /w-\[320px\]/.test(d.className || '')
      );
      const target = rightCol;
      if (target) {
        target.style.cssText = (target.style.cssText||'') + ';position:relative;overflow:visible;';
        // Clear broken children and inject fresh img
        const freshImg = document.createElement('img');
        freshImg.id = 'cvx-shield-inject';
        freshImg.src = '/cdn/imgs/index-web/home/shield_v2.webp';
        freshImg.alt = 'Security Shield';
        freshImg.style.cssText = 'width:100%;height:auto;object-fit:contain;display:block;position:relative;z-index:1;';
        target.insertBefore(freshImg, target.firstChild);
      }
    }

    const marker = document.createElement('span');
    marker.id = 'cvx-security-done';
    marker.style.display = 'none';
    document.body.appendChild(marker);
  }

  // Auto-slide promo banner carousel right-to-left (like Bitbase)
  function autoSlideCarousel() {
    if (document.getElementById('cvx-carousel-done')) return;

    // Find all overflow-hidden containers that wrap a horizontal flex of multiple children
    const candidates = [...document.querySelectorAll('div')].filter(div => {
      const cs = getComputedStyle(div);
      if (cs.overflow !== 'hidden' && !/(overflow-hidden)/.test(div.className || '')) return false;
      const inner = div.firstElementChild;
      if (!inner) return false;
      const ics = getComputedStyle(inner);
      return (ics.display === 'flex' || /\bflex\b/.test(inner.className || '')) && inner.children.length >= 2;
    });

    candidates.forEach(container => {
      const track = container.firstElementChild;
      const slides = [...track.children];
      if (slides.length < 2) return;

      // Already wired?
      if (container.dataset.cvxCarousel) return;
      container.dataset.cvxCarousel = '1';

      // Make sure track has transition
      track.style.transition = 'transform 0.5s ease';
      track.style.willChange = 'transform';

      let current = 0;
      const total = slides.length;

      // Find dot indicators if any (siblings of container)
      const parent = container.parentElement;
      const dots = parent ? [...parent.querySelectorAll('[class*="rounded-full"], [class*="dot"]')].filter(d => {
        const r = d.getBoundingClientRect();
        return r.width <= 12 && r.height <= 12;
      }) : [];

      const goTo = (idx) => {
        current = (idx + total) % total;
        track.style.transform = `translateX(-${current * (100 / total)}%)`;
        // Update dots if found
        dots.forEach((dot, i) => {
          dot.style.opacity = i === current ? '1' : '0.4';
          dot.style.transform = i === current ? 'scaleX(2.5)' : 'scaleX(1)';
        });
      };

      // Set initial dot state
      goTo(0);

      // Auto-advance every 3 seconds
      setInterval(() => goTo(current + 1), 3000);
    });

    const marker = document.createElement('span');
    marker.id = 'cvx-carousel-done';
    marker.style.display = 'none';
    document.body.appendChild(marker);
  }

  function start() {
    injectMobileCSS();
    fixHeaderLogo(); addHamburger(); addEarthVideo(); wirePairsTabs();
    fixFooter(); fixSecuritySection(); autoSlideCarousel();
    wireTopNav(); wireWordmarks();
    loadTicker().then(() => { applyPrices(); buildMobileMarket(); });
    wireTrade(); revealImages();
    setInterval(() => { fixHeaderLogo(); addHamburger(); wireTopNav(); wireWordmarks(); wireTrade(); revealImages(); wirePairsTabs(); autoSlideCarousel(); }, 3000);
    setInterval(async () => { await loadTicker(); applyPrices(); }, 5000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
