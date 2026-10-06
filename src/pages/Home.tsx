import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Play, Sparkles } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Seo from "../components/Seo";

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
  const queriedProjects = useQuery(api.projects.list) ?? [];
  const projects = queriedProjects.map(project => {
    if (project.titleAr.includes("Adrenaline")) return {
      ...project,
      titleAr: "Adrenaline — وجبات صحية",
      descriptionAr: "منصة متكاملة للوجبات الصحية والخطط الغذائية الذكية والاشتراكات والتوصيل داخل قطر.",
      imageUrl: project.imageUrl ?? "/adrenaline-preview.png",
      liveUrl: project.liveUrl ?? "https://adrenalinehealthy.com/",
    };
    if (project.titleAr.includes("DarkFit")) return {
      ...project,
      titleAr: "DarkFit — منصة اللياقة",
      descriptionAr: "تطبيق لياقة وصحة شامل يجمع التمارين والتغذية والمدربين والحاسبات الصحية.",
      category: "تطبيقات",
      result: "منظومة لياقة متكاملة",
      imageUrl: project.imageUrl ?? "/darkfit-preview.png",
      liveUrl: project.liveUrl ?? "https://darkfit.netlify.app/",
    };
    return project;
  });
  const featuredProjects = [...projects]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || Number(Boolean(b.videoUrl || b.imageUrl)) - Number(Boolean(a.videoUrl || a.imageUrl)))
    .slice(0, 3);
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
    <div className="relative w-full min-h-screen text-white overflow-hidden" dir="rtl"
      style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}>
      <Seo path="/" title="أفكار رقمية"
        description="وكالة رقمية في قطر متخصصة في تصميم وتطوير المواقع والتطبيقات والهوية البصرية والفيديو. نحوّل أفكارك إلى حضور رقمي يحقق نتائج حقيقية." />

      {/* Stable particles — unique to home, no re-randomising */}
      {particles.map(p => (
        <motion.div key={p.id} className="absolute rounded-full z-0 pointer-events-none"
          style={{
            width: p.w + "px", height: p.w + "px",
            top: p.top + "%", left: p.left + "%",
            background: p.gold ? "#fed65b" : "#00b478",
            boxShadow: p.gold ? "0 0 12px rgba(254,214,91,0.8)" : "0 0 12px rgba(0,180,120,0.6)",
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
            className="inline-flex items-center gap-2 rounded-full border border-[#fed65b]/30 bg-[#fed65b]/10 px-4 py-2 backdrop-blur-md"
            style={{ boxShadow: "0 0 20px rgba(254,214,91,0.2)" }}>
            <Sparkles className="w-4 h-4 text-[#fed65b]" />
            <span className="text-sm font-semibold text-[#fed65b]">وكالة رقمية متميزة — قطر</span>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <style>{`.hero-title .inline-block { background: linear-gradient(135deg,#ffffff 0%,#fed65b 50%,#ffffff 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; filter:drop-shadow(0 0 20px rgba(254,214,91,0.3)); }`}</style>
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
              className="text-2xl sm:text-3xl font-semibold text-[#fed65b] typing-cursor min-h-[3rem]"
              style={{ textShadow: "0 0 30px rgba(254,214,91,0.5)" }}>
              {typedText}
            </motion.div>
          </div>

          {/* Description */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-400 leading-relaxed">
            نصمم تجارب رقمية استثنائية تجمع بين الإبداع والتكنولوجيا المتقدمة لتحقيق أهدافك في العالم الرقمي
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NavLink to="/contact"
              className="group relative inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-black text-[#050a07] overflow-hidden transition-all hover:scale-105 active:scale-95"
              style={{ background: "#fed65b", boxShadow: "0 0 40px rgba(254,214,91,0.5), inset 0 0 20px rgba(255,255,255,0.2)" }}>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">ابدأ مشروعك الآن</span>
              <ArrowLeft className="w-5 h-5 relative transition-transform group-hover:-translate-x-1" />
            </NavLink>

            <NavLink to="/portfolio"
              className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#003527] bg-[#003527]/20 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-[#003527]/40 hover:border-[#fed65b]/50 hover:scale-105"
              style={{ boxShadow: "0 0 20px rgba(0,53,39,0.4)" }}>
              استكشف أعمالنا
            </NavLink>
          </motion.div>

          {/* Service pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            className="flex flex-wrap justify-center gap-2.5 pt-2 pb-14 sm:pb-0">
            {SERVICES_LIST.map(s => (
              <span key={s.label}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white/60 border border-white/[0.08] hover:border-[#fed65b]/30 hover:text-white/90 transition-all cursor-default"
                style={{ background: "rgba(255,255,255,0.03)" }}>
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
              <span className="text-[#fed65b] text-xs font-black tracking-[0.25em] block mb-3">أعمال مختارة</span>
              <h2 id="selected-work-title" className="text-3xl md:text-5xl font-black text-white">الشغل يتكلم عنّا</h2>
              <p className="text-white/45 mt-3 max-w-xl">معاينات حقيقية لمواقع وتطبيقات صممناها وطورناها، وليست مجرد قوالب عرض.</p>
            </div>
            <NavLink to="/portfolio" className="inline-flex items-center gap-2 text-[#fed65b] font-bold hover:text-white transition-colors">
              شاهد كل المشاريع <ArrowLeft className="w-4 h-4" />
            </NavLink>
          </motion.div>

          {featuredProjects.length > 0 ? (
            <div className="grid lg:grid-cols-12 gap-5">
              {featuredProjects.map((project, index) => (
                <motion.article key={project._id} {...inView(index * 0.08)}
                  className={`${index === 0 ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5"} group relative overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#07110c]`}>
                  <div className={`${index === 0 ? "min-h-[420px]" : "min-h-[240px]"} relative overflow-hidden`}>
                    {project.videoUrl ? (
                      <div className="absolute inset-0 bg-black">
                        <video src={project.videoUrl} muted loop autoPlay playsInline preload="metadata"
                          className={`w-full h-full ${project.category === "تطبيقات" ? "object-contain" : "object-cover"}`} />
                        {project.category === "تطبيقات" && <div className="absolute inset-0 -z-10 bg-[#003527]" />}
                      </div>
                    ) : project.imageUrl ? (
                      <img src={project.imageUrl} alt={`معاينة مشروع ${project.titleAr}`} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover object-top" />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(254,214,91,0.13),transparent_36%),linear-gradient(145deg,#0a2118,#050a07)] flex items-center justify-center">
                        <span className="text-7xl font-black text-white/[0.04]">{String(index + 1).padStart(2, "0")}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030705] via-[#030705]/35 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-right">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs text-white/70">{project.category}</span>
                        {project.videoUrl && <span className="inline-flex items-center gap-1 text-xs text-[#fed65b]"><Play className="w-3 h-3 fill-current" /> معاينة فيديو</span>}
                      </div>
                      <h3 className={`${index === 0 ? "text-3xl md:text-4xl" : "text-2xl"} font-black text-white`}>{project.titleAr}</h3>
                      <p className="mt-2 text-sm text-white/55 line-clamp-2 max-w-xl">{project.descriptionAr}</p>
                      <div className="mt-5 flex flex-wrap gap-3">
                        <NavLink to="/portfolio" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#fed65b] px-5 py-2 text-sm font-black text-[#052017]">عرض التفاصيل <ArrowLeft className="w-4 h-4" /></NavLink>
                        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-black/20 px-5 py-2 text-sm font-bold text-white">زيارة المشروع <ExternalLink className="w-4 h-4" /></a>}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-10 text-center text-white/45">سيظهر هنا أحدث الأعمال المضافة من لوحة الإدارة.</div>
          )}

          <div className="mt-5 grid grid-cols-3 divide-x divide-x-reverse divide-white/10 rounded-2xl border border-white/[0.08] bg-white/[0.025] py-5 text-center">
            <div><strong className="block text-2xl text-[#fed65b]">{projects.length}</strong><span className="text-xs text-white/45">مشروع منشور</span></div>
            <div><strong className="block text-2xl text-[#fed65b]">{categoryCount}</strong><span className="text-xs text-white/45">مجالات عمل</span></div>
            <div><strong className="block text-2xl text-[#fed65b]">٦</strong><span className="text-xs text-white/45">خدمات متخصصة</span></div>
          </div>
        </section>

        {/* Clients marquee */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }}
          className="relative overflow-hidden rounded-3xl border border-[#003527]/30 bg-[#003527]/10 py-8 backdrop-blur-xl"
          style={{ boxShadow: "0 0 40px rgba(0,53,39,0.3), inset 0 0 30px rgba(254,214,91,0.04)" }}>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#fed65b]/8 blur-3xl pointer-events-none" />
          <style>{`
            @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(50%)} }
            .marquee-track { animation: marquee 28s linear infinite; }
            .marquee-mask:hover .marquee-track { animation-play-state: paused; }
          `}</style>
          <div className="relative z-10 text-center space-y-2 mb-6 px-8">
            <h3 className="text-xl font-black text-[#fed65b]" style={{ textShadow: "0 0 20px rgba(254,214,91,0.4)" }}>
              موضع ثقة عملائنا
            </h3>
            <p className="text-zinc-400 text-sm">نفخر بثقة عملائنا وشركائنا في رحلة التحول الرقمي</p>
          </div>
          {/* Edge fade + scrolling track */}
          <div className="marquee-mask relative overflow-hidden"
            style={{ WebkitMaskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)", maskImage: "linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)" }}>
            <div className="marquee-track flex items-center gap-4 w-max" dir="ltr">
              {[...Array(2)].flatMap((_, dup) =>
                ["Adrenaline", "DarkFit", "Smart Arena", "ابن تيمية", "Arirang Bakery", "نَفَحات", "دار ابن الجزري", "ERP"].map((name, i) => (
                  <div key={`${dup}-${i}`}
                    className="px-6 py-3 rounded-2xl border border-[#003527]/30 bg-[#003527]/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 hover:border-[#fed65b]/40 transition-colors"
                    style={{ boxShadow: "0 0 20px rgba(0,53,39,0.2)" }}>
                    <span className="text-[#fed65b]/70 font-bold text-sm whitespace-nowrap">{name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <div className="flex flex-col items-center mt-12 gap-2 text-white/20">
          <span className="text-xs tracking-widest uppercase">اسكرول للأسفل</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>

        {/* ── Services showcase ──────────────────────────────────────────────── */}
        <div className="mt-24">
          <motion.div {...inView()} className="text-center mb-12">
            <span className="text-[#fed65b] text-xs font-black tracking-[0.25em] uppercase block mb-4">خدماتنا</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">كل ما يحتاجه مشروعك في مكان واحد</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {HOME_SERVICES.map((s, i) => (
              <motion.div key={s.title} {...inView(i * 0.07)}
                className="group relative rounded-2xl p-6 border border-white/[0.07] hover:border-white/20 transition-all duration-500 overflow-hidden hover:-translate-y-1.5"
                style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 30% 30%,${s.color}12 0%,transparent 60%)` }} />
                <div className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: s.color + "18", color: s.color, border: `1px solid ${s.color}30` }}>
                  {s.icon}
                </div>
                <h3 className="relative z-10 text-lg font-black text-white mb-2">{s.title}</h3>
                <p className="relative z-10 text-white/50 text-sm leading-relaxed">{s.desc}</p>
                <div className="absolute bottom-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg,transparent,${s.color}60,transparent)` }} />
              </motion.div>
            ))}
          </div>

          <motion.div {...inView(0.2)} className="text-center mt-8">
            <NavLink to="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#fed65b]/80 hover:text-[#fed65b] transition-colors">
              استكشف كل الخدمات
              <ArrowLeft className="w-4 h-4" />
            </NavLink>
          </motion.div>
        </div>

        {/* ── Process ────────────────────────────────────────────────────────── */}
        <div className="mt-24">
          <motion.div {...inView()} className="text-center mb-10">
            <span className="text-[#fed65b] text-xs font-black tracking-[0.25em] uppercase block mb-3">كيف نعمل</span>
            <h2 className="text-3xl font-black text-white">عملية بسيطة ونتائج استثنائية</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "الاستشارة", desc: "نفهم فكرتك وأهدافك بعمق" },
              { step: "02", title: "التصميم", desc: "نحول الفكرة لتصميم إبداعي" },
              { step: "03", title: "التطوير", desc: "نبني بأعلى معايير الجودة" },
              { step: "04", title: "التسليم", desc: "نسلم ونتابع معك بعد الإطلاق" },
            ].map((p, i) => (
              <motion.div key={p.step} {...inView(i * 0.08)}
                className="relative p-6 rounded-2xl border border-white/[0.07] text-center group hover:border-[#fed65b]/20 transition-all"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-4xl font-black text-[#fed65b]/15 mb-3 group-hover:text-[#fed65b]/35 transition-colors">{p.step}</div>
                <h3 className="font-black text-white mb-2">{p.title}</h3>
                <p className="text-white/40 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Final CTA ──────────────────────────────────────────────────────── */}
        <motion.div {...inView()}
          className="relative mt-24 rounded-3xl p-10 md:p-14 text-center overflow-hidden border border-[#fed65b]/15"
          style={{ background: "linear-gradient(135deg,rgba(0,53,39,0.6),rgba(5,10,7,0.8))" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(254,214,91,0.08) 0%,transparent 60%)" }} />
          <h2 className="text-2xl md:text-4xl font-black text-white mb-3 relative z-10">عندك فكرة؟ خلينا نحولها لواقع.</h2>
          <p className="text-white/50 mb-8 relative z-10 max-w-xl mx-auto">استشارة أولى مجانية — نسمع فكرتك ونقترح أفضل طريق لتنفيذها.</p>
          <NavLink to="/contact"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-black text-[#003527] relative z-10 hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg,#fed65b,#ffa726)", boxShadow: "0 0 40px rgba(254,214,91,0.3)" }}>
            احجز استشارتك المجانية
            <ArrowLeft className="w-5 h-5" />
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
}
