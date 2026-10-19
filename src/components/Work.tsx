import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { projects, type Project } from "../data";
import { asset, MOTION, ScrollTrigger, useMotion } from "../lib";
import { Motif } from "./Motifs";
import { ArrowIcon, PlayIcon } from "./icons";

/** Neutral text link with a play icon, used for the Rashihli explanation video. */
export function VideoLink({ p }: { p: Project }) {
  if (!p.video) return null;
  return (
    <a className="video-link" href={p.video.url} target="_blank" rel="noopener noreferrer">
      <PlayIcon size={14} /> Watch project explanation
    </a>
  );
}

/** Whole card is one link (stretched); the video link sits above it with its own tab stop. */
export function ProjectCard({ p, variant, index }: { p: Project; variant: "flagship" | "standard" | "compact"; index?: number }) {
  const to = `/projects/${p.slug}`;
  const voice = p.motif === "wave";
  return (
    <article className={`card card-${variant}${voice ? " is-voice" : ""}`} id={index !== undefined ? `p-${p.slug}` : undefined} data-cats={p.cats.join(" ")}>
      <div className="card-top">
        {p.image && variant === "flagship" ? (
          <img className="card-logo" src={asset(p.image.src)} alt="" width={64} height={64} loading="lazy" />
        ) : (
          <Motif type={p.motif} />
        )}
        <span className="card-kind">{p.kind}</span>
      </div>
      <h3>
        <Link to={to} className="stretched">
          {p.title}
        </Link>
      </h3>
      <p className="card-line">{p.oneLine}</p>
      {/* Tags show by default; the role sentence takes their place on hover or focus (fine pointers). */}
      <div className="card-reveal">
        <ul className="card-tags" aria-label="Main technologies">
          {p.tags.slice(0, variant === "compact" ? 4 : 3).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        {p.role && <p className="card-detail">My role: {p.role.replace(/\.$/, "")}.</p>}
      </div>
      <div className="card-foot">
        <span className="card-cta" aria-hidden="true">
          Read case study <ArrowIcon size={14} />
        </span>
        <VideoLink p={p} />
      </div>
    </article>
  );
}

export default function Work() {
  const pro = projects.filter((p) => p.group === "professional");
  const cats = useMemo(() => ["All", ...Array.from(new Set(pro.flatMap((p) => p.cats)))], [pro]);
  const [filter, setFilter] = useState("All");
  const [current, setCurrent] = useState(pro[0].slug);
  const ref = useRef<HTMLElement>(null);
  const shown = pro.filter((p) => filter === "All" || p.cats.includes(filter));

  // Highlight the project currently in view in the sticky index.
  useMotion(
    ref,
    (mm) => {
      mm.add("(min-width: 1101px)", () => {
        shown.forEach((p) => {
          ScrollTrigger.create({
            trigger: `#p-${p.slug}`,
            start: "top 55%",
            end: "bottom 45%",
            onToggle: (self) => self.isActive && setCurrent(p.slug),
          });
        });
      });
      mm.add(MOTION, () => undefined);
    },
    [filter]
  );

  return (
    <section id="work" className="section wrap" ref={ref} aria-labelledby="work-title">
      <div className="sec-head">
        <h2 id="work-title" className="mask-line">
          <span>Professional work at Zikola</span>
        </h2>
        <p className="sub-lede">Case studies written from project documentation and repository history. Private source code and customer data are not shown.</p>
      </div>
      <div className="work-layout">
        <nav className="work-index" aria-label="Projects in this section">
          <ol>
            {pro.map((p, i) => {
              const hidden = !shown.includes(p);
              return (
                <li key={p.slug} className={`${current === p.slug ? "is-current" : ""}${hidden ? " is-hidden" : ""}`}>
                  <a href={`#p-${p.slug}`} aria-current={current === p.slug ? "true" : undefined} tabIndex={hidden ? -1 : undefined}>
                    <span className="num">{String(i + 1).padStart(2, "0")}</span>
                    <span>{p.title.split(":")[0]}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
        <div>
          <div className="filters" role="group" aria-label="Filter projects">
            {cats.map((c) => (
              <button key={c} type="button" className="chip" aria-pressed={filter === c} onClick={() => setFilter(c)}>
                {c}
              </button>
            ))}
          </div>
          <p className="sr" aria-live="polite">
            {shown.length} {shown.length === 1 ? "project" : "projects"} shown
          </p>
          {shown.length === 0 ? (
            <p className="empty">
              No projects in this category yet. <button type="button" className="text-btn" onClick={() => setFilter("All")}>Show all projects</button>
            </p>
          ) : (
            <div className="cards" key={filter}>
              {shown.map((p, i) => (
                <ProjectCard key={p.slug} p={p} variant={i === 0 && p.slug === pro[0].slug ? "flagship" : "standard"} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
