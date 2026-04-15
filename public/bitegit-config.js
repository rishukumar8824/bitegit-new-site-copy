// ─── Bitegit Global Config ────────────────────────────────────────────────────
(function () {
  var BACKEND_URL = '/api/v1';

  // Local dev: use localhost backend
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    BACKEND_URL = 'http://localhost:3000/api/v1';
  }

  window.BITEGIT_API_BASE = BACKEND_URL;
})();
