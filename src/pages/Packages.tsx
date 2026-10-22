import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Seo from "../components/Seo";

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const PACKAGES = [
  {
    title: "خدمة مفردة",
    desc: "مثالية للمشاريع المحددة التي تحتاج خدمة واحدة متميزة.",
    price: "200", currency: "ريال قطري", priceSub: "يبدأ من",
    popular: false,
    color: "#60a5fa",
    features: ["خدمة واحدة حسب الاختيار", "مراجعتان مجانيتان", "تسليم خلال 5–7 أيام", "ملفات المشروع كاملة", "دعم فني لأسبوع"],
    notIncluded: ["دعم مستمر", "خدمات متعددة"],
  },
  {
    title: "باقة الأعمال",
    desc: "الأنسب للمشاريع التجارية التي تحتاج حضوراً رقمياً متكاملاً.",
    price: "1,500", currency: "ريال قطري", priceSub: "يبدأ من",
    popular: true,
    color: "#7A1630",
    features: ["موقع إلكتروني احترافي", "هوية بصرية أساسية", "3 قوالب سوشيال ميديا", "دعم تقني شهر كامل", "مراجعات غير محدودة", "تسليم خلال 14 يوم"],
    notIncluded: ["تطبيق جوال"],
  },
  {
    title: "الإطلاق الرقمي الكامل",
    desc: "حل شامل لمن يريد حضوراً رقمياً قوياً من البداية.",
    price: "تواصل", currency: "", priceSub: "سعر خاص",
    popular: false,
    color: "#a78bfa",
    features: ["موقع + تطبيق جوال", "هوية بصرية شاملة", "فيديو ترويجي احترافي", "قوالب سوشيال كاملة", "دعم تقني 3 أشهر", "مدير مشروع مخصص"],
    notIncluded: [],
  },
];

const FAQS = [
  { q: "كم يستغرق تسليم المشروع؟", a: "يعتمد على حجم المشروع. الخدمة المفردة 5–7 أيام، باقة الأعمال 14 يوم، والإطلاق الكامل حسب الاتفاق." },
  { q: "هل يمكن التعديل بعد التسليم؟", a: "نعم، كل باقة تشمل عدداً من المراجعات المجانية، وبعدها تتوفر خيارات دعم مستمر." },
  { q: "ما طرق الدفع المتاحة؟", a: "تحويل بنكي، NAPS، Ooredoo Money، وVisa/Mastercard. نقبل الدفع على مراحل للمشاريع الكبيرة." },
  { q: "هل تعملون مع عملاء خارج قطر؟", a: "نعم، نخدم عملاء في جميع دول الخليج والدول العربية ونتواصل عن بُعد بكفاءة تامة." },
  { q: "هل تشمل الباقة الاستضافة والدومين؟", a: "الاستضافة والدومين منفصلة ويمكن مساعدتك في اختيار الأنسب لمشروعك بأفضل الأسعار." },
  { q: "كيف يتم التواصل خلال المشروع؟", a: "نتواصل عبر واتساب وإيميل مع جلسات متابعة أسبوعية لضمان سير المشروع كما تتوقع." },
];

export default function Packages() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-20" style={{ fontFamily: "'Tajawal','Cairo',sans-serif" }}>
      <Seo path="/packages" title="الباقات والأسعار"
        description="باقات فكرة المرنة — من الخدمة المفردة إلى الإطلاق الرقمي الكامل. أسعار واضحة تناسب كل مشروع في قطر والخليج." />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <motion.div {...up()} className="text-center mb-16">
          <span className="text-[#7A1630] text-xs font-black tracking-[0.25em] uppercase block mb-4">الباقات</span>
          <h1 className="text-5xl md:text-6xl font-black text-[#2A0913] mb-5">
            اختر ما{" "}
            <span style={{ background:"linear-gradient(135deg,#C9A35F,#8F6A2F)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              يناسبك
            </span>
          </h1>
          <p className="text-[#2A0913]/65 text-xl max-w-xl mx-auto">باقات مرنة لكل نوع من المشاريع — من الخدمة المفردة إلى الإطلاق الكامل.</p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch mb-20">
          {PACKAGES.map((p, i) => (
            <motion.div key={p.title} {...up(i * 0.1)}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-500 ${
                p.popular
                  ? "border-2 hover:-translate-y-2"
                  : "border border-[#4A0E1E]/15 hover:border-[#4A0E1E]/20 hover:-translate-y-1.5"
              }`}
              style={p.popular
                ? { background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", borderColor: p.color + "60", boxShadow: `0 0 60px ${p.color}15` }
                : { background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)" }}>

              {/* Hover bg glow */}
              {p.popular && (
                <div className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%,${p.color}08 0%,transparent 60%)` }} />
              )}

              {p.popular && (
                <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
                  <span className="px-5 py-1.5 rounded-full text-xs font-black shadow-lg"
                    style={{ background: "linear-gradient(135deg,#E9D29D,#C9A35F)", color: "#7A1630", boxShadow: "0 0 20px rgba(122,22,48,0.4)" }}>
                    ✦ الأكثر طلباً
                  </span>
                </div>
              )}

              <div className="relative z-10 mb-6">
                <div className="text-xs font-black tracking-widest uppercase mb-3" style={{ color: p.color + "80" }}>{p.priceSub}</div>
                <div className="text-4xl font-black mb-1" dir="ltr"
                  style={{ background: `linear-gradient(135deg,${p.color},${p.color}cc)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                  {p.price} <span className="text-lg">{p.currency}</span>
                </div>
                <h2 className="text-xl font-black text-[#2A0913] mt-4 mb-2">{p.title}</h2>
                <p className="text-sm leading-relaxed text-[#2A0913]/65">{p.desc}</p>
              </div>

              {/* Divider */}
              <div className="relative z-10 h-px mb-6" style={{ background: `linear-gradient(90deg,transparent,${p.color}30,transparent)` }} />

              <ul className="relative z-10 space-y-3 mb-8 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[#2A0913]/85">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: p.color + "20" }}>
                      <svg className="w-2.5 h-2.5" style={{ color: p.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7"/></svg>
                    </span>
                    {f}
                  </li>
                ))}
                {p.notIncluded.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[#2A0913]/45 line-through">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 flex-shrink-0">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6 18L18 6M6 6l12 12"/></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <NavLink to="/contact"
                className={`relative z-10 block text-center py-3.5 rounded-2xl text-sm font-black transition-all hover:scale-[1.02] ${
                  p.popular ? "text-[#7A1630] hover:opacity-90" : "hover:opacity-80"
                }`}
                style={p.popular
                  ? { background: "linear-gradient(135deg,#E9D29D,#C9A35F)", boxShadow: "0 0 30px rgba(122,22,48,0.3)" }
                  : { background: p.color + "18", color: p.color, border: `1px solid ${p.color}30` }}>
                ابدأ الآن
              </NavLink>
            </motion.div>
          ))}
        </div>

        {/* Comparison note */}
        <motion.div {...up(0.15)} className="text-center mb-20">
          <p className="text-[#2A0913]/55 text-sm">جميع الأسعار بالريال القطري — نقبل الدفع عبر NAPS، Ooredoo Money، أو تحويل بنكي</p>
        </motion.div>

        {/* FAQ */}
        <motion.div {...up(0.2)}>
          <div className="text-center mb-10">
            <span className="text-[#7A1630] text-xs font-black tracking-[0.25em] uppercase block mb-3">الأسئلة الشائعة</span>
            <h2 className="text-3xl font-black text-[#2A0913]">كل ما تريد معرفته</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((item, i) => (
              <motion.div key={item.q} {...up(0.25 + i * 0.04)}
                className="rounded-2xl border border-[#4A0E1E]/15 overflow-hidden transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-right gap-4 hover:bg-white/60 transition-colors">
                  <span className="font-bold text-[#2A0913] text-sm">{item.q}</span>
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openFaq === i ? "rotate-45" : ""
                  }`} style={{ background: openFaq === i ? "rgba(122,22,48,0.2)" : "rgba(74,14,30,0.06)", color: openFaq === i ? "#7A1630" : "rgba(42,9,19,0.5)" }}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 5v14M5 12h14"/></svg>
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}>
                      <div className="px-5 pb-5 text-sm text-[#2A0913]/65 leading-relaxed border-t border-[#4A0E1E]/15 pt-4">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...up(0.3)}
          className="relative mt-16 rounded-3xl p-10 text-center overflow-hidden border border-[#7A1630]/15"
          style={{ background: "linear-gradient(135deg,#7A1630,#4A0E1E)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(122,22,48,0.08) 0%,transparent 60%)" }} />
          <h2 className="text-2xl md:text-3xl font-black text-[#F3E2B6] mb-3 relative z-10">ما زلت غير متأكد؟</h2>
          <p className="text-white/65 mb-7 relative z-10">تحدث معنا مجاناً ونساعدك تختار الأنسب لمشروعك</p>
          <NavLink to="/contact"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-black text-[#7A1630] relative z-10 hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg,#E9D29D,#C9A35F)", boxShadow: "0 0 40px rgba(122,22,48,0.3)" }}>
            استشارة مجانية
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
}
