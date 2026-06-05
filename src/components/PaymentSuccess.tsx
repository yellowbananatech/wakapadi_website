import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { getPaymentProvider } from '../utils/payments';

interface PaymentSuccessProps {
  onNavigate: (page: string) => void;
}

type VerificationState = 'idle' | 'checking' | 'verified' | 'failed' | 'cancelled';

export function PaymentSuccess({ onNavigate }: PaymentSuccessProps) {
  const [reference, setReference] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [verificationState, setVerificationState] = useState<VerificationState>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = getPaymentProvider();

    if (provider === 'paystack') {
      setReference(params.get('reference') ?? params.get('trxref') ?? '');
      setVerificationState('verified');
      return;
    }

    const status = (params.get('status') ?? '').toLowerCase();
    const txRef = params.get('tx_ref') ?? '';
    const txId = params.get('transaction_id') ?? '';

    setReference(txRef);
    setTransactionId(txId);

    if (status === 'cancelled') {
      setVerificationState('cancelled');
      setVerificationMessage('Payment was cancelled. You can try again when ready.');
      return;
    }

    if (!txId) {
      setVerificationState('failed');
      setVerificationMessage('Payment could not be verified. Please contact support if you were charged.');
      return;
    }

    setVerificationState('checking');

    fetch('/.netlify/functions/flutterwave-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transaction_id: txId }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.success) {
          throw new Error(data?.message ?? 'Verification failed');
        }
        setReference(data?.data?.tx_ref ?? txRef);
        setTransactionId(String(data?.data?.transaction_id ?? txId));
        setVerificationState('verified');
      })
      .catch((error: Error) => {
        setVerificationState('failed');
        setVerificationMessage(
          error.message || 'We could not confirm this payment yet. If you were charged, contact support.'
        );
      });
  }, []);

  const isSuccess = verificationState === 'verified';
  const isChecking = verificationState === 'checking';

  return (
    <div className="min-h-screen pt-32 bg-white pb-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-semibold text-slate-900 mb-4">
          {isSuccess ? 'Payment Successful' : isChecking ? 'Confirming Payment' : 'Payment Update'}
        </h1>
        <p className="text-slate-600 mb-6">
          {isSuccess
            ? 'Thank you! Your payment has been received.'
            : isChecking
              ? 'Please wait while we confirm your payment with Flutterwave.'
              : verificationMessage || 'There was a problem confirming your payment.'}
        </p>
        {reference && (
          <div className="mb-4 text-sm text-slate-500">
            Reference: <span className="font-mono">{reference}</span>
          </div>
        )}
        {transactionId && (
          <div className="mb-8 text-sm text-slate-500">
            Transaction ID: <span className="font-mono">{transactionId}</span>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => onNavigate('home')}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6"
          >
            Back to Home
          </Button>
          {!isSuccess && (
            <Button
              onClick={() => onNavigate('packages')}
              variant="outline"
              className="rounded-xl px-6"
            >
              Back to Packages
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
