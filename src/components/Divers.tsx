"use client";

import { useEffect, useState } from "react";
import { media } from "@/content/media";
import { asset } from "@/lib/asset";
import { dive } from "@/lib/depth";
import { useLocale } from "@/lib/i18n";
import styles from "./Divers.module.css";

const tones = ["sand", "accent", "deep", "paper"] as const;

function useDeepestThisVisit() {
  const [meters, setMeters] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setMeters(Math.round(dive.maxMeters)), 400);
    return () => window.clearInterval(id);
  }, []);
  return meters;
}

export function Divers() {
  const { t, formatNumber } = useLocale();
  const deepest = formatNumber(useDeepestThisVisit());

  return (
    <section id="divers" className={styles.section} data-depth="10935-4000" data-phase="ascent" aria-labelledby="divers-title">
      <h2 id="divers-title" className={`display ${styles.title}`} data-reveal-group>
        <span data-reveal>{t.divers.heading}</span>
      </h2>
      <ul className={styles.people} data-reveal-group>
        {t.divers.people.map((person, index) => {
          const photo = person.key ? media[person.key] : null;
          return (
            <li key={person.name} className={styles.person} data-reveal>
              <div className={styles.portrait} data-tone={tones[index % tones.length]}>
                {photo ? (
                  <img src={asset(photo.src)} width={photo.width} height={photo.height} alt={person.alt ?? ""} loading="lazy" />
                ) : (
                  <span className="display tabular">{person.mark}</span>
                )}
              </div>
              <p className={styles.name}>{person.name}</p>
              <p className={styles.role}>{person.role}</p>
            </li>
          );
        })}
        <li className={styles.person} data-reveal>
          <div className={styles.portrait} data-tone="paper" aria-live="polite">
            <span className="display tabular">{deepest}</span>
          </div>
          <p className={styles.name}>{t.divers.you.name}</p>
          <p className={styles.role}>{t.divers.you.role(deepest)}</p>
        </li>
      </ul>
    </section>
  );
}
