---
type: hot-cache
updated: 2026-10-22
word_budget: 500
---
# Learn Core: hot cache

Read right after `CLAUDE.md`, then [[lc-index]]. Rewritten in full after every ingest, lint or decision.

## What this project is
The owner's reusable LMS product, Monetics LearnCore: one LMS that can be installed for any client who has a
domain and hosting. Code: `projects/monetics-learncore` (own git repo; `build/build.py` turns the LMS source
into the neutral product; `--check` must report "leaks found: 0").

## Current state
The same LMS lives in three copies that have drifted apart ([[lc-lms-copies-2026-10-22]]):
- Hamzi LMS (source, hamziprompts.com): 0.39.x.
- Ubaidoo Academy: 0.39.10.18, the newest, with extra features built for Ubaidoo.
- LearnCore product: built from 0.35.3 on 2026-10-01, far behind; its tooling, docs and tests are still useful.

## Rules that matter most
Live sites (Hamzi, Ubaidoo) are never changed without approval, backup and a browser check. No client data
or names in the product. Hamzi and Ubaidoo pages stay in their own projects.

## Decision and plan
The owner chose **one master copy** (Option B). Phase 0 comparison is done: the copies share 67 files, differ in 50,
Ubaidoo adds notes, grades, search and certificate templates (DB 21 vs Hamzi's 19), Hamzi has security fixes from
16 Oct that Ubaidoo lacks, and Ubaidoo's name sits inside core admin files. Plan: [[lc-master-core-plan]]
(base = Ubaidoo copy, add Hamzi's fixes, move branding to connectors, build every client from LearnCore, test the
DB 19→21 upgrade on a copy, roll out Ubaidoo then Hamzi). Awaiting approval of phases 1-3.

## Open threads
- Owner decisions: approve the base and phases 1-3; staging copy of Hamzi for testing.
- Product repo has GitHub remote `learn-core`; first push on the next `MSK-SYNC-PUSH.cmd`.

## Recently changed
- 22 Oct 2026: Option B chosen; Phase 0 comparison done; plan written.
- 22 Oct 2026: project created; product repo moved in; build path made vault-relative.
