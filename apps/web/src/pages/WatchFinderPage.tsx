import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Check, Sparkles } from 'lucide-react';
import { apiRequest } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { WatchProduct } from '@vk-time/shared';
import { PageHero } from '../components/common/PageHero';

interface Question {
  id: string;
  title: string;
  subtitle: string;
  options: { label: string; value: any; desc?: string }[];
}

const quizQuestions: Question[] = [
  {
    id: 'gender',
    title: 'Who are you shopping for?',
    subtitle: 'Proportions and lug geometry vary by wearer preference.',
    options: [
      { label: "Men's Proportions", value: 'Men', desc: 'Case diameters 39mm - 42mm' },
      { label: "Women's Proportions", value: 'Women', desc: 'Case diameters 34mm - 38mm' },
      { label: 'Unisex & Universal Fit', value: 'Unisex', desc: 'Versatile 38mm - 40mm' },
    ],
  },
  {
    id: 'style',
    title: 'What is your preferred aesthetic style?',
    subtitle: 'From minimal architectural purity to motorsport complications.',
    options: [
      { label: 'Classic Dress & Heritage', value: 'Classic', desc: 'Lacquered dials and Italian leather' },
      { label: 'Architectural Minimalist', value: 'Minimal', desc: 'Ultra-thin monolithic dial balance' },
      { label: 'Motorsport Chronograph', value: 'Chronograph', desc: 'Dual sub-dials and ceramic tachymeter' },
      { label: 'Skeleton Haute Horlogerie', value: 'Skeleton', desc: 'Exhibition mechanical gears and anglage' },
    ],
  },
  {
    id: 'budget',
    title: 'What is your intended investment bracket?',
    subtitle: 'Configured in Indian National Rupees (INR).',
    options: [
      { label: '₹20,000 – ₹35,000', value: [20000, 35000], desc: 'High-precision quartz and minimal dress' },
      { label: '₹35,000 – ₹55,000', value: [35000, 55000], desc: 'High-beat automatic and mecha-quartz' },
      { label: '₹55,000 – ₹1,00,000+', value: [55000, 100000], desc: 'Numbered limited editions and hand-finished skeleton' },
    ],
  },
  {
    id: 'movementType',
    title: 'Which movement engineering do you prefer?',
    subtitle: 'The mechanical soul orchestrating your timepiece.',
    options: [
      { label: 'Automatic Self-Winding', value: 'Automatic', desc: 'Continuous mechanical kinetic rotor' },
      { label: 'Mechanical Manual-Wind', value: 'Mechanical', desc: 'Daily ritual winding connection' },
      { label: 'Meca-Quartz Chronograph', value: 'Chronograph', desc: 'Split-second mechanical pushers' },
      { label: 'Precision Swiss Quartz', value: 'Quartz', desc: 'Unerring accuracy and slender profile' },
      { label: 'Open to All Calibres', value: 'Any', desc: 'Recommend purely on aesthetic merit' },
    ],
  },
  {
    id: 'strapMaterial',
    title: 'Which strap material complements your lifestyle?',
    subtitle: 'Tactile connection against the wrist.',
    options: [
      { label: 'Full-Grain Italian Leather', value: 'Leather', desc: 'Supple vegetable-tanned warmth' },
      { label: 'Solid Stainless Steel Links', value: 'Steel', desc: 'Oystersteel security and weight' },
      { label: 'Milanese Mesh Bracelet', value: 'Mesh', desc: 'Fine interlocking steel mesh' },
    ],
  },
  {
    id: 'wristSize',
    title: 'What is your approximate wrist circumference?',
    subtitle: 'Ensures the lugs rest ergonomically without overhang.',
    options: [
      { label: 'Slender (135mm – 160mm)', value: 'slender', desc: 'Best suited for 34mm - 38mm cases' },
      { label: 'Standard (160mm – 185mm)', value: 'standard', desc: 'Universal fit for 38mm - 40mm cases' },
      { label: 'Broad (185mm – 215mm+)', value: 'broad', desc: 'Commanding presence with 40mm - 42mm cases' },
    ],
  },
  {
    id: 'occasion',
    title: 'What primary occasion are you shopping for?',
    subtitle: 'The primary environment this timepiece will inhabit.',
    options: [
      { label: 'Executive Boardroom & Business', value: 'business', desc: 'Under-cuff discretion' },
      { label: 'Gala & Black-Tie Formal', value: 'formal', desc: 'Precious metal and exhibition dials' },
      { label: 'Daily Everyday Signature', value: 'daily', desc: 'Robust scratch-resistant versatility' },
      { label: 'A Milestone Life Gift', value: 'gift', desc: 'Heirloom value and engraved authenticity' },
    ],
  },
];

export const WatchFinderPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentQuestion = quizQuestions[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / quizQuestions.length) * 100);

  const handleSelectOption = (value: any) => {
    const updated = { ...answers, [currentQuestion.id]: value };
    setAnswers(updated);

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResults(updated);
    }
  };

  const calculateResults = async (finalAnswers: Record<string, any>) => {
    setLoading(true);
    try {
      const results = await apiRequest<any[]>('/products/finder', {
        method: 'POST',
        body: JSON.stringify(finalAnswers),
      });
      setRecommendations(results);
      setIsCompleted(true);
    } catch (e) {
      console.error('Finder error:', e);
      setIsCompleted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
    setRecommendations([]);
  };

  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <PageHero
          compact
          eyebrow="Curated Horology Consultation"
          title="Personalised Watch Finder"
          description="Answer a few brief questions to find the VK TIME reference suited to your wrist and lifestyle."
          image="/images/scenes/banner-finder.svg"
        />

        {!isCompleted ? (
          <div className="bg-pure p-8 sm:p-12 rounded-sm border border-platinum shadow-luxe space-y-8 animate-in fade-in duration-300">
            {/* Watch Dial Progress Indicator */}
            <div className="flex items-center justify-between pb-6 border-b border-platinum">
              <div className="flex items-center gap-3">
                {/* Circular watch-dial progress indicator */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#E8E8E8" strokeWidth="2.5" />
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#0252FC"
                      strokeWidth="2.5"
                      strokeDasharray="100"
                      strokeDashoffset={100 - progressPercent}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-mono font-medium text-charcoal">
                    {currentStep + 1}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-luxury text-silver font-medium">
                    Question {currentStep + 1} of {quizQuestions.length}
                  </span>
                  <p className="text-xs text-charcoal font-medium">{currentQuestion.title}</p>
                </div>
              </div>

              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-xs text-silver hover:text-charcoal underline"
                >
                  Previous Step
                </button>
              )}
            </div>

            {/* Question Details */}
            <div className="space-y-2">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-charcoal">
                {currentQuestion.title}
              </h2>
              <p className="text-xs text-silver font-light">{currentQuestion.subtitle}</p>
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.value)}
                  className="p-5 text-left border border-platinum rounded-sm bg-pure hover:border-charcoal hover:bg-ivory/50 transition-all group flex flex-col justify-between space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-charcoal group-hover:text-gold transition-colors">
                      {opt.label}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-silver group-hover:text-charcoal transition-transform group-hover:translate-x-1" />
                  </div>
                  {opt.desc && <p className="text-xs text-silver font-light">{opt.desc}</p>}
                </button>
              ))}
            </div>

            {/* Skip step */}
            <div className="pt-4 flex justify-between text-xs text-silver border-t border-platinum">
              <button
                onClick={() => {
                  if (currentStep < quizQuestions.length - 1) {
                    setCurrentStep(currentStep + 1);
                  } else {
                    calculateResults(answers);
                  }
                }}
                className="hover:text-charcoal"
              >
                Skip this question &rarr;
              </button>
              <button onClick={handleReset} className="hover:text-red-500">
                Restart Questionnaire
              </button>
            </div>
          </div>
        ) : (
          /* Results Section */
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-pure p-8 border border-platinum rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Horological Match Confirmed</span>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl text-charcoal">
                  Your Signature Recommendations
                </h2>
                <p className="text-xs text-silver mt-1">
                  Calculated against your preferred calibre, casing, and lifestyle requirements.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-platinum hover:border-charcoal text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gold" />
                <span>Retake Consultation</span>
              </button>
            </div>

            {/* Recommended Products with Match Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex flex-col space-y-4">
                  <ProductCard product={rec.product} />
                  <div className="bg-pure p-4 rounded-sm border border-platinum space-y-2 text-xs">
                    <span className="text-[10px] uppercase tracking-ultra text-gold font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-gold" />
                      <span>Why this watch matches you</span>
                    </span>
                    <ul className="space-y-1 text-graphite font-light list-disc list-inside">
                      {rec.matchReasons?.map((reason: string, rIdx: number) => (
                        <li key={rIdx}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchFinderPage;
