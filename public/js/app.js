// Bitcovex global connector — runs on EVERY page.
// 1) Fixes top-nav dropdown links (href="#") to navigate to local pages
// 2) Fills live prices from Bitegit /api/p2p/exchange-ticker into any X/USDT row
// 3) Makes "Trade" buttons / coin rows open the live trade screen
(function () {
  const fmt = (n, d = 2) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const UP = '#2ebd85', DOWN = '#f6465d';

  const NAV = {
    'Markets': 'market.html', 'Trade': 'trade.html', 'Futures': 'futures_overview.html',
    'TradFi': 'tradfi.html', 'Finance': 'finance.html', 'Buy Crypto': 'market.html',
  };
  function wireTopNav() {
    document.querySelectorAll('header a, nav a').forEach((a) => {
      const t = (a.textContent || '').trim();
      const href = a.getAttribute('href');
      if (NAV[t] && (!href || href === '#' || href === '')) a.setAttribute('href', NAV[t]);
    });
  }

  // Replace any leftover "Bitbase" vector wordmark (viewBox 0 0 131 26) with
  // "Bitcovex" text — covers the header logo and faint app-section watermark.
  function wireWordmarks() {
    document.querySelectorAll('svg[viewBox="0 0 131 26"]').forEach((s) => {
      if (s.dataset.cvxWm) return;
      s.dataset.cvxWm = '1';
      // skip hidden wordmarks (e.g. header logo already shown as text) to avoid duplicates
      const cs = getComputedStyle(s);
      const rect = s.getBoundingClientRect();
      if (cs.display === 'none' || cs.visibility === 'hidden' || rect.width === 0 || rect.height === 0) return;
      // skip if an ancestor already contains a Bitcovex text node
      if (s.closest('a, header') && /Bitcovex/.test((s.closest('a, header') || {}).textContent || '')) return;
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
  // smallest row-like containers that show a trading pair + a price
  // (handles pair split across spans like <b>BTC</b><span>/USDT</span>)
  function pairRows() {
    const cand = [];
    document.querySelectorAll('div,tr,li,a').forEach((el) => {
      const txt = el.innerText || '';
      if (PAIR.test(txt) && /\d[\d,]*\.\d/.test(txt) && txt.length < 140 && el.querySelectorAll('*').length < 60) cand.push(el);
    });
    // keep only the innermost matches
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

  // Bitbase's React app transitions images from opacity-0 → opacity-100 on load.
  // Static HTML has no React, so images stay invisible. Fix: reveal them ourselves.
  function revealImages() {
    document.querySelectorAll('img.opacity-0').forEach((img) => {
      const show = () => {
        img.classList.remove('opacity-0');
        img.classList.add('opacity-100');
      };
      if (img.complete) { show(); }
      else { img.addEventListener('load', show); img.addEventListener('error', show); }
    });
  }

  async function tick() { if (!tickerMap) await loadTicker(); applyPrices(); }
  function start() {
    wireTopNav(); wireWordmarks(); loadTicker().then(() => { applyPrices(); });
    wireTrade(); revealImages();
    setInterval(() => { wireTopNav(); wireWordmarks(); wireTrade(); revealImages(); }, 3000);
    setInterval(async () => { await loadTicker(); applyPrices(); }, 5000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
