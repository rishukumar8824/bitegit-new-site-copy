// Bitcovex frontend <-> Bitegit backend connector.
// Fetches live data from the Bitegit API (same-origin /api/*) and fills the
// frozen Bitbase DOM. Loaded on market.html (and reused elsewhere later).
(function () {
  const fmt = (n, d = 2) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  const UP = '#2ebd85', DOWN = '#f6465d';

  async function wireMarket() {
    let data;
    try { data = await fetch('/api/p2p/exchange-ticker').then((r) => r.json()); } catch (e) { return; }
    if (!data || !data.ticker) return;
    const map = {};
    data.ticker.forEach((t) => { map[t.symbol] = t; });

    document.querySelectorAll('tr').forEach((row) => {
      const m = (row.innerText || '').match(/\b([A-Z]{2,6})\/USDT\b/);
      if (!m) return;
      const t = map[m[1] + 'USDT'];
      if (!t) return;

      const leaves = [...row.querySelectorAll('*')].filter((e) => e.children.length === 0 && e.textContent.trim());
      // first pure-number leaf = last price
      for (const el of leaves) {
        const tx = el.textContent.trim().replace(/,/g, '');
        if (/^\d+(\.\d+)?$/.test(tx) && parseFloat(tx) > 0) {
          const px = t.lastPrice;
          el.textContent = fmt(px, px < 1 ? 4 : 2);
          el.dataset.cvxLive = '1';
          break;
        }
      }
      // first percent leaf = 24h change
      for (const el of leaves) {
        if (/%\s*$/.test(el.textContent.trim())) {
          const up = Number(t.change24h) >= 0;
          el.textContent = (up ? '+' : '') + fmt(t.change24h, 2) + '%';
          el.style.color = up ? UP : DOWN;
          break;
        }
      }
    });
  }

  // Make "Trade" buttons and coin rows open the live trade screen.
  function wireNav() {
    document.querySelectorAll('tr').forEach((row) => {
      if (!/\/USDT/.test(row.innerText || '')) return;
      [...row.querySelectorAll('*')].forEach((el) => {
        if (el.children.length === 0 && el.textContent.trim() === 'Trade' && !el.dataset.cvxNav) {
          el.dataset.cvxNav = '1';
          el.style.cursor = 'pointer';
          el.addEventListener('click', (e) => { e.stopPropagation(); location.href = 'trade.html'; });
        }
      });
      if (!row.dataset.cvxRowNav) {
        row.dataset.cvxRowNav = '1';
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => { location.href = 'trade.html'; });
      }
    });
  }

  function start() {
    wireMarket();
    wireNav();
    setInterval(wireMarket, 5000);
    setInterval(wireNav, 3000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
