import { useState } from 'react';
import { Button } from './ui/button';
import { CTA_FLOWS, formatNgnAmount } from '../config/cta-flows';
import { initializeServicePayment } from '../utils/payments';

interface GetAssessedPageProps {
  onNavigate: (page: string) => void;
}

const EMPTY_FORM = {
  name: '',
  email: '',
  whatsapp: '',
  honeypot: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function GetAssessedPage({ onNavigate }: GetAssessedPageProps) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const flow = CTA_FLOWS['get-assessed'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (formData.honeypot) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.whatsapp.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!EMAIL_REGEX.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const redirectUrl = await initializeServicePayment('get-assessed', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        whatsapp: formData.whatsapp.trim(),
      });

      window.location.href = redirectUrl;
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to start payment. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 bg-white pb-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 mb-6 tracking-tighter">
            Get Assessed
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Share your details and pay {formatNgnAmount(flow.amount)} to book your eligibility
            assessment with our experts.
          </p>
        </div>

        <div className="glass rounded-2xl p-8 md:p-12">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
              style={{ clip: 'rect(0,0,0,0)' }}
            />

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-900 mb-2">
                WhatsApp Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                placeholder="+234..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
              Assessment fee:{' '}
              <span className="font-semibold text-slate-900">{formatNgnAmount(flow.amount)}</span>.
              After payment you will be redirected to book your appointment.
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-base text-white rounded-xl"
              style={{ backgroundColor: '#2894ca' }}
            >
              {isSubmitting ? 'Redirecting to payment...' : `Pay ${formatNgnAmount(flow.amount)} & Continue`}
            </Button>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="w-full text-sm text-slate-500 hover:text-slate-700"
            >
              Back to home
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
