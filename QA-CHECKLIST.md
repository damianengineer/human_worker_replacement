# QA Checklist — Batch 4 (Visual Re-skin) + Nav Redesign

Everything below needs a real browser, devtools, and (for the phone-pass
items) a real phone — none of which are available in the environment that
built this branch. Everything mechanical (build, links, contrast math, DOM
structure, character-width arithmetic) has already been checked and is
summarized in each batch's final report. Run these before merging.

Start the site with `npm run serve` and open it in a desktop browser.

## 1. Two-tier header: token accuracy and sticky-pill anchor clicks

The Nav Redesign batch replaced the old single `--header-height` estimate
with two tokens — `--nav-h1` (tier 1, the site row: brand + primary nav)
and `--nav-h2` (tier 2, the page row: "On this page:" pills) — both in
`src/assets/css/base.css`. Both are still computed from box-model math, not
measured in a real browser.

- [ ] Open devtools, inspect `.site-tier1`, and read its real rendered
      height at desktop width. Compare to `--nav-h1` (3.5rem = 56px). If it
      doesn't match, update the value and its comment in `base.css`.
- [ ] On **The Evidence**, **Take Action**, or **Home** (any page with tier
      2), inspect `.site-tier2` and compare its real height to `--nav-h2`
      (2.5rem = 40px). Same correction path if it's off.
- [ ] Repeat both height checks at 375px width.
- [ ] On **The Evidence**, click every pill in tier 2 (Current state, Most
      at risk, Stark State majors, Safer jobs — for now, The other side) at
      desktop width. Each heading must land fully below *both* sticky tiers
      — no overlap, nothing hidden behind either row.
- [ ] Repeat all pill clicks at 375px width.
- [ ] Repeat both the desktop and 375px pill-click passes on **Take Action**
      (Build a Plan B, AI Literacy, AI Policy) and **Home** (The short
      version, Where this story is, Two clocks).

This is this batch's most likely breakage point — treat any overlap here as
a blocker, not a nice-to-fix.

## 2. Tier 1 and tier 2 width at 375px (arithmetic says this is tight)

Character-width arithmetic in the batch report (an approximation — no
browser to measure against) suggests both tiers are genuinely tight at
375px, not a comfortable margin:

- **Tier 1**: five short-label nav items (Evidence, History, Action,
  Glossary, Sources) plus a *hypothetical* shortened future brand land at
  roughly 376–401px of content against a ~327px budget — over, even after
  the named fallback (dropping the planned "More ▾" menu) was taken
  specifically to ease this. The current actual brand ("AI & Your First
  Job") is shorter than the hypothetical used for that estimate, so today's
  real fit is probably better than the arithmetic above — but this needs a
  real check, not an assumption.
- **Tier 2**: all three sectioned pages' pill rows are estimated at
  363–762px against the same ~327px budget — Evidence's 5 pills especially
  so. This is expected to need horizontal scroll, similar to (though
  meaningfully shorter than) the old jump bars' labels.

Both tiers have `overflow-x: auto` as a safety net specifically because of
this uncertainty.

- [ ] At 375px, look at tier 1: do brand + all 5 nav items actually fit on
      one line, or does the row scroll horizontally? Either is acceptable
      (the scroll safety net is intentional), but confirm it *looks*
      intentional — not clipped, not overlapping, a visible affordance that
      there's more to scroll to (if it's scrolling).
- [ ] At 375px, check tier 2's pill row on all three sectioned pages the
      same way — especially Evidence (5 pills), the worst case.
- [ ] If either tier scrolls at 375px: try swiping/dragging it — confirm it
      actually scrolls smoothly and every item is reachable, not just
      visually cut off.
- [ ] If tier 1 does NOT need to scroll at 375px with the current brand:
      that's good news, but note it in case the future longer brand
      (separate batch) changes this — this checklist item should be
      re-run once that retitle lands.

## 3. Sitemap footer

Replaces the old flat 3-link footer. `content/site.yaml`'s `footer.groups`
now covers all 7 non-Home pages across three labeled groups.

- [ ] At desktop width, confirm the footer renders as three columns (The
      argument / Reference / About this site), each with a heading, and
      confirm all 7 links plus their one-line notes are present and
      correctly matched (e.g. "Sources & References" points at
      `/references/`, not `/glossary/`).
- [ ] At 375px, confirm the three groups stack into a single column,
      readable top-to-bottom, not still cramped into columns.
- [ ] Confirm the footer appears identically (same 7 links) on every one of
      the 8 pages — it's global chrome, so a mismatch on any one page would
      indicate a template bug, not a content choice.
- [ ] Click every one of the 7 footer links once, confirming each lands on
      the right page.

## 4. The dropped "More" menu — confirm reachability, not a broken feature

Task 2's planned `<details>` dropdown for About/AI Disclosure was not
built (see the batch report for the width-budget reasoning) — this is a
deliberate fallback, not a bug to hunt for. There is no dropdown to test.

- [ ] Confirm About and AI Disclosure are *not* in the primary nav (tier 1)
      — expected — and *are* reachable via the footer sitemap (Section 3
      above) on every page. That's the only reachability path for these
      two now, same as it was before this batch.

## 5. Full-bleed Evidence band (Batch 4, re-confirm after Nav Redesign)

The Evidence's alternating section bands (Current State, Protective
Factors) bleed edge-to-edge via a `box-shadow: 0 0 0 100vmax` technique
chosen specifically because it can't cause the horizontal-scrollbar bug the
more common `100vw`/negative-margin breakout technique has. Checked
mechanically (no ancestor sets `overflow`, no other `100vw` usage exists
anywhere else in the CSS, `box-shadow` doesn't contribute to an element's
scrollable-overflow area) both when it was built and again after the Nav
Redesign's header/footer changes — but a real browser is the only way to
actually confirm no scrollbar appears.

- [ ] On **The Evidence** at 320px and 375px, in both light and dark mode,
      scroll the full length of the page. Confirm no horizontal scrollbar
      appears at any point, and the page never shifts sideways.
- [ ] Repeat the same full-length scroll on **Take Action** at 320px and
      375px, both schemes (it doesn't have a banded section, but it shares
      the sticky two-tier header, so it's worth confirming nothing
      regressed there too).
- [ ] While scrolling The Evidence, confirm tier 1 and tier 2 keep behaving
      normally as they pass over a banded section — no visual glitch, no
      change in either row's position or the pills inside it.
- [ ] Open the chart lightbox inside **Protective Factors** specifically
      (click "🔍 View larger" on the "Human necessity" chart) — this is the
      one figure that renders inside a banded section. Confirm the lightbox
      still covers the full viewport and centers normally, not offset or
      sized relative to the band instead of the screen.

## 6. Full-site click-through, both color schemes × two widths

For each of light mode and dark mode (toggle your OS/browser setting, or
use devtools' rendering-emulation panel), visit all 8 pages at desktop
width and then again at 375px: Home, The Evidence, History, Take Action,
Glossary, References, About, AI Disclosure.

- [ ] Nothing overlaps, clips, or overflows horizontally on any page at
      either width.
- [ ] The two-tier header and the sitemap footer look correct in both
      schemes on every page (tier 2 only appears on Home/Evidence/Take
      Action — confirm it's genuinely absent, not just invisible, on the
      other 5).
- [ ] All body text stays legible against its background in both schemes —
      spot-check the accent-tinted elements in particular (Section 9 below
      covers this in more depth).

## 7. Homepage hero at 320px

- [ ] At 320px width (not just 375px — the narrowest common phone width),
      confirm the hero stat ("13–16%"), its label, and its source line
      don't overflow horizontally, wrap awkwardly, or force a horizontal
      scrollbar. The stat uses a fluid `clamp()`, so it should shrink, but
      this hasn't been confirmed in a real viewport.
- [ ] Confirm the h1 above it ("AI & Your First Job") reads clearly as a
      masthead sitting above the hero, not competing with it for attention.

## 8. Timeline card alignment across breakpoints

The four timeline cards go 1-column → 2-column (40rem) → 4-column (60rem).
Only the first two cards ("The past," "Right now") have images; the other
two don't.

- [ ] At mobile width (1 column): cards stack cleanly, image cards and
      text-only cards both look intentional side by side in the vertical
      stack — no odd gaps.
- [ ] At tablet width (2 columns, ~40–60rem): check that a 2x2 grid doesn't
      leave the row heights looking mismatched in a way that looks broken
      (some height difference between image/non-image cards is expected;
      it should look like a design choice, not a bug).
- [ ] At desktop width (4 columns, ≥60rem): all four cards in one row —
      confirm the two image cards and two non-image cards don't look
      jarringly uneven.
- [ ] Zoom in on the Luddite engraving thumbnail specifically: the
      object-position was hand-picked (`50% 20%`) to keep the figure's head
      in frame given the portrait image is cropped hard into a short,
      wide box. Confirm the head is actually visible and not cropped out;
      adjust the object-position value in `home.css` if it's off.
- [ ] Confirm both thumbnails don't look pixelated or upscaled at the
      largest size they render at.
- [ ] Confirm the credit line under each image (title + source link) is
      legible in both light and dark mode.

## 9. Reduced motion emulation

In devtools' rendering panel, emulate `prefers-reduced-motion: reduce`
(Chrome/Edge: Rendering tab → "Emulate CSS media feature
prefers-reduced-motion"; Firefox: `ui.prefersReducedMotion` in
`about:config`, or the OS-level setting). The Nav Redesign batch added no
new motion — this section is unchanged from Batch 4, re-listed here for
convenience.

- [ ] With reduced motion emulated, hover the timeline cards, the debate
      cards on Take Action, and the journey-pager "next" card at the
      bottom of Evidence/History/Take Action — **none of them should move
      or grow a shadow**. They should look and behave exactly as they did
      before Batch 4.
- [ ] Hover a content link (e.g. in a paragraph) — the underline should not
      visibly thicken/animate.
- [ ] Open a Stark State confidence-group accordion on The Evidence — the
      triangle marker should still flip instantly to indicate open/closed
      (this one is intentionally NOT fully suppressed under reduced
      motion, since it's conveying real state, not decoration) — confirm
      it still flips, just without a visible animation.
- [ ] Turn reduced-motion emulation back off and confirm all of the above
      now animate smoothly (~150ms) instead.

## 10. Dark-mode spot check of every accent

- [ ] Homepage: hero stat (teal/`--accent-evidence`), timeline card top
      borders (rust / teal / violet / violet), era-image duotone overlays.
- [ ] The Evidence: h2 underline, tier-2 pill hover (teal —
      `.site-tier2__list--evidence`), stat callouts (both the two
      section-level ones and the existing item/barrier ones), pull quote
      border, Stark State accordion marker, confidence-group left border.
- [ ] Alternating section bands specifically, in dark mode: confirm the
      band color (`--color-bg-subtle`, `#1c1f26` in dark mode) reads as a
      distinct, subtle tint against the page background (`#14161b`) — not
      invisible, not a harsh line — and that the edge where the band meets
      the viewport's left/right edges looks clean (no seam, no unintended
      border/gap at the boundary).
- [ ] History: per-case h2 underline (rust), journey-pager border on this
      page (History has no tier 2 of its own — confirm it's genuinely
      absent here, not rendering empty).
- [ ] Take Action: h2 underline (action accent), tier-2 pill hover (action
      accent — `.site-tier2__list--action`), journey-pager border on this
      page — and confirm the debate cards' amber caution border
      (`--color-warning`) still reads as clearly different from the action
      accent, not confusingly similar.
- [ ] Home: tier-2 pill hover uses the *shared default* style (plain
      underline, no accent tint) — confirm that reads fine, not like a
      missing style.
- [ ] Footer sitemap: group headings and link text legible in dark mode,
      notes readable at their muted color.
- [ ] None of the above should look washed out, illegible, or like it
      disappears into the dark background.

## 11. Two long-standing open items — retest against everything so far

Neither of these is new to this batch or Batch 4, but both batches touched
enough shared CSS (fonts, spacing, sticky positioning, and now the header
structure itself) that they're worth re-checking rather than assuming
they're still fine.

- [ ] **Lightbox close control at short viewport heights (~640px tall).**
      Open any chart lightbox on The Evidence (click "🔍 View larger" on a
      chart) and shrink the browser window to roughly 640px tall. The close
      button (`.evidence-lightbox__close`) is positioned above the image
      via a negative offset — confirm it's still reachable/visible and
      not pushed off the top of the viewport.
- [ ] **Two-column list behavior at 640–768px.** On The Evidence, the "Most
      Exposed Occupations" list (`.evidence-list--two-col`) switches from
      one column to two at 640px (40rem). Check the 640–768px range
      specifically — confirm list items don't break awkwardly across the
      column gap and reading order (left column top-to-bottom, then right
      column) still makes sense.

## 12. One real phone pass

Everything above can be devtools-emulated except this one — actual mobile
Safari/Chrome renders fonts, sticky positioning, and tap targets slightly
differently than desktop emulation.

- [ ] On a real phone, open Home, The Evidence, and Take Action.
- [ ] Confirm tier 1 and tier 2 pills are actually tappable (not just
      clickable in an emulator), tier 2 lands correctly below tier 1, and
      neither tier ever overlaps page content while scrolling.
- [ ] If either tier scrolls horizontally at your phone's actual width,
      confirm the swipe gesture works naturally (not just a mouse-drag
      simulation).
- [ ] Scroll to the footer and confirm the sitemap is usable — columns or
      stacked, whichever your width triggers — and every link is tappable.
- [ ] Confirm Space Grotesk actually loads and renders on the headings/
      brand (not silently falling back to the system font) — check the
      Network tab or just eyeball whether headings look visually distinct
      from body text.
- [ ] Confirm the homepage hero stat doesn't overflow at your phone's
      actual width (not just an emulated 320/375px).
