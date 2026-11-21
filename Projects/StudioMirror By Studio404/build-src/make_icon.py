import sys
from PIL import Image, ImageDraw

OUT_ICO = sys.argv[1]
OUT_PNG = sys.argv[2]
N = 1024  # supersample master, then downscale

def rr(d, box, r, fill):
    d.rounded_rectangle(box, radius=r, fill=fill)

img = Image.new("RGBA", (N, N), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

# background rounded square, dark vertical gradient
bg = Image.new("RGBA", (N, N), (0, 0, 0, 0))
bd = ImageDraw.Draw(bg)
for y in range(N):
    t = y / N
    c = (int(32 + 6 * t), int(35 + 6 * t), int(40 + 8 * t), 255)
    bd.line([(0, y), (N, y)], fill=c)
mask = Image.new("L", (N, N), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, N - 1, N - 1], radius=int(N * 0.22), fill=255)
img.paste(bg, (0, 0), mask)
d = ImageDraw.Draw(img)

RED = (226, 59, 59, 255)
WHITE = (240, 242, 245, 255)
GHOST = (240, 242, 245, 70)

# two overlapping phone shapes = "mirror": a ghost (reflection) behind, a solid device front
pw, ph = int(N * 0.30), int(N * 0.52)
cx, cy = N // 2, N // 2
# ghost phone (upper-left, the reflection)
gx, gy = cx - int(N * 0.14), cy - int(N * 0.10)
rr(d, [gx - pw // 2, gy - ph // 2, gx + pw // 2, gy + ph // 2], int(N * 0.05), GHOST)
# front device (lower-right)
fx, fy = cx + int(N * 0.10), cy + int(N * 0.07)
rr(d, [fx - pw // 2, fy - ph // 2, fx + pw // 2, fy + ph // 2], int(N * 0.05), WHITE)
# red screen band + camera dot on the front device
rr(d, [fx - pw // 2 + int(N*0.025), fy - ph // 2 + int(N*0.055),
       fx + pw // 2 - int(N*0.025), fy + ph // 2 - int(N*0.055)], int(N * 0.03), RED)
d.ellipse([fx - int(N*0.012), fy - ph // 2 + int(N*0.018),
           fx + int(N*0.012), fy - ph // 2 + int(N*0.042)], fill=(20, 22, 25, 255))

sizes = [16, 24, 32, 48, 64, 128, 256]
imgs = [img.resize((s, s), Image.LANCZOS) for s in sizes]
imgs[-1].save(OUT_ICO, format="ICO", sizes=[(s, s) for s in sizes])
img.resize((256, 256), Image.LANCZOS).save(OUT_PNG)
print("wrote", OUT_ICO, "and", OUT_PNG)
if len(sys.argv) > 3:
    img.resize((64, 64), Image.LANCZOS).save(sys.argv[3])   # logo-64.png for splash
    print("wrote", sys.argv[3])
