"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { dive, seaColorAt } from "@/lib/depth";
import { smoothstep, worldYAt } from "./world";

export function Rig() {
  const { camera, scene } = useThree();
  const background = useMemo(() => new THREE.Color(), []);
  const fog = useMemo(() => new THREE.FogExp2(0x000000, 0.02), []);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    scene.background = background;
    scene.fog = fog;
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene, background, fog]);

  useFrame((_, delta) => {
    const level = dive.level;
    const [r, g, b] = seaColorAt(level);
    background.setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
    fog.color.copy(background);
    fog.density = 0.016 + level * 0.005;

    const ease = 1 - Math.exp(-delta * 1.6);
    pointer.current.x += (dive.pointerX - pointer.current.x) * ease;
    pointer.current.y += (dive.pointerY - pointer.current.y) * ease;

    const lookUp = 0.16 * (1 - smoothstep(0, 0.7, level));
    const lookDown = -0.24 * smoothstep(4.3, 5, level);

    camera.position.set(pointer.current.x * 0.9, worldYAt(level) + pointer.current.y * 0.5, 12);
    camera.rotation.set(lookUp + lookDown + pointer.current.y * 0.025, -pointer.current.x * 0.035, 0);
  });

  return null;
}
