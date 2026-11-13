import { jsonResponse, preflight, readJson } from '../_shared/http.ts';

const FLUTTERWAVE_VERIFY_API = 'https://api.flutterwave.com/v3/transactions';

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== 'POST') {
    return jsonResponse(405, { success: false, message: 'Method Not Allowed' });
  }

  const secretKey = Deno.env.get('FLUTTERWAVE_SECRET_KEY');
  if (!secretKey) {
    return jsonResponse(500, { success: false, message: 'Missing FLUTTERWAVE_SECRET_KEY' });
  }

  const payload = await readJson<{ transaction_id?: string; transactionId?: string }>(req);
  if (!payload) {
    return jsonResponse(400, { success: false, message: 'Invalid JSON body' });
  }

  const transactionId = payload.transaction_id || payload.transactionId;
  if (!transactionId) {
    return jsonResponse(400, { success: false, message: 'transaction_id is required' });
  }

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
  const successful = res.ok && data?.status === 'success' && data?.data?.status === 'successful';

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
});
