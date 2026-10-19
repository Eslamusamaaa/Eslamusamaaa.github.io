import { useLayoutEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { hero } from "./data";
import { gsap, MOTION, scrollToId, usePageMeta, useMotion } from "./lib";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Demos from "./components/Demos";
import ProjectPage from "./components/ProjectPage";
import { About, Contact, Experience, Footer, Research, Skills } from "./components/Sections";
import { Waveform } from "./components/Motifs";

const HOME_SCROLL = "home-scroll";

function Divider() {
  return <Waveform className="divider" height={36} cycles={14} />;
}

function Home() {
  const loc = useLocation();
  const ref = useRef<HTMLElement>(null);
  usePageMeta("Eslam Usama · AI Engineer", `${hero.title} ${hero.lede}`, "/");

  // Return to the right place: a section requested by the nav, or where you left off.
  useLayoutEffect(() => {
    const state = loc.state as { scrollTo?: string; restore?: boolean } | null;
    if (state?.scrollTo) {
      requestAnimationFrame(() => scrollToId(state.scrollTo!));
    } else if (state?.restore) {
      const y = Number(sessionStorage.getItem(HOME_SCROLL) || 0);
      window.scrollTo(0, y);
    } else if (loc.hash) {
      requestAnimationFrame(() => scrollToId(loc.hash.slice(1)));
    }
    const save = () => sessionStorage.setItem(HOME_SCROLL, String(window.scrollY));
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      save();
      window.removeEventListener("scroll", save);
    };
  }, [loc.key]);

  useMotion(
    ref,
    (mm) => {
      mm.add(MOTION, () => {
        // Section headings: masked line reveal, once.
        gsap.utils.toArray<HTMLElement>(".mask-line > span").forEach((el) => {
          gsap.from(el, { yPercent: 105, duration: 0.38, ease: "power3.out", scrollTrigger: { trigger: el.parentElement, start: "top 88%", once: true } });
        });
        // Divider waveform scrubs with scroll.
        gsap.utils.toArray<SVGPathElement>(".divider path").forEach((path) => {
          const len = path.getTotalLength();
          gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: path, start: "top 95%", end: "top 45%", scrub: 0.3 } });
        });
      });
    },
    [loc.key]
  );

  return (
    <main id="main" tabIndex={-1} ref={ref}>
      <Hero />
      <Work />
      <Divider />
      <Research />
      <Divider />
      <Demos />
      <Experience />
      <About />
      <Skills />
      <Contact />
    </main>
  );
}

function ScrollTop() {
  const { pathname, state } = useLocation();
  useLayoutEffect(() => {
    const s = state as { scrollTo?: string; restore?: boolean } | null;
    if (pathname !== "/" || (!s?.scrollTo && !s?.restore)) window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return null;
}

function NotFound() {
  usePageMeta("Page not found · Eslam Usama", "This page could not be found.", "/");
  return (
    <main id="main" tabIndex={-1} className="wrap page">
      <h1>Page not found</h1>
      <p>
        <a href="/">Back to the home page</a>
      </p>
    </main>
  );
}

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="skip"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <ScrollTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
