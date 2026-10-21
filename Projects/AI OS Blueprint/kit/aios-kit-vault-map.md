---
type: template
domains: [ai]
sources: [src-2026-10-22-nm-3-file-ai-system, src-2026-10-22-nm-obsidian-cowork-life]
created: 2026-10-22
updated: 2026-10-22
status: stub
---
# Vault map template

Structure follows [[aios-vault-map]]. Pre-filled for MSK AI OS's current layout; keep it a summary that links to the root `CLAUDE.md` rather than a copy of it.

```markdown
# Vault map: how to move through MSK AI OS

The master table of contents and manual for this vault. Full rules: CLAUDE.md at the vault root.

## Areas
| Folder | What's in it | How to treat it |
|---|---|---|
| raw/ | The user's sources (inbox/, sources/YYYY/, assets/) | Read only during ingest; never edit |
| wiki/ | Compiled knowledge: hot.md, brain-index.md, brain-log.md, sources, entities, concepts, topics, answers | AI-maintained; follow page conventions |
| Projects/<Name>/ | Self-contained projects, each with its own CLAUDE.md, hot cache, index, log | Read that project's CLAUDE.md; never mix projects |
| templates/ | Page templates | Use when creating pages |
| tools/ | wiki_lint.py, finish-git-sync.ps1 | Run, don't rewrite casually |
| AIOS/ | me, vault map, skill map, skills/ | The translation layer |

## Where to start
hot.md → brain-index.md → linked pages. Never answer from raw/.

## Creating notes
- Names: lowercase-hyphen slugs, unique vault-wide; prefix generic names.
- Frontmatter: type, domains, sources, created, updated, status.
- Cite a source page for non-obvious claims; your own reasoning under "## Synthesis".
- Record contradictions; never overwrite silently.

## Current priorities
<3-5 lines: what matters most right now; update when priorities shift>
```
