import { Facebook, Linkedin, Instagram, Youtube } from 'lucide-react';
import logo from 'figma:asset/b406f45c0ec8def20c8b4f10c893165a44754fe7.png';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* About */}
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold tracking-tight mb-4">Wakapadi</h3>
              <img src={logo} alt="Wakapadi Logo" className="h-16 w-auto" />
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              Your trusted partner in visa strategy, migration, and global mobility. 
              Helping Africans and Asians access worldwide opportunities.
            </p>
            {/* Social Media Icons */}
            <div className="flex items-center justify-start gap-3">
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2.5 rounded-lg hover:bg-slate-800" aria-label="X (Twitter)">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2.5 rounded-lg hover:bg-slate-800" aria-label="Threads">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.186 3.998c-2.35 0-4.248.71-5.647 2.111-1.11 1.11-1.731 2.6-1.853 4.43l2.446.193c.096-1.438.525-2.53 1.279-3.283.997-.997 2.453-1.505 4.328-1.505 1.647 0 2.96.428 3.904 1.273.865.775 1.342 1.85 1.342 3.024 0 1.104-.42 2.042-1.249 2.788-.561.506-1.334.93-2.297 1.262.04.08.078.162.115.245 1.244-.386 2.294-.944 3.078-1.65 1.195-1.076 1.8-2.485 1.8-4.191 0-1.725-.677-3.213-1.957-4.298-1.28-1.086-3.047-1.399-4.289-1.399zm-.004 7.003c-1.405 0-2.558.47-3.426 1.397-.868.927-1.303 2.185-1.303 3.744 0 1.56.435 2.817 1.303 3.745.868.927 2.021 1.396 3.426 1.396 1.407 0 2.56-.47 3.428-1.396.868-.928 1.302-2.186 1.302-3.745 0-1.559-.434-2.817-1.302-3.744-.868-.927-2.021-1.397-3.428-1.397zm0 1.947c.881 0 1.576.295 2.064.877.488.582.732 1.393.732 2.417 0 1.023-.244 1.834-.732 2.416-.488.582-1.183.877-2.064.877-.88 0-1.574-.295-2.063-.877-.488-.582-.732-1.393-.732-2.416 0-1.024.244-1.835.732-2.417.489-.582 1.184-.877 2.063-.877z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2.5 rounded-lg hover:bg-slate-800" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2.5 rounded-lg hover:bg-slate-800" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2.5 rounded-lg hover:bg-slate-800" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2.5 rounded-lg hover:bg-slate-800" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors p-2.5 rounded-lg hover:bg-slate-800" aria-label="YouTube">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-slate-300 uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              {[
                { name: 'Tourist Visas', page: 'tourist-visa' },
                { name: 'Work Visas', page: 'work-visa' },
                { name: 'Study Visas', page: 'study-visa' },
                { name: 'Permanent Residency', page: 'permanent-residency' },
                { name: 'Citizenship by Investment', page: 'citizenship' },
              ].map((service) => (
                <li key={service.name}>
                  <button
                    onClick={() => onNavigate(service.page)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-slate-300 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', page: 'about' },
                { name: 'Travel Packages', page: 'packages' },
                { name: 'Blog', page: 'blog' },
                { name: 'FAQ', page: 'faq' },
                { name: 'Contact Us', page: 'contact' },
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-slate-300 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-slate-400">
              <li>
                <a href="https://mywakapadi.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  mywakapadi.com
                </a>
              </li>
              <li>
                <a href="mailto:hello@mywakapadi.com" className="hover:text-white transition-colors">
                  hello@mywakapadi.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/447781183175" className="hover:text-white transition-colors">
                  +44 7781 183175
                </a>
              </li>
              <li className="text-sm leading-relaxed">
                Defoe Rd, Ipswich<br />IP1 6SN, UK
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2026 Wakapadi Lifestyle Limited. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <button
                onClick={() => onNavigate('privacy')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => onNavigate('terms')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => onNavigate('refund')}
                className="text-slate-400 hover:text-white transition-colors"
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