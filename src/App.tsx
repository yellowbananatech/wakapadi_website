import { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ServicePage } from './components/ServicePage';
import { BlogPage } from './components/BlogPage';
import { BlogPost } from './components/BlogPost';
import { PackagesPage } from './components/PackagesPage';
import { PackageDetails } from './components/PackageDetails';
import { ClientDashboard } from './components/ClientDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginPage } from './components/LoginPage';
import { PaymentSuccess } from './components/PaymentSuccess';
import { TermsPage } from './components/TermsPage';
import { ContactPage } from './components/ContactPage';
import { supabase } from './lib/supabaseClient';

// Local minimal session shape to avoid tight coupling to supabase-js types in this file.
type Session = {
  user?: {
    id?: string;
  };
} | null;

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);

      if (window.location.pathname === '/payment-success') {
        setCurrentPage('payment-success');
      }
    };

    void init();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: string, nextSession: Session) => {
      if (!mounted) return;
      setSession(nextSession);
      }
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;
    setIsLoggedIn(Boolean(userId));

    if (!userId) {
      setIsAdmin(false);
      return;
    }

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Failed to load profile:', error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(Boolean(data?.is_admin));
    };

    void loadProfile();
  }, [session]);

  // Service data for different visa/migration pages
  const serviceData: Record<string, any> = {
    'tourist-visa': {
      title: 'Tourist Visas',
      subtitle: 'Travel Services',
      description: 'Expert assistance with tourist visa applications for your dream destinations worldwide. We handle the complexity so you can focus on planning your trip.',
      benefits: [
        'Expert guidance through the entire application process',
        'Document preparation and verification support',
        'Higher approval rates with our proven strategies',
        'Fast-track processing options available',
        'Comprehensive post-approval travel guidance',
        'Support for visa extensions and renewals'
      ],
      process: [
        {
          step: 1,
          title: 'Initial Consultation',
          description: 'We assess your travel plans, review your documents, and determine the best visa strategy for your destination.'
        },
        {
          step: 2,
          title: 'Document Preparation',
          description: 'Our team helps you gather and prepare all required documents, ensuring everything meets embassy standards.'
        },
        {
          step: 3,
          title: 'Application Submission',
          description: 'We submit your application with complete documentation and follow up with the embassy on your behalf.'
        },
        {
          step: 4,
          title: 'Interview Preparation',
          description: 'If required, we provide comprehensive interview coaching to maximize your chances of approval.'
        },
        {
          step: 5,
          title: 'Visa Approval & Travel',
          description: 'Receive your visa and travel with confidence. We provide ongoing support throughout your trip.'
        }
      ],
      timeline: '2-6 weeks',
      costRange: '$500 - $2,500'
    },
    'work-visa': {
      title: 'Work Visas',
      subtitle: 'Employment Immigration',
      description: 'Comprehensive work visa services for skilled professionals seeking employment opportunities abroad. Navigate complex immigration requirements with expert support.',
      benefits: [
        'Employer sponsorship assistance and coordination',
        'Labor market impact assessment (LMIA) support',
        'Qualification assessment and credential evaluation',
        'Family sponsorship and dependent visa guidance',
        'Expedited processing options for high-demand sectors',
        'Path to permanent residency consultation'
      ],
      process: [
        {
          step: 1,
          title: 'Eligibility Assessment',
          description: 'We evaluate your qualifications, work experience, and the requirements of your target country to determine your eligibility.'
        },
        {
          step: 2,
          title: 'Job Offer Verification',
          description: 'We work with your employer to ensure the job offer meets all immigration requirements and assist with necessary documentation.'
        },
        {
          step: 3,
          title: 'LMIA/Sponsorship Process',
          description: 'Support your employer through the labor market testing and sponsorship approval process.'
        },
        {
          step: 4,
          title: 'Work Permit Application',
          description: 'Complete preparation and submission of your work permit application with all supporting documents.'
        },
        {
          step: 5,
          title: 'Approval & Relocation',
          description: 'Receive your work permit and get support with your relocation and settlement in your new country.'
        }
      ],
      timeline: '3-6 months',
      costRange: '$2,000 - $8,000'
    },
    'study-visa': {
      title: 'Study Visas',
      subtitle: 'Education Immigration',
      description: 'Complete study visa solutions for students pursuing academic excellence abroad. From university admission to visa approval, we handle every detail.',
      benefits: [
        'University selection and application assistance',
        'Letter of acceptance coordination',
        'Financial documentation support',
        'Scholarship application guidance',
        'Post-graduation work permit advice',
        'Family accompaniment visa support'
      ],
      process: [
        {
          step: 1,
          title: 'Academic Assessment',
          description: 'Review your academic background and career goals to identify the best programs and institutions.'
        },
        {
          step: 2,
          title: 'University Application',
          description: 'Assist with university applications, statement of purpose, and securing letters of acceptance.'
        },
        {
          step: 3,
          title: 'Financial Planning',
          description: 'Help prepare proof of funds, scholarship applications, and financial documentation.'
        },
        {
          step: 4,
          title: 'Visa Application',
          description: 'Complete study permit application with all required educational and financial documents.'
        },
        {
          step: 5,
          title: 'Pre-Departure Support',
          description: 'Guidance on accommodation, travel arrangements, and settling into your new academic environment.'
        }
      ],
      timeline: '4-8 months',
      costRange: '$1,500 - $5,000'
    },
    'permanent-residency': {
      title: 'Permanent Residency',
      subtitle: 'Immigration Services',
      description: 'Strategic guidance for obtaining permanent residency in your destination country. Build a new life abroad with comprehensive PR application support.',
      benefits: [
        'Points assessment and profile optimization',
        'Provincial nominee program (PNP) guidance',
        'Express Entry profile management',
        'Skills assessment and credential evaluation',
        'Job search and networking support',
        'Settlement services and integration planning'
      ],
      process: [
        {
          step: 1,
          title: 'Comprehensive Assessment',
          description: 'Evaluate your profile against various PR pathways to identify the best route for your situation.'
        },
        {
          step: 2,
          title: 'Profile Enhancement',
          description: 'Strategic guidance on improving your points score through education, work experience, or language tests.'
        },
        {
          step: 3,
          title: 'Expression of Interest',
          description: 'Submit your EOI or Express Entry profile and manage your application in the candidate pool.'
        },
        {
          step: 4,
          title: 'Invitation & Documentation',
          description: 'Upon receiving an invitation, we prepare and submit your complete PR application package.'
        },
        {
          step: 5,
          title: 'Landing & Settlement',
          description: 'Support with final steps, landing procedures, and settling into your new permanent home.'
        }
      ],
      timeline: '6-18 months',
      costRange: '$3,000 - $12,000'
    },
    'citizenship': {
      title: 'Citizenship by Investment',
      subtitle: 'Investment Immigration',
      description: 'Premium citizenship and residency programs through investment. Secure a second passport and expand your global mobility options.',
      benefits: [
        'Access to multiple citizenship programs',
        'Complete due diligence support',
        'Investment structuring advice',
        'Family inclusion in citizenship',
        'Visa-free travel to 150+ countries',
        'Tax planning and optimization guidance'
      ],
      process: [
        {
          step: 1,
          title: 'Program Selection',
          description: 'Review available citizenship programs based on your investment capacity, timeline, and mobility goals.'
        },
        {
          step: 2,
          title: 'Due Diligence',
          description: 'Complete background checks, document verification, and preliminary approval processes.'
        },
        {
          step: 3,
          title: 'Investment Execution',
          description: 'Structure and execute your approved investment (real estate, business, government bonds, or donation).'
        },
        {
          step: 4,
          title: 'Citizenship Application',
          description: 'Submit your citizenship application with proof of investment and all supporting documents.'
        },
        {
          step: 5,
          title: 'Passport Delivery',
          description: 'Receive your new citizenship certificate and passport, typically within 3-6 months.'
        }
      ],
      timeline: '3-12 months',
      costRange: '$150,000 - $500,000+'
    }
  };

  const handleNavigation = (page: string, id?: string) => {
    setCurrentPage(page);
    if (id) {
      if (page === 'blog-post') {
        setSelectedBlogPostId(id);
      } else if (page === 'package-details') {
        setSelectedPackageId(id);
      }
    }
    if (page === 'payment-success') {
      window.history.pushState({}, '', `/payment-success${window.location.search}`);
    } else {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo(0, 0);
  };

  const handleAuth = async (args: { mode: 'signIn' | 'signUp'; email: string; password: string; fullName?: string }) => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      if (args.mode === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword({
          email: args.email,
          password: args.password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: args.email,
          password: args.password,
          options: {
            data: {
              full_name: args.fullName ?? '',
            },
          },
        });
        if (error) throw error;
      }

      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;
      if (!userId) {
        setAuthError('Account created. Please check your email to confirm/sign in.');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .maybeSingle();
      if (profileError) throw profileError;

      setCurrentPage(profile?.is_admin ? 'admin' : 'dashboard');
    } catch (e: any) {
      setAuthError(e?.message ?? 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    void supabase.auth.signOut();
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigation} />;
      
      case 'tourist-visa':
      case 'work-visa':
      case 'study-visa':
      case 'permanent-residency':
      case 'citizenship':
        return (
          <ServicePage 
            service={serviceData[currentPage]} 
            onNavigate={handleNavigation}
          />
        );
      
      case 'blog':
        return <BlogPage onNavigate={handleNavigation} />;
      
      case 'blog-post':
        return <BlogPost onNavigate={handleNavigation} postId={selectedBlogPostId ?? undefined} />;
      
      case 'packages':
        return <PackagesPage onNavigate={handleNavigation} />;
      
      case 'package-details':
        return <PackageDetails packageId={selectedPackageId || ''} onNavigate={handleNavigation} />;
      
      case 'dashboard':
        return isLoggedIn ? (
          <ClientDashboard onNavigate={handleNavigation} />
        ) : (
          <LoginPage
            onAuth={handleAuth}
            onNavigate={handleNavigation}
            isLoading={authLoading}
            error={authError}
          />
        );
      
      case 'admin':
        return isLoggedIn && isAdmin ? (
          <AdminDashboard onNavigate={handleNavigation} />
        ) : isLoggedIn ? (
          <HomePage onNavigate={handleNavigation} />
        ) : (
          <LoginPage
            onAuth={handleAuth}
            onNavigate={handleNavigation}
            isLoading={authLoading}
            error={authError}
          />
        );
      
      case 'login':
        return (
          <LoginPage
            onAuth={handleAuth}
            onNavigate={handleNavigation}
            isLoading={authLoading}
            error={authError}
          />
        );
      
      case 'contact':
        return <ContactPage onNavigate={handleNavigation} />;
      
      case 'terms':
      case 'privacy':
      case 'acceptable-use':
      case 'refund':
      case 'user-services':
      case 'data-processing':
        return <TermsPage onNavigate={handleNavigation} initialPage={currentPage} />;
      
      case 'payment-success':
        return <PaymentSuccess onNavigate={handleNavigation} />;
      
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {currentPage !== 'login' && (
        <Navigation
          onNavigate={handleNavigation}
          currentPage={currentPage}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
      )}
      
      <main>
        {renderPage()}
      </main>
      
      {currentPage !== 'login' && currentPage !== 'dashboard' && currentPage !== 'admin' && (
        <Footer onNavigate={handleNavigation} />
      )}
      
      <Toaster />
    </div>
  );
}
