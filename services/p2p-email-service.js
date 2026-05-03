// P2P Email Service
function createP2PEmailService(resend, fromEmail) {
  const BRAND_NAME = 'BITEGIT';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildFooter() {
    return `
<tr><td style="padding:24px 28px 28px;border-top:1px solid #f0f0f0;background:#fafafa;">
  <p style="margin:0 0 4px;font-size:13px;color:#444;">Any question or in need of help?</p>
  <p style="margin:0 0 4px;font-size:13px;color:#444;">You can refer to <a href="https://bitegit.com/support" style="color:#00b8d4;text-decoration:none;">Help center</a> or send email <a href="mailto:support@bitegit.com" style="color:#00b8d4;text-decoration:none;">support@bitegit.com</a> to contact us</p>
  <p style="margin:0 0 14px;font-size:13px;color:#444;">Follow our <a href="#" style="color:#00b8d4;text-decoration:none;">X(Twitter)</a> for more ${BRAND_NAME} updates.</p>
  <p style="margin:0 0 18px;font-size:12px;color:#888;">* This email is sent automatically and you do not need to reply.</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr><td style="border-left:3px solid #00b8d4;padding-left:12px;"><span style="font-size:13px;color:#444;font-weight:600;">Anti-Phishing Code :</span></td></tr></table>
  <p style="margin:0 0 16px;font-size:15px;color:#111;font-weight:700;text-align:center;">Download the <strong>${BRAND_NAME}</strong> App now<br/><span style="font-weight:400;font-size:14px;color:#555;">Stay updated on the go!</span></p>
  <table cellpadding="0" cellspacing="0" style="margin-bottom:22px;margin-left:auto;margin-right:auto;"><tr>
    <td style="padding-right:12px;"><a href="#" style="display:inline-flex;align-items:center;gap:10px;background:#000;border-radius:10px;padding:10px 18px;text-decoration:none;border:1px solid #333;min-width:160px;"><svg width="22" height="24" viewBox="0 0 24 27" xmlns="http://www.w3.org/2000/svg"><path d="M1.22 0C.9.17.5.56.5 1.25v24.5c0 .69.4 1.08.72 1.25l13.54-13.5L1.22 0z" fill="#4285F4"/><path d="M18.86 9.25L14.76 13.5l4.1 4.25 4.72-2.7c1.35-.77 1.35-2.03 0-2.8l-4.72-3z" fill="#FBBC04"/><path d="M14.76 13.5L1.22 27c.32.17.74.13 1.2-.13l14.98-8.62-2.64-4.75z" fill="#EA4335"/><path d="M14.76 13.5l2.64-4.75L2.42.13C1.96-.13 1.54-.17 1.22 0l13.54 13.5z" fill="#34A853"/></svg><span><span style="display:block;font-size:9px;color:#ccc;letter-spacing:0.5px;line-height:1.2;">GET IT ON</span><span style="display:block;font-size:17px;color:#fff;font-weight:600;line-height:1.3;font-family:Arial,sans-serif;">Google Play</span></span></a></td>
    <td><a href="#" style="display:inline-flex;align-items:center;gap:10px;background:#000;border-radius:10px;padding:10px 18px;text-decoration:none;border:1px solid #333;min-width:160px;"><svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg><span><span style="display:block;font-size:9px;color:#ccc;letter-spacing:0.5px;line-height:1.2;">Download on the</span><span style="display:block;font-size:17px;color:#fff;font-weight:600;line-height:1.3;font-family:Arial,sans-serif;">App Store</span></span></a></td>
  </tr></table>
  <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr>
    <td style="padding-right:10px;"><a href="https://bitegit.com" style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#e8e8e8;border-radius:50%;text-decoration:none;"><svg width="16" height="16" viewBox="0 0 24 24" fill="#555"><path d="M12 2L4 7v5c0 5.25 3.4 10.15 8 11.5C16.6 22.15 20 17.25 20 12V7L12 2z"/></svg></a></td>
    <td style="padding-right:10px;"><a href="#" style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#e8e8e8;border-radius:50%;text-decoration:none;"><svg width="16" height="16" viewBox="0 0 24 24" fill="#555"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.012 9.486c-.147.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L6.162 14.35l-2.955-.924c-.642-.2-.654-.642.136-.951l11.54-4.45c.537-.194 1.006.131.679.223z"/></svg></a></td>
    <td style="padding-right:10px;"><a href="#" style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#e8e8e8;border-radius:50%;text-decoration:none;"><svg width="16" height="16" viewBox="0 0 24 24" fill="#555"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg></a></td>
    <td style="padding-right:10px;"><a href="#" style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#e8e8e8;border-radius:50%;text-decoration:none;"><svg width="16" height="16" viewBox="0 0 24 24" fill="#555"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a></td>
    <td style="padding-right:10px;"><a href="#" style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#e8e8e8;border-radius:50%;text-decoration:none;"><svg width="16" height="16" viewBox="0 0 24 24" fill="#555"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a></td>
    <td style="padding-right:10px;"><a href="#" style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#e8e8e8;border-radius:50%;text-decoration:none;"><svg width="16" height="16" viewBox="0 0 24 24" fill="#555"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg></a></td>
    <td><a href="#" style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;background:#e8e8e8;border-radius:50%;text-decoration:none;"><svg width="16" height="16" viewBox="0 0 24 24" fill="#555"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a></td>
  </tr></table>
  <p style="margin:0 0 8px;font-size:12px;color:#888;line-height:1.6;">Note: Online support and staff of ${BRAND_NAME} will never require your account's private information in any mail or communication and social tools, so please do not reveal your account information to anyone. Please contact us via above methods if you encounter any suspicious situation.</p>
  <p style="margin:0;font-size:12px;color:#888;">@2018-${new Date().getFullYear()} ${BRAND_NAME}.com reserves all rights.</p>
</td></tr>`;
  }

  function buildHeader() {
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>P2P Order</title></head><body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 12px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:4px;overflow:hidden;">
<tr><td style="padding:24px 28px 0;text-align:center;"><table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="padding-right:8px;vertical-align:middle;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 3L5 9v4c0 4.4 3.4 8.5 8 9.9C18.6 21.5 22 17.4 22 13V9L13 3z" fill="#00b8d4" opacity="0.25"/><path d="M9 12l2 2 4-4" stroke="#00b8d4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></td><td style="font-size:22px;font-weight:800;color:#00b8d4;letter-spacing:1px;vertical-align:middle;">${BRAND_NAME}</td></tr></table><div style="width:100%;height:3px;background:linear-gradient(90deg,transparent 0%,#00b8d4 30%,#00b8d4 70%,transparent 100%);margin-top:16px;"></div></td></tr>`;
  }

  function buildDetailsBox(order) {
    const creationTime = order.createdAt
      ? new Date(order.createdAt).toISOString().replace('T', ' ').slice(0, 19) + '(UTC+0)'
      : new Date().toISOString().replace('T', ' ').slice(0, 19) + '(UTC+0)';
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

  // Buyer email: order placed, seller funds locked
  async function sendOrderConfirmation(email, order) {
    try {
      if (!resend || !fromEmail) return { delivered: false, reason: 'not_configured' };
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      const subject = `[${BRAND_NAME}] [P2P] New Order Confirmation`;
      const html = buildHeader() + `
<tr><td style="padding:28px 28px 0;">
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111;">[P2P] New Order Confirmation</h1>
  <p style="margin:0 0 14px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:#333;line-height:1.7;">Your buy order <strong style="color:#00b8d4;">${escapeHtml(String(order.id || ''))}</strong> has been created and the seller's funds have been locked. Please complete the order promptly as it will be automatically cancelled after <strong>20 minutes</strong>.</p>
  ${buildDetailsBox(order)}
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/p2p" style="color:#00b8d4;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 28px;font-size:13px;color:#555;">If you do not recognize this activity, please <a href="https://bitegit.com/support" style="color:#00b8d4;text-decoration:none;">disable account</a>. The link is valid for 10 minutes only.</p>
  <p style="margin:0 0 4px;font-size:13px;color:#333;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:#888;">Please do not reply to this email</p>
</td></tr>
${buildFooter()}
</table></td></tr></table></body></html>`;
      await resend.emails.send({ from: fromEmail, to: email, subject, html });
      return { delivered: true };
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // Seller emails: new order received (wait) OR payment sent (release crypto)
  async function sendOrderUpdate(email, order, status) {
    try {
      if (!resend || !fromEmail) return { delivered: false, reason: 'not_configured' };
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');

      let subject, bodyContent;

      if (status === 'new_order_seller') {
        // Order just created — seller just needs to wait
        subject = `[${BRAND_NAME}] [P2P] New Order Received`;
        bodyContent = `
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111;">[P2P] New Order Received</h1>
          <p style="margin:0 0 14px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
          <p style="margin:0 0 18px;font-size:14px;color:#333;line-height:1.7;">A buyer has placed order <strong style="color:#00b8d4;">${escapeHtml(String(order.id || ''))}</strong>. Your funds have been locked in escrow. Please wait for the buyer to complete payment — once they confirm, you will receive another email to release the crypto.</p>
          ${buildDetailsBox(order)}
          <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/p2p" style="color:#00b8d4;text-decoration:none;font-weight:600;">View Details</a></p>
          <p style="margin:0 0 28px;font-size:13px;color:#555;">If you do not recognize this activity, please <a href="https://bitegit.com/support" style="color:#00b8d4;text-decoration:none;">disable account</a>. The link is valid for 10 minutes only.</p>
          <p style="margin:0 0 4px;font-size:13px;color:#333;">${BRAND_NAME} Team</p>
          <p style="margin:0 0 28px;font-size:12px;color:#888;">Please do not reply to this email</p>`;

      } else if (status === 'payment_sent_seller') {
        // Buyer marked payment as sent — seller must release crypto NOW
        subject = `[${BRAND_NAME}] [P2P] Action Required — Release Crypto`;
        bodyContent = `
          <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
            <span style="font-size:20px;margin-right:8px;">⚠️</span>
            <span style="font-size:14px;font-weight:700;color:#856404;">Action Required — Buyer has sent payment!</span>
          </div>
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111;">[P2P] Release Crypto</h1>
          <p style="margin:0 0 14px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
          <p style="margin:0 0 18px;font-size:14px;color:#333;line-height:1.7;">The buyer has confirmed payment for order <strong style="color:#00b8d4;">${escapeHtml(String(order.id || ''))}</strong>. Please verify payment in your bank/UPI account and <strong>release the crypto</strong> to complete the trade.</p>
          ${buildDetailsBox(order)}
          <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/p2p" style="color:#00b8d4;text-decoration:none;font-weight:600;">Go to Order &rarr; Release Crypto</a></p>
          <p style="margin:0 0 28px;font-size:13px;color:#888;">Do NOT release crypto until you have verified payment in your account.</p>
          <p style="margin:0 0 4px;font-size:13px;color:#333;">${BRAND_NAME} Team</p>
          <p style="margin:0 0 28px;font-size:12px;color:#888;">Please do not reply to this email</p>`;

      } else {
        // Generic status update
        subject = `[${BRAND_NAME}] [P2P] Order Update`;
        bodyContent = `
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111;">[P2P] Order Update</h1>
          <p style="margin:0 0 14px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
          <p style="margin:0 0 18px;font-size:14px;color:#333;line-height:1.7;">Your P2P order <strong style="color:#00b8d4;">${escapeHtml(String(order.id || ''))}</strong> status has been updated to: <strong style="color:#00b8d4;">${escapeHtml(String(status || ''))}</strong>.</p>
          ${buildDetailsBox(order)}
          <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/p2p" style="color:#00b8d4;text-decoration:none;font-weight:600;">View Details</a></p>
          <p style="margin:0 0 4px;font-size:13px;color:#333;">${BRAND_NAME} Team</p>
          <p style="margin:0 0 28px;font-size:12px;color:#888;">Please do not reply to this email</p>`;

      const html = buildHeader() + `<tr><td style="padding:28px 28px 0;">${bodyContent}</td></tr>` + buildFooter() + `</table></td></tr></table></body></html>`;
      await resend.emails.send({ from: fromEmail, to: email, subject, html });
      return { delivered: true };
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  // 5-minute payment reminder alert to buyer
  async function sendPaymentReminderEmail(email, order) {
    try {
      if (!resend || !fromEmail) return { delivered: false, reason: 'not_configured' };
      const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
      const subject = `[${BRAND_NAME}] [P2P] Confirm Payment — 5 Minutes Left!`;
      const creationTime = order.createdAt
        ? new Date(order.createdAt).toISOString().replace('T', ' ').slice(0, 19) + '(UTC+0)'
        : new Date().toISOString().replace('T', ' ').slice(0, 19) + '(UTC+0)';
      const html = buildHeader() + `
<tr><td style="padding:28px 28px 0;">
  <!-- Alert banner -->
  <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;">
    <span style="font-size:22px;margin-right:10px;">⚠️</span>
    <span style="font-size:14px;font-weight:700;color:#856404;">Action Required — Only 5 Minutes Remaining!</span>
  </div>
  <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#111;">[P2P] Confirm Payment</h1>
  <p style="margin:0 0 14px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:14px;color:#333;line-height:1.7;">You have a P2P order: <strong style="color:#00b8d4;">${escapeHtml(String(order.id || ''))}</strong> that needs payment confirmation within the next <strong style="color:#e53935;">5 minutes</strong>, otherwise the order will be canceled.</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
    <tr><td style="background:#f8f8f8;border-radius:6px;padding:18px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:6px 0;font-size:14px;color:#333;width:160px;vertical-align:top;">Order ID:</td><td style="padding:6px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(String(order.id || 'N/A'))}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#333;vertical-align:top;">Trade amount:</td><td style="padding:6px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(String(order.cryptoAmount || '0'))} ${escapeHtml(String(order.asset || 'USDT'))}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#333;vertical-align:top;">Transaction amount:</td><td style="padding:6px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(String(order.fiatAmount || '0'))} ${escapeHtml(String(order.fiatCurrency || 'INR'))}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#333;vertical-align:top;">Created at:</td><td style="padding:6px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(creationTime)}</td></tr>
      </table>
    </td></tr>
  </table>
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/p2p" style="color:#00b8d4;text-decoration:none;font-weight:600;">View Details</a></p>
  <p style="margin:0 0 28px;font-size:13px;color:#555;">If you do not recognize this activity, please <a href="https://bitegit.com/support" style="color:#00b8d4;text-decoration:none;">disable account</a>. The link is valid for 10 minutes only.</p>
  <p style="margin:0 0 4px;font-size:13px;color:#333;">${BRAND_NAME} Team</p>
  <p style="margin:0 0 28px;font-size:12px;color:#888;">Please do not reply to this email</p>
</td></tr>
${buildFooter()}
</table></td></tr></table></body></html>`;
      await resend.emails.send({ from: fromEmail, to: email, subject, html });
      return { delivered: true };
    } catch (e) {
      return { delivered: false, reason: e.message };
    }
  }

  return { sendOrderConfirmation, sendOrderUpdate, sendPaymentReminderEmail };
}

module.exports = { createP2PEmailService };
