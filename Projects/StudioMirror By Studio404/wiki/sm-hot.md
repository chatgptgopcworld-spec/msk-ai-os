---
type: topic
domains: [business, software]
sources: []
created: 2026-11-21
updated: 2026-11-21
status: active
---
# StudioMirror — hot cache

## What this project is
The record + build toolkit for **StudioMirror**, the owner's office / non-commercial edition of
**InvoMirror** (the owner's own product under the **Invotic** brand). InvoMirror mirrors and
controls many Android phones at once from a Windows PC. StudioMirror = InvoMirror 2.2.1 re-skinned
to the owner's **Studio404** brand and unlocked for internal office use. See [[sm-index]] and the
project `CLAUDE.md`.

## How this was built
The InvoMirror source was lost, so StudioMirror was made by **unpacking and patching the shipped
`InvoMirror_2.2.1.exe`** (PyInstaller onefile, Python 3.11, Flask UI in an Edge window, scrcpy +
adb for phones). A toolkit does it repeatably: `build_studio.py` (rebrand UI + code strings, swap
office license, icon, splash logo, force light mode), `pe_brand.py` (exe icon + file-properties),
`make_icon.py`, `studio_lic.py`. Full method: `notes/sm-reverse-engineering.md`.

## What changed vs the paid build
- Brand everywhere: InvoMirror -> StudioMirror, by Invotic -> by Studio404 (incl. the styled
  wordmarks and the startup splash), red accent.
- WhatsApp **923030449680**, email **errorstudio4004@gmail.com**; old `invotic.com` links -> `#`.
- New app/exe icon + splash logo; exe file-properties = StudioMirror / Studio404.
- **Always opens in Light mode.**
- **License always unlocked**: unlimited phones, never expires, no server calls (`studio_lic.py`).

## Where it lives
Runnable build is OUTSIDE the vault at `%USERPROFILE%\StudioMirror\` (`StudioMirror.exe`,
`Launch StudioMirror.cmd`, `build-src\` with a bundled Python 3.11). The vault holds only the
small toolkit source, assets and notes (the 30 MB exe and bundled Python are not committed).

## How to run / known quirks
- Run from `%USERPROFILE%\StudioMirror\` (NOT the Desktop — Controlled Folder Access prompts there).
- Firewall prompt for `adb.exe` is fixed with user env var `ADB_MDNS=0` + `Launch StudioMirror.cmd`.
- Edge "sync your data" dialog is a one-time per-profile promo — click "Got it" once.
- Slow first start = Defender scanning the unsigned exe each launch (add an exclusion if wanted).

## Recently changed
- 2026-11-21 — Project created; StudioMirror office edition built, rebranded, unlocked, light-mode,
  firewall fix. See [[sm-log]].
