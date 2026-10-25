"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { dive } from "@/lib/depth";
import { createPointCloud, smoothstep, wrapAroundCamera } from "./world";

const HEIGHT = 50;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uCameraY;
  uniform float uPixelRatio;
  uniform float uVisible;
  attribute float aSize;
  attribute float aSeed;
  varying float vAlpha;
  varying float vSeed;
  ${wrapAroundCamera}

  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.11 + aSeed * 40.0) * 1.4;
    p.y += sin(uTime * 0.07 + aSeed * 23.0) * 1.2;
    p.y = wrapY(p.y, uCameraY, ${HEIGHT.toFixed(1)});

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float speed = 0.35 + aSeed * 0.9;
    float blink = pow(max(0.0, sin(uTime * speed + aSeed * 57.0)), 14.0);
    float glow = 0.08 + blink;

    gl_PointSize = aSize * uPixelRatio * (18.0 / -mv.z) * (0.7 + blink * 0.6);
    vAlpha = glow * uVisible * smoothstep(-46.0, -10.0, mv.z) * (1.0 - smoothstep(-5.0, -1.0, mv.z));
    vSeed = aSeed;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying float vSeed;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float core = 1.0 - smoothstep(0.0, 0.5, d);
    core *= core;
    vec3 cyan = vec3(0.38, 0.95, 1.0);
    vec3 blue = vec3(0.22, 0.48, 1.0);
    vec3 mint = vec3(0.56, 0.96, 0.82);
    vec3 color = vSeed < 0.45 ? mix(cyan, blue, vSeed / 0.45) : mix(blue, mint, (vSeed - 0.45) / 0.55);
    gl_FragColor = vec4(color, core * vAlpha);
  }
`;

export function Bioluminescence({ count, timeScale }: { count: number; timeScale: number }) {
  const { gl } = useThree();
  const geometry = useMemo(
    () => createPointCloud(count, { width: 52, height: HEIGHT, depth: 36, zOffset: 4, minSize: 2, maxSize: 5.5 }),
    [count],
  );
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uCameraY: { value: 0 },
          uPixelRatio: { value: 1 },
          uVisible: { value: 0 },
        },
      }),
    [],
  );

  useFrame(({ camera, clock }) => {
    const u = material.uniforms;
    u.uTime.value = clock.elapsedTime * timeScale;
    u.uCameraY.value = camera.position.y;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uVisible.value = smoothstep(1.3, 2.3, dive.level);
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
