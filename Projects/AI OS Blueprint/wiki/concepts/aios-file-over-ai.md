---
type: concept
domains: [ai, knowledge-management]
sources: [src-2026-10-22-nm-3-file-ai-system, src-2026-10-22-nm-obsidian-cowork-life, src-2026-10-22-nm-obsidian-masterclass]
created: 2026-10-22
updated: 2026-10-22
status: active
---
# File over AI

**Definition:** the principle that your AI setup (identity, instructions, skills, outputs) lives in plain files you own, not inside any AI product, so you can switch tools without losing anything.

## What the sources say
- Builds on Obsidian's "file over app": notes are text files in folders, readable by any app even if Obsidian disappears (see [[src-2026-10-22-nm-3-file-ai-system]]).
- Hundreds of hours spent shaping preferences inside one AI tool are lost if that tool changes, pivots, breaks its API or retires a model (see [[src-2026-10-22-nm-3-file-ai-system]]).
- Practical rules: tool-specific files (e.g. `CLAUDE.md`) only point to your own files; skills are stored in your vault, not the tool's library; the system should be ready to move to local models (see [[src-2026-10-22-nm-obsidian-cowork-life]]).

- The root of it, from his beginner course: plain text will be readable as long as computers exist, which he calls future-proofing (see [[src-2026-10-22-nm-obsidian-masterclass]]).

## Related
[[aios-three-layers]] · [[aios-me-md]] · [[aios-skills-as-files]]

## Synthesis
For MSK AI OS this means: keep the rules in markdown (already true), but don't rely on rules that exist only in Claude's memory or settings. Today the vault preferences live both in the root `CLAUDE.md` and in Claude's memory; the vault copy should be the master.
