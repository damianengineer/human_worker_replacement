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
- [ ] On **The Evidence** and **Take Action** (the two long pages), scroll
      from top to bottom at desktop width, then again at 375px. Tier 1 and
      tier 2 must both remain fully visible for the *entire* scroll — tier
      2 always directly below tier 1, never overlapping it, never behind
      it, never disappearing partway down the page.

This is this batch's most likely breakage point — treat any overlap here as
a blocker, not a nice-to-fix.

## 2. Tier 1 and tier 2 width at 375px (arithmetic says this is tight)

Character-width arithmetic in the batch report (an approximation — no
browser to measure against) suggests both tiers are genuinely tight at
375px, not a comfortable margin:

- **Tier 1**: five short-label nav items (Evidence, History, Action,
  Glossary, Sources) plus the "More" dropdown trigger plus a *hypothetical*
  shortened future brand land at roughly 407–450px of content against a
  ~327px budget — over. The current actual brand ("AI & Your First Job")
  is shorter than the hypothetical used for that estimate, so today's real
  fit is probably better than the arithmetic above — but this needs a real
  check, not an assumption.
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

## 4. The "More" dropdown (About / AI Disclosure)

Native `<details>`, no JavaScript. Known and accepted limitation: without
JS, it can only be closed by re-clicking the summary — there's no
outside-click or Esc-key dismissal. That's expected, not a bug.

- [ ] By mouse: click "More ▾" in tier 1. Confirm the panel opens,
      contains About and AI Disclosure, both are clickable and land on the
      right page, and the caret rotates (unless reduced motion is on, see
      Section 9).
- [ ] Click "More ▾" again (not one of the links) — confirm the panel
      closes and the caret rotates back.
- [ ] By keyboard: Tab to the "More" summary (confirm a visible focus
      ring), press Enter or Space to open it, Tab into the panel and
      confirm both links are reachable and focus-visible, then Tab past
      the last link and confirm focus moves on to whatever's next on the
      page (tier 2 or page content) rather than getting trapped.
- [ ] Confirm clicking anywhere else on the page (not the summary) does
      **not** close the panel — that's the documented, accepted
      limitation, not a regression to fix.
- [ ] At 375px, confirm the panel doesn't overflow off the right edge of
      the viewport (it's right-aligned under the trigger, which sits at
      the end of tier 1's right-aligned group).
- [ ] Confirm About and AI Disclosure are also reachable via the footer
      sitemap (Section 3) — both paths should work, not just one.

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
- [ ] The "More" dropdown panel: background/border visible against the
      page in dark mode (it uses `--color-bg` + `--color-border`, not a
      shadow), and both links legible and clearly clickable.
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

## 13. Citation Policy — markers now link to References

> **Note:** a separate branch (`docs-qa-checklist-policy`) may also append
> its own new section(s) to this file around the same time. If both merge,
> renumber whichever merges second rather than leaving two different
> sections with the same number.

Every source marker site-wide now links to that source's own entry on the
References page instead of straight out to the external site — mechanically
verified (marker counts unchanged from before this change, every marker's
href resolves to a real entry, no external `http` links remain inside any
citation-class marker, the path prefix appears exactly once per link), but
none of that proves it *looks* or *feels* right to an actual reader.

- [ ] On **The Evidence**, click any citation marker. Confirm it lands on
      the References page with the correct entry visibly highlighted
      (background + left border, not just a color shift) and positioned
      fully below the sticky header — not clipped or hidden under it.
- [ ] Repeat on **Take Action** and on the **homepage** — one marker each.
- [ ] From the highlighted entry, click its own link (not the marker you
      arrived from) — confirm it opens the original external source in a
      new context as expected, not another internal page.
- [ ] Use the browser's back button after that — confirm it returns you to
      the highlighted References entry (or close to it), not all the way
      back to the original reading page. (If it does return to the
      original page, that's expected default browser behavior for
      same-tab external links — not a bug to fix, just note which
      happened.)
- [ ] Back on the original reading page, confirm your scroll position is
      roughly where you left it, not jumped somewhere else.
- [ ] Look at a sentence with two or three markers close together (The
      Evidence and Take Action both have these) in both light and dark
      mode — confirm they read as a quiet, muted cluster against body
      text, not competing with it for attention, and are still obviously
      clickable (not so faint they look like plain text).
- [ ] On a real phone, tap a citation marker — confirm the tap target is
      comfortable, not a frustratingly small hit area.
- [ ] Keyboard-only: Tab to a citation marker and confirm a clearly visible
      focus ring appears (same visibility as any other link on the site,
      not fainter).
- [ ] On the References page itself, confirm the entry's `:target`
      highlight and its `scroll-margin-top` clearance both look correct in
      **dark mode** too, not just light.
- [ ] The `scroll-margin-top` fallback chain on References entries was
      written to hedge against the (separate, in-flight-at-spec-time) nav
      redesign renaming its header-height tokens. That branch has since
      merged with exactly the token names this fallback anticipated, so
      the math should already be correct — but confirm the actual landing
      position in a real browser rather than trusting the calc() alone.

## 14. Citations & References — marker text, consolidation, and naming

> **Note:** a separate branch may also append its own new section(s) to
> this file around the same time. If both merge, renumber whichever merges
> second rather than leaving two different sections with the same number.

This batch shortened every marker's visible text from a full author list to
just first-author surname + year (e.g. `Brynjolfsson 2025`), consolidated
one list section's repeated identical markers into a single section-level
note, and renamed the reader-facing "Sources" label to "References"
site-wide. Mechanically verified (build green, all internal links/anchors
resolve, sitewide marker count dropped by exactly the number Task B's
consolidation removed, no citation id disappeared, every marker still has a
non-empty `title`, no bare numbers or semicolon-joined marker clusters
remain) — but none of that proves the shorter labels are still readable and
unambiguous to an actual reader, or that the site "feels" less cluttered
rather than just differently cluttered.

**Marker behavior**

- [ ] On **The Evidence**, **Take Action**, and the **homepage**: markers
      read as `Surname Year` — short and quiet, not competing with body
      text for attention.
- [ ] Hover a marker: the tooltip shows the full author list and year (not
      just the short label repeated).
- [ ] Click a marker: lands on References with the correct entry
      highlighted and fully visible below the sticky header.
- [ ] Use the browser's back button: returns you to your original reading
      position, not somewhere else on the page.
- [ ] Find two adjacent markers on one claim (The Evidence and Take Action
      both have these): confirm they're visibly separate links with a
      comma between them, and that each goes to a *different* entry, not
      the same one twice.
- [ ] Find a `Source needed` marker if one exists (none do as of this
      batch, but confirm the class still renders correctly if you
      temporarily add one): visibly distinct from a real marker, and not
      clickable.
- [ ] Keyboard: Tab reaches each marker with a visible focus ring; Enter
      follows the link.
- [ ] On a real phone: markers are tappable without needing to zoom in
      first, and no citation-heavy paragraph causes horizontal scrolling.

**Consolidated sections**

- [ ] In **Most Exposed Occupations** (The Evidence, under "Industries &
      Jobs Most at Risk"): a single source note appears once, directly
      under the section's intro paragraphs, and *no* individual occupation
      row carries its own source line. The note's two links go to
      Massenkoff 2026 and Richmond 2026 specifically — not some other pair.
- [ ] That note reads as a statement about the whole list ("Sources for
      every occupation below: …"), not like one more item in the list
      itself.
- [ ] The per-occupation notes that already existed (e.g. "This is the
      single most AI-used job on both companies' lists") are still present
      under their occupation — consolidation removed the source line only,
      not the note.
- [ ] Every *other* list section on The Evidence (Current State of
      Displacement, the barriers under Why Some Jobs Are Safer, the
      counterarguments) still shows its own per-item/per-point source
      line — confirm consolidation didn't leak into a section whose items
      actually cite different sources.

**Reference list sanity (spot-check, do not skip — automated checks
cannot catch a mis-wired id)**

- [ ] Pick five markers from different pages. For each, confirm the entry
      you land on is genuinely the source for *that* specific claim —
      author, year, and title match what the sentence next to the marker
      asserts.
- [ ] On References, confirm every entry's own link opens the actual
      original source — not a search results page, and not a paywall stub
      where a free version was supposed to be linked instead.
- [ ] Confirm no two entries show the same `Surname Year` label without an
      `a`/`b` suffix distinguishing them (three pairs currently share a
      label and should show suffixes: the two undated Karpathy citations,
      the two undated Ng/DeepLearning.AI citations, and the two undated
      Latent Space citations — each should read `…n.d.-a` / `…n.d.-b`).
- [ ] Confirm no reference entry sits completely unlinked-to from anywhere
      else on the site (a section-level source note counts as a link in).
- [ ] Confirm every entry shows a full APA 7 record — authors, year,
      title, publisher/source, and a link — not a bare URL or a partial
      line.
- [ ] Confirm the nav item, footer link, page `<h1>`, and browser tab title
      all read "References," not "Sources," anywhere on the site.

## 15. Most Exposed Occupations — compact one-line rows

The six-item list under Industries & Jobs Most at Risk was rewritten from
a heading + summary + separate note per item into a single flowing line
each, to reduce how much vertical space the list takes up. Same text,
same citations, same section-level source note — this is a density
change only.

- [ ] On The Evidence, confirm all six occupations render as one line
      each (wrapping to a second line on narrow phone widths is fine —
      each item should not otherwise look broken or overlapping).
- [ ] Confirm the four occupations with a note (Computer Programmers and
      Software Developers, Customer Service Representatives, Data Entry
      Keyers) still show their note text, inline right after the summary
      in a visibly muted/italic style — not missing, not identical-looking
      to the summary text.
- [ ] Confirm the two-column layout at desktop width (≥ 640px) still
      looks balanced — six short rows split 3/3 (or close to it) across
      columns, not an awkward, uneven split.
- [ ] Confirm the single section-level source note above the list ("Sources
      for every occupation below: …") still appears once, and no
      individual row shows its own separate source line (unless a future
      item has its own distinct citation — see the exception-handling
      rule in CLAUDE.md Section 13).
- [ ] Confirm this list is now visibly more compact than the page's other
      list sections above it (Current State of Displacement) that still
      use the heading + paragraph layout — if it looks about the same
      height as before, the compaction likely didn't take effect.

## 16. Color re-skin (Gradient Blues)

Every ratio in this batch was computed with a WCAG-formula script, not
eyeballed — see the batch report for the full contrast and luminance
tables. None of that substitutes for actually looking at the result.

- [ ] Homepage, light mode: hero stat, brand, and links read as blue/
      indigo; the page reads noticeably more colorful than before, not
      gray.
- [ ] Homepage timeline: the four era cards show a **visible**
      progression indigo → aqua on their top border; adjacent cards are
      clearly different, not four similar blues. The two cards with a
      photo (The past, Right now) show a matching tint on the photo
      itself, not a mismatched color from the border.
- [ ] The Evidence: alternating bands read as lightly blue-tinted,
      clearly distinguishable from the untinted sections in between; body
      text on the tint is comfortable to read, not washed out.
- [ ] Section identity: open The Evidence, History, Take Action in turn —
      each still feels like a different-colored section (cool blue / warm
      rust / warm amber), not shades of one blue. Each page's own section
      heading (not just its border) now shows in that section's color.
- [ ] Repeat the above four checks in **dark mode**: every accent legible,
      no ramp step lost to the background, progression still visible.
- [ ] Take Action: the policy-debate "case for / case against" cards are
      the most visually assertive element on the page (accent border +
      tinted background), not the plain gray cards they were before.
- [ ] **Journey pager wayfinding:** at the bottom of The Evidence, the
      "next" card should be colored like **History** (rust), not Evidence
      blue — it's pointing to History next. At the bottom of History, the
      "next" card should be colored like **Take Action** (amber). At the
      bottom of Take Action, the "next" card (looping back to Evidence's
      Stark State section) should be colored like **Evidence** (blue).
      If any of these three shows its *own* page's color instead of the
      destination's, that's the bug this batch fixed regressing.
- [ ] **Focus check:** Tab through the homepage and The Evidence — every
      focused link, button, pill, and `<summary>` shows a clearly visible
      focus ring in both schemes (the focus ring color itself wasn't
      changed by this batch, but re-confirm nothing else now overlaps or
      obscures it).
- [ ] **Meaning-without-color check:** confirm certainty tags, any
      "source needed" marker, and the current-page nav item are each
      identifiable by text/shape/border, not color alone — squint, or use
      a grayscale screenshot filter.
- [ ] **Outdoor/brightness check:** view the homepage and The Evidence on
      a phone at ~50% brightness — the band tint and the ramp's lighter
      steps must still read as colored, not wash out to white/gray.
- [ ] Confirm no gradient appears anywhere except the homepage timeline's
      per-card border progression (no second gradient was added anywhere
      else in this batch).
- [ ] One real-phone pass, both schemes, covering all of the above.

## 17. History's two new banner images

Both of History's remaining image-less cases now have a lead image,
matching the existing Luddite/Amazon treatment (click-to-enlarge
lightbox, credit line beneath).

- [ ] Automation of Telephone Operators shows the new AI-generated
      switchboard-operator image, correctly proportioned (portrait, not
      stretched or cropped oddly) — and shows **no** source/credit line
      beneath it (none is needed for this image).
- [ ] Computerization of Office Work shows the new Mad Men still, and
      the line beneath it reads the fair-use attribution text plainly —
      confirm it is **not** a clickable link (unlike every citation
      marker elsewhere on the site).
- [ ] Click each image to confirm the lightbox opens, shows the full
      image, and closes correctly — both light and dark mode.
- [ ] Confirm both images still look reasonable in dark mode (the
      light-colored image frame/border around each should still read as
      a frame, not clash with the photo).

## 18. Take Action hub and progressive disclosure

The page was restructured around a three-card topic hub plus native
`<details>`/`<summary>` disclosure, dropping the visible-by-default word
count from ~2,630 to ~1,310 (mechanically counted, not estimated — see
the batch report). None of this was visually verified in a browser.

1. Page loads: three topic cards visible without scrolling at desktop;
   the page reads as three choices, not a wall of text.
2. Click each card's button: lands on the correct section, heading fully
   visible below the sticky header (not clipped by it).
3. Keyboard: Tab reaches each card's button with a visible focus ring;
   Enter follows it.
4. Mobile 375px: cards stack, tappable, no horizontal scroll; the hub
   occupies roughly one screen or less before the first CTA section
   starts (icon+title share a row by design — if the hub feels taller
   than that, the compact layout didn't render as intended).
5. Accordions open on click and on keyboard (Enter/Space on a focused
   `<summary>`); the first AI Literacy group (In-Person Events) is open
   by default, the other five are closed; every plan_b/policy item whose
   text is behind a `<summary>` opens the same way.
6. With everything closed: the AI Privacy & Security caution section and
   "First, understand the debate" (the two UBI/SWF proposals) are fully
   visible without opening anything.
7. Deep links land correctly and the target content is visible, not
   hidden in a closed accordion: the homepage's "build a Plan B" link,
   "Improve your AI literacy" link, and "Start with the debate" link;
   the journey pager's link into this page from Take Action's own
   "next" card loop.
8. Deep-link a *closed* AI Literacy resource group directly (e.g. open
   `/take-action/#ai-literacy-videos` in a fresh tab) — the page should
   scroll to that group's row even though it's still collapsed; clicking
   its summary should then reveal the videos inside.
9. Collapsed-state read-through: with every `<details>` closed, skim the
   page top to bottom — it should still clearly communicate all three
   actions. If any collapsed summary reads as meaningless or vague on
   its own, flag it — the summary text is doing the wrong job.
10. Confirm in-page Ctrl+F/Find does **not** find text that's currently
    inside a closed accordion (expected, documented trade-off — not a
    bug) but **does** find the visible summary line itself.
11. Both color schemes; one real-phone pass.

## 19. Homepage edits (hero removal, Short Version, retitle, glossary, figures)

1. Homepage loads: no oversized percentage at the top; the page opens
   with the title, then the intro paragraph, then The Short Version.
2. The h1 looks consistent in size with the h1 on The Evidence and
   History (all three should now use the same base h1 size — none of
   the three pages sets its own h1 override any more).
3. The Short Version reads as a complete thought: the 13–16% statistic
   stated up front, the chart explained next to it, then a sentence
   connecting both to the timeline section below.
4. The chart description matches what the chart actually shows: bars
   comparing theoretical AI capability to observed exposure, not a
   scatter plot or a single trend line.
5. "Entry-level jobs" in the homepage's intro paragraph (the first
   sentence, before The Short Version) is a link; clicking it lands on
   the new glossary entry, highlighted and fully visible below the
   sticky header.
6. Header brand, browser tab title, and any social/link preview all read
   "AI & Your Job" — not "AI & Your First Job" anywhere.
7. Header still fits on one row at 375px (this should be easier than
   before, not harder — the new title is shorter).
8. **Figure sizing:** on a laptop (~1440px wide), the homepage chart
   spans the text column and its left edge lines up with the body text
   above and below it — it should read as filling the column, not
   floating small and centered. The image should not look blurry or
   stretched. Repeat this same check on History (all four case images)
   and on The Evidence (the "Human necessity" chart under Protective
   Factors) — all six lead images share this one CSS rule.
9. **Figure at 375px:** every lead figure above still fits without
   horizontal scrolling, and its caption/credit line sits directly
   beneath it, not stranded off to one side.
10. Clicking any lead figure still opens the lightbox at a clearly larger
    size than the inline version, and closing it returns you to the same
    scroll position.
11. Both color schemes; one real-phone pass.

## 20. The Evidence clarity pass (examples, plain-language gloss, cards)

1. Current State: the hiring-slowdown item ("Hiring of young workers...")
   has a clearly-marked "What this looks like in practice" example that
   reads as illustration, not data — no source links appear inside it,
   and it sits below the claim's own citation line.
2. The 58–68 pts item explains what closing the capability-vs-use gap
   would actually require (workflow redesign, retraining, budget/job
   description changes) and does not predict when that will happen.
3. "High near-term automation risk" is understandable from its own
   sentence: the researchers' term is followed by a plain-language gloss
   that links to a new glossary entry, and the 18%/46% figures read as
   two buckets of one system.
4. Industries & Jobs: Theoretical versus Observed and Most Exposed
   Occupations now read as two clearly separated bounded cards (tinted
   background, top accent border) rather than one continuous block.
5. Inside Theoretical versus Observed, the law-disagreement example
   ("One example: the labs disagree about law") appears as a distinct
   bordered callout, visually separate from the general concept
   paragraph above it.
6. The "Sources for every occupation below:" line is still directly
   under the Most Exposed Occupations intro, inside its card, unchanged.
7. Jump-bar/"On this page" links (Most at risk, Stark State majors, etc.)
   still land with their heading fully visible below the sticky header,
   even with the new card padding above them.
8. Protective factors: the 9% stat callout (top of section) and the lead
   "Human necessity" figure below it share the same left edge, with no
   dead space at lower left. **Check dark mode specifically.**
9. The two 9% callouts (section-level, and Barrier 2's own) now read as
   making two different points, not an accidental repeat.
10. Charts are not blurry or upscaled; the lightbox still opens and
    closes normally.
11. At 375px: the new subsection cards don't crush their charts, and
    there's no horizontal scrolling anywhere on the page.
12. **Read-aloud check:** read the hiring-slowdown example, the rewritten
    58–68 pts sentence, and the new "high near-term automation risk"
    gloss aloud. Any sentence you stumble over or have to re-read is too
    complex — note it for revision.
13. Both color schemes; one real-phone pass.

## 21. Theoretical vs. Observed: stacked figures, consolidated methods citations

1. On a laptop (~1440px), Theoretical versus Observed's two charts appear
   stacked one above the other — bar chart ("The capability overhang by
   occupation") first, then the square/radar chart ("Theoretical
   capability and observed exposure by occupational category") — not
   side by side.
2. **Left-edge check:** hold a straightedge (or use a browser ruler) down
   the left side — the paragraph text, the bar chart, its caption, the
   radar chart, and its caption all start at the same x-position.
3. The radar chart reads as a diagram, not a page-dominating poster, at
   laptop width — it should look noticeably narrower than the bar chart
   above it.
4. No empty wedge of dead space beside or beneath either chart.
5. Each caption and credit line sits directly beneath its own chart, not
   stretched wider than the image.
6. **Tablet check (~900px wide):** the radar is *not* conspicuously
   narrower than the bar chart above it — at this width both should fill
   the column edge-to-edge, same as each other.
7. Neither chart is blurry or upscaled; clicking either opens the
   lightbox at a clearly larger size; closing it returns you to the same
   scroll position.
8. The methods sentence ("Both companies base their measure...") now
   shows as its own line, with a second short line directly beneath it
   containing all six source markers — not six markers glued to the end
   of the sentence. Every marker links to its own References entry.
9. 375px: both charts fill the width edge-to-edge, no horizontal
   scrolling, captions directly beneath each — the radar is not
   artificially shrunk at this width.
10. Both color schemes; one real-phone pass.
