"use client";

import { media } from "@/content/media";
import { asset } from "@/lib/asset";
import { useLocale } from "@/lib/i18n";
import styles from "./Bestiary.module.css";

const tones = ["paper", "deep", "accent", "sand"] as const;

export function Bestiary() {
  const { t } = useLocale();
  const { heading, lead, creatures } = t.bestiary;

  return (
    <section id="bestiary" className={styles.section} data-depth="4000-200" data-phase="ascent" aria-labelledby="bestiary-title">
      <header className={styles.head} data-reveal-group>
        <h2 id="bestiary-title" className={`display ${styles.title}`} data-reveal>
          {heading}
        </h2>
        <p className={styles.lead} data-reveal>
          {lead}
        </p>
      </header>
      <ul className={styles.tiles} data-reveal-group>
        {creatures.map((creature, index) => {
          const photo = media[creature.key];
          return (
            <li key={creature.key} className={styles.tile} data-reveal>
              <div className={styles.photo} data-plate={photo.plate ? "" : undefined}>
                <img src={asset(photo.src)} width={photo.width} height={photo.height} alt="" loading="lazy" />
              </div>
              <div className={styles.tag} data-tone={tones[index % tones.length]}>
                <p className={styles.row}>
                  <strong>{creature.name}</strong>
                  <span>{creature.latin}</span>
                </p>
                <p className={`${styles.row} tabular`}>
                  <span>{creature.depth}</span>
                  <span>{creature.size}</span>
                  <span>{creature.zone}</span>
                </p>
                <p className={styles.note}>{creature.note}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
