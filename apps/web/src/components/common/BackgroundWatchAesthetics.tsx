import React, { useEffect, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gearSvg } from '../../lib/watchArt/engine';

/* ------------------------------ Gear silhouette ----------------------------- */
const Gear: React.FC<{ teeth: number; className: string; duration: number; reverse?: boolean }> = ({
  teeth,
  className,
  duration,
  reverse,
}) => {
  const html = useMemo(() => gearSvg(200, 200, 190, teeth, '#0299f7', '#faf9f6', 0, 6), [teeth]);
  return (
    <svg
      viewBox="0 0 400 400"
      className={`ambient-spin ${className}`}
      style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/* --------------------------------- Big dial --------------------------------- */
/** Each moving part is its own SVG layer so the browser can spin it on the GPU. */
const AmbientDial: React.FC<{ className: string }> = ({ className }) => {
  const seconds = useMemo(() => new Date().getSeconds(), []);
  const layer = 'absolute inset-0 w-full h-full';
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 500 500" fill="none" className={`${layer} ambient-spin`} style={{ animationDuration: '180s' }}>
        <circle cx="250" cy="250" r="240" stroke="currentColor" strokeDasharray="4 8" />
        <circle cx="250" cy="250" r="224" stroke="currentColor" strokeWidth="0.8" />
        {Array.from({ length: 60 }).map((_, i) => (
          <line
            key={i}
            x1="250"
            y1="30"
            x2="250"
            y2={i % 5 === 0 ? 58 : 40}
            stroke="currentColor"
            strokeWidth={i % 5 === 0 ? 2.4 : 1}
            transform={`rotate(${i * 6} 250 250)`}
          />
        ))}
      </svg>
      <svg viewBox="0 0 500 500" fill="none" className={layer}>
        <circle cx="250" cy="250" r="160" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 6" />
        <circle cx="250" cy="250" r="84" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="250" cy="250" r="6" fill="currentColor" />
      </svg>
      <svg
        viewBox="0 0 500 500"
        fill="none"
        className={`${layer} ambient-spin`}
        style={{ animationDuration: '60s', animationDelay: `-${seconds}s` }}
      >
        <line x1="250" y1="292" x2="250" y2="46" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="250" cy="96" r="7" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </div>
  );
};

/* -------------------------------- Background -------------------------------- */
/**
 * Purely decorative, so it is kept as cheap as possible:
 *  - everything animates with CSS transform on its own compositor layer
 *  - no per-frame JS (no canvas, no scroll springs)
 *  - animations pause while scrolling / when the tab is hidden (see globals.css)
 */
export const BackgroundWatchAesthetics: React.FC = () => {
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    let timer: number | undefined;
    const onScroll = () => {
      root.classList.add('is-scrolling');
      window.clearTimeout(timer);
      timer = window.setTimeout(() => root.classList.remove('is-scrolling'), 160);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
      root.classList.remove('is-scrolling');
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`ambient-root fixed inset-0 pointer-events-none overflow-hidden z-0 select-none ${reduced ? 'ambient-static' : ''}`}
    >
      {/* Soft moving light */}
      <div className="ambient-orb ambient-orb-a" />
      <div className="ambient-orb ambient-orb-b" />
      <div className="ambient-orb ambient-orb-c" />

      <div className="absolute -top-40 -right-40">
        <AmbientDial className="w-[640px] h-[640px] text-gold opacity-[0.22]" />
      </div>

      <div className="absolute top-[38%] -left-44 hidden md:block">
        <Gear teeth={48} duration={90} className="w-[380px] h-[380px] opacity-[0.11]" />
        <Gear teeth={26} duration={48} reverse className="w-[200px] h-[200px] opacity-[0.13] -mt-20 ml-64" />
      </div>

      <div className="absolute -bottom-32 right-[4%] hidden md:block">
        <Gear teeth={36} duration={70} reverse className="w-[300px] h-[300px] opacity-[0.1]" />
      </div>

      <AmbientDial className="absolute bottom-[8%] left-[8%] w-[260px] h-[260px] text-gold opacity-[0.12] hidden md:block" />
    </div>
  );
};

export default BackgroundWatchAesthetics;
