export const MAX_DEPTH = 10935;
export const ZONE_BOUNDS = [0, 200, 1000, 4000, 6000, MAX_DEPTH] as const;
export const ZONE_COUNT = ZONE_BOUNDS.length - 1;

export type DivePhase = "descent" | "ascent";

export const dive = {
  target: 0,
  meters: 0,
  level: 0,
  maxMeters: 0,
  phase: "descent" as DivePhase,
  pointerX: 0,
  pointerY: 0,
  pointerActive: false,
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function depthToLevel(meters: number) {
  const m = clamp(meters, 0, MAX_DEPTH);
  for (let i = 0; i < ZONE_COUNT; i++) {
    const top = ZONE_BOUNDS[i];
    const bottom = ZONE_BOUNDS[i + 1];
    if (m <= bottom) return i + (m - top) / (bottom - top);
  }
  return ZONE_COUNT;
}

export function zoneIndexAt(meters: number) {
  return Math.min(ZONE_COUNT - 1, Math.floor(depthToLevel(meters)));
}

export function pressureBar(meters: number) {
  return 1.013 + meters * 0.0992;
}

export function forceOnNailKg(meters: number) {
  return pressureBar(meters) * 1.0197;
}

export function lightPercent(meters: number) {
  return meters >= 1000 ? 0 : 100 * Math.exp(-0.023 * meters);
}

const temperatureProfile: [number, number][] = [
  [0, 27],
  [100, 25],
  [200, 18],
  [500, 9],
  [1000, 4.5],
  [2000, 2.6],
  [4000, 1.5],
  [6000, 1.4],
  [8000, 1.8],
  [MAX_DEPTH, 2.4],
];

export function temperatureC(meters: number) {
  const m = clamp(meters, 0, MAX_DEPTH);
  for (let i = 1; i < temperatureProfile.length; i++) {
    const [d1, t1] = temperatureProfile[i];
    if (m <= d1) {
      const [d0, t0] = temperatureProfile[i - 1];
      return t0 + ((m - d0) / (d1 - d0)) * (t1 - t0);
    }
  }
  return temperatureProfile[temperatureProfile.length - 1][1];
}

export const seaColors = ["#0f8196", "#0a5a7d", "#0a2f57", "#071734", "#040a1a", "#010308"];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const seaRgb = seaColors.map(hexToRgb);

export function seaColorAt(level: number): [number, number, number] {
  const l = clamp(level, 0, seaRgb.length - 1);
  const i = Math.min(seaRgb.length - 2, Math.floor(l));
  const t = l - i;
  const eased = t * t * (3 - 2 * t);
  const a = seaRgb[i];
  const b = seaRgb[i + 1];
  return [a[0] + (b[0] - a[0]) * eased, a[1] + (b[1] - a[1]) * eased, a[2] + (b[2] - a[2]) * eased];
}

type DepthSpan = { top: number; height: number; from: number; to: number; phase: DivePhase };

let spans: DepthSpan[] = [];

export function measureDepthSpans() {
  const nodes = document.querySelectorAll<HTMLElement>("[data-depth]");
  spans = Array.from(nodes).map((node) => {
    const [from, to] = (node.dataset.depth ?? "0-0").split("-").map(Number);
    const rect = node.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      height: rect.height,
      from,
      to,
      phase: node.dataset.phase === "ascent" ? "ascent" : "descent",
    };
  });
}

export function updateDiveTarget(scrollY: number) {
  if (spans.length === 0) return;
  const probe = scrollY + window.innerHeight * 0.5;
  const first = spans[0];
  const last = spans[spans.length - 1];

  if (probe <= first.top) {
    dive.target = first.from;
    dive.phase = first.phase;
    return;
  }

  for (const span of spans) {
    if (probe < span.top + span.height) {
      const t = clamp((probe - span.top) / span.height, 0, 1);
      dive.target = span.from + (span.to - span.from) * t;
      dive.phase = span.phase;
      return;
    }
  }

  dive.target = last.to;
  dive.phase = last.phase;
}

export function stepDive(deltaSeconds: number) {
  const ease = 1 - Math.exp(-deltaSeconds * 3.2);
  dive.meters += (dive.target - dive.meters) * ease;
  if (Math.abs(dive.target - dive.meters) < 0.05) dive.meters = dive.target;
  dive.level = depthToLevel(dive.meters);
  dive.maxMeters = Math.max(dive.maxMeters, dive.meters);
}
