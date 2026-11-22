---
type: topic
domains: [business, software]
sources: []
created: 2026-11-22
updated: 2026-11-22
status: active
---
# Klipr — index

Catalogue of this project. Start at [[klipr-hot]]; rules in the project `CLAUDE.md`.

## Pages
- [[klipr-hot]] — hot cache: what Klipr is, the stack, features, where the code lives, pending items.
- [[klipr-architecture]] — engine/UI/Electron/license design; Streams + live-clip internals (in `notes/`).
- [[klipr-build-and-release]] — exact steps to rebuild the installer (in `notes/`).
- [[klipr-auto-update-plan]] — plan to turn on auto-updates (GitHub Releases / Cloudflare R2); trigger keyword **`klipr-updates`** (in `notes/`).
- [[klipr-landing-page-info]] — marketing/landing-page information pack (in `notes/`).
- [[klipr-log]] — append-only project log.

## Features (in the app)
- **Create** — long video → captioned shorts (local Whisper transcription, auto moment-finding).
- **Live** — record Twitch/YouTube Live/Kick and auto-cut hype moments (chat + loudness, F8).
- **Streams** — creator dashboard: live-now, viewers, clip-permission, past streams, watch-live. No API keys.
- **Captions / Reframe / Effects / Music / Queue / Library** — styling, 9:16 reframe + gaming split, grading/speed/hook, background music, batch, rendered-clip library.

## Key facts
- Owner's own product; brand **KLIPR**, "Developed by MSK". Windows desktop, on-device.
- Stack: Electron + React/Vite + Python FastAPI; bundled Python/FFmpeg/yt-dlp/Whisper; electron-builder (NSIS).
- Source repo (own): `Downloads\Klipr\03-Source-And-Development\klipr-release`.
- Build → `Downloads\Klipr-Build\dist\Klipr-Setup-1.0.0.exe`.
- Sign-in via Google through the `klipr-license-worker` Cloudflare Worker (`FREE_MODE=1`).
- Hard rule: **Klipr never watermarks the user's exported clips.**
- Vendored FFmpeg lacks libx264/boxblur → use `libopenh264` + `gblur`.

## Related
- Sibling owner product (different app): [[sm-hot|StudioMirror]] (InvoMirror office edition).
