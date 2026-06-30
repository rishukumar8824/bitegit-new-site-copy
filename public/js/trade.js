// Live trade screen: renders a candlestick chart from the Bitegit API
// (/api/p2p/klines) into the frozen Bitbase chart container, and keeps the
// header price live (/api/p2p/market-depth). Uses lightweight-charts (local).
(function () {
  function symbolFromPage() {
    const m = document.body.innerText.match(/\b([A-Z]{2,6})\/USDT\b/);
    return m ? m[1] + 'USDT' : 'BTCUSDT';
  }
  const SYMBOL = symbolFromPage();

  function findChartBox() {
    return document.querySelector('.kline_body__CE__1')
        || document.querySelector('.advanced_kline__giYk_')
        || document.querySelector('[class*="kline_body"]')
        || document.querySelector('[class*="kline_main"]');
  }

  let chart, series, host;
  function ensureChart() {
    if (chart) return true;
    if (!window.LightweightCharts) return false;
    const box = findChartBox();
    if (!box) return false;
    host = document.createElement('div');
    host.id = 'cvx-chart';
    host.style.cssText = 'width:100%;height:420px;';
    box.innerHTML = '';
    box.style.height = '420px';
    box.style.minHeight = '420px';
    box.appendChild(host);
    chart = LightweightCharts.createChart(host, {
      width: host.clientWidth, height: 420,
      layout: { background: { color: 'transparent' }, textColor: '#9aa0aa' },
      grid: { vertLines: { color: 'rgba(255,255,255,0.05)' }, horzLines: { color: 'rgba(255,255,255,0.05)' } },
      timeScale: { timeVisible: true, borderColor: 'rgba(255,255,255,0.1)' },
      rightPriceScale: { borderColor: 'rgba(255,255,255,0.1)' },
      crosshair: { mode: 0 },
    });
    series = chart.addCandlestickSeries({ upColor: '#2ebd85', downColor: '#f6465d', borderVisible: false, wickUpColor: '#2ebd85', wickDownColor: '#f6465d' });
    window.addEventListener('resize', () => { if (chart && host) chart.applyOptions({ width: host.clientWidth }); });
    return true;
  }

  async function loadCandles() {
    if (!ensureChart()) return;
    try {
      const r = await fetch(`/api/p2p/klines?symbol=${SYMBOL}&interval=1m&limit=200`).then((x) => x.json());
      if (!r || !r.klines) return;
      const data = r.klines.map((k) => ({
        time: Math.floor(k.openTime / 1000),
        open: +k.open, high: +k.high, low: +k.low, close: +k.close,
      })).filter((d) => d.time && isFinite(d.open));
      // dedupe + sort
      const seen = new Set(); const clean = [];
      data.sort((a, b) => a.time - b.time).forEach((d) => { if (!seen.has(d.time)) { seen.add(d.time); clean.push(d); } });
      series.setData(clean);
      chart.timeScale().fitContent();
    } catch (e) { /* keep last */ }
  }

  const fmt = (n, d = 2) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  async function loadHeader() {
    try {
      const r = await fetch(`/api/p2p/market-depth?symbol=${SYMBOL}`).then((x) => x.json());
      const t = r && r.ticker; if (!t) return;
      // main last price: the largest visible number near the pair header
      const cands = [...document.querySelectorAll('span,div')].filter((e) => e.children.length === 0 && /^\d[\d,]*\.\d+$/.test(e.textContent.trim()));
      if (cands[0]) cands[0].textContent = fmt(t.lastPrice, t.lastPrice < 1 ? 4 : 2);
      document.title = fmt(t.lastPrice, 2) + ' ' + SYMBOL.replace('USDT', '/USDT') + ' | Bitcovex';
    } catch (e) {}
  }

  function start() { loadCandles(); loadHeader(); setInterval(loadCandles, 8000); setInterval(loadHeader, 5000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
