import sys, struct, marshal, zlib, types
from io import BytesIO
from PIL import Image
d = open(sys.argv[1], 'rb').read()
M = b'MEI\x0c\x0b\x0a\x0b\x0e'; p = d.rfind(M)
_, pl, to, tl, _ = struct.unpack('!8sIIii', d[p:p+24]); st = p+88-pl
ct = d[st+to:st+to+tl]; i = 0; g = {}
while i < len(ct):
    (s,) = struct.unpack('!i', ct[i:i+4]); e = ct[i+4:i+s]
    po, cl, ul, cf, tc = struct.unpack('!IIIBc', e[:14])
    g[e[14:].rstrip(b'\0').decode('utf-8', 'replace').replace('\\', '/')] = (po, cl)
    i += s
po, cl = g['static/app.js']
ajs = zlib.decompress(d[st+po:st+po+cl]).decode('utf-8')
print('theme init = light:', 'let th = "light";' in ajs)
print('old dark-default gone:', 'im_theme") || "dark"' not in ajs)
po, cl = g['logo-64.png']; raw = zlib.decompress(d[st+po:st+po+cl])
im = Image.open(BytesIO(raw)); print('logo-64.png:', im.size, im.mode)
old = open(sys.argv[2], 'rb').read()
print('logo replaced (differs from old):', raw != old)
im.save(sys.argv[3])
