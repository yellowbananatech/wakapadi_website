import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from './ui/button';
import logo from 'figma:asset/b406f45c0ec8def20c8b4f10c893165a44754fe7.png';

interface NavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
}

export function Navigation({ onNavigate, currentPage, isLoggedIn, isAdmin, onLogout }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { name: 'Tourist Visas', page: 'tourist-visa', desc: 'Short-term travel visas for leisure and business' },
    { name: 'Work Visas', page: 'work-visa', desc: 'Employment opportunities abroad' },
    { name: 'Study Visas', page: 'study-visa', desc: 'Academic programs worldwide' },
    { name: 'Permanent Residency', page: 'permanent-residency', desc: 'Settle permanently in your destination' },
    { name: 'Citizenship by Investment', page: 'citizenship', desc: 'Second passport programs' },
  ];

  const travel = [
    { name: 'Luxury Travel', desc: 'Premium experiences worldwide' },
    { name: 'Medical Tourism', desc: 'Healthcare and wellness packages' },
    { name: 'Birth Tourism', desc: 'Complete birth abroad packages' },
    { name: 'Investment Tours', desc: 'Property and business exploration' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'mt-4 mx-4 md:mx-8' 
            : 'mt-6 mx-6 md:mx-12'
        }`}
      >
        <div 
          className={`glass-strong rounded-2xl transition-all duration-300 ${
            scrolled ? 'py-3 px-6' : 'py-4 px-8'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <button 
                onClick={() => onNavigate('home')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <span className="text-2xl font-semibold tracking-tighter text-slate-900">
                  Wakapadi
                </span>
                <img 
                  src={logo} 
                  alt="Wakapadi Logo" 
                  className={`${scrolled ? 'h-8' : 'h-10'} w-auto transition-all duration-300`}
                />
              </button>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                <button
                  onClick={() => onNavigate('home')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    currentPage === 'home'
                      ? 'text-primary bg-primary/5'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Home
                </button>
                
                <div 
                  className="relative"
                  onMouseEnter={() => setActiveMenu('services')}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button
                    className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    Services
                  </button>
                  
                  {activeMenu === 'services' && (
                    <div className="absolute top-full left-0 mt-2 w-96 animate-slide-down">
                      <div className="glass-strong rounded-2xl p-6 shadow-xl">
                        <div className="space-y-1">
                          {services.map((service) => (
                            <button
                              key={service.page}
                              onClick={() => {
                                onNavigate(service.page);
                                setActiveMenu(null);
                              }}
                              className="w-full text-left p-3 rounded-lg hover:bg-white/50 transition-all group"
                            >
                              <div className="font-medium text-slate-900 group-hover:text-primary transition-colors">
                                {service.name}
                              </div>
                              <div className="text-sm text-slate-600 mt-0.5">
                                {service.desc}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div 
                  className="relative"
                  onMouseEnter={() => setActiveMenu('travel')}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button
                    onClick={() => onNavigate('packages')}
                    className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    Travel Packages
                  </button>
                  
                  {activeMenu === 'travel' && (
                    <div className="absolute top-full left-0 mt-2 w-80 animate-slide-down">
                      <div className="glass-strong rounded-2xl p-6 shadow-xl">
                        <div className="space-y-1">
                          {travel.map((item) => (
                            <button
                              key={item.name}
                              onClick={() => {
                                onNavigate('packages');
                                setActiveMenu(null);
                              }}
                              className="w-full text-left p-3 rounded-lg hover:bg-white/50 transition-all group"
                            >
                              <div className="font-medium text-slate-900 group-hover:text-primary transition-colors">
                                {item.name}
                              </div>
                              <div className="text-sm text-slate-600 mt-0.5">
                                {item.desc}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onNavigate('blog')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    currentPage === 'blog'
                      ? 'text-primary bg-primary/5'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Blog
                </button>
                
                {isLoggedIn && (
                  <>
                    {isAdmin && (
                      <button
                        onClick={() => onNavigate('admin')}
                        className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all"
                      >
                        Admin
                      </button>
                    )}
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={onLogout}
                      className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all"
                    >
                      Logout
                    </button>
                  </>
                )}
                
                {!isLoggedIn && (
                  <button
                    onClick={() => onNavigate('login')}
                    className="px-4 py-2 text-sm font-medium rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    Login
                  </button>
                )}
              </div>

              <div className="hidden lg:block">
                <Button
                  onClick={() => window.open('https://selar.com/wakapadixveev', '_blank')}
                  className="text-white rounded-xl px-6"
                  style={{ backgroundColor: '#2894ca' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2278a8'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2894ca'}
                >
                  Start Your Journey
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:text-primary rounded-lg"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-24 left-4 right-4 bottom-4 glass-strong rounded-2xl p-6 overflow-y-auto animate-slide-down">
            <div className="space-y-4">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-3 px-4 rounded-lg text-slate-900 font-medium hover:bg-white/50"
              >
                Home
              </button>
              
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 px-4 mb-2">SERVICES</div>
                {services.map((service) => (
                  <button
                    key={service.page}
                    onClick={() => {
                      onNavigate(service.page);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 px-4 rounded-lg hover:bg-white/50"
                  >
                    <div className="font-medium text-slate-900">{service.name}</div>
                    <div className="text-sm text-slate-600">{service.desc}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-500 px-4 mb-2">TRAVEL</div>
                {travel.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      onNavigate('packages');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 px-4 rounded-lg hover:bg-white/50"
                  >
                    <div className="font-medium text-slate-900">{item.name}</div>
                    <div className="text-sm text-slate-600">{item.desc}</div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  onNavigate('blog');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-3 px-4 rounded-lg text-slate-900 font-medium hover:bg-white/50"
              >
                Blog
              </button>

              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left py-3 px-4 rounded-lg text-slate-900 font-medium hover:bg-white/50"
                    >
                      Admin
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-3 px-4 rounded-lg text-slate-900 font-medium hover:bg-white/50"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-3 px-4 rounded-lg text-slate-900 font-medium hover:bg-white/50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-3 px-4 rounded-lg text-slate-900 font-medium hover:bg-white/50"
                >
                  Login
                </button>
              )}

              <Button
                onClick={() => {
                  window.open('https://selar.com/wakapadixveev', '_blank');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-white rounded-xl mt-4"
                style={{ backgroundColor: '#2894ca' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2278a8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2894ca'}
              >
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile WhatsApp Button — hidden on contact so it does not cover Send Message */}
      {currentPage !== 'contact' && (
        <a
          href="https://wa.me/447781183175"
          className="lg:hidden fixed bottom-6 right-6 bg-accent hover:bg-accent/90 text-black rounded-full p-4 shadow-lg z-50 transition-transform hover:scale-105"
          aria-label="Chat on WhatsApp"
        >
          <Phone size={24} />
        </a>
      )}
    </>
  );
}