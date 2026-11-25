import React, { useState } from 'react';
import { Ruler, CheckCircle2, Info } from 'lucide-react';
import { PageHero } from '../components/common/PageHero';

export const SizeGuidePage: React.FC = () => {
  // Wrist circumference slider in millimeters (140mm - 215mm)
  const [wristMm, setWristMm] = useState<number>(170);

  const wristCm = (wristMm / 10).toFixed(1);

  // Dynamic recommendation based on wrist anatomy
  let recommendedSize = '38mm – 40mm';
  let sizingDescription =
    'Your wrist represents the versatile horological standard. Both classical 38mm dress watches and contemporary 40mm automatic references sit flush with zero lug overhang.';

  if (wristMm < 155) {
    recommendedSize = '34mm – 38mm';
    sizingDescription =
      'For slender wrists, we recommend 34mm references (such as Aurora Céleste) or 38mm ultra-thin cases (Monolith Minimalist) to ensure lugs remain well within wrist perimeters.';
  } else if (wristMm > 185) {
    recommendedSize = '40mm – 42mm';
    sizingDescription =
      'Broader wrists command substantial presence. 40mm automatic calibres and 42mm sports chronographs (Aero Chronograph) distribute weight comfortably with balanced presence.';
  }

  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Editorial Header */}
        <PageHero
          compact
          eyebrow="Ergonomic Consultation"
          title="Wrist & Case Size Guide"
          description="The interplay between lug-to-lug span, case thickness and wrist curvature determines true comfort."
          image="/images/scenes/banner-sizing.svg"
        />

        {/* Interactive Wrist Size Slider Visualizer */}
        <div className="bg-pure p-8 sm:p-12 rounded-sm border border-platinum shadow-luxe space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-platinum pb-6">
            <div>
              <h2 className="font-serif-luxury text-2xl text-charcoal">Interactive Wrist Circumference Slider</h2>
              <p className="text-xs text-silver mt-0.5">Adjust the gauge to match your measured wrist circumference</p>
            </div>
            <div className="text-right">
              <span className="font-serif-luxury text-3xl text-charcoal font-medium">{wristMm} mm</span>
              <span className="text-xs text-silver ml-2">({wristCm} cm)</span>
            </div>
          </div>

          {/* Slider Control */}
          <div className="space-y-3">
            <input
              type="range"
              min="140"
              max="215"
              step="1"
              value={wristMm}
              onChange={(e) => setWristMm(parseInt(e.target.value, 10))}
              className="w-full accent-charcoal cursor-pointer h-2 bg-platinum rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-silver font-mono">
              <span>140 mm (Slender)</span>
              <span>170 mm (Standard)</span>
              <span>215 mm (Broad)</span>
            </div>
          </div>

          {/* Real-Time Sizing Recommendation Card */}
          <div className="bg-ivory p-6 rounded-sm border border-platinum/80 space-y-3">
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Calculated Recommendation</span>
            <p className="font-serif-luxury text-2xl text-charcoal">
              Ideal Case Diameter: <strong>{recommendedSize}</strong>
            </p>
            <p className="text-xs text-graphite leading-relaxed font-light">{sizingDescription}</p>
          </div>
        </div>

        {/* Case Diameter Comparison Grid */}
        <div className="space-y-6">
          <h3 className="font-serif-luxury text-2xl text-charcoal">Case Diameter Reference Guide</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { size: '34 mm', title: 'Petit Dress', desc: 'Slender, jewel-like elegance. Ideal for wrists under 155mm.' },
              { size: '38 mm', title: 'Classic Proportion', desc: 'Golden ratio symmetry. Flawless under business dress cuffs.' },
              { size: '40 mm', title: 'Modern Sovereign', desc: 'The contemporary standard for automatic mechanical calibres.' },
              { size: '42 mm', title: 'Grand Complication', desc: 'Commanding motorsport presence with tachymeter scales.' },
            ].map((c, i) => (
              <div key={i} className="bg-pure p-6 rounded-sm border border-platinum space-y-3">
                <span className="font-serif-luxury text-2xl text-charcoal">{c.size}</span>
                <p className="text-xs font-medium text-gold uppercase tracking-wider">{c.title}</p>
                <p className="text-xs text-graphite font-light leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Measure Guidance */}
        <div className="bg-pure p-8 rounded-sm border border-platinum space-y-6">
          <div className="flex items-center gap-3">
            <Ruler className="w-6 h-6 text-gold" />
            <h3 className="font-serif-luxury text-2xl text-charcoal">How to Accurately Measure Your Wrist</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-graphite font-light leading-relaxed">
            <div className="space-y-2">
              <span className="font-mono text-sm font-medium text-charcoal">01. Flexible Tape</span>
              <p>Wrap a tailor’s measuring tape just below your wrist bone where your watch will naturally rest.</p>
            </div>
            <div className="space-y-2">
              <span className="font-mono text-sm font-medium text-charcoal">02. Paper Strip Method</span>
              <p>Alternatively, wrap a thin strip of paper around your wrist, mark the intersection, and measure flat with a ruler.</p>
            </div>
            <div className="space-y-2">
              <span className="font-mono text-sm font-medium text-charcoal">03. Lug-to-Lug Clearance</span>
              <p>Ensure the watch's total lug span does not extend beyond the flat plane of your arm.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;
