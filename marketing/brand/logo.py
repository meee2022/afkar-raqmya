import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
from arabic_reshaper import ArabicReshaper
from bidi.algorithm import get_display
HERE=os.path.dirname(os.path.abspath(__file__))
FONTS=os.path.join(HERE,"..","carousel","fonts")
R=ArabicReshaper(configuration={"delete_harakat":True,"use_unshaped_instead_of_isolated":True})
ar=lambda t:get_display(R.reshape(t))
SS=3
GOLD=(232,214,186); GOLD2=(201,169,122); DARK=(74,14,30); GREEN=(122,22,48)
def F(n,s): return ImageFont.truetype(os.path.join(FONTS,n),s*SS)
EN="C:/Windows/Fonts/segoeuib.ttf"
def FE(s): return ImageFont.truetype(EN,s*SS)

def mark(d,cx,cy,s,fg,bg):
    # bulb-like idea mark: rounded square + lightbulb glyph
    d.rounded_rectangle([cx-s,cy-s,cx+s,cy+s],radius=int(s*0.42),fill=fg)
    r=s*0.42
    d.ellipse([cx-r,cy-r*1.25,cx+r,cy+r*0.55],outline=bg,width=int(s*0.13))
    d.line([(cx-r*0.45,cy+r*0.85),(cx+r*0.45,cy+r*0.85)],fill=bg,width=int(s*0.12))
    d.line([(cx-r*0.3,cy+r*1.15),(cx+r*0.3,cy+r*1.15)],fill=bg,width=int(s*0.12))
    d.line([(cx,cy-r*0.55),(cx,cy+r*0.2)],fill=bg,width=int(s*0.1))

def lockup(name,bg,fg_text,sub,mark_fg,mark_bg,w=1600,h=600):
    W,H=w*SS,h*SS
    img=Image.new("RGB",(W,H),bg); d=ImageDraw.Draw(img)
    if bg==DARK:
        g=Image.new("RGB",(W,H),(0,0,0))
        ImageDraw.Draw(g).ellipse([W*0.1,-H*0.4,W*0.6,H*1.0],fill=GOLD)
        g=g.filter(ImageFilter.GaussianBlur(W*0.08)); g=Image.eval(g,lambda v:int(v*0.18))
        img=ImageChops.screen(img,g); d=ImageDraw.Draw(img)
    s=int(110*SS); mx=W-int(200*SS); my=H//2
    mark(d,mx,my,s,mark_fg,mark_bg)
    tx=mx-s-int(60*SS)
    d.text((tx,my-int(55*SS)),ar("فكرة"),font=F("Tajawal-Black.ttf",150),fill=fg_text,anchor="rm")
    d.text((tx,my+int(95*SS)),ar("للتقنية والتصميم"),font=F("Tajawal-Bold.ttf",56),fill=sub,anchor="rm")
    d.text((int(90*SS),my-int(30*SS)),"Fikra",font=FE(120),fill=fg_text,anchor="lm")
    d.text((int(95*SS),my+int(80*SS)),"TECH & DESIGN",font=FE(44),fill=sub,anchor="lm")
    d.line([(W//2-int(10*SS),my-int(120*SS)),(W//2-int(10*SS),my+int(120*SS))],fill=(sub[0],sub[1],sub[2]),width=int(2*SS))
    img.resize((w,h),Image.LANCZOS).save(os.path.join(HERE,name))
    print("saved",name)

lockup("logo-dark.png",DARK,GOLD,(255,255,255),GOLD,GREEN)
lockup("logo-light.png",(245,237,224),(122,22,48),(150,110,80),(122,22,48),(245,237,224))

# square avatar for Instagram
S=1080; W=S*SS
img=Image.new("RGB",(W,W),DARK); d=ImageDraw.Draw(img)
g=Image.new("RGB",(W,W),(0,0,0)); ImageDraw.Draw(g).ellipse([W*0.15,W*0.1,W*0.85,W*0.8],fill=GOLD)
g=g.filter(ImageFilter.GaussianBlur(W*0.12)); g=Image.eval(g,lambda v:int(v*0.22)); img=ImageChops.screen(img,g); d=ImageDraw.Draw(img)
mark(d,W//2,int(W*0.40),int(200*SS),GOLD,GREEN)
d.text((W//2,int(W*0.72)),ar("فكرة"),font=F("Tajawal-Black.ttf",120),fill=GOLD,anchor="mm")
d.text((W//2,int(W*0.84)),"TECH & DESIGN",font=FE(46),fill=(255,255,255),anchor="mm")
img.resize((S,S),Image.LANCZOS).save(os.path.join(HERE,"avatar.png")); print("saved avatar.png")
