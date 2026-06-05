import { useState, useCallback, useRef } from 'react';
import { Button } from './ui/button';
import { CloudflareTurnstile, isTurnstileEnabled } from './CloudflareTurnstile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  honeypot: '',
};

function getTurnstileTokenFromDom(): string | null {
  const input = document.querySelector<HTMLInputElement>(
    'input[name="cf-turnstile-response"]'
  );
  const value = input?.value?.trim();
  return value || null;
}

export function ContactPage(_props: ContactPageProps) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const turnstileTokenRef = useRef<string | null>(null);

  const whatsappUrl = 'https://wa.me/447781183175';

  const handleTurnstileVerify = useCallback((token: string) => {
    turnstileTokenRef.current = token;
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    turnstileTokenRef.current = null;
    setTurnstileToken(null);
  }, []);

  const resetFormState = () => {
    setFormData(EMPTY_FORM);
    turnstileTokenRef.current = null;
    setTurnstileToken(null);
    setTurnstileKey((k) => k + 1);
    setErrorMessage('');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitMessage = async () => {
    if (isSubmitting) return;

    if (formData.honeypot) {
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const activeTurnstileToken =
      turnstileTokenRef.current ?? turnstileToken ?? getTurnstileTokenFromDom();
    if (isTurnstileEnabled && !activeTurnstileToken) {
      setErrorMessage('Please complete the security check before sending.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/.netlify/functions/contact-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          honeypot: formData.honeypot,
          turnstileToken: activeTurnstileToken,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        throw new Error(data?.message ?? 'Failed to send message');
      }

      resetFormState();
      setSuccessDialogOpen(true);
    } catch (error) {
      const msg = error instanceof Error ? error.message : '';
      setErrorMessage(
        msg ||
          'Failed to submit your message. Please try again or contact us on WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitMessage();
  };

  const handleSuccessAck = () => {
    setSuccessDialogOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-32 bg-white pb-32">
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent className="rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 text-xl">
              Message sent
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 text-base leading-relaxed">
              Thank you for your message! We&apos;ll get back to you within 24 hours. For a prompt
              response, please chat us up on Whatsapp.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              onClick={handleSuccessAck}
              className="text-white rounded-xl px-8 min-w-[120px]"
              style={{ backgroundColor: '#2894ca' }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 mb-6 tracking-tighter">
              Contact Us
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Have a question or need assistance? We&apos;re here to help. Fill out the form below and
              we&apos;ll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">Message</div>
              <h3 className="font-semibold text-slate-900 mb-2">Secure Form</h3>
              <p className="text-slate-600 text-sm">
                Send us a message using the form below.
              </p>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">WhatsApp</div>
              <h3 className="font-semibold text-slate-900 mb-2">Chat With Us</h3>
              <Button
                onClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
                className="text-white rounded-xl px-6"
                style={{ backgroundColor: '#2894ca' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2278a8')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2894ca')}
              >
                Open WhatsApp
              </Button>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="font-semibold text-slate-900 mb-2">Address</h3>
              <p className="text-slate-600 text-sm">
                Defoe Rd, Ipswich
                <br />
                IP1 6SN, UK
              </p>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 md:p-12 relative">
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                {errorMessage}
              </div>
            )}

            <form id="contact-form" onSubmit={handleSubmit} className="space-y-6 relative z-10">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
                    Name <span className="text-red-500">*</span>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-900 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-900 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Question</option>
                    <option value="visa">Visa Services</option>
                    <option value="migration">Migration Services</option>
                    <option value="packages">Travel Packages</option>
                    <option value="support">Customer Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-900 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {isTurnstileEnabled && (
                <div className="relative z-0">
                  <CloudflareTurnstile
                    key={turnstileKey}
                    onVerify={handleTurnstileVerify}
                    onExpire={handleTurnstileExpire}
                  />
                </div>
              )}

              <div className="relative z-20 pt-2 pb-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="block w-full h-14 text-base font-medium text-white rounded-xl transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2894ca] cursor-pointer select-none disabled:opacity-60 disabled:cursor-wait"
                  style={{ backgroundColor: '#2894ca', pointerEvents: 'auto', touchAction: 'manipulation' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                <p className="mt-3 text-center text-sm text-slate-500">
                  Prefer chat?{' '}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Open WhatsApp
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
