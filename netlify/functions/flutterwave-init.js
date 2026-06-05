const FLUTTERWAVE_API = 'https://api.flutterwave.com/v3/payments';
const { getPaymentSuccessUrl, getSiteUrl, jsonResponse } = require('./_payment-utils');
const { verifyToken } = require('./verify-turnstile');

function toFlutterwaveAmount(amount, currencyCode) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Invalid payment amount');
  }
  // Flutterwave uses major currency units (not kobo/cents).
  if (currencyCode === 'NGN' || currencyCode === 'JPY') {
    return Math.round(value);
  }
  return Number(value.toFixed(2));
}

function createTxRef() {
  return `wakapadi-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    return jsonResponse(500, {
      status: 'error',
      message: 'Missing FLUTTERWAVE_SECRET_KEY',
    });
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, { status: 'error', message: 'Invalid JSON body' });
  }

  const { email, amount, currency, metadata, turnstileToken, customerName, customerPhone } =
    payload;

  if (!email || amount == null || !currency) {
    return jsonResponse(400, {
      status: 'error',
      message: 'email, amount, and currency are required',
    });
  }

  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return jsonResponse(403, { status: 'error', message: 'Security verification required' });
    }
    try {
      const verified = await verifyToken(turnstileToken);
      if (!verified) {
        return jsonResponse(403, { status: 'error', message: 'Security verification failed' });
      }
    } catch {
      return jsonResponse(500, { status: 'error', message: 'Verification service error' });
    }
  }

  let paymentAmount;
  try {
    paymentAmount = toFlutterwaveAmount(amount, String(currency).toUpperCase());
  } catch (err) {
    return jsonResponse(400, { status: 'error', message: err.message });
  }

  const txRef = createTxRef();
  const redirectUrl = getPaymentSuccessUrl();
  const packageTitle = metadata?.packageTitle || 'Wakapadi travel package';

  const res = await fetch(FLUTTERWAVE_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount: paymentAmount,
      currency: String(currency).toUpperCase(),
      redirect_url: redirectUrl,
      customer: {
        email,
        name: customerName || metadata?.customerName || 'Wakapadi Customer',
        phonenumber: customerPhone || metadata?.customerPhone || undefined,
      },
      meta: {
        ...(metadata || {}),
        tx_ref: txRef,
      },
      customizations: {
        title: 'Wakapadi',
        description: packageTitle,
        logo: `${getSiteUrl()}/favicon.png`,
      },
    }),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok || data?.status !== 'success') {
    return jsonResponse(res.status || 500, {
      status: 'error',
      message: data?.message || 'Failed to initialize Flutterwave payment',
      details: data,
    });
  }

  return jsonResponse(200, data);
};
