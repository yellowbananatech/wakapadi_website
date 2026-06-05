const FLUTTERWAVE_VERIFY_API = 'https://api.flutterwave.com/v3/transactions';
const { jsonResponse } = require('./_payment-utils');

async function verifyTransaction(transactionId, secretKey) {
  const res = await fetch(`${FLUTTERWAVE_VERIFY_API}/${transactionId}/verify`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  return { ok: res.ok, data };
}

function isWebhookAuthorized(event) {
  const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;
  if (!secretHash) {
    console.warn('FLUTTERWAVE_WEBHOOK_SECRET_HASH is not set; webhook signature not verified');
    return true;
  }

  const verifHash =
    event.headers['verif-hash'] ||
    event.headers['Verif-Hash'] ||
    event.headers['VERIF-HASH'];

  return verifHash === secretHash;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    return jsonResponse(500, { status: 'error', message: 'Missing FLUTTERWAVE_SECRET_KEY' });
  }

  if (!isWebhookAuthorized(event)) {
    return jsonResponse(401, { status: 'error', message: 'Invalid webhook signature' });
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : event.body || '';

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonResponse(400, { status: 'error', message: 'Invalid JSON' });
  }

  const eventType = payload.event || payload['event.type'] || 'unknown';
  const transactionId = payload?.data?.id;
  const txRef = payload?.data?.tx_ref;
  const status = payload?.data?.status;

  console.log('Flutterwave webhook received', { eventType, transactionId, txRef, status });

  if (transactionId) {
    const { ok, data } = await verifyTransaction(transactionId, secretKey);
    if (!ok || data?.status !== 'success' || data?.data?.status !== 'successful') {
      console.warn('Flutterwave webhook verification failed', { transactionId, data });
      return jsonResponse(200, { status: 'ignored' });
    }

    console.log('Flutterwave payment verified', {
      transactionId,
      txRef: data?.data?.tx_ref || txRef,
      amount: data?.data?.amount,
      currency: data?.data?.currency,
      meta: data?.data?.meta,
    });

    // TODO: persist booking confirmation / notify team when ready.
  }

  return jsonResponse(200, { status: 'success' });
};
