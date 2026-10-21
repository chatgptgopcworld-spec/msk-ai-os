---
type: skill
skill: hot-cache-refresh
system: Wiki upkeep
trigger: end of every ingest (main wiki or any project), after a lint pass, after a schema change, or when a filed answer changes a decision
schedule: none
inputs: wiki pages changed in this session
outputs: wiki/hot.md rewritten (and a project's own hot cache when its rules ask)
updated: 2026-10-22
---
# Refresh the hot cache

## Goal
Keep `wiki/hot.md` short, current and trustworthy, since every session reads it first.

## Steps
1. Re-read the current `wiki/hot.md` and the pages changed in this session.
2. Rewrite the **whole file** (never just append) with the fixed sections: What this vault is ·
   How to work here · Current state of the main wiki · Active projects · Open threads ·
   Recently changed (last ~5 items, dated).
3. What earns a place: main themes and current thesis; decisions and commitments; facts most
   future questions will need; open questions and pending actions; what changed recently.
   Leave out anything a quick look at the index would give. Drop or compress the oldest,
   least important items to make room.
4. Bump `updated:` in its frontmatter.
5. Mention "hot cache refreshed" in the log entry for the operation.

## Rules
- About 500 words, hard ceiling 600 (the lint tool counts).
- Only summarise what wiki pages already say, with `[[links]]`. Nothing unsupported.
- After a project ingest: change only that project's paragraph plus one dated "Recently changed" line.
- Not after routine queries that change nothing.

## Done when
- Lint shows the hot cache at or under 600 words; every statement links to a page.
