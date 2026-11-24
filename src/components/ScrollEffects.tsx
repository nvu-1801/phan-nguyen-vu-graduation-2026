"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollEffects() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    let alive = true;
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const compact = window.innerWidth < 768;
      const context = gsap.context(() => {
        gsap.from(".hero-copy > *", { y: 26, opacity: .35, stagger: .09, duration: .9, ease: "power3.out" });
        gsap.to(".hero-frame", { y: compact ? 28 : 90, rotation: 3, ease: "none", scrollTrigger: { trigger: ".hero-surface", start: "top top", end: "bottom top", scrub: .6 } });
        gsap.to(".hero-orbit", { rotation: 100, scale: 1.15, ease: "none", scrollTrigger: { trigger: ".hero-surface", start: "top top", end: "bottom top", scrub: .8 } });
        gsap.to(".scroll-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: .2 } });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(element => {
          gsap.from(element, { y: compact ? 20 : 45, opacity: .3, duration: .8, ease: "power2.out", scrollTrigger: { trigger: element, start: "top 92%", toggleActions: "play none none reverse" } });
        });
        gsap.utils.toArray<HTMLElement>(".landscape").forEach(element => {
          const image = element.querySelector(".landscape-image");
          if (image) gsap.fromTo(image, { yPercent: -7, scale: 1.12 }, { yPercent: 7, scale: 1.02, ease: "none", scrollTrigger: { trigger: element, start: "top bottom", end: "bottom top", scrub: .65 } });
        });
        gsap.fromTo(".campus-window", { clipPath: compact ? "inset(0% 3% round 28px)" : "inset(0% 12% round 120px)" }, { clipPath: "inset(0% 0% round 24px)", ease: "none", scrollTrigger: { trigger: ".campus", start: "top 85%", end: "center center", scrub: .6 } });
        gsap.utils.toArray<HTMLElement>("[data-memory-card]").forEach((card, index) => {
          gsap.fromTo(card,
            { y: compact ? 28 : 70, rotationX: compact ? 2 : 7, rotationY: compact ? (index % 2 ? 2 : -2) : (index % 2 ? 5 : -5), opacity: .35 },
            { y: 0, rotationX: 0, rotationY: 0, opacity: 1, duration: .9, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 94%", toggleActions: "play none none reverse" } },
          );
        });
        gsap.fromTo(".event-ticket", { rotationX: 7, rotationY: -4, y: 45 }, { rotationX: 0, rotationY: 0, y: 0, ease: "none", scrollTrigger: { trigger: ".event-section", start: "top 85%", end: "center 55%", scrub: .5 } });
        gsap.from(".letter-copy > p", { y: 30, opacity: .25, stagger: .14, duration: .9, scrollTrigger: { trigger: ".letter-copy", start: "top 85%", toggleActions: "play none none reverse" } });
        gsap.fromTo(".letter-copy", { y: compact ? 20 : 35, rotationY: compact ? 0 : -3, opacity: .4 }, { y: 0, rotationY: 0, opacity: 1, duration: .9, ease: "power3.out", scrollTrigger: { trigger: ".letter-copy", start: "top 90%", toggleActions: "play none none reverse" } });
        gsap.utils.toArray<HTMLElement>(".guest-wishes article").forEach((card, index) => {
          gsap.fromTo(card,
            { y: compact ? 22 : 44, rotationX: compact ? 0 : 5, rotationY: compact ? 0 : index === 1 ? 2 : -2, opacity: .35 },
            { y: 0, rotationX: 0, rotationY: 0, opacity: 1, duration: .8, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none reverse" } },
          );
        });
        gsap.utils.toArray<HTMLElement>(".guest-form, .contact-card").forEach(card => {
          gsap.fromTo(card, { y: compact ? 18 : 36, rotationX: compact ? 0 : 3, opacity: .4 }, { y: 0, rotationX: 0, opacity: 1, duration: .85, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none reverse" } });
        });
        gsap.fromTo(".venue-map", { y: compact ? 18 : 40, rotationY: compact ? 0 : 4, opacity: .35 }, { y: 0, rotationY: 0, opacity: 1, duration: .9, ease: "power3.out", scrollTrigger: { trigger: ".venue-map", start: "top 88%", toggleActions: "play none none reverse" } });
        gsap.to(".story-watermark", { xPercent: compact ? -8 : -22, ease: "none", scrollTrigger: { trigger: ".story", start: "top bottom", end: "bottom top", scrub: .8 } });
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
