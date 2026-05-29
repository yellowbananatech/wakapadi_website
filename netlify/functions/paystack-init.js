const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const { verifyToken } = require('./verify-turnstile');

function getSiteUrl() {
  const url = process.env.PAYSTACK_CALLBACK_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || process.env.SITE_URL;
  if (!url) return 'http://localhost:3000';
  try {
    return new URL(url).origin;
  } catch {
    return url.replace(/\/$/, '');
  }
}

function getCallbackUrl() {
  if (process.env.PAYSTACK_CALLBACK_URL) {
    return process.env.PAYSTACK_CALLBACK_URL;
  }
  return `${getSiteUrl()}/payment-success`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Missing PAYSTACK_SECRET_KEY' }) };
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ message: 'Invalid JSON body' }) };
  }

  const { email, amount, metadata, turnstileToken } = payload;
  if (!email || !amount) {
    return { statusCode: 400, body: JSON.stringify({ message: 'email and amount are required' }) };
  }

  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return { statusCode: 403, body: JSON.stringify({ message: 'Security verification required' }) };
    }
    try {
      const verified = await verifyToken(turnstileToken);
      if (!verified) {
        return { statusCode: 403, body: JSON.stringify({ message: 'Security verification failed' }) };
      }
    } catch (err) {
      return { statusCode: 500, body: JSON.stringify({ message: 'Verification service error' }) };
    }
  }

  const callbackUrl = getCallbackUrl();

  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount,
      metadata,
      callback_url: callbackUrl,
    }),
  });

  const data = await res.json();

  return {
    statusCode: res.status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
};
