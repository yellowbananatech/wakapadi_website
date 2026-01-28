import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { detectCurrency, getPackagePrice, toPaystackAmount, type CurrencyInfo } from '../utils/currency';
import { supabase } from '../lib/supabaseClient';
import { PACKAGES_BY_ID } from '../data/packages';

interface PackageDetailsProps {
  packageId: string;
  onNavigate: (page: string, id?: string) => void;
}

export function PackageDetails({ packageId, onNavigate }: PackageDetailsProps) {
  const [currency, setCurrency] = useState<CurrencyInfo | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const pkg = PACKAGES_BY_ID[packageId];

  useEffect(() => {
    setCurrency(detectCurrency());
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });
  }, []);

  if (!pkg) {
    return (
      <div className="min-h-screen pt-32 bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-slate-900 mb-4">Package Not Found</h1>
          <Button onClick={() => onNavigate('packages')} className="bg-primary hover:bg-primary/90 text-white rounded-xl">
            Back to Packages
          </Button>
        </div>
      </div>
    );
  }

  const priceInfo = currency ? getPackagePrice(pkg.priceUsd, currency) : null;

  const handlePayment = async () => {
    if (!currency) return;
    
    setPayError(null);
    setPayLoading(true);
    
    try {
      let email = userEmail;
      if (!email) {
        email = prompt('Please enter your email address for payment:');
        if (!email) {
          setPayLoading(false);
          return;
        }
      }

      const paystackAmount = toPaystackAmount(priceInfo!.amount, currency.code);

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
      setPayLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Button
          onClick={() => onNavigate('packages')}
          className="mb-8 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-xl"
        >
          ← Back to Packages
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
                <ImageWithFallback
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4 tracking-tighter">
                {pkg.title}
              </h1>
              
              <div className="flex items-center gap-4 mb-6 text-slate-600">
                <span>{pkg.location}</span>
                <span>•</span>
                <span>{pkg.duration}</span>
              </div>

              {pkg.description && (
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  {pkg.description}
                </p>
              )}

              {pkg.highlights && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">Highlights</h2>
                  <div className="flex flex-wrap gap-3">
                    {pkg.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">What's Included</h2>
                <div className="space-y-3">
                  {pkg.includes.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-slate-600 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-4">Activities & Experiences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pkg.activities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-slate-600 leading-relaxed">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-32"
            >
              <div className="glass rounded-2xl p-6">
                {priceInfo && (
                  <div className="mb-6">
                    <div className="text-sm text-slate-600 mb-2">Price</div>
                    <div className="text-4xl font-semibold text-slate-900">
                      {priceInfo.formatted}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      per person
                    </div>
                  </div>
                )}

                {payError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {payError}
                  </div>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={payLoading || !currency}
                  className="w-full text-white rounded-xl mb-4"
                  style={{ backgroundColor: '#2894ca' }}
                >
                  {payLoading ? 'Processing...' : 'Book Package'}
                </Button>

                <Button
                  onClick={() => onNavigate('contact')}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-xl"
                >
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
