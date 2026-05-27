import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const SERVICES = [
  { num: "01", title: "تصميم وتطوير المواقع", color: "#4ade80",
    desc: "مواقع احترافية سريعة ومتجاوبة تعكس هوية علامتك التجارية وتحقق أهدافك التجارية.",
    features: ["تصميم UI/UX مخصص", "متجاوب مع جميع الأجهزة", "سرعة تحميل فائقة", "SEO محسّن"],
    icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { num: "02", title: "تطبيقات الجوال", color: "#60a5fa",
    desc: "تطبيقات iOS وAndroid بتجربة مستخدم سلسة وأداء عالي يلبي احتياجات جمهورك.",
    features: ["iOS & Android", "واجهة عربية أولاً", "Push Notifications", "تكامل مع الـ APIs"],
    icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg> },
  { num: "03", title: "الهوية البصرية", color: "#f472b6",
    desc: "هوية متكاملة تشمل الشعار والألوان والخطوط وكل ما يعكس شخصية علامتك التجارية.",
    features: ["شعار احترافي", "دليل الهوية البصرية", "قوالب سوشيال ميديا", "كل صيغ الملفات"],
    icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  { num: "04", title: "العروض التقديمية", color: "#fb923c",
    desc: "Pitch decks واستعراضات احترافية تروي قصة مشروعك بأسلوب بصري مقنع ومؤثر.",
    features: ["تصميم Pitch Deck", "موشن جرافيك خفيف", "عرض تفاعلي", "ملفات PowerPoint + PDF"],
    icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><path d="M2 3h20v14H2zM8 21l4-4 4 4"/></svg> },
  { num: "05", title: "الفيديو الترويجي", color: "#a78bfa",
    desc: "موشن جرافيك وفيديوهات ترويجية احترافية تشرح خدمتك وتجذب انتباه جمهورك.",
    features: ["موشن جرافيك 2D", "فيديو ترويجي قصير", "Reels & Stories", "تعديل وتوليف"],
    icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><path d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14v-4z"/><rect x="2" y="6" width="13" height="12" rx="2"/></svg> },
  { num: "06", title: "الدعوات الرقمية", color: "#2dd4bf",
    desc: "دعوات تفاعلية لمناسباتك تُرسل عبر واتساب وتُدهش ضيوفك بتجربة رقمية فريدة.",
    features: ["دعوة أفراح وحفلات", "مؤسسية وتجارية", "رابط مشاركة واتساب", "تأثيرات متحركة"],
    icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg> },
];

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export default function Services() {
  return (
    <div className="min-h-screen pt-20" style={{ fontFamily: "'Tajawal','Cairo',sans-serif" }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        <motion.div {...up()} className="text-center mb-16">
          <span className="text-[#fed65b] text-xs font-black tracking-[0.25em] uppercase block mb-4">خدماتنا</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-5">
            كل ما تحتاجه{" "}
            <span style={{ background:"linear-gradient(135deg,#fed65b,#ffa726)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              في مكان واحد
            </span>
          </h1>
          <p className="text-white/50 text-xl max-w-2xl mx-auto">نقدم خدمات رقمية متكاملة تبدأ من الفكرة وتنتهي بنتائج حقيقية.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {SERVICES.map((s, i) => (
            <motion.div key={s.num} {...up(i * 0.07)}
              className="group relative rounded-2xl p-6 border border-white/[0.07] hover:border-white/20 transition-all duration-500 overflow-hidden hover:-translate-y-1.5"
              style={{ background:"rgba(255,255,255,0.03)", backdropFilter:"blur(10px)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background:`radial-gradient(ellipse at 30% 30%,${s.color}12 0%,transparent 60%)` }} />
              <div className="absolute top-4 left-5 text-5xl font-black opacity-[0.05] select-none" style={{ color:s.color }}>{s.num}</div>
              <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300"
                style={{ background:s.color+"18", color:s.color, border:`1px solid ${s.color}30` }}>{s.icon}</div>
              <h3 className="relative z-10 text-lg font-black text-white mb-3">{s.title}</h3>
              <p className="relative z-10 text-white/50 text-sm leading-relaxed mb-5">{s.desc}</p>
              <ul className="relative z-10 space-y-2">
                {s.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-white/40">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:s.color }} />{f}
                  </li>
                ))}
              </ul>
              <div className="absolute bottom-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background:`linear-gradient(90deg,transparent,${s.color}60,transparent)` }} />
            </motion.div>
          ))}
        </div>

        <motion.div {...up(0.1)} className="mb-16">
          <div className="text-center mb-10">
            <span className="text-[#fed65b] text-xs font-black tracking-[0.25em] uppercase block mb-3">كيف نعمل</span>
            <h2 className="text-3xl font-black text-white">عملية بسيطة ونتائج استثنائية</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step:"01", title:"الاستشارة", desc:"نفهم فكرتك وأهدافك بعمق" },
              { step:"02", title:"التصميم", desc:"نحول الفكرة لتصميم إبداعي" },
              { step:"03", title:"التطوير", desc:"نبني بأعلى معايير الجودة" },
              { step:"04", title:"التسليم", desc:"نسلم ونتابع معك بعد الإطلاق" },
            ].map((p, i) => (
              <motion.div key={p.step} {...up(i * 0.08)}
                className="relative p-6 rounded-2xl border border-white/[0.07] text-center group hover:border-[#fed65b]/20 transition-all"
                style={{ background:"rgba(255,255,255,0.03)" }}>
                <div className="text-4xl font-black text-[#fed65b]/15 mb-3 group-hover:text-[#fed65b]/35 transition-colors">{p.step}</div>
                <h3 className="font-black text-white mb-2">{p.title}</h3>
                <p className="text-white/40 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...up(0.2)}
          className="relative rounded-3xl p-10 text-center overflow-hidden border border-[#fed65b]/15"
          style={{ background:"linear-gradient(135deg,rgba(0,53,39,0.6),rgba(5,10,7,0.8))" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background:"radial-gradient(ellipse at 50% 0%,rgba(254,214,91,0.08) 0%,transparent 60%)" }} />
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3 relative z-10">جاهز تبدأ مشروعك؟</h2>
          <p className="text-white/50 mb-7 relative z-10">تواصل معنا اليوم ونحدد احتياجاتك مجاناً</p>
          <NavLink to="/contact"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-black text-[#003527] relative z-10 hover:scale-105 transition-transform"
            style={{ background:"linear-gradient(135deg,#fed65b,#ffa726)", boxShadow:"0 0 40px rgba(254,214,91,0.3)" }}>
            احجز استشارة مجانية
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
}
