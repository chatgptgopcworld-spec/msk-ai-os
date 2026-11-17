// Runs inside the profile page (injected by popup.js). Returns a plain object with what it could read.
async function icsScrape() {
  const h = location.hostname.replace(/^(www|m|web|open)\./, '');
  const num = s => { if (s == null) return 0; const m = String(s).replace(/,/g, '').match(/([\d.]+)\s*([KMB])?/i); return m ? Math.round(parseFloat(m[1]) * ({ k: 1e3, m: 1e6, b: 1e9 }[(m[2] || '').toLowerCase()] || 1)) : 0; };
  const dec = s => String(s).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const meta = (html, p) => { const m = html.match(new RegExp('<meta[^>]+(?:property|name)=["\']' + p + '["\'][^>]*content=["\']([^"\']*)', 'i')) || html.match(new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name)=["\']' + p + '["\']', 'i')); return m ? dec(m[1]) : ''; };
  const page = async () => { try { const r = await fetch(location.href.split('#')[0], { credentials: 'include' }); if (r.ok) return await r.text(); } catch (e) {} return document.documentElement.outerHTML; };
  const day = t => new Date(t * 1000).toISOString().slice(0, 10);
  const q = s => { const e = document.querySelector(s); return e ? e.textContent.trim() : ''; };
  const sp = s => String(s || '').replace(/ /g, ' ');
  const d = { platform: '', link: location.href.split('?')[0].split('#')[0] };
  try {
    if (/tiktok\.com$/.test(h)) {
      d.platform = 'TikTok'; const hd = (location.pathname.match(/@([\w.\-]+)/) || [])[1];
      if (!hd) return { error: 'Open a TikTok profile page first.' };
      d.handle = '@' + hd; d.link = 'https://www.tiktok.com/@' + hd;
      const pick = txt => { try { const j = JSON.parse(txt).__DEFAULT_SCOPE__['webapp.user-detail'].userInfo; return j && j.user && String(j.user.uniqueId).toLowerCase() === hd.toLowerCase() ? j : null; } catch (e) { return null; } };
      const sc = document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__'); let info = sc ? pick(sc.textContent) : null;
      if (!info) { const html = await page(); const m = html.match(/<script[^>]+id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/); if (m) info = pick(m[1]); }
      if (info) {
        const u = info.user, s = info.statsV2 || info.stats || {};
        d.name = u.nickname || u.uniqueId; d.avatar = u.avatarMedium || u.avatarLarger || u.avatarThumb;
        d.followers = Number(s.followerCount) || 0; d.following = Number(s.followingCount) || 0; d.likes = Number(s.heartCount || s.heart) || 0; d.uploads = Number(s.videoCount) || 0;
        if (u.region) d.country = u.region;
        let t = Number(u.createTime) || 0; if (!t && u.id) { try { t = Number(BigInt(u.id) / BigInt(4294967296)); } catch (e) {} }
        if (t > 1.2e9 && t < Date.now() / 1000) d.created = day(t);
      }
      const f = q('[data-e2e="followers-count"]'); if (f) { d.followers = num(f); d.following = num(q('[data-e2e="following-count"]')) || d.following; d.likes = num(q('[data-e2e="likes-count"]')) || d.likes; }
      if (!d.name) d.name = q('[data-e2e="user-subtitle"]') || q('[data-e2e="user-title"]') || hd;
      if (!d.avatar) { const im = document.querySelector('[data-e2e="user-avatar"] img, [class*="ImgAvatar"]'); if (im) d.avatar = im.src; }
      const vids = []; document.querySelectorAll('[data-e2e="user-post-item"]').forEach(it => { const a = it.querySelector('a[href*="/video/"], a[href*="/photo/"]'), v = it.querySelector('[data-e2e="video-views"]'), im = it.querySelector('img[alt]'); if (a && v) vids.push({ t: ((im && im.alt) || 'Video').slice(0, 110), v: num(v.textContent), url: a.href.split('?')[0] }); });
      if (vids.length) d.videos = vids.sort((a, b) => b.v - a.v).slice(0, 12);
    } else if (/youtube\.com$/.test(h)) {
      d.platform = 'YouTube';
      if (!/^\/(@|channel\/|c\/|user\/)/.test(location.pathname)) return { error: 'Open a YouTube channel page first.' };
      const base = location.origin + location.pathname.replace(/\/(videos|shorts|featured|streams|playlists|community|about|posts|live|podcasts|releases)\/?$/, '');
      let html = ''; try { html = await (await fetch(base, { credentials: 'include' })).text(); } catch (e) { html = ''; }
      const hdr = document.querySelector('#page-header') || document.querySelector('ytd-tabbed-page-header') || document.querySelector('ytd-c4-tabbed-header-renderer');
      const ht = hdr ? sp(hdr.innerText) : '';
      d.link = base; const h1 = hdr && hdr.querySelector('h1'); d.name = (h1 && h1.textContent.trim()) || meta(html, 'og:title') || document.title.replace(/ - YouTube$/, '');
      const ai = hdr && hdr.querySelector('yt-avatar-shape img, yt-decorated-avatar-view-model img, #avatar img, img.yt-core-image');
      d.avatar = (ai && ai.src && !/^data:/.test(ai.src) ? ai.src : '') || meta(html, 'og:image');
      const sub = ht.match(/([\d.,]+\s?[KMB]?)\s+subscribers?/i) || html.match(/"([\d.,]+[KMB]?) subscribers?"/), vid = ht.match(/([\d.,]+\s?[KMB]?)\s+videos?/i) || html.match(/"([\d.,]+[KMB]?) videos?"/);
      const hd = ht.match(/@[\w.\-]+/) || base.match(/\/(@[^\/]+)/), vw = html.match(/"viewCountText":"([\d,]+) views"/);
      if (sub) d.followers = num(sub[1]); if (vid) d.uploads = num(vid[1]); if (hd) d.handle = decodeURIComponent(hd[1] || hd[0]); if (vw) d.likes = num(vw[1]);
      try {
        const ab = () => document.querySelector('ytd-about-channel-renderer'); let opened = false;
        if (!ab() && hdr) { const b = hdr.querySelector('yt-description-preview-view-model button, .yt-truncated-text__absolute-button, truncated-text button, #channel-tagline, yt-attribution-view-model a'); if (b) { b.click(); opened = true; } }
        for (let n = 0; n < 20 && !ab(); n++) await new Promise(r => setTimeout(r, 150));
        const A = ab(); if (A) {
          const rows = [...A.querySelectorAll('#additional-info-container tr')].map(r => sp(r.innerText).trim()).filter(Boolean), at = rows.join('\n');
          const v = at.match(/([\d.,]+)\s+views/i); if (v) d.likes = num(v[1]);
          const j = at.match(/Joined\s+([^\n]+)/i); if (j) { const t = new Date(j[1].trim() + ' UTC'); if (!isNaN(t)) d.created = t.toISOString().slice(0, 10); }
          const s2 = at.match(/([\d.,]+\s?[KMB]?)\s+subscribers?/i); if (s2 && !d.followers) d.followers = num(s2[1]); const v2 = at.match(/([\d.,]+\s?[KMB]?)\s+videos?/i); if (v2 && !d.uploads) d.uploads = num(v2[1]);
          const c = rows.find(r => r.length < 40 && !/@|\.com|https?:|joined|subscribers?|videos?|views|email|phone|\d{3}/i.test(r)); if (c) d.country = c;
          const L = []; A.querySelectorAll('#link-list-container yt-channel-external-link-view-model, #links-section yt-channel-external-link-view-model').forEach(e => { const a = e.querySelector('a'), tt = e.querySelector('.yt-channel-external-link-view-model-wiz__title, .yt-channel-external-link-view-model__title, span'); let u = a ? a.textContent.trim() : ''; if (!u) return; if (!/^https?:/i.test(u)) u = 'https://' + u; L.push({ t: (tt ? tt.textContent.trim() : '') || u.split('/')[2], u }); });
          if (L.length) d.links = L.slice(0, 8);
          if (opened) { const pop = A.closest('tp-yt-paper-dialog, ytd-engagement-panel-section-list-renderer') || document; const x2 = pop.querySelector('#visibility-button button, button[aria-label*="Close" i], #close-button button, yt-icon-button#close-button'); if (x2) x2.click(); }
        }
      } catch (e) {}
      const vids = []; document.querySelectorAll('ytd-rich-item-renderer, ytd-grid-video-renderer').forEach(it => { const a = it.querySelector('a#video-title-link, a#video-title, a[href*="/watch"]'), tt = it.querySelector('#video-title, h3'), m = sp(it.innerText).match(/([\d.,]+\s?[KMB]?)\s+views/i); if (a && tt && m) vids.push({ t: tt.textContent.trim().slice(0, 110), v: num(m[1]), url: a.href.split('&')[0] }); });
      if (vids.length) d.videos = vids.sort((a, b) => b.v - a.v).slice(0, 12);
    } else if (/(facebook|fb)\.com$/.test(h)) {
      d.platform = 'Facebook'; const html = await page();
      d.name = (meta(html, 'og:title') || q('h1') || document.title).replace(/\s*[|\-]\s*Facebook.*$/i, '').trim(); d.avatar = meta(html, 'og:image');
      let best = null, bw = 0; document.querySelectorAll('svg image').forEach(im => { const r = im.getBoundingClientRect(); if (r.width >= 80 && Math.abs(r.width - r.height) < 6 && r.width > bw) { bw = r.width; best = im; } });
      if (best) { const u = best.getAttribute('xlink:href') || best.getAttribute('href'); if (u) d.avatar = u; }
      if (!d.name || /^facebook$/i.test(d.name)) d.name = q('h1');
      const txt = meta(html, 'og:description') + ' ' + sp(document.body.innerText).slice(0, 6000);
      const fo = txt.match(/([\d.,]+\s?[KMB]?)\s+followers/i), li = txt.match(/([\d.,]+\s?[KMB]?)\s+likes/i), fg = txt.match(/([\d.,]+\s?[KMB]?)\s+following/i);
      if (fo) d.followers = num(fo[1]); if (li) d.likes = num(li[1]); if (fg) d.following = num(fg[1]);
      const p = location.pathname.split('/').filter(Boolean)[0]; if (p && !/^(profile\.php|people|pages|groups)$/.test(p)) d.handle = '@' + p;
      if (/profile\.php/.test(location.pathname)) d.link = location.href.split('&')[0];
    } else if (/instagram\.com$/.test(h)) {
      d.platform = 'Instagram'; const hd = location.pathname.split('/').filter(Boolean)[0];
      if (!hd || /^(p|reel|reels|explore|stories|accounts|direct|tv)$/i.test(hd)) return { error: 'Open an Instagram profile page first.' };
      d.handle = '@' + hd; d.link = 'https://www.instagram.com/' + hd + '/';
      const html = await page(), og = meta(html, 'og:description'), ot = meta(html, 'og:title');
      const hdr = document.querySelector('main header') || document.querySelector('header'), ht = hdr ? sp(hdr.innerText) : '';
      d.name = ((ot.match(/^(.*?)\s*\(@/) || [])[1] || '').trim() || q('header h2') || q('header h1') || hd; d.avatar = meta(html, 'og:image');
      const im = hdr && hdr.querySelector('img[alt*="profile picture" i]'); if (im && im.src && !/^data:/.test(im.src)) d.avatar = im.src;
      const pick = re => { const m = ht.match(re) || og.match(re); return m ? num(m[1]) : 0; };
      d.followers = pick(/([\d.,]+\s?[KMB]?)\s+followers/i); d.following = pick(/([\d.,]+\s?[KMB]?)\s+following/i); d.uploads = pick(/([\d.,]+\s?[KMB]?)\s+posts/i);
      if (!d.followers && !ot) return { error: 'Instagram did not show this profile. Log in to Instagram in this browser and try again.' };
    } else if (/spotify\.com$/.test(h)) {
      d.platform = 'Spotify'; const html = await page();
      d.name = meta(html, 'og:title') || q('h1'); d.avatar = meta(html, 'og:image');
      const txt = meta(html, 'og:description') + ' ' + sp(document.body.innerText).slice(0, 6000);
      const f = txt.match(/([\d.,]+\s?[KMB]?)\s+(monthly listeners|followers)/i); if (f) d.followers = num(f[1]);
      const e = txt.match(/([\d.,]+)\s+episodes?/i); if (e) d.uploads = num(e[1]);
    } else return { error: 'Open a TikTok, YouTube, Facebook, Instagram or Spotify profile, then click the ICS button.' };
  } catch (e) { return { error: 'Could not read this page: ' + (e.message || e) }; }
  return d;
}
