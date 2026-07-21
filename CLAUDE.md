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
- **Hosting:** GitHub Pages, deployed via GitHub Actions (`.github/workflows/deploy.yml`).
  No server-side code, no databases, no secrets required at runtime.
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
│   ├── home.md
│   ├── the-evidence.md
│   ├── backup-plan.md
│   ├── ai-literacy.md
│   ├── take-action.md
│   ├── about.md
│   ├── ai-disclosure.md
│   ├── references.md           # APA reference list, generated or hand-maintained
│   ├── site.yaml                # global strings: nav labels, site title, CTAs
│   └── citations.yaml           # structured citation data (see Section 8)
├── src/
│   ├── _includes/
│   │   ├── layouts/             # Nunjucks layout templates (no prose text here)
│   │   └── partials/            # header, footer, nav, citation component
│   ├── assets/
│   │   ├── css/                 # stylesheets only
│   │   ├── js/                  # minimal, no inline scripts (see Section 9)
│   │   └── img/
│   └── 404.njk
├── .github/
│   └── workflows/
│       ├── deploy.yml           # build + deploy to GitHub Pages
│       └── ci.yml               # lint, link-check, accessibility check
└── tests/                       # link checker / a11y test configs
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
├── Build Your Backup Plan  (practical guidance)
├── Build Your AI Literacy  (practical guidance)
├── Take Action             (primary CTAs: resources, checklists, links)
├── About                    (who made this, mission, funding/COI disclosure)
├── AI Disclosure            (required — see Section 7)
└── References                (APA-formatted bibliography)
```

Requirements:

- Global nav present on every page, current page indicated (`aria-current="page"`).
- Every page has a single clear primary CTA (e.g., "See the data," "Get the
  checklist") — avoid competing CTAs per IA best practice.
- Footer includes links to **About**, **AI Disclosure**, and **References** on
  every page (transparency should never be more than one click away).
- Breadcrumbs on any page nested under a section.
- URL slugs are human-readable and stable (`/the-evidence/`, not `/page2/`).
- Provide an HTML sitemap page and an XML `sitemap.xml` for SEO.

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

- Prose in `content/*.md` references a citation by ID (e.g., `{% cite
  "mckinsey2023" %}`), and a Nunjucks shortcode/filter renders the correct
  in-text APA parenthetical and appends the full entry to the references page
  automatically — **do not hand-format citations in two places**, since that
  causes drift.
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
- Heading hierarchy must be logical and sequential (one `<h1>` per page).
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

---

## 12. Git & Deployment

- Conventional commits (`feat:`, `fix:`, `content:`, `docs:`, `chore:`).
- `content:`-scoped commits should touch only files under `content/` (and
  generated output), to keep copy-only changes easy to review/diff.
- `main` branch auto-deploys to GitHub Pages via `.github/workflows/deploy.yml`
  on merge; PRs trigger `ci.yml` (build, `npm audit`, a11y check, link check)
  and must pass before merge.
