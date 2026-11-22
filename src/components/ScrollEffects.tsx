"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollEffects() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let alive = true;
    media.add({ desktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)", compact: "(max-width: 767px) and (prefers-reduced-motion: no-preference)" }, ({ conditions }) => {
      const compact = Boolean(conditions?.compact);
      const context = gsap.context(() => {
        if (!compact) gsap.from(".hero-art", { y: 18, opacity: .75, duration: .65, ease: "power2.out" });
        if (!compact) gsap.to(".hero-frame", { y: 44, rotation: 3, ease: "none", scrollTrigger: { trigger: ".hero-surface", start: "top top", end: "bottom top", scrub: .6 } });
        if (!compact) gsap.to(".hero-orbit", { rotation: 35, scale: 1.05, ease: "none", scrollTrigger: { trigger: ".hero-surface", start: "top top", end: "bottom top", scrub: .8 } });
        gsap.to(".scroll-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: .2 } });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(element => {
          if (!compact) gsap.from(element, { y: 16, duration: .5, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 92%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>(".landscape").forEach(element => {
          const image = element.querySelector(".landscape-image");
          if (image && !compact) gsap.fromTo(image, { yPercent: -7, scale: 1.12 }, { yPercent: 7, scale: 1.02, ease: "none", scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: .65 } });
        });
        if (!compact) gsap.fromTo(".campus-window", { clipPath: compact ? "inset(0% 3% round 28px)" : "inset(0% 12% round 120px)" }, { clipPath: "inset(0% 0% round 24px)", ease: "none", scrollTrigger: { trigger: ".campus", start: "top 85%", end: "center center", scrub: .6 } });
        if (!compact) gsap.fromTo(".event-ticket", { rotationX: 7, rotationY: -4, y: 45 }, { rotationX: 0, rotationY: 0, y: 0, ease: "none", scrollTrigger: { trigger: ".event-section", start: "top 85%", end: "center 55%", scrub: .5 } });
        if (!compact) gsap.to(".story-watermark", { xPercent: -12, ease: "none", scrollTrigger: { trigger: ".story", start: "top bottom", end: "bottom top", scrub: .8 } });
      });
      document.documentElement.dataset.motionReady = "true";
      return () => { context.revert(); delete document.documentElement.dataset.motionReady; };
    });
    const refresh = () => { if (alive) ScrollTrigger.refresh(); };
    void document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => { alive = false; window.removeEventListener("load", refresh); media.revert(); };
  }, []);
  return <div className="scroll-progress" aria-hidden="true" />;
}
