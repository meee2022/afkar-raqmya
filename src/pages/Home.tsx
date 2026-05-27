import { useEffect, useState, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, TrendingUp, Users, Award } from "lucide-react";

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
}: AnimatedTextProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: staggerDelay, delayChildren: delay } },
  };
  const itemVariants = {
    hidden: { y: initialY, opacity: initialOpacity },
    visible: { y: 0, opacity: 1, transition: { duration, ease: "easeOut" as const } },
  };

  return (
    <motion.div className={className} variants={containerVariants} initial="hidden" animate="visible">
      {animationType === "letters"
        ? text.split("").map((char, i) => (
            <motion.span key={i} variants={itemVariants} className="inline-block"
              style={{ whiteSpace: char === " " ? "pre" : "normal" }}>{char}</motion.span>
          ))
        : text.split(" ").map((word, i) => (
            <motion.span key={i} variants={itemVariants} className="ml-2 inline-block">{word}</motion.span>
          ))}
    </motion.div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label, icon: Icon, delay = 0.8 }: { value: string; label: string; icon: any; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="relative overflow-hidden rounded-2xl border border-[#003527]/30 bg-[#003527]/10 p-6 backdrop-blur-xl"
      style={{ boxShadow: "0 0 30px rgba(0,53,39,0.3), inset 0 0 20px rgba(254,214,91,0.05)" }}
    >
      <div className="absolute top-0 left-0 -ml-8 -mt-8 h-32 w-32 rounded-full bg-[#fed65b]/10 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fed65b]/20 ring-1 ring-[#fed65b]/30 flex-shrink-0">
          <Icon className="h-6 w-6 text-[#fed65b]" />
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tracking-tight text-[#fed65b]"
            style={{ textShadow: "0 0 20px rgba(254,214,91,0.5)" }}>{value}</div>
          <div className="text-sm text-zinc-400">{label}</div>
        </div>
      </div>
    </motion.div>
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

// ── Main ──────────────────────────────────────────────────────────────────────
// Stable particles — generated once, never re-randomised on re-render
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
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

  // stable reference — never changes between renders
  const particles = useMemo(() => PARTICLES, []);

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
            className="flex flex-wrap justify-center gap-2.5 pt-2">
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

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 mb-10">
          <StatCard value="+50"  label="مشروع منجز"    icon={Award}      delay={0.8}  />
          <StatCard value="98%"  label="رضا العملاء"   icon={TrendingUp}  delay={0.9}  />
          <StatCard value="+30"  label="عميل سعيد"     icon={Users}       delay={1.0}  />
          <StatCard value="٣+"   label="سنوات خبرة"    icon={Sparkles}    delay={1.1}  />
        </div>

        {/* Partners placeholder */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }}
          className="relative overflow-hidden rounded-3xl border border-[#003527]/30 bg-[#003527]/10 p-8 backdrop-blur-xl"
          style={{ boxShadow: "0 0 40px rgba(0,53,39,0.3), inset 0 0 30px rgba(254,214,91,0.04)" }}>
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#fed65b]/8 blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center space-y-4">
            <h3 className="text-xl font-black text-[#fed65b]" style={{ textShadow: "0 0 20px rgba(254,214,91,0.4)" }}>
              بعض من عملائنا
            </h3>
            <p className="text-zinc-400 text-sm">نفخر بثقة عملائنا وشركائنا في رحلة التحول الرقمي</p>
            <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
              {["Adrenaline", "DarkFit", "Smart Arena", "ابن تيمية", "Arirang", "ERP"].map((name, i) => (
                <motion.div key={i} whileHover={{ scale: 1.08 }}
                  className="px-5 py-3 rounded-2xl border border-[#003527]/30 bg-[#003527]/20 backdrop-blur-sm flex items-center justify-center transition-all hover:border-[#fed65b]/30"
                  style={{ boxShadow: "0 0 20px rgba(0,53,39,0.2)" }}>
                  <span className="text-[#fed65b]/70 font-bold text-sm hover:text-[#fed65b] transition-colors">{name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <div className="flex flex-col items-center mt-12 gap-2 text-white/20">
          <span className="text-xs tracking-widest uppercase">اسكرول للأسفل</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </div>
    </div>
  );
}
