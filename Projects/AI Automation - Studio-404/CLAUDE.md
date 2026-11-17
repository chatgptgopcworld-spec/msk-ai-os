# AI Automation - Studio-404: project schema (inside MSK AI OS)

**What this is:** the versioned vault copy of the Claude project "AI Automation | Studio-404"
(the folder name uses "-" because Windows does not allow "|"). Main work: the **ICS Research
Portal** (content research tracker for TikTok, YouTube, Facebook, Instagram, Spotify): Netlify site
https://ics-research-portal.netlify.app, Google Apps Script backend + Google Sheet, Chrome extension,
the design rounds that led to the "Nebula" design, ICS favicons and logos, and the screenshots
the owner uploaded. The ICS hiring site (ics-studio404.netlify.app) lives in its own project,
`Projects/HR ICS (PWD) STUDIO 404/`; only the few hiring screenshots uploaded here are kept here.

Paths are relative to this folder (`Documents\MSK AI OS\Projects\AI Automation - Studio-404`).

**Read order:** this file -> `wiki/s404-hot.md` -> `wiki/s404-index.md` -> last 5 entries of `wiki/s404-log.md` -> `VERSIONS.md`.

## Layout
```
VERSIONS.md                          Every file: original name -> vault name, version, older versions. Generated.
s404-vault-manifest.json             Machine record behind VERSIONS.md (SHA-256 per file). Generated.
deliverables/research-portal-site/   The live Netlify site files (index, save page, favicon, manifest).
deliverables/chrome-extension/       Chrome extension (MV3) files.
deliverables/apps-script/            Google Apps Script backend (Code.gs).
deliverables/portal-source/          Source the site is built from (app.src.js, base.css, build scripts).
deliverables/portal-docs/            Setup guide (README) and netlify.toml.
deliverables/portal-designs/         Design rounds: R1 v1.x, R2 v2.x, R3 v3.x (Nebula v3.4.0 = chosen); build/ = mockup build tools.
assets/logos/, assets/favicon/       Platform logos, ICS logo, favicon set.
packages/                            The zips as shared (original file names inside; use these to deploy/load).
previews/                            Preview images of the extension and the mobile view.
uploads/                             Logos and screenshots the owner uploaded.
notes/                               Copy of the Claude project memory.
archive/                             Older versions (never overwritten).
private/                             Screenshots with applicants' names/phones. NOT in git.
_incoming/                           Drop zone for the sync script. NOT in git.
tools/s404-vault-sync.py             Copies a drop in with versioned names, archives old versions, commits.
wiki/s404-hot.md, s404-index.md, s404-log.md   Hot cache, index, append-only log.
```

## Rules
1. Versioning: every kind of file starts at v1.0.0; a changed file gets the next version and the old
   one moves to `archive/`. Never overwrite or rename a versioned file by hand; use the sync script.
2. To deploy or load (Netlify, Chrome "Load unpacked", Apps Script), use original names: unzip the
   package in `packages/` or rename back using the first column of `VERSIONS.md`.
3. People's names, phone numbers and evaluations never go to git or GitHub: keep them in `private/`.
4. No secrets: the portal password lives only in Apps Script (salted hash) and with the owner.
5. Don't mix projects.

## Operations (auto-save)
After any change in the Claude project (files or memory), the Claude thread doing the work:
1. in the cloud: `bash /mnt/project-files/vault-sync/make-bundle.sh` (packs all project files + memory),
2. copies `/mnt/project-files/vault-sync/s404-bundle.tar` to this folder's `_incoming/s404-bundle.tar`
   (device_commit_files, force=true),
3. on the device, from this folder: `python3 tools/s404-vault-sync.py --bundle _incoming/s404-bundle.tar`
   (add `--minor`/`--major` for bigger changes, `--private "<source path>"` for a file with people's data);
   unchanged files are skipped, changed ones get the next version, then it commits this folder only,
4. appends a line to `wiki/s404-log.md` and commits it.
Pushing to GitHub stays with the owner (`tools\MSK-SYNC-PUSH.cmd` in the vault root).

## Git
No repo of its own; tracked by msk-ai-os. `private/` and `_incoming/` are ignored (this folder's `.gitignore`).
