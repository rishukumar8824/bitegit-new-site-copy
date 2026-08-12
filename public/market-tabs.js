// Adds a Market / Leaderboard toggle to /markets without touching the
// generated market.html markup. Market (the pairs table) shows by default;
// the Hot/TradFi/Top Gainers/Global Index cards move behind "Leaderboard".
// Self-healing: re-applies itself if the page re-renders the section.
(function () {
  var CARDS_SELECTOR = 'div[class="mt-3 flex flex-col pb-12 md:mt-0 md:pb-0 md:flex-row gap-4 md:gap-5"]';
  var activeTab = 'market';

  function findCards() {
    return document.querySelector(CARDS_SELECTOR);
  }

  function buildTabs() {
    var wrap = document.createElement('div');
    wrap.id = 'mkTopTabsInjected';
    wrap.style.cssText = 'display:flex;gap:1.5rem;align-items:center;margin:0 0 0.75rem;padding:0 1rem;';
    wrap.innerHTML =
      '<button type="button" data-mk-top="market" style="background:none;border:none;padding:0.4rem 0;font-size:1rem;font-weight:700;cursor:pointer;color:#f4f8ff;border-bottom:2px solid #f4f8ff;">Market</button>' +
      '<button type="button" data-mk-top="leaderboard" style="background:none;border:none;padding:0.4rem 0;font-size:1rem;font-weight:700;cursor:pointer;color:#8a97ab;border-bottom:2px solid transparent;">Leaderboard</button>';
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-mk-top]');
      if (btn) setTab(btn.getAttribute('data-mk-top'));
    });
    return wrap;
  }

  function setTab(tab) {
    activeTab = tab === 'leaderboard' ? 'leaderboard' : 'market';
    apply();
  }

  var observer = null;

  function apply() {
    var cards = findCards();
    if (!cards) return;

    if (observer) observer.disconnect();

    // Ensure the tab bar exists right before the cards row
    var tabs = document.getElementById('mkTopTabsInjected');
    if (!tabs) {
      tabs = buildTabs();
      cards.parentNode.insertBefore(tabs, cards);
    }
    tabs.querySelectorAll('button[data-mk-top]').forEach(function (btn) {
      var on = btn.getAttribute('data-mk-top') === activeTab;
      var color = on ? '#f4f8ff' : '#8a97ab';
      var borderColor = on ? '#f4f8ff' : 'transparent';
      if (btn.style.color !== color) btn.style.color = color;
      if (btn.style.borderBottomColor !== borderColor) btn.style.borderBottomColor = borderColor;
    });

    var marketSection = cards.nextElementSibling;
    var showCards = activeTab === 'leaderboard' ? '' : 'none';
    var showMarket = activeTab === 'leaderboard' ? 'none' : '';
    if (cards.style.display !== showCards) cards.style.display = showCards;
    if (marketSection && marketSection.style.display !== showMarket) marketSection.style.display = showMarket;

    if (observer) observer.observe(document.body, { childList: true, subtree: true });
  }

  function boot() {
    apply();
    // Re-apply whenever the page re-renders this area (live price updates etc.)
    observer = new MutationObserver(function () { apply(); });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

// ── Spot/Futures tab switching + click-a-pair-to-open-its-chart ──
// market.html is a scraped page: the Watchlist/Spot/Futures/TradFi tab
// buttons and the pairs table rows exist but have zero JS behind them.
// There's only one static list of pairs on the page (no separate spot vs
// futures data), so switching tabs can't swap *which coins* are listed —
// what it can do, and what actually matters for navigation, is control
// which market a row click opens: /trade/spot/<SYMBOL> or
// /trade/perp/<SYMBOL>.
(function () {
  var mode = 'spot'; // 'spot' | 'perp'

  function findMainTabBar() {
    // Anchor on the "Watchlist" button text — it's unique on the page —
    // then use its parent as the tab group, so this keeps working even
    // if the scrape's Tailwind class hashes change on a future refresh.
    var watchlistBtn = [].find.call(document.querySelectorAll('button'), function (b) {
      return (b.textContent || '').trim() === 'Watchlist';
    });
    return watchlistBtn ? watchlistBtn.parentElement : null;
  }

  function setActiveButton(group, btn) {
    [].forEach.call(group.querySelectorAll('button'), function (b) {
      var on = b === btn;
      b.setAttribute('data-active', on ? 'true' : 'false');
      b.classList.toggle('text-text_primary', on);
      b.classList.toggle('text-text_secondary', !on);
    });
  }

  function wireTabBar() {
    var group = findMainTabBar();
    if (!group || group.dataset.cvxWired) return;
    group.dataset.cvxWired = '1';
    group.addEventListener('click', function (e) {
      var btn = e.target.closest('button');
      if (!btn) return;
      var label = (btn.textContent || '').trim();
      if (label === 'Spot') mode = 'spot';
      else if (label === 'Futures') mode = 'perp';
      // Watchlist/TradFi/New: just reflect the active tab visually — no
      // dedicated view exists for them on this scraped page.
      setActiveButton(group, btn);
    });
  }

  function rowSymbol(tr) {
    var spans = tr.querySelectorAll('td:first-child span.text-sm.font-medium.text-text_primary');
    var base = spans[0] && spans[0].textContent.trim();
    var quoteEl = tr.querySelector('td:first-child span.text-xs.font-medium.text-text_primary');
    var quote = quoteEl ? quoteEl.textContent.trim().replace(/^\//, '') : 'USDT';
    return base ? (base + quote).toUpperCase() : null;
  }

  function wirePairsTable() {
    var table = document.querySelector('table');
    var tbody = table && table.querySelector('tbody');
    if (!tbody || tbody.dataset.cvxWired) return;
    tbody.dataset.cvxWired = '1';
    // Delegated listener — survives price updates that only patch text
    // in-place (no row re-creation), and any future full re-renders too.
    tbody.addEventListener('click', function (e) {
      var tr = e.target.closest('tr');
      if (!tr) return;
      var sym = rowSymbol(tr);
      if (sym) window.location.href = '/trade/' + mode + '/' + sym;
    });
  }

  function boot() {
    wireTabBar();
    wirePairsTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  // The page/price-update logic can replace the table or tab bar wholesale
  // at some point — re-attempt wiring on later mutations too (cheap no-op
  // once already wired via the dataset guards above).
  new MutationObserver(boot).observe(document.body, { childList: true, subtree: true });
})();
