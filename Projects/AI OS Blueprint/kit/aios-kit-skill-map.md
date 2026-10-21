---
type: template
domains: [ai]
sources: [src-2026-10-22-nm-3-file-ai-system, src-2026-10-22-nm-obsidian-cowork-life]
created: 2026-10-22
updated: 2026-10-22
status: stub
---
# Skill map template

Structure follows [[aios-skill-map]] and [[aios-skill-systems]]. Rows are suggestions drawn from procedures MSK AI OS already uses; none exist as skill files yet.

```markdown
# Skill map

Every skill is a markdown file in AIOS/skills/. Use the skill whose trigger matches the request.

## Wiki upkeep (Janitor)
| Skill | Use when | File |
|---|---|---|
| ingest | user says "ingest" or drops a source in raw/inbox/ | skills/msk-skill-ingest.md |
| lint | user says "lint", or monthly | skills/msk-skill-lint.md |
| hot-cache-refresh | after any ingest, lint or schema change | skills/msk-skill-hot-cache.md |

## Projects (Auto Builder)
| new-project | user wants a new piece of work set up | skills/msk-skill-new-project.md |

## Saving (Chronicler)
| file-answer | a reusable answer the user wants kept | skills/msk-skill-file-answer.md |

## Sync
| git-sync | after changing vault files | skills/msk-skill-git-sync.md |
```
