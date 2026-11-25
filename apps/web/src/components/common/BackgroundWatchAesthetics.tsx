import React, { useEffect, useMemo, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { gearSvg } from '../../lib/watchArt/engine';

/* ---------------------------- Drifting gold dust ---------------------------- */
const GoldDust: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let frame = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = Math.min(70, Math.floor(window.innerWidth / 20));
    const motes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.7 + Math.random() * 2,
      vy: 0.12 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.vy;
        m.x += Math.sin(t / 1800 + m.phase) * 0.22;
        if (m.y < -10) {
          m.y = h + 10;
          m.x = Math.random() * w;
        }
        const alpha = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t / 900 + m.phase));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 154, 115, ${alpha})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
};

/* ------------------------------ Gear silhouette ----------------------------- */
const Gear: React.FC<{ teeth: number; className: string; duration: number; reverse?: boolean }> = ({
  teeth,
  className,
  duration,
  reverse,
}) => {
  const html = useMemo(() => gearSvg(200, 200, 190, teeth, '#b49a73', '#faf9f6', 0, 6), [teeth]);
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
const AmbientDial: React.FC<{ className: string }> = ({ className }) => {
  const seconds = useMemo(() => new Date().getSeconds(), []);
  return (
    <svg viewBox="0 0 500 500" fill="none" className={className}>
      <g className="ambient-spin" style={{ animationDuration: '180s', transformOrigin: '250px 250px' }}>
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
      </g>
      <circle cx="250" cy="250" r="160" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 6" />
      <circle cx="250" cy="250" r="84" stroke="currentColor" strokeWidth="0.6" />
      <g
        className="ambient-spin"
        style={{ animationDuration: '60s', animationDelay: `-${seconds}s`, transformOrigin: '250px 250px' }}
      >
        <line x1="250" y1="292" x2="250" y2="46" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="250" cy="96" r="7" stroke="currentColor" strokeWidth="1.4" />
      </g>
      <circle cx="250" cy="250" r="6" fill="currentColor" />
    </svg>
  );
};

/* -------------------------------- Background -------------------------------- */
export const BackgroundWatchAesthetics: React.FC = () => {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const smooth = useSpring(scrollY, { stiffness: 60, damping: 20 });
  const slow = useTransform(smooth, (v) => v * -0.06);
  const fast = useTransform(smooth, (v) => v * 0.09);
  const turn = useTransform(smooth, (v) => v * 0.04);

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Soft moving light */}
      <div className="ambient-orb ambient-orb-a" />
      <div className="ambient-orb ambient-orb-b" />
      <div className="ambient-orb ambient-orb-c" />

      <motion.div style={reduced ? undefined : { y: slow }} className="absolute -top-40 -right-40">
        <motion.div style={reduced ? undefined : { rotate: turn }}>
          <AmbientDial className="w-[640px] h-[640px] text-gold opacity-[0.22]" />
        </motion.div>
      </motion.div>

      <motion.div style={reduced ? undefined : { y: fast }} className="absolute top-[38%] -left-44 hidden md:block">
        <Gear teeth={48} duration={90} className="w-[380px] h-[380px] opacity-[0.11]" />
        <Gear teeth={26} duration={48} reverse className="w-[200px] h-[200px] opacity-[0.13] -mt-20 ml-64" />
      </motion.div>

      <motion.div style={reduced ? undefined : { y: slow }} className="absolute -bottom-32 right-[4%]">
        <Gear teeth={36} duration={70} reverse className="w-[300px] h-[300px] opacity-[0.1]" />
      </motion.div>

      <AmbientDial className="absolute bottom-[8%] left-[8%] w-[260px] h-[260px] text-gold opacity-[0.12] hidden md:block" />

      {!reduced && <GoldDust />}
    </div>
  );
};

export default BackgroundWatchAesthetics;
