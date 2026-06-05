const FLUTTERWAVE_VERIFY_API = 'https://api.flutterwave.com/v3/transactions';
const { jsonResponse } = require('./_payment-utils');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    return jsonResponse(500, { success: false, message: 'Missing FLUTTERWAVE_SECRET_KEY' });
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { success: false, message: 'Invalid JSON body' });
  }

  const transactionId = payload.transaction_id || payload.transactionId;
  if (!transactionId) {
    return jsonResponse(400, { success: false, message: 'transaction_id is required' });
  }

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

  const successful =
    res.ok &&
    data?.status === 'success' &&
    data?.data?.status === 'successful';

  return jsonResponse(successful ? 200 : 400, {
    success: successful,
    message: successful ? 'Payment verified' : data?.message || 'Payment verification failed',
    data: successful
      ? {
          tx_ref: data.data.tx_ref,
          transaction_id: data.data.id,
          amount: data.data.amount,
          currency: data.data.currency,
          meta: data.data.meta,
        }
      : undefined,
  });
};
