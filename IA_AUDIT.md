# Information Architecture, Navigation & Flow Audit — Phase 1

**Status:** Analysis only. No code changes made. All data below comes from
static inspection of `content/`, `src/_includes/`, `src/assets/css/`, and the
built `docs/` output (word/heading counts computed from rendered HTML, not
estimated). Nothing here was verified with a live browser, Lighthouse, or any
external tool, per this task's Phase 1 guardrails — anywhere that matters,
it's called out explicitly as an open question for Phase 2.

**Scope note:** the task brief lists seven pages (`/`, `/the-evidence/`,
`/take-action/`, `/history/`, `/glossary/`, `/references/`,
`/ai-disclosure/`). The repo actually has an eighth: `/about/`, added in a
prior task and already wired into nav and footer. It's included below rather
than silently dropped, since excluding a real, linked page from an IA audit
would defeat the point of the audit.

---

## 1. Above-the-fold priority

Word counts below are exact (computed from rendered HTML). Fold position
(what's visible at ~900px desktop / ~700px mobile without scrolling) is
necessarily an **estimate** from structural order and CSS type scale, not a
measured render — flagged per-page where it matters enough to warrant a real
Phase 2 viewport check.

| Page | First screen contents (structural order) | Estimated fold risk |
|---|---|---|
| `/` | H1 + 3-sentence intro + 3-item jump-nav, then start of "The short version" | Low — page is short (324 words total); the decision-relevant content (where to go next) is reachable within 1 screen on desktop, likely just past the fold on mobile. |
| `/the-evidence/` | H1 + intro + 4-item jump-nav, then "Current State of Displacement" heading + first claim | **High** — see below. The page's own jump-nav surfaces 4 links (Current State, At Risk, Protective Factors, Counterarguments) but **not** the Stark State program list, which is the single most likely reason a student in the named persona ("is my major at risk") would visit this page. |
| `/take-action/` | H1 + intro + 3-item jump-nav, then "Plan B" heading + first item | Low for Plan B specifically (only 64 words precede it — reachable in 1 screen). **Medium** for AI Literacy's sub-content (see §2) and for Policy (1,805 words precede it). |
| `/history/` | H1 + 2-paragraph intro, then first case heading | Low — 90 words precede the first case. |
| `/glossary/` | H1 + 2-paragraph intro, then "Core AI Terms" heading | Low — 65 words precede first term. |
| `/references/` | H1 + intro, then first reference entry | Low to reach *a* reference; **medium** to reach a *specific* one — no jump-nav or grouping exists over 80 entries (see §4). |
| `/ai-disclosure/` | H1 + intro ("short version"), then "Work log" heading | Low to reach the summary; the log itself is long (see §2). |
| `/about/` | H1 + intro, then "Our mission" heading | Low — short page (409 words). |

**Principle:** above-the-fold prioritization / inverted-pyramid content
ordering (most decision-relevant content first) — a standard IA/content-
strategy principle, not this audit's invention.

**Key finding:** the task's own "known pain point" (a student checking major
exposure has to scroll past unrelated sections) is confirmed and
quantifiable, not just anecdotal — see §2 for the exact word-count proxy.

---

## 2. Scroll depth and page length

Word counts are from rendered `<main>` content (nav/footer excluded).
Heading counts are exact tag counts from the built HTML.

| Page | Words (main) | H1 | H2 | H3 | H4 | Has TOC? |
|---|---:|---:|---:|---:|---:|---|
| `/` | 324 | 1 | 3 | 0 | 0 | Yes |
| `/the-evidence/` | 3,198 | 1 | 4 | 12 | 9 | Yes (4 links) |
| `/take-action/` | 2,319 | 1 | 3 | 7 | 0 | Yes (3 links) |
| `/history/` | 578 | 1 | 4 | 0 | 0 | No |
| `/glossary/` | 561 | 1 | 3 | 0 | 0 | No |
| `/references/` | 2,485 | 1 | 0 | 0 | 0 | No |
| `/ai-disclosure/` | 817 | 1 | 2 | 10 | 0 | No |
| `/about/` | 409 | 1 | 4 | 0 | 0 | No |

**Per the task's own framing** — a long page isn't automatically a problem if
it's well-chunked with a working TOC. Applying that standard:

- **`/the-evidence/` (3,198 words) — flagged.** It has a TOC, but the TOC
  doesn't reach the section a large share of visitors likely want first.
  Concretely: **1,235 of 3,181 words (~39%) precede the Stark State program
  list**, and the page's own jump-nav has no link to it at all (it's a
  third-level subsection — Evidence → At Risk → Most Exposed → Stark State —
  three heading levels deep). Other pages already link *directly* to
  `/the-evidence/#stark-state` (`take-action.yaml`, `home.yaml`), proving the
  anchor is considered important enough to deep-link from elsewhere, which
  makes its absence from the page's own TOC more notable, not less.
- **`/take-action/` (2,319 words) — partially flagged.** The TOC gets a user
  to the right top-level CTA fast (Plan B is reachable after just 64 words).
  But the "Improve Your AI Literacy" CTA alone is ~1,400 words
  (396→1,805) across 6 resource-type groups plus a caution subsection, with
  no in-page links to those subsections — a user who wants only "Videos" or
  only the privacy/security callout must scroll linearly through the rest.
- **`/references/` (2,485 words, 80 entries) — flagged**, not for length but
  for **navigability**: zero headings, no A–Z grouping, no jump-list, despite
  every entry already having a stable `id` attribute (e.g. `id="acemoglu2019"`)
  that a jump-list could target with no new anchor scheme needed.
- **`/ai-disclosure/`** — well-chunked by date, but see §3/§4 for a heading-
  uniqueness issue in the work log.
- **`/`, `/history/`, `/glossary/`, `/about/`** — short, effectively single-
  screen-and-a-half pages; not flagged for length.

**Principle:** progressive disclosure and content chunking (Miller's Law —
users manage large information sets better when it's grouped/revealed
incrementally rather than presented as one long undifferentiated block).

---

## 3. Navigation structure

**Top nav:** Confirmed byte-for-byte identical across all 8 pages (same 8
links: Home, The Evidence, Take Action, History, Glossary, References,
About, AI Disclosure), with `aria-current="page"` correctly set to the
current page on every single page, including the landing page. No
inconsistency found.

**Orphaned pages:** None. All 8 real pages are reachable from the persistent
top nav — nothing is reachable only via a deep in-page link.

**Skip-link landmark:** Present and correctly targeting `<main id="main">`
on all 8 pages, verified directly in the rendered HTML, not assumed.

**Cross-links — current state (this is the most significant finding in this
audit):**

| From ↓ / To → | `/` | Evidence | Take Action | History | Glossary | References | About | AI Disc. |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `/` | — | ✅ | ✅ (×3 anchors) | ✅ | ✅ | ✅ | — | ✅ |
| **`/the-evidence/`** | — | — | **none** | **none** | **none** | **none** | — | — |
| `/take-action/` | — | ✅ (×3 anchors) | — | — | ✅ (×3 anchors) | ✅ | — | — |
| `/history/` | — | ✅ | ✅ | — | ✅ | — | — | — |
| `/glossary/` | — | **none** | **none** | **none** | — | **none** | — | — |
| `/references/` | — | **none** | **none** | **none** | **none** | — | — | — |
| `/about/` | — | ✅ | — | — | — | ✅ | — | ✅ |
| `/ai-disclosure/` | — | **none** | **none** | **none** | **none** | **none** | — | — |

- **`/the-evidence/` has zero outbound content links** — not to Take Action
  (whose CTAs it directly motivates), not to History (the analogy page it
  logically follows), not even to Glossary despite using terms the glossary
  defines. This is the single clearest asymmetry in the site: Take Action and
  History both link *into* Evidence, but Evidence never links back or
  forward to either.
- Glossary, References, and AI Disclosure are reference/meta pages with no
  outbound content links at all — more defensible for a look-up page, but
  Glossary specifically defines terms that are *used* on Evidence/History/
  Take Action without linking back to where those terms actually appear in
  context.

**Principle:** bidirectional cross-linking between explanatory and
task-oriented content — a standard IA pattern for sites where "read this →
now go do that" is the intended user journey (this site's own stated goal,
per its landing page's "Where to go next" section).

---

## 4. In-page wayfinding and progressive disclosure

**TOC pattern consistency:** Applied on `/`, `/the-evidence/`, and
`/take-action/` — the three data-heavy, multi-section pages. **Not** applied
on `/history/` (4 cases, no TOC — arguably fine at 578 words) or
`/ai-disclosure/` (log entries, no TOC — see heading-uniqueness issue below).
Not applied on `/references/`, which is the page most likely to actually
need one given its length and flat structure.

**Stark State three-tier list** (`/the-evidence/#stark-state`):

| Tier | Programs |
|---|---:|
| Tier 1 — Highest Confidence | 32 |
| Tier 2 — Category-Level Match | 17 |
| Tier 3 — Exposed but Partially Protected | 6 |

55 programs total, rendered as three sequential lists (Tier 1's 32 already
uses a 2-column CSS layout at ≥40rem width, but still requires scanning
32 items to confirm a program *isn't* there). A student scanning for one
specific program benefits from **progressive disclosure** here — collapsing
each tier so only the relevant one needs to be open at a time.
**Implementation constraint worth flagging now:** this site must remain
fully functional with JavaScript disabled (CLAUDE.md Section 3/10). Native
`<details>`/`<summary>` elements satisfy that constraint with zero JS;
a JS-driven tab widget would not, and shouldn't be used here without an
explicit decision to add a JS dependency.

**References' 80-entry flat list:** No alphabetical grouping, filtering, or
jump-links exist, despite every entry already carrying a stable `id`
(confirmed in the rendered HTML — e.g. `id="massenkoff2026"`). This is a
low-risk, high-value gap: the anchors a jump-list would need already exist
and are already stable (other pages don't currently link to individual
reference IDs, so changing nothing about them is zero-regression).

**Principle:** progressive disclosure (Nielsen Norman Group) for the Stark
State tiers; recognition-over-recall and standard reference/dictionary UX
convention (A–Z jump navigation) for the References list.

---

## 5. Content model

Evaluating the three modes named in the task brief — **reference** (looked
up), **explanatory** (read to understand), **task-oriented** (read to act):

| Page | Primary mode | Notes |
|---|---|---|
| `/` | Task-oriented (routing) | Pure signpost page — correctly short, no mode-mixing. |
| `/the-evidence/` | Explanatory | Clean fit — no reference or task-oriented content mixed in beyond citations (which are the expected connective tissue, not a mode violation). |
| `/take-action/` | Task-oriented | Clean fit, though the AI Literacy CTA's resource list (6 categories, ~30 entries) starts to read more like a **reference** list (something to scan/search) than a **task** list (something to read start-to-finish) — see §2/§4. Not a hard violation, but the biggest of the three CTAs is drifting toward reference-list scannability needs without reference-list affordances (filtering, jump-links). |
| `/history/` | Explanatory | Clean. |
| `/glossary/` | Reference | Clean. |
| `/references/` | Reference | Clean in *intent*, but under-served by *structure* (§4). |
| `/about/` | Explanatory (about the project itself) | Clean, short. |
| `/ai-disclosure/` | Mixed: explanatory (the "short version") + reference (the work log, meant to be looked up/audited rather than read straight through) | Not a problem — the page already visually/structurally separates the two ("The short version" vs. "Work log"). Flagging only the log's internal heading-uniqueness issue below, which is a §3/§4 wayfinding issue more than a content-model one. |

**One specific accessibility/wayfinding issue found while checking this
section:** the AI Disclosure work log's heading hierarchy repeats identical
h3 text ("AI did", "Human did") once per log entry — 5 entries currently
means 10 identically-worded h3 headings. A screen-reader user navigating by
heading list (a standard AT navigation pattern) hears "AI did, Human did, AI
did, Human did..." with no way to distinguish which entry each belongs to.

**Principle:** content-model separation (Rosenfeld & Morville's IA
taxonomy: reference vs. explanatory vs. task-oriented material call for
different structural affordances — search/filter for reference, linear
flow for explanatory, checklists/CTAs for task-oriented) for the CTA-drift
finding; WCAG 2.4.6 (Headings and Labels must describe topic or purpose)
for the AI Disclosure heading-uniqueness finding.

---

## 6. Mobile considerations

This is explicitly a source-inspection judgment call per the task brief, not
a device test. CSS breakpoints found (all mobile-first, single breakpoint):

```
tokens.css        — @media (prefers-color-scheme: dark)   [color only, not layout]
the-evidence.css  — @media (min-width: 40rem) ×3          [figures grid, Stark State
                                                             2-col, Most Exposed 2-col]
ai-disclosure.css — @media (min-width: 40rem) ×1           [log AI-did/Human-did 2-col]
```

No breakpoints at all in `take-action.css`, `history.css`, `glossary.css`,
`references.css`, `home.css`, or `about.css` — those pages rely on flexbox
`flex-wrap`/single-column defaults, which is appropriate for their content
(no multi-column layouts to collapse) and not itself a gap.

Specific items checked:

- **`Source:`/`Corroborated by:` sub-bullets:** `.evidence-list__source`
  etc. use relative units (`var(--font-size-sm)`, `var(--space-1)`) with no
  fixed-width containers — should reflow fine narrow, no overflow risk found
  in source. **Not flagged as a likely problem**, but not device-verified.
- **Chart lightbox (`/the-evidence/`):** `.evidence-lightbox__close` is
  positioned `top: calc(-1 * var(--space-5))` (−3rem) **above** the
  lightbox content box, while the lightbox overlay itself only has
  `padding: var(--space-5) var(--space-4)` (2rem top). On a short mobile
  viewport (e.g., landscape phone, ~400px tall), the close button's
  position could sit very close to or past the top edge of the viewport.
  **Flagging as a genuine open question for Phase 2** — this is exactly
  the kind of thing source inspection can raise but not confirm; needs an
  actual narrow/short viewport check.
- **Two-column lists at the 40rem (~640px) breakpoint:** the breakpoint
  itself means true mobile (< 640px) always gets single-column — safe. The
  **medium-width range just above 640px** (small tablets, large phones in
  landscape) is where Stark State's Tier 1 (32 items) and Most Exposed (6
  items) 2-column layout could plausibly feel cramped depending on actual
  rendered column width. **Flagging for Phase 2 visual check** rather than
  asserting a problem I can't confirm from CSS alone.

**Principle:** mobile-first responsive design (single low breakpoint,
content reflows to one column below it) — correctly applied structurally;
the two flagged items are judgment calls the task brief itself invites
flagging rather than guessing on.

---

## Site map (current state)

```
Home ("/")
├── The Evidence            (→ Take Action ✗, → History ✗, → Glossary ✗)
├── Take Action              (→ Evidence ✓×3, → Glossary ✓×3, → References ✓)
├── History                  (→ Evidence ✓, → Take Action ✓, → Glossary ✓)
├── Glossary                  (no outbound content links)
├── References                (no outbound content links)
├── About                    (→ Evidence ✓, → References ✓, → AI Disclosure ✓)
└── AI Disclosure            (no outbound content links)
```

All 7 non-home pages sit at nav depth 1 (≤2 clicks from Home, satisfying
CLAUDE.md Section 5's IA depth rule). No hierarchy problem — the gaps found
in this audit are all cross-linking/wayfinding gaps, not depth/structure
gaps.

---

## Prioritized change list

Each item: **Principle**, **Risk**, **Regression scope**, **Effort**. None
of these are implemented — all await your approval before Phase 2.

### 1. Add forward links from `/the-evidence/` to `/take-action/` and `/history/`
- **Principle:** bidirectional cross-linking between explanatory and
  task-oriented content (§3).
- **Risk:** Low. Purely additive — no existing anchor, heading, or element
  is removed or renamed.
- **Regression scope:** Only `/the-evidence/` itself needs re-checking
  (confirm new links render correctly and target the right anchors:
  `/take-action/#plan-b`, `#ai-literacy`, `#policy`, and `/history/`).
  Nothing else references this page's internals in a way that could break.
- **Effort:** Small.

### 2. Add a direct "Stark State" entry to `/the-evidence/`'s own jump-nav
- **Principle:** recognition over recall; above-the-fold prioritization for
  the site's stated "is my major at risk" use case (§1/§2).
- **Risk:** Low. Adding one `<li>` to an existing nav list; no existing
  anchors change.
- **Regression scope:** `/the-evidence/` only.
- **Effort:** Small.

### 3. Add an A–Z (or grouped) jump-list to `/references/`
- **Principle:** recognition over recall; standard reference/dictionary
  navigation convention (§4).
- **Risk:** Low. Every target anchor (`id="<citation-id>"`) already exists
  and is stable — this only adds a new nav element pointing at IDs that
  don't change.
- **Regression scope:** `/references/` only. Worth confirming no other page
  currently deep-links to a specific reference ID in a way a reordering
  could disturb (none found in this audit, per §3's cross-link table).
- **Effort:** Medium (needs a template/filter change to group 80 entries by
  first-letter-of-surname; content itself doesn't change).

### 4. Add cross-links from `/glossary/` back to where terms are used
- **Principle:** bidirectional cross-linking (§3/§5).
- **Risk:** Low. Additive only.
- **Regression scope:** `/glossary/` only.
- **Effort:** Small.

### 5. Add sub-section jump-links within Take Action's "AI Literacy" CTA
- **Principle:** progressive disclosure / in-page wayfinding (§2/§4).
- **Risk:** Low-Medium. Adds a nested nav inside an existing section; needs
  care that the existing `#ai-literacy` anchor (linked from `/` and
  elsewhere) still resolves to the same place.
- **Regression scope:** `/take-action/` internally, plus re-check every
  external link into `#ai-literacy` (currently: `/` and `content/site.yaml`-
  driven nav does not deep-link here, but `home.yaml` does).
- **Effort:** Small-Medium.

### 6. Fix AI Disclosure work-log heading uniqueness
- **Principle:** WCAG 2.4.6, Headings and Labels (§5).
- **Risk:** Low. Template-only change (e.g., fold the date into the h3 text,
  or demote "AI did"/"Human did" to a non-heading label and make the date
  the real heading). No anchors currently target these headings directly.
- **Regression scope:** `/ai-disclosure/` only.
- **Effort:** Small.

### 7. Convert Stark State's 3 tiers into `<details>`/`<summary>` accordions
- **Principle:** progressive disclosure; Miller's Law / chunking (§4).
- **Risk:** Medium. This changes DOM structure inside an anchored section
  (`#stark-state`) that other pages deep-link to. Must confirm the *section
  wrapper's* `id="stark-state"` is preserved even if the internal tier
  markup changes, and that native `<details>` (not a JS widget) is used to
  respect the site's no-JS-required constraint.
- **Regression scope:** `/the-evidence/` internally; re-check
  `/take-action/#stark-state`-style inbound links (actually
  `/the-evidence/#stark-state` — confirm both `takeaction.yaml` and
  `home.yaml`'s links still land correctly) and confirm the lightbox
  behavior on this page is untouched (different section, but same page/
  template file).
- **Effort:** Medium.

### 8. Decision needed: reorder `/the-evidence/` sections vs. add a top-of-page teaser link to Stark State
Two different-risk ways to address the §1/§2 finding (Stark State is 39%
down the page with no direct nav to it):
- **8a. Add a prominent teaser/callout link near the top** (in the intro or
  jump-nav) pointing to `#stark-state`, without moving anything. **Risk:
  low, Effort: small.** (This overlaps with #2 above — #2 is the minimum
  version, 8a is a more visually prominent variant of the same idea.)
- **8b. Actually reorder sections** so At Risk/Stark State comes before
  Current State of Displacement. **Risk: Medium-High** — changes the
  page's narrative flow (Current State currently establishes the
  credibility/context that At Risk depends on), and requires re-reading the
  page's own internal logic, not just its anchors, to confirm it still
  makes sense reordered. **Effort: Large.**
- **Recommendation (judgment call, not a settled principle):** 8a first,
  as a fast, low-risk win; treat 8b as a separate, larger decision if 8a
  turns out not to be enough.

### 9. Resolve the home page's own reading-order mismatch — move/expand History's role in "Background before you dive in"
- **Added following discussion (2026-07-22):** the user asked whether nav
  should be reordered to reflect intended reading sequence rather than
  importance (History nearer the front). Recommendation there was to leave
  the global nav importance-ordered (nav is scanned for lookup, not read as
  a syllabus — recognition-over-recall plus the well-documented primacy
  effect favoring leftmost items), but that surfaced a real, separate issue
  worth its own line item: **the home page's own content already contradicts
  itself on this point.** `home.yaml`'s `background` section is explicitly
  titled "Background before you dive in" — language that frames History and
  Glossary as *prerequisite* context — but it's the *last* section on the
  page, after "Where to go next" (the Take Action CTAs). A first-time
  visitor reading the home page top-to-bottom (unlike nav, this is somewhere
  people plausibly do read linearly) hits the CTAs before the section
  telling them what to read "before" diving in.
- **Principle:** content sequencing should match its own framing — a
  "before you dive in" label placed after the thing it claims to precede is
  an internal consistency problem, not just a stylistic one. This is
  distinct from the nav-ordering question (§ discussion above): the fix
  belongs on the one page in this site actually meant to be read in order,
  not in the persistent nav.
- **Two ways to address it, either or both:**
  - **9a. Reposition:** move the `background` section earlier on the home
    page — e.g., right after "The short version," before "Where to go
    next" — so History/Glossary are genuinely encountered first, matching
    the section's own stated framing.
  - **9b. Give History more weight/motivation framing in that section:**
    currently History shares one paragraph with Glossary as a single
    combined aside (`content/home.yaml`'s `background.text`). "Feature more
    of the history in the background and motivation" suggests giving
    History its own sentence or two — *why* the analogies matter for
    motivation (this is the site's core argument per CLAUDE.md Section 1:
    past disruptions as the basis for taking a backup plan seriously) —
    rather than a passing mention alongside a glossary plug.
- **Risk:** Low. This is a `content/home.yaml` + `home.njk` section-order
  and copy change, not a structural one. No anchors elsewhere depend on the
  home page's internal section *order* — `/the-evidence/`, `/take-action/`,
  and `/history/` all link to `/` plainly (no `/#background` deep link
  found anywhere in this repo), so reordering the home page's own sections
  breaks nothing external.
- **Regression scope:** `/` only. After the change: re-confirm the
  `home-jump` TOC's three links (`#short-version`, `#where-to-go`,
  `#background`) still point at the right sections in their new order, and
  that nav/skip-link on `/` are unaffected (they won't be — this is a
  `<main>`-internal reorder).
- **Effort:** Small (9a alone) to Small-Medium (9a + 9b, since 9b needs a
  short rewrite of `background.text` to actually expand History's framing,
  not just move existing copy).

### Open questions (not change items — flagged for Phase 2 tooling/device check, not resolved by this audit)
- Chart lightbox close-button position on short mobile viewports (§6).
- Two-column list crampedness in the 640–768px range (§6).
- Whether 8a alone resolves the Stark State discoverability problem, or
  whether 8b's larger reorder is actually warranted — this needs either
  user feedback or a closer look than static source review can give.

---

## Recommended sequencing

**Batch A — safe to do together (all purely additive links/nav, zero
anchor removal, low risk):** items 1, 2, 3, 4, 8a. These can be one commit
per the task's "keep structural vs. cosmetic changes separate" rule, since
they're all the same kind of change (adding navigation, not restructuring
existing markup) — though item 3 (References A–Z list) touches a template/
filter rather than just adding a link, so consider splitting it into its
own commit if you want the diff easy to isolate. **Item 9a** (reposition
the home page's background section) is also low-risk and could ride along
in this batch, though it's a content-reorder rather than an addition, so
it's fine to split out on its own if you'd rather keep this batch to
"additions only." **Item 9b** (expand History's framing) is a copy change
— keep it in its own commit regardless, consistent with how this repo
already separates `content:`-scoped commits from structural ones.

**Batch B — isolate individually, each with a manual anchor recheck after:**
items 5 and 7. Both restructure DOM inside an existing anchored section.
Do one, verify (inbound anchors + lightbox where relevant + nav renders
identically site-wide + skip-link still works), then do the other — don't
batch them together, per the task's own regression-scope guidance.

**Batch C — cosmetic-only, separate commit:** item 6 (heading text fix).
Low risk, but keep it out of Batch A/B's commits since it's a different
kind of change (label wording, not navigation/structure).

**Deferred pending your decision:** item 8b (reorder), and both open
questions under §6 — these need either your explicit approval of a larger
change, or Phase 2 tooling/device access this Phase 1 pass didn't use.

---

*End of Phase 1 report. Awaiting approval of specific line items before any
Phase 2 implementation begins.*
