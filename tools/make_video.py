"""Genera el vídeo de la landing (horizontal o vertical) con fotos de boda.

Uso: python make_video.py <assets_dir> <out_dir> <h|v>
Escribe los fotogramas como PNG en out_dir/frames_<h|v>/.
"""
import math
import os
import sys

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ASSETS, OUT, MODE = sys.argv[1], sys.argv[2], sys.argv[3]
W, H = (1600, 900) if MODE == "h" else (720, 1280)
FPS, DUR = 30, 10.0
N = int(FPS * DUR)
PINK = (255, 0, 128)
BG = (8, 6, 10)
S = W / 1600 if MODE == "h" else W / 720  # escala de fuentes

FONT = "/usr/share/fonts/opentype/inter/"
def font(name, size):
    return ImageFont.truetype(FONT + name, int(size))

PH = os.path.join(ASSETS, "photos")

# ── utilidades ────────────────────────────────────────────────────────────
def ease(t):  # easeOutExpo-ish, 0..1
    t = max(0.0, min(1.0, t))
    return 1 - math.pow(2, -10 * t) if t < 1 else 1.0

def ease_io(t):
    t = max(0.0, min(1.0, t))
    return 0.5 - 0.5 * math.cos(math.pi * t)

def prog(t, a, b):
    return max(0.0, min(1.0, (t - a) / (b - a)))

def cover(img, w, h, zoom=1.0, cx=0.5, cy=0.5):
    iw, ih = img.size
    s = max(w / iw, h / ih) * zoom
    nw, nh = int(iw * s), int(ih * s)
    im = img.resize((nw, nh), Image.LANCZOS)
    x = int((nw - w) * cx)
    y = int((nh - h) * cy)
    return im.crop((x, y, x + w, y + h))

def before(img):
    """Aspecto «sin editar»: subexpuesta, plana, fría y apagada."""
    im = ImageEnhance.Brightness(img).enhance(0.62)
    im = ImageEnhance.Contrast(im).enhance(0.72)
    im = ImageEnhance.Color(im).enhance(0.55)
    r, g, b = im.split()
    b = b.point(lambda v: min(255, int(v * 1.08 + 6)))
    r = r.point(lambda v: int(v * 0.94))
    return Image.merge("RGB", (r, g, b))

def after(img):
    """Edición de PhootFlow: luminosa, cálida, contraste suave."""
    im = ImageEnhance.Brightness(img).enhance(1.06)
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.08)
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * 1.03 + 3)))
    b = b.point(lambda v: int(v * 0.97))
    return Image.merge("RGB", (r, g, b))

def shade_bottom(base, strength=0.85, frac=0.55):
    h = int(base.height * frac)
    grad = Image.new("L", (1, h))
    for y in range(h):
        grad.putpixel((0, y), int(255 * strength * (y / h) ** 1.6))
    grad = grad.resize((base.width, h))
    black = Image.new("RGB", (base.width, h), (0, 0, 0))
    base.paste(black, (0, base.height - h), grad)

def text(draw, xy, s, f, fill, alpha=1.0, anchor="la"):
    if alpha <= 0:
        return
    c = tuple(int(v) for v in fill) + (int(255 * alpha),)
    draw.text(xy, s, font=f, fill=c, anchor=anchor)

def chip(layer, xy, label, bg, fg=(255, 255, 255), size=20, alpha=1.0, anchor="l"):
    if alpha <= 0:
        return
    d = ImageDraw.Draw(layer)
    f = font("Inter-SemiBold.otf", size * S)
    l, t_, r, b = d.textbbox((0, 0), label, font=f)
    pw, ph = int(14 * S), int(7 * S)
    w, h = r - l + 2 * pw, b - t_ + 2 * ph
    x, y = xy
    if anchor == "r":
        x -= w
    if anchor == "c":
        x -= w // 2
    d.rounded_rectangle((x, y, x + w, y + h), radius=h // 2, fill=tuple(bg) + (int(230 * alpha),))
    d.text((x + pw - l, y + ph - t_), label, font=f, fill=tuple(fg) + (int(255 * alpha),))

def overlay(base, layer):
    base.paste(layer, (0, 0), layer)

# ── recursos ──────────────────────────────────────────────────────────────
church = Image.open(os.path.join(PH, "wedding-1.jpg")).convert("RGB")
rings = Image.open(os.path.join(PH, "wedding-2.jpg")).convert("RGB")
church_b, church_a = before(church), after(church)
rings_b, rings_a = before(rings), after(rings)

portrait = Image.open(os.path.join(PH, "portrait-1.jpg")).convert("RGB")
def crop_frac(im, x0, y0, x1, y1):
    w, h = im.size
    return im.crop((int(w * x0), int(h * y0), int(w * x1), int(h * y1)))
# Galería de una boda: encuadres distintos de la ceremonia, los anillos y un retrato
grid_imgs = [
    church,                                   # plano general
    crop_frac(church, 0.50, 0.15, 0.78, 0.95), # la novia
    crop_frac(rings, 0.15, 0.40, 0.85, 1.00),  # anillos
    crop_frac(church, 0.00, 0.30, 0.35, 1.00), # invitados
    portrait,                                  # retrato
    crop_frac(church, 0.55, 0.00, 1.00, 0.55), # vidrieras
    crop_frac(rings, 0.00, 0.00, 0.70, 0.60),  # bokeh dorado
    crop_frac(church, 0.30, 0.35, 0.62, 1.00), # pasillo
    crop_frac(church, 0.58, 0.40, 0.75, 0.75), # ramo
    crop_frac(rings, 0.35, 0.50, 0.75, 0.85),  # detalle anillos
    crop_frac(church, 0.10, 0.00, 0.60, 0.50), # techo y luz
    crop_frac(portrait, 0.15, 0.10, 0.90, 0.70),  # retrato cercano
]
discard = {3, 8}  # índices que «aparta» la selección automática

mark = Image.open(os.path.join(ASSETS, "mark.png")).convert("RGBA")
word = Image.open(os.path.join(ASSETS, "wordmark.png")).convert("RGBA")

T = {
    "h1": "2.000 fotos de tu boda.",
    "h2": "Editadas solas.",
    "sel_t": "Events",
    "sel": "Selecciona las mejores y aparta las fallidas",
    "uni_t": "Un solo estilo",
    "uni": "Toda la boda, el mismo revelado.",
    "tag1": "Edita menos. ",
    "tag2": "Dispara más.",
    "sub": "Edición por lotes para fotógrafos de bodas, eventos y deporte  ·  Windows",
    "sub_v": ["Edición por lotes para fotógrafos", "de bodas, eventos y deporte · Windows"],
}

# ── escenas ───────────────────────────────────────────────────────────────
def scene_wipe(t, t0, t1, img_b, img_a, title, subtitle, pink_sub, cx=0.5, cy=0.5):
    """Antes/después con barrido de una línea rosa y titulares."""
    lt = t - t0
    dur = t1 - t0
    z = 1.04 + 0.05 * (lt / dur)
    b = cover(img_b, W, H, z, cx, cy)
    a = cover(img_a, W, H, z, cx, cy)
    k = ease_io(prog(lt, 0.45, 0.45 + dur * 0.5))
    x = int(W * k)
    frame = b.copy()
    if x > 0:
        frame.paste(a.crop((0, 0, x, H)), (0, 0))
    shade_bottom(frame, 0.9, 0.6)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    if 0 < x < W:
        d.rectangle((x - int(2 * S), 0, x + int(2 * S), H), fill=PINK + (255,))
        r = int(13 * S)
        d.ellipse((x - r, H // 2 - r, x + r, H // 2 + r), fill=PINK + (255,), outline=(255, 255, 255, 255), width=max(2, int(3 * S)))
    m = int(32 * S)
    chip(layer, (W - m, m), "ANTES", (0, 0, 0), size=15, alpha=1 - k, anchor="r")
    chip(layer, (m, m), "DESPUÉS", PINK, size=15, alpha=min(1, k * 3))
    big = font("Inter-Bold.otf", (62 if MODE == "h" else 50) * S)
    pad = int(64 * S) if MODE == "h" else int(44 * S)
    gap = int((76 if MODE == "h" else 62) * S)
    def wrap(s_):
        out, cur = [], ""
        for w_ in s_.split(" "):
            tst = (cur + " " + w_).strip()
            if d.textlength(tst, font=big) > W - 2 * pad:
                out.append(cur)
                cur = w_
            else:
                cur = tst
        return out + [cur]
    l1, l2 = wrap(title), wrap(subtitle)
    base_y = H - int((110 if MODE == "h" else 170) * S) - gap * (len(l1) + len(l2) - 1)
    a1 = ease(prog(lt, 0.15, 0.85))
    for i, ln in enumerate(l1):
        text(d, (pad, base_y + gap * i + int(14 * S * (1 - a1))), ln, big, (255, 255, 255), a1)
    a2 = ease(prog(lt, 0.45 + dur * 0.35, 0.45 + dur * 0.35 + 0.6))
    for i, ln in enumerate(l2):
        text(d, (pad, base_y + gap * (len(l1) + i) + int(14 * S * (1 - a2))), ln, big, PINK if pink_sub else (255, 255, 255), a2)
    overlay(frame, layer)
    return frame

def caption(layer, lt, label, desc):
    d = ImageDraw.Draw(layer)
    a = ease(prog(lt, 0.0, 0.6))
    fb = font("Inter-Bold.otf", (34 if MODE == "h" else 30) * S)
    fr = font("Inter-Medium.otf", (34 if MODE == "h" else 26) * S)
    y = int((56 if MODE == "h" else 90) * S)
    if MODE == "h":
        lw = d.textlength(label + "  ", font=fb)
        tw = lw + d.textlength(desc, font=fr)
        x0 = (W - tw) / 2
        text(d, (x0, y), label + "  ", fb, PINK, a)
        text(d, (x0 + lw, y), desc, fr, (255, 255, 255), a)
    else:
        text(d, (W / 2, y), label, fb, PINK, a, anchor="ma")
        words = desc.split(" ")
        lines, cur = [], ""
        for w_ in words:
            test = (cur + " " + w_).strip()
            if d.textlength(test, font=fr) > W - 80 * S:
                lines.append(cur)
                cur = w_
            else:
                cur = test
        lines.append(cur)
        for i, ln in enumerate(lines):
            text(d, (W / 2, y + int((46 + 36 * i) * S)), ln, fr, (255, 255, 255), a, anchor="ma")

def bg_glow():
    im = Image.new("RGB", (W, H), BG)
    glow = Image.new("RGB", (W, H), (60, 6, 36))
    mask = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse((-W * 0.3, -H * 0.2, W * 1.3, H * 1.4), fill=150)
    mask = mask.filter(ImageFilter.GaussianBlur(int(min(W, H) * 0.25)))
    im.paste(glow, (0, 0), mask)
    return im

BG_IMG = bg_glow()
cols, rows = (6, 2) if MODE == "h" else (3, 4)
gpad = int((26 if MODE == "h" else 20) * S)
top = int((150 if MODE == "h" else 300) * S)
gw = W - 2 * int((60 if MODE == "h" else 30) * S)
cell = (gw - (cols - 1) * gpad) // cols
cell_h = int(cell * (1.32 if MODE == "h" else 1.28))
grid_h = rows * cell_h + (rows - 1) * gpad
gx0 = (W - (cols * cell + (cols - 1) * gpad)) // 2
gy0 = top + ((H - top - int((40 if MODE == "h" else 80) * S)) - grid_h) // 2
thumbs_b = [cover(before(im), cell, cell_h) for im in grid_imgs]
thumbs_a = [cover(after(im), cell, cell_h) for im in grid_imgs]

def rounded(im, r):
    m = Image.new("L", im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, im.width - 1, im.height - 1), radius=r, fill=255)
    out = Image.new("RGBA", im.size)
    out.paste(im, (0, 0), m)
    return out

def scene_grid(t, t0, t1):
    lt = t - t0
    frame = BG_IMG.copy()
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    caption(layer, lt, T["sel_t"], T["sel"])
    d = ImageDraw.Draw(layer)
    for i in range(len(grid_imgs)):
        c, r = i % cols, i // cols
        x = gx0 + c * (cell + gpad)
        y = gy0 + r * (cell_h + gpad)
        appear = ease(prog(lt, 0.05 + i * 0.04, 0.55 + i * 0.04))
        if appear <= 0:
            continue
        dy = int(30 * S * (1 - appear))
        edited = prog(lt, 0.9 + i * 0.05, 1.1 + i * 0.05)
        im = Image.blend(thumbs_b[i], thumbs_a[i], edited)
        if i in discard and edited > 0:
            im = Image.blend(im, ImageEnhance.Brightness(im).enhance(0.35), edited)
        th = rounded(im, int(12 * S))
        if appear < 1:
            th.putalpha(th.getchannel("A").point(lambda v: int(v * appear)))
        frame.paste(th, (x, y + dy), th)
        if edited > 0.5:
            if i in discard:
                chip(layer, (x + int(10 * S), y + dy + int(10 * S)), "Descartada", (220, 38, 38), size=13, alpha=(edited - 0.5) * 2)
            else:
                rr = int(13 * S)
                cx, cy = x + cell - int(12 * S) - rr, y + dy + int(12 * S) + rr
                al = int(255 * (edited - 0.5) * 2)
                d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=PINK + (al,))
                w_ = max(2, int(3 * S))
                d.line((cx - rr * 0.45, cy, cx - rr * 0.1, cy + rr * 0.4, cx + rr * 0.5, cy - rr * 0.35), fill=(255, 255, 255, al), width=w_, joint="curve")
        if i == 0 and edited > 0:
            d.rounded_rectangle((x - 3, y + dy - 3, x + cell + 2, y + dy + cell_h + 2), radius=int(14 * S), outline=PINK + (int(255 * edited),), width=max(2, int(3 * S)))
    # contador
    n = int(2000 * ease_io(prog(lt, 0.2, (t1 - t0) - 0.3)))
    fc = font("Inter-SemiBold.otf", (22 if MODE == "h" else 22) * S)
    txt = f"{n:,}".replace(",", ".") + " / 2.000 fotos"
    text(d, (W / 2, gy0 + grid_h + int(28 * S)), txt, fc, (255, 255, 255), 0.7 * ease(prog(lt, 0.2, 0.8)), anchor="ma")
    overlay(frame, layer)
    return frame

def scene_end(t, t0):
    lt = t - t0
    frame = BG_IMG.copy()
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    a = ease(prog(lt, 0.0, 0.8))
    mh = int((170 if MODE == "h" else 150) * S * (0.92 + 0.08 * a))
    m = mark.resize((int(mark.width * mh / mark.height), mh), Image.LANCZOS)
    wh = int((64 if MODE == "h" else 50) * S)
    w = word.resize((int(word.width * wh / word.height), wh), Image.LANCZOS)
    cy = H // 2 - int((120 if MODE == "h" else 150) * S)
    for im, y in ((m, cy - mh // 2), (w, cy + mh // 2 + int(30 * S))):
        im = im.copy()
        im.putalpha(im.getchannel("A").point(lambda v: int(v * a)))
        layer.paste(im, ((W - im.width) // 2, y), im)
    d = ImageDraw.Draw(layer)
    a2 = ease(prog(lt, 0.5, 1.2))
    ft = font("Inter-Bold.otf", (52 if MODE == "h" else 42) * S)
    y2 = cy + mh // 2 + int(30 * S) + wh + int((70 if MODE == "h" else 70) * S)
    if MODE == "h":
        w1 = d.textlength(T["tag1"], font=ft)
        w2 = d.textlength(T["tag2"], font=ft)
        x0 = (W - w1 - w2) / 2
        text(d, (x0, y2), T["tag1"], ft, (255, 255, 255), a2)
        text(d, (x0 + w1, y2), T["tag2"], ft, PINK, a2)
    else:
        text(d, (W / 2, y2), T["tag1"].strip(), ft, (255, 255, 255), a2, anchor="ma")
        text(d, (W / 2, y2 + int(56 * S)), T["tag2"], ft, PINK, a2, anchor="ma")
    a3 = ease(prog(lt, 0.9, 1.6))
    fs = font("Inter-Regular.otf", (24 if MODE == "h" else 22) * S)
    y3 = y2 + int((90 if MODE == "h" else 150) * S)
    if MODE == "h":
        text(d, (W / 2, y3), T["sub"], fs, (210, 200, 215), a3, anchor="ma")
    else:
        for i, ln in enumerate(T["sub_v"]):
            text(d, (W / 2, y3 + int(34 * S * i)), ln, fs, (210, 200, 215), a3, anchor="ma")
    overlay(frame, layer)
    return frame

# Escenas: (inicio, fin, función)
SCENES = [
    (0.0, 3.6, lambda t: scene_wipe(t, 0.0, 3.6, church_b, church_a, T["h1"], T["h2"], True,
                                    cx=0.5 if MODE == "h" else 0.55, cy=0.4)),
    (3.6, 6.4, lambda t: scene_grid(t, 3.6, 6.4)),
    (6.4, 8.2, lambda t: scene_wipe(t, 6.4, 8.2, rings_b, rings_a, T["uni_t"], T["uni"], False, cy=0.55)),
    (8.2, 10.0, lambda t: scene_end(t, 8.2)),
]
XF = 0.3  # fundido entre escenas

def render(t):
    for i, (a, b, fn) in enumerate(SCENES):
        if a <= t < b or (i == len(SCENES) - 1 and t >= b):
            fr = fn(t)
            if i + 1 < len(SCENES) and t > b - XF:
                nxt = SCENES[i + 1][2](t)
                fr = Image.blend(fr, nxt, (t - (b - XF)) / XF)
            return fr
    return SCENES[-1][2](t)

out = os.path.join(OUT, f"frames_{MODE}")
os.makedirs(out, exist_ok=True)
only = os.environ.get("ONLY")  # para previsualizar: ONLY="1.5,5,7,9.5"
times = [float(x) for x in only.split(",")] if only else [i / FPS for i in range(N)]
for k, t in enumerate(times):
    render(t).save(os.path.join(out, f"{k:04d}.png"))
print("frames", len(times), out)
