import React, { useState } from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { LiveWatch } from '../common/LiveWatch';

interface Hotspot {
  id: string;
  name: string;
  coord: { x: number; y: number };
  tagline: string;
  description: string;
  specification: string;
}

const hotspots: Hotspot[] = [
  {
    id: 'crystal',
    name: 'Anti-Reflective Sapphire Crystal',
    coord: { x: 37, y: 31 },
    tagline: 'Synthetic Corundum & Dual AR Coating',
    description: 'Forged at 2,050°C to achieve a 9 on the Mohs hardness scale. Seven layers of anti-reflective coating eliminate 99.4% of surface glare.',
    specification: 'Mohs Hardness 9 | Double-Domed Contour',
  },
  {
    id: 'bezel',
    name: 'Mirror-Polished Steel Bezel',
    coord: { x: 23, y: 31 },
    tagline: 'Precision 316L Surgical Stainless Steel',
    description: 'Hand-finished with alternating brushed bevels and mirror-polished chamfers, reflecting light with jewel-like clarity.',
    specification: 'Chamfered 45° Edge | Low Magnetic Permeability',
  },
  {
    id: 'dial',
    name: 'Sunburst Lacquered Dial',
    coord: { x: 40, y: 63 },
    tagline: 'Sunray Brushing with Applied Indices',
    description: 'Precision circular brushed finishing treated with warm ivory lacquer. Faceted diamond-cut indices applied by hand under binocular magnification.',
    specification: 'Warm Ivory Pigment | Rhodium-Plated Markers',
  },
  {
    id: 'hands',
    name: 'Flame-Blued Lance Hands',
    coord: { x: 50, y: 50 },
    tagline: 'Thermally Tempered Steel',
    description: 'Heated to exactly 290°C to induce deep oxidation bluing without artificial dyes, providing impeccable contrast against the dial.',
    specification: 'Thermal Bluing | Diamond-Cut Facets',
  },
  {
    id: 'crown',
    name: 'Fluted Crown with Monogram',
    coord: { x: 90, y: 50 },
    tagline: 'Double-Gasket Water Seal',
    description: 'Machined with fine tactile knurling and embossed with the tall-stemmed VK monogram. Fitted with dual fluorocarbon internal O-rings.',
    specification: 'Screw-Down Lock | 100M Water Integrity',
  },
  {
    id: 'movement',
    name: 'Calibre VK-801 Automatic',
    coord: { x: 60, y: 66 },
    tagline: '28,800 VPH Kinetic Horology',
    description: 'High-beat mechanical self-winding movement with bi-directional ball-bearing rotor, 42-hour power reserve, and 26 synthetic ruby bearings.',
    specification: '26 Jewels | 4 Hz Oscillation | -4/+6 s/day',
  },
  {
    id: 'case',
    name: 'Sculpted Ergonomic Case',
    coord: { x: 26, y: 75 },
    tagline: 'Anatomically Contoured Downward Lugs',
    description: 'Lugs engineered with a 14-degree downward rake to wrap seamlessly around wrists between 150mm and 215mm.',
    specification: '10.4mm Ultra-Comfort Profile | 47.2mm Lug-to-Lug',
  },
  {
    id: 'strap',
    name: 'Full-Grain Italian Calfskin',
    coord: { x: 50, y: 93 },
    tagline: 'Vegetable Tanned & Hand-Stitched',
    description: 'Sourced from Tuscan tanneries, backed with hypoallergenic glove leather lining and fitted with our butterfly deployant clasp.',
    specification: '20mm Lug Width | Butterfly Deployant Clasp',
  },
];

export const AnatomyOfPrecision: React.FC = () => {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot>(hotspots[0]);

  return (
    <section className="py-24 bg-pure/60 border-t border-platinum overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Horological Architecture</span>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-charcoal">
            Anatomy of Precision
          </h2>
          <p className="text-sm text-graphite font-light leading-relaxed">
            Every millimeter of a VK TIME watch is meticulously considered. Select any technical component below to explore its engineering pedigree.
          </p>
        </div>

        {/* Visual Blueprint Diagram and Interactive Hotspot Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left / Center: Interactive Visual Hotspot Canvas */}
          <div className="lg:col-span-7 relative flex justify-center items-center bg-ivory p-6 sm:p-12 rounded-sm border border-platinum shadow-subtle min-h-[480px]">
            {/* Background concentric reference rings */}
            <svg className="absolute inset-0 w-full h-full text-platinum pointer-events-none opacity-40" viewBox="0 0 500 500" fill="none">
              <circle cx="250" cy="250" r="220" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 4" />
              <circle cx="250" cy="250" r="150" stroke="currentColor" strokeWidth="0.5" />
              <line x1="250" y1="20" x2="250" y2="480" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
              <line x1="20" y1="250" x2="480" y2="250" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
            </svg>

            {/* Central High-Resolution Watch Illustration / Photograph */}
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square">
              <LiveWatch
                slug="vk-sovereign-automatic-40"
                view="macro"
                className="absolute inset-0 rounded-sm overflow-hidden shadow-luxe select-none pointer-events-none"
              />

              {/* Clickable Hotspot Pins */}
              {hotspots.map((spot) => {
                const isActive = activeHotspot.id === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => setActiveHotspot(spot)}
                    style={{ left: `${spot.coord.x}%`, top: `${spot.coord.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20"
                    aria-label={`Inspect ${spot.name}`}
                  >
                    <span className="relative flex items-center justify-center">
                      {/* Pulse animation on active or hover */}
                      <span
                        className={`absolute w-7 h-7 rounded-full transition-all duration-300 ${
                          isActive
                            ? 'bg-gold/30 scale-125 animate-ping'
                            : 'bg-charcoal/10 group-hover:bg-gold/20 scale-100'
                        }`}
                      />
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-gold border-pure shadow-md scale-110'
                            : 'bg-pure border-charcoal group-hover:border-gold scale-90'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-pure' : 'bg-charcoal'}`} />
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Technical Explanation Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-pure border border-platinum shadow-luxe rounded-sm space-y-5 transition-all duration-500">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">
                  {activeHotspot.tagline}
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-charcoal">
                  {activeHotspot.name}
                </h3>
              </div>

              <p className="text-sm text-graphite leading-relaxed font-light">
                {activeHotspot.description}
              </p>

              <div className="pt-4 border-t border-platinum space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-charcoal font-medium">
                  <CheckCircle2 className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Technical Verification: {activeHotspot.specification}</span>
                </div>
              </div>
            </div>

            {/* Quick Component Selector List */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {hotspots.map((spot) => (
                <button
                  key={spot.id}
                  onClick={() => setActiveHotspot(spot)}
                  className={`px-3 py-2 text-left rounded-sm border transition-colors flex items-center justify-between ${
                    activeHotspot.id === spot.id
                      ? 'border-charcoal bg-charcoal text-pure font-medium'
                      : 'border-platinum bg-pure hover:bg-porcelain text-graphite'
                  }`}
                >
                  <span className="truncate">{spot.name.split(' ')[0]} {spot.name.split(' ')[1]}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${activeHotspot.id === spot.id ? 'text-gold-light' : 'text-silver'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnatomyOfPrecision;
