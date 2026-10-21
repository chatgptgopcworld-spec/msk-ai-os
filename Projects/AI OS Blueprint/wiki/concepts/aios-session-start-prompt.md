---
type: concept
domains: [ai]
sources: [src-2026-10-22-nm-obsidian-cowork-life]
created: 2026-10-22
updated: 2026-10-22
status: active
---
# Session-start prompt

**Definition:** a short fixed prompt sent at the start of every AI session to load the core files, because models forget between sessions.

## What the sources say
- Shape of his prompt: read `me.md` (with its exact location), then review the vault map and skill map for relevant context, confirm you've read them, then wait for instructions (see [[src-2026-10-22-nm-obsidian-cowork-life]]).
- Not strictly required (a `CLAUDE.md` pointer already exists) but the most reliable way to be sure context loaded in a new task (see [[src-2026-10-22-nm-obsidian-cowork-life]]).
- Fire it with a text-expander shortcut (he uses TextExpander with a 3-letter trigger); on Windows any text-expansion tool works (see [[src-2026-10-22-nm-obsidian-cowork-life]]).
- Template for MSK AI OS: [[aios-kit-session-start-prompt]].

## Related
[[aios-me-md]] · [[aios-vault-map]] · [[aios-skill-map]]

## Synthesis
MSK AI OS's root `CLAUDE.md` already orders the start-of-session reading (CLAUDE.md → hot.md → brain-index → last 5 log entries → inbox). The kit prompt mirrors that order so it works even in a tool that never reads `CLAUDE.md`.
