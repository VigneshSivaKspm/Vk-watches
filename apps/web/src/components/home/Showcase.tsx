/** Extra editorial home sections: ribbon, gender trio, gallery and promise. */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../common/Reveal';
import { sceneArt, watchArt } from '../../lib/images';

/* ----------------------------- Scrolling ribbon ----------------------------- */
const ribbon = [
  'Sapphire Crystal',
  'Swiss & In-House Calibres',
  '316L & 904L Steel',
  'Vegetable-Tanned Leather',
  '5-Year Warranty',
  'Insured Worldwide Delivery',
  'Numbered Editions',
];

export const Ribbon: React.FC = () => (
  <div className="marquee-mask overflow-hidden bg-[#090F1A] py-4 border-y border-brand-teal/30">
    <div className="animate-marquee flex w-max">
      {[...ribbon, ...ribbon].map((item, i) => (
        <span key={i} className="flex items-center gap-10 pr-10 text-[11px] uppercase tracking-ultra text-ivory/85 whitespace-nowrap">
          {item}
          <span className="w-1.5 h-1.5 rotate-45 bg-gold-light" />
        </span>
      ))}
    </div>
  </div>
);

/* -------------------------------- Gender trio ------------------------------- */
const genders = [
  {
    to: '/men',
    image: sceneArt('men'),
    eyebrow: 'Executive Demeanor',
    title: "Men's Timepieces",
    copy: 'Commanding 39–44mm cases with high-beat engines and ceramic bezels.',
  },
  {
    to: '/women',
    image: sceneArt('women'),
    eyebrow: 'Refined Grace',
    title: "Women's Timepieces",
    copy: 'Mother-of-pearl, stone-set bezels and champagne gold finishing.',
  },
  {
    to: '/unisex',
    image: sceneArt('unisex'),
    eyebrow: 'Universal Balance',
    title: 'Unisex Timepieces',
    copy: 'Golden-ratio profiles from 36–41mm that flatter every wrist.',
  },
];

export const GenderShowcase: React.FC = () => (
  <section className="py-24 border-t border-platinum">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {genders.map((g, i) => (
        <Reveal key={g.to} delay={i * 0.12}>
          <Link to={g.to} className="shine group block aspect-[4/5] rounded-sm shadow-luxe">
            <img
              src={g.image}
              alt={g.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7 text-pure space-y-2">
              <span className="text-[9px] uppercase tracking-ultra text-gold-light">{g.eyebrow}</span>
              <h3 className="font-serif-luxury text-3xl">{g.title}</h3>
              <p className="text-xs text-pure/80 font-light">{g.copy}</p>
              <span className="inline-flex items-center gap-1 pt-2 text-[11px] uppercase tracking-wider group-hover:text-gold-light transition-colors">
                Discover <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  </section>
);

/* ------------------------------ Infinite gallery ---------------------------- */
const galleryRow = [
  'vk-regent-moonphase-41',
  'vk-celeste-rose-30',
  'vk-obsidian-chronograph-43',
  'vk-terra-field-40',
  'vk-lumiere-diamond-32',
  'vk-equinox-gmt-40',
  'vk-statesman-handwound-38',
  'vk-nocturne-noir-34',
  'vk-aero-chronograph-42',
  'vk-solene-gold-28',
];

export const WatchGallery: React.FC = () => (
  <section className="py-24 border-t border-platinum overflow-hidden">
    <Reveal className="text-center max-w-2xl mx-auto mb-12 space-y-3 px-6">
      <span className="text-[10px] uppercase tracking-ultra text-gold-dark font-medium">The Atelier Wall</span>
      <h2 className="font-serif-luxury text-3xl sm:text-5xl text-charcoal">A Gallery of Time</h2>
      <p className="text-sm text-graphite font-light">Hover to pause, select any piece to explore it.</p>
    </Reveal>

    {[false, true].map((reverse) => (
      <div key={String(reverse)} className="marquee-mask overflow-hidden py-3">
        <div className="animate-marquee flex w-max" style={reverse ? { animationDirection: 'reverse' } : undefined}>
          {[...galleryRow, ...galleryRow].map((slug, i) => (
            <Link
              key={i}
              to={`/watch/${slug}`}
              tabIndex={i >= galleryRow.length ? -1 : 0}
              aria-label={slug.replace(/-/g, ' ')}
              className="shine mr-6 block w-52 sm:w-64 aspect-square rounded-sm shadow-subtle"
            >
              <img
                src={watchArt(slug, reverse ? 'tilt' : 'front')}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </Link>
          ))}
        </div>
      </div>
    ))}
  </section>
);

/* --------------------------------- Promise ---------------------------------- */
const promises = [
  {
    title: 'Hand-Inspected',
    copy: 'Every reference is timed in multiple positions and pressure checked before it is sealed in its box.',
    watch: 'vk-sovereign-automatic-40',
  },
  {
    title: 'Insured To Your Door',
    copy: 'Tamper-evident, fully insured delivery with live order tracking from atelier to wrist.',
    watch: 'vk-celeste-rose-30',
  },
  {
    title: 'Covered For Five Years',
    copy: 'An international movement warranty, with servicing guidance from our concierge desk.',
    watch: 'vk-navigator-diver-44',
  },
];

export const AtelierPromise: React.FC = () => (
  <section className="py-24 border-t border-platinum">
    <div className="max-w-7xl mx-auto px-6">
      <Reveal className="text-center mb-14 space-y-3">
        <span className="text-[10px] uppercase tracking-ultra text-gold-dark font-medium">The Atelier Standard</span>
        <h2 className="font-serif-luxury text-3xl sm:text-5xl text-charcoal">Our Promise To Your Wrist</h2>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promises.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.12}>
            <article className="group h-full bg-pure/95 border border-platinum rounded-sm p-8 text-center space-y-4 shadow-subtle hover:-translate-y-1.5 hover:shadow-luxe-hover transition-all duration-500">
              <div className="mx-auto w-32 h-32 rounded-full overflow-hidden border-2 border-gold/50 p-1">
                <img
                  src={watchArt(v.watch, 'macro')}
                  alt=""
                  loading="lazy"
                  className="w-full h-full rounded-full object-cover transition-transform duration-1000 group-hover:rotate-12 group-hover:scale-110"
                />
              </div>
              <h3 className="font-serif-luxury text-2xl text-charcoal">{v.title}</h3>
              <p className="text-xs text-graphite font-light leading-relaxed">{v.copy}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
