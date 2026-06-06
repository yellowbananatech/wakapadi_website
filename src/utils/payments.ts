import { toPaystackAmount } from './currency';

export type PaymentProvider = 'flutterwave' | 'paystack';

export function getPaymentProvider(): PaymentProvider {
  const provider = (import.meta.env.VITE_PAYMENT_PROVIDER ?? 'flutterwave').toLowerCase();
  return provider === 'paystack' ? 'paystack' : 'flutterwave';
}

export function getPaymentInitPath(): string {
  return getPaymentProvider() === 'paystack'
    ? '/.netlify/functions/paystack-init'
    : '/.netlify/functions/flutterwave-init';
}

export interface PackagePaymentMetadata {
  packageId: string;
  packageTitle: string;
  packageLocation: string;
  currency: string;
  amountUsd: number;
}

export function buildPaymentInitBody(
  email: string,
  amount: number,
  currencyCode: string,
  metadata: PackagePaymentMetadata
) {
  const provider = getPaymentProvider();

  if (provider === 'paystack') {
    return {
      email,
      amount: toPaystackAmount(amount, currencyCode),
      metadata,
    };
  }

  return {
    email,
    amount: currencyCode === 'NGN' ? Math.round(amount) : Number(amount.toFixed(2)),
    currency: currencyCode,
    metadata,
  };
}

export function isPaymentInitSuccess(data: Record<string, unknown> | null | undefined): boolean {
  if (!data) return false;
  const provider = getPaymentProvider();
  if (provider === 'paystack') {
    return data.status === true;
  }
  return data.status === 'success';
}

export function getPaymentRedirectUrl(data: Record<string, any> | null | undefined): string | null {
  if (!data?.data) return null;
  const provider = getPaymentProvider();
  if (provider === 'paystack') {
    return data.data.authorization_url ?? null;
  }
  return data.data.link ?? null;
}

export async function initializePackagePayment(
  email: string,
  amount: number,
  currencyCode: string,
  metadata: PackagePaymentMetadata
): Promise<string> {
  const initPath = getPaymentInitPath();
  const provider = getPaymentProvider();
  // #region agent log
  fetch('http://127.0.0.1:7544/ingest/b2e8afcf-9c4f-4f2c-bc27-daa529cd04f5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4c7d97'},body:JSON.stringify({sessionId:'4c7d97',location:'payments.ts:72',message:'initializePackagePayment start',data:{path:initPath,provider,amount,currencyCode,emailPresent:!!email},timestamp:Date.now(),hypothesisId:'A_D'})}).catch(()=>{});
  // #endregion

  const res = await fetch(initPath, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildPaymentInitBody(email, amount, currencyCode, metadata)),
  });

  // #region agent log
  fetch('http://127.0.0.1:7544/ingest/b2e8afcf-9c4f-4f2c-bc27-daa529cd04f5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4c7d97'},body:JSON.stringify({sessionId:'4c7d97',location:'payments.ts:83',message:'fetch response received',data:{status:res.status,ok:res.ok,statusText:res.statusText,contentType:res.headers.get('content-type')},timestamp:Date.now(),hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  const data = await res.json().catch((e: Error) => ({ _parseError: e.message }));

  // #region agent log
  fetch('http://127.0.0.1:7544/ingest/b2e8afcf-9c4f-4f2c-bc27-daa529cd04f5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4c7d97'},body:JSON.stringify({sessionId:'4c7d97',location:'payments.ts:88',message:'parsed response body',data:{dataStatus:(data as any)?.status,hasDataObj:!!(data as any)?.data,hasLink:!!(data as any)?.data?.link,errorMsg:(data as any)?.message,parseError:(data as any)?._parseError,isSuccess:isPaymentInitSuccess(data as any)},timestamp:Date.now(),hypothesisId:'B_C_E'})}).catch(()=>{});
  // #endregion

  if (!res.ok || !isPaymentInitSuccess(data as any)) {
    // #region agent log
    fetch('http://127.0.0.1:7544/ingest/b2e8afcf-9c4f-4f2c-bc27-daa529cd04f5',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4c7d97'},body:JSON.stringify({sessionId:'4c7d97',location:'payments.ts:93',message:'PAYMENT INIT FAILED — throwing error',data:{resOk:res.ok,errorMsg:(data as any)?.message,fullData:data},timestamp:Date.now(),hypothesisId:'A_B_C_D_E'})}).catch(()=>{});
    // #endregion
    throw new Error((data as any)?.message ?? 'Failed to initialize payment');
  }

  const redirectUrl = getPaymentRedirectUrl(data as any);
  if (!redirectUrl) {
    throw new Error('Payment gateway did not return a checkout link');
  }

  return redirectUrl;
}
