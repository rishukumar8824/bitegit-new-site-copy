// Every "something went wrong" path on this exchange used to end at
// console.error, which nobody watches on Render. This gives those paths a
// real notification channel (email today, swappable later) with a dedupe
// window so a repeating failure doesn't spam the inbox every tick.

function createAlertService({ sendEmail, adminEmail, minIntervalMs = 15 * 60 * 1000 } = {}) {
  const lastSentAt = new Map();

  function shouldSend(key) {
    const last = lastSentAt.get(key);
    if (!last) return true;
    return Date.now() - last >= minIntervalMs;
  }

  async function notify(key, subject, message) {
    console.error(`[ALERT:${key}] ${subject} — ${message}`);

    if (!shouldSend(key)) {
      return { sent: false, reason: 'deduped' };
    }
    lastSentAt.set(key, Date.now());

    const to = String(adminEmail || '').trim();
    if (!to || typeof sendEmail !== 'function') {
      return { sent: false, reason: 'no_email_configured' };
    }

    try {
      const result = await sendEmail({
        to,
        subject: `[BITCOVEX ALERT] ${subject}`,
        text: message,
        html: `<pre style="white-space:pre-wrap;font-family:monospace;">${escapeHtml(message)}</pre>`
      });
      return { sent: Boolean(result?.delivered), reason: result?.reason || 'unknown' };
    } catch (error) {
      console.error(`[ALERT:${key}] failed to send alert email:`, error?.message || error);
      return { sent: false, reason: `send_error:${error?.message || error}` };
    }
  }

  return { notify };
}

function escapeHtml(input) {
  return String(input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = {
  createAlertService
};
