---
type: concept
domains: [ai, knowledge-management]
sources: [src-2026-10-22-nm-cowork-80, src-2026-10-22-nm-3-file-ai-system, src-2026-10-22-nm-obsidian-cowork-life]
created: 2026-10-22
updated: 2026-10-22
status: active
---
# me.md: portable identity

**Definition:** one plain markdown file that tells any AI who you are, how you think and how to work with you. The first file every AI session reads. Answers "who am I?"

## What the sources say
- Origin: a **dossier** Cowork built from his Atlas notes (values, beliefs, frameworks, goals, "intellectual DNA"); about 90% right, needed his edits (see [[src-2026-10-22-nm-cowork-80]]).
- Size and content: about 50-80 lines. Top: "this is your briefing on who I am...", plus file paths to the other maps (AI works best with paths). Section "Me": summary statement, first principles, mantras, values and virtues, how I think, key frameworks, intellectual lineage, recurring concepts, references, life reflections. Section "Working preferences": how to address me, tone, collaborator not tool, no filler phrases, basic rules, where to look next (see [[src-2026-10-22-nm-3-file-ai-system]]).
- Changes rarely once set; review every few weeks for bloat (see [[src-2026-10-22-nm-3-file-ai-system]]).
- Tool files point to it: `CLAUDE.md` at the root of the folder Claude opens contains only "go immediately to me.md". Single-vault users put that `CLAUDE.md` in the vault root (see [[src-2026-10-22-nm-obsidian-cowork-life]]).
- Template: `kit/aios-kit-me.md` ([[aios-kit-me]]).

## Related
[[aios-vault-map]] · [[aios-skill-map]] · [[aios-session-start-prompt]] · [[aios-file-over-ai]]

## Contradictions
- **Where personal context lives.** Video 2 pastes the dossier into Claude's *personal preferences* setting ([[src-2026-10-22-nm-cowork-80]]); videos 3-4 say to keep it in your own `me.md` and leave Claude-specific places empty except for a pointer ([[src-2026-10-22-nm-3-file-ai-system]], [[src-2026-10-22-nm-obsidian-cowork-life]]). The later videos are the current position.
- **Where me.md sits.** Video 3 says the AIOS folder holds all AI maps "except for one" and then introduces me.md, implying me.md may sit outside it ([[src-2026-10-22-nm-3-file-ai-system]]); video 4 says to create me.md inside the AIOS folder ([[src-2026-10-22-nm-obsidian-cowork-life]]). Either works as long as the pointer gives the exact path.

## Synthesis
MSK AI OS has no me.md. Facts about the user currently live in Claude's memory (outside the vault) and in project hot caches. A vault `me.md` would make the user's identity and working preferences portable, and the existing root `CLAUDE.md` could start with a pointer to it. See [[aios-msk-adoption-plan]].
