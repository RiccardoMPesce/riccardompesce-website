import type { APIRoute } from "astro";

/**
 * @description Allows public crawling and advertises the generated sitemap index.
 * @param context Astro route context with the configured canonical site URL.
 * @returns Plain-text robots directives for all crawlers.
 * @throws {Error} When the canonical site URL is missing.
 */
export const GET: APIRoute = ({ site }) => {
  if (!site)
    throw new Error("Configure Astro site before generating robots.txt.");
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL.href}\n`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    }
  );
};
