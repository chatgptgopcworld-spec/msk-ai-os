# Klipr — build & release

How to rebuild the Windows installer from the current source. The build project is a separate
electron-builder app; the engine ships as sourceless `.pyc`.

Paths (absolute, `%USERPROFILE%` = `C:\Users\dell`):
- Source repo: `Downloads\Klipr\03-Source-And-Development\klipr-release`
- Build project: `Downloads\Klipr-Build\app`
- Bundled Python (compile with THIS): `Downloads\Klipr-Build\app\vendor\python\python.exe`
- Output: `Downloads\Klipr-Build\dist\Klipr-Setup-1.0.0.exe`

## electron-builder config (in `app/package.json` → `build`)
NSIS target, x64; engine shipped via `extraResources` → `app.asar.unpacked/engine`; `afterPack`
flips @electron/fuses (RunAsNode off, asar-only). electron-builder 26.18.0 is cached under
`%LOCALAPPDATA%\npm-cache\_npx\…`; electron 33.4.11 is already downloaded.

## Steps
1. **Build the UI** (from the source repo): `npm run build:ui` → `ui/dist`. (Dev uses a
   `rebuild_live.mjs` helper that also preserves demo side-files; for a release only the production
   files matter.)
2. **Sync the engine** into `app/engine`:
   - Copy all `engine\*.py` **and the two `engine\*.json`** (`streamers.default.json`,
     `clip_rules.json`) into `app\engine`.
   - Compile to sourceless `.pyc` with the **bundled** python:
     `vendor\python\python.exe -I compile_engine.py app\engine` (optimize=2, removes `.py`).
   - **The `*.json` copy is the step earlier builds forgot** — without it Streams loads an empty
     list and every clip badge shows "unknown". Engine data files are read via `Path(__file__).parent`.
3. **Sync the UI** into `app\ui\dist`: copy **only** `index.html`, `export-controls.js`,
   `hook-styles.js`, `assets\*` — NOT the demo side-files (`_live.html`, `_oauth_ok.html`,
   `_oauth_warn.html`, `_sample.mp4`).
4. **Sync changed Electron files** into `app\electron\` (e.g. `sidecar.js`). `app\electron` mirrors
   the source `electron/` folder; diff before overwriting.
5. **Package**: from `app\`, `npx electron-builder --win --x64` (optionally
   `--config.directories.output=../dist`). Output lands in `Downloads\Klipr-Build\dist`.

## Verify a build
- Packaged engine: `dist\win-unpacked\resources\app.asar.unpacked\engine` has `streams.pyc`,
  `streamers_feature.pyc`, `streamers.default.json`, `clip_rules.json`.
- Run the packaged engine directly for a smoke test:
  `cd dist\win-unpacked\resources\app.asar.unpacked` then
  `vendor\python\python.exe -m engine.run_server --token SMOKE` → read the `BATCHCLIPS_READY` port,
  then `curl -H "x-batchclips-token: SMOKE" http://127.0.0.1:<port>/api/streams?lang=en` (expect 200).
- Or launch `dist\win-unpacked\Klipr.exe` and sign in.

## Pending for a shippable release (owner)
- **Code-signing certificate** — unsigned today, so SmartScreen warns on first run. electron-builder
  logs "no code signing certificate configured, signing is skipped".
- **PyArmor** — engine `.pyc` are sourceless but not obfuscated.
Both are external purchases and the owner's responsibility.
