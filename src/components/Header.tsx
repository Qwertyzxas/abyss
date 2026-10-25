"use client";

import { useEffect, useRef, useState } from "react";
import { OceanAmbience } from "@/lib/ambience";
import { useLocale } from "@/lib/i18n";
import styles from "./Header.module.css";

export function Header() {
  const { t, toggle } = useLocale();
  const [hidden, setHidden] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const ambience = useRef<OceanAmbience | null>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 6) return;
      setHidden(y > lastY && y > window.innerHeight * 0.4);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.header = hidden ? "hidden" : "shown";
  }, [hidden]);

  const toggleSound = async () => {
    ambience.current ??= new OceanAmbience();
    if (soundOn) {
      setSoundOn(false);
      await ambience.current.stop();
    } else {
      setSoundOn(true);
      await ambience.current.start();
    }
  };

  return (
    <header className={styles.header} data-hidden={hidden}>
      <a className={styles.wordmark} href="#top">
        {t.nav.home}
      </a>
      <nav className={styles.nav} aria-label={t.footer.sections}>
        {t.nav.links.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className={styles.controls}>
        <button type="button" className={styles.toggle} onClick={toggle} aria-label={t.nav.languageLabel}>
          {t.nav.language}
        </button>
        <button type="button" className={styles.toggle} onClick={toggleSound} aria-pressed={soundOn}>
          <span className={styles.wave} data-on={soundOn} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {soundOn ? t.nav.soundOn : t.nav.soundOff}
        </button>
        <a className={`button ${styles.dive}`} href="#sunlight">
          {t.nav.dive}
        </a>
      </div>
    </header>
  );
}
