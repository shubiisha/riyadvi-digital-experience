import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollReveal
 * ---------------
 * Reusable scroll-triggered entrance animation (GSAP + ScrollTrigger).
 * The element registered with the returned ref fades/rises into view once,
 * when it crosses the viewport. Fully respects `prefers-reduced-motion`.
 *
 * @param {object}  options
 * @param {number}  options.y        vertical offset in px (default 40)
 * @param {number}  options.duration animation duration in seconds
 * @param {string}  options.trigger ScrollTrigger start position
 * @param {number}  options.delay   delay in seconds
 * @param {number}  options.stagger  stagger between `[data-reveal-item]` children
 */
export const useScrollReveal = (options = {}) => {
  const {
    y = 40,
    duration = 0.9,
    trigger = 'top 85%',
    delay = 0,
    stagger = 0,
    scale = 1,
  } = options;

  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion) return undefined;

    const targets = stagger ? node.querySelectorAll('[data-reveal-item]') : [node];
    if (!targets.length) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y, scale: scale === 1 ? 1 : 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          delay,
          ease: 'power3.out',
          stagger,
          scrollTrigger: { trigger: node, start: trigger, once: true },
        }
      );
    }, node);

    return () => ctx.revert();
  }, [y, duration, trigger, delay, stagger, scale, prefersReducedMotion]);

  return ref;
};

export default useScrollReveal;
