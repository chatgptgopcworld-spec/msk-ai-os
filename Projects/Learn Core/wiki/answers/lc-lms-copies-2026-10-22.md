---
type: answer
domains: [business, software]
sources: []
created: 2026-10-22
updated: 2026-10-22
status: active
---
# The three copies of the LMS (status on 2026-10-22)

| Copy | Where | Version | State |
|---|---|---|---|
| Hamzi LMS (source) | `Projects/Hamzi Prompts/projects/hamzi-lms/plugin` | 0.39.x | Runs on hamziprompts.com; the place where features were meant to be made |
| Ubaidoo Academy | `Projects/Ubaid Automation/projects/ubaidooautomation/wordpress/academy-lms/hamzi-lms` | **0.39.10.18** (newest) | Started from the live Hamzi plugin 0.39.10 (119/119 files identical at the start), then gained Ubaidoo features (notes, gradebook, certificates, search, watermark, delete account) |
| Monetics LearnCore (product) | `projects/monetics-learncore` | product 1.0.0, **built from source v0.35.3** (2026-10-01) | Code far behind; its build tooling, connectors, docs and 32 test suites are still valuable |

Facts from: the Ubaidoo repo's `lms-source-verification.json` and plugin header; LearnCore's README,
TEST-NOTES and git log; the Hamzi Prompts wiki page `monetics-learncore`.

## The problem in one line
One LMS is being changed in three places, so a feature made for one client doesn't reach the others.

## Synthesis: option the owner may choose (not approved, nothing done)
**"One master copy"**: like keeping one master recipe and cooking each client's dish from it:
1. The newest code (Ubaidoo 0.39.10.18) plus anything Hamzi has that Ubaidoo lacks becomes the single core.
2. Hamzi and Ubaidoo become clients of that core, each with its own small settings/connector.
3. New features are built once in the core; `build.py` produces each client's version.
Needs first: a file-by-file comparison of the Hamzi and Ubaidoo copies, backups of both live sites, and the
owner's approval of a written plan. Until then, each copy keeps working as it is.

## Open questions
- Does Hamzi have changes after 0.39.10 that Ubaidoo doesn't?
- Which client-specific parts are inside the Ubaidoo copy (names, branding, Bunny settings)?
