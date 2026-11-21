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

/** One small illustration per project, each unique and drawn from what the project does. Decorative only. */
export function Motif({ type }: { type: Project["motif"] }) {
  const common = { viewBox: "0 0 120 72", "aria-hidden": true, focusable: false, className: `motif motif-${type}` } as const;
  switch (type) {
    // Rashihli: a quiz with one option chosen, leading to ranked product picks.
    case "quiz":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="52" height="60" rx="9" className="mline" />
          <path d="M14 17 H38" className="mtxt" />
          <rect x="14" y="26" width="36" height="9" rx="4.5" className="mfill" />
          <rect x="14" y="39" width="36" height="9" rx="4.5" className="mfill-strong" />
          <rect x="14" y="52" width="36" height="9" rx="4.5" className="mline" />
          <path d="M64 36 H80 M75 31 L80 36 L75 41" className="ms" />
          <rect x="86" y="8" width="28" height="26" rx="7" className="mfill" />
          <path d="M100 14.5 L102.2 19 L107 19.6 L103.5 23 L104.4 27.8 L100 25.5 L95.6 27.8 L96.5 23 L93 19.6 L97.8 19Z" className="mfill-strong" />
          <rect x="86" y="40" width="28" height="22" rx="7" className="mline" />
          <path d="M93 51 H107 M93 56 H101" className="mtxt" />
        </svg>
      );
    // Meeting assistant: a call window with attendees, the active speaker and a transcript strip.
    case "meeting":
      return (
        <svg {...common}>
          <rect x="6" y="6" width="108" height="60" rx="9" className="mline" />
          <circle cx="14" cy="12" r="1.6" className="mdot" />
          <circle cx="20" cy="12" r="1.6" className="mdim" />
          {[14, 47, 80].map((x, i) => (
            <g key={x}>
              <rect x={x} y="18" width="26" height="24" rx="6" className={i === 1 ? "mfill-strong" : "mfill"} />
              <circle cx={x + 13} cy="27" r="4.2" className="mbg" />
              <path d={`M${x + 6} 39 Q${x + 13} 31 ${x + 20} 39`} className="mbg-line" />
            </g>
          ))}
          {Array.from({ length: 24 }, (_, i) => {
            const h = 3 + 10 * Math.abs(Math.sin(i * 0.8 + 0.5)) * Math.sin(((i + 0.5) / 24) * Math.PI);
            return <rect key={i} x={14 + i * 3.8} y={55 - h / 2} width="2" height={h} rx="1" className={i > 9 && i < 15 ? "mbar" : "mdim"} />;
          })}
        </svg>
      );
    // WhatsApp chatbots: bot bubble, customer bubble, quick-reply buttons, a voice note and a photo.
    case "chat":
      return (
        <svg {...common}>
          <path d="M16 6 H58 A8 8 0 0 1 66 14 V22 A8 8 0 0 1 58 30 H24 L14 36 V14 A8 8 0 0 1 16 6Z" className="mfill" />
          <path d="M24 14 H54 M24 22 H44" className="mtxt" />
          <rect x="52" y="35" width="62" height="14" rx="7" className="mfill-strong" />
          <rect x="6" y="54" width="25" height="11" rx="5.5" className="mline" />
          <rect x="35" y="54" width="25" height="11" rx="5.5" className="mline" />
          <circle cx="79" cy="59.5" r="7" className="mline" />
          <rect x="77" y="55" width="4" height="8" rx="2" className="mdot" />
          <rect x="94" y="53" width="20" height="13" rx="3.5" className="mline" />
          <path d="M97 63 L102 58 L106 62 L109 59.5 L112 63" className="ma" />
        </svg>
      );
    // Voice assistants: a microphone with sound radiating either side.
    case "mic":
      return (
        <svg {...common}>
          <rect x="51" y="8" width="18" height="32" rx="9" className="mfill-strong" />
          <path d="M43 31 A17 17 0 0 0 77 31" className="ms" />
          <path d="M60 48 V58 M51 60 H69" className="ms" />
          <path d="M37 17 Q31 27 37 37" className="ma" />
          <path d="M28 10 Q19 27 28 44" className="ma faint" />
          <path d="M83 17 Q89 27 83 37" className="ma" />
          <path d="M92 10 Q101 27 92 44" className="ma faint" />
          <circle cx="14" cy="27" r="2" className="mdot" />
          <circle cx="106" cy="27" r="2" className="mdot" />
        </svg>
      );
    // Voice calling: a handset placing a call that ends in a confirmed order.
    case "call":
      return (
        <svg {...common}>
          <g transform="translate(6 12) scale(1.95)">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" className="mfill" />
          </g>
          <path d="M54 22 Q62 32 54 42" className="ma" />
          <path d="M61 15 Q73 32 61 49" className="ma faint" />
          <rect x="82" y="10" width="32" height="52" rx="7" className="mline" />
          <path d="M89 21 H107 M89 28 H102" className="mtxt" />
          <circle cx="98" cy="46" r="8" className="mfill-strong" />
          <path d="M94 46 L97 49 L102.5 43" className="mcheck" />
        </svg>
      );
    // Media buying: ad spend feeding a rising return, with a ROAS gauge.
    case "analytics":
      return (
        <svg {...common}>
          <line x1="6" x2="70" y1="62" y2="62" className="mnet" />
          {[
            [10, 14],
            [24, 22],
            [38, 18],
            [52, 32],
          ].map(([x, h], i) => (
            <rect key={x} x={x} y={62 - h} width="9" height={h} rx="2.5" className={i === 3 ? "mfill-strong" : "mfill"} />
          ))}
          <path d="M14 44 L28 36 L42 40 L57 22" className="ms" />
          <circle cx="57" cy="22" r="3" className="mdot" />
          <circle cx="94" cy="26" r="15" className="mline" />
          <circle cx="94" cy="26" r="15" className="mgauge" />
          <path d="M94 26 L103 18" className="ms" />
          <circle cx="94" cy="26" r="2.4" className="mdot" />
          <path d="M80 54 H108 M86 61 H102" className="mtxt" />
        </svg>
      );
    case "volley":
      return (
        <svg {...common}>
          {/* net, post and floor */}
          <line x1="60" x2="60" y1="24" y2="68" className="mnet" />
          <path d="M54 26 H66 M54 32 H66 M54 38 H66 M56 24 V42 M60 24 V42 M64 24 V42" className="mnet" />
          <line x1="8" x2="112" y1="68" y2="68" className="mnet" />
          {/* left player, jumping to spike */}
          <circle cx="34" cy="22" r="5" className="mfill-strong" />
          <path d="M34 28 L36 44 M36 44 L29 56 M36 44 L43 54 M35 32 L46 16 M35 32 L26 38" className="mline" />
          {/* right player, blocking */}
          <circle cx="88" cy="26" r="5" className="mfill-strong" />
          <path d="M88 32 L87 46 M87 46 L82 62 M87 46 L94 62 M88 35 L79 18 M88 35 L96 20" className="mline" />
          {/* ball */}
          <circle cx="56" cy="9" r="4.5" className="mfill-strong" />
        </svg>
      );
    case "assess":
      return (
        <svg {...common}>
          {/* three informants: parent, teacher, specialist */}
          {[14, 36, 58].map((y) => (
            <circle key={y} cx="12" cy={y} r="5" className="mfill" />
          ))}
          <path d="M18 14 L40 30 M18 36 L40 36 M18 58 L40 42" className="mline" />
          {/* rule-based domain scores */}
          {[
            [42, 22],
            [54, 38],
            [66, 28],
          ].map(([x, h], i) => (
            <rect key={x} x={x} y={62 - h} width="8" height={h} rx="2.5" className={i === 1 ? "mfill-strong" : "mfill"} />
          ))}
          <line x1="40" x2="78" y1="62" y2="62" className="mnet" />
          <path d="M78 36 H86" className="mline" />
          {/* the report a specialist signs off */}
          <rect x="88" y="10" width="26" height="52" rx="5" className="mline" />
          <path d="M94 22 H108 M94 29 H108 M94 36 H104" className="mline" />
          <path d="M95 49 L100 54 L108 44" className="mcheck" />
        </svg>
      );
    // Elara-TTS: right-to-left Arabic text becoming a waveform.
    case "speech":
      return (
        <svg {...common}>
          {[
            [16, 38],
            [26, 30],
            [36, 36],
            [46, 22],
            [56, 32],
          ].map(([y, w]) => (
            <path key={y} d={`M${48 - w} ${y} H48`} className="mtxt" />
          ))}
          <path d="M54 36 H64 M59 31 L64 36 L59 41" className="ms" />
          {Array.from({ length: 11 }, (_, i) => {
            const h = 8 + 36 * Math.abs(Math.sin(i * 0.95 + 0.3)) * Math.sin(((i + 0.5) / 11) * Math.PI);
            return <rect key={i} x={70 + i * 4.4} y={36 - h / 2} width="2.8" height={h} rx="1.4" className={i === 5 ? "mbar" : "mbar soft"} />;
          })}
        </svg>
      );
    // LUNA16: a CT slice of the lungs with the nodule found and boxed.
    case "scan":
      return (
        <svg {...common}>
          <ellipse cx="60" cy="36" rx="44" ry="30" className="mline" />
          <path d="M40 22c-9 6-11 22-3 30 6 6 14 2 15-6 1-9-2-19-12-24Zm40 0c9 6 11 22 3 30-6 6-14 2-15-6-1-9 2-19 12-24Z" className="mfill" />
          <circle cx="76" cy="40" r="3" className="mdot" />
          <path d="M69 35 V32 H72 M80 32 H83 V35 M83 45 V48 H80 M72 48 H69 V45" className="ms" />
          <line x1="14" x2="106" y1="36" y2="36" className="mscan" />
        </svg>
      );
    // Arabic medical LLM: a medical answer bubble, with the model's tokens beside it.
    case "medllm":
      return (
        <svg {...common}>
          <path d="M20 6 H62 A10 10 0 0 1 72 16 V38 A10 10 0 0 1 62 48 H30 L18 58 V16 A10 10 0 0 1 20 6Z" className="mfill" />
          <path d="M45 16 V38 M34 27 H56" className="mcross" />
          <rect x="80" y="8" width="32" height="9" rx="3.5" className="mfill" />
          <rect x="80" y="22" width="24" height="9" rx="3.5" className="mfill-strong" />
          <rect x="80" y="36" width="32" height="9" rx="3.5" className="mline" />
          <rect x="80" y="50" width="18" height="9" rx="3.5" className="mfill" />
          <path d="M6 66 H72" className="mnet" />
        </svg>
      );
    // Elara ecosystem: four modules orbiting one learning product.
    case "ecosystem":
      return (
        <svg {...common}>
          <path d="M60 36 L23 19 M60 36 L97 19 M60 36 L23 53 M60 36 L97 53" className="mline" />
          <circle cx="60" cy="36" r="10" className="mfill-strong" />
          <rect x="8" y="6" width="30" height="26" rx="7" className="mfill" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={14 + i * 6} y={19 - [4, 8, 5, 3][i] / 2 + 2} width="3" height={[4, 8, 5, 3][i] + 4} rx="1.5" className="mbar" />
          ))}
          <rect x="82" y="6" width="30" height="26" rx="7" className="mline" />
          <path d="M91 19.5 L96 24.5 L104 14" className="mcheck thin" />
          <rect x="8" y="40" width="30" height="26" rx="7" className="mline" />
          <path d="M15 48 H31 M15 53 H31 M15 58 H25" className="mtxt thin" />
          <rect x="82" y="40" width="30" height="26" rx="7" className="mfill" />
          <path d="M89 60 V54 M96 60 V48 M103 60 V51" className="ms thick" />
        </svg>
      );
    // Building energy twin: a building, its consumption bolt and a forecast curve.
    case "energy":
      return (
        <svg {...common}>
          <rect x="10" y="12" width="36" height="52" rx="4" className="mline" />
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={16 + (i % 3) * 10} y={18 + Math.floor(i / 3) * 11} width="6" height="7" rx="1.5" className={[1, 4, 5, 8, 10].includes(i) ? "mfill-strong" : "mfill"} />
          ))}
          <path d="M82 6 L66 36 H79 L71 62 L98 26 H84 L92 6Z" className="mfill-strong" />
          <path d="M54 62 C70 62 80 54 92 44 C100 38 106 40 114 30" className="ma dash" />
          <line x1="50" x2="114" y1="66" y2="66" className="mnet" />
        </svg>
      );
    // News topics: one article sorted into four categories.
    case "topics":
      return (
        <svg {...common}>
          <rect x="6" y="8" width="36" height="56" rx="6" className="mline" />
          <path d="M13 18 H35 M13 25 H35 M13 32 H29 M13 39 H35 M13 46 H25" className="mtxt" />
          <path d="M44 36 C58 36 58 14 72 14 M44 36 C58 36 58 27 72 27 M44 36 C58 36 58 45 72 45 M44 36 C58 36 58 58 72 58" className="mline" />
          <rect x="72" y="8" width="42" height="12" rx="6" className="mfill" />
          <rect x="72" y="22" width="42" height="12" rx="6" className="mfill-strong" />
          <rect x="72" y="40" width="42" height="12" rx="6" className="mline" />
          <rect x="72" y="54" width="42" height="12" rx="6" className="mfill" />
        </svg>
      );
    // Equipment failure: a machine gear beside a sensor trace crossing its threshold.
    case "gear":
      return (
        <svg {...common}>
          <g transform="translate(36 36)">
            {Array.from({ length: 8 }, (_, i) => (
              <rect key={i} x="-4" y="-27" width="8" height="9" rx="2" transform={`rotate(${i * 45})`} className="mfill" />
            ))}
            <circle r="19" className="mfill" />
            <circle r="7" className="mfill-strong" />
          </g>
          <line x1="70" x2="114" y1="26" y2="26" className="mdashline" />
          <path d="M70 52 L78 46 L86 50 L94 36 L102 20 L112 14" className="ms" />
          <circle cx="102" cy="20" r="3.2" className="mdot" />
          <path d="M96 66 L103 55 L110 66Z" className="mfill-strong" />
        </svg>
      );
    // Sleep consultant: a moon over a night's sleep stages.
    case "sleep":
      return (
        <svg {...common}>
          <path d="M52 8 A24 24 0 1 0 78 42 A19 19 0 0 1 52 8Z" className="mfill" />
          <circle cx="88" cy="14" r="2" className="mdot" />
          <circle cx="100" cy="26" r="1.5" className="mdim" />
          <path d="M96 8 V16 M92 12 H100" className="ma" />
          <path d="M8 64 H24 V56 H38 V63 H54 V52 H70 V60 H88 V54 H112" className="ms" />
        </svg>
      );
  }
}
