#!/usr/bin/env python3
"""Auto-align a web-map screenshot (Web Mercator or plate carree) to the real coastlines.

Starts from the rough control points in the scene, reads land/water from the image colours, and
searches the projection's scale and offset until the bundled coastlines and lake shores match the picture.
The refined fit is written back into the scene as 4 exact control points.

Usage: python3 autoalign.py scene.json <mapId> [--iters 400]
Needs: numpy, pillow, node (to read the bundled borders).
"""
import json, math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
SCALE = 4  # work at 1/4 resolution

def export_land():
    js = r"""
const fs=require('fs'),vm=require('vm');const ctx={window:{}};ctx.self=ctx.window;vm.createContext(ctx);
vm.runInContext(fs.readFileSync(process.argv[1],'utf8'),ctx);const g=ctx.window.KZGEO,t=ctx.window.topojson||ctx.topojson;
const f=(n)=>t.feature(g[n],g[n].objects[Object.keys(g[n].objects)[0]]).features;
const prov=f('provinces').filter(x=>['USA','CAN'].includes(x.properties.country));
const cty=f('countries').filter(x=>!['United States of America','Canada'].includes(x.properties.name));
const polys=[];for(const x of prov.concat(cty)){const G=x.geometry;if(!G)continue;const P=G.type==='Polygon'?[G.coordinates]:G.type==='MultiPolygon'?G.coordinates:[];for(const p of P)polys.push(p);}
process.stdout.write(JSON.stringify(polys));"""
    out = subprocess.run(['node', '-e', js, os.path.join(HERE, '..', 'engine', 'geo.js')], capture_output=True, text=True, check=True).stdout
    return json.loads(out)

def merc(lat):
    lat = max(-85.0, min(85.0, lat)); return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))

def fit_linear(points, kind):
    Y = merc if kind == 'mercator' else (lambda v: v)
    lon0 = points[0][2]
    X = np.array([((p[2] - lon0 + 180) % 360) - 180 + lon0 for p in points]); YY = np.array([Y(p[3]) for p in points])
    a, b = np.polyfit(X, [p[0] for p in points], 1); c, d = np.polyfit(YY, [p[1] for p in points], 1)
    return [a, b, c, d], lon0

def main():
    if len(sys.argv) < 3: sys.exit(__doc__)
    scene_path, mid = sys.argv[1], sys.argv[2]
    iters = int(sys.argv[sys.argv.index('--iters') + 1]) if '--iters' in sys.argv else 400
    scene = json.load(open(scene_path)); m = scene['maps'][mid]
    kind = m.get('projection', 'mercator')
    img = Image.open(os.path.join(os.path.dirname(os.path.abspath(scene_path)), m['src'])).convert('RGB')
    W, H = img.size; w, h = W // SCALE, H // SCALE
    a_img = np.asarray(img.resize((w, h), Image.BILINEAR)).astype(float)
    R, G, B = a_img[..., 0], a_img[..., 1], a_img[..., 2]
    water = (B > R * 1.25) & (B > G * 0.92)
    valid = np.ones((h, w), bool); valid[int(h * 0.965):, :] = False  # ignore the attribution strip
    (a, b, c, d), lon0 = fit_linear(m['points'], kind)
    Y = merc if kind == 'mercator' else (lambda v: v)
    polys = export_land()
    # keep only polygons near the view
    lon_l, lon_r = sorted([(0 - b) / a, (W - b) / a]); pad = (lon_r - lon_l) * 0.3
    def unwrap(lon): return ((lon - lon0 + 180) % 360) - 180 + lon0
    pre = []
    for p in polys:
        ring = p[0]; xs = [unwrap(q[0]) for q in ring]
        if max(xs) - min(xs) > 300 or max(xs) < lon_l - pad or min(xs) > lon_r + pad: continue
        pre.append([(np.array([unwrap(q[0]) for q in r]), np.array([Y(q[1]) for q in r])) for r in p])
    def land_mask(P):
        a, b, c, d = P; im = Image.new('L', (w, h), 0); dr = ImageDraw.Draw(im)
        for rings in pre:
            for k, (X, YY) in enumerate(rings):
                pts = list(zip(((a * X + b) / SCALE).tolist(), ((c * YY + d) / SCALE).tolist()))
                if len(pts) > 2: dr.polygon(pts, fill=0 if k else 1)
        return np.asarray(im, bool)
    def score(P):
        L = land_mask(P); return float(((L == water) & valid).sum()) / valid.sum()
    P = np.array([a, b, c, d], float); best = score(P); start = best
    steps = np.array([abs(a) * 0.01, 8.0, abs(c) * 0.01, 8.0])
    it = 0
    while it < iters and steps[1] > 0.4:
        improved = False
        for i in range(4):
            for sgn in (1, -1):
                Q = P.copy(); Q[i] += sgn * steps[i]; s = score(Q); it += 1
                if s > best - 1e-6: continue
                best, P, improved = s, Q, True
        if not improved: steps *= 0.5
    a, b, c, d = P
    inv = lambda px, py: ((px - b) / a, math.degrees(2 * math.atan(math.exp(math.radians((py - d) / c))) - math.pi / 2) if kind == 'mercator' else (py - d) / c)
    pts = []
    for px, py in [(0.1 * W, 0.1 * H), (0.9 * W, 0.1 * H), (0.1 * W, 0.9 * H), (0.9 * W, 0.9 * H)]:
        lo, la = inv(px, py); pts.append([round(px, 1), round(py, 1), round(lo, 5), round(la, 5)])
    m['points'] = pts; m['projection'] = kind; m['aligned'] = True
    json.dump(scene, open(scene_path, 'w'), indent=1)
    print(f'{mid}: land/water mismatch {start*100:.2f}% -> {best*100:.2f}% after {it} tries; wrote refined points to {scene_path}')

if __name__ == '__main__':
    main()
