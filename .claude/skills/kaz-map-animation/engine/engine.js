/* Kaz Map Animation engine v2.
 * window.KZ.render(spec, t) draws the frame at time t (seconds) into #stage.
 * Deterministic: the same spec and t always give the same frame.
 *
 * Stages: every shot is drawn on one stage.
 *   "world"  - the built-in globe (vector land, borders) in equirect/mercator units (10 per degree)
 *   map id   - one of spec.maps: the user's own image, georeferenced with control points
 *              [[px, py, lon, lat], ...]. A thin-plate spline warps every border, pin and highlight
 *              onto the image, so built-in regions line up with the picture.
 * Layers: base <svg> (stage art + map-space highlights inside one camera transform)
 *         over <svg> (cutaway backgrounds and every screen-space overlay)
 * Copyright (c) 2026 the owner of the account heshanilexus@gmail.com. See rights/OWNERSHIP_AND_RIGHTS.txt.
 */
(function () {
  'use strict';
  const K = 10; // world units per degree on the world stage
  const RAD = Math.PI / 180;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const EASE = {
    linear: p => p,
    in: p => p * p * p,
    out: p => 1 - Math.pow(1 - p, 3),
    inOut: p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    back: p => { const c = 1.9, q = p - 1; return 1 + (c + 1) * q * q * q + c * q * q; },
  };
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const f1 = v => (Math.round(v * 10) / 10);

  /* ---------------- tokens ---------------- */
  const T = {
    font: 'Poppins, Arial, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    ocean: '#0f3d55', oceanDeep: '#0a2c40', shelf: '#1d6d86',
    border: 'rgba(255,255,255,0.55)', stateBorder: 'rgba(255,255,255,0.35)',
    yellow: '#ffd23f', orange: '#f39a1e', red: '#e8473c', blue: '#2f8fe0', green: '#3fcf5b', white: '#ffffff', ink: '#111418',
    blueprint: ['#0f4fa8', '#1b6fd0'],
  };
  // Highlight palette (matches the reference look): soft tint, pastel zone colours, fire glow
  const COLORS = {
    yellow: T.yellow, orange: T.orange, red: T.red, blue: T.blue, green: T.green, white: T.white, ink: T.ink,
    tint: '#5fb6f2', tintDeep: '#3d8fd6',
    zoneBlue: '#3f9de8', zoneGreen: '#5cc45a', zoneOrange: '#f0a23c', zoneRed: '#ec5b5b', zoneYellow: '#f2df78', zonePurple: '#c48be3', zoneTeal: '#3fc7b8', zonePink: '#f08ab8',
    fire: '#ff8a1e', sand: '#f6eea0', hot: '#ff5a2a', mint: '#8ff0c0',
  };
  const col = c => COLORS[c] || c || T.white;
  const RSTYLE = {
    tint: { fill: 'tint', opacity: 0.55, outline: '#ffffff', outlineWidth: 2.2 },
    solid: { fill: 'orange', opacity: 0.92, outline: '#ffffff', outlineWidth: 2.2 },
    zone: { fill: 'zoneGreen', opacity: 0.78, outline: '#ffffff', outlineWidth: 1.6 },
    glow: { fill: 'fire', opacity: 0.95, outline: '#ffd28a', outlineWidth: 1.5, glow: true, glowSize: 18 },
    outline: { fill: 'yellow', opacity: 0, outline: 'yellow', outlineWidth: 4.5 },
  };

  /* ---------------- geodata ---------------- */
  const PROJ = {
    equirect: (lon, lat) => [lon * K, -lat * K],
    mercator: (lon, lat) => [lon * K, -K * Math.log(Math.tan(Math.PI / 4 + clamp(lat, -85, 85) * RAD / 2)) / RAD],
  };
  const geoCache = {};
  function featureSet(name, spec) {
    if (geoCache[name]) return geoCache[name];
    let fc;
    if (spec.geojson && spec.geojson[name]) fc = spec.geojson[name];
    else {
      const topo = window.KZGEO[name];
      if (!topo) throw new Error('unknown feature set: ' + name);
      fc = window.topojson.feature(topo, topo.objects[Object.keys(topo.objects)[0]]);
    }
    return (geoCache[name] = fc.features || [fc]);
  }
  function featurePath(f, stage) {
    f.__d = f.__d || {};
    if (f.__d[stage.id]) return f.__d[stage.id];
    const pr = stage.project;
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [];
    let d = '', best = null, bestA = -1, x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    const ext = stage.extent;
    for (const poly of polys) for (const [ri, ring] of poly.entries()) {
      if (ext) { // image stages: skip polygons far outside the georeferenced area (the warp is only valid near the landmarks)
        let a = 1e9, b = 1e9, c = -1e9, e = -1e9;
        for (const [lo, la] of poly[0]) { const l = ((lo - ext.lon0 + 540) % 360) - 180; if (l < a) a = l; if (l > c) c = l; if (la < b) b = la; if (la > e) e = la; }
        if (c - a > 180 || c < ext.w || a > ext.e || e < ext.s || b > ext.n) continue;
      }
      let prev = null;
      const pts = ring.map(([lo, la]) => {
        if (ext) { // clamp into the valid area so the warp never extrapolates wildly
          lo = ext.lon0 + clamp(((lo - ext.lon0 + 540) % 360) - 180, ext.w, ext.e); la = clamp(la, ext.s, ext.n);
          return pr(lo, la);
        }
        if (prev != null) { while (lo - prev > 180) lo -= 360; while (lo - prev < -180) lo += 360; } prev = lo; return pr(lo, la); });
      d += 'M' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join('L') + 'Z';
      for (const p of pts) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
      if (ri === 0) {
        let a = 0, cx = 0, cy = 0;
        for (let i = 0; i < pts.length - 1; i++) { const c = pts[i][0] * pts[i + 1][1] - pts[i + 1][0] * pts[i][1]; a += c; cx += (pts[i][0] + pts[i + 1][0]) * c; cy += (pts[i][1] + pts[i + 1][1]) * c; }
        if (Math.abs(a) > bestA) { bestA = Math.abs(a); best = a ? [cx / (3 * a), cy / (3 * a)] : pts[0]; }
      }
    }
    return (f.__d[stage.id] = { d, c: best || [0, 0], box: [x0, y0, x1, y1] });
  }
  function findFeatures(e, spec, defSet) {
    const ex = [].concat(e.exclude || []).map(s => String(s).toLowerCase());
    const set = featureSet(e.set || defSet || 'countries', spec).filter(f => !ex.length || !ex.includes(String(f.properties && f.properties.name).toLowerCase()));
    if (e.all) return set.filter(f => !e.country || (f.properties && f.properties.country === e.country));
    const want = [].concat(e.names || e.name || [], e.ids || e.id || []).map(s => String(s).toLowerCase());
    const hit = set.filter(f => want.includes(String(f.properties && f.properties.name).toLowerCase()) || want.includes(String(f.id).toLowerCase()) || want.includes(String(f.properties && f.properties.code).toLowerCase()));
    if (hit.length < want.length && !e.quiet) {
      const got = hit.map(f => String(f.properties.name).toLowerCase());
      console.warn('region not found in set "' + (e.set || defSet || 'countries') + '": ' + want.filter(w => !got.includes(w)).join(', '));
    }
    return hit;
  }

  /* ---------------- thin-plate spline (image georeferencing) ---------------- */
  function solve(A, B) { // Gaussian elimination, A n×n, B n×m (both mutated)
    const n = A.length, m = B[0].length;
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
      [A[c], A[p]] = [A[p], A[c]]; [B[c], B[p]] = [B[p], B[c]];
      const d = A[c][c] || 1e-12;
      for (let r = 0; r < n; r++) if (r !== c) {
        const k = A[r][c] / d; if (!k) continue;
        for (let j = c; j < n; j++) A[r][j] -= k * A[c][j];
        for (let j = 0; j < m; j++) B[r][j] -= k * B[c][j];
      }
    }
    return B.map((row, i) => row.map(v => v / (A[i][i] || 1e-12)));
  }
  const U = r2 => (r2 > 1e-12 ? r2 * Math.log(r2) : 0);
  function fitTPS(points, smooth = 0) {
    // points: [[px, py, lon, lat], ...] -> f(lon, lat) = [px, py]
    if (!points || points.length < 3) throw new Error('a georeferenced map needs at least 3 control points');
    const lon0 = points.reduce((a, p) => a + p[2], 0) / points.length;
    const lat0 = points.reduce((a, p) => a + p[3], 0) / points.length;
    const kx = Math.cos(lat0 * RAD);
    const unwrap = lon => { while (lon - lon0 > 180) lon -= 360; while (lon - lon0 < -180) lon += 360; return lon; };
    const src = points.map(p => [(unwrap(p[2]) - lon0) * kx, p[3] - lat0]);
    const sc = Math.max(1e-6, Math.sqrt(src.reduce((a, s) => a + s[0] * s[0] + s[1] * s[1], 0) / src.length));
    const S = src.map(s => [s[0] / sc, s[1] / sc]), n = S.length;
    const A = [], B = [];
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let j = 0; j < n; j++) row.push(U((S[i][0] - S[j][0]) ** 2 + (S[i][1] - S[j][1]) ** 2) + (i === j ? smooth : 0));
      row.push(1, S[i][0], S[i][1]); A.push(row); B.push([points[i][0], points[i][1]]);
    }
    for (let k = 0; k < 3; k++) { A.push(S.map(s => (k === 0 ? 1 : s[k - 1])).concat([0, 0, 0])); B.push([0, 0]); }
    const W = solve(A, B);
    const f = (lon, lat) => {
      const u = (unwrap(lon) - lon0) * kx / sc, v = (lat - lat0) / sc;
      let x = W[n][0] + W[n + 1][0] * u + W[n + 2][0] * v, y = W[n][1] + W[n + 1][1] * u + W[n + 2][1] * v;
      for (let i = 0; i < n; i++) { const r = U((u - S[i][0]) ** 2 + (v - S[i][1]) ** 2); x += W[i][0] * r; y += W[i][1] * r; }
      return [x, y];
    };
    return f;
  }

  // Web-map screenshots (Esri, Google, Mapbox = Web Mercator) or plate-carree images: px = a*lon + b, py = c*Y(lat) + d
  function fitLinear(points, kind) {
    const lon0 = points[0][2];
    const unwrap = lon => { while (lon - lon0 > 180) lon -= 360; while (lon - lon0 < -180) lon += 360; return lon; };
    const Y = kind === 'mercator' ? la => Math.log(Math.tan(Math.PI / 4 + clamp(la, -85, 85) * RAD / 2)) / RAD : la => la;
    const Yi = kind === 'mercator' ? y => (2 * Math.atan(Math.exp(y * RAD)) - Math.PI / 2) / RAD : y => y;
    const lsq = (xs, ys) => { const n = xs.length, mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n; let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; } const a = sxy / (sxx || 1e-9); return [a, my - a * mx]; };
    const [a, b] = lsq(points.map(p => unwrap(p[2])), points.map(p => p[0]));
    const [c, d] = lsq(points.map(p => Y(p[3])), points.map(p => p[1]));
    const f = (lon, lat) => [a * unwrap(lon) + b, c * Y(lat) + d];
    f.inverse = (px, py) => [(px - b) / a, Yi((py - d) / c)];
    f.residual = Math.max(...points.map(p => { const q = f(p[2], p[3]); return Math.hypot(q[0] - p[0], q[1] - p[1]); }));
    if (f.residual > 12) console.warn('map fit: largest control-point error ' + f.residual.toFixed(1) + ' px (check the points or the projection)');
    return f;
  }

  /* ---------------- stages ---------------- */
  const stageCache = {};
  function getStage(spec, id) {
    const key = id || 'world';
    const sig = key === 'world' ? spec.projection || 'equirect' : JSON.stringify((spec.maps || {})[key] && spec.maps[key].points);
    if (stageCache[key] && stageCache[key].sig === sig) return stageCache[key];
    let st;
    if (key === 'world') {
      const pr = PROJ[spec.projection || 'equirect'];
      st = { id: 'world', kind: 'world', project: pr, spec };
    } else {
      const m = (spec.maps || {})[key];
      if (!m) throw new Error('unknown map "' + key + '" (define it in spec.maps)');
      const lon0 = m.points.reduce((a, p) => a + p[2], 0) / m.points.length, mg = m.margin ?? 12;
      const rl = m.points.map(p => ((p[2] - lon0 + 540) % 360) - 180), la = m.points.map(p => p[3]);
      const extent = { lon0, w: Math.min(...rl) - mg, e: Math.max(...rl) + mg, s: Math.min(...la) - mg, n: Math.max(...la) + mg };
      const project = m.projection === 'mercator' || m.projection === 'equirect' ? fitLinear(m.points, m.projection) : fitTPS(m.points, m.smooth || 0);
      if (m.projection === 'mercator' || m.projection === 'equirect') { // exact projections: valid over the whole image
        const inv = project.inverse, c0 = inv(0, 0), c1 = inv(m.w, m.h), mg2 = m.margin ?? 6;
        extent.w = Math.min(c0[0], c1[0]) - lon0 - mg2; extent.e = Math.max(c0[0], c1[0]) - lon0 + mg2;
        extent.s = Math.max(-85, Math.min(c0[1], c1[1]) - mg2); extent.n = Math.min(85, Math.max(c0[1], c1[1]) + mg2);
      }
      st = { id: key, kind: 'image', project, w: m.w, h: m.h, map: m, spec, extent };
    }
    st.sig = sig;
    return (stageCache[key] = st);
  }
  // resolve a camera keyframe to stage units {cx, cy, w, rot}
  function resolveCam(c, stage, spec) {
    const W = spec.width, H = spec.height;
    if (!c || c.fit) {
      if (stage.kind === 'image') { const w = Math.min(stage.w, stage.h * W / H) / (c && c.zoom || 1); return { cx: c && c.x != null ? c.x : stage.w / 2, cy: c && c.y != null ? c.y : stage.h / 2, w, rot: 0 }; }
      return { cx: 0, cy: -20 * K, w: 360 * K, rot: 0 };
    }
    if (c.x != null) {
      const base = stage.kind === 'image' ? Math.min(stage.w, stage.h * W / H) : 360 * K;
      return { cx: c.x, cy: c.y, w: c.w || base / (c.zoom || 1), rot: c.rot || 0 };
    }
    const [cx, cy] = stage.project(c.lon, c.lat);
    const a = stage.project(c.lon - 0.5, c.lat), b = stage.project(c.lon + 0.5, c.lat);
    const perDeg = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return { cx, cy, w: (c.span || 60) * perDeg, rot: c.rot || 0 };
  }
  function camAt(shot, tl, stage, spec, prev) {
    const c = shot.cam;
    if (!c) return prev || resolveCam(null, stage, spec);
    if (!c.from) return resolveCam(c, stage, spec);
    const p = EASE[c.ease || 'inOut'](clamp((tl - (c.t0 || 0)) / (c.dur || (shot.end - shot.start))));
    const a = resolveCam(c.from, stage, spec), b = resolveCam(c.to || c.from, stage, spec);
    return { cx: lerp(a.cx, b.cx, p), cy: lerp(a.cy, b.cy, p), w: a.w * Math.pow(b.w / a.w, p), rot: lerp(a.rot, b.rot, p) };
  }
  function camEnd(shot, stage, spec) { const c = shot.cam; return c ? resolveCam(c.from ? c.to || c.from : c, stage, spec) : null; }
  function makeView(spec, stage, cam) {
    const W = spec.width, H = spec.height, s = W / cam.w, rot = cam.rot || 0;
    const rr = rot * RAD, cs = Math.cos(rr), sn = Math.sin(rr);
    const unit = (x, y) => { const dx = (x - cam.cx) * s, dy = (y - cam.cy) * s; return [W / 2 + dx * cs - dy * sn, H / 2 + dx * sn + dy * cs]; };
    return {
      s, W, H, stage,
      transform: `translate(${W / 2},${H / 2}) rotate(${rot}) scale(${s}) translate(${-cam.cx},${-cam.cy})`,
      xy: (lon, lat) => unit(...stage.project(lon, lat)),
      world: unit, unit,
    };
  }

  /* ---------------- timing helpers ---------------- */
  function life(e, t) {
    const t0 = e.t0 || 0, d = e.dur ?? 0.45;
    if (t < t0) return null;
    const a = clamp((t - t0) / Math.max(d, 1e-6));
    let out = 1;
    if (e.t1 != null) { out = 1 - clamp((t - e.t1) / (e.outDur ?? 0.3)); if (out <= 0) return null; }
    return { p: a, pop: d ? EASE.back(a) : 1, ease: EASE.out(a), out, age: t - t0 };
  }

  /* ---------------- base layers (persistent DOM) ---------------- */
  let baseKey = null, baseEls = null;
  function landGradient(pr) {
    const stops = [[85, '#eef3f4'], [70, '#d5dedd'], [63, '#5d7448'], [50, '#56703c'], [40, '#7c7f4c'], [32, '#a99268'], [24, '#b39b6e'], [16, '#86804e'], [6, '#3f6a2e'], [-8, '#41692d'], [-22, '#9b8659'], [-34, '#6f7d48'], [-48, '#6b7a54'], [-62, '#d3dbdc'], [-85, '#f1f5f6']];
    const y = lat => pr(0, lat)[1];
    const y0 = y(85), y1 = y(-85);
    return `<linearGradient id="kzLandG" gradientUnits="userSpaceOnUse" x1="0" y1="${y0}" x2="0" y2="${y1}">` +
      stops.map(([la, c]) => `<stop offset="${((y(la) - y0) / (y1 - y0)).toFixed(4)}" stop-color="${c}"/>`).join('') + '</linearGradient>';
  }
  function bordersSvg(spec, stage, b) {
    let s = '';
    if (b.countries) s += `<path d="${featureSet('countries', spec).map(f => featurePath(f, stage).d).join('')}" fill="none" stroke="${b.color || T.border}" stroke-width="${b.width || 1.6}" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>`;
    if (b.provinces) s += `<path d="${featureSet('provinces', spec).map(f => featurePath(f, stage).d).join('')}" fill="none" stroke="${b.provinceColor || b.stateColor || T.stateBorder}" stroke-width="${b.provinceWidth || 1.2}" vector-effect="non-scaling-stroke"/>`;
    if (b.states) s += `<path d="${featureSet('states', spec).map(f => featurePath(f, stage).d).join('')}" fill="none" stroke="${b.stateColor || T.stateBorder}" stroke-width="${b.stateWidth || 1.2}" vector-effect="non-scaling-stroke"/>`;
    return s;
  }
  function worldLayers(spec, stage) {
    const bm = spec.basemap || {};
    const style = bm.style || (bm.image || bm.images ? 'image' : 'satellite');
    let layers = '';
    if (style === 'satellite' || style === 'flat') {
      const land = featureSet('countries', spec).map(f => featurePath(f, stage).d).join('');
      const flat = style === 'flat';
      layers += `<path d="${land}" fill="none" stroke="${bm.shelf || T.shelf}" stroke-width="9" stroke-opacity=".55" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>`;
      layers += `<path d="${land}" fill="${flat ? (bm.land || '#6f8f4e') : 'url(#kzLandG)'}" ${flat ? '' : 'filter="url(#kzTex)"'}/>`;
    }
    const imgs = bm.images || (bm.image ? [{ src: bm.image, bounds: bm.bounds || [-180, -90, 180, 90] }] : []);
    for (const im of imgs) {
      const [w, s, e, n] = im.bounds || [-180, -90, 180, 90];
      const [x0, y0] = stage.project(w, n), [x1, y1] = stage.project(e, s);
      layers += `<image href="${esc(im.src)}" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" preserveAspectRatio="none" opacity="${im.opacity ?? 1}"/>`;
    }
    layers += bordersSvg(spec, stage, Object.assign({ countries: true, states: style !== 'image' }, spec.borders || {}));
    return `<g id="kzL">${layers}</g><use href="#kzL" x="${-360 * K}"/><use href="#kzL" x="${360 * K}"/>`;
  }
  function buildBase(spec) {
    const key = JSON.stringify([spec.basemap, spec.projection, spec.borders, spec.maps, spec.width, spec.height]);
    if (key === baseKey) return baseEls;
    const stage = document.getElementById('stage');
    stage.innerHTML = '';
    stage.style.cssText = `position:relative;width:${spec.width}px;height:${spec.height}px;overflow:hidden;background:#000`;
    const bm = spec.basemap || {};
    const usesWorld = spec.shots.some(s => !s.map && (!s.bg || s.bg === 'map' || s.bg.type === 'map'));
    let groups = usesWorld ? `<g id="kzS_world">${worldLayers(spec, getStage(spec, 'world'))}</g>` : '';
    for (const [id, m] of Object.entries(spec.maps || {})) {
      const st = getStage(spec, id);
      groups += `<g id="kzS_${id}" style="display:none"><image href="${esc(m.src)}" x="0" y="0" width="${m.w}" height="${m.h}" preserveAspectRatio="none"/>${m.borders ? bordersSvg(spec, st, m.borders) : ''}</g>`;
    }
    const tex = `<filter id="kzTex" x="-2000" y="-1000" width="4000" height="2000" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="${bm.grain ?? 0.09}" numOctaves="4" seed="7" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.15" result="m"/>
      <feComposite in="SourceGraphic" in2="m" operator="arithmetic" k1="0" k2="0.78" k3="0" k4="0" result="dark"/>
      <feBlend in="SourceGraphic" in2="dark" mode="multiply" result="b"/>
      <feComposite in="b" in2="SourceGraphic" operator="in"/></filter>`;
    stage.insertAdjacentHTML('beforeend',
      `<svg id="kzBase" width="${spec.width}" height="${spec.height}" style="position:absolute;left:0;top:0">
        <defs>${landGradient(PROJ[spec.projection || 'equirect'])}${tex}
          <radialGradient id="kzOcean" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="${bm.ocean || T.ocean}"/><stop offset="1" stop-color="${bm.oceanDeep || T.oceanDeep}"/></radialGradient>
          <radialGradient id="kzVig" cx="50%" cy="50%" r="75%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${bm.vignette ?? 0.45}"/></radialGradient>
        </defs>
        <rect id="kzOceanR" width="100%" height="100%" fill="url(#kzOcean)"/>
        <g id="kzWorld">${groups}<g id="kzDyn"></g></g>
        <rect width="100%" height="100%" fill="url(#kzVig)" pointer-events="none"/>
      </svg>
      <svg id="kzOver" width="${spec.width}" height="${spec.height}" style="position:absolute;left:0;top:0"></svg>
      <div id="kzFade" style="position:absolute;inset:0;background:#000;opacity:0"></div>`);
    baseKey = key;
    const $ = id => document.getElementById(id);
    baseEls = { base: $('kzBase'), world: $('kzWorld'), dyn: $('kzDyn'), over: $('kzOver'), fade: $('kzFade'), ocean: $('kzOceanR'), stages: {} };
    for (const g of baseEls.world.querySelectorAll('[id^="kzS_"]')) baseEls.stages[g.id.slice(4)] = g;
    return baseEls;
  }

  /* ---------------- shared drawing bits ---------------- */
  const shadow = (blur = 6, op = 0.6) => `<filter id="kzSh" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="3" stdDeviation="${blur}" flood-color="#000" flood-opacity="${op}"/></filter>`;
  const glowF = (id, std) => `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${std}"/></filter>`;
  function richText(text, hi) {
    // *word* = highlight colour, !word! = red
    return esc(text).replace(/\*([^*]+)\*/g, `<tspan fill="${hi}">$1</tspan>`).replace(/!([^!]+)!/g, `<tspan fill="${T.red}">$1</tspan>`);
  }
  const popT = (x, y, k, rot = 0) => `transform="translate(${f1(x)},${f1(y)}) rotate(${rot}) scale(${Math.max(0, k).toFixed(3)})"`;

  /* Icons: drawn in a ~100px box centred on 0,0 */
  const ICON = {
    person: c => `<circle cx="0" cy="-30" r="15" fill="${c}"/><path d="M-22,-8 Q-22,-14 -14,-14 L14,-14 Q22,-14 22,-8 L22,22 L12,22 L12,48 L-12,48 L-12,22 L-22,22 Z" fill="${c}"/>`,
    lock: c => `<path d="M-20,-6 V-22 A20,20 0 0 1 20,-22 V-6" fill="none" stroke="#e9eef2" stroke-width="9"/><rect x="-30" y="-8" width="60" height="46" rx="8" fill="${c}" stroke="#fff" stroke-width="4"/><circle cx="0" cy="12" r="6" fill="#fff"/><rect x="-3" y="12" width="6" height="14" fill="#fff"/>`,
    clock: c => `<circle r="40" fill="#f4f6f8" stroke="#ccd3d9" stroke-width="5"/><circle r="40" fill="none" stroke="${c === T.white ? '#9aa4ad' : c}" stroke-width="3"/><path d="M0,0 V-26 M0,0 L18,10" stroke="#20262c" stroke-width="5" stroke-linecap="round"/><circle r="4" fill="#20262c"/>`,
    check: c => `<rect x="-36" y="-36" width="72" height="72" rx="12" fill="${c === T.white ? T.green : c}" stroke="#d6ffd9" stroke-width="4"/><path d="M-18,0 L-5,14 L20,-14" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`,
    cross: c => `<rect x="-36" y="-36" width="72" height="72" rx="12" fill="${c === T.white ? T.red : c}"/><path d="M-15,-15 L15,15 M15,-15 L-15,15" stroke="#fff" stroke-width="10" stroke-linecap="round"/>`,
    question: c => `<text y="26" text-anchor="middle" font-family="${T.font}" font-weight="900" font-size="84" fill="${c}" stroke="#000" stroke-opacity=".25" stroke-width="3">?</text>`,
    flag: c => `<rect x="-30" y="-46" width="5" height="92" fill="#ddd"/><path d="M-25,-44 Q5,-54 35,-44 L35,-6 Q5,-16 -25,-6 Z" fill="${c}" stroke="#fff" stroke-width="2"/>`,
    star: c => `<path d="M0,-40 L11,-13 L40,-12 L17,6 L25,35 L0,18 L-25,35 L-17,6 L-40,-12 L-11,-13 Z" fill="${c}"/>`,
    pin: c => `<path d="M0,0 C-8,-14 -26,-28 -26,-46 A26,26 0 0 1 26,-46 C26,-28 8,-14 0,0 Z" fill="${c}" stroke="#fff" stroke-width="4"/><circle cy="-46" r="9" fill="#fff"/>`,
    dot: c => `<circle r="14" fill="${c}" stroke="#fff" stroke-width="4"/>`,
    house: c => `<path d="M-38,0 L0,-34 L38,0 L28,0 L28,34 L-28,34 L-28,0 Z" fill="${c}" stroke="#fff" stroke-width="3"/><rect x="-9" y="10" width="18" height="24" fill="#fff" opacity=".8"/>`,
    plane: c => `<path d="M-40,4 L-6,0 L10,-34 L18,-34 L10,0 L34,0 L42,-12 L48,-12 L44,4 L48,20 L42,20 L34,8 L10,8 L18,42 L10,42 L-6,8 L-40,4 Z" fill="${c}" transform="scale(.9)"/>`,
    ship: c => `<path d="M-48,6 L48,6 L38,24 L-40,24 Z" fill="${c}"/><rect x="-20" y="-14" width="34" height="20" fill="${c}"/><rect x="-6" y="-30" width="8" height="18" fill="${c}"/>`,
    burst: c => `<path d="M0,-44 L10,-14 L40,-26 L20,0 L44,16 L12,14 L8,44 L-6,16 L-36,32 L-18,4 L-44,-10 L-12,-14 Z" fill="${c === T.white ? T.orange : c}"/><circle r="12" fill="${T.yellow}"/>`,
    gavel: c => `<g transform="rotate(-35)"><rect x="-34" y="-30" width="68" height="30" rx="6" fill="${c === T.white ? '#b07a45' : c}" stroke="#fff" stroke-width="3"/><rect x="-6" y="0" width="12" height="52" rx="4" fill="#8a5a2e" stroke="#fff" stroke-width="2"/></g><rect x="-40" y="34" width="56" height="12" rx="3" fill="#8a5a2e" stroke="#fff" stroke-width="2"/>`,
    ballot: c => `<rect x="-42" y="-6" width="84" height="48" rx="6" fill="${c === T.white ? T.blue : c}" stroke="#fff" stroke-width="4"/><rect x="-26" y="-44" width="52" height="58" rx="3" fill="#fff" stroke="#cfd6dc" stroke-width="2" transform="rotate(-6)"/><path d="M-14,-24 L-4,-14 L14,-34" fill="none" stroke="${T.green}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><rect x="-30" y="-8" width="60" height="6" fill="#123"/>`,
    train: c => `<rect x="-26" y="-34" width="52" height="58" rx="14" fill="${c === T.white ? T.blue : c}" stroke="#fff" stroke-width="4"/><rect x="-16" y="-24" width="32" height="18" rx="4" fill="#fff"/><circle cx="-12" cy="10" r="5" fill="#fff"/><circle cx="12" cy="10" r="5" fill="#fff"/>`,
  };

  /* ---------------- point resolver ---------------- */
  function P(ctx, a, b) {
    // accepts ({lon,lat}) | ({x,y}) | ([u,v]) ; arrays are lon/lat on map shots, px on cutaway shots
    if (Array.isArray(a)) return ctx.map ? ctx.view.xy(a[0], a[1]) : [a[0], a[1]];
    if (a && a.lon != null) return ctx.view.xy(a.lon, a.lat);
    if (a && a.ix != null) return ctx.view.unit(a.ix, a.iy);
    if (a && a.x != null) return [a.x, a.y];
    return [ctx.W / 2, ctx.H / 2];
  }
  function polyLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
  function partial(pts, p) {
    if (p >= 1) return pts;
    const L = polyLen(pts) * p; let acc = 0; const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (acc + d >= L) { const k = (L - acc) / (d || 1); out.push([lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]); return out; }
      acc += d; out.push(pts[i]);
    }
    return out;
  }
  const pd = pts => 'M' + pts.map(p => f1(p[0]) + ',' + f1(p[1])).join('L');

  /* ---------------- elements ----------------
   * Map-space elements return {map: svg} (drawn inside the camera transform).
   * Everything else returns screen-space svg.  ctx: {W,H,view,map,spec,s,id}
   */
  const E = {};

  /* ---- highlights ---- */
  function pill(x, y, text, o, k = 1, op = 1) {
    const size = o.size || 34, w = String(text).replace(/[*!]/g, '').length * size * 0.6 + size * 0.9, h = size * 1.55;
    const bg = col(o.bg || 'ink'), fg = col(o.color || 'white');
    return `<g ${popT(x, y, k)} opacity="${op}" filter="url(#kzSh)"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h * 0.22}" fill="${bg}" stroke="${o.border === false ? 'none' : col(o.border || '#ffffff')}" stroke-width="${o.borderWidth ?? 3}"/>
      <text text-anchor="middle" y="${size * 0.36}" font-family="${T.font}" font-weight="800" font-size="${size}" fill="${fg}">${richText(text, T.yellow)}</text></g>`;
  }
  const darkText = c => ['zoneYellow', 'sand', 'yellow', 'mint', '#f2df78', '#f6eea0'].includes(c);

  E.region = (ctx, e0, L) => {
    const e = Object.assign({}, RSTYLE[e0.style || 'tint'], e0);
    const st = ctx.view.stage;
    const fs = findFeatures(e, ctx.spec, e.set);
    if (!fs.length) return '';
    const paths = fs.map(f => featurePath(f, st));
    const d = paths.map(p => p.d).join('');
    const box = paths.reduce((b, p) => [Math.min(b[0], p.box[0]), Math.min(b[1], p.box[1]), Math.max(b[2], p.box[2]), Math.max(b[3], p.box[3])], [1e12, 1e12, -1e12, -1e12]);
    const c = col(e.fill), sw = e.outlineWidth;
    const pulse = e.pulse ? 0.78 + 0.22 * Math.sin(L.age * 5) : 1;
    const reveal = e.reveal || 'fade';
    const fadeK = reveal === 'fade' || reveal === 'pop' ? L.ease : 1;
    const op = e.opacity * fadeK * L.out * pulse, lineOp = fadeK * L.out;
    const id = 'kzR' + ctx.id;
    let defs = '', clip = '', g = '', tr = '';
    if (reveal === 'wipe' || reveal === 'wipeDown' || reveal === 'wipeLeft' || reveal === 'wipeUp') {
      const p = EASE.inOut(L.p), [x0, y0, x1, y1] = box, pad = (x1 - x0 + y1 - y0) * 0.02;
      const r = reveal === 'wipe' ? [x0 - pad, y0 - pad, (x1 - x0 + 2 * pad) * p, y1 - y0 + 2 * pad]
        : reveal === 'wipeLeft' ? [x1 + pad - (x1 - x0 + 2 * pad) * p, y0 - pad, (x1 - x0 + 2 * pad) * p, y1 - y0 + 2 * pad]
        : reveal === 'wipeUp' ? [x0 - pad, y1 + pad - (y1 - y0 + 2 * pad) * p, x1 - x0 + 2 * pad, (y1 - y0 + 2 * pad) * p]
        : [x0 - pad, y0 - pad, x1 - x0 + 2 * pad, (y1 - y0 + 2 * pad) * p];
      defs += `<clipPath id="${id}c"><rect x="${r[0]}" y="${r[1]}" width="${Math.max(0, r[2])}" height="${Math.max(0, r[3])}"/></clipPath>`;
      clip = `clip-path="url(#${id}c)"`;
    }
    if (reveal === 'pop') { const k = lerp(0.92, 1, EASE.back(L.p)), cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2; tr = `transform="translate(${cx},${cy}) scale(${k}) translate(${-cx},${-cy})"`; }
    if (e.spotlight) g += `<path d="M-1e7,-1e7H1e7V1e7H-1e7Z${d}" fill="#000" fill-rule="evenodd" opacity="${e.spotlight * L.ease * L.out}"/>`;
    if (e.glow) {
      defs += glowF(id + 'g', (e.glowSize || 16) / ctx.view.s);
      g += `<path d="${d}" fill="${c}" opacity="${Math.min(1, op * 1.1)}" filter="url(#${id}g)"/>`;
    }
    g += `<path d="${d}" fill="${c}" fill-opacity="${op}" stroke="${col(e.outline)}" stroke-opacity="${lineOp}" stroke-width="${sw}" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>`;
    if (e.glow) g += `<path d="${d}" fill="#fff2b0" fill-opacity="${0.25 * op}"/>`;
    let screen = '';
    if (e.label) {
      const [lx, ly] = e.labelAt ? P(ctx, e.labelAt) : ctx.view.unit(...paths[0].c);
      const text = e.label === true ? fs[0].properties.name : e.label;
      const lk = clamp((L.age - (e.labelDelay ?? 0.25)) / 0.35);
      if (lk > 0) screen = (e.labelPill ?? e.style === 'zone')
        ? pill(lx + (e.labelDx || 0), ly + (e.labelDy || 0), text, Object.assign({ bg: e.fill, color: darkText(e.fill) ? 'ink' : 'white' }, e.labelStyle || {}), EASE.back(lk), L.out)
        : textEl(lx + (e.labelDx || 0), ly + (e.labelDy || 0), text, Object.assign({ size: 40, weight: 800 }, e.labelStyle || {}), EASE.back(lk), L.out);
    }
    return { map: `<g ${clip} ${tr}><defs>${defs}</defs>${g}</g>`, screen };
  };

  // Several colour-coded regions in sequence (time zones, voting blocs, climate bands...)
  const PRESETS = {
    'na-timezones': [
      { label: 'UTC-10', fill: 'zonePink', names: ['Hawaii'], labelAt: [-157, 23.5] },
      { label: 'UTC-9', fill: 'zoneBlue', names: ['Alaska'], labelAt: [-152, 64] },
      { label: 'UTC-8', fill: 'zoneGreen', names: ['Washington', 'Oregon', 'California', 'Nevada', 'British Columbia'], labelAt: [-121, 45] },
      { label: 'UTC-7', fill: 'zoneOrange', names: ['Montana', 'Idaho', 'Wyoming', 'Utah', 'Colorado', 'Arizona', 'New Mexico', 'Alberta', 'Northwest Territories', 'Yukon'], labelAt: [-109, 42] },
      { label: 'UTC-6', fill: 'zoneRed', names: ['North Dakota', 'South Dakota', 'Nebraska', 'Kansas', 'Oklahoma', 'Texas', 'Minnesota', 'Iowa', 'Missouri', 'Arkansas', 'Louisiana', 'Wisconsin', 'Illinois', 'Mississippi', 'Alabama', 'Tennessee', 'Manitoba', 'Saskatchewan', 'Nunavut'], labelAt: [-96, 38] },
      { label: 'UTC-5', fill: 'zoneYellow', names: ['Michigan', 'Indiana', 'Ohio', 'Kentucky', 'Georgia', 'Florida', 'South Carolina', 'North Carolina', 'Virginia', 'West Virginia', 'Pennsylvania', 'New York', 'Vermont', 'New Hampshire', 'Maine', 'Massachusetts', 'Rhode Island', 'Connecticut', 'New Jersey', 'Delaware', 'Maryland', 'District of Columbia', 'Ontario', 'Québec'], labelAt: [-81, 36] },
      { label: 'UTC-4', fill: 'zonePurple', names: ['New Brunswick', 'Nova Scotia', 'Prince Edward Island'], labelAt: [-65, 45] },
      { label: 'UTC-3:30', fill: '#a77fd6', names: ['Newfoundland and Labrador'], labelAt: [-58, 53] },
    ],
  };
  E.zones = (ctx, e, L) => {
    const items = e.items || PRESETS[e.preset] || [];
    const only = e.only && e.only.map(s => String(s).toLowerCase());
    const st = e.stagger ?? 0.15;
    let map = '', screen = '';
    items.filter(it => !only || only.includes(String(it.label).toLowerCase())).forEach((it, i) => {
      const sub = Object.assign({ style: e.style || 'zone', set: e.set || 'provinces', labelPill: e.labels !== false, quiet: true, reveal: e.reveal }, e.itemStyle || {}, it);
      if (e.labels === false) sub.label = null;
      if (e.labelText) sub.label = e.labelText[i] ?? sub.label;
      const Li = life({ t0: i * st, dur: e.dur ?? 0.45, t1: e.t1 != null ? e.t1 - (e.t0 || 0) : undefined }, L.age);
      if (!Li) return;
      ctx.id++;
      const r = E.region(ctx, sub, Li);
      if (r) { map += r.map || ''; screen += r.screen || ''; }
    });
    return { map, screen };
  };

  // Outline every feature of a set (e.g. add state lines to an image that lacks them)
  E.borders = (ctx, e, L) => {
    const fs = e.names ? findFeatures(e, ctx.spec, e.set || 'provinces') : featureSet(e.set || 'provinces', ctx.spec).filter(f => !e.country || f.properties.country === e.country);
    const d = fs.map(f => featurePath(f, ctx.view.stage).d).join('');
    return { map: `<path d="${d}" fill="none" stroke="${col(e.color || 'white')}" stroke-opacity="${(e.opacity ?? 0.8) * L.ease * L.out}" stroke-width="${e.width || 1.6}" vector-effect="non-scaling-stroke" stroke-linejoin="round" ${e.dashed ? 'stroke-dasharray="6 5"' : ''}/>` };
  };

  // Free-form highlight polygon: points are [lon,lat] (map) or {ix,iy}/{x,y}
  E.area = (ctx, e0, L) => {
    const e = Object.assign({}, RSTYLE[e0.style || 'tint'], e0);
    const pts = (e.points || []).map(p => P(ctx, p));
    if (pts.length < 3) return '';
    const d = (e.smooth ? smoothPath(pts) : pd(pts)) + 'Z';
    const c = col(e.fill), op = e.opacity * L.ease * L.out;
    const id = 'kzA' + ctx.id;
    let s = '';
    if (e.glow) s += `<defs>${glowF(id, e.glowSize || 16)}</defs><path d="${d}" fill="${c}" opacity="${op}" filter="url(#${id})"/>`;
    s += `<path d="${d}" fill="${c}" fill-opacity="${op}" stroke="${col(e.outline)}" stroke-opacity="${L.ease * L.out}" stroke-width="${e.outlineWidth}" stroke-linejoin="round"/>`;
    if (e.label) { const [x, y] = e.labelAt ? P(ctx, e.labelAt) : [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length]; s += e.labelPill ? pill(x, y, e.label, Object.assign({ bg: e.fill, color: darkText(e.fill) ? 'ink' : 'white' }, e.labelStyle || {}), L.pop, L.out) : textEl(x, y, e.label, Object.assign({ size: 40 }, e.labelStyle || {}), L.pop, L.out); }
    return s;
  };
  function smoothPath(pts) { // closed Catmull-Rom
    const n = pts.length; let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])},${f1(p2[1])}`;
    }
    return d;
  }
  E.dim = (ctx, e, L) => `<rect width="${ctx.W}" height="${ctx.H}" fill="#000" opacity="${(e.opacity ?? 0.5) * L.ease * L.out}"/>`;

  function textEl(x, y, text, o, k = 1, op = 1) {
    const size = o.size || 40, c = col(o.color || 'white');
    const fam = o.serif ? T.serif : T.font;
    const stroke = o.stroke === false ? '' : `stroke="#000" stroke-opacity=".55" stroke-width="${size / 9}" paint-order="stroke" stroke-linejoin="round"`;
    const lines = String(text).split('\n');
    return `<g ${popT(x, y, k, o.rotate || 0)} opacity="${op}"><text text-anchor="${o.anchor || 'middle'}" font-family="${fam}" font-weight="${o.weight || 700}" font-size="${size}" fill="${c}" ${stroke} ${o.italic ? 'font-style="italic"' : ''} letter-spacing="${o.spacing || 0}">${lines.map((l, i) => `<tspan x="0" dy="${i ? size * 1.15 : size * 0.35}">${richText(l, T.yellow)}</tspan>`).join('')}</text></g>`;
  }

  E.label = (ctx, e, L) => { const [x, y] = P(ctx, e.at || e); return textEl(x + (e.dx || 0), y + (e.dy || 0), e.text, e, e.pop === false ? 1 : L.pop, L.out * (e.pop === false ? L.ease : 1)); };

  E.number = (ctx, e, L) => {
    const [x, y] = P(ctx, e.at || e);
    let txt = e.text;
    if (e.countTo != null) { const v = Math.round(lerp(e.countFrom || 0, e.countTo, EASE.out(clamp(L.age / (e.countDur || 1))))); txt = (e.prefix || '') + v.toLocaleString('en-US') + (e.suffix || ''); }
    return textEl(x + (e.dx || 0), y + (e.dy || 0), txt, Object.assign({ size: 96, weight: 900, color: 'yellow' }, e), L.pop, L.out);
  };

  E.icon = (ctx, e, L) => {
    const pts = e.points || [e.at || e];
    const k = (e.size || 60) / 100, st = e.stagger ?? 0.06, d = e.dur ?? 0.35;
    let s = `<g opacity="${L.out}" filter="url(#kzSh)">`;
    pts.forEach((pt, i) => {
      const a = clamp((L.age - i * st) / d); if (a <= 0) return;
      const [x, y] = P(ctx, pt);
      const c = col(Array.isArray(e.colors) ? e.colors[i % e.colors.length] : e.color || 'white');
      s += `<g ${popT(x, y, k * EASE.back(a), e.rotate || 0)}>${(ICON[e.icon] || ICON.dot)(c)}</g>`;
    });
    return s + '</g>';
  };

  E.pin = (ctx, e, L) => {
    const [x, y] = P(ctx, e.at || e);
    const k = (e.size || 70) / 100;
    let s = `<g filter="url(#kzSh)" opacity="${L.out}"><g ${popT(x, y, k * L.pop)}>${ICON.pin(col(e.color || 'red'))}</g></g>`;
    if (e.label) s += textEl(x, y - 80 * k - 26, e.label, Object.assign({ size: 34 }, e.labelStyle || {}), L.pop, L.out);
    return s;
  };

  E.dot = (ctx, e, L) => {
    const [x, y] = P(ctx, e.at || e), r = e.r || 10;
    const ring = e.ping ? `<circle cx="${x}" cy="${y}" r="${r + 30 * ((L.age * 1.2) % 1)}" fill="none" stroke="${col(e.color || 'yellow')}" stroke-width="3" opacity="${1 - ((L.age * 1.2) % 1)}"/>` : '';
    return `<g opacity="${L.out}">${ring}<circle cx="${x}" cy="${y}" r="${r * L.pop}" fill="${col(e.color || 'yellow')}" stroke="#fff" stroke-width="3"/></g>` + (e.label ? textEl(x + (e.labelDx ?? 0), y + (e.labelDy ?? -34), e.label, Object.assign({ size: 30 }, e.labelStyle || {}), L.pop, L.out) : '');
  };

  E.path = (ctx, e, L) => {
    const pts = (e.points || []).map(p => P(ctx, p));
    const prog = e.draw === false ? 1 : EASE.inOut(clamp(L.age / (e.drawDur || 1.2)));
    const part = partial(pts, prog);
    if (part.length < 2) return '';
    const c = col(e.color || 'yellow'), w = e.width || 6, d = pd(part) + (e.closed && prog >= 1 ? 'Z' : '');
    const dash = e.dashed ? `stroke-dasharray="${w * 2.5} ${w * 2}"` : '';
    let s = `<g opacity="${L.out}" fill="none" stroke-linecap="round" stroke-linejoin="round">`;
    if (e.glow !== false) s += `<path d="${d}" stroke="${c}" stroke-width="${w * 3}" opacity=".45" filter="url(#kzBlur)"/>`;
    s += `<path d="${d}" stroke="${c}" stroke-width="${w}" ${dash}/>`;
    if (e.arrow && prog > 0.05) {
      const a = part[part.length - 1], b = part[Math.max(0, part.length - 2)], ang = Math.atan2(a[1] - b[1], a[0] - b[0]) / RAD;
      s += `<path d="M0,0 L-${w * 4},-${w * 2.4} L-${w * 4},${w * 2.4} Z" fill="${c}" stroke="none" transform="translate(${a[0]},${a[1]}) rotate(${ang})"/>`;
    }
    return s + '</g>';
  };

  E.arrow = (ctx, e, L) => {
    const a = P(ctx, e.from), b = P(ctx, e.to);
    const bend = e.bend ?? 0.2, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const nx = -(b[1] - a[1]) * bend, ny = (b[0] - a[0]) * bend;
    const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30; pts.push([(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * (mx + nx) + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * (my + ny) + u * u * b[1]]); }
    return E.path(Object.assign({}, ctx, { map: false }), Object.assign({ glow: false, arrow: true, drawDur: 0.6, width: 7, color: 'white' }, e, { points: pts }), L);
  };

  E.ruler = (ctx, e, L) => {
    const a = P(ctx, e.from), b = P(ctx, e.to);
    const p = EASE.inOut(clamp(L.age / (e.drawDur || 0.8)));
    const bx = lerp(a[0], b[0], p), by = lerp(a[1], b[1], p);
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), nx = -Math.sin(ang) * 18, ny = Math.cos(ang) * 18;
    const c = col(e.color || 'white');
    let s = `<g opacity="${L.out}" stroke="${c}" stroke-width="4" stroke-linecap="round" filter="url(#kzSh)">
      <path d="M${a[0] - nx},${a[1] - ny} L${a[0] + nx},${a[1] + ny} M${a[0]},${a[1]} L${bx},${by}"/>`;
    if (p >= 1) s += `<path d="M${b[0] - nx},${b[1] - ny} L${b[0] + nx},${b[1] + ny}"/>`;
    s += '</g>';
    if (e.text && p > 0.5) {
      let deg = ang / RAD; if (deg > 90 || deg < -90) deg += 180;
      const off = e.textOffset ?? -34;
      s += textEl((a[0] + b[0]) / 2 + Math.sin(ang) * -off, (a[1] + b[1]) / 2 - Math.cos(ang) * -off, e.text, Object.assign({ size: 40, weight: 800, rotate: deg }, e.textStyle || {}), EASE.back(clamp((p - 0.5) * 2)), L.out);
    }
    return s;
  };

  E.meridians = (ctx, e, L) => {
    // vertical longitude lines (or parallels with lats:[...])
    const p = EASE.inOut(clamp(L.age / (e.drawDur || 0.8)));
    let s = `<g opacity="${(e.opacity ?? 0.85) * L.out}" stroke="${col(e.color || 'white')}" stroke-width="${e.width || 3}" fill="none">`;
    for (const lon of e.lons || []) { const [x] = ctx.view.xy(lon, 0); s += `<path d="M${x},0 L${x},${ctx.H * p}"/>`; if (e.labels) s += `</g>${textEl(x, ctx.H * (e.labelY ?? 0.42), lon < 0 ? `${-lon}° W` : `${lon}° E`, { size: 26 }, L.pop, L.out)}<g opacity="${(e.opacity ?? 0.85) * L.out}" stroke="${col(e.color || 'white')}" stroke-width="${e.width || 3}" fill="none">`; }
    for (const lat of e.lats || []) { const [, y] = ctx.view.xy(0, lat); s += `<path d="M0,${y} L${ctx.W * p},${y}"/>`; }
    return s + '</g>';
  };

  E.circle = (ctx, e, L) => {
    const [x, y] = P(ctx, e.at || e), rx = e.rx || e.r || 80, ry = e.ry || e.r || 80;
    const p = EASE.out(clamp(L.age / (e.drawDur || 0.5)));
    const circ = Math.PI * (rx + ry), c = col(e.color || 'yellow');
    return `<g opacity="${L.out}" transform="rotate(${e.rotate || 0},${x},${y})"><ellipse cx="${x}" cy="${y}" rx="${ry}" ry="${rx}" fill="${e.fill ? col(e.fill) : 'none'}" fill-opacity="${(e.fillOpacity ?? 0.2) * p}" stroke="${c}" stroke-width="${e.width || 6}" stroke-dasharray="${circ * p} ${circ}" stroke-linecap="round" transform="rotate(-90,${x},${y})" filter="url(#kzSh)"/></g>` +
      (e.label ? textEl(x + (e.labelDx || 0), y + (e.labelDy ?? -ry - 30), e.label, Object.assign({ size: 34 }, e.labelStyle || {}), L.pop, L.out) : '');
  };

  E.timeTag = (ctx, e, L) => {
    const [x, y] = P(ctx, e.at || e), size = e.size || 34, w = String(e.text).length * size * 0.62 + size;
    return `<g ${popT(x, y, L.pop)} opacity="${L.out}" filter="url(#kzSh)"><rect x="${-w / 2}" y="${-size * 0.8}" width="${w}" height="${size * 1.6}" rx="${size * 0.25}" fill="${col(e.bg || '#16191d')}" fill-opacity=".9"/><text text-anchor="middle" y="${size * 0.36}" font-family="${T.font}" font-weight="700" font-size="${size}" fill="${col(e.color || 'white')}">${esc(e.text)}</text></g>`;
  };

  E.box = (ctx, e, L) => {
    const [x, y] = P(ctx, e.at || e), w = e.w || 360, h = e.h || 90, size = e.size || 30;
    return `<g ${popT(x, y, L.pop)} opacity="${L.out}" filter="url(#kzSh)"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${e.radius ?? 6}" fill="${col(e.fill || 'orange')}" stroke="${col(e.stroke || '#ffd9a0')}" stroke-width="3"/>
      <text text-anchor="middle" font-family="${T.font}" font-weight="800" font-size="${size}" fill="${col(e.color || 'white')}">${String(e.text).split('\n').map((l, i, a) => `<tspan x="0" y="${(i - (a.length - 1) / 2) * size * 1.1 + size * 0.36}">${esc(l)}</tspan>`).join('')}</text></g>`;
  };

  E.line = (ctx, e, L) => E.path(Object.assign({}, ctx, { map: false }), Object.assign({ glow: false, width: 5, drawDur: 0.4, color: 'white' }, e, { points: (e.points || [[e.x1, e.y1], [e.x2, e.y2]]) }), L);

  E.people = (ctx, e, L) => {
    // isotype grid of person icons: {x,y,count,cols,size,gap,color,colors:[[n,color],...]}
    const n = e.count || 10, cols = e.cols || 10, size = e.size || 40, gap = e.gap ?? size * 0.2;
    const [x0, y0] = P(ctx, e.at || e), rows = Math.ceil(n / cols);
    const W = cols * (size * 0.6 + gap) - gap, Hh = rows * (size + gap) - gap;
    const colorOf = i => { if (!e.colors) return col(e.color || 'white'); let acc = 0; for (const [k, c] of e.colors) { acc += k; if (i < acc) return col(c); } return col(e.color || 'white'); };
    const st = e.stagger ?? Math.min(0.02, 1.2 / n);
    let s = `<g opacity="${L.out}">`;
    for (let i = 0; i < n; i++) {
      const a = clamp((L.age - i * st) / 0.3); if (a <= 0) break;
      const cx = x0 - W / 2 + (i % cols) * (size * 0.6 + gap) + size * 0.3, cy = y0 - Hh / 2 + Math.floor(i / cols) * (size + gap) + size / 2;
      s += `<g ${popT(cx, cy, (size / 100) * EASE.back(a))}>${ICON.person(colorOf(i))}</g>`;
    }
    return s + '</g>';
  };

  E.seats = (ctx, e, L) => {
    // parliament hemicycle: {x,y,r,parties:[[n,color],...],rows}
    const [x, y] = P(ctx, e.at || e), R = e.r || 300, parties = e.parties || [[100, 'blue']];
    const N = parties.reduce((a, p) => a + p[0], 0), rows = e.rows || Math.max(2, Math.round(Math.sqrt(N / 6)));
    const r0 = R * 0.38, seats = [];
    const radii = Array.from({ length: rows }, (_, i) => lerp(r0, R, rows === 1 ? 1 : i / (rows - 1)));
    const tot = radii.reduce((a, b) => a + b, 0); let left = N;
    radii.forEach((r, i) => { const k = i === rows - 1 ? left : Math.round(N * r / tot); left -= k; for (let j = 0; j < k; j++) seats.push({ r, a: Math.PI - (k === 1 ? Math.PI / 2 : (j / (k - 1)) * Math.PI) }); });
    seats.sort((p, q) => q.a - p.a);
    const dotR = Math.min(R * 1.4 / (rows * 2.6), (Math.PI * R / (seats.filter(s => s.r === R).length || 1)) * 0.42);
    const fillN = Math.floor(N * EASE.out(clamp(L.age / (e.fillDur || 1.2))));
    let pi = 0, acc = parties[0][0], s = `<g opacity="${L.out}">`;
    seats.forEach((st, i) => {
      while (i >= acc && pi < parties.length - 1) acc += parties[++pi][0];
      const c = i < fillN ? col(parties[pi][1]) : 'rgba(255,255,255,.85)';
      s += `<circle cx="${f1(x + Math.cos(st.a) * st.r)}" cy="${f1(y - Math.sin(st.a) * st.r)}" r="${f1(dotR)}" fill="${c}"/>`;
    });
    if (e.label) s += `</g>${textEl(x, y - R * 0.12, e.label, { size: e.labelSize || 40, weight: 800 }, 1, L.out)}<g>`;
    return s + '</g>';
  };

  E.image = (ctx, e, L) => {
    const [x, y] = P(ctx, e.at || e), w = e.w || 400, h = e.h || 300;
    const border = e.border === false ? '' : `<rect x="${-w / 2 - 10}" y="${-h / 2 - 10}" width="${w + 20}" height="${h + 20}" fill="#fff"/>`;
    const slideX = e.slideFrom ? lerp(e.slideFrom[0], 0, L.ease) : 0, slideY = e.slideFrom ? lerp(e.slideFrom[1], 0, L.ease) : 0;
    const k = e.slideFrom ? 1 : L.pop;
    return `<g ${popT(x + slideX, y + slideY, k, e.rotate || 0)} opacity="${L.out * (e.opacity ?? 1)}" filter="url(#kzSh)">${border}<image href="${esc(e.src)}" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" preserveAspectRatio="${e.fit === 'contain' ? 'xMidYMid meet' : 'xMidYMid slice'}"/></g>`;
  };

  E.caption = (ctx, e, L) => {
    const size = e.size || 38, y = e.y ?? ctx.H * 0.72;
    return textEl(ctx.W / 2, y, e.text, Object.assign({ size, weight: e.weight || 600 }, e), 1, L.ease * L.out);
  };

  E.title = (ctx, e, L) => {
    const [x, y] = e.x != null || e.lon != null ? P(ctx, e) : [ctx.W / 2, ctx.H * 0.45];
    const txt = String(e.text), n = Math.ceil(txt.length * clamp(L.age / (e.typeDur || 0.6)));
    return textEl(x, y, e.typewriter ? txt.slice(0, n) : txt, Object.assign({ size: 88, weight: 400, serif: true, spacing: 2 }, e), e.typewriter ? 1 : lerp(1.15, 1, L.ease), L.ease * L.out);
  };

  E.tag = (ctx, e, L) => {
    const size = e.size || 30, pad = size * 0.6, w = String(e.text).length * size * 0.6 + pad * 2;
    const x = e.x ?? 40, y = e.y ?? 120;
    return `<g opacity="${L.ease * L.out}" transform="translate(${x + (1 - L.ease) * -40},${y})"><rect width="${w}" height="${size * 1.8}" rx="${size * 0.3}" fill="${col(e.bg || 'yellow')}"/><text x="${pad}" y="${size * 1.25}" font-family="${T.font}" font-weight="800" font-size="${size}" fill="${col(e.color || 'ink')}">${esc(e.text)}</text></g>`;
  };

  E.plume = (ctx, e, L) => {
    // hotspot / magma plume for section shots: {x, top, bottom, width}
    const x = e.x || ctx.W / 2, top = e.top ?? ctx.H * 0.45, bot = e.bottom ?? ctx.H, w = e.width || 120;
    const grow = EASE.out(clamp(L.age / (e.growDur || 1.2))), yt = lerp(bot, top, grow);
    const wob = Math.sin(L.age * 3) * 6;
    return `<g opacity="${L.out}"><defs><linearGradient id="kzPl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff7a00"/><stop offset="1" stop-color="#ffe066"/></linearGradient></defs>
      <path d="M${x - w / 2},${bot} C${x - w / 2 + wob},${lerp(bot, yt, .5)} ${x - w * 0.18},${yt + 60} ${x - w * 0.12},${yt} L${x + w * 0.12},${yt} C${x + w * 0.18},${yt + 60} ${x + w / 2 - wob},${lerp(bot, yt, .5)} ${x + w / 2},${bot} Z" fill="url(#kzPl)" filter="url(#kzSoft)"/>
      <path d="M${x},${bot} L${x},${yt}" stroke="#fff6c0" stroke-width="${w * 0.12}" opacity=".7"/></g>`;
  };

  /* ---------------- cutaway backgrounds ---------------- */
  const BG = {
    blueprint: (ctx, b) => {
      const [c0, c1] = b.colors || T.blueprint, g = b.grid || 60;
      let s = `<defs><radialGradient id="kzBp" cx="50%" cy="40%" r="80%"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c0}"/></radialGradient>
        <pattern id="kzGrid" width="${g}" height="${g}" patternUnits="userSpaceOnUse"><path d="M${g},0 L0,0 0,${g}" fill="none" stroke="#fff" stroke-opacity=".09" stroke-width="2"/></pattern></defs>
        <rect width="100%" height="100%" fill="url(#kzBp)"/><rect width="100%" height="100%" fill="url(#kzGrid)"/>`;
      return s;
    },
    color: (ctx, b) => `<rect width="100%" height="100%" fill="${col(b.color || '#111')}"/>`,
    paper: () => `<rect width="100%" height="100%" fill="#f3ead8"/>`,
    section: (ctx, b) => {
      // side cross-section: sky, sea, crust, mantle. b.sea / b.crust / b.mantle are y fractions
      const W = ctx.W, H = ctx.H, sea = H * (b.sea ?? 0.36), crust = H * (b.crust ?? 0.43), mantle = H * (b.mantle ?? 0.47);
      const peaks = (b.islands || []).map((is, i) => {
        const x = is.x * W, w = (is.w || 0.12) * W, h = (is.h || 0.05) * H;
        return `<path d="M${x - w / 2},${crust} Q${x - w * 0.2},${sea - h} ${x},${sea - h} Q${x + w * 0.2},${sea - h} ${x + w / 2},${crust} Z" fill="#4c8a3a"/><path d="M${x - w * 0.18},${sea - h * 0.55} Q${x},${sea - h * 1.05} ${x + w * 0.18},${sea - h * 0.55}" fill="#6a5a40" opacity=".5"/>` +
          (is.name ? `<text x="${x}" y="${sea - h - 18}" text-anchor="middle" font-family="${T.font}" font-weight="700" font-size="${b.labelSize || 26}" fill="#1b2a33">${esc(is.name)}</text>` : '');
      }).join('');
      return `<defs><linearGradient id="kzSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb4dd"/><stop offset="1" stop-color="#d6eef8"/></linearGradient>
        <linearGradient id="kzMan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f08a5d"/><stop offset="1" stop-color="#f7b067"/></linearGradient></defs>
        <rect width="${W}" height="${sea}" fill="url(#kzSky)"/><rect y="${sea}" width="${W}" height="${crust - sea}" fill="#2f86b6" opacity=".9"/>
        <rect y="${crust}" width="${W}" height="${mantle - crust}" fill="#5a5f66"/>${peaks}
        <rect y="${mantle}" width="${W}" height="${H - mantle}" fill="url(#kzMan)"/>
        ${b.plate ? `<text x="${W / 2}" y="${(crust + mantle) / 2 + 10}" text-anchor="middle" font-family="${T.font}" font-weight="800" font-size="28" fill="#fff" opacity=".85" letter-spacing="3">${esc(b.plate)}</text>` : ''}
        ${b.note === false ? '' : `<text x="40" y="${H - 40}" font-family="${T.font}" font-weight="700" font-size="22" fill="#fff" opacity=".7">${esc(b.note || 'NOT TO SCALE')}</text>`}`;
    },
  };

  /* ---------------- render ---------------- */
  function stageOf(shot) { const bg = typeof shot.bg === 'string' ? { type: shot.bg } : shot.bg || { type: 'map' }; return bg.type === 'map' ? shot.map || 'world' : null; }
  function render(spec, t) {
    spec.width = spec.width || 1080; spec.height = spec.height || 1920;
    const els = buildBase(spec);
    const shots = spec.shots;
    let si = shots.findIndex(s => t >= s.start && t < s.end); if (si < 0) si = shots.length - 1;
    const shot = shots[si], tl = t - shot.start;
    const bg = typeof shot.bg === 'string' ? { type: shot.bg } : shot.bg || { type: 'map' };
    const sid = stageOf(shot), isMap = !!sid;
    const stage = getStage(spec, sid || 'world');
    // camera continuity: a shot without cam keeps the previous shot's end camera when it is on the same stage
    let prev = null;
    for (let i = si - 1; i >= 0; i--) { if (stageOf(shots[i]) !== sid) break; if (shots[i].cam) { prev = camEnd(shots[i], stage, spec); break; } }
    const cam = camAt(shot, tl, stage, spec, prev);
    if (stage.kind === 'image' && !(stage.map.allowEdges)) { // never show past the edges of the user's image
      const fitW = Math.min(stage.w, stage.h * spec.width / spec.height);
      cam.w = Math.min(cam.w, fitW);
      const hw = cam.w / 2, hh = cam.w * spec.height / spec.width / 2;
      cam.cx = clamp(cam.cx, hw, stage.w - hw); cam.cy = clamp(cam.cy, hh, stage.h - hh);
    }
    const view = makeView(spec, stage, cam);
    const ctx = { W: spec.width, H: spec.height, view, map: isMap, spec, id: 0 };
    els.base.style.display = isMap ? '' : 'none';
    for (const [id, g] of Object.entries(els.stages)) g.style.display = id === sid ? '' : 'none';
    els.ocean.style.display = sid === 'world' ? '' : 'none';
    els.world.setAttribute('transform', view.transform);

    let mapSvg = '', over = `<defs>${shadow()}${glowF('kzBlur', 6)}${glowF('kzSoft', 10)}</defs>`;
    if (!isMap) over += (BG[bg.type] || BG.color)(ctx, bg);
    const elems = (shot.elements || []).concat((spec.overlays || []).filter(o => t >= (o.from ?? 0) && t < (o.to ?? 1e9)).map(o => Object.assign({}, o, { t0: (o.t0 ?? o.from ?? 0) - shot.start })));
    for (const e of elems) {
      ctx.id++;
      const L = life(e, tl); if (!L) continue;
      const fn = E[e.type]; if (!fn) { console.warn('unknown element', e.type); continue; }
      const r = fn(ctx, e, L);
      if (r && typeof r === 'object') { mapSvg += r.map || ''; over += r.screen || ''; } else over += r || '';
    }
    els.dyn.innerHTML = isMap ? mapSvg : '';
    els.over.innerHTML = over;
    let fade = 0;
    if (shot.fadeIn) fade = Math.max(fade, 1 - clamp(tl / shot.fadeIn));
    if (shot.fadeOut) fade = Math.max(fade, 1 - clamp((shot.end - t) / shot.fadeOut));
    els.fade.style.background = shot.flash && tl < 0.25 ? '#fff' : '#000';
    if (shot.flash && tl < 0.25) fade = 1 - tl / 0.25;
    els.fade.style.opacity = fade;
  }

  window.KZ = { render, elements: Object.keys(E), icons: Object.keys(ICON), backgrounds: ['map', ...Object.keys(BG)], presets: Object.keys(PRESETS), styles: Object.keys(RSTYLE), colors: COLORS, project: PROJ, fitTPS };
})();
