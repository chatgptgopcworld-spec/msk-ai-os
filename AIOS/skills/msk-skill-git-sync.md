---
type: skill
skill: git-sync
system: Sync
trigger: after changing vault files (end of an ingest, lint, schema change or project work)
schedule: none
inputs: changed files
outputs: a commit in the right repo; push from Windows
updated: 2026-10-22
---
# Commit and push

## Steps
1. Work out which repo changed: MSK AI OS itself (OS files, Pakistan Legal Aid, AI OS Blueprint)
   or an imported project / code repo (its own repo) (vault map, section 6, rules 8 and 10).
2. `git add` only that repo's changed files; never commit one project's files into another's repo.
3. Commit with a clear message (`ingest: ...`, `schema: ...`, `lint: ...`) and the attribution lines the session asks for.
4. If committing from a shell that cannot delete files (Claude's linked-computer shell), git leaves
   `.git/*.lock` files behind: rename them to `.git/stale-<name>-<date>` (never inside `.git/refs`) so later git commands work.
5. Push from Windows: run `tools/finish-git-sync.ps1` (pushes MSK AI OS, the imported projects,
   the Ubaidoo code repo and hamzi-lms; result in `tools/finish-git-sync-result.txt`), or `git push` in that repo.

## Rules
- Never push `Projects/Pakistan Legal Aid/cases/` or any personal-data folder.
- No push without the user's go-ahead when a project's rules say so (e.g. Ubaid Automation).

## Done when
- `git status` is clean for the files you changed; the push result shows OK.
