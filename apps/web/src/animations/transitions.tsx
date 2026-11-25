import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants, useReducedMotion } from 'framer-motion';
import { Location, useLocation } from 'react-router-dom';
import { BrandMark } from '../components/common/BrandMark';

/**
 * VK TIME Centralized Route Transition Registry
 * Every major route gets a custom horological animation signature.
 */
/*
 * Entrance choreography per route. Only opacity + a small translate are used:
 * these run on the GPU. Blur filters and scale/rotate on a whole page force the
 * browser to re-rasterise it every frame, which is what made navigation stutter.
 */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const fade = (x = 0, y = 0, duration = 0.4): Variants => ({
  initial: { opacity: 0, x, y },
  animate: { opacity: 1, x: 0, y: 0, transition: { duration, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
});

export const routeTransitionVariants: Record<string, Variants> = {
  home: fade(0, 0, 0.45),
  shop: fade(-16),
  collections: fade(0, 10),
  collectionSlug: fade(0, 10),
  men: fade(-20),
  women: fade(0, 12),
  unisex: fade(0, 8),
  newArrivals: fade(0, 8),
  bestsellers: fade(0, 8),
  limitedEdition: fade(0, 8, 0.45),
  productDetails: fade(0, 12),
  compare: fade(0, 8),
  watchFinder: fade(0, 10),
  craftsmanship: fade(0, 16, 0.5),
  journal: fade(0, 12),
  about: fade(0, 10),
  sizeGuide: fade(0, 8),
  cart: fade(20, 0, 0.35),
  checkout: fade(0, 8, 0.32),
  orderSuccess: fade(0, 12, 0.5),
  default: fade(0, 6, 0.35),
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
    style={{ contain: 'strict' }}
    initial="initial"
    animate="cover"
    exit="reveal"
    aria-hidden="true"
  >
    {variantStyle === 'shutter' &&
      Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-y-0 bg-[#090F1A] border-r border-brand-teal/25"
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
          className="absolute inset-0 bg-gradient-to-r from-[#03F008] via-[#02D2C1] to-[#0241FC]"
          variants={{
            initial: { x: '-101%' },
            cover: { x: '0%', transition: { duration: 0.42, ease: EASE } },
            reveal: { x: '101%', transition: { duration: 0.55, delay: 0.1, ease: EASE } },
          }}
        />
        <motion.div
          className="absolute inset-0 bg-[#090F1A]"
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
        className="absolute left-1/2 top-1/2 rounded-full bg-[#090F1A]"
        style={{ width: '170vmax', height: '170vmax', marginLeft: '-85vmax', marginTop: '-85vmax' }}
        variants={{
          initial: { scale: 0 },
          cover: { scale: 1, transition: { duration: 0.5, ease: EASE } },
          reveal: { scale: 0, transition: { duration: 0.5, ease: EASE } },
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

  return (
    <motion.div
      initial={variant.initial as never}
      // transform is cleared once settled so fixed-position children stay viewport-relative
      animate={{ ...(variant.animate as Record<string, unknown>), transitionEnd: { transform: 'none' } } as never}
      className="w-full flex-grow flex flex-col"
    >
      {children}
    </motion.div>
  );
};
