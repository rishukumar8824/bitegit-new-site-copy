// Real OS-level push notifications (FCM) for the P2P Android/iOS app — reaches
// the user even when the app is closed or the phone screen is off, unlike the
// existing SSE broadcastOrderEvent/broadcastParticipantOrderEvent helpers
// which only reach a client that has the app open with a live connection.
//
// Setup required before this does anything:
//   1. Create a Firebase project, add an Android app with package
//      com.bitcovex.exchange (and iOS app if needed).
//   2. Firebase console → Project settings → Service accounts → Generate new
//      private key → download the JSON.
//   3. Set FCM_SERVICE_ACCOUNT_JSON in the server's env to that JSON's full
//      contents (as a single-line string).
//   4. npm install firebase-admin
//
// Until FCM_SERVICE_ACCOUNT_JSON is set, sendPushToUser() is a safe no-op —
// it logs a warning once and returns, it does not throw or block callers.

const admin = require('firebase-admin');

let initAttempted = false;
let ready = false;

function ensureInitialized() {
  if (initAttempted) return ready;
  initAttempted = true;

  const serviceAccountJson = String(process.env.FCM_SERVICE_ACCOUNT_JSON || '').trim();
  if (!serviceAccountJson) {
    console.warn('[push] FCM_SERVICE_ACCOUNT_JSON not set — push notifications disabled.');
    return false;
  }

  try {
    if (admin.apps.length === 0) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    }
    ready = true;
    return true;
  } catch (error) {
    console.error('[push] Failed to initialize firebase-admin:', error.message);
    return false;
  }
}

function createPushNotificationService({ getCollections }) {
  /** Registers/updates a device's FCM token for a user. Call on login and whenever the token refreshes. */
  async function registerToken(userId, token, platform = 'android') {
    if (!userId || !token) return;
    const { deviceTokens } = getCollections();
    await deviceTokens.updateOne(
      { userId: String(userId), token: String(token) },
      { $set: { userId: String(userId), token: String(token), platform, updatedAt: new Date() } },
      { upsert: true }
    );
  }

  /** Removes a device token — call on logout so a signed-out device stops receiving pushes. */
  async function unregisterToken(userId, token) {
    if (!userId || !token) return;
    const { deviceTokens } = getCollections();
    await deviceTokens.deleteOne({ userId: String(userId), token: String(token) });
  }

  /**
   * Sends a push to every device registered for a user. Silently does nothing
   * if Firebase isn't configured or the user has no registered devices — this
   * must never throw into the caller's request/response flow.
   */
  async function sendPushToUser(userId, { title, body, data = {} } = {}) {
    if (!userId || !title) return;
    if (!ensureInitialized()) return;

    try {
      const { deviceTokens } = getCollections();
      const docs = await deviceTokens.find({ userId: String(userId) }).toArray();
      if (!docs.length) return;

      const tokens = docs.map((d) => d.token).filter(Boolean);
      if (!tokens.length) return;

      const stringData = {};
      for (const [k, v] of Object.entries(data)) {
        stringData[k] = typeof v === 'string' ? v : JSON.stringify(v);
      }

      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: { title, body: body || '' },
        data: stringData,
        android: { priority: 'high' }
      });

      // Drop tokens Firebase says are no longer valid (app uninstalled, token rotated, etc.)
      const staleTokens = [];
      response.responses.forEach((r, i) => {
        if (!r.success && ['messaging/registration-token-not-registered', 'messaging/invalid-registration-token'].includes(r.error?.code)) {
          staleTokens.push(tokens[i]);
        }
      });
      if (staleTokens.length) {
        await deviceTokens.deleteMany({ userId: String(userId), token: { $in: staleTokens } });
      }
    } catch (error) {
      console.error('[push] sendPushToUser failed:', error.message);
    }
  }

  return { registerToken, unregisterToken, sendPushToUser };
}

module.exports = { createPushNotificationService };
