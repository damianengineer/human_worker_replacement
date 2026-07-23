const yaml = require("js-yaml");
const { HtmlBasePlugin } = require("@11ty/eleventy"); // Added for path prefixing

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function lookupCitation(citations, id) {
  const entry = citations[id];
  if (!entry) {
    throw new Error(
      `Unknown citation id "${id}" — add it to content/citations.yaml first.`
    );
  }
  const label = entry.year ? `${entry.authors}, ${entry.year}` : `${entry.authors}`;
  if (entry.status === "TODO(citation-needed)") {
    // Kept even though 0 entries currently use this status (verified against
    // the live content/citations.yaml) — this is CLAUDE.md's own sanctioned
    // way to flag a not-yet-sourced claim (Sections 6/11: add a
    // TODO(citation-needed) marker rather than inventing a source), so it's
    // a safety valve that's unused right now, not dead code to prune. These
    // have no meaningful References-page target, so they stay unlinked.
    return {
      label: `${label} — source needed`,
      isTodo: true,
      isUnverified: false,
    };
  }
  if (entry.status === "unverified") {
    return {
      label: `${label} — unverified`,
      isTodo: false,
      isUnverified: true,
    };
  }
  return { label, isTodo: false, isUnverified: false };
}

// Manual short-name overrides for the handful of organizational authors
// whose full name needs a real abbreviation, not just trimming (long
// institutional names, or ones better known by their acronym). Every other
// organizational entry is already short enough that the generic rules in
// deriveAuthorName produce a usable label on their own — keep this list to
// genuine derivations only, not a blanket override table.
const ORG_SHORT_NAMES = {
  blsdisplacedworkers: "BLS",
  euaiact: "EU Parliament",
  iwgswf2008: "IWG",
  shrm2026: "SHRM",
  stanfordhai: "Stanford HAI",
  nationalarchivesuk: "National Archives",
  therundownai: "Rundown AI",
  starkstate2026: "Stark State",
};

// Derives the marker-label author name from a citation entry's `authors`
// field. Rules, applied in order (documented per the Citation Marker Text
// batch — CLAUDE.md Section 13):
//   1. ORG_SHORT_NAMES override wins outright — long institutional names
//      that need real abbreviation rather than mechanical trimming.
//   2. A "Person / Org" hybrid string (e.g. "Ng, A. / DeepLearning.AI")
//      takes the person segment before " / ".
//   3. A trailing parenthetical clarification (e.g. "Sanderson, G.
//      (3Blue1Brown)") is stripped before the next rule runs.
//   4. A standard "Surname, Initial[, ...]" author string takes the text
//      before the first comma — this also happens to produce a reasonable
//      result for the one "Org, Sub-division" entry (ssatrustees), even
//      though that comma separates something structurally different than
//      author-initial.
//   5. Otherwise (already-short organization/handle names with no comma,
//      e.g. "MITRE", "Zapier", "AI Engineer") the string is used as-is.
function deriveAuthorName(citationId, authors) {
  if (ORG_SHORT_NAMES[citationId]) return ORG_SHORT_NAMES[citationId];
  let name = String(authors);
  if (name.includes(" / ")) name = name.split(" / ")[0];
  name = name.replace(/\s*\([^)]*\)\s*$/, "").trim();
  if (name.includes(",")) name = name.split(",")[0].trim();
  return name;
}

function hasRealYear(year) {
  return Boolean(year) && String(year).trim().toLowerCase() !== "n.d.";
}

// The APA disambiguation suffix as it should be *appended directly* to a
// year for display — "2025" + "a" -> "a" (renders "2025a"), but "n.d." +
// "a" -> "-a" (renders "n.d.-a"; APA's own convention for disambiguating
// undated sources uses a hyphen, dated ones don't). Used both for the
// marker label and for the matching suffix shown on the References entry.
function suffixForDisplay(year, suffix) {
  if (!suffix) return "";
  return hasRealYear(year) ? suffix : `-${suffix}`;
}

// Builds every citation's marker label ("Surname Year") in one pass so that
// surname+year collisions across different citations (e.g. two separate
// Karpathy, n.d. sources) can be detected and given deterministic a/b/c
// suffixes, assigned by citation id sort order so the same citation always
// gets the same suffix across builds. Memoized per citations object
// (WeakMap, not a module-level cache) so it recomputes if the data changes
// but isn't rebuilt on every single marker lookup within one build.
const labelMapCache = new WeakMap();
function buildLabelMap(citations) {
  if (labelMapCache.has(citations)) return labelMapCache.get(citations);

  const base = {};
  for (const [id, entry] of Object.entries(citations)) {
    base[id] = { name: deriveAuthorName(id, entry.authors), year: entry.year };
  }

  const groups = {};
  for (const id of Object.keys(base).sort()) {
    const key = `${base[id].name} ${base[id].year}`;
    (groups[key] = groups[key] || []).push(id);
  }

  const map = {};
  for (const ids of Object.values(groups)) {
    ids.forEach((id, i) => {
      const rawSuffix = ids.length > 1 ? String.fromCharCode(97 + i) : "";
      const { name, year } = base[id];
      const suffix = suffixForDisplay(year, rawSuffix);
      map[id] = {
        label: `${name} ${year}${suffix}`,
        suffix,
      };
    });
  }

  labelMapCache.set(citations, map);
  return map;
}

function markerLabel(citations, id) {
  return buildLabelMap(citations)[id].label;
}

function markerSuffix(citations, id) {
  return buildLabelMap(citations)[id].suffix;
}

function fullCitationString(entry) {
  return `${entry.authors} (${entry.year})`;
}

module.exports = function (eleventyConfig) {
  // Enable automatic base path prefixing for URLs across compiled HTML
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // Tried eleventyConfig.getFilter("url") here first (the task's preferred
  // option) to prefix citeLink's href manually. Verified directly against a
  // real build that this DOUBLE-prefixes: HtmlBasePlugin (enabled above)
  // already rewrites every root-relative href in the final compiled HTML —
  // including ones returned by a plain JS filter like citeLink, not just
  // template-authored `{{ url | url }}` output — so a href citeLink already
  // prefixed gets prefixed a second time by HtmlBasePlugin's own pass,
  // producing "/human_worker_replacement/human_worker_replacement/...".
  // The fix is simpler than the task anticipated: citeLink just needs to
  // emit a plain root-relative path, exactly like every other href already
  // hardcoded in this site's templates (none of which call the url filter
  // either) — HtmlBasePlugin prefixes it exactly once, automatically, the
  // same way it already does for all of them. No module-level constant or
  // manual prefixing needed at all.

  eleventyConfig.addDataExtension("yaml", (contents) => {
    if (!contents.replace(/#.*$/gm, "").trim()) {
      return {};
    }
    return yaml.load(contents);
  });

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addFilter("slugify", (str) => String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  );

  eleventyConfig.addFilter("sentencePeriod", (str) => /[.!?]$/.test(String(str)) ? "" : "." );

  eleventyConfig.addFilter("prettyDate", (str) => {
    if (!str) return "";
    const date = new Date(`${str}T00:00:00Z`);
    if (isNaN(date)) return str;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  });

  eleventyConfig.addShortcode("cite", function (citationId) {
    const citations = this.ctx.citations || {};
    const { label } = lookupCitation(citations, citationId);
    return `(${label})`;
  });

  // Citation policy (CLAUDE.md's Citation Policy section): a source marker
  // links to that source's own entry on the References page, never directly
  // to the external source — the external link lives only on the
  // References page itself (references.njk). This is true whether or not
  // the entry has an external url at all: a citation with no url used to
  // render as unlinked text here, even though it has a perfectly good
  // References entry to land on — that inconsistency is what this fixes.
  //
  // Marker text (Citation Marker Text batch): the visible label is first-
  // author surname + year (e.g. "Brynjolfsson 2025"), derived from citation
  // data via markerLabel/deriveAuthorName — never hand-written per call
  // site, so the label convention is a one-place change. The href is
  // unchanged from the citation-policy batch. The full author-year string
  // still appears in `title` for hover/assistive tech, since the visible
  // label alone no longer carries every author's name.
  eleventyConfig.addFilter("citeLink", function (citationId) {
    const citations = this.ctx.citations || {};
    const entry = citations[citationId];
    if (!entry) {
      throw new Error(
        `Unknown citation id "${citationId}" — add it to content/citations.yaml first.`
      );
    }
    if (entry.status === "TODO(citation-needed)") {
      // No meaningful target — the source hasn't been identified yet, so
      // there's nothing on the References page to point at. Never a
      // plausible-looking author-year label for an unsourced claim.
      return `<span class="citation citation--todo">Source needed</span>`;
    }
    const label = escapeHtml(markerLabel(citations, citationId));
    const titleSuffix = entry.status === "unverified"
      ? " — unverified — see References"
      : " — see References";
    const title = escapeHtml(fullCitationString(entry)) + titleSuffix;
    const cssClass = entry.status === "unverified" ? "citation citation--unverified" : "citation";
    const href = `/references/#${escapeHtml(citationId)}`;
    return `<a class="${cssClass}" href="${href}" title="${title}">${label}</a>`;
  });

  eleventyConfig.addFilter("sortedCitations", (citations) => Object.entries(citations || {})
    .map(([id, entry]) => ({ id, ...entry, markerSuffix: markerSuffix(citations, id) }))
    .sort((a, b) => String(a.authors).localeCompare(String(b.authors)))
  );

  // Same sort as sortedCitations, grouped by the first letter of `authors`
  // (not the citation id — the two don't always match, e.g. "mcp" is
  // authored by "Anthropic") — powers the References page's A-Z jump-list.
  // Each entry also carries `markerSuffix` (Citation Marker Text batch) so
  // an entry whose marker label collided with another's ("Karpathy n.d.-a"
  // vs. "-b") shows the same disambiguating suffix here, matching what a
  // reader saw on the marker that brought them to this entry.
  eleventyConfig.addFilter("groupedCitations", (citations) => {
    const sorted = Object.entries(citations || {})
      .map(([id, entry]) => ({ id, ...entry, markerSuffix: markerSuffix(citations, id) }))
      .sort((a, b) => String(a.authors).localeCompare(String(b.authors)));
    const groups = [];
    for (const entry of sorted) {
      const letter = String(entry.authors).trim().charAt(0).toUpperCase();
      const currentGroup = groups[groups.length - 1];
      if (!currentGroup || currentGroup.letter !== letter) {
        groups.push({ letter, entries: [entry] });
      } else {
        currentGroup.entries.push(entry);
      }
    }
    return groups;
  });

  // Splits a `links` array (see takeaction.yaml) down to just the entries
  // that carry a local preview `image` — used to render those as visual
  // preview cards separately from plain text links.
  eleventyConfig.addFilter("withImage", (links) => (links || []).filter((l) => l.image));
  // Plain-text links: no preview image AND not rendered as a full video
  // embed (see withEmbed) — those get their own treatment instead.
  eleventyConfig.addFilter("withoutImage", (links) => (links || []).filter((l) => !l.image && !l.embed_video_id));
  eleventyConfig.addFilter("withEmbed", (links) => (links || []).filter((l) => l.embed_video_id));

  // Privacy-enhanced YouTube embed: youtube-nocookie.com domain, no
  // autoplay (omitted from both the URL and the `allow` list, so it can't
  // be turned on by a stray query param either), native lazy-loading (no
  // JS needed — works with the site's JS-optional constraint), and a
  // required descriptive title for screen readers.
  eleventyConfig.addShortcode("youtubeEmbed", function (videoId, title) {
    const safeId = escapeHtml(videoId);
    const safeTitle = escapeHtml(title);
    return `<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/${safeId}" title="${safeTitle}" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
  });

  return {
    dir: {
      input: "content",
      includes: "../src/_includes",
      data: ".",
      output: "docs",
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};