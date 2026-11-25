import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '../common/Reveal';

const collectionsData = [
  {
    title: 'The Automatic Collection',
    tagline: 'Perpetual Kinetic Energy',
    desc: 'Self-winding mechanical movements with sapphire exhibition casebacks and high-beat frequency.',
    image: '/images/scenes/hero-automatic.svg',
    link: '/collections/the-automatic-collection',
    span: 'col-span-1 md:col-span-7',
  },
  {
    title: 'The Minimal Collection',
    tagline: 'Monolithic Architectural Balance',
    desc: 'Slender 6.8mm profiles with pure porcelain dials and stainless mesh.',
    image: '/images/scenes/hero-minimal.svg',
    link: '/collections/the-minimal-collection',
    span: 'col-span-1 md:col-span-5',
  },
  {
    title: 'The Chronograph Collection',
    tagline: 'Split-Second Track Heritage',
    desc: 'Dual sub-dial precision with ceramic tachymeter bezels.',
    image: '/images/scenes/hero-chronograph.svg',
    link: '/collections/the-chronograph-collection',
    span: 'col-span-1 md:col-span-5',
  },
  {
    title: 'The Classic Collection',
    tagline: 'Heritage Horology',
    desc: 'Sector dials, flame-blued hands, and full-grain Italian leather.',
    image: '/images/scenes/hero-classic.svg',
    link: '/collections/the-classic-collection',
    span: 'col-span-1 md:col-span-7',
  },
  {
    title: 'The Signature Collection',
    tagline: 'Haute Horlogerie',
    desc: 'Moonphase, skeleton and mother-of-pearl: the pinnacle of VK TIME finishing.',
    image: '/images/scenes/hero-signature.svg',
    link: '/collections/the-signature-collection',
    span: 'col-span-1 md:col-span-12',
  },
];

export const CollectionsEditorial: React.FC = () => {
  return (
    <section className="py-24 border-t border-platinum">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-ultra text-gold font-medium">Curated Pillars</span>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl text-charcoal">
              Signature Collections
            </h2>
          </div>
          <Link
            to="/collections"
            className="text-xs uppercase tracking-luxury text-charcoal hover:text-gold flex items-center gap-1.5 underline underline-offset-4"
          >
            <span>View All Collections</span>
            <ArrowUpRight className="w-4 h-4 text-gold" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {collectionsData.map((col, idx) => (
            <Reveal key={col.link} delay={(idx % 2) * 0.1} className={col.span}>
            <Link
              to={col.link}
              className={`shine h-full group relative overflow-hidden bg-porcelain rounded-sm border border-platinum/60 hover:shadow-luxe-hover transition-all duration-700 min-h-[320px] flex flex-col justify-end p-8`}
            >
              <img
                src={col.image}
                alt={col.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-right transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 text-pure space-y-1.5">
                <span className="text-[9px] uppercase tracking-ultra text-gold-light font-medium">
                  {col.tagline}
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-pure">
                  {col.title}
                </h3>
                <p className="text-xs text-pure/80 font-light max-w-md line-clamp-2">
                  {col.desc}
                </p>
                <div className="pt-2 flex items-center gap-1 text-[11px] uppercase tracking-wider text-pure group-hover:text-gold-light transition-colors">
                  <span>Explore Series</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsEditorial;
