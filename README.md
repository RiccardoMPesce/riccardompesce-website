# Riccardo Pesce

A minimal personal website built with Astro and Tailwind CSS, based on AstroPaper.
The home page introduces Riccardo and lists the three latest published posts.
The navigation links to Home, Blog, About, Portfolio and Contacts, with light and dark themes.
The shared footer uses the configured site author for its copyright notice and
links to Astro and the original AstroPaper theme for attribution, below the
**Find me** profile links and aligned with the copyright in the bottom row on wide screens.

## Sharing

Articles show a flat sharing row below the title and publication date, before
the article body. LinkedIn, X, Facebook and **Copy link** are immediately visible;
**More**, with a fixed SVG chevron, opens a compact native `dialog` above the page
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

Portfolio navigation progressively enhances five sections into tabs: Summary
(default), Experience, Education, Projects and Skills. Skills includes the
toolkit; community involvement is in Summary. The short identity header remains
visible above the tabs. Only the selected panel occupies space. The tab labels
are centered inside equally sized, outlined button shapes; the selected tab uses
the theme's filled accent style and a heavier label. **View full CV** toggles an
ordinary document with every section visible for comparison and browser Find.
Entering this view highlights only Summary without scrolling to the top. It keeps
that initial highlight through layout/size changes until the reader starts
scrolling with a wheel/trackpad, touch, keyboard or scrollbar. The highlight then
follows the visible section. Section links retain their explicit smooth scrolling.
Its separate pill-shaped button has a section-list icon and stronger outline;
it becomes filled when the full view is active. `?view=all` shares that view.
Without JavaScript all sections and anchor links remain available; print styles
also reveal every section, keeping
the existing disclosure states.

The choice follows [NN/g's tabs guidance](https://www.nngroup.com/articles/tabs-used-right/)
and [GOV.UK's trade-offs](https://design-system.service.gov.uk/components/tabs/):
use a few clearly named groups, keep the initial overview useful, and provide
another way to compare content. This is a design rationale, not a CV-specific
usability finding. [W3C's tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
informs roles, selected states, linked panels and roving keyboard focus.

Below 768px the tab list is vertical and uses Up/Down; from 768px it is horizontal,
sticky and uses Left/Right. Home/End select the first/last tab; Enter/Space activate
it. Arrow navigation activates immediately because all content is already loaded.
The selected section is stored in the URL fragment. Existing section and role
links, including `#toolkit`, reveal their containing panel; Back/Forward restores
the URL's view. Switching tabs retains disclosure state. Full CV mode
restores ordinary document semantics. Both custom elements remove listeners on
Astro navigation, and transitions respect reduced motion.

In full CV mode, section links smoothly scroll up or down to the selected section
without hiding the other sections. Reduced-motion preferences use immediate
scrolling. Explicit clicks update the URL; scrolling highlights the current
section without creating history entries. The destination offset accounts for
the measured compact toolbar height, keeping headings visible.

On desktop, the sticky toolbar collapses to a single, smaller row when its marker
passes the viewport top. The section buttons and full CV toggle remain available,
with a 44px minimum target height. The expanded toolbar's space is reserved to
avoid shifting document content; its transparent unused area does not intercept
clicks. Mobile retains the vertical non-sticky controls. Scroll/resize work shares
one animation frame, a ResizeObserver tracks toolbar height, and both are cleaned
up when leaving the page.

Projects uses `ProjectCarousel.astro` with an accompanying custom element.
Its horizontally scrollable tab bar uses compact rectangular bars showing each
project's title, contribution type and first two technologies. An intrinsic-width
grid gives all bars the width of the widest content, capped for narrow screens,
instead of stretching a single bar across the row. CSS recalculates this as fonts
load and text size changes. Automatic inline margins center the whole group while
it fits; when it overflows, the group starts at the leading edge and remains fully
scrollable. Selecting a bar
scrolls the carousel to that project. Bars snap gently while browsing and the
selected bar remains in view. Dedicated left/right buttons scroll the preview
strip without changing the selected project; the separate carousel arrows change
the project. No visible instruction text is needed. The full card retains the
description, complete toolkit and source link. The current data contains one
verified project (CMD Call Graph); both sets of arrows remain visible and disable
directions that have no further content. Preview arrows update after scrolling
or resizing, including when the strip has no overflow.
Adding entries to `portfolio.projects` enables navigation automatically.

With multiple projects, the viewport supports native swipe/trackpad scrolling,
CSS scroll snapping, preview clicks, arrow controls and Left/Right/Home/End keys
within the horizontal preview bar. Only the selected slide's links are focusable.
Both the preview strip and slide viewport support mouse dragging with pointer
capture; a six-pixel horizontal threshold preserves ordinary clicks. Releasing
a drag suppresses its click, and pointer cancellation, lost capture, window blur
or navigation releases the drag state. Touch and horizontal trackpad gestures
retain native scrolling. Vertical wheel input over the preview strip scrolls it
horizontally only while more content exists in that direction; at its boundaries
the page remains scrollable. Ctrl-wheel zoom is preserved.
There is no automatic rotation; reduced motion disables animated scrolling.
A size observer aligns the selected slide when its Portfolio tab becomes visible.
Without JavaScript, and when printing, project cards appear as an ordinary list.
Tests cover single and multiple projects, interrupted smooth scrolling, hidden
panels, keyboard selection, resizing and cleanup. These DOM-boundary checks do not
replace testing swipe behavior and assistive technology in a real browser.

Below 768px, page groups use a single column: the brand and menu button, menu
links and theme control, hero introductions, CTAs, experience controls, metadata,
course disclosures, technology lists, cards, social links and pagination. The
portrait, headings, labels, metadata, tags and navigation controls are centered.
Portfolio copy and contact input values are centered too; long-form article and
About paragraphs keep their reading alignment. The mobile experience cards use
the full content width, with the timeline guide appearing from 768px. Desktop
layouts and their original alignment resume at 768px. The theme control has its own full-width
menu row with a visible label. Check the open and closed menu, theme switching,
Portfolio tabs, full CV view and disclosures at 320px, 640px, 767px and 768px.
Breadcrumbs are an exception: they remain inline at every width and wrap only
when space runs out, with separators visible on mobile too.

Disclosures animate their height and opacity where `::details-content` and
`interpolate-size` are supported; other browsers retain native immediate
opening. Transitions and entry motion respect `prefers-reduced-motion`. Nothing
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

The author portrait appears in the Home introduction and Portfolio header, where
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

Palette tokens live in `src/styles/theme.css`. Both themes use matte, desaturated
surfaces with a warm red undertone. Light mode uses a `#f1e9e6` muted rose page,
`#3d3231` brown-gray text and `#ece2dd` panels. Dark mode keeps the deployed
charcoal appearance with a nearly imperceptible warm shift: `#1a1818` page,
`#e8e5e4` text and `#222020` panels, with `#d4cfcc` filled controls.
These are color choices for the requested appearance, not a sleep benefit or
night-mode certification. CSS cannot set the display's physical brightness or
substitute for device-level night-light settings. The contact panel uses `surface`, while
form fields use `input-border` so their outlines remain distinct from decorative
dividers. Buttons use separate foreground and hover colors in each theme.

The token pairs were checked with the WCAG relative-luminance calculation:
body text on the page background is 10.32:1 (light) and 14.11:1 (dark); secondary
text is 5.97:1 and 7.98:1; button text is 7.95:1 and 11.56:1. Form borders exceed
3:1 against both adjacent surfaces. Text pairs also exceed 4.5:1 on the panel,
muted backgrounds and button hover states. These checks cover color pairs,
not a full accessibility audit or a claim about users' color preferences.
Use [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
when changing these tokens.

## Reading typography

Page text uses [Atkinson Hyperlegible Next](https://www.brailleinstitute.org/freefont/),
designed with distinctive letterforms and numerals for low-vision legibility.
This design rationale does not establish one universally most readable font.
Astro downloads and caches the Latin WOFF2 variable font at build time and serves
it from this site. Normal and italic styles cover weights 400–700; only the normal
style is preloaded. `font-display: swap` and Arial/system fallbacks keep text
available while it loads. The SIL Open Font License is distributed at
`public/fonts/atkinson-hyperlegible-next-OFL.txt`. No new package is required.

The body requests `-webkit-font-smoothing: antialiased` and
`-moz-osx-font-smoothing: grayscale`, plus normal kerning and automatic optical
sizing where supported. These are rendering hints, not a configurable blur or
anti-aliasing strength. As [MDN documents](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-smooth),
the smoothing properties are non-standard and apply on macOS; other systems
retain their native font rendering. Check both themes on the actual target
screen before drawing conclusions about perceived sharpness or comfort.

Long-form copy in About, posts, Home, Contacts and Portfolio uses `1.125rem`
(18px with the browser's usual 16px default), unitless 1.75 line spacing and a
maximum measure of 65ch where the layout permits. Paragraphs in articles have
1.5em vertical margins. Controls and supporting labels retain a smaller type
hierarchy. Headings use upright text; body text is aligned to the reading start,
without justification. Browser text size remains user-controlled.

These are design choices informed by [WCAG visual presentation](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html),
not proof of a reading-speed improvement or full AAA conformance. Exact palette
hex values reflect the requested appearance; their evidence is measured contrast,
not a claim that a color scheme is universally more comfortable. Preserve both themes.
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
`.mjs` configuration. Keep `--font-google-sans-code` registered with weights 400
and 700 and TTF/WOFF sources for Satori. Google Fonts must be reachable on the
first build. Astro caches downloaded fonts for later builds.

The site uses Atkinson Hyperlegible Next for page text and generates `/og.png` and per-post
social preview images with Satori and Sharp.
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
requires access to Google Fonts. A local build does not verify remote deployment.

## License

MIT. Original AstroPaper theme by Sat Naing; see `LICENSE`.
