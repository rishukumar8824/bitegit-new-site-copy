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

  // Inject one-time CSS for mobile header cleanup (hide Login, separators, download/globe on mobile)
  function injectMobileCSS() {
    if (document.getElementById('cvx-mobile-css')) return;
    const s = document.createElement('style');
    s.id = 'cvx-mobile-css';
    s.textContent = `
      @media (max-width: 767px) {
        [data-nav-right-box] [role="separator"] { display: none !important; }
        header a[href="login.html"] { display: none !important; }
        [data-nav-right-box] .relative.group { display: none !important; }
      }
    `;
    document.head.appendChild(s);
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

  function start() {
    injectMobileCSS();
    fixHeaderLogo(); addHamburger(); addEarthVideo(); wirePairsTabs();
    wireTopNav(); wireWordmarks(); loadTicker().then(() => { applyPrices(); });
    wireTrade(); revealImages();
    setInterval(() => { fixHeaderLogo(); addHamburger(); wireTopNav(); wireWordmarks(); wireTrade(); revealImages(); wirePairsTabs(); }, 3000);
    setInterval(async () => { await loadTicker(); applyPrices(); }, 5000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
