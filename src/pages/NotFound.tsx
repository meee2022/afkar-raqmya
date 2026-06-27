import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import Seo from "../components/Seo";

const LINKS = [
  { to: "/", label: "الرئيسية" },
  { to: "/services", label: "خدماتنا" },
  { to: "/portfolio", label: "أعمالنا" },
  { to: "/contact", label: "تواصل معنا" },
];

export default function NotFound() {
  const [count, setCount] = useState(10);

  // Auto redirect countdown
  useEffect(() => {
    if (count <= 0) { window.location.href = "/"; return; }
    const t = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20"
      style={{ fontFamily: "'Tajawal','Cairo',sans-serif" }}>
      <Seo path="/404" title="الصفحة غير موجودة"
        description="الصفحة التي تبحث عنها غير موجودة." />

      <div className="text-center max-w-xl w-full">

        {/* Glowing 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
          className="relative inline-block mb-6">
          <span className="text-[160px] md:text-[200px] font-black leading-none select-none"
            style={{
              background: "linear-gradient(135deg,#fed65b 0%,#ffa726 40%,#4ade80 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(254,214,91,0.4))",
            }}>
            404
          </span>
          {/* Orbiting dot */}
          <motion.div
            className="absolute w-4 h-4 rounded-full"
            style={{ top: "20%", right: "-8px", background: "#fed65b", boxShadow: "0 0 16px rgba(254,214,91,0.8)" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute w-3 h-3 rounded-full"
            style={{ bottom: "25%", left: "-4px", background: "#4ade80", boxShadow: "0 0 12px rgba(74,222,128,0.7)" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl md:text-4xl font-black text-white mb-3">
          الصفحة غير موجودة!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-white/50 text-lg mb-8 leading-relaxed">
          يبدو أن الصفحة التي تبحث عنها انتقلت أو لم تعد موجودة.
          <br />
          <span className="text-[#fed65b]/70 text-sm">سيتم توجيهك للرئيسية خلال <span className="font-black text-[#fed65b]">{count}</span> ثانية</span>
        </motion.p>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-2 gap-3 mb-8">
          {LINKS.map((l, i) => (
            <motion.div key={l.to}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 + i * 0.07 }}>
              <NavLink to={l.to}
                className="block p-4 rounded-2xl border border-white/[0.07] hover:border-[#fed65b]/30 hover:-translate-y-1 transition-all duration-300 text-white/60 hover:text-white font-bold text-sm"
                style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
                {l.label}
              </NavLink>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}>
          <NavLink to="/"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-black text-[#003527] hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg,#fed65b,#ffa726)", boxShadow: "0 0 40px rgba(254,214,91,0.35)" }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            العودة للرئيسية
          </NavLink>
        </motion.div>

        {/* Progress bar for countdown */}
        <motion.div className="mt-8 h-1 rounded-full overflow-hidden mx-auto max-w-xs"
          style={{ background: "rgba(255,255,255,0.05)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}>
          <motion.div className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#fed65b,#ffa726)" }}
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 10, ease: "linear" }} />
        </motion.div>
      </div>
    </div>
  );
}
