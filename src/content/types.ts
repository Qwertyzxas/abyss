import type { MediaKey } from "./media";

export type Locale = "ru" | "en";

export type Figure = { value: string; label: string };

export type Shot = { key: MediaKey; alt: string; caption: string };

export type ZoneLayout = "sunlight" | "twilight" | "midnight" | "abyss" | "trench";

export type Zone = {
  id: string;
  layout: ZoneLayout;
  depth: [number, number];
  heading: [string, string?];
  science: string;
  body: string[];
  figure: Figure;
  shots: Shot[];
};

export type Creature = {
  key: MediaKey;
  name: string;
  latin: string;
  depth: string;
  size: string;
  zone: string;
  note: string;
};

export type Diver = {
  key?: MediaKey;
  alt?: string;
  mark?: string;
  name: string;
  role: string;
};

export type Content = {
  meta: { title: string; description: string };
  nav: {
    home: string;
    links: { href: string; label: string }[];
    dive: string;
    language: string;
    languageLabel: string;
    soundOn: string;
    soundOff: string;
  };
  hero: { lines: [string, string]; lead: string; action: string };
  intro: { statement: string; figures: Figure[] };
  zones: Zone[];
  firstDive: {
    heading: string;
    shot: Shot;
    figures: [Figure, Figure];
  };
  divers: {
    heading: string;
    people: Diver[];
    you: { name: string; role: (meters: string) => string };
  };
  bestiary: { heading: string; lead: string; creatures: Creature[] };
  video: { play: string; pause: string };
  gauge: {
    descent: string;
    ascent: string;
    pressure: string;
    temperature: string;
    light: string;
    nail: string;
    meters: string;
    bar: string;
    kg: string;
    tonnes: string;
  };
  footer: {
    wordmark: string;
    sections: string;
    project: string;
    projectLinks: { href: string; label: string }[];
    credits: string;
    made: string;
    surface: string;
  };
};
