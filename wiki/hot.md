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
- For context about the user: hot.md → [[brain-index]] → linked pages. Read `wiki/` only, never `raw/`.
- New sources go in `raw/inbox/`; after ingest they move to `raw/sources/YYYY/`, never edited.
- Claims cite a source page; contradictions are recorded, not overwritten.
- Each project is touched only under its own rules; never mix projects. Imported projects keep their own file names and are git repos: commit inside the repo you changed.
- Timeline: [[brain-log]] · Big picture: [[brain-overview]].

## Current state of the main wiki
Set up 22 Oct 2026. No sources ingested yet; inbox empty.

## Active projects
- **Pakistan Legal Aid** ([[legal-hot|hot cache]]): verified law and forum wiki for drafting complaints to Pakistani bodies. Truth first, unknowns in [BRACKETS], statute text copied verbatim, currency checked before citing. 27 section pages (PECA, PPC, Qanun-e-Shahadat); forum pages for NCCIA, police FIR / s.22-A and SMPRA. Gaps ([[legal-gaps]]): no Cr.P.C.; Constitution copy stops at 2017; PPC copy at Dec 2023. PECA offences go to NCCIA (complaint.nccia.gov.pk, 1799).
- **AI Brain** ([[Projects/AI Brain/wiki/hot|hot cache]]): wiki for Hamzi Prompts (hamziprompts.com), a premium AI-video prompt library with paid memberships, a member community and an academy. Code: `Documents\hamzi-lms`.
- **Prompts Website** ([[Projects/Prompts Website/wiki/hot|hot cache]]): the general wiki used before MSK AI OS, plus the SoniPrompts / PromptsStudio rebuild (code in its `projects/soniprompts/`).
- **Ubaid Automation** ([[Projects/Ubaid Automation/wiki/hot|hot cache]]): Ubaidoo client-work wiki for the Ubaidoo Automation site and its Academy LMS (code in its `projects/ubaidooautomation/`).

## Open threads
- GitHub push pending (needs Windows git login): MSK AI OS's own new repo (msk-ai-os), AI Brain, Prompts Website, Ubaid Automation, the Ubaidoo code repo and hamzi-lms. Run `tools/finish-git-sync.ps1`. SoniPrompts code has no remote.
- Five new law files in `Documents\Pakistan Laws\md` await the user's go-ahead.
- Optional Obsidian setting: Attachment folder path → `raw/assets`.

## Recently changed
- 22 Oct 2026: MSK AI OS got its own private GitHub repo (imported projects and case files excluded).
- 22 Oct 2026: Pakistan Legal Aid got its own hot cache; every project now has one.
- 22 Oct 2026: AI Brain, Prompts Website and Ubaid Automation moved into `Projects/`; their schemas, hamzi-lms and launch.json updated. Studio 404 left out.
- 22 Oct 2026: context-lookup rule set (wiki only, never raw); hot cache added.
- 22 Oct 2026: whole vault became the second brain; legal work moved to `Projects/`.
