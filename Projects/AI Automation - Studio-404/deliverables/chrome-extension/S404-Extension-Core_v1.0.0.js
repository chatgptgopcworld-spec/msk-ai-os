// Shared by the popup, the bulk page and the background worker: talking to the portal backend and saving a profile.
const ICS_STAT = ['New', 'Shortlisted', 'Selected', 'Active', 'Rejected'];
const icsToday = () => new Date().toISOString().slice(0, 10);
const icsUid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

async function icsApi(body) {
  const token = (await chrome.storage.local.get('token')).token || '';
  if (!token && body.action !== 'login') throw new Error('auth');
  const r = await fetch(ICS_CONFIG.backend, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(Object.assign({ token }, body)) });
  const j = await r.json();
  if (!j.ok) { if (j.error === 'auth') await chrome.storage.local.remove('token'); throw new Error(j.error || 'error'); }
  return j;
}

// Shrinks the profile picture to a small image stored with the account, so it never expires.
async function icsInlineAvatar(src) {
  if (!src || /^data:/.test(src)) return src;
  try {
    const r = await fetch(src, { credentials: 'omit', referrerPolicy: 'no-referrer' }); if (!r.ok) throw 0;
    const bm = await createImageBitmap(await r.blob()), c = new OffscreenCanvas(96, 96), k = Math.min(bm.width, bm.height);
    c.getContext('2d').drawImage(bm, (bm.width - k) / 2, (bm.height - k) / 2, k, k, 0, 0, 96, 96);
    const buf = new Uint8Array(await (await c.convertToBlob({ type: 'image/jpeg', quality: .82 })).arrayBuffer());
    let s = ''; for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode.apply(null, buf.subarray(i, i + 8192));
    return 'data:image/jpeg;base64,' + btoa(s);
  } catch (e) { return src; }
}

function icsMerge(o, i, isNew, niche) {
  if (i.name) o.name = i.name; if (!isNew && niche) o.niche = niche;
  o.extra = o.extra || {}; o.snaps = o.snaps || []; o.videos = o.videos || [];
  if (i.followers) o.followers = i.followers; if (i.likes) o.likes = i.likes; if (i.uploads) o.uploads = i.uploads; if (i.created) o.created = i.created;
  if (i.avatar) o.extra.avatar = i.avatar; if (i.following != null) o.extra.following = i.following; if (i.country) o.extra.country = String(i.country).slice(0, 60);
  if (Array.isArray(i.links)) o.extra.links = i.links.slice(0, 8).map(l => ({ t: String(l.t || '').slice(0, 40), u: String(l.u || '').slice(0, 300) }));
  if (Array.isArray(i.videos)) i.videos.forEach(v => { const e = o.videos.find(x => x.url && x.url === v.url); if (e) { e.v = v.v; e.t = v.t; } else o.videos.push({ t: v.t, v: v.v, url: v.url }); });
  o.videos.sort((a, b) => (b.v || 0) - (a.v || 0)); o.videos = o.videos.slice(0, 40);
  const l = o.snaps[o.snaps.length - 1]; if (l && l.d === icsToday()) l.f = o.followers; else o.snaps.push({ d: icsToday(), f: o.followers });
  return o;
}

// Saves one scraped profile. `list` is the already-loaded account list (optional, reused during bulk import).
async function icsSave(i, opt, list) {
  opt = opt || {};
  if (!list) list = ((await icsApi({ action: 'load' })).data || {}).accounts || [];
  const nl = x => String(x || '').replace(/\/$/, '').toLowerCase(), nh = x => String(x || '').replace(/^@/, '').toLowerCase();
  let o = list.find(a => a.p === i.platform && ((a.link && i.link && nl(a.link) === nl(i.link)) || (a.handle && i.handle && nh(a.handle) === nh(i.handle)))); const isNew = !o;
  const niche = String(opt.niche || '').trim();
  if (isNew) { const st = ICS_STAT.includes(opt.status) ? opt.status : 'New'; o = { id: icsUid(), p: i.platform, kind: 'research', name: i.name || i.handle || 'Untitled', handle: i.handle || '', link: i.link || '', niche, tags: [], followers: 0, likes: 0, uploads: 0, created: '', status: st, notes: '', extra: { at: Date.now() }, videos: [], comps: [], hist: [{ d: icsToday(), s: st }], snaps: [], hue: Math.floor(Math.random() * 360) }; }
  icsMerge(o, i, isNew, niche);
  if (opt.before) { try { opt.before(o, isNew); } catch (e) {} }
  await icsApi({ action: 'sync', accounts: [o], deleteAccounts: [], ideas: [], deleteIdeas: [], logs: [{ t: Date.now(), x: isNew ? `${o.name} added (${o.p})` : `${o.name} stats updated` }] });
  if (isNew) list.push(o);
  return { isNew, name: o.name };
}

// Sends one saved account straight into every open portal tab, so it shows before the Sheet is even written.
async function icsPushPortals(account, isNew) {
  try { const tabs = await chrome.tabs.query({ url: ICS_CONFIG.portal + '*' }); for (const t of tabs) chrome.tabs.sendMessage(t.id, { type: 'upsert', account, isNew }).catch(() => {}); } catch (e) {}
}
// Tells every open portal tab to reload its data (handled by bridge.js inside the portal page).
async function icsRefreshPortals() {
  try { const tabs = await chrome.tabs.query({ url: ICS_CONFIG.portal + '*' }); for (const t of tabs) chrome.tabs.sendMessage(t.id, { type: 'reload' }).catch(() => {}); } catch (e) {}
}
