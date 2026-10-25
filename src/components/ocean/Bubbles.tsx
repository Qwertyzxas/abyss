"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { dive } from "@/lib/depth";
import { createPointCloud, smoothstep, wrapAroundCamera } from "./world";

const HEIGHT = 36;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uCameraY;
  uniform float uPixelRatio;
  uniform float uVisible;
  attribute float aSize;
  attribute float aSeed;
  varying float vAlpha;
  ${wrapAroundCamera}

  void main() {
    vec3 p = position;
    p.y += uTime * (0.9 + aSeed * 1.3);
    p.x += sin(uTime * 2.2 + aSeed * 50.0) * 0.12;
    p.y = wrapY(p.y, uCameraY, ${HEIGHT.toFixed(1)});

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (16.0 / -mv.z);
    vAlpha = uVisible * (0.35 + aSeed * 0.4) * smoothstep(-30.0, -6.0, mv.z) * (1.0 - smoothstep(-4.0, -1.0, mv.z));
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float rim = (1.0 - smoothstep(0.42, 0.5, d)) - (1.0 - smoothstep(0.18, 0.4, d)) * 0.75;
    float highlight = 1.0 - smoothstep(0.0, 0.14, length(gl_PointCoord - vec2(0.36, 0.34)));
    gl_FragColor = vec4(vec3(0.92, 0.99, 1.0), (rim + highlight) * vAlpha);
  }
`;

export function Bubbles({ count, timeScale }: { count: number; timeScale: number }) {
  const { gl } = useThree();
  const geometry = useMemo(
    () => createPointCloud(count, { width: 34, height: HEIGHT, depth: 22, zOffset: 4, minSize: 1.2, maxSize: 4.2 }),
    [count],
  );
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uCameraY: { value: 0 },
          uPixelRatio: { value: 1 },
          uVisible: { value: 1 },
        },
      }),
    [],
  );

  useFrame(({ camera, clock }) => {
    const u = material.uniforms;
    u.uTime.value = clock.elapsedTime * timeScale;
    u.uCameraY.value = camera.position.y;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uVisible.value = 1 - smoothstep(0.15, 0.75, dive.level);
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
