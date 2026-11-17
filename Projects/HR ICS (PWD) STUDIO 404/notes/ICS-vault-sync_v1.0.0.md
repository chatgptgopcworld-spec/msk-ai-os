---
name: vault-sync
description: Auto-save rule: after any change to project files or memory, copy them into the owner's MSK AI OS vault with versioned names and commit
metadata:
  type: project
  modified: 2026-11-17T09:33:12.987Z
---

Since 2026-11-17 the owner wants every new or changed project file and memory saved into their vault automatically.

Vault folder (owner's Windows PC, device folder "MSK AI OS"): `C:\Users\dell\Documents\MSK AI OS\Projects\HR ICS (PWD) STUDIO 404\` (vault is an Obsidian + git repo `msk-ai-os`; read its `CLAUDE.md` / `AIOS/msk-vault-map.md` rules; project rules in that folder's `CLAUDE.md`).

**How to apply (end of any thread that changed files or memory, without asking):**
1. Copy each changed file to `/mnt/project-files/.vault-staging/<same rel path>` (uploads/hearth files must be copied there first: device_commit_files gives 404 for `/mnt/project-files/uploads/...` directly). Memory files go to `.vault-staging/memory/<file>.md`.
2. `device_commit_files` each one to `~/mnt/MSK AI OS/Projects/HR ICS (PWD) STUDIO 404/_incoming/<rel path>`.
3. device_bash in that folder: `python3 tools/hr-vault-sync.py` (patch bump default; `--minor` new feature, `--major` redesign; `--private "uploads/hearth/<id>"` for any upload showing applicants' names/phones/CVs). It archives the old version, rewrites VERSIONS.md, commits only that folder, renames git .lock files (linked shell can't delete).
4. Append a line to its `wiki/hr-log.md` (and commit). Owner pushes to GitHub himself with `tools\MSK-SYNC-PUSH.cmd`.
Only works while the owner's PC is connected; if not reachable, say so and sync next time.

Names: every kind of file has its own version, starting v1.0.0 (e.g. `ICS-Apps-Script-Code_v1.0.0.gs`); names are fixed in `hr-vault-manifest.json`. Netlify pages must be renamed back to index/staff/eval.html to deploy.
