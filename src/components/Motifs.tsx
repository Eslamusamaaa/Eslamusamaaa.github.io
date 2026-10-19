import type { Project } from "../data";

/** Deterministic waveform envelope used everywhere the voice motif appears. */
export function wavePath(width: number, height: number, points = 120, cycles = 9) {
  const mid = height / 2;
  let d = `M 0 ${mid}`;
  for (let i = 1; i <= points; i++) {
    const t = i / points;
    const envelope = 0.18 + 0.82 * Math.pow(Math.sin(Math.PI * t), 1.2) * (0.55 + 0.45 * Math.sin(t * Math.PI * 3.2));
    const y = mid + Math.sin(t * Math.PI * 2 * cycles) * envelope * (height * 0.46);
    d += ` L ${(t * width).toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

/** The signature line: hero, section dividers and the loader all use this. */
export function Waveform({ className = "", height = 64, width = 1200, cycles = 9 }: { className?: string; height?: number; width?: number; cycles?: number }) {
  return (
    <svg className={`waveform ${className}`} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d={wavePath(width, height, 160, cycles)} />
    </svg>
  );
}

/** Bars that animate while audio plays (hero "Hear it" control). */
export function Bars({ count = 18 }: { count?: number }) {
  return (
    <span className="bars" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <i key={i} style={{ ["--h" as string]: (0.35 + 0.65 * Math.abs(Math.sin(i * 1.7))).toFixed(2), ["--d" as string]: `${(i % 6) * 70}ms` }} />
      ))}
    </span>
  );
}

/** One small illustration per project type. Decorative only. */
export function Motif({ type }: { type: Project["motif"] }) {
  const common = { viewBox: "0 0 120 72", "aria-hidden": true, focusable: false, className: `motif motif-${type}` } as const;
  switch (type) {
    case "wave":
      return (
        <svg {...common}>
          {Array.from({ length: 15 }, (_, i) => {
            const h = 10 + 46 * Math.abs(Math.sin(i * 0.9 + 0.4)) * Math.sin(((i + 0.5) / 15) * Math.PI);
            return <rect key={i} className="mbar" x={6 + i * 7.4} y={36 - h / 2} width="3.6" height={h} rx="1.8" style={{ ["--d" as string]: `${i * 45}ms` }} />;
          })}
        </svg>
      );
    case "scan":
      return (
        <svg {...common}>
          <ellipse cx="60" cy="36" rx="44" ry="30" className="mline" />
          <path d="M40 22c-9 6-11 22-3 30 6 6 14 2 15-6 1-9-2-19-12-24Zm40 0c9 6 11 22 3 30-6 6-14 2-15-6-1-9 2-19 12-24Z" className="mfill" />
          <circle cx="75" cy="40" r="3" className="mdot" />
          <line x1="14" x2="106" y1="36" y2="36" className="mscan" />
        </svg>
      );
    case "tokens":
      return (
        <svg {...common}>
          {[0, 1, 2].map((r) =>
            Array.from({ length: 5 - r }, (_, i) => (
              <rect key={`${r}-${i}`} x={8 + i * 21 + r * 6} y={12 + r * 18} width={15 + ((i + r) % 3) * 3} height="10" rx="3" className={(i + r) % 4 === 0 ? "mfill-strong" : "mfill"} />
            ))
          )}
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <rect x="8" y="8" width="64" height="20" rx="8" className="mfill" />
          <rect x="44" y="34" width="68" height="20" rx="8" className="mfill-strong" />
          <rect x="8" y="58" width="22" height="9" rx="4.5" className="mline" />
          <rect x="34" y="58" width="22" height="9" rx="4.5" className="mline" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x={10 + (i % 4) * 26} y={10 + Math.floor(i / 4) * 28} width="20" height="22" rx="4" className={i === 5 ? "mfill-strong" : "mline"} />
          ))}
        </svg>
      );
    case "graph":
      return (
        <svg {...common}>
          <path d="M20 50 L50 20 L82 34 L100 14 M50 20 L60 56 L82 34" className="mline" />
          {[
            [20, 50],
            [50, 20],
            [82, 34],
            [100, 14],
            [60, 56],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 2 ? 6 : 4.5} className={i === 2 ? "mfill-strong" : "mfill"} />
          ))}
        </svg>
      );
  }
}
