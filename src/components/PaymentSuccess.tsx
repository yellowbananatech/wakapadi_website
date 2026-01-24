import { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface PaymentSuccessProps {
  onNavigate: (page: string) => void;
}

export function PaymentSuccess({ onNavigate }: PaymentSuccessProps) {
  const [reference, setReference] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReference(params.get('reference') ?? '');
  }, []);

  return (
    <div className="min-h-screen pt-32 bg-white pb-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-semibold text-slate-900 mb-4">Payment Successful</h1>
        <p className="text-slate-600 mb-6">
          Thank you! Your payment has been received.
        </p>
        {reference && (
          <div className="mb-8 text-sm text-slate-500">
            Reference: <span className="font-mono">{reference}</span>
          </div>
        )}
        <Button
          onClick={() => onNavigate('home')}
          className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
