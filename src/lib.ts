import { useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export const SITE = "https://eslamusamaaa.github.io";

/** Public asset URL that works on every route. */
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, "")}`;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const finePointer = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/** Title, description and canonical URL for the current route. */
export function usePageMeta(title: string, description: string, path: string) {
  useEffect(() => {
    document.title = title;
    const set = (sel: string, attr: string, value: string) => document.querySelector(sel)?.setAttribute(attr, value);
    set('meta[name="description"]', "content", description);
    set('meta[property="og:title"]', "content", title);
    set('meta[property="og:description"]', "content", description);
    set('meta[name="twitter:title"]', "content", title);
    set('meta[name="twitter:description"]', "content", description);
    set('meta[property="og:url"]', "content", `${SITE}${path}`);
    set('link[rel="canonical"]', "href", `${SITE}${path}`);
  }, [title, description, path]);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}

/**
 * Runs GSAP code inside a context scoped to `scope`, only when motion is allowed.
 * Everything is reverted on unmount or route change so ScrollTriggers never leak.
 */
export function useMotion(scope: React.RefObject<HTMLElement | null>, setup: (mm: gsap.MatchMedia) => void, deps: unknown[] = []) {
  useLayoutEffect(() => {
    if (!scope.current) return;
    const mm = gsap.matchMedia(scope.current);
    setup(mm);
    let cancelled = false;
    const refresh = () => !cancelled && ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("load", refresh);
      mm.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export const MOTION = "(prefers-reduced-motion: no-preference)";
