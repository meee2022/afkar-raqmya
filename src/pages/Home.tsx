import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Play, Sparkles } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Seo from "../components/Seo";
import { STATIC_PROJECTS } from "../data/projects";

// ── Animated text ─────────────────────────────────────────────────────────────
interface AnimatedTextProps {
  text: string;
  className?: string;
  animationType?: "letters" | "words";
  duration?: number;
  delay?: number;
  staggerDelay?: number;
  initialY?: number;
  initialOpacity?: number;
  as?: "h1" | "div";
}

function AnimatedText({
  text,
  className = "text-4xl font-bold",
  animationType = "letters",
  duration = 0.6,
  delay = 0,
  staggerDelay = 0.05,
  initialY = 10,
  initialOpacity = 0,
  as = "div",
}: AnimatedTextProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: staggerDelay, delayChildren: delay } },
  };
  const itemVariants = {
    hidden: { y: initialY, opacity: initialOpacity },
    visible: { y: 0, opacity: 1, transition: { duration, ease: "easeOut" as const } },
  };

  const MotionTag = as === "h1" ? motion.h1 : motion.div;
  return (
    <MotionTag className={className} variants={containerVariants} initial="hidden" animate="visible">
      {animationType === "letters"
        ? text.split("").map((char, i) => (
            <motion.span key={i} variants={itemVariants} className="inline-block"
              style={{ whiteSpace: char === " " ? "pre" : "normal" }}>{char}</motion.span>
          ))
        : text.split(" ").map((word, i) => (
            <motion.span key={i} variants={itemVariants} className="ml-2 inline-block">{word}</motion.span>
          ))}
    </MotionTag>
  );
}

// ── Services strip ────────────────────────────────────────────────────────────
const SERVICES_LIST = [
  { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>, label: "مواقع", color: "#4ade80" },
  { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>, label: "تطبيقات", color: "#60a5fa" },
  { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, label: "هوية بصرية", color: "#f472b6" },
  { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M2 3h20v14H2zM8 21l4-4 4 4"/></svg>, label: "عروض", color: "#fb923c" },
  { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14v-4z"/><rect x="2" y="6" width="13" height="12" rx="2"/></svg>, label: "فيديو", color: "#a78bfa" },
  { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>, label: "دعوات", color: "#2dd4bf" },
];

// ── Scroll-reveal helper for the sections below the hero ─────────────────────
const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

// ── Home services showcase ────────────────────────────────────────────────────
const HOME_SERVICES = [
  { title: "تصميم وتطوير المواقع", color: "#4ade80",
    desc: "مواقع احترافية سريعة ومتجاوبة تعكس هوية علامتك وتحقق أهدافك.",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { title: "تطبيقات الجوال", color: "#60a5fa",
    desc: "تطبيقات iOS وAndroid بتجربة مستخدم سلسة وأداء عالي.",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg> },
  { title: "الهوية البصرية", color: "#f472b6",
    desc: "شعار وألوان وخطوط وكل ما يعكس شخصية علامتك التجارية.",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  { title: "العروض التقديمية", color: "#fb923c",
    desc: "عروض تروي قصة مشروعك بأسلوب بصري مقنع ومؤثر.",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M2 3h20v14H2zM8 21l4-4 4 4"/></svg> },
  { title: "الفيديو الترويجي", color: "#a78bfa",
    desc: "موشن جرافيك وفيديوهات ترويجية تشرح خدمتك وتجذب جمهورك.",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14v-4z"/><rect x="2" y="6" width="13" height="12" rx="2"/></svg> },
  { title: "الدعوات الرقمية", color: "#2dd4bf",
    desc: "دعوات تفاعلية لمناسباتك تُرسل عبر واتساب وتُبهر ضيوفك.",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg> },
];

// ── Main ──────────────────────────────────────────────────────────────────────
// Stable particles — generated once, never re-randomised on re-render
const makeParticles = (n: number) => Array.from({ length: n }, (_, i) => ({
  id: i,
  w:  Math.random() * 5 + 2,
  top: Math.random() * 100,
  left: Math.random() * 100,
  gold: Math.random() > 0.5,
  dur: Math.random() * 5 + 3,
  dx: Math.random() * 20 - 10,
  delay: Math.random() * 2,
}));

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const fullText = "نحول أفكارك الرقمية إلى واقع مبهر";
  const projects = STATIC_PROJECTS;
  // Home shows three strong pieces: one large (with video) and two side cards
  const featuredProjects = ["s0", "s1", "s3"].map(id => projects.find(p => p._id === id)!).filter(Boolean);
  const categoryCount = new Set(projects.map(project => project.category)).size;

  // Fewer particles on mobile for smoother performance
  const particles = useMemo(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    return makeParticles(isMobile ? 12 : 30);
  }, []);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i <= fullText.length) { setTypedText(fullText.slice(0, i)); i++; }
      else clearInterval(iv);
    }, 80);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative w-full min-h-screen text-[#2A0913] overflow-hidden" dir="rtl"
      style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}>
      <Seo path="/" title="ATHR"
        description="وكالة رقمية في قطر متخصصة في تصميم وتطوير المواقع والتطبيقات والهوية البصرية والفيديو. نحوّل أفكارك إلى حضور رقمي يحقق نتائج حقيقية." />

      {/* Stable particles — unique to home, no re-randomising */}
      {particles.map(p => (
        <motion.div key={p.id} className="absolute rounded-full z-0 pointer-events-none"
          style={{
            width: p.w + "px", height: p.w + "px",
            top: p.top + "%", left: p.left + "%",
            background: p.gold ? "#C9A35F" : "#7A1630",
            boxShadow: "none",
          }}
          animate={{ y: [0, -30, 0], x: [0, p.dx, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }}
        />
      ))}

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 mb-16">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#7A1630]/30 bg-[#7A1630]/10 px-4 py-2 backdrop-blur-md"
            style={{ boxShadow: "0 0 20px rgba(122,22,48,0.2)" }}>
            <Sparkles className="w-4 h-4 text-[#7A1630]" />
            <span className="text-sm font-semibold text-[#7A1630]">وكالة رقمية متميزة — قطر</span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <style>{`.hero-title .inline-block { background: linear-gradient(135deg,#4A0E1E 0%,#7A1630 55%,#8F6A2F 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;  }`}</style>
            <div className="hero-title">
              <AnimatedText
                as="h1"
                text="ابتكار رقمي بلا حدود"
                animationType="words"
                staggerDelay={0.15}
                duration={0.8}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-tight"
              />
            </div>

            {/* Typed subtitle */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-2xl sm:text-3xl font-semibold text-[#7A1630] typing-cursor min-h-[3rem]"
              style={{ textShadow: "none" }}>
              {typedText}
            </motion.div>
          </div>

          {/* Description */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-[#2A0913]/70 leading-relaxed">
            نصمم تجارب رقمية استثنائية تجمع بين الإبداع والتكنولوجيا المتقدمة لتحقيق أهدافك في العالم الرقمي
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NavLink to="/contact"
              className="group relative inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-black text-white overflow-hidden transition-all hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg,#7A1630,#4A0E1E)", boxShadow: "0 10px 30px rgba(122,22,48,0.3)" }}>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">ابدأ مشروعك الآن</span>
              <ArrowLeft className="w-5 h-5 relative transition-transform group-hover:-translate-x-1" />
            </NavLink>

            <NavLink to="/portfolio"
              className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#7A1630] bg-[#7A1630]/20 px-8 py-4 text-base font-bold text-[#2A0913] backdrop-blur-sm transition-all hover:bg-[#7A1630]/40 hover:border-[#7A1630]/50 hover:scale-105"
              style={{ boxShadow: "0 0 20px rgba(122,22,48,0.4)" }}>
              استكشف أعمالنا
            </NavLink>
          </motion.div>

          {/* Service pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="flex flex-wrap justify-center gap-2.5 pt-2 pb-14 sm:pb-0">
            {SERVICES_LIST.map(s => (
              <span key={s.label}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-[#2A0913]/75 border border-[#4A0E1E]/15 hover:border-[#7A1630]/30 hover:text-[#2A0913]/90 transition-all cursor-default"
                style={{ background: "rgba(255,255,255,0.7)" }}>
                <span style={{ color: s.color }}>{s.icon}</span>
                {s.label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Selected work — proof before promises */}
        <section className="mt-8 mb-20" aria-labelledby="selected-work-title">
          <motion.div {...inView()} className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between mb-8 text-right">
            <div>
              <span className="text-[#7A1630] text-xs font-black tracking-[0.25em] block mb-3">أعمال مختارة</span>
              <h2 id="selected-work-title" className="text-3xl md:text-5xl font-black text-[#2A0913]">أعمالنا تتحدث عنّا</h2>
              <p className="text-[#2A0913]/65 mt-3 max-w-xl">معاينات حقيقية لمواقع وتطبيقات صممناها وطورناها، وليست مجرد قوالب عرض.</p>
            </div>
            <NavLink to="/portfolio" className="inline-flex items-center gap-2 text-[#7A1630] font-bold hover:text-[#2A0913] transition-colors">
              شاهد كل المشاريع <ArrowLeft className="w-4 h-4" />
            </NavLink>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-5">
            {featuredProjects.map((project, index) => {
              const big = index === 0;
              return (
                <motion.article key={project._id} {...inView(index * 0.08)}
                  className={`${big ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5"} group flex flex-col overflow-hidden rounded-[1.75rem] border border-[#4A0E1E]/12 bg-white/80 shadow-[0_20px_50px_rgba(74,14,30,0.08)]`}>
                  {/* Media: full screenshot (never cropped) over a blurred copy, video plays on the large card */}
                  <div className={`relative overflow-hidden bg-[#EFE3CF] ${big ? "min-h-[340px] flex-1" : "h-[200px]"}`}>
                    <img src={project.imageUrl ?? ""} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60" />
                    {big && project.videoUrl ? (
                      <video src={project.videoUrl} poster={project.imageUrl ?? undefined} muted loop autoPlay playsInline preload="metadata"
                        className="absolute inset-0 w-full h-full object-contain" />
                    ) : (
                      <img src={project.imageUrl ?? ""} alt={`معاينة مشروع ${project.titleAr}`} loading="lazy" decoding="async"
                        className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.03]" />
                    )}
                    <span className="absolute top-3 right-3 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-[#7A1630]">{project.category}</span>
                  </div>
                  <div className={`flex flex-col p-5 md:p-6 text-right ${big ? "" : "flex-1"}`}>
                    <h3 className={`${big ? "text-2xl md:text-3xl" : "text-xl"} font-black text-[#2A0913]`}>{project.titleAr}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#2A0913]/65 line-clamp-2">{project.descriptionAr}</p>
                    <div className="mt-auto pt-4 flex flex-wrap gap-3">
                      <NavLink to="/portfolio" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#7A1630] px-5 py-2 text-sm font-bold text-white hover:bg-[#4A0E1E] transition-colors">عرض التفاصيل <ArrowLeft className="w-4 h-4" /></NavLink>
                      {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#4A0E1E]/20 px-5 py-2 text-sm font-bold text-[#4A0E1E] hover:bg-[#4A0E1E]/5 transition-colors">زيارة المشروع <ExternalLink className="w-4 h-4" /></a>}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-5 grid grid-cols-3 divide-x divide-x-reverse divide-[#4A0E1E]/10 rounded-2xl border border-[#4A0E1E]/15 bg-white/60 py-5 text-center">
            <div><strong className="block text-2xl text-[#7A1630]">{projects.length}</strong><span className="text-xs text-[#2A0913]/65">مشروع منشور</span></div>
            <div><strong className="block text-2xl text-[#7A1630]">{categoryCount}</strong><span className="text-xs text-[#2A0913]/65">مجالات عمل</span></div>
            <div><strong className="block text-2xl text-[#7A1630]">٦</strong><span className="text-xs text-[#2A0913]/65">خدمات متخصصة</span></div>
          </div>
        </section>

        {/* Clients marquee */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }}
          className="relative overflow-hidden rounded-3xl border border-[#7A1630]/30 bg-[#7A1630]/10 py-8 backdrop-blur-xl"
          style={{ boxShadow: "0 0 40px rgba(122,22,48,0.3), inset 0 0 30px rgba(122,22,48,0.04)" }}>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#7A1630]/8 blur-3xl pointer-events-none" />
          <style>{`
            @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(50%)} }
            .marquee-track { animation: marquee 28s linear infinite; }
            .marquee-mask:hover .marquee-track { animation-play-state: paused; }
          `}</style>
          <div className="relative z-10 text-center space-y-2 mb-6 px-8">
            <h3 className="text-xl font-black text-[#7A1630]" style={{ textShadow: "none" }}>
              موضع ثقة عملائنا
            </h3>
            <p className="text-[#2A0913]/70 text-sm">نفخر بثقة عملائنا وشركائنا في رحلة التحول الرقمي</p>
          </div>
          {/* Edge fade + scrolling track */}
          <div className="marquee-mask relative overflow-hidden"
            style={{ WebkitMaskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)", maskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)" }}>
            <div className="marquee-track flex items-center gap-4 w-max" dir="ltr">
              {[...Array(2)].flatMap((_, dup) =>
                ["Adrenaline", "DarkFit", "Smart Arena", "ابن تيمية", "Arirang Bakery", "نَفَحات", "دار ابن الجزري", "ERP"].map((name, i) => (
                  <div key={`${dup}-${i}`}
                    className="px-6 py-3 rounded-2xl border border-[#7A1630]/30 bg-[#7A1630]/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 hover:border-[#7A1630]/40 transition-colors"
                    style={{ boxShadow: "0 0 20px rgba(122,22,48,0.2)" }}>
                    <span className="text-[#7A1630]/70 font-bold text-sm whitespace-nowrap">{name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <div className="flex flex-col items-center mt-12 gap-2 text-[#2A0913]/45">
          <span className="text-xs tracking-widest uppercase">اسكرول للأسفل</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>

        {/* ── Services showcase ──────────────────────────────────────────────── */}
        <div className="mt-24">
          <motion.div {...inView()} className="text-center mb-12">
            <span className="text-[#7A1630] text-xs font-black tracking-[0.25em] uppercase block mb-4">خدماتنا</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#2A0913]">كل ما يحتاجه مشروعك في مكان واحد</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOME_SERVICES.map((s, i) => (
              <motion.div key={s.title} {...inView(i * 0.07)}
                className="group relative rounded-2xl p-6 border border-[#4A0E1E]/15 hover:border-[#4A0E1E]/20 transition-all duration-500 overflow-hidden hover:-translate-y-1.5"
                style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)" }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 30% 30%,${s.color}12 0%,transparent 60%)` }} />
                <div className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: s.color + "18", color: s.color, border: `1px solid ${s.color}30` }}>
                  {s.icon}
                </div>
                <h3 className="relative z-10 text-lg font-black text-[#2A0913] mb-2">{s.title}</h3>
                <p className="relative z-10 text-[#2A0913]/65 text-sm leading-relaxed">{s.desc}</p>
                <div className="absolute bottom-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg,transparent,${s.color}60,transparent)` }} />
              </motion.div>
            ))}
          </div>

          <motion.div {...inView(0.2)} className="text-center mt-8">
            <NavLink to="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#7A1630]/80 hover:text-[#7A1630] transition-colors">
              استكشف كل الخدمات
              <ArrowLeft className="w-4 h-4" />
            </NavLink>
          </motion.div>
        </div>

        {/* ── Process ────────────────────────────────────────────────────────── */}
        <div className="mt-24">
          <motion.div {...inView()} className="text-center mb-10">
            <span className="text-[#7A1630] text-xs font-black tracking-[0.25em] uppercase block mb-3">كيف نعمل</span>
            <h2 className="text-3xl font-black text-[#2A0913]">عملية بسيطة ونتائج استثنائية</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "الاستشارة", desc: "نفهم فكرتك وأهدافك بعمق" },
              { step: "02", title: "التصميم", desc: "نحول الفكرة لتصميم إبداعي" },
              { step: "03", title: "التطوير", desc: "نبني بأعلى معايير الجودة" },
              { step: "04", title: "التسليم", desc: "نسلم ونتابع معك بعد الإطلاق" },
            ].map((p, i) => (
              <motion.div key={p.step} {...inView(i * 0.08)}
                className="relative p-6 rounded-2xl border border-[#4A0E1E]/15 text-center group hover:border-[#7A1630]/20 transition-all"
                style={{ background: "rgba(255,255,255,0.7)" }}>
                <div className="text-4xl font-black text-[#7A1630]/15 mb-3 group-hover:text-[#7A1630]/35 transition-colors">{p.step}</div>
                <h3 className="font-black text-[#2A0913] mb-2">{p.title}</h3>
                <p className="text-[#2A0913]/60 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Final CTA ──────────────────────────────────────────────────────── */}
        <motion.div {...inView()}
          className="relative mt-24 rounded-3xl p-10 md:p-14 text-center overflow-hidden border border-[#7A1630]/15"
          style={{ background: "linear-gradient(135deg,#7A1630,#4A0E1E)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(233,210,157,0.15) 0%,transparent 60%)" }} />
          <h2 className="text-2xl md:text-4xl font-black text-[#F3E2B6] mb-3 relative z-10">لديك فكرة؟ لنحوّلها إلى واقع.</h2>
          <p className="text-white/75 mb-8 relative z-10 max-w-xl mx-auto">استشارة أولى مجانية — نستمع إلى فكرتك ونقترح أفضل طريق لتنفيذها.</p>
          <NavLink to="/contact"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-black text-[#7A1630] relative z-10 hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg,#E9D29D,#C9A35F)", boxShadow: "0 0 40px rgba(122,22,48,0.3)" }}>
            احجز استشارتك المجانية
            <ArrowLeft className="w-5 h-5" />
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
}
