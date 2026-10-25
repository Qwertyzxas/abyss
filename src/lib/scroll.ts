import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function scrollToTarget(target: string | number) {
  const element = typeof target === "string" ? document.querySelector<HTMLElement>(target) : null;
  const offset = element && element.id !== "top" ? 96 : 0;
  const destination = element ? element.getBoundingClientRect().top + window.scrollY - offset : Number(target) || 0;

  if (!instance) {
    window.scrollTo({ top: destination, behavior: "smooth" });
    return;
  }

  const screens = Math.abs(destination - window.scrollY) / window.innerHeight;
  instance.scrollTo(destination, {
    duration: Math.min(5, Math.max(1.2, 0.9 + screens * 0.28)),
    easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  });
}
