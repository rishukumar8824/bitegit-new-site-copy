// Bitcovex global connector — runs on EVERY page.
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

  // Header: show only the B-gem icon (no "Bitcovex" text). Like Bitbase mobile shows just the gem.
  // Creates a fresh SVG with only the two gem-icon paths — avoids text path bleed-through.
  function fixHeaderLogo() {
    const logoLink = document.querySelector('header a[href="index.html"]');
    if (!logoLink || logoLink.dataset.cvxLogo) return;
    logoLink.dataset.cvxLogo = '1';
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 22 26');
    svg.setAttribute('width', '22'); svg.setAttribute('height', '26');
    svg.setAttribute('fill', 'none');
    svg.style.cssText = 'display:inline-block;vertical-align:middle;flex-shrink:0;';
    const p1 = document.createElementNS(ns, 'path');
    p1.setAttribute('d', 'M5.40038 0H0.73112C0.327217 0 0 0.326486 0 0.729486V6.91749C0 7.32049 0.327217 7.64697 0.73112 7.64697H6.1315V0.729486C6.1315 0.326486 5.80429 0 5.40038 0Z');
    p1.setAttribute('fill', '#F68F15');
    const p2 = document.createElementNS(ns, 'path');
    p2.setAttribute('d', 'M6.13151 7.64698V13.0353C6.13151 13.4383 6.45872 13.7648 6.86262 13.7648H12.2891C13.9821 13.7648 15.3546 15.1342 15.3546 16.8235C15.3546 18.5127 13.9821 19.8822 12.2891 19.8822H7.6641C6.81758 19.8822 6.1315 19.1977 6.13113 18.353V14.4939C6.13113 14.0909 5.80392 13.7644 5.40001 13.7644H0.73112C0.327217 13.7644 0 14.0909 0 14.4939V19.1523C0 19.5553 0.327217 19.8818 0.73112 19.8818H4.59854C5.44506 19.8818 6.13151 20.5667 6.13151 21.4114V25.2701C6.13151 25.6731 6.45872 25.9996 6.86262 25.9996H11.9235C17.2048 25.9996 21.4861 21.7278 21.4861 16.4584C21.4861 11.5919 17.532 7.64661 12.6546 7.64661H6.13151V7.64698Z');
    p2.setAttribute('fill', 'currentColor');
    svg.appendChild(p1); svg.appendChild(p2);
    logoLink.innerHTML = '';
    logoLink.appendChild(svg);
  }

  // Add hamburger ≡ menu button (three lines) to mobile header right side, like Bitbase.
  function addHamburger() {
    const header = document.querySelector('header');
    if (!header || header.dataset.cvxBurger) return;
    header.dataset.cvxBurger = '1';
    const rightBox = header.querySelector('[data-nav-right-box]');
    if (!rightBox) return;
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', 'Menu');
    btn.innerHTML = '<svg width="20" height="14" viewBox="0 0 20 14" fill="currentColor"><rect width="20" height="2" rx="1"/><rect y="6" width="20" height="2" rx="1"/><rect y="12" width="20" height="2" rx="1"/></svg>';
    btn.style.cssText = 'background:none;border:none;color:currentColor;cursor:pointer;padding:4px 6px;display:flex;align-items:center;margin-left:4px;';
    // Toggle a simple mobile nav panel showing all nav links
    btn.addEventListener('click', () => {
      let panel = document.getElementById('cvx-mobile-nav');
      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'cvx-mobile-nav';
        panel.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.95);padding:60px 24px 24px;display:flex;flex-direction:column;gap:16px;overflow-y:auto;';
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = 'position:absolute;top:16px;right:20px;background:none;border:none;color:#fff;font-size:24px;cursor:pointer;';
        closeBtn.addEventListener('click', () => panel.remove());
        panel.appendChild(closeBtn);
        Object.entries(NAV).forEach(([label, href]) => {
          const a = document.createElement('a');
          a.href = href; a.textContent = label;
          a.style.cssText = 'color:#fff;font-size:20px;font-weight:600;text-decoration:none;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.1);';
          a.addEventListener('click', () => panel.remove());
          panel.appendChild(a);
        });
        document.body.appendChild(panel);
      } else { panel.remove(); }
    });
    rightBox.appendChild(btn);
  }

  // Add earth/globe video to the "Built on Stability" section.
  function addEarthVideo() {
    if (document.getElementById('cvx-globe-done')) return;
    const h2 = [...document.querySelectorAll('h2')].find(h => h.textContent.includes('Built on Stability'));
    if (!h2) return;
    document.body.insertAdjacentHTML('beforeend', '<span id="cvx-globe-done" style="display:none"></span>');
    const section = h2.closest('section');
    if (!section) return;
    const makeVideo = (styles) => {
      const v = document.createElement('video');
      v.src = '/cdn/imgs/index-web/home/earth_video_v2_mini.mp4';
      v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true;
      v.style.cssText = styles;
      return v;
    };
    // Desktop globe: find the span inside the hidden-on-mobile, shown-on-desktop div
    const allSpans = section.querySelectorAll('span');
    allSpans.forEach(span => {
      if (!span.children.length && !span.textContent.trim()) {
        const parent = span.parentElement;
        if (parent && /flex-1/.test(parent.className) && /opacity/.test(parent.className)) {
          span.appendChild(makeVideo('width:100%;height:auto;max-height:600px;object-fit:contain;'));
        }
      }
    });
    // Mobile globe: find the empty inner div inside the pt-[120px] area
    const allDivs = section.querySelectorAll('div > div');
    allDivs.forEach(d => {
      if (!d.children.length && !d.textContent.trim()) {
        const parent = d.parentElement;
        if (parent && /absolute/.test(d.className || '') || (parent && /absolute/.test(parent.className || ''))) {
          d.appendChild(makeVideo('width:220px;height:220px;object-fit:contain;'));
        }
      }
    });
  }

  // Replace any remaining visible Bitbase wordmark SVGs (outside header) with Bitcovex text.
  function wireWordmarks() {
    document.querySelectorAll('svg[viewBox="0 0 131 26"]').forEach((s) => {
      if (s.dataset.cvxWm) return;
      s.dataset.cvxWm = '1';
      if (s.closest('header')) return; // header handled by fixHeaderLogo
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

  // Reveal images stuck at opacity-0 (Bitbase React fade-in that we don't have).
  // Also hide the loading skeleton (Bitbase SVG watermark placeholder) when image appears.
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
    fixHeaderLogo(); addHamburger(); addEarthVideo();
    wireTopNav(); wireWordmarks(); loadTicker().then(() => { applyPrices(); });
    wireTrade(); revealImages();
    setInterval(() => { fixHeaderLogo(); addHamburger(); wireTopNav(); wireWordmarks(); wireTrade(); revealImages(); }, 3000);
    setInterval(async () => { await loadTicker(); applyPrices(); }, 5000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
