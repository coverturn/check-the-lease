import { useEffect } from "react";

/**
 * Progressive-enhancement scroll reveal.
 *
 * Content is VISIBLE BY DEFAULT (see .ctl-reveal in index.css). This hook only
 * adds a subtle entrance for elements that start below the viewport: they get
 * `.pre` (slightly faded + offset, never invisible) and animate to full via
 * `.is-visible` as they approach the viewport. If JS never runs, if the
 * observer misfires, or if the user prefers reduced motion, everything is
 * simply visible.
 */
export function useScrollReveal() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return; // base CSS already shows everything

    const els = Array.from(document.querySelectorAll<HTMLElement>(".ctl-reveal"));
    const vh = window.innerHeight;

    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("pre");
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        }),
      // Fire while the element is still ~12% below the fold so the entrance
      // has resolved by the time the reader reaches it.
      { rootMargin: "0px 0px 12% 0px", threshold: 0.01 },
    );

    els.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < vh * 0.92) {
        // Already on screen at mount: leave it fully visible, no animation.
        return;
      }
      el.classList.add("pre");
      obs.observe(el);
    });

    return () => obs.disconnect();
  }, []);
}
