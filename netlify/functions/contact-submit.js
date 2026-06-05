const { verifyToken } = require('./verify-turnstile');

const RESEND_API = 'https://api.resend.com/emails';

const DEFAULT_TO = 'hello@mywakapadi.com';
const DEFAULT_CC = ['wakapadi@icloud.com', 'therealveev@gmail.com'];

const SUBJECT_LABELS = {
  general: 'General Inquiry',
  booking: 'Booking Question',
  visa: 'Visa Services',
  migration: 'Migration Services',
  packages: 'Travel Packages',
  support: 'Customer Support',
  other: 'Other',
};

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseRecipients(envValue, fallback) {
  if (!envValue) return fallback;
  return envValue
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
}

function normalizeFromEmail(value, fallback) {
  const raw = (value || fallback).trim();
  if (!raw) return fallback;
  if (raw.includes('<') && raw.includes('>')) return raw;
  const emailOnly = raw.replace(/^[^<]*<([^>]+)>$/, '$1').trim();
  const address = emailOnly.includes('@') ? emailOnly : raw;
  return `Wakapadi Website <${address}>`;
}

async function sendViaResend(apiKey, payload) {
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  return { ok: res.ok, data, provider: 'resend' };
}

async function sendViaSendGrid(apiKey, { from, to, cc, replyTo, subject, html }) {
  const personalizations = [{ to: to.map((address) => ({ email: address })) }];
  if (cc.length) {
    personalizations[0].cc = cc.map((address) => ({ email: address }));
  }

  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations,
      from: { email: from.match(/<([^>]+)>/)?.[1] || from, name: 'Wakapadi Website' },
      reply_to: replyTo ? { email: replyTo } : undefined,
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  });

  let data = {};
  if (!res.ok) {
    try {
      data = await res.json();
    } catch {
      data = { message: await res.text() };
    }
  }

  return { ok: res.ok, data, provider: 'sendgrid' };
}

async function sendViaMailgun({ from, to, cc, replyTo, subject, html }) {
  const apiKey = process.env.NETLIFY_EMAILS_PROVIDER_API_KEY || process.env.MAILGUN_API_KEY;
  const domain = process.env.NETLIFY_EMAILS_MAILGUN_DOMAIN || process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) return null;

  const region = process.env.NETLIFY_EMAILS_MAILGUN_HOST_REGION === 'eu' ? 'api.eu' : 'api';
  const body = new URLSearchParams();
  body.set('from', from);
  to.forEach((recipient) => body.append('to', recipient));
  cc.forEach((recipient) => body.append('cc', recipient));
  if (replyTo) body.set('h:Reply-To', replyTo);
  body.set('subject', subject);
  body.set('html', html);

  const res = await fetch(`https://${region}.mailgun.net/v3/${domain}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  return { ok: res.ok, data, provider: 'mailgun' };
}

async function deliverContactEmail(payload) {
  const { from, to, cc, replyTo, subject, html } = payload;

  if (process.env.RESEND_API_KEY) {
    const result = await sendViaResend(process.env.RESEND_API_KEY, {
      from,
      to,
      cc,
      reply_to: replyTo,
      subject,
      html,
    });
    if (result.ok) return result;
    console.error('Resend failed, trying fallback if configured', result.data);
  }

  const provider = (process.env.NETLIFY_EMAILS_PROVIDER || '').toLowerCase();
  if (provider === 'sendgrid' && process.env.NETLIFY_EMAILS_PROVIDER_API_KEY) {
    return sendViaSendGrid(process.env.NETLIFY_EMAILS_PROVIDER_API_KEY, {
      from,
      to,
      cc,
      replyTo,
      subject,
      html,
    });
  }

  if (provider === 'mailgun') {
    const result = await sendViaMailgun({ from, to, cc, replyTo, subject, html });
    if (result) return result;
  }

  if (!process.env.RESEND_API_KEY) {
    return {
      ok: false,
      data: {
        message:
          'Email service is not configured. Add RESEND_API_KEY or configure Netlify Email (SendGrid/Mailgun).',
      },
      provider: 'none',
    };
  }

  return {
    ok: false,
    data: { message: 'Failed to send email via configured providers.' },
    provider: 'resend',
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { success: false, message: 'Invalid JSON body' });
  }

  const { name, email, phone, subject, message, honeypot, turnstileToken } = payload;

  if (honeypot) {
    return jsonResponse(200, { success: true });
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return jsonResponse(400, { success: false, message: 'Name, email, and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return jsonResponse(400, { success: false, message: 'Please enter a valid email address.' });
  }

  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return jsonResponse(403, { success: false, message: 'Please complete the security check.' });
    }
    try {
      const verified = await verifyToken(turnstileToken);
      if (!verified) {
        return jsonResponse(403, { success: false, message: 'Security verification failed.' });
      }
    } catch {
      return jsonResponse(500, { success: false, message: 'Verification service error.' });
    }
  }

  const toRecipients = parseRecipients(process.env.CONTACT_TO_EMAIL, [DEFAULT_TO]);
  const ccRecipients = parseRecipients(process.env.CONTACT_CC_EMAILS, DEFAULT_CC);
  const fromEmail = normalizeFromEmail(
    process.env.CONTACT_FROM_EMAIL,
    'Wakapadi Website <contact@mywakapadi.com>'
  );

  const subjectKey = (subject || '').trim();
  const subjectLabel = SUBJECT_LABELS[subjectKey] || (subjectKey || 'General Inquiry');
  const safeName = escapeHtml(name.trim().slice(0, 200));
  const safeEmail = escapeHtml(email.trim().slice(0, 254));
  const safePhone = escapeHtml((phone || 'Not provided').trim().slice(0, 50));
  const safeMessage = escapeHtml(message.trim().slice(0, 10000)).replace(/\n/g, '<br>');

  const html = `
    <h2>New contact form message</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
    <p><strong>Phone:</strong> ${safePhone}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subjectLabel)}</p>
    <p><strong>Message:</strong></p>
    <p>${safeMessage}</p>
    <hr>
    <p style="color:#64748b;font-size:12px;">Sent from mywakapadi.com contact form</p>
  `.trim();

  const delivery = await deliverContactEmail({
    from: fromEmail,
    to: toRecipients,
    cc: ccRecipients,
    replyTo: email.trim(),
    subject: `Wakapadi Contact: ${subjectLabel}`,
    html,
  });

  if (!delivery.ok) {
    console.error('Contact email delivery failed', delivery.provider, delivery.data);
    return jsonResponse(500, {
      success: false,
      message: delivery.data?.message || 'Failed to send your message. Please contact us on WhatsApp.',
    });
  }

  return jsonResponse(200, { success: true, provider: delivery.provider });
};
