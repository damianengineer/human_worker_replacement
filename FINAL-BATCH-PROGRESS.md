# Final Batch Progress

Branch: `final-batch`. Tracks progress through the Final Batch (v2) audit
spec. Delete this file in the final commit (Task 6).

## Task 4 summary (QA-CHECKLIST.md mechanical execution)

Read all 21 sections (~150 sub-items). Ran mechanical checks (grep/DOM/
build) for every item with a checkable structural signature. Key results:
- Footer: exactly 7 links, correct hrefs. PASS.
- More dropdown: exactly 2 items (About, AI Disclosure), correct hrefs. PASS.
- Reduced-motion guards (`@media (prefers-reduced-motion: no-preference)`)
  present in base.css, home.css, take-action.css, the-evidence.css. PASS.
- Label-collision suffixes (Karpathy/Ng/Latent Space n.d.-a/-b) render
  correctly both on References and in body markers. PASS.
- Most Exposed Occupations: 6 compact items, 3 with inline notes
  (matches expected). PASS.
- No literal CSS gradient() anywhere in the codebase. PASS (consistent
  with the "one gradient feature" rule being a discrete 4-step border
  progression, not a true gradient).
- Journey-pager destination-color wiring verified structurally correct
  on all 3 legs (Evidence->History=rust/accent-action, History->Take
  Action=amber/accent-action... [see report for exact tokens]).
- History's two new images: both have real, descriptive alt text. PASS.
- Take Action visible-by-default word count: 1193 (batch report said
  ~1310 — close, likely minor drift from subsequent edits, not a
  regression).
- All AI-literacy resource-group deep-link anchor ids exist. PASS.
- h1 override CSS confirmed absent from evidence/history/home stylesheets.
- "AI & Your Job" appears sitewide; "AI & Your First Job" appears
  NOWHERE live (only inside the AI Disclosure work log's own historical
  entry describing the retitle — correct, not a bug).
- Lightbox close-button negative-offset rule and the 640px two-col
  breakpoint both confirmed to exist exactly as described.

**Found and annotated 2 fully stale sections + 3 stale bullets within
otherwise-valid sections** (QA-CHECKLIST.md edit, not a content/ edit —
doesn't count against the budget):
- Section 5 (full-bleed band): box-shadow technique it describes was
  replaced by a clipped pseudo-element in the Evidence Figure Stack
  batch. Marked superseded, not deleted (checklist items themselves
  still valid against the new technique).
- Section 7 (homepage hero at 320px): hero removed entirely in Homepage
  Edits v2. Marked obsolete, not deleted.
- 3 individual bullets in Sections 10, 12, and 16 that referenced the
  now-removed hero stat — struck through with a pointer to the Short
  Version stat callout as the replacement check.

Full human-only list (with one-clause reasons each) compiled for the
final report rather than duplicated here.

## Task 5a summary (glossary completeness)

Swept every page's rendered text for unglossed technical terms. Found two
strong, clearly load-bearing candidates — both used as bare chart titles
on The Evidence with zero inline explanation anywhere: "Capability
Overhang" and "Scale Effects". Added both (richmond2026-sourced, plus
massenkoff2026 as corroboration for Capability Overhang). Well under the
8-term cap — chose not to pad with weaker candidates (considered and
rejected "Prompt Injection": already self-explained inline where it
appears on Take Action, and doesn't fit cleanly into any existing
glossary category).

**Could not link either new term's first occurrence on The Evidence,
and am flagging this rather than silently skipping it:** both terms'
only occurrence is inside a chart figure's `title` field, which the
shared `figuresGrid` macro renders in TWO places — once via
`figureCredit` (the caption) and once directly inside an `aria-label`
attribute on the zoom link. Embedding an `<a>` tag in the title string
would render correctly in the caption but show literal, garbled
`<a href=...>` text inside the aria-label for screen-reader users — a
real accessibility regression, not a stylistic quibble. Fixing this
properly would need a schema change (a separate plain-text field for
the aria-label vs. a richer one for the caption) across a macro shared
by three pages — out of proportion for two glossary links in an audit
batch whose safety protocol explicitly rules out layout/template
redesign. Left both terms unlinked on this page; they're still fully
defined and findable via the Glossary page itself.

## Task 5b summary (date durability)

Swept all content for time-anchored language. Findings:
- Sanders S.4825 bill claim: already hedged ("As of this research...").
  Checked congress.gov via search + govinfo.gov's bulk XML: still
  Introduced-in-Senate, referred to Finance, zero cosponsors. Accurate,
  no change needed.
- McGarvey H.R.3116 bill claim: checked GovTrack/congress.gov via
  search: still just "Introduced," no major status change. Accurate,
  no change needed. Minor unrelated nit noticed in passing: the
  citation id "mcgarvey2026" doesn't match its own year field (2025,
  date 2025-04-30) -- flagging, not renaming (a rename touches every
  reference to the id and isn't what this task asked for).
- Social Security 2034 depletion claim: verified against the actual
  2026 OASDI Trustees Report (released 2026-06-09) -- combined trust
  funds still projected depleted in 2034. Accurate, no change needed.
- All other "right now"/"currently" instances in evidence.yaml/home.yaml/
  site.yaml describe specific cited studies' own findings (anchored by
  an adjacent citation marker to that study's fixed snapshot) or are
  evergreen relative framing (the homepage timeline's "Right now" era
  label, footer/journey teaser blurbs) that stays accurate regardless
  of read date. No edits made -- editing these would risk violating the
  "may not otherwise reword" constraint for no real durability gain.

**Zero content edits from this task** -- the existing copy was already
well-hedged.

## Task 5c summary (APA 7 formatting + external link integrity)

**Sentence-case titles:** manually reviewed every flagged title (crude
regex found ~28 candidates; most were false positives once proper
nouns/acronyms/branded titles were accounted for). Fixed 7 confirmed,
unambiguous Title Case violations in journal-article/working-paper
titles: eloundou2023, morris2024, vivalt2024, acemoglu2022,
autordornhanson2013, borusyakhulljaravel2022, richmond2026 (subtitle
portion only -- "The AI Jobs Transition Framework" kept capitalized as
the report's own proper name). Left genuinely debatable cases
untouched and reported as a class: well-known book titles (bostrom2014,
kurzweil2005, russellnorvig2021, etc. -- de-capitalizing risks
unrecognizability even though strict APA7 technically wants sentence
case), legal/bill citations (sanders2026, mcgarvey2026, euaiact --
APA7's legal-citation conventions diverge from regular sentence case),
and branded course/podcast titles (karpathyzerotohero, fastai,
latentspacepodcast, mitreatlas -- proper names of specific products).

**Italics:** references.njk had ZERO italics anywhere. Added `<em>`
around the title for standalone-work types (book, report, working
paper) only -- safe, unambiguous per APA7. Did NOT attempt italicizing
just the journal-name portion of "article" entries' publisher field
(would need string-parsing the "Journal, Vol(Issue), pages" pattern,
which breaks for at least 2 real entries -- good1965 is a book chapter,
morris2024 is a conference/preprint item, both formatted differently)
-- reported as a data-model limitation, not fixed.

**External link sweep:** checked all 74 URLs via HTTP HEAD/status
(politely, 10 concurrent, 15s timeout, browser UA). Result: **zero
dead links (no 404s or connection failures)**. 18 return 403 (bot-walled
-- mostly academic publishers [Oxford, Wiley, UChicago Press, MIT
Press], congress.gov, ssa.gov, bls.gov, worldcat.org -- all block
non-browser requests but were independently confirmed real/live via
search in Tasks 1 and 5b); marked verify-by-hand, none swapped. 1
entry (bostrom2014) returned 202, treated as effectively OK. Several
DOI links correctly redirect to their publisher's current page --
expected DOI behavior, left as doi.org per APA7 preference, not
"fixed" to the redirected URL. One genuine domain-migration redirect
found and updated: learnaitogether's towardsai.net -> towardsai.com
(confirmed permanent 301, same organization, not a substitute source).

**DOI-preference gap (reported, not fixed):** autor2003,
borusyakhulljaravel2022, graetzmichaels2018, and autordornhanson2013
use a direct publisher URL where a DOI likely exists, instead of a
doi.org link. Did not guess/fabricate any DOI number to fix this --
would need each paper's real DOI confirmed via search first, which
ran up against this batch's remaining scope. Flagged for a follow-up
pass.

## Status: Task 5a done, starting Task 5b

- [x] Branch created from up-to-date `main`; web access confirmed available.
- [x] Task 1: Citation QA (1a sample, 1b missing-citation sweep, 1c
      bidirectional integrity) — see report notes below.
- [x] Task 2: Documentation refresh (2a CLAUDE.md, 2b README.md, 2c About —
      no factual staleness found, left untouched, proposal + attribution
      flag saved for report, 2d AI Disclosure summary rewritten and
      checked against the work log).
- [ ] Task 3: Repo hygiene
- [ ] Task 4: QA checklist mechanical execution
- [ ] Task 5: Carried-over Final Review items (5a/5b/5c/5d)
- [ ] Task 6: Final integrity pass

## Content edit budget

7 / 25 content/ edits used so far (Task 1's 6 + Task 2d's 1 AI Disclosure
summary rewrite; Task 2a/2b are CLAUDE.md/README.md, not content/, so they
don't count against this budget):
1. citations.yaml — dissent2026 todo note updated (resolved, points to new entry)
2. citations.yaml — added wiggin2025 (new, verified, not yet wired into any page)
3. citations.yaml — weise2025 todo note updated (further corroboration, still no URL)
4. home.yaml — added citations to "past" era (reused history.yaml's own ids)
5. home.yaml — added citations to "right now" era (reused short_version's own ids)
6. takeaction.yaml — restored missing aiengineerconf marker + reworded
   unsupported superlative ("the largest technical AI conference in the
   world" -> "one of the highest-profile technical AI conferences")

## Pending judgment calls

- wiggin2025 (new citation, Socius 2025, Bessemer/Amazon algorithmic
  management) is added to citations.yaml but NOT wired into any page
  content — human should decide whether to cite it directly on the
  History page's Amazon Warehouse Robotics case, replacing or
  supplementing dissent2026's secondary paraphrase.
- weise2025's canonical nytimes.com URL remains unconfirmed despite
  repeated attempts across sessions; left as unverified/null per policy
  (never fabricate a URL). Substance and byline further corroborated
  this session via Forbes/NPR.
- About page: "we"/authorship stays ambiguous (no named individual or
  org anywhere on the site) — left untouched per Task 2c's explicit
  instruction; flagging as a pending human decision, not fixing it.
- About page: a proposed (not committed) addition mentioning /history/
  alongside /the-evidence/ in the "How we handle sources and bias"
  section — see final report for exact draft text.
- AI Disclosure summary: one clause ("chose the audience") isn't
  explicitly action-logged in aidisclosure.yaml's per-batch entries
  (the log's granularity is per-batch content work, not the original
  project-setup decision) — kept it since it's true per CLAUDE.md's own
  foundational spec and not contradicted anywhere, but flagging the
  weaker evidentiary basis in the report per the task's own instruction.

## Task 1 summary (full detail in final report)

- 1c bidirectional check: 1 orphan found initially (aiengineerconf) — was
  a genuinely MISSING marker (its own citations.yaml note named the exact
  item it was meant for), now restored. Zero broken (used-but-undefined)
  ids, both before and after.
- 1a: 10 random claim-citation pairs sampled and verified against fetched
  sources. 0 mismatches (circuit breaker not triggered). 1 pair
  (weise2025 within the Amazon Warehouse Robotics case) remains
  cannot-verify (no canonical URL), already pre-flagged in citations.yaml.
- 1b: swept every page's rendered text plus every `citations: []` /
  `citation: null` field across all yaml content. Found exactly one
  genuine gap (AI Engineer World's Fair resource item — empty citations
  array despite a citation existing specifically for it) plus two
  homepage timeline eras restating already-cited stats from elsewhere on
  the site without their own marker. All three fixed by reusing existing,
  already-verified citation ids — no new source research needed for these
  three. The World's Fair item's own wording also overstated its source
  (a superlative "largest ... in the world" the source doesn't make) —
  reworded to match what the source actually says.
