# Scene format and elements

## Scene
```json
{
  "width": 1080, "height": 1920, "fps": 30,
  "projection": "equirect",            // or "mercator"
  "basemap": { "style": "satellite" }, // "satellite" | "flat" | "image" (see SKILL.md)
  "borders": { "countries": true, "states": true, "color": "rgba(255,255,255,.55)", "width": 1.6, "stateColor": "...", "stateWidth": 1.2 },
  "maps": { "us": { "src": "us.png", "points": [[px, py, lon, lat], ...], "margin": 12, "smooth": 0, "borders": {"provinces": true} } },
  "geojson": { "setName": "file.geojson" },
  "audio": "vo.mp3", "music": "bed.mp3", "musicVolume": 0.18,
  "sfx": [ { "t": 12.3, "sound": "impact", "vol": 0.8 } ], "sfxVolume": 0.55, "autoSfx": true,
  "overlays": [ { "type": "tag", "text": "USA", "from": 0, "to": 10 } ],  // elements that span shots (absolute from/to)
  "shots": [ ... ]
}
```
basemap extras: `ocean`, `oceanDeep`, `shelf` (coast glow colour), `land` (flat style), `grain` (texture size, default 0.09), `vignette` (0–1).

## Shot
```json
{ "start": 0, "end": 3.2,
  "bg": "map",                         // "map" (default) | "blueprint" | "section" | "color" | "paper", or an object {type,...}
  "map": "us",                         // draw this shot on a user image from "maps" (omit = built-in globe)
  "cam": { "lon": -98, "lat": 39, "span": 60, "rot": 0 },        // static, by place
  "cam": { "fit": true, "zoom": 1.4, "x": 520, "y": 700 },       // user image: fit it, optional zoom, centre in image pixels
  "cam": { "from": {lon,lat,span}, "to": {lon,lat,span}, "ease": "inOut", "t0": 0, "dur": 2 },  // move
  "fadeIn": 0.4, "fadeOut": 0.4, "flash": true,
  "elements": [ ... ] }
```
- `span` = degrees of longitude across the frame width (360 = whole world, 60 = USA, 8 = Hawaii islands, 0.5 = a city).
- A shot without `cam` keeps the previous shot's final camera when it is on the same map, so the map holds still across cuts.
- On a user image the camera is clamped to the image, so no black edges show.
- Eases: `linear`, `in`, `out`, `inOut`, `back`.

## Common element fields
`type`, `t0` (seconds after shot start), `dur` (entrance, default 0.45), `t1` (exit time) + `outDur`, `sfx` (sound name / path, or false), `sfxVol`.
Positions: `{"lon":..,"lat":..}` on the map, `{"ix":..,"iy":..}` = a pixel of the user image (moves with the camera), or `{"x":..,"y":..}` = screen pixels. Point lists use `[lon,lat]` on map shots and `[x,y]` on cutaway shots.
Colours: `yellow orange red blue green white ink`, highlight colours `tint tintDeep zoneBlue zoneGreen zoneOrange zoneRed zoneYellow zonePurple zoneTeal zonePink fire sand hot mint`, or any CSS colour.
Text: `*word*` = yellow highlight, `!word!` = red, `\n` = new line.

## Map elements
| type | fields |
|---|---|
| `region` | **the highlight.** `set` (`countries` / `provinces` / `states` / a geojson set), `names` (names or ISO codes like `US-CA`) or `all:true` (+`country:"USA"`), `exclude` [...], `style` (`tint` default / `solid` / `zone` / `glow` / `outline`), `fill`, `opacity`, `outline`, `outlineWidth`, `glow`, `glowSize`, `reveal` (`fade` / `pop` / `wipe` / `wipeDown` / `wipeLeft` / `wipeUp`), `dur`, `spotlight` (0–1, darkens everything else), `pulse`, `label` (true = name, or text), `labelAt` [lon,lat], `labelPill`, `labelDx/labelDy`, `labelStyle`, `labelDelay` |
| `zones` | several coloured regions in sequence: `preset` (`na-timezones`) or `items` [{`names`, `fill`, `label`, `labelAt`, `set`}], `only` [labels], `style` (`zone`), `set` (`provinces`), `reveal`, `stagger` (0.15), `labels:false`, `itemStyle` |
| `area` | free highlight polygon for things with no border data (mountain range, island chain, sea): `points` [[lon,lat],...] or [{ix,iy},...], `smooth`, `style`, `fill`, `opacity`, `outline`, `glow`, `label`, `labelPill`, `labelAt` |
| `borders` | draw every outline of a set: `set`, `country`, `names`, `color`, `width`, `opacity`, `dashed` |
| `path` | `points` [[lon,lat],...], `color`, `width`, `glow` (true), `drawDur`, `dashed`, `arrow`, `closed`, `draw:false` |
| `arrow` | `from`, `to`, `bend` (0.2), `color`, `width` (curved, draws on, arrowhead) |
| `ruler` | `from`, `to`, `text`, `textOffset`, `color`, `drawDur` (distance bar with end ticks) |
| `meridians` | `lons` [...] and/or `lats` [...], `labels`, `labelY`, `color`, `width`, `opacity` |
| `pin` | position, `color`, `size`, `label`, `labelStyle` |
| `dot` | position, `r`, `color`, `ping` (radar ring), `label`, `labelDx/labelDy` |
| `circle` | position, `r` or `rx/ry`, `rotate`, `color`, `width`, `fill`, `label`, `labelDy` (draws on like a marker) |
| `timeTag` | position, `text` (e.g. "10 AM"), `size`, `bg`, `color` |
| `dim` | `opacity`: darkens the whole frame under later elements |

## Anywhere elements
| type | fields |
|---|---|
| `label` | position, `text`, `size`, `color`, `weight`, `serif`, `italic`, `anchor` (start/middle/end), `rotate`, `pop:false` |
| `number` | position, `text` or `countTo` (+`countFrom`, `countDur`, `prefix`, `suffix`), `size` (96), `color` (yellow) |
| `icon` | `icon`, `points` [...] or a position, `size` (60), `color` or `colors` [...], `stagger`, `rotate` |
| `caption` | `text`, `y` (0.72·H), `size` (38), `color` |
| `title` | `text`, position (centre), `size` (88), `serif` (true), `typewriter` |
| `tag` | `text`, `x`, `y`, `bg`, `color`: corner label that slides in |
| `image` | `src`, position, `w`, `h`, `rotate`, `border:false`, `fit` (`cover` / `contain`), `slideFrom` [dx,dy] |
| `box` | position, `w`, `h`, `text`, `fill` (orange), `stroke`, `color`, `size`: org-chart box |
| `line` | `points` [[x,y],...] or `x1,y1,x2,y2`: connector that draws on |
| `people` | position, `count`, `cols`, `size`, `gap`, `color` or `colors` [[n,color],...], `stagger`: isotype grid |
| `seats` | position, `r`, `parties` [[n,color],...], `rows`, `fillDur`, `label`: parliament hemicycle |
| `plume` | `x`, `top`, `bottom`, `width`, `growDur`: magma hotspot (section shots) |

Icons: `person lock clock check cross question flag star pin dot house plane ship burst train gavel ballot`.

## Cutaway backgrounds
- `blueprint`: `{ "type":"blueprint", "colors":["#0f4fa8","#1b6fd0"], "grid":60 }`
- `section`: `{ "type":"section", "sea":0.36, "crust":0.43, "mantle":0.47, "plate":"PACIFIC PLATE", "note":"NOT TO SCALE", "islands":[{"x":0.4,"w":0.12,"h":0.05,"name":"O'ahu"}] }` (fractions of the frame)
- `color` `{ "color": "#111" }`, `paper`.

## Renderer flags
`--contact` (sheet) `--still t` `--no-sfx` (one full-size frame) `--cols n` `--scale s` `--fps n` `--from s --to s` `--audio f` `--music f`

## Highlight styles (defaults)
| style | look | use for |
|---|---|---|
| `tint` | translucent sky blue `#5fb6f2` at 55%, white 2 px borders | the subject area / whole country |
| `solid` | opaque orange at 92%, white borders | the places the story is about |
| `zone` | pastel zone colour at 78%, white borders, pill label | categories (time zones, blocs) |
| `glow` | fire orange with soft outer glow and warm core | one hero feature |
| `outline` | yellow 4.5 px outline only | boundaries, "this line" moments |

Borders data: `countries` (world, name e.g. "Canada", "United States of America"), `states` (US, 1:10m), `provinces` (Natural Earth admin-1 for USA, CAN, AUS, BRA, CHN, IND, IDN, RUS, ZAF; `properties.country` is the ISO3 code; `code` is ISO 3166-2).
