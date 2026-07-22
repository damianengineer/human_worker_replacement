const yaml = require("js-yaml");
const { HtmlBasePlugin } = require("@11ty/eleventy"); // Added for path prefixing

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "'");
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
    return {
      label: `${label} — source needed`,
      url: null,
      isTodo: true,
      isUnverified: false,
    };
  }
  if (entry.status === "unverified") {
    return {
      label: `${label} — unverified`,
      url: entry.url || null,
      isTodo: false,
      isUnverified: true,
    };
  }
  return { label, url: entry.url || null, isTodo: false, isUnverified: false };
}

module.exports = function (eleventyConfig) {
  // Enable automatic base path prefixing for URLs across compiled HTML
  eleventyConfig.addPlugin(HtmlBasePlugin); 

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

  eleventyConfig.addFilter("citeLink", function (citationId) {
    const citations = this.ctx.citations || {};
    const { label, url, isTodo, isUnverified } = lookupCitation(
      citations,
      citationId
    );
    const safeLabel = escapeHtml(label);
    if (isTodo) {
      return `<span class="citation citation--todo">${safeLabel}</span>`;
    }
    const cssClass = isUnverified ? "citation citation--unverified" : "citation";
    if (url) {
      return `<a class="${cssClass}" href="${escapeHtml(url)}">${safeLabel}</a>`;
    }
    return `<span class="${cssClass}">${safeLabel}</span>`;
  });

  eleventyConfig.addFilter("sortedCitations", (citations) => Object.entries(citations || {})
    .map(([id, entry]) => ({ id, ...entry }))
    .sort((a, b) => String(a.authors).localeCompare(String(b.authors)))
  );

  // Splits a `links` array (see takeaction.yaml) down to just the entries
  // that carry a local preview `image` — used to render those as visual
  // preview cards separately from plain text links.
  eleventyConfig.addFilter("withImage", (links) => (links || []).filter((l) => l.image));
  eleventyConfig.addFilter("withoutImage", (links) => (links || []).filter((l) => !l.image));

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