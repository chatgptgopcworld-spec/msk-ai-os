# Learn Core: project schema (inside MSK AI OS)

**What this is:** the owner's reusable LMS product, **Monetics LearnCore**: one LMS that can be installed for
any client (own domain and hosting) without building a whole custom website. Today the same LMS exists in
three places that have drifted apart (see [[lc-lms-copies-2026-10-22]]); this project is where that gets
managed and, if the owner approves, unified.

Paths are relative to this folder (`Documents\MSK AI OS\Projects\Learn Core`). Nothing here is written
outside it, except the registration lines the vault map asks for.

**Read order:** this file → `wiki/lc-hot.md` → `wiki/lc-index.md` → last 5 entries of `wiki/lc-log.md`.

## Layout
```
projects/monetics-learncore/   The product repo (its own git repo, ignored by msk-ai-os).
                               build/build.py turns the LMS source into the neutral product.
raw/                           Sources for this project (immutable).
wiki/lc-hot.md                 Hot cache (~500 words, ceiling 600, rewritten in full).
wiki/lc-index.md               Catalogue of pages.
wiki/lc-log.md                 Append-only log: "## [YYYY-MM-DD] op | Title".
wiki/answers/                  Analyses and decisions.
```

## Rules
1. **Live sites first.** Hamzi (hamziprompts.com) and Ubaidoo (lms.ubaidooautomation.com) run copies of this
   LMS with real students and payments. No change reaches a live site without the owner's approval, a fresh
   backup, phase-by-phase work and a browser check (their own projects' rules apply there).
2. **Where features are made** (current setup, per the product README): in the LMS source
   `Projects/Hamzi Prompts/projects/hamzi-lms/plugin`; `build.py` makes the neutral product from it, and
   `python build/build.py --check` must report **leaks found: 0** before a release.
3. **No client data in the product:** no users, orders, keys or client names. Each client's specifics go in
   its own connector (`connectors/<client>/`).
4. **Don't mix projects:** Hamzi and Ubaidoo pages stay in their projects; link to them, don't copy them.
5. **Any plan to merge the three copies** is written in `wiki/answers/` and approved by the owner before
   any code changes.

## Operations
- Work on the product code: inside `projects/monetics-learncore`, commit there; log here.
- Query / ingest / lint / hot cache: follow the vault skills (`AIOS/msk-skill-map.md`) with this project's
  `lc-` files.

## Git
The product code is its own repo (no GitHub remote yet: the owner creates a private repo, then it is added
to `tools/msk-sync.ps1` and `tools/msk-setup-computer.ps1`). This project's wiki is tracked by msk-ai-os.
