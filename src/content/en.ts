import type { Content } from "./types";
import { AUTHOR_URL, REPO_URL } from "./ru";

export const en: Content = {
  meta: {
    title: "Abyss",
    description: "A descent from the surface of the Pacific to the floor of the Mariana Trench: five depth zones and the animals that live in them.",
  },
  nav: {
    home: "Abyss",
    links: [
      { href: "#zones", label: "Zones" },
      { href: "#bestiary", label: "Creatures" },
      { href: "#divers", label: "Expeditions" },
    ],
    dive: "Dive",
    language: "RU",
    languageLabel: "Переключить на русский",
    soundOn: "Sound on",
    soundOff: "Sound",
  },
  hero: {
    lines: ["10,935", "meters"],
    lead: "That is how far the floor of the Mariana Trench lies below the Pacific. Scroll down and we will go there together.",
    action: "Start the descent",
  },
  intro: {
    statement:
      "We have better maps of the Moon and Mars than of our own ocean floor. Below are five zones on the way to the deepest point on Earth.",
    figures: [
      { value: "12", label: "people have walked on the Moon" },
      { value: "≈ 30", label: "have reached the floor of the Mariana Trench" },
      { value: "600+", label: "have been to space" },
    ],
  },
  zones: [
    {
      id: "sunlight",
      layout: "sunlight",
      depth: [0, 200],
      heading: ["Sunlight", "zone"],
      science: "Epipelagic · 0–200 m",
      body: [
        "The top two hundred meters are the only part of the ocean with enough light for photosynthesis. Most of the fish we know live here, and microscopic algae release roughly half of the oxygen we breathe.",
      ],
      figure: { value: "~50%", label: "of Earth's oxygen comes from phytoplankton" },
      shots: [
        {
          key: "sardines",
          alt: "Dolphins cutting up into a dense school of sardines",
          caption: "The sardine run off South Africa. Dolphins drive the school towards the surface.",
        },
      ],
    },
    {
      id: "twilight",
      layout: "twilight",
      depth: [200, 1000],
      heading: ["Twilight"],
      science: "Mesopelagic · 200–1,000 m",
      body: [
        "There is enough light here to make out a silhouette, but not enough to grow anything. By day the residents hide in the gloom. At night billions of fish, squid and krill rise to the surface to feed, and by dawn they are back.",
        "It is the largest migration on the planet, and it happens every single day.",
      ],
      figure: { value: "1%", label: "of sunlight reaches a depth of 200 m" },
      shots: [
        {
          key: "phantomJelly",
          alt: "A giant phantom jellyfish with long pink oral arms in green water",
          caption: "A giant phantom jellyfish off the Melchior Islands, Antarctica. It usually stays below a kilometer, and its arms grow up to ten meters long.",
        },
      ],
    },
    {
      id: "midnight",
      layout: "midnight",
      depth: [1000, 4000],
      heading: ["Midnight"],
      science: "Bathypelagic · 1,000–4,000 m",
      body: [
        "No sunlight reaches this far. All the light at this depth is made by animals: they use it to lure prey, find mates and confuse predators.",
        "Many of the residents are still known mostly from drawings. Very few people have seen them alive.",
      ],
      figure: { value: "76%", label: "of deep-sea animals can make their own light" },
      shots: [
        {
          key: "marianaJelly",
          alt: "A jellyfish with a golden bell and long tentacles above a dark seafloor",
          caption: "A hydromedusa near the Mariana Islands. NOAA expedition, 2016.",
        },
        {
          key: "anglerfish",
          alt: "Lithograph of an anglerfish with an open mouth and a lure on its head",
          caption: "Anglerfish, Melanocetus johnsonii. Lithograph, 1864.",
        },
        {
          key: "vampireSquid",
          alt: "Drawing of a dark red vampire squid with webbed arms",
          caption: "Vampire squid. Plate by Carl Chun, 1910.",
        },
      ],
    },
    {
      id: "abyss",
      layout: "abyss",
      depth: [4000, 6000],
      heading: ["The abyss"],
      science: "Abyssopelagic · 4,000–6,000 m",
      body: [
        "Flat plains of silt that cover more than half of the planet's surface. The water is about two degrees, the pressure is hundreds of atmospheres, and food arrives from above as marine snow: flakes of dead organisms that take weeks to sink.",
      ],
      figure: { value: "> 50%", label: "of Earth's surface is abyssal plain" },
      shots: [
        {
          key: "tripodFish",
          alt: "A silver fish standing on long fin rays above a sandy floor",
          caption: "A tripod fish stands on its fin rays and waits for the current to bring food.",
        },
        {
          key: "dumbo",
          alt: "A dumbo octopus with ear-like fins",
          caption: "Dumbo octopuses flap their fins like ears and live deeper than any other octopus.",
        },
        {
          key: "seaPig",
          alt: "A translucent sea cucumber on silt with a crab underneath",
          caption: "A sea pig, a sea cucumber that roams the silt in herds. A crab is hiding under this one.",
        },
      ],
    },
    {
      id: "trench",
      layout: "trench",
      depth: [6000, 10935],
      heading: ["The trenches"],
      science: "Hadal · 6,000–10,935 m",
      body: [
        "Trenches cover a tiny share of the seafloor, yet they hold almost half of the ocean's depth. At the bottom of Challenger Deep every square centimeter carries over a tonne.",
        "The deepest fish is the Mariana snailfish: pale, scaleless, caught at almost eight kilometers. Below that no fish survives, because the pressure breaks down its proteins.",
      ],
      figure: { value: "10,935 m", label: "Challenger Deep, the deepest known point of the ocean" },
      shots: [
        {
          key: "snailfishMap",
          alt: "Map of the Mariana Trench marking where snailfish were caught",
          caption: "Where Mariana snailfish were caught. Map from Gerringer et al., 2017.",
        },
      ],
    },
  ],
  firstDive: {
    heading: "First to the bottom",
    shot: {
      key: "trieste1960",
      alt: "The bathyscaphe Trieste in rough water with a destroyer behind it",
      caption: "Trieste before the dive, 23 January 1960.",
    },
    figures: [
      { value: "4 h 47 min", label: "Trieste took to sink with Jacques Piccard and Don Walsh on board" },
      { value: "20 min", label: "they spent on the bottom. Stirred-up silt clouded the window, so no photos were taken" },
    ],
  },
  divers: {
    heading: "Who has been down",
    people: [
      {
        key: "triesteCrew",
        alt: "Four men on the deck of Trieste",
        name: "Jacques Piccard and Don Walsh",
        role: "1960 · bathyscaphe Trieste. Don Walsh is second from the left",
      },
      {
        key: "deepseaChallenger",
        alt: "The upright Deepsea Challenger submersible in a museum hall",
        name: "James Cameron",
        role: "2012 · went down alone in the Deepsea Challenger sub",
      },
      {
        mark: "2019",
        name: "Victor Vescovo",
        role: "2019 · Limiting Factor, the first sub built for repeated dives to the bottom",
      },
    ],
    you: { name: "You", role: (meters) => `Deepest this visit: ${meters} m` },
  },
  bestiary: {
    heading: "Who lives in the dark",
    lead: "Eight neighbours on the way down, from the surface to the abyss.",
    creatures: [
      { key: "sardines", name: "Sardine", latin: "Sardinops sagax", depth: "0–200 m", size: "up to 30 cm", zone: "Sunlight zone", note: "Photo: Stanislav Stelmakhovich" },
      { key: "spermWhale", name: "Sperm whale", latin: "Physeter macrocephalus", depth: "to 2,250 m", size: "up to 16 m", zone: "Dives to midnight", note: "Photo: Gabriel Barathieu" },
      { key: "atolla", name: "Atolla", latin: "Atolla sp.", depth: "500–4,000 m", size: "up to 15 cm", zone: "Twilight", note: "Photo: NOAA" },
      { key: "anglerfish", name: "Anglerfish", latin: "Melanocetus johnsonii", depth: "to 4,500 m", size: "up to 18 cm", zone: "Midnight", note: "Lithograph by G. H. Ford, 1864" },
      { key: "vampireSquid", name: "Vampire squid", latin: "Vampyroteuthis infernalis", depth: "600–1,200 m", size: "up to 30 cm", zone: "Midnight", note: "Plate by C. Chun, 1910" },
      { key: "tripodFish", name: "Tripod fish", latin: "Bathypterois grallator", depth: "880–4,720 m", size: "up to 40 cm", zone: "Abyss", note: "Photo: NOAA" },
      { key: "dumbo", name: "Dumbo octopus", latin: "Grimpoteuthis sp.", depth: "to 7,000 m", size: "up to 30 cm", zone: "Abyss", note: "Photo: NOAA Okeanos Explorer" },
      { key: "seaPig", name: "Sea pig", latin: "Scotoplanes globosa", depth: "1,000–6,000 m", size: "up to 15 cm", zone: "Abyss", note: "Photo: NOAA / MBARI" },
    ],
  },
  gauge: {
    descent: "Descent",
    ascent: "Ascent",
    pressure: "Pressure",
    temperature: "Water",
    light: "Light",
    nail: "On your fingernail",
    meters: "m",
    bar: "bar",
    kg: "kg",
    tonnes: "t",
  },
  footer: {
    wordmark: "Abyss",
    sections: "Sections",
    project: "Project",
    projectLinks: [
      { href: REPO_URL, label: "Source code" },
      { href: AUTHOR_URL, label: "Author on GitHub" },
    ],
    credits: "Photographs and illustrations",
    made: "Next.js, React Three Fiber, GSAP and Web Audio. Made by Qwertyzxas, 2026.",
    surface: "Back to surface",
  },
};
