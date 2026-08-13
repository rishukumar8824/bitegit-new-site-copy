// Device-token registration for FCM push notifications. Mounted from
// server.js alongside the other modular route files (see routes/p2p-orders.js
// for the same pattern).

function registerPushRoutes(app, deps = {}) {
  if (!app) {
    throw new Error('Express app is required to register push routes.');
  }
  const requiresP2PUser = deps.requiresP2PUser;
  const pushService = deps.pushService;

  if (typeof requiresP2PUser !== 'function') {
    throw new Error('requiresP2PUser middleware is required for push routes.');
  }
  if (!pushService || typeof pushService.registerToken !== 'function') {
    throw new Error('pushService is required for push routes.');
  }

  app.post('/api/p2p/push/token', requiresP2PUser, async (req, res) => {
    const token = String(req.body?.token || '').trim();
    const platform = String(req.body?.platform || 'android').trim();
    if (!token) return res.status(400).json({ message: 'token is required.' });
    try {
      await pushService.registerToken(req.p2pUser.id, token, platform);
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to register push token.' });
    }
  });

  app.delete('/api/p2p/push/token', requiresP2PUser, async (req, res) => {
    const token = String(req.body?.token || req.query?.token || '').trim();
    if (!token) return res.status(400).json({ message: 'token is required.' });
    try {
      await pushService.unregisterToken(req.p2pUser.id, token);
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to remove push token.' });
    }
  });

  // Sends a push to the caller's own registered devices — for verifying the
  // pipeline end-to-end (device token really registered, FCM really configured,
  // notification really reaches a locked/backgrounded phone) without needing
  // a second account or a real order action to trigger one.
  app.post('/api/p2p/push/test', requiresP2PUser, async (req, res) => {
    try {
      await pushService.sendPushToUser(req.p2pUser.id, {
        title: 'Bitcovex test push',
        body: 'If you can see this, real push notifications are working.',
        data: { type: 'test' }
      });
      return res.json({ success: true, message: 'Test push sent (if a device token was registered).' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to send test push.' });
    }
  });
}

module.exports = { registerPushRoutes };
