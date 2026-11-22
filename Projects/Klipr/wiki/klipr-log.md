# Klipr — log

Append-only, newest at the bottom.

## [2026-11-22] schema | Project created
- New project `Projects/Klipr/` for the owner's Klipr desktop app (record + docs; source is its own repo outside the vault).
- Added `CLAUDE.md`, `README.md`, `notes/klipr-architecture.md`, `notes/klipr-build-and-release.md`, `notes/klipr-landing-page-info.md`, `wiki/klipr-hot.md|klipr-index.md|klipr-log.md`, `raw/`.
- Registered in the vault map (section 6 table + rule 10), `Projects/CLAUDE.md`, and `wiki/brain-index.md`.

## [2026-11-22] build | Streams tab, sign-in hardening, UI fixes, installer rebuilt
- **Streams tab** (new, below Live / before Library): added engine `streamers_feature.py` (keyless live-hunt via public Twitch GQL / Kick API / YouTube) + `streams.py` (user list under DATA_DIR, seeded from `streamers.default.json`; `clip_rules.json`) + routes `GET/POST /api/streams`, `/api/streams/hunt|past|source`. UI `pages/Streams.jsx` (8 languages, add-by-link/name, live-now, viewers, clip-permission badges, past streams, "Watch live"). "Watch live" hands the stream to the Live tab which runs the real chat+loudness clipper. Adapted YouTube past-streams to the bundled `yt-dlp.exe`.
- **Google sign-in hardened** (users reported it "not appearing" / a 426 on launch):
  - `engine/account.py`: `_app_version()` always sends a valid X.Y.Z (fallback `1.0.0`) so an empty/garbled version can't trigger the server's 426 "update required"; `_request()` retries transient network failures.
  - `electron/sidecar.js`: `BATCHCLIPS_NO_BROWSER=1` so the engine no longer opens the consent tab; `ui/AccountGate.jsx` opens it via `shell.openExternal` with a visible "Open the sign-in page" fallback link.
  - Worker already has `FREE_MODE=1` (any Google account; no owner-approval wall); `…/api/desktop/config` verified live.
- **UI fixes**: Streams add-row `<select>` was stretching full-width and collapsing the input (global `select{width:100%}`) — fixed `.streams-select` (`width:auto;flex:0 0 auto;min-width:128px`, kept the chevron). **Settings icon** changed from the busy gear to clean horizontal faders. Sign-in **logo** back card recoloured `#2C8985 → #2BDAC4` so all three cards show (was merging into the dark tile).
- **Installer rebuilt**: `Klipr-Setup-1.0.0.exe` (~297 MB, NSIS, @electron/fuses flipped). Code-signing skipped (no cert). Verified packaged engine has `streams.pyc` + both JSON; packaged engine returns 200 for `/api/streams` and `/api/streams/hunt`; sign-in screen renders the Google button.
- App source changes committed in the klipr-release repo (Streams feature, sign-in, UI fixes, plus the earlier gaming-split work).

## [2026-11-22] plan | Auto-update setup plan written
- Found auto-update is coded but OFF: `package.json` build has `"publish": null`, so no `app-update.yml` in the packaged app and no `latest.yml` in dist — no feed. Installed users get no update, and no error shows (the 20s check fails silently to a log warning). Code is ready (`electron/updater.js`, electron-updater 6.8.9, NSIS in-place install).
- Wrote `notes/klipr-auto-update-plan.md`: Plan A GitHub Releases (recommended, free, unlimited bandwidth for the ~297 MB installer) and Plan B Cloudflare R2 (free egress, own brand domain, more manual). Each with one-time setup + per-release checklist + gotchas. Only change needed is the `publish` block + an upload/release step; updater code stays as-is. Unsigned-build caveat noted (`publisherName` must not be enforced, or `ERR_UPDATER_INVALID_SIGNATURE`).
- **Trigger keyword `klipr-updates`**: when the owner types it, read the plan and start the setup (default Plan A), after confirming repo/domain.
