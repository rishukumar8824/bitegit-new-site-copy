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
