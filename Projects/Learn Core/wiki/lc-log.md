---
type: log
updated: 2026-10-22
---
# Learn Core: log

## [2026-10-22] setup | Project created
- Owner asked for a new project "Learn Core" for the Monetics LearnCore LMS product.
- `Documents\Monetics-LearnCore` copied into `projects/monetics-learncore` (257 files incl. git history, checksum-verified); build.py now finds hamzi-lms inside the vault (commit 07be496). An uncommitted change to `release/Monetics-LearnCore-1.0.0.zip` was carried over as it was.
- Wrote CLAUDE.md, [[lc-hot]], [[lc-index]], [[lc-lms-copies-2026-10-22]].

## [2026-10-22] note | Old copy removed
- After a second check (only build.py and README differ, by the path update; full history present), the files in `Documents\Monetics-LearnCore` were deleted at the owner's request. `tools/MSK-FIRST-PUSH.cmd` removes the empty folder.

## [2026-10-22] decision | Option B chosen; Phase 0 comparison done
- Owner chose "one master copy". Read-only comparison of the Hamzi and Ubaidoo LMS copies: 67 identical, 50 changed, 2 only in Hamzi, 20 only in Ubaidoo; DB 19 vs 21; Hamzi has post-fork security fixes; Ubaidoo branding in core files. Plan written: [[lc-master-core-plan]] (awaiting approval). No code changed.
- Product repo got its GitHub remote `learn-core`; added to the sync and setup scripts.
