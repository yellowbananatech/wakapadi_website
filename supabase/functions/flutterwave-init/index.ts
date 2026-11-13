import { getPaymentSuccessUrl, getSiteUrl, jsonResponse, preflight, readJson } from '../_shared/http.ts';

const FLUTTERWAVE_API = 'https://api.flutterwave.com/v3/payments';

interface InitPayload {
  email?: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
  customerName?: string;
  customerPhone?: string;
}

function toFlutterwaveAmount(amount: unknown, currencyCode: string): number {
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

function createTxRef(): string {
  return `wakapadi-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== 'POST') {
    return jsonResponse(405, { status: 'error', message: 'Method Not Allowed' });
  }

  const secretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');
  if (!secretKey) {
    return jsonResponse(500, { status: 'error', message: 'Missing FLUTTERWAVE_SECRET_KEY' });
  }

  const payload = await readJson<InitPayload>(req);
  if (!payload) {
    return jsonResponse(400, { status: 'error', message: 'Invalid JSON body' });
  }

  const { email, amount, currency, metadata, customerName, customerPhone } = payload;
  if (!email || amount == null || !currency) {
    return jsonResponse(400, {
      status: 'error',
      message: 'email, amount, and currency are required',
    });
  }

  const currencyCode = String(currency).toUpperCase();
  let paymentAmount: number;
  try {
    paymentAmount = toFlutterwaveAmount(amount, currencyCode);
  } catch (err) {
    return jsonResponse(400, { status: 'error', message: (err as Error).message });
  }

  const txRef = createTxRef();
  const serviceType = metadata?.serviceType as string | undefined;
  const redirectUrl = serviceType
    ? `${getPaymentSuccessUrl()}?flow=${encodeURIComponent(serviceType)}`
    : getPaymentSuccessUrl();
  const packageTitle =
    (metadata?.packageTitle as string | undefined) ||
    (serviceType === 'custom-package'
      ? 'Custom Package Consultation'
      : serviceType === 'get-assessed'
        ? 'Eligibility Assessment'
        : 'Wakapadi travel package');

  const res = await fetch(FLUTTERWAVE_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tx_ref: txRef,
      amount: paymentAmount,
      currency: currencyCode,
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

  const data = await res.json().catch(() => ({}));

  if (!res.ok || data?.status !== 'success') {
    return jsonResponse(res.status || 500, {
      status: 'error',
      message: data?.message || 'Failed to initialize Flutterwave payment',
      details: data,
    });
  }

  return jsonResponse(200, data);
});
