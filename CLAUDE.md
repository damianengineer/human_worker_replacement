# CLAUDE.md — Project Instructions for Claude Code

> This file is the canonical instruction set Claude Code (and any other agentic
> coding assistant that supports `AGENTS.md`/`CLAUDE.md`) must read and follow
> before touching this repository. If a symlink named `AGENTS.md` pointing to
> this file does not exist, create one — some tools look for that name instead.

---

## 1. Project Overview

**Site type:** Contemporary informational / brochure website (marketing-style,
not a web app). Static site, no user accounts, no database.

**Core argument the site exists to make:**
AI-driven replacement of human workers is already underway, and entry-level
roles are at the greatest near-term risk. The site is aimed at college
students. The goal is **not** to discourage students from pursuing their
interests, but to:

1. Present current evidence and trends on AI's effect on entry-level jobs.
2. Encourage students to build a realistic backup plan.
3. Encourage students to build AI literacy as a competitive advantage.
4. Provide concrete calls to action (resources, next steps) tied to the above.

**Editorial stance:** Fair, balanced, transparent. Every non-obvious factual
claim needs a credible source. Counter-evidence and reasonable disagreement
must be represented, not just the alarming statistics. See Section 6.

**Target audience:** American community college students. This is the
audience of record for every page, not a secondary consideration — it should
shape reading level, examples, and tone throughout the site. See Section 2a.

---

## 2. Non-Negotiable Content Mandates

### 2a. Audience & Language Calibration (required for all content)

All copy in `content/*.md` must be written for **American community college
students**, not a general adult audience, a four-year-university audience, or
a policy/industry-expert audience. Concretely:

- **Reading level:** Target roughly an 8th–10th grade reading level
  (Flesch-Kincaid). Prefer short sentences and common words over
  dense or academic phrasing.
- **Jargon:** Avoid unexplained field-specific jargon (economics,
  labor-market research, AI/ML terminology). When a technical term is
  necessary (e.g., "automation," "generative AI," "entry-level attrition"),
  define it in plain language the first time it's used on a page.
- **Assume no prior coursework** in economics, statistics, or computer
  science. Explain a statistic's meaning in a sentence, not just the number
  (e.g., don't drop "labor force participation rate fell 2 points" without a
  one-line plain-language translation of what that means for a student).
- **Assume a commuter/working-student context where relevant:** many
  community college students work part- or full-time, may be first-generation
  college students, and may be balancing coursework with jobs or family
  responsibilities. Examples, CTAs, and the "backup plan"/"AI literacy"
  guidance should reflect realistic options for this audience (e.g.,
  affordable or free resources, transferable skills, local/community
  resources) rather than assuming free time, disposable income, or access
  that a residential four-year student might have.
- **Tone:** Direct, respectful, and encouraging — never condescending,
  alarmist, or academic. Avoid a lecturing voice; write as if talking to a
  smart peer who is busy and new to the topic.
- **Citations still apply at this reading level:** APA in-text citations and
  the references page (Section 6) are still required. Do not remove or dumb
  down citations — instead, pair each cited statistic with a plain-language
  explanation of what it means.
- Claude Code should self-check any drafted or edited copy against this
  section before treating a content task as complete, and should flag to the
  user any passage it's unsure clears an 8th–10th grade reading level rather
  than silently leaving it as-is.

### 2b. Fairness, Sourcing & Disclosure

Claude Code must refuse to ship content that violates any of these, and
should flag it to the user instead of silently "fixing" it:

- **Balance:** For every major claim of job displacement risk, actively look
  for and include credible counterpoints or nuance (e.g., job transformation
  vs. elimination, sector variance, economist disagreement). Do not cherry-pick
  only the most dramatic statistics.
- **Sourcing & credit:** Any statistic, study, or quote must be attributed to
  its original source, not to the outlet that merely reported it, wherever the
  original is identifiable.
- **Conflicts of interest disclosure:** If any cited source, sponsor, dataset
  provider, or contributor has a financial or institutional interest in the
  AI-and-labor narrative (e.g., an AI vendor's own research, a jobs-platform's
  self-interested study), this must be disclosed inline or in a footnote next
  to the claim — not buried only in the references page.
- **AI disclosure:** See Section 7 — this is a required page, not optional
  boilerplate.
- **No fabricated stats, quotes, or sources.** If a number is uncertain or an
  estimate, say so and cite the range.

---

## 3. Tech Stack & Hosting

- **Static site generator:** [Eleventy (11ty)](https://www.11ty.dev/) —
  chosen because it cleanly separates **content** (Markdown/YAML/JSON) from
  **templates** (Nunjucks) from **styles** (CSS), with zero client-side
  framework overhead, which suits a brochure site and keeps the OWASP attack
  surface small.
- If the user has already scaffolded a different SSG (Astro, Hugo, plain
  HTML) before invoking Claude Code, **do not migrate frameworks** without
  asking — adapt these rules to the existing stack instead.
- **Hosting:** GitHub Pages, serving the `docs/` folder on `main` (Settings →
  Pages → Deploy from a branch). Publishing is manual: run `npm run build`
  (outputs to `docs/`, with the `--pathprefix` needed for this repo's
  project-page subpath baked into the npm scripts) and commit the result.
  A GitHub Actions-based deploy was tried first and abandoned (no
  available runner in this environment); don't reintroduce
  `.github/workflows/deploy.yml` without checking that constraint has
  changed. No server-side code, no databases, no secrets required at
  runtime.
- **Package manager:** npm. Lockfile (`package-lock.json`) must be committed.
- **No client-side frameworks (React/Vue/etc.) unless explicitly requested.**
  This is a content site; vanilla HTML/CSS with minimal progressive-enhancement
  JS is the default.

---

## 4. Repository Structure

Content, presentation, and logic must live in physically separate
directories so a non-technical editor can update copy without touching code.

```
/
├── CLAUDE.md                  # this file
├── AGENTS.md                  # symlink to CLAUDE.md
├── README.md                  # human-facing setup/contribution guide
├── package.json
├── .eleventy.js                # build config
├── content/                    # ALL editable copy lives here — Markdown/YAML only
│   ├── index.md                 # landing page (routes to site root "/")
│   ├── home.yaml                 # landing page's structured content
│   ├── the-evidence.md
│   ├── evidence.yaml              # The Evidence page's structured content
│   ├── history.md
│   ├── history.yaml               # History page's four cases
│   ├── glossary.md
│   ├── glossary.yaml               # Glossary term list
│   ├── take-action.md
│   ├── takeaction.yaml             # hosts the Plan B / AI Literacy / Policy
│   │                                 CTAs as anchored sections on one page
│   │                                 (see Section 5 — these are NOT separate
│   │                                 pages, unlike this file tree's original
│   │                                 draft)
│   ├── about.md
│   ├── ai-disclosure.md
│   ├── aidisclosure.yaml           # AI Disclosure's work log (see Section 7)
│   ├── references.md           # APA reference list, generated from citations.yaml
│   ├── site.yaml                # global strings: nav labels, site title, footer
│   └── citations.yaml           # structured citation data (see Section 6)
├── src/
│   ├── _includes/
│   │   ├── layouts/             # one Nunjucks layout per page (no prose here)
│   │   └── partials/            # header, footer, nav
│   ├── assets/
│   │   ├── css/                 # tokens.css + one stylesheet per page
│   │   └── img/
│   │   # no assets/js/ yet — the site has needed none so far (fully
│   │   # readable/navigable without JS); add it when a real need comes up
│   │   # rather than scaffolding unused files.
│   │   # TODO(2026-07-22): outstanding — 404.njk not yet implemented.
├── docs/                        # build output — committed; this is what
│                                 # GitHub Pages serves (see Section 3)
└── (planned, not yet built) .github/workflows/ci.yml and tests/ — see
    Section 8's npm-audit/a11y/link-check requirements, currently run
    manually rather than in CI.
```

**Rule:** Templates in `src/_includes` may contain layout markup, ARIA
attributes, and loop logic to render content — they must **never** contain
hardcoded prose, headlines, or citation text. If Claude Code needs to add a
sentence of copy, it goes in a `content/*.md` file, not in a template.

---

## 5. Information Architecture

Follow standard IA best practices for a brochure site: shallow hierarchy,
clear task-based navigation, consistent breadcrumbing, one primary CTA per
page.

**Site map (max depth: 2 clicks from home):**

```
Home
├── The Evidence            (data/trends on AI and entry-level jobs)
├── Take Action             (primary CTAs — Build Your Backup Plan, Build
│                            Your AI Literacy, and AI Policy are anchored
│                            sections on this one page, #plan-b/#ai-literacy/
│                            #policy, not separate pages)
├── History                  (past tech-disruption cases, as context for
│                             The Evidence — not in the original spec below,
│                             added as the site was built out)
├── Glossary                  (plain-language term definitions, same reason)
├── About                    (who made this, mission, funding/COI disclosure)
├── AI Disclosure            (required — see Section 7)
└── References                (APA-formatted bibliography)
```

Requirements:

- Global nav present on every page, current page indicated (`aria-current="page"`).
- Every page has a single clear primary CTA (e.g., "See the data," "Get the
  checklist") — avoid competing CTAs per IA best practice. **Documented
  exception:** Take Action is the site's CTA hub by design (see the sitemap
  above) and legitimately hosts three, not one.
- **Primary CTA vs. contextual cross-links:** the one-primary-CTA rule above
  governs a page's main call to action, not its inline cross-links to
  related pages/sections (e.g., `/the-evidence/` linking to `/take-action/`
  and `/history/`, or `/glossary/` linking back to where a term is used).
  Contextual cross-links support the site's "read this → now go do that"
  journey and are encouraged; they don't count against the one-primary-CTA
  rule.
- **In-page TOC completeness:** on any page with an in-page jump-nav/table
  of contents, every section that is deep-linked from elsewhere in the site
  must also appear in that page's own in-page nav. When adding a cross-page
  deep link to a section, verify the target section is listed in its own
  page's jump-nav, and add it if missing.
- Footer includes links to **About**, **AI Disclosure**, and **References** on
  every page (transparency should never be more than one click away).
- Breadcrumbs on any page nested under a section.
- URL slugs are human-readable and stable (`/the-evidence/`, not `/page2/`).
- Provide an HTML sitemap page and an XML `sitemap.xml` for SEO.
  `TODO(2026-07-22): outstanding — HTML sitemap page + sitemap.xml not yet
  implemented; required for navigability/SEO.`

### 5a. Take Action: Topic Hub & Progressive Disclosure

Adopted in the Take Action v2 batch, after the page grew to ~2,740 words
with 38 citation markers on one scroll — long enough that its actual
message (three things a student can do) was getting buried under prose
and citations.

- **`content/takeaction.yaml`'s `hub` block** is a compact wayfinding
  summary rendered directly after the page intro, before the three CTAs:
  a `lead` line plus one `card` per CTA (`key`, `icon`, `title`, `blurb`,
  `href`, `cta_label`). It's additive, not a replacement — each CTA
  section keeps its own heading and emoji. Card titles render as styled
  `<p>`, not `<h3>`: a heading there would skip a level, since the hub
  sits above the page's first `<h2>`.
- **The `summary` field** is optional on any flat `items` entry (`plan_b`,
  `policy`). Where present, the template wraps the item's existing `text`
  in `<details>`/`<summary>` — the summary is a short, imperative,
  action-first line (in practice, the item's own opening sentence,
  reused rather than freshly written). Items without `summary` render
  exactly as before. The same `<details>` pattern wraps each
  `ai_literacy` resource group, with `<summary>` reading "Type (count)".
- **Safety cautions and the policy debate are never collapsed by
  default.** Any caution/warning subsection (e.g. `caution_section`) and
  `#policy-debate` stay in the fully visible layer — supporting detail
  around them may be disclosed, but the caution itself or the debate's
  two proposals and site stance never sit behind a click a reader has to
  choose to make.
- **An anchor id must never end up unreachable inside a collapsed
  `<details>`.** If a group/section that already has (or needs) an id is
  collapsed by default, the id goes on the `<details>` element itself,
  not on an inner wrapper — a browser can still navigate to a closed
  `<details>` by id even though its content stays hidden until opened.
  Moving an id like this is the sanctioned fix, not leaving it buried.
- **Accepted trade-off:** content inside a closed `<details>` is invisible
  to the browser's in-page Ctrl+F/Find until a reader opens it. This is a
  known limitation of native disclosure, not something to work around
  with JavaScript — the site stays zero-JS by design.

### 5b. The Evidence Page: Illustrative Examples vs. Sourced Notes

Adopted in the Evidence Clarity batch, after reviewer feedback that the
page asserted things ("hiring slows, nobody gets fired") without ever
showing what that looks like, and that a long theoretical-vs-observed
paragraph mixed a general concept with one specific data disagreement.

- **`current_state` items may carry an optional `example` field, which is
  not the same field as `note`.** `note` explains what a corroborating
  source shows and is sourcing apparatus attached to the claim above it;
  `example` is a short (40–70 word), plain-language, recognizably
  hypothetical scenario illustrating what the claim looks like in
  practice, with no sourcing role of its own — it carries no citations,
  since the claim above it already carries them. Both fields may exist on
  the same item; the template renders them as visually distinct blocks
  (`.evidence-list__note` vs. `.evidence-example`) and never merges them.
  `example` always renders after the claim's own citation markers and
  `note`, so it can never read as part of the sourced material.
- **A subsection's long prose may split into `concept` and `example`
  fields** where a single paragraph mixes a general point with one
  specific supporting case (the pattern used in `at_risk.
  theoretical_vs_observed`: the general capability-vs-use gap is
  `concept`, the law-industry data disagreement between the two AI labs
  is a nested `example: {heading, text, citations}`). Splitting an
  existing paragraph this way must preserve every sentence — same
  sentences, same order, same meaning; only connective phrasing or a
  pronoun-antecedent fix may change. The `example`'s own citations render
  inside its block, never orphaned above it. This is a different pattern
  from `current_state`'s item-level `example` above (a real, cited
  example splitting off a concept, vs. a hypothetical, uncited
  illustration) — don't conflate the two when adding a similar field
  elsewhere.

### 5c. The Evidence Page: Paired Figure Layout

Adopted in the Evidence Figure Stack batch, after a mismatched native
aspect ratio between `theoretical_vs_observed`'s two charts (1:1 square vs.
1.62:1 landscape) left the shorter chart floating with dead space beneath
it in the base two-column `.evidence-figures` grid.

- **A figure entry may carry an optional `modifier_class` field** — a CSS
  class appended to that figure's own `<figure>` element (e.g.
  `evidence-figure--radar-cap`, which caps a figure's width only at wide
  viewports so an unusually tall/square chart doesn't dominate the page).
  Leave it unset for any figure that should render at the grid's default
  sizing.
- **A figure *list* may pass a grid modifier as `figuresGrid`'s 4th
  argument** (e.g. `evidence-figures--stacked`, which forces one column at
  every viewport width instead of the base rule's two-column layout above
  40rem). This is scoped per call site in the template, not per page — the
  base `.evidence-figures` rule stays the shared default for any figure
  pair that doesn't need this treatment (Most Exposed Occupations' pair
  uses the unmodified base rule).
- **Reordering a figure pair is a content-level change**, not a template
  one: `figures` is an ordered list in `evidence.yaml`, so change display
  order by reordering the list, never by adding template logic to
  reorder at render time.

---

## 6. Content & Citation Guidelines (APA style)

- All in-text citations and the references page must follow **APA 7th
  edition** style.
- Structured citation data belongs in `content/citations.yaml`, keyed by
  citation ID, e.g.:

```yaml
mckinsey2023:
  authors: "McKinsey Global Institute"
  year: 2023
  title: "The future of work after COVID-19"
  publisher: "McKinsey & Company"
  url: "https://www.mckinsey.com/..."
  type: "report"
  potential_conflict: "None disclosed"
```

- In practice, most citation IDs live as fields inside each page's
  structured `content/*.yaml` data file (e.g. `evidence.yaml`'s
  `primary_citation`/`corroborating_citation`, or a `citations: [...]`
  list), not inline in `content/*.md` prose — each page's Nunjucks layout
  loops over that data and renders the citation via the shared `citeLink`
  filter (a `{% cite "id" %}` shortcode also exists for the rarer case of
  citing something directly inside flowing markdown prose). Either way,
  the filter/shortcode renders the in-text APA parenthetical and the
  references page pulls from the same `citations.yaml` entry — **do not
  hand-format citations in two places**, since that causes drift.
- Every claim of statistic, study finding, or projection must carry a
  citation ID. Claude Code should flag (not silently invent) any uncited
  factual claim it encounters or is asked to add.
- Quoting third-party text: keep any direct quotation short and always
  attributed; prefer paraphrase for anything beyond a short phrase, and never
  reproduce substantial excerpts of a source's writing.

---

## 7. AI Disclosure Page (required)

Create `content/ai-disclosure.md` and route it at `/ai-disclosure/`, linked
from the global footer. It must plainly state, in plain language (not
legalese):

- Which tasks AI (Claude Code / Claude) performed — e.g., drafting code,
  scaffolding templates, generating first-pass content, formatting citations,
  suggesting structure.
- Which tasks a human performed — e.g., prompting/direction, fact-checking,
  editing and rewriting copy, final publishing decisions, sourcing citations,
  design decisions.
- A short statement that AI-drafted claims were human-reviewed against
  primary sources before publication.
- Date of last update to the disclosure (this page should be updated whenever
  the human/AI division of labor materially changes).
- Whenever Claude Code generates or substantially edits a page's content, it
  should prompt the user to confirm the AI Disclosure page still accurately
  reflects the current split of work, rather than assuming it's still correct.
- **Keep the work log (`content/aidisclosure.yaml`) general and concise, not
  verbose.** Each entry's `ai_did`/`human_did` should be a short, high-level
  summary (a sentence or two per item) — e.g. "Drafted the History page's
  four cases and added their citations," not a file-by-file or
  citation-by-citation transcript of every change. The log is a plain-language
  record of who did what, not a diff or a changelog.
- **Periodically compact the log.** Once it grows past roughly 100 entries,
  condense the older ones into a single summarized entry (e.g. "Entries from
  2026-07 through 2026-09: scaffolded the Evidence, History, and Take Action
  pages and their citations") and keep only the most recent entries in full
  detail. Don't let the log grow unbounded — token cost to read/write it
  scales with its length, and untracking real project history isn't the goal.

---

## 8. Security Requirements (OWASP ASVS-aligned)

This is a static site with no backend, which removes large classes of ASVS
requirements (auth, session management, server-side input validation, DB
access). Apply the subset that still applies to static/front-end delivery:

- **V5 (Validation, Sanitization) / V14 (Config):**
  - No inline `<script>` or `<style>` blocks; all JS/CSS in external files
    served from `src/assets/`, to support a strict Content-Security-Policy.
  - Set security headers via GitHub Pages-compatible means (a
    `_headers`-style config if the host supports it, or meta-tag fallback):
    `Content-Security-Policy`, `X-Content-Type-Options: nosniff`,
    `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
  - If any third-party script/CDN asset is used, it must include a
    **Subresource Integrity (SRI)** hash and `crossorigin="anonymous"`.
- **V10 (Malicious Code):** Never fetch or `eval()` remote code at runtime.
  No dynamically constructed script tags.
- **V14.2 (Dependencies):** Keep `package-lock.json` committed; run `npm audit`
  in CI (`ci.yml`) and fail the build on high/critical vulnerabilities. Pin
  dependency versions; do not use `latest`/unpinned ranges.
- **Secrets management:** No API keys, tokens, or credentials in the repo,
  ever — including in `content/*.yaml` or comments. If a build step needs a
  secret (e.g., an analytics or forms API key), it must be injected via
  GitHub Actions encrypted secrets, never committed.
- **Forms (if any, e.g., a newsletter signup):** Any form must submit to a
  vetted third-party processor over HTTPS; never roll a custom backend for
  this site. Client-side validation is a UX nicety, not a security control —
  do not treat it as one.
- **HTTPS only:** Enforce HTTPS via GitHub Pages settings; no mixed content
  (all asset URLs must be `https://`).
- **Supply chain:** Only add npm packages from well-maintained, widely used
  sources; check download counts/maintenance status before adding a new
  dependency, and prefer zero new dependencies over adding one for something
  Eleventy or vanilla JS/CSS can already do.
- Claude Code must not silently add analytics, tracking pixels, or third-party
  embeds — these require explicit user approval since they affect privacy and
  the CSP.

---

## 9. Accessibility (WCAG 2.1 AA)

Not explicitly requested but implied by "IA best practices" and required for
a public-facing informational site:

- Semantic HTML5 landmarks (`<nav>`, `<main>`, `<footer>`, `<header>`).
- All images require meaningful `alt` text (decorative images: `alt=""`).
- Color contrast ratio ≥ 4.5:1 for body text.
- Full keyboard navigability; visible focus states (never `outline: none`
  without a replacement focus style).
- Heading hierarchy must be logical and sequential (one `<h1>` per page),
  and headings must be distinguishable, not only hierarchical: repeated
  identical heading text that makes screen-reader heading-navigation
  ambiguous (e.g., the same label repeated once per list entry) must be
  disambiguated (WCAG 2.1 AA, SC 2.4.6 Headings and Labels).
- Run an automated a11y check (e.g., `pa11y` or `axe-core`) in `ci.yml`.

---

## 10. Coding Standards

- Semantic, minimal HTML — no unnecessary `<div>` soup.
- CSS: a single design-token file (`src/assets/css/tokens.css`) for color,
  spacing, and type scale; component CSS files reference tokens, not raw
  hex/pixel values.
- JS is optional-enhancement only — the site must be fully readable and
  navigable with JS disabled.
- No console.log or debug code committed.
- Comment *why*, not *what*, in template/config files.

### 10a. Color System (Gradient Blues, adopted in the Color Re-skin v2 batch)

- **The ramp is the spine, not the section-identity system.** The site's
  brand/link/UI color (`--color-primary`) and a set of `--ramp-1`…`--ramp-4`
  tokens draw from one *sequential* 10-step indigo→aqua palette
  (`#7400b8 → #6930c3 → #5e60ce → #5390d9 → #4ea8de → #48bfe3 → #56cfe1 →
  #64dfdf → #72efdd → #80ffdb`). Sequential ramps are for things that should
  blend into each other (a brand color, a gradient) — never for telling two
  categories apart. Only **one** gradient feature exists site-wide: the
  homepage era timeline's four-step card-border progression
  (`--ramp-1`…`--ramp-4`, one step per card). Don't add a second.
- **Section accents stay perceptually distinct, on purpose.** Cool sections
  (The Evidence) draw a color from the same ramp family; History and Take
  Action deliberately stay warm (rust/amber) as counterpoints. Never recolor
  all sectioned pages onto the ramp — a reader must be able to tell which
  section they're on by color alone (in addition to, never instead of, the
  page heading/nav).
- **Text-safe vs. vivid/fill-only tokens.** The ramp's bright end
  (`--ramp-3`/`--ramp-4`, and any accent derived from that end, e.g.
  `--accent-evidence-vivid`) reads well as a border, fill, or large display
  text, but fails 4.5:1 as small text on a light background. Where an accent
  needs to work as body-adjacent text *and* as a bold fill/border, it splits
  into two tokens: the plain name (`--accent-evidence`) is darkened enough to
  clear 4.5:1 as text; the `-vivid` suffix keeps the brighter ramp-adjacent
  value for fills, borders, and large display text (3:1 floor). Only add the
  split where the plain ramp value actually fails 4.5:1 — don't split a token
  that already clears it.
- **Contrast thresholds by element type, always computed, never eyeballed:**
  body/small text ≥ 4.5:1; large text (≥ 24px, or ≥ 18.66px bold) ≥ 3:1;
  non-text UI that conveys state (borders, icons, focus rings, chart/graph
  strokes) ≥ 3:1; purely decorative fills with no informational role, no
  fixed minimum (but must not drop *adjacent* text below its own floor).
  Compute every ratio with the standard WCAG relative-luminance formula
  (`c ≤ 0.03928 ? c/12.92 : ((c+0.055)/1.055)^2.4`, then
  `0.2126R + 0.7152G + 0.0722B`, then `(lighter+0.05)/(darker+0.05)`) — round
  down when deciding pass/fail (4.49 fails 4.5). Never state a ratio you
  haven't actually computed this way.
- **Color never carries meaning alone** (WCAG 1.4.1). Anything that
  communicates state through color — certainty tags, `citation--todo` /
  `citation--unverified`, warning/caution styling, `aria-current` on nav —
  keeps a text, icon, or border channel too. This rule overrides any
  aesthetic instruction that would simplify a state indicator to color only.
- **Dark mode is not an inversion.** Every token needs an independently
  chosen dark-mode value, picked for legibility against the dark background —
  not derived by algorithmically flipping the light value. It's normal for a
  dark-mode value to sit at a different position on the ramp than its
  light-mode counterpart (a color that reads fine as a border on white can be
  nearly invisible on the dark background, and vice versa).

---

## 11. Working Rules for Claude Code in This Repo

- **Never** put prose/copy directly into a template file — always create or
  edit a file under `content/`.
- **Never** add a factual claim without a citation ID from `citations.yaml`;
  if no citation exists yet, add a `TODO(citation-needed)` marker and flag it
  to the user rather than inventing one.
- **Never** add third-party scripts, fonts, trackers, or embeds without
  explicit user confirmation (CSP/privacy impact).
- **Never** commit secrets, tokens, or API keys.
- When editing the AI Disclosure page, confirm with the user that the
  human/AI task split described is still accurate.
- When adding a new page, update: the nav partial, the footer (if needed),
  `sitemap.xml`, and confirm it fits the IA depth rule (≤2 clicks from home).
- Prefer the smallest diff that accomplishes the task; do not refactor
  unrelated files in the same change.
- Run `npm run build`, the a11y check, and the link checker locally before
  presenting a change as complete.

---

## 12. Git & Deployment

- Conventional commits (`feat:`, `fix:`, `content:`, `docs:`, `chore:`).
- `content:`-scoped commits should touch only files under `content/` (and
  generated output), to keep copy-only changes easy to review/diff.
- Deploys are manual, not automatic: after merging to `main`, run
  `npm run build` locally and commit the resulting `docs/` output — that
  commit is what actually goes live, so don't merge content/template
  changes without also refreshing `docs/`. PRs trigger `ci.yml` (build,
  `npm audit`, a11y check, link check) and must pass before merge.

---

## 13. Citation Policy

Adopted after reader feedback that inline citations, each linking straight
out to its external source, read as overwhelming — and readers never saw
the site's own scholarly apparatus (APA records, corroboration pairs,
conflict-of-interest notes) on the References page, since a marker never
sent them there. Amended by the Citation Marker Text, Consolidation, and
"References" Naming batch to shorten marker text, allow consolidating
uniformly-sourced list sections, and align the reader-facing page name to
APA 7 ("References," not "Sources").

- **Every factual claim carries a source marker at the claim** (or, for a
  uniformly-sourced list section, a section-level note — see the
  consolidation rule below). Markers are never removed to reduce visual
  noise — styling and label length are the levers for that, not deletion.
  The project is graded on sources being *integrated with* claims, not
  merely listed at the end.
- **Markers link internally**, to that citation's own entry on the
  References page — never directly to an external source. Build the link
  with the project's existing path-prefix mechanism (see `.eleventy.js`'s
  `citeLink` filter); never hardcode the prefix.
- **Marker text is first-author surname + year** (e.g. `Brynjolfsson 2025`),
  hyperlinked to that citation's References entry. Full bibliographic detail
  appears only on the References page, not in the marker itself.
  - The label is derived from citation data by a single helper
    (`deriveAuthorName`/`buildLabelMap` in `.eleventy.js`, used by the
    `citeLink` filter) — never hand-written per call site. Changing the
    label convention is a one-place change.
  - **No numbered citation markers, ever.** Numbers depend on
    reference-list order, which shifts as references are added or
    re-sorted; APA 7 is author-date, not numbered.
  - Edge cases: an organizational author uses a short recognizable form
    (`BLS 2024`, `SHRM 2026`) — a manual override table in `.eleventy.js`
    covers the handful of institutional names that need real abbreviation,
    everything else derives mechanically. No author uses a short title
    fragment + year. No year uses `n.d.` per APA. Two citations that would
    otherwise produce an identical label get deterministic APA letter
    suffixes (`Karpathy n.d.-a` / `Karpathy n.d.-b`), assigned by citation
    id sort order so a given citation's suffix never changes between
    builds — and the same suffix is shown next to that entry's year on the
    References page, so a reader can match a marker to its entry.
  - Every marker carries the full author-year citation in `title` (e.g.
    `Brynjolfsson, E., Chandar, B., & Chen, R. (2025) — see References`)
    for hover and assistive tech, since the short visible label alone no
    longer carries every author's name.
  - Unsourced claims render `Source needed`, unlinked, never a
    plausible-looking author-year label.
  - Multiple markers on one claim render as a comma-separated group, each
    an independent link with its own `title` — not semicolons, and not
    merged into one link.
- **Consolidation rule:** where every item in a list section shares an
  identical citation set, cite once at section level via a
  `section_citations` field (same primary/corroborating shape as the
  item-level fields it replaces) and omit per-item markers, rendering a
  small muted section-level note instead (naming both sources via the
  normal `citeLink` markers, so they behave like every other citation). If
  any item in the section differs, the section does not qualify — leave
  per-item markers throughout that section, untouched. An item that carries
  its own `primary_citation` even inside an otherwise-consolidated section
  still renders its own marker, so a later-added item with a different
  source is never silently absorbed by the section note. Consolidation
  never crosses sections and never applies to figure/chart credits —
  figures keep their own per-figure citation.
- **External links live only in References entries**: full APA 7, hyperlinked
  to the original (DOI preferred) wherever one exists.
- **Ordinary content links are not citation markers** and are unaffected by
  this policy — an inline link whose purpose is "go watch/read this thing"
  as part of the reading experience (a linked video, a linked tool) stays a
  normal link in the copy, not something routed through `citeLink`.
- Every citation id used anywhere in content must exist in
  `content/citations.yaml` and render an entry with a matching anchor id on
  the References page. Reviews check both directions — no referenced id
  missing a target, and flag (don't silently ignore) any entry that's
  defined but never actually cited anywhere.
- **Never fabricate or approximate a source.** If a claim can't be verified
  against a real source that was actually read, reword or remove the claim
  rather than attaching a plausible-looking citation to it.
- Citation *presentation* changes (marker styling, link target, label
  convention, hover/focus treatment) go in the `citeLink` filter and the
  shared CSS where `.citation` styles live — never page by page, and never
  hand-formatted in template markup instead of going through the filter.
- **Reader-facing naming is "References"** (APA 7 convention), everywhere a
  reader sees it — nav, footer, page heading, browser tab title, in-copy
  cross-links. The URL stays `/references/`; this is a label alignment, not
  a route change. Ordinary prose use of the word "sources" (e.g. "read
  multiple sources before deciding what you think") is unaffected — only
  the page's own name changes.
