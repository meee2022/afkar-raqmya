# -*- coding: utf-8 -*-
"""Luminous Calm — Instagram carousel generator for أفكار رقمية."""
import os, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import arabic_reshaper
from arabic_reshaper import ArabicReshaper
from bidi.algorithm import get_display

# Tajawal lacks some legacy Presentation-Forms-B glyphs (e.g. isolated alef U+FE8D).
# Use the original unicode for isolated letters so they render via the font's cmap.
_reshaper = ArabicReshaper(configuration={
    "delete_harakat": True,
    "use_unshaped_instead_of_isolated": True,
})

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
OUT = os.path.join(HERE, "slides")
os.makedirs(OUT, exist_ok=True)

S = 1080  # square
SS = 3    # supersample factor for crisp text/shapes
W = S * SS

# ── palette ────────────────────────────────────────────────────────────────
BG_TOP   = (5, 10, 7)
BG_MID   = (0, 35, 27)
GOLD     = (254, 214, 91)
GOLD2    = (255, 167, 38)
GREEN    = (74, 222, 128)
WHITE    = (255, 255, 255)

def F(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size * SS)

def ar(txt):
    return get_display(_reshaper.reshape(txt))

# ── background: deep radial green + vignette ────────────────────────────────
def base():
    img = Image.new("RGB", (W, W), BG_TOP)
    px = img.load()
    cx, cy = W * 0.5, W * 0.34
    maxd = math.hypot(W, W)
    for y in range(W):
        for x in range(0, W, 1):
            pass
    # vectorised-ish: build via radial using numpy-free loop on downscaled then resize
    small = Image.new("RGB", (S, S))
    sp = small.load()
    for y in range(S):
        for x in range(S):
            dx = (x - S*0.5) / S
            dy = (y - S*0.34) / S
            d = min(1.0, math.hypot(dx, dy) * 1.5)
            # green core fading to near-black edges
            r = int(BG_MID[0]*(1-d) + BG_TOP[0]*d)
            g = int(BG_MID[1]*(1-d) + BG_TOP[1]*d)
            b = int(BG_MID[2]*(1-d) + BG_TOP[2]*d)
            sp[x, y] = (r, g, b)
    return small.resize((W, W), Image.LANCZOS)

def glow(img, cx, cy, radius, color, intensity=0.45):
    """Soft radial glow blended additively."""
    layer = Image.new("RGB", (W, W), (0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.ellipse([cx-radius, cy-radius, cx+radius, cy+radius], fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(radius*0.55))
    return Image.blend(img, Image.eval(Image.merge("RGB", [
        Image.blend(img.split()[i], Image.eval(layer.split()[i], lambda v: min(255, v)), 0)
        for i in range(3)
    ]), lambda v: v), 0) if False else _screen(img, layer, intensity)

def _screen(base_img, layer, k):
    b = base_img.load(); l = layer.load()
    # screen blend scaled by k, done on small then up? do directly (W is big -> slow). Downscale layer approach:
    return Image.blend(base_img, ImageChops_screen(base_img, layer), k)

# simpler: use ImageChops
from PIL import ImageChops
def add_glow(img, cx, cy, radius, color, k=0.5):
    layer = Image.new("RGB", (W, W), (0,0,0))
    ImageDraw.Draw(layer).ellipse([cx-radius, cy-radius, cx+radius, cy+radius], fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(int(radius*0.6)))
    layer = Image.eval(layer, lambda v: int(v*k))
    return ImageChops.screen(img, layer)

def rounded(draw, box, r, fill=None, outline=None, width=1):
    draw.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)

def glass_card(img, box, r=40):
    """Semi-transparent frosted card with hairline gold-tinted border."""
    x0,y0,x1,y1 = box
    overlay = Image.new("RGBA", (W, W), (0,0,0,0))
    od = ImageDraw.Draw(overlay)
    od.rounded_rectangle(box, radius=r*SS, fill=(255,255,255,10))
    od.rounded_rectangle(box, radius=r*SS, outline=(254,214,91,40), width=2*SS)
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"), (0,0))
    return img

def text_center(draw, cx, y, txt, font, fill, anchor="mm"):
    draw.text((cx, y), ar(txt), font=font, fill=fill, anchor=anchor)

def text_wrapped_center(draw, cx, y, lines, font, fill, lh):
    for i, ln in enumerate(lines):
        draw.text((cx, y + i*lh*SS), ar(ln), font=font, fill=fill, anchor="mm")

# ── logo mark (roof/house) + wordmark ───────────────────────────────────────
def logo(img, cx, y, scale=1.0):
    d = ImageDraw.Draw(img)
    s = int(46*SS*scale)
    # gold rounded square
    bx = [cx-s//2, y-s//2, cx+s//2, y+s//2]
    badge = Image.new("RGBA", (W, W), (0,0,0,0))
    bd = ImageDraw.Draw(badge)
    bd.rounded_rectangle(bx, radius=int(14*SS*scale), fill=(254,214,91,255))
    img.paste(Image.alpha_composite(img.convert("RGBA"), badge).convert("RGB"), (0,0))
    d = ImageDraw.Draw(img)
    # house glyph in dark green
    u = s*0.30
    cxx, cyy = cx, y
    d.line([(cxx-u, cyy+u*0.55), (cxx-u, cyy-u*0.05), (cxx, cyy-u*0.75),
            (cxx+u, cyy-u*0.05), (cxx+u, cyy+u*0.55)], fill=BG_MID, width=int(5*SS*scale), joint="curve")
    d.line([(cxx-u*0.35, cyy+u*0.55),(cxx-u*0.35, cyy+u*0.05),(cxx+u*0.05, cyy+u*0.05)], fill=BG_MID, width=int(5*SS*scale), joint="curve")

def wordmark(img, cx, y):
    d = ImageDraw.Draw(img)
    f = F("Tajawal-Bold.ttf", 26)
    d.text((cx, y), ar("أفكار رقمية"), font=f, fill=(255,255,255), anchor="mm")

# ── service icons (simple luminous line glyphs) ─────────────────────────────
def icon(img, cx, cy, kind, color, r=70):
    d = ImageDraw.Draw(img)
    w = int(6*SS)
    R = r*SS
    if kind == "web":
        d.rounded_rectangle([cx-R, cy-R*0.75, cx+R, cy+R*0.6], radius=int(10*SS), outline=color, width=w)
        d.line([cx-R*0.5, cy+R*0.95, cx+R*0.5, cy+R*0.95], fill=color, width=w)
        d.line([cx, cy+R*0.6, cx, cy+R*0.95], fill=color, width=w)
    elif kind == "app":
        d.rounded_rectangle([cx-R*0.62, cy-R, cx+R*0.62, cy+R], radius=int(14*SS), outline=color, width=w)
        d.ellipse([cx-int(4*SS), cy+R*0.62-int(4*SS), cx+int(4*SS), cy+R*0.62+int(4*SS)], fill=color)
    elif kind == "brand":
        # brush: diagonal handle + filled nib + sparkle
        hx0, hy0 = cx+R*0.55, cy-R*0.75   # top-right (handle end)
        hx1, hy1 = cx-R*0.30, cy+R*0.30   # toward brush
        d.line([(hx0, hy0),(hx1, hy1)], fill=color, width=w)
        # brush nib (filled triangle) at bottom-left tip
        tx, ty = cx-R*0.62, cy+R*0.62
        d.polygon([(hx1, hy1),(hx1-R*0.18, hy1+R*0.42),(hx1+R*0.42, hy1+R*0.18)], fill=color)
        d.polygon([(hx1-R*0.18, hy1+R*0.42),(tx, ty),(hx1+R*0.42, hy1+R*0.18)], fill=color)
        # sparkle near handle top
        sx, sy, sr = cx+R*0.72, cy-R*0.45, R*0.16
        d.line([(sx, sy-sr),(sx, sy+sr)], fill=color, width=int(w*0.7))
        d.line([(sx-sr, sy),(sx+sr, sy)], fill=color, width=int(w*0.7))
    elif kind == "video":
        d.rounded_rectangle([cx-R, cy-R*0.7, cx+R*0.35, cy+R*0.7], radius=int(12*SS), outline=color, width=w)
        d.polygon([(cx+R*0.45, cy-R*0.45),(cx+R, cy),(cx+R*0.45, cy+R*0.45)], outline=color, width=w)
    elif kind == "deck":
        # presentation board with bar chart
        d.rounded_rectangle([cx-R, cy-R*0.8, cx+R, cy+R*0.5], radius=int(10*SS), outline=color, width=w)
        d.line([(cx, cy+R*0.5),(cx, cy+R*0.8)], fill=color, width=w)
        d.line([(cx-R*0.35, cy+R*0.95),(cx+R*0.35, cy+R*0.95)], fill=color, width=w)
        d.line([(cx-R*0.5, cy+R*0.15),(cx-R*0.5, cy-R*0.1)], fill=color, width=w)
        d.line([(cx, cy+R*0.15),(cx, cy-R*0.4)], fill=color, width=w)
        d.line([(cx+R*0.5, cy+R*0.15),(cx+R*0.5, cy-R*0.25)], fill=color, width=w)
    elif kind == "invite":
        # envelope
        d.rounded_rectangle([cx-R, cy-R*0.65, cx+R, cy+R*0.65], radius=int(10*SS), outline=color, width=w)
        d.line([(cx-R, cy-R*0.5),(cx, cy+R*0.18),(cx+R, cy-R*0.5)], fill=color, width=w, joint="curve")
    elif kind == "rocket":
        d.line([(cx, cy-R),(cx+R*0.55, cy+R*0.2),(cx, cy+R*0.55),(cx-R*0.55, cy+R*0.2),(cx, cy-R)], fill=color, width=w, joint="curve")
        d.ellipse([cx-R*0.18, cy-R*0.25, cx+R*0.18, cy+R*0.11], outline=color, width=w)
        d.line([(cx-R*0.25, cy+R*0.55),(cx-R*0.45, cy+R*0.95)], fill=color, width=w)
        d.line([(cx+R*0.25, cy+R*0.55),(cx+R*0.45, cy+R*0.95)], fill=color, width=w)

def swipe_hint(img, cx, y):
    d = ImageDraw.Draw(img)
    f = F("Tajawal-Medium.ttf", 22)
    d.text((cx+int(30*SS), y), ar("اسحب"), font=f, fill=(254,214,91), anchor="mm")
    # left arrow
    ax = cx - int(30*SS)
    d.line([(ax+int(26*SS), y),(ax-int(20*SS), y)], fill=(254,214,91), width=int(4*SS))
    d.line([(ax-int(20*SS), y),(ax-int(6*SS), y-int(10*SS))], fill=(254,214,91), width=int(4*SS))
    d.line([(ax-int(20*SS), y),(ax-int(6*SS), y+int(10*SS))], fill=(254,214,91), width=int(4*SS))

def page_marker(img, idx, total=8):
    d = ImageDraw.Draw(img)
    f = F("Tajawal-Bold.ttf", 20)
    d.text((W-int(70*SS), int(70*SS)), f"0{idx} / 0{total}", font=f, fill=(255,255,255,120), anchor="rm")

def finish(img, name):
    out = img.resize((S, S), Image.LANCZOS)
    out.save(os.path.join(OUT, name))
    print("saved", name)

# ════════════════════════════════════════════════════════════════════════════
def cover():
    img = base()
    img = add_glow(img, int(W*0.5), int(W*0.30), int(W*0.34), GOLD, 0.42)
    img = add_glow(img, int(W*0.18), int(W*0.85), int(W*0.28), (0,80,60), 0.5)
    d = ImageDraw.Draw(img)
    logo(img, int(W*0.5), int(W*0.16), 1.15)
    d = ImageDraw.Draw(img)
    d.text((int(W*0.5), int(W*0.235)), ar("أفكار رقمية"), font=F("Tajawal-Bold.ttf", 30), fill=WHITE, anchor="mm")
    d.text((int(W*0.5), int(W*0.275)), ar("وكالة رقمية — قطر"), font=F("Tajawal-Medium.ttf", 20), fill=(255,255,255,160), anchor="mm")
    # headline (gold)
    fh = F("Tajawal-Black.ttf", 92)
    text_wrapped_center(d, int(W*0.5), int(W*0.49), ["كل ما يحتاجه", "مشروعك في", "مكان واحد"], fh, GOLD, 96)
    # thin gold underline
    d.line([(int(W*0.32), int(W*0.665)),(int(W*0.68), int(W*0.665))], fill=GOLD2, width=int(2*SS))
    d.text((int(W*0.5), int(W*0.71)), ar("ستّ خدمات رقمية متكاملة تبدأ من الفكرة وتنتهي بالنتيجة"),
           font=F("Tajawal-Medium.ttf", 24), fill=(255,255,255,200), anchor="mm")
    swipe_hint(img, int(W*0.5), int(W*0.9))
    finish(img, "01-cover.png")

def service(idx, num, title, lines, kind, accent, fname):
    img = base()
    img = add_glow(img, int(W*0.5), int(W*0.32), int(W*0.30), accent, 0.32)
    img = add_glow(img, int(W*0.82), int(W*0.9), int(W*0.22), GOLD, 0.22)
    d = ImageDraw.Draw(img)
    logo(img, int(W*0.12), int(W*0.1), 0.7)
    d = ImageDraw.Draw(img)
    d.text((W-int(120*SS), int(W*0.1)), ar("أفكار رقمية"), font=F("Tajawal-Bold.ttf", 22), fill=(255,255,255,180), anchor="rm")
    page_marker(img, idx)
    # icon badge
    bcx, bcy = int(W*0.5), int(W*0.30)
    badge = Image.new("RGBA",(W,W),(0,0,0,0))
    ImageDraw.Draw(badge).ellipse([bcx-int(95*SS),bcy-int(95*SS),bcx+int(95*SS),bcy+int(95*SS)],
                                  fill=(accent[0],accent[1],accent[2],28), outline=(accent[0],accent[1],accent[2],120), width=int(2*SS))
    img.paste(Image.alpha_composite(img.convert("RGBA"),badge).convert("RGB"),(0,0))
    icon(img, bcx, bcy, kind, accent, r=58)
    d = ImageDraw.Draw(img)
    # title
    d.text((int(W*0.5), int(W*0.52)), ar(title), font=F("Tajawal-Black.ttf", 64), fill=WHITE, anchor="mm")
    d.line([(int(W*0.40), int(W*0.575)),(int(W*0.60), int(W*0.575))], fill=accent, width=int(3*SS))
    # description lines
    text_wrapped_center(d, int(W*0.5), int(W*0.64), lines, F("Tajawal-Medium.ttf", 30), (255,255,255,210), 52)
    finish(img, fname)

def cta():
    img = base()
    img = add_glow(img, int(W*0.5), int(W*0.42), int(W*0.40), GOLD, 0.5)
    img = add_glow(img, int(W*0.5), int(W*0.95), int(W*0.3), (0,80,60), 0.4)
    d = ImageDraw.Draw(img)
    logo(img, int(W*0.5), int(W*0.15), 1.0)
    d = ImageDraw.Draw(img)
    d.text((int(W*0.5), int(W*0.36)), ar("جاهز تبدأ"), font=F("Tajawal-Black.ttf", 88), fill=WHITE, anchor="mm")
    d.text((int(W*0.5), int(W*0.45)), ar("مشروعك؟"), font=F("Tajawal-Black.ttf", 88), fill=GOLD, anchor="mm")
    d.text((int(W*0.5), int(W*0.55)), ar("احجز استشارتك المجانية الآن — بدون أي التزام"),
           font=F("Tajawal-Medium.ttf", 26), fill=(255,255,255,210), anchor="mm")
    # gold pill button
    bw, bh = int(W*0.42), int(72*SS)
    bx0 = int(W*0.5-bw/2); by0 = int(W*0.63)
    pill = Image.new("RGBA",(W,W),(0,0,0,0))
    ImageDraw.Draw(pill).rounded_rectangle([bx0,by0,bx0+bw,by0+bh], radius=bh//2, fill=(254,214,91,255))
    img.paste(Image.alpha_composite(img.convert("RGBA"),pill).convert("RGB"),(0,0))
    d = ImageDraw.Draw(img)
    d.text((int(W*0.5), by0+bh//2), ar("تواصل معنا الآن"), font=F("Tajawal-Bold.ttf", 30), fill=BG_MID, anchor="mm")
    # handle
    d.text((int(W*0.5), int(W*0.83)), ar("@أفكار_رقمية"), font=F("Tajawal-Bold.ttf", 28), fill=GOLD, anchor="mm")
    d.text((int(W*0.5), int(W*0.885)), ar("تابعنا لمزيد من الأعمال والنتائج"),
           font=F("Tajawal-Medium.ttf", 20), fill=(255,255,255,150), anchor="mm")
    finish(img, "06-cta.png")

# ── Story (1080x1920) — compose square slide into a vertical branded frame ──
def make_story(square_name, story_name):
    SH = 1920
    # vertical gradient background
    small = Image.new("RGB", (S, SH))
    sp = small.load()
    for y in range(SH):
        for x in range(S):
            dx = (x - S*0.5) / S
            dy = (y - SH*0.34) / SH
            d = min(1.0, math.hypot(dx, dy) * 1.4)
            sp[x, y] = (int(BG_MID[0]*(1-d)+BG_TOP[0]*d),
                        int(BG_MID[1]*(1-d)+BG_TOP[1]*d),
                        int(BG_MID[2]*(1-d)+BG_TOP[2]*d))
    bgW = small.resize((S*SS, SH*SS), Image.LANCZOS)
    bgW = add_glow_h(bgW, int(S*SS*0.5), int(SH*SS*0.22), int(S*SS*0.34), GOLD, 0.30, SH)
    # place the square slide centered
    sq = Image.open(os.path.join(OUT, square_name)).convert("RGB").resize((S*SS, S*SS), Image.LANCZOS)
    canvas = bgW.copy()
    oy = int((SH*SS - S*SS)/2)
    # rounded corners on the square
    mask = Image.new("L", (S*SS, S*SS), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0,0,S*SS,S*SS], radius=int(40*SS), fill=255)
    canvas.paste(sq, (0, oy), mask)
    d = ImageDraw.Draw(canvas)
    # top brand
    d.text((int(S*SS*0.5), int(SH*SS*0.085)), ar("أفكار رقمية"), font=F("Tajawal-Black.ttf", 40), fill=GOLD, anchor="mm")
    d.text((int(S*SS*0.5), int(SH*SS*0.125)), ar("وكالة رقمية — قطر"), font=F("Tajawal-Medium.ttf", 22), fill=(255,255,255,180), anchor="mm")
    # bottom CTA
    d.text((int(S*SS*0.5), int(SH*SS*0.9)), ar("راسلنا الآن على واتساب 👋"), font=F("Tajawal-Bold.ttf", 30), fill=WHITE, anchor="mm")
    out = canvas.resize((S, SH), Image.LANCZOS)
    os.makedirs(os.path.join(OUT, "stories"), exist_ok=True)
    out.save(os.path.join(OUT, "stories", story_name))
    print("saved stories/" + story_name)

def add_glow_h(img, cx, cy, radius, color, k, H):
    layer = Image.new("RGB", (S*SS, H*SS), (0,0,0))
    ImageDraw.Draw(layer).ellipse([cx-radius, cy-radius, cx+radius, cy+radius], fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(int(radius*0.6)))
    layer = Image.eval(layer, lambda v: int(v*k))
    return ImageChops.screen(img, layer)

if __name__ == "__main__":
    cover()
    service(2, "٠٢", "تصميم وتطوير المواقع", ["مواقع احترافية سريعة ومتجاوبة", "تعكس هوية علامتك وتحقق أهدافك"], "web", GREEN, "02-web.png")
    service(3, "٠٣", "تطبيقات الجوال", ["تطبيقات iOS و Android بتجربة", "سلسة وأداء عالٍ يلبّي جمهورك"], "app", (96,165,250), "03-app.png")
    service(4, "٠٤", "الهوية البصرية", ["شعار وألوان وخطوط متكاملة", "تعكس شخصية علامتك التجارية"], "brand", (244,114,182), "04-brand.png")
    service(5, "٠٥", "الفيديو والموشن جرافيك", ["فيديوهات ترويجية تشرح خدمتك", "وتجذب انتباه جمهورك بإبداع"], "video", (167,139,250), "05-video.png")
    service(6, "٠٦", "العروض التقديمية", ["عروض Pitch Deck احترافية", "تروي قصة مشروعك بأسلوب مؤثر"], "deck", (251,146,60), "06-decks.png")
    service(7, "٠٧", "الدعوات الرقمية", ["دعوات تفاعلية لمناسباتك", "تُرسل عبر واتساب وتُبهر ضيوفك"], "invite", (45,212,191), "07-invites.png")
    cta()
    os.replace(os.path.join(OUT, "06-cta.png"), os.path.join(OUT, "08-cta.png"))
    print("done slides")
    # stories for every slide
    for sq in ["01-cover.png","02-web.png","03-app.png","04-brand.png",
               "05-video.png","06-decks.png","07-invites.png","08-cta.png"]:
        make_story(sq, "story-" + sq.split("-",1)[1])
    print("done stories")
