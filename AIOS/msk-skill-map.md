---
type: schema
role: skill-map
created: 2026-10-22
updated: 2026-10-22
---
# MSK AI OS: skill map

Every repeatable procedure in this vault is one markdown file in `AIOS/skills/`. When a request
matches a trigger below, open that skill file and follow it step by step, then check its
"Done when". Rules and layout are in [[msk-vault-map]]; skills say *how*.

A project's own `CLAUDE.md` may add or replace steps inside that project.

## Query
| Skill | Use when | File |
|---|---|---|
| context-lookup | any question about the user, their work, or what the vault holds | [[msk-skill-context-lookup]] |

## Wiki upkeep
| Skill | Use when | File |
|---|---|---|
| ingest | user says "ingest" or drops a source in `raw/inbox/` | [[msk-skill-ingest]] |
| hot-cache-refresh | end of every ingest, lint or schema change | [[msk-skill-hot-cache]] |

## Janitor
| Skill | Use when | File |
|---|---|---|
| lint | user says "lint", or monthly | [[msk-skill-lint]] |

## Projects
| Skill | Use when | File |
|---|---|---|
| new-project | a new, separate piece of work needs its own home | [[msk-skill-new-project]] |
| import-project | an existing vault/folder should join MSK AI OS | [[msk-skill-import-project]] |

## Chronicler
| Skill | Use when | File |
|---|---|---|
| file-answer | a reusable answer the user wants kept | [[msk-skill-file-answer]] |

## Sync
| Skill | Use when | File |
|---|---|---|
| git-sync | after changing vault files | [[msk-skill-git-sync]] |

## Research
| Skill | Use when | File |
|---|---|---|
| yt-transcript | a YouTube video to study or ingest | [[msk-skill-yt-transcript]] |

## Adding a skill
1. Do the task with the AI until the result is right.
2. Write it as `AIOS/skills/msk-skill-<name>.md` using the frontmatter above
   (template: `Projects/AI OS Blueprint/kit/aios-kit-skill-template.md`).
3. Add one row here under the right group. Log it as a `schema` change.
The lint tool checks that every skill file is listed here and every row points to a real file.

## Planned (not built yet)
Daily brief, daily log, weekly review: need a Calendar area first (see [[aios-msk-adoption-plan]]).
