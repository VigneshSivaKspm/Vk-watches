import React from 'react';
import { Link } from 'react-router-dom';

interface VkLogoProps {
  variant?: 'monogram' | 'full' | 'stacked' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  useImage?: boolean;
}

export const VkLogo: React.FC<VkLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  useImage = false,
}) => {
  const sizeMap = {
    sm: { height: 28, imageH: 'h-7', text: 'text-xs' },
    md: { height: 40, imageH: 'h-10', text: 'text-sm' },
    lg: { height: 56, imageH: 'h-14', text: 'text-base' },
    xl: { height: 80, imageH: 'h-20', text: 'text-xl' },
  };

  const currentSize = sizeMap[size];

  if (useImage) {
    return (
      <Link to="/" className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src="/vk-time-logo.jpg"
          alt="VK TIME"
          className={`${currentSize.imageH} w-auto object-contain mix-blend-multiply`}
        />
      </Link>
    );
  }

  // Precise geometric SVG recreation of the official VK TIME identity:
  // - Clean 'v' with balanced diagonal strokes
  // - Tall vertical 'k' stem extending upward with precise geometry
  // - Clean lowercase 'time' wordmark centered below
  return (
    <Link
      to="/"
      aria-label="VK TIME - Return to homepage"
      className={`inline-flex flex-col items-center justify-center group select-none tracking-tight ${className}`}
    >
      <svg
        height={currentSize.height}
        viewBox="28 24 104 112"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      >
        {/* Monogram 'vk' with tall vertical stem matching official asset */}
        {/* Left 'v' stroke */}
        <line
          x1="38"
          y1="68"
          x2="60"
          y2="110"
          stroke="#262626"
          strokeWidth="4.5"
          strokeLinecap="square"
        />
        {/* Right 'v' stroke */}
        <line
          x1="60"
          y1="110"
          x2="78"
          y2="68"
          stroke="#262626"
          strokeWidth="4.5"
          strokeLinecap="square"
        />

        {/* Tall vertical 'k' stem */}
        <line
          x1="84"
          y1="32"
          x2="84"
          y2="110"
          stroke="#262626"
          strokeWidth="4.5"
          strokeLinecap="square"
        />
        {/* Upper diagonal arm of 'k' */}
        <line
          x1="86"
          y1="89"
          x2="111"
          y2="68"
          stroke="#262626"
          strokeWidth="4.5"
          strokeLinecap="square"
        />
        {/* Lower diagonal leg of 'k' */}
        <line
          x1="94"
          y1="80"
          x2="114"
          y2="110"
          stroke="#262626"
          strokeWidth="4.5"
          strokeLinecap="square"
        />

        {/* 'time' wordmark below monogram */}
        <text
          x="80"
          y="126"
          textAnchor="middle"
          fill="#454545"
          fontSize="17"
          fontFamily="Inter, Manrope, sans-serif"
          fontWeight="300"
          letterSpacing="4"
        >
          time
        </text>
      </svg>
    </Link>
  );
};

export default VkLogo;
