import { jsonResponse } from '../_shared/http.ts';

async function hmacSha512Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-512' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse(405, { message: 'Method Not Allowed' });
  }

  const secretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
  if (!secretKey) {
    return jsonResponse(500, { message: 'Missing PAYSTACK_SECRET_KEY' });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('x-paystack-signature');
  const hash = await hmacSha512Hex(secretKey, rawBody);

  if (!signature || signature !== hash) {
    return jsonResponse(401, { message: 'Invalid signature' });
  }

  let payload: Record<string, any>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonResponse(400, { message: 'Invalid JSON' });
  }

  const eventType = payload.event || 'unknown';
  const reference = payload?.data?.reference;
  console.log('Paystack webhook received', { eventType, reference });

  if (eventType === 'charge.success') {
    // TODO: implement booking confirmation or order fulfillment logic here.
    console.log('Paystack charge succeeded:', payload.data);
  }

  return jsonResponse(200, { status: 'success' });
});
