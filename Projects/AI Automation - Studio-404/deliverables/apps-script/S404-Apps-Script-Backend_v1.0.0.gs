/**
 * ICS Research Portal — Google Sheets + Google Docs backend (with login)
 *
 * Setup (one time):
 *  1. script.google.com > New project > paste this file > Save.
 *  2. Select function `setup` and press Run. Allow the permissions.
 *     Open "Execution log": it shows your Sheet link, USERNAME and first PASSWORD.
 *  3. Deploy > New deployment > type "Web app"
 *       Execute as: Me        Who has access: Anyone
 *     Copy the Web app URL (ends with /exec) and give it to the portal.
 *
 * Security: nothing is read or written without a valid login session.
 * Passwords are stored only as salted SHA-256 hashes. 5 wrong tries lock login for 15 minutes.
 * Forgot password? Run `resetPassword` from this editor and read the log.
 *
 * Automation: run `installTriggers` once from this editor. After that YouTube stats refresh every day
 * and a copy of the Sheet is saved to Drive every Sunday (the last 8 copies are kept).
 */

const SHEETS = {
  Accounts: ['id','kind','platform','name','handle','link','niche','tags','followers','likes','uploads','created','status','notes','hue','extra','videos','comps','hist','snaps','docUrl','updatedAt'],
  Ideas: ['id','title','platform','stage','note','updatedAt'],
  Activity: ['time','text'],
  Snapshots: ['date','accountId','account','platform','followers','likes','uploads'],
};
const JSON_COLS = ['extra','videos','comps','hist','snaps'];

function props_() { return PropertiesService.getScriptProperties(); }

function setup() {
  const p = props_();
  let ssId = p.getProperty('SHEET_ID');
  let ss = ssId ? SpreadsheetApp.openById(ssId) : SpreadsheetApp.create('ICS Research Portal');
  p.setProperty('SHEET_ID', ss.getId());
  Object.keys(SHEETS).forEach(name => {
    let sh = ss.getSheetByName(name) || ss.insertSheet(name);
    sh.getRange(1, 1, 1, SHEETS[name].length).setValues([SHEETS[name]])
      .setFontWeight('bold').setBackground('#0c1226').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  });
  const def = ss.getSheetByName('Sheet1'); if (def && ss.getSheets().length > 1) ss.deleteSheet(def);
  if (!p.getProperty('DOCS_FOLDER_ID')) {
    p.setProperty('DOCS_FOLDER_ID', DriveApp.createFolder('ICS Research Portal Docs').getId());
  }
  Logger.log('Sheet: ' + ss.getUrl());
  if (!p.getProperty('PASS_HASH')) {
    p.setProperty('PORTAL_USER', 'admin');
    const pw = newPassword_();
    Logger.log('USERNAME: admin');
    Logger.log('PASSWORD: ' + pw + '   (change it in Settings after login)');
  } else Logger.log('Login is already set up. If you forgot the password, run resetPassword.');
}

/** Run from the editor if you forget the password. Logs out every device. */
function resetPassword() {
  const pw = newPassword_(); clearSessions_();
  Logger.log('USERNAME: ' + props_().getProperty('PORTAL_USER'));
  Logger.log('NEW PASSWORD: ' + pw);
}
function newPassword_() {
  const pw = Utilities.getUuid().replace(/-/g, '').slice(0, 12);
  setPassword_(pw); return pw;
}
function hash_(salt, pw) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + '|' + pw, Utilities.Charset.UTF_8)
    .map(b => ('0' + ((b + 256) % 256).toString(16)).slice(-2)).join('');
}
function setPassword_(pw) {
  const salt = Utilities.getUuid();
  props_().setProperties({ PASS_SALT: salt, PASS_HASH: hash_(salt, pw) });
}
function checkPassword_(pw) {
  const p = props_(), h = p.getProperty('PASS_HASH');
  return !!h && hash_(p.getProperty('PASS_SALT'), String(pw || '')) === h;
}

/* ---------- sessions ---------- */
const SESSION_DAYS = 30;
function sessions_() { try { return JSON.parse(props_().getProperty('SESSIONS') || '{}'); } catch (e) { return {}; } }
function saveSessions_(s) { props_().setProperty('SESSIONS', JSON.stringify(s)); }
function clearSessions_() { props_().deleteProperty('SESSIONS'); }
function tokenHash_(t) { return hash_('session', String(t || '')); }
function login_(b) {
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('fails') || 0);
  if (fails >= 5) return { ok: false, error: 'locked' };
  const name = String(b.user || '').trim().toLowerCase(), isAdmin = name === admin_().toLowerCase(), tu = users_()[name];
  const good = isAdmin ? checkPassword_(b.pass) : !!tu && hash_(tu.salt, String(b.pass || '')) === tu.hash;
  if (!good) { cache.put('fails', String(fails + 1), 900); Utilities.sleep(800); return { ok: false, error: 'badlogin' }; }
  cache.remove('fails');
  const token = Utilities.getUuid() + Utilities.getUuid(), now = Date.now(), s = sessions_();
  Object.keys(s).forEach(k => { if (sessExp_(s[k]) < now) delete s[k]; });
  const keys = Object.keys(s).sort((a, c) => sessExp_(s[a]) - sessExp_(s[c])); while (keys.length >= 40) delete s[keys.shift()];
  const user = isAdmin ? admin_() : name;
  s[tokenHash_(token)] = { e: now + SESSION_DAYS * 864e5, u: user }; saveSessions_(s);
  return { ok: true, token: token, user: user, role: role_(user) };
}

function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function ss_() { return SpreadsheetApp.openById(props_().getProperty('SHEET_ID')); }
function admin_() { return String(props_().getProperty('PORTAL_USER') || 'admin'); }
/** Returns the logged-in username for a token, or '' when the session is missing or expired. */
function who_(token) {
  if (!token) return '';
  const e = sessions_()[tokenHash_(token)]; if (!e) return '';
  if (typeof e === 'number') return e > Date.now() ? admin_() : '';
  if (!(e.e > Date.now())) return '';
  return e.u === admin_() || users_()[e.u] ? e.u : '';
}
function auth_(token) { return !!who_(token); }
function sessExp_(v) { return typeof v === 'number' ? v : (v && v.e) || 0; }

/* ---------- team logins ---------- */
const ROLES = ['editor', 'viewer'];
function users_() { try { return JSON.parse(props_().getProperty('USERS') || '{}'); } catch (e) { return {}; } }
function role_(u) { if (u === admin_()) return 'admin'; const x = users_()[u]; return x ? x.role : ''; }
function teamList_() { const u = users_(); return Object.keys(u).sort().map(k => ({ user: k, role: u[k].role })); }
function team_(b) {
  const u = users_(), name = String(b.user || '').trim().toLowerCase();
  if (b.op === 'add') {
    if (!/^[a-z0-9._-]{3,24}$/.test(name)) return { ok: false, error: 'badname' };
    if (name === admin_().toLowerCase()) return { ok: false, error: 'exists' };
    if (String(b.pass || '').length < 8) return { ok: false, error: 'short' };
    if (!u[name] && Object.keys(u).length >= 20) return { ok: false, error: 'full' };
    const salt = Utilities.getUuid();
    u[name] = { salt: salt, hash: hash_(salt, String(b.pass)), role: ROLES.indexOf(b.role) >= 0 ? b.role : 'editor' };
  } else if (b.op === 'remove') {
    delete u[name];
    const s = sessions_(); Object.keys(s).forEach(k => { if (s[k] && s[k].u === name) delete s[k]; }); saveSessions_(s);
  } else return { ok: false, error: 'unknown action' };
  props_().setProperty('USERS', JSON.stringify(u));
  return { team: teamList_() };
}
function auto_() { const p = props_(); return { on: p.getProperty('AUTO_ON') === '1', yt: p.getProperty('LAST_YT') || '', backup: p.getProperty('LAST_BACKUP') || '' }; }

function doGet(e) {
  try {
    return out_({ ok: true, service: 'ICS Research Portal' });
  } catch (err) { return out_({ ok: false, error: String(err) }); }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    lock.waitLock(20000);
    if (body.action === 'login') return out_(login_(body));
    const me = who_(body.token);
    if (!me) return out_({ ok: false, error: 'auth' });
    const role = role_(me);
    let res = {};
    if (body.action === 'load') { res = { data: readAll_(), user: me, role: role, auto: auto_() }; if (role === 'admin') { res.sheetUrl = ss_().getUrl(); res.team = teamList_(); } }
    else if (body.action === 'logout') { const s = sessions_(); delete s[tokenHash_(body.token)]; saveSessions_(s); }
    else if (body.action === 'password') {
      if (String(body.newPass || '').length < 8) return out_({ ok: false, error: 'short' });
      const th = tokenHash_(body.token), s = sessions_();
      if (role === 'admin') {
        if (!checkPassword_(body.oldPass)) return out_({ ok: false, error: 'badpass' });
        setPassword_(String(body.newPass));
      } else {
        const u = users_(), x = u[me];
        if (hash_(x.salt, String(body.oldPass || '')) !== x.hash) return out_({ ok: false, error: 'badpass' });
        x.salt = Utilities.getUuid(); x.hash = hash_(x.salt, String(body.newPass)); props_().setProperty('USERS', JSON.stringify(u));
      }
      // log this user out everywhere else
      Object.keys(s).forEach(k => { const o = typeof s[k] === 'number' ? admin_() : s[k].u; if (o === me && k !== th) delete s[k]; }); saveSessions_(s);
    }
    else if (body.action === 'team') { if (role !== 'admin') return out_({ ok: false, error: 'forbidden' }); res = team_(body); if (res.ok === false) return out_(res); }
    else if (body.action === 'sync') { if (role === 'viewer') return out_({ ok: false, error: 'readonly' }); res = sync_(body, me, role); }
    else if (body.action === 'doc') { if (role === 'viewer') return out_({ ok: false, error: 'readonly' }); res = makeDoc_(body.account); }
    else if (body.action === 'fetch') res = fetchInfo_(body.url);
    else if (body.action === 'ping') res = {};
    else return out_({ ok: false, error: 'unknown action' });
    return out_(Object.assign({ ok: true }, res));
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally { try { lock.releaseLock(); } catch (e) {} }
}

/* ---------- read ---------- */
function rows_(name) {
  const sh = ss_().getSheetByName(name), n = sh.getLastRow();
  if (n < 2) return [];
  const cols = SHEETS[name];
  return sh.getRange(2, 1, n - 1, cols.length).getValues().map(r => {
    const o = {}; cols.forEach((c, i) => o[c] = r[i]); return o;
  });
}
function readAll_() {
  const accounts = rows_('Accounts').filter(r => r.id).map(r => {
    const a = {
      id: String(r.id), kind: r.kind || 'research', p: r.platform, name: String(r.name), handle: String(r.handle || ''),
      link: String(r.link || ''), niche: String(r.niche || ''), tags: String(r.tags || '').split(',').map(s => s.trim()).filter(String),
      followers: Number(r.followers) || 0, likes: Number(r.likes) || 0, uploads: Number(r.uploads) || 0,
      created: r.created instanceof Date ? Utilities.formatDate(r.created, 'UTC', 'yyyy-MM-dd') : String(r.created || ''),
      status: String(r.status || ''), notes: String(r.notes || ''), hue: Number(r.hue) || 220, docUrl: String(r.docUrl || ''),
    };
    JSON_COLS.forEach(c => { try { a[c] = r[c] ? JSON.parse(r[c]) : (c === 'extra' ? {} : []); } catch (e) { a[c] = c === 'extra' ? {} : []; } });
    return a;
  });
  const ideas = rows_('Ideas').filter(r => r.id).map(r => ({ id: String(r.id), t: String(r.title), p: r.platform, st: r.stage, n: String(r.note || '') }));
  const log = rows_('Activity').map(r => ({ t: new Date(r.time).getTime(), x: String(r.text) })).reverse().slice(0, 200);
  return { accounts, ideas, log };
}

/* ---------- write ---------- */
function upsert_(name, objs, toRow) {
  if (!objs || !objs.length) return;
  const sh = ss_().getSheetByName(name), cols = SHEETS[name];
  const n = sh.getLastRow();
  const ids = n > 1 ? sh.getRange(2, 1, n - 1, 1).getValues().map(r => String(r[0])) : [];
  objs.forEach(o => {
    const row = toRow(o), i = ids.indexOf(String(o.id));
    if (i >= 0) sh.getRange(i + 2, 1, 1, cols.length).setValues([row]);
    else { sh.appendRow(row); ids.push(String(o.id)); }
  });
}
function remove_(name, idList) {
  if (!idList || !idList.length) return;
  const sh = ss_().getSheetByName(name), n = sh.getLastRow();
  if (n < 2) return;
  const ids = sh.getRange(2, 1, n - 1, 1).getValues().map(r => String(r[0]));
  for (let i = ids.length - 1; i >= 0; i--) if (idList.indexOf(ids[i]) >= 0) sh.deleteRow(i + 2);
}
function accRow_(a) {
  const now = new Date();
  return [a.id, a.kind, a.p, a.name, a.handle, a.link, a.niche, (a.tags || []).join(', '), a.followers, a.likes, a.uploads, a.created, a.status, a.notes, a.hue,
    JSON.stringify(a.extra || {}), JSON.stringify(a.videos || []), JSON.stringify(a.comps || []), JSON.stringify(a.hist || []), JSON.stringify(a.snaps || []), a.docUrl || '', now];
}
function sync_(b, me, role) {
  const ss = ss_();
  if (role && role !== 'admin') b.wipeActivity = false;
  // snapshot rows for accounts whose follower count changed
  if (b.accounts && b.accounts.length) {
    const prev = {}, by = {};
    rows_('Accounts').forEach(r => { prev[String(r.id)] = Number(r.followers); try { by[String(r.id)] = JSON.parse(r.extra || '{}').by || ''; } catch (e) { by[String(r.id)] = ''; } });
    // "added by" is set by the server the first time an account is saved and never changes after that
    b.accounts.forEach(a => { a.extra = a.extra || {}; if (a.id in prev) { if (by[a.id]) a.extra.by = by[a.id]; else delete a.extra.by; } else a.extra.by = me || admin_(); });
    const snap = ss.getSheetByName('Snapshots'), today = Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd');
    b.accounts.forEach(a => { if (prev[a.id] !== a.followers) snap.appendRow([today, a.id, a.name, a.p, a.followers, a.likes, a.uploads]); });
  }
  upsert_('Accounts', b.accounts, accRow_);
  remove_('Accounts', b.deleteAccounts);
  upsert_('Ideas', b.ideas, i => [i.id, i.t, i.p, i.st, i.n, new Date()]);
  remove_('Ideas', b.deleteIdeas);
  if (b.wipeActivity) { const sh = ss.getSheetByName('Activity'); if (sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1); }
  (b.logs || []).forEach(l => ss.getSheetByName('Activity').appendRow([new Date(l.t), String(l.x).slice(0, 300) + (role && role !== 'admin' ? ' · by ' + me : '')]));
  return { savedAt: Date.now() };
}

/* ---------- Google Doc per account ---------- */
function fmt_(n) { n = Number(n) || 0; if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'; if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'; return String(n); }
function makeDoc_(a) {
  let doc;
  const title = 'ICS Research · ' + a.name + ' (' + a.p + ')';
  if (a.docUrl) { try { doc = DocumentApp.openByUrl(a.docUrl); } catch (e) { doc = null; } }
  if (!doc) {
    doc = DocumentApp.create(title);
    const file = DriveApp.getFileById(doc.getId());
    DriveApp.getFolderById(props_().getProperty('DOCS_FOLDER_ID')).addFile(file);
    DriveApp.getRootFolder().removeFile(file);
  }
  doc.setName(title);
  const body = doc.getBody(); body.clear();
  body.appendParagraph(a.name).setHeading(DocumentApp.ParagraphHeading.TITLE);
  body.appendParagraph(a.p + ' · ' + (a.handle || '') + (a.kind === 'mine' ? ' · My account' : ' · Status: ' + a.status)).setHeading(DocumentApp.ParagraphHeading.SUBTITLE);
  if (a.link) body.appendParagraph(a.link).setLinkUrl(a.link);
  body.appendParagraph('Key numbers').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  const ex = a.extra || {};
  const facts = [['Niche', a.niche || '—'], ['Tags', (a.tags || []).join(', ') || '—'], ['Followers', fmt_(a.followers)], ['Likes / views', fmt_(a.likes)], ['Uploads', fmt_(a.uploads)], ['Created', a.created || '—']]
    .concat(Object.keys(ex).map(k => [k, typeof ex[k] === 'number' ? fmt_(ex[k]) : String(ex[k])]));
  const t = body.appendTable(facts); t.getRow(0);
  body.appendParagraph('Research notes').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(a.notes || 'No notes yet.');
  if (a.videos && a.videos.length) {
    body.appendParagraph('Saved videos / posts').setHeading(DocumentApp.ParagraphHeading.HEADING2);
    a.videos.forEach(v => { const li = body.appendListItem(v.t + ' — ' + fmt_(v.v) + ' views'); if (v.url) li.setLinkUrl(v.url); });
  }
  if (a.snaps && a.snaps.length) {
    body.appendParagraph('Followers history').setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendTable([['Date', 'Followers']].concat(a.snaps.map(s => [s.d, fmt_(s.f)])));
  }
  body.appendParagraph('Updated ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'd MMM yyyy, HH:mm')).setItalic(true);
  doc.saveAndClose();
  const url = doc.getUrl();
  upsertDocUrl_(a.id, url);
  return { docUrl: url };
}
function upsertDocUrl_(id, url) {
  const sh = ss_().getSheetByName('Accounts'), n = sh.getLastRow(); if (n < 2) return;
  const ids = sh.getRange(2, 1, n - 1, 1).getValues().map(r => String(r[0])), i = ids.indexOf(String(id));
  if (i >= 0) sh.getRange(i + 2, SHEETS.Accounts.indexOf('docUrl') + 1).setValue(url);
}

/* ---------- auto-fetch profile info from a link ---------- */
function fetchInfo_(url) {
  url = String(url || '').trim();
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  const host = url.replace(/^https?:\/\//i, '').split('/')[0].toLowerCase();
  let r = { platform: '', link: url };
  if (/tiktok\.com$/.test(host)) r = Object.assign(r, tiktok_(url));
  else if (/(youtube\.com|youtu\.be)$/.test(host)) r = Object.assign(r, youtube_(url));
  else if (/spotify\.com$/.test(host)) r = Object.assign(r, spotify_(url));
  else if (/(facebook\.com|fb\.com)$/.test(host)) r = Object.assign(r, { platform: 'Facebook' }, og_(get_(url)));
  else r = Object.assign(r, og_(get_(url)));
  if (r.avatar) r.avatar = inlineImg_(r.avatar);
  if (r.avatar2 && !/^data:/.test(r.avatar || '')) r.avatar = inlineImg_(r.avatar2);
  delete r.avatar2;
  return { info: r };
}
function get_(url) {
  const res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true, headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9', 'Cookie': 'CONSENT=YES+1; SOCS=CAI' } });
  return res.getResponseCode() < 400 ? res.getContentText() : '';
}
function meta_(html, prop) {
  const m = html.match(new RegExp('<meta[^>]+(?:property|name|itemprop)=["\']' + prop + '["\'][^>]*content=["\']([^"\']*)', 'i'))
    || html.match(new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name|itemprop)=["\']' + prop + '["\']', 'i'));
  return m ? decode_(m[1]) : '';
}
function decode_(s) { return String(s).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>'); }
function og_(html) {
  if (!html) return {};
  return { name: meta_(html, 'og:title'), avatar: meta_(html, 'og:image'), bio: meta_(html, 'og:description') };
}
function num_(s) {
  if (s == null) return 0; s = String(s).replace(/,/g, '').trim();
  const m = s.match(/([\d.]+)\s*([KMB])?/i); if (!m) return 0;
  return Math.round(parseFloat(m[1]) * ({ k: 1e3, m: 1e6, b: 1e9 }[(m[2] || '').toLowerCase()] || 1));
}
function tiktok_(url) {
  const h = (url.match(/@([\w.\-]+)/) || [])[1];
  const html = get_(h ? 'https://www.tiktok.com/@' + h : url);
  const out = { platform: 'TikTok', handle: h ? '@' + h : '' };
  const m = html.match(/<script[^>]+id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);
  if (m) {
    try {
      const d = JSON.parse(m[1]).__DEFAULT_SCOPE__['webapp.user-detail'].userInfo;
      const u = d.user || {}, s = d.statsV2 || d.stats || {};
      out.name = u.nickname || u.uniqueId; out.handle = '@' + (u.uniqueId || h);
      out.avatar = u.avatarMedium || u.avatarLarger || u.avatarThumb; out.avatar2 = u.avatarThumb;
      out.followers = Number(s.followerCount) || 0; out.likes = Number(s.heartCount || s.heart) || 0;
      out.uploads = Number(s.videoCount) || 0; out.following = Number(s.followingCount) || 0; out.bio = u.signature || '';
      let t = Number(u.createTime) || 0;
      if (!t && u.id) { try { t = Number(BigInt(u.id) / BigInt(4294967296)); } catch (e) {} }
      if (t > 1.2e9 && t < Date.now() / 1000) out.created = Utilities.formatDate(new Date(t * 1000), 'UTC', 'yyyy-MM-dd');
    } catch (e) {}
  }
  if (!out.avatar) Object.assign(out, og_(html), { handle: out.handle });
  return out;
}
function youtube_(url) {
  const html = get_(url.replace(/\/(videos|shorts|featured|streams)\/?$/, ''));
  const out = Object.assign({ platform: 'YouTube' }, og_(html));
  const sub = html.match(/"([\d.,]+[KMB]?) subscribers"/) || html.match(/([\d.,]+[KMB]?) subscribers/);
  const vid = html.match(/"([\d.,]+[KMB]?) videos"/) || html.match(/([\d.,]+[KMB]?) videos/);
  const hd = html.match(/"canonicalBaseUrl":"\/(@[^"]+)"/) || html.match(/youtube\.com\/(@[\w.\-]+)/);
  const views = html.match(/"([\d,]+) views"/);
  const joined = html.match(/"Joined ([A-Za-z]{3} \d{1,2}, \d{4})"/);
  if (sub) out.followers = num_(sub[1]);
  if (vid) out.uploads = num_(vid[1]);
  if (views) out.likes = num_(views[1]);
  if (hd) out.handle = decodeURIComponent(hd[1]);
  if (joined) { const d = new Date(joined[1]); if (!isNaN(d)) out.created = Utilities.formatDate(d, 'UTC', 'yyyy-MM-dd'); }
  return out;
}
function spotify_(url) {
  const out = { platform: 'Spotify' };
  try {
    const o = JSON.parse(UrlFetchApp.fetch('https://open.spotify.com/oembed?url=' + encodeURIComponent(url), { muteHttpExceptions: true }).getContentText());
    out.name = o.title; out.avatar = o.thumbnail_url;
  } catch (e) {}
  const html = get_(url), g = og_(html);
  out.name = out.name || g.name; out.avatar = out.avatar || g.avatar;
  const d = g.bio || '';
  const f = d.match(/([\d.,]+[KMB]?)\s+(monthly listeners|followers|saves)/i);
  if (f) out.followers = num_(f[1]);
  const e = d.match(/([\d.,]+)\s+episodes?/i); if (e) out.uploads = num_(e[1]);
  return out;
}
function inlineImg_(src) {
  try {
    const r = UrlFetchApp.fetch(src, { muteHttpExceptions: true });
    if (r.getResponseCode() >= 400) return src;
    const b = r.getBlob(), bytes = b.getBytes();
    if (bytes.length > 30000) return src;
    return 'data:' + (b.getContentType() || 'image/jpeg') + ';base64,' + Utilities.base64Encode(bytes);
  } catch (e) { return src; }
}

/* ---------- automation: daily YouTube refresh + weekly backup ---------- */
/** Run once from the editor. Safe to run again: it replaces the old timers. */
function installTriggers() {
  ScriptApp.getProjectTriggers().forEach(t => { if (['dailyYouTubeUpdate', 'weeklyBackup'].indexOf(t.getHandlerFunction()) >= 0) ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('dailyYouTubeUpdate').timeBased().everyDays(1).atHour(6).create();
  ScriptApp.newTrigger('weeklyBackup').timeBased().onWeekDay(ScriptApp.WeekDay.SUNDAY).atHour(5).create();
  props_().setProperty('AUTO_ON', '1');
  Logger.log('Done. YouTube stats refresh daily (about 6 AM) and the Sheet is backed up every Sunday.');
}
function removeTriggers() {
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  props_().deleteProperty('AUTO_ON'); Logger.log('Automation is off.');
}
function stamp_() { return Utilities.formatDate(new Date(), 'UTC', "yyyy-MM-dd'T'HH:mm'Z'"); }

/** Refreshes subscribers, videos and views for every saved YouTube account. */
function dailyYouTubeUpdate() {
  const start = Date.now(), today = Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd');
  const list = rows_('Accounts').filter(r => r.id && r.platform === 'YouTube' && /youtube\.com\//i.test(String(r.link)));
  // oldest-updated first, so a long list still gets fully covered over a few days
  list.sort((a, b) => new Date(a.updatedAt || 0) - new Date(b.updatedAt || 0));
  let ok = 0, fail = 0, changed = 0;
  for (let i = 0; i < list.length && Date.now() - start < 270000; i++) {
    const r = list[i]; let y = null;
    try { y = youtube_(String(r.link)); } catch (e) { y = null; }
    if (!y || !(y.followers > 0)) { fail++; continue; }
    ok++;
    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(20000);
      const sh = ss_().getSheetByName('Accounts'), cols = SHEETS.Accounts, n = sh.getLastRow(); if (n < 2) continue;
      const ids = sh.getRange(2, 1, n - 1, 1).getValues().map(v => String(v[0])), at = ids.indexOf(String(r.id)); if (at < 0) continue;
      const row = sh.getRange(at + 2, 1, 1, cols.length).getValues()[0], c = k => cols.indexOf(k);
      const was = Number(row[c('followers')]) || 0;
      let snaps = []; try { snaps = JSON.parse(row[c('snaps')] || '[]'); } catch (e) { snaps = []; }
      const last = snaps[snaps.length - 1]; if (last && last.d === today) last.f = y.followers; else snaps.push({ d: today, f: y.followers });
      if (snaps.length > 400) snaps = snaps.slice(-400);
      row[c('followers')] = y.followers; if (y.uploads > 0) row[c('uploads')] = y.uploads; if (y.likes > 0) row[c('likes')] = y.likes;
      row[c('snaps')] = JSON.stringify(snaps); row[c('updatedAt')] = new Date();
      sh.getRange(at + 2, 1, 1, cols.length).setValues([row]);
      if (was !== y.followers) { changed++; ss_().getSheetByName('Snapshots').appendRow([today, r.id, row[c('name')], 'YouTube', y.followers, row[c('likes')], row[c('uploads')]]); }
    } catch (e) { fail++; ok--; } finally { try { lock.releaseLock(); } catch (e) {} }
    Utilities.sleep(400);
  }
  props_().setProperty('LAST_YT', stamp_() + '|' + ok + '|' + fail + '|' + list.length);
  if (ok || fail) ss_().getSheetByName('Activity').appendRow([new Date(), 'Auto-update: ' + ok + ' of ' + list.length + ' YouTube accounts refreshed' + (changed ? ', ' + changed + ' changed' : '') + (fail ? ', ' + fail + ' could not be read' : '')]);
  Logger.log('YouTube refreshed: ' + ok + ' ok, ' + fail + ' failed, ' + list.length + ' total');
}

/** Saves a dated copy of the Sheet in a Drive folder and keeps the newest 8 copies. */
function weeklyBackup() {
  const p = props_(); let folder = null;
  try { if (p.getProperty('BACKUP_FOLDER_ID')) folder = DriveApp.getFolderById(p.getProperty('BACKUP_FOLDER_ID')); } catch (e) { folder = null; }
  if (!folder) { folder = DriveApp.createFolder('ICS Research Portal Backups'); p.setProperty('BACKUP_FOLDER_ID', folder.getId()); }
  const name = 'ICS Research Portal backup ' + Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd');
  DriveApp.getFileById(p.getProperty('SHEET_ID')).makeCopy(name, folder);
  const files = []; const it = folder.getFiles(); while (it.hasNext()) { const f = it.next(); if (/^ICS Research Portal backup /.test(f.getName())) files.push(f); }
  files.sort((a, b) => b.getDateCreated() - a.getDateCreated()).slice(8).forEach(f => f.setTrashed(true));
  p.setProperty('LAST_BACKUP', stamp_());
  Logger.log('Backup saved: ' + name + ' in ' + folder.getUrl());
}
