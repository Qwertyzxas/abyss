import { media } from "@/content/media";
import type { Shot } from "@/content/types";
import { asset } from "@/lib/asset";
import styles from "./Photo.module.css";

type PhotoProps = {
  shot: Shot;
  className?: string;
};

export function Photo({ shot, className }: PhotoProps) {
  const item = media[shot.key];

  return (
    <figure className={`${styles.photo} ${className ?? ""}`} data-treatment={item.treatment} data-reveal-group>
      <div className={styles.frame} data-reveal>
        {item.video ? (
          <video
            src={asset(item.video)}
            poster={asset(item.src)}
            width={item.width}
            height={item.height}
            aria-label={shot.alt}
            muted
            loop
            playsInline
            preload="none"
            data-loop
          />
        ) : (
          <img
            src={asset(item.src)}
            width={item.width}
            height={item.height}
            alt={shot.alt}
            loading="lazy"
            decoding="async"
            data-drift={item.treatment ? undefined : ""}
          />
        )}
      </div>
      <figcaption className={styles.caption} data-reveal>
        {shot.caption}
      </figcaption>
    </figure>
  );
}
