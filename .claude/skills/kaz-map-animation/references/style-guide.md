# Kaz Map style guide

The look: geography and politics Shorts. A realistic, slightly dark globe is the stage, and bright flat graphics sit on top of it to tell the story. Calm camera, punchy overlays.

## 1. Story shape (60–90 s)
1. **Hook (0–4 s):** the familiar picture. "We usually see Hawaii like this." A wide map, a title or the date, one dot pinging.
2. **Turn (4–10 s):** the twist. "But the state is actually…" Zoom out or cut with a `flash`, a glowing path or region, a big number.
3. **Proof (10–45 s):** comparisons and mechanisms. A vs B regions, rulers, time tags, then a cutaway (blueprint or section) when the map can't show the why.
4. **Payoff (last 5–10 s):** a surprising fact or open loop ("But in the spring…"). End on a strong frame, then fade out.

## 2. Pacing
- Something new every 1–2 s. Shots of 2.5–5 s.
- A camera move can carry a whole shot, so add overlays only on stressed words.
- Hard cuts by default; `flash` on reveals; `fadeIn` only at the very start and `fadeOut` at the end.

## 3. Camera
| framing | span |
|---|---|
| whole world | 300–360 |
| continent / North America | 90–150 |
| USA (lower 48) | 55–65 |
| a large state / small country | 12–20 |
| island group / metro region | 4–9 |
| a city | 0.4–1 |
- Zoom in = `from.span` big → `to.span` small. Big jumps (360 → 1) look smooth because span interpolates on a log scale.
- Slow drift on held shots: change `lon`/`lat` slightly and `span` by about 10%.
- In vertical video, keep subjects between 25% and 65% of the height; captions live at 72%.

## 4. Shot menu
- **Establish:** wide map + serif `title` + caption.
- **Build-up:** `tint` over the whole subject (wipe in), then `solid` places popping on top one per beat, labels on each.
- **Spotlight:** `region` with `style:"glow"`, `spotlight:0.5`, camera pushing in.
- **Zones:** `zones` wiping in one after another (`reveal:"wipeDown"`, stagger 0.25–0.4) with pill labels, then `timeTag`s.
- **Reveal:** `flash` cut + `path` drawing on + `number` + `ruler`.
- **Versus:** two `region`s in different colours, a `number` on each, optional `people` icons.
- **Longitude / time:** `meridians` + `pin`s + `timeTag`s.
- **Swarm:** `icon` with many `points` (people, clocks, locks, question marks) bursting in with `stagger`.
- **Blueprint cutaway:** `box` + `line` org chart, `people` grids, `number` counters, `seats` hemicycle.
- **Section cutaway:** `section` background + `plume` + `arrow` for plates, layers and "under the surface".
- **Photo card:** `image` with a white border, slightly rotated, sliding in.

## 5. Highlight colours
Every place the narration explains is filled with colour on its beat. The basemap stays natural; the highlights carry the meaning.
- **Subject area:** `tint` sky blue (`#5fb6f2`, 55%), white borders. Use it for "the United States", "Canada", the area of the whole story. It stays underneath while details build on top.
- **Key places:** `solid` orange (`#f39a1e`). When two places are compared, use orange vs `zoneGreen`, or `zoneRed` vs `zoneBlue`.
- **Categories:** `zones` palette in this order: `zoneBlue #3f9de8`, `zoneGreen #5cc45a`, `zoneOrange #f0a23c`, `zoneRed #ec5b5b`, `zoneYellow #f2df78`, `zonePurple #c48be3`, `zoneTeal`, `zonePink`. Neighbours never share a colour. Label each with a pill in its own colour.
- **Hero feature:** `glow` fire orange (`#ff8a1e`), for island chains, volcanoes, hotspots. Add `spotlight: 0.5` when it must stand alone.
- **Routes and bands:** `path` in `sand` (`#f6eea0`, width 14–18) or `fire`, glowing, drawn on.
- **Neutral politics:** red/blue only as generic sides, never with party names unless the script says so.
- Text accents: yellow `#ffd23f` for numbers and keywords, red `#e8473c` for alerts.
- Poppins Bold for labels and numbers; Georgia serif for titles and place names in "atlas" moments.
- All text gets the dark stroke the engine adds, so it reads on any map.

## 6. QC checklist
- Every place the narration names is highlighted in colour on its beat.
- Highlights sit on the right land (check user images with `georef.mjs` first).
- Subject on screen and not hidden under the caption.
- At most 2 highlight colours per shot, except `zones` (one colour per category).
- Labels don't collide (use `labelDy`, `anchor`, `dx/dy`).
- Every claim has a visual; every visual is said in the voiceover.
