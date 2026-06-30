// Live trade chart — embeds the real TradingView Advanced Chart widget
// (same as Bitbase used). Pulls real BTC/USDT data straight from TradingView
// in the browser, so it works regardless of the backend price feed.
(function () {
  function symbolFromPage() {
    const m = document.body.innerText.match(/\b([A-Z]{2,6})\s*\/\s*USDT\b/);
    return m ? 'BINANCE:' + m[1] + 'USDT' : 'BINANCE:BTCUSDT';
  }
  const SYMBOL = symbolFromPage();

  function findChartBox() {
    return document.querySelector('.kline_body__CE__1')
        || document.querySelector('.advanced_kline__giYk_')
        || document.querySelector('[class*="kline_body"]')
        || document.querySelector('[class*="kline_main"]');
  }

  let mounted = false;
  function mount() {
    if (mounted) return true;
    const box = findChartBox();
    if (!box) return false;
    mounted = true;
    box.innerHTML = '';
    box.style.height = '520px';
    box.style.minHeight = '520px';
    const el = document.createElement('div');
    el.id = 'tv_chart_container';
    el.style.cssText = 'width:100%;height:520px;';
    box.appendChild(el);

    function build() {
      try {
        new TradingView.widget({
          autosize: true,
          symbol: SYMBOL,
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          backgroundColor: 'rgba(0,0,0,0)',
          enable_publishing: false,
          allow_symbol_change: false,
          hide_side_toolbar: false,
          save_image: false,
          container_id: 'tv_chart_container',
        });
      } catch (e) {}
    }

    if (window.TradingView && window.TradingView.widget) build();
    else {
      const s = document.createElement('script');
      s.src = 'https://s3.tradingview.com/tv.js';
      s.onload = build;
      document.head.appendChild(s);
    }
    return true;
  }

  let tries = 0;
  const iv = setInterval(() => { if (mount() || ++tries > 40) clearInterval(iv); }, 250);
  if (document.readyState !== 'loading') mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
