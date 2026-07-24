# Final Batch Progress

Branch: `final-batch`. Tracks progress through the Final Batch (v2) audit
spec. Delete this file in the final commit (Task 6).

## Status: Task 1 done, starting Task 2

- [x] Branch created from up-to-date `main`; web access confirmed available.
- [x] Task 1: Citation QA (1a sample, 1b missing-citation sweep, 1c
      bidirectional integrity) — see report notes below.
- [ ] Task 2: Documentation refresh
- [ ] Task 3: Repo hygiene
- [ ] Task 4: QA checklist mechanical execution
- [ ] Task 5: Carried-over Final Review items (5a/5b/5c/5d)
- [ ] Task 6: Final integrity pass

## Content edit budget

6 / 25 content/ edits used so far:
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
