---
type: skill
skill: new-project
system: Projects (Auto Builder)
trigger: a new, separate piece of work that needs its own rules, sources or outputs
schedule: none
inputs: project name and purpose from the user
outputs: Projects/<Name>/ with CLAUDE.md, prefixed hot cache, index and log; registrations
updated: 2026-10-22
---
# Create a new project

## Goal
Give a new piece of work its own self-contained home without mixing it with anything else.

## Steps
1. Pick a short prefix for its generic files (e.g. `legal-`, `aios-`); check no vault file uses it.
2. Create `Projects/<Name>/` with: `CLAUDE.md` (purpose, read order, layout, rules, operations),
   `raw/`, `wiki/<prefix>hot.md`, `wiki/<prefix>index.md`, `wiki/<prefix>log.md`.
3. Register it: a row in the projects table of [[msk-vault-map]] (section 6), a row in
   `Projects/CLAUDE.md`, a line under Projects in `wiki/brain-index.md`.
4. If it has its own git repo: add it to `.gitignore` and to the repo lists in `tools/msk-sync.ps1` and `tools/msk-setup-computer.ps1`; if it holds personal data: ignore that folder.
5. Append `## [YYYY-MM-DD] schema | New project: <Name>` to `wiki/brain-log.md`.
6. Refresh the hot cache ([[msk-skill-hot-cache]]); commit ([[msk-skill-git-sync]]).

## Rules
- Every new file name unique vault-wide.
- Never edit another project while doing this.

## Done when
- Lint passes; the project appears in the vault map table, `Projects/CLAUDE.md`, brain-index and hot cache.
