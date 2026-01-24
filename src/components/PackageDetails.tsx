import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { detectCurrency, getPackagePrice, toPaystackAmount, type CurrencyInfo } from '../utils/currency';
import { supabase } from '../lib/supabaseClient';

interface PackageDetailsProps {
  packageId: string;
  onNavigate: (page: string, id?: string) => void;
}

interface Package {
  id: string;
  title: string;
  location: string;
  priceUsd: number;
  duration: string;
  includes: string[];
  activities: string[];
  image: string;
  description?: string;
  highlights?: string[];
}

const PACKAGES: Record<string, Package> = {
  'mombasa-7': {
    id: 'mombasa-7',
    title: '7 Nights in Mombasa',
    location: 'Mombasa, Kenya',
    priceUsd: 2500,
    duration: '7 nights',
    includes: [
      'Luxury beachfront resort accommodation',
      'Daily breakfast and dinner',
      'Private beach access',
      'Airport transfers',
      '24/7 concierge service'
    ],
    activities: [
      'Snorkeling and diving excursions',
      'Sunset dhow cruise',
      'Old Town cultural tour',
      'Haller Park wildlife experience',
      'Beach volleyball and water sports',
      'Spa and wellness treatments',
      'Local market shopping tour'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    description: 'Experience the pristine beaches and rich culture of Mombasa with luxury accommodations and exciting activities.',
    highlights: ['Beachfront luxury resort', 'Water sports included', 'Cultural immersion']
  },
  'rwanda-7': {
    id: 'rwanda-7',
    title: '7 Nights in Rwanda',
    location: 'Kigali & Volcanoes National Park, Rwanda',
    priceUsd: 3200,
    duration: '7 nights',
    includes: [
      '5-star hotel in Kigali',
      'Luxury lodge near Volcanoes National Park',
      'All meals included',
      'Private guide and driver',
      'Gorilla trekking permit'
    ],
    activities: [
      'Mountain gorilla trekking',
      'Golden monkey tracking',
      'Kigali city tour and genocide memorial',
      'Nyungwe Forest canopy walk',
      'Lake Kivu boat cruise',
      'Traditional dance performances',
      'Coffee plantation tour'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    description: 'Discover the land of a thousand hills with unforgettable wildlife encounters and cultural experiences.',
    highlights: ['Gorilla trekking included', 'Luxury accommodations', 'Private guide']
  },
  'vietnam-honeymoon': {
    id: 'vietnam-honeymoon',
    title: '7 Nights in Vietnam (Honeymoon)',
    location: 'Hanoi, Ha Long Bay, Lan Ha Bay, Cat Ba Island',
    priceUsd: 2800,
    duration: '7 nights',
    includes: [
      'Luxury hotels in Hanoi',
      'Premium cruise in Ha Long Bay',
      'Beachfront resort on Cat Ba Island',
      'All meals and drinks',
      'Private transfers'
    ],
    activities: [
      'Ha Long Bay luxury cruise',
      'Kayaking in Lan Ha Bay',
      'Cat Ba Island exploration',
      'Hanoi Old Quarter food tour',
      'Couples spa treatments',
      'Sunset dinner cruise',
      'Traditional water puppet show',
      'Bike tour through rice paddies'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    description: 'A romantic honeymoon experience through Vietnam\'s most stunning landscapes and cultural treasures.',
    highlights: ['Honeymoon package', 'Luxury cruise', 'Romantic activities']
  },
  'doha-5': {
    id: 'doha-5',
    title: '5 Nights in Doha',
    location: 'Doha, Qatar',
    priceUsd: 2200,
    duration: '5 nights',
    includes: [
      '5-star hotel in West Bay',
      'Daily breakfast',
      'Airport transfers',
      'Desert safari experience',
      'City tour'
    ],
    activities: [
      'Souq Waqif exploration',
      'Desert dune bashing and camel ride',
      'Museum of Islamic Art visit',
      'Pearl-Qatar shopping',
      'Dhow cruise in the bay',
      'Katara Cultural Village tour',
      'Luxury spa experience'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    description: 'Experience the perfect blend of modern luxury and traditional Qatari culture in Doha.',
    highlights: ['Desert safari included', 'Cultural immersion', 'Luxury shopping']
  },
  'johannesburg-7': {
    id: 'johannesburg-7',
    title: '7 Nights in Johannesburg',
    location: 'Johannesburg, South Africa',
    priceUsd: 2400,
    duration: '7 nights',
    includes: [
      'Boutique hotel in Sandton',
      'Daily breakfast',
      'Private guide',
      'Safari day trip',
      'Airport transfers'
    ],
    activities: [
      'Soweto township tour',
      'Apartheid Museum visit',
      'Lion Park safari experience',
      'Cradle of Humankind tour',
      'Gold Reef City theme park',
      'Constitution Hill visit',
      'Neighborhood food tours',
      'Sunset rooftop dining'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    description: 'Explore the vibrant city of Johannesburg with its rich history, culture, and exciting adventures.',
    highlights: ['Safari included', 'Historical tours', 'City exploration']
  },
  'mauritius-honeymoon': {
    id: 'mauritius-honeymoon',
    title: '7 Nights in Mauritius (Honeymoon)',
    location: 'Mauritius',
    priceUsd: 3500,
    duration: '7 nights',
    includes: [
      'Luxury beachfront resort',
      'All-inclusive meals and drinks',
      'Private villa with pool',
      'Airport transfers',
      'Honeymoon amenities'
    ],
    activities: [
      'Private beach dinners',
      'Couples spa treatments',
      'Snorkeling and diving',
      'Catamaran cruise',
      'Seven Colored Earths visit',
      'Chamarel Waterfall tour',
      'Dolphin watching',
      'Sunset photography sessions'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    description: 'A romantic paradise escape with pristine beaches, crystal-clear waters, and unforgettable moments.',
    highlights: ['All-inclusive', 'Honeymoon package', 'Private villa']
  },
  'zambia-7': {
    id: 'zambia-7',
    title: '7 Nights in Zambia',
    location: 'Livingstone & Victoria Falls, Zambia',
    priceUsd: 2900,
    duration: '7 nights',
    includes: [
      'Luxury lodge near Victoria Falls',
      'All meals',
      'Victoria Falls entry',
      'Private guide',
      'Airport transfers'
    ],
    activities: [
      'Victoria Falls tour',
      'White water rafting',
      'Bungee jumping',
      'Devil\'s Pool swim',
      'Sunset cruise on Zambezi',
      'Game drive in Mosi-oa-Tunya',
      'Helicopter flight over falls',
      'Traditional village visit'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    description: 'Adventure and natural wonder await at one of the world\'s most spectacular waterfalls.',
    highlights: ['Adventure activities', 'Victoria Falls access', 'Luxury lodge']
  },
  'accra-7': {
    id: 'accra-7',
    title: '7 Nights in Accra',
    location: 'Accra, Ghana',
    priceUsd: 2100,
    duration: '7 nights',
    includes: [
      '4-star hotel in Osu',
      'Daily breakfast',
      'City tour',
      'Cultural experiences',
      'Airport transfers'
    ],
    activities: [
      'Jamestown walking tour',
      'Kwame Nkrumah Mausoleum',
      'Cape Coast Castle visit',
      'Kakum National Park canopy walk',
      'Beach day at Labadi Beach',
      'Art Center shopping',
      'Traditional drumming lessons',
      'Local cuisine cooking class'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    description: 'Immerse yourself in Ghana\'s rich history, vibrant culture, and warm hospitality.',
    highlights: ['Cultural immersion', 'Historical sites', 'Beach access']
  },
  'explore-naija-13': {
    id: 'explore-naija-13',
    title: 'Explore Naija in 13 Days',
    location: 'Lagos, Abuja, Calabar, Nigeria',
    priceUsd: 3800,
    duration: '13 days',
    includes: [
      'Luxury hotels in each city',
      'All meals',
      'Private guide and driver',
      'Domestic flights',
      'All entrance fees'
    ],
    activities: [
      'Lagos Island and Mainland tour',
      'Nike Art Gallery visit',
      'Tarkwa Bay beach',
      'Abuja city tour and Aso Rock',
      'Calabar Carnival experience',
      'Obudu Cattle Ranch visit',
      'Tinapa Business Resort',
      'Local market tours',
      'Traditional festivals',
      'Nigerian cuisine experiences'
    ],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    description: 'A comprehensive journey through Nigeria\'s most vibrant cities, cultures, and natural wonders.',
    highlights: ['Multi-city tour', 'All-inclusive', 'Cultural experiences']
  }
};

export function PackageDetails({ packageId, onNavigate }: PackageDetailsProps) {
  const [currency, setCurrency] = useState<CurrencyInfo | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const pkg = PACKAGES[packageId];

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
