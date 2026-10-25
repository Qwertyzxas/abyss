"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export function Choreography() {
  useEffect(() => {
    const loops = document.querySelectorAll<HTMLVideoElement>("video[data-loop]");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (calm) {
      loops.forEach((video) => {
        video.preload = "metadata";
        video.controls = true;
      });
      return;
    }

    const playWhenVisible = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          const video = target as HTMLVideoElement;
          if (isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { rootMargin: "200px 0px" },
    );
    loops.forEach((video) => playWhenVisible.observe(video));

    const context = gsap.context(() => {
      gsap.from("[data-hero-line] > span", {
        yPercent: 108,
        duration: 1.15,
        ease: "expo.out",
        stagger: 0.11,
        delay: 0.3,
      });

      gsap.from("[data-hero-after]", {
        autoAlpha: 0,
        y: 18,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        delay: 1,
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        const items = group.querySelectorAll("[data-reveal]");
        if (items.length === 0) return;
        gsap.from(items, {
          autoAlpha: 0,
          y: 28,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: "top 80%", once: true },
        });
      });

      gsap.from("[data-block]", {
        scaleY: 0.2,
        autoAlpha: 0,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: "[data-block]", start: "top 92%", once: true },
      });

      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((image) => {
        gsap.fromTo(
          image,
          { scale: 1.14, yPercent: -3 },
          {
            scale: 1.02,
            yPercent: 3,
            ease: "none",
            scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 1.6 },
          },
        );
      });
    });

    return () => {
      playWhenVisible.disconnect();
      context.revert();
    };
  }, []);

  return null;
}
