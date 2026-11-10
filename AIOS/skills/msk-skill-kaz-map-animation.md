---
type: skill
skill: kaz-map-animation
system: Media
trigger: a map animation, geography/politics explainer short, "Kaz Map" video, or map images to animate
schedule: none
inputs: a script and/or voiceover, places named, optional map images
outputs: an MP4 (vertical 1080x1920 by default) rendered from a scene JSON
updated: 2026-11-10
---
# Kaz Map Animation

The full skill lives in `.claude/skills/kaz-map-animation/` (engine, scripts, assets, references).

## Steps
1. Open `.claude/skills/kaz-map-animation/SKILL.md` and follow its workflow.
2. Read `references/style-guide.md` and `references/elements.md` before writing scene JSON.
3. Render: `node scripts/render.mjs <scene.json> <out.mp4>` from that folder
   (if Playwright isn't found: `export NODE_PATH=$(npm root -g)`; first time on a new computer: `bash setup.sh`).
4. Put outputs outside the skill folder (e.g. the project the video belongs to), not in the vault root.

## Done when
- The MP4 renders, every place the narration names lights up on its beat, and the `rights/` folder stays with the skill.
