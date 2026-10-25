"use client";

import { useLocale } from "@/lib/i18n";
import styles from "./Intro.module.css";

export function Intro() {
  const { t } = useLocale();

  return (
    <section className={`grid ${styles.intro}`} data-depth="0-0" data-reveal-group>
      <p className={styles.statement} data-reveal>
        {t.intro.statement}
      </p>
      <ul className={styles.figures}>
        {t.intro.figures.map((figure) => (
          <li key={figure.value} data-reveal>
            <span className={`display tabular ${styles.value}`}>{figure.value}</span>
            <span className={styles.label}>{figure.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
