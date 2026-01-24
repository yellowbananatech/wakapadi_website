import { motion } from 'motion/react';
import { Button } from './ui/button';

interface ServicePageProps {
  service: {
    title: string;
    subtitle: string;
    description: string;
    benefits: string[];
    process: { step: number; title: string; description: string }[];
    timeline: string;
    costRange: string;
  };
  onNavigate: (page: string) => void;
}

export function ServicePage({ service, onNavigate }: ServicePageProps) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
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
            <div className="text-sm font-medium text-primary mb-4 uppercase tracking-wider">
              {service.subtitle}
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold mb-8 tracking-tighter text-slate-900">
              {service.title}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-12">
              {service.description}
            </p>
            <Button
              size="lg"
              onClick={() => window.open('https://selar.com/wakapadixveev', '_blank')}
              className="text-white rounded-xl px-8 h-14 text-base"
              style={{ backgroundColor: '#2894ca' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2278a8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2894ca'}
            >
              Get Assessed
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="mb-16">
            <h2 className="text-4xl font-semibold mb-6 tracking-tighter text-slate-900">
              Why Choose This Service?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl">
              Benefits you can expect when working with us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            {service.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="glass rounded-2xl p-6 hover:shadow-lg transition-all">
                  <p className="text-slate-700 leading-relaxed">{benefit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="mb-16">
            <h2 className="text-4xl font-semibold mb-6 tracking-tighter text-slate-900">
              Simple Step-by-Step Process
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl">
              We guide you through every stage of your journey
            </p>
          </motion.div>

          <div className="max-w-4xl space-y-6">
            {service.process.map((step, index) => (
              <motion.div
                key={step.step}
                {...fadeIn}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="glass rounded-2xl p-8 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-semibold text-lg">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline & Cost */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <motion.div {...fadeIn}>
              <div className="glass rounded-2xl p-8 h-full">
                <div className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">
                  Timeline
                </div>
                <div className="text-4xl font-semibold text-slate-900 mb-4 tracking-tight">
                  {service.timeline}
                </div>
                <p className="text-slate-600">
                  Average processing time for this service
                </p>
              </div>
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.1, duration: 0.6 }}>
              <div className="glass rounded-2xl p-8 h-full">
                <div className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">
                  Investment Range
                </div>
                <div className="text-4xl font-semibold text-slate-900 mb-4 tracking-tight">
                  {service.costRange}
                </div>
                <p className="text-slate-600">
                  Pricing varies based on specific requirements
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-semibold mb-8 tracking-tighter text-slate-900">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Let us assess your eligibility and create a personalized strategy for your success
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
                Get Assessed Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
