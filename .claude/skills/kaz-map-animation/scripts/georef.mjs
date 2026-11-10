#!/usr/bin/env node
// Georeferencing check: draws the real borders and the control points over one of your map images.
// Usage: node georef.mjs scene.json <mapId> out.png [--sets countries,provinces] [--zoom 1]
// Red dots = where you said each landmark is in the image. Cyan rings = where the fitted warp puts that
// landmark's lon/lat. They should overlap, and the yellow borders should sit on the image's coastlines.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const [scenePath, mapId, outPath] = args;
if (!outPath) { console.error('usage: georef.mjs scene.json mapId out.png [--sets countries,provinces] [--zoom 1]'); process.exit(1); }
const flag = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : args[i + 1]; };
const spec = JSON.parse(fs.readFileSync(scenePath, 'utf8'));
const m = (spec.maps || {})[mapId];
if (!m) { console.error('no map', mapId, 'in', scenePath); process.exit(1); }
const sets = flag('sets', 'countries,provinces').split(',');
const els = sets.map((s, i) => ({ type: 'borders', set: s, color: i ? '#ffe14d' : '#ff4fd8', width: i ? 1.6 : 2.4, opacity: 1, dur: 0 }));
(m.points || []).forEach(([px, py, lon, lat], i) => {
  els.push({ type: 'dot', at: { ix: px, iy: py }, r: 7, color: '#ff2b2b', dur: 0 });
  els.push({ type: 'circle', lon, lat, r: 16, color: '#22e0ff', width: 4, dur: 0, drawDur: 0.001 });
  els.push({ type: 'label', at: { ix: px, iy: py }, dy: -30, text: String(i), size: 24, dur: 0 });
});
const test = Object.assign({}, spec, { audio: undefined, music: undefined, overlays: [], shots: [{ start: 0, end: 1, map: mapId, cam: { fit: true, zoom: +flag('zoom', 1) }, elements: els }] });
const tmp = path.join(path.dirname(path.resolve(scenePath)), `.georef-${mapId}.json`);
fs.writeFileSync(tmp, JSON.stringify(test));
const r = spawnSync('node', [path.join(here, 'render.mjs'), tmp, outPath, '--still', '0.5'], { stdio: 'inherit' });
if (m.projection) console.log('projection fit:', m.projection, '(warnings above list a large control-point error, if any)');
fs.rmSync(tmp);
process.exit(r.status);
