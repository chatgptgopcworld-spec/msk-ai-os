---
type: skill
skill: lint
system: Janitor
trigger: user says "lint", or monthly
schedule: monthly (when a scheduler is set up)
inputs: whole vault
outputs: fixes, a report, a log entry, refreshed hot cache
updated: 2026-10-22
---
# Lint (health check)

## Goal
Keep the wiki and schema healthy so it can be trusted.

## Steps
1. From the vault root run `python3 tools/wiki_lint.py` (broken links, orphans, pages missing
   from the index, missing frontmatter, hot-cache length, inbox, AIOS skill-map checks).
2. Judgement checks: contradictions between pages; stale claims superseded by newer sources;
   concepts mentioned on 3+ pages without their own page; thin pages a web search could fill
   (ask before searching); pages missing frontmatter.
3. If lint says the me.md review is due, run the monthly review in [[msk-skill-me-update]] (step 4).
4. Report findings; fix what is safe; ask about the rest.
5. Append `## [YYYY-MM-DD] lint | ...` to `wiki/brain-log.md`.
6. Refresh the hot cache: [[msk-skill-hot-cache]]. Commit: [[msk-skill-git-sync]].

## Rules
- Never "fix" imported projects' repeated file names (vault map, section 6, rule 7).

## Done when
- The lint tool reports zeros, or each remaining item is reported to the user.
