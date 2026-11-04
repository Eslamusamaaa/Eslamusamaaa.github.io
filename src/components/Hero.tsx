import { useRef } from "react";
import { hero, profile } from "../data";
import { asset, gsap, MOTION, scrollToId, useMotion } from "../lib";
import { Waveform } from "./Motifs";
import { GitHubIcon, LinkedInIcon, WaIcon } from "./icons";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (mm) => {
    mm.add(MOTION, () => {
      // Masked headline reveal, then the waveform line draws once.
      gsap.from(".hero .mask > span", { yPercent: 105, duration: 0.4, ease: "power3.out", stagger: 0.06 });
      gsap.from(".hero .fade-in", { opacity: 0, duration: 0.35, ease: "power2.out", delay: 0.18 });
      const path = ref.current?.querySelector<SVGPathElement>(".hero-wave path");
      if (path) {
        const len = path.getTotalLength();
        gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out", delay: 0.2 });
      }
    });
  });

  return (
    <section className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="kicker fade-in">{hero.kicker}</p>
          <h1 id="hero-title">
            {hero.title.split(" ").map((w, i, all) => (
              <span key={i}>
                <span className="mask">
                  <span>{i >= all.length - 2 ? <em>{w}</em> : w}</span>
                </span>
                {i < all.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>
          <p className="lede fade-in">{hero.lede}</p>
          <div className="cta fade-in">
            <button type="button" className="btn primary magnetic" onClick={() => scrollToId("work")}>
              See the work
            </button>
            {profile.cvUrl && (
              <a className="btn secondary" href={asset(profile.cvUrl)} download>
                {profile.cvLabel}
              </a>
            )}
            <span className="icon-links">
              <a className="icon-link" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile (opens in a new tab)">
                <GitHubIcon />
              </a>
              <a className="icon-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in a new tab)">
                <LinkedInIcon />
              </a>
            </span>
          </div>
        </div>
        <figure className="portrait fade-in">
          <a href={profile.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Chat with Eslam Usama on WhatsApp (opens in a new tab)">
            <picture>
              <source type="image/webp" srcSet={`${asset("img/eslam-400.webp")} 400w, ${asset("img/eslam-800.webp")} 800w`} sizes="(max-width: 900px) 280px, 400px" />
              <img src={asset("img/eslam-profile.jpg")} alt="Portrait of Eslam Usama" width={800} height={800} fetchPriority="high" />
            </picture>
            <span className="portrait-badge">
              <WaIcon size={16} /> Chat on WhatsApp
            </span>
          </a>
        </figure>
      </div>
      <Waveform className="hero-wave" height={56} />
    </section>
  );
}
