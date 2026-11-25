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
          className="fixed inset-0 z-[200] bg-[#141312] flex flex-col items-center justify-center"
          exit={{ clipPath: 'circle(0% at 50% 50%)' }}
          initial={{ clipPath: 'circle(150% at 50% 50%)' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <BrandMark label="Time, Perfected." size={180} />
          <div className="mt-8 h-px w-48 bg-ivory/10 overflow-hidden">
            <motion.div
              className="h-full bg-gold origin-left"
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
