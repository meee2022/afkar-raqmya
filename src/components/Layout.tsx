import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../hooks/useSettings";

// ── Scroll progress hook ───────────────────────────────────────────────────────
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fn = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return progress;
}

const NAV = [
  { to: "/services", label: "خدماتنا" },
  { to: "/portfolio", label: "أعمالنا" },
  { to: "/packages", label: "الباقات" },
  { to: "/about", label: "من نحن" },
  { to: "/contact", label: "تواصل" },
];

const WA_ICON = (
  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.546 4.072 1.5 5.786L0 24l6.387-1.467A11.951 11.951 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.951 9.951 0 01-5.17-1.4l-.37-.22-3.793.872.938-3.682-.24-.382A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const settings = useSettings();
  const isHome = pathname === "/";
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const headerBg = scrolled || !isHome;

  return (
    <div className="relative min-h-screen bg-[#050a07] text-white overflow-x-hidden" dir="rtl"
      style={{ fontFamily: "'Tajawal','Cairo',sans-serif" }}>

      {/* ── Shared animated background (all pages) ────────────────────────── */}
      <style>{`
        @keyframes bgShift  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes orbPulse { 0%,100%{opacity:.4} 50%{opacity:.85} }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
        .layout-bg  { background-size:200% 200%; animation:bgShift 8s ease infinite; }
        .layout-orb { animation:orbPulse 3s ease-in-out infinite; }
        .typing-cursor::after { content:'|'; animation:blink 1s step-end infinite; color:#fed65b; }
      `}</style>

      {/* Animated gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none layout-bg"
        style={{ background: "linear-gradient(135deg,#050a07 0%,#003527 30%,#001a14 60%,#050a07 100%)" }} />

      {/* Grid overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />

      {/* Glow orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl layout-orb"
          style={{ background:"radial-gradient(circle,rgba(254,214,91,0.15) 0%,transparent 70%)" }} />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl layout-orb"
          style={{ background:"radial-gradient(circle,rgba(0,53,39,0.5) 0%,transparent 70%)", animationDelay:"1.5s" }} />
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        headerBg ? "border-b border-white/[0.07]" : ""
      }`}
        style={headerBg ? { background: "rgba(5,10,7,0.85)", backdropFilter: "blur(20px)" } : {}}>

        {/* ── Scroll progress bar ── */}
        <div className="absolute bottom-0 left-0 h-[2px] transition-all duration-75 rounded-full"
          style={{
            width: `${scrollProgress}%`,
            background: "linear-gradient(90deg,#fed65b,#ffa726,#4ade80)",
            boxShadow: "0 0 8px rgba(254,214,91,0.7)",
            opacity: scrollProgress > 1 ? 1 : 0,
          }} />

        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
              style={{ background: "linear-gradient(135deg,#fed65b,#ffa726)", boxShadow: "0 0 20px rgba(254,214,91,0.3)" }}>
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="#003527"/>
              </svg>
            </div>
            <span className="font-black text-white text-lg tracking-tight">أفكار رقمية</span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(l => (
              <NavLink key={l.to} to={l.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "text-[#fed65b]"
                      : "text-white/50 hover:text-white"
                  }`
                }>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div layoutId="nav-pill"
                        className="absolute inset-0 rounded-xl"
                        style={{ background: "rgba(254,214,91,0.1)", border: "1px solid rgba(254,214,91,0.2)" }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />
                    )}
                    <span className="relative z-10">{l.label}</span>
                  </>
                )}
              </NavLink>
            ))}
            <NavLink to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all mr-2 border ${
                  isActive
                    ? "bg-[#003527] text-[#fed65b] border-[#fed65b]/30"
                    : "border-white/10 text-white/50 hover:border-[#fed65b]/30 hover:text-[#fed65b] hover:bg-[#003527]/30"
                }`
              }>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              لوحة التحكم
            </NavLink>
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <NavLink to="/contact"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm text-[#003527] hover:scale-105 transition-all"
              style={{ background: "linear-gradient(135deg,#fed65b,#ffa726)", boxShadow: "0 0 20px rgba(254,214,91,0.3)" }}>
              ابدأ مشروعك
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </NavLink>
            <button className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5"
              onClick={() => setMenuOpen(v => !v)} aria-label="القائمة">
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}/>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}/>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}/>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden border-t border-white/[0.06]"
              style={{ background: "rgba(5,10,7,0.97)", backdropFilter: "blur(20px)" }}>
              <nav className="px-6 py-5 flex flex-col gap-1">
                {NAV.map(l => (
                  <NavLink key={l.to} to={l.to}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-[#fed65b]/10 text-[#fed65b] border border-[#fed65b]/20"
                          : "text-white/60 hover:text-white"
                      }`
                    }>{l.label}</NavLink>
                ))}
                <NavLink to="/admin"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white/50 border border-white/10 mt-1 hover:border-[#fed65b]/30 hover:text-[#fed65b] transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                  لوحة التحكم
                </NavLink>
                <NavLink to="/contact"
                  className="mt-2 flex justify-center py-3.5 rounded-full font-black text-sm text-[#003527]"
                  style={{ background: "linear-gradient(135deg,#fed65b,#ffa726)" }}>
                  ابدأ مشروعك
                </NavLink>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}>
          {children}
        </motion.main>
      </AnimatePresence>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="relative border-t border-white/[0.06] py-12"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(20px)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(0,53,39,0.2) 0%, transparent 60%)" }} />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
                style={{ background: "linear-gradient(135deg,#fed65b,#ffa726)" }}>
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                  <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="#003527"/>
                </svg>
              </div>
              <span className="font-black text-white">أفكار رقمية</span>
            </NavLink>

            <div className="flex flex-wrap justify-center items-center gap-5">
              {NAV.map(l => (
                <NavLink key={l.to} to={l.to}
                  className="text-xs text-white/30 hover:text-[#fed65b] transition-colors font-medium">{l.label}</NavLink>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { label: "واتساب", href: `https://wa.me/${settings.whatsapp}`, color: "#25D366",
                  icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>, fill: true },
                { label: "إنستغرام", href: settings.instagramUrl || "#", color: "#E1306C",
                  icon: <><rect x="2" y="2" width="20" height="20" rx="5" strokeWidth={1.5}/><circle cx="12" cy="12" r="4" strokeWidth={1.5}/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></>, fill: false },
                { label: "تويتر", href: settings.twitterUrl || "#", color: "#1DA1F2",
                  icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>, fill: true },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <svg className="w-4 h-4" fill={s.fill ? "currentColor" : "none"} viewBox="0 0 24 24"
                    stroke={s.fill ? "none" : "currentColor"}>{s.icon}</svg>
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/20 text-xs">© {new Date().getFullYear()} أفكار رقمية — جميع الحقوق محفوظة</p>
            <p className="text-white/15 text-xs">صُنع بـ ♥ في قطر</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <motion.a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer"
        aria-label="واتساب" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: "#25D366", boxShadow: "0 4px 24px rgba(37,211,102,0.5)" }}>
        {WA_ICON}
      </motion.a>
    </div>
  );
}
