"""Rewrite PE icon group + VS_VERSIONINFO on a PyInstaller onefile exe, WITHOUT
disturbing the appended archive overlay. Splits exe into PE (sections) + overlay,
runs Win32 UpdateResource on the PE only, then re-appends the overlay. The
bootloader locates the archive as filesize - pkglen (cookie at EOF), so a change
in PE size is safe.
"""
import sys, os, struct, ctypes, tempfile
from ctypes import wintypes

EXE = sys.argv[1]      # built StudioMirror.exe (archive already rebranded)
ICO = sys.argv[2]
OUT = sys.argv[3]

d = open(EXE, 'rb').read()

# ---- split PE sections from overlay (overlay = whole PyInstaller archive) ----
M = b'MEI\x0c\x0b\x0a\x0b\x0e'
p = d.rfind(M)
pkglen = struct.unpack('!I', d[p+8:p+12])[0]
astart = (p + 88) - pkglen
pe_bytes, overlay = d[:astart], d[astart:]

tmp = tempfile.NamedTemporaryFile(suffix='.exe', delete=False)
tmp.write(pe_bytes); tmp.close()

# ---- icon file -> RT_ICON images + RT_GROUP_ICON directory --------------------
ico = open(ICO, 'rb').read()
_, _, count = struct.unpack('<HHH', ico[:6])
entries, images = [], []
for i in range(count):
    off = 6 + i*16
    w, h, cc, res, planes, bc, size, doff = struct.unpack('<BBBBHHII', ico[off:off+16])
    images.append(ico[doff:doff+size])
    entries.append((w, h, cc, res, planes, bc, size))
# GRPICONDIR: idReserved,idType,idCount + GRPICONDIRENTRY*count (nID = RT_ICON id)
grp = struct.pack('<HHH', 0, 1, count)
for i, (w, h, cc, res, planes, bc, size) in enumerate(entries):
    grp += struct.pack('<BBBBHHIH', w, h, cc, res, planes, bc, size, i+1)  # RT_ICON ids 1..count

# ---- VS_VERSIONINFO blob ------------------------------------------------------
def pad4(b):
    return b + b'\0' * ((4 - len(b) % 4) % 4)

def wsz(s):
    return s.encode('utf-16-le') + b'\0\0'

def node(key, value, wtype, children):
    # wLength, wValueLength, wType, szKey(+pad), Value(+pad), children
    vlen = (len(value)//2) if wtype == 1 else len(value)
    body = pad4(struct.pack('<HHH', 0, vlen, wtype) + wsz(key))
    body += pad4(value) if value else b''
    for c in children:
        body += pad4(c)
    body = struct.pack('<H', len(body)) + body[2:]
    return body

STR = [
    ("CompanyName", "Studio404"),
    ("FileDescription", "StudioMirror by Studio404 - control Android phones from the laptop"),
    ("FileVersion", "2.0.1"),
    ("InternalName", "StudioMirror"),
    ("LegalCopyright", "Studio404"),
    ("OriginalFilename", "StudioMirror.exe"),
    ("ProductName", "StudioMirror"),
    ("ProductVersion", "2.0.1"),
]
strings = [node(k, wsz(v), 1, []) for k, v in STR]
stringtable = node("040904b0", b'', 0, strings)       # LANG_EN_US, charset 1200
sfi = node("StringFileInfo", b'', 0, [stringtable])
translation = struct.pack('<HH', 0x0409, 1200)
vfi = node("VarFileInfo", b'', 0, [node("Translation", translation, 0, [])])

FIXED = struct.pack('<IIIIIIIIIIIIII',
    0xFEEF04BD, 0x00010000,
    (2 << 16) | 0, (1 << 16) | 0,    # file version 2.0.1.0
    (2 << 16) | 0, (1 << 16) | 0,    # product version
    0x3F, 0, 0x40004, 1, 0, 0, 0, 0)
ver = node("VS_VERSION_INFO", FIXED, 0, [sfi, vfi])

# ---- Win32 UpdateResource -----------------------------------------------------
k32 = ctypes.WinDLL('kernel32', use_last_error=True)
k32.BeginUpdateResourceW.restype = wintypes.HANDLE
k32.BeginUpdateResourceW.argtypes = [wintypes.LPCWSTR, wintypes.BOOL]
k32.UpdateResourceW.restype = wintypes.BOOL
k32.UpdateResourceW.argtypes = [wintypes.HANDLE, wintypes.LPCWSTR, wintypes.LPCWSTR,
                                wintypes.WORD, wintypes.LPVOID, wintypes.DWORD]
k32.EndUpdateResourceW.restype = wintypes.BOOL
k32.EndUpdateResourceW.argtypes = [wintypes.HANDLE, wintypes.BOOL]

RT_ICON = 3; RT_GROUP_ICON = 14; RT_VERSION = 16
LANG = 0          # neutral: matches the originals so they are overwritten in place

def MAKEINTRESOURCE(i):
    return ctypes.c_wchar_p(i)

h = k32.BeginUpdateResourceW(tmp.name, False)
if not h:
    raise ctypes.WinError(ctypes.get_last_error())

def upd(typ, name, data):
    buf = ctypes.create_string_buffer(data, len(data))
    ok = k32.UpdateResourceW(h, MAKEINTRESOURCE(typ), MAKEINTRESOURCE(name),
                             LANG, buf, len(data))
    if not ok:
        raise ctypes.WinError(ctypes.get_last_error())

for i, img in enumerate(images):
    upd(RT_ICON, i+1, img)
upd(RT_GROUP_ICON, 1, grp)
upd(RT_VERSION, 1, ver)

if not k32.EndUpdateResourceW(h, False):
    raise ctypes.WinError(ctypes.get_last_error())

pe_new = open(tmp.name, 'rb').read()
os.unlink(tmp.name)

# ---- re-attach overlay --------------------------------------------------------
final = pe_new + overlay
open(OUT, 'wb').write(final)

# ---- verify archive still locatable -------------------------------------------
fd = open(OUT, 'rb').read()
pp = fd.rfind(M)
pl = struct.unpack('!I', fd[pp+8:pp+12])[0]
new_astart = (pp + 88) - pl
print("PE grew by", len(pe_new) - len(pe_bytes), "bytes; overlay intact:", fd[new_astart:] == overlay,
      "| archive @", new_astart, "size", len(final))
