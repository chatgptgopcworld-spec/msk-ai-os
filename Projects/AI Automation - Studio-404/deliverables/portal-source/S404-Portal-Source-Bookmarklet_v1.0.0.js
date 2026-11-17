(async()=>{
const PORTAL='__PORTAL__',ID='ics-portal-card';
const old=document.getElementById(ID);if(old)old.remove();
const h=location.hostname.replace(/^(www|m|web|open)\./,'');
const el=(t,css,txt)=>{const e=document.createElement(t);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;return e};
const num=s=>{if(s==null)return 0;const m=String(s).replace(/,/g,'').match(/([\d.]+)\s*([KMB])?/i);return m?Math.round(parseFloat(m[1])*({k:1e3,m:1e6,b:1e9}[(m[2]||'').toLowerCase()]||1)):0};
const fmt=n=>n>=1e9?(n/1e9).toFixed(1)+'B':n>=1e6?(n/1e6).toFixed(1)+'M':n>=1e3?(n/1e3).toFixed(1)+'K':String(n||0);
const dec=s=>String(s).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&#x27;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const meta=(html,p)=>{const m=html.match(new RegExp('<meta[^>]+(?:property|name)=["\']'+p+'["\'][^>]*content=["\']([^"\']*)','i'))||html.match(new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name)=["\']'+p+'["\']','i'));return m?dec(m[1]):''};
const page=async()=>{try{const r=await fetch(location.href.split('#')[0],{credentials:'include'});if(r.ok)return await r.text()}catch(e){}return document.documentElement.outerHTML};
const day=t=>new Date(t*1000).toISOString().slice(0,10);
const q=s=>{const e=document.querySelector(s);return e?e.textContent.trim():''};
let d={platform:'',link:location.href.split('?')[0].split('#')[0]};
const card=el('div','position:fixed;top:16px;right:16px;z-index:2147483647;width:320px;background:#0c1226;color:#eef1ff;border:1px solid #2a3566;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.55),0 0 0 1px rgba(110,140,255,.15);font:14px/1.4 system-ui,Segoe UI,Arial,sans-serif;padding:16px;text-align:left');
card.id=ID;
const head=el('div','display:flex;align-items:center;justify-content:space-between;margin-bottom:12px');
head.appendChild(el('b','font-size:13px;letter-spacing:.08em;color:#8fa2ff','ICS RESEARCH PORTAL'));
const x=el('button','all:unset;cursor:pointer;color:#9aa3c7;font-size:20px;line-height:1;padding:2px 6px','×');x.onclick=()=>card.remove();head.appendChild(x);
card.appendChild(head);
const body=el('div','','Reading this profile...');card.appendChild(body);
document.body.appendChild(card);
try{
 if(/tiktok\.com$/.test(h)){
  d.platform='TikTok';const hd=(location.pathname.match(/@([\w.\-]+)/)||[])[1];
  if(!hd)throw new Error('Open a TikTok profile page first.');
  d.handle='@'+hd;d.link='https://www.tiktok.com/@'+hd;
  const pick=txt=>{try{const j=JSON.parse(txt).__DEFAULT_SCOPE__['webapp.user-detail'].userInfo;return j&&j.user&&String(j.user.uniqueId).toLowerCase()===hd.toLowerCase()?j:null}catch(e){return null}};
  const sc=document.getElementById('__UNIVERSAL_DATA_FOR_REHYDRATION__');let info=sc?pick(sc.textContent):null;
  if(!info){const html=await page();const m=html.match(/<script[^>]+id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/);if(m)info=pick(m[1])}
  if(info){const u=info.user,s=info.statsV2||info.stats||{};
   d.name=u.nickname||u.uniqueId;d.avatar=u.avatarMedium||u.avatarLarger||u.avatarThumb;d.bio=u.signature||'';
   d.followers=Number(s.followerCount)||0;d.following=Number(s.followingCount)||0;d.likes=Number(s.heartCount||s.heart)||0;d.uploads=Number(s.videoCount)||0;
   let t=Number(u.createTime)||0;if(!t&&u.id){try{t=Number(BigInt(u.id)/BigInt(4294967296))}catch(e){}}
   if(t>1.2e9&&t<Date.now()/1000)d.created=day(t)}
  const f=q('[data-e2e="followers-count"]');if(f){d.followers=num(f);d.following=num(q('[data-e2e="following-count"]'))||d.following;d.likes=num(q('[data-e2e="likes-count"]'))||d.likes}
  if(!d.name)d.name=q('[data-e2e="user-subtitle"]')||q('[data-e2e="user-title"]')||hd;
  if(!d.avatar){const im=document.querySelector('[data-e2e="user-avatar"] img, [class*="ImgAvatar"]');if(im)d.avatar=im.src}
 }else if(/youtube\.com$/.test(h)){
  d.platform='YouTube';
  if(!/^\/(@|channel\/|c\/|user\/)/.test(location.pathname))throw new Error('Open a YouTube channel page first.');
  const base=location.origin+location.pathname.replace(/\/(videos|shorts|featured|streams|playlists|community|about|posts|live|podcasts|releases)\/?$/,'');
  let html='';try{html=await(await fetch(base,{credentials:'include'})).text()}catch(e){html=''}
  const hdr=document.querySelector('#page-header')||document.querySelector('ytd-tabbed-page-header')||document.querySelector('ytd-c4-tabbed-header-renderer');
  const ht=hdr?hdr.innerText.replace(/ /g,' '):'';
  d.link=base;const h1=hdr&&hdr.querySelector('h1');d.name=(h1&&h1.textContent.trim())||meta(html,'og:title')||document.title.replace(/ - YouTube$/,'');
  const ai=hdr&&hdr.querySelector('yt-avatar-shape img, yt-decorated-avatar-view-model img, #avatar img, img.yt-core-image');
  d.avatar=(ai&&ai.src&&!/^data:/.test(ai.src)?ai.src:'')||meta(html,'og:image');
  const sub=ht.match(/([\d.,]+\s?[KMB]?)\s+subscribers?/i)||html.match(/"([\d.,]+[KMB]?) subscribers?"/),vid=ht.match(/([\d.,]+\s?[KMB]?)\s+videos?/i)||html.match(/"([\d.,]+[KMB]?) videos?"/);
  const hd=ht.match(/@[\w.\-]+/)||base.match(/\/(@[^\/]+)/)||html.match(/"canonicalBaseUrl":"\/(@[^"]+)"/),vw=html.match(/"viewCountText":"([\d,]+) views"/),jn=html.match(/"Joined ([A-Za-z]{3} \d{1,2}, \d{4})"/);
  if(sub)d.followers=num(sub[1]);if(vid)d.uploads=num(vid[1]);if(hd)d.handle=decodeURIComponent(hd[1]||hd[0]);if(vw)d.likes=num(vw[1]);
  if(jn){const t=new Date(jn[1]+' UTC');if(!isNaN(t))d.created=t.toISOString().slice(0,10)}
  try{const ab=()=>document.querySelector('ytd-about-channel-renderer');let opened=false;
   if(!ab()&&hdr){const b=hdr.querySelector('yt-description-preview-view-model button, .yt-truncated-text__absolute-button, truncated-text button, #channel-tagline, yt-attribution-view-model a');if(b){b.click();opened=true}}
   for(let n=0;n<20&&!ab();n++)await new Promise(r=>setTimeout(r,150));
   const A=ab();if(A){const rows=[...A.querySelectorAll('#additional-info-container tr')].map(r=>r.innerText.replace(/ /g,' ').trim()).filter(Boolean),at=rows.join('\n');
    const v=at.match(/([\d.,]+)\s+views/i);if(v)d.likes=num(v[1]);
    const j=at.match(/Joined\s+([^\n]+)/i);if(j){const t=new Date(j[1].trim()+' UTC');if(!isNaN(t))d.created=t.toISOString().slice(0,10)}
    const s2=at.match(/([\d.,]+\s?[KMB]?)\s+subscribers?/i);if(s2&&!d.followers)d.followers=num(s2[1]);const v2=at.match(/([\d.,]+\s?[KMB]?)\s+videos?/i);if(v2&&!d.uploads)d.uploads=num(v2[1]);
    const c=rows.find(r=>r.length<40&&!/@|\.com|https?:|joined|subscribers?|videos?|views|email|phone|\d{3}/i.test(r));if(c)d.country=c;
    const L=[];A.querySelectorAll('#link-list-container yt-channel-external-link-view-model, #links-section yt-channel-external-link-view-model').forEach(e=>{const a=e.querySelector('a'),tt=e.querySelector('.yt-channel-external-link-view-model-wiz__title, .yt-channel-external-link-view-model__title, span');let u=a?a.textContent.trim():'';if(!u)return;if(!/^https?:/i.test(u))u='https://'+u;L.push({t:(tt?tt.textContent.trim():'')||u.split('/')[2],u})});
    if(L.length)d.links=L.slice(0,8);
    if(opened){const pop=A.closest('tp-yt-paper-dialog, ytd-engagement-panel-section-list-renderer')||document;const x2=pop.querySelector('#visibility-button button, button[aria-label*="Close" i], #close-button button, yt-icon-button#close-button');if(x2)x2.click()}}
  }catch(e){}
 }else if(/(facebook|fb)\.com$/.test(h)){
  d.platform='Facebook';const html=await page();
  d.name=(meta(html,'og:title')||q('h1')||document.title).replace(/\s*[|\-]\s*Facebook.*$/i,'').trim();d.avatar=meta(html,'og:image');d.bio=meta(html,'og:description');
  let best=null,bw=0;document.querySelectorAll('svg image').forEach(im=>{const r=im.getBoundingClientRect();if(r.width>=80&&Math.abs(r.width-r.height)<6&&r.width>bw){bw=r.width;best=im}});
  if(best){const u=best.getAttribute('xlink:href')||best.getAttribute('href');if(u)d.avatar=u}
  if(!d.name||/^facebook$/i.test(d.name))d.name=q('h1');
  const txt=(d.bio||'')+' '+document.body.innerText.replace(/\u00a0/g,' ').slice(0,6000);
  const fo=txt.match(/([\d.,]+\s?[KMB]?)\s+followers/i),li=txt.match(/([\d.,]+\s?[KMB]?)\s+likes/i);
  if(fo)d.followers=num(fo[1]);if(li)d.likes=num(li[1]);const fg=txt.match(/([\d.,]+\s?[KMB]?)\s+following/i);if(fg)d.following=num(fg[1]);
  const p=location.pathname.split('/').filter(Boolean)[0];if(p&&!/^(profile\.php|people|pages|groups)$/.test(p))d.handle='@'+p;
  if(/profile\.php/.test(location.pathname))d.link=location.href.split('&')[0];
 }else if(/spotify\.com$/.test(h)){
  d.platform='Spotify';const html=await page();
  d.name=meta(html,'og:title')||q('h1');d.avatar=meta(html,'og:image');d.bio=meta(html,'og:description');
  const txt=(d.bio||'')+' '+document.body.innerText.slice(0,6000);
  const f=txt.match(/([\d.,]+\s?[KMB]?)\s+(monthly listeners|followers)/i);if(f)d.followers=num(f[1]);
  const e=txt.match(/([\d.,]+)\s+episodes?/i);if(e)d.uploads=num(e[1]);
 }else throw new Error('Open a TikTok, YouTube, Facebook or Spotify profile first, then press this button.');
 if(d.avatar&&!/^data:/.test(d.avatar)){const src=d.avatar;
  const shrink=im=>{const w=im.width,hh=im.height,c=document.createElement('canvas');c.width=c.height=96;const k=Math.min(w,hh);c.getContext('2d').drawImage(im,(w-k)/2,(hh-k)/2,k,k,0,0,96,96);return c.toDataURL('image/jpeg',.82)};
  const viaFetch=async()=>{const r=await fetch(src,{mode:'cors',cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer'});if(!r.ok)throw 0;return shrink(await createImageBitmap(await r.blob()))};
  const viaImg=()=>new Promise((res,rej)=>{const im=new Image();im.crossOrigin='anonymous';im.referrerPolicy='no-referrer';im.onload=()=>{try{res(shrink(im))}catch(e){rej(e)}};im.onerror=rej;im.src=src});
  const lim=p=>Promise.race([p,new Promise((_,rej)=>setTimeout(rej,4000))]);
  try{d.avatar=await lim(viaFetch())}catch(e){try{d.avatar=await lim(viaImg())}catch(e2){d.avatar=src}}}
 body.textContent='';
 const top=el('div','display:flex;gap:12px;align-items:center;margin-bottom:12px');
 if(d.avatar){const im=el('img','width:56px;height:56px;border-radius:50%;object-fit:cover;flex:none;border:2px solid #3b4cff');im.src=d.avatar;im.referrerPolicy='no-referrer';top.appendChild(im)}
 const who=el('div','min-width:0');who.appendChild(el('div','font-weight:700;font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap',d.name||'(no name)'));
 who.appendChild(el('div','color:#9aa3c7;font-size:12.5px',(d.handle?d.handle+' · ':'')+d.platform));top.appendChild(who);body.appendChild(top);
 const L={TikTok:['Followers','Likes','Videos'],YouTube:['Subscribers','Views','Videos'],Facebook:['Followers','Likes','Posts'],Spotify:['Followers','Plays','Episodes']}[d.platform];
 const grid=el('div','display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:10px');
 [[L[0],d.followers],[L[1],d.likes],[L[2],d.uploads]].forEach(([k,v])=>{const c=el('div','background:#141c3a;border-radius:10px;padding:8px;text-align:center');c.appendChild(el('div','font-weight:700;font-size:15px',v?fmt(v):'—'));c.appendChild(el('div','color:#9aa3c7;font-size:11px',k));grid.appendChild(c)});
 body.appendChild(grid);
 const more=[d.country,d.links&&d.links.length?d.links.length+' links':'',d.platform==='Facebook'&&d.following!=null?fmt(d.following)+' following':''].filter(Boolean).join(' \u00b7 ');if(more)body.appendChild(el('div','color:#9aa3c7;font-size:12px;margin-bottom:6px',more));
 if(d.created)body.appendChild(el('div','color:#9aa3c7;font-size:12px;margin-bottom:10px','Joined '+d.created));
 const fcss='all:unset;box-sizing:border-box;display:block;width:100%;background:#141c3a;border:1px solid #2a3566;border-radius:10px;padding:9px 11px;color:#eef1ff;font-size:13px;margin-bottom:8px';
 const ni=el('input',fcss);ni.placeholder='Niche (optional), e.g. AI tools';['keydown','keyup','keypress'].forEach(ev=>ni.addEventListener(ev,e=>e.stopPropagation()));body.appendChild(ni);
 const st=el('select',fcss+';cursor:pointer');['New','Shortlisted','Selected','Rejected'].forEach(v=>{const o=el('option','background:#141c3a;color:#eef1ff',v);o.value=v;st.appendChild(o)});body.appendChild(st);
 const btn=el('button','all:unset;box-sizing:border-box;display:block;width:100%;text-align:center;cursor:pointer;background:linear-gradient(90deg,#35b6ff,#8a5bff);color:#fff;font-weight:700;border-radius:10px;padding:11px','Save to Portal');
 btn.onclick=()=>{delete d.bio;d.auto=1;d.niche=ni.value.trim();d.status=st.value;const p=btoa(unescape(encodeURIComponent(JSON.stringify(d)))).replace(/\+/g,'-').replace(/\//g,'_');
  const w=window.open(PORTAL.replace(/[^\/]*$/,'')+'save.html#'+p,'icsportal','popup=1,width=120,height=120,left='+(screen.availWidth-140)+',top='+(screen.availHeight-160));
  body.textContent=w?'Saved to your portal.':'Your browser blocked the popup. Allow popups for this site and press the button again.';if(w)setTimeout(()=>card.remove(),1500)};
 body.appendChild(btn);
}catch(e){body.textContent=e.message||String(e)}
})();
