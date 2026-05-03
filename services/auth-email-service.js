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

function createOtpTemplate({ title, code, expiresInMinutes, note }) {
  const safeCode = escapeHtml(code);
  const safeNote = escapeHtml(note);
  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#111;">Your verification code:</p>
    <div style="display:inline-block;background:#fff7d1;border:1px solid #f0b90b;border-radius:8px;padding:10px 16px;font-size:32px;font-weight:800;letter-spacing:3px;color:#111;">
      ${safeCode}
    </div>
    <p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#111;">
      This code is valid for <strong>${Number(expiresInMinutes)} minutes</strong>.
    </p>
    <p style="margin:8px 0 0;font-size:15px;line-height:1.7;color:#111;">${safeNote}</p>
  `;

  return buildEmailShell({
    title,
    subtitle: 'Security verification required',
    bodyHtml
  });
}

function createNewDeviceTemplate({ email, loginTimeUtc, ipAddress, userAgent, location }) {
  const bodyHtml = `
    <h2 style="margin:0 0 14px;font-size:30px;line-height:1.15;color:#111;">New Device or IP Login Detected</h2>
    <p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#111;">
      We detected a login attempt for <strong>${escapeHtml(email)}</strong> from a new device or IP address.
      If this was not you, reset your password immediately.
    </p>
    <table cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.8;color:#111;">
      <tr><td style="padding-right:10px;"><strong>Time:</strong></td><td>${escapeHtml(loginTimeUtc)}</td></tr>
      <tr><td style="padding-right:10px;"><strong>Device:</strong></td><td>${escapeHtml(userAgent)}</td></tr>
      <tr><td style="padding-right:10px;"><strong>IP Address:</strong></td><td>${escapeHtml(ipAddress)}</td></tr>
      <tr><td style="padding-right:10px;"><strong>Location:</strong></td><td>${escapeHtml(location)}</td></tr>
    </table>
  `;

  return buildEmailShell({
    title: 'New Device Login Alert',
    subtitle: 'Review your recent account activity',
    bodyHtml
  });
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
    const depositTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Shanghai', hour12: false }).replace(',', '');
    const subject = `[${BRAND_NAME}] ${asset} Deposit Successful`;
    const text = `${asset} Deposit Successful. Amount: ${amount} ${asset}.`;
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Deposit Successful</title></head><body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 12px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:4px;overflow:hidden;">
<tr><td style="padding:24px 28px 0;text-align:center;"><table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="padding-right:8px;vertical-align:middle;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 3L5 9v4c0 4.4 3.4 8.5 8 9.9C18.6 21.5 22 17.4 22 13V9L13 3z" fill="#00b8d4" opacity="0.25"/><path d="M9 12l2 2 4-4" stroke="#00b8d4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></td><td style="font-size:22px;font-weight:800;color:#00b8d4;letter-spacing:1px;vertical-align:middle;">${BRAND_NAME}</td></tr></table><div style="width:100%;height:3px;background:linear-gradient(90deg,transparent 0%,#00b8d4 30%,#00b8d4 70%,transparent 100%);margin-top:16px;"></div></td></tr>
<tr><td style="padding:28px 28px 0;"><h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#111;">Deposit successful</h1><p style="margin:0 0 18px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;"><tr><td style="background:#f8f8f8;border-radius:6px;padding:18px 20px;"><table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:7px 0;font-size:14px;color:#333;white-space:nowrap;width:155px;vertical-align:top;">Transaction time:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;">UTC+8 ${escapeHtml(depositTime)}</td></tr>
<tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">Crypto received:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;">${amount.toLocaleString(undefined,{maximumFractionDigits:8})} ${escapeHtml(asset)}</td></tr>
</table></td></tr></table>
<p style="margin:0 0 28px;font-size:14px;color:#444;">Go to your assets to check for details.</p></td></tr>
<tr><td style="padding:24px 28px 28px;border-top:1px solid #f0f0f0;background:#fafafa;"><p style="margin:0 0 4px;font-size:13px;color:#444;">Any question or in need of help?</p><p style="margin:0 0 4px;font-size:13px;color:#444;">You can refer to <a href="https://bitegit.com/support" style="color:#00b8d4;text-decoration:none;">Help center</a> or send email <a href="mailto:support@bitegit.com" style="color:#00b8d4;text-decoration:none;">support@bitegit.com</a> to contact us</p><p style="margin:0 0 14px;font-size:13px;color:#444;">Follow our <a href="https://twitter.com/bitegit" style="color:#00b8d4;text-decoration:none;">X(Twitter)</a> for more ${BRAND_NAME} updates.</p><p style="margin:0 0 18px;font-size:12px;color:#888;">* This email is sent automatically and you do not need to reply.</p>
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
</td></tr></table></td></tr></table></body></html>`;
    return sendViaProvider({ to: email, subject, text, html });
  }

  async function sendWithdrawalSuccessEmail(email, summary = {}) {
    const amount = Number(summary.amount || 0);
    const asset = String(summary.asset || 'USDT').toUpperCase();
    const address = String(summary.address || 'N/A');
    const txId = String(summary.transactionId || 'N/A');
    const fee = String(summary.fee || '0.15');
    const maskedEmail = email.replace(/^(.{4}).*(@.*)$/, '$1****$2');
    const withdrawalTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Shanghai', hour12: false }).replace(',', '');
    const subject = `[${BRAND_NAME}] ${asset} Withdrawal Successful`;
    const text = `${asset} Withdrawal Successful. Amount: ${amount} ${asset}. Address: ${address}. TxId: ${txId}`;
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Withdrawal Successful</title></head><body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 12px;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:4px;overflow:hidden;">
<tr><td style="padding:24px 28px 0;text-align:center;"><table cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td style="padding-right:8px;vertical-align:middle;"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 3L5 9v4c0 4.4 3.4 8.5 8 9.9C18.6 21.5 22 17.4 22 13V9L13 3z" fill="#00b8d4" opacity="0.25"/><path d="M9 12l2 2 4-4" stroke="#00b8d4" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></td><td style="font-size:22px;font-weight:800;color:#00b8d4;letter-spacing:1px;vertical-align:middle;">${BRAND_NAME}</td></tr></table><div style="width:100%;height:3px;background:linear-gradient(90deg,transparent 0%,#00b8d4 30%,#00b8d4 70%,transparent 100%);margin-top:16px;"></div></td></tr>
<tr><td style="padding:28px 28px 0;"><h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#111;">Withdrawal successful</h1><p style="margin:0 0 18px;font-size:14px;color:#555;">Hi ${escapeHtml(maskedEmail)},</p><p style="margin:0 0 18px;font-size:15px;color:#333;line-height:1.6;">Withdrawal has been successful. Check the details below:</p>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;"><tr><td style="background:#f8f8f8;border-radius:6px;padding:18px 20px;"><table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:7px 0;font-size:14px;color:#333;white-space:nowrap;width:155px;vertical-align:top;">Withdrawal time:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;">UTC+8 ${escapeHtml(withdrawalTime)}</td></tr>
<tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">Amount:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;">${amount.toLocaleString(undefined,{maximumFractionDigits:8})} ${escapeHtml(asset)}</td></tr>
<tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">Withdrawal address:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;word-break:break-all;">${escapeHtml(address)}</td></tr>
<tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">TxID:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;word-break:break-all;">${escapeHtml(txId)}</td></tr>
<tr><td style="padding:7px 0;font-size:14px;color:#333;vertical-align:top;">Transaction fees:</td><td style="padding:7px 0;font-size:14px;color:#00b8d4;font-weight:500;">${escapeHtml(fee)} ${escapeHtml(asset)}</td></tr>
</table></td></tr></table>
<p style="margin:0 0 28px;font-size:13px;color:#888;">*This is an automated email notification and it can't be used as an order history.</p></td></tr>
<tr><td style="padding:24px 28px 28px;border-top:1px solid #f0f0f0;background:#fafafa;"><p style="margin:0 0 4px;font-size:13px;color:#444;">Any question or in need of help?</p><p style="margin:0 0 4px;font-size:13px;color:#444;">You can refer to <a href="https://bitegit.com/support" style="color:#00b8d4;text-decoration:none;">Help center</a> or send email <a href="mailto:support@bitegit.com" style="color:#00b8d4;text-decoration:none;">support@bitegit.com</a> to contact us</p><p style="margin:0 0 14px;font-size:13px;color:#444;">Follow our <a href="https://twitter.com/bitegit" style="color:#00b8d4;text-decoration:none;">X(Twitter)</a> for more ${BRAND_NAME} updates.</p><p style="margin:0 0 18px;font-size:12px;color:#888;">* This email is sent automatically and you do not need to reply.</p>
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
<p style="margin:0 0 8px;font-size:12px;color:#888;line-height:1.6;">Note: Online support and staff of ${BRAND_NAME} will never require your account's private information in any mail or communication and social tools, so please do not reveal your account information to anyone.</p>
<p style="margin:0;font-size:12px;color:#888;">@2018-${new Date().getFullYear()} ${BRAND_NAME}.com reserves all rights.</p>
</td></tr></table></td></tr></table></body></html>`;
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
