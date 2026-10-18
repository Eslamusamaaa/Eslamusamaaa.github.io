import { useEffect, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import {
  education, evidence, otherProjects, profile, projects, skills, training, whatsappBots, zikolaWork, type Project,
} from "./data";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;
const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" });
}

function useReveal(dep: unknown) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)"));
    if (reduceMotion() || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(reduceMotion() ? to : 0);
  useEffect(() => {
    if (reduceMotion() || !ref.current) return;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1100);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString("en-US")}</span>;
}

function SectionLink({ id, children, className, onNav }: { id: string; children: React.ReactNode; className?: string; onNav?: () => void }) {
  const home = useLocation().pathname === "/";
  if (home)
    return (
      <a
        href="#/"
        className={className}
        onClick={(e) => {
          e.preventDefault();
          onNav?.();
          scrollToId(id);
        }}
      >
        {children}
      </a>
    );
  return (
    <Link to="/" state={{ scrollTo: id }} className={className} onClick={onNav}>
      {children}
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const close = () => setOpen(false);
  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <div className="bar">
        <Link to="/" className="brand" onClick={close}>
          <img src={asset("img/eslam.jpg")} alt="" width={32} height={32} />
          {profile.shortName}
        </Link>
        <button className="menu-btn" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>
          <span className="sr">Menu</span>
          <span aria-hidden="true" className="burger" />
        </button>
        <nav id="primary-nav" aria-label="Primary">
          <SectionLink id="work" onNav={close}>Work</SectionLink>
          <SectionLink id="bots" onNav={close}>WhatsApp bots</SectionLink>
          <SectionLink id="experience" onNav={close}>Experience</SectionLink>
          <SectionLink id="skills" onNav={close}>Expertise</SectionLink>
          <SectionLink id="contact" className="nav-cta" onNav={close}>Contact</SectionLink>
        </nav>
      </div>
    </header>
  );
}

function WaIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.38A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 1 1-4.3 15l-.31-.18-3.12.82.83-3.04-.2-.32A8.1 8.1 0 0 1 12.04 3.8Zm-3 3.9c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.5 2.5 1.08 3 .87 3.54.82.55-.05 1.76-.72 2-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35-.3-.15-1.76-.87-2.03-.97-.28-.1-.48-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.2-.24-.58-.49-.5-.67-.5Z"
      />
    </svg>
  );
}

const pipeline = [
  { t: "Voice or WhatsApp", s: "customer input" },
  { t: "Speech-to-text", s: "Deepgram" },
  { t: "Agent", s: "LangGraph · RAG · LLM" },
  { t: "Reply", s: "text or TTS" },
];

function Hero() {
  const rise = (d: number) => ({ style: { ["--d" as string]: `${d}s` } });
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow rise" {...rise(0)}>AI Engineer · Egypt</p>
          <h1 className="rise" {...rise(0.08)}>
            I build AI that <span className="hl">talks to customers</span>, reads catalogs and joins meetings.
          </h1>
          <p className="lede rise" {...rise(0.16)}>
            I'm Eslam, an AI Engineer at Zikola. I ship LLM agents, RAG pipelines and speech systems: a Salla shopping quiz,
            a meeting assistant, voice calling for merchants and WhatsApp commerce bots.
          </p>
          <div className="cta rise" {...rise(0.24)}>
            <SectionLink id="work" className="btn primary">See featured work</SectionLink>
            <SectionLink id="bots" className="btn"><WaIcon /> Try the bots</SectionLink>
            {profile.cvUrl && <a className="btn" href={profile.cvUrl} download>Download CV</a>}
            <a className="btn ghost" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
        <figure className="portrait rise" {...rise(0.2)}>
          <img src={asset("img/eslam.jpg")} alt="Portrait of Eslam Osama" width={720} height={720} fetchPriority="high" />
          <figcaption>
            <strong>{profile.name}</strong>
            <span>AI Engineer · Zikola</span>
          </figcaption>
        </figure>
      </div>
      <div className="wrap">
        <ol className="strip rise" {...rise(0.4)} aria-label="Typical pipeline in my voice and WhatsApp agent work">
          {pipeline.map((p, i) => (
            <li key={p.t}>
              <strong>{p.t}</strong>
              <span>{p.s}</span>
              {i < pipeline.length - 1 && <i className="arrow" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Lead({ p }: { p: Project }) {
  return (
    <li data-reveal className="lead-wrap">
      <Link to={`/projects/${p.slug}`} className="lead">
        <div className="lead-art">
          {p.image && <img src={asset(p.image.src)} alt={p.image.alt} width={120} height={120} loading="lazy" />}
          <span>رشّحلي</span>
        </div>
        <div className="lead-body">
          <span className="kind">{p.kind}</span>
          <h3>{p.title}</h3>
          <p>{p.summary}</p>
          <span className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</span>
          <span className="more">Read the case study <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </li>
  );
}

function Row({ p, i }: { p: Project; i: number }) {
  return (
    <li data-reveal>
      <Link to={`/projects/${p.slug}`} className="row">
        <span className="idx">{String(i).padStart(2, "0")}</span>
        <div>
          <span className="kind">{p.kind}</span>
          <h3>{p.title}</h3>
          <p>{p.summary}</p>
          <span className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</span>
        </div>
        <span className="go" aria-hidden="true">→</span>
      </Link>
    </li>
  );
}

function Home() {
  const loc = useLocation();
  useReveal(loc.key);
  useEffect(() => {
    const id = (loc.state as { scrollTo?: string } | null)?.scrollTo;
    if (id) setTimeout(() => scrollToId(id), 0);
  }, [loc.state]);
  const pro = projects.filter((p) => p.group === "professional");
  const personal = projects.filter((p) => p.group === "personal");
  return (
    <main id="main" tabIndex={-1}>
      <Hero />

      <section className="wrap evidence" aria-label="Verified figures from project documentation">
        <ul>
          {evidence.map((e) => (
            <li key={e.label} data-reveal>
              <strong><Counter to={e.value} /></strong>
              <span>{e.label}</span>
              <small>{e.note}</small>
            </li>
          ))}
        </ul>
      </section>

      <section id="work" className="wrap section">
        <header className="sec-head" data-reveal>
          <p className="eyebrow">01 · Professional work at Zikola</p>
          <h2>Systems I built and shipped</h2>
          <p className="sub-lede">Written from project documentation and repository history. Private source code and customer data are not shown.</p>
        </header>
        <ul className="work">
          <Lead p={pro[0]} />
          {pro.slice(1).map((p, i) => <Row key={p.slug} p={p} i={i + 2} />)}
        </ul>
      </section>

      <section id="bots" className="band">
        <div className="wrap bots-grid">
          <header data-reveal>
            <p className="eyebrow green">02 · Try it live</p>
            <h2>WhatsApp bots you can message right now</h2>
            <p className="sub-lede">Tap a button and a real WhatsApp chat opens with that bot. All three are Saudi (+966) mobile lines.</p>
            <ol className="how">
              <li><b>1</b> Tap <em>Try the Bot on WhatsApp</em></li>
              <li><b>2</b> WhatsApp opens a chat with the number</li>
              <li><b>3</b> Say hello and browse the catalog</li>
            </ol>
            <p className="fine">How they work: <Link to="/projects/whatsapp-commerce-bots">WhatsApp commerce bots case study</Link>.</p>
          </header>
          <ul className="bots">
            {whatsappBots.map((b) => (
              <li key={b.id} data-reveal className="bot">
                <span className="wa-badge"><WaIcon size={22} /></span>
                <div className="bot-info">
                  <h3>{b.title}</h3>
                  <p className="num" dir="ltr">+966 {b.number}</p>
                  <p>{b.blurb}</p>
                </div>
                <a className="btn wa" href={b.href} target="_blank" rel="noopener noreferrer" aria-label={`Try the bot on WhatsApp: +966 ${b.number}`}>
                  <WaIcon /> Try the Bot on WhatsApp
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap section">
        <header className="sec-head" data-reveal>
          <p className="eyebrow">03 · Research and personal projects</p>
          <h2>Models, speech and imaging</h2>
        </header>
        <ul className="work">
          {personal.map((p, i) => <Row key={p.slug} p={p} i={i + 1} />)}
        </ul>
        <h3 className="sub" data-reveal>More repositories</h3>
        <ul className="list">
          {otherProjects.map((p) => (
            <li key={p.title} data-reveal>
              <div>
                <strong>{p.title}</strong>
                <p>{p.blurb}</p>
                <span className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</span>
              </div>
              <a href={p.href} target="_blank" rel="noopener noreferrer">View source code ↗</a>
            </li>
          ))}
        </ul>
      </section>

      <section id="experience" className="wrap section">
        <header className="sec-head" data-reveal>
          <p className="eyebrow">04 · Experience and education</p>
          <h2>Where I've worked and studied</h2>
        </header>
        <ol className="tl">
          <li data-reveal>
            <p className="when">April 2026 – present · Employment</p>
            <h3>AI Engineer, Zikola</h3>
            <ul className="bullets">
              {zikolaWork.map((w) => <li key={w.title}><strong>{w.title}.</strong> {w.body}</li>)}
            </ul>
          </li>
          <li data-reveal>
            <p className="when">{education.years} · {education.status}</p>
            <h3>{education.degree}</h3>
            <p className="muted">{education.school}</p>
          </li>
          <li data-reveal>
            <p className="when">Training and certificates</p>
            <ul className="bullets">
              {training.map((t) => <li key={t.title}><strong>{t.title}</strong> · {t.when}</li>)}
            </ul>
          </li>
        </ol>
      </section>

      <section id="skills" className="wrap section">
        <header className="sec-head" data-reveal>
          <p className="eyebrow">05 · Technical expertise</p>
          <h2>What I work with</h2>
        </header>
        <dl className="skills">
          {skills.map((s) => (
            <div key={s.group} data-reveal>
              <dt>{s.group}</dt>
              <dd>{s.items.map((i) => <span key={i}>{i}</span>)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="contact" className="band contact">
        <div className="wrap contact-grid">
          <header data-reveal>
            <p className="eyebrow">06 · Contact</p>
            <h2>Let's build something</h2>
            <p className="sub-lede">Open to AI engineering roles and collaborations.</p>
            <p className="fine">The WhatsApp numbers above are demo bot lines, separate from my personal number.</p>
          </header>
          <ul className="contact-list" data-reveal>
            <li><span>Phone</span><a href={`tel:${profile.phone}`} dir="ltr">{profile.phoneDisplay}</a></li>
            <li><span>Email</span><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
            <li><span>LinkedIn</span><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/eslam-usamaaa</a></li>
            <li><span>GitHub</span><a href={profile.github} target="_blank" rel="noopener noreferrer">github.com/Eslamusamaaa</a></li>
          </ul>
        </div>
      </section>
    </main>
  );
}

function Flow({ steps }: { steps: Project["flow"] }) {
  return (
    <ol className="flow">
      {steps.map((s, i) => (
        <li key={s.title} data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
          <span className="n">{i + 1}</span>
          <strong>{s.title}</strong>
          <span>{s.note}</span>
        </li>
      ))}
    </ol>
  );
}

function ProjectPage() {
  const { slug } = useParams();
  const p = projects.find((x) => x.slug === slug);
  useReveal(slug);
  useEffect(() => {
    document.title = p ? `${p.title} · Eslam Osama` : "Eslam Osama · AI Engineer";
  }, [p]);
  if (!p)
    return (
      <main id="main" tabIndex={-1} className="wrap page">
        <h1>Project not found</h1>
        <Link to="/">Back to home</Link>
      </main>
    );
  const isBots = p.slug === "whatsapp-commerce-bots";
  return (
    <main id="main" tabIndex={-1} className="wrap page">
      <Link to="/" className="back">← All projects</Link>
      <div className="page-head">
        {p.image && <img className="logo-tile" src={asset(p.image.src)} alt={p.image.alt} width={88} height={88} />}
        <div>
          <p className="eyebrow">{p.kind}</p>
          <h1>{p.title}</h1>
        </div>
      </div>
      <p className="lede">{p.summary}</p>
      <p className="status">Status: {p.status}</p>

      <h2>Overview</h2>
      <p>{p.overview}</p>
      <h2>Problem and motivation</h2>
      <p>{p.problem}</p>
      <p className="callout"><strong>My contribution.</strong> {p.contribution}</p>

      <h2>{p.flowTitle}</h2>
      <Flow steps={p.flow} />
      {p.flowCaveat && <p className="note">{p.flowCaveat}</p>}

      <h2>Implementation</h2>
      {p.implementation.map((i) => (
        <div key={i.heading} data-reveal>
          <h3>{i.heading}</h3>
          <p>{i.body}</p>
        </div>
      ))}

      <h2>Technologies and their roles</h2>
      <table>
        <tbody>
          {p.stack.map((s) => <tr key={s.name}><th scope="row">{s.name}</th><td>{s.role}</td></tr>)}
        </tbody>
      </table>

      {p.challenges.length > 0 && (
        <>
          <h2>Challenges and trade-offs</h2>
          <ul className="bullets">
            {p.challenges.map((c) => <li key={c.challenge}><strong>{c.challenge}.</strong> {c.solution}</li>)}
          </ul>
        </>
      )}

      <h2>Results and limitations</h2>
      <ul className="bullets">
        {p.results.map((r) => <li key={r}>{r}</li>)}
        {p.limitations.map((r) => <li key={r} className="limit">{r}</li>)}
      </ul>

      {p.next.length > 0 && (
        <>
          <h2>Future improvements</h2>
          <ul className="bullets">{p.next.map((r) => <li key={r}>{r}</li>)}</ul>
        </>
      )}

      {(p.links.length > 0 || isBots) && (
        <>
          <h2>Links</h2>
          <div className="cta">
            {isBots && <Link className="btn wa" to="/" state={{ scrollTo: "bots" }}><WaIcon /> Try the bots</Link>}
            {p.links.map((l) =>
              l.href.startsWith("#/") ? (
                <Link key={l.href} className="btn" to={l.href.slice(1)}>{l.label}</Link>
              ) : (
                <a key={l.href} className="btn" href={l.href} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>
              )
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default function App() {
  return (
    <>
      <a href="#main" className="skip" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>Skip to content</a>
      <ScrollTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<main id="main" tabIndex={-1} className="wrap page"><h1>Page not found</h1><Link to="/">Back to home</Link></main>} />
      </Routes>
      <footer className="site-footer wrap">
        <span>© {new Date().getFullYear()} {profile.name} · AI Engineer</span>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </>
  );
}
