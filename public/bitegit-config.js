// ─── Bitcovex Global Config ────────────────────────────────────────────────────
(function () {
  var BACKEND_URL = '/api/v1';

  // Local dev: backend is served from the same origin as the page
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    BACKEND_URL = window.location.origin + '/api/v1';
  }

  window.BITCOVEX_API_BASE = BACKEND_URL;
})();
