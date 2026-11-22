---
type: topic
domains: [business, software]
sources: []
created: 2026-11-22
updated: 2026-11-22
status: active
---
# Klipr — hot cache

## What this project is
The record for **Klipr** (brand **KLIPR**, "Developed by MSK"), the owner's own **Windows desktop
app** that turns long videos **and live streams** into short, captioned vertical clips (Shorts /
Reels / TikTok) — **entirely on the user's PC**. See [[klipr-index]] and the project `CLAUDE.md`.
The app's source is its **own git repo outside the vault**; this folder holds the docs, architecture
notes and release log.

## How it's built (stack)
Electron shell + React/Vite UI + a Python **FastAPI** engine (sidecar on a random loopback port,
shared-token auth). Bundled: Python, **FFmpeg** (vendored; has libopenh264 + gblur, **lacks**
libx264/boxblur), **yt-dlp**, and **Whisper** (faster-whisper "base", local). Packaged with
**electron-builder** (NSIS) — the engine ships as sourceless `.pyc`.

## What it does (features)
- **Create** — import a YouTube link or file → local transcription → auto-find moments → captioned shorts.
- **Live** — record a Twitch/YouTube Live/Kick stream and auto-cut moments on chat spikes or loud reactions (F8 to grab the last N s).
- **Streams** — track creators across Twitch/YouTube/Kick: who's live now, viewers, clip-permission badges, past streams, "Watch live". **No API keys** (public endpoints).
- **Captions** (themes, karaoke/highlight, multilingual + RTL, presets), **Reframe** (9:16/1:1/3:4, face tracking, **Gaming split** = facecam + gameplay), **Effects** (grading, speed, hook, bars), **Music** (bg + ducking), **Queue** (batch), **Library**.
- Privacy: "Your video never leaves your device." **No forced watermark** on exports.

## Where everything lives (outside the vault)
- Source (own repo): `Downloads\Klipr\03-Source-And-Development\klipr-release`.
- Build project: `Downloads\Klipr-Build\app` → installer `Downloads\Klipr-Build\dist\Klipr-Setup-1.0.0.exe` (~297 MB).
- Sign-in/license: Cloudflare Worker `klipr-license-worker` → `https://klipr-license.klipr-license-worker.workers.dev` (`FREE_MODE=1`; Google OAuth). Code: `Downloads\klipr-license-worker`.

## Open threads / pending (owner's responsibility)
- **Code-signing certificate** not configured → installer is unsigned (SmartScreen warning on first run).
- **PyArmor** obfuscation of the engine not applied yet.
- Landing page in progress (built separately with Claude; info in `notes/klipr-landing-page-info.md`).

## Recently changed
- 2026-11-22 — Project created. Built the **Streams** tab, hardened **Google sign-in**, fixed the
  add-row layout, the **Settings icon** (→ faders) and the sign-in **logo**; rebuilt the installer.
  See [[klipr-log]].
