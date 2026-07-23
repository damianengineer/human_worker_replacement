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
├── QA-CHECKLIST.md             # human QA test steps — see Section 13;
│                                 update every batch, not just batches
│                                 that mention it
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
- **Update `QA-CHECKLIST.md` in every batch of changes** — see Section 13.
  This is not optional or only-when-asked: add checks for whatever the
  batch introduced or changed, and prune checks for whatever it removed
  or replaced, before presenting the batch as complete.

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

## 13. QA Checklist Maintenance (`QA-CHECKLIST.md`)

This site has no automated visual regression testing, and Claude Code
cannot verify visual outcomes directly — no browser is available in this
environment. `QA-CHECKLIST.md` (repo root) is the standing bridge between
what a change makes and what a human confirms actually looks right on a
real device. It is living documentation of the site's *current*
visual/interactive surface, not a historical log of every batch that ever
touched it — maintain it that way in every batch, not just batches whose
own instructions happen to mention it.

**Update it every batch, without being asked:**

- **Add checks for what's new or changed.** Any new or materially changed
  visual/interactive feature — a new component, a new page treatment, a
  new color/accent, a changed layout, a new breakpoint — needs a
  corresponding checklist item: what to look at, at what viewport(s) and
  color scheme(s), and what "correct" looks like in concrete, observable
  terms.
- **Prune checks for what's gone.** When a batch removes or replaces a
  feature, remove or rewrite the checklist items that tested the old
  version. A stale item asking a tester to verify something that no
  longer exists (a deleted component, a superseded token, an old
  interaction pattern) wastes tester time and undermines trust in the
  rest of the checklist — don't leave it in "just in case."
- Batch-specific section headings (e.g., "Nav Redesign checks") are fine
  for organizing the file, but the *behavior described inside each item*
  must reflect the current codebase at the time of the batch, not the
  state when that section was first written. If a later batch changes
  something an earlier section checks, update that earlier section —
  don't just append a new, possibly-contradictory one next to it.

**Write every item for a human QA tester, not for a future agent or a
developer.** Assume the reader has a browser, devtools, and possibly a
phone, but no access to — or need to read — the source code. Each item
should be:

- An exact, executable step ("open `/the-evidence/`, click the third
  pill in the sticky bar"), not a vague prompt ("check the jump bar").
- Scoped to a specific viewport and color scheme where that matters
  (e.g., "at 375px, in dark mode").
- Paired with a concrete, observable expected result ("the heading lands
  fully below both sticky bars, with no overlap"), not a subjective one
  ("looks right").

**Standing checks — present every batch that touches layout, tokens,
colors, or images, not only when directly touched:**

This project has repeatedly introduced visual regressions in two specific
areas across otherwise-unrelated batches. Both need a checklist item
re-verified fresh every time, never assumed still correct from a prior
batch's pass:

- **Background shading consistency.** Every background tint, band, or
  card surface — newly introduced, or pre-existing but adjacent to
  something this batch changed — checked in both light and dark mode
  against its neighboring surfaces: does it read as a deliberate,
  distinct-but-subtle layer? Not invisible (blending into its neighbor),
  not a harsh seam, not accidentally identical to a surface it's
  supposed to be distinguishable from.
- **Graphics and image alignment.** Every image, icon, chart, or
  decorative graphic touched or newly placed this batch — correct
  crop/object-position, no stretching or squashing, consistent alignment
  relative to surrounding text/cards across breakpoints, nothing
  overlapping, clipped, or shifted by layout changes elsewhere on the
  page.

Do not treat either category as "fine, already checked in an earlier
batch" — a token rename, a new component, or an unrelated layout change
can silently shift something upstream that a prior batch's checklist item
never anticipated.
