import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { PACKAGES_LIST } from '../data/packages';
import { detectCurrency, getPackagePrice, type CurrencyInfo } from '../utils/currency';

interface HomePageProps {
  onNavigate: (page: string, id?: string) => void;
}

const FEATURED_PACKAGES_COUNT = 6;

export function HomePage({ onNavigate }: HomePageProps) {
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<CurrencyInfo | null>(null);

  useEffect(() => {
    setCurrency(detectCurrency());
  }, []);

  const featuredPackages = PACKAGES_LIST.slice(0, FEATURED_PACKAGES_COUNT);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const handlePaystackTest = async () => {
    setPayError(null);
    setPayLoading(true);
    try {
      const res = await fetch('/.netlify/functions/paystack-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@mywakapadi.com',
          amount: 20000,
          metadata: { source: 'paystack-test', page: 'home' },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.status) {
        throw new Error(data?.message ?? 'Failed to start payment');
      }
      window.location.href = data.data.authorization_url;
    } catch (err: any) {
      setPayError(err?.message ?? 'Payment init failed');
      setPayLoading(false);
    }
  };

  const services = [
    {
      title: 'Visas',
      description: 'Tourist, work, and study visas for destinations worldwide',
      page: 'tourist-visa'
    },
    {
      title: 'Migration Pathways',
      description: 'Strategic guidance for permanent residency applications',
      page: 'permanent-residency'
    },
    {
      title: 'Citizenship by Investment',
      description: 'Second passport programs for global mobility',
      page: 'citizenship'
    },
    {
      title: 'Medical & Birth Tourism',
      description: 'Comprehensive healthcare and birth abroad packages',
      page: 'packages'
    }
  ];

  const testimonials = [
    {
      name: 'Amara Okonkwo',
      role: 'Tech Professional',
      location: 'Lagos → Toronto',
      content: 'Wakapadi made my Canadian work visa process seamless. Their expertise gave me confidence throughout the journey.'
    },
    {
      name: 'Raj Patel',
      role: 'Business Owner',
      location: 'Mumbai → Dubai',
      content: 'The citizenship by investment program was exactly what I needed. Professional, transparent, and results-driven.'
    },
    {
      name: 'Fatima Al-Hassan',
      role: 'Medical Professional',
      location: 'Cairo → Sydney',
      content: 'Outstanding service for my family\'s relocation to Australia. They handled everything with care and professionalism.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-semibold mb-8 tracking-tighter text-slate-900">
              Your Gateway to Global Opportunities
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl">
              Expert visa strategy, migration pathways, and citizenship solutions for professionals and high-net-worth individuals.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
              <Button 
                size="lg"
                onClick={() => window.open('https://selar.com/wakapadixveev', '_blank')}
                className="text-white rounded-xl px-8 h-14 text-base"
                style={{ backgroundColor: '#2894ca' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2278a8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2894ca'}
              >
                Start Your Journey
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-3 mb-16">
              <Button
                size="lg"
                onClick={handlePaystackTest}
                disabled={payLoading}
                className="bg-accent hover:bg-accent/90 text-white rounded-xl px-6 h-12 text-base"
              >
                {payLoading ? 'Redirecting…' : 'Pay with Paystack (Test)'}
              </Button>
              {payError && (
                <p className="text-sm text-red-600 mt-2 sm:mt-3">{payError}</p>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-8 max-w-md">
              <div>
                <div className="text-4xl font-semibold text-slate-900 mb-1 tracking-tight">40+</div>
                <div className="text-sm text-slate-600">Countries Served</div>
              </div>
              <div>
                <div className="text-4xl font-semibold text-slate-900 mb-1 tracking-tight">2,064+</div>
                <div className="text-sm text-slate-600">Clients Helped</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter text-slate-900">
              Our Services
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl">
              Comprehensive solutions for your global mobility needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                {...fadeIn}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <button
                  onClick={() => onNavigate(service.page)}
                  className="w-full text-left glass rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group"
                >
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3 tracking-tight group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Travel Packages */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter text-slate-900">
              Featured Travel Packages
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl">
              Curated experiences combining luxury and strategic opportunities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {featuredPackages.map((pkg, index) => {
              const priceInfo = currency ? getPackagePrice(pkg.priceUsd, currency) : null;
              return (
                <motion.div
                  key={pkg.id}
                  {...fadeIn}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="flex"
                >
                  <div className="glass rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col w-full">
                    <div className="relative h-56 overflow-hidden shrink-0">
                      <ImageWithFallback
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {priceInfo && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-full font-semibold text-sm">
                          {priceInfo.formatted}
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">
                        {pkg.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                        <span>{pkg.location}</span>
                        <span>{pkg.duration}</span>
                      </div>
                      <div className="mt-auto">
                        <Button
                          onClick={() => onNavigate('package-details', pkg.id)}
                          variant="outline"
                          className="w-full rounded-xl border-slate-200"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <motion.div {...fadeIn} className="mt-12 text-center">
            <Button
              onClick={() => onNavigate('packages')}
              variant="outline"
              className="rounded-xl border-slate-200 px-8"
            >
              View All Travel Packages
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tighter text-slate-900">
              Client Success Stories
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl">
              Real experiences from those who've achieved their mobility goals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                {...fadeIn}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex"
              >
                <div className="glass rounded-2xl p-8 flex flex-col w-full">
                  <p className="text-slate-700 mb-8 leading-relaxed text-lg flex-1">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t border-slate-200 pt-6 mt-auto">
                    <div className="font-semibold text-slate-900 mb-1">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-600 mb-1">
                      {testimonial.role}
                    </div>
                    <div className="text-sm text-primary">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tighter text-slate-900">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Start your journey today and let our experts guide you towards your global mobility goals
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => window.open('https://selar.com/wakapadixveev', '_blank')}
                className="text-white rounded-xl px-8 h-14 text-base"
                style={{ backgroundColor: '#2894ca' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2278a8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2894ca'}
              >
                Start Your Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('contact')}
                className="border-2 border-slate-200 text-slate-900 hover:bg-slate-50 rounded-xl px-8 h-14 text-base"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
