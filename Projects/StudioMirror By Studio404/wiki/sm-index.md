---
type: topic
domains: [business, software]
sources: []
created: 2026-11-21
updated: 2026-11-21
status: active
---
# StudioMirror — index

Catalogue of this project. Start at [[sm-hot]]; rules in the project `CLAUDE.md`.

## Pages
- [[sm-hot]] — hot cache: what StudioMirror is, what changed, where it lives, how to run.
- [[sm-reverse-engineering]] — how InvoMirror is built, its license flow, and the patch technique (in `notes/`).
- [[sm-log]] — append-only project log.

## Toolkit (`build-src/`)
- `build_studio.py` — rebrand PyInstaller archive (UI + code strings), swap office license, icon, splash logo, force light mode.
- `pe_brand.py` — rewrite exe icon + file-properties (VERSIONINFO) via Win32 UpdateResource.
- `make_icon.py` — generate `StudioMirror.ico` + `logo-64.png`.
- `studio_lic.py` — office license module (always allowed, unlimited, offline).
- `verify.py` — check a built exe's branding/theme/logo.

## Assets (`assets/`)
- `StudioMirror.ico` — app/exe icon.
- `logo-64.png` — splash logo.
- `icon_preview.png` — 256px icon preview.

## Key facts
- Base: InvoMirror 2.2.1 (owner's product, Invotic brand). Office edition = StudioMirror / Studio404.
- Runnable build: `%USERPROFILE%\StudioMirror\` (outside the vault).
- Contacts in-app: WhatsApp 923030449680, email errorstudio4004@gmail.com.
