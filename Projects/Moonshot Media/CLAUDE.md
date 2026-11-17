# Moonshot Media: project schema (inside MSK AI OS)

**What this is:** the owner's brand **Moonshot Media / Moonshot Studios** (website moonshotmedia.in). This project
holds its brand identity work: brand kits, logos, stationery and merchandise mockups, and whatever follows.

Paths are relative to this folder (`Documents\MSK AI OS\Projects\Moonshot Media`).

**Read order:** this file -> `wiki/ms-hot.md` -> `wiki/ms-index.md` -> last 5 entries of `wiki/ms-log.md`.

## Layout
```
raw/                                   Sources (immutable).
deliverables/brand-kits/
  index.html                           Round 2: 6 kits (01 original logo + 5 directions). Self-contained.
  assets/                              Original logo files from moonshotmedia.in (PNG, GIF) + recoloured versions.
  v1-first-draft/index.html            Round 1 of the 6 kits (owner called them generic).
  premium/index.html (+ kits.js, mock.js, app.js)
                                       Round 3: 10 premium kits, 01-05 Moonshot Media, 06-10 Moonshot Studios.
wiki/ms-hot.md, ms-index.md, ms-log.md Hot cache, index, append-only log.
wiki/answers/                          Decisions and deliverable summaries.
```

## Rules
1. The original logo (slingshot + MOONSHOT on the arc) is the owner's; keep it unchanged wherever it is used.
2. No invented facts: phone, address, names, Studios email/website stay as [BRACKETS] until the owner gives them.
3. Don't mix projects.

## Operations
- Preview: `.claude/launch.json` -> `moonshot-brand-kits` (python http.server, port 5181, serves `deliverables/brand-kits`).
  `premium/` needs this server (it loads three .js files); the other pages open directly in a browser.
- Query / lint / hot cache: follow the vault skills with this project's `ms-` files.

## Git
No repo of its own; tracked by msk-ai-os.
