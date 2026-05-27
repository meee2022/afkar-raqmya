import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const VALUES = [
  {
    color: "#fed65b",
    title: "تصميم إبداعي",
    desc: "هوية بصرية فريدة لكل مشروع تعكس روحه الحقيقية",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  },
  {
    color: "#4ade80",
    title: "تطوير متقن",
    desc: "كود نظيف وقابل للتوسع بأعلى معايير الجودة",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M10 20l4-16M6.5 16.5l-5-5 5-5M17.5 7.5l5 5-5 5"/></svg>,
  },
  {
    color: "#60a5fa",
    title: "نتائج حقيقية",
    desc: "قابلة للقياس والإثبات — الأرقام تتحدث",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>,
  },
  {
    color: "#a78bfa",
    title: "معايير عالمية",
    desc: "جودة لا تقبل المساومة في كل تفصيلة",
    icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  },
];

const TEAM = [
  { name: "محمد كامل", role: "مؤسس ومدير إبداعي", color: "#fed65b", initial: "م" },
  { name: "فريق التصميم", role: "UI/UX & Brand", color: "#f472b6", initial: "ت" },
  { name: "فريق التطوير", role: "Frontend & Backend", color: "#4ade80", initial: "ط" },
  { name: "فريق المحتوى", role: "Motion & Video", color: "#60a5fa", initial: "م" },
];

export default function About() {
  return (
    <div className="min-h-screen pt-20" style={{ fontFamily: "'Tajawal','Cairo',sans-serif" }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <motion.div {...up()} className="mb-16 max-w-3xl">
          <span className="text-[#fed65b] text-xs font-black tracking-[0.25em] uppercase block mb-4">من نحن</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            وكالة رقمية{" "}
            <span style={{ background:"linear-gradient(135deg,#fed65b,#ffa726)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              بأسلوب مختلف
            </span>
          </h1>
          <p className="text-white/55 text-xl leading-relaxed">
            أفكار رقمية وكالة متخصصة في تقديم حلول رقمية إبداعية للأعمال والأفراد. نجمع بين الفهم العميق للسوق المحلي والمعايير العالمية للتصميم.
          </p>
        </motion.div>

        {/* Mission banner */}
        <motion.div {...up(0.1)}
          className="relative rounded-3xl p-10 mb-12 overflow-hidden border border-[#fed65b]/15"
          style={{ background: "linear-gradient(135deg,rgba(0,53,39,0.7),rgba(5,10,7,0.6))" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 20% 50%,rgba(254,214,91,0.07) 0%,transparent 60%)" }} />
          <div className="relative z-10">
            <div className="text-[#fed65b]/60 text-xs font-black tracking-widest uppercase mb-4">مهمتنا</div>
            <p className="text-white text-2xl md:text-3xl font-bold leading-relaxed max-w-3xl">
              "تمكين كل صاحب فكرة من امتلاك حضور رقمي مميز يعكس قيمته الحقيقية — بتصميم يُبهر وتقنية تدوم."
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div {...up(0.15)} className="mb-5">
          <span className="text-[#fed65b] text-xs font-black tracking-[0.25em] uppercase block mb-8">قيمنا</span>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {VALUES.map((v, i) => (
            <motion.div key={v.title} {...up(0.18 + i * 0.07)}
              className="group p-6 rounded-2xl border border-white/[0.07] hover:border-white/20 hover:-translate-y-1.5 transition-all duration-500 overflow-hidden relative"
              style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 30% 30%,${v.color}10 0%,transparent 60%)` }} />
              <div className="relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                style={{ background: v.color + "18", color: v.color, border: `1px solid ${v.color}30` }}>
                {v.icon}
              </div>
              <h3 className="relative z-10 font-black text-white mb-2">{v.title}</h3>
              <p className="relative z-10 text-xs text-white/40 leading-relaxed">{v.desc}</p>
              <div className="absolute bottom-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg,transparent,${v.color}60,transparent)` }} />
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div {...up(0.2)} className="mb-5">
          <span className="text-[#fed65b] text-xs font-black tracking-[0.25em] uppercase block mb-8">أرقامنا</span>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { n: "+50", l: "مشروع منجز", color: "#fed65b" },
            { n: "+30", l: "عميل سعيد", color: "#4ade80" },
            { n: "٣+", l: "سنوات خبرة", color: "#60a5fa" },
            { n: "٦", l: "خدمات متخصصة", color: "#a78bfa" },
          ].map((s, i) => (
            <motion.div key={s.l} {...up(0.22 + i * 0.06)}
              className="group p-6 rounded-2xl border border-white/[0.07] hover:border-white/20 text-center transition-all duration-300 relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 50%,${s.color}08 0%,transparent 70%)` }} />
              <div className="text-4xl font-black mb-2 relative z-10" dir="ltr"
                style={{ background: `linear-gradient(135deg,${s.color},${s.color}bb)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                {s.n}
              </div>
              <div className="text-sm text-white/50 relative z-10">{s.l}</div>
            </motion.div>
          ))}
        </div>

        {/* Team */}
        <motion.div {...up(0.25)} className="mb-5">
          <span className="text-[#fed65b] text-xs font-black tracking-[0.25em] uppercase block mb-8">فريقنا</span>
        </motion.div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {TEAM.map((m, i) => (
            <motion.div key={m.name} {...up(0.27 + i * 0.06)}
              className="group p-6 rounded-2xl border border-white/[0.07] hover:border-white/20 hover:-translate-y-1.5 text-center transition-all duration-500 relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%,${m.color}10 0%,transparent 60%)` }} />
              <div className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ background: m.color + "18", color: m.color, border: `1px solid ${m.color}30` }}>
                {m.initial}
              </div>
              <h3 className="relative z-10 font-black text-white mb-1 text-sm">{m.name}</h3>
              <p className="relative z-10 text-xs text-white/40">{m.role}</p>
            </motion.div>
          ))}
        </div>

        {/* Story section */}
        <motion.div {...up(0.3)}
          className="relative rounded-3xl p-10 mb-12 overflow-hidden border border-white/[0.07]"
          style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
          <div className="absolute top-0 right-0 text-[200px] font-black opacity-[0.03] leading-none select-none" style={{ color: "#fed65b" }}>أفكار</div>
          <div className="relative z-10 max-w-2xl">
            <span className="text-[#fed65b] text-xs font-black tracking-[0.25em] uppercase block mb-4">قصتنا</span>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-5">من فكرة إلى وكالة رقمية</h2>
            <p className="text-white/50 leading-relaxed mb-4">
              بدأت أفكار رقمية من شغف حقيقي بالتصميم والتقنية وإيمان بأن كل فكرة تستحق أن تُرى بأفضل صورة ممكنة.
            </p>
            <p className="text-white/50 leading-relaxed">
              اليوم نخدم عملاء من قطر والخليج، ونفخر بكل مشروع أنجزناه لأنه يعكس التزامنا بالجودة والإبداع — من الفكرة الأولى حتى الإطلاق وما بعده.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...up(0.35)}
          className="relative rounded-3xl p-10 text-center overflow-hidden border border-[#fed65b]/15"
          style={{ background: "linear-gradient(135deg,rgba(0,53,39,0.6),rgba(5,10,7,0.8))" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(254,214,91,0.08) 0%,transparent 60%)" }} />
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3 relative z-10">هل أنت مستعد للبدء؟</h2>
          <p className="text-white/50 mb-7 relative z-10">تواصل معنا اليوم وابدأ رحلتك الرقمية.</p>
          <NavLink to="/contact"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-black text-[#003527] relative z-10 hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg,#fed65b,#ffa726)", boxShadow: "0 0 40px rgba(254,214,91,0.3)" }}>
            تحدث معنا
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
}
