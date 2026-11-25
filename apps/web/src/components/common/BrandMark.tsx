import React from 'react';
import { motion } from 'framer-motion';

const strokes = [
  [38, 68, 60, 110],
  [60, 110, 78, 68],
  [84, 32, 84, 110],
  [86, 89, 111, 68],
  [94, 80, 114, 110],
];

/** The VK monogram drawn stroke by stroke inside a sweeping bezel, using the logo gradient. */
export const BrandMark: React.FC<{ label?: string; size?: number }> = ({ label, size = 150 }) => (
  <div className="flex flex-col items-center gap-5">
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full ambient-spin" style={{ animationDuration: '14s' }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <line
            key={i}
            x1="80"
            y1="4"
            x2="80"
            y2={i % 5 === 0 ? 14 : 9}
            stroke="#0299F7"
            strokeOpacity={i % 5 === 0 ? 0.95 : 0.4}
            strokeWidth={i % 5 === 0 ? 1.6 : 0.8}
            transform={`rotate(${i * 6} 80 80)`}
          />
        ))}
      </svg>
      <svg viewBox="0 0 160 160" fill="none" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="vkBrandMarkGrad" x1="36" y1="80" x2="118" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#03F008" />
            <stop offset="35%" stopColor="#02D2C1" />
            <stop offset="68%" stopColor="#0299F7" />
            <stop offset="100%" stopColor="#0241FC" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r="60" stroke="#02D2C1" strokeWidth="1" pathLength={1} transform="rotate(-90 80 80)" className="draw-stroke" />
        <g transform="translate(4 9)">
          {strokes.map(([x1, y1, x2, y2], i) => (
            <path
              key={i}
              d={`M${x1} ${y1} L${x2} ${y2}`}
              stroke="url(#vkBrandMarkGrad)"
              strokeWidth="4.5"
              strokeLinecap="square"
              pathLength={1}
              className="draw-stroke"
              style={{ animationDelay: `${0.08 + i * 0.07}s`, animationDuration: '0.35s' }}
            />
          ))}
        </g>
      </svg>
    </div>
    {label && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
        className="text-center space-y-2 px-6"
      >
        <p className="font-serif-luxury text-2xl sm:text-3xl text-ivory">{label}</p>
        <p className="text-[10px] uppercase tracking-ultra text-gold-light">VK TIME</p>
      </motion.div>
    )}
  </div>
);

export default BrandMark;
