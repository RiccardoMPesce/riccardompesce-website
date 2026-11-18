# Riccardo Pesce

A minimal personal website built with Astro and Tailwind CSS, based on AstroPaper.
The home page introduces Riccardo and lists the three latest published posts.
The navigation links to Home, Blog, About, Portfolio and Contacts, with light and dark themes.
The shared footer uses the configured site author for its copyright notice and
links to Astro and the original AstroPaper theme for attribution, below the
**Find me** profile links and aligned with the copyright in the bottom row on wide screens.

## Reading and presentation

The Matte Paper / Warm Ink palette lives in `src/styles/theme.css`.
Article prose uses a 68ch measure, 17px desktop text, 1.7 leading, balanced headings,
progressive paragraph wrapping, warm link underlines and 4px / 8px / pill radii.
Native tables retain keyboard-accessible horizontal scrolling.

Astro's [ClientRouter](https://docs.astro.build/en/guides/view-transitions/)
retains article-title transition identities. `src/styles/motion.css` defines
asymmetric easing, 90ms press feedback, 150–180ms interactions and 250ms view
transitions. Reduced-motion preferences disable transitions and smooth scrolling.
The fixed 2px reading indicator uses `scaleX`, batches scroll work with animation
frames and disconnects listeners/observers on navigation. Code-copy controls stay
outside `pre > code`, reserve a stable hit area and announce clipboard failures.
These choices avoid authored layout animations; frame rate and zero CLS require
measurement in real browsers and are not guaranteed by the CSS.

Article headings have no generated `#` permalink controls.
Articles expose a named semantic article, Pagefind title/description metadata,
canonical social cards and BlogPosting JSON-LD linked to the site author Person.
Navigation and decorative controls are excluded from Pagefind without hiding
interactive controls from assistive technology. KaTeX retains MathML and LaTeX
annotations; fenced code has an explicit language class (plain text when omitted).
RSS includes rendered full article content, original publication dates, tags and
absolute media/link URLs; scripts and UI controls are omitted. Search remains
controlled by `features.search` in `astro-paper.config.ts`.

## Google indexing

`npm run build` generates `dist/robots.txt`, `dist/sitemap-index.xml` and
`dist/sitemap-0.xml` using `@astrojs/sitemap` in the active `astro.config.mjs`.
The sitemap updates automatically as published pages and articles change.
Search, error pages and the disabled archive are excluded. No artificial
modification dates or priorities are assigned.

After deploying, confirm these URLs return their files:

- `https://riccardompesce.com/robots.txt`
- `https://riccardompesce.com/sitemap-index.xml`
- `https://riccardompesce.com/sitemap-0.xml`

In Google Search Console, add the domain property and verify ownership with the
DNS TXT record supplied by Google. Alternatively, for a URL-prefix property,
select HTML-tag verification and set `PUBLIC_GOOGLE_SITE_VERIFICATION` in the
hosting build environment to the supplied **content value**, then rebuild and
deploy. The shared layout already emits that verification meta tag. No dummy
Google verification file is included because its filename and content must
match the token Google issues for the property.

Submit `sitemap-index.xml` in Search Console's Sitemaps report and use URL
Inspection to request the home page. These files support discovery; Google
decides whether and when to index pages. See [Google's sitemap guide](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

The matte finish is defined in `src/styles/paper.css`: a static, tiled inline SVG
noise layer uses 3.5% multiply blending in light mode and 4.5% soft-light in dark
mode, with no requests or animation. It ignores pointer events and is disabled
for printing and forced colours. Cards retain hairline borders with a 1px inset
highlight; hover and focus-within change only the border colour over 180ms,
without translating or resizing the card (immediate with reduced motion), and the portrait has a circular border. Modal links retain their
underlined presentation. The full plain portfolio and content structure are unchanged.
The exact light muted-text/secondary-surface pair has only 4.42:1 contrast;
secondary surfaces scope a darker muted-copy token to meet AA. Decorative borders
are intentionally subtle; input boundaries and focus indicators use stronger colours.
Contrast tests cover text, surfaces, selected text, input edges and both themes.
Browser inspection and device profiling are still required to validate the final
texture appearance and rendering performance; no frame-rate guarantee is implied.

Inter uses the variable weight and optical size axes. JetBrains Mono is used for
code, technical badges and eyebrows. Shiki uses the existing warm card surface.
The article outline sticks beside the reading column at Tailwind’s `xl`
breakpoint and highlights the current heading. Portfolio section links support
Left and Right Arrow focus navigation in the full plain view.

## Full plain portfolio and About quotations

The English portfolio opens directly in its complete, linear view. All sections,
project descriptions and native disclosures remain in the DOM inside
`data-pagefind-body`, available to readers, Pagefind and printing. There is no
showcase timer or presentation toggle on the page. The unused showcase component
and its controller remain available for a possible future reactivation.
`?view=all` remains compatible, but is no longer required to see the full view.

About retains its original Markdown unchanged. `AboutQuote.astro` adds one of
the three supplied English quotations, chosen randomly on each page visit or
refresh. Random selection may repeat a quotation. Without JavaScript the Calvino
quotation is shown. Inactive cards and quotations reserve their layout space to
avoid shifts when switching. No external UI library or network service is used.

## Modal controls and scrolling

Download, sharing and article-image preview controls use underlined text with a
shared window icon. They remain native buttons with `aria-haspopup="dialog"`
because they perform an action rather than navigate. Keyboard focus and 44px
minimum targets are preserved.

Native download/share dialogs use `src/styles/modals.css`: a transparent fixed
viewport shell allows a tall panel to scroll while the page underneath stays
locked. The panel itself has natural height, with no separate inner scrollbar.
Closing the dialog releases the CSS scroll lock automatically. Image previews
use the same lock through their overlay marker. Keyboard focus remains contained.
Sharing backdrop dismissal checks the panel
bounds and requires both press and release outside. Escape and focus restoration
remain native/existing behaviour. Article images retain their alt text and gain
an explicit **Open image** button; the image viewer also keeps the underlying page locked until it closes.

## Sharing

Articles show a flat sharing row below the title and publication date, before
the article body. LinkedIn, X, Facebook and **Copy link** are immediately visible.
Post previews also show the same controls below their description in Blog, Home,
tag and archive lists (when enabled). Each preview shares that article's canonical URL, with a
distinct dialog ID and accessible labels identifying the article title.

**More**, an underlined control with the shared window icon, opens a compact native `dialog` above the page
without moving the sharing row. The dialog includes all sharing destinations,
native sharing, a manual URL field and **Copy link**. A subtle backdrop separates
it from the page. Escape, its close button and an outside click dismiss it; focus
returns to the invoking control. Native `showModal()` contains keyboard focus.
Outside dismissal requires the gesture to start and end outside the dialog so
selecting text and releasing outside does not close it.
The footer places **Share this site** above the copyright, beside a distinct
**Find me** group of horizontal profile icons on wide screens. Both use
`src/components/ShareLinks.astro` and the destinations in `shareLinks` in
`astro-paper.config.ts`: LinkedIn, X, Facebook, WhatsApp, Telegram and email.
These are ordinary links, with no social SDKs, share counters or click tracking.
External share destinations open in a new tab only when selected.

Article links use their explicit canonical URL when supplied, otherwise the
public site URL and article path. Local preview origins, query strings and
fragments are not added. Each destination receives an encoded URL value;
configure a base URL ending in its empty parameter (for example `?url=`).
Invalid destinations fail the build rather than silently disappearing.

The modal requires JavaScript. Without it, secondary share links and a permalink
appear directly, while the primary social links continue to work.
**Copy link** uses the browser Clipboard API when available in a secure context;
denied writes open the dialog, show an error and select the URL for manual copying. **More sharing
options…** uses the device's native share sheet where supported. Cancelling that
sheet is normal; other errors direct readers to the links or URL field. The custom
element removes listeners on navigation and reconnects with Astro page changes.

The near-title position is a visibility choice, not evidence of increased sharing.
The controls use 44px minimum height, accessible names and the site's keyboard
focus treatment, informed by [WCAG target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
The sharing row has no panel background or border. The compact dialog uses the
site's existing palette. Its behavior follows the [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
No embedded social frames or SDKs are introduced.

Reference formats: [Telegram custom buttons](https://core.telegram.org/widgets/share),
[WhatsApp click to chat](https://faq.whatsapp.com/5913398998672934),
[LinkedIn sharing](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/plugins/share-plugin),
[Facebook Share Button](https://developers.facebook.com/docs/plugins/share-button/),
and [X Publish](https://publish.x.com/). LinkedIn's documented SDK is deliberately
not loaded; its offsite sharing URL is used instead. Facebook's documentation was
rate limited and X's legacy intent guide redirected during this change. Treat
those endpoints as external compatibility dependencies, not verified publishing
integrations. Sharing always requires the reader to complete the platform's flow.

Run `node --test tests/share-links.test.mjs`. Tests use browser API doubles, not
live social accounts. Also check the closed/open modal on narrow and wide
screens, Tab/Shift+Tab containment, Escape, outside dismissal, restored focus,
both themes, JavaScript disabled, denied clipboard
access, native-sheet cancellation and navigation between an article and Home.
Confirm each platform's composer with the public URL before claiming end-to-end
sharing; no test posts need to be published. No monetization is enabled.

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
npm test
pnpm build
pnpm preview
```

The production build checks types, generates static pages and OG images, builds
Pagefind's search index and copies the index to `public/pagefind/`. Search is
currently hidden from navigation to keep the site minimal.

## Content

- Site identity, social links and features: `astro-paper.config.ts`.
- Home page: `src/pages/index.astro`.
- About: `src/content/pages/about.md`, including career direction and
  author-provided personal interests. Keep references to relationships general.
- Portfolio page and public CV data: `src/pages/portfolio.astro` and
  `src/data/portfolio.ts`; university activities and syllabus references are in
  `src/data/education.ts`.
- Contacts: `src/pages/contacts.astro`; keep its links aligned with the social links.
- Blog posts: Markdown files in `src/content/posts/`.

Keep showcase copy grounded in documented experience. Present interests,
career goals and planned writing as intentions; distinguish academic foundations
from professional practice. Add performance figures or outcome claims only when
they have supporting evidence. Keep Home, About and site metadata consistent.

`welcome.md` is the opening personal manifesto; keep its `/posts/welcome/` path
stable so existing links and comments remain associated with it. Its content
sets out a personal direction and intended problem-solving method, without
disclosing private projects or organizational details.
Use its frontmatter structure as a starting point for new posts. Each post needs `title`,
`pubDatetime`, and `description`; `tags` and `draft: true` are optional. The latest
posts appear on the landing page automatically, ordered by date. Drafts are hidden;
future posts become visible on their publication day in the Europe/Rome timezone
when the site is rebuilt. New posts use `/posts/<slug>/` URLs.

Original AstroPaper articles and assets are preserved in `examples/theme-posts/`
for reference. That directory is not loaded as public blog content.

## Portfolio

### Downloadable full portfolio

The portfolio offers English and Italian downloads in PDF and editable DOCX.
The single-column full portfolio follows the supplied reference's section order
and includes all public roles, contributions, coursework, thesis research,
credentials, projects and community activities. It is intentionally detailed,
not a short application CV. The July 2026 ALTEN transition follows the current
portfolio. The private telephone number is omitted.

`ResumeDownload.astro` progressively enhances four static download links with
a small **Download full CV** button beside **View full CV**. The button
opens a native dialog with language and format selectors, keyboard focus
containment, Escape/close dismissal and focus restoration. Without JavaScript,
a compact disclosure provides all four direct download links.
DOCX uses native Word paragraphs, headings and lists, Arial, one column and no
tables, text boxes, macros or content in headers/footers. Google Docs supports
[editing Office files](https://support.google.com/docs/answer/9406611?hl=en).
This conservative layout supports editing in Word and Google Docs; identical
pagination across versions and fonts is not guaranteed. Native Word and Google
Docs round-trip verification remains necessary before claiming full compatibility.

The English source is `src/data/portfolio.ts` and `src/data/education.ts`;
`src/data/resume-it.json` is the reviewed Italian counterpart. Keep the same
structure, entry counts, numbers and evidence URLs in both languages. Original
thesis and credential titles and technology names are retained. Export rejects
missing entries or changed evidence URLs. Translation meaning still needs review.
`scripts/generate-resume.py` owns document layout and the bilingual introduction.
Generated files are committed under `public/portfolio-downloads/`, so deployment needs no
Python or office conversion service.

After content or layout changes, regenerate all four files. Use a Python
environment containing `python-docx`, `pdf2image` and `pypdf`, plus LibreOffice
and Poppler. Set `RESUME_PYTHON` to that interpreter and `RESUME_RENDERER` to
the Documents skill's `render_docx.py` (the Codex bundled runtime was used for
the initial exports). Arial must be installed and visible to the renderer;
configure its font search path if necessary, and verify that `pdffonts` reports
embedded Arial rather than a substitute. Font files are not distributed in
this repository. From the repository root:

```sh
node scripts/export-resume.mjs /tmp/master-resume-source.json
"$RESUME_PYTHON" scripts/generate-resume.py /tmp/master-resume-source.json public/portfolio-downloads
"$RESUME_PYTHON" "$RESUME_RENDERER" public/portfolio-downloads/riccardo-pesce-full-portfolio-en.docx --output_dir /tmp/resume-en --emit_pdf
"$RESUME_PYTHON" "$RESUME_RENDERER" public/portfolio-downloads/riccardo-pesce-full-portfolio-it.docx --output_dir /tmp/resume-it --emit_pdf
cp /tmp/resume-en/riccardo-pesce-full-portfolio-en.pdf public/portfolio-downloads/
cp /tmp/resume-it/riccardo-pesce-full-portfolio-it.pdf public/portfolio-downloads/
```

Inspect every rendered page and check both language versions before accepting
new assets. Then run `node scripts/check-resume.mjs --write` to record their
hashes (`npm run resume:accept`), then run `npm test` and `npm run build`.
The build rejects stale content/layout fingerprints, missing assets or modified
file hashes. `npm run resume:check` verifies downloads independently. Diagnostics
name the stale source/layout or exact missing/modified file. Tests also check the
committed artifacts against the current generator, and CI runs them before build.
The v2 source fingerprint hashes canonical exported English/Italian data and the
generator; whitespace, TypeScript formatting and object key order do not invalidate
reviewed documents. The manifest migration preserved all four binary hashes and
verified equivalence of exported content against the previous reviewed sources.
Keep the generator's Arial aligned with the reviewed downloads. Font changes
require regenerating and visually reviewing both PDF/DOCX language versions. Updating the
manifest alone does not regenerate or validate content. Normal builds never
rewrite or automatically accept the manifest.
Test all four selections, keyboard navigation, narrow layouts, both themes,
JavaScript disabled and navigation away/back when browser verification is available.

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

The timeline includes nine roles, including earlier Appen and iSoftStone
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
For the bachelor additional activity (3 credits, year 3), the author specified
a theoretical ML-pipeline discussion linked to their Appen evaluator work.
It is displayed as “Additional Skills for Employment” and covers ETL, raw and
curated storage, annotation quality, dataset versioning and ML training/evaluation.
Its content is author-supplied rather than taken from an official syllabus;
the example architecture is hypothetical, not a description of Appen's internal
systems or a claim that the author implemented them.
The master activity with the same display name follows the supplied
`Axle-3CFU_0.pdf` flyer: AXLE ICT Solutions' Project Life Cycle course, 30 hours
in English, covering initial setup, completion and maintenance, technical tools,
behavioural strategies, soft skills and communication. The author identified it
as their course; the flyer describes its content and is not a completion
certificate. Transcript credits and course year remain unchanged. No additional
methodologies, software tools or certifications are inferred from the flyer.
Course names and module references are rendered in English, with faithful
translations of the transcript titles; the page displays “credits” rather than
the Italian abbreviation CFU. Credit values and course years follow the transcripts;
individual grades and personal identifiers are not
included. The PDF files themselves are not published. Each activity expands
independently within its course year.

The 32 named subjects retain verified historical UniCT syllabus references in
`src/data/education.ts`. Each course keeps its existing description and adds a
closed native disclosure with an English topic guide from
`src/data/course-syllabi.ts`, its academic year and the official source link.
The guides paraphrase the published programme; the link provides the original
record with teaching methods, references and assessment where published.
Algebra, Computer Science Fundamentals and Signal Theory are explicitly marked
as objectives-only because their historical records do not publish a detailed
programme. No missing content is reconstructed from another year or degree.
The 32 records were checked on 15 November 2026; editions were confirmed by the
author. These additions are website-only and do not change the exported portfolio
documents. Native details/summary controls work without JavaScript, stay closed
initially and do not change the URL. Source URLs and years must match the course;
a missing record or edition mismatch fails the build.
Their English descriptions summarize those sources, not claimed professional proficiency.
Each reference identifies its academic year: 2015/2016 and 2016/2017 for the core
bachelor subjects, 2018/2019 for Big Data and Machine Learning, and 2019/2020
or 2020/2021 for the master subjects. Editions and teaching channels are reference
matches, not proof of the exact class attended; some first-year credits were
transferred from another degree. Preserve that distinction when updating links.
The final activities appear separately as bachelor and master theses, with
3 and 18 credits respectively, rather than as taught subjects. The coursework
lists therefore contain 23 bachelor and 13 master activities; total degree
credits remain 180 and 120 when the thesis credits are included. Additional
activities and language assessment have no invented syllabus references;
the bachelor additional activity uses the author-specified description above.

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
while credits and four sections (Rationale, Objective, Experiment and Results)
open on click or keyboard activation. Each section uses short paragraphs rather
than one continuous abstract. They use
native details elements and remain operable without JavaScript.

Bachelor results follow the source tables, including the two 95% ResNet/DenseNet
transfers and their CPU timings; its validation partition was used to assess
adaptation. Master figures follow summary slides 16, 18 and 20. The earlier
baseline slide reports a different accuracy from the summary table, so that
baseline-with-CWL number is not repeated in the public synopsis. Do not infer
dataset sizes, participant counts, independent replications or clinical outcomes
that these sources do not establish. Retain the experimental context when
updating results.

After editing education data, compare activity names and CFU with the transcripts,
check totals including the separate theses, verify the individual official syllabus URLs and years, and ensure
the generated page contains no individual grades or personal identifiers. Check
both levels of disclosure with a keyboard and at narrow widths.

The timeline shows every role in chronological order with an expand/collapse-all
control, without category filters. Native disclosures and section links work
without JavaScript; the bulk disclosure control appears after initialization.
The custom element cleans up
event handlers when Astro navigation removes the page. The shared mobile menu
now switches at 768px to accommodate the additional navigation link. Below that
width, the hamburger uses three equal, fixed-length lines in a 24px icon and a
48px button; from 768px the button is hidden and the navigation stays visible.

Section headings describe the actual career and academic content rather than
evaluating its value. Role summaries remain visible when details are collapsed.
A timeline orders the roles; expanded content separates contributions from
technologies on desktop and stacks them on mobile. Reading lines are limited
to 65 characters where space permits.

The complete portfolio contains Summary, Experience, Education, Projects and
Skills, with the toolkit in Skills and community involvement in Summary.
It now uses `data-plain-view` so its section navigation keeps ordinary document
semantics and every section stays visible in full mode. The legacy tab-view
button stays hidden; the complete document is always visible. Section links retain smooth scrolling and the
existing keyboard focus behaviour, with immediate scrolling for reduced motion.
The navigation controller cleans up observers and listeners on Astro navigation.

`ProjectCarousel.astro` supports an explicit `plain` prop. On this portfolio it
renders an ordinary section containing all project cards, so no project content
is inert or limited to a selected slide in the complete document. Its original
interactive carousel mode remains available to other callers. All original
project descriptions, toolkits and source links are retained.

Below 768px, page groups use a single column: the brand and menu button, menu
links and theme control, hero introductions, CTAs, experience controls, metadata,
course disclosures, technology lists, cards, social links and pagination. The
portrait, headings, labels, metadata, tags and navigation controls are centered.
Portfolio copy and contact input values are centered too; long-form article and
About paragraphs keep their reading alignment. The mobile experience cards use
the full content width, with the timeline guide appearing from 768px. Desktop
layouts and their original alignment resume at 768px. The theme control has its own full-width
menu row with a visible label. Check the open and closed menu, theme switching,
Full plain view and disclosures at 320px, 640px, 767px and 768px.
Breadcrumbs are an exception: they remain inline at every width and wrap only
when space runs out, with separators visible on mobile too.

Native disclosures retain their existing behaviour; supported browsers fade
opacity without animating layout dimensions. Transitions and entry motion respect `prefers-reduced-motion`. Nothing
depends on scroll-triggered content hiding. The tab regression tests
use DOM-boundary doubles, not a real browser; visual and assistive-technology checks remain
necessary.

When changing interactions, verify expand/collapse of all roles, individual
disclosures, keyboard operation,
tab selection, full CV mode, direct fragments and Back/Forward. Check navigation
away and back, narrow and wide layouts, light/dark modes, printing, reduced motion
and the page with JavaScript disabled. Run `node --test tests/*.test.mjs` for the
interaction and configuration regressions.

## Portrait

Home uses a text-only hero with links to Portfolio and Blog, followed by recent posts.

The author portrait appears in the Portfolio header and About introduction, where
it identifies the person described by the adjacent text. Its placement is a design
choice, not a claim of improved trust or recruitment outcomes. The shared
`src/components/Portrait.astro` imports `src/assets/images/riccardo-maria-pesce.jpeg`
and uses Astro's Image component for WebP variants at 112, 160, 224 and 320px.
It uses a circular frame, centered above the introduction on mobile and beside
the heading on wider screens. It displays at 112px on mobile and 160px from 640px, with explicit dimensions
reserving its square aspect ratio. It loads eagerly because it is above the fold;
no extra high-priority hint competes with the page's primary text. Its alternative
text identifies Riccardo M. Pesce, following the
[W3C informative image guidance](https://www.w3.org/WAI/tutorials/images/informative/).
Replace the source image to update both placements, then check the face framing
and generated sizes on narrow and wide screens. The source file is not copied
directly into public output; Astro generates the served image variants.

## Colors and contrast

On the first visit, the theme follows the operating system's
`prefers-color-scheme` setting. System changes continue to apply until the visitor
uses the theme button. Only that explicit choice is saved in `localStorage`
under `theme`, and it takes priority on future visits and during Astro navigation.
Other open tabs synchronize changes to that stored preference. Removing it restores
system behavior; invalid values are ignored. The head script applies the same rule
before the first paint. Native controls receive the matching `color-scheme`.
If browser policy blocks storage, the toggle still works for the current visit,
but the choice cannot be remembered after reloading. Storage is local to each
browser and origin; localhost and the public site do not share preferences.

Palette and typography tokens live in `src/styles/theme.css`: light matte paper/warm ink
and dark graphite/warm highlights. Inter headings, reading and UI, and JetBrains
Mono metadata are self-hosted; see **Fonts and social previews** below. Primary
reading text reaches AAA contrast; secondary text and hover states meet AA.
`tests/contrast.test.mjs` checks normal text, filled controls, selection and input
borders against both themes' page, card and muted surfaces.

## Accessibility and browser defaults

- The layout's first focusable element skips to a single `main#main-content`.
  Native fragment navigation and `tabindex="-1"` work without JavaScript.
- All focusable controls use a solid 2px accent outline, offset by 2px, including
  Pagefind and horizontal table/math regions. Forced-colors mode uses `Highlight`.
- Navigation landmarks have names; decorative icons are hidden from assistive
  technology. Mobile menu state has matching labels/controls and Escape restores
  button focus. The menu remains available without JavaScript.
- Smooth scrolling and transitions require `prefers-reduced-motion: no-preference`;
  reduced motion disables animations, transitions and view-transition effects.
- Both Astro configurations apply the Markdown/MDX content plugin: external HTTP
  links keep normal navigation, gain `noopener noreferrer` and visible/announced
  external-site cues. Existing new-tab links announce that behavior.
- Markdown images default to lazy/async loading. Build checks require alt text
  and intrinsic dimensions or an aspect ratio. The above-fold portrait stays eager.
- KaTeX retains MathML alongside hidden visual markup; display equations and
  tables scroll horizontally and are keyboard-focusable, named regions.
- Media stays within its container; long prose and identifiers wrap. Touch header,
  pagination and tag targets are at least 44px. Selection uses opaque accent ink.
- Search has a named input, preserves query links, restores focus after clearing,
  reports initialization failures and releases handlers on navigation. A Blog
  fallback exists without JavaScript; blocked storage cannot break search. Search
  remains disabled in the default configuration; set `features.search` to
  `"pagefind"` to expose it. Sharing controls are excluded from search excerpts.
- Print hides navigation, sharing, comments, dialogs and footer chrome, uses black
  ink on white, exposes portfolio panels and temporarily opens disclosures.
  The previous disclosure state is restored afterwards. Image previews isolate
  the page with `inert`, trap keyboard focus and restore the trigger on close.

`npm test` runs behavior/contrast regressions. `npm run build` also checks generated
HTML for landmarks, skip order, duplicate IDs, names, ARIA references and media
geometry; it fails rather than publishing those regressions. These checks do not
certify whole-site WCAG conformance. Browser checks should cover keyboard-only
navigation, 200% zoom, narrow layouts, reduced motion, both themes, print preview,
Pagefind results and assistive-technology reading of KaTeX. Third-party embedded
comments and form-provider pages require separate verification.

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

Public email links are enclosed in Cloudflare's documented
[`email_off` HTML comments](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/#prevent-cloudflare-from-obfuscating-email).
Keep these markers in the generated HTML so the address and `mailto:` links work
without Cloudflare's JavaScript decoder. After deployment, verify Contacts and
the email icon on the public domain; local output cannot verify edge rewriting.
If an old protected link persists, check the deployed version and cached HTML.

## Blog comments

Blog posts support [giscus](https://giscus.app/), backed by GitHub Discussions.
Activation requires the public `RiccardoMPesce/riccardompesce-website` repository,
Discussions enabled in its settings, and the [giscus GitHub App](https://github.com/apps/giscus)
installed for that repository. These account steps are not performed by the build.

The repository and Announcements category IDs in `src/data/comments.ts` were
verified through GitHub and the giscus category API. Comments use these defaults
without environment configuration. To change categories, select the repository
at giscus.app and set `PUBLIC_GISCUS_CATEGORY` and `PUBLIC_GISCUS_CATEGORY_ID`
from its generated script (see `.env.example`). Use `.env` locally or Cloudflare
Pages Production/Preview variables, then rebuild. Changing repositories also
requires updating the repository name and node ID in `src/data/comments.ts`.
Incomplete overrides fail the build. Set both overrides to empty strings to
omit the comments section.

Readers choose **Load comments** before any giscus request is made. Comments are
public, require GitHub sign-in, and can be moderated through GitHub. Each post
uses its pathname with strict matching; preserve published post paths to keep
their discussion association. The widget follows the site's light/dark theme,
handles script download failures with retry, and offers a GitHub fallback link.
The integration reconnects after Astro navigation and removes theme observers
when leaving the page.

After activation, check two different posts, light/dark switching, narrow layouts,
keyboard use, blocked third-party scripts, and navigating between posts. Verify
an actual comment on a deployed post before claiming end-to-end availability;
avoid posting test comments from localhost because they use the same discussion mapping.

## Fonts and social previews

Astro loads `astro.config.mjs` before `astro.config.ts`; default commands use the
`.mjs` configuration. Both configurations avoid remote font providers.

Page fonts are self-hosted Fontsource variable fonts: Inter for headings,
Inter for body/UI, and JetBrains Mono for code and technical metadata. Explicit
`@font-face` declarations in `src/styles/fonts.css` include only Latin and Latin
Extended (plus real Inter/Mono italics), with `font-display: swap`. The layout
preloads the exact Latin Inter WOFF2 URL used by CSS. Extended
subsets and noncritical faces load only when needed. KaTeX CSS and math fonts
are bundled from the installed package, without a CDN. Satori uses local static
Inter WOFF at 400/700 from `@fontsource/inter` because variable WOFF2 is unsupported.
No Google Fonts connection is required at build time or in the browser.

Tailwind v4 semantic tokens live in `src/styles/theme.css`; AstroPaper's fill,
text-base, card and card-muted aliases share the existing component tokens.
Light uses matte paper/warm ink; dark uses graphite/warm highlights. Article prose is limited to 68ch,
with 17px text on desktop, 1.7 line height and 1.35em paragraph spacing. Code,
tables, blockquotes and horizontally scrolling math follow both themes.

Nominal token contrast across page/card/secondary surfaces is at least 12.03:1
for primary reading text, 4.89:1 for secondary text using its scoped surface
correction, and 6.48:1 for accent links. Body text meets AAA and secondary copy
meets AA; syntax colours require separate per-token auditing. This is not a
whole-site accessibility certification or a rendered-texture measurement.
Preloads reduce font-related layout shifts,
but `swap` and system fallback metrics cannot guarantee zero CLS on a cold or
slow connection; measure this on deployment as well as local pages.

The site generates `/og.png` and per-post social preview images with Satori and Sharp.
The general description in `astro-paper.config.ts` covers work, study, exploration
and learning. Home metadata, the default social description, the generated site
preview image and RSS share this source. Individual pages and posts keep their
specific descriptions. Rebuild and deploy to update the public previews; sharing
services may retain previously fetched metadata or images in their own caches.

## Cloudflare Pages

- Build command: `pnpm build`.
- Output directory: `dist`.
- Project root: repository root.
- Node version: `.nvmrc`, or `NODE_VERSION=24.21.0` in both Production and Preview
  if a dashboard override is configured.

Pages publishes the static output without an Astro Cloudflare adapter. The build
uses locally installed fonts. A local build does not verify remote deployment.

## License

MIT. Original AstroPaper theme by Sat Naing; see `LICENSE`.

Section links scroll without adding a URL fragment. Refreshing clears fragments
and resets Astro’s saved scroll coordinates before the router initializes,
returning to the full plain portfolio at the top. `?view=all` opens the full plain
portfolio. Explicit incoming fragment links remain supported.
