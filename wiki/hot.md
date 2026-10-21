---
type: hot-cache
updated: 2026-10-22
word_budget: 500
---
# Hot cache

The most important context in the vault, about 500 words. Read first every session; rewrite (don't append) after every ingest. Detail lives on the linked pages.

## What this vault is
MSK AI OS is the user's second brain, an Obsidian vault maintained by Claude on the LLM Wiki pattern. The user curates sources and asks questions; Claude reads, summarises, files and links. General knowledge goes in `wiki/`; work with its own rules lives in self-contained projects under `Projects/`, each with its own `CLAUDE.md`.

## How to work here
- Who the user is: [[msk-me]] (read first). Rules and layout: [[msk-vault-map]]. Procedures: [[msk-skill-map]] → one skill file per job in `AIOS/skills/`. `CLAUDE.md` and `AGENTS.md` are only pointers, so any AI tool can work here.
- For context about the user: hot.md → [[brain-index]] → linked pages. Read `wiki/` only, never `raw/`.
- New sources go in `raw/inbox/`; after ingest they move to `raw/sources/YYYY/`, never edited.
- Claims cite a source page; contradictions are recorded, not overwritten.
- Never mix projects; imported projects keep their own file names and are their own git repos.
- Timeline: [[brain-log]] · Big picture: [[brain-overview]].

## Current state of the main wiki
Set up 22 Oct 2026. No sources ingested yet; inbox empty.

## Active projects
- **Pakistan Legal Aid** ([[legal-hot|hot cache]]): verified law and forum wiki for drafting complaints to Pakistani bodies. Truth first, unknowns in [BRACKETS], statute text verbatim, currency checked before citing. 27 section pages (PECA, PPC, Qanun-e-Shahadat); forums NCCIA, police FIR / s.22-A, SMPRA. Gaps ([[legal-gaps]]): no Cr.P.C.; Constitution copy stops at 2017; PPC at Dec 2023.
- **AI OS Blueprint** ([[aios-hot|hot cache]]): Nick Milo's "AI OS" from 6 videos: link your own thinking as notes; own your knowledge and AI instructions as files (me.md, vault map, skill map, skills folder); rent the AI tool. Its [[aios-msk-adoption-plan]] gave this vault its AIOS layer; `me.md`, a personal-notes area and a Calendar layer are still open.
- **AI Brain** ([[Projects/AI Brain/wiki/hot|hot cache]]): Hamzi Prompts wiki (hamziprompts.com): AI-video prompt library, memberships, community, academy. Code: `Documents\hamzi-lms`.
- **Prompts Website** ([[Projects/Prompts Website/wiki/hot|hot cache]]): the general wiki from before MSK AI OS, plus the SoniPrompts / PromptsStudio rebuild (code in its `projects/soniprompts/`).
- **Ubaid Automation** ([[Projects/Ubaid Automation/wiki/hot|hot cache]]): Ubaidoo client-work wiki for the Ubaidoo Automation site and Academy LMS (code in its `projects/ubaidooautomation/`).

## Open threads
- GitHub push pending (needs Windows git login): msk-ai-os, AI Brain, Prompts Website, Ubaid Automation, the Ubaidoo code repo and hamzi-lms. Run `tools/finish-git-sync.ps1`. SoniPrompts code has no remote.
- Five new law files in `Documents\Pakistan Laws\md` await the user's go-ahead.
- AI OS adoption: user to fill the [BRACKETS] in [[msk-me]]; decide whether to add a Calendar/daily-brief layer and a personal-notes area.
- Optional Obsidian setting: Attachment folder path → `raw/assets`.

## Recently changed
- 22 Oct 2026: [[msk-me]] drafted, then rebuilt from a filtered ChatGPT export (user identity and working preferences, for any AI tool).
- 22 Oct 2026: root `CLAUDE.md` split into [[msk-vault-map]], [[msk-skill-map]] and 9 skill files; `AGENTS.md` added for other AI tools.
- 22 Oct 2026: AI OS Blueprint ingested video 6 (Obsidian masterclass); plan now suggests turning on Obsidian's auto-update internal links.
- 22 Oct 2026: new project AI OS Blueprint (5 videos summarised, 14 concepts, kit, adoption plan).
- 22 Oct 2026: MSK AI OS got its own private GitHub repo (imported projects and case files excluded).
