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

  const COIN_IMG = {
    BTC: '/cdn/1/currency/33ebcaab-99c9-47e0-a916-c08bada02cac-1774002719227.png',
    BNB: '/cdn/1/currency/11628b76-313d-44a6-a87c-f2cc9e6ac75b-1774002833218.png',
    SOL: '/cdn/1/currency/0f9dbb43-7c86-456a-bcaa-64d5bb61a01e-1774002879582.png',
    ETH: '/cdn/1/currency/65b8e63b-5356-4d33-9cb8-aa19585ffaf0-1774002774151.png',
    XRP: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
    ADA: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
  };
  const SPOT_PAIRS = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'ADA'];
  const COIN_COLORS = { BTC:'#F7931A',ETH:'#627EEA',BNB:'#F3BA2F',SOL:'#9945FF',XRP:'#346AA9',ADA:'#0033AD' };
  const COIN_NAME = { BTC:'Bitcoin',ETH:'Ethereum',BNB:'BNB',SOL:'Solana',XRP:'XRP',ADA:'Cardano' };

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
  function buildMobileMarket() {
    if (document.getElementById('cvx-mobile-market')) return;
    if (!tickerMap) return;
    const desktopPairs = document.getElementById('cvx-desktop-pairs');
    if (!desktopPairs) return;

    const wrapper = document.createElement('div');
    wrapper.id = 'cvx-mobile-market';
    wrapper.style.cssText = 'display:block;padding:0 0 8px;';

    const mobileOnlyStyle = document.createElement('style');
    mobileOnlyStyle.textContent = '@media (min-width: 768px) { #cvx-mobile-market { display: none !important; } }';
    document.head.appendChild(mobileOnlyStyle);

    // Main tabs
    const TABS = ['Spot', 'Futures', 'TradFi', 'Volume Ranking >'];
    const tabBar = document.createElement('div');
    tabBar.style.cssText = 'display:flex;gap:0;padding:0 16px;overflow-x:auto;scrollbar-width:none;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:0;';

    // Spot / Futures pill sub-tabs (like Bitbase — selected = dark pill)
    const subTabBar = document.createElement('div');
    subTabBar.style.cssText = 'display:flex;gap:6px;padding:8px 16px 6px;';
    ['Spot', 'Futures'].forEach((label, i) => {
      const st = document.createElement('div');
      st.textContent = label;
      const active = 'padding:4px 14px;border-radius:20px;font-size:13px;cursor:pointer;background:rgba(0,0,0,0.45);color:#fff;font-weight:600;border:1px solid rgba(255,255,255,0.08);';
      const inactive = 'padding:4px 14px;border-radius:20px;font-size:13px;cursor:pointer;background:transparent;color:rgba(255,255,255,0.4);font-weight:400;border:1px solid transparent;';
      st.style.cssText = i === 1 ? active : inactive;
      st.addEventListener('click', () => {
        subTabBar.querySelectorAll('div').forEach((el, j) => {
          el.style.cssText = (j === i) ? active : inactive;
        });
      });
      subTabBar.appendChild(st);
    });

    const rowsDiv = document.createElement('div');
    rowsDiv.style.cssText = 'display:flex;flex-direction:column;';

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
      SPOT_PAIRS.forEach(sym => {
        const t = tickerMap ? tickerMap[sym + 'USDT'] : null;
        const price = t ? fmt(t.lastPrice, t.lastPrice < 1 ? 4 : 2) : '—';
        const chg = t ? Number(t.change24h) : 0;
        const chgStr = t ? ((chg >= 0 ? '+' : '') + fmt(chg, 2) + '%') : '—';
        const vol = fmtVol(t ? (t.quoteVolume || 0) : 0);

        const row = document.createElement('a');
        row.href = 'trade.html';
        row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:9px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-decoration:none;color:inherit;cursor:pointer;min-height:48px;';

        row.appendChild(makeIcon(sym));

        // Col 1: pair name only (flex:1)
        const nameCol = document.createElement('div');
        nameCol.style.cssText = 'flex:1;min-width:0;padding-left:2px;';
        nameCol.innerHTML = `<div style="font-size:13.5px;font-weight:500;line-height:1.2;letter-spacing:0.01em;">${sym}USDT</div>`;
        row.appendChild(nameCol);

        // Col 2: volume (center, fixed width)
        const volCol = document.createElement('div');
        volCol.style.cssText = 'width:80px;text-align:left;flex-shrink:0;';
        volCol.innerHTML = `<div style="font-size:12px;color:rgba(255,255,255,0.45);">${vol}</div>`;
        row.appendChild(volCol);

        // Col 3: price + change% (right)
        const priceCol = document.createElement('div');
        priceCol.style.cssText = 'text-align:right;flex-shrink:0;min-width:70px;';
        priceCol.innerHTML = `<div style="font-size:13.5px;font-weight:500;">${price}</div>
          <div style="font-size:12px;color:${chg >= 0 ? UP : DOWN};margin-top:1px;">${chgStr}</div>`;
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
          t.style.color = j === i ? '#fff' : 'rgba(255,255,255,0.4)';
          t.style.fontWeight = j === i ? '700' : '400';
          t.style.borderBottom = j === i ? '2px solid #F0B90B' : '2px solid transparent';
        });
        renderRows();
      };
      tab.setAttribute('data-cvxtab', i);
      tab.style.cssText = 'padding:10px 10px;font-size:14px;cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all 0.2s;color:rgba(255,255,255,0.4);font-weight:500;';
      tab.addEventListener('click', setActive);
      tabBar.appendChild(tab);
      if (i === 0) setTimeout(setActive, 0);
    });

    wrapper.appendChild(tabBar);
    wrapper.appendChild(subTabBar);
    wrapper.appendChild(rowsDiv);
    desktopPairs.parentElement.insertBefore(wrapper, desktopPairs);
  }

  // ── 4. DESKTOP PAIRS — hide unsupported pairs (DOT/HBAR/LINK/XLM) ─────────
  function fixDesktopPairs() {
    if (document.getElementById('cvx-dp-fixed')) return;
    const dp = document.getElementById('cvx-desktop-pairs');
    if (!dp) return;
    const UNSUPPORTED = ['DOT', 'HBAR', 'LINK', 'XLM'];
    dp.querySelectorAll('div, a').forEach(el => {
      const txt = el.textContent || '';
      if (UNSUPPORTED.some(s => new RegExp('\\b' + s + '\\b').test(txt))) {
        const parent = el.parentElement;
        if (parent && parent !== dp) {
          const isSelf = UNSUPPORTED.some(s => new RegExp('\\b' + s + '\\b').test(el.className || ''));
          if (txt.length < 200 && txt.includes('USDT')) {
            el.style.display = 'none';
          }
        }
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
    if (!logoLink || logoLink.dataset.cvxLogo) return;
    logoLink.dataset.cvxLogo = '1';
    logoLink.innerHTML = '';
    logoLink.appendChild(makeGemSVG('22', '26'));
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
    btn.innerHTML = '<svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor"><rect width="18" height="2" rx="1"/><rect y="6" width="18" height="2" rx="1"/><rect y="12" width="18" height="2" rx="1"/></svg>';
    btn.style.cssText = 'background:none;border:none;color:currentColor;cursor:pointer;padding:4px 8px;display:flex;align-items:center;margin-left:4px;';

    btn.addEventListener('click', () => {
      const existing = document.getElementById('cvx-mobile-nav');
      if (existing) { existing.remove(); return; }

      const panel = document.createElement('div');
      panel.id = 'cvx-mobile-nav';
      panel.style.cssText = 'position:fixed;inset:0;z-index:10000;background:#161A1E;display:flex;flex-direction:column;overflow-y:auto;font-family:inherit;';

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

    sections.slice(1).forEach(sec => {
      sec.setAttribute('data-cvx-footer-section', '1');
      const titleEl = sec.querySelector('p, h3, h4, div.font-semibold, div.font-medium, div.text-sm, div:first-child');
      if (!titleEl) return;
      titleEl.setAttribute('data-cvx-footer-title', '1');
      titleEl.insertAdjacentHTML('beforeend', '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 6l4 4 4-4"/></svg>');

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

  // ── 15. SECURITY SHIELD ───────────────────────────────────────────────────
  function fixSecuritySection() {
    if (document.getElementById('cvx-security-done')) return;
    const h2 = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Your Assets'));
    if (!h2) return;
    const sec = h2.closest('section') || h2.parentElement;
    if (!sec) return;

    const isMobile = window.innerWidth <= 767;

    if (!isMobile) {
      // ── DESKTOP: text+bullets LEFT, big shield RIGHT (like Bitbase) ──
      sec.style.setProperty('overflow','visible','important');

      // Find flex row: the div that is direct/near parent of BOTH the h2 col and the shrink-0 col
      let flexRow = [...sec.querySelectorAll('div')].find(d => {
        const ch = [...d.children];
        return ch.length >= 2 && ch.some(c => c.contains(h2)) && ch.some(c => /shrink-0/.test(c.className||''));
      });
      // Fallback: find any flex div with 2+ children that contains h2
      if (!flexRow) flexRow = [...sec.querySelectorAll('div')].find(d =>
        d.children.length >= 2 && d.contains(h2)
      );
      if (!flexRow) flexRow = sec;

      flexRow.style.setProperty('display','flex','important');
      flexRow.style.setProperty('flex-direction','row','important');
      flexRow.style.setProperty('align-items','center','important');
      flexRow.style.setProperty('justify-content','space-between','important');
      flexRow.style.setProperty('gap','60px','important');
      flexRow.style.setProperty('padding','60px 40px','important');
      flexRow.style.setProperty('max-width','1200px','important');
      flexRow.style.setProperty('margin','0 auto','important');
      flexRow.style.setProperty('overflow','visible','important');

      // Left col = child containing h2
      const leftCol = [...flexRow.children].find(c => c.contains(h2));
      if (leftCol) {
        leftCol.style.setProperty('flex','1','important');
        leftCol.style.setProperty('min-width','0','important');
        leftCol.style.setProperty('overflow','visible','important');
      }

      // Right col = shrink-0 div (priority) or last child not containing h2
      let rightCol = [...flexRow.children].find(c => /shrink-0/.test(c.className||''));
      if (!rightCol) rightCol = [...flexRow.children].reverse().find(c => !c.contains(h2));

      if (rightCol) {
        rightCol.style.setProperty('display','flex','important');
        rightCol.style.setProperty('flex-shrink','0','important');
        rightCol.style.setProperty('width','440px','important');
        rightCol.style.setProperty('align-items','center','important');
        rightCol.style.setProperty('justify-content','center','important');
        rightCol.style.setProperty('overflow','visible','important');
        rightCol.style.setProperty('transform','none','important');
        rightCol.innerHTML = '<img src="/cdn/imgs/index-web/home/shield_mobile.jpg" alt="Security Shield" style="width:440px;height:auto;display:block;object-fit:contain;">';
      }

    } else {
      // ── MOBILE: hide right col, inject shield above bullets ──
      // Hide every shrink-0 div (right col)
      [...sec.querySelectorAll('div')].forEach(d => {
        if (/shrink-0/.test(d.className || '')) d.setProperty ? d.style.setProperty('display','none','important') : (d.style.display = 'none');
      });
      sec.querySelectorAll('img').forEach(img => img.style.setProperty('display','none','important'));

      // Fix section padding
      sec.style.setProperty('padding-top','28px','important');
      sec.style.setProperty('padding-bottom','28px','important');
      sec.style.setProperty('min-height','0','important');
      sec.style.setProperty('height','auto','important');

      // Find and fix the flex row container (parent of left+right cols)
      const flexRow = [...sec.querySelectorAll('div')].find(d => {
        const ch = [...d.children];
        return ch.length >= 2 && ch.some(c => /shrink-0/.test(c.className||'')) && ch.some(c => c.contains(h2));
      });
      if (flexRow) {
        flexRow.style.setProperty('display','flex','important');
        flexRow.style.setProperty('flex-direction','column','important');
        flexRow.style.setProperty('align-items','flex-start','important');
        flexRow.style.setProperty('height','auto','important');
        flexRow.style.setProperty('min-height','0','important');
        flexRow.style.setProperty('gap','0','important');
        flexRow.style.setProperty('padding','0','important');
      }

      // Zero ALL padding/margin/gap/height inside section
      sec.querySelectorAll('*').forEach(el => {
        const cs = window.getComputedStyle(el);
        if (parseFloat(cs.paddingTop) > 8)   el.style.setProperty('padding-top','0','important');
        if (parseFloat(cs.paddingBottom) > 8) el.style.setProperty('padding-bottom','0','important');
        if (parseFloat(cs.marginTop) > 4)     el.style.setProperty('margin-top','0','important');
        if (parseFloat(cs.marginBottom) > 8)  el.style.setProperty('margin-bottom','4px','important');
        const g = parseFloat(cs.rowGap || cs.gap || 0);
        if (g > 4) { el.style.setProperty('row-gap','0','important'); el.style.setProperty('gap','0','important'); }
        el.style.setProperty('min-height','0','important');
        el.style.setProperty('height','auto','important');
      });

      if (!document.getElementById('cvx-mobile-shield')) {
        const wrap = document.createElement('div');
        wrap.style.cssText = 'width:100%;display:flex;justify-content:center;padding:12px 0 8px;';
        const shieldImg = document.createElement('img');
        shieldImg.id = 'cvx-mobile-shield';
        shieldImg.src = '/cdn/imgs/index-web/home/shield_mobile.jpg';
        shieldImg.alt = 'Security Shield';
        shieldImg.style.cssText = 'display:block;width:240px;height:auto;border-radius:6px;';
        wrap.appendChild(shieldImg);

        // Strategy: insert shield after subtitle p, then MOVE ul directly after shield
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

        // Move ul to be DIRECTLY after wrap (close the gap below shield)
        if (ul) {
          ul.style.setProperty('margin-top','8px','important');
          wrap.parentNode.insertBefore(ul, wrap.nextSibling);
        }
      }
    }

    const marker = document.createElement('span');
    marker.id = 'cvx-security-done';
    marker.dataset.mode = isMobile ? 'mobile' : 'desktop';
    marker.style.display = 'none';
    document.body.appendChild(marker);
  }

  // Re-run security fix on resize (desktop↔mobile switch)
  let _secResizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(_secResizeTimer);
    _secResizeTimer = setTimeout(() => {
      const marker = document.getElementById('cvx-security-done');
      const prevMode = marker ? marker.dataset.mode : null;
      const curMode = window.innerWidth <= 767 ? 'mobile' : 'desktop';
      if (prevMode !== curMode) {
        // Mode changed — reset and re-run
        if (marker) marker.remove();
        const mobileShield = document.getElementById('cvx-mobile-shield');
        if (mobileShield) mobileShield.parentElement.remove();
        fixSecuritySection();
      }
    }, 200);
  });

  // ── 16. CAROUSEL AUTO-SLIDE ───────────────────────────────────────────────
  function autoSlideCarousel() {
    if (document.getElementById('cvx-carousel-done')) return;

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
    addMobileAppBanner();
    fixHeaderLogo(); addHamburger(); addEarthVideo(); wirePairsTabs();
    fixFooter(); fixSecuritySection(); fixSecurityText(); autoSlideCarousel();
    fixAppSection(); hideBrokenElements();
    wireTopNav(); wireWordmarks();
    loadTicker().then(() => { applyPrices(); buildMobileMarket(); fixDesktopPairs(); });
    wireTrade(); revealImages();
    setInterval(() => {
      fixHeaderLogo(); addHamburger(); wireTopNav(); wireWordmarks();
      wireTrade(); revealImages(); wirePairsTabs(); autoSlideCarousel();
      hideBrokenElements(); fixAppSection();
    }, 3000);
    setInterval(async () => { await loadTicker(); applyPrices(); }, 5000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
