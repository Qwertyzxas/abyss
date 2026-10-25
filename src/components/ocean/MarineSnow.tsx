"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { dive } from "@/lib/depth";
import { createPointCloud, shaderColor, smoothstep, wrapAroundCamera } from "./world";

const HEIGHT = 44;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uCameraY;
  uniform float uPixelRatio;
  uniform float uAspect;
  uniform float uDark;
  uniform vec2 uPointer;
  attribute float aSize;
  attribute float aSeed;
  varying float vAlpha;
  ${wrapAroundCamera}

  void main() {
    vec3 p = position;
    p.y -= uTime * (0.08 + aSeed * 0.12);
    p.x += sin(uTime * 0.21 + aSeed * 31.0) * 0.6;
    p.z += cos(uTime * 0.17 + aSeed * 17.0) * 0.4;
    p.y = wrapY(p.y, uCameraY, ${HEIGHT.toFixed(1)});

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * (16.0 / -mv.z);

    vec2 ndc = gl_Position.xy / gl_Position.w;
    vec2 delta = (ndc - uPointer) * vec2(uAspect, 1.0);
    float torch = 1.0 - smoothstep(0.0, 0.55, length(delta));

    float ambient = (0.28 + aSeed * 0.4) * (1.0 - uDark * 0.82);
    vAlpha = (ambient + torch * uDark * 1.1) * smoothstep(-40.0, -9.0, mv.z) * (1.0 - smoothstep(-4.0, -1.0, mv.z));
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = 1.0 - smoothstep(0.05, 0.5, d);
    gl_FragColor = vec4(uColor, disc * vAlpha);
  }
`;

export function MarineSnow({ count, timeScale }: { count: number; timeScale: number }) {
  const { gl, size } = useThree();
  const geometry = useMemo(
    () => createPointCloud(count, { width: 46, height: HEIGHT, depth: 34, zOffset: 8, minSize: 0.6, maxSize: 2.6 }),
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
          uAspect: { value: 1 },
          uDark: { value: 0 },
          uPointer: { value: new THREE.Vector2(10, 10) },
          uColor: { value: shaderColor("#dff6f2") },
        },
      }),
    [],
  );

  useFrame(({ camera, clock }) => {
    const u = material.uniforms;
    u.uTime.value = clock.elapsedTime * timeScale;
    u.uCameraY.value = camera.position.y;
    u.uPixelRatio.value = gl.getPixelRatio();
    u.uAspect.value = size.width / size.height;
    u.uDark.value = smoothstep(0.9, 2.1, dive.level);
    if (dive.pointerActive) u.uPointer.value.set(dive.pointerX, dive.pointerY);
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
