import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { detectCurrency, getPackagePrice, toPaystackAmount, type CurrencyInfo } from '../utils/currency';
import { supabase } from '../lib/supabaseClient';
import { PACKAGES_LIST, type Package } from '../data/packages';

interface PackagesPageProps {
  onNavigate: (page: string, id?: string) => void;
}

export function PackagesPage({ onNavigate }: PackagesPageProps) {
  const [currency, setCurrency] = useState<CurrencyInfo | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [payLoading, setPayLoading] = useState<string | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    setCurrency(detectCurrency());
    
    // Get user email if logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const handlePackagePayment = async (pkg: Package) => {
    if (!currency) return;
    
    setPayError(null);
    setPayLoading(pkg.id);
    
    try {
      // Get user email or prompt for it
      let email = userEmail;
      if (!email) {
        email = prompt('Please enter your email address for payment:');
        if (!email) {
          setPayLoading(null);
          return;
        }
      }

      const priceInfo = getPackagePrice(pkg.priceUsd, currency);
      const paystackAmount = toPaystackAmount(priceInfo.amount, currency.code);

      const res = await fetch('/.netlify/functions/paystack-init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: paystackAmount,
          metadata: {
            packageId: pkg.id,
            packageTitle: pkg.title,
            packageLocation: pkg.location,
            currency: currency.code,
            amountUsd: pkg.priceUsd,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.status) {
        throw new Error(data?.message ?? 'Failed to initialize payment');
      }
      
      window.location.href = data.data.authorization_url;
    } catch (err: any) {
      setPayError(err?.message ?? 'Payment initialization failed');
      setPayLoading(null);
    }
  };

  const PackageCard = ({ pkg, index }: { pkg: Package; index: number }) => {
    const priceInfo = currency ? getPackagePrice(pkg.priceUsd, currency) : null;
    const isLoading = payLoading === pkg.id;

    return (
      <motion.div
        {...fadeIn}
        transition={{ delay: index * 0.1, duration: 0.6 }}
        className="flex"
      >
        <div className="glass rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col w-full">
          <div className="relative h-56 overflow-hidden shrink-0">
            <ImageWithFallback
              src={pkg.image}
              alt={pkg.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            {priceInfo && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-full font-semibold">
                {priceInfo.formatted}
              </div>
            )}
          </div>
          
          <div className="p-6 flex flex-col flex-1">
            <h3 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">
              {pkg.title}
            </h3>
            <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
              <span>{pkg.location}</span>
              <span>•</span>
              <span>{pkg.duration}</span>
            </div>

            <div className="mb-6 flex-1">
              <div className="text-sm font-semibold text-slate-900 mb-3">What's Included:</div>
              <div className="space-y-2">
                {pkg.includes.slice(0, 3).map((item: string, i: number) => (
                  <div key={i} className="text-sm text-slate-600 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1 before:h-1 before:bg-primary before:rounded-full">
                    {item}
                  </div>
                ))}
                {pkg.includes.length > 3 && (
                  <div className="text-sm text-slate-500 italic">
                    +{pkg.includes.length - 3} more inclusions
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <Button 
                onClick={() => onNavigate('package-details', pkg.id)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-xl"
              >
                View Details
              </Button>
              <Button 
                onClick={() => handlePackagePayment(pkg)}
                disabled={isLoading || !currency}
                className="flex-1 text-white rounded-xl"
                style={{ backgroundColor: '#2894ca' }}
              >
                {isLoading ? 'Processing...' : 'Book Package'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pt-32 bg-white">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-7xl font-semibold mb-8 tracking-tighter text-slate-900">
              Travel Packages
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Curated experiences combining luxury travel with strategic opportunities for relocation, healthcare, and investment
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-7xl mx-auto">
          {payError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {payError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {PACKAGES_LIST.map((pkg, index) => (
              <PackageCard key={pkg.id} pkg={pkg} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Custom Package CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl font-semibold mb-6 tracking-tighter text-slate-900">
              Need a Custom Package?
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              We can create a tailored travel experience based on your specific needs and preferences
            </p>
            <Button
              size="lg"
              onClick={() => onNavigate('contact')}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-14"
            >
              Request Custom Package
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
