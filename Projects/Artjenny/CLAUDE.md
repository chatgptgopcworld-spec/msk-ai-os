# Artjenny: project schema (inside MSK AI OS)

**What this is:** client work for **artjenny (아트제니, 김미정)**, a caricature artist in Gamcheon Culture Village,
Busan, South Korea. The owner manages her Facebook page with her permission (stated by the owner on 2026-10-27)
and is launching her YouTube channel. This project holds the channel kit, the brand images and everything that
follows (uploads, thumbnails, Shorts plans, reports).

Paths are relative to this folder (`Documents\MSK AI OS\Projects\Artjenny`). Nothing here is written outside
it, except the registration lines the vault map asks for.

**Read order:** this file → `wiki/aj-hot.md` → `wiki/aj-index.md` → last 5 entries of `wiki/aj-log.md`.

## Layout
```
raw/                              Sources for this project (immutable): her photos, briefs, exports.
deliverables/youtube-kit/         YouTube launch kit (2026-10-27).
  artjenny-youtube-kit.html       The kit page (published as a private claude.ai artifact; see aj-hot).
  images/                         Upload-ready PNGs: banner, watermark, signature overlays.
  source/                         HTML sources of the images; re-render with headless Edge (see aj-log).
wiki/aj-hot.md                    Hot cache (~500 words, ceiling 600, rewritten in full).
wiki/aj-index.md                  Catalogue of pages.
wiki/aj-log.md                    Append-only log: "## [YYYY-MM-DD] op | Title".
wiki/sources/                     One page per source (src-YYYY-MM-DD-aj-slug).
wiki/entities/                    Her brand, channels, studio.
wiki/answers/                     Plans, decisions, deliverable summaries.
```

## Rules
1. **Her content is hers.** Never repost, edit or publish her videos or artwork anywhere without her
   permission through the owner. Her pinned post (Oct 2026) warns about accounts stealing her videos;
   every deliverable keeps her real handle (@artjenny91) and protects against reposts.
2. **No invented work presented as hers.** Illustrations made by the AI (e.g. the doodle faces on the banner)
   are marked as such in the log and replaced with her real drawings when she supplies them.
3. **Personal data:** her public business email may appear in channel copy; her phone number and any
   customer photos or names stay out of the wiki and out of GitHub.
4. **Don't mix projects:** nothing from Hamzi, Ubaidoo or other clients goes here, and nothing from here goes there.
5. **Outward actions** (uploading to YouTube, posting on her pages, messaging her audience) only with the
   owner's go-ahead for that specific action.

## Operations
- Query / ingest / lint / hot cache: follow the vault skills (`AIOS/msk-skill-map.md`) with this project's
  `aj-` files.
- Images: edit the HTML in `deliverables/youtube-kit/source/`, render to PNG at the exact size, check size
  and transparency, then replace the file in `images/` and log it.

## Git
No repo of its own; tracked by msk-ai-os.
