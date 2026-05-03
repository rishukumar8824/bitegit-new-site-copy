// P2P Email Service
const nodemailer = require('nodemailer');

let _cfg = null;

function firstNonEmpty(...vals) {
  for (const v of vals) {
    const s = String(v || '').trim();
    if (s) return s;
  }
  return '';
}

function getEmailConfig() {
  if (_cfg) return _cfg;
  const resendApiKey = firstNonEmpty(process.env.RESEND_API_KEY, process.env.RESEND);
  const resendFrom   = firstNonEmpty(process.env.RESEND_FROM_EMAIL, process.env.FROM_EMAIL, `noreply@bitegit.com`);
  const smtpHost     = firstNonEmpty(process.env.SMTP_HOST);
  const smtpUser     = firstNonEmpty(process.env.SMTP_USER);
  const smtpPass     = firstNonEmpty(process.env.SMTP_PASS);
  const smtpFrom     = firstNonEmpty(process.env.SMTP_FROM, process.env.FROM_EMAIL, smtpUser);

  if (resendApiKey) {
    _cfg = { provider: 'resend', resendApiKey, fromEmail: resendFrom };
  } else if (smtpHost && smtpUser && smtpPass) {
    _cfg = {
      provider: 'smtp',
      fromEmail: smtpFrom,
      transporter: nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: smtpUser, pass: smtpPass }
      })
    };
  } else {
    _cfg = { provider: 'none' };
  }
  return _cfg;
}

async function sendEmail({ to, subject, text, html }) {
  const cfg = getEmailConfig();
  if (cfg.provider === 'resend') {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.resendApiKey}` },
        body: JSON.stringify({ from: cfg.fromEmail, to, subject, text, html })
      });
      if (!res.ok) {
        const err = await res.text().catch(() => res.statusText);
        return { delivered: false, reason: `resend_error:${err}` };
      }
      return { delivered: true, reason: 'sent_via_resend' };
    } catch (e) {
      return { delivered: false, reason: `resend_error:${e.message}` };
    }
  }
  if (cfg.provider === 'smtp') {
    try {
      await cfg.transporter.sendMail({ from: cfg.fromEmail, to, subject, text, html });
      return { delivered: true, reason: 'sent_via_smtp' };
    } catch (e) {
      return { delivered: false, reason: `smtp_error:${e.message}` };
    }
  }
  return { delivered: false, reason: 'not_configured' };
}

function createP2PEmailService() {
  const BRAND_NAME = String(process.env.APP_NAME || 'BITEGIT').trim().toUpperCase();

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Footer: no SVG — uses hosted PNG images or plain text fallbacks ──────────
  function buildFooter() {
    const year = new Date().getFullYear();
    return `
<tr><td style="padding:24px 28px 28px;border-top:1px solid #f0f0f0;background:#fafafa;">
  <p style="margin:0 0 4px;font-size:13px;color:#444;">Any question or in need of help?</p>
  <p style="margin:0 0 4px;font-size:13px;color:#444;">You can refer to <a href="https://bitegit.com/support" style="color:#00b8d4;text-decoration:none;">Help center</a> or send email <a href="mailto:support@bitegit.com" style="color:#00b8d4;text-decoration:none;">support@bitegit.com</a> to contact us</p>
  <p style="margin:0 0 14px;font-size:13px;color:#444;">Follow our <a href="https://twitter.com/bitegit" style="color:#00b8d4;text-decoration:none;">X(Twitter)</a> for more ${BRAND_NAME} updates.</p>
  <p style="margin:0 0 18px;font-size:12px;color:#888;">* This email is sent automatically and you do not need to reply.</p>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr><td style="border-left:3px solid #00b8d4;padding-left:12px;">
      <span style="font-size:13px;color:#444;font-weight:600;">Anti-Phishing Code :</span>
    </td></tr>
  </table>

  <p style="margin:0 0 14px;font-size:15px;color:#111;font-weight:700;text-align:center;">
    Download the <strong>${BRAND_NAME}</strong> App now<br/>
    <span style="font-weight:400;font-size:14px;color:#555;">Stay updated on the go!</span>
  </p>

  <!-- App store buttons — text-based, works in all email clients -->
  <table cellpadding="0" cellspacing="0" style="margin:0 auto 22px auto;">
    <tr>
      <td style="padding-right:10px;">
        <a href="#" style="display:inline-block;background:#000;border-radius:10px;padding:10px 20px;text-decoration:none;border:1px solid #333;min-width:140px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:8px;vertical-align:middle;font-size:22px;color:#fff;line-height:1;">&#9654;</td>
            <td style="vertical-align:middle;">
              <span style="display:block;font-size:9px;color:#ccc;letter-spacing:0.5px;line-height:1.4;">GET IT ON</span>
              <span style="display:block;font-size:16px;color:#fff;font-weight:700;font-family:Arial,sans-serif;line-height:1.3;">Google Play</span>
            </td>
          </tr></table>
        </a>
      </td>
      <td>
        <a href="#" style="display:inline-block;background:#000;border-radius:10px;padding:10px 20px;text-decoration:none;border:1px solid #333;min-width:140px;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:8px;vertical-align:middle;font-size:22px;color:#fff;line-height:1;">&#63743;</td>
            <td style="vertical-align:middle;">
              <span style="display:block;font-size:9px;color:#ccc;letter-spacing:0.5px;line-height:1.4;">Download on the</span>
              <span style="display:block;font-size:16px;color:#fff;font-weight:700;font-family:Arial,sans-serif;line-height:1.3;">App Store</span>
            </td>
          </tr></table>
        </a>
      </td>
    </tr>
  </table>

  <!-- Social icons — text labels in circles, works everywhere -->
  <table cellpadding="0" cellspacing="0" style="margin:0 auto 20px auto;">
    <tr>
      <td style="padding-right:8px;">
        <a href="https://bitegit.com" style="display:inline-block;width:32px;height:32px;background:#00b8d4;border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:11px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">B</a>
      </td>
      <td style="padding-right:8px;">
        <a href="#" style="display:inline-block;width:32px;height:32px;background:#229ED9;border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:11px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">TG</a>
      </td>
      <td style="padding-right:8px;">
        <a href="#" style="display:inline-block;width:32px;height:32px;background:#1877F2;border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:11px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">f</a>
      </td>
      <td style="padding-right:8px;">
        <a href="#" style="display:inline-block;width:32px;height:32px;background:#000;border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:12px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">X</a>
      </td>
      <td style="padding-right:8px;">
        <a href="#" style="display:inline-block;width:32px;height:32px;background:#FF0000;border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:11px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">YT</a>
      </td>
      <td style="padding-right:8px;">
        <a href="#" style="display:inline-block;width:32px;height:32px;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:10px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">IG</a>
      </td>
      <td>
        <a href="#" style="display:inline-block;width:32px;height:32px;background:#0A66C2;border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:10px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">in</a>
      </td>
    </tr>
  </table>

  <p style="margin:0 0 8px;font-size:12px;color:#888;line-height:1.6;">Note: Online support and staff of ${BRAND_NAME} will never require your account's private information in any mail or communication and social tools, so please do not reveal your account information to anyone. Please contact us via above methods if you encounter any suspicious situation.</p>
  <p style="margin:0;font-size:12px;color:#888;">@2018-${year} ${BRAND_NAME}.com reserves all rights.</p>
</td></tr>`;
  }

  function buildHeader() {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>P2P Order</title></head><body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 12px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:4px;overflow:hidden;">
<tr><td style="padding:24px 28px 0;text-align:center;">
  <table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr>
    <td style="padding-right:6px;vertical-align:middle;"><table cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr><td style="width:10px;height:10px;background:#00b8d4;border-radius:50%;"></td><td style="width:6px;"></td><td style="width:10px;height:10px;background:#00b8d4;border-radius:2px;"></td></tr></table></td>
    <td style="font-size:22px;font-weight:800;color:#00b8d4;letter-spacing:1px;vertical-align:middle;">${BRAND_NAME}</td>
  </tr></table>
  <div style="width:100%;height:3px;background:linear-gradient(90deg,transparent 0%,#00b8d4 30%,#00b8d4 70%,transparent 100%);margin-top:16px;"></div>
</td></tr>`;
  }

  function buildDetailsBox(order) {
    const creationTime = order.createdAt
      ? new Date(order.createdAt).toISOString().replace('T', ' ').slice(0, 19) + ' (UTC)'
      : new Date().toISOString().replace('T', ' ').slice(0, 19) + ' (UTC)';
    return `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
  <tr><td style="background:#f8f8f8;border-radius:6px;padding:18px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:6px 0;font-size:14px;color:#333;width:160px;vertical-align:top;">Order ID:</td><td style="padding:6px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(String(order.id || 'N/A'))}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#333;vertical-align:top;">Trade amount:</td><td style="padding:6px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(String(order.cryptoAmount || '0'))} ${escapeHtml(String(order.asset || 'USDT'))}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#333;vertical-align:top;">Transaction amount:</td><td style="padding:6px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(String(order.fiatAmount || '0'))} ${escapeHtml(String(order.fiatCurrency || 'INR'))}</td></tr>
      <tr><td style="padding:6px 0;font-size:14px;color:#333;vertical-align:top;">Creation time:</td><td style="padding:6px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(creationTime)}</td></tr>
    </table>
  </td></tr>
</table>`;
  }

  function closeHtml() {
    return `</table></td></tr></table></body></html>`;
  }

  // ── Buyer: order placed ───────────────────────────────────────────────────────
  async function sendOrderConfirmation(email, order) {
    try {
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      const subject = `[${BRAND_NAME}] [P2P] New Order Confirmation`;
      const html = buildHeader() + `
<tr><td style="padding:28px 28px 0;">
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111;">[P2P] New Order Confirmation</h1>
  <p style="margin:0 0 14px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:#333;line-height:1.7;">Your buy order <strong style="color:#00b8d4;">${escapeHtml(String(order.id || ''))}</strong> has been created and the seller's funds have been locked. Please complete the order promptly as it will be automatically cancelled after <strong>15 minutes</strong>.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/p2p" style="color:#00b8d4;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 28px;font-size:13px;color:#555;">If you do not recognize this activity, please <a href="https://bitegit.com/support" style="color:#00b8d4;text-decoration:none;">contact support</a>.</p>
  <p style="margin:0 0 4px;font-size:13px;color:#333;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:#888;">Please do not reply to this email</p>
</td></tr>
${buildFooter()}
${closeHtml()}`;
      return sendEmail({ to: email, subject, text: `[P2P] Order ${order.id} confirmed.`, html });
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // ── Seller: new order / payment sent ─────────────────────────────────────────
  async function sendOrderUpdate(email, order, status) {
    try {
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      let subject, bodyContent;

      if (status === 'new_order_seller') {
        subject = `[${BRAND_NAME}] [P2P] New Order Received`;
        bodyContent = `
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111;">[P2P] New Order Received</h1>
  <p style="margin:0 0 14px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:#333;line-height:1.7;">A buyer has placed order <strong style="color:#00b8d4;">${escapeHtml(String(order.id || ''))}</strong>. Your funds have been locked in escrow. Please wait for the buyer to complete payment — once they confirm, you will receive another email to release the crypto.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/p2p" style="color:#00b8d4;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 4px;font-size:13px;color:#333;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:#888;">Please do not reply to this email</p>`;
      } else if (status === 'payment_sent_seller') {
        subject = `[${BRAND_NAME}] [P2P] Action Required — Release Crypto`;
        bodyContent = `
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr><td style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:14px 18px;">
      <p style="margin:0;font-size:14px;font-weight:700;color:#856404;">&#9888; Action Required — Buyer has sent payment!</p>
    </td></tr>
  </table>
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111;">[P2P] Release Crypto</h1>
  <p style="margin:0 0 14px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:#333;line-height:1.7;">The buyer has confirmed payment for order <strong style="color:#00b8d4;">${escapeHtml(String(order.id || ''))}</strong>. Please verify payment in your bank/UPI account and <strong>release the crypto</strong> to complete the trade.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/p2p" style="color:#00b8d4;text-decoration:none;font-weight:600;">Go to Order &rarr; Release Crypto</a></p>
  <p style="margin:0 0 28px;font-size:13px;color:#888;">Do NOT release crypto until you have verified payment in your account.</p>
  <p style="margin:0 0 4px;font-size:13px;color:#333;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:#888;">Please do not reply to this email</p>`;
      } else {
        subject = `[${BRAND_NAME}] [P2P] Order Update`;
        bodyContent = `
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111;">[P2P] Order Update</h1>
  <p style="margin:0 0 14px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:#333;line-height:1.7;">Your P2P order <strong style="color:#00b8d4;">${escapeHtml(String(order.id || ''))}</strong> status has been updated to: <strong style="color:#00b8d4;">${escapeHtml(String(status || ''))}</strong>.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/p2p" style="color:#00b8d4;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 4px;font-size:13px;color:#333;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:#888;">Please do not reply to this email</p>`;
      }

      const html = buildHeader() + `<tr><td style="padding:28px 28px 0;">${bodyContent}</td></tr>` + buildFooter() + closeHtml();
      return sendEmail({ to: email, subject, text: `[P2P] Order ${order.id} update: ${status}`, html });
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // ── Buyer: 5-min reminder ─────────────────────────────────────────────────────
  async function sendPaymentReminderEmail(email, order) {
    try {
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      const subject = `[${BRAND_NAME}] [P2P] Confirm Payment — 5 Minutes Left!`;
      const html = buildHeader() + `
<tr><td style="padding:28px 28px 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr><td style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:14px 18px;">
      <p style="margin:0;font-size:14px;font-weight:700;color:#856404;">&#9888; Action Required — Only 5 Minutes Remaining!</p>
    </td></tr>
  </table>
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111;">[P2P] Confirm Payment</h1>
  <p style="margin:0 0 14px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:#333;line-height:1.7;">You have a P2P order <strong style="color:#00b8d4;">${escapeHtml(String(order.id || ''))}</strong> that needs payment confirmation within the next <strong style="color:#e53935;">5 minutes</strong>, otherwise the order will be cancelled.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/p2p" style="color:#00b8d4;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 4px;font-size:13px;color:#333;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:#888;">Please do not reply to this email</p>
</td></tr>
${buildFooter()}
${closeHtml()}`;
      return sendEmail({ to: email, subject, text: `[P2P] 5 minutes left to confirm payment for order ${order.id}.`, html });
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // ── Buyer: crypto released ────────────────────────────────────────────────────
  async function sendOrderReleased(email, order) {
    try {
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      const cryptoAmount = Number(order.cryptoAmount || 0);
      const asset = String(order.asset || 'USDT').toUpperCase();
      const sellerName = String(
        (order.participants || []).find(p => p.role === 'seller')?.username ||
        order.sellerUsername || 'The seller'
      );
      const subject = `[${BRAND_NAME}] [P2P] Crypto Released — Funds Deposited`;
      const html = buildHeader() + `
<tr><td style="padding:28px 28px 0;">
  <h1 style="margin:0 0 20px;font-size:22px;font-weight:800;color:#111;">P2P Trading Update</h1>
  <p style="margin:0 0 18px;font-size:15px;color:#333;line-height:1.8;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:15px;color:#333;line-height:1.8;">
    <strong>${escapeHtml(sellerName)}</strong> has released the crypto and
    <strong style="color:#00b8d4;">${cryptoAmount.toLocaleString(undefined,{maximumFractionDigits:8})} ${escapeHtml(asset)}</strong>
    have been deposited into your account.<br/>
    Order no. <strong>${escapeHtml(String(order.id || 'N/A'))}</strong>
  </p>
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/p2p" style="color:#00b8d4;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 4px;font-size:13px;color:#333;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:#888;">Please do not reply to this email</p>
</td></tr>
${buildFooter()}
${closeHtml()}`;
      return sendEmail({ to: email, subject, text: `[P2P] ${cryptoAmount} ${asset} deposited. Order ${order.id}`, html });
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // ── Seller: buyer marked payment ──────────────────────────────────────────────
  async function sendOrderPaid(email, order) {
    try {
      const emailOrder = {
        id: order.id, cryptoAmount: order.cryptoAmount,
        asset: order.asset || 'USDT', fiatAmount: order.fiatAmount,
        fiatCurrency: order.fiatCurrency || 'INR', createdAt: order.createdAt
      };
      return sendOrderUpdate(email, emailOrder, 'payment_sent_seller');
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // ── Both parties: order cancelled ────────────────────────────────────────────
  async function sendOrderCancelled(email, order) {
    try {
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      const subject = `[${BRAND_NAME}] [P2P] Order Cancelled`;
      const html = buildHeader() + `
<tr><td style="padding:28px 28px 0;">
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111;">[P2P] Order Cancelled</h1>
  <p style="margin:0 0 14px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:#333;line-height:1.7;">Your P2P order <strong style="color:#00b8d4;">${escapeHtml(String(order.id || 'N/A'))}</strong> has been cancelled. Any locked funds have been returned to your account.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/p2p" style="color:#00b8d4;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 4px;font-size:13px;color:#333;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:#888;">Please do not reply to this email</p>
</td></tr>
${buildFooter()}
${closeHtml()}`;
      return sendEmail({ to: email, subject, text: `[P2P] Order ${order.id} has been cancelled.`, html });
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // ── Admin + parties: dispute raised ──────────────────────────────────────────
  async function sendDisputeRaised(email, order, raisedBy) {
    try {
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      const subject = `[${BRAND_NAME}] [P2P] Dispute Raised — Order ${escapeHtml(String(order.id || ''))}`;
      const html = buildHeader() + `
<tr><td style="padding:28px 28px 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
    <tr><td style="background:#fdecea;border:1px solid #e53935;border-radius:8px;padding:14px 18px;">
      <p style="margin:0;font-size:14px;font-weight:700;color:#c62828;">&#9888; A dispute has been raised on this order.</p>
    </td></tr>
  </table>
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111;">[P2P] Dispute Raised</h1>
  <p style="margin:0 0 14px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:#333;line-height:1.7;">A dispute has been raised by <strong>${escapeHtml(String(raisedBy || 'a participant'))}</strong> on order <strong style="color:#00b8d4;">${escapeHtml(String(order.id || 'N/A'))}</strong>. Our support team will review and resolve it shortly.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/p2p" style="color:#00b8d4;text-decoration:none;font-weight:600;">View Order</a></p>
  <p style="margin:0 0 4px;font-size:13px;color:#333;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:#888;">Please do not reply to this email</p>
</td></tr>
${buildFooter()}
${closeHtml()}`;
      return sendEmail({ to: email, subject, text: `[P2P] Dispute raised on order ${order.id} by ${raisedBy}.`, html });
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  return {
    sendOrderConfirmation,
    sendOrderUpdate,
    sendPaymentReminderEmail,
    sendOrderReleased,
    sendOrderPaid,
    sendOrderCancelled,
    sendDisputeRaised
  };
}

module.exports = { createP2PEmailService };
