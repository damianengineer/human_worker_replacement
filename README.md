# AI & Your First Job

A static informational site (built with [Eleventy](https://www.11ty.dev/))
about AI's effect on entry-level jobs, aimed at community college students.
See [CLAUDE.md](CLAUDE.md) for the full editorial and technical spec.

## Editing copy

All page text lives under [content/](content/) as Markdown (`.md`) or
structured data (`.yaml`). You don't need to touch anything under `src/` to
change what a page says.

- `content/site.yaml` — site title and nav labels.
- `content/citations.yaml` — sources, keyed by citation ID.
- `content/glossary.md` — glossary page intro text.
- `content/glossary.yaml` — the glossary term list.

## Local development

Requires Node.js 18+.

```sh
npm install
npm run serve   # builds and serves at http://localhost:8080 with live reload
npm run build   # one-off production build to _site/
```

## Project structure

See CLAUDE.md Section 4 for the full repository layout and the reasoning
behind it (content/templates/styles kept in separate directories).

