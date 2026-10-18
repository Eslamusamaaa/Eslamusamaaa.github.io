import { useEffect } from "react";
import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import { education, otherProjects, profile, projects, skills, training, zikolaWork, type Project } from "./data";

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// Hash routing owns the URL hash, so section links are buttons-as-links that scroll.
function SectionLink({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const navigate = useLocation();
  const home = navigate.pathname === "/";
  if (home)
    return (
      <a
        href={`#/`}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          scrollToId(id);
        }}
      >
        {children}
      </a>
    );
  return (
    <Link to="/" state={{ scrollTo: id }} className={className}>
      {children}
    </Link>
  );
}

function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="brand">{profile.shortName}</Link>
      <nav aria-label="Primary">
        <SectionLink id="projects">Projects</SectionLink>
        <SectionLink id="experience">Experience</SectionLink>
        <SectionLink id="skills">Expertise</SectionLink>
        <SectionLink id="contact">Contact</SectionLink>
      </nav>
    </header>
  );
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function Home() {
  const loc = useLocation();
  useEffect(() => {
    const id = (loc.state as { scrollTo?: string } | null)?.scrollTo;
    if (id) setTimeout(() => scrollToId(id), 0);
  }, [loc.state]);
  return (
    <main id="main" tabIndex={-1}>
      <section className="hero">
        <p className="eyebrow">AI Engineer · Mansoura, Egypt</p>
        <h1>
          I build agentic LLM systems, speech models and applied machine learning that
          <em> ship to real users.</em>
        </h1>
        <p className="lede">
          I'm Eslam Osama. At Zikola I engineer multi-modal conversational agents that reach customers over WhatsApp and the
          web. Outside of work I fine-tune LLMs, train Arabic speech synthesis and build 3D medical-imaging pipelines.
        </p>
        <div className="cta">
          <SectionLink id="projects" className="btn primary">Featured projects</SectionLink>
          {profile.cvUrl && <a className="btn" href={profile.cvUrl} download>Download CV</a>}
          <a className="btn" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </section>

      <section id="projects" className="section">
        <h2>Featured projects</h2>
        <ul className="cards">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link to={`/projects/${p.slug}`} className="card">
                <span className="kind">{p.kind}</span>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <span className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</span>
                <span className="more">Read the case study →</span>
              </Link>
            </li>
          ))}
        </ul>
        <h3 className="sub">More work</h3>
        <ul className="list">
          {otherProjects.map((p) => (
            <li key={p.title}>
              <div>
                <strong>{p.title}</strong>
                <p>{p.blurb}</p>
                <span className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</span>
              </div>
              <ExtLink href={p.href}>View source code ↗</ExtLink>
            </li>
          ))}
        </ul>
      </section>

      <section id="experience" className="section">
        <h2>Experience &amp; education</h2>
        <div className="timeline">
          <article>
            <p className="when">April 2026 – present · Employment</p>
            <h3>AI Engineer, Zikola</h3>
            <p className="muted">Mansoura, Egypt</p>
            <ul className="bullets">
              {zikolaWork.map((w) => (
                <li key={w.title}><strong>{w.title}.</strong> {w.body}</li>
              ))}
            </ul>
            <p><Link to="/projects/zikola-conversational-agent">Conversational agent case study →</Link></p>
          </article>
          <article>
            <p className="when">{education.years} · {education.status}</p>
            <h3>{education.degree}</h3>
            <p className="muted">{education.school}</p>
          </article>
          <article>
            <p className="when">Training &amp; certificates</p>
            <ul className="bullets">
              {training.map((t) => <li key={t.title}><strong>{t.title}</strong> — {t.when}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section id="skills" className="section">
        <h2>Technical expertise</h2>
        <dl className="skills">
          {skills.map((s) => (
            <div key={s.group}>
              <dt>{s.group}</dt>
              <dd>{s.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="contact" className="section">
        <h2>Contact</h2>
        <p className="lede">Open to AI engineering roles and collaborations.</p>
        <div className="cta">
          <a className="btn primary" href={`mailto:${profile.email}`}>{profile.email}</a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a>
          <a className="btn" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </section>
    </main>
  );
}

function Flow({ steps }: { steps: Project["flow"] }) {
  return (
    <ol className="flow">
      {steps.map((s, i) => (
        <li key={s.title}>
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
  useEffect(() => {
    document.title = p ? `${p.title} — Eslam Osama` : "Eslam Osama — AI Engineer";
  }, [p]);
  if (!p)
    return (
      <main id="main" tabIndex={-1} className="page">
        <h1>Project not found</h1>
        <Link to="/">Back to home</Link>
      </main>
    );
  const isZikola = p.slug === "zikola-conversational-agent";
  return (
    <main id="main" tabIndex={-1} className="page">
      <Link to="/" className="back">← All projects</Link>
      <p className="eyebrow">{p.kind}</p>
      <h1>{p.title}</h1>
      <p className="lede">{p.summary}</p>
      <p className="status">Status: {p.status}</p>

      <h2>Overview</h2>
      <p>{p.overview}</p>
      <h2>Problem and motivation</h2>
      <p>{p.problem}</p>
      <p><strong>My contribution:</strong> {p.contribution}</p>

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

      {isZikola && (
        <>
          <h2>Other engineering work at Zikola</h2>
          <ul className="bullets">
            {zikolaWork.map((w) => <li key={w.title}><strong>{w.title}.</strong> {w.body}</li>)}
          </ul>
        </>
      )}

      <h2>Technologies and their roles</h2>
      <table>
        <tbody>
          {p.stack.map((s) => (
            <tr key={s.name}><th scope="row">{s.name}</th><td>{s.role}</td></tr>
          ))}
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

      {p.links.length > 0 && (
        <>
          <h2>Links</h2>
          <div className="cta">
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
        <Route path="*" element={<main id="main" tabIndex={-1} className="page"><h1>Page not found</h1><Link to="/">Back to home</Link></main>} />
      </Routes>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
      </footer>
    </>
  );
}
