# Klipr: project schema (inside MSK AI OS)

**What this is:** the record for **Klipr**, the owner's own Windows desktop app (brand **KLIPR**,
"Developed by MSK") that turns long videos **and live streams** into short, captioned vertical
clips — entirely **on the user's PC**. This folder is the documentation/record: the app's full
source is its **own git repo outside the vault** (see "Where the code lives"), so the vault keeps
the wiki, architecture notes and build/release record, not a copy of the source.

Paths below are relative to this folder (`Documents\MSK AI OS\Projects\Klipr`). Absolute Windows
paths use `%USERPROFILE%` (`C:\Users\dell`); never hard-code the username.

**Read order:** this file → `wiki/klipr-hot.md` → `wiki/klipr-index.md` → last 5 entries of
`wiki/klipr-log.md` → `notes/klipr-architecture.md` → `notes/klipr-build-and-release.md`.

## Where the code lives (OUTSIDE the vault)
| What | Path | Notes |
|---|---|---|
| App source (own git repo, branch `main`) | `%USERPROFILE%\Downloads\Klipr\03-Source-And-Development\klipr-release` | Electron shell + React/Vite UI (`ui/`) + Python FastAPI engine (`engine/`). |
| Build project (electron-builder) | `%USERPROFILE%\Downloads\Klipr-Build\app` | Packs the installer; engine ships as sourceless `.pyc` under `engine/`. |
| Installer output | `%USERPROFILE%\Downloads\Klipr-Build\dist\Klipr-Setup-1.0.0.exe` | ~297 MB NSIS; rebuilt per release. |
| License / sign-in server (Cloudflare Worker) | `%USERPROFILE%\Downloads\klipr-license-worker` | Live at `https://klipr-license.klipr-license-worker.workers.dev`; `FREE_MODE=1`. |
| Distribution archive | `%USERPROFILE%\Downloads\Klipr` | `01-Documentation` … `07-Installed-App-Snapshot`, manifest + verify script. |

## Layout (this vault folder — the record only)
```
README.md                         What Klipr is, where the code is, how a release is built.
notes/klipr-architecture.md       Engine/UI/Electron/license design; the Streams + live-clip internals.
notes/klipr-build-and-release.md  Exact steps to rebuild the installer (sync engine .pyc + JSON, UI, electron, electron-builder).
notes/klipr-landing-page-info.md  Marketing/landing-page information pack (copy for site builds).
wiki/klipr-hot.md|klipr-index.md|klipr-log.md   Hot cache, index, append-only log.
raw/                              Drop Klipr sources/screenshots here (not raw/inbox).
```

## Rules
1. This is the owner's **own** product. The app's source is a **separate git repo** in
   `Downloads\Klipr\…\klipr-release`; commit app changes **there**, not into the vault.
2. **Never commit binaries or installers** into the vault (`*.exe`, the 297 MB installer, bundled
   `vendor/python`, `vendor/ffmpeg`, models). This folder holds docs only.
3. **No secrets.** The license worker's `GOOGLE_CLIENT_SECRET`, any signing cert, and PyArmor keys
   stay out of the vault and out of git. Only the public client-id / public worker URL may appear.
4. **The logo must never appear on exported clips** (a hard product rule): Klipr never brands the
   user's output; the only watermark is the user's own optional signature.
5. Don't mix projects (vault rule). Sibling owner products: `StudioMirror By Studio404/` (InvoMirror
   office edition). Klipr is a different product (video clipping), not part of Studio404.

## Operations (rebuild the installer — summary; full steps in notes)
From the build project, after syncing changed source in:
1. `app/engine` ← copy engine `*.py` + the two `*.json`, compile to `.pyc` with the **bundled**
   `vendor\python\python.exe` (`compile_engine.py`, optimize=2). The `*.json` copy is the step
   earlier builds missed — without it Streams loads an empty list.
2. `app/ui/dist` ← production UI only (`index.html`, `export-controls.js`, `hook-styles.js`,
   `assets/`); not the demo side-files (`_live.html`, `_oauth_*`, `_sample.mp4`).
3. `app/electron/*` ← any changed shell files (e.g. `sidecar.js`).
4. `npx electron-builder --win --x64` from `app/` → `../dist/Klipr-Setup-1.0.0.exe`.
After any change here, append to `wiki/klipr-log.md` and commit (see [[msk-skill-git-sync]]).

## Git
No repo of its own; this folder is tracked by the **msk-ai-os** repo. The app source, build project
and license worker are their own repos/folders outside the vault.
