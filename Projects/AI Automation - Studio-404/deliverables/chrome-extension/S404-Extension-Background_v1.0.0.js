// Background worker: keeps the portal login in sync and runs bulk imports (one hidden tab at a time).
importScripts('config.js', 'links.js', 'scrape.js', 'core.js');
let job = null;
// Account list kept in memory for a few minutes, so a single save needs only one quick request.
let cache = null, cacheAt = 0, cacheP = null;
async function getList(fresh) {
  if (!fresh && cache && Date.now() - cacheAt < 60000) return cache;
  if (!cacheP) cacheP = icsApi({ action: 'load' }).then(j => { cache = (j.data || {}).accounts || []; cacheAt = Date.now(); return cache; }).finally(() => { cacheP = null; });
  return cacheP;
}
function badge(text, color, ms) {
  chrome.action.setBadgeText({ text }); if (color) chrome.action.setBadgeBackgroundColor({ color });
  if (ms) setTimeout(() => chrome.action.setBadgeText({ text: '' }), ms);
}
let saveQ = Promise.resolve();
function saveOne(m) {
  saveQ = saveQ.then(async () => {
    badge('...', '#6e8cff');
    try {
      const d = Object.assign({}, m.info);
      const [av, list] = await Promise.all([icsInlineAvatar(d.avatar), getList()]); d.avatar = av;
      await icsSave(d, { niche: m.niche, status: m.status, before: (o, isNew) => icsPushPortals(o, isNew) }, list);
      badge('\u2713', '#16a34a', 3000); chrome.action.setTitle({ title: 'Saved: ' + (d.name || d.handle || 'profile') });
    } catch (e) {
      const t = e.message === 'auth' ? 'Session expired. Please log in again.' : e.message === 'readonly' ? 'Your login is view only, so it cannot save.' : 'Could not save: ' + e.message;
      cache = null; icsRefreshPortals(); badge('!', '#dc2626', 8000); chrome.action.setTitle({ title: t }); chrome.storage.local.set({ lastErr: t });
    }
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pub = () => job ? { running: job.running, done: job.items.filter(i => i.st !== 'wait' && i.st !== 'work').length, total: job.items.length, items: job.items, error: job.error || '' } : null;
function notify() {
  const m = { type: 'bulkprogress', job: pub() };
  chrome.runtime.sendMessage(m).catch(() => {});
  if (job && job.tab) chrome.tabs.sendMessage(job.tab, m).catch(() => {});
}
function loaded(tabId, ms) {
  return new Promise(res => {
    let fin = false; const end = () => { if (fin) return; fin = true; chrome.tabs.onUpdated.removeListener(on); clearTimeout(t); res(); };
    const on = (id, ch) => { if (id === tabId && ch.status === 'complete') end(); };
    chrome.tabs.onUpdated.addListener(on); const t = setTimeout(end, ms);
    chrome.tabs.get(tabId).then(tb => { if (tb.status === 'complete' && tb.url && !/^about:/.test(tb.url)) end(); }).catch(end);
  });
}
async function one(it, opt, list) {
  let tab = null;
  try {
    tab = await chrome.tabs.create({ url: it.url, active: false });
    await loaded(tab.id, 25000); await sleep(it.platform === 'YouTube' ? 2500 : 3500);
    const r = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: icsScrape }), d = r && r[0] && r[0].result;
    if (!d || d.error) throw new Error((d && d.error) || 'Could not read this page');
    if (!d.name && !d.followers) throw new Error('Profile did not load');
    d.avatar = await icsInlineAvatar(d.avatar);
    const s = await icsSave(d, Object.assign({ before: (x, n) => icsPushPortals(x, n) }, opt), list);
    it.st = s.isNew ? 'saved' : 'updated'; it.name = s.name;
  } catch (e) {
    it.st = 'fail'; it.err = e.message === 'readonly' ? 'Your login is view only' : e.message === 'auth' ? 'Not logged in' : String(e.message || e).slice(0, 120);
    if (e.message === 'auth' || e.message === 'readonly') job.stop = true;
  } finally { if (tab) { try { await chrome.tabs.remove(tab.id); } catch (e) {} } }
}
async function run(m, tabId) {
  const items = (m.links || []).slice(0, 200).map(u => icsParseLinks(String(u))[0]).filter(x => x && x.ok).map(x => ({ url: x.url, platform: x.platform, st: 'wait' }));
  job = { items, running: true, tab: tabId || null, stop: false };
  notify();
  try {
    const list = await getList(true);
    for (const it of items) {
      if (job.stop) { it.st = 'skip'; continue; }
      it.st = 'work'; notify();
      await one(it, { niche: m.niche, status: m.status }, list);
      notify();
    }
  } catch (e) { job.error = e.message === 'auth' ? 'Not logged in. Open the portal and log in first.' : 'Could not reach the portal backend.'; items.forEach(i => { if (i.st === 'wait' || i.st === 'work') i.st = 'skip'; }); }
  job.running = false; notify(); icsRefreshPortals();
}
chrome.runtime.onMessage.addListener((m, sender, send) => {
  if (!m || !m.type) return;
  // Only our own pages, or the bridge running inside the portal site, may talk to the worker.
  const fromPortal = !!(sender.tab && sender.url && sender.url.indexOf(ICS_CONFIG.portal) === 0), own = sender.id === chrome.runtime.id;
  if (!own) return;
  if (m.type === 'session' && fromPortal) { (m.token ? chrome.storage.local.set({ token: String(m.token) }) : chrome.storage.local.remove('token')).then(() => send({ ok: true })); return true; }
  if (m.type === 'bulk') { if (job && job.running) { send({ ok: false, error: 'busy' }); return; } run(m, fromPortal ? sender.tab.id : null); send({ ok: true }); return; }
  if (m.type === 'save1') { saveOne(m); send({ ok: true }); return; }
  if (m.type === 'warm') { getList().catch(() => {}); send({ ok: true }); return; }
  if (m.type === 'bulkstate') { send({ job: pub() }); return; }
  if (m.type === 'bulkstop') { if (job) job.stop = true; send({ ok: true }); return; }
});
