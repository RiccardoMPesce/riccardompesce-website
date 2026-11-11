# Riccardo Pesce

A minimal personal website built with Astro and Tailwind CSS, based on AstroPaper.
The home page introduces Riccardo and lists the three latest published posts.
The navigation links to Home, Blog, About, Portfolio and Contacts, with light and dark themes.

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
node --test tests/portfolio-navigation.test.mjs
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
- Portfolio page and public CV data: `src/pages/portfolio.astro` and
  `src/data/portfolio.ts`; university activities and syllabus references are in
  `src/data/education.ts`.
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

## Portfolio

The Portfolio combines the English Google Doc titled `RiccardoMPesce` with the
author's [LinkedIn profile](https://www.linkedin.com/in/riccardomariapesce/),
reviewed on 11 November 2026. The author confirmed July 2026 for the transition
from Backend Engineer to Technical Lead at ALTEN. Professional history,
qualifications and project statements are author-reported, not independently
audited outcomes. Academic coursework is explicitly separate from
professional experience. The telephone number and private document link are not
included in the public data.

Update the readonly data in `src/data/portfolio.ts` after reviewing CV or LinkedIn
changes, then rebuild. There is no automatic Google Drive or LinkedIn
synchronization, browser-side account access or credential requirement. The
original Google Doc and LinkedIn profile are unchanged.

The timeline includes nine roles, including earlier Appen and Teemwork.ai
contracts. Separate sections cover the CMD Call Graph open-source contribution,
twelve selected credentials and learning programmes, and community activities.
The project's public repository verifies its description and Microsoft hosting;
it does not establish employment at Microsoft or project ownership. Learning
programmes retain their reported titles and issue dates; they are not presented
as current professional licenses. About distinguishes career interests from
established professional experience. Contacts and social links use the current
author-supplied LinkedIn URL above.

Education draws from the author-supplied `Curriculum Triennale.pdf` and
`Curriculum Magistrale.pdf`: 24 entries / 180 CFU and 14 entries / 120 CFU
respectively. The author clarified that the 9-CFU master elective recognizes
professional experience at Oney Insurance, complemented by data science,
software development, machine learning and analytics. This description is
author-supplied; the transcript labels it generically as an elective.
Course names and module references are rendered in English, with faithful
translations of the transcript titles; the page displays “credits” rather than
the Italian abbreviation CFU. Credit values and course years follow the transcripts;
individual grades and personal identifiers are not
included. The PDF files themselves are not published. Each activity expands
independently within its course year.

The 32 named subjects retain verified historical UniCT syllabus references in
`src/data/education.ts`; these URLs are not rendered on the public page. Their English
descriptions summarize those sources, not claimed professional proficiency.
Each reference identifies its academic year: 2015/2016 and 2016/2017 for the core
bachelor subjects, 2018/2019 for Big Data and Machine Learning, and 2019/2020
or 2020/2021 for the master subjects. Editions and teaching channels are reference
matches, not proof of the exact class attended; some first-year credits were
transferred from another degree. Preserve that distinction when updating links.
The final activities appear separately as bachelor and master theses, with
3 and 18 credits respectively, rather than as taught subjects. The coursework
lists therefore contain 23 bachelor and 13 master activities; total degree
credits remain 180 and 120 when the thesis credits are included. Additional
activities and language assessment retain their transcript labels without
invented syllabi.

The bachelor thesis, _Domain Adaptation through Regression_, is summarized from
the author-supplied `Domain Adaptation tramite Regressione.docx`. Its description
covers CNN feature transfer with Ridge regression, Python/PyTorch/scikit-learn
and the reported comparison of accuracy and CPU training times on a small
ants-and-bees dataset. Results describe that experiment, not a general
performance guarantee. The source document is not published.

The master thesis, _Deep Learning for Rest State Classification Using EEG/fMRI
Data_, is summarized from the author-supplied `presentazione_tesi.pdf` (23 slides,
dated 27 April 2023), not the full dissertation. It covers EEG and fMRI CNNs,
feature fusion through a multilayer perceptron, and the CWL EEG/fMRI dataset.
The summary preserves the reported sensitivity to carbon-wire-loop channels and
limitations of the single-frame fMRI and multimodal models, without claiming
clinical validation or a demonstrated benefit from combining modalities. The
presentation itself is not published.

Thesis disclosures start collapsed: the label and available title are visible,
while credits and the description open on click or keyboard activation. They use
native details elements and remain operable without JavaScript.

After editing education data, compare activity names and CFU with the transcripts,
check totals including the separate theses, verify the individual official syllabus URLs and years, and ensure
the generated page contains no individual grades or personal identifiers. Check
both levels of disclosure with a keyboard and at narrow widths.

The timeline offers focus filters, live result counts and expand/collapse of
visible roles. Native disclosures and section links work without JavaScript;
filter controls appear only after initialization. The custom element cleans up
event handlers when Astro navigation removes the page. The shared mobile menu
now switches at 768px to accommodate the additional navigation link.

Section headings describe the actual career and academic content rather than
evaluating its value. Role summaries remain visible when details are collapsed.
A timeline orders the roles; expanded content separates contributions from
technologies on desktop and stacks them on mobile. Reading lines are limited
to 65 characters where space permits.

The sticky section navigation marks the current section with `aria-current`
and scrolls horizontally on narrow screens. Scroll and resize updates share
one animation frame; a ResizeObserver updates the indicator when filtering or
disclosures move section boundaries. Both custom elements release their
listeners and observers when removed during Astro navigation.

Disclosures animate their height and opacity where `::details-content` and
`interpolate-size` are supported; other browsers retain native immediate
opening. Transitions and entry motion respect `prefers-reduced-motion`. Nothing
depends on scroll-triggered content hiding. The navigation regression tests
use DOM-boundary doubles, not a real browser; visual and keyboard checks remain
necessary.

When changing interactions, verify every filter, switching back to all roles,
expand/collapse after filtering, individual disclosures, keyboard operation and
navigation away and back. Check narrow and wide layouts, light/dark modes,
reduced motion and the page with JavaScript disabled.

## Colors and contrast

Palette tokens live in `src/styles/theme.css`: off-white, white and charcoal for
light mode; near-black and soft grays for dark mode. Both palettes use
achromatic colors throughout. The contact panel uses `surface`, while
form fields use `input-border` so their outlines remain distinct from decorative
dividers. Buttons use separate foreground and hover colors in each theme.

The token pairs were checked with the WCAG relative-luminance calculation:
body text on the page background is 14.50:1 (light) and 14.49:1 (dark); secondary
text is 6.02:1 and 8.19:1; button text is 12.63:1 and 12.09:1. Form borders exceed
3:1 against both adjacent surfaces. Text pairs also exceed 4.5:1 on the panel,
muted backgrounds and button hover states. These checks cover color pairs,
not a full accessibility audit or a claim about users' color preferences.
Use [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
when changing these tokens.

## Reading typography

Page text uses locally available system sans-serif fonts, with Segoe UI, Arial
and generic sans-serif fallbacks. No additional web font is downloaded for
reading. This follows [W3C's CSS typography technique](https://www.w3.org/WAI/WCAG22/Techniques/css/C22),
which recommends available fonts and fallbacks; it does not certify a particular
font family as universally more readable.

Long-form copy in About, posts, Home, Contacts and Portfolio uses `1.125rem`
(18px with the browser's usual 16px default), unitless 1.75 line spacing and a
maximum measure of 65ch where the layout permits. Paragraphs in articles have
1.5em vertical margins. Controls and supporting labels retain a smaller type
hierarchy. Headings use upright text; body text is aligned to the reading start,
without justification. Browser text size remains user-controlled.

These are design choices informed by [WCAG visual presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html),
not proof of a reading-speed improvement or full AAA conformance. Exact neutral
hex values reflect the requested appearance; their evidence is measured contrast,
not a claim that gray is universally more comfortable. Preserve both themes.
When editing typography, check 200% zoom, narrow layouts and
[user text-spacing overrides](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html):
1.5 line height, 2em paragraph spacing, 0.12em letter spacing and 0.16em word
spacing without clipped content or lost controls. Those overrides are a test
condition, not the required default design.

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
