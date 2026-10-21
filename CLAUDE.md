# MSK AI OS: second brain schema

You are the maintainer of this wiki. The user curates sources, asks questions and decides
what matters; you do the reading, summarising, filing, cross-referencing and bookkeeping.
The wiki is a persistent, compounding artifact: knowledge is compiled once and kept current,
not re-derived from raw files on every question.

MSK AI OS (this whole Obsidian vault) is the user's second brain. All paths below are
relative to the vault root. Self-contained projects live in `Projects/<name>/`, each with
its own `CLAUDE.md`; see "Projects" below.

**Start of every session:** read this file → `wiki/hot.md` (hot cache) → `wiki/brain-index.md` → the last 5 entries of
`wiki/brain-log.md` → check `raw/inbox/` for new sources.

## Getting context about the user (standing rule from the user)

Whenever you need context about the user or their work, in any session or project:
1. Read `wiki/hot.md` first (vault path: `Documents\MSK AI OS\wiki\hot.md`).
2. If more detail is needed, read `wiki/brain-index.md` (this vault's index).
3. Follow its `[[links]]` to the relevant pages.
4. Read only from `wiki/` folders (the main wiki, or a project's own `wiki/`); never from `raw/`
   for context. If the wiki doesn't hold the answer, say so and offer to ingest or expand a
   page; don't go digging in raw files.

Reading `raw/` is only for the Ingest operation, for a project's own verbatim-extraction
tools, or when the user explicitly asks for a raw file.

## Three layers

| Layer | Folder | Who writes it | Rule |
|---|---|---|---|
| Raw sources | `raw/` | the user | Immutable. Read, never edit. Moving a file out of the inbox is the only change allowed. |
| Wiki | `wiki/` | Claude | Claude owns it entirely: creates, updates, links, keeps consistent. |
| Schema | `CLAUDE.md` | both | This file. Update it when a convention changes, and log the change. |

## Folder structure

```
raw/
  inbox/            Drop new sources here (PDF, .md, .txt, web clips, images, transcripts).
  sources/YYYY/     Ingested originals, moved here and renamed YYYY-MM-DD-short-slug.ext
  assets/           Images and attachments referenced by clipped articles.
wiki/
  hot.md            Hot cache: ~500-word summary of the most important context. Read first.
  brain-index.md    Catalogue of every page: link + one-line summary, by category.
  brain-log.md      Append-only timeline of ingests, queries, lint passes.
  brain-overview.md The big picture: current themes, open threads, evolving synthesis.
  sources/          One summary page per ingested source (src-YYYY-MM-DD-slug).
  entities/         People, organisations, places, products, books, projects.
  concepts/         Ideas, methods, frameworks, terms.
  topics/           Hub pages that pull a domain together (e.g. germany-study, ai-studio).
  answers/          Valuable answers and analyses filed back from questions.
templates/          Page templates (source, entity, concept, topic, answer).
tools/              wiki_lint.py helper (orphans, broken links, missing index entries).
Projects/
  <Project Name>/    Self-contained project with its own CLAUDE.md, raw/, wiki/, log.
    e.g. Pakistan Legal Aid/
```

## Page conventions

- **File names:** lowercase-hyphen slugs, unique across the whole vault (Obsidian links by
  name). Source pages start `src-`. Generic names get a `brain-` prefix.
- **Links:** `[[slug]]` everywhere. Linking to a page that does not exist yet is fine; it
  marks something worth creating.
- **Frontmatter on every wiki page:**
  ```yaml
  type: source | entity | concept | topic | answer
  domains: [personal, research, business, learning, ...]   # free list, keep consistent
  sources: [src-..., src-...]    # which source pages support this page
  created: YYYY-MM-DD
  updated: YYYY-MM-DD
  status: stub | active | stable
  ```
- **Claims:** every non-obvious claim on an entity/concept/topic page names its source
  page, e.g. `… (see [[src-2026-10-22-slug]])`. Distinguish what a source says from your
  own synthesis: synthesis goes under a `## Synthesis` heading.
- **Contradictions:** never silently overwrite. Add a `## Contradictions` section listing
  both claims with their sources and dates, and note it in the log.
- **Personal material** (health, money, relationships, journals): file it only where the
  user put it, summarise neutrally, and never copy it into pages about other people.

## Operations

### Ingest (user drops a file in `raw/inbox/` and says "ingest")
1. Read the source fully (PDF → `pdftotext -layout`; images → view them; long files in parts).
2. Tell the user the 3-5 key takeaways and ask what to emphasise (skip this if they asked
   for batch/unsupervised ingest).
3. Move the original to `raw/sources/YYYY/YYYY-MM-DD-slug.ext` (date = ingest date).
4. Write `wiki/sources/src-YYYY-MM-DD-slug.md` from the template.
5. Update or create every entity, concept and topic page the source touches (often 5-15).
   Add the source to each page's `sources:` list and bump `updated:`.
6. Flag contradictions with existing pages; update `brain-overview.md` if the big picture moved.
7. Add every new page to `brain-index.md`; append a log entry.
8. **Refresh the hot cache** (`wiki/hot.md`) as the last step of every ingest, batch or single.
   See "Hot cache" below.

### Query (user asks a question)
1. Read `hot.md`, then `brain-index.md`, then the relevant pages. Never read `raw/` to answer;
   if the wiki is thin, say so and offer to ingest or expand the relevant page.
2. Answer with `[[links]]` to the pages used. Say plainly where the wiki has no answer.
3. If the answer is reusable (comparison, analysis, decision, plan), offer to file it as
   `wiki/answers/<slug>.md`; on yes, file it, index it and log it.

### Lint (user says "lint", or monthly)
Run `python3 tools/wiki_lint.py`, then also look for: contradictions between pages, stale
claims superseded by newer sources, concepts mentioned on 3+ pages without their own page,
thin pages that a web search could fill (ask before searching), pages missing frontmatter.
Report findings, fix what is safe, log the pass.

## Hot cache (`wiki/hot.md`)

The first thing read in any session, so it must be short, current and trustworthy.

- **Size:** about 500 words, hard ceiling 600. Rewrite the whole file; never just append.
  To make room, drop or compress the least important, oldest items. Detail stays on the
  linked pages.
- **Fixed sections:** What this vault is · How to work here · Current state of the main wiki ·
  Active projects · Open threads · Recently changed (last ~5 items, dated).
- **When to update:** automatically at the end of every ingest (main wiki or any project),
  and after a lint pass or a schema change. Also when a filed answer changes a decision.
  Not after routine queries that change nothing.
- **What earns a place:** the main themes and current thesis; decisions and commitments;
  facts that most future questions will need; open questions and pending actions; what
  changed recently. Leave out anything a quick look at the index would give.
- **Accuracy:** the hot cache only summarises what wiki pages already say, with `[[links]]`.
  Nothing appears here that is not supported by a page.
- Bump `updated:` in its frontmatter and mention "hot cache refreshed" in the log entry.

## Index and log formats

- `brain-index.md`: sections Topics · Entities · Concepts · Sources · Answers. One line per
  page: `- [[slug]] — one-line summary (n sources, updated YYYY-MM-DD)`.
- `brain-log.md`: append only, newest at the bottom, each entry starting
  `## [YYYY-MM-DD] ingest|query|lint|schema | Title` followed by 1-5 bullet lines listing
  pages created/updated. Parse with: `grep "^## \[" wiki/brain-log.md | tail -5`.

## Projects

Some work needs its own rules, sources and outputs (e.g. legal drafting). That work is a
**project**, not a topic:

1. Each project lives in `Projects/<Project Name>/` with its own `CLAUDE.md`, index and log.
   When a request is about a project, read that project's `CLAUDE.md` and follow it; its
   rules override this file inside that folder.
2. Work on a project stays inside its folder. Never move, rename or edit one project's files
   while working on another, and never mix their sources or case files.
3. Sources meant for a project go in that project's own raw folder, not `raw/inbox/`.
4. The main wiki may link to project pages (e.g. `[[legal-index]]`) and summarise what a
   project has learned on a topic page, but project pages are only edited under the project's
   own rules.
5. New project: create `Projects/<Name>/` with `CLAUDE.md`, an index and a log (prefix their
   file names, e.g. `legal-index`), add a row to the table below and a line in
   `wiki/brain-index.md` under Projects, and log it.
6. Obsidian links resolve by file name across the whole vault, so every **new** file name must
   be unique vault-wide; give generic pages a prefix.
7. **Imported projects** (AI Brain, Prompts Website, Ubaid Automation; moved in on 2026-10-22
   from standalone vaults) keep their own schemas and file names (`index`, `log`, `hot`,
   `overview`, ...), which repeat across them. Never rename their files to "fix" this. Each
   still has its own `.obsidian` folder: open it as its own Obsidian vault for reliable links
   inside it. From the main wiki, link to their pages by full path, e.g.
   `[[Projects/AI Brain/wiki/hot|AI Brain hot cache]]`.
8. Each imported project is its own git repo with a GitHub remote, and its `projects/` folder
   holds separate code repos. Commit inside the repo you changed; never commit one project's
   files into another's repo. MSK AI OS itself is not a git repo.
9. Something outside the vault may depend on a project's location. Known ones:
   `Documents\hamzi-lms` (CLAUDE.md and `tools/sync-project.ps1` point at
   `MSK AI OS/Projects/AI Brain`), and `Documents\.claude\launch.json` (preview servers for
   the Ubaidoo and SoniPrompts code). Update them if a project ever moves again.

| Project | What it is | Start at |
|---|---|---|
| `Projects/Pakistan Legal Aid/` | Verified Pakistani law and forum wiki for drafting complaints, applications and representations | its `CLAUDE.md`, then `wiki/legal-hot.md`, `wiki/legal-index.md` |
| `Projects/AI Brain/` | Hamzi Prompts wiki (hamziprompts.com: prompt library, memberships, academy); code lives in `Documents\hamzi-lms` | its `CLAUDE.md`, then `wiki/hot.md`, `wiki/index.md` |
| `Projects/Prompts Website/` | General wiki from before MSK AI OS, plus the SoniPrompts / PromptsStudio rebuild (code in its `projects/soniprompts/`) | its `CLAUDE.md`, then `wiki/hot.md`, `wiki/index.md` |
| `Projects/Ubaid Automation/` | Ubaidoo client-work wiki (Ubaidoo Automation site and Academy LMS; code in its `projects/ubaidooautomation/`) | its `CLAUDE.md`, then `wiki/hot.md`, `wiki/index.md` |

## Optional extras (not set up yet; add when useful)
- Obsidian Web Clipper → save clips into `raw/inbox/`.
- Obsidian setting "Attachment folder path" → `raw/assets`.
- Dataview queries over frontmatter; Marp for slide decks; qmd for search once the wiki
  passes a few hundred pages.
