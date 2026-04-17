const https = require('https');

/**
 * Lookup country, city, region for an IP address using ip-api.com (free, no key needed).
 * Returns { country, city, region } — all empty strings on failure or private IPs.
 */
function getIpLocation(ip) {
  return new Promise((resolve) => {
    if (!ip || /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|localhost)/i.test(ip)) {
      return resolve({ country: '', city: '', region: '' });
    }
    const url = `https://ip-api.com/json/${encodeURIComponent(ip)}?fields=country,city,regionName,status`;
    https.get(url, { timeout: 3000 }, (res) => {
      let raw = '';
      res.on('data', (c) => { raw += c; });
      res.on('end', () => {
        try {
          const d = JSON.parse(raw);
          resolve(d.status === 'success'
            ? { country: d.country || '', city: d.city || '', region: d.regionName || '' }
            : { country: '', city: '', region: '' });
        } catch { resolve({ country: '', city: '', region: '' }); }
      });
    }).on('error', () => resolve({ country: '', city: '', region: '' }))
      .on('timeout', function () { this.destroy(); resolve({ country: '', city: '', region: '' }); });
  });
}

module.exports = { getIpLocation };
