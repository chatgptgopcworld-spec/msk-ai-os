---
name: vault-auto-save
description: Every change in this project must be saved, versioned, into the MSK AI OS vault folder "AI Automation - Studio-404" on the user's PC
metadata:
  type: feedback
  modified: 2026-11-17T09:46:08.048Z
---

User wants all files of this Claude project kept in their Obsidian/git vault **MSK AI OS**
(`C:\Users\dell\Documents\MSK AI OS`, git repo `chatgptgopcworld-spec/msk-ai-os`, private) in
`Projects/AI Automation - Studio-404/` ("|" not allowed in Windows names), every file renamed with a
version (v1.0.0 per kind, next version on change, old one to `archive/`). Set up 2026-11-17, commit 82865d0.

**Why:** user asked that anything new or changed in this project is saved to the vault automatically.

**How to apply:** at the end of ANY thread that changes project files or memory:
1. `bash /mnt/project-files/vault-sync/make-bundle.sh` (packs /mnt/project-files + memory into `vault-sync/s404-bundle.tar`).
2. device_commit_files that tar to `C:\Users\dell\Documents\MSK AI OS\Projects\AI Automation - Studio-404\_incoming\s404-bundle.tar` (force=true).
3. device_bash in that folder: `python3 tools/s404-vault-sync.py --bundle _incoming/s404-bundle.tar` (`--minor`/`--major` for bigger changes; `--private "<src path>"` for files with people's names/phones). It skips unchanged files and commits only that folder.
4. Append a line to its `wiki/s404-log.md` and commit. Never push (owner pushes with `tools\MSK-SYNC-PUSH.cmd`); never stage the vault's other uncommitted files.
Git in the linked shell leaves `.lock` files (no delete permission): mv them to `.git/stale-*`, never under `.git/refs`.
Hiring site files belong to the vault's separate project `HR ICS (PWD) STUDIO 404` (its own `tools/hr-vault-sync.py`); don't mix. See [[content-research-portal]], [[ics-studio404-site]].
