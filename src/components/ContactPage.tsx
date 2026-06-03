import { useState, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { CloudflareTurnstile, isTurnstileEnabled } from './CloudflareTurnstile';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

function getTurnstileTokenFromDom(): string | null {
  const input = document.querySelector<HTMLInputElement>(
    'input[name="cf-turnstile-response"]'
  );
  const value = input?.value?.trim();
  return value || null;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honeypot: '' // Bot protection field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const turnstileTokenRef = useRef<string | null>(null);

  const handleTurnstileVerify = useCallback((token: string) => {
    turnstileTokenRef.current = token;
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    turnstileTokenRef.current = null;
    setTurnstileToken(null);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bot protection: if honeypot field is filled, it's likely a bot
    if (formData.honeypot) {
      console.log('Bot detected');
      return;
    }

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in all required fields.');
      setSubmitStatus('error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      setSubmitStatus('error');
      return;
    }

    const activeTurnstileToken =
      turnstileTokenRef.current ?? turnstileToken ?? getTurnstileTokenFromDom();
    if (isTurnstileEnabled && !activeTurnstileToken) {
      setErrorMessage('Please complete the security check below the message field.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
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
          turnstileToken:
            turnstileTokenRef.current ?? turnstileToken ?? getTurnstileTokenFromDom(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        throw new Error(data?.message ?? 'Failed to send message');
      }

      setSubmitStatus('success');
      turnstileTokenRef.current = null;
      setTurnstileToken(null);
      setTurnstileKey((k) => k + 1);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        honeypot: ''
      });
    } catch (error) {
      setSubmitStatus('error');
      const msg = error instanceof Error ? error.message : '';
      setErrorMessage(
        msg || 'Failed to submit your message. Please try again or contact us directly at hello@mywakapadi.com'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 bg-white pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 mb-6 tracking-tighter">
              Contact Us
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Have a question or need assistance? We're here to help. Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
              <a href="mailto:hello@mywakapadi.com" className="text-primary hover:text-primary/80">
                hello@mywakapadi.com
              </a>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="font-semibold text-slate-900 mb-2">Phone</h3>
              <a href="https://wa.me/447781183175" className="text-primary hover:text-primary/80">
                +44 7781 183175
              </a>
            </div>
            <div className="glass rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="font-semibold text-slate-900 mb-2">Address</h3>
              <p className="text-slate-600 text-sm">
                Defoe Rd, Ipswich<br />IP1 6SN, UK
              </p>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 md:p-12">
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}
                tabIndex={-1}
                autoComplete="off"
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
                <div className="relative z-0 mb-6">
                  <p className="text-sm text-slate-600 mb-2">
                    {turnstileToken
                      ? 'Security check complete. You can send your message.'
                      : 'Complete the security check before sending.'}
                  </p>
                  <CloudflareTurnstile
                    key={turnstileKey}
                    onVerify={handleTurnstileVerify}
                    onExpire={handleTurnstileExpire}
                  />
                </div>
              )}

              <div className="relative z-10 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full h-14 text-base text-white rounded-xl cursor-pointer hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: '#2894ca' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
