import { CTA_FLOWS, type ServiceFlowType } from '../config/cta-flows';
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

export interface CustomPackageFormData {
  name: string;
  email: string;
  whatsapp: string;
  destination: string;
  adults: number;
  children: number;
  infants: number;
}

export interface GetAssessedFormData {
  name: string;
  email: string;
  whatsapp: string;
}

export interface ServicePaymentMetadata {
  serviceType: ServiceFlowType;
  customerName: string;
  customerWhatsapp: string;
  destination?: string;
  adults?: number;
  children?: number;
  infants?: number;
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
  if (currencyCode !== 'NGN' && currencyCode !== 'USD') {
    throw new Error(`Unsupported payment currency: ${currencyCode}`);
  }

  const res = await fetch(getPaymentInitPath(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildPaymentInitBody(email, amount, currencyCode, metadata)),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !isPaymentInitSuccess(data)) {
    throw new Error(data?.message ?? 'Failed to initialize payment');
  }

  const redirectUrl = getPaymentRedirectUrl(data);
  if (!redirectUrl) {
    throw new Error('Payment gateway did not return a checkout link');
  }

  return redirectUrl;
}

function buildServicePaymentMetadata(
  serviceType: ServiceFlowType,
  formData: CustomPackageFormData | GetAssessedFormData
): ServicePaymentMetadata {
  const base: ServicePaymentMetadata = {
    serviceType,
    customerName: formData.name.trim(),
    customerWhatsapp: formData.whatsapp.trim(),
  };

  if (serviceType === 'custom-package') {
    const customData = formData as CustomPackageFormData;
    return {
      ...base,
      destination: customData.destination.trim(),
      adults: customData.adults,
      children: customData.children,
      infants: customData.infants,
    };
  }

  return base;
}

export async function initializeServicePayment(
  serviceType: ServiceFlowType,
  formData: CustomPackageFormData | GetAssessedFormData
): Promise<string> {
  const flow = CTA_FLOWS[serviceType];
  const metadata = buildServicePaymentMetadata(serviceType, formData);
  const email = formData.email.trim();
  const provider = getPaymentProvider();

  const body =
    provider === 'paystack'
      ? {
          email,
          amount: toPaystackAmount(flow.amount, flow.currency),
          metadata,
          customerName: formData.name.trim(),
          customerPhone: formData.whatsapp.trim(),
        }
      : {
          email,
          amount: flow.amount,
          currency: flow.currency,
          metadata,
          customerName: formData.name.trim(),
          customerPhone: formData.whatsapp.trim(),
        };

  const res = await fetch(getPaymentInitPath(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !isPaymentInitSuccess(data)) {
    throw new Error(data?.message ?? 'Failed to initialize payment');
  }

  const redirectUrl = getPaymentRedirectUrl(data);
  if (!redirectUrl) {
    throw new Error('Payment gateway did not return a checkout link');
  }

  return redirectUrl;
}
