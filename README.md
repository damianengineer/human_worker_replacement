# AI & Your Job

A static informational site (built with [Eleventy](https://www.11ty.dev/))
about AI's effect on entry-level jobs, aimed at community college students.
See [CLAUDE.md](CLAUDE.md) for the full editorial and technical spec.

## Editing copy

All page text lives under [content/](content/) as Markdown (`.md`) or
structured data (`.yaml`). You don't need to touch anything under `src/` to
change what a page says.

- `content/site.yaml` — site title, the two-tier nav (top nav + the "On
  this page" pills each page opts into via its own `sections` frontmatter),
  footer sitemap, and the prev/next "journey" order.
- `content/citations.yaml` — sources, keyed by citation ID. `content/references.md`
  (the References page) is rendered from this file, not hand-edited per entry.
- `content/index.md` / `content/home.yaml` — the landing page (served at `/`).
- `content/glossary.md` / `content/glossary.yaml` — the glossary page and its term list.
- `content/the-evidence.md` / `content/evidence.yaml`, `content/history.md` / `content/history.yaml`,
  `content/take-action.md` / `content/takeaction.yaml` — same intro-text/structured-data split for
  each of those pages.
- `content/about.md`, `content/ai-disclosure.md` / `content/aidisclosure.yaml` — About and AI
  Disclosure pages; `aidisclosure.yaml` is a running work log, appended to, not rewritten.

See `QA-CHECKLIST.md` at the repo root for the running list of checks that
need a real browser/phone/screen reader to verify (this environment has
none of those, so every batch of changes leaves its visual checks there
for a human to run before merging).

## Local development

Requires Node.js 18+.

```sh
npm install
npm run serve   # builds and serves with live reload
npm run build   # one-off production build to docs/
```

`npm run serve` bakes in the `--pathprefix` this repo's GitHub Pages URL
needs, so the site is actually live at
**http://localhost:8080/human_worker_replacement/** — the bare
`http://localhost:8080/` redirects there.

## Deploying

GitHub Pages serves this site from the `docs/` folder on `main` (Settings →
Pages → Deploy from a branch) — there's no CI-based deploy. To publish a
change: merge to `main`, run `npm run build`, then commit and push the
updated `docs/` output. The build script bakes in the `--pathprefix` this
repo's GitHub Pages URL needs; don't drop that flag when running Eleventy
directly.

## Project structure

See CLAUDE.md Section 4 for the full repository layout and the reasoning
behind it (content/templates/styles kept in separate directories).

