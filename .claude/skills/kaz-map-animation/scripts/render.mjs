#!/usr/bin/env node
// Kaz Map Animation renderer: scene JSON -> MP4 (or contact sheet).
// Usage:
//   node render.mjs scene.json out.mp4 [--scale 0.5] [--fps 30] [--from 0] [--to 12] [--audio vo.mp3] [--music bed.mp3]
//   node render.mjs scene.json sheet.png --contact      (one still per shot, tiled)
//   node render.mjs scene.json frame.png --still 4.2    (one full-size frame)
import { createRequire } from 'node:module';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require(require.resolve('playwright', { paths: [process.cwd(), ...(process.env.NODE_PATH || '').split(':').filter(Boolean)] }))); }
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i < 0 ? d : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
const [specPath, outPath] = args;
if (!specPath || !outPath) { console.error('usage: render.mjs scene.json out.mp4|sheet.png [--contact] [--scale s] [--fps n] [--from s] [--to s] [--audio f] [--music f]'); process.exit(1); }

const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const scale = +flag('scale', 1), fps = +flag('fps', spec.fps || 30);
// The scene is always laid out at its design size; --scale only changes the output pixels.
spec.width = spec.width || 1080; spec.height = spec.height || 1920;
const W = spec.width, H = spec.height;
// resolve local files (basemap images, photos, geojson) relative to the scene file
const sceneDir = path.dirname(path.resolve(specPath));
const toUrl = p => (/^(https?:|data:|file:)/.test(p) ? p : pathToFileURL(path.resolve(sceneDir, p)).href);
const bm = spec.basemap || {};
if (bm.image) bm.image = toUrl(bm.image);
for (const im of bm.images || []) im.src = toUrl(im.src);
for (const sh of spec.shots) for (const e of sh.elements || []) if (e.src) e.src = toUrl(e.src);
for (const o of spec.overlays || []) if (o.src) o.src = toUrl(o.src);
for (const m of Object.values(spec.maps || {})) {
  const file = path.resolve(sceneDir, m.src);
  if (!m.w || !m.h) {
    const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file], { encoding: 'utf8' });
    const [w, h] = r.stdout.trim().split(',').map(Number);
    if (!w) { console.error('cannot read image size of', file); process.exit(1); }
    m.w = w; m.h = h;
  }
  m.src = toUrl(m.src);
}
if (spec.geojson) for (const [k, v] of Object.entries(spec.geojson)) if (typeof v === 'string') spec.geojson[k] = JSON.parse(fs.readFileSync(path.resolve(sceneDir, v), 'utf8'));
if (spec.audio) spec.audio = path.resolve(sceneDir, spec.audio);
if (spec.music) spec.music = path.resolve(sceneDir, spec.music);
const total = spec.shots.at(-1).end;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: scale });
page.on('console', m => { if (m.type() === 'warning' || m.type() === 'error') console.error('[engine]', m.text()); });
page.on('pageerror', e => { console.error('[engine]', e.message); process.exit(1); });
await page.goto(pathToFileURL(path.join(here, '..', 'engine', 'index.html')).href);
await page.evaluate(() => document.fonts.ready);
const shoot = async t => { await page.evaluate(([s, t]) => window.KZ.render(s, t), [spec, t]); return page.screenshot({ type: 'jpeg', quality: 92 }); };

// Sound-effect cues: spec.sfx [{t, sound, vol}] (absolute seconds) plus automatic cues from the scene (spec.autoSfx !== false)
function sfxCues(spec) {
  const out = (spec.sfx || []).map(c => Object.assign({ vol: 1 }, c));
  if (spec.autoSfx === false) return out.sort((a, b) => a.t - b.t);
  const A = (t, sound, vol) => out.push({ t, sound, vol, auto: true });
  spec.shots.forEach((sh, i) => {
    const S = sh.start;
    if (i > 0 && sh.flash) A(S - 0.12, 'whoosh', 0.9);
    else if (i > 0 && (sh.bg || 'map') !== (spec.shots[i - 1].bg || 'map')) A(S - 0.1, 'whoosh', 0.6);
    else if (i > 0 && sh.map !== spec.shots[i - 1].map) A(S - 0.08, 'swish', 0.6);
    const c = sh.cam;
    if (c && c.from && c.to) { const zf = c.from.span || c.from.w || (c.from.zoom ? 1 / c.from.zoom : 1), zt = c.to.span || c.to.w || (c.to.zoom ? 1 / c.to.zoom : 1); if (Math.abs(Math.log(zf / zt)) > 0.45) A(S + (c.t0 || 0), 'swish', 0.55); }
    for (const e of sh.elements || []) {
      const t = S + (e.t0 || 0); if (e.sfx === false) continue;
      if (e.sfx) { A(t, e.sfx, e.sfxVol ?? 0.8); continue; }
      switch (e.type) {
        case 'region': case 'area': if ((e.dur ?? 0.45) > 0) A(t, e.reveal && e.reveal.startsWith('wipe') ? 'swish' : 'pop', e.reveal && e.reveal.startsWith('wipe') ? 0.45 : 0.4); break;
        case 'zones': { const k = (e.only || e.items || [1, 2, 3, 4, 5, 6]).length; for (let j = 0; j < Math.min(k, 8); j++) A(t + j * (e.stagger ?? 0.15), 'pop', 0.35); break; }
        case 'icon': { const pts = e.points || [1]; const snd = e.icon === 'check' ? 'ding' : e.icon === 'question' ? 'pop' : 'pop'; const st = e.stagger ?? 0.06; for (let j = 0; j < Math.min(pts.length, e.icon === 'check' ? 3 : 4); j++) A(t + j * Math.max(st, 0.08), snd, snd === 'ding' ? 0.45 : 0.45); break; }
        case 'pin': case 'timeTag': case 'box': A(t, 'pop', 0.5); break;
        case 'number': A(t, e.countTo != null ? 'riser' : 'pop', e.countTo != null ? 0.35 : 0.55); break;
        case 'title': A(t, 'impact', 0.8); break;
        case 'path': case 'arrow': case 'ruler': case 'meridians': if (e.draw !== false) A(t, 'swish', 0.4); break;
        case 'circle': A(t, 'click', 0.5); break;
        case 'seats': A(t, 'riser', 0.3); break;
        case 'dot': if (e.ping) A(t, 'click', 0.45); break;
      }
    }
  });
  out.sort((a, b) => a.t - b.t);
  return out.filter((c, i) => !c.auto || !out.slice(Math.max(0, i - 4), i).some(d => d.sound === c.sound && c.t - d.t < 0.07));
}

const shootPng = async t => { await page.evaluate(([s, t]) => window.KZ.render(s, t), [spec, t]); return page.screenshot({ type: 'png' }); };

function ff(argv, input) {
  return new Promise((res, rej) => {
    const p = spawn('ffmpeg', ['-y', '-v', 'error', ...argv], { stdio: [input ? 'pipe' : 'ignore', 'inherit', 'inherit'] });
    p.on('close', c => c ? rej(new Error('ffmpeg exit ' + c)) : res()); if (input) input(p.stdin);
  });
}

if (flag('still', false) !== false) {
  // one full-resolution frame: --still <seconds>
  fs.writeFileSync(outPath, await shootPng(+flag('still', 0)));
} else if (flag('contact', false)) {
  const dir = fs.mkdtempSync(path.join(path.dirname(path.resolve(outPath)), '.kz-'));
  for (const [i, s] of spec.shots.entries()) fs.writeFileSync(path.join(dir, `f${String(i).padStart(3, '0')}.jpg`), await shoot(s.start + (s.end - s.start) * 0.7));
  const cols = Math.min(+flag('cols', 4), spec.shots.length), rows = Math.ceil(spec.shots.length / cols);
  await ff(['-i', path.join(dir, 'f%03d.jpg'), '-vf', `scale=360:-1,drawbox=x=0:y=0:w=iw:h=ih:color=black@1:t=2,tile=${cols}x${rows}`, '-frames:v', '1', outPath]);
  fs.rmSync(dir, { recursive: true });
} else {
  const from = +flag('from', 0), to = Math.min(+flag('to', total), total);
  const frames = Math.round((to - from) * fps);
  const silent = outPath.replace(/\.mp4$/, '') + '.silent.mp4';
  await ff(['-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', silent], async stdin => {
    for (let f = 0; f < frames; f++) {
      const buf = await shoot(from + f / fps);
      if (!stdin.write(buf)) await new Promise(r => stdin.once('drain', r));
      if (f % fps === 0) process.stdout.write(`\rframe ${f}/${frames}`);
    }
    stdin.end();
  });
  process.stdout.write('\n');
  const audio = flag('audio', spec.audio), music = flag('music', spec.music);
  const cues = flag('no-sfx', false) ? [] : sfxCues(spec).filter(c => c.t >= from - 0.05 && c.t < to);
  if (audio || music || cues.length) {
    const inputs = ['-i', silent], filt = [], mix = []; let n = 1;
    if (audio) { inputs.push('-ss', String(from), '-i', audio); filt.push(`[${n++}:a]aresample=48000,aformat=channel_layouts=stereo,volume=1[vo]`); mix.push('[vo]'); }
    if (music) { inputs.push('-stream_loop', '-1', '-i', music); filt.push(`[${n++}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${spec.musicVolume ?? 0.18}[mu]`); mix.push('[mu]'); }
    if (cues.length) {
      const bySound = {};
      for (const c of cues) (bySound[c.sound] = bySound[c.sound] || []).push(c);
      const parts = [];
      for (const [snd, list] of Object.entries(bySound)) {
        const file = /[\/.]/.test(snd) ? path.resolve(sceneDir, snd) : path.join(here, '..', 'assets', 'sfx', snd + '.wav');
        if (!fs.existsSync(file)) { console.error('missing sound', file); continue; }
        inputs.push('-i', file); const k = n++;
        const labels = list.map((_, i) => `[s${k}_${i}]`);
        filt.push(`[${k}:a]aresample=48000,aformat=channel_layouts=stereo,asplit=${list.length}${labels.join('')}`);
        list.forEach((c, i) => { const ms = Math.max(0, Math.round((c.t - from) * 1000)); filt.push(`${labels[i]}adelay=${ms}|${ms},volume=${(c.vol ?? 1).toFixed(3)}[d${k}_${i}]`); parts.push(`[d${k}_${i}]`); });
      }
      if (parts.length) {
        filt.push(`${parts.join('')}amix=inputs=${parts.length}:duration=longest:normalize=0,volume=${spec.sfxVolume ?? 0.55}[fx]`);
        mix.push('[fx]');
      }
    }
    filt.push(mix.length > 1 ? `${mix.join('')}amix=inputs=${mix.length}:duration=longest:normalize=0,alimiter=limit=0.95[a]` : `${mix[0]}anull[a]`);
    await ff([...inputs, '-filter_complex', filt.join(';'), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(to - from), outPath]);
    fs.rmSync(silent);
  } else fs.renameSync(silent, outPath);
}
await browser.close();
console.log('wrote', outPath);
