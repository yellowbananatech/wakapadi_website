const PAYSTACK_BASE_URL = 'https://api.paystack.co';

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

  const { email, amount, metadata } = payload;
  if (!email || !amount) {
    return { statusCode: 400, body: JSON.stringify({ message: 'email and amount are required' }) };
  }

  const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'http://localhost:3000';
  const callbackUrl = `${siteUrl}/payment-success`;

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
