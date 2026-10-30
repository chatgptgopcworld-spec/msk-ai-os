---
type: log
updated: 2026-10-28
---
# Artjenny: log

## [2026-10-27] ingest | Facebook page read
- Read her Facebook page (Posts, Reels, About) in the owner's Chrome. Owner confirmed they manage the page with artjenny's permission.
- Wrote [[src-2026-10-27-aj-facebook-page]] and [[aj-artjenny-brand]].

## [2026-10-27] deliverable | YouTube channel kit
- Kit page written and published as a private artifact (https://claude.ai/artifact/9C2hgztRxiBbrrcH2sZnaR); copy in `deliverables/youtube-kit/artjenny-youtube-kit.html` (artifact body, no doctype). Summary: [[aj-youtube-channel-kit-2026-10-27]].

## [2026-10-27] deliverable | Channel images
- Banner, watermark (150 and 600 px) and three @artjenny91 signature PNGs in `deliverables/youtube-kit/images/`; sizes and transparency checked; signature tested over dark footage.
- Made from `deliverables/youtube-kit/source/*.html` rendered with headless Edge (`msedge --headless=new --default-background-color=00000000 --window-size=W,H --screenshot=...`; signature layout picked by `#solo`, `#shorts` or `#wide`); the 150 px watermark is the 600 px one resized with Pillow.
- Banner doodle faces are AI-drawn placeholders, not her work.

## [2026-10-27] setup | Project created
- Owner asked for a project for this work. Created CLAUDE.md, [[aj-hot]], [[aj-index]], this log; filed the kit and images above.

## [2026-10-28] deliverable | TikTok story to promote YouTube
- Read TikTok @artjenny91_ and YouTube @jennydrawsyou in the owner's Chrome: [[src-2026-10-28-aj-tiktok-youtube]]; channels table in [[aj-artjenny-brand]] updated.
- Made a 4-frame TikTok story (1080×1920, rendered with headless Edge from `deliverables/tiktok-story/source/story.html`), a 15-s video script, caption, pinned comment and bio line: [[aj-tiktok-story-2026-10-28]]. Doodle faces are placeholders.
- Hot cache refreshed.
## [2026-10-28] deliverable | Signature handle changed to @artjenny91_
- At the owner's request the three signature PNGs in deliverables/youtube-kit/images/ now read "@artjenny91_" (TikTok handle) instead of "@artjenny91"; re-rendered from source/signature.html and checked over dark footage. Story frames keep "@jennydrawsyou" because that is the YouTube search term. Hot cache refreshed.

## [2026-10-28] deliverable | Signature set for @jennydrawsyou
- At the owner's request, a second set of the three signature PNGs reading "@jennydrawsyou" (YouTube handle), named *-jennydrawsyou.png; the @artjenny91_ set stays. source/signature.html now takes the handle from ?h= (default artjenny91_) and shrinks the solo version for long handles. Checked over dark footage. Hot cache refreshed.

## [2026-10-30] deliverable | Round avatar watermark for 9:16 video
- Owner supplied her real avatar (yellow-hair self-portrait, 2000x2000); stored as raw/artjenny-avatar-2000.jpg. Made round watermarks with a white ring in deliverables/watermarks/: 1024 and 512 px badges, and two 1080x1920 transparent overlays (100% and 80% opacity) with the badge at top-left (x 48, y 230, 170 px), clear of TikTok's top bar, right rail and bottom caption. Checked on dark and bright backgrounds. Built with Pillow from the source image; no AI-drawn art.
