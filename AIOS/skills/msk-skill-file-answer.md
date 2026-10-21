---
type: skill
skill: file-answer
system: Chronicler
trigger: a reusable answer (comparison, analysis, decision, plan) the user agrees to keep
schedule: none
inputs: the answer and the pages it used
outputs: wiki/answers/<slug>.md, index line, log entry
updated: 2026-10-22
---
# File an answer into the wiki

## Steps
1. Ask (or confirm) that the user wants it kept.
2. Write `wiki/answers/<slug>.md` from `templates/answer.md` (inside a project: that project's
   `wiki/answers/`), with `[[links]]` to the pages used and the AI's reasoning under `## Synthesis`.
3. Add it to the right index; append a `query` log entry.
4. If it changes a decision, refresh the hot cache ([[msk-skill-hot-cache]]). Commit.

## Done when
- The page is linked from the index and passes lint.
