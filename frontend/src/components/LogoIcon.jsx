import { useEffect, useRef } from "react";

/**
 * AnimatedLogoIcon — A fully CSS/SVG animated logo.
 * size: number (px) — outer size of the icon box
 */
export default function LogoIcon({ size = 52 }) {
  const s = size;
  const half = s / 2;
  const r1 = s * 0.38;   // outer ring radius
  const r2 = s * 0.24;   // inner ring radius
  const dotR = s * 0.045; // orbit dot radius

  return (
    <div
      style={{
        position: "relative",
        width: s,
        height: s,
        flexShrink: 0,
      }}
    >
      <style>{`
        @keyframes logo-spin-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes logo-spin-ccw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes logo-pulse {
          0%, 100% { opacity: 0.6; r: ${s * 0.14}px; }
          50%       { opacity: 1;   r: ${s * 0.17}px; }
        }
        @keyframes logo-node-blink {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1; }
        }
        @keyframes logo-glow {
          0%, 100% { filter: drop-shadow(0 0 ${s * 0.08}px #7c3aed88); }
          50%       { filter: drop-shadow(0 0 ${s * 0.16}px #a78bfacc); }
        }
      `}</style>

      <svg
        width={s}
        height={s}
        viewBox={`0 0 ${s} ${s}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: "logo-glow 2.4s ease-in-out infinite" }}
      >
        <defs>
          <radialGradient id="logo-bg-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#1e1040" />
            <stop offset="100%" stopColor="#0d0f1e" />
          </radialGradient>
          <linearGradient id="logo-ring1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="logo-ring2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="logo-text-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#e0d7ff" />
            <stop offset="100%" stopColor="#a5b4fc" />
          </linearGradient>
        </defs>

        {/* Background rounded rect */}
        <rect
          x="0" y="0" width={s} height={s}
          rx={s * 0.22}
          fill="url(#logo-bg-grad)"
          stroke="rgba(124,58,237,0.45)"
          strokeWidth={s * 0.025}
        />

        {/* Outer spinning ring (clockwise, dashed) */}
        <g style={{ transformOrigin: `${half}px ${half}px`, animation: "logo-spin-cw 4s linear infinite" }}>
          <circle
            cx={half} cy={half} r={r1}
            stroke="url(#logo-ring1)"
            strokeWidth={s * 0.028}
            strokeDasharray={`${r1 * 0.6} ${r1 * 0.4}`}
            fill="none"
          />
          {/* Orbit dot on outer ring */}
          <circle
            cx={half} cy={half - r1}
            r={dotR}
            fill="#a78bfa"
          />
        </g>

        {/* Inner spinning ring (counter-clockwise) */}
        <g style={{ transformOrigin: `${half}px ${half}px`, animation: "logo-spin-ccw 2.8s linear infinite" }}>
          <circle
            cx={half} cy={half} r={r2}
            stroke="url(#logo-ring2)"
            strokeWidth={s * 0.022}
            strokeDasharray={`${r2 * 0.5} ${r2 * 0.5}`}
            fill="none"
          />
          {/* Orbit dot on inner ring */}
          <circle
            cx={half} cy={half - r2}
            r={dotR * 0.85}
            fill="#38bdf8"
          />
        </g>

        {/* Neural network nodes — 3 dots arranged in triangle */}
        {[0, 120, 240].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const nr = s * 0.155;
          const nx = half + nr * Math.sin(rad);
          const ny = half - nr * Math.cos(rad);
          return (
            <circle
              key={i}
              cx={nx} cy={ny}
              r={dotR * 0.7}
              fill="#c4b5fd"
              style={{
                animation: `logo-node-blink 1.6s ease-in-out ${i * 0.5}s infinite`,
              }}
            />
          );
        })}

        {/* Connector lines between nodes */}
        {[[0, 120], [120, 240], [240, 0]].map(([a, b], i) => {
          const nr = s * 0.155;
          const ax = half + nr * Math.sin((a * Math.PI) / 180);
          const ay = half - nr * Math.cos((a * Math.PI) / 180);
          const bx = half + nr * Math.sin((b * Math.PI) / 180);
          const by = half - nr * Math.cos((b * Math.PI) / 180);
          return (
            <line
              key={i}
              x1={ax} y1={ay} x2={bx} y2={by}
              stroke="rgba(167,139,250,0.3)"
              strokeWidth={s * 0.016}
            />
          );
        })}

        {/* Center pulsing core */}
        <circle
          cx={half} cy={half}
          r={s * 0.14}
          fill="rgba(124,58,237,0.18)"
          style={{ animation: `logo-pulse 1.8s ease-in-out infinite` }}
        />
        <circle
          cx={half} cy={half}
          r={s * 0.09}
          fill="rgba(124,58,237,0.55)"
        />

        {/* "AI" text in center */}
        <text
          x={half} y={half + s * 0.045}
          textAnchor="middle"
          fill="url(#logo-text-grad)"
          fontSize={s * 0.22}
          fontWeight="800"
          fontFamily="'Inter', system-ui, sans-serif"
          letterSpacing="-0.5"
        >
          AI
        </text>
      </svg>
    </div>
  );
}
