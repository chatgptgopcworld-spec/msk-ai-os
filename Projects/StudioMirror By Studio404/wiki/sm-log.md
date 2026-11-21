# StudioMirror — log

Append-only, newest at the bottom.

## [2026-11-21] schema | Project created
- New project `Projects/StudioMirror By Studio404/` for the owner's office edition of InvoMirror.
- Added `CLAUDE.md`, `README.md`, `notes/sm-reverse-engineering.md`, `wiki/sm-hot.md|sm-index.md|sm-log.md`.
- Copied build toolkit into `build-src/` (build_studio.py, pe_brand.py, make_icon.py, studio_lic.py, verify.py) and `assets/` (StudioMirror.ico, logo-64.png, icon_preview.png). Exe + bundled Python left outside the vault (git-ignored).

## [2026-11-21] build | StudioMirror office edition built
- Unpacked and patched `InvoMirror_2.2.1.exe` (source was lost): rebranded to StudioMirror / Studio404 across UI, splash, icon, favicon, lock screen and exe file-properties.
- License replaced with `studio_lic.py`: always allowed, unlimited phones, no server calls.
- Forced Light mode on open. WhatsApp 923030449680, email errorstudio4004@gmail.com; invotic.com links -> `#`.
- Fixed the per-launch Windows Firewall prompt for adb via user env var `ADB_MDNS=0` + `Launch StudioMirror.cmd` wrapper.
- Runnable build placed at `%USERPROFILE%\StudioMirror\` (off the Desktop to avoid Controlled Folder Access prompts).
