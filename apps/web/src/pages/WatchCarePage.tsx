import React from 'react';
import { Shield, Clock, Droplets, RotateCw } from 'lucide-react';
import { PageHero } from '../components/common/PageHero';

export const WatchCarePage: React.FC = () => {
  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <PageHero
          compact
          eyebrow="Horological Longevity"
          title="Watch Care & Preservation"
          description="A mechanical timepiece holds over a hundred micro-components. Routine care keeps it accurate for decades."
          image="/images/scenes/banner-care.svg"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-pure p-8 rounded-sm border border-platinum space-y-3">
            <Droplets className="w-6 h-6 text-gold" />
            <h3 className="font-serif-luxury text-xl text-charcoal">Water Resistance & Seals</h3>
            <p className="text-xs text-graphite leading-relaxed font-light">
              Always ensure the fluted crown is fully pushed in or screwed down before exposure to water. Have internal synthetic seals pressure-tested every 24 months.
            </p>
          </div>

          <div className="bg-pure p-8 rounded-sm border border-platinum space-y-3">
            <Shield className="w-6 h-6 text-gold" />
            <h3 className="font-serif-luxury text-xl text-charcoal">Magnetic Field Defense</h3>
            <p className="text-xs text-graphite leading-relaxed font-light">
              Avoid resting your watch directly on laptops, magnetic phone cases, or induction stovetops, which can temporarily magnetize the balance hairspring.
            </p>
          </div>

          <div className="bg-pure p-8 rounded-sm border border-platinum space-y-3">
            <RotateCw className="w-6 h-6 text-gold" />
            <h3 className="font-serif-luxury text-xl text-charcoal">Manual & Kinetic Winding</h3>
            <p className="text-xs text-graphite leading-relaxed font-light">
              For manual calibres, wind gently once daily until subtle resistance is felt. Never force past the stop point. For automatics, wear regularly to sustain power.
            </p>
          </div>

          <div className="bg-pure p-8 rounded-sm border border-platinum space-y-3">
            <Clock className="w-6 h-6 text-gold" />
            <h3 className="font-serif-luxury text-xl text-charcoal">Periodic Servicing Cadence</h3>
            <p className="text-xs text-graphite leading-relaxed font-light">
              We recommend an overhaul service every 4 to 5 years, during which our horologists disassemble, clean, lubricate, and recalibrate your calibre.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WarrantyPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-pure p-8 sm:p-12 border border-platinum rounded-sm">
        <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Warranty Governance</span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl text-charcoal">
          5-Year International Master Warranty
        </h1>
        <div className="text-xs sm:text-sm text-graphite font-light space-y-4 leading-relaxed border-t border-platinum pt-6">
          <p>
            VK TIME warrants all authentic wristwatches against manufacturing and mechanical calibre defects for a period of five (5) full years from the confirmed date of acquisition.
          </p>
          <h3 className="font-serif-luxury text-xl text-charcoal pt-2">Scope of Coverage</h3>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Mechanical movement defects, timing irregularities exceeding chronometer standards.</li>
            <li>Loose hands, dial markers, or internal crystal dust.</li>
            <li>Case manufacturing porosity and deployant clasp failure under normal usage.</li>
          </ul>
          <h3 className="font-serif-luxury text-xl text-charcoal pt-2">Exclusions</h3>
          <p>
            Normal cosmetic wear and tear, leather strap patina from organic moisture, unauthorized third-party tampering, or water damage resulting from operating pushers while submerged.
          </p>
        </div>
      </div>
    </div>
  );
};
