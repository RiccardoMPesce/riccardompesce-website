import { defineConfig, envField, fontProviders } from "astro/config";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://riccardompesce.com",
  integrations: [],
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      // Satori requires TTF or WOFF; Astro defaults to WOFF2.
      formats: ["woff", "ttf"],
    },
  ],
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
  scopedStyleStrategy: "where",
});
