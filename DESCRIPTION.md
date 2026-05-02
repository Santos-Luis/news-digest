# News Digest

News Digest is a personal static archive for daily AI-generated news digests.

The project is designed around a simple workflow: a scheduled command generates one Markdown file per day, and Astro turns those files into a browsable archive. Each digest file is one article page, named by date:

```text
src/digests/2026-05-02.md
```

The Markdown files are intentionally plain. They do not need frontmatter. The site derives the article route and date from the filename, and uses the first non-empty line of the Markdown file as the display title.

## Intention

The goal is to keep a personal, durable record of daily news that is easier to revisit than a stream of Telegram messages or one-off generated files.

The homepage highlights the latest digest first, then shows a reverse-chronological archive with month filtering. Each digest has its own permanent page, making the archive suitable for GitHub Pages or another static host.

## Project Shape

- `src/digests/` contains generated daily Markdown digests.
- `src/pages/` defines the homepage and per-digest routes.
- `src/content.config.ts` configures the Astro content collection.
- `src/lib/digests.ts` derives dates, titles, excerpts, and archive metadata from digest files.
- `generator/` stores the prompt and topic inputs used by the scheduled digest generation command.

## Generation Context

The intended generation command is similar to:

```shell
codex exec --sandbox read-only --ephemeral -o src/digests/2026-05-02.md "$(cat generator/digest.md)"
```

The prompt reads `generator/topics.md`, finds recent developments for each topic, and outputs a compact daily digest in Markdown. The output format is expected to start with a title line like:

```text
📅 Daily Digest — May 2, 2026
```

## Design Notes

The visual direction is a calm personal newspaper/archive: readable, content-first, and lightweight. The site avoids a CMS, database, or search index for now; Markdown files are the source of truth.
