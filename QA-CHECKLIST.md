# QA Checklist — Batch 4 (Visual Re-skin)

Everything below needs a real browser, devtools, and (for the last item) a
real phone — none of which are available in the environment that built this
branch. Everything mechanical (build, links, contrast math, DOM structure)
has already been checked and is summarized in the batch's final report.
Run these before merging the Batch 4 branch.

Start the site with `npm run serve` and open it in a desktop browser.

## 1. Header height and sticky-pill anchor clicks

`--header-height` (`src/assets/css/base.css`) is a computed estimate, not a
measured one — this batch changed the value (3.875rem → 3.5rem) because the
header brand switched to Space Grotesk with a tighter line-height.

- [ ] Open devtools, inspect `.site-header`, and read its real rendered
      height at desktop width. Compare to `--header-height` (3.5rem = 56px).
      If they don't match, update the value and its comment in `base.css`.
- [ ] Repeat at 375px width — the header can wrap or resize at narrow
      widths; confirm the value still holds, or that it doesn't need a
      responsive override.
- [ ] On **The Evidence**, click every pill in the sticky jump bar (Current
      State, At Risk, Stark State, Protective Factors, Counterarguments) at
      desktop width. Each heading must land fully below both the sticky
      site header and the sticky jump bar — no overlap, no heading hidden
      behind either bar.
- [ ] Repeat all pill clicks at 375px width.
- [ ] Repeat both the desktop and 375px pill-click passes on **Take
      Action**.

This is the batch's most likely breakage point — treat any overlap here as
a blocker, not a nice-to-fix.

## 2. Full-bleed Evidence band (new this pass)

The Evidence's alternating section bands (Current State, Protective Factors)
were rebuilt to genuinely bleed edge-to-edge — a `box-shadow: 0 0 0 100vmax`
technique chosen specifically because it can't cause the horizontal-scrollbar
bug the more common `100vw`/negative-margin breakout technique has. This has
been checked mechanically (no ancestor sets `overflow`, no other `100vw`
usage exists anywhere else in the CSS, `box-shadow` doesn't contribute to an
element's scrollable-overflow area), but a real browser is the only way to
actually confirm no scrollbar appears.

- [ ] On **The Evidence** at 320px and 375px, in both light and dark mode,
      scroll the full length of the page. Confirm no horizontal scrollbar
      appears at any point, and the page never shifts sideways.
- [ ] Repeat the same full-length scroll on **Take Action** at 320px and
      375px, both schemes (it doesn't have a banded section, but it shares
      `--header-height` and the sticky jump bar, so it's worth confirming
      nothing regressed there too).
- [ ] While scrolling The Evidence, confirm the sticky jump bar keeps
      behaving normally as it passes over a banded section — no visual glitch,
      no change in its own position or the pills underneath it.
- [ ] Open the chart lightbox inside **Protective Factors** specifically
      (click "🔍 View larger" on the "Human necessity" chart) — this is the
      one figure that renders inside a banded section. Confirm the lightbox
      still covers the full viewport and centers normally, not offset or
      sized relative to the band instead of the screen. (Mechanically
      confirmed that `box-shadow` alone — the only property left on the band
      rule after this pass — doesn't create the kind of containing-block
      issue that would cause this, but worth a real look given it's the one
      case where a fixed-position element sits inside a banded section.)

## 3. Full-site click-through, both color schemes × two widths

For each of light mode and dark mode (toggle your OS/browser setting, or
use devtools' rendering-emulation panel), visit all 8 pages at desktop
width and then again at 375px: Home, The Evidence, History, Take Action,
Glossary, References, About, AI Disclosure.

- [ ] Nothing overlaps, clips, or overflows horizontally on any page at
      either width.
- [ ] Nav, footer, and breadcrumbs (where present) look correct in both
      schemes.
- [ ] All body text stays legible against its background in both schemes —
      spot-check the accent-tinted elements in particular (Section 7 below
      covers this in more depth).

## 4. Homepage hero at 320px

- [ ] At 320px width (not just 375px — the narrowest common phone width),
      confirm the hero stat ("13–16%"), its label, and its source line
      don't overflow horizontally, wrap awkwardly, or force a horizontal
      scrollbar. The stat uses a fluid `clamp()`, so it should shrink, but
      this hasn't been confirmed in a real viewport.
- [ ] Confirm the h1 above it ("AI & Your First Job") reads clearly as a
      masthead sitting above the hero, not competing with it for attention.

## 5. Timeline card alignment across breakpoints

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

## 6. Reduced motion emulation

In devtools' rendering panel, emulate `prefers-reduced-motion: reduce`
(Chrome/Edge: Rendering tab → "Emulate CSS media feature
prefers-reduced-motion"; Firefox: `ui.prefersReducedMotion` in
`about:config`, or the OS-level setting).

- [ ] With reduced motion emulated, hover the timeline cards, the debate
      cards on Take Action, and the journey-pager "next" card at the
      bottom of Evidence/History/Take Action — **none of them should move
      or grow a shadow**. They should look and behave exactly as they did
      before this batch.
- [ ] Hover a content link (e.g. in a paragraph) — the underline should not
      visibly thicken/animate.
- [ ] Open a Stark State confidence-group accordion on The Evidence — the
      triangle marker should still flip instantly to indicate open/closed
      (this one is intentionally NOT fully suppressed under reduced
      motion, since it's conveying real state, not decoration) — confirm
      it still flips, just without a visible animation.
- [ ] Turn reduced-motion emulation back off and confirm all of the above
      now animate smoothly (~150ms) instead.

## 7. Dark-mode spot check of every accent

- [ ] Homepage: hero stat (teal/`--accent-evidence`), timeline card top
      borders (rust / teal / violet / violet), era-image duotone overlays.
- [ ] The Evidence: h2 underline, jump-bar pill hover, stat callouts (both
      the two new section-level ones and the existing item/barrier ones),
      pull quote border, Stark State accordion marker, confidence-group
      left border.
- [ ] Alternating section bands specifically, in dark mode: confirm the
      band color (`--color-bg-subtle`, `#1c1f26` in dark mode) reads as a
      distinct, subtle tint against the page background (`#14161b`) — not
      invisible, not a harsh line — and that the edge where the band meets
      the viewport's left/right edges looks clean (no seam, no unintended
      border/gap at the boundary).
- [ ] History: per-case h2 underline (rust), journey-pager border on this
      page.
- [ ] Take Action: h2 underline (action accent), jump-bar pill hover,
      journey-pager border on this page — and confirm the debate cards'
      amber caution border (`--color-warning`) still reads as clearly
      different from the action accent, not confusingly similar.
- [ ] None of the above should look washed out, illegible, or like it
      disappears into the dark background.

## 8. Two long-standing open items — retest against this batch

Neither of these is new to Batch 4, but this batch touched enough shared
CSS (fonts, spacing via new borders/padding, sticky positioning) that
they're worth re-checking rather than assuming they're still fine.

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

## 9. One real phone pass

Everything above can be devtools-emulated except this one — actual mobile
Safari/Chrome renders fonts, sticky positioning, and tap targets slightly
differently than desktop emulation.

- [ ] On a real phone, open Home, The Evidence, and Take Action.
- [ ] Confirm the sticky jump-bar pills are actually tappable (not just
      clickable in an emulator) and land correctly below the header.
- [ ] Confirm Space Grotesk actually loads and renders on the headings/
      brand (not silently falling back to the system font) — check the
      Network tab or just eyeball whether headings look visually distinct
      from body text.
- [ ] Confirm the homepage hero stat doesn't overflow at your phone's
      actual width (not just an emulated 320/375px).
