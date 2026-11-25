import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrandMark } from './BrandMark';

const KEY = 'vk_time_intro_seen';

const shouldShow = () => {
  try {
    return !sessionStorage.getItem(KEY) && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

/** One-time-per-session opening sequence. */
export const Preloader: React.FC = () => {
  const [visible, setVisible] = useState(shouldShow);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(KEY, '1');
      } catch {
        /* private mode */
      }
    }, 1900);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] bg-[#090F1A] flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <BrandMark label="Time, Perfected." size={180} />
          <div className="mt-8 h-px w-48 bg-ivory/10 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#03F008] via-[#02D2C1] to-[#0241FC] origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.7, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
