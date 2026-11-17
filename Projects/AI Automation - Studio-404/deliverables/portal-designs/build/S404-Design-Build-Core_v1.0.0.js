(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STAT=['New','Shortlisted','Selected','Rejected'];
const STAGES=['Idea','Script','Production','Posted'];
const P={
 TikTok:{f:'Followers',l:'Likes',u:'Videos',unit:'video',extra:[['avgViews','Avg views per video','num'],['following','Following','num']]},
 YouTube:{f:'Subscribers',l:'Total views',u:'Videos',unit:'video',extra:[['avgViews','Avg views per video','num'],['format','Format','sel',['Long videos','Shorts','Both']]]},
 Facebook:{f:'Followers',l:'Page likes',u:'Posts',unit:'post',extra:[['pageType','Page type','sel',['Page','Profile','Group']],['avgViews','Avg reach per post','num']]},
 Spotify:{f:'Followers',l:'Monthly listeners',u:'Episodes',unit:'episode',extra:[['showType','Type','sel',['Podcast','Artist']],['avgViews','Avg plays per episode','num']]}
};
const PL=Object.keys(P);
const KEY='ics-portal-'+CFG.id;
const today=()=>new Date().toISOString().slice(0,10);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function num(v){if(typeof v==='number')return v;v=String(v||'').trim().replace(/,/g,'');const m=v.match(/^([\d.]+)\s*([kmb])?$/i);if(!m)return 0;return Math.round(parseFloat(m[1])*({k:1e3,m:1e6,b:1e9}[(m[2]||'').toLowerCase()]||1))}
const tr=x=>(x>=100?x.toFixed(0):x.toFixed(1)).replace(/\.0$/,'');
function fmt(n){n=+n||0;if(n>=1e9)return tr(n/1e9)+'B';if(n>=1e6)return tr(n/1e6)+'M';if(n>=1e3)return tr(n/1e3)+'K';return ''+n}
function ago(t){const s=(Date.now()-t)/1000;if(s<60)return 'abhi';if(s<3600)return Math.floor(s/60)+' min pehle';if(s<86400)return Math.floor(s/3600)+' ghante pehle';return Math.floor(s/86400)+' din pehle'}
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
let S;try{const r=localStorage.getItem(KEY);S=r?JSON.parse(r):seed()}catch(e){S=seed()}
if(!S||!S.accounts)S=seed();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const log=x=>{S.log.unshift({t:Date.now(),x});S.log=S.log.slice(0,80)};
const acc=id=>S.accounts.find(a=>a.id===id);
const ic=(n,c='')=>`<svg class="i ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const logo=(p,sz=18)=>`<img class="plogo" src="${LOGO[p]}" alt="${p}" style="width:${sz}px;height:${sz}px">`;
const ini=n=>n.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const av=(a,sz=40,badge=true)=>`<span class="av" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz*.36)}px;background:hsl(${a.hue} 58% 46%)">${esc(ini(a.name))}${badge?`<img class="avp" src="${LOGO[a.p]}" alt="${a.p}">`:''}</span>`;
const pill=s=>`<span class="pill s-${s}">${s}</span>`;
const stSel=a=>`<select class="stsel s-${a.status}" data-ch="status" data-id="${a.id}" aria-label="Status">${STAT.map(s=>`<option${s===a.status?' selected':''}>${s}</option>`).join('')}</select>`;
function growth(a){const s=a.snaps||[];if(s.length<2)return null;const p=s[s.length-2].f,c=s[s.length-1].f;return p?((c-p)/p*100):0}
const gtxt=a=>{const g=growth(a);if(g===null)return '<span class="mut">—</span>';return `<span class="${g>=0?'up':'dn'}">${g>=0?'+':'−'}${Math.abs(g).toFixed(1)}%</span>`};
function spark(a,w=72,h=28){const p=(a.snaps||[]).map(s=>s.f);if(p.length<2)return '';const mn=Math.min(...p),mx=Math.max(...p),r=mx-mn||1;const xy=p.map((v,i)=>[2+i*(w-4)/(p.length-1),h-3-(v-mn)/r*(h-6)]);const d=xy.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+','+q[1].toFixed(1)).join('');const e=xy[xy.length-1];return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><path d="${d}L${e[0]},${h}L2,${h}Z" fill="var(--accent)" opacity=".14"/><path d="${d}" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round"/><circle cx="${e[0]}" cy="${e[1]}" r="2.6" fill="var(--accent)"/></svg>`}

/* ---------- shell ---------- */
const NAV=[['home','home','Dashboard'],['research','search','Research'],['mine','star','My accounts'],['ideas','bulb','Ideas'],['activity','clock','Activity'],['settings','gear','Settings']];
function shell(){
 document.body.insertAdjacentHTML('beforeend',`<div class="app nav-${CFG.nav}">
 <aside class="nav"><a class="brand" href="#home"><span class="blogo"><img src="${ICS}" alt="ICS"></span><span class="bname">Research<br><small>Portal</small></span></a>
 <nav class="links">${NAV.map(([h,i,l])=>`<a href="#${h}" data-nav="${h}">${ic(i)}<span>${l}</span></a>`).join('')}</nav>
 <div class="navfoot"><button class="themebtn" data-act="theme" aria-label="Theme badlein">${ic('sun','sun')}${ic('moon','moon')}<span>Theme</span></button></div></aside>
 <div class="main"><header class="top"><div class="ttl"><h1 id="ttl"></h1><p id="sub"></p></div>
 <label class="search">${ic('search')}<input id="q" placeholder="Search name, niche, tag" autocomplete="off"></label>
 <button class="btn icon mtheme" data-act="theme" aria-label="Theme badlein">${ic('sun','sun')}${ic('moon','moon')}</button>
 <button class="btn primary" data-act="add">${ic('plus')}<span>Add account</span></button></header>
 <div id="view"></div><p class="demo">${esc(CFG.name)} concept · yeh working demo hai. Data aap ke browser mein save hota hai, asli portal mein database mein hoga.</p></div></div>
 <div class="scrim" id="scrim" hidden></div><div class="modal" id="modal" hidden role="dialog" aria-modal="true"></div><div class="toast" id="toast" role="status"></div>`);
}
function applyTheme(){const t=S.ui.theme;const r=document.documentElement;if(t==='system')r.removeAttribute('data-theme');else r.setAttribute('data-theme',t)}
function isDark(){const t=document.documentElement.getAttribute('data-theme');return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._);t._=setTimeout(()=>t.classList.remove('show'),2400)}

/* ---------- views ---------- */
const research=()=>S.accounts.filter(a=>a.kind==='research');
const mine=()=>S.accounts.filter(a=>a.kind==='mine');
function filtered(){const u=S.ui,q=u.q.toLowerCase();return research().filter(a=>(u.plat==='all'||a.p===u.plat)&&(!q||(a.name+' '+a.handle+' '+a.niche+' '+a.tags.join(' ')).toLowerCase().includes(q)))}
function head(t,s){$('#ttl').textContent=t;$('#sub').textContent=s||''}

function vHome(){
 head('Dashboard','Aaj ki research ka overview');
 const r=research(),c=s=>r.filter(a=>a.status===s).length,mx=Math.max(1,...PL.map(p=>r.filter(a=>a.p===p).length));
 return `<div class="kpis">
  <a class="kpi" href="#research" data-act="gost" data-s="all"><small>Researched</small><b>${r.length}</b><span>total accounts</span></a>
  ${STAT.map(s=>`<a class="kpi k-${s}" href="#research" data-act="gost" data-s="${s}"><small>${s}</small><b>${c(s)}</b><span class="bar"><i class="s-${s}" style="width:${r.length?c(s)/r.length*100:0}%"></i></span></a>`).join('')}</div>
 <div class="cols">
  <section class="card"><div class="ch"><h2>Mere accounts</h2><a class="lnk" href="#mine">Sab dekhein</a></div>
   ${mine().map(a=>`<a class="row" href="#acc-${a.id}">${av(a,42)}<span class="who"><b>${esc(a.name)}</b><small>${esc(a.handle)}</small></span>${spark(a)}<span class="rnum"><b>${fmt(a.followers)}</b><small>${gtxt(a)}</small></span></a>`).join('')||empty('Abhi koi account nahi','Apna pehla account add karein')}
   <button class="btn ghost full" data-act="add" data-kind="mine">${ic('plus')}Apna account add karein</button></section>
  <section class="card"><div class="ch"><h2>Platform breakdown</h2></div>
   ${PL.map(p=>{const n=r.filter(a=>a.p===p).length;return `<a class="pbar" href="#research" data-act="goplat" data-p="${p}">${logo(p,22)}<span class="pn">${p}</span><span class="track"><i style="width:${n/mx*100}%"></i></span><b>${n}</b></a>`}).join('')}</section>
  <section class="card"><div class="ch"><h2>Recent activity</h2><a class="lnk" href="#activity">Poora log</a></div>
   <ul class="feed">${S.log.slice(0,6).map(l=>`<li><i></i><span>${esc(l.x)}</span><time>${ago(l.t)}</time></li>`).join('')||'<li class="mut">Koi activity nahi</li>'}</ul></section>
  <section class="card"><div class="ch"><h2>Ideas pipeline</h2><a class="lnk" href="#ideas">Board kholein</a></div>
   <div class="stages">${STAGES.map(s=>`<div><b>${S.ideas.filter(i=>i.st===s).length}</b><small>${s}</small></div>`).join('')}</div>
   <ul class="feed">${S.ideas.slice(0,3).map(i=>`<li>${logo(i.p,16)}<span>${esc(i.t)}</span><time>${i.st}</time></li>`).join('')}</ul></section>
 </div>`;
}
const empty=(t,s)=>`<div class="empty"><b>${t}</b><span>${s||''}</span></div>`;
function toolbar(){const u=S.ui,f=filtered();
 return `<div class="tools"><div class="chips"><button class="chip${u.plat==='all'?' on':''}" data-act="plat" data-p="all">All</button>${PL.map(p=>`<button class="chip${u.plat===p?' on':''}" data-act="plat" data-p="${p}">${logo(p,16)}${p}</button>`).join('')}</div>
 <div class="seg" role="tablist" aria-label="View">${[['grid','grid','Cards'],['table','rows','Table'],['board','cols','Board']].map(([v,i,l])=>`<button class="${u.view===v?'on':''}" data-act="view" data-v="${v}" title="${l}">${ic(i)}<span>${l}</span></button>`).join('')}</div></div>
 ${u.view!=='board'?`<div class="stabs">${[['all','All']].concat(STAT.map(s=>[s,s])).map(([k,l])=>`<button class="${u.status===k?'on':''}" data-act="st" data-s="${k}">${l}<i>${k==='all'?f.length:f.filter(a=>a.status===k).length}</i></button>`).join('')}</div>`:''}`}
function accCard(a,drag){const d=P[a.p];return `<article class="acard" data-open="${a.id}"${drag?` draggable="true" data-drag="${a.id}"`:''} tabindex="0">
 <div class="ac-top">${av(a,44)}<span class="who"><b>${esc(a.name)}</b><small>${esc(a.handle)}</small></span><span class="grow">${gtxt(a)}</span></div>
 <div class="ac-nums"><span><b>${fmt(a.followers)}</b>${d.f}</span><span><b>${fmt(a.likes)}</b>${d.l}</span><span><b>${fmt(a.uploads)}</b>${d.u}</span></div>
 <div class="ac-foot"><span class="niche">${esc(a.niche||'No niche')}</span>${stSel(a)}</div></article>`}
function vResearch(){
 head('Research','Accounts save karein, status badlein, record khud sahi list mein chala jata hai');
 const u=S.ui,f=filtered(),list=f.filter(a=>u.status==='all'||a.status===u.status);let body;
 if(u.view==='board')body=`<div class="board">${STAT.map(s=>{const it=f.filter(a=>a.status===s);return `<div class="lane" data-drop="${s}"><h3><i class="dot s-${s}"></i>${s}<span>${it.length}</span></h3><div class="lcards">${it.map(a=>accCard(a,true)).join('')||'<div class="ldrop">Card yahan drop karein</div>'}</div></div>`}).join('')}</div>`;
 else if(!list.length)body=empty('Is list mein koi account nahi','Filter badlein ya naya account add karein');
 else if(u.view==='grid')body=`<div class="agrid">${list.map(a=>accCard(a)).join('')}</div>`;
 else body=`<div class="tbl card"><table><thead><tr><th>Account</th><th class="r">Followers</th><th class="r">Likes / views</th><th class="r">Uploads</th><th>Niche</th><th>Created</th><th class="r">7 din</th><th>Status</th><th></th></tr></thead><tbody>${list.map(a=>`<tr data-open="${a.id}"><td><span class="tacc">${av(a,36)}<span class="who"><b>${esc(a.name)}</b><small>${esc(a.handle)}</small></span></span></td><td class="r"><b>${fmt(a.followers)}</b></td><td class="r">${fmt(a.likes)}</td><td class="r">${fmt(a.uploads)}</td><td><span class="niche">${esc(a.niche)}</span></td><td class="mut">${esc(a.created||'—')}</td><td class="r">${gtxt(a)}</td><td>${stSel(a)}</td><td class="r"><button class="btn icon sm" data-act="edit" data-id="${a.id}" aria-label="Edit">${ic('edit')}</button></td></tr>`).join('')}</tbody></table></div>`;
 return toolbar()+body;
}
function vMine(){
 head('My accounts','Aap ke apne accounts, competitors aur growth ke saath');
 const m=mine();
 return `<div class="mgrid">${m.map(a=>{const d=P[a.p];return `<a class="mcard card" href="#acc-${a.id}"><div class="ac-top">${av(a,52)}<span class="who"><b>${esc(a.name)}</b><small>${esc(a.handle)}</small></span>${gtxt(a)}</div><div class="mbig"><b>${fmt(a.followers)}</b><small>${d.f}</small></div>${spark(a,260,56)}<div class="ac-nums"><span><b>${fmt(a.likes)}</b>${d.l}</span><span><b>${fmt(a.uploads)}</b>${d.u}</span><span><b>${a.comps.filter(acc).length}</b>Competitors</span></div></a>`}).join('')}
 <button class="mcard card addcard" data-act="add" data-kind="mine">${ic('plus')}<b>Naya account add karein</b><span>TikTok, YouTube, Facebook ya Spotify</span></button></div>`;
}
function chart(a){const s=a.snaps||[];if(s.length<2)return empty('Abhi growth data nahi','"Stats update" se aaj ke numbers save karein, chart ban jayega');
 const W=640,H=230,pl=52,pr=16,pt=16,pb=28,v=s.map(x=>x.f),mn=Math.min(...v),mx=Math.max(...v),pad=(mx-mn)*.15||mx*.05||1,lo=Math.max(0,mn-pad),hi=mx+pad;
 const x=i=>pl+i*(W-pl-pr)/(s.length-1),y=q=>pt+(hi-q)/(hi-lo)*(H-pt-pb);let g='';
 for(let k=0;k<4;k++){const q=lo+(hi-lo)*k/3;g+=`<line x1="${pl}" x2="${W-pr}" y1="${y(q)}" y2="${y(q)}" stroke="var(--line)"/><text x="${pl-8}" y="${y(q)+4}" text-anchor="end" class="ax">${fmt(Math.round(q))}</text>`}
 const step=Math.ceil(s.length/6);s.forEach((p,i)=>{if(i%step===0||i===s.length-1)g+=`<text x="${x(i)}" y="${H-8}" text-anchor="middle" class="ax">${p.d.slice(5)}</text>`});
 const d=v.map((q,i)=>(i?'L':'M')+x(i).toFixed(1)+','+y(q).toFixed(1)).join('');
 g+=`<path d="${d}L${x(s.length-1)},${H-pb}L${pl},${H-pb}Z" fill="url(#gr)"/><path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`;
 v.forEach((q,i)=>g+=`<circle cx="${x(i)}" cy="${y(q)}" r="${i===v.length-1?5:3}" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"><title>${s[i].d}: ${fmt(q)}</title></circle>`);
 return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Followers growth"><defs><linearGradient id="gr" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".28"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>${g}</svg>`}
function hero(a){const d=P[a.p],x=a.extra||{},h=a.hue;
 const stats=`<div class="pstats"><span><b>${fmt(a.followers)}</b>${d.f}</span><span><b>${fmt(a.likes)}</b>${d.l}</span><span><b>${fmt(a.uploads)}</b>${d.u}</span>${a.p==='TikTok'&&x.following?`<span><b>${fmt(x.following)}</b>Following</span>`:''}</div>`;
 const acts=`<div class="pacts">${a.link?`<a class="btn primary" href="${esc(a.link)}" target="_blank" rel="noopener">${ic('ext')}${a.p} par kholein</a>`:''}<button class="btn" data-act="stats" data-id="${a.id}">${ic('refresh')}Stats update</button><button class="btn" data-act="edit" data-id="${a.id}">${ic('edit')}Edit</button><button class="btn icon" data-act="del" data-id="${a.id}" aria-label="Delete">${ic('trash')}</button></div>`;
 const tags=`<div class="ptags">${a.kind==='research'?stSel(a):'<span class="pill mine">Mera account</span>'}${a.niche?`<span class="tag">${esc(a.niche)}</span>`:''}${a.tags.map(t=>`<span class="tag">#${esc(t)}</span>`).join('')}</div>`;
 if(a.p==='YouTube')return `<section class="hero h-yt card"><div class="banner" style="background:linear-gradient(115deg,hsl(${h} 62% 38%),hsl(${h+50} 66% 56%))"></div><div class="hrow">${av(a,112,false)}<div class="hinfo"><h2>${esc(a.name)}</h2><p class="mut">${esc(a.handle)} · ${fmt(a.followers)} subscribers · ${fmt(a.uploads)} videos</p>${tags}${acts}</div></div></section>`;
 if(a.p==='Facebook')return `<section class="hero h-fb card"><div class="cover" style="background:linear-gradient(160deg,hsl(${h} 50% 42%),hsl(${h+30} 55% 26%))"></div><div class="hrow">${av(a,128,false)}<div class="hinfo"><h2>${esc(a.name)}</h2><p class="mut">${fmt(a.followers)} followers · ${fmt(a.likes)} likes · ${esc(x.pageType||'Page')}</p>${tags}</div>${acts}</div></section>`;
 if(a.p==='Spotify')return `<section class="hero h-sp" style="background:linear-gradient(180deg,hsl(${h} 45% 34%),hsl(${h} 40% 14%))"><div class="cov ${x.showType==='Artist'?'round':''}" style="background:linear-gradient(135deg,hsl(${h} 60% 52%),hsl(${h+60} 60% 30%))">${esc(ini(a.name))}</div><div class="hinfo"><small>${esc(x.showType||'Podcast')}</small><h2>${esc(a.name)}</h2><p>${esc(a.handle)} · ${fmt(a.followers)} followers · ${fmt(a.likes)} monthly listeners</p>${tags}${acts}</div></section>`;
 return `<section class="hero h-tt card">${av(a,116,false)}<h2>${esc(a.name)}</h2><p class="mut">${esc(a.handle)}</p>${stats}${a.notes?`<p class="bio">${esc(a.notes.slice(0,110))}</p>`:''}${tags}${acts}</section>`;
}
function vids(a){const d=P[a.p],v=a.videos||[],h=a.hue;let list;
 if(!v.length)list=empty(`Koi ${d.unit} save nahi`,'Neeche se title aur views daal kar add karein');
 else if(a.p==='TikTok')list=`<div class="vg-tt">${v.map((x,i)=>`<div class="vt" style="background:linear-gradient(170deg,hsl(${h+i*32} 48% 42%),hsl(${h+i*32} 45% 12%))"><span class="cap">${esc(x.t)}</span><span class="vv">${ic('play')}${fmt(x.v)}</span><button class="vx" data-act="vdel" data-id="${a.id}" data-i="${i}" aria-label="Remove">${ic('x')}</button></div>`).join('')}</div>`;
 else if(a.p==='YouTube')list=`<div class="vg-yt">${v.map((x,i)=>`<div class="yv"><div class="th" style="background:linear-gradient(135deg,hsl(${h+i*28} 50% 36%),hsl(${h+i*28+40} 55% 58%))">${ic('play')}<button class="vx" data-act="vdel" data-id="${a.id}" data-i="${i}" aria-label="Remove">${ic('x')}</button></div><b>${esc(x.t)}</b><small>${fmt(x.v)} views</small></div>`).join('')}</div>`;
 else list=`<ol class="vlist">${v.map((x,i)=>`<li><span class="n">${i+1}</span><span class="tn" style="background:linear-gradient(135deg,hsl(${h+i*30} 55% 48%),hsl(${h+i*30+50} 55% 30%))"></span><span class="who"><b>${esc(x.t)}</b><small>${fmt(x.v)} ${a.p==='Spotify'?'plays':'reach'}</small></span><button class="btn icon sm" data-act="vdel" data-id="${a.id}" data-i="${i}" aria-label="Remove">${ic('x')}</button></li>`).join('')}</ol>`;
 return `<section class="card"><div class="ch"><h2>${a.p==='Spotify'?'Episodes':a.p==='Facebook'?'Top posts':'Videos'}</h2><span class="mut">${v.length} saved</span></div>${list}
 <form class="inline" data-form="vadd" data-id="${a.id}"><input name="t" placeholder="Title" required aria-label="Title"><input name="v" placeholder="Views, jaise 120K" aria-label="Views"><input name="url" placeholder="Link (optional)" aria-label="Link"><button class="btn primary">${ic('plus')}Add</button></form></section>`}
function vProfile(id){const a=acc(id);if(!a){head('Account nahi mila','');return empty('Yeh account delete ho chuka hai','<a class="lnk" href="#research">Research par wapas</a>')}
 head(a.name,`${a.p} · ${a.kind==='mine'?'Mera account':'Researched account'}`);
 const d=P[a.p],x=a.extra||{},er=a.followers&&x.avgViews?(x.avgViews/a.followers*100).toFixed(1)+'%':'—';
 const facts=[['Platform',a.p],['Niche',a.niche||'—'],['Created',a.created||'—'],[d.f,fmt(a.followers)],[d.l,fmt(a.likes)],[d.u,fmt(a.uploads)]].concat(d.extra.map(([k,l,t])=>[l,t==='num'?(x[k]?fmt(x[k]):'—'):(x[k]||'—')])).concat([['Views to followers',er],['Link',a.link?`<a class="lnk" href="${esc(a.link)}" target="_blank" rel="noopener">Open</a>`:'—']]);
 let comp='';
 if(a.kind==='mine'){const cs=a.comps.map(acc).filter(Boolean),opts=research().filter(r=>!a.comps.includes(r.id));
  comp=`<section class="card"><div class="ch"><h2>Competitors</h2><span class="mut">${cs.length} linked</span></div>
  ${cs.length?`<div class="tbl flat"><table><thead><tr><th>Account</th><th class="r">Followers</th><th class="r">7 din</th><th class="r">Avg views</th><th></th></tr></thead><tbody><tr class="me"><td><span class="tacc">${av(a,32)}<b>${esc(a.name)} (aap)</b></span></td><td class="r"><b>${fmt(a.followers)}</b></td><td class="r">${gtxt(a)}</td><td class="r">${x.avgViews?fmt(x.avgViews):'—'}</td><td></td></tr>${cs.map(c=>`<tr data-open="${c.id}"><td><span class="tacc">${av(c,32)}<span class="who"><b>${esc(c.name)}</b><small>${esc(c.handle)}</small></span></span></td><td class="r">${fmt(c.followers)}</td><td class="r">${gtxt(c)}</td><td class="r">${c.extra&&c.extra.avgViews?fmt(c.extra.avgViews):'—'}</td><td class="r"><button class="btn icon sm" data-act="unlink" data-id="${a.id}" data-c="${c.id}" aria-label="Unlink">${ic('x')}</button></td></tr>`).join('')}</tbody></table></div>`:empty('Koi competitor linked nahi','Neeche se researched account chun kar link karein')}
  ${opts.length?`<form class="inline" data-form="link" data-id="${a.id}"><select name="c" aria-label="Competitor">${opts.map(o=>`<option value="${o.id}">${esc(o.name)} · ${o.p} · ${fmt(o.followers)}</option>`).join('')}</select><button class="btn primary">${ic('link')}Link competitor</button></form>`:''}</section>`}
 else{const by=mine().filter(m=>m.comps.includes(a.id));comp=`<section class="card"><div class="ch"><h2>Status history</h2></div><ul class="feed">${(a.hist||[]).slice().reverse().map(h=>`<li><i class="s-${h.s}"></i><span>${h.s}</span><time>${h.d}</time></li>`).join('')}</ul>${by.length?`<p class="mut sm">Competitor of: ${by.map(m=>`<a class="lnk" href="#acc-${m.id}">${esc(m.name)} (${m.p})</a>`).join(', ')}</p>`:''}</section>`}
 return `<a class="back" href="#${a.kind==='mine'?'mine':'research'}">${ic('back')}${a.kind==='mine'?'My accounts':'Research'}</a>${hero(a)}
 <div class="pcols"><div class="pmain">${vids(a)}<section class="card"><div class="ch"><h2>Followers growth</h2><span class="mut">${(a.snaps||[]).length} snapshots</span></div>${chart(a)}</section>${comp}</div>
 <div class="pside"><section class="card"><div class="ch"><h2>Details</h2></div><dl class="facts">${facts.map(([k,v])=>`<div><dt>${k}</dt><dd>${typeof v==='string'&&v.startsWith('<a')?v:esc(v)}</dd></div>`).join('')}</dl></section>
 <section class="card"><div class="ch"><h2>Notes</h2><span class="mut" id="nsaved"></span></div><textarea class="notes" data-in="notes" data-id="${a.id}" placeholder="Is account ke baare mein apni research likhein: hooks, format, posting time...">${esc(a.notes)}</textarea></section></div></div>`;
}
function vIdeas(){head('Ideas pipeline','Idea se Posted tak, card drag karein ya stage badlein');
 return `<form class="inline card" data-form="idea"><input name="t" placeholder="Naya idea likhein" required aria-label="Idea"><select name="p" aria-label="Platform">${PL.map(p=>`<option>${p}</option>`).join('')}</select><input name="n" placeholder="Note (optional)" aria-label="Note"><button class="btn primary">${ic('plus')}Add idea</button></form>
 <div class="board">${STAGES.map(s=>{const it=S.ideas.filter(i=>i.st===s);return `<div class="lane" data-dropi="${s}"><h3>${s}<span>${it.length}</span></h3><div class="lcards">${it.map(i=>`<article class="icard" draggable="true" data-dragi="${i.id}"><div class="it">${logo(i.p,18)}<b>${esc(i.t)}</b></div>${i.n?`<p>${esc(i.n)}</p>`:''}<div class="ac-foot"><select data-ch="stage" data-id="${i.id}" aria-label="Stage">${STAGES.map(x=>`<option${x===s?' selected':''}>${x}</option>`).join('')}</select><button class="btn icon sm" data-act="idel" data-id="${i.id}" aria-label="Delete">${ic('trash')}</button></div></article>`).join('')||'<div class="ldrop">Card yahan drop karein</div>'}</div></div>`}).join('')}</div>`}
function vActivity(){head('Activity','Har change ka record');return `<section class="card"><ul class="feed big">${S.log.map(l=>`<li><i></i><span>${esc(l.x)}</span><time>${ago(l.t)}</time></li>`).join('')||'<li class="mut">Koi activity nahi</li>'}</ul></section>`}
function csv(){const h=['kind','platform','name','handle','link','niche','tags','followers','likes','uploads','created','status','notes'];const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return [h.join(',')].concat(S.accounts.map(a=>[a.kind,a.p,a.name,a.handle,a.link,a.niche,a.tags.join(' '),a.followers,a.likes,a.uploads,a.created,a.status,a.notes].map(q).join(','))).join('\n')}
function vSettings(){head('Settings','Theme, backup aur data');const t=S.ui.theme;
 return `<div class="cols"><section class="card"><div class="ch"><h2>Theme</h2></div><div class="seg wide">${[['system','System'],['light','Light'],['dark','Dark']].map(([k,l])=>`<button class="${t===k?'on':''}" data-act="settheme" data-t="${k}">${l}</button>`).join('')}</div><p class="mut sm">System par rakhein to aap ke phone ya computer ki setting follow hogi.</p></section>
 <section class="card"><div class="ch"><h2>Demo data</h2></div><p class="mut sm">Sample records wapas laane ke liye reset karein, ya sab khali kar ke apni entries se test karein.</p><div class="pacts"><button class="btn" data-act="reset">Sample data reset</button><button class="btn danger" data-act="clear">Sab data khali karein</button></div></section>
 <section class="card span2"><div class="ch"><h2>CSV export</h2><button class="btn sm" data-act="copy" data-t="csvbox">${ic('copy')}Copy</button></div><textarea class="code" id="csvbox" readonly>${esc(csv())}</textarea><p class="mut sm">Yeh text copy kar ke Excel ya Google Sheets mein paste karein. Asli portal mein file download hogi.</p></section>
 <section class="card span2"><div class="ch"><h2>Backup aur restore</h2><button class="btn sm" data-act="copy" data-t="jsonbox">${ic('copy')}Copy backup</button></div><textarea class="code" id="jsonbox" placeholder="Backup yahan paste kar ke Restore dabayein">${esc(JSON.stringify({accounts:S.accounts,ideas:S.ideas}))}</textarea><div class="pacts"><button class="btn primary" data-act="restore">Restore from text</button></div></section></div>`}

/* ---------- modal forms ---------- */
function openModal(html){$('#modal').innerHTML=html;$('#modal').hidden=false;$('#scrim').hidden=false;const f=$('#modal input,#modal select,#modal button');f&&f.focus()}
function closeModal(){$('#modal').hidden=true;$('#scrim').hidden=true}
function extraFields(p,x){return P[p].extra.map(([k,l,t,o])=>`<label>${l}${t==='sel'?`<select name="x_${k}">${o.map(v=>`<option${x[k]===v?' selected':''}>${v}</option>`).join('')}</select>`:`<input name="x_${k}" value="${x[k]?fmt(x[k]):''}" placeholder="jaise 45K">`}</label>`).join('')}
function formAcc(a,kind){const e=!!a;a=a||{p:S.ui.plat!=='all'?S.ui.plat:'TikTok',kind:kind||'research',name:'',handle:'',link:'',niche:'',tags:[],followers:'',likes:'',uploads:'',created:'',status:'New',notes:'',extra:{}};const d=P[a.p];
 openModal(`<form data-form="acc" data-id="${e?a.id:''}"><div class="mh"><h2>${e?'Account edit karein':'Naya account'}</h2><button type="button" class="btn icon" data-act="close" aria-label="Close">${ic('x')}</button></div>
 <div class="mb"><div class="pick" role="radiogroup" aria-label="Platform">${PL.map(p=>`<label class="${a.p===p?'on':''}"><input type="radio" name="p" value="${p}"${a.p===p?' checked':''} data-ch="fplat">${logo(p,28)}<span>${p}</span></label>`).join('')}</div>
 <div class="seg wide two">${[['research','Researched account'],['mine','Mera apna account']].map(([k,l])=>`<label class="${a.kind===k?'on':''}"><input type="radio" name="kind" value="${k}"${a.kind===k?' checked':''} data-ch="fkind">${l}</label>`).join('')}</div>
 <div class="fg"><label class="w2">Name<input name="name" value="${esc(a.name)}" required placeholder="Account ya channel ka naam"></label><label>Handle<input name="handle" value="${esc(a.handle)}" placeholder="@username"></label><label>Profile link<input name="link" type="url" value="${esc(a.link)}" placeholder="https://"></label>
 <label>Niche<input name="niche" value="${esc(a.niche)}" placeholder="jaise AI tools"></label><label>Tags<input name="tags" value="${esc(a.tags.join(', '))}" placeholder="faceless, hooks"></label>
 <label><span id="lf">${d.f}</span><input name="followers" value="${a.followers?fmt(a.followers):''}" placeholder="jaise 12.5K"></label><label><span id="ll">${d.l}</span><input name="likes" value="${a.likes?fmt(a.likes):''}" placeholder="jaise 1.2M"></label>
 <label><span id="lu">${d.u}</span><input name="uploads" value="${a.uploads||''}" placeholder="jaise 86"></label><label>Account creation date<input name="created" type="date" value="${esc(a.created)}"></label>
 <div class="w2 fx" id="fx">${extraFields(a.p,a.extra||{})}</div>
 <label id="fst"${a.kind==='mine'?' hidden':''}>Status<select name="status">${STAT.map(s=>`<option${s===a.status?' selected':''}>${s}</option>`).join('')}</select></label>
 <label class="w2">Notes<textarea name="notes" rows="3" placeholder="Kyun save kiya, kya acha laga">${esc(a.notes)}</textarea></label></div></div>
 <div class="mf"><button type="button" class="btn" data-act="close">Cancel</button><button class="btn primary">${e?'Save changes':'Save account'}</button></div></form>`)}
function formStats(a){const d=P[a.p];openModal(`<form data-form="stats" data-id="${a.id}"><div class="mh"><h2>Stats update</h2><button type="button" class="btn icon" data-act="close" aria-label="Close">${ic('x')}</button></div><div class="mb"><p class="mut sm">Aaj ke numbers daalein. Har update ek snapshot banata hai jis se growth chart banta hai. Asli portal mein YouTube ke numbers khud aayenge.</p><div class="fg"><label>${d.f}<input name="followers" value="${fmt(a.followers)}" required></label><label>${d.l}<input name="likes" value="${fmt(a.likes)}"></label><label>${d.u}<input name="uploads" value="${a.uploads}"></label></div></div><div class="mf"><button type="button" class="btn" data-act="close">Cancel</button><button class="btn primary">Save snapshot</button></div></form>`)}
function confirmBox(msg,yes,fn){openModal(`<div class="mh"><h2>Confirm</h2></div><div class="mb"><p>${msg}</p></div><div class="mf"><button class="btn" data-act="close">Cancel</button><button class="btn danger" id="cyes">${yes}</button></div>`);$('#cyes').onclick=()=>{closeModal();fn()}}

/* ---------- actions ---------- */
function setStatus(id,s){const a=acc(id);if(!a||a.status===s)return;a.status=s;(a.hist=a.hist||[]).push({d:today(),s});log(`${a.name} ka status ${s} hua`);save();render();toast(`${a.name} ab ${s} list mein hai`)}
const A={
 add:el=>formAcc(null,el.dataset.kind),edit:el=>formAcc(acc(el.dataset.id)),close:closeModal,stats:el=>formStats(acc(el.dataset.id)),
 theme(){S.ui.theme=isDark()?'light':'dark';applyTheme();save();if(route()==='settings')render()},
 settheme(el){S.ui.theme=el.dataset.t;applyTheme();save();render()},
 plat(el){S.ui.plat=el.dataset.p;save();render()},st(el){S.ui.status=el.dataset.s;save();render()},view(el){S.ui.view=el.dataset.v;save();render()},
 gost(el){S.ui.status=el.dataset.s;S.ui.plat='all';if(S.ui.view==='board')S.ui.view='grid';save()},goplat(el){S.ui.plat=el.dataset.p;S.ui.status='all';save()},
 del(el){const a=acc(el.dataset.id);confirmBox(`<b>${esc(a.name)}</b> ka poora record delete ho jayega.`,'Delete',()=>{S.accounts=S.accounts.filter(x=>x.id!==a.id);S.accounts.forEach(x=>x.comps=x.comps.filter(c=>c!==a.id));log(`${a.name} delete hua`);save();location.hash=a.kind==='mine'?'mine':'research';toast('Account delete ho gaya')})},
 unlink(el){const a=acc(el.dataset.id);a.comps=a.comps.filter(c=>c!==el.dataset.c);save();render()},
 vdel(el){const a=acc(el.dataset.id);a.videos.splice(+el.dataset.i,1);save();render()},
 idel(el){S.ideas=S.ideas.filter(i=>i.id!==el.dataset.id);save();render()},
 reset(){confirmBox('Aap ki entries hat kar sample data wapas aa jayega.','Reset',()=>{const u=S.ui;S=seed();S.ui.theme=u.theme;save();render();toast('Sample data wapas aa gaya')})},
 clear(){confirmBox('Sab accounts, ideas aur activity delete ho jayegi.','Sab khali karein',()=>{S.accounts=[];S.ideas=[];S.log=[];save();render();toast('Data khali ho gaya')})},
 copy(el){const t=$('#'+el.dataset.t);const done=()=>toast('Copy ho gaya');try{navigator.clipboard.writeText(t.value).then(done,()=>{t.select();toast('Text select ho gaya, ab copy karein')})}catch(e){t.select();toast('Text select ho gaya, ab copy karein')}},
 restore(){try{const d=JSON.parse($('#jsonbox').value);if(!Array.isArray(d.accounts))throw 0;S.accounts=d.accounts;S.ideas=d.ideas||[];log('Backup restore hua');save();render();toast('Backup restore ho gaya')}catch(e){toast('Yeh backup text sahi nahi hai')}}
};
const F={
 acc(f,fd){const id=f.dataset.id,p=fd.get('p'),o=id?acc(id):{id:uid(),videos:[],comps:[],hist:[],snaps:[],hue:Math.floor(Math.random()*360)};
  const x={};P[p].extra.forEach(([k,l,t])=>{const v=fd.get('x_'+k);if(v)x[k]=t==='num'?num(v):v});
  const was=o.status;Object.assign(o,{p,kind:fd.get('kind'),name:fd.get('name').trim(),handle:fd.get('handle').trim(),link:fd.get('link').trim(),niche:fd.get('niche').trim(),tags:fd.get('tags').split(/[,\s]+/).map(t=>t.replace(/^#/,'').trim()).filter(Boolean),followers:num(fd.get('followers')),likes:num(fd.get('likes')),uploads:num(fd.get('uploads')),created:fd.get('created'),notes:fd.get('notes'),extra:x});
  o.status=o.kind==='mine'?'':(fd.get('status')||'New');if(o.kind==='research'&&o.status!==was)o.hist.push({d:today(),s:o.status});
  const last=o.snaps[o.snaps.length-1];if(!last||last.f!==o.followers){if(last&&last.d===today())last.f=o.followers;else o.snaps.push({d:today(),f:o.followers})}
  if(!id){S.accounts.unshift(o);log(`${o.name} add hua (${p})`)}else log(`${o.name} update hua`);save();closeModal();
  if(!id&&o.kind==='research'){S.ui.status='all';S.ui.plat='all';S.ui.q='';$('#q').value='';save()}
  if(!id)location.hash=o.kind==='mine'?'mine':'research';render();toast(id?'Changes save ho gaye':`${o.name} save ho gaya`)},
 stats(f,fd){const a=acc(f.dataset.id);a.followers=num(fd.get('followers'));a.likes=num(fd.get('likes'));a.uploads=num(fd.get('uploads'));const l=a.snaps[a.snaps.length-1];if(l&&l.d===today())l.f=a.followers;else a.snaps.push({d:today(),f:a.followers});log(`${a.name} ke stats update hue`);save();closeModal();render();toast('Snapshot save ho gaya')},
 vadd(f,fd){const a=acc(f.dataset.id);a.videos.unshift({t:fd.get('t').trim(),v:num(fd.get('v')),url:fd.get('url').trim()});save();render();toast('Save ho gaya')},
 link(f,fd){const a=acc(f.dataset.id),c=acc(fd.get('c'));a.comps.push(c.id);log(`${c.name} ko ${a.name} ka competitor banaya`);save();render();toast(`${c.name} link ho gaya`)},
 idea(f,fd){S.ideas.unshift({id:uid(),t:fd.get('t').trim(),p:fd.get('p'),n:fd.get('n').trim(),st:'Idea'});log('Naya idea add hua');save();render();toast('Idea add ho gaya')}
};
const C={
 status:el=>setStatus(el.dataset.id,el.value),
 stage(el){const i=S.ideas.find(x=>x.id===el.dataset.id);i.st=el.value;log(`"${i.t}" ab ${i.st} mein hai`);save();render()},
 fplat(el){const p=el.value,d=P[p];$$('.pick label').forEach(l=>l.classList.toggle('on',l.contains(el)));$('#lf').textContent=d.f;$('#ll').textContent=d.l;$('#lu').textContent=d.u;$('#fx').innerHTML=extraFields(p,{})},
 fkind(el){$$('.seg.two label').forEach(l=>l.classList.toggle('on',l.contains(el)));$('#fst').hidden=el.value==='mine'}
};
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-act]');if(b){if(b.tagName!=='A')e.preventDefault();e.stopPropagation();A[b.dataset.act](b);return}
 if(e.target.closest('select,input,textarea,button,a,form'))return;
 const o=e.target.closest('[data-open]');if(o)location.hash='acc-'+o.dataset.open;
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if(e.key==='Enter'&&e.target.matches('[data-open]'))location.hash='acc-'+e.target.dataset.open});
document.addEventListener('change',e=>{const c=e.target.dataset.ch;if(c)C[c](e.target)});
document.addEventListener('submit',e=>{const f=e.target.closest('[data-form]');if(!f)return;e.preventDefault();F[f.dataset.form](f,new FormData(f))});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='q'){S.ui.q=t.value;if(route()!=='research'){location.hash='research'}else{const v=$('#view');v.innerHTML=vResearch();}return}
 if(t.dataset.in==='notes'){const a=acc(t.dataset.id);a.notes=t.value;save();const n=$('#nsaved');if(n){n.textContent='Saved';clearTimeout(n._);n._=setTimeout(()=>n.textContent='',1200)}}});
let dragId=null,dragKind=null;
document.addEventListener('dragstart',e=>{const c=e.target.closest('[data-drag],[data-dragi]');if(!c)return;dragKind=c.dataset.drag?'a':'i';dragId=c.dataset.drag||c.dataset.dragi;e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',dragId)}catch(_){}c.classList.add('dragging')});
document.addEventListener('dragend',()=>{$$('.dragging').forEach(x=>x.classList.remove('dragging'));$$('.lane.over').forEach(x=>x.classList.remove('over'))});
document.addEventListener('dragover',e=>{const l=e.target.closest(dragKind==='a'?'[data-drop]':'[data-dropi]');if(!l||!dragId)return;e.preventDefault();$$('.lane.over').forEach(x=>x!==l&&x.classList.remove('over'));l.classList.add('over')});
document.addEventListener('drop',e=>{const l=e.target.closest(dragKind==='a'?'[data-drop]':'[data-dropi]');if(!l||!dragId)return;e.preventDefault();if(dragKind==='a')setStatus(dragId,l.dataset.drop);else{const i=S.ideas.find(x=>x.id===dragId);if(i&&i.st!==l.dataset.dropi){i.st=l.dataset.dropi;log(`"${i.t}" ab ${i.st} mein hai`);save();render()}}dragId=null});

/* ---------- router ---------- */
function route(){const h=location.hash.slice(1)||'home';return h}
function render(){const h=route(),v=$('#view');let html,nav=h;
 if(h.startsWith('acc-')){const a=acc(h.slice(4));html=vProfile(h.slice(4));nav=a&&a.kind==='mine'?'mine':'research'}
 else html=({home:vHome,research:vResearch,mine:vMine,ideas:vIdeas,activity:vActivity,settings:vSettings}[h]||vHome)();
 v.innerHTML=html;v.dataset.v=h.startsWith('acc-')?'profile':h;$$('[data-nav]').forEach(a=>a.classList.toggle('on',a.dataset.nav===nav))}
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});
$('#scrim')||shell();applyTheme();$('#scrim').addEventListener('click',closeModal);$('#q').value=S.ui.q||'';render();
})();
