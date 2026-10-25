"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { dive } from "@/lib/depth";
import { smoothstep } from "./world";

const surfaceVertex = /* glsl */ `
  varying vec3 vWorld;

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const surfaceFragment = /* glsl */ `
  uniform float uTime;
  uniform float uVisible;
  uniform vec3 uCamera;
  varying vec3 vWorld;

  float ripples(vec2 p, float t) {
    float a = sin(p.x * 0.9 + sin(p.y * 0.7 + t * 0.8) * 1.6);
    float b = sin(p.y * 1.1 + sin(p.x * 0.5 - t * 0.6) * 1.8);
    float c = sin((p.x + p.y) * 0.6 + t * 0.4);
    return a * b * 0.7 + c * 0.3;
  }

  void main() {
    float t = uTime;
    float pattern = abs(ripples(vWorld.xz * 0.22, t));
    float caustic = pow(1.0 - pattern, 3.0);
    float distanceFade = 1.0 - smoothstep(14.0, 70.0, length(vWorld - uCamera));
    vec3 color = mix(vec3(0.35, 0.78, 0.84), vec3(0.9, 1.0, 1.0), caustic);
    float alpha = (0.16 + caustic * 0.22) * distanceFade * uVisible;
    gl_FragColor = vec4(color, alpha);
  }
`;

const rayVertex = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const rayFragment = /* glsl */ `
  uniform float uTime;
  uniform float uVisible;
  uniform float uSeed;
  varying vec2 vUv;

  void main() {
    float across = sin(vUv.x * 3.14159);
    across *= across;
    float along = pow(vUv.y, 1.8);
    float shimmer = 0.62 + 0.38 * sin(uTime * 0.45 + uSeed * 9.0 + vUv.y * 2.0);
    gl_FragColor = vec4(vec3(0.78, 0.97, 1.0), across * along * shimmer * 0.16 * uVisible);
  }
`;

type RayConfig = { x: number; z: number; width: number; tilt: number; seed: number };

const rays: RayConfig[] = [
  { x: -15, z: -18, width: 4.5, tilt: 0.22, seed: 0.1 },
  { x: -8, z: -12, width: 2.2, tilt: 0.26, seed: 0.4 },
  { x: -2, z: -22, width: 5.5, tilt: 0.2, seed: 0.7 },
  { x: 5, z: -14, width: 2.8, tilt: 0.24, seed: 0.2 },
  { x: 11, z: -20, width: 4, tilt: 0.21, seed: 0.9 },
  { x: 18, z: -16, width: 3, tilt: 0.25, seed: 0.55 },
];

export function SurfaceLight({ timeScale }: { timeScale: number }) {
  const group = useRef<THREE.Group>(null);

  const surfaceMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: surfaceVertex,
        fragmentShader: surfaceFragment,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uVisible: { value: 1 }, uCamera: { value: new THREE.Vector3() } },
      }),
    [],
  );

  const rayMaterials = useMemo(
    () =>
      rays.map(
        (ray) =>
          new THREE.ShaderMaterial({
            vertexShader: rayVertex,
            fragmentShader: rayFragment,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            uniforms: { uTime: { value: 0 }, uVisible: { value: 1 }, uSeed: { value: ray.seed } },
          }),
      ),
    [],
  );

  useFrame(({ clock, camera }) => {
    const time = clock.elapsedTime * timeScale;
    const surfaceVisible = 1 - smoothstep(0.25, 0.9, dive.level);
    const raysVisible = 1 - smoothstep(0.5, 1.4, dive.level);

    surfaceMaterial.uniforms.uTime.value = time;
    surfaceMaterial.uniforms.uVisible.value = surfaceVisible;
    surfaceMaterial.uniforms.uCamera.value.copy(camera.position);

    rayMaterials.forEach((material) => {
      material.uniforms.uTime.value = time;
      material.uniforms.uVisible.value = raysVisible;
    });

    if (group.current) {
      group.current.visible = raysVisible > 0.001 || surfaceVisible > 0.001;
      group.current.rotation.z = Math.sin(time * 0.05) * 0.03;
    }
  });

  return (
    <group ref={group}>
      <mesh position={[0, 6, -20]} rotation={[Math.PI / 2, 0, 0]} material={surfaceMaterial}>
        <planeGeometry args={[220, 160, 1, 1]} />
      </mesh>
      {rays.map((ray, index) => (
        <mesh
          key={index}
          position={[ray.x, -24, ray.z]}
          rotation={[0, 0, ray.tilt]}
          material={rayMaterials[index]}
        >
          <planeGeometry args={[ray.width, 64, 1, 1]} />
        </mesh>
      ))}
    </group>
  );
}
