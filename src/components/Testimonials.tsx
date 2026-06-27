import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

interface Testimonial {
  name: string;
  role: string;
  project: string;
  quote: string;
  rating: number;
  color: string;
  initial: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "أحمد العلي",
    role: "صاحب مطعم",
    project: "Adrenaline",
    quote: "الموقع طلع أحلى من اللي تخيلته بكتير. التصميم احترافي والطلبات زادت بشكل ملحوظ من أول أسبوع. فريق متعاون ومحترف.",
    rating: 5,
    color: "#f97316",
    initial: "أ",
  },
  {
    name: "سارة المنصوري",
    role: "مديرة تسويق",
    project: "DarkFit",
    quote: "تعاملت مع شركات كتير قبل كده، لكن أفكار رقمية مختلفين. التزام بالمواعيد، جودة عالية، ومتابعة حتى بعد التسليم.",
    rating: 5,
    color: "#a3e635",
    initial: "س",
  },
  {
    name: "خالد الإبراهيم",
    role: "مؤسس أكاديمية",
    project: "ابن تيمية",
    quote: "حولوا فكرتي لمنصة تعليمية متكاملة بشكل يفوق التوقعات. عدد التسجيلات تضاعف والتجربة سلسة جداً للطلاب.",
    rating: 5,
    color: "#fbbf24",
    initial: "خ",
  },
  {
    name: "نورة السعيد",
    role: "رائدة أعمال",
    project: "Arirang Bakery",
    quote: "الهوية البصرية اللي صمموها عكست روح المشروع بالضبط. كل تفصيلة مدروسة وبتحكي قصة. أنصح فيهم بقوة.",
    rating: 5,
    color: "#f472b6",
    initial: "ن",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const t = TESTIMONIALS[active];

  return (
    <div className="mt-24">
      <motion.div {...inView()} className="text-center mb-12">
        <span className="text-[#fed65b] text-xs font-black tracking-[0.25em] uppercase block mb-4">آراء عملائنا</span>
        <h2 className="text-3xl md:text-4xl font-black text-white">ماذا يقول من وثقوا بنا</h2>
      </motion.div>

      {/* Featured testimonial */}
      <motion.div {...inView(0.1)} className="max-w-3xl mx-auto mb-8">
        <div className="relative rounded-3xl p-8 md:p-10 border border-white/[0.07] overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
          {/* Big quote mark */}
          <div className="absolute top-4 right-6 text-[120px] leading-none font-black select-none pointer-events-none"
            style={{ color: t.color, opacity: 0.08 }}>"</div>

          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 30% 0%,${t.color}10 0%,transparent 60%)` }} />

          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="relative z-10">
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="w-5 h-5" fill={t.color} viewBox="0 0 24 24">
                    <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7-6.2-3.7L5.4 21l1.6-7L1.6 9.5l7.1-.6z" />
                  </svg>
                ))}
              </div>

              <p className="text-white/80 text-lg md:text-xl leading-relaxed font-medium mb-7">
                {t.quote}
              </p>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black flex-shrink-0"
                  style={{ background: t.color + "18", color: t.color, border: `1px solid ${t.color}30` }}>
                  {t.initial}
                </div>
                <div>
                  <div className="font-black text-white">{t.name}</div>
                  <div className="text-sm text-white/40">{t.role} — مشروع {t.project}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Dots / selectors */}
      <motion.div {...inView(0.2)} className="flex justify-center gap-3">
        {TESTIMONIALS.map((item, i) => (
          <button key={item.name} onClick={() => setActive(i)} aria-label={item.name}
            className="group flex items-center gap-2 transition-all">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black transition-all"
              style={i === active
                ? { background: item.color + "20", color: item.color, border: `1px solid ${item.color}50`, transform: "scale(1.1)" }
                : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {item.initial}
            </span>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
