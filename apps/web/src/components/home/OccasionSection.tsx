import React from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../common/Reveal';

const occasions = [
  {
    title: 'Business & Boardroom',
    subtitle: 'Under-cuff discretion and understated authority.',
    image: '/images/scenes/occasion-boardroom.svg',
    link: '/collections/the-classic-collection',
  },
  {
    title: 'Black-Tie & Gala Evenings',
    subtitle: 'Moonphase, deep lacquer and quiet sparkle.',
    image: '/images/scenes/occasion-evening.svg',
    link: '/collections/the-signature-collection',
  },
  {
    title: 'Active & Track Velocity',
    subtitle: 'Solid steel bracelets and ceramic bezels.',
    image: '/images/scenes/occasion-sport.svg',
    link: '/shop?movementType=Chronograph',
  },
  {
    title: 'Travel & Time Zones',
    subtitle: 'GMT hands and field-ready legibility.',
    image: '/images/scenes/occasion-travel.svg',
    link: '/collections/the-automatic-collection',
  },
  {
    title: 'Everyday & Weekend',
    subtitle: 'Lightweight comfort for casual refinement.',
    image: '/images/scenes/occasion-weekend.svg',
    link: '/collections/the-minimal-collection',
  },
  {
    title: 'Gifting & Celebration',
    subtitle: 'Gold and stone-set pieces for milestones.',
    image: '/images/scenes/occasion-celebration.svg',
    link: '/women',
  },
];

export const OccasionSection: React.FC = () => {
  return (
    <section className="py-24 bg-pure/60 border-t border-platinum">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Curated Wardrobe</span>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl text-charcoal">
            Shop by Occasion
          </h2>
          <p className="text-sm text-graphite font-light leading-relaxed">
            A wristwatch is your most personal accessory. Select timepieces configured specifically for your lifestyle moments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {occasions.map((occ, idx) => (
            <Reveal key={occ.title} delay={(idx % 3) * 0.1}>
            <Link
              to={occ.link}
              className="shine group relative aspect-[4/3] bg-porcelain rounded-sm overflow-hidden flex flex-col justify-end p-6 border border-platinum/60 hover:shadow-luxe-hover transition-all duration-500"
            >
              <img
                src={occ.image}
                alt={occ.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />

              <div className="relative z-10 text-pure space-y-1">
                <h3 className="font-serif-luxury text-xl sm:text-2xl text-pure">{occ.title}</h3>
                <p className="text-xs text-pure/80 font-light line-clamp-2">{occ.subtitle}</p>
                <p className="text-[10px] uppercase tracking-wider text-gold-light pt-2 group-hover:translate-x-1 transition-transform inline-block">
                  Explore Occasion &rarr;
                </p>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OccasionSection;
