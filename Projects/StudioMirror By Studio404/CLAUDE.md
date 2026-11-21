# StudioMirror By Studio404: project schema (inside MSK AI OS)

**What this is:** the record and build toolkit for **StudioMirror**, the owner's office /
non-commercial edition of **InvoMirror** (the owner's own product, brand "Invotic"). InvoMirror
mirrors and controls many Android phones at once from a Windows PC. StudioMirror is InvoMirror
2.2.1 re-skinned to the owner's **Studio404** brand and unlocked for internal office use. The
work was done by reverse-engineering and patching the shipped InvoMirror exe (the original
source was lost), so this project holds the build **toolkit** and documentation, not the app's
full source.

The live, runnable build is **outside the vault** at `%USERPROFILE%\StudioMirror\`
(`C:\Users\dell\StudioMirror\`): `StudioMirror.exe` (~30 MB), `Launch StudioMirror.cmd`,
`build-src\` (toolkit + a bundled Python 3.11). The 30 MB exe and the bundled Python are **not**
copied into the vault (too large / machine binaries); this folder keeps the small toolkit source,
assets and notes so the build can be reproduced from any fresh InvoMirror release.

Paths below are relative to this folder (`Documents\MSK AI OS\Projects\StudioMirror By Studio404`).

**Read order:** this file -> `wiki/sm-hot.md` -> `wiki/sm-index.md` -> last 5 entries of `wiki/sm-log.md`
-> `notes/sm-reverse-engineering.md` -> `README.md`.

## Layout
```
README.md                      The office-edition readme (what changed, how to run, how to rebuild).
build-src/build_studio.py      Rebrands the PyInstaller archive: static UI (index.html/app.js/style.css)
                               + app/launcher code-string constants, swaps the office license module,
                               runtime icon and splash logo-64.png, forces Light mode. Self-verifies.
build-src/pe_brand.py          Rewrites the exe ICON + file-properties (VERSIONINFO) via Win32
                               UpdateResource on the PE part only, then re-appends the archive overlay.
build-src/make_icon.py         Generates StudioMirror.ico (16-256) + logo-64.png (needs Pillow).
build-src/studio_lic.py        The office license module: always allowed, unlimited phones, no network.
build-src/verify.py            Reads a built exe and checks branding/theme/logo swapped correctly.
assets/StudioMirror.ico        App/exe icon (dark square, phone + red-screen mirror motif).
assets/logo-64.png             Splash-screen logo (64x64).
assets/icon_preview.png        256px preview of the icon.
notes/sm-reverse-engineering.md  How InvoMirror is built, the license flow, and the patch technique.
wiki/sm-hot.md, sm-index.md, sm-log.md   Hot cache, index, append-only log.
```

## Rules
1. This is the owner's **own** product; the office build is an internal, non-commercial edition.
   Keep it off any public/shared location. Do not redistribute.
2. Never commit binaries: `*.exe`, `*.zip`, bundled `py311/` are git-ignored (this folder's `.gitignore`).
   The runnable exe lives at `%USERPROFILE%\StudioMirror\`, not here.
3. No secrets: the InvoMirror RSA private key is NOT here (only the public key appears, inside the
   original exe). `studio_lic.py` contacts no server and holds no keys.
4. Don't mix projects (vault rule). Studio404-brand sibling projects: `HR ICS (PWD) STUDIO 404/`,
   `AI Automation - Studio-404/`, `Moonshot Media/` (owner's brands).

## Operations (rebuild for a new InvoMirror version)
From `%USERPROFILE%\StudioMirror\build-src\` (which has the bundled Python 3.11):
1. `py311\python.exe build_studio.py NEW_PAID.exe studio_lic.py StudioMirror_arch.exe StudioMirror.ico logo-64.png`
2. `python pe_brand.py StudioMirror_arch.exe StudioMirror.ico StudioMirror.exe`  (system Python; Pillow for icon gen)
Edit the `STATIC` / `CODE` rule lists in `build_studio.py` to change wording. After a change here,
append a line to `wiki/sm-log.md` and commit this folder (see [[msk-skill-git-sync]]).

## Git
No repo of its own; tracked by the msk-ai-os repo. Binaries ignored via this folder's `.gitignore`.
