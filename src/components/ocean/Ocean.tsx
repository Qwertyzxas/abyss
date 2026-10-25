"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { dive } from "@/lib/depth";
import { Bioluminescence } from "./Bioluminescence";
import { Bubbles } from "./Bubbles";
import { JellyField } from "./Jellyfish";
import { MarineSnow } from "./MarineSnow";
import { Rig } from "./Rig";
import { Seafloor } from "./Seafloor";
import { SurfaceLight } from "./SurfaceLight";
import styles from "./Ocean.module.css";

type Budget = { snow: number; sparks: number; bubbles: number; timeScale: number };

function pickBudget(): Budget {
  const compact = window.matchMedia("(max-width: 760px)").matches;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return {
    snow: compact ? 700 : 1600,
    sparks: compact ? 140 : 320,
    bubbles: compact ? 60 : 140,
    timeScale: calm ? 0.25 : 1,
  };
}

export default function Ocean() {
  const [budget, setBudget] = useState<Budget | null>(null);

  useEffect(() => {
    setBudget(pickBudget());

    const onPointerMove = (event: PointerEvent) => {
      dive.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      dive.pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
      dive.pointerActive = true;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  if (!budget) return null;

  return (
    <div className={styles.ocean} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
        camera={{ fov: 55, near: 0.1, far: 140, position: [0, 0, 12] }}
      >
        <Rig />
        <SurfaceLight timeScale={budget.timeScale} />
        <Bubbles count={budget.bubbles} timeScale={budget.timeScale} />
        <MarineSnow count={budget.snow} timeScale={budget.timeScale} />
        <Bioluminescence count={budget.sparks} timeScale={budget.timeScale} />
        <JellyField timeScale={budget.timeScale} />
        <Seafloor />
      </Canvas>
    </div>
  );
}
