---
type: skill
skill: git-sync
system: Sync
trigger: start of work on a computer (pull); after changing vault files (commit); end of work (push)
schedule: none
inputs: changed files; tools/msk-sync.ps1
outputs: commits in the right repos; every repo pulled/pushed on GitHub
updated: 2026-10-22
---
# Commit, pull and push (multi-computer)

The user works on more than one computer. GitHub is the meeting point; every computer pulls before
working and pushes after. Only one computer should be working on the vault at a time.

## Repos (all inside the vault)
| Repo | Path | GitHub | Branch |
|---|---|---|---|
| MSK AI OS (OS, Pakistan Legal Aid, AI OS Blueprint) | `.` | msk-ai-os | main |
| Hamzi Prompts vault (formerly AI Brain) | `Projects/Hamzi Prompts` | ai-brain-vault | master |
| Prompts Website vault | `Projects/Prompts Website` | prompts-website-vault | master |
| Ubaid Automation vault | `Projects/Ubaid Automation` | ubaid-automation-vault | master |
| Hamzi website/LMS code | `Projects/Hamzi Prompts/projects/hamzi-lms` | hamzipromtps | main |
| Ubaidoo code | `Projects/Ubaid Automation/projects/ubaidooautomation` | ubaidooautomation | redesign/v2 |
| SoniPrompts code | `Projects/Prompts Website/projects/soniprompts` | none yet | master |

## Steps
1. **Before work (user, on Windows):** double-click `tools\MSK-SYNC-PULL.cmd` (same as `tools\msk-sync.ps1 -Pull`).
2. **During work (AI):** after each finished change, commit in the repo that changed: `git add` only
   that repo's files, a clear message (`ingest: ...`, `schema: ...`, `lint: ...`) plus the session's
   attribution lines. Never commit one project's files into another's repo.
3. **If committing from Claude's linked shell** (it cannot delete files): git leaves `.git/*.lock`
   files; rename them to `.git/stale-<name>-<date>` (never inside `.git/refs`). `msk-sync.ps1` deletes
   these leftovers on Windows.
4. **After work (user, on Windows):** double-click `tools\MSK-SYNC-PUSH.cmd` (same as `tools\msk-sync.ps1 -Push`). It commits any leftover vault notes,
   pulls with rebase, and pushes all repos; code repos only push existing commits. Read
   `tools\msk-sync-result.txt`; anything `FAILED` needs a look (usually a GitHub login or a conflict).
5. **Conflict:** if a pull fails, stop; resolve in that repo (keep both sides' text, never drop the
   other computer's work), commit, run `-Push` again.

## Rules
- Personal data never goes to GitHub: `Projects/Pakistan Legal Aid/cases/` and `.claude/settings.local.json`
  stay ignored; copy `cases/` between computers by USB.
- No secrets in any repo (passwords, keys, tokens, 2FA codes).
- A project's own rules on pushing still apply (e.g. Ubaid Automation: push only with the owner's go-ahead;
  the owner running `msk-sync.ps1` is that go-ahead).

## Done when
- `msk-sync-result.txt` shows `PUSH OK` for every repo that exists on this computer.
