import rss from "@astrojs/rss";
import { getCollection, render } from "astro:content";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import { prepareFeedHtml } from "@/utils/prepareFeedHtml.js";
import config from "@/config";

/**
 * @description Builds the public RSS feed from published articles with rendered full content.
 * @returns RSS XML response with canonical links, original publication dates and categories.
 * @throws Propagates content rendering and invalid URL errors to fail the build.
 */
export async function GET(): Promise<Response> {
  const sortedPosts = getSortedPosts(await getCollection("posts"));
  const container = await AstroContainer.create();
  const items = await Promise.all(
    sortedPosts.map(async post => {
      const { data, id, filePath } = post;
      const link =
        data.canonicalURL ??
        new URL(getPostUrl(id, filePath, config.site.lang), config.site.url)
          .href;
      const { Content } = await render(post);
      const html = await container.renderToString(Content);
      return {
        link,
        title: data.title,
        description: data.description,
        pubDate: data.pubDatetime,
        categories: data.tags,
        content: prepareFeedHtml(html, link),
      };
    })
  );
  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    items,
    customData: `<language>${config.site.lang}</language>`,
  });
}
