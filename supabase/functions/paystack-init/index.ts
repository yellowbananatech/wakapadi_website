import { getPaymentSuccessUrl, jsonResponse, preflight, readJson } from '../_shared/http.ts';
import { isTurnstileConfigured, verifyTurnstileToken } from '../_shared/turnstile.ts';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

interface InitPayload {
  email?: string;
  amount?: number;
  metadata?: Record<string, unknown>;
  turnstileToken?: string;
}

Deno.serve(async (req) => {
  const pre = preflight(req);
  if (pre) return pre;
  if (req.method !== 'POST') {
    return jsonResponse(405, { message: 'Method Not Allowed' });
  }

  const secretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
  if (!secretKey) {
    return jsonResponse(500, { message: 'Missing PAYSTACK_SECRET_KEY' });
  }

  const payload = await readJson<InitPayload>(req);
  if (!payload) {
    return jsonResponse(400, { message: 'Invalid JSON body' });
  }

  const { email, amount, metadata, turnstileToken } = payload;
  if (!email || !amount) {
    return jsonResponse(400, { message: 'email and amount are required' });
  }

  if (isTurnstileConfigured()) {
    if (!turnstileToken) {
      return jsonResponse(403, { message: 'Security verification required' });
    }
    try {
      if (!(await verifyTurnstileToken(turnstileToken))) {
        return jsonResponse(403, { message: 'Security verification failed' });
      }
    } catch {
      return jsonResponse(500, { message: 'Verification service error' });
    }
  }

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
      callback_url: getPaymentSuccessUrl(),
    }),
  });

  const data = await res.json().catch(() => ({}));
  return jsonResponse(res.status, data);
});
