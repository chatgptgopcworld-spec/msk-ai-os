# HR ICS (PWD) STUDIO 404: project schema (inside MSK AI OS)

**What this is:** HR and hiring work for **ICS [PWD] Studio 404** (Faisalabad): job application form,
staff hiring sheet, interview evaluation, Apps Script backend, Netlify site, WhatsApp templates,
Meta/Instagram hiring ad. The work itself happens in the Claude project "HR | ICS (PWD) STUDIO 404";
this folder is its versioned vault copy.

Paths are relative to this folder (`Documents\MSK AI OS\Projects\HR ICS (PWD) STUDIO 404`).

**Read order:** this file -> `wiki/hr-hot.md` -> `wiki/hr-index.md` -> last 5 entries of `wiki/hr-log.md` -> `VERSIONS.md`.

## Layout
```
VERSIONS.md                 Every file: original name -> vault name, version, older versions. Generated.
hr-vault-manifest.json      Machine record behind VERSIONS.md (SHA-256 per file). Generated.
deliverables/hiring-forms/  HTML mockups, Google Forms setup script, setup guide, WhatsApp templates.
deliverables/apps-script/   Apps Script backend (Code.gs) and its page copies.
deliverables/netlify-site/  The live Netlify pages (rename back to index/staff/eval.html to deploy).
uploads/                    Logos, QR, screenshots and photos the owner uploaded.
notes/                      Copy of the Claude project memory.
archive/                    Older versions (never overwritten).
private/                    Applicants' personal data (screenshots with names/phones). NOT in git.
_incoming/                  Drop zone for the sync script. NOT in git.
tools/hr-vault-sync.py      Copies _incoming/ in with versioned names, archives old versions, commits.
wiki/hr-hot.md, hr-index.md, hr-log.md   Hot cache, index, append-only log.
raw/                        Sources (immutable).
```

## Rules
1. Company name exactly "ICS [PWD] Studio 404". No invented facts; unknowns stay [BRACKETS].
2. Versioning: every file starts at v1.0.0; a changed file gets the next version and the old one
   moves to `archive/`. Never overwrite or rename a versioned file by hand; use the sync script.
3. Applicants' names, phone numbers, CVs and evaluations never go to git or GitHub: keep them in `private/`.
4. No secrets: the staff PIN lives only in Apps Script Script Properties.
5. Don't mix projects.

## Operations (auto-save)
After any change in the Claude project (files or memory), the Claude thread doing the work:
1. copies the changed project files into `_incoming/` (same sub-paths, memory notes in `_incoming/memory/`),
2. runs `python3 tools/hr-vault-sync.py` (add `--minor`/`--major` for bigger changes,
   `--private "<path>"` for a file with applicants' data),
3. appends a line to `wiki/hr-log.md`.
The script commits only this project folder. Pushing to GitHub stays with the owner (`tools\MSK-SYNC-PUSH.cmd`).

## Git
No repo of its own; tracked by msk-ai-os. `private/` and `_incoming/` are ignored (this folder's `.gitignore`).
