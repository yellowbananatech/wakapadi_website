function getSiteUrl() {
  const url =
    process.env.PAYMENT_CALLBACK_URL ||
    process.env.FLUTTERWAVE_CALLBACK_URL ||
    process.env.PAYSTACK_CALLBACK_URL ||
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.SITE_URL;
  if (!url) return 'http://localhost:3000';
  try {
    return new URL(url).origin;
  } catch {
    return url.replace(/\/$/, '');
  }
}

function getPaymentSuccessUrl() {
  const explicit =
    process.env.PAYMENT_CALLBACK_URL ||
    process.env.FLUTTERWAVE_CALLBACK_URL ||
    process.env.PAYSTACK_CALLBACK_URL;
  if (explicit) return explicit;
  return `${getSiteUrl()}/payment-success`;
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function getPaymentProvider() {
  const provider = (process.env.PAYMENT_PROVIDER || 'flutterwave').toLowerCase();
  return provider === 'paystack' ? 'paystack' : 'flutterwave';
}

module.exports = {
  getSiteUrl,
  getPaymentSuccessUrl,
  jsonResponse,
  getPaymentProvider,
};
