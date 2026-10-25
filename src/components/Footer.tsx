"use client";

import { media } from "@/content/media";
import { useLocale } from "@/lib/i18n";
import styles from "./Footer.module.css";

const blockHeights = [62, 74, 88, 100, 84, 70];
const blockTones = ["paper", "sand", "accent", "paper", "sand", "accent"] as const;

export function Footer() {
  const { t } = useLocale();
  const letters = Array.from(t.footer.wordmark.toUpperCase());

  return (
    <footer className={styles.footer} data-depth="200-0" data-phase="ascent">
      <div className={styles.mark} role="img" aria-label={t.footer.wordmark}>
        {letters.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className={styles.block}
            data-block
            data-tone={blockTones[index % blockTones.length]}
            style={{ height: `${blockHeights[index % blockHeights.length]}%` }}
          >
            {letter}
          </span>
        ))}
      </div>

      <div className={styles.columns}>
        <nav className={styles.column} aria-label={t.footer.sections}>
          <h2 className={styles.columnTitle}>{t.footer.sections}</h2>
          <ul>
            {t.nav.links.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.column}>
          <h2 className={styles.columnTitle}>{t.footer.project}</h2>
          <ul>
            {t.footer.projectLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.credits}>
          <h2 className={styles.columnTitle}>{t.footer.credits}</h2>
          <ul>
            {Object.values(media).map(({ credit }) => (
              <li key={credit.page}>
                <a href={credit.page} target="_blank" rel="noreferrer">
                  {credit.title}
                </a>
                {`, ${credit.author}, ${credit.license}`}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>{t.footer.made}</p>
        <a className="button" href="#top">
          {t.footer.surface}
        </a>
      </div>
    </footer>
  );
}
