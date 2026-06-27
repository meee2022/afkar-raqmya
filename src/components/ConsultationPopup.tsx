import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../hooks/useSettings";

const STORAGE_KEY = "afkar_consult_popup_seen";
const DELAY_MS = 15000;

export default function ConsultationPopup() {
  const [open, setOpen] = useState(false);
  const settings = useSettings();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
  };

  const waMsg = encodeURIComponent("مرحباً، أريد حجز استشارة مجانية لمشروعي 🙌");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed bottom-6 right-6 z-[60] w-[calc(100%-3rem)] max-w-sm"
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.92 }}
          transition={{ type: "spring", damping: 20, stiffness: 260 }}
        >
          <div className="relative rounded-3xl p-6 overflow-hidden border border-[#fed65b]/20"
            style={{ background: "linear-gradient(135deg,rgba(0,53,39,0.95),rgba(5,10,7,0.97))", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(254,214,91,0.12) 0%,transparent 60%)" }} />

            {/* Close */}
            <button onClick={dismiss} aria-label="إغلاق"
              className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-10">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="relative z-10 text-center">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "linear-gradient(135deg,#fed65b,#ffa726)", boxShadow: "0 0 30px rgba(254,214,91,0.4)" }}>
                <svg className="w-7 h-7 text-[#003527]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </div>

              <h3 className="text-xl font-black text-white mb-2">استشارة مجانية 🎁</h3>
              <p className="text-white/55 text-sm leading-relaxed mb-5">
                عندك فكرة مشروع؟ احجز استشارتك المجانية الآن ونساعدك نختار أفضل طريق لتنفيذها — بدون أي التزام.
              </p>

              <div className="flex flex-col gap-2.5">
                <a href={`https://wa.me/${settings.whatsapp}?text=${waMsg}`} target="_blank" rel="noopener noreferrer"
                  onClick={dismiss}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm text-[#003527] hover:scale-[1.02] transition-transform"
                  style={{ background: "linear-gradient(135deg,#fed65b,#ffa726)", boxShadow: "0 0 30px rgba(254,214,91,0.3)" }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" /></svg>
                  تواصل عبر واتساب
                </a>
                <NavLink to="/contact" onClick={dismiss}
                  className="py-3 rounded-2xl font-bold text-sm text-white/70 border border-white/10 hover:border-[#fed65b]/30 hover:text-white transition-all"
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  أو املأ نموذج التواصل
                </NavLink>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
