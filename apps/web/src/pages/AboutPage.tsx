import React from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/common/PageHero';
import { Reveal } from '../components/common/Reveal';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full text-charcoal">
      <PageHero
          eyebrow="Brand Identity & Manifesto"
          title="Designed Beyond the Moment"
          description="A luxury wristwatch is not merely a marker of status, but an intimate machine that anchors the wearer in physical reality."
          image="/images/scenes/hero-classic.svg"
        />

      <div className="max-w-4xl mx-auto px-6 py-20 space-y-16 text-sm sm:text-base text-graphite font-light leading-relaxed">
        <section className="space-y-4">
          <h2 className="font-serif-luxury text-2xl sm:text-3xl text-charcoal">The Genesis of VK TIME</h2>
          <p>
            In an era inundated with ephemeral smart screens and disposable electronics, VK TIME was created as a sanctuary of permanent physical engineering. Every component—from the solid surgical steel cases to the flame-blued hands—is conceived to outlive the decade in which it was born.
          </p>
          <p>
            Our geometric lowercase monogram, featuring the tall vertical 'k' stem and centered 'time' wordmark, embodies our architectural ethos: eliminate non-essential ornamentation until only pure functional balance remains.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-platinum">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Pillar 01</span>
            <h3 className="font-serif-luxury text-xl text-charcoal">Honest Materials</h3>
            <p className="text-xs text-graphite leading-relaxed">
              Grade 316L and 904L steel, synthetic corundum sapphire, and vegetable-tanned Tuscan calfskin.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Pillar 02</span>
            <h3 className="font-serif-luxury text-xl text-charcoal">Horological Integrity</h3>
            <p className="text-xs text-graphite leading-relaxed">
              No false tourbillons or decorative sub-dials. Every hand and complication serves an authentic purpose.
            </p>
          </div>
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Pillar 03</span>
            <h3 className="font-serif-luxury text-xl text-charcoal">Wearer Ergonomics</h3>
            <p className="text-xs text-graphite leading-relaxed">
              Downward lug rakes engineered specifically to cradle wrist bone contours with effortless ease.
            </p>
          </div>
        </section>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { image: '/images/scenes/journal-movement.svg', title: 'The Calibre Bench', to: '/craftsmanship' },
          { image: '/images/scenes/journal-leather.svg', title: 'The Leather Atelier', to: '/journal/the-quiet-luxury-of-a-leather-strap' },
          { image: '/images/scenes/journal-sapphire.svg', title: 'The Crystal Lab', to: '/journal/the-art-of-sapphire-crystals' },
        ].map((tile, i) => (
          <Reveal key={tile.title} delay={i * 0.12}>
            <Link to={tile.to} className="shine group block aspect-[4/3] rounded-sm shadow-luxe">
              <img src={tile.image} alt={tile.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <h3 className="absolute bottom-5 left-5 font-serif-luxury text-2xl text-pure">{tile.title}</h3>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
