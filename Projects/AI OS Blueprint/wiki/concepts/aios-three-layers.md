---
type: concept
domains: [ai, knowledge-management]
sources: [src-2026-10-22-nm-3-file-ai-system, src-2026-10-22-nm-obsidian-cowork-life]
created: 2026-10-22
updated: 2026-10-22
status: active
---
# The three layers of an AI OS

**Definition:** Nick Milo's architecture for an AI system you own: your knowledge in the middle, a thin layer of maps and manuals around it, and swappable AI tools on the outside.

## What the sources say
| Layer | What it is | How often it changes |
|---|---|---|
| 1. Ideaverse | All your notes, ideas and links as plain markdown, organised with [[aios-ace-framework]]. Your unique experience and thinking; the more you add, the smarter any AI becomes with you. | Grows constantly |
| 2. Maps and manuals (translation layer) | A few core files between the Ideaverse and any tool: [[aios-me-md]], [[aios-vault-map]], [[aios-skill-map]] + skills folder. Makes the Ideaverse navigable and safe for AI. | `me.md` rarely; vault map when priorities/structure shift; skills as you build them |
| 3. Tools | The apps you use today: Obsidian, [[aios-claude-cowork]], NotebookLM, Claude Code, Gemini... | Most replaceable; expect churn |

- The focus is layer 2: it lets any tool work in the Ideaverse immediately (see [[src-2026-10-22-nm-3-file-ai-system]]).
- Layer 2 lives in its own `AIOS` folder inside the vault so AI material stays separate from your own thinking (see [[src-2026-10-22-nm-obsidian-cowork-life]]).
- "Own your ideas and AI workflows; rent the AI tool" (see [[src-2026-10-22-nm-obsidian-cowork-life]]).

## Related
[[aios-file-over-ai]] · [[aios-system-overview]] · [[aios-maps-of-content]]

## Synthesis
MSK AI OS already has a strong layer 1-and-2 hybrid: `raw/` + `wiki/` is the knowledge, and `CLAUDE.md` + `hot.md` + `brain-index.md` act as the manual and map. What it lacks is the *tool-neutral* framing: everything is addressed to "Claude" in a Claude-named file. See [[aios-msk-adoption-plan]].
