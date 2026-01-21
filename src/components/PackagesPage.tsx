import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PackagesPageProps {
  onNavigate: (page: string, id?: string) => void;
}

export function PackagesPage({ onNavigate }: PackagesPageProps) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const individualPackages = [
    {
      id: 'lux-dubai',
      title: 'Luxury Dubai Experience',
      location: 'United Arab Emirates',
      price: '$4,500',
      duration: '7 days',
      includes: ['5-star hotel accommodation', 'Private airport transfers', 'VIP desert safari experience', 'Fine dining reservations', 'Personal shopping guide'],
      image: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800'
    },
    {
      id: 'med-thailand',
      title: 'Medical Tourism Thailand',
      location: 'Bangkok, Thailand',
      price: '$6,800',
      duration: '14 days',
      includes: ['Hospital fees and consultation', 'Luxury recovery suite', 'Post-operative care', 'Private medical staff', 'Wellness and spa treatments'],
      image: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=800'
    },
    {
      id: 'birth-canada',
      title: 'Birth Tourism Canada',
      location: 'Toronto, Canada',
      price: '$12,500',
      duration: '90 days',
      includes: ['Prenatal medical care', 'Hospital delivery package', 'Luxury accommodation', 'Legal documentation support', 'Postnatal care and support'],
      image: 'https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?w=800'
    },
    {
      id: 'reloc-portugal',
      title: 'Relocation Trip Portugal',
      location: 'Lisbon, Portugal',
      price: '$3,200',
      duration: '10 days',
      includes: ['Serviced apartment', 'Property viewing tours', 'Banking setup assistance', 'School visits for families', 'Lifestyle and area tours'],
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800'
    }
  ];

  const groupPackages = [
    {
      id: 'invest-portugal',
      title: 'Investment Tour Portugal',
      location: 'Lisbon & Porto',
      price: '$2,800',
      duration: '7 days',
      groupSize: '10-15 people',
      includes: ['Shared accommodation', 'Property investment tours', 'Legal consultation sessions', 'Investment seminars', 'Networking dinners'],
      image: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800'
    },
    {
      id: 'wellness-bali',
      title: 'Wellness Retreat Bali',
      location: 'Ubud, Bali',
      price: '$3,500',
      duration: '10 days',
      groupSize: '12-20 people',
      includes: ['Luxury wellness resort', 'Daily yoga and meditation', 'Spa and wellness treatments', 'Healthy organic cuisine', 'Cultural excursions'],
      image: 'https://images.unsplash.com/photo-1519662978799-2f05096d3636?w=800'
    },
    {
      id: 'business-dubai',
      title: 'Business Networking Dubai',
      location: 'Dubai, UAE',
      price: '$4,200',
      duration: '6 days',
      groupSize: '15-25 people',
      includes: ['Business hotel accommodation', 'Corporate networking events', 'Company site visits', 'Legal and tax briefings', 'Group social activities'],
      image: 'https://images.unsplash.com/photo-1604223190546-a43e4c7f29d7?w=800'
    }
  ];

  const PackageCard = ({ pkg, index }: { pkg: any; index: number }) => (
    <motion.div
      {...fadeIn}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <div className="glass rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="relative h-56 overflow-hidden">
          <ImageWithFallback
            src={pkg.image}
            alt={pkg.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-full font-semibold">
            {pkg.price}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">
            {pkg.title}
          </h3>
          <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
            <span>{pkg.location}</span>
            <span>•</span>
            <span>{pkg.duration}</span>
            {pkg.groupSize && (
              <>
                <span>•</span>
                <span>{pkg.groupSize}</span>
              </>
            )}
          </div>

          <div className="mb-6">
            <div className="text-sm font-semibold text-slate-900 mb-3">What's Included:</div>
            <div className="space-y-2">
              {pkg.includes.map((item: string, i: number) => (
                <div key={i} className="text-sm text-slate-600 leading-relaxed pl-3 relative before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1 before:h-1 before:bg-primary before:rounded-full">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={() => onNavigate('package-details', pkg.id)}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl"
          >
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );

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

      {/* Packages Tabs */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="individual" className="w-full">
            <TabsList className="glass-strong p-1 rounded-xl mb-12 inline-flex">
              <TabsTrigger value="individual" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Individual Packages
              </TabsTrigger>
              <TabsTrigger value="group" className="rounded-lg px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Group Travel
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {individualPackages.map((pkg, index) => (
                  <PackageCard key={pkg.id} pkg={pkg} index={index} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="group">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {groupPackages.map((pkg, index) => (
                  <PackageCard key={pkg.id} pkg={pkg} index={index} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
