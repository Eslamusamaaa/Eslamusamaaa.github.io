import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryGroup } from "../gallery";
import { asset } from "../lib";

/** Grouped screenshot grid; every figure opens in a shared lightbox that steps through the whole set. */
export function Gallery({ groups, idPrefix }: { groups: GalleryGroup[]; idPrefix: string }) {
  const flat = groups.flatMap((g) => g.shots);
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  let offset = 0;
  return (
    <>
      {groups.map((g, gi) => {
        const start = offset;
        offset += g.shots.length;
        const hid = `${idPrefix}-g${gi}`;
        return (
          <div key={g.title} className="gal-group" role="group" aria-labelledby={hid}>
            <h3 id={hid}>{g.title}</h3>
            {g.note && <p className="muted gal-note">{g.note}</p>}
            <ul className="gal-grid">
              {g.shots.map((sh, si) => (
                <li key={sh.src}>
                  <button
                    type="button"
                    className={`gal-item${sh.height / sh.width > 0.95 ? " tall" : ""}`}
                    onClick={(e) => {
                      opener.current = e.currentTarget;
                      setOpen(start + si);
                    }}
                    aria-label={`Enlarge: ${sh.caption}`}
                  >
                    <img src={asset(sh.src)} alt={sh.alt} width={sh.width} height={sh.height} loading="lazy" decoding="async" />
                  </button>
                  <span className="gal-cap">{sh.caption}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      {open !== null && (
        <Lightbox
          shots={flat}
          index={open}
          onIndex={setOpen}
          onClose={() => {
            setOpen(null);
            opener.current?.focus();
          }}
        />
      )}
    </>
  );
}

function Lightbox({ shots, index, onIndex, onClose }: { shots: GalleryGroup["shots"]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const sh = shots[index];
  const step = useCallback((d: number) => onIndex((index + d + shots.length) % shots.length), [index, shots.length, onIndex]);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="Screenshot viewer"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      <div className="lb-body">
        <img key={sh.src} src={asset(sh.src)} alt={sh.alt} />
        <p className="lb-cap" aria-live="polite">
          <span>
            {index + 1} / {shots.length}
          </span>{" "}
          {sh.caption}
        </p>
      </div>
      <div className="lb-bar">
        <button type="button" className="btn secondary" onClick={() => step(-1)} aria-label="Previous screenshot">
          ←
        </button>
        <button type="button" className="btn secondary" onClick={() => step(1)} aria-label="Next screenshot">
          →
        </button>
        <button type="button" className="btn primary" onClick={() => ref.current?.close()}>
          Close
        </button>
      </div>
    </dialog>
  );
}
