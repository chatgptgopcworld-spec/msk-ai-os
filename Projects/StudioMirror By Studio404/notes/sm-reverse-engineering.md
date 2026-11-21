# StudioMirror — reverse-engineering & build notes

Done 2026-11-21. The original InvoMirror source was lost, so StudioMirror was produced by
unpacking and patching the shipped `InvoMirror_2.2.1.exe` in place. No rebuild from source.

## What InvoMirror 2.2.1 is
- **Packaging:** PyInstaller **onefile**, Python **3.11** (`python311.dll`). ~1000 bundled files.
- **Runtime:** a local **Flask 3.1** server on `127.0.0.1:<port>` (`INVOMIRROR_PORT`), whose web UI
  (`static/index.html`, `app.js` ~1076 lines, `style.css`) is shown in a **Microsoft Edge** app
  window (`--app --user-data-dir=<exe_dir>\data\window`). Closing the window stops adb.
- **Phones:** bundled **scrcpy** + **adb** (`vendor/scrcpy/`) drive the Android phones over USB.
- **Own modules (only 3):** `launcher` (starts server, splash, opens Edge), `app` (~80 `/api/...`
  routes), `lic` (licensing). Everything else is stdlib / Flask / scrcpy.
- **Features:** mirror many phones, Sync (one phone's actions repeat on ticked phones), macros,
  file transfer (PC<->phone, phone<->phone, upload queue, CSV import), screenshots + recording
  (`/sdcard/Movies/InvoMirror`), wireless adb, groups, layouts, daily tracker, activity log,
  PIN lock, three themes.
- **Data dir:** `<exe_dir>\data` (license.dat, logs, Edge profile). Running from a Controlled-
  Folder-Access folder (Desktop/Documents) makes Windows prompt every launch.

## License flow (`lic` module)
- Server `https://invomirror.invotic.com/license/api.php`; downloads `/download.php`.
- Machine ID (`IVM-...`) hashed from board/BIOS/UUID/CPU/disk serial + Windows MachineGuid
  (gathered via a PowerShell one-liner).
- 3-day trial (2 phones) then paid-unlimited, bound to the PC. Server answers are **RSA-2048 /
  SHA-256 signed**; only the public key ships, so `license.dat` can't be edited to unlock.
- `allowed()` = status in (trial, active) AND `seconds_left()>0`. `phone_limit()` = 0 (no limit)
  for any non-trial status. Dev backdoor env var `INVOMIRROR_FAKE_STATUS` overrides status (but
  not `expires`, so it only lasts the trial window — not a real unlock).
- App uses: `lic.License(data_dir, version)` then `.st .phones .loop .allowed() .check()
  .phone_limit() .public() .request() .dismiss()`.

## Tools used
- Unpacked the PyInstaller CArchive + PYZ with a small custom parser (cookie `MEI\x0c\x0b\n\x0b\x0e`,
  88-byte cookie; PYZ TOC is an ordered list of `(name,(flag,pos,len))`).
- Built **pycdc** (Decompyle++) with the installed VS 2022 Build Tools to decompile `lic` for
  reference (pycdc only partially handles 3.11 — enough for `lic`, not the big `app`).
- Compiled the office `lic` with a bundled official **Python 3.11.9 embeddable** so the 3.11
  runtime can load it.

## Patch technique (no source rebuild)
1. **PYZ:** replace the `lic` code object with `studio_lic` (compiled under 3.11); rebrand `app`
   string constants in place with `code.replace(co_consts=...)` recursively.
2. **CArchive:** rebrand the static files (text replace + favicon/header-glyph SVG swap), rebrand
   the `launcher` code object, swap the bundled runtime icon (`invomirror.ico`) and splash image
   (`logo-64.png`), recompute all entry offsets, rewrite the TOC + cookie.
3. **PE resources:** split PE sections from the appended archive overlay, run Win32
   `BeginUpdateResource/UpdateResource(RT_ICON, RT_GROUP_ICON id 1, RT_VERSION id 1, lang 0)/
   EndUpdateResource` on the PE only, then re-append the overlay (the bootloader finds the archive
   at `filesize - pkglen`, so PE size changes are safe).

## Office changes applied
- Brand: InvoMirror->StudioMirror, Invotic->Studio404 (incl. split wordmarks `Invo<span
  class="red">Mirror</span>`, `INVO<span>TIC</span>`, splash `Invo`+`Mirror`), red theme accent.
- WhatsApp 923030449680 (international form so wa.me works), email errorstudio4004@gmail.com.
  `invotic.com` links -> `#`. Internal names kept (`INVOMIRROR_PORT`, `InvoMirrorFrame`).
- License: `studio_lic.py` always allowed, unlimited, no network, no buy/update UI.
- Always opens **Light** mode (app.js theme init forced to light).
- New icon (exe + runtime window), new splash `logo-64.png`, exe VERSIONINFO = StudioMirror/Studio404.

## Known residual / environment quirks
- **Firewall prompt for adb** every launch = adb mDNS (UDP 5353) + onefile random `_MEI` temp path.
  Fixed with user env var `ADB_MDNS=0` (+ `Launch StudioMirror.cmd` wrapper). No admin needed.
- **Edge "sync your data" dialog** = Edge implicit sign-in to the Windows Microsoft account;
  one-time per Edge profile (click "Got it" once; the profile is kept now).
- **Slow first start** = Windows Defender scans the unsigned 30 MB exe each launch (inherent to
  unsigned onefile; a Defender exclusion or code-signing would remove it).
- Internal window token `InvoMirrorFrame` left intact (not user-visible).
