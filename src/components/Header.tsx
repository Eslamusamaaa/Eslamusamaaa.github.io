import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { profile } from "../data";
import { gsap, MOTION, prefersReducedMotion, scrollToId } from "../lib";

export const NAV = [
  { id: "work", label: "Work" },
  { id: "research", label: "Research" },
  { id: "demos", label: "Live demos" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
];

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const home = pathname === "/";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  // Scroll-spy: the section nearest the top of the viewport is current.
  useEffect(() => {
    if (!home) {
      setActive(null);
      return;
    }
    const ids = [...NAV.map((n) => n.id), "contact"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    const onTop = () => window.scrollY < 200 && setActive(null);
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [home, pathname]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Sliding indicator under the active item: moved with transform only.
  useLayoutEffect(() => {
    const ind = indicator.current;
    const nav = navRef.current;
    if (!ind || !nav) return;
    const link = active ? nav.querySelector<HTMLElement>(`[data-id="${active}"]`) : null;
    if (!link || getComputedStyle(nav).position === "absolute") {
      ind.style.opacity = "0";
      return;
    }
    ind.style.opacity = "1";
    ind.style.transform = `translateX(${link.offsetLeft + 12}px) scaleX(${link.offsetWidth - 24})`;
  }, [active, open]);

  // 2px scroll progress line, scrubbed by scroll position.
  useEffect(() => {
    const bar = progress.current;
    if (!bar) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const on = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      };
      on();
      addEventListener("scroll", on, { passive: true });
      return () => removeEventListener("scroll", on);
    });
    return () => mm.revert();
  }, [pathname]);

  // Mobile menu: Escape closes and returns focus; first link gets focus on open.
  useEffect(() => {
    if (!open) return;
    navRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    if (home) scrollToId(id);
    else navigate("/", { state: { scrollTo: id } });
  };

  const toTop = () => {
    setOpen(false);
    if (home) window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    else navigate("/");
  };

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <div className="bar">
        <button type="button" className="brand" onClick={toTop} aria-label={`${profile.name}, back to top`}>
          {profile.name}
        </button>
        <button
          ref={menuBtn}
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen(!open)}
        >
          <span className="sr">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className="burger" />
        </button>
        <nav id="primary-nav" ref={navRef} aria-label="Primary">
          <span ref={indicator} className="nav-indicator" aria-hidden="true" />
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`/#${n.id}`}
              data-id={n.id}
              aria-current={active === n.id ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                go(n.id);
              }}
            >
              {n.label}
            </a>
          ))}
          <a
            href="/#contact"
            className="nav-cta"
            aria-current={active === "contact" ? "true" : undefined}
            onClick={(e) => {
              e.preventDefault();
              go("contact");
            }}
          >
            Contact
          </a>
        </nav>
      </div>
      <span ref={progress} className="progress" aria-hidden="true" />
    </header>
  );
}
