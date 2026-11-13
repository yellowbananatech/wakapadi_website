import { jsonResponse, preflight, readJson } from '../_shared/http.ts';
import { isTurnstileConfigured, verifyTurnstileToken } from '../_shared/turnstile.ts';

const RESEND_API = 'https://api.resend.com/emails';

const DEFAULT_TO = 'hello@mywakapadi.com';
const DEFAULT_CC = ['wakapadi@icloud.com', 'therealveev@gmail.com'];

const SUBJECT_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  booking: 'Booking Question',
  visa: 'Visa Services',
  migration: 'Migration Services',
  packages: 'Travel Packages',
  support: 'Customer Support',
  other: 'Other',
};

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  honeypot?: string;
  turnstileToken?: string;
}

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseRecipients(envValue: string | undefined, fallback: string[]): string[] {
  if (!envValue) return fallback;
  return envValue
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);
}

function normalizeFromEmail(value: string | undefined, fallback: string): string {
  const raw = (value || fallback).trim();
  if (!raw) return fallback;
  if (raw.includes('<') && raw.includes('>')) return raw;
  return `Wakapadi Website <${raw}>`;
}

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== 'POST') {
    return jsonResponse(405, { success: false, message: 'Method Not Allowed' });
  }

  const payload = await readJson<ContactPayload>(req);
  if (!payload) {
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

  if (isTurnstileConfigured()) {
    if (!turnstileToken) {
      return jsonResponse(403, { success: false, message: 'Please complete the security check.' });
    }
    try {
      if (!(await verifyTurnstileToken(turnstileToken))) {
        return jsonResponse(403, { success: false, message: 'Security verification failed.' });
      }
    } catch {
      return jsonResponse(500, { success: false, message: 'Verification service error.' });
    }
  }

  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    return jsonResponse(500, {
      success: false,
      message: 'Email service is not configured. Please contact us on WhatsApp.',
    });
  }

  const subjectKey = (subject || '').trim();
  const subjectLabel = SUBJECT_LABELS[subjectKey] || subjectKey || 'General Inquiry';
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
      from: normalizeFromEmail(
        Deno.env.get('CONTACT_FROM_EMAIL'),
        'Wakapadi Website <contact@mywakapadi.com>',
      ),
      to: parseRecipients(Deno.env.get('CONTACT_TO_EMAIL'), [DEFAULT_TO]),
      cc: parseRecipients(Deno.env.get('CONTACT_CC_EMAILS'), DEFAULT_CC),
      reply_to: email.trim(),
      subject: `Wakapadi Contact: ${subjectLabel}`,
      html,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error('Contact email delivery failed', data);
    return jsonResponse(500, {
      success: false,
      message: data?.message || 'Failed to send your message. Please contact us on WhatsApp.',
    });
  }

  return jsonResponse(200, { success: true, provider: 'resend' });
});
