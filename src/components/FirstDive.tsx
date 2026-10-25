"use client";

import { media } from "@/content/media";
import { asset } from "@/lib/asset";
import { useLocale } from "@/lib/i18n";
import styles from "./FirstDive.module.css";

export function FirstDive() {
  const { t } = useLocale();
  const { heading, shot, figures } = t.firstDive;
  const photo = media[shot.key];

  return (
    <section className={styles.section} data-depth="10935-10935" aria-labelledby="first-dive-title">
      <h2 id="first-dive-title" className={`display ${styles.title}`} data-reveal-group>
        <span data-reveal>{heading}</span>
      </h2>
      <div className={styles.mosaic} data-reveal-group>
        <figure className={styles.photo} data-reveal>
          <img src={asset(photo.src)} width={photo.width} height={photo.height} alt={shot.alt} loading="lazy" data-drift />
        </figure>
        {figures.map((figure, index) => (
          <p key={figure.value} className={styles.tile} data-tone={index === 0 ? "sand" : "deep"} data-reveal>
            <span className="display tabular">{figure.value}</span>
            <span className={styles.label}>{figure.label}</span>
          </p>
        ))}
      </div>
      <p className={styles.caption}>{shot.caption}</p>
    </section>
  );
}
