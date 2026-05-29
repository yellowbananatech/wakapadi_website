const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return { statusCode: 500, body: 'Missing PAYSTACK_SECRET_KEY' };
  }

  const signature =
    event.headers['x-paystack-signature'] || event.headers['X-Paystack-Signature'];

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : event.body || '';

  const hash = crypto
    .createHmac('sha512', secretKey)
    .update(rawBody, 'utf8')
    .digest('hex');

  if (!signature || signature !== hash) {
    return { statusCode: 401, body: 'Invalid signature' };
  }

  let payload = {};
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const eventType = payload.event || 'unknown';
  const reference = payload?.data?.reference;
  console.log('Paystack webhook received', { eventType, reference });

  return { statusCode: 200, body: 'ok' };
};
