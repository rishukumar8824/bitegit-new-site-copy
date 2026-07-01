// Bitcovex global connector — runs on EVERY page.
(function () {
  // Route API calls to dedicated Bitcovex backend
  const API_BASE = 'https://bitcovex-backend.onrender.com';

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
    BTC:  '/cdn/1/currency/33ebcaab-99c9-47e0-a916-c08bada02cac-1774002719227.png',
    ETH:  '/cdn/1/currency/65b8e63b-5356-4d33-9cb8-aa19585ffaf0-1774002774151.png',
    SOL:  '/cdn/1/currency/0f9dbb43-7c86-456a-bcaa-64d5bb61a01e-1774002879582.png',
    HYPE: 'https://s2.coinmarketcap.com/static/img/coins/64x64/32196.png',
    XAU:  'https://s2.coinmarketcap.com/static/img/coins/64x64/4705.png',
  };
  const SPOT_PAIRS = ['BTC', 'ETH', 'SOL', 'HYPE', 'XAU'];
  const COIN_COLORS = { BTC:'#F7931A', ETH:'#627EEA', SOL:'#9945FF', HYPE:'#4FAAFF', XAU:'#E5C55A' };
  const COIN_NAME = { BTC:'Bitcoin', ETH:'Ethereum', SOL:'Solana', HYPE:'Hyperliquid', XAU:'Gold' };

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
        const chgColor = chg >= 0 ? UP : DOWN;

        const row = document.createElement('a');
        row.href = 'trade.html';
        row.style.cssText = 'display:flex;align-items:center;gap:0;padding:10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);text-decoration:none;color:inherit;cursor:pointer;min-height:60px;';

        row.appendChild(makeIcon(sym));

        // Col 1: pair name (flex:1, truncate)
        const nameCol = document.createElement('div');
        nameCol.style.cssText = 'flex:1;min-width:0;overflow:hidden;padding-left:8px;';
        nameCol.innerHTML = `<div style="font-size:15px;font-weight:600;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${sym}USDT</div>`;
        row.appendChild(nameCol);

        // Col 2: volume
        const volCol = document.createElement('div');
        volCol.style.cssText = 'width:82px;text-align:left;flex-shrink:0;padding-left:4px;';
        volCol.innerHTML = `<div style="font-size:11.5px;color:rgba(255,255,255,0.4);white-space:nowrap;">${vol}</div>`;
        row.appendChild(volCol);

        // Col 3: price + change%
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
  async function fixDesktopPairs() {
    if (document.getElementById('cvx-dp-fixed')) return;
    if (window.innerWidth <= 767) return;
    const dp = document.getElementById('cvx-desktop-pairs');
    if (!dp) return;

    // Fetch live data for all pairs from Binance
    const SPOT_SYMS = ['BTCUSDT','BNBUSDT','SOLUSDT','ETHUSDT','DOGEUSDT','XRPUSDT','ADAUSDT','AVAXUSDT'];
    const VOL_SYMS  = ['BTCUSDT','ETHUSDT','SOLUSDT','HYPEUSDT','XAUUSDT','BNBUSDT','DOGEUSDT','XRPUSDT'];
    const ALL_SYMS  = [...new Set([...SPOT_SYMS, ...VOL_SYMS])];

    let tdata = {};
    try {
      const url = 'https://api.binance.com/api/v3/ticker/24hr?symbols=' + encodeURIComponent(JSON.stringify(ALL_SYMS));
      const res = await fetch(url).then(r => r.json());
      res.forEach(t => { tdata[t.symbol] = t; });
    } catch(e) {}

    // Also fetch top gainers (all tickers, get top by %)
    let gainers = [], newListings = [];
    try {
      const all = await fetch('https://api.binance.com/api/v3/ticker/24hr').then(r => r.json());
      const usdt = all.filter(t => t.symbol.endsWith('USDT') && Number(t.lastPrice) > 0 && Number(t.quoteVolume) > 500000);
      gainers = [...usdt].sort((a,b) => Number(b.priceChangePercent) - Number(a.priceChangePercent)).slice(0, 4);
      newListings = ['BCHUSDT','CROUSDT','CCUSDT'].map(s => usdt.find(t => t.symbol === s)).filter(Boolean);
      if (newListings.length < 3) newListings = usdt.filter(t => !SPOT_SYMS.includes(t.symbol)).slice(0, 3);
    } catch(e) {}

    const COIN_ICONS = {
      BTC:'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
      ETH:'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
      BNB:'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
      SOL:'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
      DOGE:'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
      XRP:'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
      ADA:'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
      AVAX:'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
      HYPE:'https://s2.coinmarketcap.com/static/img/coins/64x64/32196.png',
      XAU:'https://s2.coinmarketcap.com/static/img/coins/64x64/4705.png',
    };
    const coinIcon = (sym) => {
      const base = sym.replace('USDT','');
      return COIN_ICONS[base] || `https://s2.coinmarketcap.com/static/img/coins/64x64/1.png`;
    };
    const fmtP = (v) => {
      const n = Number(v);
      if (n >= 1e9) return (n/1e9).toFixed(2)+'B';
      if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
      if (n >= 1e3) return (n/1e3).toFixed(2)+'K';
      return n.toFixed(2);
    };
    const fmtPrice = (v) => {
      const n = Number(v);
      if (n >= 1000) return '$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
      if (n >= 1) return '$'+n.toFixed(4);
      return '$'+n.toFixed(6);
    };
    const sparkSVG = (up) => {
      const color = up ? '#2ebd85' : '#f6465d';
      const pts = Array.from({length:10},(_,i)=>i*8+4);
      const ys = pts.map(()=> 8 + Math.random()*12);
      const d = pts.map((x,i)=>`${i===0?'M':'L'}${x},${ys[i]}`).join(' ');
      return `<svg width="80" height="28" viewBox="0 0 80 28"><path d="${d}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    };
    const rowHTML = (sym, vol, showVol) => {
      const t = tdata[sym] || {};
      const price = fmtPrice(t.lastPrice || 0);
      const chg = Number(t.priceChangePercent || 0);
      const up = chg >= 0;
      const base = sym.replace('USDT','');
      const volStr = showVol ? fmtP(t.quoteVolume || 0) : '';
      return `<a href="trade.html" style="display:flex;align-items:center;gap:0;padding:10px 20px 10px 24px;border-bottom:1px solid rgba(255,255,255,0.05);text-decoration:none;color:inherit;cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background=''">
        <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">
          <img src="${coinIcon(sym)}" width="28" height="28" style="border-radius:50%;flex-shrink:0;" onerror="this.style.display='none'"/>
          <span style="font-size:14px;font-weight:600;">${base}<span style="color:rgba(255,255,255,0.4);font-weight:400;">/USDT</span></span>
        </div>
        ${showVol ? `<div style="width:90px;text-align:right;font-size:13px;color:rgba(255,255,255,0.4);">${volStr}</div>` : ''}
        <div style="min-width:110px;text-align:right;">
          <div style="font-size:14px;font-weight:600;">${price}</div>
          <div style="font-size:12px;color:${up?'#2ebd85':'#f6465d'}">${up?'+':''}${chg.toFixed(2)}%</div>
        </div>
        <div style="width:88px;display:flex;justify-content:center;">${sparkSVG(up)}</div>
        <div style="margin-left:8px;"><button onclick="location.href='trade.html'" style="background:#2b2f36;border:none;color:#fff;padding:6px 16px;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;">Trade</button></div>
      </a>`;
    };
    const gainerRow = (t) => {
      if (!t) return '';
      const chg = Number(t.priceChangePercent||0);
      const up = chg >= 0;
      const base = t.symbol.replace('USDT','');
      return `<div style="display:flex;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
        <img src="${coinIcon(t.symbol)}" width="24" height="24" style="border-radius:50%;flex-shrink:0;margin-right:10px;" onerror="this.style.display='none'"/>
        <span style="flex:1;font-size:13px;font-weight:500;">${base}/USDT</span>
        <div style="text-align:right;">
          <div style="font-size:13px;font-weight:600;">${fmtPrice(t.lastPrice)}</div>
          <div style="font-size:12px;color:${up?'#2ebd85':'#f6465d'}">${up?'+':''}${chg.toFixed(2)}%</div>
        </div>
      </div>`;
    };

    const TABS = ['Spot','Futures','TradFi','Volume Ranking'];
    let activeTab = 'Spot';

    const renderLeft = (tab) => {
      const syms = (tab === 'Volume Ranking') ? VOL_SYMS : SPOT_SYMS;
      const showVol = tab === 'Volume Ranking';
      return syms.map(s => rowHTML(s, null, showVol)).join('');
    };

    dp.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:20px;max-width:1200px;margin:0 auto;align-items:flex-start;">
        <!-- LEFT: Popular Pairs -->
        <div style="background:rgba(19,21,22,0.5);border-radius:20px;overflow:hidden;padding:16px 0 20px;width:798px;flex-shrink:0;">
          <div id="cvx-market-tabs" style="display:flex;gap:4px;padding:0 24px;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:0;">
            ${TABS.map(t=>`<div data-tab="${t}" style="padding:10px 12px;cursor:pointer;font-size:14px;font-weight:${t===activeTab?'600':'400'};color:${t===activeTab?'#fff':'rgba(255,255,255,0.45)'};border-bottom:${t===activeTab?'2px solid #F0B90B':'2px solid transparent'};margin-bottom:-1px;white-space:nowrap;transition:color 0.15s;">${t}</div>`).join('')}
          </div>
          <div id="cvx-vol-subtabs" style="display:none;gap:6px;padding:8px 24px 4px;"></div>
          <div id="cvx-pairs-body">${renderLeft('Spot')}</div>
        </div>
        <!-- RIGHT: Gainers + New Listings -->
        <div style="flex:1;display:flex;flex-direction:column;gap:16px;min-width:0;">
          <!-- Futures Gainers -->
          <div style="background:rgba(19,21,22,0.5);border-radius:20px;padding:16px 20px;">
            <div style="display:flex;gap:16px;margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:8px;">
              <span style="font-size:14px;font-weight:600;color:#fff;">Futures Gainers</span>
              <span style="font-size:14px;color:rgba(255,255,255,0.4);">Spot Gainers</span>
            </div>
            <div>${gainers.map(t=>gainerRow(t)).join('') || '<div style="padding:20px;color:rgba(255,255,255,0.3);font-size:13px;">Loading...</div>'}</div>
          </div>
          <!-- New Listings -->
          <div style="background:rgba(19,21,22,0.5);border-radius:20px;padding:16px 20px;">
            <div style="font-size:14px;font-weight:600;color:#fff;margin-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:8px;">New Listings</div>
            <div>${newListings.map(t=>gainerRow(t)).join('') || '<div style="padding:20px;color:rgba(255,255,255,0.3);font-size:13px;">Loading...</div>'}</div>
          </div>
        </div>
      </div>`;

    // Tab click handlers
    dp.querySelectorAll('[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        dp.querySelectorAll('[data-tab]').forEach(t => {
          const active = t.dataset.tab === activeTab;
          t.style.fontWeight = active ? '600' : '400';
          t.style.color = active ? '#fff' : 'rgba(255,255,255,0.45)';
          t.style.borderBottom = active ? '2px solid #F0B90B' : '2px solid transparent';
        });
        document.getElementById('cvx-pairs-body').innerHTML = renderLeft(activeTab);
        document.getElementById('cvx-vol-subtabs').style.display = activeTab === 'Volume Ranking' ? 'flex' : 'none';
      });
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
    // Try backend first
    try {
      const r = await fetch(API_BASE + '/api/p2p/exchange-ticker').then((x) => x.json());
      if (r && r.ticker && r.source !== 'fallback') {
        tickerMap = {};
        r.ticker.forEach((t) => { tickerMap[t.symbol] = t; });
        return;
      }
    } catch (e) {}
    // Backend fallback or error → fetch directly from Binance for live prices
    try {
      const syms = SPOT_PAIRS.map(s => s + 'USDT');
      const url = 'https://api.binance.com/api/v3/ticker/24hr?symbols=' + encodeURIComponent(JSON.stringify(syms));
      const data = await fetch(url).then(x => x.json());
      if (Array.isArray(data) && data.length) {
        tickerMap = {};
        data.forEach(item => {
          tickerMap[item.symbol] = {
            symbol: item.symbol,
            lastPrice: Number(item.lastPrice),
            change24h: Number(item.priceChangePercent),
            quoteVolume: Number(item.quoteVolume)
          };
        });
        return;
      }
    } catch (e) {}
    // Last resort: use backend fallback data
    try {
      const r = await fetch(API_BASE + '/api/p2p/exchange-ticker').then((x) => x.json());
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
    const onTrade = /trade\.html|\/trade\b/.test(location.pathname + location.search + location.href);
    if (!onTrade) return;

    const SYMBOL = 'BTCUSDT';
    let livePrice = 0, livePct = 0, liveHigh = 0, liveLow = 0, liveVol = 0, liveQuoteVol = 0;

    async function fetchTradeTicker() {
      try {
        const d = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${SYMBOL}`).then(r => r.json());
        livePrice = Number(d.lastPrice || 0);
        livePct = Number(d.priceChangePercent || 0);
        liveHigh = Number(d.highPrice || 0);
        liveLow = Number(d.lowPrice || 0);
        liveVol = Number(d.volume || 0);
        liveQuoteVol = Number(d.quoteVolume || 0);
      } catch(e) {}
    }

    async function fetchRecentTrades() {
      try {
        return await fetch(`https://api.binance.com/api/v3/trades?symbol=${SYMBOL}&limit=30`).then(r => r.json());
      } catch(e) { return []; }
    }

    function fmtP(p) {
      const n = Number(p);
      if (n >= 1e9) return (n/1e9).toFixed(2)+'B';
      if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
      if (n >= 1e3) return (n/1e3).toFixed(2)+'K';
      return n.toFixed(2);
    }
    function fmtTime(ts) {
      return new Date(ts).toLocaleTimeString('en-US', {hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});
    }

    // Update desktop static prices
    function updateDesktopPrices() {
      if (!livePrice) return;
      const isUp = livePct >= 0;
      const color = isUp ? '#2ebd85' : '#f6465d';
      const priceStr = livePrice.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
      const pctStr = (isUp?'+':'') + livePct.toFixed(2) + '%';

      // Main price display
      const priceEl = document.querySelector('.ticker_price__pzh7e .up-color, .ticker_price__pzh7e .down-color');
      if (priceEl) {
        priceEl.textContent = priceStr;
        priceEl.className = priceEl.className.replace(/up-color|down-color/, isUp ? 'up-color' : 'down-color');
      }
      // Stats row
      const statDivs = document.querySelectorAll('.arrow_content__rBT_Q .arrow_content__rBT_Q > div');
      if (statDivs.length >= 4) {
        statDivs[0]?.querySelector('div')?.setAttribute && (statDivs[0].querySelector('div').textContent = (isUp?'+':'')+livePct.toFixed(2)+'%');
        statDivs[1]?.querySelector('div')?.setAttribute && (statDivs[1].querySelector('div').textContent = liveHigh.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
        statDivs[2]?.querySelector('div')?.setAttribute && (statDivs[2].querySelector('div').textContent = liveLow.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}));
        statDivs[3]?.querySelector('div')?.setAttribute && (statDivs[3].querySelector('div').textContent = fmtP(liveVol));
      }
      // Update order book rows with realistic spread
      updateOrderBook();
    }

    function genOrderBook(midPrice, numRows = 14) {
      const tickSize = midPrice > 10000 ? 0.1 : midPrice > 100 ? 0.01 : 0.0001;
      const asks = [], bids = [];
      let runningAsk = 0, runningBid = 0;
      for (let i = 1; i <= numRows; i++) {
        const askP = midPrice + i * tickSize + (Math.random() * tickSize * 0.5);
        const bidP = midPrice - i * tickSize - (Math.random() * tickSize * 0.5);
        const askAmt = (Math.random() * 2 + 0.01).toFixed(6);
        const bidAmt = (Math.random() * 2 + 0.01).toFixed(6);
        runningAsk += Number(askAmt); runningBid += Number(bidAmt);
        asks.push({ p: askP.toFixed(2), a: askAmt, t: runningAsk.toFixed(6) });
        bids.push({ p: bidP.toFixed(2), a: bidAmt, t: runningBid.toFixed(6) });
      }
      return { asks: asks.reverse(), bids };
    }

    function updateOrderBook() {
      if (!livePrice) return;
      const { asks, bids } = genOrderBook(livePrice);
      // Desktop ask rows
      const askContainer = document.querySelector('.list_ask__LNXO5') || document.querySelector('.depthNormal_scrollWindowAsk__hke1X');
      if (askContainer) {
        const rows = askContainer.querySelectorAll('.list_main__zCJtr');
        rows.forEach((row, i) => {
          const cells = row.querySelectorAll('.fontScale_sub__PN1Es');
          if (asks[i] && cells.length >= 2) {
            cells[0].textContent = asks[i].p;
            cells[1].textContent = asks[i].a;
            if (cells[2]) cells[2].textContent = asks[i].t;
          }
        });
      }
    }

    // ── MOBILE OVERLAY ────────────────────────────────────────────────────────
    if (window.innerWidth > 767) {
      // Desktop: just live prices
      fetchTradeTicker().then(updateDesktopPrices);
      setInterval(async () => { await fetchTradeTicker(); updateDesktopPrices(); }, 3000);
      return;
    }

    // Build full mobile trade UI
    if (document.getElementById('cvx-mobile-trade')) return;

    const overlay = document.createElement('div');
    overlay.id = 'cvx-mobile-trade';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:#0b0e11;display:flex;flex-direction:column;overflow:hidden;font-family:system-ui,sans-serif;color:#fff;';

    overlay.innerHTML = `
      <!-- TOP HEADER -->
      <div id="cvx-trade-hdr" style="flex-shrink:0;background:#0b0e11;border-bottom:1px solid rgba(255,255,255,0.08);">
        <div style="display:flex;align-items:center;padding:8px 12px 6px;gap:8px;">
          <a href="index.html" style="color:rgba(255,255,255,0.5);text-decoration:none;font-size:20px;line-height:1;margin-right:2px;">&#8592;</a>
          <img src="https://assets.coincap.io/assets/icons/btc@2x.png" width="22" height="22" style="border-radius:50%;flex-shrink:0;" onerror="this.style.display='none'"/>
          <span style="font-size:15px;font-weight:700;">BTC/USDT</span>
          <span style="background:rgba(240,185,11,0.15);color:#F0B90B;font-size:11px;padding:2px 6px;border-radius:3px;font-weight:600;">Perpetual</span>
          <div style="flex:1;"></div>
          <a href="index.html" style="color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px;">Sign up</a>
        </div>
        <!-- Price row -->
        <div style="padding:0 12px 6px;display:flex;align-items:baseline;gap:10px;">
          <span id="cvx-trade-price" style="font-size:26px;font-weight:700;color:#2ebd85;letter-spacing:-0.5px;">--</span>
          <span id="cvx-trade-pct" style="font-size:13px;color:#2ebd85;font-weight:500;">--</span>
        </div>
        <!-- Stats scroll row -->
        <div style="display:flex;gap:0;overflow-x:auto;scrollbar-width:none;padding:0 12px 8px;border-bottom:1px solid rgba(255,255,255,0.05);">
          <div style="flex-shrink:0;margin-right:16px;"><div style="font-size:10px;color:rgba(255,255,255,0.4);">Index</div><div id="cvx-t-idx" style="font-size:11px;font-weight:500;">--</div></div>
          <div style="flex-shrink:0;margin-right:16px;"><div style="font-size:10px;color:rgba(255,255,255,0.4);">Mark</div><div id="cvx-t-mark" style="font-size:11px;font-weight:500;">--</div></div>
          <div style="flex-shrink:0;margin-right:16px;"><div style="font-size:10px;color:rgba(255,255,255,0.4);">Funding Rate</div><div style="font-size:11px;color:#2ebd85;">0.0074%</div></div>
          <div style="flex-shrink:0;margin-right:16px;"><div style="font-size:10px;color:rgba(255,255,255,0.4);">24H High</div><div id="cvx-t-high" style="font-size:11px;">--</div></div>
          <div style="flex-shrink:0;margin-right:16px;"><div style="font-size:10px;color:rgba(255,255,255,0.4);">24H Low</div><div id="cvx-t-low" style="font-size:11px;">--</div></div>
          <div style="flex-shrink:0;margin-right:16px;"><div style="font-size:10px;color:rgba(255,255,255,0.4);">24H Vol (BTC)</div><div id="cvx-t-vol" style="font-size:11px;">--</div></div>
          <div style="flex-shrink:0;"><div style="font-size:10px;color:rgba(255,255,255,0.4);">24H Vol (USDT)</div><div id="cvx-t-qvol" style="font-size:11px;">--</div></div>
        </div>
        <!-- Tabs -->
        <div style="display:flex;border-bottom:1px solid rgba(255,255,255,0.08);">
          <button data-cvx-tab="chart" style="flex:1;padding:10px 0;font-size:13px;font-weight:600;background:none;border:none;color:#fff;border-bottom:2px solid #F0B90B;cursor:pointer;">Chart</button>
          <button data-cvx-tab="book" style="flex:1;padding:10px 0;font-size:13px;background:none;border:none;color:rgba(255,255,255,0.45);border-bottom:2px solid transparent;cursor:pointer;">Order Book</button>
          <button data-cvx-tab="trades" style="flex:1;padding:10px 0;font-size:13px;background:none;border:none;color:rgba(255,255,255,0.45);border-bottom:2px solid transparent;cursor:pointer;">Trades</button>
        </div>
      </div>

      <!-- CONTENT AREA -->
      <div id="cvx-trade-content" style="flex:1;overflow:hidden;position:relative;">
        <!-- CHART TAB -->
        <div id="cvx-tab-chart" style="position:absolute;inset:0;">
          <div id="cvx-tv-container" style="width:100%;height:100%;"></div>
        </div>
        <!-- ORDER BOOK TAB -->
        <div id="cvx-tab-book" style="position:absolute;inset:0;display:none;overflow-y:auto;">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;font-size:11px;color:rgba(255,255,255,0.4);padding:8px 12px 4px;border-bottom:1px solid rgba(255,255,255,0.05);">
            <span>Price(USDT)</span><span style="text-align:center;">Size(BTC)</span><span style="text-align:right;">Total(BTC)</span>
          </div>
          <!-- Asks (red, sell orders) -->
          <div id="cvx-asks" style="display:flex;flex-direction:column;"></div>
          <!-- Mid price -->
          <div id="cvx-mid" style="padding:8px 12px;font-size:15px;font-weight:700;color:#2ebd85;border-top:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05);">--</div>
          <!-- Bids (green, buy orders) -->
          <div id="cvx-bids" style="display:flex;flex-direction:column;"></div>
        </div>
        <!-- TRADES TAB -->
        <div id="cvx-tab-trades" style="position:absolute;inset:0;display:none;overflow-y:auto;">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;font-size:11px;color:rgba(255,255,255,0.4);padding:8px 12px 4px;border-bottom:1px solid rgba(255,255,255,0.05);">
            <span>Price(USDT)</span><span style="text-align:center;">Size(BTC)</span><span style="text-align:right;">Date</span>
          </div>
          <div id="cvx-trade-rows"></div>
        </div>
      </div>

      <!-- BOTTOM BUTTONS -->
      <div style="flex-shrink:0;display:flex;gap:8px;padding:10px 12px;background:#0b0e11;border-top:1px solid rgba(255,255,255,0.08);">
        <button onclick="alert('Please register to trade')" style="flex:1;height:44px;background:#2ebd85;border:none;border-radius:8px;color:#fff;font-size:15px;font-weight:700;cursor:pointer;">Open Long</button>
        <button onclick="alert('Please register to trade')" style="flex:1;height:44px;background:#f6465d;border:none;border-radius:8px;color:#fff;font-size:15px;font-weight:700;cursor:pointer;">Open Short</button>
      </div>
    `;

    document.body.appendChild(overlay);

    // Tab switching
    let activeTab = 'chart';
    overlay.querySelectorAll('[data-cvx-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.cvxTab;
        overlay.querySelectorAll('[data-cvx-tab]').forEach(b => {
          const active = b.dataset.cvxTab === activeTab;
          b.style.color = active ? '#fff' : 'rgba(255,255,255,0.45)';
          b.style.fontWeight = active ? '600' : '400';
          b.style.borderBottom = active ? '2px solid #F0B90B' : '2px solid transparent';
        });
        document.getElementById('cvx-tab-chart').style.display = activeTab === 'chart' ? 'block' : 'none';
        document.getElementById('cvx-tab-book').style.display = activeTab === 'book' ? 'block' : 'none';
        document.getElementById('cvx-tab-trades').style.display = activeTab === 'trades' ? 'block' : 'none';
        if (activeTab === 'book') renderBook();
        if (activeTab === 'trades') loadTrades();
      });
    });

    // TradingView chart
    function loadTVChart() {
      const host = document.getElementById('cvx-tv-container');
      if (!host) return;
      const cid = 'cvx-tv-' + Date.now();
      host.innerHTML = `<div id="${cid}" style="width:100%;height:100%;"></div>`;
      function tryCreate() {
        if (window.TradingView && window.TradingView.widget) {
          new window.TradingView.widget({
            autosize: true, symbol: 'BINANCE:BTCUSDT', interval: '15',
            timezone: 'Etc/UTC', theme: 'dark', style: '1', locale: 'en',
            hide_top_toolbar: false, hide_side_toolbar: true,
            allow_symbol_change: false, enable_publishing: false,
            container_id: cid, studies: ['Volume@tv-basicstudies'],
            loading_screen: { backgroundColor: '#0b0e11' }
          });
        } else {
          // Load tv.js if not already loading
          if (!document.querySelector('script[data-tv-widget]')) {
            const s = document.createElement('script');
            s.src = 'https://s3.tradingview.com/tv.js';
            s.dataset.tvWidget = '1';
            s.onload = tryCreate;
            document.head.appendChild(s);
          } else {
            setTimeout(tryCreate, 500);
          }
        }
      }
      tryCreate();
    }
    loadTVChart();

    // Order book renderer
    function renderBook() {
      if (!livePrice) return;
      const { asks, bids } = genOrderBook(livePrice, 14);
      const askDiv = document.getElementById('cvx-asks');
      const bidDiv = document.getElementById('cvx-bids');
      const midDiv = document.getElementById('cvx-mid');
      if (!askDiv) return;
      if (midDiv) midDiv.textContent = livePrice.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
      askDiv.innerHTML = asks.map(r => `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;font-size:12px;padding:4px 12px;position:relative;">
          <div style="position:absolute;right:0;top:0;bottom:0;background:rgba(246,70,93,0.1);width:${Math.min(90,Math.random()*60+10)}%;"></div>
          <span style="color:#f6465d;font-weight:500;z-index:1;position:relative;">${r.p}</span>
          <span style="text-align:center;z-index:1;position:relative;">${r.a}</span>
          <span style="text-align:right;color:rgba(255,255,255,0.5);z-index:1;position:relative;">${r.t}</span>
        </div>`).join('');
      bidDiv.innerHTML = bids.map(r => `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;font-size:12px;padding:4px 12px;position:relative;">
          <div style="position:absolute;right:0;top:0;bottom:0;background:rgba(46,189,133,0.1);width:${Math.min(90,Math.random()*60+10)}%;"></div>
          <span style="color:#2ebd85;font-weight:500;z-index:1;position:relative;">${r.p}</span>
          <span style="text-align:center;z-index:1;position:relative;">${r.a}</span>
          <span style="text-align:right;color:rgba(255,255,255,0.5);z-index:1;position:relative;">${r.t}</span>
        </div>`).join('');
    }

    // Recent trades renderer
    async function loadTrades() {
      const rowDiv = document.getElementById('cvx-trade-rows');
      if (!rowDiv) return;
      rowDiv.innerHTML = '<div style="padding:16px;color:rgba(255,255,255,0.3);font-size:12px;text-align:center;">Loading...</div>';
      const trades = await fetchRecentTrades();
      if (!trades.length) { rowDiv.innerHTML = ''; return; }
      rowDiv.innerHTML = [...trades].reverse().map(t => {
        const isBuy = t.isBuyerMaker === false;
        const color = isBuy ? '#2ebd85' : '#f6465d';
        return `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;font-size:12px;padding:5px 12px;">
          <span style="color:${color};font-weight:500;">${Number(t.price).toFixed(2)}</span>
          <span style="text-align:center;">${Number(t.qty).toFixed(4)}</span>
          <span style="text-align:right;color:rgba(255,255,255,0.4);">${fmtTime(t.time)}</span>
        </div>`;
      }).join('');
    }

    // Update mobile price display
    function updateMobilePrices() {
      if (!livePrice) return;
      const isUp = livePct >= 0;
      const color = isUp ? '#2ebd85' : '#f6465d';
      const priceStr = livePrice.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
      const el = document.getElementById('cvx-trade-price');
      const pctEl = document.getElementById('cvx-trade-pct');
      if (el) { el.textContent = priceStr; el.style.color = color; }
      if (pctEl) { pctEl.textContent = (isUp?'+':'')+livePct.toFixed(2)+'%'; pctEl.style.color = color; }
      const idx = document.getElementById('cvx-t-idx');
      const mark = document.getElementById('cvx-t-mark');
      const high = document.getElementById('cvx-t-high');
      const low = document.getElementById('cvx-t-low');
      const vol = document.getElementById('cvx-t-vol');
      const qvol = document.getElementById('cvx-t-qvol');
      const approx = livePrice + (Math.random()-0.5)*2;
      if (idx) idx.textContent = approx.toFixed(1);
      if (mark) mark.textContent = (approx+Math.random()*0.5).toFixed(1);
      if (high) high.textContent = liveHigh.toFixed(1);
      if (low) low.textContent = liveLow.toFixed(1);
      if (vol) vol.textContent = fmtP(liveVol);
      if (qvol) qvol.textContent = fmtP(liveQuoteVol);
      const mid = document.getElementById('cvx-mid');
      if (mid) mid.textContent = priceStr;
      if (activeTab === 'book') renderBook();
    }

    fetchTradeTicker().then(updateMobilePrices);
    setInterval(async () => { await fetchTradeTicker(); updateMobilePrices(); }, 3000);
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
    loadTicker().then(() => { applyPrices(); buildMobileMarket(); fixDesktopPairs(); });
    wireTrade(); revealImages(); fixTradePage();
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
