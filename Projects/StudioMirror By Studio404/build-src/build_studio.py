import sys, os, struct, marshal, zlib, types, re
from urllib.parse import quote

# New StudioMirror glyph: dark rounded square + ghost phone + red-screen phone
NEW_SVG = ('<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">'
           '<rect width="32" height="32" rx="8" fill="#23262b"/>'
           '<rect x="7" y="7" width="11" height="17" rx="2.4" fill="#f0f2f5" opacity=".38"/>'
           '<rect x="13" y="9.5" width="12" height="18.5" rx="2.6" fill="#f0f2f5"/>'
           '<rect x="14.6" y="11.6" width="8.8" height="13.3" rx="1.4" fill="#e23b3b"/>'
           '<circle cx="19" cy="10.7" r="0.7" fill="#14161a"/></svg>')
NEW_FAVICON = 'data:image/svg+xml,' + quote(NEW_SVG, safe='')
OLD_GLYPH = ('<svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">'
             '<rect width="32" height="32" rx="8" fill="#050510"/>'
             '<rect x="10" y="5" width="12" height="22" rx="3" fill="none" stroke="#00f2ff" stroke-width="2.4"/>'
             '<circle cx="16" cy="22.5" r="1.6" fill="#ff0000"/></svg>')

EXE, LICSRC, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
ICO = sys.argv[4] if len(sys.argv) > 4 else None
LOGO = sys.argv[5] if len(sys.argv) > 5 else None
d = open(EXE, 'rb').read()
ico_bytes = open(ICO, 'rb').read() if ICO else None
logo_bytes = open(LOGO, 'rb').read() if LOGO else None

# ---- rebrand rules -------------------------------------------------------
STATIC = [
    ("info@invotic.com", "errorstudio4004@gmail.com"),
    ("923484166937", "923030449680"),
    ('Invo<span class="red">Mirror</span>', 'Studio<span class="red">Mirror</span>'),
    ('Invo<b>Mirror</b>', 'Studio<b>Mirror</b>'),
    ('INVO<span class="red">TIC</span>', 'STUDIO<span class="red">404</span>'),
    (">invotic.com</a>", ">Studio404</a>"),
    ("https://invotic.com/", "#"),
    (">invotic</a>", ">Studio404</a>"),
    ("INVOTIC", "STUDIO404"),
    ("Invotic", "Studio404"),
    ('let th = "dark"; try { th = localStorage.getItem("im_theme") || "dark"; } catch (e) { /* */ }',
     'let th = "light";'),
    ("InvoMirror", "StudioMirror"),
]
CODE = [
    ("info@invotic.com", "errorstudio4004@gmail.com"),
    ("https://invotic.com", "#"),
    ("INVOTIC", "STUDIO404"),
    ("Invotic", "Studio404"),
    ("invomirror.log", "studiomirror.log"),
    ("invomirror_activity.csv", "studiomirror_activity.csv"),
    ("InvoMirror", "StudioMirror"),
]
CODE_SKIP = {"InvoMirrorFrame"}          # internal window token: leave intact
CODE_EXACT = {"Invo": "Studio"}          # splash wordmark 1st piece ("Invo"+"Mirror")
CODE_EXTRA = [("#00f2ff", "#e23b3b")]    # splash glyph/progress: cyan -> brand red

def rb_text(s, rules):
    for a, b in rules:
        s = s.replace(a, b)
    return s

def rb_const(k):
    if isinstance(k, str):
        if k in CODE_SKIP:
            return k
        if k in CODE_EXACT:
            return CODE_EXACT[k]
        return rb_text(k, CODE + CODE_EXTRA)
    if isinstance(k, tuple):
        return tuple(rb_const(x) for x in k)
    if isinstance(k, frozenset):
        return frozenset(rb_const(x) for x in k)
    if isinstance(k, types.CodeType):
        return rb_code(k)
    return k

def rb_code(c):
    newconsts = tuple(rb_const(x) for x in c.co_consts)
    return c.replace(co_consts=newconsts)

# ---- locate CArchive -----------------------------------------------------
M = b'MEI\x0c\x0b\x0a\x0b\x0e'
p = d.rfind(M); cookie = d[p:p+88]
magic, pkglen, tocoff, toclen, pyver = struct.unpack('!8sIIii', cookie[:24])
pylib = cookie[24:88]; astart = p + 88 - pkglen
assert p + 88 == len(d)

ctoc = d[astart+tocoff:astart+tocoff+toclen]; entries = []; i = 0
while i < len(ctoc):
    (sz,) = struct.unpack('!i', ctoc[i:i+4]); e = ctoc[i+4:i+sz]
    pos, clen, ulen, cf, tc = struct.unpack('!IIIBc', e[:14]); nb = e[14:]
    entries.append([sz, pos, clen, ulen, cf, tc, nb]); i += sz

def raw_of(e):
    return d[astart+e[1]:astart+e[1]+e[2]]

# ---- rebuild PYZ: swap lic (office), rebrand app -------------------------
pyz_i = next(k for k, e in enumerate(entries) if e[6].rstrip(b'\0') == b'PYZ.pyz')
pyz = raw_of(entries[pyz_i])
assert pyz[:4] == b'PYZ\0'
(ptoc_off,) = struct.unpack('!i', pyz[8:12])
ptoc = marshal.loads(pyz[ptoc_off:])        # list of (name,(flag,pos,len))

lic_code = compile(open(LICSRC, encoding='utf-8').read(), 'lic.py', 'exec')
first = min(v[1] for _, v in ptoc)
out = bytearray(pyz[:first]); newtoc = []
for name, (flag, pos, ln) in ptoc:
    if name == 'lic':
        blob = zlib.compress(marshal.dumps(lic_code), 9)
    elif name == 'app':
        code = marshal.loads(zlib.decompress(pyz[pos:pos+ln]))
        blob = zlib.compress(marshal.dumps(rb_code(code)), 9)
    else:
        blob = pyz[pos:pos+ln]
    newtoc.append((name, (flag, len(out), len(blob)))); out += blob
newtocoff = len(out)
out += marshal.dumps(newtoc)
out[8:12] = struct.pack('!i', newtocoff); newpyz = bytes(out)

# ---- rebuild CArchive entries -------------------------------------------
def rebuilt_blob(e):
    nm = e[6].rstrip(b'\0').decode('utf-8', 'replace')
    cf, tc = e[4], e[5]
    if nm == 'PYZ.pyz':
        return newpyz, 0, len(newpyz), len(newpyz)       # cf stays 0
    if nm.startswith('static\\') or nm.startswith('static/'):
        txt = zlib.decompress(raw_of(e)).decode('utf-8')
        txt = rb_text(txt, STATIC)
        if nm.replace('\\', '/').endswith('index.html'):
            txt = txt.replace(OLD_GLYPH, NEW_SVG)
            txt = re.sub(r'href="data:image/svg\+xml,[^"]*"', 'href="' + NEW_FAVICON + '"', txt)
        nbts = txt.encode('utf-8')
        comp = zlib.compress(nbts, 9)
        return comp, 1, len(comp), len(nbts)
    if nm == 'launcher':
        code = marshal.loads(zlib.decompress(raw_of(e)))
        nbts = marshal.dumps(rb_code(code)); comp = zlib.compress(nbts, 9)
        return comp, 1, len(comp), len(nbts)
    if nm == 'invomirror.ico' and ico_bytes is not None:
        comp = zlib.compress(ico_bytes, 9)
        return comp, 1, len(comp), len(ico_bytes)
    if nm == 'logo-64.png' and logo_bytes is not None:
        comp = zlib.compress(logo_bytes, 9)
        return comp, 1, len(comp), len(logo_bytes)
    # unchanged
    return raw_of(e), e[4], e[2], e[3]

data = bytearray()
for e in entries:
    blob, cf, clen, ulen = rebuilt_blob(e)
    e[1] = len(data); e[2] = clen; e[3] = ulen; e[4] = cf
    data += blob

newtocb = bytearray()
for e in entries:
    sz, pos, clen, ulen, cf, tc, nb = e
    rec = struct.pack('!IIIBc', pos, clen, ulen, cf, tc) + nb
    rec = struct.pack('!i', len(rec)+4) + rec
    assert len(rec) == sz
    newtocb += rec

pkglen2 = len(data) + len(newtocb) + 88
newcookie = magic + struct.pack('!III', pkglen2, len(data), len(newtocb)) + struct.pack('!i', pyver) + pylib
open(OUT, 'wb').write(d[:astart] + bytes(data) + bytes(newtocb) + newcookie)
print('OK', OUT, os.path.getsize(OUT), 'bytes')

# ---- self-verify ---------------------------------------------------------
dd = open(OUT, 'rb').read(); pp = dd.rfind(M); ck = dd[pp:pp+88]
_, pl, to, tl, _ = struct.unpack('!8sIIii', ck[:24]); st2 = pp+88-pl
ct = dd[st2+to:st2+to+tl]; i = 0; got = {}
while i < len(ct):
    (s,) = struct.unpack('!i', ct[i:i+4]); e = ct[i+4:i+s]
    po, cl, ul, cf2, tc2 = struct.unpack('!IIIBc', e[:14]); nm = e[14:].rstrip(b'\0').decode('utf-8','replace')
    got[nm] = (po, cl, cf2); i += s
# lic behaviour
pz = dd[st2+got['PYZ.pyz'][0]:st2+got['PYZ.pyz'][0]+got['PYZ.pyz'][1]]
(o2,) = struct.unpack('!i', pz[8:12]); t2 = dict(marshal.loads(pz[o2:]))
def pget(n):
    fl, po, ln = t2[n]; return marshal.loads(zlib.decompress(pz[po:po+ln]))
m = types.ModuleType('lic'); exec(pget('lic'), m.__dict__)
L = m.License(os.getcwd(), '2.2.1')
print('lic allowed=', L.allowed(), 'limit=', L.phone_limit(), 'wa=', L.public()['whatsapp'], 'email=', L.public()['email'])
# app brand scan
appc = pget('app'); brand = []
def scan(c):
    for k in c.co_consts:
        if isinstance(k, types.CodeType): scan(k)
        elif isinstance(k, str):
            import re
            if re.search('invotic', k, re.I) or 'InvoMirror' in k: brand.append(k[:60])
scan(appc)
print('app residual brand strings:', brand)
# static scan
idx = zlib.decompress(dd[st2+got['static\\index.html'][0]:st2+got['static\\index.html'][0]+got['static\\index.html'][1]]).decode('utf-8')
ajs = zlib.decompress(dd[st2+got['static\\app.js'][0]:st2+got['static\\app.js'][0]+got['static\\app.js'][1]]).decode('utf-8')
import re
print('index residual InvoMirror/Invotic:', len(re.findall('InvoMirror', idx)), len(re.findall(r'(?i)invotic', idx)))
print('app.js residual InvoMirror/Invotic(mixed):', len(re.findall('InvoMirror', ajs)), len(re.findall('Invotic', ajs)))
print('index has StudioMirror:', 'StudioMirror' in idx, '| By Studio404:', 'Studio404' in idx, '| new wa:', '923030449680' in idx, '| new email:', 'errorstudio4004@gmail.com' in idx)
