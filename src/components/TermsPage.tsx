import { useState } from 'react';
import { motion } from 'motion/react';

interface TermsPageProps {
  onNavigate: (page: string) => void;
  initialPage?: string;
}

type LegalPage = 'privacy' | 'acceptable-use' | 'refund' | 'terms' | 'user-services' | 'data-processing';

interface LegalPageInfo {
  id: LegalPage;
  title: string;
  content: string;
}

const LEGAL_PAGES: Record<LegalPage, LegalPageInfo> = {
  privacy: {
    id: 'privacy',
    title: 'Privacy & Cookie Policy',
    content: `# Privacy & Cookie Policy

**Last Updated: January 2025**

## 1. Introduction

Wakapadi Lifestyle Limited ("we," "our," or "us") is committed to protecting your privacy. This Privacy & Cookie Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.

## 2. Information We Collect

### 2.1 Personal Information
We may collect personal information that you provide directly to us, including:
- Name and contact information (email, phone number, address)
- Payment information (processed securely through third-party payment processors)
- Travel preferences and booking details
- Account credentials

### 2.2 Automatically Collected Information
We automatically collect certain information when you visit our website:
- IP address and location data
- Browser type and version
- Device information
- Usage data and website interactions
- Cookies and similar tracking technologies

## 3. How We Use Your Information

We use the collected information for:
- Processing and managing your bookings and travel arrangements
- Communicating with you about your bookings and our services
- Improving our website and services
- Marketing and promotional purposes (with your consent)
- Legal compliance and fraud prevention

## 4. Cookies and Tracking Technologies

We use cookies and similar technologies to:
- Remember your preferences and settings
- Analyze website traffic and usage patterns
- Provide personalized content and advertisements
- Ensure website security and functionality

You can control cookies through your browser settings, but this may affect website functionality.

## 5. Information Sharing

We may share your information with:
- Service providers and business partners (e.g., payment processors, travel providers)
- Legal authorities when required by law
- Business transfers (in case of merger or acquisition)

We do not sell your personal information to third parties.

## 6. Data Security

We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet is 100% secure.

## 7. Your Rights

You have the right to:
- Access your personal information
- Correct inaccurate information
- Request deletion of your information
- Object to processing of your information
- Data portability

## 8. International Data Transfers

Your information may be transferred to and processed in countries other than your country of residence, which may have different data protection laws.

## 9. Children's Privacy

Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.

## 10. Changes to This Policy

We may update this Privacy & Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.

## 11. Contact Us

If you have questions about this Privacy & Cookie Policy, please contact us at:
- Email: hello@mywakapadi.com
- Address: Defoe Rd, Ipswich, IP1 6SN, UK`
  },
  'acceptable-use': {
    id: 'acceptable-use',
    title: 'Acceptable Use Policy',
    content: `# Acceptable Use Policy

**Last Updated: January 2025**

## 1. Introduction

This Acceptable Use Policy ("Policy") governs your use of Wakapadi's website and services. By accessing or using our services, you agree to comply with this Policy.

## 2. Prohibited Activities

You agree not to:
- Use our services for any illegal or unauthorized purpose
- Violate any applicable laws or regulations
- Infringe upon the rights of others
- Transmit any harmful, offensive, or inappropriate content
- Attempt to gain unauthorized access to our systems
- Interfere with or disrupt our services or servers
- Use automated systems to access our services without permission
- Impersonate any person or entity
- Collect or harvest information about other users

## 3. User Content

You are responsible for any content you submit through our services. You agree that your content:
- Does not violate any laws or third-party rights
- Is accurate and not misleading
- Does not contain malicious code or viruses
- Does not infringe on intellectual property rights

## 4. Intellectual Property

All content on our website, including text, graphics, logos, and software, is the property of Wakapadi or its licensors and is protected by copyright and other intellectual property laws.

## 5. Account Security

You are responsible for maintaining the security of your account credentials. You must notify us immediately of any unauthorized access to your account.

## 6. Monitoring and Enforcement

We reserve the right to:
- Monitor your use of our services
- Remove or disable access to any content that violates this Policy
- Suspend or terminate your account for violations
- Take legal action if necessary

## 7. Reporting Violations

If you become aware of any violation of this Policy, please report it to us at hello@mywakapadi.com.

## 8. Consequences of Violations

Violations of this Policy may result in:
- Immediate termination of your account
- Legal action
- Reporting to law enforcement authorities

## 9. Changes to This Policy

We may update this Policy from time to time. Continued use of our services after changes constitutes acceptance of the updated Policy.

## 10. Contact Us

For questions about this Policy, contact us at hello@mywakapadi.com.`
  },
  refund: {
    id: 'refund',
    title: 'Refund Policy',
    content: `# Refund Policy

**Last Updated: January 2025**

## 1. General Refund Policy

Wakapadi Lifestyle Limited ("we," "our," or "us") strives to provide excellent service. This Refund Policy outlines the circumstances under which refunds may be issued.

## 2. Booking Cancellations

### 2.1 Cancellation by Customer
- Cancellations made more than 30 days before travel: Full refund minus 10% administrative fee
- Cancellations made 15-30 days before travel: 50% refund
- Cancellations made less than 15 days before travel: No refund

### 2.2 Cancellation by Wakapadi
If we cancel your booking due to circumstances beyond our control (e.g., natural disasters, government restrictions), you will receive a full refund or credit for future travel.

## 3. Service Fees

Administrative and processing fees are generally non-refundable unless the service is not provided due to our error.

## 4. Refund Processing Time

Refunds will be processed within 14-21 business days to the original payment method used for the transaction.

## 5. Chargebacks

If you initiate a chargeback without first contacting us, we reserve the right to dispute the chargeback and may suspend your account.

## 6. Special Circumstances

We may consider refunds in special circumstances such as:
- Medical emergencies (with documentation)
- Death in the family (with documentation)
- Natural disasters or travel restrictions

## 7. Dispute Resolution

If you are not satisfied with a service, please contact us at hello@mywakapadi.com. We will work with you to resolve any issues.

## 8. Non-Refundable Items

The following are generally non-refundable:
- Processing fees
- Third-party service fees
- Services already rendered
- Customized or personalized services

## 9. Contact Us

For refund requests or questions about this policy, contact us at:
- Email: hello@mywakapadi.com
- Phone: +44 7781 183175`
  },
  terms: {
    id: 'terms',
    title: 'Terms of Use',
    content: `# Terms of Use

**Last Updated: January 2025**

## 1. Agreement to Terms

By accessing or using Wakapadi's website and services, you agree to be bound by these Terms of Use. If you do not agree, please do not use our services.

## 2. Services Description

Wakapadi provides travel consultation, visa assistance, migration services, and travel packages. We act as an intermediary between you and service providers.

## 3. Eligibility

You must be at least 18 years old and have the legal capacity to enter into contracts to use our services.

## 4. Account Registration

When you create an account, you agree to:
- Provide accurate and complete information
- Maintain the security of your account
- Notify us of any unauthorized access
- Be responsible for all activities under your account

## 5. Booking and Payment

- All bookings are subject to availability
- Prices are subject to change without notice
- Payment must be made in full or as specified in the booking terms
- We use secure third-party payment processors

## 6. Travel Documents and Requirements

You are responsible for:
- Obtaining valid travel documents (passports, visas)
- Meeting all entry requirements for your destination
- Complying with health and vaccination requirements
- Having adequate travel insurance

## 7. Limitation of Liability

To the maximum extent permitted by law:
- We are not liable for delays, cancellations, or changes by third-party providers
- We are not responsible for loss or damage to personal belongings
- Our liability is limited to the amount you paid for our services

## 8. Indemnification

You agree to indemnify and hold harmless Wakapadi from any claims, damages, or expenses arising from your use of our services or violation of these terms.

## 9. Intellectual Property

All content on our website is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our permission.

## 10. Termination

We reserve the right to terminate or suspend your account and access to our services at any time, with or without cause or notice.

## 11. Governing Law

These Terms are governed by the laws of the United Kingdom. Any disputes will be resolved in the courts of the United Kingdom.

## 12. Changes to Terms

We may modify these Terms at any time. Continued use of our services after changes constitutes acceptance of the updated Terms.

## 13. Contact Us

For questions about these Terms, contact us at hello@mywakapadi.com.`
  },
  'user-services': {
    id: 'user-services',
    title: 'User Services Agreement',
    content: `# User Services Agreement

**Last Updated: January 2025**

## 1. Parties

This User Services Agreement ("Agreement") is between Wakapadi Lifestyle Limited ("Wakapadi," "we," "our") and you ("User," "you," "your").

## 2. Scope of Services

Wakapadi provides the following services:
- Travel consultation and planning
- Visa application assistance
- Migration pathway guidance
- Travel package bookings
- Related administrative support

## 3. Service Delivery

### 3.1 Consultation Services
- Initial consultations are provided as scheduled
- Follow-up consultations may be arranged as needed
- We provide guidance and information but do not guarantee specific outcomes

### 3.2 Booking Services
- We facilitate bookings with third-party providers
- We are not responsible for the services provided by third parties
- All bookings are subject to the terms and conditions of the service provider

## 4. User Obligations

You agree to:
- Provide accurate and complete information
- Comply with all applicable laws and regulations
- Pay all fees as agreed
- Use services only for lawful purposes
- Not resell or redistribute our services

## 5. Fees and Payment

- Fees are as specified at the time of service
- Payment terms are as agreed for each service
- Late payments may incur additional fees
- Refunds are subject to our Refund Policy

## 6. Confidentiality

We will maintain the confidentiality of your personal information in accordance with our Privacy Policy.

## 7. Limitation of Services

We provide consultation and facilitation services. We do not:
- Guarantee visa approvals or travel outcomes
- Act as legal advisors (unless specifically stated)
- Provide immigration or legal representation
- Guarantee specific travel dates or availability

## 8. Third-Party Services

When we facilitate third-party services:
- You enter into a separate agreement with the third-party provider
- We are not liable for third-party actions or services
- Third-party terms and conditions apply

## 9. Dispute Resolution

Any disputes will be resolved through:
1. Good faith negotiation
2. Mediation (if negotiation fails)
3. Arbitration or litigation as a last resort

## 10. Termination

Either party may terminate this Agreement:
- By written notice
- Immediately for material breach
- As otherwise specified in this Agreement

## 11. Entire Agreement

This Agreement, together with our Terms of Use and Privacy Policy, constitutes the entire agreement between you and Wakapadi.

## 12. Contact Information

Wakapadi Lifestyle Limited
Defoe Rd, Ipswich, IP1 6SN, UK
Email: hello@mywakapadi.com
Phone: +44 7781 183175`
  },
  'data-processing': {
    id: 'data-processing',
    title: 'Data Processing Agreement',
    content: `# Data Processing Agreement

**Last Updated: January 2025**

## 1. Definitions

- "Personal Data" means any information relating to an identified or identifiable individual
- "Processing" means any operation performed on Personal Data
- "Data Subject" means the individual to whom Personal Data relates
- "Controller" means Wakapadi Lifestyle Limited
- "Processor" means any third-party service provider processing data on our behalf

## 2. Purpose and Scope

This Data Processing Agreement governs how we process Personal Data in providing our services and how we work with third-party processors.

## 3. Data Processing Principles

We process Personal Data in accordance with:
- Applicable data protection laws (including GDPR)
- Principles of lawfulness, fairness, and transparency
- Purpose limitation and data minimization
- Accuracy and storage limitation
- Integrity and confidentiality

## 4. Legal Basis for Processing

We process Personal Data based on:
- Your consent
- Contractual necessity
- Legal obligations
- Legitimate interests

## 5. Types of Data Processed

We process the following categories of Personal Data:
- Identity and contact information
- Financial and payment information
- Travel preferences and booking details
- Communication records
- Technical data (cookies, IP addresses)

## 6. Data Subject Rights

We respect your rights under applicable data protection laws, including:
- Right to access
- Right to rectification
- Right to erasure
- Right to restrict processing
- Right to data portability
- Right to object
- Rights related to automated decision-making

## 7. Third-Party Processors

We may engage third-party processors for:
- Payment processing
- Email and communication services
- Cloud hosting and storage
- Analytics and marketing

All processors are bound by appropriate data processing agreements.

## 8. Data Security

We implement appropriate technical and organizational measures:
- Encryption of sensitive data
- Access controls and authentication
- Regular security assessments
- Incident response procedures

## 9. Data Breaches

In the event of a data breach:
- We will notify relevant authorities as required by law
- We will notify affected individuals when appropriate
- We will take immediate steps to contain and remediate the breach

## 10. International Transfers

Personal Data may be transferred to countries outside the EEA. We ensure appropriate safeguards are in place, such as:
- Standard Contractual Clauses
- Adequacy decisions
- Other approved transfer mechanisms

## 11. Data Retention

We retain Personal Data only for as long as necessary:
- To fulfill the purposes for which it was collected
- To comply with legal obligations
- To resolve disputes and enforce agreements

## 12. Contact and Complaints

For data protection inquiries or complaints:
- Email: hello@mywakapadi.com
- You also have the right to lodge a complaint with your local data protection authority

## 13. Updates

This Agreement may be updated to reflect changes in law or our practices. We will notify you of material changes.`
  }
};

export function TermsPage({ onNavigate, initialPage }: TermsPageProps) {
  // Map route names to legal page IDs
  const routeToPageMap: Record<string, LegalPage> = {
    'terms': 'terms',
    'privacy': 'privacy',
    'acceptable-use': 'acceptable-use',
    'refund': 'refund',
    'user-services': 'user-services',
    'data-processing': 'data-processing',
  };
  
  const [activePage, setActivePage] = useState<LegalPage>(
    (initialPage && routeToPageMap[initialPage]) ? routeToPageMap[initialPage] : 'terms'
  );

  const currentPage = LEGAL_PAGES[activePage];

  return (
    <div className="min-h-screen pt-32 bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="sticky top-32"
            >
              <div className="glass rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Legal Documents</h2>
                <nav className="space-y-2">
                  {Object.values(LEGAL_PAGES).map((page) => (
                    <button
                      key={page.id}
                      onClick={() => setActivePage(page.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activePage === page.id
                          ? 'bg-primary text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {page.title}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-8 md:p-12"
            >
              <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-8 tracking-tighter">
                {currentPage.title}
              </h1>
              
              <div className="prose prose-slate max-w-none">
                {currentPage.content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) {
                    return (
                      <h2 key={i} className="text-2xl font-semibold text-slate-900 mt-8 mb-4">
                        {line.substring(2)}
                      </h2>
                    );
                  } else if (line.startsWith('## ')) {
                    return (
                      <h3 key={i} className="text-xl font-semibold text-slate-900 mt-6 mb-3">
                        {line.substring(3)}
                      </h3>
                    );
                  } else if (line.startsWith('### ')) {
                    return (
                      <h4 key={i} className="text-lg font-semibold text-slate-900 mt-4 mb-2">
                        {line.substring(4)}
                      </h4>
                    );
                  } else if (line.startsWith('- ')) {
                    return (
                      <li key={i} className="ml-6 mb-2 text-slate-600">
                        {line.substring(2)}
                      </li>
                    );
                  } else if (line.trim() === '') {
                    return <br key={i} />;
                  } else if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <p key={i} className="font-semibold text-slate-900 mb-2">
                        {line.replace(/\*\*/g, '')}
                      </p>
                    );
                  } else {
                    return (
                      <p key={i} className="text-slate-600 leading-relaxed mb-4">
                        {line}
                      </p>
                    );
                  }
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
