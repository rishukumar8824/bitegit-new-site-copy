'use strict';

/**
 * App metadata for the Android client:
 *   GET  /api/app/config          public — latest version + active promo popups
 *   PUT  /api/admin/app/config    admin  — update it
 *
 * Stored as one doc in `app_meta` (key: APP_META_KEY). The Android app polls
 * /api/app/config on launch: if `android.latestVersionCode` is greater than the
 * running BuildConfig.VERSION_CODE it shows an update prompt (blocking when the
 * running code is below `android.minSupportedVersionCode`); otherwise it may show
 * one of `promos` (each rate-limited client-side by `minIntervalHours`).
 */

const APP_META_KEY = 'app_meta_v1';

const DEFAULT_META = {
  android: {
    latestVersionCode: 1,
    latestVersionName: '1.0.0',
    apkUrl: 'https://bitcovex.com/downloads/bitcovex.apk',
    releaseNotes: '',
    minSupportedVersionCode: 1
  },
  promos: []
};

function sanitizePromo(p, i) {
  if (!p || typeof p !== 'object') return null;
  const id = String(p.id || `promo_${i}`).trim().slice(0, 64);
  const imageUrl = String(p.imageUrl || '').trim().slice(0, 600);
  const title = String(p.title || '').trim().slice(0, 120);
  const body = String(p.body || '').trim().slice(0, 400);
  if (!title && !imageUrl) return null;
  return {
    id,
    imageUrl,
    title,
    body,
    ctaText: String(p.ctaText || 'Learn more').trim().slice(0, 40),
    ctaUrl: String(p.ctaUrl || '').trim().slice(0, 600),
    minIntervalHours: Math.max(0, Math.min(24 * 30, Number(p.minIntervalHours) || 24)),
    active: p.active !== false
  };
}

function sanitizeMeta(input = {}) {
  const a = input.android || {};
  const out = {
    android: {
      latestVersionCode: Math.max(1, Math.floor(Number(a.latestVersionCode) || 1)),
      latestVersionName: String(a.latestVersionName || '1.0.0').trim().slice(0, 20),
      apkUrl: String(a.apkUrl || DEFAULT_META.android.apkUrl).trim().slice(0, 600),
      releaseNotes: String(a.releaseNotes || '').trim().slice(0, 1500),
      minSupportedVersionCode: Math.max(1, Math.floor(Number(a.minSupportedVersionCode) || 1))
    },
    promos: Array.isArray(input.promos)
      ? input.promos.map(sanitizePromo).filter(Boolean).slice(0, 20)
      : []
  };
  if (out.android.minSupportedVersionCode > out.android.latestVersionCode) {
    out.android.minSupportedVersionCode = out.android.latestVersionCode;
  }
  return out;
}

function registerAppMetaRoutes(app, deps = {}) {
  if (!app) throw new Error('Express app is required.');
  const { requiresAdminSession, getCollections } = deps;
  if (typeof getCollections !== 'function') throw new Error('getCollections is required.');

  async function readMeta() {
    try {
      const { appMeta } = getCollections();
      const doc = await appMeta.findOne({ key: APP_META_KEY });
      return doc && doc.value ? sanitizeMeta(doc.value) : DEFAULT_META;
    } catch (_) {
      return DEFAULT_META;
    }
  }

  app.get('/api/app/config', async (req, res) => {
    const meta = await readMeta();
    return res.json({
      android: meta.android,
      promos: meta.promos.filter((p) => p.active)
    });
  });

  if (typeof requiresAdminSession === 'function') {
    app.get('/api/admin/app/config', requiresAdminSession, async (req, res) => {
      return res.json(await readMeta());
    });

    app.put('/api/admin/app/config', requiresAdminSession, async (req, res) => {
      try {
        const clean = sanitizeMeta(req.body || {});
        const { appMeta } = getCollections();
        await appMeta.updateOne(
          { key: APP_META_KEY },
          { $set: { key: APP_META_KEY, value: clean, updatedAt: new Date() } },
          { upsert: true }
        );
        return res.json({ message: 'App config updated.', ...clean });
      } catch (err) {
        console.error('[app-meta] update failed:', err && err.message);
        return res.status(500).json({ message: 'Could not update app config.' });
      }
    });
  }
}

module.exports = { registerAppMetaRoutes, APP_META_KEY, sanitizeMeta };
