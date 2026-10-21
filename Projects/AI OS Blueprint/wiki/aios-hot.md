---
type: hot-cache
updated: 2026-10-22
word_budget: 500
---
# AI OS Blueprint: hot cache

The most important context for this project, about 500 words. Read it right after `CLAUDE.md`, then [[aios-index]]. Rewrite it in full after every ingest, lint, schema change or applied adoption step. It only summarises what the pages here say.

## What this project is
A wiki of the "AI OS" system [[nick-milo]] explains in five YouTube videos, plus a starter kit and a plan for applying it to MSK AI OS. Lives at `Projects/AI OS Blueprint/`. Videos are recorded in `raw/videos/` (no verbatim transcripts); summaries are the `src-2026-10-22-nm-*` pages. Full picture: [[aios-system-overview]].

## The system in brief
- **Principle:** [[aios-file-over-ai]]: own your knowledge, instructions and skills as plain files; rent the AI tool.
- **Three layers** ([[aios-three-layers]]): Ideaverse (notes in [[aios-ace-framework]] folders: Atlas, Calendar, Efforts, plus `+`) → maps and manuals in an `AIOS` folder → swappable tools ([[aios-claude-cowork]] today).
- **Three core files:** [[aios-me-md]] (who I am, how to work with me; 50-80 lines; rarely changes), [[aios-vault-map]] (what's where and how to create notes; changes with structure), [[aios-skill-map]] (every skill and when to use it). Tool files like `CLAUDE.md` only point to `me.md`.
- **Skills are markdown files** stored in the vault, not in the tool ([[aios-skills-as-files]]); can be scheduled. Grouped into [[aios-skill-systems]]: Auto Builder, Daily Trident (daily brief + log), Sherpa, Weekly Review, Rock Tumbler, Chronicler, Janitor, Courier.
- **Each session** starts with a fixed loading prompt ([[aios-session-start-prompt]]).
- **Hygiene** ([[aios-ai-content-hygiene]]): AI output separated and marked, personal areas excluded, backups, human judgement leads. Model rule: mid-tier by default, top tier for synthesis ([[aios-model-choice]]).
- **Groundwork:** [[aios-big-clean]] and the [[aios-plus-folder]]. Optional look: [[aios-soft-paper-setup]].

## How the thinking evolved
Video 2 put personal context in Claude's settings and skills in Claude's library; videos 3-4 moved both into the user's own files. Recorded under Contradictions on [[aios-me-md]] and [[aios-skills-as-files]].

## Applying it to MSK AI OS
[[aios-msk-adoption-plan]] (proposal, nothing applied). MSK AI OS already matches much of it: plain files plus git, `CLAUDE.md` + `brain-index` as vault map, `Projects/` as Efforts, `raw/inbox/` as `+`, lint as Janitor. Gaps: no `me.md`, everything addressed to Claude, no skill files or skill map, no session prompt, no Calendar area, no home for the user's own notes. Suggested first move: an `AIOS/` folder with `msk-me`, `msk-vault-map`, `msk-skill-map`, `skills/`, and a pointer line at the top of the root `CLAUDE.md`. Templates in `kit/`.

## Open threads
- User decisions: what goes in `me.md` (preferences only, or identity too); support other tools now (`AGENTS.md`) or later; whether to add a Calendar/daily-brief layer.
- The `X` folder in ACE isn't explained in these videos.

## Recently changed
- 22 Oct 2026: project created; 5 videos summarised; 14 concepts, systems page, 3 entities, adoption plan, 6 kit templates, transcript tool.
