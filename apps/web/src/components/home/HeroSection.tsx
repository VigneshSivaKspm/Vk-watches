import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { LiveWatch } from '../common/LiveWatch';
import { watchArt } from '../../lib/images';

const featured = [
  {
    slug: 'vk-sovereign-automatic-40',
    name: 'Sovereign Automatic 40',
    detail: 'Calibre VK-801 • Sapphire',
    price: '₹48,500',
    glow: 'rgba(2,153,247,0.36)',
  },
  {
    slug: 'vk-navigator-diver-44',
    name: 'Navigator Diver 44',
    detail: '300m • Ceramic Bezel',
    price: '₹58,900',
    glow: 'rgba(66,135,200,0.38)',
  },
  {
    slug: 'vk-chronos-skeleton-limited-41',
    name: 'Chronos Skeleton Limited',
    detail: 'Hand-Wound • 300 Pieces',
    price: '₹89,000',
    glow: 'rgba(150,150,170,0.45)',
  },
  {
    slug: 'vk-verona-automatic-36',
    name: 'Verona Automatic 36',
    detail: 'Emerald Guilloché • Rose Gold',
    price: '₹49,500',
    glow: 'rgba(52,150,110,0.35)',
  },
];

const ROTATE_MS = 6000;

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 34 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 1, ease: [0.16, 1, 0.3, 1] as const },
});

export const HeroSection: React.FC = () => {
  const [index, setIndex] = useState(0);
  const active = featured[index];

  // Gentle 3D tilt following the pointer
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), { stiffness: 80, damping: 14 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), { stiffness: 80, damping: 14 });

  useEffect(() => {
    const t = setTimeout(() => setIndex((i) => (i + 1) % featured.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <section
      className="relative min-h-[calc(100vh-110px)] flex items-center overflow-hidden px-4 sm:px-6 lg:px-8 py-8"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      {/* Oversized watermark */}
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.6, delay: 0.4 }}
        className="pointer-events-none absolute -bottom-6 left-0 font-serif-luxury text-[22vw] leading-none text-gold/[0.05] whitespace-nowrap select-none"
      >
        VK&nbsp;TIME
      </motion.span>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        {/* Left Editorial Narrative */}
        <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
          <motion.div {...rise(0.15)} className="inline-flex items-center gap-2 px-3 py-1 bg-pure border border-platinum rounded-full">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-gold animate-ping" />
              <span className="relative w-1.5 h-1.5 rounded-full bg-gold" />
            </span>
            <span className="text-[10px] uppercase tracking-ultra text-graphite font-medium">
              Geneva Precision &bull; Haute Horlogerie
            </span>
          </motion.div>

          <motion.h1 {...rise(0.28)} className="font-serif-luxury text-5xl sm:text-7xl 2xl:text-8xl text-charcoal leading-[1.02] tracking-tight">
            Time, <br />
            <span className="italic font-normal bg-gradient-to-r from-brand-emerald via-brand-cyan to-brand-blue bg-clip-text text-transparent pr-3">
              Perfected.
            </span>
          </motion.h1>

          <motion.p {...rise(0.4)} className="text-sm sm:text-base text-graphite font-light max-w-lg leading-relaxed mx-auto lg:mx-0">
            Discover timepieces designed for every moment. Engineered with high-beat mechanical calibres,
            scratch-resistant sapphire crystals, and architectural purity.
          </motion.p>

          <motion.div {...rise(0.52)} className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              to="/shop"
              className="shine w-full sm:w-auto px-8 py-3.5 bg-charcoal text-pure text-xs uppercase tracking-luxury font-medium hover:bg-gold transition-colors duration-300 flex items-center justify-center gap-2 group shadow-lg"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/craftsmanship"
              className="w-full sm:w-auto px-8 py-3.5 bg-pure/80 border border-platinum text-charcoal text-xs uppercase tracking-luxury hover:border-charcoal transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Compass className="w-3.5 h-3.5 text-gold" />
              <span>Discover Craftsmanship</span>
            </Link>
          </motion.div>

          <motion.div {...rise(0.64)} className="pt-5 grid grid-cols-3 gap-6 border-t border-gold/30 max-w-md mx-auto lg:mx-0 text-left">
            {[
              ['28,800', 'Vibrations / Hr'],
              ['904L', 'Oystersteel'],
              ['5 Years', 'International Warranty'],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-serif-luxury text-xl sm:text-3xl text-charcoal">{value}</p>
                <p className="text-[10px] uppercase tracking-wider text-graphite/70">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: live, rotating showcase */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-lg h-[440px] sm:h-[clamp(390px,calc(100vh-260px),580px)]" style={{ perspective: 1100 }}>
            {featured.map((item, i) => (
              <div
                key={item.slug}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] aspect-square rounded-full transition-opacity duration-[1200ms]"
                style={{
                  background: `radial-gradient(circle, ${item.glow} 0%, transparent 62%)`,
                  opacity: i === index ? 1 : 0,
                }}
              />
            ))}

            {/* Orbiting rings */}
            <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full text-gold" fill="none" aria-hidden="true">
              <g className="ambient-spin" style={{ animationDuration: '60s', transformOrigin: '250px 250px' }}>
                <circle cx="250" cy="250" r="232" stroke="currentColor" strokeOpacity=".55" strokeDasharray="1 11" strokeWidth="6" />
                <circle cx="250" cy="18" r="5" fill="currentColor" />
              </g>
              <g className="ambient-spin" style={{ animationDuration: '40s', animationDirection: 'reverse', transformOrigin: '250px 250px' }}>
                <circle cx="250" cy="250" r="198" stroke="currentColor" strokeOpacity=".35" strokeDasharray="120 40 8 40" />
                <circle cx="448" cy="250" r="3.5" fill="currentColor" />
              </g>
            </svg>

            <motion.div className="relative w-full h-full" style={{ rotateX, rotateY }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.slug}
                  className="absolute inset-0"
                  initial={{ opacity: 0, rotate: -35, scale: 0.75 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link to={`/watch/${active.slug}`} aria-label={`View ${active.name}`} className="block w-full h-full animate-float">
                    <LiveWatch slug={active.slug} className="w-full h-full" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Floating Specification Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.45 }}
                className="absolute bottom-2 right-1 sm:right-0 w-64 sm:w-72 max-w-[calc(100vw-2rem)]"
              >
                <Link
                  to={`/watch/${active.slug}`}
                  className="block bg-pure/95 border border-platinum hover:border-gold p-4 rounded-sm shadow-luxe transition-colors"
                >
                  <span className="text-[9px] uppercase tracking-ultra text-gold-dark font-medium">Featured Reference</span>
                  <p className="font-serif-luxury text-base sm:text-lg text-charcoal leading-tight truncate">{active.name}</p>
                  <div className="flex justify-between items-center gap-3 text-[11px] text-graphite pt-1">
                    <span className="truncate">{active.detail}</span>
                    <span className="font-medium text-charcoal whitespace-nowrap flex-shrink-0">{active.price}</span>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Selector thumbnails */}
          <div className="flex gap-3 pt-3">
            {featured.map((item, i) => (
              <button
                key={item.slug}
                onClick={() => setIndex(i)}
                aria-label={`Show ${item.name}`}
                aria-pressed={i === index}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                  i === index ? 'border-gold scale-110 shadow-lg' : 'border-platinum opacity-70 hover:opacity-100'
                }`}
              >
                <img src={watchArt(item.slug, 'macro')} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
