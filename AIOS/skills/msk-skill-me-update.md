---
type: skill
skill: me-update
system: Identity
trigger: user says "update me.md", "remember this about me", "this is wrong about me"; or the AI notices a durable new fact about the user; or the monthly review flagged by lint
schedule: monthly review, run together with lint (a scheduled reminder may be added later)
inputs: AIOS/msk-me.md, what the user said in this session
outputs: AIOS/msk-me.md updated, log entry, commit
updated: 2026-10-22
---
# Keep me.md current

## Goal
`AIOS/msk-me.md` stays true, short (about 50-80 lines) and confirmed by the user. It is the master
copy of who the user is; if any AI tool's own memory disagrees with it, this file wins.

## Steps
1. **User asks** (add, change, remove): make exactly that change in the right section; nothing else.
2. **AI notices a durable fact** (new project or brand, changed role, a working preference stated
   or corrected more than once): do NOT write it. Show the user the exact line and the section:
   "Add this to me.md? — <line>". Write it only after a clear yes.
3. **User corrects a fact**: remove or fix the line completely (no "used to..." leftovers), and fix
   the same fact anywhere else it was copied (e.g. an AI tool's memory).
4. **Monthly review** (when lint reports it, or the user asks):
   a. Read the whole file. List lines that look stale (e.g. "pending", "starting soon", dated plans).
   b. Check length; if over ~80 lines, propose what to compress or move into a project's hot cache.
   c. Ask about open items: values, 1-3 year goals, anything in [BRACKETS].
   d. Apply only what the user confirms.
5. Bump `updated:` in the frontmatter; keep `status:` accurate.
6. Append `## [YYYY-MM-DD] schema | me.md: <what changed>` to `wiki/brain-log.md`.
7. Commit ([[msk-skill-git-sync]]). After writing, re-read the file from disk to confirm the change landed.

## Rules
- Only facts the user stated or confirmed. No guesses, no AI inferences, no other people's details
  (the old ChatGPT account was shared by several people).
- Never add health details, passwords, IDs, bank or card numbers.
- Project details belong in that project's hot cache; me.md keeps one line per project.
- Write in English; keep the existing sections.

## Done when
- The file on disk shows the change, `updated:` is today, the log has the entry, lint passes.
