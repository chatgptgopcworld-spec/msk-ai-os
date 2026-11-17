/* Moonshot premium brand kits: page rendering */
const app=document.getElementById('app'),tabs=document.getElementById('tabs'),subnav=document.getElementById('subnav');
const FOILCSS={'url(#gold)':'linear-gradient(135deg,#9C7830,#F3DC9C 30%,#B98D3C 55%,#F7E7B4 80%,#A07C2C)','url(#copper)':'linear-gradient(135deg,#8E4623,#F0B48A 30%,#B8693D 55%,#F6C9A6 80%,#9A4F28)'};
const hex2=h=>{const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]};
const cmyk=([r,g,b])=>{const k=1-Math.max(r,g,b)/255;if(k===1)return'0 0 0 100';return[(1-r/255-k)/(1-k),(1-g/255-k)/(1-k),(1-b/255-k)/(1-k),k].map(v=>Math.round(v*100)).join(' ')};
const n2=k=>String(k.id).padStart(2,'0');
const csk=(k,s)=>k.lc?s.toLowerCase():k.tc?s.charAt(0)+s.slice(1).toLowerCase():s;
let cur=0;

function buildTabs(){
  const t=k=>`<button class="tab" data-go="${k.id}"><i style="background:${k.t.dark.bg}">${logo(k,'mark',k.t.dark)}</i>${n2(k)} ${k.name}</button>`;
  tabs.innerHTML=`<em>MEDIA</em>${KITS.filter(k=>k.grp==='Media').map(t).join('')}<em>STUDIOS</em>${KITS.filter(k=>k.grp==='Studios').map(t).join('')}`;
}
function overview(){
  subnav.innerHTML='<a href="#media">Moonshot Media · 01–05</a><a href="#studios">Moonshot Studios · 06–10</a>';
  const c=k=>`<button class="ovc" data-go="${k.id}"><div class="lg" style="background:${k.t.dark.bg}">${logo(k,k.hz?'alt':'primary',k.t.dark)}</div><div class="mt"><span>${n2(k)} · ${k.name}</span><small>${k.style}</small></div></button>`;
  app.innerHTML=`<section class="ov"><h1>Ten identities for <i>Moonshot</i>.</h1><p>Five directions for Moonshot Media and five for Moonshot Studios. Each one is a complete kit: logo system, animated logo, colour, typography, office stationery, merchandise, digital and signage. Open a kit to see it applied.</p>
  <h2 id="media">MOONSHOT MEDIA</h2><div class="ovg">${KITS.filter(k=>k.grp==='Media').map(c).join('')}</div>
  <h2 id="studios">MOONSHOT STUDIOS</h2><div class="ovg">${KITS.filter(k=>k.grp==='Studios').map(c).join('')}</div></section>`;
  document.title='Moonshot — Premium Brand Kits';
}
function kit(k){
  const st=document.documentElement.style,D=k.t.dark,Lt=k.t.light,B=k.t.brand;
  Object.entries({bg:D.bg,fg:D.fg,paper:Lt.bg,ink:Lt.fg,acc:k.m.acc,fd:`"${k.f.d}"`,fb:`"${k.f.b}"`,dw:k.f.dw,ds:k.f.di?'italic':'normal',dx:k.f.dx?'125%':'100%'}).forEach(([a,b])=>st.setProperty('--'+a,b));
  subnav.innerHTML=['Logo system:logo','Logo in motion:motion','Colour & type:colour','Office stationery:stationery','Merchandise:merch','Digital:digital','Signage & set:signage'].map(s=>{const[a,b]=s.split(':');return`<a href="#${b}">${a}</a>`}).join('');
  const M=mockKit(k),pl=k.hz?'primary':'primary';
  const lt=(svg,bg,fg,cap,cls='')=>`<div class="tile ${cls.includes('wide')?'wide':''}" style="background:${bg};color:${fg}"><div class="pad ${cls}">${svg}</div><div class="cap"><span>${cap}</span><button data-dl>SVG</button></div></div>`;
  const acD=D.ac,dl=(t,tone,bg,fg,cap,cls)=>lt(logo(k,t,tone),bg,fg,cap,cls);
  const logos=dl('primary',D,D.bg,D.fg,'Primary · on dark')+dl('primary',Lt,Lt.bg,Lt.fg,'Primary · on light')+dl('primary',B,B.bg,B.fg,'Primary · on brand colour')
    +dl('alt',D,D.bg,D.fg,'Stacked · on dark')+dl('alt',Lt,Lt.bg,Lt.fg,'Stacked · on light')+(k.hz?dl('word',D,D.bg,D.fg,'Wordmark only'):dl('alt',B,B.bg,B.fg,'Stacked · on brand colour'))
    +dl('mark',D,D.bg,D.fg,'Monogram · on dark','mk')+dl('mark',Lt,Lt.bg,Lt.fg,'Monogram · on light','mk')+dl('mark',B,B.bg,B.fg,'Monogram · on brand colour','mk')
    +dl('primary',MONO.b,'#fff','#111','One colour · black')+dl('primary',MONO.w,'#111','#fff','One colour · white')+dl('mark',MONO.w,'#111','#fff','Monogram · one colour','mk');
  const sw=k.pal.map(([nm,h,role],i)=>{const rgb=hex2(h),foil=i===1&&FOILCSS[k.foil];return `<div class="sw" data-copy="${h}"><div class="c" style="background:${foil||h};color:${hexL(h)>150?'#111':'#fff'}">${nm}</div><div class="m"><b>${h}</b>RGB ${rgb.join(' ')}<br>CMYK ${cmyk(rgb)}<br><em>${role}</em></div></div>`}).join('');
  const sec=(id,n,title,lede,body,alt)=>`<section class="sec ${alt?'alt':''}" id="${id}"><div class="sh"><b>${n}</b><h2>${csk(k,title)}</h2></div><p class="lede">${lede}</p>${body}</section>`;
  const shot=(svg,items)=>`<div class="shot">${svg}</div><div class="shotcap">${items.map(x=>`<span>${x}</span>`).join('')}</div>`;
  app.innerHTML=`
  <section class="hero"><svg class="pat" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><g opacity=".07">${dev(k,D.fg)}</g></svg>
   <div><div class="kick">Kit ${n2(k)} / 10 · ${k.full} · ${k.style}</div><h1>${csk(k,k.full.toUpperCase())}</h1><p>${k.concept}</p><div class="chips"><span>${k.f.n}</span><span>${k.finish==='foil'?'Hot-foil finish':k.finish==='emboss'?'Blind emboss finish':'Flat ink finish'}</span><span>${k.pal.slice(0,3).map(p=>p[0]).join(' / ')}</span></div></div>
   <div class="hl" id="hl">${logo(k,k.hz?'alt':'primary',D,1)}</div></section>
  ${sec('logo','01','LOGO SYSTEM','Primary lockup, stacked version, monogram, and one-colour versions for stamping, engraving and single-ink print.',`<div class="grid">${logos}</div>
   <div class="rules"><div class="rule"><h4>Clear space &amp; minimum size</h4><div class="clear">${logo(k,'primary',Lt)}</div>Keep clear space equal to half the monogram’s height on every side. Minimum size: monogram 20 px / 8 mm; primary lockup 120 px / 32 mm wide.</div>
   <div class="rule"><h4>Do not</h4><div class="donts">${[['d1','Stretch or squash'],['d2','Rotate'],['d3','Recolour'],['d4','Use on low contrast']].map(([c,t])=>`<div class="dont ${c}">${logo(k,'primary',Lt)}${t}</div>`).join('')}</div></div></div>`)}
  ${sec('motion','02','LOGO IN MOTION',k.motion,`<div class="grid"><div class="tile wide" style="background:${D.bg};color:${D.fg}"><div class="pad" id="sting" style="min-height:300px"></div><div class="cap"><span>Intro animation</span><span><button id="replay">Replay</button> <button data-dl>SVG</button></span></div></div>
   <div class="tile" style="background:${Lt.bg};color:${Lt.fg}"><div class="pad mk">${logo(k,'mark',Lt,1)}</div><div class="cap"><span>Monogram loop · light</span><button data-dl>SVG</button></div></div>
   <div class="tile" style="background:${B.bg};color:${B.fg}"><div class="pad mk">${logo(k,'mark',B,1)}</div><div class="cap"><span>Monogram loop · brand colour</span><button data-dl>SVG</button></div></div></div>`,1)}
  ${sec('colour','03','COLOUR & TYPE','Click a swatch to copy its HEX value.',`<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(200px,1fr))">${sw}</div>
   <div class="type"><div class="spec"><small>Display · ${k.f.n.split(' · ')[0]}</small><div class="aa dsp">Aa</div><div class="dsp" style="font-size:30px;line-height:1.15">${csk(k,k.grp==='Media'?'TAKE A QUICK COMMERCIAL BREAK.':'MOONSHOT STUDIOS.')}</div></div>
   <div class="spec"><small>Text · ${k.f.n.split(' · ')[1]}</small><div class="aa" style="font-weight:400">Aa</div><p style="font-size:16px;line-height:1.65">${k.grp==='Media'?'Take a quick commercial break and watch our ads. If you’d like to discuss a potential project or collaboration, email contact@moonshotmedia.in.':'[Two or three sentences about the studio go here: what it makes, who for, and how to get in touch.]'}</p></div>
   <div class="spec"><small>Scale</small>${[['Display',44,1],['Heading',28,1],['Subhead',19,0],['Body',15,0],['Caption',11.5,0]].map(([l,z,dd])=>`<div style="display:flex;gap:14px;align-items:baseline;padding:9px 0;border-top:1px solid color-mix(in srgb,var(--ink) 12%,transparent)"><span style="font:11px 'DM Mono',monospace;opacity:.55;width:78px;flex:none">${l} ${z}</span><span class="${dd?'dsp':''}" style="font-size:${z}px;line-height:1.1">${dd?csk(k,'MOONSHOT'):'Moonshot'}</span></div>`).join('')}</div></div>`)}
  ${sec('stationery','04','OFFICE STATIONERY','Letterhead, envelope, business cards, notebook, pen and seal, then the paperwork: folder, invoice, compliment slip and crew pass.',shot(M.stat1,['Letterhead A4','Envelope DL','Business cards','Notebook','Pen','Seal'])+shot(M.cards,['Business card · front','Business card · back'])+shot(M.stat2,['Presentation folder','Invoice','Compliment slip','Crew pass + lanyard']),1)}
  ${sec('merch','05','MERCHANDISE','Crew wear and gifts.',shot(M.merch1,['T-shirt','Tote bag','Cap','Swing tag'])+shot(M.merch2,['Mug','Bottle','Phone case','Gift box + tape','Pin badges','Stickers']))}
  ${sec('digital','06','DIGITAL','Website header, social profile and app icons.',shot(M.digital,['Website','Social profile','App icons']),1)}
  ${sec('signage','07','SIGNAGE & SET','Reception wall, door plaque, and the kit on set.',shot(M.wall,['Reception sign','Desk','Door plaque'])+shot(M.set,['Clapperboard','Crew pass','Lens cap','Gaffer tape']))}`;
  const play=()=>{document.getElementById('sting').innerHTML=logo(k,k.hz?'alt':'primary',D,1)};play();
  document.getElementById('replay').onclick=play;
  document.title=`Moonshot — ${n2(k)} ${k.name}`;
}
function go(n,keep){cur=n;n?kit(KITS[n-1]):overview();document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',+t.dataset.go===n));history.replaceState(null,'',n?'#k'+n:'#all');if(!keep)scrollTo(0,0)}
const toast=t=>{const el=document.getElementById('toast');el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),1400)};
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');if(g){go(+g.dataset.go);return}
  const s=e.target.closest('[data-copy]');if(s){navigator.clipboard&&navigator.clipboard.writeText(s.dataset.copy);toast('Copied '+s.dataset.copy);return}
  const d=e.target.closest('[data-dl]');
  if(d){const tl=d.closest('.tile'),svg=tl.querySelector('.pad svg');if(!svg)return;
    const src=svg.outerHTML.replace(/(<svg[^>]*>)/,'$1'+document.querySelector('#defs defs').outerHTML);
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([src],{type:'image/svg+xml'}));
    a.download=`moonshot-${n2(KITS[cur-1])}-${tl.querySelector('.cap span').textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-')}.svg`;a.click();toast('SVG saved')}
});
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight')go(Math.min(10,cur+1));if(e.key==='ArrowLeft')go(Math.max(0,cur-1))});
(async()=>{
  const fonts=['500 56px "Bodoni Moda"','300 40px Jost','500 12px Jost','400 12px Jost','800 36px Archivo','400 12px Archivo','italic 300 86px "Cormorant Garamond"','600 38px Cinzel','400 12px Cinzel','400 48px "Poiret One"','600 72px Outfit','400 15px Outfit','400 86px "Archivo Black"','700 12px "Space Mono"','400 12px "EB Garamond"','400 12px Inter','600 12px Inter'];
  await Promise.all(fonts.map(f=>document.fonts.load(f,'MOONSHOTmedia').catch(()=>{})));
  try{await document.fonts.load('800 36px Archivo','MOONSHOT')}catch(e){}
  buildTabs();const h=/k(\d+)/.exec(location.hash);go(h?Math.min(10,+h[1]):0,true);
})();
