import { Instagram, Facebook, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const linkClass =
  'text-[14px] text-slate-500 hover:text-slate-900 transition-colors duration-300 ease-in-out leading-[2.4]';

const headingClass =
  'text-[14px] font-semibold text-slate-900 uppercase tracking-[0.05em] mb-6';

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#f5f6f8] text-slate-700 border-t border-slate-200">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-[100px] pb-[60px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-10 lg:gap-x-20 mb-20">
          {/* Company */}
          <div>
            <h4 className={headingClass}>Company</h4>
            <ul className="space-y-0">
              {[
                { name: 'About Us', page: 'about' },
                { name: 'Blog', page: 'blog' },
                { name: 'Contact Us', page: 'contact' },
                { name: 'FAQ', page: 'faq' },
              ].map((item) => (
                <li key={item.name}>
                  <button onClick={() => onNavigate(item.page)} className={linkClass}>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className={headingClass}>Explore</h4>
            <ul className="space-y-0">
              {[
                { name: 'Travel Packages', page: 'packages' },
                { name: 'Tourist Visas', page: 'tourist-visa' },
                { name: 'Work Visas', page: 'work-visa' },
                { name: 'Study Visas', page: 'study-visa' },
              ].map((item) => (
                <li key={item.name}>
                  <button onClick={() => onNavigate(item.page)} className={linkClass}>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className={headingClass}>Services</h4>
            <ul className="space-y-0">
              {[
                { name: 'Permanent Residency', page: 'permanent-residency' },
                { name: 'Citizenship by Investment', page: 'citizenship' },
                { name: 'Book a Consultation', page: 'contact' },
              ].map((item) => (
                <li key={item.name}>
                  <button onClick={() => onNavigate(item.page)} className={linkClass}>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={headingClass}>Support</h4>
            <ul className="space-y-0">
              <li>
                <button onClick={() => onNavigate('contact')} className={linkClass}>
                  Contact Form
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/447781183175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <span className={`${linkClass} cursor-default hover:!text-slate-500`}>
                  Defoe Rd, Ipswich, IP1 6SN, UK
                </span>
              </li>
              <li>
                <span className={`${linkClass} cursor-default hover:!text-slate-500`}>
                  Mon – Fri, 9 am – 5 pm
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social icons row — centered */}
        <div className="flex items-center justify-center gap-5 mb-[60px]">
          <a
            href="https://instagram.com/wakapadi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-700 transition-colors duration-300"
            aria-label="Instagram"
          >
            <Instagram size={18} strokeWidth={1.5} />
          </a>
          <a
            href="https://facebook.com/mywakapadi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-700 transition-colors duration-300"
            aria-label="Facebook"
          >
            <Facebook size={18} strokeWidth={1.5} />
          </a>
          <a
            href="https://www.linkedin.com/company/mywakapadi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-700 transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-slate-300/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <p className="text-[13px] text-slate-400">
              © {new Date().getFullYear()} Wakapadi Lifestyle Limited. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-1 text-[13px]">
              <button
                onClick={() => onNavigate('privacy')}
                className="text-slate-400 hover:text-slate-600 transition-colors duration-300 px-2"
              >
                Privacy
              </button>
              <span className="text-slate-300">·</span>
              <button
                onClick={() => onNavigate('terms')}
                className="text-slate-400 hover:text-slate-600 transition-colors duration-300 px-2"
              >
                Terms
              </button>
              <span className="text-slate-300">·</span>
              <button
                onClick={() => onNavigate('cookies')}
                className="text-slate-400 hover:text-slate-600 transition-colors duration-300 px-2"
              >
                Cookies
              </button>
              <span className="text-slate-300">·</span>
              <button
                onClick={() => onNavigate('refund')}
                className="text-slate-400 hover:text-slate-600 transition-colors duration-300 px-2"
              >
                Refund Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}