// Turns any pasted text (for example Chrome's copied bookmarks) into a clean list of profile links, sorted by platform.
function icsParseLinks(text) {
  const out = [], seen = new Set();
  const raw = String(text || '').match(/(?:https?:\/\/|www\.)[^\s"'<>,]+|(?:[\w-]+\.)*(?:tiktok|youtube|facebook|spotify|instagram)\.com\/[^\s"'<>,]+|youtu\.be\/[^\s"'<>,]+/gi) || [];
  raw.forEach(r => {
    let u = r.replace(/[)\].;]+$/, ''); if (!/^https?:/i.test(u)) u = 'https://' + u;
    let x; try { x = new URL(u); } catch (e) { return; }
    const h = x.hostname.toLowerCase().replace(/^(www|m|web|open|vm|vt|l)\./, ''), seg = x.pathname.split('/').filter(Boolean);
    let p = '', link = '', why = '';
    if (h === 'tiktok.com') { p = 'TikTok'; const m = x.pathname.match(/@([\w.\-]+)/); if (m) link = 'https://www.tiktok.com/@' + m[1]; else why = 'Not a profile link'; }
    else if (h === 'youtube.com') {
      p = 'YouTube';
      if (seg[0] && seg[0][0] === '@') link = 'https://www.youtube.com/' + seg[0];
      else if (/^(channel|c|user)$/.test(seg[0]) && seg[1]) link = 'https://www.youtube.com/' + seg[0] + '/' + seg[1];
      else why = 'Video link. Paste the channel link instead';
    }
    else if (h === 'youtu.be') { p = 'YouTube'; why = 'Video link. Paste the channel link instead'; }
    else if (h === 'facebook.com' || h === 'fb.com') {
      p = 'Facebook';
      if (seg[0] === 'profile.php' && /^\d+$/.test(x.searchParams.get('id') || '')) link = 'https://www.facebook.com/profile.php?id=' + x.searchParams.get('id');
      else if (seg[0] === 'people' && seg[2]) link = 'https://www.facebook.com/people/' + seg[1] + '/' + seg[2];
      else if (seg[0] && !/^(watch|reel|reels|share|groups|events|marketplace|login|photo|photos|photo\.php|stories|story\.php|permalink\.php|sharer|sharer\.php|gaming|hashtag|pages|video|videos|people|profile\.php)$/i.test(seg[0])) link = 'https://www.facebook.com/' + seg[0];
      else why = 'Not a profile link';
    }
    else if (h === 'instagram.com') { p = 'Instagram'; if (seg[0] && !/^(p|reel|reels|explore|stories|accounts|direct|tv|about|developer|legal|share)$/i.test(seg[0])) link = 'https://www.instagram.com/' + seg[0] + '/'; else why = 'Post link. Paste the profile link instead'; }
    else if (h === 'spotify.com') { p = 'Spotify'; const i = seg.findIndex(s => /^(show|artist|user)$/.test(s)); if (i >= 0 && seg[i + 1]) link = 'https://open.spotify.com/' + seg[i] + '/' + seg[i + 1]; else why = 'Not a show or artist link'; }
    else why = 'Platform not supported';
    const key = (link || u).toLowerCase(); if (seen.has(key)) return; seen.add(key);
    out.push({ url: link || u, platform: p, ok: !!link, why });
  });
  return out;
}
