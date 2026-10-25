"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import { dive, measureDepthSpans, seaColorAt, stepDive, updateDiveTarget } from "@/lib/depth";
import { scrollToTarget, setLenis } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export function DiveController() {
  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = calm ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4 });
    setLenis(lenis);

    const root = document.documentElement;
    let lastSea = "";
    let lastTime = performance.now();

    const onScroll = () => {
      updateDiveTarget(window.scrollY);
      ScrollTrigger.update();
    };

    const tick = (time: number) => {
      lenis?.raf(time * 1000);
      const now = performance.now();
      stepDive(Math.min(0.1, (now - lastTime) / 1000));
      lastTime = now;

      const [r, g, b] = seaColorAt(dive.level);
      const sea = `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
      if (sea !== lastSea) {
        root.style.setProperty("--sea", sea);
        lastSea = sea;
      }
    };

    const remeasure = () => {
      measureDepthSpans();
      updateDiveTarget(window.scrollY);
      ScrollTrigger.refresh();
    };

    const onAnchorClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
      const href = link?.getAttribute("href");
      if (!href || href === "#") return;
      if (!document.querySelector(href)) return;
      event.preventDefault();
      scrollToTarget(href);
      history.replaceState(null, "", href);
    };

    if (lenis) lenis.on("scroll", onScroll);
    else window.addEventListener("scroll", onScroll, { passive: true });

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const resizeObserver = new ResizeObserver(remeasure);
    resizeObserver.observe(document.body);
    document.fonts?.ready.then(remeasure);
    document.addEventListener("click", onAnchorClick);

    remeasure();
    dive.meters = dive.target;

    return () => {
      gsap.ticker.remove(tick);
      resizeObserver.disconnect();
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("scroll", onScroll);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
