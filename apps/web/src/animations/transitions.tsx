import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants, useReducedMotion } from 'framer-motion';
import { Location, useLocation } from 'react-router-dom';
import { BrandMark } from '../components/common/BrandMark';

/**
 * VK TIME Centralized Route Transition Registry
 * Every major route gets a custom horological animation signature.
 */
export const routeTransitionVariants: Record<string, Variants> = {
  // 1. Home: Timepiece Assembly Reveal
  home: {
    initial: { opacity: 0, scale: 0.98, filter: 'blur(4px)' },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, scale: 1.01, transition: { duration: 0.3 } },
  },

  // 2. Shop: Chronograph Sweep (Staggered horizontal sweep)
  shop: {
    initial: { opacity: 0, x: -16, filter: 'blur(2px)' },
    animate: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] },
    },
    exit: { opacity: 0, x: 12, transition: { duration: 0.25 } },
  },

  // 3. Collections: Rotating Bezel Reveal
  collections: {
    initial: { opacity: 0, rotate: -1.5, scale: 0.98 },
    animate: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, rotate: 1, transition: { duration: 0.25 } },
  },

  // 4. Collection Slug: Radial Dial Expansion
  collectionSlug: {
    initial: { opacity: 0, scale: 0.96 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.48, ease: [0.19, 1, 0.22, 1] },
    },
    exit: { opacity: 0, scale: 1.02, transition: { duration: 0.25 } },
  },

  // 5. Men's Watches: Precision Steel Slide
  men: {
    initial: { opacity: 0, x: -24 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.42, ease: [0.2, 0.8, 0.2, 1] },
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.25 } },
  },

  // 6. Women's Watches: Silk and Champagne Reveal
  women: {
    initial: { opacity: 0, y: 12, filter: 'blur(3px)' },
    animate: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.52, ease: [0.25, 1, 0.5, 1] },
    },
    exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
  },

  // 7. Unisex Watches: Balanced Dual Reveal
  unisex: {
    initial: { opacity: 0, scaleY: 0.98 },
    animate: {
      opacity: 1,
      scaleY: 1,
      transition: { duration: 0.45, ease: 'easeOut' },
    },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  },

  // 8. New Arrivals: Tick-by-Tick Reveal
  newArrivals: {
    initial: { opacity: 0, y: 8 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },

  // 9. Bestsellers: Signature Highlight Sweep
  bestsellers: {
    initial: { opacity: 0, scale: 0.99 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  },

  // 10. Limited Editions: Numbered Dial Reveal
  limitedEdition: {
    initial: { opacity: 0, letterSpacing: '0.05em' },
    animate: {
      opacity: 1,
      letterSpacing: '0em',
      transition: { duration: 0.55, ease: 'easeOut' },
    },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  },

  // 11. Product Details: Macro Lens Transition
  productDetails: {
    initial: { opacity: 0, scale: 0.97, filter: 'blur(3px)' },
    animate: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, scale: 1.02, transition: { duration: 0.25 } },
  },

  // 12. Compare: Dual Dial Transition
  compare: {
    initial: { opacity: 0, scaleX: 0.97 },
    animate: {
      opacity: 1,
      scaleX: 1,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  },

  // 13. Watch Finder: Interactive Crown Rotation
  watchFinder: {
    initial: { opacity: 0, rotate: 1.2, scale: 0.98 },
    animate: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.34, 1.2, 0.64, 1] },
    },
    exit: { opacity: 0, rotate: -1, transition: { duration: 0.25 } },
  },

  // 14. Craftsmanship: Mechanical Assembly Transition
  craftsmanship: {
    initial: { opacity: 0, y: 16, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
  },

  // 15. Journal: Editorial Page Turn
  journal: {
    initial: { opacity: 0, y: 12 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },

  // 16. About: Timeline Unfold
  about: {
    initial: { opacity: 0, scaleY: 0.97 },
    animate: {
      opacity: 1,
      scaleY: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  },

  // 17. Size Guide: Measurement Grid Reveal
  sizeGuide: {
    initial: { opacity: 0, scale: 0.98 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.42, ease: 'easeOut' },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },

  // 18. Cart & Checkout: Precision Tray Slide & Secure Alignment
  cart: {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
    },
    exit: { opacity: 0, x: -16, transition: { duration: 0.2 } },
  },
  checkout: {
    initial: { opacity: 0, y: 8 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.32, ease: 'easeOut' },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },

  // 19. Order Confirmation: Time Completed
  orderSuccess: {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.55, ease: [0.34, 1.4, 0.64, 1] },
    },
    exit: { opacity: 0, transition: { duration: 0.25 } },
  },

  // 20. Default / Standard Horological Fallback
  default: {
    initial: { opacity: 0, y: 6 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },
};

export const getRouteTransitionKey = (pathname: string): string => {
  if (pathname === '/') return 'home';
  if (pathname === '/shop') return 'shop';
  if (pathname === '/collections') return 'collections';
  if (pathname.startsWith('/collections/')) return 'collectionSlug';
  if (pathname === '/men') return 'men';
  if (pathname === '/women') return 'women';
  if (pathname === '/unisex') return 'unisex';
  if (pathname === '/new-arrivals') return 'newArrivals';
  if (pathname === '/bestsellers') return 'bestsellers';
  if (pathname === '/limited-edition') return 'limitedEdition';
  if (pathname.startsWith('/watch/')) return 'productDetails';
  if (pathname === '/compare') return 'compare';
  if (pathname === '/watch-finder') return 'watchFinder';
  if (pathname === '/craftsmanship') return 'craftsmanship';
  if (pathname.startsWith('/journal')) return 'journal';
  if (pathname === '/about') return 'about';
  if (pathname === '/size-guide') return 'sizeGuide';
  if (pathname === '/cart') return 'cart';
  if (pathname === '/checkout') return 'checkout';
  if (pathname.startsWith('/order-success')) return 'orderSuccess';
  return 'default';
};

/* ------------------------------------------------------------------ */
/*  Curtain                                                            */
/* ------------------------------------------------------------------ */

type CurtainStyle = 'shutter' | 'iris' | 'sweep';

const COVER_MS = 620;
const EASE = [0.76, 0, 0.24, 1] as const;

const ROUTE_LABELS: Record<string, string> = {
  home: 'Time, Perfected',
  shop: 'The Catalogue',
  collections: 'Collections',
  collectionSlug: 'The Collection',
  men: "Men's Timepieces",
  women: "Women's Timepieces",
  unisex: 'Unisex Timepieces',
  newArrivals: 'New Arrivals',
  bestsellers: 'Bestsellers',
  limitedEdition: 'Limited Editions',
  productDetails: 'The Reference',
  compare: 'Compare',
  watchFinder: 'Watch Finder',
  craftsmanship: 'Craftsmanship',
  journal: 'The Gazette',
  about: 'Our Story',
  sizeGuide: 'Size Guide',
  cart: 'Your Bag',
  checkout: 'Secure Checkout',
  orderSuccess: 'Order Confirmed',
  default: 'One Moment',
};

const getCurtainStyle = (key: string): CurtainStyle => {
  if (['home', 'productDetails', 'watchFinder', 'orderSuccess', 'collectionSlug'].includes(key)) return 'iris';
  if (['shop', 'men', 'cart', 'checkout', 'compare', 'journal'].includes(key)) return 'sweep';
  return 'shutter';
};

const Curtain: React.FC<{ variantStyle: CurtainStyle; label: string }> = ({ variantStyle, label }) => (
  <motion.div
    className="fixed inset-0 z-[150] overflow-hidden"
    initial="initial"
    animate="cover"
    exit="reveal"
    aria-hidden="true"
  >
    {variantStyle === 'shutter' &&
      Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-y-0 bg-[#141312] border-r border-gold/25"
          style={{ left: `${(i * 100) / 6}%`, width: `${100 / 6 + 0.2}%` }}
          variants={{
            initial: { y: i % 2 ? '101%' : '-101%' },
            cover: { y: '0%', transition: { duration: 0.44, delay: i * 0.03, ease: EASE } },
            reveal: { y: i % 2 ? '-101%' : '101%', transition: { duration: 0.55, delay: i * 0.035, ease: EASE } },
          }}
        />
      ))}

    {variantStyle === 'sweep' && (
      <>
        <motion.div
          className="absolute inset-0 bg-gold"
          variants={{
            initial: { x: '-101%' },
            cover: { x: '0%', transition: { duration: 0.42, ease: EASE } },
            reveal: { x: '101%', transition: { duration: 0.55, delay: 0.1, ease: EASE } },
          }}
        />
        <motion.div
          className="absolute inset-0 bg-[#141312]"
          variants={{
            initial: { x: '-101%' },
            cover: { x: '0%', transition: { duration: 0.46, delay: 0.1, ease: EASE } },
            reveal: { x: '101%', transition: { duration: 0.55, ease: EASE } },
          }}
        />
      </>
    )}

    {variantStyle === 'iris' && (
      <motion.div
        className="absolute inset-0 bg-[#141312]"
        variants={{
          initial: { clipPath: 'circle(0% at 50% 50%)' },
          cover: { clipPath: 'circle(75% at 50% 50%)', transition: { duration: 0.55, ease: EASE } },
          reveal: { clipPath: 'circle(0% at 50% 50%)', transition: { duration: 0.6, ease: EASE } },
        }}
      />
    )}

    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      variants={{
        initial: { opacity: 0, scale: 0.9 },
        cover: { opacity: 1, scale: 1, transition: { delay: 0.26, duration: 0.3 } },
        reveal: { opacity: 0, scale: 1.08, transition: { duration: 0.2 } },
      }}
    >
      <BrandMark label={label} />
    </motion.div>
  </motion.div>
);

/**
 * Keeps the outgoing page on screen until the curtain has closed, then swaps
 * routes underneath it and opens again.
 */
export const usePageTransition = () => {
  const location = useLocation();
  const reduced = useReducedMotion();
  const [displayLocation, setDisplayLocation] = useState<Location>(location);
  const [curtain, setCurtain] = useState<{ variantStyle: CurtainStyle; label: string } | null>(null);

  useEffect(() => {
    // Query / hash updates on the same page apply instantly.
    if (location.pathname === displayLocation.pathname) {
      if (location !== displayLocation) setDisplayLocation(location);
      setCurtain(null);
      return;
    }

    const swap = () => {
      setDisplayLocation(location);
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    };

    if (reduced) {
      swap();
      return;
    }

    const key = getRouteTransitionKey(location.pathname);
    setCurtain({ variantStyle: getCurtainStyle(key), label: ROUTE_LABELS[key] ?? ROUTE_LABELS.default });
    const timer = setTimeout(() => {
      swap();
      setCurtain(null);
    }, COVER_MS);
    return () => clearTimeout(timer);
  }, [location, displayLocation, reduced]);

  const overlay = <AnimatePresence>{curtain && <Curtain key="curtain" {...curtain} />}</AnimatePresence>;

  return { displayLocation, overlay };
};

/** Per-route entrance choreography for the incoming page. */
export const PageStage: React.FC<{ pathname: string; children: React.ReactNode }> = ({ pathname, children }) => {
  const key = getRouteTransitionKey(pathname);
  const variant = routeTransitionVariants[key] || routeTransitionVariants.default;
  const animate = variant.animate as Record<string, unknown>;

  return (
    <motion.div
      initial={variant.initial as never}
      // Clear residual filters so fixed-position modals keep working.
      animate={{ ...animate, transitionEnd: { filter: 'none' } } as never}
      className="w-full flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
};
