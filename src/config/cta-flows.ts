export type ServiceFlowType = 'custom-package' | 'get-assessed';

export const WHATSAPP_URL = 'https://wa.me/447881183175';

export const CTA_FLOWS: Record<
  ServiceFlowType,
  {
    amount: number;
    currency: 'NGN';
    title: string;
    description: string;
    bookingUrl: string;
  }
> = {
  'custom-package': {
    amount: 50000,
    currency: 'NGN',
    title: 'Custom Package Consultation',
    description: 'Request a tailored travel package consultation',
    bookingUrl:
      'https://therealveev.setmore.com/KBtDcVaCPMoVlqxlly1mTZ61Alc3HXCS/service/7c657432-3eae-47d4-adfe-fab39eec2545',
  },
  'get-assessed': {
    amount: 100000,
    currency: 'NGN',
    title: 'Eligibility Assessment',
    description: 'Get assessed for your global mobility goals',
    bookingUrl:
      'https://therealveev.setmore.com/r5332c75babed759fd517a95dfc166c32c24993c1/service/0f8ccd6c-aedc-4db2-afa7-0c3d2f1991cd',
  },
};

export function getBookingUrlForFlow(flow: string | null | undefined): string | null {
  if (!flow || !(flow in CTA_FLOWS)) return null;
  return CTA_FLOWS[flow as ServiceFlowType].bookingUrl;
}

export function formatNgnAmount(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
