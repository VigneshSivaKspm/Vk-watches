import React from 'react';
import { Link } from 'react-router-dom';

interface VkLogoProps {
  variant?: 'monogram' | 'full' | 'stacked' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  useImage?: boolean;
}

export const VkLogo: React.FC<VkLogoProps> = ({
  size = 'md',
  className = '',
  useImage = true,
}) => {
  const sizeMap = {
    sm: { height: 32 },
    md: { height: 42 },
    lg: { height: 54 },
    xl: { height: 84 },
  };

  const currentSize = sizeMap[size];

  if (useImage) {
    // Renders the official VK TIME logo from public/android-chrome-512x512.png
    // cropped tightly to its natural artwork bounds (120..384 x 88..410)
    // with multiply blending so its white canvas sits seamlessly on ivory/white.
    return (
      <Link
        to="/"
        aria-label="VK TIME - Return to homepage"
        className={`inline-flex items-center justify-center group select-none ${className}`}
      >
        <svg
          height={currentSize.height}
          viewBox="120 88 264 322"
          xmlns="http://www.w3.org/2000/svg"
          style={{ mixBlendMode: 'multiply' }}
          className="w-auto transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          role="img"
          aria-label="VK TIME"
        >
          <image href="/android-chrome-512x512.png" x="0" y="0" width="512" height="512" />
        </svg>
      </Link>
    );
  }

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
        className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      >
        <defs>
          <linearGradient id="vkLogoStrokeGrad" x1="36" y1="70" x2="116" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#03F008" />
            <stop offset="35%" stopColor="#02D2C1" />
            <stop offset="68%" stopColor="#0299F7" />
            <stop offset="100%" stopColor="#0241FC" />
          </linearGradient>
        </defs>
        <line x1="38" y1="68" x2="60" y2="110" stroke="url(#vkLogoStrokeGrad)" strokeWidth="4.5" strokeLinecap="square" />
        <line x1="60" y1="110" x2="78" y2="68" stroke="url(#vkLogoStrokeGrad)" strokeWidth="4.5" strokeLinecap="square" />
        <line x1="84" y1="32" x2="84" y2="110" stroke="url(#vkLogoStrokeGrad)" strokeWidth="4.5" strokeLinecap="square" />
        <line x1="86" y1="89" x2="111" y2="68" stroke="url(#vkLogoStrokeGrad)" strokeWidth="4.5" strokeLinecap="square" />
        <line x1="94" y1="80" x2="114" y2="110" stroke="url(#vkLogoStrokeGrad)" strokeWidth="4.5" strokeLinecap="square" />
        <text
          x="80"
          y="126"
          textAnchor="middle"
          fill="url(#vkLogoStrokeGrad)"
          fontSize="17"
          fontFamily="Inter, Manrope, sans-serif"
          fontWeight="400"
          letterSpacing="4"
        >
          time
        </text>
      </svg>
    </Link>
  );
};

export default VkLogo;
