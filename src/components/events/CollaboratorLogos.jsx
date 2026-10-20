import React from 'react';

/**
 * Google for Developers Official Vector Logo (Monochrome Minimalist)
 */
export function GoogleDevelopersLogoSvg({ className = "w-full h-12" }) {
  return (
    <svg
      viewBox="0 0 280 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Google for Developers Logo"
    >
      {/* Google Developers Chevrons Symbol */}
      <g transform="translate(6, 6) scale(0.68)">
        {/* Left Chevron < */}
        <path
          d="M34 8L10 35C8.8 36.4 8.8 38.6 10 40L34 67H22L1 41C-0.3 39.3 -0.3 35.7 1 34L22 8H34Z"
          fill="currentColor"
          className="text-white"
        />
        {/* Center Accent Slash */}
        <path
          d="M48 6L32 68H42L58 6H48Z"
          fill="currentColor"
          className="text-zinc-400"
        />
        {/* Right Chevron > */}
        <path
          d="M56 8L80 35C81.2 36.4 81.2 38.6 80 40L56 67H68L89 41C90.3 39.3 90.3 35.7 89 34L68 8H56Z"
          fill="currentColor"
          className="text-white"
        />
      </g>

      {/* Google Wordmark */}
      <text
        x="78"
        y="26"
        fill="currentColor"
        className="text-white font-bold"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '20px',
          fontWeight: 700,
          letterSpacing: '-0.3px'
        }}
      >
        Google
      </text>

      {/* for Developers Subtitle */}
      <text
        x="78"
        y="45"
        fill="currentColor"
        className="text-zinc-400 font-medium"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.4px'
        }}
      >
        for Developers
      </text>
    </svg>
  );
}

/**
 * Hack2skill Official Vector Logo (Monochrome Minimalist)
 */
export function Hack2skillLogoSvg({ className = "w-full h-12" }) {
  return (
    <svg
      viewBox="0 0 260 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Hack2skill Logo"
    >
      {/* H2S Terminal / Code Icon Badge */}
      <g transform="translate(6, 10)">
        <rect
          x="0"
          y="0"
          width="40"
          height="40"
          rx="10"
          className="text-zinc-800"
          fill="currentColor"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
        />
        {/* Code brackets and bolt */}
        <path
          d="M12 15L7 20L12 25"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 15L33 20L28 25"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 13L17 27"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* "hack" text */}
      <text
        x="58"
        y="37"
        fill="currentColor"
        className="text-zinc-200"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '22px',
          fontWeight: 600,
          letterSpacing: '-0.2px'
        }}
      >
        hack
      </text>

      {/* "2" badge */}
      <g transform="translate(108, 16)">
        <rect
          x="0"
          y="0"
          width="24"
          height="25"
          rx="6"
          fill="white"
        />
        <text
          x="12"
          y="18"
          textAnchor="middle"
          fill="black"
          style={{
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '17px',
            fontWeight: 800
          }}
        >
          2
        </text>
      </g>

      {/* "skill" text */}
      <text
        x="138"
        y="37"
        fill="currentColor"
        className="text-white"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '22px',
          fontWeight: 700,
          letterSpacing: '-0.2px'
        }}
      >
        skill
      </text>
    </svg>
  );
}

/**
 * KIET Group of Institutions Official Vector Logo (Monochrome Minimalist)
 */
export function KietLogoSvg({ className = "w-full h-12" }) {
  return (
    <svg
      viewBox="0 0 290 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="KIET Group of Institutions Logo"
    >
      {/* Circular Academic Crest Emblem */}
      <g transform="translate(6, 7)">
        {/* Outer Ring */}
        <circle
          cx="23"
          cy="23"
          r="21"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeDasharray="3 2"
          className="text-zinc-400"
        />
        <circle
          cx="23"
          cy="23"
          r="17"
          stroke="white"
          strokeWidth="1.5"
          fill="rgba(255,255,255,0.05)"
        />
        {/* Torch / Flame & Book inside crest */}
        <path
          d="M23 12C21.5 14 20.5 16 21.5 18C22.2 19.4 23.8 19.4 24.5 18C25.5 16 24.5 14 23 12Z"
          fill="white"
        />
        <path
          d="M21 20H25V24H21V20Z"
          fill="white"
        />
        <path
          d="M14 28C17 26 21 26 23 27C25 26 29 26 32 28V31C29 29 25 29 23 30C21 29 17 29 14 31V28Z"
          fill="white"
        />
      </g>

      {/* "KIET" Bold Title */}
      <text
        x="62"
        y="28"
        fill="currentColor"
        className="text-white"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '22px',
          fontWeight: 800,
          letterSpacing: '1px'
        }}
      >
        KIET
      </text>

      {/* "GROUP OF INSTITUTIONS" */}
      <text
        x="62"
        y="45"
        fill="currentColor"
        className="text-zinc-400"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '1.2px'
        }}
      >
        GROUP OF INSTITUTIONS
      </text>
    </svg>
  );
}
