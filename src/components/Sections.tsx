import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { about, education, profile, projects, skillMap, skills, training, zikolaWork } from "../data";
import { asset, finePointer, prefersReducedMotion } from "../lib";
import { ProjectCard } from "./Work";
import { ArrowIcon, CheckIcon, CopyIcon, GitHubIcon, LinkedInIcon, WaIcon } from "./icons";

export function Research() {
  const personal = projects.filter((p) => p.group === "personal");
  return (
    <section id="research" className="section wrap" aria-labelledby="research-title">
      <div className="sec-head">
        <h2 id="research-title" className="mask-line">
          <span>Research and personal projects</span>
        </h2>
        <p className="sub-lede">Speech, language models, medical imaging and applied machine learning, built outside my day job.</p>
      </div>
      <div className="cards cards-compact">
        {personal.map((p) => (
          <ProjectCard key={p.slug} p={p} variant="compact" />
        ))}
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className="section wrap" aria-labelledby="experience-title">
      <div className="sec-head">
        <h2 id="experience-title" className="mask-line">
          <span>Experience and education</span>
        </h2>
      </div>
      <ol className="timeline">
        <li>
          <p className="when">April 2026 to present · Employment</p>
          <h3>AI Engineer, Zikola</h3>
          <ul className="tl-items">
            {zikolaWork.map((w) => (
              <li key={w.title}>
                <strong>{w.title}.</strong> {w.short}{" "}
                {w.slug && (
                  <Link to={`/projects/${w.slug}`} className="tl-link">
                    Case study<span className="sr">: {w.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </li>
        <li>
          <p className="when">
            {education.years} · {education.status}
          </p>
          <h3>{education.degree}</h3>
          <p className="muted">{education.school}</p>
        </li>
        <li>
          <p className="when">Training and certificates</p>
          <ul className="tl-items compact">
            {training.map((t) => (
              <li key={t.title}>
                {t.title} <span className="muted">· {t.when}</span>
              </li>
            ))}
          </ul>
        </li>
      </ol>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="section wrap" aria-labelledby="about-title">
      <div className="about">
        <div className="sec-head">
          <h2 id="about-title" className="mask-line">
            <span>About</span>
          </h2>
        </div>
        <div className="about-copy">
          {about.map((para, i) => (
            <p key={i}>
              {i === 0 ? (
                <>
                  I'm{" "}
                  <a className="name-link" href={profile.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Eslam Usama, chat on WhatsApp (opens in a new tab)">
                    Eslam Usama
                  </a>
                  {para.replace(/^I'm Eslam Usama/, "")}
                </>
              ) : (
                para
              )}
            </p>
          ))}
          <p className="about-links">
            {profile.cvUrl && (
              <a href={asset(profile.cvUrl)} download>
                {profile.cvLabel}
              </a>
            )}
            <a href="#skills">See my skills</a>
          </p>
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const current = pinned ?? active;
  const map = useMemo(
    () =>
      Object.fromEntries(
        skillMap.map((s) => [
          s.skill,
          projects
            .filter((p) => {
              const hay = [p.title, p.kind, ...p.tags, ...p.stack.map((x) => `${x.name} ${x.role}`)].join(" ").toLowerCase();
              return s.keys.some((k) => hay.includes(k));
            })
            .map((p) => p.slug),
        ])
      ),
    []
  );
  const hits = current && map[current]?.length ? map[current] : null;

  return (
    <section id="skills" className="section wrap" aria-labelledby="skills-title">
      <div className="sec-head">
        <h2 id="skills-title" className="mask-line">
          <span>Skills</span>
        </h2>
        <p className="sub-lede">Point at, focus or tap a skill to see the projects that use it.</p>
      </div>
      <div className="skill-map">
        <ul className="skill-list" aria-label="Skills">
          {skillMap.map((s) => (
            <li key={s.skill}>
              <button
                type="button"
                className="skill"
                aria-pressed={pinned === s.skill}
                onMouseEnter={() => setActive(s.skill)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(s.skill)}
                onBlur={() => setActive(null)}
                onClick={() => setPinned(pinned === s.skill ? null : s.skill)}
              >
                {s.skill}
              </button>
            </li>
          ))}
        </ul>
        <ul className={`skill-projects${hits ? " filtering" : ""}`} aria-label="Projects" aria-live="polite">
          {projects.map((p) => {
            const on = !hits || hits.includes(p.slug);
            return (
              <li key={p.slug} className={on ? "on" : "off"}>
                <Link to={`/projects/${p.slug}`}>{p.title}</Link>
                {hits && on && <span className="sr"> uses {current}</span>}
              </li>
            );
          })}
        </ul>
      </div>
      <details className="full-list">
        <summary>Full list</summary>
        <div className="full-grid">
          {skills.map((g) => (
            <div key={g.group}>
              <h3>{g.group}</h3>
              <p>{g.items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}

/** Small arrow that slides in when a contact row is hovered or focused. */
const Go = () => (
  <span className="go" aria-hidden="true">
    <ArrowIcon size={14} />
  </span>
);

export function Contact() {
  const [copied, setCopied] = useState(false);
  const cta = useRef<HTMLAnchorElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  // Subtle magnetic pull on the primary CTA: fine pointers only, 8px max, off with reduced motion.
  const onMove = (e: React.MouseEvent) => {
    const el = cta.current;
    if (!el || !finePointer() || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const dx = ((e.clientX - (r.left + r.width / 2)) / r.width) * 16;
    const dy = ((e.clientY - (r.top + r.height / 2)) / r.height) * 16;
    el.style.transform = `translate(${Math.max(-8, Math.min(8, dx))}px, ${Math.max(-8, Math.min(8, dy))}px)`;
  };
  const onLeave = () => {
    if (cta.current) cta.current.style.transform = "";
  };

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <div>
          <h2 id="contact-title" className="mask-line">
            <span>Let's build something</span>
          </h2>
          <p className="sub-lede">Open to AI engineering roles and collaborations.</p>
          <div className="cta" onMouseMove={onMove} onMouseLeave={onLeave}>
            <a ref={cta} className="btn primary" href={`mailto:${profile.email}`}>
              Email me
            </a>
            <button type="button" className="btn secondary" onClick={copy}>
              {copied ? <CheckIcon /> : <CopyIcon />} {copied ? "Copied" : "Copy email"}
            </button>
            <span className="sr" aria-live="polite">
              {copied ? "Email address copied" : ""}
            </span>
          </div>
        </div>
        <ul className="contact-list">
          <li>
            <span>Email</span>
            <a href={`mailto:${profile.email}`}>{profile.email}<Go /></a>
          </li>
          <li>
            <span>Phone</span>
            <a href={`tel:${profile.phone}`} dir="ltr">
              {profile.phoneDisplay}
              <Go />
            </a>
          </li>
          <li>
            <span>WhatsApp</span>
            <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer">
              <WaIcon size={16} /> Chat with me
              <Go />
            </a>
          </li>
          <li>
            <span>LinkedIn</span>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin.com/in/eslam-usamaaa
              <Go />
            </a>
          </li>
          <li>
            <span>GitHub</span>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              github.com/Eslamusamaaa
              <Go />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-row">
        <span>
          © {new Date().getFullYear()}{" "}
          <a className="name-link" href={profile.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Eslam Usama, chat on WhatsApp (opens in a new tab)">
            {profile.name}
          </a>{" "}
          · AI Engineer
        </span>
        <span className="footer-links">
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)">
            <LinkedInIcon size={18} />
          </a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)">
            <GitHubIcon size={18} />
          </a>
          {profile.cvUrl && (
            <a href={asset(profile.cvUrl)} download>
              CV
            </a>
          )}
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" }); }}>
            Back to top
          </a>
        </span>
      </div>
    </footer>
  );
}
