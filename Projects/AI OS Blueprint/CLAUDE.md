# AI OS Blueprint: project schema (inside MSK AI OS)

This project is a wiki of the **AI OS** system Nick Milo (Linking Your Thinking) explains
across five YouTube videos: an Obsidian "Ideaverse" (ACE folders), a portable translation
layer of maps and manuals (`me.md`, vault map, skill map, skills folder) and swappable AI
tools (Claude Cowork today). It holds what the videos say, Claude's synthesis, a starter kit
of templates, and a plan for applying the system to MSK AI OS itself.

This project lives in `MSK AI OS/Projects/AI OS Blueprint/`; all paths below are relative to
that folder and nothing here is written outside it, except the registration lines and hot
cache paragraph the root `CLAUDE.md` asks for.

**Read order every session:** this file → `wiki/aios-hot.md` → `wiki/aios-index.md` → the
last 5 entries of `wiki/aios-log.md`.

## Prime rules

1. **Sources first.** Every non-obvious claim about the system names its source page,
   e.g. `(see [[src-2026-10-22-nm-3-file-ai-system]])`. Claude's own reasoning goes under a
   `## Synthesis` heading, never mixed into "what the sources say".
2. **Contradictions are recorded, not smoothed over.** The videos were made months apart and
   the system evolved (e.g. where skills and personal context live). List both claims with
   their sources under `## Contradictions`.
3. **No verbatim transcripts.** Videos are copyrighted. `raw/videos/` holds a record per
   video (URL, title, channel, retrieval date); wiki pages summarise in our own words, with
   at most a short quoted phrase where the exact wording matters.
4. **Kit files are drafts, not the user's identity.** `kit/` templates are built from what the
   videos describe. They become real only when the user fills them in or says to apply them.
5. **Don't change MSK AI OS from here.** The adoption plan
   ([[aios-msk-adoption-plan]]) is a proposal. Changes to the vault root, other projects or
   the root schema happen only when the user says so, and then under the root `CLAUDE.md`.
6. **Personal data stays out.** If the user later fills `me.md` or a dossier with personal
   material, keep it in the place they choose and never copy it into other projects.

## Layout

```
raw/videos/          One immutable record per video (URL, title, channel, retrieved date).
wiki/aios-hot.md     Hot cache: ~500 words (ceiling 600). Read first.
wiki/aios-index.md   Catalogue of every page with a one-line summary.
wiki/aios-log.md     Append-only history: "## [YYYY-MM-DD] op | Title".
wiki/sources/        One page per video: src-YYYY-MM-DD-nm-<slug>.
wiki/topics/         Hub pages (aios-system-overview).
wiki/concepts/       Ideas and methods (three layers, ACE, me.md, vault map, skills ...).
wiki/systems/        The skill systems (daily trident, sherpa, rock tumbler, janitor ...).
wiki/entities/       People, products, tools.
wiki/answers/        Filed analyses (aios-msk-adoption-plan).
kit/                 Starter templates: me.md, vault map, skill map, skill, CLAUDE.md
                     pointer, session-start prompt.
tools/               aios-yt-transcript.js (reads a YouTube transcript in the built-in browser).
```

## Page conventions

- File names: lowercase-hyphen slugs, unique across the whole vault. Everything here starts
  `aios-` except source pages (`src-...`) and the person page `nick-milo`.
- Frontmatter on every wiki page (same keys as the root schema): `type`, `domains`,
  `sources`, `created`, `updated`, `status` (`stub | active | stable`).
- Link with `[[slug]]`; a link to a page that does not exist yet marks a gap.
- Note which video a fact comes from; later videos can supersede earlier ones.

## Operations

**Ingest a new video or article.**
1. Get the text. For YouTube: open the video in the built-in browser and run
   `tools/aios-yt-transcript.js` (instructions inside it). Read it fully.
2. Give the user 3-5 key takeaways (skip for batch ingest).
3. Write `raw/videos/YYYY-MM-DD-nm-<slug>.md` (record only, no transcript).
4. Write `wiki/sources/src-YYYY-MM-DD-nm-<slug>.md` from the root `templates/source.md`.
5. Update every concept, system, entity and topic page it touches; add the source to each
   page's `sources:` and bump `updated:`. Record contradictions.
6. Update `aios-index`, append to `aios-log`, rewrite `aios-hot` in full.
7. Refresh the vault hot cache (`../../wiki/hot.md`): this project's paragraph only, plus a
   dated line under "Recently changed". Commit in the msk-ai-os repo.

**Query.** Read hot → index → relevant pages; answer with `[[links]]`. Reusable answers go
to `wiki/answers/` when the user agrees.

**Apply to MSK AI OS.** Only on the user's go-ahead. Work from
[[aios-msk-adoption-plan]], one step at a time, logging each step here and in the root
`brain-log`.

**Lint.** Run `python3 tools/wiki_lint.py` from the vault root, then check this project for
orphans, missing frontmatter, uncited claims and stale contradictions. Fix what is safe, log
it, rewrite the hot cache.

## Hot cache (`wiki/aios-hot.md`)

About 500 words, ceiling 600, rewritten in full after every ingest, lint, schema change or
applied adoption step. Only summarises what the pages here say. Sections: What this project
is · The system in brief · What's in the wiki · Open threads · Recently changed.

## Git

This project has no repo of its own; it is tracked by MSK AI OS's repo
(`chatgptgopcworld-spec/msk-ai-os`, branch `main`). Commit there after changes; pushes run on
Windows (`tools/finish-git-sync.ps1` at the vault root).
