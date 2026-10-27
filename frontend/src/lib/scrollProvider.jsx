import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const ScrollContext = createContext({ lenis: null, scrollTo: () => {} });

/**
 * SmoothScrollProvider
 * -------------------
 * Wires Lenis (smooth, momentum-based scrolling) into GSAP's ScrollTrigger.
 *
 * Why this matters:
 *  - Lenis owns the scroll position (rAF-driven, GPU friendly).
 *  - ScrollTrigger owns the "where am I in the document" calculation.
 *  - Both must share the SAME clock, otherwise scrubbed timelines desync from
 *    the actual scrollbar. We therefore drive Lenis from `gsap.ticker` and
 *    push Lenis scroll events back into `ScrollTrigger.update`.
 *
 * Accessibility: `prefers-reduced-motion` users keep native browser scrolling
 * (no hijacked wheel events) so the site never feels "off" to them.
 */
export const SmoothScrollProvider = ({ children }) => {
  const lenisRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      ScrollTrigger.refresh();
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    // Lenis -> ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // GSAP ticker -> Lenis (one rAF loop drives the whole page)
    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Layout can shift after fonts/images settle -> recompute trigger positions.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    const timer = window.setTimeout(refresh, 600);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReducedMotion]);

  const value = useMemo(
    () => ({
      getLenis: () => lenisRef.current,
      scrollTo: (target, options = {}) => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(target, { offset: 0, duration: 1.2, ...options });
        } else if (typeof target === 'string') {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' });
        }
      },
    }),
    []
  );

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
};

export const useSmoothScroll = () => useContext(ScrollContext);

export { gsap, ScrollTrigger };
export default SmoothScrollProvider;
