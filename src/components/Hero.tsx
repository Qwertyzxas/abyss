"use client";

import { useLocale } from "@/lib/i18n";
import styles from "./Hero.module.css";

export function Hero() {
  const { t } = useLocale();
  const [first, second] = t.hero.lines;

  return (
    <section id="top" className={styles.hero} data-depth="0-0">
      <h1 className={`display ${styles.title}`}>
        <span className={styles.line} data-hero-line>
          <span className="tabular">{first}</span>
        </span>
        <span className={`${styles.line} ${styles.dark}`} data-hero-line>
          <span>{second}</span>
        </span>
      </h1>
      <div className={styles.aside}>
        <p data-hero-after>{t.hero.lead}</p>
        <a className="button" href="#sunlight" data-hero-after>
          {t.hero.action}
        </a>
      </div>
    </section>
  );
}
