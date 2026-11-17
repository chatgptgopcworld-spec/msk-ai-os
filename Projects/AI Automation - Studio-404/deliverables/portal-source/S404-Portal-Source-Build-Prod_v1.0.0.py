import json, os, base64
D = os.path.dirname(os.path.abspath(__file__))
V3 = os.path.join(D, '..', 'v3')
src = open(os.path.join(V3, 'build.py')).read().split('for c in CONCEPTS:')[0]
src = src.replace("D = os.path.dirname(os.path.abspath(__file__))", f"D = {V3!r}")
ns = {}; exec(src, ns)
ICONS, tok, SEM_L, SEM_D = ns['ICONS'], ns['tok'], ns['SEM_L'], ns['SEM_D']
L = json.load(open(os.path.join(V3, '..', 'logos.json')))
ICONS['eye'] = '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
ICONS['lock'] = '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>'
ICONS['doc'] = '<path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"/>'
sprite = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' + ''.join(f'<symbol id="i-{k}" viewBox="0 0 24 24">{v}</symbol>' for k, v in ICONS.items()) + '</svg>'
c = [x for x in ns['CONCEPTS'] if x['id'] == 'nebula'][0]
base = open(os.path.join(V3, 'base.css')).read()
extra = """
.syncpill{display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 12px;border-radius:999px;border:1px solid var(--line);background:var(--surface);font-size:12.5px;font-weight:600;color:var(--ink2);white-space:nowrap}
.syncpill i{width:8px;height:8px;border-radius:50%;background:var(--ink3)}
.syncpill.on i{background:var(--ok);box-shadow:0 0 0 4px var(--ok-soft)}
.syncpill.busy i{background:var(--warn);animation:blink 1s infinite}
.syncpill.err{color:var(--bad);border-color:var(--bad-soft)}.syncpill.err i{background:var(--bad)}
.syncpill.off{border-style:dashed}
@keyframes blink{50%{opacity:.3}}
.conn .ch .syncpill{height:30px}
.btn[disabled]{opacity:.6;pointer-events:none}
.login{position:fixed;inset:0;z-index:100;display:grid;grid-template-columns:1.1fr 1fr;background:var(--bg);overflow:auto}
.lart{position:relative;background:#070b18;color:#eaf0ff;display:grid;place-items:center;overflow:hidden;padding:40px}
.lglow{position:absolute;inset:-20%;background:radial-gradient(520px 420px at 25% 25%,rgba(47,211,255,.35),transparent 65%),radial-gradient(560px 460px at 78% 70%,rgba(163,91,255,.38),transparent 65%),radial-gradient(420px 380px at 60% 20%,rgba(91,107,255,.3),transparent 65%);animation:drift 14s ease-in-out infinite alternate}
@keyframes drift{to{transform:translate(4%,-3%) scale(1.08)}}
.lbrand{position:relative;max-width:440px}
.blogo.big{width:128px;height:108px;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,.5)}.blogo.big img{width:116px}
.lbrand h1{font-size:clamp(34px,4.4vw,56px);line-height:1.02;margin:26px 0 12px;color:#fff}
.lbrand p{margin:0;color:rgba(234,240,255,.74);font-size:16px;line-height:1.55}
.lplats{display:flex;gap:12px;margin-top:26px}
.lpane{display:grid;place-items:center;padding:32px max(20px,env(safe-area-inset-right,0px)) 32px max(20px,env(safe-area-inset-left,0px))}
.lform{width:min(380px,100%);display:flex;flex-direction:column;gap:14px}
.lform h2{font-size:32px}.lform>p{margin:-8px 0 6px}
.lform label{display:flex;flex-direction:column;gap:6px;font-size:12.5px;font-weight:600;color:var(--ink2)}
.lform input{height:48px;border-radius:var(--r-sm);border:1px solid var(--line);background:var(--surface);padding:0 14px;font-size:15px;color:var(--ink);outline:none;width:100%}
.lform input:focus{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
.pw{position:relative;display:block}.pw input{padding-right:46px}
.pw button{position:absolute;right:6px;top:6px;width:36px;height:36px;border:0;background:none;color:var(--ink3);display:grid;place-items:center;border-radius:8px}
.lbtn{height:50px;font-size:15px;margin-top:4px}
.lerr{color:var(--bad);font-weight:600;font-size:13px;min-height:18px;margin:0}
.lfoot{display:flex;gap:6px;align-items:center;justify-content:center;margin:4px 0 0}.lfoot .i{width:14px;height:14px}
.msm{display:none}
@media (max-width:820px){.login{grid-template-columns:1fr}.lart{display:none}.msm{display:grid;width:84px;height:70px;border-radius:16px;margin-bottom:8px}.msm img{width:76px}}
@media (max-width:820px){#sync{order:4}.syncpill span{max-width:150px;overflow:hidden;text-overflow:ellipsis}}
"""
css = f""":root{{{c['static']};{tok(c['light'], SEM_L)}}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{{tok(c['dark'], SEM_D)};color-scheme:dark}}}}
:root[data-theme="dark"]{{{tok(c['dark'], SEM_D)};color-scheme:dark}}
{base}
{c['css']}
{extra}
.avi{{position:absolute;inset:0;width:100%;height:100%;border-radius:50%;object-fit:cover}}
.tbl{{overflow-x:auto}}.tbl td.mut,.tbl td:last-child{{white-space:nowrap}}.tbl th,.tbl td{{padding-left:8px!important;padding-right:8px!important}}.tbl td:first-child,.tbl th:first-child{{padding-left:14px!important}}

.filters{{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px}}
.filters label{{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600;color:var(--ink3,#8a93b8)}}
.filters select{{appearance:none;-webkit-appearance:none;height:36px;border-radius:999px;border:1px solid var(--line);background-color:var(--surface);color:var(--ink);font-size:13px;font-weight:600;padding:0 36px 0 14px;cursor:pointer;background-repeat:no-repeat;background-position:right 14px center;background-size:10px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%238a93b8' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")}}
.bulk{{display:inline-flex;align-items:center;gap:8px;margin-left:auto;padding:5px 8px 5px 14px;border-radius:999px;background:var(--accent-soft);font-size:13px}}
.tbl td:last-child,.tbl th:last-child{{position:sticky;right:0;background:var(--surface);box-shadow:-10px 0 12px -10px rgba(0,0,0,.18)}}tr.picked td:last-child{{background:var(--surface)}}
.bulk select{{flex:1;min-width:0}}
/* account profile header: one clean design for every platform */
.ph{{padding:20px!important;display:flex;flex-direction:column;gap:16px;position:relative;overflow:hidden}}
.ph::before{{content:"";position:absolute;inset:0 0 auto 0;height:86px;background:linear-gradient(120deg,hsl(var(--hu) 70% 60% / .22),hsl(calc(var(--hu) + 60) 70% 60% / .10) 60%,transparent);pointer-events:none}}
.ph>*{{position:relative}}
.ph-top{{display:flex;gap:16px;align-items:center;min-width:0}}
.ph-top .av{{flex:none;box-shadow:0 0 0 3px var(--surface),0 0 0 5px var(--accent);border-radius:50%}}
.ph-id{{min-width:0;flex:1}}
.ph-plat{{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:var(--ink3);text-transform:uppercase;letter-spacing:.06em}}
.ph-id h2{{margin:4px 0 2px;font-size:26px;line-height:1.15;overflow-wrap:anywhere}}
.ph-id p{{margin:0;font-size:13.5px;overflow-wrap:anywhere}}
.ph-nums{{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:8px}}
.ph-nums div{{background:var(--sunk);border-radius:var(--r-sm);padding:12px 8px;text-align:center;min-width:0}}
.ph-nums b{{display:block;font-size:20px;font-family:var(--display);font-variant-numeric:tabular-nums}}
.ph-nums span{{font-size:11px;color:var(--ink3);text-transform:uppercase;letter-spacing:.05em;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}}
.ph .ptags{{margin-top:0}}.tag.soft{{background:transparent;border:1px dashed var(--line);color:var(--ink3)}}
.ph-acts{{display:flex;gap:10px;flex-wrap:wrap;align-items:center}}
.ph-open{{justify-content:center}}
.ph-tools{{display:flex;gap:8px;flex-wrap:wrap}}
/* cards never wider than the screen */
.lane,.lcards{{min-width:0}}
.agrid>*,.lcards>*{{min-width:0}}.acard{{min-width:0;max-width:100%;overflow:hidden}}
.acard .ac-top{{min-width:0}}.acard .who{{min-width:0;flex:1}}.acard .who b,.acard .who small{{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}
.ac-foot{{min-width:0}}.ac-foot .niche{{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:0 1 auto}}.ac-foot .racts{{flex:none}}
.kpis{{grid-template-columns:repeat(6,minmax(0,1fr))!important}}.board{{grid-template-columns:repeat(5,minmax(0,1fr))!important}}
i.s-Active,.dot.s-Active{{background:var(--accent)}}.pill.s-Active,.stsel.s-Active{{background-color:var(--accent-soft);color:var(--accent)}}
.nw{{white-space:nowrap}}.openl{{text-decoration:none;white-space:nowrap}}.acard .added{{font-size:11.5px;color:var(--ink3);white-space:nowrap;font-weight:500}}
.ac-nums.two{{grid-template-columns:1fr 1fr!important}}
.imp textarea{{min-height:170px;width:100%}}.improw{{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;margin:12px 0 8px}}
.improw label{{display:flex;flex-direction:column;gap:5px;font-size:12.5px;color:var(--ink3);flex:1;min-width:150px}}
.improw input,.improw select{{background:var(--sunk);border:1px solid var(--line);border-radius:var(--r-sm);padding:10px 12px;color:var(--ink);font:inherit}}
.impbar{{height:8px;border-radius:99px;background:var(--sunk);overflow:hidden;margin-top:12px}}.impbar i{{display:block;height:100%;background:linear-gradient(90deg,#35b6ff,#8a5bff);transition:width .3s}}
.implist{{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:6px}}
.implist li{{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;background:var(--sunk);min-width:0}}
.implist .iu{{flex:1;min-width:0;display:flex;flex-direction:column}}.implist .iu b,.implist .iu small{{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}}.implist .iu small{{color:var(--ink3);font-size:12px}}
.implist .ist{{flex:none;max-width:46%;text-align:right;font-size:12px;font-weight:700;color:var(--ink3)}}.plogo.none{{width:20px;height:20px;border-radius:6px;background:var(--line);flex:none}}
.implist .i-ready .ist{{color:var(--new)}}.implist .i-saved .ist,.implist .i-updated .ist{{color:var(--ok)}}.implist .i-fail .ist,.implist .i-bad .ist{{color:var(--bad)}}.implist .i-work .ist{{color:var(--accent)}}.implist .i-dup .ist{{color:var(--warn)}}
.implist .i-bad,.implist .i-dup{{opacity:.75}}
html{{-webkit-text-size-adjust:100%;text-size-adjust:100%}}html,body{{overflow-x:hidden;max-width:100%}}body{{overscroll-behavior-y:none;-webkit-tap-highlight-color:transparent}}
button,a,select,.chip,.cbx{{touch-action:manipulation}}
@media (max-width:1150px){{.kpis{{grid-template-columns:repeat(3,minmax(0,1fr))!important}}.board{{grid-template-columns:repeat(2,minmax(0,1fr))!important}}}}
@media (max-width:820px){{
 .kpis{{grid-template-columns:repeat(2,minmax(0,1fr))!important}}.board{{grid-template-columns:minmax(0,1fr)!important}}
 input,select,textarea{{font-size:16px!important}}
 .tools .seg button[data-v="table"]{{display:none}}
 .main{{padding-left:14px!important;padding-right:14px!important;max-width:100vw}}.card{{max-width:100%}}
 .acard,.btn,.chip,.links a{{user-select:none;-webkit-user-select:none}}
 .filters label{{flex-direction:column!important;align-items:stretch!important;gap:4px!important;font-size:11.5px}}.filters select{{padding-left:12px!important;text-overflow:ellipsis}}
 .ph{{padding:16px!important;gap:14px}}.ph-top .av{{width:72px!important;height:72px!important;font-size:24px!important}}.ph-id h2{{font-size:21px}}
 .ph-nums b{{font-size:17px}}.ph-nums div{{padding:10px 4px}}
 .ph-acts{{flex-direction:column;align-items:stretch}}.ph-open{{width:100%;padding:13px!important}}
 .ph-tools{{display:grid;grid-template-columns:repeat(auto-fit,minmax(0,1fr));gap:6px}}
 .ph-tools .btn{{flex-direction:column;gap:4px;height:auto!important;min-height:58px;padding:10px 4px!important;font-size:11.5px!important;justify-content:center;min-width:0}}
 .ph .stsel{{font-size:13px!important;padding:7px 30px 7px 12px!important}}
 .ph-tools .btn span{{display:block!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}}
 .pcols{{gap:14px!important}}.pmain,.pside{{gap:14px!important}}
 .acard{{padding:14px!important;gap:12px!important}}.acard .ac-top .av{{width:44px!important;height:44px!important}}
 .ac-nums{{gap:4px!important}}.ac-nums b{{font-size:17px!important}}
 .ac-foot{{flex-wrap:nowrap}}.ac-foot .stsel{{font-size:12.5px!important;padding:7px 28px 7px 11px!important;max-width:120px}}
 .ac-foot .btn.icon{{width:34px;height:34px}}
 .lane{{padding:8px!important}}
 .improw .pacts{{width:100%}}.improw .pacts .btn{{flex:1;justify-content:center}}
 .app .nav{{backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);z-index:50}}
}}
@media (display-mode:standalone){{.main{{padding-bottom:calc(32px + env(safe-area-inset-bottom,0px))!important}}}}
.rolep{{display:inline-block;padding:2px 9px;border-radius:999px;font-size:11.5px;font-weight:700;background:var(--accent-soft);color:var(--accent);vertical-align:middle}}
.rolep.r-viewer,.rolep.r-off{{background:rgba(140,150,180,.18);color:var(--ink3)}}.rolep.r-on{{background:rgba(60,200,130,.16);color:#3cc882}}
.team{{list-style:none;margin:10px 0 14px;padding:0;display:grid;gap:8px}}
.team li{{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:12px;background:var(--accent-soft)}}
.team li b{{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}}
.team .tav{{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:#fff;font-weight:700;font-size:13px;flex:none}}
.autos{{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:6px 0 10px}}
.autos div{{padding:12px 14px;border-radius:12px;background:var(--accent-soft);display:flex;flex-direction:column;gap:3px;min-width:0}}
@media (max-width:820px){{.autos{{grid-template-columns:1fr}}}}
body.ro [data-act="add"],body.ro [data-act="edit"],body.ro [data-act="del"],body.ro [data-act="stats"],body.ro [data-act="vdel"],body.ro [data-act="idel"],body.ro [data-act="unlink"],body.ro [data-act="doc"],body.ro [data-act="restore"],body.ro [data-act="pick"],body.ro [data-act="pickall"],body.ro form[data-form="vadd"],body.ro form[data-form="idea"],body.ro form[data-form="link"],body.ro .bulk{{display:none!important}}
body.ro .stsel{{pointer-events:none}}
.ck{{width:34px;padding-right:0!important}}
.cbx{{display:inline-block;width:18px;height:18px;border-radius:6px;border:1.6px solid var(--line);background:var(--surface);cursor:pointer;vertical-align:middle;position:relative}}
.cbx.on{{background:var(--accent);border-color:var(--accent)}}
.cbx.on::after{{content:"";position:absolute;left:5px;top:1.5px;width:4px;height:9px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg)}}
tr.picked td{{background:var(--accent-soft)}}
@media (max-width:820px){{
 .app .nav{{position:sticky!important;top:0!important;bottom:auto!important;inset:0 0 auto 0!important;border-top:0!important;border-bottom:1px solid var(--line)!important;padding:calc(6px + env(safe-area-inset-top,0px)) 8px 6px!important;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}}
 .app .nav::-webkit-scrollbar{{display:none}}
 .app .links{{justify-content:flex-start!important;gap:4px!important}}
 .app .links a{{flex:0 0 auto!important;flex-direction:row!important;gap:6px!important;padding:9px 13px!important;font-size:13px!important;font-weight:600;border-radius:999px!important}}
 .app .links a span{{font-size:13px!important}}
 .app .links a.on{{background:var(--accent-soft)}}
 .main{{padding-top:14px!important;padding-bottom:32px!important}}
 .toast{{bottom:calc(20px + env(safe-area-inset-bottom,0px))!important}}
 .top{{gap:8px!important;margin-bottom:14px!important}}
 .top .ttl{{flex:0 0 100%!important;width:100%}}.top .ttl h1{{font-size:26px}}.top #sub{{font-size:13px;margin-top:2px}}
 .top .btn.primary{{order:2;flex:1;justify-content:center}}.top .mtheme{{order:3}}.top #sync{{order:4;width:100%}}.top #sync .syncpill{{width:100%;justify-content:center}}.top .search{{order:5}}
 .chips{{flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;width:100%;padding-bottom:2px}}.chips::-webkit-scrollbar{{display:none}}.chips .chip{{flex:none}}
 .tools{{gap:8px!important}}.tools .seg{{width:100%}}.tools .seg button{{flex:1;justify-content:center}}.tools .seg button span{{display:inline!important}}
 .filters label{{flex:1;min-width:0}}.filters select{{flex:1;min-width:0;width:100%}}.bulk{{width:100%;margin-left:0;justify-content:space-between;border-radius:14px}}
 .stabs{{overflow-x:auto;flex-wrap:nowrap!important;scrollbar-width:none}}.stabs::-webkit-scrollbar{{display:none}}.stabs button{{flex:none}}
 .agrid{{grid-template-columns:minmax(0,1fr)!important}}
 .modal{{align-items:flex-end!important;padding:0!important}}.modal>*{{max-height:92vh;border-radius:20px 20px 0 0!important;width:100%!important;max-width:none!important}}
}}
.racts{{display:inline-flex;gap:6px;align-items:center}}.btn.danger:hover{{color:#ff5a6a;border-color:#ff5a6a}}
.stsel{{padding-right:32px!important;padding-left:13px!important;background-position:right 13px center!important}}
.fg select,.inline select,.icard select{{appearance:none;-webkit-appearance:none;padding-right:40px!important;cursor:pointer;background-repeat:no-repeat;background-position:right 15px center;background-size:11px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%238a93b8' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")}}
.fetchbox{{display:flex;gap:8px}}.fetchbox input{{flex:1;min-width:0}}.fetchbox .btn{{white-space:nowrap}}
.fmsg{{display:flex;align-items:center;gap:8px;color:var(--muted,#888);font-size:12.5px;min-height:18px;margin-top:4px}}.fmsg img{{width:28px;height:28px;border-radius:50%;object-fit:cover}}
"""
app = open(os.path.join(D, 'ext', 'links.js')).read() + '\n' + open(os.path.join(D, 'app.src.js')).read()
bm = json.dumps(open(os.path.join(D, 'bm.src.js')).read().strip()).replace('</', '<\\/')
cfg = json.dumps({'id': 'prod', 'name': 'ICS Research Portal', 'nav': 'side', 'view': 'board'})
logos = json.dumps({'TikTok': L['tt'], 'YouTube': L['yt'], 'Facebook': L['fb'], 'Spotify': L['sp'], 'Instagram': L['ig']})
cfgjs = open(os.path.join(D, 'config.js')).read() if os.path.exists(os.path.join(D, 'config.js')) else "window.PORTAL_BACKEND_URL='';"
html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="ICS Research">
<title>ICS Research Portal</title>
<meta name="description" content="ICS content research portal for TikTok, YouTube, Facebook, Instagram and Spotify.">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#070b18">
<link rel="icon" type="image/png" href="favicon.png">
<link rel="apple-touch-icon" href="favicon.png">
<link rel="manifest" href="manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family={c['fonts']}&display=swap">
<style>
:root{{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}
body{{margin:0}}img{{max-width:100%}}
{css}
</style>
</head>
<body>
{sprite}
<script>{cfgjs}</script>
<script>
window.ICS_BM={bm};const CFG={cfg};const LOGO={logos};const ICS={json.dumps(L['ics'])};
{app}
</script>
</body>
</html>
"""
site = os.path.join(D, 'site'); os.makedirs(site, exist_ok=True)
open(os.path.join(site, 'index.html'), 'w').write(html)
open(os.path.join(site, 'save.html'), 'w').write(open(os.path.join(D, 'save.src.html')).read())
# favicon from ICS logo on black square
from PIL import Image
lg = Image.open(os.path.join(V3, '..', 'logo-ics.png')).convert('RGBA')
fav = Image.new('RGBA', (192, 192), (0, 0, 0, 255)); lg2 = lg.resize((176, int(176 * lg.height / lg.width)))
fav.paste(lg2, ((192 - lg2.width) // 2, (192 - lg2.height) // 2), lg2); fav.save(os.path.join(site, 'favicon.png'))
big = Image.new('RGBA', (512, 512), (0, 0, 0, 255)); lg3 = lg.resize((400, int(400 * lg.height / lg.width)), Image.LANCZOS)
big.paste(lg3, ((512 - lg3.width) // 2, (512 - lg3.height) // 2), lg3); big.save(os.path.join(site, 'icon-512.png'), optimize=True)
json.dump({"name": "ICS Research Portal", "short_name": "ICS Research", "id": "/", "start_url": "/", "scope": "/", "display": "standalone", "orientation": "portrait", "background_color": "#070b18", "theme_color": "#070b18",
           "icons": [{"src": "favicon.png", "sizes": "192x192", "type": "image/png", "purpose": "any"}, {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"}, {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}, open(os.path.join(site, 'manifest.webmanifest'), 'w'))
print('built', len(html))
