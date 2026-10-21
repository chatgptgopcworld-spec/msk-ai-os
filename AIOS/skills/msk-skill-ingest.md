---
type: skill
skill: ingest
system: Wiki upkeep
trigger: user says "ingest" or drops a file in raw/inbox/ (or a project's own raw folder)
schedule: none
inputs: the new source; existing wiki pages it touches
outputs: source page, updated/created pages, index, log, hot cache
updated: 2026-10-22
---
# Ingest a source

## Goal
Compile one new source into the wiki so it never has to be re-read from raw.

## Steps
1. Read the source fully (PDF → `pdftotext -layout`; images → view them; long files in parts;
   YouTube → [[msk-skill-yt-transcript]]).
2. Tell the user the 3-5 key takeaways and ask what to emphasise (skip for batch/unsupervised ingest).
3. Move the original to `raw/sources/YYYY/YYYY-MM-DD-slug.ext` (date = ingest date).
4. Write `wiki/sources/src-YYYY-MM-DD-slug.md` from `templates/source.md`.
5. Update or create every entity, concept and topic page the source touches (often 5-15).
   Add the source to each page's `sources:` list and bump `updated:`.
6. Flag contradictions with existing pages (`## Contradictions`); update `brain-overview.md`
   if the big picture moved.
7. Add every new page to `brain-index.md`; append a log entry (`## [YYYY-MM-DD] ingest | Title`).
8. Refresh the hot cache: [[msk-skill-hot-cache]].
9. Commit: [[msk-skill-git-sync]].

## Rules
- For a project, its own `CLAUDE.md` ingest steps replace steps 3-7; step 8 still refreshes
  the vault hot cache (that project's paragraph + a "Recently changed" line).
- Never edit the source itself; moving it out of the inbox is the only change.

## Done when
- `python3 tools/wiki_lint.py` shows no broken links, orphans, unindexed pages or missing frontmatter.
- `raw/inbox/` no longer holds the source; the log has the entry; hot cache updated.
