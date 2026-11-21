# StudioMirror — Studio404 office edition

Built from `InvoMirror_2.2.1.exe` on 2026-11-21. Internal, non-commercial build.

## IMPORTANT — run it from HERE, not the Desktop
The app writes its working data to a `data\` folder **next to the exe**. The Desktop
and Documents are protected by Windows **Controlled Folder Access**, so running it
from there makes Windows ask permission on every launch and slows startup. This
folder (`C:\Users\dell\StudioMirror`) is not protected. Make a Desktop **shortcut**
to `StudioMirror.exe` if you want quick access — don't move the exe back onto the Desktop.

## What's branded (all StudioMirror / Studio404)
- Startup **splash**: wordmark, red glyph (the new logo), red progress bar.
- Web UI **header + footer** wordmark and logo glyph, **favicon**, **lock screen**.
- **Exe icon** (Explorer/taskbar) and **file properties** (Product/Company = StudioMirror/Studio404).
- WhatsApp **923030449680**, email **errorstudio4004@gmail.com**.
- Old `invotic.com` links now point to `#`.

## Behaviour changes
- **Always opens in Light mode** (you can still switch Dark/Night per session; next launch is Light again).
- **License**: always unlocked, unlimited phones, never expires, no server calls.

## If it still shows the old look after an update
Edge caches the UI. Close the app fully, delete the `window` cache folder, relaunch:
```
Taskkill /F /IM StudioMirror.exe /IM adb.exe /T
Remove-Item -Recurse -Force "C:\Users\dell\StudioMirror\data\window" -ErrorAction SilentlyContinue
```

## "Windows Firewall blocked adb.exe" every launch — FIXED
`adb` (used by scrcpy) opens a LAN device-discovery port (mDNS), and because the app
unpacks to a new temp folder each run, Windows treats it as new every time and keeps asking.
USB mirroring does not need it. Fix applied: the user environment variable `ADB_MDNS=0`
is set, which stops adb opening that port — no more prompt. For it to take effect on a
**direct** double-click of the exe you must **log off/on once** (or restart the PC) so Windows
picks up the new variable. Until then, launch with **`Launch StudioMirror.cmd`** (or make a
shortcut to that .cmd) — it sets the variable itself, so it works immediately.
If a prompt ever still appears, clicking **Cancel** is safe (USB keeps working).

## Microsoft Edge "syncing your browsing data" dialog
The app shows its window using Microsoft Edge, and Edge auto-signed into the Windows
Microsoft account. This is a **one-time** promo per Edge profile — click **"Got it"** once.
Now that the app lives in a fixed folder, the profile is kept, so it won't keep returning.

## Slow first start / Defender
The exe is unsigned, so Windows Defender scans all 30 MB on each launch (slow). Options:
add a Defender exclusion for this folder, or code-sign the exe. Not required to run.

## Rebuilding for a future version (two commands)
```
build-src\py311\python.exe build-src\build_studio.py NEW_PAID.exe build-src\studio_lic.py StudioMirror_arch.exe build-src\StudioMirror.ico build-src\logo-64.png
python build-src\pe_brand.py StudioMirror_arch.exe build-src\StudioMirror.ico StudioMirror.exe
```
- `build_studio.py` — rebrands static UI + `app`/`launcher` code strings, forces light mode,
  swaps the office license, runtime icon and splash logo. Edit the `STATIC`/`CODE` rule lists to tweak wording.
- `pe_brand.py` — rewrites the exe icon + file-properties (needs system Python with Pillow for icon gen; this step uses ctypes only).
- `make_icon.py` — regenerates `StudioMirror.ico` + `logo-64.png` (needs Pillow).
- `studio_lic.py` — the office license module.

Keep this folder off any public/shared location.
