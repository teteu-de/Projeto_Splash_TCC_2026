
import React from 'react';
import artemImg from '../../recursos/imagens/logo_artem_1790712162130.jpg';

interface ArtemLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showImage?: boolean;
  theme?: 'light' | 'dark';
}

export const ArtemLogo: React.FC<ArtemLogoProps> = ({
  className = '',
  size = 'md',
  showImage = false,
  theme = 'dark'
}) => {
  const heightClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12'
  };

  if (showImage) {
    return (
      <img
        src={artemImg}
        alt="Artem"
        className={`${heightClasses[size]} w-auto object-contain rounded-lg ${className}`}
      />
    );
  }

  const corAr = theme === 'dark' ? '#FFFFFF' : '#38BDF8';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 160 56"
        className={`${heightClasses[size]} w-auto`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Artem"
      >
        <g transform="translate(68, 4)">
          <path
            d="M 6 16 C 18 12, 28 20, 42 16 C 54 13, 64 8, 70 5"
            stroke="#99d6ee"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M 2 13 C 16 8, 28 17, 44 12 C 54 9, 62 5, 68 0 C 69 4, 66 9, 58 13 C 44 18, 30 11, 14 13 Z"
            fill="#2ba6e2"
          />
        </g>

        <text
          x="4"
          y="46"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="38"
          fontWeight="800"
          letterSpacing="-0.5"
        >
          <tspan fill={corAr}>Ar</tspan>
          <tspan fill="#2ba6e2">tem</tspan>
        </text>
      </svg>
    </div>
  );
};
