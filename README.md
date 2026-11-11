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

Open the local URL reported by the server (usually `http://localhost:4321`).
Visit `/about/` to review the About page; edits appear automatically during
development. Check narrow and wide layouts, both themes and navigation links.

Before deploying, run `pnpm build`, then `pnpm preview` to inspect the generated
production site at the URL printed in the terminal. Stop the preview with Ctrl+C.
These commands only serve the site locally; they do not deploy it.

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

Keep showcase copy grounded in documented experience. Present interests,
career goals and planned writing as intentions; distinguish academic foundations
from professional practice. Add performance figures or outcome claims only when
they have supporting evidence. Keep Home, About and site metadata consistent.

Use `welcome.md` as a starting point for new posts. Each post needs `title`,
`pubDatetime`, and `description`; `tags` and `draft: true` are optional. The latest
posts appear on the landing page automatically, ordered by date. Drafts are hidden;
future posts become visible on their publication day in the Europe/Rome timezone
when the site is rebuilt. New posts use `/posts/<slug>/` URLs.

Original AstroPaper articles and assets are preserved in `examples/theme-posts/`
for reference. That directory is not loaded as public blog content.

## Colors and contrast

Palette tokens live in `src/styles/theme.css`: warm ivory and teal for light
mode, deep blue and mint for dark mode. The contact panel uses `surface`, while
form fields use `input-border` so their outlines remain distinct from decorative
dividers. Buttons use separate foreground and hover colors in each theme.

The token pairs were checked with the WCAG relative-luminance calculation:
body text on the page background is 11.50:1 (light) and 13.57:1 (dark); secondary
text is 5.54:1 and 8.46:1; button text is 6.65:1 and 9.29:1. Form borders exceed
3:1 against both adjacent surfaces. Text pairs also exceed 4.5:1 on the panel,
muted backgrounds and button hover states. These checks cover color pairs,
not a full accessibility audit or a claim about users' color preferences.
Use [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
when changing these tokens.

## Contact form

The Contacts form posts directly to [FormSubmit](https://formsubmit.co/) for
delivery to the email address displayed on that page. It works without client
JavaScript or a Cloudflare backend. FormSubmit processes the submitted name,
reply email and message; the form explains this before submission.

Before launch, submit a test through the locally served Contacts page, complete
the provider's CAPTCHA and confirm the activation email in the recipient inbox
(check spam too). Then submit again and verify delivery and Reply-To. Until
activation and that inbox check, email delivery is not verified. FormSubmit
handles the CAPTCHA, submission errors and confirmation page; no local success
message claims delivery. Keep its default CAPTCHA enabled. No API key is needed.

Browser validation requires all fields, an email address and a message of 10–5,000
characters. Check empty fields, invalid email, short/long messages, keyboard use,
mobile layout and both themes. Client validation is a usability aid; delivery
and server-side processing depend on FormSubmit. Direct email remains available
if the provider is unavailable. Changing recipients requires activation again.

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
