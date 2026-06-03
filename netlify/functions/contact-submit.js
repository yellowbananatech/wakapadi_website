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

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, {
      success: false,
      message: 'Email service is not configured. Please contact hello@mywakapadi.com directly.',
    });
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

  // Contact form: verify Turnstile only when a token is sent (widget removed from UI — iframe blocked clicks)
  if (process.env.TURNSTILE_SECRET_KEY && turnstileToken) {
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
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL || 'Wakapadi Website <contact@mywakapadi.com>';

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

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: toRecipients,
      cc: ccRecipients,
      reply_to: email.trim(),
      subject: `Wakapadi Contact: ${subjectLabel}`,
      html,
    }),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    console.error('Resend API error', res.status, data);
    return jsonResponse(500, {
      success: false,
      message: 'Failed to send your message. Please email hello@mywakapadi.com directly.',
    });
  }

  return jsonResponse(200, { success: true });
};
