/* Moonshot premium brand kits: helpers, logos, kit data */
const NS='xmlns="http://www.w3.org/2000/svg"';
const cv=document.createElement('canvas').getContext('2d');
const mw=(s,size,fam,o={})=>{cv.font=`${o.i?'italic ':''}${o.w||400} ${o.x?'expanded ':''}${size}px ${fam}`;return cv.measureText(s).width+(o.ls||0)*s.length};
const tx=(s,x,y,size,fill,fam,o={})=>`<text x="${x}" y="${y}" font-family="${fam}" font-size="${size}" font-weight="${o.w||400}" fill="${fill}"${o.i?' font-style="italic"':''}${o.x?' style="font-stretch:125%"':''}${o.ls?` letter-spacing="${o.ls}"`:''}${o.a?` text-anchor="${o.a}"`:''}${o.o?` opacity="${o.o}"`:''}${o.e||''}>${s}${o.c||''}</text>`;
const S=(w,h,i)=>`<svg ${NS} viewBox="0 0 ${Math.ceil(w)} ${Math.ceil(h)}">${i}</svg>`;
const put=(svg,x,y,w,h,al='xMidYMid')=>svg.replace('<svg ',`<svg x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="${al} meet" `);
let uid=0;
const DA=' pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"';
const dAn=(d,b=0)=>`<animate attributeName="stroke-dashoffset" from="1" to="0" dur="${d}s" begin="${b}s" fill="freeze"/>`;
const FA=' opacity="0"';
const fAn=(b,d=.8)=>`<animate attributeName="opacity" from="0" to="1" dur="${d}s" begin="${b}s" fill="freeze"/>`;
const spin=(cx,cy,d,dir=1)=>`<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="${360*dir} ${cx} ${cy}" dur="${d}s" repeatCount="indefinite"/>`;
const cres=(cx,cy,R,fill,rot=0)=>`<path transform="translate(${cx} ${cy}) rotate(${rot}) scale(${R/30})" d="M18 -28.28A30 30 0 1 0 18 28.28A34 34 0 0 1 18 -28.28Z" fill="${fill}"/>`;
const DOT={M:'10001110111010110101100011000110001',O:'01110100011000110001100011000101110',N:'10001110011010110011100011000110001',S:'01111100001000001110000010000111110',H:'10001100011000111111100011000110001',T:'11111001000010000100001000010000100',U:'10001100011000110001100011000101110',D:'11110100011000110001100011000111110',I:'11111001000010000100001000010011111'};
const dots=(str,cell,r,x0=0,y0=0,on=1)=>{let d='';[...str].forEach((ch,n)=>{const b=DOT[ch];for(let i=0;i<35;i++)if((b[i]==='1')===!!on){const x=x0+(n*6+i%5)*cell+cell/2,y=y0+Math.floor(i/5)*cell+cell/2;d+=`M${x-r} ${y}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0`}});return d};
const ML={M:[30,'M0 40V0L15 24L30 0V40'],O:[40,'M40 20A20 20 0 1 1 0 20A20 20 0 1 1 40 20Z'],N:[26,'M0 40V0L26 40V0'],S:[24,'M23 8C23 3 18 0 12 0C5 0 1 4 1 10C1 23 24 17 24 30C24 36 19 40 12 40C5 40 0 36 0 31'],H:[26,'M0 0V40M0 20H26M26 0V40'],T:[28,'M0 0H28M14 0V40'],U:[26,'M0 0V27A13 13 0 0 0 26 27V0'],D:[30,'M0 0V40H10A20 20 0 0 0 10 0Z'],I:[0,'M0 0V40']};
const mono=(str,gap,an,b0=0)=>{let x=0,i='',xs=[];[...str].forEach((ch,n)=>{const[w,d]=ML[ch];xs.push(x);i+=`<path transform="translate(${x} 0)" d="${d}"${an?DA:''}>${an?dAn(.7,b0+n*.14):''}</path>`;x+=w+gap});return{w:x-gap,i,xs}};

/* ---------- logos: each kit has mark(c,an) -> inner of 100x100, word(c,an) -> {w,h,i} ---------- */
const LG={
maison:{mark:(c,an)=>`<circle cx="50" cy="50" r="45" fill="none" stroke="${c.ac}" stroke-width="1.3"${an?DA:''}>${an?dAn(1.6):''}</circle><circle cx="50" cy="50" r="41" fill="none" stroke="${c.ac}" stroke-width=".5" opacity=".7"/>${tx('M',50,70.5,60,c.fg,'Bodoni Moda',{w:500,a:'middle',e:an?FA:'',c:an?fAn(.7):''})}<g>${an?spin(50,50,9):''}<circle cx="81.8" cy="18.2" r="4.2" fill="${c.ac}"/></g>`,
 word:(c,an)=>{const F='Bodoni Moda',W=mw('MOONSHOT',56,F,{w:500,ls:8})-8,wm=mw('MEDIA',12,'Jost',{w:500,ls:9})-9,x=(W-wm)/2;
  return{w:W,h:98,i:tx('MOONSHOT',0,56,56,c.fg,F,{w:500,ls:8,e:an?FA:'',c:an?fAn(.3,1.2):''})+`<g${an?FA:''}>${an?fAn(1.2):''}<path d="M0 86H${x-16}M${x+wm+16} 86H${W}" stroke="${c.ac}" stroke-width="1"/>${tx('MEDIA',x,90.5,12,c.ac,'Jost',{w:500,ls:9})}</g>`}}},
trajectory:{mark:(c,an)=>`<path d="M14 86C15 52 33 31 55.5 28.5" fill="none" stroke="${c.fg}" stroke-width="1.8" stroke-linecap="round"${an?DA:''}>${an?dAn(1.2,.2):''}</path><circle cx="72.5" cy="27.5" r="17" fill="none" stroke="${c.ac}" stroke-width="1.8"${an?DA:''}>${an?dAn(1,1.2):''}</circle><circle cx="72.5" cy="27.5" r="11.5" fill="none" stroke="${c.ac}" stroke-width=".6" opacity=".8"/><circle cx="14" cy="86" r="3.8" fill="${c.fg}">${an?'<animate attributeName="r" values="3.8;5.4;3.8" dur="2.4s" repeatCount="indefinite"/>':''}</circle>`,
 word:(c,an)=>{const W=mw('MOONSHOT',40,'Jost',{w:300,ls:12})-12;return{w:W,h:74,i:tx('MOONSHOT',0,40,40,c.fg,'Jost',{w:300,ls:12,e:an?FA:'',c:an?fAn(1.4,1):''})+tx('MEDIA',1,68,12.5,c.ac,'Jost',{w:500,ls:11,e:an?FA:'',c:an?fAn(2):''})+`<path d="M${mw('MEDIA',12.5,'Jost',{w:500,ls:11})+8} 64H${W}" stroke="${c.ac}" stroke-width=".8" opacity=".6"/>`}}},
doublem:{mark:(c,an)=>`<rect width="100" height="100" fill="${c.ac}"/><path d="M14 82V20L32 54L50 20L68 54L86 20V82M50 20V82" fill="none" stroke="${c.on}" stroke-width="9.5" stroke-linejoin="miter" stroke-miterlimit="6"${an?DA:''}>${an?dAn(1.8):''}</path>`,
 word:(c,an)=>{const o={w:800,x:1,ls:-.6},W=mw('MOONSHOT',36,'Archivo',o);return{w:W,h:74,i:`<g${an?FA:''}>${an?fAn(1):''}${tx('MOONSHOT',0,32,36,c.fg,'Archivo',o)}${tx('MEDIA',0,70,36,c.fg,'Archivo',o)}<rect x="${mw('MEDIA',36,'Archivo',o)+8}" y="60" width="10" height="10" fill="${c.ac===c.bg?c.fg:c.ac}"/></g>`}}},
halo:{mark:(c,an)=>`<circle cx="57" cy="43" r="36" fill="none" stroke="${c.ac}" stroke-width="1.2"${an?DA:''}>${an?dAn(1.6):''}</circle>${tx('M',44,82,92,c.fg,'Cormorant Garamond',{w:300,i:1,a:'middle',e:an?FA:'',c:an?fAn(.6):''})}<g>${an?spin(57,43,10):''}<circle cx="82.5" cy="17.5" r="3.2" fill="${c.ac}"/></g>`,
 word:(c,an)=>{const F='Cormorant Garamond',o={w:300,i:1},W=mw('Moonshot',86,F,o),cx=mw('M',86,F,o)+mw('oo',86,F,o)/2+3;
  return{w:W+6,h:114,i:`<circle cx="${cx}" cy="62" r="45" fill="none" stroke="${c.ac}" stroke-width="1.1"${an?DA:''}>${an?dAn(1.8):''}</circle><g>${an?spin(cx,62,12):''}<circle cx="${cx+31.8}" cy="30.2" r="3" fill="${c.ac}"/></g>`+tx('Moonshot',2,84,86,c.fg,F,{...o,e:an?FA:'',c:an?fAn(.8,1.2):''})+tx('MEDIA',W+4,108,11,c.ac,'Jost',{w:500,ls:8,a:'end',e:an?FA:'',c:an?fAn(1.8):''})}}},
crest:{mark:(c,an)=>{const i=++uid;let rays='';for(let n=0;n<28;n++){const a=n*Math.PI*2/28,r1=n%2?17:15,r2=n%2?25:29;rays+=`M${(50+Math.cos(a)*r1).toFixed(2)} ${(50+Math.sin(a)*r1).toFixed(2)}L${(50+Math.cos(a)*r2).toFixed(2)} ${(50+Math.sin(a)*r2).toFixed(2)}`}
  return `<circle cx="50" cy="50" r="48" fill="none" stroke="${c.fg}" stroke-width="1.3"/><circle cx="50" cy="50" r="45.6" fill="none" stroke="${c.fg}" stroke-width=".5"/><circle cx="50" cy="50" r="32.5" fill="none" stroke="${c.fg}" stroke-width=".6"/><defs><path id="ct${i}" d="M14.5 50A35.5 35.5 0 0 1 85.5 50"/><path id="cb${i}" d="M8.5 50A41.5 41.5 0 0 0 91.5 50"/></defs><g font-family="Cinzel, serif" fill="${c.fg}" text-anchor="middle">${an?spin(50,50,40):''}<text font-size="8.2" font-weight="600" letter-spacing="2.4"><textPath href="#ct${i}" startOffset="50%">MOONSHOT</textPath></text><text font-size="6.6" letter-spacing="3.6"><textPath href="#cb${i}" startOffset="50%">✦ ${c.sub||'MEDIA'} ✦</textPath></text></g><path d="${rays}" stroke="${c.ac}" stroke-width=".7" fill="none">${an?spin(50,50,24,-1):''}</path>${cres(46.5,50,10.5,c.ac,-24)}`},
 word:(c,an)=>{const W=mw('MOONSHOT',38,'Cinzel',{w:600,ls:5})-5,wm=mw(c.sub||'MEDIA',12.5,'Cinzel',{ls:12});return{w:W,h:78,i:`<g${an?FA:''}>${an?fAn(.6,1.2):''}${tx('MOONSHOT',0,38,38,c.fg,'Cinzel',{w:600,ls:5})}${tx(c.sub||'MEDIA',1,72,12.5,c.ac,'Cinzel',{ls:12})}<path d="M${wm+6} 67.5H${W}" stroke="${c.ac}" stroke-width=".8"/></g>`}}},
marquee:{mark:(c,an)=>`<rect x="3" y="3" width="94" height="94" rx="18" fill="none" stroke="${c.fg}" stroke-width="1.6" opacity=".9"/><path d="${dots('M',10,3.1,25,15,0)}" fill="${c.fg}" opacity=".16"/><path d="${dots('M',10,3.3,25,15)}" fill="${c.fg}">${an?'<animate attributeName="opacity" values="1;.35;1;1" keyTimes="0;.08;.16;1" dur="2.6s" repeatCount="indefinite"/>':''}</path><circle cx="50" cy="40" r="3.6" fill="${c.ac}"/>`,
 word:(c,an)=>{const C=6,W=47*C,sw=41*3;let i=`<path d="${dots('MOONSHOT',C,2.1,0,0,0)}" fill="${c.fg}" opacity=".13"/>`;
  [...'MOONSHOT'].forEach((ch,n)=>{i+=`<path d="${dots(ch,C,2.35,n*6*C,0)}" fill="${n===2?c.ac:c.fg}"${an?FA:''}>${an?fAn(.15+n*.16,.25):''}</path>`});
  return{w:W,h:76,i:i+`<path d="${dots('STUDIOS',3,1.15,W-sw,54)}" fill="${c.ac}"${an?FA:''}>${an?fAn(1.7,.5):''}</path><path d="M0 64.5H${W-sw-12}" stroke="${c.fg}" stroke-width=".8" opacity=".35"/>`}}},
deco:{mark:(c,an)=>{let rays='';for(let n=0;n<=14;n++){const a=Math.PI*(1+n/14),r2=n%2?30:35;rays+=`M${(50+Math.cos(a)*17).toFixed(2)} ${(52+Math.sin(a)*17).toFixed(2)}L${(50+Math.cos(a)*r2).toFixed(2)} ${(52+Math.sin(a)*r2).toFixed(2)}`}
  return `<path d="M10 97V50A40 40 0 0 1 90 50V97" fill="none" stroke="${c.ac}" stroke-width="1.4"${an?DA:''}>${an?dAn(1.6):''}</path><path d="M14.5 97V50A35.5 35.5 0 0 1 85.5 50V97" fill="none" stroke="${c.ac}" stroke-width=".6"/><path d="${rays}" stroke="${c.ac}" stroke-width=".9" fill="none">${an?'<animate attributeName="opacity" values=".25;1;.25" dur="2.8s" repeatCount="indefinite"/>':''}</path><circle cx="50" cy="52" r="12.5" fill="${c.fg}"/><circle cx="55" cy="49" r="10.5" fill="${c.bg}"/><path d="M22 66H78M28 72H72M35 78H65M42 84H58" stroke="${c.ac}" stroke-width="1"/><path d="M50 88.5l3 4.2-3 4.2-3-4.2z" fill="${c.ac}"/>`},
 word:(c,an)=>{const W=mw('MOONSHOT',48,'Poiret One',{ls:8})-8,ws=mw('STUDIOS',13.5,'Poiret One',{ls:14})-14,x=(W-ws)/2;return{w:W,h:92,i:`<g${an?FA:''}>${an?fAn(.8,1.2):''}${tx('MOONSHOT',0,48,48,c.fg,'Poiret One',{ls:8})}<path d="M0 80H${x-24}M${x+ws+24} 80H${W}" stroke="${c.ac}" stroke-width=".9"/><path d="M${x-14} 76l3 4-3 4-3-4zM${x+ws+14} 76l3 4-3 4-3-4z" fill="${c.ac}"/>${tx('STUDIOS',x,84.5,13.5,c.ac,'Poiret One',{ls:14,w:400})}</g>`}}},
overlap:{mark:(c,an)=>{const R=27,d=30,h=Math.sqrt(R*R-d*d/4),a=50-d/2,b=50+d/2;return `<circle cx="${a}" cy="50" r="${R-4.5}" fill="none" stroke="${c.fg}" stroke-width="9"/><circle cx="${b}" cy="50" r="${R-4.5}" fill="none" stroke="${c.fg}" stroke-width="9">${an?`<animate attributeName="cx" values="${b+26};${b};${b}" keyTimes="0;.35;1" dur="3.4s" repeatCount="indefinite" calcMode="spline" keySplines=".2 .8 .2 1;0 0 1 1"/>`:''}</circle><path d="M50 ${50-h}A${R} ${R} 0 0 1 50 ${50+h}A${R} ${R} 0 0 1 50 ${50-h}Z" fill="${c.ac}">${an?'<animate attributeName="opacity" values="0;0;1;1" keyTimes="0;.3;.42;1" dur="3.4s" repeatCount="indefinite"/>':''}</path>`},
 word:(c,an)=>{const F='Outfit',z=72,o={w:600,ls:-1},wm_=mw('m',z,F,o),D=z*.575,R=D/2,sw=z*.118,cy=70-R+.8,x1=wm_+R+1.5,dd=D*.6,x2=x1+dd,h=Math.sqrt(R*R-dd*dd/4),mx=(x1+x2)/2,xn=x2+R+3.5,W=xn+mw('nshot',z,F,o);
  return{w:W,h:100,i:tx('m',0,70,z,c.fg,F,o)+`<circle cx="${x1}" cy="${cy}" r="${R-sw/2}" fill="none" stroke="${c.fg}" stroke-width="${sw}"/><circle cx="${x2}" cy="${cy}" r="${R-sw/2}" fill="none" stroke="${c.fg}" stroke-width="${sw}">${an?`<animate attributeName="cx" values="${x2+16};${x2}" dur="1.2s" fill="freeze" calcMode="spline" keySplines=".2 .8 .2 1"/>`:''}</circle><path d="M${mx} ${cy-h}A${R} ${R} 0 0 1 ${mx} ${cy+h}A${R} ${R} 0 0 1 ${mx} ${cy-h}Z" fill="${c.ac}"${an?FA:''}>${an?fAn(1.1,.5):''}</path>`+tx('nshot',xn,70,z,c.fg,F,o)+tx('studios',W-1,95,15,c.fg,F,{w:400,ls:7,a:'end',o:.75})}}},
monoline:{mark:(c,an)=>`<rect x="9" y="9" width="82" height="82" fill="none" stroke="${c.fg}" stroke-width="1.5"${an?DA:''}>${an?dAn(1.6):''}</rect><g transform="translate(27.5 22) scale(1.5)" fill="none" stroke="${c.fg}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M0 40V0L15 24L30 0V40"${an?DA:''}>${an?dAn(1.2,.8):''}</path></g><circle cx="91" cy="9" r="9" fill="${c.bg}" stroke="${c.ac}" stroke-width="1.6"/><circle cx="91" cy="9" r="3" fill="${c.ac}"/>`,
 word:(c,an)=>{const a=mono('MOONSHOT',17,an),b=mono('STUDIOS',26,an,1.3),sc=.3,ox=a.xs[6]+20;return{w:a.w+8,h:80,i:`<g transform="translate(4 4)" fill="none" stroke="${c.fg}" stroke-linecap="round" stroke-linejoin="round"><g stroke-width="2.5">${a.i}</g><circle cx="${ox+7.5}" cy="12.5" r="4.6" fill="${c.ac}" stroke="none"/><g transform="translate(${(a.w-b.w*sc)/2} 58) scale(${sc})" stroke-width="5">${b.i}</g></g>`}}},
block:{mark:(c,an)=>`<rect width="100" height="100" fill="${c.fg}"/>${tx('M',46,84,88,c.bg,'Archivo Black',{a:'middle'})}<circle cx="83" cy="17" r="9" fill="${c.ac}">${an?'<animate attributeName="r" values="9;11.5;9" dur="1.6s" repeatCount="indefinite"/>':''}</circle>`,
 word:(c,an)=>{const F='Archivo Black',z=86,n=mw('MOON',z,F),f=184/n,ox=11+f*(mw('MO',z,F)+mw('O',z,F)/2);
  return{w:252,h:176,i:`<rect width="206" height="176" fill="${c.fg}"/><text x="11" y="84" font-family="${F}" font-size="${z}" fill="${c.bg}" textLength="184" lengthAdjust="spacingAndGlyphs">MOON</text><text x="11" y="161" font-family="${F}" font-size="${z}" fill="${c.bg}" textLength="184" lengthAdjust="spacingAndGlyphs">SHOT</text><ellipse cx="${ox}" cy="53" rx="${z*.135*f}" ry="${z*.215}" fill="${c.ac}">${an?'<animate attributeName="opacity" values="1;.25;1" dur="1.6s" repeatCount="indefinite"/>':''}</ellipse><rect x="207.5" y="1.5" width="43" height="173" fill="none" stroke="${c.fg}" stroke-width="3"/><text transform="translate(223 88) rotate(90)" text-anchor="middle" font-family="${F}" font-size="18" letter-spacing="7" fill="${c.fg}">STUDIOS</text>`}}}
};
function logo(k,type,c,an){
  c={...c,sub:k.sub};const g=LG[k.lg];
  if(type==='mark')return S(100,100,g.mark(c,an));
  const w=g.word(c,an);
  if(type==='word'||(type==='primary'&&!k.hz))return S(w.w,w.h,w.i);
  if(type==='primary'){const sc=(k.hs||66)/w.h;return S(120+w.w*sc,100,g.mark(c,an)+`<g transform="translate(120 ${(100-w.h*sc)/2}) scale(${sc})">${w.i}</g>`)}
  const sc=Math.min(250/w.w,1.2),W=Math.max(110,w.w*sc);return S(W,116+w.h*sc,`<g transform="translate(${(W-100)/2} 0)">${g.mark(c,an)}</g><g transform="translate(${(W-w.w*sc)/2} 116) scale(${sc})">${w.i}</g>`);
}
const hexL=h=>{if(!h||h[0]!=='#')return 60;const n=parseInt(h.slice(1),16);return .299*(n>>16)+.587*(n>>8&255)+.114*(n&255)};
const shade=(h,p)=>{const n=parseInt(h.slice(1),16),f=v=>Math.max(0,Math.min(255,Math.round(v+p))).toString(16).padStart(2,'0');return'#'+f(n>>16)+f(n>>8&255)+f(n&255)};
const MONO={w:{bg:'#111111',fg:'#ffffff',ac:'#ffffff',on:'#111111'},b:{bg:'#ffffff',fg:'#111111',ac:'#111111',on:'#ffffff'}};

/* device (brand pattern) drawn into a 400x300 box */
function dev(k,col){let s='';const st=`fill="none" stroke="${col}"`;
  switch(k.lg){
  case'maison':for(let r=14;r<520;r+=13)s+=`<circle cx="400" cy="300" r="${r}" ${st} stroke-width=".8"/>`;break;
  case'trajectory':for(let i=0;i<16;i++)s+=`<path d="M${-120+i*38} 310C${-110+i*38} 160 ${0+i*38} 60 ${150+i*38} 30" ${st} stroke-width=".9"/>`;break;
  case'doublem':for(let j=-1;j<7;j++){let p='';for(let i=0;i<=10;i++)p+=`${i*44-10},${j*58+(i%2?40:0)} `;s+=`<polyline points="${p}" ${st} stroke-width="14"/>`}break;
  case'halo':for(let j=0;j<4;j++)for(let i=0;i<6;i++)s+=`<circle cx="${i*84+(j%2)*42}" cy="${j*96+10}" r="62" ${st} stroke-width=".8"/>`;break;
  case'crest':for(let n=0;n<72;n++){const a=n*Math.PI/36,r1=n%2?26:18;s+=`<path d="M${200+Math.cos(a)*r1} ${150+Math.sin(a)*r1}L${200+Math.cos(a)*420} ${150+Math.sin(a)*420}" ${st} stroke-width=".7"/>`}s+=`<circle cx="200" cy="150" r="14" ${st}/>`;break;
  case'marquee':for(let j=0;j<26;j++)for(let i=0;i<34;i++)s+=`<circle cx="${i*12+6}" cy="${j*12+6}" r="${(i*7+j*3)%11===0?3.2:1.9}" fill="${col}"/>`;break;
  case'deco':for(let j=0;j<8;j++)for(let i=-1;i<8;i++){const x=i*60+(j%2)*30,y=j*30+30;s+=`<path d="M${x-30} ${y}a30 30 0 0 1 60 0M${x-21} ${y}a21 21 0 0 1 42 0M${x-12} ${y}a12 12 0 0 1 24 0" ${st} stroke-width=".9"/>`}break;
  case'overlap':for(let j=0;j<4;j++)for(let i=0;i<5;i++){const x=i*110+(j%2)*55-20,y=j*84+30;s+=`<circle cx="${x}" cy="${y}" r="30" ${st} stroke-width="5"/><circle cx="${x+34}" cy="${y}" r="30" ${st} stroke-width="5"/>`}break;
  case'monoline':s+=`<g transform="translate(-30 -40) scale(6.4)" ${st} stroke-width=".28" stroke-linejoin="round">${mono('MOON',6).i}</g>`;break;
  default:for(let i=-6;i<12;i++)s+=`<path d="M${i*60} 320L${i*60+320} 0" ${st} stroke-width="24"/>`}
  return s}

const G='url(#gold)',CU='url(#copper)',CR='url(#chrome)';
const KITS=[
{id:1,grp:'Media',sub:'MEDIA',lg:'maison',name:'Maison',style:'Serif wordmark + orbit monogram',
 concept:'A high-contrast Didone wordmark with room to breathe, and a monogram where a single gold moon circles the M. Built to be stamped in foil on black cotton paper.',
 f:{d:'Bodoni Moda',dw:500,b:'Jost',n:'Bodoni Moda · Jost'},finish:'foil',foil:G,
 t:{dark:{bg:'#0B0B0C',fg:'#F3EEE4',ac:G,on:'#0B0B0C'},light:{bg:'#F3EEE4',fg:'#0B0B0C',ac:'#A07C2C',on:'#F3EEE4'},brand:{bg:'#C6A15B',fg:'#0B0B0C',ac:'#0B0B0C',on:'#C6A15B'}},
 pal:[['Noir','#0B0B0C','Backgrounds, lettering'],['Foil Gold','#C6A15B','Hot-foil stamping, rules'],['Ivory','#F3EEE4','Cotton paper'],['Antique Gold','#A07C2C','Gold as ink on light paper'],['Stone','#8A8377','Captions']],
 m:{paper:'#F3EEE4',dark:'#0B0B0C',brand:'#16161A',ink:'#0B0B0C',acc:'#A07C2C',surf:'#1B1A19',surf2:'#E6DFD2',pen:'#0B0B0C',tee:'#0B0B0C',tote:'#F3EEE4',rx:3},
 v:{card:0,letter:0,env:2,note:0,tee:0,tote:0,arr:0},
 motion:'The ring draws itself in one sweep, the M fades in, and the gold moon keeps a slow orbit (9 s per turn). The wordmark fades up last.'},
{id:2,grp:'Media',sub:'MEDIA',lg:'trajectory',hz:1,hs:60,name:'Trajectory',style:'Fine-line symbol + light sans',
 concept:'One line leaves the ground and arrives at the moon. Hairline-weight drawing, wide-spaced light capitals and a blind emboss: nothing shouts.',
 f:{d:'Jost',dw:300,b:'Jost',n:'Jost Light · Jost'},finish:'emboss',foil:'#B88A44',up:1,
 t:{dark:{bg:'#0E3B33',fg:'#F1EBDD',ac:'#D0A765',on:'#0E3B33'},light:{bg:'#F1EBDD',fg:'#0E3B33',ac:'#A9793A',on:'#F1EBDD'},brand:{bg:'#B88A44',fg:'#0A1F1B',ac:'#0A1F1B',on:'#B88A44'}},
 pal:[['Emerald','#0E3B33','Backgrounds, lettering'],['Brass','#B88A44','The moon, fine rules'],['Cream','#F1EBDD','Paper'],['Sage','#8FA89B','Secondary surfaces'],['Deep Pine','#0A1F1B','Text on brass']],
 m:{paper:'#F1EBDD',dark:'#0E3B33',brand:'#0E3B33',ink:'#0E3B33',acc:'#A9793A',surf:'#D9D2C2',surf2:'#10332D',pen:'#B88A44',tee:'#F1EBDD',tote:'#0E3B33',rx:2},
 v:{card:3,letter:2,env:0,note:2,tee:1,tote:2,arr:1},
 motion:'The line travels from the ground dot to the moon (1.2 s), then the ring closes. The ground dot keeps a slow pulse as the loader.'},
{id:3,grp:'Media',sub:'MEDIA',lg:'doublem',hz:1,hs:70,name:'Double M',style:'Swiss monogram · MM in a square',
 concept:'Moonshot Media: two capital M’s sharing one stem, cut into a cobalt square. A hard, systematic mark that still reads at 16 pixels.',
 f:{d:'Archivo',dw:800,dx:1,b:'Archivo',n:'Archivo Expanded ExtraBold · Archivo'},finish:'ink',foil:'#1F3BFF',up:1,
 t:{dark:{bg:'#16171B',fg:'#FFFFFF',ac:'#1F3BFF',on:'#FFFFFF'},light:{bg:'#FFFFFF',fg:'#16171B',ac:'#1F3BFF',on:'#FFFFFF'},brand:{bg:'#1F3BFF',fg:'#FFFFFF',ac:'#FFFFFF',on:'#1F3BFF'}},
 pal:[['Cobalt','#1F3BFF','Primary. The square'],['Graphite','#16171B','Lettering, dark surfaces'],['White','#FFFFFF','Paper'],['Fog','#E9EAEE','Panels'],['Signal','#FF4D2E','Rare: alerts, edition marks']],
 m:{paper:'#FFFFFF',dark:'#16171B',brand:'#1F3BFF',ink:'#16171B',acc:'#1F3BFF',surf:'#E3E5EA',surf2:'#1F3BFF',pen:'#1F3BFF',tee:'#FFFFFF',tote:'#1F3BFF',rx:0},
 v:{card:1,letter:1,env:1,note:1,tee:2,tote:1,arr:2},
 motion:'The double M is drawn in a single continuous stroke (1.8 s), then the name snaps in beside it.'},
{id:4,grp:'Media',sub:'MEDIA',lg:'halo',name:'Halo',style:'Light italic wordmark with a hairline moon',
 concept:'“Moonshot” in a whisper-light italic, with one fine gold circle sitting behind the double o like a moon behind cloud. Fashion-house restraint.',
 f:{d:'Cormorant Garamond',dw:300,di:1,b:'Jost',n:'Cormorant Garamond Light Italic · Jost'},finish:'foil',foil:G,tc:1,
 t:{dark:{bg:'#4A0F1C',fg:'#F4E4DE',ac:G,on:'#4A0F1C'},light:{bg:'#FBF6F1',fg:'#4A0F1C',ac:'#B08A4A',on:'#FBF6F1'},brand:{bg:'#F4E4DE',fg:'#4A0F1C',ac:'#8C3B4A',on:'#F4E4DE'}},
 pal:[['Oxblood','#4A0F1C','Backgrounds, lettering'],['Blush','#F4E4DE','Secondary paper, packaging'],['Foil Gold','#C9A46A','The halo'],['Rosewood','#8C3B4A','Accents on blush'],['Cream','#FBF6F1','Paper']],
 m:{paper:'#FBF6F1',dark:'#4A0F1C',brand:'#F4E4DE',ink:'#4A0F1C',acc:'#B08A4A',surf:'#EBD9D2',surf2:'#3A0B15',pen:'#C9A46A',tee:'#F4E4DE',tote:'#4A0F1C',rx:1},
 v:{card:2,letter:3,env:2,note:0,tee:3,tote:0,arr:1},
 motion:'The halo is drawn first, a small moon rides round it, then the word fades in through it.'},
{id:5,grp:'Media',sub:'MEDIA',lg:'crest',hz:1,hs:62,name:'Crest',style:'Engraved seal',
 concept:'An engraver’s seal: the name set on the ring, a crescent in a burst of fine rays. It carries its own authority on wax, paper and brass.',
 f:{d:'Cinzel',dw:600,b:'EB Garamond',n:'Cinzel · EB Garamond'},finish:'foil',foil:CU,up:1,
 t:{dark:{bg:'#0F1E36',fg:'#EFE6D3',ac:CU,on:'#0F1E36'},light:{bg:'#EFE6D3',fg:'#0F1E36',ac:'#A6582F',on:'#EFE6D3'},brand:{bg:'#B8693D',fg:'#0F1E36',ac:'#0F1E36',on:'#B8693D'}},
 pal:[['Navy','#0F1E36','Backgrounds, lettering'],['Copper','#B8693D','Foil, the crescent'],['Parchment','#EFE6D3','Paper'],['Slate','#5A6B85','Secondary text'],['Ember','#A6582F','Copper as ink on light paper']],
 m:{paper:'#EFE6D3',dark:'#0F1E36',brand:'#0F1E36',ink:'#0F1E36',acc:'#A6582F',surf:'#17294A',surf2:'#E2D8C2',pen:'#B8693D',tee:'#0F1E36',tote:'#EFE6D3',rx:4},
 v:{card:0,letter:0,env:0,note:1,tee:1,tote:1,arr:0},
 motion:'The rays turn slowly one way while the lettering ring turns the other (24 s / 40 s). Use the stamped still on print.'},
{id:6,grp:'Studios',sub:'STUDIOS',lg:'marquee',name:'Marquee',style:'Dot-matrix wordmark',
 concept:'The name spelled in studio-sign bulbs, one moon-coloured O among them. It lights up letter by letter, so the logo is its own title sequence.',
 f:{d:'Space Mono',dw:700,b:'Space Mono',n:'Custom dot matrix · Space Mono'},finish:'ink',foil:'#FFB000',up:1,
 t:{dark:{bg:'#0A0A0A',fg:'#FFF4D6',ac:'#FFB000',on:'#0A0A0A'},light:{bg:'#F4EFE2',fg:'#0A0A0A',ac:'#D98E00',on:'#F4EFE2'},brand:{bg:'#FFB000',fg:'#0A0A0A',ac:'#0A0A0A',on:'#FFB000'}},
 pal:[['Stage Black','#0A0A0A','Backgrounds'],['Bulb White','#FFF4D6','Lit lettering'],['Amber','#FFB000','The moon bulb, highlights'],['Graphite','#1C1C1C','Panels'],['Smoke','#7C776C','Captions']],
 m:{paper:'#F4EFE2',dark:'#0A0A0A',brand:'#FFB000',ink:'#0A0A0A',acc:'#D98E00',surf:'#161616',surf2:'#EDE7D8',pen:'#FFB000',tee:'#0A0A0A',tote:'#0A0A0A',rx:10},
 v:{card:1,letter:3,env:1,note:1,tee:1,tote:1,arr:2},
 motion:'Letters switch on left to right (0.16 s apart), the amber O included, then STUDIOS lights underneath. For a loop, the monogram flickers like a tired bulb.'},
{id:7,grp:'Studios',sub:'STUDIOS',lg:'deco',hz:1,hs:64,name:'Deco',style:'Art-deco emblem',
 concept:'Moonrise inside a picture-house arch, drawn in fine gold line. A studio mark with old-cinema glamour: made for title cards, tickets and brass plaques.',
 f:{d:'Poiret One',dw:400,b:'Jost',n:'Poiret One · Jost'},finish:'foil',foil:G,up:1,
 t:{dark:{bg:'#06343A',fg:'#EBDDBF',ac:G,on:'#06343A'},light:{bg:'#EBDDBF',fg:'#06343A',ac:'#9C7A2E',on:'#EBDDBF'},brand:{bg:'#D2A857',fg:'#041F23',ac:'#041F23',on:'#D2A857'}},
 pal:[['Deep Teal','#06343A','Backgrounds, lettering'],['Deco Gold','#D2A857','Foil line work'],['Champagne','#EBDDBF','Paper'],['Jade','#0E5A5F','Secondary surfaces'],['Noir Teal','#041F23','Text on gold']],
 m:{paper:'#EBDDBF',dark:'#06343A',brand:'#06343A',ink:'#06343A',acc:'#9C7A2E',surf:'#0A2A2F',surf2:'#E3D4B2',pen:'#D2A857',tee:'#06343A',tote:'#EBDDBF',rx:0},
 v:{card:2,letter:0,env:2,note:2,tee:0,tote:0,arr:0},
 motion:'The arch draws itself, then the rays glow up and down like a projector warming (2.8 s loop).'},
{id:8,grp:'Studios',sub:'STUDIOS',lg:'overlap',name:'Eclipse',style:'Lowercase wordmark · the o’s eclipse',
 concept:'The two o’s slide into each other and the overlap lights up: an eclipse in the middle of the word. Warm, modern and friendly without being soft.',
 f:{d:'Outfit',dw:600,b:'Outfit',n:'Outfit SemiBold · Outfit'},finish:'ink',foil:'#FF6B57',lc:1,
 t:{dark:{bg:'#1B1A19',fg:'#FAF8F4',ac:'#FF6B57',on:'#1B1A19'},light:{bg:'#E7E1D8',fg:'#1B1A19',ac:'#FF6B57',on:'#E7E1D8'},brand:{bg:'#FF6B57',fg:'#1B1A19',ac:'#FAF8F4',on:'#FF6B57'}},
 pal:[['Coral','#FF6B57','The overlap, highlights'],['Soft Black','#1B1A19','Lettering'],['Greige','#E7E1D8','Paper, backgrounds'],['Clay','#B9A999','Secondary surfaces'],['Chalk','#FAF8F4','Lettering on dark']],
 m:{paper:'#FAF8F4',dark:'#1B1A19',brand:'#FF6B57',ink:'#1B1A19',acc:'#E5503C',surf:'#D8D0C4',surf2:'#F3EEE7',pen:'#FF6B57',tee:'#E7E1D8',tote:'#FF6B57',rx:14},
 v:{card:3,letter:2,env:1,note:2,tee:3,tote:2,arr:1},
 motion:'The second o slides in from the right and the coral overlap fades on as they meet. The monogram repeats it as a loop.'},
{id:9,grp:'Studios',sub:'STUDIOS',lg:'monoline',name:'Monoline',style:'Bespoke single-line lettering',
 concept:'Every letter is drawn for this logo with one constant line, on circles and straight strokes only. A small tangerine moon sits inside the last O.',
 f:{d:'Jost',dw:300,b:'Jost',n:'Custom lettering · Jost Light'},finish:'emboss',foil:'#FF5B1F',up:1,
 t:{dark:{bg:'#121212',fg:'#EFEBE4',ac:'#FF5B1F',on:'#121212'},light:{bg:'#EFEBE4',fg:'#121212',ac:'#FF5B1F',on:'#EFEBE4'},brand:{bg:'#FF5B1F',fg:'#121212',ac:'#EFEBE4',on:'#FF5B1F'}},
 pal:[['Ink','#121212','Lettering, dark surfaces'],['Bone','#EFEBE4','Paper'],['Tangerine','#FF5B1F','The moon: used once per layout'],['Pebble','#CFC8BC','Secondary surfaces'],['White','#FFFFFF','Screens']],
 m:{paper:'#EFEBE4',dark:'#121212',brand:'#EFEBE4',ink:'#121212',acc:'#FF5B1F',surf:'#CFC8BC',surf2:'#121212',pen:'#121212',tee:'#EFEBE4',tote:'#EFEBE4',rx:0},
 v:{card:0,letter:1,env:0,note:0,tee:2,tote:2,arr:2},
 motion:'The letters draw themselves one after another in a single line (0.14 s apart), STUDIOS follows underneath.'},
{id:10,grp:'Studios',sub:'STUDIOS',lg:'block',name:'Block',style:'Stacked box logo',
 concept:'MOON over SHOT in a solid block, STUDIOS running up the side, one volt-green moon in the counter of an O. Loud, tight and made for tape, crates and crew wear.',
 f:{d:'Archivo Black',dw:400,b:'Inter',n:'Archivo Black · Inter'},finish:'ink',foil:'#D7FF3E',up:1,
 t:{dark:{bg:'#000000',fg:'#FFFFFF',ac:'#D7FF3E',on:'#000000'},light:{bg:'#FFFFFF',fg:'#000000',ac:'#D7FF3E',on:'#FFFFFF'},brand:{bg:'#D7FF3E',fg:'#000000',ac:'#FFFFFF',on:'#D7FF3E'}},
 pal:[['Black','#000000','The block'],['White','#FFFFFF','Lettering, paper'],['Volt','#D7FF3E','The moon, tape, highlights'],['Concrete','#BDBDB8','Secondary surfaces'],['Asphalt','#2A2A2A','Panels']],
 m:{paper:'#FFFFFF',dark:'#000000',brand:'#D7FF3E',ink:'#000000',acc:'#000000',surf:'#BDBDB8',surf2:'#2A2A2A',pen:'#D7FF3E',tee:'#000000',tote:'#D7FF3E',rx:0},
 v:{card:1,letter:3,env:1,note:1,tee:2,tote:1,arr:0},
 motion:'The volt moon blinks inside the O (1.6 s). On video the block slams in on the beat.'}
];
KITS.forEach(k=>{k.mail=k.grp==='Media'?'contact@moonshotmedia.in':'[email]';k.web=k.grp==='Media'?'moonshotmedia.in':'[website]';k.full='Moonshot '+(k.grp==='Media'?'Media':'Studios')});
