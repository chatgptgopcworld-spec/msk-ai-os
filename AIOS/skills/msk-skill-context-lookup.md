---
type: skill
skill: context-lookup
system: Query
trigger: any question about the user, their work, or something the vault may hold
schedule: none
inputs: wiki/hot.md, wiki/brain-index.md, linked wiki pages (main or a project's own wiki/)
outputs: an answer linking the wiki pages used; optionally a filed answer page
updated: 2026-10-22
---
# Context lookup and query

## Goal
Answer from the compiled wiki, quickly and honestly, never from raw files.

## Steps
1. Read `wiki/hot.md`.
2. If more detail is needed, read `wiki/brain-index.md` and follow the relevant `[[links]]`.
   If the question is about a project, read that project's `CLAUDE.md` and its own hot cache and index.
3. Answer with `[[links]]` to the pages used. Say plainly where the wiki has no answer.
4. If the wiki is thin: say so and offer to ingest a source or expand a page.
5. If the answer is reusable (comparison, analysis, decision, plan), offer to file it:
   follow [[msk-skill-file-answer]].

## Rules
- Never read `raw/` to answer (vault map, section 2, rule 2).
- Don't present a guess as a wiki fact.

## Done when
- Every claim in the answer traces to a linked page, or is marked as not in the wiki.
