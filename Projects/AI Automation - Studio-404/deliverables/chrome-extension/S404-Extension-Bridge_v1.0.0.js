// Runs inside the portal page only. Connects the portal to this extension: shared login, bulk import, auto refresh.
(() => {
  document.documentElement.dataset.icsExt = chrome.runtime.getManifest().version;
  const toPage = d => window.postMessage(Object.assign({ icsFrom: 'ext' }, d), location.origin);
  window.addEventListener('message', e => {
    if (e.source !== window || e.origin !== location.origin || !e.data || e.data.icsTo !== 'ext' || !e.data.msg) return;
    try { chrome.runtime.sendMessage(e.data.msg, resp => { void chrome.runtime.lastError; toPage({ re: e.data.id, resp: resp || { ok: false, error: 'noext' } }); }); }
    catch (x) { toPage({ re: e.data.id, resp: { ok: false, error: 'noext' } }); }
  });
  chrome.runtime.onMessage.addListener(m => { if (m && (m.type === 'bulkprogress' || m.type === 'reload' || m.type === 'upsert')) toPage({ event: m }); });
  toPage({ event: { type: 'ready' } });
})();
