"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { shaderColor, worldYAt } from "./world";

const bellVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vDistance;

  void main() {
    float pulse = sin(uTime * 1.5 + uPhase);
    float rim = 1.0 - position.y;
    vec3 p = position;
    p.xz *= 1.0 + pulse * 0.13 * rim;
    p.y *= 1.0 - pulse * 0.09;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vDistance = length(mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const bellFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vDistance;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vView)), 2.2);
    vec3 color = uColor * (0.3 + fresnel * 1.3) + vec3(pow(fresnel, 6.0) * 0.35);
    float fade = 1.0 - smoothstep(16.0, 46.0, vDistance);
    gl_FragColor = vec4(color, (0.14 + fresnel * 0.7) * fade);
  }
`;

const tentacleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  attribute float aAlong;
  attribute float aAngle;
  varying float vAlong;
  varying float vDistance;

  void main() {
    float sway = uTime * 1.1 + uPhase + aAngle * 2.0;
    vec3 p = position;
    p.x += sin(sway + aAlong * 5.0) * 0.28 * aAlong;
    p.z += cos(sway * 0.8 + aAlong * 4.0) * 0.22 * aAlong;
    p.xz *= 1.0 + sin(uTime * 1.5 + uPhase - 0.6) * 0.08 * (1.0 - aAlong);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vAlong = aAlong;
    vDistance = length(mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const tentacleFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlong;
  varying float vDistance;

  void main() {
    float fade = 1.0 - smoothstep(16.0, 46.0, vDistance);
    gl_FragColor = vec4(uColor, (1.0 - vAlong) * 0.55 * fade);
  }
`;

function createTentacles(count: number, segments: number, radius: number, length: number) {
  const positions: number[] = [];
  const along: number[] = [];
  const angles: number[] = [];

  for (let t = 0; t < count; t++) {
    const angle = (t / count) * Math.PI * 2;
    const reach = length * (0.65 + ((t * 37) % 10) / 28);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    for (let s = 0; s < segments; s++) {
      for (const k of [s, s + 1]) {
        const a = k / segments;
        positions.push(x * (1 - a * 0.35), -a * reach, z * (1 - a * 0.35));
        along.push(a);
        angles.push(angle);
      }
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aAlong", new THREE.Float32BufferAttribute(along, 1));
  geometry.setAttribute("aAngle", new THREE.Float32BufferAttribute(angles, 1));
  return geometry;
}

type JellyProps = {
  level: number;
  x: number;
  z: number;
  scale: number;
  color: string;
  phase: number;
  timeScale: number;
};

function Jelly({ level, x, z, scale, color, phase, timeScale }: JellyProps) {
  const group = useRef<THREE.Group>(null);
  const baseY = worldYAt(level);

  const [bellMaterial, tentacleMaterial] = useMemo(() => {
    const uniforms = {
      uTime: { value: 0 },
      uPhase: { value: phase },
      uColor: { value: shaderColor(color) },
    };
    const shared = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms };
    return [
      new THREE.ShaderMaterial({ ...shared, vertexShader: bellVertex, fragmentShader: bellFragment, side: THREE.DoubleSide }),
      new THREE.ShaderMaterial({ ...shared, vertexShader: tentacleVertex, fragmentShader: tentacleFragment }),
    ];
  }, [color, phase]);

  const tentacles = useMemo(() => createTentacles(14, 24, 0.82, 4.2), []);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime * timeScale;
    bellMaterial.uniforms.uTime.value = time;
    if (!group.current) return;
    group.current.position.set(
      x + Math.sin(time * 0.06 + phase) * 1.6,
      baseY + Math.sin(time * 0.32 + phase) * 1.1,
      z,
    );
    group.current.rotation.z = Math.sin(time * 0.2 + phase) * 0.12;
    group.current.rotation.x = Math.cos(time * 0.17 + phase) * 0.1;
  });

  return (
    <group ref={group} scale={scale}>
      <mesh material={bellMaterial}>
        <sphereGeometry args={[1, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <lineSegments geometry={tentacles} material={tentacleMaterial} />
    </group>
  );
}

const swarm: Omit<JellyProps, "timeScale">[] = [
  { level: 1.35, x: 13, z: -12, scale: 1.2, color: "#ff7a4d", phase: 0.4 },
  { level: 1.75, x: -14, z: -15, scale: 0.85, color: "#ff9a66", phase: 2.1 },
  { level: 2.35, x: 14, z: -14, scale: 1.4, color: "#ffc35a", phase: 1.2 },
  { level: 2.85, x: -12.5, z: -11, scale: 1, color: "#5fe3ff", phase: 3.3 },
  { level: 3.55, x: 13.5, z: -16, scale: 1.25, color: "#8ff5e0", phase: 4.4 },
  { level: 4.4, x: -13, z: -14, scale: 0.9, color: "#5fa8ff", phase: 5.1 },
];

export function JellyField({ timeScale }: { timeScale: number }) {
  return (
    <>
      {swarm.map((jelly, index) => (
        <Jelly key={index} {...jelly} timeScale={timeScale} />
      ))}
    </>
  );
}
