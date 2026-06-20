import { useMemo, RefObject } from "react";

interface WarpLine {
  angle: number;
  length: number;
  opacity: number;
  thickness: number;
}

export function Cockpit({ warpRef }: { warpRef: RefObject<HTMLDivElement | null> }) {
  const lines = useMemo<WarpLine[]>(() => {
    return Array.from({ length: 64 }).map((_, i) => ({
      angle: (i / 64) * 360 + (Math.random() - 0.5) * 5,
      length: 40 + Math.random() * 50,
      opacity: 0.25 + Math.random() * 0.6,
      thickness: Math.random() > 0.8 ? 2 : 1,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-40 overflow-hidden pointer-events-none">
      {/* Warp / star streaks emanating from the vanishing point */}
      <div
        ref={warpRef}
        className="absolute inset-0 opacity-0"
        style={{ transformOrigin: "50% 46%", willChange: "opacity, transform" }}
      >
        {lines.map((l, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-[46%] origin-left"
            style={{
              height: `${l.thickness}px`,
              width: `${l.length}vmax`,
              transform: `rotate(${l.angle}deg)`,
              opacity: l.opacity,
              background:
                "linear-gradient(90deg, rgba(190,225,255,0) 0%, rgba(190,225,255,0) 45%, rgba(190,225,255,0.5) 80%, rgba(225,240,255,0.95) 100%)",
            }}
          />
        ))}
      </div>

      {/* Window vignette — frames the view like looking through glass */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 260px 70px rgba(2,3,12,0.92)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 100% at 50% 38%, transparent 52%, rgba(2,3,12,0.45) 78%, rgba(2,3,12,0.85) 100%)",
        }}
      />

      {/* Faint glass reflection across the canopy */}
      <div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{
          background:
            "linear-gradient(160deg, rgba(120,180,220,0.06) 0%, transparent 35%)",
        }}
      />

      {/* HUD corner brackets */}
      <HudCorner className="top-6 left-6" />
      <HudCorner className="top-6 right-6 scale-x-[-1]" />
      <HudCorner className="bottom-[30vh] left-6 scale-y-[-1]" />
      <HudCorner className="bottom-[30vh] right-6 -scale-100" />

      {/* Dashboard silhouette */}
      <div className="absolute inset-x-0 bottom-0 h-[32vh]">
        <svg
          viewBox="0 0 1440 420"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="dash" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0e1a" stopOpacity="0.65" />
              <stop offset="22%" stopColor="#0a0e1a" stopOpacity="0.96" />
              <stop offset="100%" stopColor="#04060e" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(120,200,225,0.55)" />
              <stop offset="100%" stopColor="rgba(120,200,225,0)" />
            </linearGradient>
          </defs>

          {/* Concave dashboard top edge — opens up the view in the centre */}
          <path
            d="M0,420 L0,180 C260,150 480,110 720,108 C960,110 1180,150 1440,180 L1440,420 Z"
            fill="url(#dash)"
          />
          {/* Glowing rim line along the dashboard edge */}
          <path
            d="M0,180 C260,150 480,110 720,108 C960,110 1180,150 1440,180"
            fill="none"
            stroke="url(#rim)"
            strokeWidth="2"
          />
          <path
            d="M0,180 C260,150 480,110 720,108 C960,110 1180,150 1440,180"
            fill="none"
            stroke="rgba(150,220,240,0.5)"
            strokeWidth="1"
          />

          {/* Left gauge cluster */}
          <g
            stroke="rgba(140,210,235,0.45)"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M150,300 A60,60 0 0 1 270,300" />
            <path d="M168,300 A42,42 0 0 1 252,300" strokeOpacity="0.4" />
            <line x1="210" y1="300" x2="180" y2="262" strokeOpacity="0.8" />
          </g>
          {/* Right gauge cluster */}
          <g
            stroke="rgba(140,210,235,0.45)"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M1170,300 A60,60 0 0 1 1290,300" />
            <path d="M1188,300 A42,42 0 0 1 1272,300" strokeOpacity="0.4" />
            <line x1="1230" y1="300" x2="1262" y2="266" strokeOpacity="0.8" />
          </g>

          {/* Centre indicator ticks */}
          <g fill="rgba(150,220,240,0.5)">
            {Array.from({ length: 9 }).map((_, i) => (
              <rect
                key={i}
                x={660 + i * 15}
                y={250 + (i === 4 ? -6 : 0)}
                width="3"
                height={i === 4 ? 18 : 10}
                rx="1.5"
              />
            ))}
          </g>
        </svg>

        {/* Blinking status dots */}
        <div className="absolute left-[14%] bottom-[18%] flex gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80 shadow-[0_0_8px_2px_rgba(110,231,183,0.6)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-300/70" />
        </div>
        <div className="absolute right-[14%] bottom-[18%] font-mono text-[9px] uppercase tracking-[0.3em] text-accent/60">
          Nav · Online
        </div>
      </div>
    </div>
  );
}

function HudCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute h-10 w-10 text-accent/40 ${className}`}
      viewBox="0 0 40 40"
      fill="none"
    >
      <path
        d="M2,14 L2,2 L14,2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
