export type MediaKey =
  | "sardines"
  | "atolla"
  | "marianaJelly"
  | "anglerfish"
  | "vampireSquid"
  | "spermWhale"
  | "tripodFish"
  | "dumbo"
  | "seaPig"
  | "snailfishMap"
  | "trieste1960"
  | "triesteCrew"
  | "deepseaChallenger"
  | "phantomJelly";

export type MediaItem = {
  src: string;
  width: number;
  height: number;
  video?: string;
  treatment?: "cutout" | "chart";
  credit: { title: string; author: string; license: string; page: string };
};

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const media: Record<MediaKey, MediaItem> = {
  sardines: {
    src: "/images/sardines.jpg",
    width: 1600,
    height: 887,
    credit: {
      title: "Underwater view of the sardine run",
      author: "Stanislav Stelmakhovich",
      license: "CC0",
      page: commons("Underwater_view_of_the_sardine_run_as_a_dolphin_hunts_within_dense_schools_of_sardines.jpg"),
    },
  },
  atolla: {
    src: "/images/atolla.jpg",
    width: 1600,
    height: 897,
    credit: {
      title: "Coronate of the genus Atolla",
      author: "NOAA Office of Ocean Exploration and Research",
      license: "Public domain",
      page: commons("Coronate_of_the_genus_Atolla_Puerto_Rico_28_April_2015.png"),
    },
  },
  marianaJelly: {
    src: "/images/mariana-jelly.jpg",
    width: 1600,
    height: 900,
    credit: {
      title: "Jellyfish, Deepwater Exploration of the Marianas",
      author: "NOAA Ocean Exploration & Research",
      license: "CC BY-SA 2.0",
      page: commons("Jellyfish_-_Flickr_-_NOAA_Ocean_Exploration_^_Research.jpg"),
    },
  },
  anglerfish: {
    src: "/images/anglerfish.webp",
    width: 1200,
    height: 923,
    treatment: "cutout",
    credit: {
      title: "Melanocetus johnsonii",
      author: "G. H. Ford",
      license: "Public domain",
      page: commons("MelanocetusJohnsoniiFord.jpg"),
    },
  },
  vampireSquid: {
    src: "/images/vampire-squid.webp",
    width: 1200,
    height: 811,
    treatment: "cutout",
    credit: {
      title: "Vampyroteuthis infernalis",
      author: "Carl Chun",
      license: "Public domain",
      page: commons("Vampyroteuthis_infernalis.jpg"),
    },
  },
  spermWhale: {
    src: "/images/sperm-whale.jpg",
    width: 1600,
    height: 900,
    credit: {
      title: "Mother and baby sperm whale",
      author: "Gabriel Barathieu",
      license: "CC BY-SA 2.0",
      page: commons("Mother_and_baby_sperm_whale.jpg"),
    },
  },
  tripodFish: {
    src: "/images/tripod-fish.jpg",
    width: 1591,
    height: 860,
    credit: {
      title: "Tripod fish",
      author: "North Atlantic Stepping Stones Science Party, NOAA/OAR/OER",
      license: "Public domain",
      page: commons("Tripod_fish_NOAA.jpg"),
    },
  },
  dumbo: {
    src: "/images/dumbo.jpg",
    width: 1114,
    height: 943,
    credit: {
      title: "Dumbo octopus",
      author: "NOAA Okeanos Explorer",
      license: "Public domain",
      page: commons("Dumbo-hires_(cropped).jpg"),
    },
  },
  seaPig: {
    src: "/images/sea-pig.jpg",
    width: 1600,
    height: 900,
    credit: {
      title: "Scotoplanes globosa and crab",
      author: "NOAA/MBARI",
      license: "CC BY-SA 3.0",
      page: commons("Scotoplanes_globosa_and_crab.jpg"),
    },
  },
  snailfishMap: {
    src: "/images/snailfish-map.jpg",
    width: 1600,
    height: 1133,
    treatment: "chart",
    credit: {
      title: "Pseudoliparis swirei in Mariana Trench map",
      author: "Gerringer et al. (2017)",
      license: "CC BY 3.0",
      page: commons("Pseudoliparis_swirei_in_Mariana_Trench_map.jpg"),
    },
  },
  trieste1960: {
    src: "/images/trieste-1960.jpg",
    width: 1600,
    height: 1190,
    credit: {
      title: "Bathyscaphe Trieste over the Marianas Trench, 23 January 1960",
      author: "U.S. Navy",
      license: "Public domain",
      page: commons(
        "Bathyscaphe_Trieste_with_USS_Lewis_(DE-535)_over_the_Marianas_Trench,_23_January_1960_(NH_96797).jpg",
      ),
    },
  },
  triesteCrew: {
    src: "/images/trieste-crew.jpg",
    width: 1280,
    height: 1012,
    credit: {
      title: "USN 1044872 Bathyscaphe Trieste",
      author: "U.S. Navy",
      license: "Public domain",
      page: commons("USN_1044872_Bathyscaphe_Trieste.jpg"),
    },
  },
  deepseaChallenger: {
    src: "/images/deepsea-challenger.jpg",
    width: 1600,
    height: 2133,
    credit: {
      title: "Deepsea Challenger, Cité de la Mer",
      author: "Raimond Spekking",
      license: "CC BY-SA 4.0",
      page: commons("Deepsea_Challenger_-_Cité_de_la_Mer-7935.jpg"),
    },
  },
  phantomJelly: {
    src: "/video/phantom-jelly-poster.jpg",
    video: "/video/phantom-jelly.webm",
    width: 960,
    height: 1707,
    credit: {
      title: "Phantom Jellyfish Off of the Melchior Islands",
      author: "MasterfulNerd",
      license: "CC BY 4.0",
      page: commons("Phantom_Jellyfish_Off_of_the_Melchior_Islands.webm"),
    },
  },
};
