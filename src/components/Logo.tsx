import React from "react";

interface LogoProps {
  className?: string;
  size?: number; // width/height in px
  showText?: boolean;
  textClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = 120,
  showText = true,
  textClassName = "",
}) => {
  // Relative scaling based on user size
  const scale = size / 200;

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Icon portion */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_10px_15px_rgba(56,189,248,0.15)] transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Rounded background glass theme */}
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0e1b35" />
            <stop offset="100%" stopColor="#040814" />
          </radialGradient>

          {/* Gradients for letters and rings */}
          <linearGradient id="neonBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          <linearGradient id="neonOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="35%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          <linearGradient id="metallicGold" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fdba74" />
          </linearGradient>

          {/* Soft inner shadowing and metal borders */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer squircle body (app icon style) */}
        <rect
          x="1"
          y="1"
          width="198"
          height="198"
          rx="52"
          fill="url(#bgGrad)"
          stroke="#1e293b"
          strokeWidth="2.5"
        />

        {/* Inner concentric ring (Left Side Blue Arc) */}
        <path
          d="M 100 18 A 82 82 0 0 0 100 182"
          stroke="url(#neonBlue)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="250 8"
          opacity="0.85"
        />

        {/* Inner concentric ring (Right Side Orange Arc) */}
        <path
          d="M 100 182 A 82 82 0 0 0 100 18"
          stroke="url(#neonOrange)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="250 8"
          opacity="0.85"
        />

        {/* The combined Y-N lettermark center geometry */}
        <g id="lettermark" transform="translate(0, 3)" className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          {/* Metallic Cyan Blue "Y" Component */}
          {/* Formed elegantly as the left fork of Y and bottom stem */}
          <path
            d="M 43 56 
               H 74
               L 98 103
               L 110 82
               L 80 56
               H 112 
               L 125 76 
               L 95 125
               L 75 142
               L 59 142
               L 82 110
               Z"
            fill="url(#neonBlue)"
            stroke="#0c4a6e"
            strokeWidth="1.5"
          />

          {/* Golden Orange Metallic "N" Component */}
          {/* Forms the right hand diagonal and straight bars, separated by sharp slash */}
          <path
            d="M 152 56 
               H 122
               L 98 94
               L 87 114
               L 118 142
               H 86
               L 73 125
               L 62 142
               H 152
               V 112
               L 117 76
               V 56
               Z"
            fill="url(#neonOrange)"
            stroke="#7c2d12"
            strokeWidth="1.5"
          />

          {/* Overlay lighting slash/diagonal cuts */}
          <path
            d="M 60 141 L 140 59"
            stroke="#020617"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.95"
          />
          <path
            d="M 59 141 L 139 59"
            stroke="url(#metallicGold)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* Modern dual-color typography */}
      {showText && (
        <div
          className={`mt-3 font-display tracking-wider flex items-center justify-center font-bold text-center select-none ${textClassName}`}
          style={{ fontSize: `${scale * 28}px` }}
        >
          <span className="bg-gradient-to-r from-brand-blue to-sky-400 bg-clip-text text-transparent">
            YOUR
          </span>
          <span className="mx-2 bg-gradient-to-r from-orange-400 to-brand-orange bg-clip-text text-transparent">
            NEED
          </span>
        </div>
      )}
    </div>
  );
};
