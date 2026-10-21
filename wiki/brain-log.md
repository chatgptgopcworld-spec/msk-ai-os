# MSK AI OS: log

## [2026-10-22] schema | Second Brain created
- Set up from the "LLM Wiki" idea file as the vault's second brain.
- Created `CLAUDE.md` schema, `raw/` (inbox, sources, assets), `wiki/` (sources, entities, concepts, topics, answers), index, overview, log, 5 templates, `tools/wiki_lint.py`.

## [2026-10-22] schema | Whole vault is the second brain
- Moved schema, raw/, wiki/, templates/, tools/ to the vault root; MSK AI OS itself is the second brain.
- Projects now live under `Projects/`; Pakistan Legal Aid moved to `Projects/Pakistan Legal Aid/` and linked from the index.

## [2026-10-22] schema | Hot cache added
- Created `wiki/hot.md` (~500-word summary of the most important context); read first every session.
- Schema: ingest step 8 refreshes the hot cache; new "Hot cache" section with size, sections and update rules. Legal project's ingest step also refreshes its paragraph.
- Lint now reports hot-cache word count. Hot cache refreshed.

## [2026-10-22] schema | Context-lookup rule
- User's standing rule added to `CLAUDE.md`: for context about the user, read hot.md → brain-index.md → linked pages, from `wiki/` only, never `raw/`.
- Query operation updated to match (no reading raw to answer). Hot cache refreshed.

## [2026-10-22] schema | Existing vaults brought in as projects
- Found 4 Obsidian vaults in Documents. Moved AI Brain, Prompts Website and Ubaid Automation into `Projects/` (4,387 files and folders, verified identical). Studio 404 (empty) left out on the user's instruction.
- Before the move, committed their pending work; after it, updated each one's CLAUDE.md, hot cache and log with the new location and committed. Pushing to GitHub runs from Windows.
- Updated outside references: `Documents\.claude\launch.json` and `Documents\hamzi-lms` (CLAUDE.md, tools/sync-project.ps1).
- Root CLAUDE.md: project table plus rules 7-9 for imported projects; Projects/CLAUDE.md and brain-index updated; lint made path-link aware and skips code folders. Hot cache refreshed.

## [2026-10-22] schema | Pakistan Legal Aid hot cache
- Added `Projects/Pakistan Legal Aid/wiki/legal-hot.md`; every project now has its own CLAUDE.md, hot cache, index and log.
- Root CLAUDE.md table, Projects/CLAUDE.md, brain-index and hot cache now point to it. Hot cache refreshed.

## [2026-10-22] schema | MSK AI OS git repo
- `git init` (branch main), remote https://github.com/chatgptgopcworld-spec/msk-ai-os (private). First commit: 83 files (schema, main wiki, templates, tools, Pakistan Legal Aid).
- `.gitignore` excludes the three imported projects (own repos), Pakistan Legal Aid `cases/` except its README, Obsidian workspace state and Python caches.
- Root CLAUDE.md rule 10 added; push script now includes this repo. Hot cache refreshed.

## [2026-10-22] schema | New project: AI OS Blueprint
- Created `Projects/AI OS Blueprint/` from 5 Nick Milo (Linking Your Thinking) videos: `CLAUDE.md`, [[aios-hot]], [[aios-index]], [[aios-log]], 5 source pages, 14 concept pages, skill-systems page, 3 entities, [[aios-msk-adoption-plan]], 6 kit templates, transcript tool.
- Added to the root `CLAUDE.md` project table, `Projects/CLAUDE.md`, [[brain-index]] (Projects) and [[brain-overview]] (open threads).
- No changes to other projects. Adoption plan is a proposal only. Hot cache refreshed.

## [2026-10-22] ingest | AI OS Blueprint: video 6 (Obsidian Masterclass)
- Project ingest under its own rules: [[src-2026-10-22-nm-obsidian-masterclass]], new [[aios-obsidian-basics]] and [[aios-linking-your-thinking]], 8 pages updated; see [[aios-log]].
- Hot cache refreshed (project paragraph and Recently changed).

## [2026-10-22] schema | Vault map, skill map, skills and AGENTS.md (CLAUDE.md fully split)
- New `AIOS/` layer: [[msk-vault-map]] (all rules, layout, conventions, projects, from the old root `CLAUDE.md`), [[msk-skill-map]], 9 skills in `AIOS/skills/` (context-lookup, ingest, hot-cache, lint, new-project, import-project, file-answer, git-sync, yt-transcript).
- Root `CLAUDE.md` is now a pointer (with a map of where old "root CLAUDE.md" rules moved); new `AGENTS.md` pointer for other AI tools. Checked line by line that no rule was lost.
- `Projects/CLAUDE.md` now points to the vault map; `tools/wiki_lint.py` checks the AIOS layer; [[brain-index]] gained a Schema section; [[brain-overview]] updated. Other projects untouched.
- Applied steps 1 (partly: no me.md yet), 3, 4 and 5 of [[aios-msk-adoption-plan]]. Hot cache refreshed.
