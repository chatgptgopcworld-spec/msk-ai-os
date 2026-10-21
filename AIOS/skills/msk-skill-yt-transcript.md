---
type: skill
skill: yt-transcript
system: Research
trigger: a YouTube video to study or ingest
schedule: none
inputs: a YouTube URL
outputs: the transcript text in the AI's context (not saved verbatim)
updated: 2026-10-22
---
# Read a YouTube transcript

## Steps
1. Open the video in the built-in browser (the cloud workspace can't reach YouTube directly).
2. Run `Projects/AI OS Blueprint/tools/aios-yt-transcript.js` on that tab with the browser's
   JavaScript tool. It returns `<title> | <transcript>`.
3. If it returns `none`, wait a few seconds and run it again; if still none, the video has no captions.
4. Use the text to summarise or ingest ([[msk-skill-ingest]]).

## Rules
- Don't store transcripts verbatim in the vault (copyright): keep a record (URL, title, channel,
  date) in the project's raw folder and write a summary source page.

## Done when
- The full transcript was read and the summary cites the video's source page.
