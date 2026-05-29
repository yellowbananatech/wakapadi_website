/**
 * Shared Turnstile token verification.
 * Can be called directly as a Netlify function OR imported by other functions.
 *
 * POST body: { token: string }
 * Returns:   { success: boolean }
 */

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

async function verifyToken(token) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error('Missing TURNSTILE_SECRET_KEY environment variable');
  }

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data = await res.json();
  return data.success === true;
}

// Export for use by other Netlify functions
module.exports.verifyToken = verifyToken;

// Netlify function handler — standalone endpoint
module.exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Invalid JSON' }),
    };
  }

  const { token } = body;
  if (!token) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: 'Missing token' }),
    };
  }

  try {
    const ok = await verifyToken(token);
    return {
      statusCode: ok ? 200 : 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: ok }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, message: err.message }),
    };
  }
};
