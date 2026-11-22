# Klipr — architecture notes

How the app is put together, and the internals of the parts most likely to need maintenance.
Paths are relative to the source repo `Downloads\Klipr\03-Source-And-Development\klipr-release`
unless noted.

## Processes
- **Electron shell** (`electron/`): `main.js` (window, IPC via `secureHandle`), `sidecar.js`
  (spawns + supervises the engine, builds its environment in `engineEnv()`), `preload.js`
  (`window.batchclips.*` bridge: `engine()`, `openExternal()`, folder pickers, clipboard …).
- **Python engine** (`engine/`): FastAPI app in `main.py`, started by `run_server.py`. It **binds a
  random loopback port itself**, prints `BATCHCLIPS_READY {port, token}`, and watches the parent
  pid so it dies if Electron dies. Every `/api/*` call must carry the shared token
  (`x-batchclips-token`); health is open.
- **UI** (`ui/`): React + Vite. `api.js` is the thin client; `engine.js` reads the engine
  address/token from `window.batchclips`. `App.jsx` has the sidebar `NAV` + page routing.

## Engine environment (set by `sidecar.js` → `engineEnv`)
`BATCHCLIPS_DATA_DIR`, `_ASSETS_DIR`, `_UI_DIR`, `_FFMPEG`, `_FFPROBE`, `_YTDLP`,
`BATCHCLIPS_APP_VERSION = pkg.version`, `KLIPR_LICENCE_SERVER` (default the Worker URL),
and **`BATCHCLIPS_NO_BROWSER=1`** (so the engine never opens the Google tab — the UI does).

## Tooling quirks (important)
- **Vendored FFmpeg** has `libopenh264` (encoder) + `gblur`, but **no libx264 and no boxblur**.
  Encode with `-c:v libopenh264`; blur with `gblur=sigma=N`.
- **yt-dlp** is the bundled `vendor/yt-dlp.exe` (resolved by `downloader._ytdlp_exe`); in a packaged
  build `sys.executable -m yt_dlp` does NOT work (sys.executable is the app), so call the exe.
- **Whisper**: faster-whisper "base", local, CPU or CUDA (optional GPU pack).

## Sign-in / license (the part that broke in the field)
- Server: Cloudflare Worker `klipr-license-worker` (`src/service.js`). Endpoints
  `/api/desktop/config` (public: returns the Google client-id), `/api/desktop/sign-in`,
  `/api/desktop/check`, `/api/desktop/sign-out`. `FREE_MODE=1` → any verified Google account is
  allowed (no owner approval). `/api/desktop/check` returns **426** when
  `belowVersion(app_version, minimum_version)` — and `belowVersion("")` is **true**, so an empty
  app_version wrongly triggers "update required".
- Desktop OAuth (`engine/googleauth.py`): PKCE loopback flow. The app briefly runs an HTTP server on
  `127.0.0.1:0`, sends Google a loopback redirect, and hands the code to the Worker (which holds the
  client secret). `engine/account.py` talks to the Worker; `ui/AccountGate.jsx` drives the screen.
- **Hardening done 2026-11-22** (so sign-in can't silently fail):
  - `account._app_version()` always returns a valid `X.Y.Z` (fallback `1.0.0`) → no spurious 426.
  - `account._request()` retries transient network errors.
  - Engine no longer opens the browser (`BATCHCLIPS_NO_BROWSER`); `AccountGate` opens the consent
    URL via `window.batchclips.openExternal` (→ `shell.openExternal`, reliable) and shows a manual
    "Open the sign-in page" fallback link.

## Streams tab (new 2026-11-22)
- `engine/streamers_feature.py` — keyless live-hunt (pasted from the GTA6 Clipper, adapted):
  `live_status` / `past_streams` / `clip_rule` / `hunt` over Twitch (public `gql.twitch.tv` with
  Twitch's public web Client-ID), Kick (`kick.com` API v2, often Cloudflare-blocked), YouTube
  (`/live` HTML scrape + bundled yt-dlp for past streams). 60 s / 600 s caches.
- `engine/streams.py` — the user's streamer LIST lives at `DATA_DIR/streamers.json`, seeded once
  from the packaged `streamers.default.json`; `clip_rules.json` is read-only. Functions:
  `list_streamers / edit / hunt / past / source_url`.
- Routes in `main.py`: `GET /api/streams` (list), `POST /api/streams` (add/remove, GATED),
  `GET /api/streams/hunt|past|source`.
- UI `pages/Streams.jsx` — language switcher (en/fr/es/pt/de/ar/it/tr), add-by-link/name,
  live/offline + viewers, colour-coded clip-permission badges (allowed/ask/no/unknown) with notes,
  past-streams expand, remove, 60 s auto-refresh. **"Watch live"** calls `App.watchLive(r)` which
  builds the stream URL and hands it to the **Live** tab (prefilled + auto-started); a `no`-clip
  channel is confirmed first.
- `Live.jsx` gained an `incoming` prop (prefill + auto-start once per nonce).

## Reframe / Gaming split (earlier work, in the same release)
- `engine/clipper.py` builds the gaming filter: facecam cover-cropped on top, gameplay below over a
  blurred fill, draggable/zoomable (`gaming_game_zoom`, `gaming_game_pos`). UI: `FacecamPicker.jsx`
  (draggable webcam box over the source) + `PhonePreview.jsx` `GamingSplit`.

## Live demo harness (dev, not shipped)
Scratch scripts run the engine from source on **57019** (token `LIVEDEMO`) and serve the built UI on
**8793** via a `_live.html` bridge that stubs `window.batchclips`. Used to preview the UI without
packaging. Not part of the app.
