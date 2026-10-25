"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { dive, seaColorAt } from "@/lib/depth";
import { smoothstep, worldYAt } from "./world";

const noise = /* glsl */ `
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float terrain(vec2 p) {
    float h = valueNoise(p * 0.05) * 5.0;
    h += valueNoise(p * 0.16) * 1.4;
    h += valueNoise(p * 0.6) * 0.25;
    return h;
  }
`;

const vertexShader = /* glsl */ `
  varying vec3 vWorld;
  ${noise}

  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    world.y += terrain(world.xz);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uLamp;
  uniform vec3 uWater;
  uniform float uVisible;
  varying vec3 vWorld;
  ${noise}

  void main() {
    vec3 normal = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
    vec3 toLamp = uLamp - vWorld;
    float lampDistance = length(toLamp);
    float diffuse = max(dot(normal, toLamp / lampDistance), 0.0);
    float falloff = 1.0 / (1.0 + lampDistance * lampDistance * 0.006);

    float grain = valueNoise(vWorld.xz * 3.0) * 0.18 + valueNoise(vWorld.xz * 0.4) * 0.25;
    vec3 silt = vec3(0.46, 0.43, 0.36) * (0.75 + grain);
    vec3 lit = silt * (0.04 + diffuse * falloff * 2.4);

    float haze = 1.0 - exp(-lampDistance * 0.045);
    gl_FragColor = vec4(mix(lit, uWater, haze), uVisible);
  }
`;

export function Seafloor() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        uniforms: {
          uLamp: { value: new THREE.Vector3() },
          uWater: { value: new THREE.Color() },
          uVisible: { value: 0 },
        },
      }),
    [],
  );

  useFrame(({ camera }) => {
    const visible = smoothstep(4.1, 4.8, dive.level);
    material.uniforms.uVisible.value = visible;
    material.uniforms.uLamp.value.set(camera.position.x, camera.position.y + 1.5, camera.position.z - 7);
    const [r, g, b] = seaColorAt(dive.level);
    material.uniforms.uWater.value.setRGB(r / 255, g / 255, b / 255);
  });

  return (
    <mesh position={[0, worldYAt(5) - 9, -30]} rotation={[-Math.PI / 2, 0, 0]} material={material}>
      <planeGeometry args={[180, 120, 220, 150]} />
    </mesh>
  );
}
