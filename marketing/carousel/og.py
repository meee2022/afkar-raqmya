# -*- coding: utf-8 -*-
"""Generate Open Graph share image (1200x630) -> public/og-image.png"""
import os, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
import arabic_reshaper
from arabic_reshaper import ArabicReshaper
from bidi.algorithm import get_display

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
PUBLIC = os.path.normpath(os.path.join(HERE, "..", "..", "public"))
os.makedirs(PUBLIC, exist_ok=True)

SS = 3
Wd, Hd = 1200, 630
W, H = Wd*SS, Hd*SS
GOLD=(254,214,91); GOLD2=(255,167,38); BG_TOP=(5,10,7); BG_MID=(0,35,27)
_r = ArabicReshaper(configuration={"delete_harakat": True, "use_unshaped_instead_of_isolated": True})
def ar(t): return get_display(_r.reshape(t))
def F(n,s): return ImageFont.truetype(os.path.join(FONTS,n), s*SS)

# radial bg
small=Image.new("RGB",(Wd,Hd)); sp=small.load()
for y in range(Hd):
    for x in range(Wd):
        dx=(x-Wd*0.5)/Wd; dy=(y-Hd*0.4)/Hd
        d=min(1.0, math.hypot(dx,dy)*1.5)
        sp[x,y]=(int(BG_MID[0]*(1-d)+BG_TOP[0]*d),int(BG_MID[1]*(1-d)+BG_TOP[1]*d),int(BG_MID[2]*(1-d)+BG_TOP[2]*d))
img=small.resize((W,H),Image.LANCZOS)
# glow
layer=Image.new("RGB",(W,H),(0,0,0))
ImageDraw.Draw(layer).ellipse([W*0.5-W*0.3,H*0.2-W*0.3,W*0.5+W*0.3,H*0.2+W*0.3],fill=GOLD)
layer=layer.filter(ImageFilter.GaussianBlur(int(W*0.18)))
layer=Image.eval(layer,lambda v:int(v*0.33))
img=ImageChops.screen(img,layer)
d=ImageDraw.Draw(img)
# logo badge
cx=W//2; by=int(H*0.2)
badge=Image.new("RGBA",(W,H),(0,0,0,0))
bs=int(70*SS)
ImageDraw.Draw(badge).rounded_rectangle([cx-bs//2,by-bs//2,cx+bs//2,by+bs//2],radius=int(20*SS),fill=(254,214,91,255))
img.paste(Image.alpha_composite(img.convert("RGBA"),badge).convert("RGB"),(0,0))
d=ImageDraw.Draw(img)
u=bs*0.30
d.line([(cx-u,by+u*0.55),(cx-u,by-u*0.05),(cx,by-u*0.75),(cx+u,by-u*0.05),(cx+u,by+u*0.55)],fill=BG_MID,width=int(7*SS),joint="curve")
d.line([(cx-u*0.35,by+u*0.55),(cx-u*0.35,by+u*0.05),(cx+u*0.05,by+u*0.05)],fill=BG_MID,width=int(7*SS),joint="curve")
# texts
d.text((cx,int(H*0.46)),ar("أفكار رقمية"),font=F("Tajawal-Black.ttf",84),fill=GOLD,anchor="mm")
d.text((cx,int(H*0.62)),ar("حلول رقمية متكاملة — مواقع · تطبيقات · هوية · فيديو"),font=F("Tajawal-Bold.ttf",30),fill=(255,255,255,235),anchor="mm")
d.line([(int(W*0.36),int(H*0.72)),(int(W*0.64),int(H*0.72))],fill=GOLD2,width=int(2*SS))
d.text((cx,int(H*0.8)),ar("وكالة رقمية — قطر"),font=F("Tajawal-Medium.ttf",24),fill=(255,255,255,170),anchor="mm")
img.resize((Wd,Hd),Image.LANCZOS).save(os.path.join(PUBLIC,"og-image.png"))
print("saved", os.path.join(PUBLIC,"og-image.png"))
