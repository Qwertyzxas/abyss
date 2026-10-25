import type { Zone } from "@/content/types";
import { Photo } from "./Photo";
import styles from "./ZoneSection.module.css";

export function ZoneSection({ zone }: { zone: Zone }) {
  const [firstLine, secondLine] = zone.heading;
  const [leadShot, ...moreShots] = zone.shots;
  const titleId = `${zone.id}-title`;

  return (
    <section
      id={zone.id}
      className={`grid ${styles.zone} ${styles[zone.layout]}`}
      data-depth={`${zone.depth[0]}-${zone.depth[1]}`}
      aria-labelledby={titleId}
    >
      <header className={styles.head} data-reveal-group>
        <h2 id={titleId} className={`display ${styles.title}`} data-reveal>
          {firstLine}
          {secondLine && (
            <>
              <br />
              {secondLine}
            </>
          )}
        </h2>
        <p className={styles.science} data-reveal>
          {zone.science}
        </p>
      </header>

      <div className={styles.text} data-reveal-group>
        {zone.body.map((paragraph) => (
          <p key={paragraph} data-reveal>
            {paragraph}
          </p>
        ))}
      </div>

      <p className={styles.stat} data-reveal-group>
        <span className="display tabular" data-reveal>
          {zone.figure.value}
        </span>
        <span className={styles.statLabel} data-reveal>
          {zone.figure.label}
        </span>
      </p>

      <Photo shot={leadShot} className={styles.lead} />

      {moreShots.length > 0 && (
        <div className={styles.more}>
          {moreShots.map((shot) => (
            <Photo key={shot.key} shot={shot} />
          ))}
        </div>
      )}
    </section>
  );
}
