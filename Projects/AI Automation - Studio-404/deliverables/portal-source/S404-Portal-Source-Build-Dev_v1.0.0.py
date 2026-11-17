import json, os
D = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(os.path.join(D, '..', 'logos.json')))
base = open(os.path.join(D, 'base.css')).read()
core = open(os.path.join(D, 'core.js')).read()

ICONS = {
 'home': '<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>',
 'search': '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
 'star': '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 'bulb': '<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>',
 'clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 'gear': '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
 'plus': '<path d="M12 5v14M5 12h14"/>',
 'x': '<path d="M6 6l12 12M18 6L6 18"/>',
 'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
 'moon': '<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>',
 'grid': '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
 'rows': '<path d="M4 6h16M4 12h16M4 18h16"/>',
 'cols': '<rect x="4" y="4" width="4.5" height="16" rx="1.2"/><rect x="9.75" y="4" width="4.5" height="11" rx="1.2"/><rect x="15.5" y="4" width="4.5" height="14" rx="1.2"/>',
 'ext': '<path d="M7 17L17 7M9 7h8v8"/>',
 'trash': '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 'edit': '<path d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"/>',
 'link': '<path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/>',
 'back': '<path d="M15 18l-6-6 6-6"/>',
 'copy': '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 012-2h9"/>',
 'refresh': '<path d="M20 12a8 8 0 01-13.7 5.6M4 12a8 8 0 0113.7-5.6M17 3v4h-4M7 21v-4h4"/>',
 'play': '<path d="M7 4.5v15l12-7.5z"/>',
}
sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + ''.join(
    f'<symbol id="i-{k}" viewBox="0 0 24 24">{v}</symbol>' for k, v in ICONS.items()) + '</svg>'

SEM_L = dict(ok='#12804a', okSoft='#e2f4ea', warn='#9a5b00', warnSoft='#fdf0d5', bad='#c2352b', badSoft='#fbe6e3', new='#4b5563', newSoft='#eceef2')
SEM_D = dict(ok='#4fd58e', okSoft='rgba(79,213,142,.14)', warn='#f4b94f', warnSoft='rgba(244,185,79,.14)', bad='#ff7b6f', badSoft='rgba(255,123,111,.14)', new='#aab3c5', newSoft='rgba(170,179,197,.13)')

def tok(t, sem):
    d = dict(sem); d.update(t)
    m = {'okSoft': 'ok-soft', 'warnSoft': 'warn-soft', 'badSoft': 'bad-soft', 'newSoft': 'new-soft', 'accentInk': 'accent-ink', 'accentSoft': 'accent-soft'}
    return ';'.join(f'--{m.get(k, k)}:{v}' for k, v in d.items())

CONCEPTS = [
 dict(id='aurora', name='Aurora', nav='side', view='grid', icon='sparkle',
  desc='Concept 1: soft glass cards on a colour-wash background, sidebar layout, cards view first.',
  fonts='Plus+Jakarta+Sans:wght@400;500;600;700;800',
  static="--display:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif;--body:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif;--mono:ui-monospace,Menlo,Consolas,monospace;--r:22px;--r-sm:13px;--h1:30px;--track:-.025em",
  light={'bg':'#f3f2fb','surface':'#ffffff','sunk':'rgba(96,84,160,.08)','line':'rgba(80,70,140,.14)','ink':'#17142b','ink2':'#4b4766','ink3':'#817d9c','accent':'#6a4df5','accentInk':'#ffffff','accentSoft':'rgba(106,77,245,.11)','shadow':'0 1px 2px rgba(40,30,90,.05),0 12px 32px rgba(60,40,140,.09)','card-bg':'rgba(255,255,255,.72)','wash':'radial-gradient(900px 520px at 8% -8%,rgba(138,110,255,.30),transparent 62%),radial-gradient(760px 520px at 96% 4%,rgba(255,128,181,.24),transparent 60%),radial-gradient(900px 600px at 60% 108%,rgba(84,190,255,.22),transparent 60%)'},
  dark={'bg':'#0d0b1a','surface':'#17142a','sunk':'rgba(190,180,255,.08)','line':'rgba(190,180,255,.14)','ink':'#f1efff','ink2':'#bbb6da','ink3':'#847fa6','accent':'#9d86ff','accentInk':'#0d0b1a','accentSoft':'rgba(157,134,255,.16)','shadow':'0 1px 2px rgba(0,0,0,.3),0 16px 40px rgba(0,0,0,.35)','card-bg':'rgba(30,26,54,.66)','wash':'radial-gradient(900px 520px at 8% -8%,rgba(112,80,255,.34),transparent 62%),radial-gradient(760px 520px at 96% 4%,rgba(255,80,160,.20),transparent 60%),radial-gradient(900px 600px at 60% 108%,rgba(40,150,255,.20),transparent 60%)'},
  css="""body{background:var(--wash),var(--bg);background-attachment:fixed}
:root{--blur:blur(18px) saturate(1.3);--accent-bg:linear-gradient(135deg,#6a4df5,#c04df0 60%,#ff6fa5);--btn-shadow:0 8px 22px rgba(120,70,240,.35);--card-border:1px solid rgba(255,255,255,.5)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--card-border:1px solid rgba(255,255,255,.09);--accent-ink:#fff}}
:root[data-theme="dark"]{--card-border:1px solid rgba(255,255,255,.09);--accent-ink:#fff}
.nav{background:var(--card-bg);backdrop-filter:var(--blur);-webkit-backdrop-filter:var(--blur);margin:14px 0 14px 14px;height:calc(100vh - 28px);top:14px;border-radius:24px;border:var(--card-border);box-shadow:var(--shadow)}
.links a.on{background:var(--accent-bg);color:#fff;box-shadow:var(--btn-shadow)}
.chip.on{background:var(--accent-bg);border-color:transparent;color:#fff}
.search{background:var(--card-bg);backdrop-filter:var(--blur)}
.kpi b{background:var(--accent-bg);-webkit-background-clip:text;background-clip:text;color:transparent}
@media (max-width:820px){.app .nav{margin:0;border-radius:0;height:auto}}"""),

 dict(id='carbon', name='Carbon', nav='top', view='table', icon='table',
  desc='Concept 2: ICS brand colours on graphite, top navigation, dense table view first.',
  fonts='Sora:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500',
  static="--display:'Sora',ui-sans-serif,system-ui,sans-serif;--body:'Inter',ui-sans-serif,system-ui,sans-serif;--mono:'JetBrains Mono',ui-monospace,Menlo,monospace;--r:10px;--r-sm:7px;--h1:26px",
  light={'bg':'#f2f3f5','surface':'#ffffff','sunk':'#eceef1','line':'#dcdfe5','ink':'#0b0c0f','ink2':'#3c414b','ink3':'#767c89','accent':'#0b55b8','accentInk':'#ffffff','accentSoft':'rgba(11,85,184,.09)','shadow':'none','red':'#c4120a','nav-bg':'#0b0c0f','nav-ink':'#ffffff'},
  dark={'bg':'#08090b','surface':'#121418','sunk':'#1a1d23','line':'#272b33','ink':'#f3f4f6','ink2':'#b7bcc6','ink3':'#7b8290','accent':'#3f8cff','accentInk':'#ffffff','accentSoft':'rgba(63,140,255,.14)','shadow':'none','red':'#f0322a','nav-bg':'#000000','nav-ink':'#ffffff'},
  css=""":root{--nav-line:var(--red)}
.nav-top .nav{border-bottom:0;box-shadow:inset 0 -2px 0 var(--red)}
.nav-top .links a{color:rgba(255,255,255,.62)}.nav-top .links a:hover{color:#fff}.nav-top .links a.on{color:#fff}
.nav .brand small{color:rgba(255,255,255,.55)}
.nav .themebtn{border-color:rgba(255,255,255,.2);color:#fff}.nav .themebtn:hover{background:rgba(255,255,255,.1)}
.ttl h1{text-transform:uppercase;letter-spacing:.02em}
.kpi{border-left:3px solid var(--accent)}.kpi.k-Rejected{border-left-color:var(--red)}.kpi.k-Selected{border-left-color:var(--ok)}.kpi.k-Shortlisted{border-left-color:var(--warn)}.kpi.k-New{border-left-color:var(--ink3)}
.kpi b,.mbig b,.pstats b{font-family:var(--mono)}
.chip{border-radius:var(--r-sm)}.pill,.stsel{border-radius:6px}
.stabs button.on{box-shadow:inset 0 -2px 0 var(--red)}
.h-tt .av{box-shadow:0 0 0 3px var(--surface),0 0 0 6px var(--red)}
@media (max-width:820px){.app .links a{color:var(--ink3)}.app .links a.on{color:var(--accent)}.nav-top .nav{box-shadow:none}}"""),

 dict(id='paper', name='Paper', nav='side', view='table', icon='document',
  desc='Concept 3: quiet editorial look with serif headings and hairlines, sidebar layout, table view first.',
  fonts='Instrument+Serif&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500',
  static="--display:'Instrument Serif',Georgia,'Times New Roman',serif;--body:'Inter',ui-sans-serif,system-ui,sans-serif;--mono:'IBM Plex Mono',ui-monospace,Menlo,monospace;--r:6px;--r-sm:5px;--h1:42px;--track:-.01em;--navw:210px",
  light={'bg':'#fafaf8','surface':'#ffffff','sunk':'#f1f1ee','line':'#e2e2dd','ink':'#131312','ink2':'#474744','ink3':'#8a8a85','accent':'#1d3fd0','accentInk':'#ffffff','accentSoft':'rgba(29,63,208,.07)','shadow':'none','nav-bg':'transparent'},
  dark={'bg':'#111110','surface':'#191918','sunk':'#222220','line':'#30302d','ink':'#f2f2ee','ink2':'#bdbdb7','ink3':'#83837d','accent':'#8ea6ff','accentInk':'#0f1220','accentSoft':'rgba(142,166,255,.12)','shadow':'none','nav-bg':'transparent'},
  css="""h1,h2,.kpi b,.mbig b,.pstats b,.stages b{font-weight:400}
.ch h2{font-size:22px}.hero h2{font-size:38px}
.kpis{gap:0;border-top:1px solid var(--ink);border-bottom:1px solid var(--line)}
.kpi{border:0;border-left:1px solid var(--line);border-radius:0;background:none;padding:18px}.kpi:first-child{border-left:0;padding-left:0}
.kpi b{font-size:46px}.kpi:hover{transform:none;background:var(--sunk)}
.links a{border-radius:0;padding-inline:0;border-bottom:1px solid var(--line)}.links a:hover{background:none}
.links a.on{background:none;color:var(--ink);box-shadow:inset 0 -1.5px 0 var(--ink);border-color:var(--ink)}
.chip{border-radius:var(--r-sm)}.pill,.stsel{border-radius:4px}
.btn.primary{background:var(--ink);color:var(--bg)}
.chip.on{background:var(--ink)}
.stabs button.on{box-shadow:inset 0 -2px 0 var(--ink)}
.lane{background:none;border:1px solid var(--line)}
th{font-family:var(--mono);font-weight:500}
@media (max-width:1150px){.kpi{border-top:1px solid var(--line)}}"""),

 dict(id='bento', name='Bento', nav='rail', view='board', icon='grid',
  desc='Concept 4: big rounded tiles with warm colour blocks, icon rail, board view first.',
  fonts='Outfit:wght@500;600;700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500',
  static="--display:'Outfit',ui-sans-serif,system-ui,sans-serif;--body:'DM Sans',ui-sans-serif,system-ui,sans-serif;--mono:'DM Mono',ui-monospace,Menlo,monospace;--r:28px;--r-sm:16px;--h1:34px;--track:-.02em",
  light={'bg':'#eeece8','surface':'#ffffff','sunk':'#f1efeb','line':'#e4e1db','ink':'#16130f','ink2':'#4c473f','ink3':'#8c867c','accent':'#f0562a','accentInk':'#ffffff','accentSoft':'rgba(240,86,42,.11)','shadow':'0 1px 0 rgba(0,0,0,.02)','lane':'rgba(255,255,255,.55)','t1':'#16130f','t1i':'#ffffff','t2':'#cfe0ff','t3':'#ffe3a8','t4':'#c9efd6','t5':'#ffd2cb','tin':'#16130f'},
  dark={'bg':'#0f0e0c','surface':'#1b1916','sunk':'#24221e','line':'#312e29','ink':'#f6f3ee','ink2':'#c2bcb1','ink3':'#8a847a','accent':'#ff7a4f','accentInk':'#1a0d06','accentSoft':'rgba(255,122,79,.15)','shadow':'none','lane':'rgba(255,255,255,.035)','t1':'#f6f3ee','t1i':'#16130f','t2':'#22355c','t3':'#4d3a12','t4':'#173f29','t5':'#4f211b','tin':'#f6f3ee'},
  css=""":root{--card-border:0}
.nav{border-right:0;background:transparent}
.nav-rail .links{background:var(--surface);border-radius:999px;padding:8px;gap:6px}
.links a{border-radius:50%}.links a.on{background:var(--ink);color:var(--bg)}
.nav-rail .themebtn{border-radius:50%;background:var(--surface);border:0}
.btn,.search,.chip{border-radius:999px;border-color:transparent}
.btn.primary{box-shadow:0 8px 20px rgba(240,86,42,.3)}
.kpi{border:0;padding:20px;color:var(--tin)}.kpi small,.kpi span{color:inherit;opacity:.7}
.kpi:nth-child(1){background:var(--t1);color:var(--t1i)}.kpi:nth-child(2){background:var(--t2)}.kpi:nth-child(3){background:var(--t3)}.kpi:nth-child(4){background:var(--t4)}.kpi:nth-child(5){background:var(--t5)}
.kpi b{font-size:44px;font-weight:800}.kpi .bar{background:rgba(0,0,0,.1)}.kpi .bar i{background:currentColor!important;opacity:.75}
.acard,.icard{border:0}.acard:hover{box-shadow:0 14px 34px rgba(0,0,0,.12)}
.lane{padding:12px}.seg{border-radius:999px}.seg button,.seg label{border-radius:999px}
.modal{border:0}
@media (max-width:820px){.nav-rail .links{border-radius:0;padding:0;background:none}.app .links a{border-radius:12px}.app .links a.on{background:none;color:var(--accent)}}"""),

 dict(id='nebula', name='Nebula', nav='side', view='board', icon='moon',
  desc='Concept 5: deep navy with cyan-to-violet glow accents, sidebar layout, board view first.',
  fonts='Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500',
  static="--display:'Space Grotesk',ui-sans-serif,system-ui,sans-serif;--body:'Inter',ui-sans-serif,system-ui,sans-serif;--mono:'JetBrains Mono',ui-monospace,Menlo,monospace;--r:18px;--r-sm:11px;--h1:30px;--track:-.02em",
  light={'bg':'#f1f4fb','surface':'#ffffff','sunk':'#eaeef8','line':'#dbe1f0','ink':'#0c1226','ink2':'#3f4863','ink3':'#7882a0','accent':'#3b5bff','accentInk':'#ffffff','accentSoft':'rgba(59,91,255,.1)','shadow':'0 1px 2px rgba(20,30,80,.04),0 10px 30px rgba(30,50,140,.07)','nav-bg':'#0c1226','nav-ink':'#e9edff','glow':'rgba(59,91,255,.28)'},
  dark={'bg':'#070b18','surface':'#0f152a','sunk':'#161d38','line':'#232c4d','ink':'#eaf0ff','ink2':'#aab4d6','ink3':'#6f7aa1','accent':'#5fd4ff','accentInk':'#04121c','accentSoft':'rgba(95,212,255,.13)','shadow':'0 1px 0 rgba(255,255,255,.03) inset,0 14px 40px rgba(0,0,0,.4)','nav-bg':'#0a0f20','nav-ink':'#e9edff','glow':'rgba(95,212,255,.35)'},
  css=""":root{--accent-bg:linear-gradient(120deg,#2fd3ff,#5b6bff 55%,#a35bff);--accent-ink:#fff;--btn-shadow:0 8px 26px var(--glow)}
body{background:radial-gradient(1000px 500px at 80% -10%,var(--accent-soft),transparent 60%),var(--bg)}
.nav .links a{color:rgba(233,237,255,.62)}.nav .links a:hover{background:rgba(255,255,255,.07);color:#fff}
.nav .links a.on{background:rgba(255,255,255,.1);color:#fff;box-shadow:inset 3px 0 0 #2fd3ff}
.nav .brand small{color:rgba(233,237,255,.55)}.nav .themebtn{border-color:rgba(255,255,255,.16);color:#e9edff}.nav .themebtn:hover{background:rgba(255,255,255,.08)}
.nav{border-right:0}
.kpi{position:relative;overflow:hidden}.kpi::after{content:"";position:absolute;right:-30px;top:-30px;width:110px;height:110px;border-radius:50%;background:var(--accent-bg);opacity:.16;filter:blur(18px)}
.chip.on{background:var(--accent-bg);border-color:transparent;color:#fff}
.h-tt .av{box-shadow:0 0 0 3px var(--surface),0 0 0 6px #5b6bff,0 0 40px var(--glow)}
.chart path[stroke]{filter:drop-shadow(0 4px 10px var(--glow))}
@media (max-width:820px){.app .links a{color:var(--ink3);box-shadow:none}.app .links a.on{background:none;color:var(--accent)}}"""),
]

for c in CONCEPTS:
    lt, dk = tok(c['light'], SEM_L), tok(c['dark'], SEM_D)
    css = f""":root{{{c['static']};{lt}}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{{dk};color-scheme:dark}}}}
:root[data-theme="dark"]{{{dk};color-scheme:dark}}
{base}
/* concept */
{c['css']}"""
    cfg = json.dumps({'id': c['id'], 'name': c['name'], 'nav': c['nav'], 'view': c['view']})
    logos = json.dumps({'TikTok': L['tt'], 'YouTube': L['yt'], 'Facebook': L['fb'], 'Spotify': L['sp']})
    html = f"""<title>ICS Portal {c['name']}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family={c['fonts']}&display=swap">
<style>
{css}
</style>
{sprite}
<script>
const CFG={cfg};const LOGO={logos};const ICS={json.dumps(L['ics'])};
{core}
</script>
"""
    open(os.path.join(D, f"ics-portal-{c['id']}.html"), 'w').write(html)
    # standalone test copy
    open(os.path.join(D, f"_t_{c['id']}.html"), 'w').write('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}</style></head><body>' + html + '</body></html>')
    print(c['id'], len(html))
json.dump([{k: c[k] for k in ('id', 'name', 'desc', 'icon')} for c in CONCEPTS], open(os.path.join(D, 'concepts.json'), 'w'))
