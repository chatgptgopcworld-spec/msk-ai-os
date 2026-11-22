# Klipr (record in MSK AI OS)

**Klipr** (brand **KLIPR**, *Developed by MSK*) is the owner's own Windows desktop app that turns
long videos **and live streams** into short, captioned vertical clips — **on the user's own PC**,
privately, with no forced watermark.

This vault folder is the **record** for the project (wiki + architecture/build notes). The app's
**source is its own git repo outside the vault**:

- **Source:** `%USERPROFILE%\Downloads\Klipr\03-Source-And-Development\klipr-release` (Electron + React/Vite UI + Python FastAPI engine).
- **Build project:** `%USERPROFILE%\Downloads\Klipr-Build\app` → installer `…\Klipr-Build\dist\Klipr-Setup-1.0.0.exe`.
- **Sign-in/license:** Cloudflare Worker `klipr-license-worker` → `https://klipr-license.klipr-license-worker.workers.dev` (`FREE_MODE=1`).

Start at `wiki/klipr-hot.md`, then `wiki/klipr-index.md`, then `notes/`.

## Build a release (short version)
1. Sync changed source into the build project: `app/engine` (copy `*.py` + the two `*.json`, then
   compile to `.pyc` with the bundled `vendor\python\python.exe`), `app/ui/dist` (production files
   only), `app/electron/*`.
2. `npx electron-builder --win --x64` from `app/`.
Full steps: `notes/klipr-build-and-release.md`.

## Pending (owner's responsibility)
- Code-signing certificate (installer is currently unsigned).
- PyArmor obfuscation of the engine.
