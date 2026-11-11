import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://riccardompesce.com/",
    title: "Riccardo M. Pesce",
    description:
      "My corner of the web: what I work on, study and explore, and the things I learn along the way.",
    author: "Riccardo Maria Pesce",
    profile: "https://github.com/riccardompesce",
    ogImage: "og.png",
    lang: "en",
    timezone: "Europe/Rome",
    dir: "ltr",
  },
  posts: { perPage: 6, perIndex: 3 },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: false,
    showBackButton: true,
    editPost: { enabled: false },
    search: false,
    toc: true,
  },
  socials: [
    { name: "mail", url: "mailto:riccardompesce@gmail.com" },
    { name: "github", url: "https://github.com/riccardompesce" },
    { name: "linkedin", url: "https://www.linkedin.com/in/riccardomariapesce/" },
  ],
  shareLinks: [],
});
