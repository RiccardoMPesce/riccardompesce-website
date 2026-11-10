# Riccardo Pesce

A minimal personal website built with Astro and Tailwind CSS, based on AstroPaper.
The home page introduces Riccardo and lists the three latest published posts.
The navigation links to Home, Blog, About and Contacts, with light and dark themes.

## Development

Use Node.js 24.21.0 (`.nvmrc`). With nvm installed:

```sh
nvm install
nvm use
pnpm install
pnpm dev --background
```

Manage the server with `pnpm astro dev status`, `pnpm astro dev logs` and
`pnpm astro dev stop`.

```sh
pnpm lint
pnpm format:check
node --test tests/og-fonts.test.mjs
pnpm build
pnpm preview
```

The production build checks types, generates static pages and OG images, builds
Pagefind's search index and copies the index to `public/pagefind/`. Search is
currently hidden from navigation to keep the site minimal.

## Content

- Site identity, social links and features: `astro-paper.config.ts`.
- Home page: `src/pages/index.astro`.
- About: `src/content/pages/about.md`.
- Contacts: `src/pages/contacts.astro`; keep its links aligned with the social links.
- Blog posts: Markdown files in `src/content/posts/`.

Use `welcome.md` as a starting point for new posts. Each post needs `title`,
`pubDatetime`, and `description`; `tags` and `draft: true` are optional. The latest
posts appear on the landing page automatically, ordered by date. Drafts are hidden;
future posts become visible on their publication day in the Europe/Rome timezone
when the site is rebuilt. New posts use `/posts/<slug>/` URLs.

Original AstroPaper articles and assets are preserved in `examples/theme-posts/`
for reference. That directory is not loaded as public blog content.

## Fonts and social previews

Astro loads `astro.config.mjs` before `astro.config.ts`; default commands use the
`.mjs` configuration. Keep `--font-google-sans-code` registered with weights 400
and 700 and TTF/WOFF sources for Satori. Google Fonts must be reachable on the
first build. Astro caches downloaded fonts for later builds.

The site uses system fonts for page text and generates `/og.png` and per-post
social preview images with Satori and Sharp.

## Cloudflare Pages

- Build command: `pnpm build`.
- Output directory: `dist`.
- Project root: repository root.
- Node version: `.nvmrc`, or `NODE_VERSION=24.21.0` in both Production and Preview
  if a dashboard override is configured.

Pages publishes the static output without an Astro Cloudflare adapter. The build
requires access to Google Fonts. A local build does not verify remote deployment.

## License

MIT. Original AstroPaper theme by Sat Naing; see `LICENSE`.
