---
type: answer
domains: [ai, knowledge-management]
sources: [src-2026-10-22-nm-3-file-ai-system, src-2026-10-22-nm-obsidian-cowork-life, src-2026-10-22-nm-cowork-80, src-2026-10-22-nm-big-clean, src-2026-10-22-nm-obsidian-masterclass]
created: 2026-10-22
updated: 2026-10-22
status: active
---
# Applying the AI OS to MSK AI OS: gap analysis and plan

**Status: partly applied.** On 2026-10-22 the user approved and Claude applied: `AIOS/` folder with [[msk-vault-map]], [[msk-skill-map]] and 9 skill files; root `CLAUDE.md` fully split into a pointer; `AGENTS.md` added (steps 1 without me.md, 3, 4, 5). Still open: step 0, `me.md` (step 2), step 6, step 7. Remaining steps need the user's go-ahead and are logged in both logs.

## Where MSK AI OS already matches
| AI OS element | MSK AI OS today |
|---|---|
| Files you own, any app can read ([[aios-file-over-ai]]) | Plain markdown vault + private GitHub repo |
| Ideaverse (layer 1) | `raw/` (user's sources) + `wiki/` (compiled knowledge) + `Projects/` |
| Vault map ([[aios-vault-map]]) | Root `CLAUDE.md` (schema, operations) + `wiki/brain-index.md` |
| Maps of content ([[aios-maps-of-content]]) | brain-index, project indexes, topic pages |
| Efforts area ([[aios-ace-framework]]) | `Projects/<Name>/`, each with its own rules |
| `+` folder ([[aios-plus-folder]]) | `raw/inbox/` for sources |
| Janitor system ([[aios-skill-systems]]) | `lint` + `tools/wiki_lint.py` |
| Chronicler | filing reusable answers into `wiki/answers/` |
| AI vs human separation ([[aios-ai-content-hygiene]]) | `raw/` = user, `wiki/` = Claude, opinions under `## Synthesis` |
| Extra the videos don't have | `hot.md` hot caches (short current-state summary) |

## Gaps
1. **No `me.md`.** Who the user is and how they like to work lives in Claude's memory and settings, outside the vault; another AI tool would start blind.
2. **Everything is addressed to Claude.** The manual is a Claude-named file; another tool (Codex, Gemini, a local model) may not read it.
3. **No skill map or skills folder.** Procedures (ingest, lint, new project, hot-cache refresh, git sync) are written as prose inside `CLAUDE.md`, not as separate skill files a tool can pick up.
4. **No session-start prompt** the user can paste into any tool.
5. **No Calendar area** (daily notes, journal, meetings), so nothing for a daily brief/log or weekly review to read or write.
6. **No home for the user's own notes** that AI must not rewrite (the wiki is AI-owned; raw is for sources). The masterclass makes this the central point: "make notes, don't just take them" ([[aios-linking-your-thinking]]).
7. **Obsidian setting:** `.obsidian/app.json` doesn't explicitly turn on "automatically update internal links", although the whole vault links by unique file name ([[aios-obsidian-basics]]).

## Suggested steps (in order; each small and reversible)
0. **Now, in Obsidian:** Settings → Files and links → turn on "Automatically update internal links" (gap 7). One click; protects every link when a page is renamed.
1. **Create `AIOS/` at the vault root** with `me.md`, `vault-map.md`, `skill-map.md`, `skills/`. Use names unique in the vault (e.g. `msk-me`, `msk-vault-map`, `msk-skill-map`). Start from the templates in `kit/`.
2. **Fill `me.md` with the user**, not by guessing: 50-80 lines, reviewed line by line. Optionally draft it from the wiki (as the "dossier" in video 2), then edit.
3. **Vault map = pointer + summary**, not a copy: it explains the layout in tool-neutral language and links to the root `CLAUDE.md` for the full schema, so there is one source of truth.
4. **Root `CLAUDE.md`:** add one line at the top: "Before anything else, read `AIOS/msk-me.md`, then `AIOS/msk-vault-map.md` and `AIOS/msk-skill-map.md`." Optionally add `AGENTS.md` (read by several other coding agents) with the same pointer.
5. **Move procedures into skills:** first `ingest`, `lint`, `new-project`, `hot-cache-refresh`, `git-sync`; then list them in the skill map. Keep `CLAUDE.md` describing *what* the rules are, skills describing *how*.
6. **Session-start prompt** ([[aios-kit-session-start-prompt]]) saved as a text-expander snippet on Windows.
7. **Later, if wanted:** a `Calendar/` area (daily notes) and a scheduled daily brief from the vault (and connected apps); a personal notes area AI may read but not edit; a yearly Big Clean of Downloads/Screenshots on the PC.

## Decisions for the user
- Should `me.md` hold only working preferences, or also identity (values, goals) like Nick's?
- Should other tools be supported now (`AGENTS.md`), or only Claude for the moment?
- Is a Calendar/daily-brief layer wanted, and from which sources?
- Should there be a personal notes area (the user's own thinking) that AI can read and link to but not rewrite?

## Synthesis
The biggest win for the least effort is steps 1-4: they make MSK AI OS tool-portable without restructuring anything. Steps 5-7 add capability and can wait.
