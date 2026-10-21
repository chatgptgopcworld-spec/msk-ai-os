// aios-yt-transcript.js — read a YouTube video's captions as plain text (AI OS Blueprint project)
//
// Why: YouTube blocks plain downloads of captions from the cloud workspace, and its caption
// URLs now need a one-time token that only the video player has. Running this inside the
// page lets the player fetch the captions and we copy the text from that response.
//
// How (Claude, in the built-in browser):
//   1. Open the video URL in the built-in browser.
//   2. Run this whole file with the javascript tool on that tab.
//   3. The result is "<title> | <transcript>". Read it; do NOT save it verbatim in the vault
//      (copyright) — write a summary source page instead (see the project's CLAUDE.md).
//   If it returns "none", the video has no captions, or wait a few seconds and run it again.

await new Promise(r => setTimeout(r, 3000));
window.__caps = [];
if (!window.__hooked) {
  window.__hooked = 1;
  const of = window.fetch;
  window.fetch = async function (...a) {
    const r = await of.apply(this, a);
    try {
      const u = (a[0] && a[0].url) || String(a[0]);
      if (u.includes('timedtext')) r.clone().text().then(t => window.__caps.push(t));
    } catch (e) {}
    return r;
  };
  const oo = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u) {
    this.__u = u;
    this.addEventListener('load', () => {
      if (String(this.__u).includes('timedtext')) window.__caps.push(this.responseText);
    });
    return oo.apply(this, arguments);
  };
}
const p = document.getElementById('movie_player');
p.playVideo();
await new Promise(r => setTimeout(r, 2000));
p.unloadModule('captions');               // reloading the captions module makes the player
await new Promise(r => setTimeout(r, 800)); // fetch the caption track again, which we capture
p.loadModule('captions');
await new Promise(r => setTimeout(r, 5000));
p.pauseVideo();
const c = window.__caps.filter(x => x.length > 100).pop();
if (!c) { 'none ' + window.__caps.length; }
else {
  const j = JSON.parse(c);
  p.getVideoData().title + ' | ' + j.events.filter(e => e.segs)
    .map(e => e.segs.map(s => s.utf8).join('')).join('').replace(/\s+/g, ' ');
}
