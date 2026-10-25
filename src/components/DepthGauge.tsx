"use client";

import { useEffect, useRef } from "react";
import { dive, forceOnNailKg, lightPercent, MAX_DEPTH, pressureBar, temperatureC } from "@/lib/depth";
import { useLocale } from "@/lib/i18n";
import styles from "./DepthGauge.module.css";

type Readouts = {
  root: HTMLElement | null;
  phase: HTMLElement | null;
  depth: HTMLElement | null;
  pressure: HTMLElement | null;
  temperature: HTMLElement | null;
  light: HTMLElement | null;
  nail: HTMLElement | null;
  fill: HTMLElement | null;
};

export function DepthGauge() {
  const { t, formatNumber } = useLocale();
  const refs = useRef<Readouts>({
    root: null,
    phase: null,
    depth: null,
    pressure: null,
    temperature: null,
    light: null,
    nail: null,
    fill: null,
  });

  useEffect(() => {
    const g = t.gauge;
    let frame = 0;
    let lastKey = "";
    const footer = document.querySelector("footer");

    const formatLight = (meters: number) => {
      const percent = lightPercent(meters);
      if (percent < 0.01) return formatNumber(0);
      return formatNumber(percent, percent >= 10 ? 0 : percent >= 1 ? 1 : 2);
    };

    const formatNail = (meters: number) => {
      const kg = forceOnNailKg(meters);
      return kg < 1000 ? `${formatNumber(kg)} ${g.kg}` : `${formatNumber(kg / 1000, 2)} ${g.tonnes}`;
    };

    const render = () => {
      frame = requestAnimationFrame(render);
      const r = refs.current;
      const meters = Math.round(dive.meters);
      const footerTop = footer?.getBoundingClientRect().top ?? Infinity;
      const visible = window.scrollY > window.innerHeight * 0.55 && footerTop > window.innerHeight * 0.7;
      const key = `${meters}|${dive.phase}|${visible}`;
      if (key === lastKey) return;
      lastKey = key;

      if (r.root) r.root.dataset.visible = String(visible);
      if (r.phase) r.phase.textContent = dive.phase === "ascent" ? g.ascent : g.descent;
      if (r.depth) r.depth.textContent = formatNumber(meters);
      if (r.pressure) r.pressure.textContent = `${formatNumber(pressureBar(meters), meters < 100 ? 1 : 0)} ${g.bar}`;
      if (r.temperature) r.temperature.textContent = `${formatNumber(temperatureC(meters), 1)} °C`;
      if (r.light) r.light.textContent = `${formatLight(meters)} %`;
      if (r.nail) r.nail.textContent = formatNail(meters);
      if (r.fill) r.fill.style.transform = `scaleX(${meters / MAX_DEPTH})`;
    };

    render();
    return () => cancelAnimationFrame(frame);
  }, [t, formatNumber]);

  const bind = (key: keyof Readouts) => (node: HTMLElement | null) => {
    refs.current[key] = node;
  };

  return (
    <aside className={styles.gauge} ref={bind("root")} data-visible="false" aria-hidden="true">
      <div className={styles.readout}>
        <p className={styles.phase} ref={bind("phase")}>
          {t.gauge.descent}
        </p>
        <p className={`${styles.depth} tabular`}>
          <span ref={bind("depth")}>0</span> {t.gauge.meters}
        </p>
        <dl className={`${styles.list} tabular`}>
          <div>
            <dt>{t.gauge.pressure}</dt>
            <dd ref={bind("pressure")} />
          </div>
          <div>
            <dt>{t.gauge.temperature}</dt>
            <dd ref={bind("temperature")} />
          </div>
          <div>
            <dt>{t.gauge.light}</dt>
            <dd ref={bind("light")} />
          </div>
          <div>
            <dt>{t.gauge.nail}</dt>
            <dd ref={bind("nail")} />
          </div>
        </dl>
      </div>
      <span className={styles.track}>
        <span className={styles.fill} ref={bind("fill")} />
      </span>
    </aside>
  );
}
