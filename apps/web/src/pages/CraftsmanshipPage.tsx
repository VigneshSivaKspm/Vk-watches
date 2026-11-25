import React from 'react';
import { PageHero } from '../components/common/PageHero';
import { LiveWatch } from '../components/common/LiveWatch';

export const CraftsmanshipPage: React.FC = () => {
  return (
    <div className="w-full text-charcoal">
      {/* Cinematic Hero */}
      <PageHero
          eyebrow="Horological Dedication"
          title="The Architecture of Precision"
          description="Every VK TIME watch begins with a single imperative: absolute physical honesty. No superfluous ornament, no faux complications."
          image="/images/scenes/hero-automatic.svg"
        />

      {/* Craftsmanship Pillars */}
      <div className="max-w-7xl mx-auto px-6 py-24 space-y-24">
        {/* Pillar 01: High-Beat Calibres */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Kinetic Resonance</span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-charcoal">
              28,800 Vibrations Per Hour
            </h2>
            <p className="text-sm text-graphite font-light leading-relaxed">
              At 4 Hertz (8 beats per second), the seconds hand does not step forward with an abrupt tick, but glides in a seamless, hypnotic arc across the dial. Coiled within our mainspring barrels is a proprietary cobalt-nickel alloy delivering consistent torque across its entire 42 to 56-hour reserve.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-silver">Escapement Bearings</p>
                <p className="font-medium text-charcoal">Synthetic Ruby Jewels</p>
              </div>
              <div>
                <p className="text-silver">Daily Tolerance</p>
                <p className="font-medium text-charcoal">-4 / +6 seconds / day</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-sm overflow-hidden shadow-luxe-hover bg-[#090F1A]">
            <LiveWatch slug="vk-chronos-skeleton-limited-41" view="macro" className="absolute inset-0" />
          </div>
        </div>

        {/* Pillar 02: Thermal Bluing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1 relative aspect-[4/3] rounded-sm overflow-hidden shadow-luxe-hover bg-[#090F1A]">
            <LiveWatch slug="vk-sovereign-automatic-40" view="macro" className="absolute inset-0" />
          </div>
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Metallurgical Alchemy</span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-charcoal">
              Flame-Blued Steel Hands
            </h2>
            <p className="text-sm text-graphite font-light leading-relaxed">
              We reject chemical paint and lacquer for our blue indicators. Each feuille and lance hand is brought to exactly 290°C on a bed of brass shavings. The microscopic oxide layer transforms from straw to purple, culminating in deep, cornflower blue. Under sunlight, they shift from midnight indigo to electric sapphire.
            </p>
          </div>
        </div>

        {/* Pillar 03: Synthetic Corundum Crystal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Impervious Optics</span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-charcoal">
              Double-Domed Sapphire Crystal
            </h2>
            <p className="text-sm text-graphite font-light leading-relaxed">
              Synthesized by the Verneuil fusion process, our sapphire crystals register 9 on the Mohs scale, outmatched only by natural diamond. Treated with seven microscopic coats of anti-reflective pigment on both internal and external radii, the glass vanishes under ordinary glance, presenting an unencumbered view of the dial.
            </p>
          </div>
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-sm overflow-hidden shadow-luxe-hover bg-[#090F1A]">
            <img src="/images/scenes/journal-sapphire.svg" alt="Sapphire crystal facets" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CraftsmanshipPage;
