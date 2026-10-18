import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import {
  education, otherProjects, profile, projects, skills, training, whatsappBots, zikolaWork, type Project,
} from "./data";

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`;
const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const stagger = (i: number) => ({ ["--n" as string]: Math.min(i, 6) });

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

/** One reveal system: elements with .reveal (or .stagger containers) get .in when they enter the viewport. */
function useReveal(dep: unknown) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.in), .stagger:not(.in)"));
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
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [dep]);
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

function NameLink({ children }: { children?: React.ReactNode }) {
  return (
    <a
      className="name-link"
      href={profile.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Eslam Usama on WhatsApp (opens in a new tab)"
    >
      {children ?? profile.name}
    </a>
  );
}

function PlayIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.3 5 12 5 12 5s-6.3 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.76 2 12 2 12s0 3.24.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.7 19 12 19 12 19s6.3 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.24 22 12 22 12s0-3.24-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">AI Engineer · Egypt</p>
          <h1>
            I design and build <span className="hl">intelligent systems</span> that solve real problems.
          </h1>
          <p className="lede">
            I'm <NameLink />, an AI Engineer focused on building intelligent systems that turn complex problems into practical,
            AI-powered solutions. My work spans machine learning, deep learning, computer vision, natural language
            processing and generative AI, from LLM applications and retrieval-augmented generation to AI agents.
          </p>
          <div className="cta">
            <SectionLink id="work" className="btn primary">See featured work</SectionLink>
            <SectionLink id="bots" className="btn"><WaIcon /> Try the bots</SectionLink>
            {profile.cvUrl && <a className="btn" href={profile.cvUrl} download>Download CV</a>}
            <a className="btn ghost" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="btn ghost" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function VideoButton({ p, size }: { p: Project; size?: "lg" }) {
  if (!p.video) return null;
  return (
    <a className={`btn video${size ? " lg" : ""}`} href={p.video.url} target="_blank" rel="noopener noreferrer">
      <PlayIcon size={size ? 20 : 18} /> Watch Project Explanation
    </a>
  );
}

function Lead({ p }: { p: Project }) {
  return (
    <li className="lead">
      <div className="lead-art">
        {p.image && <img src={asset(p.image.src)} alt={p.image.alt} width={120} height={120} loading="lazy" />}
      </div>
      <div className="lead-body">
        <span className="kind">{p.kind}</span>
        <h3><Link to={`/projects/${p.slug}`}>{p.title}</Link></h3>
        <p>{p.summary}</p>
        <span className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</span>
        <span className="actions">
          <Link className="btn primary" to={`/projects/${p.slug}`}>Read the case study</Link>
          <VideoButton p={p} />
        </span>
      </div>
    </li>
  );
}

function Row({ p, i }: { p: Project; i: number }) {
  return (
    <li>
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

      <section id="work" className="wrap section">
        <header className="sec-head reveal">
          <p className="eyebrow">01 · Professional work at Zikola</p>
          <h2>Systems I built and shipped</h2>
          <p className="sub-lede">Written from project documentation and repository history. Private source code and customer data are not shown.</p>
        </header>
        <ul className="work stagger">
          <Lead p={pro[0]} />
          {pro.slice(1).map((p, i) => <Row key={p.slug} p={p} i={i + 2} />)}
        </ul>
      </section>

      <section id="bots" className="wrap section compact">
        <header className="sec-head reveal">
          <p className="eyebrow">02 · Quick access</p>
          <h2 className="h-sm">WhatsApp bots</h2>
          <p className="sub-lede">Each link opens a WhatsApp chat with the bot. <Link to="/projects/whatsapp-commerce-bots">How they work</Link>.</p>
        </header>
        <ul className="bots stagger">
          {whatsappBots.map((b, i) => (
            <li key={b.id} style={stagger(i)}>
              <span className="wa-ic"><WaIcon size={16} /></span>
              <span className="bot-text">
                <strong>{b.title}</strong>
                <span className="num" dir="ltr">+966 {b.number}</span>
                <span className="desc">{b.blurb}</span>
              </span>
              <a className="wa-link" href={b.href} target="_blank" rel="noopener noreferrer" aria-label={`Try on WhatsApp: +966 ${b.number}`}>
                Try on WhatsApp <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap section">
        <header className="sec-head reveal">
          <p className="eyebrow">03 · Research and personal projects</p>
          <h2>Models, speech and imaging</h2>
        </header>
        <ul className="work stagger">
          {personal.map((p, i) => <Row key={p.slug} p={p} i={i + 1} />)}
        </ul>
        <h3 className="sub reveal">More repositories</h3>
        <ul className="list stagger">
          {otherProjects.map((p, i) => (
            <li key={p.title} style={stagger(i)}>
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
        <header className="sec-head reveal">
          <p className="eyebrow">04 · Experience and education</p>
          <h2>Where I've worked and studied</h2>
        </header>
        <ol className="tl stagger">
          <li style={stagger(0)}>
            <p className="when">April 2026 – present · Employment</p>
            <h3>AI Engineer, Zikola</h3>
            <ul className="bullets">
              {zikolaWork.map((w) => <li key={w.title}><strong>{w.title}.</strong> {w.body}</li>)}
            </ul>
          </li>
          <li style={stagger(1)}>
            <p className="when">{education.years} · {education.status}</p>
            <h3>{education.degree}</h3>
            <p className="muted">{education.school}</p>
          </li>
          <li style={stagger(2)}>
            <p className="when">Training and certificates</p>
            <ul className="bullets">
              {training.map((t) => <li key={t.title}><strong>{t.title}</strong> · {t.when}</li>)}
            </ul>
          </li>
        </ol>
      </section>

      <section id="skills" className="wrap section">
        <header className="sec-head reveal">
          <p className="eyebrow">05 · Technical expertise</p>
          <h2>What I work with</h2>
        </header>
        <dl className="skills stagger">
          {skills.map((s, i) => (
            <div key={s.group} style={stagger(i)}>
              <dt>{s.group}</dt>
              <dd>{s.items.map((it) => <span key={it}>{it}</span>)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="contact" className="contact">
        <div className="wrap contact-grid">
          <header className="reveal">
            <p className="eyebrow">06 · Contact</p>
            <h2>Let's build something</h2>
            <p className="sub-lede">Open to AI engineering roles and collaborations.</p>
            <p className="fine">The WhatsApp numbers above are demo bot lines, separate from my personal number.</p>
          </header>
          <ul className="contact-list stagger">
            <li style={stagger(0)}><span>Phone</span><a href={`tel:${profile.phone}`} dir="ltr">{profile.phoneDisplay}</a></li>
            <li style={stagger(1)}><span>Email</span><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
            <li style={stagger(2)}><span>LinkedIn</span><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/eslam-usamaaa</a></li>
            <li style={stagger(3)}><span>GitHub</span><a href={profile.github} target="_blank" rel="noopener noreferrer">github.com/Eslamusamaaa</a></li>
          </ul>
        </div>
      </section>
    </main>
  );
}

function Flow({ steps }: { steps: Project["flow"] }) {
  return (
    <ol className="flow stagger">
      {steps.map((s, i) => (
        <li key={s.title} style={stagger(i)}>
          <span className="n">{i + 1}</span>
          <strong>{s.title}</strong>
          <span>{s.note}</span>
        </li>
      ))}
    </ol>
  );
}

function VideoCard({ p }: { p: Project }) {
  if (!p.video) return null;
  return (
    <a className="video-card" href={p.video.url} target="_blank" rel="noopener noreferrer" aria-label={`Watch on YouTube: ${p.video.title}`}>
      <img
        src={`https://i.ytimg.com/vi/${p.video.id}/hqdefault.jpg`}
        alt=""
        width={480}
        height={360}
        loading="lazy"
        referrerPolicy="no-referrer"
      />
      <span className="play" aria-hidden="true"><PlayIcon size={28} /></span>
      <span className="video-meta">
        <strong dir="rtl">{p.video.title}</strong>
        <small>Project explanation video · opens YouTube</small>
      </span>
    </a>
  );
}

function ProjectPage() {
  const { slug } = useParams();
  const p = projects.find((x) => x.slug === slug);
  useReveal(slug);
  useEffect(() => {
    document.title = p ? `${p.title} · Eslam Usama` : "Eslam Usama · AI Engineer";
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
      {p.video && (
        <div className="cta"><VideoButton p={p} size="lg" /></div>
      )}

      <h2>Overview</h2>
      <p>{p.overview}</p>
      <VideoCard p={p} />
      <h2>Problem and motivation</h2>
      <p>{p.problem}</p>
      <p className="callout"><strong>My contribution.</strong> {p.contribution}</p>

      <h2>{p.flowTitle}</h2>
      <Flow steps={p.flow} />
      {p.flowCaveat && <p className="note">{p.flowCaveat}</p>}

      <h2>Implementation</h2>
      {p.implementation.map((i) => (
        <div key={i.heading}>
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
            {isBots && <Link className="btn" to="/" state={{ scrollTo: "bots" }}><WaIcon /> Try the bots</Link>}
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
        <span>© {new Date().getFullYear()} <NameLink /> · AI Engineer</span>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </>
  );
}
