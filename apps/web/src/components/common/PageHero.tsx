import React from 'react';
import { motion } from 'framer-motion';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  image: string;
  quote?: string;
  /** For narrow, centred layouts: shifts the artwork clear of the headline. */
  compact?: boolean;
  children?: React.ReactNode;
}

/** Cinematic page banner: slow-zooming artwork with an editorial headline. */
export const PageHero: React.FC<PageHeroProps> = ({ eyebrow, title, description, image, quote, compact, children }) => (
  <section className="relative w-full overflow-hidden bg-[#141312] min-h-[340px] sm:min-h-[440px] flex items-center">
    <motion.img
      src={image}
      alt=""
      className={
        compact
          ? 'absolute top-0 h-full w-auto max-w-none right-[-85%] sm:right-[-28%]'
          : 'absolute inset-0 w-full h-full object-cover object-right'
      }
      initial={{ scale: 1.18, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/45 sm:via-black/55 sm:to-black/5" />
    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 py-16">
      <div className="max-w-xl space-y-4">
        <motion.span
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-3 text-[10px] uppercase tracking-ultra text-gold-light font-medium"
        >
          <span className="h-px w-8 bg-gold" />
          {eyebrow}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif-luxury text-4xl sm:text-6xl text-ivory leading-[1.08]"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="text-sm text-ivory/80 font-light leading-relaxed"
          >
            {description}
          </motion.p>
        )}
        {quote && <p className="font-serif-luxury italic text-gold-light text-base">&ldquo;{quote}&rdquo;</p>}
        {children}
      </div>
    </div>
  </section>
);

export default PageHero;
