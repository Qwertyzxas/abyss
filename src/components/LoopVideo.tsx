"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n";
import styles from "./Photo.module.css";

type LoopVideoProps = {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
};

const FULLY_VISIBLE = 0.96;
const MOSTLY_HIDDEN = 0.4;

export function LoopVideo({ src, poster, width, height, label }: LoopVideoProps) {
  const { t } = useLocale();
  const video = useRef<HTMLVideoElement>(null);
  const pausedByViewer = useRef(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const element = video.current;
    if (!element) return;

    const warmUp = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.preload = "auto";
        warmUp.disconnect();
      },
      { rootMargin: "100% 0px" },
    );

    const watch = new IntersectionObserver(
      ([entry]) => {
        const box = entry.boundingClientRect;
        const visible = entry.intersectionRect.height / Math.min(box.height, window.innerHeight);
        if (visible >= FULLY_VISIBLE && !pausedByViewer.current) element.play().catch(() => {});
        else if (visible < MOSTLY_HIDDEN) element.pause();
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
    );

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    element.addEventListener("play", onPlay);
    element.addEventListener("pause", onPause);
    warmUp.observe(element);
    watch.observe(element);

    return () => {
      warmUp.disconnect();
      watch.disconnect();
      element.removeEventListener("play", onPlay);
      element.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      pausedByViewer.current = false;
      element.play().catch(() => {});
    } else {
      pausedByViewer.current = true;
      element.pause();
    }
  };

  return (
    <>
      <div className={styles.frame} data-reveal>
        <video
          ref={video}
          src={src}
          poster={poster}
          width={width}
          height={height}
          aria-label={label}
          muted
          loop
          playsInline
          preload="none"
        />
      </div>
      <button type="button" className={styles.videoToggle} onClick={toggle} aria-pressed={playing} data-reveal>
        <svg viewBox="0 0 12 12" aria-hidden="true">
          {playing ? <path d="M2.5 1.5h2.4v9H2.5zM7.1 1.5h2.4v9H7.1z" /> : <path d="M3 1.2v9.6L10.6 6z" />}
        </svg>
        {playing ? t.video.pause : t.video.play}
      </button>
    </>
  );
}
