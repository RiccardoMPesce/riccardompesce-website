import mdx from "@astrojs/mdx";
import { defineConfig, envField } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import { rehypeAccessibleContent } from "./src/utils/rehypeAccessibleContent.js";
import { rehypeTableWrapper } from "./src/utils/rehypeTableWrapper.js";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://riccardompesce.com",
  integrations: [mdx()],
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [
          rehypeKatex,
          { output: "htmlAndMathml", trust: false, strict: "error" },
        ],
        rehypeTableWrapper,
        [rehypeAccessibleContent, { site: "https://riccardompesce.com" }],
      ],
    }),
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      wrap: false,
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
