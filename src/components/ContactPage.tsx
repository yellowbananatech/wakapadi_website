import { useState } from 'react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage(_props: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honeypot: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const whatsappUrl = 'https://wa.me/447781183175';

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
      setSubmitStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address.');
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
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data?.success) {
        throw new Error(data?.message ?? 'Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        honeypot: '',
      });
    } catch (error) {
      setSubmitStatus('error');
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

  return (
    <div className="min-h-screen pt-32 bg-white pb-32">
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
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#2894ca' }}
              >
                Open WhatsApp
              </a>
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
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                Thank you for your message! We&apos;ll get back to you soon.
              </div>
            )}

            {submitStatus === 'error' && errorMessage && (
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

              <div className="relative z-20 pt-4 pb-2">
                <button
                  type="button"
                  aria-disabled={isSubmitting}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    void submitMessage();
                  }}
                  onClick={() => void submitMessage()}
                  className="block w-full h-14 text-base font-medium text-white rounded-xl transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2894ca] cursor-pointer select-none"
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
