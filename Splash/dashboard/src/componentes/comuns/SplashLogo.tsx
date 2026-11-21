import React from 'react';
import splashImg from '../../recursos/imagens/splash_logo_1790712176973.jpg';

interface SplashLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  useImage?: boolean;
}

export const SplashLogo: React.FC<SplashLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  useImage = false
}) => {
  const containerDimensions = {
    sm: 'w-20',
    md: 'w-32',
    lg: 'w-44',
    xl: 'w-56'
  };

  const imageSizes = {
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-36',
    xl: 'h-48'
  };

  if (useImage) {
    return (
      <div className={`flex flex-col items-center justify-center select-none ${className}`}>
        <img
          src={splashImg}
          alt="Splash ESTD 2026"
          className={`${imageSizes[size]} w-auto object-contain rounded-2xl shadow-xl`}
        />
      </div>
    );
  }

  // Pure SVG vector version identical to Splash_Preta.jpeg
  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${containerDimensions[size]} ${className}`}>
      <svg
        viewBox="0 0 120 135"
        className="w-full h-auto drop-shadow-[0_10px_20px_rgba(43,166,226,0.3)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="splashDropGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#2ba6e2" />
            <stop offset="100%" stopColor="#015486" />
          </linearGradient>
          <linearGradient id="splashDropGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#99d6ee" />
            <stop offset="70%" stopColor="#2ba6e2" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* 3-Petal Stylized Droplet Flame */}
        <g transform="translate(60, 48)">
          {/* Left curved wing reaching to the sharp top tip */}
          <path
            d="M -3 -46 C -1 -43, -15 -25, -24 -6 C -31 8, -28 26, -14 36 C -4 43, 6 42, 6 42 C 0 38, -6 32, -9 22 C -13 9, -5 -8, 2 -24 C 6 -32, 2 -42, -3 -46 Z"
            fill="url(#splashDropGrad1)"
          />

          {/* Central flowing droplet body */}
          <path
            d="M -2 -46 C 4 -38, 12 -26, 12 -12 C 12 4, 3 16, -4 28 C -7 34, -5 39, 4 39 C 14 39, 24 30, 24 16 C 24 0, 10 -20, 2 -34 C -1 -38, -2 -42, -2 -46 Z"
            fill="url(#splashDropGrad2)"
          />

          {/* Right teardrop bulb finishing the contour */}
          <path
            d="M 6 -12 C 16 0, 27 10, 27 24 C 27 38, 14 46, 2 45 C 10 43, 16 35, 16 25 C 16 13, 8 2, 6 -12 Z"
            fill="#2ba6e2"
          />
        </g>

        {/* Text 'SPLASH' */}
        <text
          x="60"
          y="114"
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="20"
          fontWeight="900"
          letterSpacing="1.5"
          fill="#FFFFFF"
        >
          SPLASH
        </text>

        {/* Text 'ESTD 2026' */}
        {showSubtitle && (
          <text
            x="60"
            y="128"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="7"
            fontWeight="600"
            letterSpacing="3"
            fill="#FFFFFF"
            opacity="0.85"
          >
            ESTD 2026
          </text>
        )}
      </svg>
    </div>
  );
};
