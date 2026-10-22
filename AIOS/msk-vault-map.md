---
type: schema
role: vault-map
created: 2026-10-22
updated: 2026-10-22
---
# MSK AI OS: vault map

The master table of contents and manual for this vault, written for **any** AI tool (Claude,
Codex, Gemini, a local model) and for the user. It holds the rules, the layout and the
conventions. *How* to carry out each job lives in skill files: see [[msk-skill-map]].

All paths are relative to the vault root: `Documents\MSK AI OS` in the current Windows user's profile (`%USERPROFILE%\Documents\MSK AI OS`), the same on every computer. Never hard-code a Windows username.

**Start of every session:** [[msk-me]] (who the user is) → this file → [[msk-skill-map]] → `wiki/hot.md` → `wiki/brain-index.md`
→ the last 5 entries of `wiki/brain-log.md` → check `raw/inbox/` for new sources.
Tool pointer files (`CLAUDE.md`, `AGENTS.md`) only send you here.

## 1. What this vault is, and roles

MSK AI OS (this whole Obsidian vault) is the user's second brain, run on the LLM Wiki pattern.
The user curates sources, asks questions and decides what matters; the AI does the reading,
summarising, filing, cross-referencing and bookkeeping. The wiki is a persistent, compounding
artifact: knowledge is compiled once and kept current, not re-derived from raw files on every
question. Self-contained projects live in `Projects/<name>/`, each with its own `CLAUDE.md`.

## 2. Rules that never bend

1. **`raw/` is immutable.** Read it, never edit it. Moving a file out of `raw/inbox/` during
   ingest is the only change allowed.
2. **Context comes from the wiki, never from `raw/`** (standing rule from the user). For context
   about the user or their work, in any session or project: read `wiki/hot.md` first, then
   `wiki/brain-index.md` if more detail is needed, then follow its `[[links]]`. Read only from
   `wiki/` folders (the main wiki, or a project's own `wiki/`). If the wiki doesn't hold the
   answer, say so and offer to ingest or expand a page; don't go digging in raw files.
   Reading `raw/` is only for ingest, for a project's own verbatim-extraction tools, or when the
   user explicitly asks for a raw file.
3. **Projects never mix.** Work on a project stays inside its folder; never move, rename or edit
   one project's files while working on another, and never mix their sources or case files.
   Inside a project folder, that project's `CLAUDE.md` overrides this map.
4. **Sources are cited and contradictions recorded,** never silently overwritten (section 5).
5. **Personal data stays where the user put it** (section 5, and the git rules in section 6).
6. **One source of truth.** A rule lives here; a procedure lives in one skill file. Don't copy
   either into `CLAUDE.md`, `AGENTS.md` or another file; link instead.

## 3. Layers and layout

| Layer | Folder | Who writes it | Rule |
|---|---|---|---|
| Raw sources | `raw/` | the user | Immutable (rule 1). |
| Wiki | `wiki/` | the AI | The AI owns it entirely: creates, updates, links, keeps consistent. |
| Schema | `AIOS/` (me, this map, the skill map, skills) | both | Update when a convention changes, and log the change. |
| Tool pointers | `CLAUDE.md`, `AGENTS.md` | both | Pointer only: they send every tool to this map. |

```
AIOS/
  msk-me.md         Who the user is, how to work with them (read first; kept current by msk-skill-me-update).
  msk-vault-map.md  This file: rules, layout, conventions, projects.
  msk-skill-map.md  Every skill, when to use it, where its file is.
  skills/           One markdown file per procedure (msk-skill-*.md).
CLAUDE.md           Pointer for Claude.     AGENTS.md  Pointer for other AI tools.
.claude/launch.json Preview servers for website code (paths relative to the vault root).
raw/
  inbox/            Drop new sources here (PDF, .md, .txt, web clips, images, transcripts).
  sources/YYYY/     Ingested originals, moved here and renamed YYYY-MM-DD-short-slug.ext
  assets/           Images and attachments referenced by clipped articles.
wiki/
  hot.md            Hot cache: ~500-word summary of the most important context. Read first.
  brain-index.md    Catalogue of every page: link + one-line summary, by category.
  brain-log.md      Append-only timeline of ingests, queries, lint passes, schema changes.
  brain-overview.md The big picture: current themes, open threads, evolving synthesis.
  sources/          One summary page per ingested source (src-YYYY-MM-DD-slug).
  entities/         People, organisations, places, products, books, projects.
  concepts/         Ideas, methods, frameworks, terms.
  topics/           Hub pages that pull a domain together (e.g. germany-study, ai-studio).
  answers/          Valuable answers and analyses filed back from questions.
templates/          Page templates (source, entity, concept, topic, answer).
tools/              wiki_lint.py (health check), msk-sync.ps1 (pull/push all repos), msk-setup-computer.ps1 (new computer).
Projects/
  <Project Name>/   Self-contained project with its own CLAUDE.md, raw/, wiki/, log.
```

## 4. Hot cache, index and log (what they are)

- **Hot cache (`wiki/hot.md`)**: the first thing read in any session, so it must be short,
  current and trustworthy. About 500 words, hard ceiling 600, always rewritten in full. Fixed
  sections: What this vault is · How to work here · Current state of the main wiki · Active
  projects · Open threads · Recently changed (last ~5 items, dated). It only summarises what
  wiki pages already say, with `[[links]]`. Each project has its own prefixed hot cache.
  How and when to refresh: [[msk-skill-hot-cache]].
- **`brain-index.md`**: sections Hubs · Schema · Projects · Topics · Entities · Concepts ·
  Sources · Answers. One line per page: `- [[slug]] — one-line summary (n sources, updated YYYY-MM-DD)`.
- **`brain-log.md`**: append only, newest at the bottom, each entry starting
  `## [YYYY-MM-DD] ingest|query|lint|schema | Title` followed by 1-5 bullets listing pages
  created/updated. Last five entries: `grep "^## \[" wiki/brain-log.md | tail -5`.

## 5. Page conventions

- **File names:** lowercase-hyphen slugs, unique across the whole vault (Obsidian links by
  name). Source pages start `src-`. Generic names get a prefix (`brain-`, `legal-`, `aios-`, `msk-`).
- **Links:** `[[slug]]` everywhere. Linking to a page that does not exist yet is fine; it marks
  something worth creating.
- **Frontmatter on every wiki page:**
  ```yaml
  type: source | entity | concept | topic | answer
  domains: [personal, research, business, learning, ...]   # free list, keep consistent
  sources: [src-..., src-...]    # which source pages support this page
  created: YYYY-MM-DD
  updated: YYYY-MM-DD
  status: stub | active | stable
  ```
- **Claims:** every non-obvious claim on an entity/concept/topic page names its source page,
  e.g. `… (see [[src-2026-10-22-slug]])`. The AI's own reasoning goes under `## Synthesis`.
- **Contradictions:** never silently overwrite. Add a `## Contradictions` section listing both
  claims with their sources and dates, and note it in the log.
- **Personal material** (health, money, relationships, journals): file it only where the user
  put it, summarise neutrally, never copy it into pages about other people.

## 6. Projects

Some work needs its own rules, sources and outputs (e.g. legal drafting). That work is a
**project**, not a topic. (Rule numbers are kept from the old root `CLAUDE.md`, because other
files refer to "rules 7-9".)

1. Each project lives in `Projects/<Project Name>/` with its own `CLAUDE.md`, hot cache, index and
   log. When a request is about a project, read that project's `CLAUDE.md` and follow it; its
   rules override this map inside that folder.
2. Work on a project stays inside its folder (rule 3 in section 2).
3. Sources meant for a project go in that project's own raw folder, not `raw/inbox/`.
4. The main wiki may link to project pages (e.g. `[[legal-index]]`) and summarise what a project
   has learned on a topic page, but project pages are only edited under the project's own rules.
5. New project: follow [[msk-skill-new-project]].
6. Every **new** file name must be unique vault-wide; give generic pages a prefix.
7. **Imported projects** (Hamzi Prompts — named AI Brain until 2026-10-22, GitHub repo still `ai-brain-vault` — Prompts Website, Ubaid Automation; moved in on 2026-10-22 from
   standalone vaults) keep their own schemas and file names (`index`, `log`, `hot`, `overview`, ...),
   which repeat across them. Never rename their files to "fix" this. Each still has its own
   `.obsidian` folder: open it as its own Obsidian vault for reliable links inside it. From the
   main wiki, link to their pages by full path, e.g. `[[Projects/Hamzi Prompts/wiki/hot|Hamzi Prompts hot cache]]`.
8. Each imported project is its own git repo with a GitHub remote, and its `projects/` folder holds
   separate code repos. Commit inside the repo you changed; never commit one project's files into
   another's repo.
9. **Everything lives inside the vault** (since 2026-10-22), so copying or cloning the vault brings
   all of it: the Hamzi website/LMS code is `Projects/Hamzi Prompts/projects/hamzi-lms` (its own repo; its
   `CLAUDE.md` finds Hamzi Prompts at `../..`); the original law PDFs and verbatim .md are in
   `Projects/Pakistan Legal Aid/raw/source-laws/`; the LMS product code is `Projects/Learn Core/projects/monetics-learncore`
   (its `build.py` reads the Hamzi LMS source from `Projects/Hamzi Prompts/projects/hamzi-lms`); preview servers are in `.claude/launch.json`.
   If a project or code repo ever moves, update these paths and `tools/msk-sync.ps1`.
10. **MSK AI OS has its own git repo** (GitHub `chatgptgopcworld-spec/msk-ai-os`, private, branch
   `main`). It tracks the OS itself and projects without their own repo (Pakistan Legal Aid, AI OS
   Blueprint, Learn Core's wiki). `.gitignore` keeps out the imported projects (their own repos) and
   `Projects/Pakistan Legal Aid/cases/` (personal data; only its README is tracked). Any new
   project with its own repo gets a line in `.gitignore`; any folder holding personal data stays
   ignored. How to commit and push: [[msk-skill-git-sync]].

| Project | What it is | Start at |
|---|---|---|
| `Projects/Pakistan Legal Aid/` | Verified Pakistani law and forum wiki for drafting complaints, applications and representations | its `CLAUDE.md`, then `wiki/legal-hot.md`, `wiki/legal-index.md` |
| `Projects/Hamzi Prompts/` | Hamzi Prompts wiki (hamziprompts.com: prompt library, memberships, academy); code in its `projects/hamzi-lms/` | its `CLAUDE.md`, then `wiki/hot.md`, `wiki/index.md` |
| `Projects/Prompts Website/` | General wiki from before MSK AI OS, plus the SoniPrompts / PromptsStudio rebuild (code in its `projects/soniprompts/`) | its `CLAUDE.md`, then `wiki/hot.md`, `wiki/index.md` |
| `Projects/Ubaid Automation/` | Ubaidoo client-work wiki (Ubaidoo Automation site and Academy LMS; code in its `projects/ubaidooautomation/`) | its `CLAUDE.md`, then `wiki/hot.md`, `wiki/index.md` |
| `Projects/Learn Core/` | Monetics LearnCore, the reusable LMS product; code in its `projects/monetics-learncore/` | its `CLAUDE.md`, then `wiki/lc-hot.md`, `wiki/lc-index.md` |
| `Projects/AI OS Blueprint/` | Nick Milo's AI OS from 6 videos, starter kit, and the plan this map came from | its `CLAUDE.md`, then `wiki/aios-hot.md`, `wiki/aios-index.md` |

## 7. Current priorities

- Multi-computer use: run `tools/msk-sync.ps1 -Pull` before work and `-Push` after ([[msk-skill-git-sync]]); new computer: [[msk-skill-new-computer]].
- AI OS adoption ([[aios-msk-adoption-plan]]): vault map, skill map, skills and `AGENTS.md` done
  2026-10-22; `msk-me.md` drafted 2026-10-22 (user to fill the [BRACKETS]); still open: a personal-notes area, Calendar/daily brief,
  (Obsidian "automatically update internal links" is on since 2026-10-22).
- Pakistan Legal Aid: five new law files await the user's go-ahead.

## 8. Optional extras (not set up yet; add when useful)

- Obsidian Web Clipper → save clips into `raw/inbox/`.
- Obsidian setting "Attachment folder path" → `raw/assets`.
- Dataview queries over frontmatter; Marp for slide decks; qmd for search once the wiki passes a
  few hundred pages.
