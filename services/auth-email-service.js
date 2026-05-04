const nodemailer = require('nodemailer');

const BRAND_NAME = String(process.env.APP_NAME || 'BITEGIT')
  .trim()
  .toUpperCase();
const BRAND_ACCENT = '#f0b90b';
const BRAND_DARK = '#181a20';
let providerConfigLogged = false;

function firstNonEmptyEnv(...values) {
  for (const value of values) {
    const normalized = String(value || '').trim();
    if (normalized) {
      return normalized;
    }
  }
  return '';
}

function escapeHtml(input) {
  return String(input || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildEmailShell({ title, subtitle, bodyHtml }) {
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;color:#111;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 12px;">
      <tr>
        <td align="center">
          <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border:1px solid #e5e7eb;">
            <tr>
              <td style="background:${BRAND_DARK};padding:20px 28px;">
                <div style="font-size:32px;font-weight:800;letter-spacing:0.5px;color:${BRAND_ACCENT};">${BRAND_NAME}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 10px;font-size:34px;line-height:1.1;color:#111;">${escapeHtml(title)}</h1>
                <p style="margin:0 0 22px;font-size:16px;line-height:1.5;color:#374151;">${escapeHtml(subtitle)}</p>
                ${bodyHtml}
                <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:#4b5563;"><em>This is an automated message, please do not reply.</em></p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;border-top:1px solid #e5e7eb;">
                <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:#4b5563;">
                  Keep your account secure. Never share verification codes with anyone.
                </p>
                <p style="margin:0;font-size:12px;line-height:1.5;color:#6b7280;">
                  © ${new Date().getUTCFullYear()} ${BRAND_NAME}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

function resolveTransportConfig() {
  const resendApiKey = firstNonEmptyEnv(process.env.RESEND_API_KEY, process.env.RESEND);
  const resendFromEmail = firstNonEmptyEnv(
    process.env.RESEND_FROM_EMAIL,
    process.env.MAIL_FROM,
    process.env.SMTP_FROM_EMAIL
  );
  const smtpHost = firstNonEmptyEnv(process.env.SMTP_HOST);
  const smtpPortRaw = String(process.env.SMTP_PORT || '').trim();
  const smtpUser = firstNonEmptyEnv(process.env.SMTP_USER);
  const smtpPass = firstNonEmptyEnv(process.env.SMTP_PASS);
  const smtpFromEmail = firstNonEmptyEnv(process.env.SMTP_FROM_EMAIL, process.env.MAIL_FROM);
  const smtpSecureRaw = String(process.env.SMTP_SECURE || '')
    .trim()
    .toLowerCase();
  const gmailUser = firstNonEmptyEnv(process.env.GMAIL_USER);
  const gmailAppPassword = firstNonEmptyEnv(process.env.GMAIL_APP_PASSWORD);

  if (!providerConfigLogged) {
    providerConfigLogged = true;
    console.log('[auth-email] runtime provider env detection', {
      hasResendApiKey: Boolean(resendApiKey),
      hasResendFromEmail: Boolean(resendFromEmail),
      hasResendAliasKey: Boolean(String(process.env.RESEND || '').trim()),
      hasMailFromAlias: Boolean(String(process.env.MAIL_FROM || '').trim()),
      hasSmtpHost: Boolean(smtpHost),
      hasSmtpUser: Boolean(smtpUser),
      hasSmtpPass: Boolean(smtpPass),
      hasSmtpFromEmail: Boolean(smtpFromEmail),
      hasGmailUser: Boolean(gmailUser),
      hasGmailAppPassword: Boolean(gmailAppPassword),
      nodeEnv: String(process.env.NODE_ENV || 'development')
    });
  }

  if (resendApiKey && resendFromEmail) {
    return {
      provider: 'resend',
      resendApiKey,
      fromEmail: resendFromEmail
    };
  }

  if (smtpHost && smtpUser && smtpPass) {
    const parsedPort = Number.parseInt(smtpPortRaw || '587', 10);
    const smtpPort = Number.isFinite(parsedPort) ? parsedPort : 587;
    const secure = smtpSecureRaw ? smtpSecureRaw === 'true' : smtpPort === 465;
    return {
      provider: 'smtp',
      transporter: nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      }),
      fromEmail: smtpFromEmail || smtpUser
    };
  }

  if (gmailUser && gmailAppPassword) {
    return {
      provider: 'gmail',
      transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailAppPassword
        }
      }),
      fromEmail: gmailUser
    };
  }

  return { provider: 'none', fromEmail: '' };
}

async function sendViaProvider({ to, subject, text, html }) {
  const cfg = resolveTransportConfig();
  if (cfg.provider === 'none' || !cfg.fromEmail) {
    return { delivered: false, reason: 'missing_email_provider_config' };
  }

  if (cfg.provider === 'resend') {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfg.resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: cfg.fromEmail,
          to: [to],
          subject,
          html,
          text
        })
      });

      if (response.ok) {
        return { delivered: true, reason: 'sent_via_resend' };
      }
      const errorText = await response.text();
      return { delivered: false, reason: `resend_error:${errorText}` };
    } catch (error) {
      return { delivered: false, reason: `resend_error:${error.message}` };
    }
  }

  try {
    await cfg.transporter.sendMail({
      from: cfg.fromEmail,
      to,
      subject,
      text,
      html
    });
    return { delivered: true, reason: `sent_via_${cfg.provider}` };
  } catch (error) {
    return { delivered: false, reason: `smtp_error:${error.message}` };
  }
}

function buildBitegitHeader() {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head><body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 12px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:4px;overflow:hidden;"><tr><td style="padding:24px 28px 0;text-align:center;"><table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="padding-right:6px;vertical-align:middle;"><table cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr><td style="width:10px;height:10px;background:#00b8d4;border-radius:50%;"></td><td style="width:5px;"></td><td style="width:10px;height:10px;background:#00b8d4;border-radius:2px;"></td></tr></table></td><td style="font-size:22px;font-weight:800;color:#00b8d4;letter-spacing:1px;vertical-align:middle;">${BRAND_NAME}</td></tr></table><div style="width:100%;height:3px;background:linear-gradient(90deg,transparent 0%,#00b8d4 30%,#00b8d4 70%,transparent 100%);margin-top:16px;"></div></td></tr>`;
}

function buildBitegitFooter() {
  const year = new Date().getFullYear();
  return `<tr><td style="padding:24px 28px 28px;border-top:1px solid #f0f0f0;background:#fafafa;">
<p style="margin:0 0 4px;font-size:13px;color:#444;">Any question or in need of help?</p>
<p style="margin:0 0 4px;font-size:13px;color:#444;">You can refer to <a href="https://bitegit.com/support" style="color:#00b8d4;text-decoration:none;">Help center</a> or send email <a href="mailto:support@bitegit.com" style="color:#00b8d4;text-decoration:none;">support@bitegit.com</a> to contact us</p>
<p style="margin:0 0 14px;font-size:13px;color:#444;">Follow our <a href="https://twitter.com/bitegit" style="color:#00b8d4;text-decoration:none;">X(Twitter)</a> for more ${BRAND_NAME} updates.</p>
<p style="margin:0 0 18px;font-size:12px;color:#888;">* This email is sent automatically and you do not need to reply.</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr><td style="border-left:3px solid #00b8d4;padding-left:12px;"><span style="font-size:13px;color:#444;font-weight:600;">Anti-Phishing Code :</span></td></tr></table>
<p style="margin:0 0 14px;font-size:15px;color:#111;font-weight:700;text-align:center;">Download the <strong>${BRAND_NAME}</strong> App now<br/><span style="font-weight:400;font-size:14px;color:#555;">Stay updated on the go!</span></p>
<table cellpadding="0" cellspacing="0" style="margin:0 auto 22px auto;"><tr>
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
</tr></table>
<table cellpadding="0" cellspacing="0" style="margin:0 auto 20px auto;"><tr>
  <td style="padding-right:8px;"><a href="https://bitegit.com" style="display:inline-block;width:32px;height:32px;background:#00b8d4;border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:11px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">B</a></td>
  <td style="padding-right:8px;"><a href="#" style="display:inline-block;width:32px;height:32px;background:#229ED9;border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:11px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">TG</a></td>
  <td style="padding-right:8px;"><a href="#" style="display:inline-block;width:32px;height:32px;background:#1877F2;border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:11px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">f</a></td>
  <td style="padding-right:8px;"><a href="#" style="display:inline-block;width:32px;height:32px;background:#000;border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:12px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">X</a></td>
  <td style="padding-right:8px;"><a href="#" style="display:inline-block;width:32px;height:32px;background:#FF0000;border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:11px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">YT</a></td>
  <td style="padding-right:8px;"><a href="#" style="display:inline-block;width:32px;height:32px;background:#E1306C;border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:10px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">IG</a></td>
  <td><a href="#" style="display:inline-block;width:32px;height:32px;background:#0A66C2;border-radius:50%;text-align:center;text-decoration:none;line-height:32px;font-size:10px;font-weight:700;color:#fff;font-family:Arial,sans-serif;">in</a></td>
</tr></table>
<p style="margin:0 0 8px;font-size:12px;color:#888;line-height:1.6;">Note: Online support and staff of ${BRAND_NAME} will never require your account's private information in any mail or communication and social tools, so please do not reveal your account information to anyone.</p>
<p style="margin:0;font-size:12px;color:#888;">@2018-${year} ${BRAND_NAME}.com reserves all rights.</p>
</td></tr></table></td></tr></table></body></html>`;
}

function createOtpTemplate({ title, code, expiresInMinutes, note, maskedEmail = '' }) {
  return buildBitegitHeader() + `
<tr><td style="padding:28px 28px 0;">
  <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#111;">${escapeHtml(title)}</h1>
  ${maskedEmail ? `<p style="margin:0 0 18px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>` : ''}
  <p style="margin:0 0 16px;font-size:14px;color:#333;">Your verification code is:</p>
  <div style="text-align:center;margin-bottom:20px;">
    <div style="display:inline-block;background:#f0fffe;border:2px solid #00b8d4;border-radius:10px;padding:14px 32px;font-size:36px;font-weight:800;letter-spacing:8px;color:#00b8d4;">
      ${escapeHtml(String(code))}
    </div>
  </div>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
    <tr><td style="background:#f8f8f8;border-radius:6px;padding:14px 18px;">
      <p style="margin:0 0 6px;font-size:13px;color:#333;">⏱ Valid for: <strong style="color:#00b8d4;">${Number(expiresInMinutes)} minutes</strong></p>
      <p style="margin:0;font-size:13px;color:#888;">🔒 ${escapeHtml(note)}</p>
    </td></tr>
  </table>
  <p style="margin:0 0 28px;font-size:13px;color:#888;">* This email is sent automatically and you do not need to reply.</p>
</td></tr>
` + buildBitegitFooter();
}

function createNewDeviceTemplate({ email, loginTimeUtc, ipAddress, userAgent, location }) {
  const maskedEmail = String(email).replace(/^(.{4}).*(@.*)$/, '$1****$2');
  return buildBitegitHeader() + `
<tr><td style="padding:28px 28px 0;">
  <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:8px;padding:14px 18px;margin-bottom:20px;">
    <span style="font-size:20px;margin-right:8px;">⚠️</span>
    <span style="font-size:14px;font-weight:700;color:#856404;">New Device or Location Login Detected</span>
  </div>
  <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:#111;">New Device Login Alert</h1>
  <p style="margin:0 0 18px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 16px;font-size:14px;color:#333;line-height:1.7;">We detected a login to your account from a new device or IP address. If this was you, no action is needed. If not, <strong style="color:#e53935;">reset your password immediately.</strong></p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
    <tr><td style="background:#f8f8f8;border-radius:6px;padding:18px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:6px 0;font-size:14px;color:#333;width:130px;vertical-align:top;">Login time:</td><td style="padding:6px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(loginTimeUtc)}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#333;vertical-align:top;">IP Address:</td><td style="padding:6px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(ipAddress)}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#333;vertical-align:top;">Device:</td><td style="padding:6px 0;font-size:14px;color:#00b8d4;font-weight:500;word-break:break-all;">${escapeHtml(userAgent)}</td></tr>
        <tr><td style="padding:6px 0;font-size:14px;color:#333;vertical-align:top;">Location:</td><td style="padding:6px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(location)}</td></tr>
      </table>
    </td></tr>
  </table>
  <p style="margin:0 0 10px;font-size:14px;"><a href="https://bitegit.com/support" style="color:#00b8d4;text-decoration:none;font-weight:600;">Secure my account</a></p>
  <p style="margin:0 0 28px;font-size:13px;color:#888;">* This email is sent automatically and you do not need to reply.</p>
</td></tr>
` + buildBitegitFooter();
}

function createAuthEmailService() {
  async function sendSignupOtpEmail(email, code, { expiresInMinutes = 10 } = {}) {
    const subject = `[${BRAND_NAME}] Signup Verification - ${new Date().toISOString().replace('T', ' ').replace('Z', ' (UTC)')}`;
    const text = `Your ${BRAND_NAME} signup verification code is ${code}. It is valid for ${expiresInMinutes} minutes.`;
    const html = createOtpTemplate({
      title: 'Signup Verification',
      code,
      expiresInMinutes,
      note: 'Do not share this code with anyone.'
    });
    return sendViaProvider({ to: email, subject, text, html });
  }

  async function sendForgotPasswordOtpEmail(email, code, { expiresInMinutes = 10 } = {}) {
    const subject = `[${BRAND_NAME}] Password Reset Verification - ${new Date().toISOString().replace('T', ' ').replace('Z', ' (UTC)')}`;
    const text = `Your ${BRAND_NAME} password reset code is ${code}. It is valid for ${expiresInMinutes} minutes.`;
    const html = createOtpTemplate({
      title: 'Password Reset Verification',
      code,
      expiresInMinutes,
      note: 'If you did not request this, secure your account immediately.'
    });
    return sendViaProvider({ to: email, subject, text, html });
  }

  async function sendLoginOtpEmail(email, code, { expiresInMinutes = 10 } = {}) {
    const subject = `[${BRAND_NAME}] Login Verification - ${new Date().toISOString().replace('T', ' ').replace('Z', ' (UTC)')}`;
    const text = `Your ${BRAND_NAME} login verification code is ${code}. It is valid for ${expiresInMinutes} minutes.`;
    const html = createOtpTemplate({
      title: 'Login Verification',
      code,
      expiresInMinutes,
      note: 'Never share this code with anyone, including support.'
    });
    return sendViaProvider({ to: email, subject, text, html });
  }

  async function sendNewDeviceLoginAlert(email, metadata = {}) {
    const loginTimeUtc = metadata.loginTimeUtc || new Date().toISOString().replace('T', ' ').replace('Z', ' (UTC)');
    const ipAddress = metadata.ipAddress || 'Unknown';
    const userAgent = metadata.userAgent || 'Unknown';
    const location = metadata.location || 'Unknown';
    const subject = `[${BRAND_NAME}] New Device or IP Login Alert - ${new Date().toISOString().replace('T', ' ').replace('Z', ' (UTC)')}`;
    const text = `New login detected.\nEmail: ${email}\nTime: ${loginTimeUtc}\nIP: ${ipAddress}\nDevice: ${userAgent}\nLocation: ${location}`;
    const html = createNewDeviceTemplate({
      email,
      loginTimeUtc,
      ipAddress,
      userAgent,
      location
    });
    return sendViaProvider({ to: email, subject, text, html });
  }

  async function sendDepositSuccessEmail(email, summary = {}) {
    const amount = Number(summary.amount || 0);
    const asset = String(summary.asset || 'USDT').toUpperCase();
    const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
    const depositTime = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const subject = `[${BRAND_NAME}] ${asset} Deposit Successful`;
    const text = `${asset} Deposit Successful. Amount: ${amount} ${asset}.`;
    const html = buildBitegitHeader() + `
<tr><td style="padding:28px 28px 0;">
  <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#111;">Deposit successful</h1>
  <p style="margin:0 0 18px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
    <tr><td style="background:#f8f8f8;border-radius:6px;padding:18px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:7px 0;font-size:14px;color:#333;white-space:nowrap;width:155px;vertical-align:top;">Transaction time:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(depositTime)}</td></tr>
        <tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">Crypto received:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;">${amount.toLocaleString(undefined,{maximumFractionDigits:8})} ${escapeHtml(asset)}</td></tr>
      </table>
    </td></tr>
  </table>
  <p style="margin:0 0 28px;font-size:14px;color:#444;">Go to your assets to check for details.</p>
</td></tr>
` + buildBitegitFooter();
    return sendViaProvider({ to: email, subject, text, html });
  }

  async function sendWithdrawalSuccessEmail(email, summary = {}) {
    const amount = Number(summary.amount || 0);
    const asset = String(summary.asset || 'USDT').toUpperCase();
    const address = String(summary.address || 'N/A');
    const txId = String(summary.transactionId || 'N/A');
    const fee = Number(summary.fee || 0);
    const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
    const withdrawalTime = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    const subject = `[${BRAND_NAME}] ${asset} Withdrawal Successful`;
    const text = `${asset} Withdrawal Successful. Amount: ${amount} ${asset}. Address: ${address}. TxId: ${txId}`;
    const html = buildBitegitHeader() + `
<tr><td style="padding:28px 28px 0;">
  <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#111;">Withdrawal successful</h1>
  <p style="margin:0 0 18px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
  <p style="margin:0 0 18px;font-size:15px;color:#333;line-height:1.6;">Withdrawal has been successful. Check the details below:</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
    <tr><td style="background:#f8f8f8;border-radius:6px;padding:18px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:7px 0;font-size:14px;color:#333;white-space:nowrap;width:155px;vertical-align:top;">Withdrawal time:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(withdrawalTime)}</td></tr>
        <tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">Amount:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;">${amount.toLocaleString(undefined,{maximumFractionDigits:8})} ${escapeHtml(asset)}</td></tr>
        <tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">Withdrawal address:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;word-break:break-all;">${escapeHtml(address)}</td></tr>
        <tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">TxID:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;word-break:break-all;">${escapeHtml(txId)}</td></tr>
        ${fee > 0 ? `<tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">Transaction fees:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;">${fee} ${escapeHtml(asset)}</td></tr>` : ''}
      </table>
    </td></tr>
  </table>
  <p style="margin:0 0 28px;font-size:13px;color:#888;">*This is an automated email notification.</p>
</td></tr>
` + buildBitegitFooter();
    return sendViaProvider({ to: email, subject, text, html });
  }

  return {
    sendSignupOtpEmail,
    sendForgotPasswordOtpEmail,
    sendLoginOtpEmail,
    sendNewDeviceLoginAlert,
    sendDepositSuccessEmail,
    sendWithdrawalSuccessEmail
  };
}

module.exports = {
  createAuthEmailService
};
