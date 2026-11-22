---
type: note
domains: [software]
sources: []
created: 2026-11-22
updated: 2026-11-22
status: planned
---
# Klipr — auto-update setup plan

> **Trigger keyword: `klipr-updates`**
> Jab owner chat me likhein **`klipr-updates`**, is page ko padh ke setup shuru karna hai
> (default: Plan A — GitHub Releases, jab tak owner R2 na bolein). Pehle owner se repo/domain
> aur chosen path confirm karna, phir execute.

## Abhi ki haalat (why this is needed)
Auto-update ka code poora mojood hai (`electron/updater.js`, `electron-updater` 6.8.9,
NSIS in-place installer) par **switched OFF** hai:
- `package.json` build me `"publish": null`.
- Packaged app me `app-update.yml` nahi; dist me `latest.yml` nahi → koi feed URL hi nahi.
- Natija: installed users ko update nahi jaata; **error bhi nahi dikhta** — check chupke se
  fail hoke sirf log me warning chhodta hai (crash/hang nahi).

Design flow (chaalu hone par): launch ke ~20s baad ek check → feed se `latest.yml` →
UI ke andar "update available" notification → user Install kare → background download →
`quitAndInstall()` → NSIS purani install ko replace karke restart. `autoDownload=false`
(pehle poochta hai), "Later" → 20 min baad reminder, `autoInstallOnAppQuit=true`.

Relevant code: `electron/updater.js`, `electron/preload.js` (`app:check-updates`),
UI listener `app:update-available`. Repo: `Downloads\Klipr\03-Source-And-Development\klipr-release`.

---

## Plan A — GitHub Releases (RECOMMENDED, free, default)
Kyun: bandwidth **unlimited + free** (installer ~297 MB, is liye ye decisive hai), ready
"Releases" UI, upload ek command, code me sabse kam change.

### One-time setup
1. GitHub repo banao (public sabse simple; private bhi chalega par token embed karna padta hai).
   Maan lo: `OWNER/klipr-desktop`.
2. `package.json` → `build` me `publish: null` ko is se replace karo:
   ```json
   "publish": [
     { "provider": "github", "owner": "OWNER", "repo": "klipr-desktop" }
   ]
   ```
   Isse build par app ke andar `app-update.yml` embed hoga aur dist me `latest.yml` banega.
3. **Unsigned-build caveat**: build par cert nahi, is liye `app-update.yml` me `publisherName`
   enforce nahi hona chahiye (warna download `ERR_UPDATER_INVALID_SIGNATURE` se reject). Build ke
   baad `dist\win-unpacked\resources\app-update.yml` kholo — `publisherName` line **na ho**
   (unsigned par electron-builder normally daalta bhi nahi). Aage cert aa jaye to sign kar dena.

### Har release par (release checklist)
1. Version bump: `package.json` `"version"` (e.g. `1.0.1`). Changelog/release notes likho.
2. Build (maujooda build-and-release steps se): engine sync → `.pyc` compile → UI build →
   electron sync → `npx electron-builder --win --x64`. (Detail: `klipr-build-and-release.md`.)
3. `dist\` me ye 3 banenge: `Klipr-Setup-1.0.1.exe`, `latest.yml`, `Klipr-Setup-1.0.1.exe.blockmap`.
4. GitHub release create + teeno assets attach:
   ```
   gh release create v1.0.1 ^
     "dist\Klipr-Setup-1.0.1.exe" "dist\latest.yml" "dist\Klipr-Setup-1.0.1.exe.blockmap" ^
     --title "Klipr 1.0.1" --notes "..."
   ```
   (gh na ho to electron-builder khud bhi publish kar sakta hai: `--publish always` +
   `GH_TOKEN` env; par manual `gh release` sabse साफ़ rehta hai.)
5. Tasalli: purani installed app chalao → ~20s baad "update available" aana chahiye → Install →
   naye version par restart.

### Gotchas
- **`latest.yml` upload karna mat bhoolna** — exe upload par yahi feed hai; na ho to update toot jata.
- Release ko **draft/pre-release mat rakho** (electron-updater default published latest dhoondta hai).
- Version `package.json` me aur release tag me match hona chahiye.

---

## Plan B — Cloudflare R2 (free, apne brand domain par; zyada manual)
Kyun: egress **$0** (Cloudflare bandwidth charge nahi karta), 10 GB free storage, aur Cloudflare
pehle se set hai (`klipr-license-worker`). Trade-off: koi Releases UI nahi, har release par 3 files
khud upload, aur custom domain bind karna zaroori (r2.dev public URL production ke liye throttled).

### One-time setup
1. R2 bucket banao (e.g. `klipr-updates`). Ek **custom domain** bind karo (e.g.
   `updates.klipr.<domain>`) — r2.dev URL par depend mat karo.
2. `package.json` → `build` me:
   ```json
   "publish": [
     { "provider": "generic", "url": "https://updates.klipr.<domain>/" }
   ]
   ```
3. Unsigned caveat same (upar Plan A step 3).
4. Upload ke liye credentials: R2 **S3-compatible** hai → `rclone`/`aws s3`/`wrangler r2 object put`.
   API token/keys **kabhi git me nahi** (worker ke `data.json` ki tarah ignore).

### Har release par
1. Version bump + build (Plan A jaisa) → `dist\` me 3 files.
2. Teeno files bucket ki root par upload (ya jo bhi prefix `url` me diya):
   `latest.yml`, `Klipr-Setup-X.Y.Z.exe`, `...exe.blockmap`.
   Ek chhoti upload script (`rclone copy dist/... r2:klipr-updates/`) bana lena — manual galti se bachne ko.
3. `latest.yml` **aakhir me** overwrite karo (pehle exe + blockmap chadhane ke baad), taake users ko
   aisa latest.yml na mile jiska exe abhi available nahi.
4. Cloudflare cache: zarurat ho to `latest.yml` par short cache / purge, warna purani list serve ho sakti.

---

## Dono me common
- Build **unsigned** → install par Windows SmartScreen warning aayegi (update khud chal jata hai).
  Code-signing cert (owner ki pending purchase) le lene se: SmartScreen saaf + signature verify clean.
- Logo kabhi exported clips par nahi — isse update ka koi lena-dena nahi, bas yaad-dehani.
- Change sirf `package.json` ke `publish` block + ek release/upload step ka hai; baaki updater code
  ready hai, chhoona nahi padega.

## Decision pending (owner se)
- Path: **A (GitHub Releases)** ya **B (R2)**? — default A.
- Plan A ke liye: GitHub repo ka `owner/repo`, public ya private.
- Plan B ke liye: kaunsa custom domain feed ke liye.
