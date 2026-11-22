# Klipr — Landing Page Information Pack

A complete brief for building the Klipr marketing/landing page. Everything below reflects
what the app actually does. Hand this to Claude (or any site builder) as the source of truth.

---

## 1. Identity
- **Product name:** Klipr (styled **KLIPR**).
- **Developed by:** MSK (small credit; keep "KLIPR" big, "Developed by MSK" small).
- **One-liner:** Turn long videos and live streams into short, ready-to-post clips — on your own PC.
- **Platform:** Windows desktop app (one-click installer). Runs fully offline for the core work.
- **Category:** AI video clipping / short-form content tool (Shorts, Reels, TikTok).

### Tagline options
- "Long videos and live streams → short clips. On your PC."
- "Clip the moment. Keep it private."
- "From stream to Shorts, automatically."
- "Your clips. Your machine. No uploads."

---

## 2. What Klipr is (positioning)
Klipr is a desktop app that finds the best moments in your long videos **and** live streams and
turns them into captioned vertical clips — captions, reframing, effects and music included. Unlike
cloud clippers, **everything runs on your own computer**: your footage is never uploaded, there's
no per-minute cloud bill, and your work stays private. No forced watermark on your exports.

**The big differentiators (lead with these):**
1. **100% on-device.** Your video never leaves your machine. Private by design.
2. **Live-stream clipping built in.** Record a live stream and auto-cut the hype moments *as they happen* — not just pre-recorded uploads.
3. **A "Streams" hub.** Track your favourite streamers across Twitch, YouTube and Kick, see who's live right now, and clip them — no API keys, nothing to sign up for.
4. **No subscription to a cloud service, no forced watermark** on your clips.

---

## 3. Core features (feature → benefit)

### Create (from any long video)
- Import a **YouTube link or a local video file**.
- **Automatic transcription** with Whisper running **locally** (private, no cloud needed).
- **Auto-finds the best moments** and turns each into a short.
- → *Benefit:* paste a link, get a batch of post-ready shorts without scrubbing the timeline.

### Live clipping (the standout)
- Record a **live stream** from **Twitch, YouTube Live or Kick**.
- **Auto-detects moments** when chat suddenly speeds up or the streamer gets loud ("hype meter").
- Hit **F8** anywhere to grab the last 30–90 seconds yourself.
- Each moment opens in Create with your usual captions/layout.
- Keeps only the last ~10 minutes on disk; nothing is posted anywhere.
- → *Benefit:* never miss a clippable moment during a live stream.

### Streams (track + clip creators)
- Add channels across **Twitch / YouTube / Kick**; see **who is live now**, viewer counts, and their **past streams**.
- **Clip-permission badges** per creator (allowed / has clip tips / no clipping / unknown) so you clip responsibly.
- **"Watch live"** jumps straight into recording + auto-clipping that stream.
- **No API keys** — uses public endpoints; nothing to configure.
- → *Benefit:* a dashboard of the creators you clip, with go-live alerts and one-click capture.

### Captions
- Many **animated caption themes**, including karaoke/word-highlight styles.
- **Multilingual**, including right-to-left scripts.
- Fully **customisable** (font, size, colour, position) and **save your own presets**.
- → *Benefit:* scroll-stopping captions that match your brand in seconds.

### Reframe (vertical, smart)
- Output **9:16, 1:1, or 3:4**; preview stays fixed and centred (CapCut-style).
- **Face / subject tracking** keeps the action in frame; manual keyframes when you want control.
- **Gaming Split:** facecam on top, gameplay below — draggable and zoomable, with a soft blurred fill so there's no dead space.
- → *Benefit:* perfect vertical framing for talking-head *and* gaming content.

### Effects & polish
- **Cinematic colour grading**, orientation/flip, **playback speed**.
- **Hook text** (opening line), **progress bar**, title/text bars.
- **Creator signature / watermark** (optional, yours — Klipr never brands your clips).
- → *Benefit:* a finished, premium look without a separate editor.

### Music
- Add **background music** with **auto-ducking** (music dips under speech) and track suggestions.

### Export, Queue & Library
- Export to **multiple aspect ratios**, as a **zip or straight to a folder**.
- Auto-generated **social captions / hashtags** metadata for each clip.
- **Queue:** batch-process many videos back-to-back.
- **Library:** every rendered clip in one place.

---

## 4. How it works (3 steps for the page)
1. **Bring your source** — paste a YouTube link, drop a file, or go live on Twitch/YouTube/Kick.
2. **Klipr finds the moments** — local transcription + hype/chat detection pick what's worth clipping.
3. **Style & export** — captions, vertical reframe, effects and music, then export ready-to-post shorts.

---

## 5. Privacy & performance (sell the trust)
- **On-device:** transcription (Whisper) and rendering (bundled FFmpeg) run locally. "Your video never leaves your device."
- **No external AI APIs** needed for the core workflow.
- **GPU (CUDA) optional** for faster transcription; works on **CPU** too.
- Optional: a free **Groq API key** can speed up transcription in the cloud **only if the user chooses** (their key, their call).
- Everything (yt-dlp, Whisper, FFmpeg) is **bundled** — no separate installs.

---

## 6. Who it's for
- **Clippers / editors** who turn streamers' content into Shorts.
- **Streamers** who want their own live moments clipped automatically.
- **Creators & faceless channels** repurposing long videos into short-form.
- **Agencies** batch-producing shorts for clients, privately.

---

## 7. Sign-in & pricing notes (for the page copy)
- Sign in with a **Google account** to use the app (currently open to any Google account).
- Positioned as a **one-time desktop app**, not a metered cloud subscription.
- (Pricing/offer copy is the owner's call — leave a placeholder CTA like "Get Klipr" / "Download".)

---

## 8. Objections to pre-empt (good FAQ fodder)
- *"Is my footage uploaded anywhere?"* No — it's processed on your PC.
- *"Do I need API keys or accounts for Twitch/YouTube/Kick?"* No — the Streams and Live features use public endpoints.
- *"Will there be a watermark on my clips?"* No forced watermark; add your own signature if you want.
- *"Does it work without a fancy GPU?"* Yes — CPU works; a CUDA GPU just makes transcription faster.
- *"What platforms for live?"* Twitch, YouTube Live, Kick.

---

## 9. Suggested landing-page sections (structure)
1. Hero: logo **KLIPR**, one-liner, primary CTA (Download/Get Klipr), short sub-line about on-device + live clipping.
2. "From this → to this" visual (long video / live stream → vertical captioned short).
3. Three pillars: **On your PC & private** · **Live-stream clipping** · **Streams hub**.
4. Feature grid: Create, Live, Streams, Captions, Reframe/Gaming split, Effects, Music, Queue.
5. How it works (3 steps).
6. Privacy band ("Your video never leaves your device").
7. Who it's for.
8. FAQ (section 8).
9. Final CTA + "Developed by MSK".

### Voice
Confident, creator-friendly, concrete. Emphasise speed ("paste a link, get shorts"), privacy
("on your PC"), and the live edge ("clip the moment as it happens"). Avoid hype words like
"revolutionary"; show the workflow instead.
