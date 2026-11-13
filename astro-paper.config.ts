import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://riccardompesce.com/",
    title: "Riccardo M. Pesce",
    description:
      "First-principles engineering across industrial automation, Edge AI, OT security, and quantitative systems — architectural notes and B2B strategy.",
    author: "Riccardo M. Pesce",
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
    {
      name: "linkedin",
      url: "https://www.linkedin.com/in/riccardomariapesce/",
    },
  ],
  shareLinks: [
    {
      name: "linkedin",
      url: "https://www.linkedin.com/sharing/share-offsite/?url=",
      linkTitle: "LinkedIn",
    },
    { name: "x", url: "https://twitter.com/intent/tweet?url=", linkTitle: "X" },
    {
      name: "facebook",
      url: "https://www.facebook.com/sharer/sharer.php?u=",
      linkTitle: "Facebook",
    },
    { name: "whatsapp", url: "https://wa.me/?text=", linkTitle: "WhatsApp" },
    {
      name: "telegram",
      url: "https://t.me/share/url?url=",
      linkTitle: "Telegram",
    },
    { name: "mail", url: "mailto:?body=", linkTitle: "Email" },
  ],
});
