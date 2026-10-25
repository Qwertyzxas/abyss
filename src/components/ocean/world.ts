import * as THREE from "three";

export const LEVEL_HEIGHT = 40;

export const worldYAt = (level: number) => -level * LEVEL_HEIGHT;

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

type CloudOptions = {
  width: number;
  height: number;
  depth: number;
  zOffset: number;
  minSize: number;
  maxSize: number;
};

export function createPointCloud(count: number, options: CloudOptions) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * options.width;
    positions[i * 3 + 1] = (Math.random() - 0.5) * options.height;
    positions[i * 3 + 2] = options.zOffset - Math.random() * options.depth;
    sizes[i] = options.minSize + Math.random() * (options.maxSize - options.minSize);
    seeds[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), Infinity);
  return geometry;
}

export const wrapAroundCamera = /* glsl */ `
  float wrapY(float y, float cameraY, float height) {
    return mod(y - cameraY + height * 0.5, height) + cameraY - height * 0.5;
  }
`;

export const shaderColor = (hex: string) =>
  new THREE.Color().setHex(parseInt(hex.slice(1), 16), THREE.LinearSRGBColorSpace);
