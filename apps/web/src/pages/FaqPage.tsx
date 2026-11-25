import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PageHero } from '../components/common/PageHero';

const faqs = [
  {
    q: 'Where are VK TIME watches designed and manufactured?',
    a: 'All VK TIME timepieces are designed in our architectural studio with movements sourced from leading Swiss and Japanese horology manufactures, with precision final assembly and chronometric regulation under strict quality protocols in India.',
  },
  {
    q: 'What is the difference between an Automatic and Quartz movement?',
    a: 'An automatic watch is completely mechanical, powered by the kinetic motion of your wrist swinging a weighted rotor. A quartz watch is battery-powered and regulated by the ultrasonic oscillation of a synthetic quartz crystal.',
  },
  {
    q: 'Can I swap straps between models?',
    a: 'Yes. Most VK TIME timepieces feature tool-free quick-release spring bars, allowing you to alternate between Italian leather, Milanese mesh, and oystersteel links in seconds.',
  },
  {
    q: 'What warranty is included with my acquisition?',
    a: 'Every timepiece comes backed by our comprehensive 5-Year International Master Warranty covering movement precision and manufacturing integrity.',
  },
  {
    q: 'How does complimentary insured shipping work?',
    a: 'All orders are dispatched via tamper-evident armoured air express couriers (such as Blue Dart Luxury Priority) with full insurance transit coverage until hand-delivered to your signature.',
  },
];

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <PageHero
          compact
          eyebrow="Frequently Addressed"
          title="Questions & Horological Guidance"
          description="Answers on warranty, delivery, sizing and care."
          image="/images/scenes/banner-journal.svg"
        />

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-pure border border-platinum rounded-sm overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center text-sm font-medium text-charcoal hover:text-gold transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-silver transition-transform ${openIdx === idx ? 'rotate-180 text-gold' : ''}`} />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-xs text-graphite font-light leading-relaxed border-t border-platinum/60 pt-3 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
