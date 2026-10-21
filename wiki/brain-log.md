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
