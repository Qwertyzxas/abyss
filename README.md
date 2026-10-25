# Abyss — 10 935 meters down

An interactive descent from the surface of the Pacific to the floor of the Mariana Trench.
Scrolling is the dive: the water darkens, the light fades, the pressure gauge climbs, and after
Challenger Deep the page brings you back up to the surface.

**Live:** https://qwertyzxas.github.io/abyss/

Интерактивное погружение от поверхности Тихого океана до дна Марианской впадины. Скролл и есть
спуск: вода темнеет, свет гаснет, растёт давление, а после Бездны Челленджера страница поднимает
обратно к поверхности. Сайт на русском и английском.

## What is inside

- **Real-time ocean in WebGL.** Marine snow, rising bubbles, caustics on the surface, light rays,
  procedural jellyfish and bioluminescent sparks, all written as custom GLSL shaders on React Three
  Fiber. The seafloor at the bottom is lit by the bathyscaphe's lamp.
- **Depth model.** Every section declares the depth range it covers. The scroll position is mapped
  to meters, and a single damped value drives the camera, the water colour, the CSS theme and the
  sound, so nothing ever jumps, even on anchor navigation.
- **Depth gauge.** Pressure, water temperature, remaining sunlight and the load on a fingernail,
  computed from the current depth.
- **A torch in the dark.** Below the twilight zone the particles near the cursor light up.
- **Generated sound.** An underwater ambience built with the Web Audio API: filtered brown noise,
  a low drone that deepens with depth and a sonar ping below 800 m. No audio files.
- **RU / EN** with the choice remembered between visits.
- Respects `prefers-reduced-motion`: smooth scrolling, reveals and autoplay are switched off.

## Stack

Next.js 16 (static export) · React 19 · TypeScript · Three.js + React Three Fiber · GSAP
ScrollTrigger · Lenis · CSS Modules · Web Audio API

## Project structure

```
src/
  app/                 layout, global styles
  components/          page sections, header, depth gauge
    ocean/             WebGL scene: camera rig, particles, jellyfish, surface, seafloor
  content/             RU and EN copy, media registry with credits
  lib/                 depth model, scroll, i18n, ambient sound
```

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
npm start          # serve ./out
```

Deployment to GitHub Pages runs on every push to `main` through GitHub Actions.

## Credits

Photographs, lithographs and footage come from Wikimedia Commons, mostly from NOAA Ocean
Exploration and the U.S. Navy. Every item is credited with its author and licence in the site footer
and in `src/content/media.ts`.
