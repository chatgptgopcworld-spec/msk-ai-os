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

## Open threads
- Decide whether to unify the three copies into one master core ("one master copy" option, not approved).
- Compare Hamzi vs Ubaidoo copies file by file before any plan.
- Create a private GitHub repo for the product, then add it to the sync scripts.

## Recently changed
- 22 Oct 2026: project created; product repo moved in; build path made vault-relative.
