(()=>{
try{const im=location.hash.match(/^#import=(.+)$/);if(im){sessionStorage.setItem('ics-import',im[1]);history.replaceState(null,'','#research')}}catch(e){}
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STAT=['New','Shortlisted','Selected','Active','Rejected'];
const STAGES=['Idea','Script','Production','Posted'];
const P={
 TikTok:{f:'Followers',l:'Likes',u:'Videos',unit:'video',extra:[['avgViews','Avg views per video','num'],['following','Following','num'],['country','Country','txt']]},
 YouTube:{f:'Subscribers',l:'Total views',u:'Videos',unit:'video',extra:[['avgViews','Avg views per video','num'],['country','Country','txt'],['format','Format','sel',['Long videos','Shorts','Both']]]},
 Facebook:{nl:1,f:'Followers',l:'Page likes',u:'Posts',unit:'post',extra:[['pageType','Page type','sel',['Page','Profile','Group']],['avgViews','Avg reach per post','num']]},
 Spotify:{f:'Followers',l:'Monthly listeners',u:'Episodes',unit:'episode',extra:[['showType','Type','sel',['Podcast','Artist']],['avgViews','Avg plays per episode','num']]},
 Instagram:{nl:1,f:'Followers',l:'Likes',u:'Posts',unit:'post',extra:[['following','Following','num'],['avgViews','Avg views per reel','num'],['country','Country','txt']]}
};
const PL=Object.keys(P);
const KEY='ics-research-portal';
const today=()=>new Date().toISOString().slice(0,10);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function num(v){if(typeof v==='number')return v;v=String(v||'').trim().replace(/,/g,'');const m=v.match(/^([\d.]+)\s*([kmb])?$/i);if(!m)return 0;return Math.round(parseFloat(m[1])*({k:1e3,m:1e6,b:1e9}[(m[2]||'').toLowerCase()]||1))}
const tr=x=>(x>=100?x.toFixed(0):x.toFixed(1)).replace(/\.0$/,'');
function fmt(n){n=+n||0;if(n>=1e9)return tr(n/1e9)+'B';if(n>=1e6)return tr(n/1e6)+'M';if(n>=1e3)return tr(n/1e3)+'K';return ''+n}
function ago(t){const s=(Date.now()-t)/1000;if(s<60)return 'just now';if(s<3600)return Math.floor(s/60)+' min ago';if(s<86400)return Math.floor(s/3600)+' hours ago';return Math.floor(s/86400)+' days ago'}
function wk(n){const d=new Date();d.setDate(d.getDate()-n*7);return d.toISOString().slice(0,10)}
function snaps(end,growth){const a=[];let v=end;for(let i=0;i<8;i++){a.unshift({d:wk(i),f:Math.round(v)});v=v/(1+growth*(0.6+((i*37)%10)/12))}return a}
function seed(){
 const A=(o)=>Object.assign({id:uid(),kind:'research',tags:[],notes:'',extra:{},videos:[],comps:[],hist:[],link:''},o);
 const r=[
  A({p:'TikTok',name:'AI Tools Daily',handle:'@aitoolsdaily',niche:'AI tools',tags:['hooks','fast-cut'],followers:812000,likes:14200000,uploads:412,created:'2023-03-14',status:'Selected',hue:340,extra:{avgViews:96000,following:120},notes:'Har video pehle 2 second mein result dikhati hai. Hook style copy karne layak.',snaps:snaps(812000,.011),videos:[{t:'5 AI tools jo kaam 10x karein',v:2100000,url:''},{t:'ChatGPT se Excel formula',v:940000,url:''},{t:'Free AI video editor',v:610000,url:''}]}),
  A({p:'YouTube',name:'Automate With Ali',handle:'@automatewithali',niche:'n8n aur Make tutorials',tags:['tutorial','long-form'],followers:214000,likes:9800000,uploads:186,created:'2022-01-09',status:'Shortlisted',hue:210,extra:{avgViews:41000,format:'Long videos'},snaps:snaps(214000,.008),videos:[{t:'n8n complete course',v:480000,url:''},{t:'WhatsApp bot bina code',v:310000,url:''}]}),
  A({p:'Facebook',name:'Tech Masti',handle:'Tech Masti',niche:'Tech news',tags:['news'],followers:95000,likes:88000,uploads:930,created:'2019-06-01',status:'Rejected',hue:30,extra:{pageType:'Page',avgViews:2100},notes:'Content copy paste hai, engagement kam.',snaps:snaps(95000,.001)}),
  A({p:'Spotify',name:'AI Urdu Podcast',handle:'Weekly show',niche:'AI talk Urdu',tags:['urdu','podcast'],followers:12000,likes:38000,uploads:64,created:'2024-06-20',status:'New',hue:150,extra:{showType:'Podcast',avgViews:5200},snaps:snaps(12000,.02),videos:[{t:'EP 64: AI agents kya hain',v:7400,url:''},{t:'EP 63: Freelancing with AI',v:6100,url:''}]}),
  A({p:'TikTok',name:'Prompt Wala',handle:'@promptwala',niche:'Prompt hacks',tags:['faceless','hooks'],followers:340000,likes:5600000,uploads:220,created:'2024-08-02',status:'New',hue:270,extra:{avgViews:44000,following:35},snaps:snaps(340000,.026),videos:[{t:'Yeh prompt client laata hai',v:880000,url:''}]}),
  A({p:'YouTube',name:'NoCode Nation',handle:'@nocodenation',niche:'No-code tools',tags:['benchmark'],followers:1200000,likes:88000000,uploads:540,created:'2020-02-11',status:'Selected',hue:190,extra:{avgViews:120000,format:'Both'},snaps:snaps(1200000,.006)}),
  A({p:'TikTok',name:'Faceless Factory',handle:'@facelessfactory',niche:'Faceless AI videos',tags:['faceless'],followers:128000,likes:2400000,uploads:96,created:'2025-02-18',status:'Shortlisted',hue:20,extra:{avgViews:31000,following:12},snaps:snaps(128000,.019)}),
  A({p:'Facebook',name:'Smart Kaam',handle:'Smart Kaam',niche:'Business automation',tags:['urdu'],followers:48000,likes:45000,uploads:310,created:'2021-09-05',status:'New',hue:100,extra:{pageType:'Page',avgViews:3900},snaps:snaps(48000,.007)}),
 ];
 r.forEach(a=>a.hist=[{d:wk(3),s:'New'}].concat(a.status!=='New'?[{d:wk(1),s:a.status}]:[]));
 const m=[
  A({kind:'mine',p:'TikTok',name:'ABC Automation',handle:'@abc.automation',niche:'AI automation Urdu',tags:['faceless','urdu'],followers:48200,likes:1300000,uploads:86,created:'2025-02-12',status:'',hue:225,extra:{avgViews:21000,following:312},notes:'Roz ek video. 20 se 30 second wali videos sab se achi chal rahi hain.',snaps:snaps(48200,.06),comps:[r[0].id,r[4].id,r[6].id],videos:[{t:'1 minute mein invoice automation',v:128000,url:''},{t:'ChatGPT + Sheets hack',v:96000,url:''},{t:'WhatsApp bot bina code',v:74000,url:''},{t:'AI voice Urdu mein',v:120000,url:''},{t:'Gmail ka auto-reply',v:31000,url:''},{t:'5 tools jo kaam 10x karein',v:52000,url:''}]}),
  A({kind:'mine',p:'YouTube',name:'ABC Automation',handle:'@ABCAutomation',niche:'Automation tutorials',tags:['tutorial'],followers:9600,likes:412000,uploads:38,created:'2025-03-03',status:'',hue:225,extra:{avgViews:8400,format:'Both'},snaps:snaps(9600,.08),comps:[r[1].id,r[5].id],videos:[{t:'Make.com Gmail se Sheets',v:22000,url:''},{t:'n8n pehla workflow',v:15000,url:''}]}),
 ];
 const I=(t,p,st,n)=>({id:uid(),t,p,st,n:n||''});
 return {accounts:r.concat(m),
  ideas:[I('ChatGPT se 1 minute mein invoice','TikTok','Idea','Hook: "Yeh kaam 2 ghante ka tha"'),I('n8n + WhatsApp bot tutorial','YouTube','Idea'),I('5 AI tools jo kaam 10x karein','TikTok','Script','Hook ready'),I('Make.com Gmail se Sheets flow','YouTube','Production','Due 18 Nov'),I('AI voice clone Urdu mein','TikTok','Posted','120K views'),I('AI agents explained','Spotify','Script')],
  log:[{t:Date.now()-6e5,x:'AI Tools Daily ka status Selected hua'},{t:Date.now()-36e5,x:'Tech Masti ka status Rejected hua'},{t:Date.now()-864e5,x:'Faceless Factory add hua'}],
  ui:{view:CFG.view,plat:'all',status:'all',q:'',theme:'system'}};
}
const blank=()=>({accounts:[],ideas:[],log:[],ui:{view:CFG.view,plat:'all',status:'all',q:'',theme:'system'}});
let S;try{const r=localStorage.getItem(KEY);S=r?JSON.parse(r):blank()}catch(e){S=blank()}
if(!S||!S.accounts)S=blank();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}queueSync()};
/* ---------- Google Sheets sync ---------- */
const CK='ics-portal-conn';
let CONN=null;try{CONN=JSON.parse(localStorage.getItem(CK)||'null')}catch(e){}
let SYNCED={a:{},i:{}},lastLogT=0,syncT=null,syncing=false,wipeAct=false,sheetUrl='',ROLE=(CONN&&CONN.role)||'admin',TEAM=[],AUTO={},syncState=CONN?'loading':'local',syncMsg='';
function markSynced(){SYNCED={a:{},i:{}};S.accounts.forEach(a=>SYNCED.a[a.id]=JSON.stringify(a));S.ideas.forEach(i=>SYNCED.i[i.id]=JSON.stringify(i));lastLogT=S.log.reduce((m,l)=>Math.max(m,l.t),0)}
async function post(url,body){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body)});return r.json()}
async function api(body){const j=await post(CONN.url,Object.assign({token:CONN.token},body));if(!j.ok){if(j.error==='auth')expired();throw new Error(j.error||'error')}return j}
const pull=()=>api({action:'load'});
function expired(){if(!CONN)return;CONN=null;try{localStorage.removeItem(CK);localStorage.removeItem(KEY)}catch(e){}S=blank();showLogin('Session expired, please log in again')}
function queueSync(){if(!CONN||syncState==='loading')return;clearTimeout(syncT);setSync('pending');syncT=setTimeout(pushSync,700)}
async function pushSync(){if(syncing){clearTimeout(syncT);syncT=setTimeout(pushSync,600);return}
 const ups=[],ideas=[],sentA={},sentI={};
 S.accounts.forEach(a=>{const j=JSON.stringify(a);if(SYNCED.a[a.id]!==j){ups.push(a);sentA[a.id]=j}});
 const ida=new Set(S.accounts.map(a=>a.id)),delA=Object.keys(SYNCED.a).filter(id=>!ida.has(id));
 S.ideas.forEach(i=>{const j=JSON.stringify(i);if(SYNCED.i[i.id]!==j){ideas.push(i);sentI[i.id]=j}});
 const idi=new Set(S.ideas.map(i=>i.id)),delI=Object.keys(SYNCED.i).filter(id=>!idi.has(id));
 const logs=S.log.filter(l=>l.t>lastLogT).reverse(),wipe=wipeAct;
 if(!ups.length&&!delA.length&&!ideas.length&&!delI.length&&!logs.length&&!wipe){setSync('ok');return}
 syncing=true;setSync('saving');
 try{await api({action:'sync',accounts:ups,deleteAccounts:delA,ideas,deleteIdeas:delI,logs,wipeActivity:wipe});
  Object.assign(SYNCED.a,sentA);delA.forEach(id=>delete SYNCED.a[id]);Object.assign(SYNCED.i,sentI);delI.forEach(id=>delete SYNCED.i[id]);
  if(logs.length)lastLogT=Math.max(lastLogT,...logs.map(l=>l.t));if(wipe)wipeAct=false;setSync('ok')}
 catch(e){if(e.message==='readonly'){setSync('error','View-only login, changes are not saved');return}setSync('error','Save failed, retrying');clearTimeout(syncT);syncT=setTimeout(pushSync,8000)}
 finally{syncing=false}}
function syncHtml(){const m={local:['Not logged in','off'],loading:['Loading from Sheet','busy'],pending:['Changes...','busy'],saving:['Saving to Sheet','busy'],ok:['Synced with Google Sheet','on'],error:[syncMsg||'Sync error','err']}[syncState];return `<a class="syncpill ${m[1]}" href="#settings" title="Google Sheet connection"><i></i><span>${m[0]}</span></a>`}
function setSync(s,m){syncState=s;syncMsg=m||'';const el=document.getElementById('sync');if(el)el.innerHTML=syncHtml()}
window.addEventListener('beforeunload',e=>{if(CONN&&(syncState==='pending'||syncState==='saving')){e.preventDefault();e.returnValue=''}});
const log=x=>{S.log.unshift({t:Date.now(),x});S.log=S.log.slice(0,80)};
const acc=id=>S.accounts.find(a=>a.id===id);
const ic=(n,c='')=>`<svg class="i ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const logo=(p,sz=18)=>`<img class="plogo" src="${LOGO[p]}" alt="${p}" style="width:${sz}px;height:${sz}px">`;
const ini=n=>n.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const av=(a,sz=40,badge=true)=>`<span class="av" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz*.36)}px;background:hsl(${a.hue} 58% 46%)">${a.extra&&a.extra.avatar?`<img class="avi" src="${esc(a.extra.avatar)}" alt="" referrerpolicy="no-referrer" onerror="this.remove()">`:esc(ini(a.name))}${badge?`<img class="avp" src="${LOGO[a.p]}" alt="${a.p}">`:''}</span>`;
const pill=s=>`<span class="pill s-${s}">${s}</span>`;
const stSel=a=>`<select class="stsel s-${a.status}" data-ch="status" data-id="${a.id}" aria-label="Status">${STAT.map(s=>`<option${s===a.status?' selected':''}>${s}</option>`).join('')}</select>`;
function growth(a){const s=a.snaps||[];if(s.length<2)return null;const p=s[s.length-2].f,c=s[s.length-1].f;return p?((c-p)/p*100):0}
const gtxt=a=>{const g=growth(a);if(g===null)return '<span class="mut">—</span>';return `<span class="${g>=0?'up':'dn'}">${g>=0?'+':'−'}${Math.abs(g).toFixed(1)}%</span>`};
function spark(a,w=72,h=28){const p=(a.snaps||[]).map(s=>s.f);if(p.length<2)return '';const mn=Math.min(...p),mx=Math.max(...p),r=mx-mn||1;const xy=p.map((v,i)=>[2+i*(w-4)/(p.length-1),h-3-(v-mn)/r*(h-6)]);const d=xy.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+','+q[1].toFixed(1)).join('');const e=xy[xy.length-1];return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><path d="${d}L${e[0]},${h}L2,${h}Z" fill="var(--accent)" opacity=".14"/><path d="${d}" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round"/><circle cx="${e[0]}" cy="${e[1]}" r="2.6" fill="var(--accent)"/></svg>`}

/* ---------- shell ---------- */
const NAV=[['home','home','Dashboard'],['research','search','Research'],['mine','star','My accounts'],['import','copy','Import links'],['ideas','bulb','Ideas'],['activity','clock','Activity'],['settings','gear','Settings']];
function shell(){
 document.body.insertAdjacentHTML('beforeend',`<div class="app nav-${CFG.nav}">
 <aside class="nav"><a class="brand" href="#home"><span class="blogo"><img src="${ICS}" alt="ICS"></span><span class="bname">Research<br><small>Portal</small></span></a>
 <nav class="links">${NAV.map(([h,i,l])=>`<a href="#${h}" data-nav="${h}">${ic(i)}<span>${l}</span></a>`).join('')}</nav>
 <div class="navfoot"><button class="themebtn" data-act="theme" aria-label="Change theme">${ic('sun','sun')}${ic('moon','moon')}<span>Theme</span></button></div></aside>
 <div class="main"><header class="top"><div class="ttl"><h1 id="ttl"></h1><p id="sub"></p></div><span id="sync"></span>
 <label class="search">${ic('search')}<input id="q" placeholder="Search name, niche, tag" autocomplete="off"></label>
 <button class="btn icon mtheme" data-act="theme" aria-label="Change theme">${ic('sun','sun')}${ic('moon','moon')}</button>
 <button class="btn primary" data-act="add">${ic('plus')}<span>Add account</span></button></header>
 <div id="view"></div><p class="demo">ICS Research Portal · data is saved to Google Sheets, and every account can have its own Google Doc.</p></div></div>
 <div class="scrim" id="scrim" hidden></div><div class="modal" id="modal" hidden role="dialog" aria-modal="true"></div><div class="toast" id="toast" role="status"></div>`);
}
function applyTheme(){const t=S.ui.theme;const r=document.documentElement;if(t==='system')r.removeAttribute('data-theme');else r.setAttribute('data-theme',t)}
function isDark(){const t=document.documentElement.getAttribute('data-theme');return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._);t._=setTimeout(()=>t.classList.remove('show'),2400)}

/* ---------- views ---------- */
const research=()=>S.accounts.filter(a=>a.kind==='research');
const mine=()=>S.accounts.filter(a=>a.kind==='mine');
const addT=a=>{const x=a.extra||{};if(x.at)return +x.at;const d=(a.hist&&a.hist[0]&&a.hist[0].d)||(a.snaps&&a.snaps[0]&&a.snaps[0].d);const t=d?Date.parse(d):0;return isNaN(t)?0:t};
const addTxt=a=>{const t=addT(a);return t?new Date(t).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}):'—'};
const okLink=a=>a.link&&/^https?:\/\//i.test(a.link);
const openBtn=a=>okLink(a)?`<a class="btn sm openl" href="${esc(a.link)}" target="_blank" rel="noopener noreferrer" title="Open on ${a.p}">${ic('ext')}<span>Open</span></a>`:'<span class="mut">—</span>';
const SORTS=[['recent','Newest added'],['followers','Most followers'],['likes','Most likes / views'],['uploads','Most uploads'],['growth','Fastest growing'],['name','Name A to Z'],['created','Newest account']];
const SEL=new Set();
function filtered(){const u=S.ui,q=u.q.toLowerCase(),nf=u.niche||'all';const r=research().filter(a=>(u.plat==='all'||a.p===u.plat)&&(nf==='all'||(a.niche||'')===nf)&&(!q||(a.name+' '+a.handle+' '+a.niche+' '+a.tags.join(' ')).toLowerCase().includes(q)));
 const k=u.sort||'recent';if(k==='recent'){const ix=new Map(S.accounts.map((a,i)=>[a.id,i]));return r.slice().sort((a,b)=>(addT(b)-addT(a))||(ix.get(b.id)-ix.get(a.id)))}const g=a=>{const x=growth(a);return x===null?-1e9:x};
 return r.slice().sort((a,b)=>k==='name'?a.name.localeCompare(b.name):k==='created'?String(b.created||'').localeCompare(String(a.created||'')):k==='growth'?g(b)-g(a):(b[k]||0)-(a[k]||0))}
function head(t,s){$('#ttl').textContent=t;$('#sub').textContent=s||''}

function vHome(){
 head('Dashboard','Overview of today\'s research');
 const r=research(),c=s=>r.filter(a=>a.status===s).length,mx=Math.max(1,...PL.map(p=>r.filter(a=>a.p===p).length));
 return `<div class="kpis">
  <a class="kpi" href="#research" data-act="gost" data-s="all"><small>Researched</small><b>${r.length}</b><span>total accounts</span></a>
  ${STAT.map(s=>`<a class="kpi k-${s}" href="#research" data-act="gost" data-s="${s}"><small>${s}</small><b>${c(s)}</b><span class="bar"><i class="s-${s}" style="width:${r.length?c(s)/r.length*100:0}%"></i></span></a>`).join('')}</div>
 <div class="cols">
  <section class="card"><div class="ch"><h2>Mere accounts</h2><a class="lnk" href="#mine">Sab dekhein</a></div>
   ${mine().map(a=>`<a class="row" href="#acc-${a.id}">${av(a,42)}<span class="who"><b>${esc(a.name)}</b><small>${esc(a.handle)}</small></span>${spark(a)}<span class="rnum"><b>${fmt(a.followers)}</b><small>${gtxt(a)}</small></span></a>`).join('')||empty('No accounts yet','Add your first account')}
   <button class="btn ghost full" data-act="add" data-kind="mine">${ic('plus')}Add your account</button></section>
  <section class="card"><div class="ch"><h2>Platform breakdown</h2></div>
   ${PL.map(p=>{const n=r.filter(a=>a.p===p).length;return `<a class="pbar" href="#research" data-act="goplat" data-p="${p}">${logo(p,22)}<span class="pn">${p}</span><span class="track"><i style="width:${n/mx*100}%"></i></span><b>${n}</b></a>`}).join('')}</section>
  <section class="card"><div class="ch"><h2>Recent activity</h2><a class="lnk" href="#activity">Poora log</a></div>
   <ul class="feed">${S.log.slice(0,6).map(l=>`<li><i></i><span>${esc(l.x)}</span><time>${ago(l.t)}</time></li>`).join('')||'<li class="mut">No activity yet</li>'}</ul></section>
  <section class="card"><div class="ch"><h2>Ideas pipeline</h2><a class="lnk" href="#ideas">Board kholein</a></div>
   <div class="stages">${STAGES.map(s=>`<div><b>${S.ideas.filter(i=>i.st===s).length}</b><small>${s}</small></div>`).join('')}</div>
   <ul class="feed">${S.ideas.slice(0,3).map(i=>`<li>${logo(i.p,16)}<span>${esc(i.t)}</span><time>${i.st}</time></li>`).join('')}</ul></section>
 </div>`;
}
const empty=(t,s)=>`<div class="empty"><b>${t}</b><span>${s||''}</span></div>`;
function toolbar(){const u=S.ui,f=filtered();
 return `<div class="tools"><div class="chips"><button class="chip${u.plat==='all'?' on':''}" data-act="plat" data-p="all">All</button>${PL.map(p=>`<button class="chip${u.plat===p?' on':''}" data-act="plat" data-p="${p}">${logo(p,16)}${p}</button>`).join('')}</div>
 <div class="seg" role="tablist" aria-label="View">${[['grid','grid','Cards'],['table','rows','Table'],['board','cols','Board']].map(([v,i,l])=>`<button class="${u.view===v?'on':''}" data-act="view" data-v="${v}" title="${l}">${ic(i)}<span>${l}</span></button>`).join('')}</div></div>
 <div class="filters"><label>Sort<select data-ch="sort">${SORTS.map(([k,l])=>`<option value="${k}"${(u.sort||'recent')===k?' selected':''}>${l}</option>`).join('')}</select></label><label>Niche<select data-ch="niche"><option value="all">All niches</option>${[...new Set(research().filter(a=>u.plat==='all'||a.p===u.plat).map(a=>a.niche).filter(Boolean))].sort().map(n=>`<option value="${esc(n)}"${u.niche===n?' selected':''}>${esc(n)}</option>`).join('')}</select></label>${SEL.size?`<span class="bulk"><b>${SEL.size} selected</b><select data-ch="bulkst" aria-label="Change status of selected"><option value="">Change status</option>${STAT.map(x=>`<option>${x}</option>`).join('')}</select><button class="btn sm danger" data-act="bulkdel">${ic('trash')}<span>Delete</span></button><button class="btn sm" data-act="bulkclear">Clear</button></span>`:''}</div>
 ${u.view!=='board'?`<div class="stabs">${[['all','All']].concat(STAT.map(s=>[s,s])).map(([k,l])=>`<button class="${u.status===k?'on':''}" data-act="st" data-s="${k}">${l}<i>${k==='all'?f.length:f.filter(a=>a.status===k).length}</i></button>`).join('')}</div>`:''}`}
function accCard(a,drag){const d=P[a.p];return `<article class="acard" data-open="${a.id}"${drag?` draggable="true" data-drag="${a.id}"`:''} tabindex="0">
 <div class="ac-top">${av(a,44)}<span class="who"><b>${esc(a.name)}</b><small>${esc(a.handle)}</small></span><span class="grow added" title="Added to portal">${addTxt(a)}</span></div>
 <div class="ac-nums${d.nl?' two':''}"><span><b>${fmt(a.followers)}</b>${d.f}</span>${d.nl?'':`<span><b>${fmt(a.likes)}</b>${d.l}</span>`}<span><b>${fmt(a.uploads)}</b>${d.u}</span></div>
 <div class="ac-foot"><span class="niche">${esc(a.niche||'No niche')}</span><span class="racts">${okLink(a)?`<a class="btn icon sm" href="${esc(a.link)}" target="_blank" rel="noopener noreferrer" aria-label="Open" title="Open on ${a.p}">${ic('ext')}</a>`:''}${stSel(a)}<button class="btn icon sm danger" data-act="del" data-id="${a.id}" aria-label="Delete" title="Delete">${ic('trash')}</button></span></div></article>`}
function vResearch(){
 head('Research','Save accounts and change their status; each record moves to the right list automatically');
 const u=S.ui,f=filtered(),list=f.filter(a=>u.status==='all'||a.status===u.status),nl=!!(P[u.plat]&&P[u.plat].nl),op=true,view=u.view==='table'&&matchMedia('(max-width:820px)').matches?'grid':u.view;let body;
 if(u.view==='board')body=`<div class="board">${STAT.map(s=>{const it=f.filter(a=>a.status===s);return `<div class="lane" data-drop="${s}"><h3><i class="dot s-${s}"></i>${s}<span>${it.length}</span></h3><div class="lcards">${it.map(a=>accCard(a,true)).join('')||'<div class="ldrop">Drop card here</div>'}</div></div>`}).join('')}</div>`;
 else if(!list.length)body=empty('No accounts in this list','Change the filter or add a new account');
 else if(view==='grid')body=`<div class="agrid">${list.map(a=>accCard(a)).join('')}</div>`;
 else body=`<div class="tbl card"><table><thead><tr><th class="ck"><span class="cbx${list.length&&list.every(a=>SEL.has(a.id))?' on':''}" data-act="pickall" role="checkbox" aria-label="Select all" tabindex="0"></span></th><th>Account</th><th class="r">Followers</th>${nl?'':'<th class="r">Likes / views</th>'}<th class="r">Uploads</th>${op?'<th>Open</th>':''}<th>Niche</th><th>Added</th><th>Status</th><th></th></tr></thead><tbody>${list.map(a=>`<tr data-open="${a.id}"${SEL.has(a.id)?' class="picked"':''}><td class="ck"><span class="cbx${SEL.has(a.id)?' on':''}" data-act="pick" data-id="${a.id}" role="checkbox" aria-label="Select" tabindex="0"></span></td><td><span class="tacc">${av(a,36)}<span class="who"><b>${esc(a.name)}</b><small>${esc(a.handle)}</small></span></span></td><td class="r"><b>${fmt(a.followers)}</b></td>${nl?'':`<td class="r">${P[a.p].nl?'<span class="mut">—</span>':fmt(a.likes)}</td>`}<td class="r">${fmt(a.uploads)}</td>${op?`<td>${openBtn(a)}</td>`:''}<td><span class="niche">${esc(a.niche)}</span></td><td class="mut nw">${addTxt(a)}</td><td>${stSel(a)}</td><td class="r"><span class="racts"><button class="btn icon sm" data-act="edit" data-id="${a.id}" aria-label="Edit" title="Edit">${ic('edit')}</button><button class="btn icon sm danger" data-act="del" data-id="${a.id}" aria-label="Delete" title="Delete">${ic('trash')}</button></span></td></tr>`).join('')}</tbody></table></div>`;
 return toolbar()+body;
}
function vMine(){
 head('My accounts','Your own accounts, with competitors and growth');
 const m=mine();
 return `<div class="mgrid">${m.map(a=>{const d=P[a.p];return `<a class="mcard card" href="#acc-${a.id}"><div class="ac-top">${av(a,52)}<span class="who"><b>${esc(a.name)}</b><small>${esc(a.handle)}</small></span>${gtxt(a)}</div><div class="mbig"><b>${fmt(a.followers)}</b><small>${d.f}</small></div>${spark(a,260,56)}<div class="ac-nums"><span><b>${fmt(a.likes)}</b>${d.l}</span><span><b>${fmt(a.uploads)}</b>${d.u}</span><span><b>${a.comps.filter(acc).length}</b>Competitors</span></div></a>`}).join('')}
 <button class="mcard card addcard" data-act="add" data-kind="mine">${ic('plus')}<b>Add new account</b><span>TikTok, YouTube, Facebook, Instagram or Spotify</span></button></div>`;
}
function chart(a){const s=a.snaps||[];if(s.length<2)return empty('No growth data yet','"Stats update" to save the latest numbers and the chart will build');
 const W=640,H=230,pl=52,pr=16,pt=16,pb=28,v=s.map(x=>x.f),mn=Math.min(...v),mx=Math.max(...v),pad=(mx-mn)*.15||mx*.05||1,lo=Math.max(0,mn-pad),hi=mx+pad;
 const x=i=>pl+i*(W-pl-pr)/(s.length-1),y=q=>pt+(hi-q)/(hi-lo)*(H-pt-pb);let g='';
 for(let k=0;k<4;k++){const q=lo+(hi-lo)*k/3;g+=`<line x1="${pl}" x2="${W-pr}" y1="${y(q)}" y2="${y(q)}" stroke="var(--line)"/><text x="${pl-8}" y="${y(q)+4}" text-anchor="end" class="ax">${fmt(Math.round(q))}</text>`}
 const step=Math.ceil(s.length/6);s.forEach((p,i)=>{if(i%step===0||i===s.length-1)g+=`<text x="${x(i)}" y="${H-8}" text-anchor="middle" class="ax">${p.d.slice(5)}</text>`});
 const d=v.map((q,i)=>(i?'L':'M')+x(i).toFixed(1)+','+y(q).toFixed(1)).join('');
 g+=`<path d="${d}L${x(s.length-1)},${H-pb}L${pl},${H-pb}Z" fill="url(#gr)"/><path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`;
 v.forEach((q,i)=>g+=`<circle cx="${x(i)}" cy="${y(q)}" r="${i===v.length-1?5:3}" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"><title>${s[i].d}: ${fmt(q)}</title></circle>`);
 return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Followers growth"><defs><linearGradient id="gr" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".28"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>${g}</svg>`}
function hero(a){const d=P[a.p],x=a.extra||{};
 const nums=[[fmt(a.followers),d.f]].concat(d.nl?[]:[[fmt(a.likes),d.l]]).concat([[fmt(a.uploads),d.u]]).concat(x.following!=null&&x.following!==''&&(a.p!=='TikTok'||x.following)?[[fmt(x.following),'Following']]:[]);
 const sub=[a.handle?esc(a.handle):'',a.p==='Facebook'?esc(x.pageType||'Page'):a.p==='Spotify'?esc(x.showType||'Podcast'):'',x.country?esc(x.country):''].filter(Boolean).join(' · ');
 return `<section class="hero ph card" style="--hu:${a.hue||220}">
 <div class="ph-top">${av(a,96,false)}<div class="ph-id"><span class="ph-plat">${logo(a.p,16)}${a.p}${a.kind==='mine'?' · My account':''}</span><h2>${esc(a.name)}</h2>${sub?`<p class="mut">${sub}</p>`:''}</div></div>
 <div class="ph-nums" style="--n:${nums.length}">${nums.map(([v,l])=>`<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>
 <div class="ptags">${a.kind==='research'?stSel(a):''}${a.niche?`<span class="tag">${esc(a.niche)}</span>`:''}${a.tags.map(t=>`<span class="tag">#${esc(t)}</span>`).join('')}<span class="tag soft">Added ${addTxt(a)}</span></div>
 <div class="ph-acts">${okLink(a)?`<a class="btn primary ph-open" href="${esc(a.link)}" target="_blank" rel="noopener noreferrer">${ic('ext')}Open on ${a.p}</a>`:''}
 <div class="ph-tools"><button class="btn" data-act="stats" data-id="${a.id}" title="Update stats">${ic('refresh')}<span>Stats</span></button>${CONN?`<button class="btn" data-act="doc" data-id="${a.id}" title="${a.docUrl?'Update Google Doc':'Create Google Doc'}">${ic('doc')}<span>${a.docUrl?'Update doc':'Make doc'}</span></button>`:''}${a.docUrl?`<a class="btn" href="${esc(a.docUrl)}" target="_blank" rel="noopener" title="Open Google Doc">${ic('ext')}<span>Doc</span></a>`:''}<button class="btn" data-act="edit" data-id="${a.id}" title="Edit">${ic('edit')}<span>Edit</span></button><button class="btn danger" data-act="del" data-id="${a.id}" title="Delete" aria-label="Delete">${ic('trash')}<span>Delete</span></button></div></div>
 </section>`}
function vids(a){const d=P[a.p],v=a.videos||[],h=a.hue;let list;
 if(!v.length)list=empty(`No ${d.unit} saved`,'Add one below with a title and views');
 else if(a.p==='TikTok')list=`<div class="vg-tt">${v.map((x,i)=>`<div class="vt" style="background:linear-gradient(170deg,hsl(${h+i*32} 48% 42%),hsl(${h+i*32} 45% 12%))"><span class="cap">${esc(x.t)}</span><span class="vv">${ic('play')}${fmt(x.v)}</span><button class="vx" data-act="vdel" data-id="${a.id}" data-i="${i}" aria-label="Remove">${ic('x')}</button></div>`).join('')}</div>`;
 else if(a.p==='YouTube')list=`<div class="vg-yt">${v.map((x,i)=>`<div class="yv"><div class="th" style="background:linear-gradient(135deg,hsl(${h+i*28} 50% 36%),hsl(${h+i*28+40} 55% 58%))">${ic('play')}<button class="vx" data-act="vdel" data-id="${a.id}" data-i="${i}" aria-label="Remove">${ic('x')}</button></div><b>${esc(x.t)}</b><small>${fmt(x.v)} views</small></div>`).join('')}</div>`;
 else list=`<ol class="vlist">${v.map((x,i)=>`<li><span class="n">${i+1}</span><span class="tn" style="background:linear-gradient(135deg,hsl(${h+i*30} 55% 48%),hsl(${h+i*30+50} 55% 30%))"></span><span class="who"><b>${esc(x.t)}</b><small>${fmt(x.v)} ${a.p==='Spotify'?'plays':'reach'}</small></span><button class="btn icon sm" data-act="vdel" data-id="${a.id}" data-i="${i}" aria-label="Remove">${ic('x')}</button></li>`).join('')}</ol>`;
 return `<section class="card"><div class="ch"><h2>${a.p==='Spotify'?'Episodes':a.p==='Facebook'?'Top posts':'Videos'}</h2><span class="mut">${v.length} saved</span></div>${list}
 <form class="inline" data-form="vadd" data-id="${a.id}"><input name="t" placeholder="Title" required aria-label="Title"><input name="v" placeholder="Views, e.g. 120K" aria-label="Views"><input name="url" placeholder="Link (optional)" aria-label="Link"><button class="btn primary">${ic('plus')}Add</button></form></section>`}
function vProfile(id){const a=acc(id);if(!a){head('Account not found','');return empty('This account has been deleted','<a class="lnk" href="#research">Back to Research</a>')}
 head(a.name,`${a.p} · ${a.kind==='mine'?'My account':'Researched account'}`);
 const d=P[a.p],x=a.extra||{},er=a.followers&&x.avgViews?(x.avgViews/a.followers*100).toFixed(1)+'%':'—';
 const facts=[['Added to portal',addTxt(a)],['Account created',a.created||'—'],['Niche',a.niche||'—']].concat(d.extra.map(([k,l,t])=>[l,t==='num'?(x[k]?fmt(x[k]):'—'):esc(x[k]||'—')])).concat(a.p==='Facebook'&&x.following!=null&&x.following!==''?[['Following',fmt(x.following)]]:[]).concat(Array.isArray(x.links)&&x.links.length?[['Other accounts',x.links.map(l=>/^https?:\/\//i.test(l.u)?`<a class="lnk" href="${esc(l.u)}" target="_blank" rel="noopener noreferrer">${esc(l.t||l.u)}</a>`:'').filter(Boolean).join(' · ')]]:[]).concat(x.by?[['Added by',esc(x.by)]]:[]).concat(x.avgViews?[['Views to followers',er]]:[]);
 let comp='';
 if(a.kind==='mine'){const cs=a.comps.map(acc).filter(Boolean),opts=research().filter(r=>!a.comps.includes(r.id));
  comp=`<section class="card"><div class="ch"><h2>Competitors</h2><span class="mut">${cs.length} linked</span></div>
  ${cs.length?`<div class="tbl flat"><table><thead><tr><th>Account</th><th class="r">Followers</th><th class="r">7 days</th><th class="r">Avg views</th><th></th></tr></thead><tbody><tr class="me"><td><span class="tacc">${av(a,32)}<b>${esc(a.name)} (you)</b></span></td><td class="r"><b>${fmt(a.followers)}</b></td><td class="r">${gtxt(a)}</td><td class="r">${x.avgViews?fmt(x.avgViews):'—'}</td><td></td></tr>${cs.map(c=>`<tr data-open="${c.id}"><td><span class="tacc">${av(c,32)}<span class="who"><b>${esc(c.name)}</b><small>${esc(c.handle)}</small></span></span></td><td class="r">${fmt(c.followers)}</td><td class="r">${gtxt(c)}</td><td class="r">${c.extra&&c.extra.avgViews?fmt(c.extra.avgViews):'—'}</td><td class="r"><button class="btn icon sm" data-act="unlink" data-id="${a.id}" data-c="${c.id}" aria-label="Unlink">${ic('x')}</button></td></tr>`).join('')}</tbody></table></div>`:empty('No competitors linked','Pick a researched account below to link it')}
  ${opts.length?`<form class="inline" data-form="link" data-id="${a.id}"><select name="c" aria-label="Competitor">${opts.map(o=>`<option value="${o.id}">${esc(o.name)} · ${o.p} · ${fmt(o.followers)}</option>`).join('')}</select><button class="btn primary">${ic('link')}Link competitor</button></form>`:''}</section>`}
 else{const by=mine().filter(m=>m.comps.includes(a.id));comp=`<section class="card"><div class="ch"><h2>Status history</h2></div><ul class="feed">${(a.hist||[]).slice().reverse().map(h=>`<li><i class="s-${h.s}"></i><span>${h.s}</span><time>${h.d}</time></li>`).join('')}</ul>${by.length?`<p class="mut sm">Competitor of: ${by.map(m=>`<a class="lnk" href="#acc-${m.id}">${esc(m.name)} (${m.p})</a>`).join(', ')}</p>`:''}</section>`}
 return `<a class="back" href="#${a.kind==='mine'?'mine':'research'}">${ic('back')}${a.kind==='mine'?'My accounts':'Research'}</a>${hero(a)}
 <div class="pcols"><div class="pmain">${vids(a)}<section class="card"><div class="ch"><h2>Followers growth</h2><span class="mut">${(a.snaps||[]).length} snapshots</span></div>${chart(a)}</section>${comp}</div>
 <div class="pside"><section class="card"><div class="ch"><h2>Details</h2></div><dl class="facts">${facts.map(([k,v])=>`<div><dt>${k}</dt><dd>${typeof v==='string'&&v.startsWith('<a')?v:esc(v)}</dd></div>`).join('')}</dl></section>
 <section class="card"><div class="ch"><h2>Notes</h2><span class="mut" id="nsaved"></span></div><textarea class="notes" data-in="notes" data-id="${a.id}" placeholder="Write your research on this account: hooks, format, posting time...">${esc(a.notes)}</textarea></section></div></div>`;
}
function vIdeas(){head('Ideas pipeline','From idea to posted: drag a card or change its stage');
 return `<form class="inline card" data-form="idea"><input name="t" placeholder="Write a new idea" required aria-label="Idea"><select name="p" aria-label="Platform">${PL.map(p=>`<option>${p}</option>`).join('')}</select><input name="n" placeholder="Note (optional)" aria-label="Note"><button class="btn primary">${ic('plus')}Add idea</button></form>
 <div class="board">${STAGES.map(s=>{const it=S.ideas.filter(i=>i.st===s);return `<div class="lane" data-dropi="${s}"><h3>${s}<span>${it.length}</span></h3><div class="lcards">${it.map(i=>`<article class="icard" draggable="true" data-dragi="${i.id}"><div class="it">${logo(i.p,18)}<b>${esc(i.t)}</b></div>${i.n?`<p>${esc(i.n)}</p>`:''}<div class="ac-foot"><select data-ch="stage" data-id="${i.id}" aria-label="Stage">${STAGES.map(x=>`<option${x===s?' selected':''}>${x}</option>`).join('')}</select><button class="btn icon sm" data-act="idel" data-id="${i.id}" aria-label="Delete">${ic('trash')}</button></div></article>`).join('')||'<div class="ldrop">Drop card here</div>'}</div></div>`}).join('')}</div>`}
/* ---------- extension bridge + bulk import ---------- */
const extCb={};let extN=0;const hasExt=()=>!!document.documentElement.dataset.icsExt;
function extSend(msg){return new Promise(res=>{if(!hasExt()){res({ok:false,error:'noext'});return}const id=++extN;extCb[id]=res;window.postMessage({icsTo:'ext',id,msg},'*');setTimeout(()=>{if(extCb[id]){delete extCb[id];res({ok:false,error:'timeout'})}},4000)})}
window.addEventListener('message',e=>{if(e.source!==window||!e.data||e.data.icsFrom!=='ext')return;const d=e.data;if(d.re){const f=extCb[d.re];if(f){delete extCb[d.re];f(d.resp)}return}const m=d.event||{};
 if(m.type==='ready'){if(CONN)extSend({type:'session',token:CONN.token});if(route()==='import')render()}
 else if(m.type==='reload'){if(CONN&&syncState==='ok'&&!$('#login')&&!IMP.busy)boot().then(()=>toast('Updated from the ICS extension'))}
 else if(m.type==='upsert'){const o=m.account;if(!CONN||!o||!o.id||$('#login'))return;const k=S.accounts.findIndex(x=>x.id===o.id);if(k>=0)S.accounts[k]=o;else S.accounts.unshift(o);SYNCED.a[o.id]=JSON.stringify(o);try{localStorage.setItem(KEY,JSON.stringify(S))}catch(x){}render();toast((m.isNew?'Added: ':'Updated: ')+o.name)}
 else if(m.type==='bulkprogress')impProgress(m.job)});
const IMP={text:'',items:[],busy:false,niche:'',status:'New',mode:''};
const IMPL={ready:'Ready',dup:'Already saved',wait:'Waiting',work:'Reading...',saved:'Saved',updated:'Updated',skip:'Skipped'};
function impScan(){const have=new Set(S.accounts.map(a=>String(a.link||'').replace(/\/$/,'').toLowerCase()));IMP.items=icsParseLinks(IMP.text).map(x=>Object.assign(x,{st:!x.ok?'bad':have.has(x.url.replace(/\/$/,'').toLowerCase())?'dup':'ready'}))}
function impProgress(job){if(!job||IMP.mode!=='ext')return;const by={};job.items.forEach(i=>by[i.url]=i);IMP.items.forEach(x=>{const j=by[x.url];if(j){x.st=j.st;x.err=j.err||'';if(j.name)x.name=j.name}});
 if(!job.running&&IMP.busy){IMP.busy=false;impDone(job.error)}if(route()==='import')render()}
function impDone(err){const n=IMP.items.filter(x=>x.st==='saved'||x.st==='updated').length,f=IMP.items.filter(x=>x.st==='fail').length;toast(err||`${n} saved${f?', '+f+' could not be read':''}`);if(CONN)boot()}
async function impRun(){if(IMP.busy)return;const n=$('#impniche'),st=$('#impstatus');if(n)IMP.niche=n.value.trim();if(st)IMP.status=st.value;const todo=IMP.items.filter(x=>x.st==='ready');if(!todo.length){toast('Nothing new to save');return}
 if(ROLE==='viewer'){toast('View-only login cannot save');return}
 if(hasExt()){const r=await extSend({type:'bulk',links:todo.map(x=>x.url),niche:IMP.niche,status:IMP.status});if(r&&r.ok){IMP.mode='ext';IMP.busy=true;todo.forEach(x=>x.st='wait');render();return}if(r&&r.error==='busy'){toast('The extension is already importing. Please wait');return}}
 IMP.mode='server';IMP.busy=true;
 for(const x of todo){x.st='work';if(route()==='import')render();
  try{const j=await api({action:'fetch',url:x.url}),i=j.info||{};if(!i.name&&!i.followers)throw new Error('Could not read this profile');i.platform=x.platform;i.link=x.url;i.niche=IMP.niche;i.status=IMP.status;x.st=autoSave(i,'bulk')?'saved':'updated';x.name=i.name}
  catch(e){x.st='fail';x.err=e.message==='readonly'?'View-only login':String(e.message||e).slice(0,120)}}
 IMP.busy=false;IMP.mode='';render();const ok=IMP.items.filter(x=>x.st==='saved'||x.st==='updated').length,f=IMP.items.filter(x=>x.st==='fail').length;toast(`${ok} saved${f?', '+f+' could not be read':''}`)}
function vImport(){head('Import links','Paste many links at once. Each one is sorted to its platform and saved with its details');
 const it=IMP.items,ready=it.filter(x=>x.st==='ready').length,done=it.filter(x=>['saved','updated','fail','skip'].includes(x.st)).length,run=it.filter(x=>!['ready','dup','bad'].includes(x.st)).length,ext=hasExt();
 return `<section class="card imp"><div class="ch"><h2>Paste your links</h2><span class="rolep ${ext?'r-on':'r-off'}">${ext?'ICS extension connected':'Extension not found'}</span></div>
 <p class="mut sm">Tip: in Chrome, save profiles with Ctrl+D, open the bookmark manager with Ctrl+Shift+O, select the bookmarks, copy them and paste here. Any text works, only the links are used.</p>
 <textarea class="code" id="imptext" placeholder="https://www.tiktok.com/@name&#10;https://www.youtube.com/@channel&#10;https://www.instagram.com/name/"${IMP.busy?' readonly':''}>${esc(IMP.text)}</textarea>
 <div class="improw"><label>Niche (optional)<input id="impniche" value="${esc(IMP.niche)}" placeholder="e.g. AI tools"></label><label>Status<select id="impstatus">${STAT.map(x=>`<option${x===IMP.status?' selected':''}>${x}</option>`).join('')}</select></label>
 <div class="pacts"><button class="btn" data-act="impscan"${IMP.busy?' disabled':''}>${ic('search')}Check links</button>${IMP.busy&&IMP.mode==='ext'?`<button class="btn danger" data-act="impstop">Stop</button>`:`<button class="btn primary" data-act="imprun"${!ready||IMP.busy?' disabled':''}>${ic('plus')}Save ${ready||''} account${ready===1?'':'s'}</button>`}${it.length&&!IMP.busy?`<button class="btn" data-act="impclear">Clear</button>`:''}</div></div>
 <p class="mut sm">${ext?'The extension opens each link in a background tab, reads the picture, name, numbers and top videos, saves it and closes the tab. Keep Chrome open until it finishes.':'Without the ICS Chrome extension only YouTube and Spotify get full details here. TikTok, Facebook and Instagram block automatic reading, so they are saved with the name only. Install the extension for full details on every platform.'}</p>
 ${run?`<div class="impbar"><i style="width:${run?done/run*100:0}%"></i></div><p class="mut sm">${done} of ${run} done</p>`:''}</section>
 ${it.length?`<section class="card"><div class="ch"><h2>${it.length} link${it.length===1?'':'s'} found</h2><div class="chips">${PL.map(p=>{const c=it.filter(x=>x.platform===p).length;return c?`<span class="chip on">${logo(p,16)}${p} <b>${c}</b></span>`:''}).join('')}${it.filter(x=>!x.platform).length?`<span class="chip">Other <b>${it.filter(x=>!x.platform).length}</b></span>`:''}</div></div>
 <ul class="implist">${it.map(x=>`<li class="i-${x.st}">${x.platform?logo(x.platform,20):'<span class="plogo none"></span>'}<span class="iu"><b>${esc(x.name||x.url.replace(/^https?:\/\/(www\.)?/,''))}</b>${x.name?`<small>${esc(x.url.replace(/^https?:\/\/(www\.)?/,''))}</small>`:''}</span><span class="ist">${esc(x.st==='bad'?x.why:x.st==='fail'?(x.err||'Could not read'):IMPL[x.st]||x.st)}</span></li>`).join('')}</ul></section>`:''}`}
function vActivity(){head('Activity','A record of every change');return `<section class="card"><ul class="feed big">${S.log.map(l=>`<li><i></i><span>${esc(l.x)}</span><time>${ago(l.t)}</time></li>`).join('')||'<li class="mut">No activity yet</li>'}</ul></section>`}
function csv(){const h=['kind','platform','name','handle','link','niche','tags','followers','likes','uploads','created','status','notes'];const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return [h.join(',')].concat(S.accounts.map(a=>[a.kind,a.p,a.name,a.handle,a.link,a.niche,a.tags.join(' '),a.followers,a.likes,a.uploads,a.created,a.status,a.notes].map(q).join(','))).join('\n')}
const autoT=t=>{const d=new Date(t);return isNaN(d)?'':d.toLocaleString(undefined,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})};
function autoYt(){if(!AUTO.yt)return AUTO.on?'First run is tomorrow morning':'Not running yet';const [t,ok,fail,n]=AUTO.yt.split('|');return `Last run ${autoT(t)}: ${ok} of ${n} channels refreshed${+fail?', '+fail+' could not be read':''}`}
function vSettings(){head('Settings','Theme, backup and data');const t=S.ui.theme;
 return `<div class="cols"><section class="card span2 conn"><div class="ch"><h2>Account and Google Sheet</h2>${syncHtml()}</div><p class="mut sm">Login: <b>${esc(CONN?CONN.user:'')}</b> <span class="rolep r-${ROLE}">${ROLE==='admin'?'Admin':ROLE==='viewer'?'View only':'Editor'}</span>. All your data is saved in Google Sheets, and any account profile can create a Google Doc.</p><div class="pacts">${sheetUrl?`<a class="btn primary" href="${esc(sheetUrl)}" target="_blank" rel="noopener">${ic('ext')}Open Google Sheet</a>`:''}<button class="btn" data-act="resync">${ic('refresh')}Reload from Sheet</button><button class="btn danger" data-act="logout">Logout</button></div></section>
 <section class="card"><div class="ch"><h2>Change password</h2></div><form class="fg" data-form="pass"><label class="w2">Current password<input name="o" type="password" required autocomplete="current-password"></label><label class="w2">New password (at least 8 characters)<input name="n" type="password" required minlength="8" autocomplete="new-password"></label><div class="w2"><button class="btn primary">Save password</button></div></form></section><section class="card"><div class="ch"><h2>Theme</h2></div><div class="seg wide">${[['system','System'],['light','Light'],['dark','Dark']].map(([k,l])=>`<button class="${t===k?'on':''}" data-act="settheme" data-t="${k}">${l}</button>`).join('')}</div><p class="mut sm">System follows your phone or computer setting.</p></section>
 ${ROLE==='admin'?`<section class="card span2"><div class="ch"><h2>Team logins</h2><span class="mut sm">${TEAM.length} of 20</span></div><p class="mut sm">Give each person their own login. Editors can add and change accounts. View only can look but not change anything. Every account shows who added it.</p><ul class="team">${TEAM.map(u=>`<li><span class="tav">${esc(u.user.slice(0,1).toUpperCase())}</span><b>${esc(u.user)}</b><span class="rolep r-${esc(u.role)}">${u.role==='viewer'?'View only':'Editor'}</span><button class="btn sm danger" data-act="teamdel" data-u="${esc(u.user)}">Remove</button></li>`).join('')||'<li class="mut">No team members yet. Only you can log in.</li>'}</ul><form class="inline" data-form="team"><input name="user" placeholder="Username" required pattern="[A-Za-z0-9._\-]{3,24}" title="3 to 24 letters, numbers, dot, dash or underscore" aria-label="Username" autocomplete="off"><input name="pass" type="text" placeholder="Password (8+ characters)" required minlength="8" aria-label="Password" autocomplete="off"><select name="role" aria-label="Role"><option value="editor">Editor</option><option value="viewer">View only</option></select><button class="btn primary">${ic('plus')}Add member</button></form></section>`:''}
 <section class="card span2"><div class="ch"><h2>Automation</h2><span class="rolep ${AUTO.on?'r-on':'r-off'}">${AUTO.on?'On':'Off'}</span></div><div class="autos"><div><b>YouTube daily update</b><span class="mut sm">${autoYt()}</span></div><div><b>Weekly Sheet backup</b><span class="mut sm">${AUTO.backup?'Last backup '+autoT(AUTO.backup):AUTO.on?'First backup runs on Sunday':'Not running yet'}</span></div></div><p class="mut sm">${AUTO.on?'Subscribers, videos and views of every saved YouTube channel refresh each morning, and a copy of your Sheet is saved to Google Drive every Sunday (last 8 copies kept). TikTok and Facebook block automatic reading, so refresh those with the ICS Chrome extension.':'To switch it on, open the backend script in Google Apps Script, choose installTriggers and press Run once.'}</p></section>
 
 <section class="card span2"><div class="ch"><h2>CSV export</h2><button class="btn sm" data-act="copy" data-t="csvbox">${ic('copy')}Copy</button></div><textarea class="code" id="csvbox" readonly>${esc(csv())}</textarea><p class="mut sm">Copy this text and paste it into Excel or Google Sheets.</p></section>
 <section class="card span2"><div class="ch"><h2>Save any profile in one click</h2></div><p class="mut"><b>Best: ICS Chrome extension.</b> It shows the ICS logo in your toolbar, saves with no extra window, and also grabs the top videos. Install it once from the <code>chrome-extension</code> folder (Chrome &gt; Extensions &gt; Developer mode &gt; Load unpacked), then log in with your portal login.</p><p class="mut"><b>Alternative: bookmark button.</b></p><p class="mut">Drag this button to your Chrome bookmarks bar (press Ctrl+Shift+B if the bar is hidden). Then open any TikTok, YouTube, Facebook or Spotify profile and press it: the picture, name and stats are read from the page and sent to this portal.</p><div class="pacts"><a class="btn primary bmk" draggable="true" href="${esc('javascript:'+encodeURIComponent((window.ICS_BM||'').replace('__PORTAL__',location.origin+location.pathname)))}" title="Drag me to the bookmarks bar">⚡ ICS Portal</a><span class="mut sm">Drag it, do not click it here.</span></div></section>
 <section class="card span2"><div class="ch"><h2>Backup and restore</h2><button class="btn sm" data-act="copy" data-t="jsonbox">${ic('copy')}Copy backup</button></div><textarea class="code" id="jsonbox" placeholder="Paste a backup here and press Restore">${esc(JSON.stringify({accounts:S.accounts,ideas:S.ideas}))}</textarea><div class="pacts"><button class="btn primary" data-act="restore">Restore from text</button></div></section></div>`}

/* ---------- modal forms ---------- */
function openModal(html){$('#modal').innerHTML=html;$('#modal').hidden=false;$('#scrim').hidden=false;const f=$('#modal input,#modal select,#modal button');f&&f.focus()}
function closeModal(){$('#modal').hidden=true;$('#scrim').hidden=true}
function extraFields(p,x){return P[p].extra.map(([k,l,t,o])=>`<label>${l}${t==='sel'?`<select name="x_${k}">${o.map(v=>`<option${x[k]===v?' selected':''}>${v}</option>`).join('')}</select>`:t==='txt'?`<input name="x_${k}" value="${esc(x[k]||'')}">`:`<input name="x_${k}" value="${x[k]?fmt(x[k]):''}" placeholder="e.g. 45K">`}</label>`).join('')}
function formAcc(a,kind){const e=!!a;a=a||{p:S.ui.plat!=='all'?S.ui.plat:'TikTok',kind:kind||'research',name:'',handle:'',link:'',niche:'',tags:[],followers:'',likes:'',uploads:'',created:'',status:'New',notes:'',extra:{}};const d=P[a.p];
 openModal(`<form data-form="acc" data-id="${e?a.id:''}"><div class="mh"><h2>${e?'Edit account':'New account'}</h2><button type="button" class="btn icon" data-act="close" aria-label="Close">${ic('x')}</button></div>
 <div class="mb"><div class="pick" role="radiogroup" aria-label="Platform">${PL.map(p=>`<label class="${a.p===p?'on':''}"><input type="radio" name="p" value="${p}"${a.p===p?' checked':''} data-ch="fplat">${logo(p,28)}<span>${p}</span></label>`).join('')}</div>
 <div class="seg wide two">${[['research','Researched account'],['mine','My own account']].map(([k,l])=>`<label class="${a.kind===k?'on':''}"><input type="radio" name="kind" value="${k}"${a.kind===k?' checked':''} data-ch="fkind">${l}</label>`).join('')}</div>
 <div class="fg"><label class="w2">Name<input name="name" value="${esc(a.name)}" required placeholder="Account or channel name"></label><label>Handle<input name="handle" value="${esc(a.handle)}" placeholder="@username"></label><label class="w2 fetchrow">Profile link<span class="fetchbox"><input name="link" type="url" value="${esc(a.link)}" placeholder="Paste a TikTok, YouTube, Facebook or Spotify profile link"><button type="button" class="btn primary" data-act="fetchinfo">Fetch info</button></span><input type="hidden" name="avatar" value="${esc((a.extra||{}).avatar||'')}"><small id="fmsg" class="fmsg"></small></label>
 <label>Niche<input name="niche" value="${esc(a.niche)}" placeholder="e.g. AI tools"></label><label>Tags<input name="tags" value="${esc(a.tags.join(', '))}" placeholder="faceless, hooks"></label>
 <label><span id="lf">${d.f}</span><input name="followers" value="${a.followers?fmt(a.followers):''}" placeholder="e.g. 12.5K"></label><label><span id="ll">${d.l}</span><input name="likes" value="${a.likes?fmt(a.likes):''}" placeholder="e.g. 1.2M"></label>
 <label><span id="lu">${d.u}</span><input name="uploads" value="${a.uploads||''}" placeholder="e.g. 86"></label><label>Account creation date<input name="created" type="date" value="${esc(a.created)}"></label>
 <div class="w2 fx" id="fx">${extraFields(a.p,a.extra||{})}</div>
 <label id="fst"${a.kind==='mine'?' hidden':''}>Status<select name="status">${STAT.map(s=>`<option${s===a.status?' selected':''}>${s}</option>`).join('')}</select></label>
 <label class="w2">Notes<textarea name="notes" rows="3" placeholder="Why you saved it, what you liked">${esc(a.notes)}</textarea></label></div></div>
 <div class="mf"><button type="button" class="btn" data-act="close">Cancel</button><button class="btn primary">${e?'Save changes':'Save account'}</button></div></form>`)}
function formStats(a){const d=P[a.p];openModal(`<form data-form="stats" data-id="${a.id}"><div class="mh"><h2>Stats update</h2><button type="button" class="btn icon" data-act="close" aria-label="Close">${ic('x')}</button></div><div class="mb"><p class="mut sm">Enter today's numbers. Each update creates a snapshot that builds the growth chart.</p><div class="fg"><label>${d.f}<input name="followers" value="${fmt(a.followers)}" required></label><label>${d.l}<input name="likes" value="${fmt(a.likes)}"></label><label>${d.u}<input name="uploads" value="${a.uploads}"></label></div></div><div class="mf"><button type="button" class="btn" data-act="close">Cancel</button><button class="btn primary">Save snapshot</button></div></form>`)}
function confirmBox(msg,yes,fn){openModal(`<div class="mh"><h2>Confirm</h2></div><div class="mb"><p>${msg}</p></div><div class="mf"><button class="btn" data-act="close">Cancel</button><button class="btn danger" id="cyes">${yes}</button></div>`);$('#cyes').onclick=()=>{closeModal();fn()}}

/* ---------- actions ---------- */
function setStatus(id,s){const a=acc(id);if(!a||a.status===s)return;a.status=s;(a.hist=a.hist||[]).push({d:today(),s});log(`${a.name} status changed to ${s}`);save();render();toast(`${a.name} is now in ${s}`)}
const A={
 add:el=>formAcc(null,el.dataset.kind),edit:el=>formAcc(acc(el.dataset.id)),close:closeModal,stats:el=>formStats(acc(el.dataset.id)),
 theme(){S.ui.theme=isDark()?'light':'dark';applyTheme();save();if(route()==='settings')render()},
 settheme(el){S.ui.theme=el.dataset.t;applyTheme();save();render()},
 plat(el){const u=S.ui;u.plat=el.dataset.p;if(u.niche&&u.niche!=='all'&&!research().some(a=>(u.plat==='all'||a.p===u.plat)&&a.niche===u.niche))u.niche='all';if(u.status!=='all'&&!research().some(a=>(u.plat==='all'||a.p===u.plat)&&a.status===u.status))u.status='all';SEL.clear();save();render()},st(el){S.ui.status=el.dataset.s;save();render()},view(el){S.ui.view=el.dataset.v;save();render()},
 gost(el){S.ui.status=el.dataset.s;S.ui.plat='all';if(S.ui.view==='board')S.ui.view='grid';save()},goplat(el){S.ui.plat=el.dataset.p;S.ui.status='all';save()},
 fill(f,i){const m=$('#fmsg');
   if(i.platform&&P[i.platform]){const r=f.querySelector(`input[name="p"][value="${i.platform}"]`);if(r&&!r.checked){r.checked=true;C.fplat(r)}}
   const set=(n,v)=>{if(v!==undefined&&v!==null&&v!==''&&v!==0&&f[n])f[n].value=v};
   set('name',i.name);set('handle',i.handle);set('followers',i.followers?fmt(i.followers):'');set('likes',i.likes?fmt(i.likes):'');set('uploads',i.uploads);set('created',i.created);
   if(i.avatar)f.avatar.value=i.avatar;if(i.link)f.link.value=i.link;
   if(i.following&&f.x_following)f.x_following.value=i.following;
   const got=['name','followers','likes','uploads','created','avatar'].filter(k=>i[k]).length;
   m.innerHTML=got?`${i.avatar?`<img src="${esc(i.avatar)}" alt="" referrerpolicy="no-referrer">`:''}Fetched ${got} fields. Check and save.`:'Could not read this profile. Fill the fields manually, or use the ICS Portal browser button (Settings).';},
 async fetchinfo(el){const f=el.closest('form'),li=f.link.value.trim(),m=$('#fmsg');if(!li){m.textContent='Paste a profile link first';return}
  el.disabled=true;el.textContent='Fetching...';m.textContent='';
  try{const j=await api({action:'fetch',url:li}),i=j.info||{};
   A.fill(f,i);
  }catch(e){m.textContent='Fetch failed: '+e.message}
  el.disabled=false;el.textContent='Fetch info'},
 pick(el){const id=el.dataset.id;SEL.has(id)?SEL.delete(id):SEL.add(id);render()},
 pickall(){const u=S.ui,l=filtered().filter(a=>u.status==='all'||a.status===u.status);if(l.every(a=>SEL.has(a.id)))l.forEach(a=>SEL.delete(a.id));else l.forEach(a=>SEL.add(a.id));render()},
 bulkclear(){SEL.clear();render()},
 bulkdel(){const ids=[...SEL].filter(id=>acc(id));if(!ids.length)return;confirmBox(`<b>${ids.length} account${ids.length>1?'s':''}</b> and their full records will be deleted.`,'Delete',()=>{S.accounts=S.accounts.filter(x=>!SEL.has(x.id));S.accounts.forEach(x=>x.comps=(x.comps||[]).filter(c=>!SEL.has(c)));log(`${ids.length} accounts deleted`);SEL.clear();save();render();toast(`${ids.length} deleted`)})},
 del(el){const a=acc(el.dataset.id);confirmBox(`<b>${esc(a.name)}</b> and its full record will be deleted.`,'Delete',()=>{S.accounts=S.accounts.filter(x=>x.id!==a.id);S.accounts.forEach(x=>x.comps=(x.comps||[]).filter(c=>c!==a.id));SEL.delete(a.id);log(`${a.name} deleted`);save();const to=a.kind==='mine'?'mine':'research';if(route()===to)render();else location.hash=to;toast('Account deleted')})},
 unlink(el){const a=acc(el.dataset.id);a.comps=a.comps.filter(c=>c!==el.dataset.c);save();render()},
 vdel(el){const a=acc(el.dataset.id);a.videos.splice(+el.dataset.i,1);save();render()},
 impscan(){const t=$('#imptext');if(t)IMP.text=t.value;impScan();render();if(!IMP.items.length)toast('No links found in that text')},
 imprun(){impRun()},
 impstop(){extSend({type:'bulkstop'});toast('Stopping after the current link')},
 impclear(){IMP.text='';IMP.items=[];render()},
 idel(el){S.ideas=S.ideas.filter(i=>i.id!==el.dataset.id);save();render()},
 async doc(el){const a=acc(el.dataset.id);el.disabled=true;el.lastChild.textContent=' Creating Doc...';try{if(syncState!=='ok')await pushSync();const r=await api({action:'doc',account:a});a.docUrl=r.docUrl;SYNCED.a[a.id]=JSON.stringify(a);try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}log(`${a.name} Google Doc updated`);save();render();toast('Google Doc is ready');}catch(e){el.disabled=false;toast('Doc failed: '+e.message)}},
 async resync(){await boot(true)},
 teamdel(el){const u=el.dataset.u;confirmBox(`${esc(u)} will be logged out and can no longer open the portal. Accounts they added stay saved.`,'Remove',async()=>{try{const j=await api({action:'team',op:'remove',user:u});TEAM=j.team||[];render();toast(u+' removed')}catch(e){toast('Could not remove member')}})},
 logout(){confirmBox('You will be logged out on this device. Your data stays safe in Google Sheets.','Logout',async()=>{try{if(syncState!=='ok')await pushSync();await api({action:'logout'})}catch(e){}extSend({type:'session',token:''});CONN=null;try{localStorage.removeItem(CK);localStorage.removeItem(KEY)}catch(e){}S=blank();showLogin()})},
 copy(el){const t=$('#'+el.dataset.t);const done=()=>toast('Copied');try{navigator.clipboard.writeText(t.value).then(done,()=>{t.select();toast('Text selected, copy it now')})}catch(e){t.select();toast('Text selected, copy it now')}},
 restore(){try{const d=JSON.parse($('#jsonbox').value);if(!Array.isArray(d.accounts))throw 0;S.accounts=d.accounts;S.ideas=d.ideas||[];log('Backup restored');save();render();toast('Backup restored')}catch(e){toast('This backup text is not valid')}}
};
const F={
 acc(f,fd){const id=f.dataset.id,p=fd.get('p'),o=id?acc(id):{id:uid(),videos:[],comps:[],hist:[],snaps:[],hue:Math.floor(Math.random()*360)};
  const x=Object.assign({},o.extra||{});P[p].extra.forEach(([k,l,t])=>{delete x[k];const v=fd.get('x_'+k);if(v)x[k]=t==='num'?num(v):v});const avu=fd.get('avatar');if(avu)x.avatar=avu;if(!id)x.at=Date.now();
  const was=o.status;Object.assign(o,{p,kind:fd.get('kind'),name:fd.get('name').trim(),handle:fd.get('handle').trim(),link:fd.get('link').trim(),niche:fd.get('niche').trim(),tags:fd.get('tags').split(/[,\s]+/).map(t=>t.replace(/^#/,'').trim()).filter(Boolean),followers:num(fd.get('followers')),likes:num(fd.get('likes')),uploads:num(fd.get('uploads')),created:fd.get('created'),notes:fd.get('notes'),extra:x});
  o.status=o.kind==='mine'?'':(fd.get('status')||'New');if(o.kind==='research'&&o.status!==was)o.hist.push({d:today(),s:o.status});
  const last=o.snaps[o.snaps.length-1];if(!last||last.f!==o.followers){if(last&&last.d===today())last.f=o.followers;else o.snaps.push({d:today(),f:o.followers})}
  if(!id){S.accounts.unshift(o);log(`${o.name} added (${p})`)}else log(`${o.name} updated`);save();closeModal();
  if(!id&&o.kind==='research'){S.ui.status='all';S.ui.plat='all';S.ui.q='';$('#q').value='';save()}
  if(!id)location.hash=o.kind==='mine'?'mine':'research';render();toast(id?'Changes saved':`${o.name} saved`)},
 stats(f,fd){const a=acc(f.dataset.id);a.followers=num(fd.get('followers'));a.likes=num(fd.get('likes'));a.uploads=num(fd.get('uploads'));const l=a.snaps[a.snaps.length-1];if(l&&l.d===today())l.f=a.followers;else a.snaps.push({d:today(),f:a.followers});log(`${a.name} stats updated`);save();closeModal();render();toast('Snapshot saved')},
 vadd(f,fd){const a=acc(f.dataset.id);a.videos.unshift({t:fd.get('t').trim(),v:num(fd.get('v')),url:fd.get('url').trim()});save();render();toast('Saved')},
 link(f,fd){const a=acc(f.dataset.id),c=acc(fd.get('c'));a.comps.push(c.id);log(`${c.name} set as a competitor of ${a.name}`);save();render();toast(`${c.name} linked`)},
 async team(f,fd){const b=f.querySelector('button');b.disabled=true;try{const j=await api({action:'team',op:'add',user:fd.get('user'),pass:fd.get('pass'),role:fd.get('role')});TEAM=j.team||[];render();toast('Member added. Share the username and password with them.')}catch(e){b.disabled=false;toast({badname:'Username must be 3 to 24 letters or numbers',short:'Password must be at least 8 characters',exists:'That username is already taken',full:'Team is full (20 members)',forbidden:'Only the admin can manage the team'}[e.message]||'Could not add member')}},
 async pass(f,fd){const b=f.querySelector('button');b.disabled=true;try{await api({action:'password',oldPass:fd.get('o'),newPass:fd.get('n')});f.reset();toast('Password changed. Other devices were logged out.')}catch(e){toast(e.message==='badpass'?'Current password is wrong':e.message==='short'?'Password must be at least 8 characters':'Password not changed')}b.disabled=false},
 idea(f,fd){S.ideas.unshift({id:uid(),t:fd.get('t').trim(),p:fd.get('p'),n:fd.get('n').trim(),st:'Idea'});log('New idea added');save();render();toast('Idea added')}
};
const C={
 status:el=>setStatus(el.dataset.id,el.value),
 sort(el){S.ui.sort=el.value;save();render()},
 niche(el){S.ui.niche=el.value;save();render()},
 bulkst(el){const st=el.value;if(!st)return;let n=0;[...SEL].forEach(id=>{const a=acc(id);if(a&&a.kind==='research'&&a.status!==st){a.status=st;(a.hist=a.hist||[]).push({d:today(),s:st});n++}});log(`${n} accounts moved to ${st}`);SEL.clear();save();render();toast(`${n} moved to ${st}`)},
 stage(el){const i=S.ideas.find(x=>x.id===el.dataset.id);i.st=el.value;log(`"${i.t}" is now in ${i.st}`);save();render()},
 fplat(el){const p=el.value,d=P[p];$$('.pick label').forEach(l=>l.classList.toggle('on',l.contains(el)));$('#lf').textContent=d.f;$('#ll').textContent=d.l;$('#lu').textContent=d.u;$('#fx').innerHTML=extraFields(p,{})},
 fkind(el){$$('.seg.two label').forEach(l=>l.classList.toggle('on',l.contains(el)));$('#fst').hidden=el.value==='mine'}
};
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-act]');if(b){if(b.tagName!=='A')e.preventDefault();e.stopPropagation();A[b.dataset.act](b);return}
 if(e.target.closest('select,input,textarea,button,a,form'))return;
 const o=e.target.closest('[data-open]');if(o)location.hash='acc-'+o.dataset.open;
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if(e.key==='Enter'&&e.target.matches('[data-open]'))location.hash='acc-'+e.target.dataset.open});
document.addEventListener('input',e=>{if(e.target.id==='imptext')IMP.text=e.target.value;else if(e.target.id==='impniche')IMP.niche=e.target.value});
document.addEventListener('change',e=>{if(e.target.id==='impstatus'){IMP.status=e.target.value;return}const c=e.target.dataset.ch;if(c)C[c](e.target)});
document.addEventListener('submit',e=>{const f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();F[f.dataset.form](f,new FormData(f))});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='q'){S.ui.q=t.value;if(route()!=='research'){location.hash='research'}else{const v=$('#view');v.innerHTML=vResearch();}return}
 if(t.dataset.in==='notes'){const a=acc(t.dataset.id);a.notes=t.value;save();const n=$('#nsaved');if(n){n.textContent='Saved';clearTimeout(n._);n._=setTimeout(()=>n.textContent='',1200)}}});
let dragId=null,dragKind=null;
document.addEventListener('dragstart',e=>{const c=e.target.closest('[data-drag],[data-dragi]');if(!c)return;dragKind=c.dataset.drag?'a':'i';dragId=c.dataset.drag||c.dataset.dragi;e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',dragId)}catch(_){}c.classList.add('dragging')});
document.addEventListener('dragend',()=>{$$('.dragging').forEach(x=>x.classList.remove('dragging'));$$('.lane.over').forEach(x=>x.classList.remove('over'))});
document.addEventListener('dragover',e=>{const l=e.target.closest(dragKind==='a'?'[data-drop]':'[data-dropi]');if(!l||!dragId)return;e.preventDefault();$$('.lane.over').forEach(x=>x!==l&&x.classList.remove('over'));l.classList.add('over')});
document.addEventListener('drop',e=>{const l=e.target.closest(dragKind==='a'?'[data-drop]':'[data-dropi]');if(!l||!dragId)return;e.preventDefault();if(dragKind==='a')setStatus(dragId,l.dataset.drop);else{const i=S.ideas.find(x=>x.id===dragId);if(i&&i.st!==l.dataset.dropi){i.st=l.dataset.dropi;log(`"${i.t}" is now in ${i.st}`);save();render()}}dragId=null});

/* ---------- router ---------- */
function route(){const h=location.hash.slice(1)||'home';return h}
function render(){const h=route(),v=$('#view');let html,nav=h;
 if(h.startsWith('acc-')){const a=acc(h.slice(4));html=vProfile(h.slice(4));nav=a&&a.kind==='mine'?'mine':'research'}
 else html=({home:vHome,research:vResearch,mine:vMine,import:vImport,ideas:vIdeas,activity:vActivity,settings:vSettings}[h]||vHome)();
 v.innerHTML=html;v.dataset.v=h.startsWith('acc-')?'profile':h;$$('[data-nav]').forEach(a=>a.classList.toggle('on',a.dataset.nav===nav))}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});
function showLogin(msg){closeModal();document.querySelector('.app').hidden=true;let l=$('#login');if(l)l.remove();
 const needUrl=!(window.PORTAL_BACKEND_URL||'').trim();
 document.body.insertAdjacentHTML('beforeend',`<div class="login" id="login"><div class="lart"><div class="lglow"></div><div class="lbrand"><span class="blogo big"><img src="${ICS}" alt="ICS"></span><h1>Research Portal</h1><p>All your TikTok, YouTube, Facebook and Spotify content research in one place.</p><div class="lplats">${PL.map(p=>logo(p,34)).join('')}</div></div></div>
 <div class="lpane"><form class="lform" id="lform"><span class="blogo msm"><img src="${ICS}" alt="ICS"></span><h2>Login</h2><p class="mut">Sign in to your account</p>
 <label>Username<input name="user" required autocomplete="username" autocapitalize="none" value="admin"></label>
 <label>Password<span class="pw"><input name="pass" id="lpass" type="password" required autocomplete="current-password"><button type="button" id="lshow" aria-label="Show password">${ic('eye')}</button></span></label>
 ${needUrl?`<label>Backend URL (first time)<input name="url" type="url" required placeholder="https://script.google.com/macros/s/.../exec" value="${esc((()=>{try{return localStorage.getItem('ics-portal-url')||''}catch(e){return ''}})())}"></label>`:''}
 <p class="lerr" id="lerr" role="alert">${msg?esc(msg):''}</p>
 <button class="btn primary lbtn">Log in</button><p class="mut sm lfoot">${ic('lock')}Secure session · data stays only in your Google Sheet</p></form></div></div>`);
 $('#lshow').onclick=()=>{const i=$('#lpass');i.type=i.type==='password'?'text':'password'};
 $('#lform').onsubmit=async e=>{e.preventDefault();const fd=new FormData(e.target),b=$('.lbtn'),er=$('#lerr');const url=((window.PORTAL_BACKEND_URL||'').trim()||String(fd.get('url')||'').trim());er.textContent='';b.disabled=true;b.textContent='Checking...';
  try{const j=await post(url,{action:'login',user:fd.get('user'),pass:fd.get('pass')});
   if(!j.ok){er.textContent=j.error==='locked'?'Too many failed attempts. Try again in 15 minutes.':'Wrong username or password';b.disabled=false;b.textContent='Log in';return}
   CONN={url,token:j.token,user:j.user,role:j.role||'admin'};ROLE=CONN.role;try{localStorage.setItem(CK,JSON.stringify(CONN));localStorage.setItem('ics-portal-url',url)}catch(e){}
   $('#login').remove();document.querySelector('.app').hidden=false;location.hash='home';await boot()}
  catch(x){er.textContent='Could not reach the server. Check your internet or the backend URL.';b.disabled=false;b.textContent='Log in'}};
 const f=$('#lpass');f&&f.focus()}
function autoSave(i,quiet){if(!P[i.platform]){toast('Unknown platform');return}
 const nl=x=>String(x||'').replace(/\/$/,'').toLowerCase(),nh=x=>String(x||'').replace(/^@/,'').toLowerCase();
 let o=S.accounts.find(a=>a.p===i.platform&&((a.link&&i.link&&nl(a.link)===nl(i.link))||(a.handle&&i.handle&&nh(a.handle)===nh(i.handle))));const isNew=!o;
 if(isNew){o={id:uid(),p:i.platform,kind:'research',name:i.name||i.handle||'Untitled',handle:i.handle||'',link:i.link||'',niche:i.niche||'',tags:[],followers:0,likes:0,uploads:0,created:'',status:i.status&&STAT.includes(i.status)?i.status:'New',notes:'',extra:{at:Date.now()},videos:[],comps:[],hist:[],snaps:[],hue:Math.floor(Math.random()*360)};o.hist.push({d:today(),s:o.status});S.accounts.unshift(o)}
 else{if(i.name)o.name=i.name;if(i.niche)o.niche=i.niche;o.extra=o.extra||{}}
 if(i.followers)o.followers=i.followers;if(i.likes)o.likes=i.likes;if(i.uploads)o.uploads=i.uploads;if(i.created)o.created=i.created;if(i.avatar)o.extra.avatar=i.avatar;if(i.following!=null)o.extra.following=i.following;if(i.country)o.extra.country=String(i.country).slice(0,60);if(Array.isArray(i.links))o.extra.links=i.links.slice(0,8).map(l=>({t:String(l.t||'').slice(0,40),u:String(l.u||'').slice(0,300)}));
 const l=o.snaps[o.snaps.length-1];if(l&&l.d===today())l.f=o.followers;else o.snaps.push({d:today(),f:o.followers});
 log(isNew?`${o.name} added (${o.p})`:`${o.name} stats updated`);save();if(quiet==='bulk')return isNew;if(quiet){render();toast(isNew?`${o.name} saved from the browser button`:`${o.name} already saved. Stats updated`);return}
 location.hash='research';render();
 const pop=window.name==='icsportal';
 document.body.insertAdjacentHTML('beforeend',`<div id="impdone" style="position:fixed;inset:0;z-index:9999;background:#0a0f22;color:#eef1ff;display:grid;place-items:center;text-align:center;font-family:inherit"><div>${o.extra.avatar?`<img src="${esc(o.extra.avatar)}" referrerpolicy="no-referrer" alt="" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:2px solid #3b4cff">`:''}<h2 style="margin:14px 0 4px">${esc(o.name)}</h2><p id="impmsg" style="margin:0;color:#9aa3c7">Saving to Google Sheet...</p></div></div>`);
 const t0=Date.now(),tick=()=>{const m=$('#impmsg');if(!m)return;
  if(syncState==='ok'&&Date.now()-t0>900){m.textContent=isNew?'Saved to your portal':'Already saved. Stats updated';m.style.color='#5fe3a1';setTimeout(()=>{if(pop)window.close();const d=$('#impdone');if(d)d.remove()},1100);return}
  if(Date.now()-t0>20000){m.textContent='Saved on this device. Sheet sync is still pending, keep this window open.';return}
  setTimeout(tick,300)};setTimeout(tick,300)}
const dec64=raw=>JSON.parse(decodeURIComponent(escape(atob(raw.replace(/-/g,'+').replace(/_/g,'/')))));
try{const bc=new BroadcastChannel('ics-portal');bc.onmessage=e=>{const m=e.data||{};if(m.type==='reload'){if(CONN&&syncState==='ok'&&!$('#login'))boot().then(()=>toast('Updated from the ICS extension'));return}if(m.type!=='import'||!CONN||syncState==='loading'||$('#login'))return;try{const i=dec64(m.payload);bc.postMessage({type:'ack',id:m.id});autoSave(i,true)}catch(x){}}}catch(e){}
function checkImport(){let raw;try{raw=sessionStorage.getItem('ics-import');sessionStorage.removeItem('ics-import')}catch(e){}if(!raw)return;
 try{const i=JSON.parse(decodeURIComponent(escape(atob(raw.replace(/-/g,'+').replace(/_/g,'/')))));if(i.auto){autoSave(i);return}if(P[i.platform])S.ui.plat=S.ui.plat==='all'?'all':i.platform;location.hash='research';formAcc(null,'research');const f=$('#modal form');if(f){A.fill(f,i);const dup=S.accounts.find(a=>a.link&&i.link&&a.link.replace(/\/$/,'').toLowerCase()===i.link.replace(/\/$/,'').toLowerCase());if(dup)$('#fmsg').insertAdjacentText('beforeend',' Note: this profile is already saved as "'+dup.name+'".')}}catch(e){toast('Could not read the imported profile')}}
async function boot(force){if(!CONN){showLogin();return}
 setSync('loading');render();
 try{const j=await pull();sheetUrl=j.sheetUrl||'';ROLE=j.role||'admin';TEAM=j.team||[];AUTO=j.auto||{};if(CONN.role!==ROLE||CONN.user!==j.user){CONN.role=ROLE;CONN.user=j.user;try{localStorage.setItem(CK,JSON.stringify(CONN))}catch(e){}}document.body.classList.toggle('ro',ROLE==='viewer');extSend({type:'session',token:CONN.token});const ui=S.ui;S.accounts=j.data.accounts;S.ideas=j.data.ideas;S.log=j.data.log;S.ui=ui;markSynced();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}setSync('ok');render();if(force)toast('Data loaded from Sheet');checkImport()}
 catch(e){if(!CONN)return;markSynced();setSync('error','Could not load from Sheet, showing offline copy');render();checkImport()}}
$('#scrim')||shell();applyTheme();$('#scrim').addEventListener('click',closeModal);$('#q').value=S.ui.q||'';
if(CONN)markSynced();boot();
})();
