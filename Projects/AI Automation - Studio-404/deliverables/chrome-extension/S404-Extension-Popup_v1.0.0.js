const $ = id => document.getElementById(id);
const fmt = n => n >= 1e9 ? (n / 1e9).toFixed(1) + 'B' : n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n || 0);
const LABELS = { TikTok: ['Followers', 'Likes', 'Videos'], YouTube: ['Subscribers', 'Views', 'Videos'], Facebook: ['Followers', 'Likes', 'Posts'], Spotify: ['Followers', 'Plays', 'Episodes'], Instagram: ['Followers', 'Following', 'Posts'] };
const SITES = /^https:\/\/([\w-]+\.)*(tiktok\.com|youtube\.com|facebook\.com|spotify\.com|instagram\.com)\//;
const mem = { get: k => { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
let info = null;

/* ---------- theme ---------- */
$('theme').onclick = () => { const t = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'; document.documentElement.dataset.theme = t; mem.set('ics-theme', t); };

/* ---------- screens ---------- */
function showLogin(m, err) { $('main').hidden = true; $('logout').hidden = true; $('login').hidden = false; $('lmsg').className = err ? 'msg err' : 'msg'; $('lmsg').textContent = m || ''; }
function showTab(t) {
  $('tabs').dataset.on = t; $('tone').classList.toggle('on', t === 'one'); $('tbulk').classList.toggle('on', t === 'bulk');
  $('pone').hidden = t !== 'one'; $('pbulk').hidden = t !== 'bulk'; mem.set('ics-tab', t);
}
$('tone').onclick = () => showTab('one'); $('tbulk').onclick = () => showTab('bulk');
function note(text) { const n = $('note'); n.textContent = ''; n.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16.5v.01"/></svg>'); n.append(text); n.hidden = false; $('card').hidden = true; }

/* ---------- this profile ---------- */
async function targetTab() {
  const t = new URLSearchParams(location.search).get('tab');
  if (t) return chrome.tabs.get(Number(t));
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}
async function read() {
  $('login').hidden = true; $('main').hidden = false; $('logout').hidden = false;
  let tab = null; try { tab = await targetTab(); } catch (e) {}
  const onSite = !!(tab && SITES.test(tab.url || ''));
  showTab(bulkBusy ? 'bulk' : onSite ? 'one' : (mem.get('ics-tab') === 'bulk' || mem.get('ics-btext') ? 'bulk' : 'one'));
  if (!onSite) { note('Open a TikTok, YouTube, Facebook, Instagram or Spotify profile and click the ICS button to save it. Or use Paste links to add many at once.'); return; }
  note('Reading this profile...');
  let d;
  try { const res = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: icsScrape }); d = res && res[0] && res[0].result; }
  catch (e) { note('Could not read this page. Reload the page and try again.'); return; }
  if (!d || d.error) { note((d && d.error) || 'Could not read this page.'); return; }
  info = d;
  $('av').src = d.avatar || 'icon128.png'; $('nm').textContent = d.name || '(no name)'; $('sb').textContent = (d.handle ? d.handle + ' · ' : '') + d.platform;
  const L = LABELS[d.platform], mid = d.platform === 'Instagram' ? d.following : d.likes; $('grid').textContent = '';
  [[L[0], d.followers], [L[1], mid], [L[2], d.uploads]].forEach(([k, v]) => { const c = document.createElement('div'), b = document.createElement('b'), s = document.createElement('span'); b.textContent = v ? fmt(v) : '—'; s.textContent = k; c.append(b, s); $('grid').append(c); });
  $('more').textContent = [d.country, d.created ? 'Joined ' + d.created : '', d.links && d.links.length ? d.links.length + ' links' : '', d.videos && d.videos.length ? d.videos.length + ' top videos' : '', d.platform === 'Facebook' && d.following != null ? fmt(d.following) + ' following' : ''].filter(Boolean).join(' · ');
  $('note').hidden = true; $('card').hidden = false; $('msg').textContent = ''; $('msg').className = 'msg';
  try { const e = (await chrome.storage.local.get('lastErr')).lastErr; if (e) { $('msg').className = 'msg err'; $('msg').textContent = e; chrome.storage.local.remove('lastErr'); } } catch (e) {}
}
// Saving runs in the background worker, so the popup can close at once. The extension icon shows the result.
async function save() {
  const b = $('save'), m = $('msg'), i = info; if (!i) return;
  b.disabled = true;
  let r = null; try { r = await chrome.runtime.sendMessage({ type: 'save1', info: i, niche: $('niche').value, status: $('status').value }); } catch (e) {}
  if (!r || !r.ok) { m.className = 'msg err'; m.textContent = 'Could not save. Close this window and try again.'; b.disabled = false; return; }
  b.querySelector('span').textContent = 'Saved'; m.className = 'msg ok'; m.textContent = 'Saved to your portal';
  setTimeout(() => window.close(), 450);
}

/* ---------- paste links (runs in the background worker, so the popup can be closed) ---------- */
const LAB = { ready: 'Ready', wait: 'Waiting', work: 'Reading...', saved: 'Saved', updated: 'Updated', skip: 'Skipped' };
let items = [], bulkBusy = false;
function drawBulk() {
  $('bsum').textContent = ''; $('blist').textContent = '';
  const by = {}; items.forEach(x => { const k = x.platform || 'Other'; by[k] = (by[k] || 0) + 1; });
  Object.keys(by).forEach(k => { const s = document.createElement('span'); s.textContent = k + ' ' + by[k]; $('bsum').append(s); });
  items.forEach(x => {
    const li = document.createElement('li'), p = document.createElement('span'), u = document.createElement('span'), t = document.createElement('span');
    li.className = x.st + ' ' + (x.platform || ''); p.className = 'p'; u.className = 'u'; t.className = 't';
    u.textContent = x.name || x.url.replace(/^https?:\/\/(www\.)?/, ''); u.title = x.url;
    t.textContent = x.st === 'bad' ? (/supported/.test(x.why) ? 'Not supported' : 'Not a profile link') : x.st === 'fail' ? (x.err || 'Could not read') : (LAB[x.st] || x.st); t.title = t.textContent;
    li.append(p, u, t); $('blist').append(li);
  });
  const ready = items.filter(x => x.st === 'ready').length, run = items.filter(x => !['ready', 'bad'].includes(x.st)), done = run.filter(x => ['saved', 'updated', 'fail', 'skip'].includes(x.st)).length;
  $('brun').disabled = bulkBusy || !ready; $('brun').querySelector('span').textContent = ready ? 'Save ' + ready + ' account' + (ready === 1 ? '' : 's') : 'Save accounts';
  $('bcheck').disabled = bulkBusy; $('btext').readOnly = bulkBusy; $('bstop').hidden = !bulkBusy; $('brun').hidden = bulkBusy;
  $('bbar').hidden = !run.length; $('bfill').style.width = (run.length ? done / run.length * 100 : 0) + '%';
  if (run.length && bulkBusy) { $('bmsg').className = 'msg'; $('bmsg').textContent = done + ' of ' + run.length + ' done'; }
}
function applyJob(job) {
  if (!job) return;
  const by = {}; job.items.forEach(i => by[i.url] = i);
  if (!items.length) items = job.items.map(i => Object.assign({ ok: true }, i));
  items.forEach(x => { const j = by[x.url]; if (j) { x.st = j.st; x.err = j.err || ''; if (j.name) x.name = j.name; } });
  const was = bulkBusy; bulkBusy = job.running;
  if (!bulkBusy && (was || job.items.length)) {
    const n = items.filter(x => x.st === 'saved' || x.st === 'updated').length, f = items.filter(x => x.st === 'fail').length;
    $('bmsg').className = job.error || (f && !n) ? 'msg err' : 'msg ok'; $('bmsg').textContent = job.error || (n + ' saved to your portal' + (f ? ', ' + f + ' could not be read' : ''));
    if (was) { $('btext').value = ''; mem.set('ics-btext', ''); }
  }
  drawBulk();
}
function checkLinks() {
  items = icsParseLinks($('btext').value).map(x => Object.assign(x, { st: x.ok ? 'ready' : 'bad' }));
  $('bmsg').className = items.length ? 'msg' : 'msg err'; $('bmsg').textContent = items.length ? '' : 'No links found in that text.'; drawBulk();
}
$('btext').oninput = () => mem.set('ics-btext', $('btext').value);
$('btext').onpaste = () => setTimeout(() => { mem.set('ics-btext', $('btext').value); checkLinks(); }, 0);
$('bcheck').onclick = checkLinks;
$('brun').onclick = async () => {
  const links = items.filter(x => x.st === 'ready').map(x => x.url); if (!links.length) return;
  const r = await chrome.runtime.sendMessage({ type: 'bulk', links, niche: $('bniche').value, status: $('bstatus').value });
  if (!r || !r.ok) { $('bmsg').className = 'msg err'; $('bmsg').textContent = r && r.error === 'busy' ? 'Another import is still running. Please wait.' : 'Could not start. Close this window and try again.'; return; }
  bulkBusy = true; items.forEach(x => { if (x.st === 'ready') x.st = 'wait'; }); drawBulk();
};
$('bstop').onclick = () => chrome.runtime.sendMessage({ type: 'bulkstop' });
chrome.runtime.onMessage.addListener(m => { if (m && m.type === 'bulkprogress') applyJob(m.job); });

/* ---------- header + login ---------- */
const openPortal = () => chrome.tabs.create({ url: ICS_CONFIG.portal });
$('open').onclick = openPortal; $('open2').onclick = openPortal;
$('logout').onclick = async () => { try { await icsApi({ action: 'logout' }); } catch (e) {} await chrome.storage.local.remove('token'); showLogin('Logged out.'); };
$('save').onclick = save;
$('login').onsubmit = async e => {
  e.preventDefault(); const b = $('lbtn'), t = b.querySelector('span'); b.disabled = true; t.textContent = 'Checking...'; $('lmsg').textContent = '';
  const done = (m) => { b.disabled = false; t.textContent = 'Log in'; if (m) { $('lmsg').className = 'msg err'; $('lmsg').textContent = m; } };
  try {
    const r = await fetch(ICS_CONFIG.backend, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'login', user: $('user').value.trim(), pass: $('pass').value }) }), j = await r.json();
    if (!j.ok) { done(j.error === 'locked' ? 'Too many failed attempts. Try again in 15 minutes.' : 'Wrong username or password'); return; }
    await chrome.storage.local.set({ token: j.token }); $('pass').value = ''; done(); start();
  } catch (x) { done('Could not reach the server. Check your internet.'); }
};
async function start() {
  chrome.runtime.sendMessage({ type: 'warm' }).catch(() => {});
  $('btext').value = mem.get('ics-btext');
  try { const r = await chrome.runtime.sendMessage({ type: 'bulkstate' }); if (r && r.job && (r.job.running || !$('btext').value)) { bulkBusy = r.job.running; applyJob(r.job); } } catch (e) {}
  if ($('btext').value && !items.length) checkLinks();
  read();
}
(async () => { const s = await chrome.storage.local.get('token'); if (s.token) start(); else showLogin(); })();
