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

## [2026-10-22] schema | me.md drafted
- New [[msk-me]] (draft): identity, current work, working preferences, off-limits areas; built from project hot caches and saved notes; unknowns left in [BRACKETS] for the user.
- Read first in every session: `CLAUDE.md`, `AGENTS.md` and [[msk-vault-map]] updated; lint checks it exists; [[brain-index]] Schema section. Hot cache refreshed.

## [2026-10-22] schema | me.md v2 from ChatGPT export (filtered)
- [[msk-me]] rewritten from a ChatGPT "about me" export. The ChatGPT account was shared by four people; the user confirmed groups A (web/LMS/AI dev), B (faceless content creator) and C (medical student) as theirs, discarded group D (Grade 3 teaching, photo/design jobs).
- Added: name (ShahZaib, goes by MSK), MBBS/UHS, content brands and courses, tools, language and coding-agent instruction format, MSK 15s+15s video rule, prompt defaults. Health details left out of the file. Export not stored in the vault (contains other people's data).
- Open [BRACKETS]: education conflict (BS CS note), which brands/plans are active, values, goals. Hot cache unchanged in substance.

## [2026-10-22] schema | me.md v3 (user corrections)
- [[msk-me]]: explain in Hinglish, deliverables in English; removed the coding-agent summary rule and the content/prompt rules (to be built from scratch); removed AKS Media, Monetics Lab, Monetics Media; no brand active, a new one starting soon; AI studio pending; TikTok prank channel removed (a separate automation project later); Germany study plan and the BS CS note removed (they were a friend's); values and goals later; health details skipped.
- Note: the v2 file never reached disk (copy tool delay); v3 written directly and verified by checksum.

## [2026-10-22] schema | me.md update skill
- New [[msk-skill-me-update]]: changes only on the user's request or confirmation (AI proposes new facts, never writes them silently); corrections remove the line fully; monthly review of stale lines, length and open items.
- Added to [[msk-skill-map]] (Identity); lint skill runs the review when due; `tools/wiki_lint.py` now reports me.md length and age (review due at 30 days). Scheduled reminder deferred by the user.

## [2026-10-22] schema | Portable vault and multi-computer sync
- Paths no longer contain the Windows username (vault map, kit, project CLAUDE.md files, AI Brain entity pages; dated records keep old paths as history).
- Moved inside the vault: `Documents\Pakistan Laws` → `Projects/Pakistan Legal Aid/raw/source-laws/` (25 files, checksum-verified); `Documents\.claude\launch.json` → `.claude/launch.json` (paths now vault-relative). hamzi-lms is to move to `Projects/AI Brain/projects/hamzi-lms` (user does the cut-paste); its CLAUDE.md and sync-project.ps1 already find AI Brain at `../..`.
- New `tools/msk-sync.ps1` (pull/push every repo), `tools/msk-setup-computer.ps1` (clone everything on a new computer); `finish-git-sync.ps1` now calls msk-sync. Skills: [[msk-skill-git-sync]] rewritten, new [[msk-skill-new-computer]]; vault map rule 9 updated. Hot cache refreshed.

## [2026-10-22] schema | Project renamed: AI Brain → Hamzi Prompts
- Folder `Projects/AI Brain` → `Projects/Hamzi Prompts`. Updated: [[msk-vault-map]] (rules 7, 9, table), [[msk-skill-git-sync]], [[msk-me]], `Projects/CLAUDE.md`, `.gitignore`, `tools/msk-sync.ps1`, `tools/msk-setup-computer.ps1`, [[brain-index]], hot cache; mentions in Prompts Website and Ubaid Automation; hamzi-lms CLAUDE.md, AGENTS.md and sync-project.ps1 (uncommitted, user to commit).
- Logs, raw files and dated test records keep "AI Brain" as history. GitHub repo name unchanged (`ai-brain-vault`). Hot cache refreshed.

## [2026-10-22] schema | Double-click sync and first push
- New `tools/MSK-SYNC-PULL.cmd` and `tools/MSK-SYNC-PUSH.cmd` (double-click wrappers for msk-sync.ps1); one-time `tools/MSK-FIRST-PUSH.cmd` moves hamzi-lms into `Projects/Hamzi Prompts/projects/`, commits its updated files and pushes every repo. [[msk-skill-git-sync]] updated.

## [2026-10-22] schema | SoniPrompts on GitHub; old outside copies removed
- SoniPrompts code repo now has remote `soni-prompts` (branch master); added to `tools/msk-setup-computer.ps1` and [[msk-skill-git-sync]]; [[msk-skill-new-computer]] no longer needs a USB copy of it.
- After re-verifying checksums, the files in `Documents\Pakistan Laws` and `Documents\.claude` were deleted at the user's request (single copy now inside the vault); `MSK-FIRST-PUSH.cmd` removes the empty folders.
