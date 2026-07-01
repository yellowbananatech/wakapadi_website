import { useState } from 'react';
import { Button } from './ui/button';
import { CTA_FLOWS, formatNgnAmount } from '../config/cta-flows';
import { initializeServicePayment } from '../utils/payments';

interface CustomPackageRequestPageProps {
  onNavigate: (page: string) => void;
}

const EMPTY_FORM = {
  name: '',
  email: '',
  whatsapp: '',
  destination: '',
  adults: '1',
  children: '0',
  infants: '0',
  honeypot: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CustomPackageRequestPage({ onNavigate }: CustomPackageRequestPageProps) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const flow = CTA_FLOWS['custom-package'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (formData.honeypot) return;

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.whatsapp.trim() ||
      !formData.destination.trim()
    ) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!EMAIL_REGEX.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const adults = parseInt(formData.adults, 10);
    const children = parseInt(formData.children, 10);
    const infants = parseInt(formData.infants, 10);

    if (Number.isNaN(adults) || adults < 1) {
      setErrorMessage('At least one adult traveler is required.');
      return;
    }

    if (
      Number.isNaN(children) ||
      children < 0 ||
      Number.isNaN(infants) ||
      infants < 0
    ) {
      setErrorMessage('Traveler counts must be valid numbers (0 or more).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const redirectUrl = await initializeServicePayment('custom-package', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        whatsapp: formData.whatsapp.trim(),
        destination: formData.destination.trim(),
        adults,
        children,
        infants,
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
            Request Custom Package
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Tell us about your dream trip and pay {formatNgnAmount(flow.amount)} to book your
            consultation with our travel experts.
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

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-slate-900 mb-2">
                Destination of Choice <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                placeholder="e.g. Zanzibar, Dubai, Mauritius"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <div className="block text-sm font-medium text-slate-900 mb-3">
                Number of Travelers <span className="text-red-500">*</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="adults" className="block text-xs text-slate-600 mb-1">
                    Adults
                  </label>
                  <input
                    type="number"
                    id="adults"
                    name="adults"
                    min={1}
                    value={formData.adults}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="children" className="block text-xs text-slate-600 mb-1">
                    Children
                  </label>
                  <input
                    type="number"
                    id="children"
                    name="children"
                    min={0}
                    value={formData.children}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="infants" className="block text-xs text-slate-600 mb-1">
                    Infants
                  </label>
                  <input
                    type="number"
                    id="infants"
                    name="infants"
                    min={0}
                    value={formData.infants}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
              Consultation fee:{' '}
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
              onClick={() => onNavigate('packages')}
              className="w-full text-sm text-slate-500 hover:text-slate-700"
            >
              Back to packages
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
