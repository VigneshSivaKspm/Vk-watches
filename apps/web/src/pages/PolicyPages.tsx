import React from 'react';

export const PolicyPage: React.FC<{ title: string; subtitle: string; content: string[] }> = ({ title, subtitle, content }) => {
  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-pure p-8 sm:p-12 border border-platinum rounded-sm space-y-6">
        <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">{subtitle}</span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-charcoal">{title}</h1>
        <div className="space-y-4 text-xs sm:text-sm text-graphite font-light leading-relaxed border-t border-platinum pt-6">
          {content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ShippingPolicyPage = () => (
  <PolicyPage
    title="Shipping & Transit Policy"
    subtitle="Global White-Glove Dispatch"
    content={[
      'VK TIME provides complimentary, fully insured express transit on all domestic and international timepiece orders.',
      'All timepieces are hand-vaulted in our solid walnut presentation cases and handed over to specialized luxury logistics carriers with biometric signature confirmation upon delivery.',
      'Standard domestic dispatch delivers within 2–4 business days. International orders typically clear customs within 4–7 business days.',
    ]}
  />
);

export const ReturnPolicyPage = () => (
  <PolicyPage
    title="Return & Refund Guarantee"
    subtitle="Client Satisfaction Protocol"
    content={[
      'We extend a 14-day complimentary return concierge on all unworn timepieces in original condition with intact security tags and protective foils.',
      'Upon initiating a return, our concierge arranges white-glove courier pickup at your destination.',
      'Following master horologist inspection of movement seals and casing, authorized refunds are processed within 3–5 business days to the original payment instrument.',
    ]}
  />
);

export const PrivacyPolicyPage = () => (
  <PolicyPage
    title="Privacy & Data Governance"
    subtitle="Master Confidentiality"
    content={[
      'VK TIME treats customer personal information under stringent confidentiality protocols. We never sell, rent, or trade client telemetry or contact data.',
      'Financial data processed through our payment gateways adheres to level-1 PCI-DSS encryption standards. Payment details are not stored on our local application servers.',
      'Clients may request full ledger erasure or order receipt history export at any time by contacting our concierge desk.',
    ]}
  />
);

export const TermsPage = () => (
  <PolicyPage
    title="Terms & Conditions of Sale"
    subtitle="Commercial Governance"
    content={[
      'All acquisitions through the VK TIME platform constitute a legally binding agreement under Indian commercial governance and international trade guidelines.',
      'Prices, specifications, and limited-edition numbering availability are verified in real time against our database inventory before confirmation.',
      'Unauthorized reproduction of the VK monogram, trademarks, or horological literature is strictly prohibited.',
    ]}
  />
);
