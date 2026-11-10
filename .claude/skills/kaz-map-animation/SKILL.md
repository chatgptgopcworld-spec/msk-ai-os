---
name: kaz-map-animation
description: Kaz Map Animation. Turns a voiceover or script into a vertical map-explainer video in the geography-Shorts style (satellite maps, smooth camera zooms, colour-highlighted countries, states, provinces and time zones, glowing paths, pins, pop-in icons, keyword captions, plus blueprint org-chart and cross-section cutaways). Use it when the user asks for a map animation, a geography or politics explainer short, or a Kaz Map video, or gives map images to animate.
---

# Kaz Map Animation

Kaz Map Animation renders map explainer videos from a **scene JSON** file. A deterministic SVG engine draws each frame in headless Chromium (Playwright), and ffmpeg encodes the result to MP4. It ships with real borders (countries, US states, and the states/provinces of the USA, Canada, Australia, Brazil, China, India, Indonesia, Russia and South Africa). It works on the built-in globe or on the user's own map images, which are georeferenced so every highlight lands on the right place in the picture.

Folder map:
- `engine/engine.js`: renderer, stages, camera, highlight styles, every element and background type
- `engine/geo.js`: bundled borders (Natural Earth countries 1:50m, admin-1 provinces 1:50m, US states 1:10m) + topojson-client
- `scripts/render.mjs`: scene JSON → MP4, contact sheet (`--contact`) or one frame (`--still t`)
- `scripts/georef.mjs`: draws the real borders over a user image to check its control points
- `scripts/timestamps.py`: voiceover → word timestamps (Whisper)
- `scripts/make_sfx.py` + `assets/sfx/`: the synthesised sound-effect kit
- `references/style-guide.md`: visual grammar and the **highlight rules**. Read it before planning shots.
- `references/elements.md`: every field of every element. Read it before writing JSON.
- `examples/demo.json` (built-in globe) and `examples/midterms.json` (two Esri screenshots, auto-aligned, every highlight style)
- `scripts/autoalign.py`: snaps a web-map screenshot to the real coastlines (land/water matching)
- `rights/`: ownership notice and data licences. Keep this folder with every copy.

## Requirements
Node 18+, Playwright with Chromium, ffmpeg. Optional: Python 3 + `faster-whisper` for automatic voiceover timing.
- One step: `bash setup.sh` (macOS/Linux) or `powershell -ExecutionPolicy Bypass -File setup.ps1` (Windows).
- Manual: `npm install && npx playwright install chromium`, install ffmpeg, optionally `pip install -r requirements.txt`.
- In Claude's workspace these are usually preinstalled. If Node can't find Playwright: `export NODE_PATH=$(npm root -g)`.

## The highlight rule (most important)
**Whenever the narration names or explains a part of the map, that part lights up in colour on the same beat.** A country, state, province, zone, island chain, route or area is never just labelled or pinned: it gets a filled highlight with white borders, in a colour chosen for its role (see `references/style-guide.md` §5):
- The subject area (a whole country, "the United States") → `style:"tint"` (soft translucent blue, white borders).
- The places the story is about (California and Texas) → `style:"solid"` (opaque orange, or zone colours when comparing).
- Several categories at once (time zones, regions, blocs) → `zones` with one pastel colour each and pill labels (`UTC-7`).
- One hero feature (Hawaii, a volcano chain, a hotspot) → `style:"glow"` (fiery orange glow), optionally with `spotlight` to darken everything else.
- Anything without a border in the data (a mountain range, a sea route, an island chain, a crater) → `area` (free polygon, smooth) or a thick `path` in `sand`/`fire`.
Keep the earlier highlight on screen while the next one builds (tint underneath, solids on top), so the viewer always sees how the parts relate.

## Workflow
1. **Intake.** Get the script and/or voiceover, the places named, and any map images or photos. Default output is vertical 1080×1920 at 30 fps (16:9: `"width":1920,"height":1080`).
2. **Maps.** No images → the built-in globe (`"basemap":{"style":"satellite"}`). With images → georeference each one (next section) and check it with `georef.mjs` before anything else.
3. **Timing.** With audio: `python3 scripts/timestamps.py vo.mp3 words.json`. Without audio, assume about 2.6 words per second and split at sentence breaks.
4. **Beat sheet.** Split the narration into beats of 1–2.5 s. List every place or map part the narration mentions, and give each one a highlight on its beat (the highlight rule). Other beats get one visual event each: a camera move, a path drawing, a pin, a number, an icon burst, a caption keyword. Group beats into shots of 2.5–5 s.
5. **Write the scene JSON.** Shot `start`/`end` come from the timestamps; each element's `t0` is seconds after its shot starts. Land highlights and pops on the stressed word.
6. **QC.** `node scripts/render.mjs scene.json sheet.png --contact --scale 0.5`, then look at it: every named place highlighted, highlights sitting on the right land, labels legible and clear of the caption band (y ≈ 1500–1600), nothing cropped. Check single moments with `--still <seconds>`.
7. **Final.** `node scripts/render.mjs scene.json out.mp4 --audio vo.mp3 [--music bed.mp3]`. Sound effects are added automatically (see below; `--no-sfx` turns them off). Use `--scale 2` for 4K. Deliver the MP4 and the scene JSON.

## Using the user's own map images (georeferencing)
**Best: web-map screenshots** (Esri World Imagery, Google, Mapbox, Bing satellite). They are Web Mercator, so they align exactly:
1. Declare the map with `"projection": "mercator"` and 4–8 rough control points (landmarks read off a 50 px grid).
2. Run `python3 scripts/autoalign.py scene.json <mapId>`. It matches land and water in the picture against the real coastlines and lake shores, and writes exact points back into the scene (mismatch typically falls to 1–2%).
3. Check with `georef.mjs` (below). Coastlines and lake shores should sit on the picture's shores.
Ask the user for **clean images with no drawn borders or labels**: drawn lines never match real borders exactly, and the plugin draws its own.

**Other images** (AI-made maps, tilted globes, artistic renders) use the thin-plate warp: no `projection`, 10–25 control points.
Declare each image under `maps` with **control points**: landmarks you can see in the picture, as `[pixelX, pixelY, lon, lat]`.
```json
"maps": {
  "us": { "src": "us.png", "points": [
    [295, 685, -109.05, 37.0], [822, 935, -81.1, 25.15], [493, 930, -97.15, 25.95],
    [130, 745, -117.12, 32.53], [975, 575, -70.0, 41.67], [98, 425, -124.7, 48.38] ] }
},
"shots": [ { "start": 0, "end": 4, "map": "us", "cam": { "fit": true }, "elements": [
  { "type": "region", "set": "provinces", "names": ["California"], "style": "solid" } ] } ]
```
- A thin-plate spline warps the real borders onto the picture, so it works for satellite renders, tilted globe views and AI-made maps alike. Use 10–25 points spread over the whole area that will be highlighted, including its edges: coast tips and capes, border corners (Four Corners), lake ends, river mouths, bay corners.
- To find pixel positions, draw a labelled 50 px grid over the image (PIL) and view crops of it.
- **Always check:** `node scripts/georef.mjs scene.json us check.png`. Red dots (your pixels) and cyan rings (warped lon/lat) should overlap, and the drawn borders should sit on the picture's coastlines. Add points wherever the lines drift, then check again.
- Borders are only drawn within 12° of the control points (`margin`), so add points before highlighting places further out.
- Insets (an Alaska or Hawaii box on a US map) are not geographic. Leave them out with `"exclude":["Alaska","Hawaii"]`, or declare the same image a second time under another map id with the inset's own points.
- The camera never shows past the image edges. Use `cam: {fit:true}`, `{fit:true, zoom:1.5, x, y}` (pixels) or `{lon, lat, span}`.
- Images that are exact plate carrée or Mercator can instead go in `basemap.images` with `bounds` (see elements.md).

## Sound effects
The renderer mixes a built-in kit (`assets/sfx/`: `whoosh swish pop click ding impact riser flip`, made by `scripts/make_sfx.py`) under the voiceover. Cues come from the scene automatically:
- flash cut → whoosh; switch to a cutaway or another map → whoosh/swish; big camera zoom → swish
- region/area reveal → pop (wipes → swish); zones → a pop per zone; pins, boxes, time tags, numbers → pop; counters and seat charts → riser
- check icons → ding; titles → impact; paths, arrows, rulers → swish; marker circles and pinging dots → click
Control: per element `"sfx": "flip"` (replace), `"sfx": false` (silence), `"sfxVol"`; extra cues with scene `"sfx": [{"t": 12.3, "sound": "impact", "vol": 0.8}]` (absolute seconds; `sound` can also be a file path); overall level `"sfxVolume"` (default 0.55); `"autoSfx": false` for manual cues only. Keep effects under the voice, and pick one effect per beat.

## Style rules (summary)
- The map is the stage. Push the camera between beats with zooms, and hard-cut or `flash` on big reveals.
- Every place mentioned is highlighted (the highlight rule), built up layer by layer.
- Captions are small white phrases near the bottom (y ≈ 1500–1560), with `*keyword*` in yellow. Big numbers pop in yellow.
- Comparisons win: two solid regions in contrasting colours, two pins, A vs B numbers on screen together.
- Cut to `blueprint` for structures (org charts, counts, seats) and to `section` for "what's under the surface".
- Change something every 1–2 s. End on a twist.

## Extending
- New icon: `ICON.name = c => svg` (100 px box centred on 0,0).
- New element: `E.name = (ctx, e, L) => svg` (return `{map, screen}` to draw inside the camera transform).
- New zone preset: add to `PRESETS` (list of `{label, fill, names, labelAt}`).
- New highlight style: add to `RSTYLE`. New colour name: add to `COLORS`.
- New cutaway background: `BG.name = (ctx, b) => svg`.

## Ownership
Proprietary. Read `rights/OWNERSHIP_AND_RIGHTS.txt` before redistributing, and keep the `rights/` folder in every copy. Border data is Natural Earth (public domain) via world-atlas/us-atlas (ISC); see the licence files in `rights/`.
