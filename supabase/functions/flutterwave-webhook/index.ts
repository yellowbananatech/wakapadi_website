import { jsonResponse } from '../_shared/http.ts';

const FLUTTERWAVE_VERIFY_API = 'https://api.flutterwave.com/v3/transactions';

async function verifyTransaction(transactionId: string | number, secretKey: string) {
  const res = await fetch(
    `${FLUTTERWAVE_VERIFY_API}/${encodeURIComponent(String(transactionId))}/verify`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    },
  );
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

function isWebhookAuthorized(req: Request): boolean {
  const secretHash = Deno.env.get('FLUTTERWAVE_WEBHOOK_SECRET_HASH');
  if (!secretHash) {
    console.warn('FLUTTERWAVE_WEBHOOK_SECRET_HASH is not set; webhook signature not verified');
    return true;
  }
  return req.headers.get('verif-hash') === secretHash;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse(405, { message: 'Method Not Allowed' });
  }

  const secretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');
  if (!secretKey) {
    return jsonResponse(500, { status: 'error', message: 'Missing FLUTTERWAVE_SECRET_KEY' });
  }

  if (!isWebhookAuthorized(req)) {
    return jsonResponse(401, { status: 'error', message: 'Invalid webhook signature' });
  }

  let payload: Record<string, any>;
  try {
    payload = JSON.parse(await req.text());
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
});
