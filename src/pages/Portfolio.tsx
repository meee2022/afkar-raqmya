import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Seo from "../components/Seo";

const CATS = ["الكل", "مواقع", "تطبيقات", "هوية", "نظم"];

const STATIC_PROJECTS = [
  { _id: "s0", titleAr: "Marasi Boats — رحلات بحرية فاخرة", descriptionAr: "موقع فاخر لرحلات اليخت الخاص في الدوحة: الباقات والمناسبات والمعرض والحجز.", category: "مواقع", result: "تجربة حجز فاخرة", imageUrl: "/previews/marasi.jpg", videoUrl: "/videos/marasi.mp4", color: "", accent: "#3B5BDB", liveUrl: "https://marasi-boats.pages.dev/" },
  { _id: "s1", titleAr: "Adrenaline — وجبات صحية", descriptionAr: "منصة وجبات صحية بخطط غذائية ذكية وحاسبة سعرات واشتراكات وتوصيل يومي داخل قطر.", category: "مواقع", result: "منصة طلب واشتراك", imageUrl: "/previews/adrenaline-food.png", videoUrl: "/videos/adrenaline.mp4", color: "", accent: "#3cc4f0", liveUrl: "https://adrenalinehealthy.com/" },
  { _id: "s2", titleAr: "نَفَحات — صحبة القرآن", descriptionAr: "تطبيق للمصحف وأوقات الصلاة والقبلة والتسبيح، بتجربة عربية هادئة.", category: "تطبيقات", phone: true, result: "تجربة روحية يومية", imageUrl: "/previews/naf-home.jpg", videoUrl: "/nafafat.mp4", color: "", accent: "#2dd4bf",
    challenge: "إيجاد طريقة تجعل القارئ على صلة يومية بالقرآن الكريم بأسلوب عصري وجذاب بعيداً عن التطبيقات التقليدية.",
    solution: "تصميم تجربة تفاعلية تشمل تصفّح المصحف، آية اليوم، التلاوات الصوتية، والأدوات والمكتبة — بواجهة عربية أنيقة وسلسة.",
    outcome: "تطبيق متكامل يوفّر صحبة قرآنية يومية بتجربة مستخدم راقية على الجوال.",
    liveUrl: "https://nafahat.vercel.app/" },
  { _id: "s3", titleAr: "Nada Makeup — خبيرة تجميل", descriptionAr: "موقع أنيق لخبيرة مكياج العرائس في قطر ومصر، مع معرض الأعمال ونظام الحجز.", category: "هوية", result: "هوية أنيقة + حجز", imageUrl: "/previews/nada-new.jpg", videoUrl: "/videos/nada.mp4", color: "", accent: "#C0806A", liveUrl: "https://nada-makeup-9yu.pages.dev/" },
  { _id: "s4", titleAr: "ردّة — تراث الغوص على اللؤلؤ", descriptionAr: "منصة تعليمية تفاعلية عن تراث الغوص على اللؤلؤ في قطر والخليج، برحلة غوص افتراضية.", category: "مواقع", result: "تجربة تعليمية غامرة", imageUrl: "/previews/diving.png", videoUrl: null, color: "", accent: "#38bdf8" },
  { _id: "s5", titleAr: "DarkFit — منصة لياقة", descriptionAr: "تمارين ومولّد خطط وتغذية ومدربين وحاسبات صحية في تطبيق واحد.", category: "تطبيقات", phone: true, result: "منظومة لياقة متكاملة", imageUrl: "/previews/darkfit-m.jpg", videoUrl: "/videos/darkfit.mp4", color: "", accent: "#4CA31A", liveUrl: "https://darkfit.netlify.app/" },
  { _id: "s6", titleAr: "Dopamin — حلويات صحية", descriptionAr: "هوية دافئة وموقع لعلامة حلويات صحية يعرض المنتجات بتجربة بصرية شهية.", category: "هوية", result: "هوية علامة شهية", imageUrl: "/previews/dopamin.png", videoUrl: "/videos/dopamin.mp4", color: "", accent: "#C2577E", liveUrl: "https://dopamin-bj1.pages.dev/" },
  { _id: "s7", titleAr: "دَرْب — التعلّم التفاعلي", descriptionAr: "منصة ألعاب وأنشطة تعليمية لكل المواد، يُنشئ فيها المعلم أنشطته ويشاركها مع طلابه.", category: "تطبيقات", result: "أدوات تعليمية تفاعلية", imageUrl: "/previews/games-new.jpg", videoUrl: "/videos/darb.mp4", color: "", accent: "#7A1630", liveUrl: "https://activities-dmc.pages.dev/" },
  { _id: "s8", titleAr: "دار ابن الجزري", descriptionAr: "منصة متكاملة لتحفيظ القرآن الكريم وتعليم أحكام التجويد لجميع الأعمار.", category: "مواقع", result: "منصة تعليم قرآني", imageUrl: "/previews/ibn-jazry-new.jpg", videoUrl: "/videos/ibn-jazry.mp4", color: "", accent: "#1F8A5B", liveUrl: "https://dar-ibn-jazri.vercel.app/" },
  { _id: "s9", titleAr: "صلاتي قرة عيني", descriptionAr: "رحلة تفاعلية تعلّم الأطفال الأذان والوضوء والصلاة مع شخصيتي حمد وهدى.", category: "تطبيقات", phone: true, result: "تعليم أطفال ممتع", imageUrl: "/previews/slaty.png", videoUrl: "/videos/slaty.mp4", color: "", accent: "#34A06B", liveUrl: "https://noora-edu.com/" },
  { _id: "s10", titleAr: "زينة وخزينة — الذهب", descriptionAr: "تطبيق لبيع وشراء الذهب ومتابعة الأسعار والمعاملات بسهولة.", category: "تطبيقات", result: "تداول ذهب مبسّط", imageUrl: "/previews/gold.jpg", videoUrl: null, color: "", accent: "#C9A35F", liveUrl: "https://goldqatar1.netlify.app/" },
  { _id: "s11", titleAr: "مطابخ الجنوب — نقاط بيع", descriptionAr: "نظام كاشير وفواتير إلكترونية ومتابعة مبيعات لمطاعم المأكولات الشعبية.", category: "نظم", result: "POS وفواتير", imageUrl: "/previews/elwakra-pos.jpg", videoUrl: null, color: "", accent: "#B4472A", liveUrl: "https://stdk.vercel.app/" },
];

const ACCENT_COLORS: Record<string, string> = {
  "مواقع": "#7A1630", "تطبيقات": "#4ade80", "هوية": "#f472b6", "نظم": "#a78bfa",
};

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

// ── Video Lightbox ─────────────────────────────────────────────────────────────
interface LightboxProject {
  titleAr: string;
  descriptionAr: string;
  category: string;
  videoUrl: string | null;
  imageUrl: string | null;
  accent: string;
  result?: string | null;
  challenge?: string | null;
  solution?: string | null;
  outcome?: string | null;
  liveUrl?: string | null;
}

function VideoLightbox({
  project,
  onClose,
}: {
  project: LightboxProject;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>('button, a[href], video[controls], [tabindex]:not([tabindex="-1"])');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handler);
    return () => { document.removeEventListener("keydown", handler); previousFocus?.focus(); };
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-dialog-title"
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" />

      {/* Panel */}
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-5xl rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.88, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "#F6F0E6",
          border: `1px solid ${project.accent}30`,
          boxShadow: `0 0 80px ${project.accent}25, 0 40px 120px rgba(74,14,30,0.35)`,
        }}
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="إغلاق تفاصيل المشروع"
          onClick={onClose}
          className="absolute top-4 left-4 z-50 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ background: "rgba(74,14,30,0.08)", border: "1px solid rgba(74,14,30,0.15)" }}
        >
          <svg className="w-4 h-4 text-[#2A0913]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video / Image */}
        <div className="relative bg-black overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {project.videoUrl ? (
            <>
              {project.category === "تطبيقات" && <video src={project.videoUrl} muted autoPlay loop playsInline aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-25 blur-2xl scale-110" />}
              <video ref={videoRef} src={project.videoUrl}
                className={`relative z-10 w-full h-full ${project.category === "تطبيقات" ? "object-contain" : "object-cover"}`}
                autoPlay controls playsInline />
            </>
          ) : project.imageUrl ? (
            <img src={project.imageUrl} alt={project.titleAr} className="w-full h-full object-cover" />
          ) : (
            /* Cinematic placeholder when no media */
            <div className="w-full h-full flex flex-col items-center justify-center gap-6"
              style={{ background: `linear-gradient(135deg, #14050b 0%, ${project.accent}15 50%, #14050b 100%)` }}>
              <div className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: project.accent + "20", border: `2px solid ${project.accent}40`, boxShadow: `0 0 40px ${project.accent}30` }}>
                <svg className="w-10 h-10" style={{ color: project.accent }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-[#2A0913]/65 text-sm">تفاصيل المشروع والنتائج موضحة بالأسفل</p>
            </div>
          )}
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(246,240,230,0.9), transparent)" }} />
        </div>

        {/* Info footer */}
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: project.accent + "25", color: project.accent, border: `1px solid ${project.accent}40` }}>
                {project.category}
              </span>
              {project.result && (
                <span className="text-xs font-black" style={{ color: project.accent }}>{project.result}</span>
              )}
            </div>
            <h2 id="project-dialog-title" className="text-xl font-black text-[#2A0913]">{project.titleAr}</h2>
            <p className="text-[#2A0913]/65 text-sm mt-1 leading-relaxed">{project.descriptionAr}</p>
          </div>
          <div className="flex gap-2.5 flex-shrink-0">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full text-sm font-black transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 text-[#7A1630]"
                style={{ background: `linear-gradient(135deg,${project.accent},${project.accent}cc)` }}>
                زيارة المشروع
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
              </a>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
              style={{ background: project.accent + "20", color: project.accent, border: `1px solid ${project.accent}40` }}
            >
              إغلاق
            </button>
          </div>
        </div>

        {/* Case study — shows only when fields are provided */}
        {(project.challenge || project.solution || project.outcome) && (
          <div className="px-6 pb-6 grid sm:grid-cols-3 gap-4 border-t border-[#4A0E1E]/15 pt-5">
            {[
              { label: "التحدي", value: project.challenge, icon: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "الحل", value: project.solution, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "النتيجة", value: project.outcome, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
            ].filter(b => b.value).map(b => (
              <div key={b.label} className="rounded-2xl p-4 border border-[#4A0E1E]/15"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: project.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d={b.icon} /></svg>
                  <span className="text-xs font-black" style={{ color: project.accent }}>{b.label}</span>
                </div>
                <p className="text-[#2A0913]/70 text-sm leading-relaxed">{b.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Top glow bar */}
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: `linear-gradient(90deg,transparent,${project.accent}80,transparent)` }} />
      </motion.div>

      {/* ESC hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#2A0913]/50 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        اضغط ESC للإغلاق
      </motion.div>
    </motion.div>
  );
}

// ── Project Card ───────────────────────────────────────────────────────────────
function ProjectCard({
  p,
  index,
  onOpenLightbox,
}: {
  p: typeof STATIC_PROJECTS[0] & { tags?: string[] };
  index: number;
  onOpenLightbox: (p: LightboxProject) => void;
}) {
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const accent = (p as any).accent ?? ACCENT_COLORS[p.category] ?? "#7A1630";
  const color = (p as any).color ?? "from-[#7A1630] to-[#14050b]";

  // Autoplay muted preview on hover (or always if no image)
  useEffect(() => {
    const vid = videoPreviewRef.current;
    if (!vid) return;
    if (!p.imageUrl) {
      vid.play().catch(() => {});
    } else if (isHovering) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isHovering, p.imageUrl]);

  const handleCardClick = () => {
    onOpenLightbox({ ...p, accent } as LightboxProject);
  };

  return (
    <motion.button
      type="button"
      aria-label={`عرض تفاصيل مشروع ${p.titleAr}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" as const }}
      className="group relative rounded-2xl overflow-hidden border border-[#4A0E1E]/15 hover:border-[#4A0E1E]/20 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7A1630] transition-all duration-500 flex flex-col cursor-pointer text-right w-full"
      style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleCardClick}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 30%,${accent}12 0%,transparent 60%)` }} />

      {/* Media area */}
      {(p as any).phone ? (
        /* ── Phone mockup for mobile screenshots ── */
        <div className="relative overflow-hidden flex items-center justify-center" style={{
          height: 300,
          background: `radial-gradient(ellipse at 50% 60%, ${accent}18 0%, transparent 70%), linear-gradient(135deg, ${accent}08, transparent)`,
        }}>
          {/* Glow blob */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 50%, ${accent}20 0%, transparent 65%)` }} />

          {/* Phone frame SVG */}
          <div className="relative z-10 transition-transform duration-500 group-hover:scale-[1.04]" style={{ width: 132, height: 270 }}>
            {/* Phone body */}
            <div className="absolute inset-0 rounded-[22px] border-2 border-[#4A0E1E]/20"
              style={{ background: "linear-gradient(145deg,#1a1a1a,#0a0a0a)", boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.1)` }} />
            {/* Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 rounded-full z-20"
              style={{ background: "#0a0a0a", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)" }}>
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/10" />
            </div>
            {/* Screen */}
            <div className="absolute rounded-[18px] overflow-hidden" style={{ inset: 3 }}>
              {p.imageUrl ? (
                <>
                  <img src={p.imageUrl} alt={`مشروع ${p.titleAr}`} loading="lazy" decoding="async" className="w-full h-full object-cover object-top" />
                  {p.videoUrl && <video ref={videoPreviewRef} src={p.videoUrl} muted playsInline loop preload="none"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovering ? "opacity-100" : "opacity-0"}`} />}
                </>
              ) : p.videoUrl ? (
                <video
                  ref={videoPreviewRef}
                  src={p.videoUrl}
                  className="w-full h-full object-cover"
                  muted autoPlay playsInline loop preload="metadata"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${accent}30, ${accent}10)` }}>
                  <svg className="w-8 h-8 opacity-30" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/>
                  </svg>
                </div>
              )}
              {/* Screen overlay on hover */}
              <div className={`absolute inset-0 transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}
                style={{ background: "rgba(0,0,0,0.3)" }} />
            </div>
            {/* Home indicator */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-white/10 z-20" />
            {/* Side buttons */}
            <div className="absolute -right-0.5 top-14 w-0.5 h-6 rounded-l-sm" style={{ background: "#333" }} />
            <div className="absolute -left-0.5 top-12 w-0.5 h-5 rounded-r-sm" style={{ background: "#333" }} />
            <div className="absolute -left-0.5 top-20 w-0.5 h-5 rounded-r-sm" style={{ background: "#333" }} />
          </div>

          {/* Play button on hover */}
          {p.videoUrl && (
            <motion.div
              className="absolute z-20 w-10 h-10 rounded-full flex items-center justify-center"
              initial={false}
              animate={isHovering ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              style={{ background: accent + "40", border: `1.5px solid ${accent}80`, backdropFilter: "blur(8px)" }}>
              <svg className="w-4 h-4 ml-0.5" style={{ color: accent }} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </motion.div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 right-3 z-20">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm"
              style={{ background: accent + "25", color: accent, border: `1px solid ${accent}40` }}>
              {p.category}
            </span>
          </div>
          {p.videoUrl && (
            <div className="absolute top-3 left-3 z-20">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm"
                style={{ background: "rgba(0,0,0,0.5)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}>
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                فيديو
              </span>
            </div>
          )}
        </div>
      ) : (
        /* ── Browser mockup for websites & others ── */
        <div className="relative overflow-hidden" style={{ height: 300 }}>
          {/* Video on hover */}
          {p.videoUrl && (
            <video
              ref={videoPreviewRef}
              src={p.videoUrl}
              className={`absolute inset-x-0 bottom-0 z-[5] w-full object-contain transition-opacity duration-500 ${isHovering ? "opacity-100" : "opacity-0"}`}
              style={{ top: 30, height: "calc(100% - 30px)" }}
              muted playsInline loop preload="none"
            />
          )}

          {p.imageUrl ? (
            <>
              {/* Blurred copy fills the frame so the real screenshot can show uncropped (object-contain) */}
              <img src={p.imageUrl} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60" />
              <div className="absolute top-0 inset-x-0 z-10 flex items-center gap-1.5 px-3 py-2 bg-[#151515]/90 backdrop-blur-sm border-b border-[#4A0E1E]/15">
                <div className="w-2 h-2 rounded-full bg-[#ff5f57]"/>
                <div className="w-2 h-2 rounded-full bg-[#febc2e]"/>
                <div className="w-2 h-2 rounded-full bg-[#28c840]"/>
                <div className="flex-1 mx-2 h-4 rounded bg-white/60 flex items-center px-2">
                  <div className="w-1.5 h-1.5 rounded-full mr-1" style={{ background: accent }}/>
                  <div className="h-1 w-16 rounded bg-white/10"/>
                </div>
              </div>
              <img src={p.imageUrl} alt={`مشروع ${p.titleAr}`} loading="lazy" decoding="async"
                className={`absolute inset-x-0 bottom-0 w-full object-contain transition-all duration-700 group-hover:scale-[1.03] ${p.videoUrl && isHovering ? "opacity-0" : "opacity-100"}`} style={{ top: 30, height: "calc(100% - 30px)" }} />
            </>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center relative`}>
              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 bg-[#151515]/80 rounded-lg px-3 py-1.5 w-fit">
                  <div className="w-2 h-2 rounded-full bg-[#ff5f57]"/>
                  <div className="w-2 h-2 rounded-full bg-[#febc2e]"/>
                  <div className="w-2 h-2 rounded-full bg-[#28c840]"/>
                </div>
                <div className="flex items-end gap-1.5">
                  {[60,85,50,90,70,80].map((h, j) => (
                    <div key={j} className="flex-1 rounded-sm" style={{
                      height: `${h * 0.4}px`,
                      background: j%3===0 ? `${accent}dd` : j%3===1 ? `${accent}88` : `${accent}44`
                    }}/>
                  ))}
                </div>
              </div>
              <span className="text-white/[0.07] text-5xl font-black relative z-10">{p.titleAr.slice(0, 1)}</span>
            </div>
          )}

          {/* Play overlay on hover */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }}>
            <motion.div
              initial={false}
              animate={isHovering ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", damping: 16, stiffness: 300 }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: accent + "30", border: `2px solid ${accent}60`, boxShadow: `0 0 30px ${accent}40`, backdropFilter: "blur(8px)" }}>
              <svg className="w-7 h-7 ml-0.5" style={{ color: accent }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </motion.div>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 right-3 z-20">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm"
              style={{ background: accent + "25", color: accent, border: `1px solid ${accent}40` }}>
              {p.category}
            </span>
          </div>
          {p.videoUrl && (
            <div className="absolute top-3 left-3 z-20">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm"
                style={{ background: "rgba(0,0,0,0.5)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}>
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                فيديو
              </span>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="relative z-10 p-5 flex-1 flex flex-col">
        <h3 className="font-black text-[#2A0913] mb-1.5 group-hover:text-[#7A1630] transition-colors duration-300">{p.titleAr}</h3>
        <p className="text-[#2A0913]/65 text-sm leading-relaxed mb-4 flex-1">{p.descriptionAr}</p>
        {p.result && (
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: accent + "18" }}>
              <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              <span className="text-xs font-black" style={{ color: accent }}>{p.result}</span>
            </div>
            <span className="text-[#2A0913]/50 text-xs opacity-0 group-hover:opacity-100 transition-opacity">انقر للمعاينة ←</span>
          </div>
        )}
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg,transparent,${accent}60,transparent)` }} />
    </motion.button>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [filter, setFilter] = useState("الكل");
  const [lightboxProject, setLightboxProject] = useState<LightboxProject | null>(null);
  const convexProjects = useQuery(api.projects.list);

  // Curated real projects first; admin-added projects show only if they have a real image or video.
  const staticTitles = new Set(STATIC_PROJECTS.map(p => p.titleAr.split(" — ")[0]));
  const extra = (convexProjects ?? [])
    .filter(p => (p.imageUrl || p.videoUrl) && !staticTitles.has(p.titleAr.split(" — ")[0]))
    .map(p => ({ ...p, color: "", accent: ACCENT_COLORS[p.category] ?? "#7A1630", phone: false }));
  const projects = [...STATIC_PROJECTS, ...extra];

  const filtered = filter === "الكل" ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen pt-20" style={{ fontFamily: "'Tajawal','Cairo',sans-serif" }}>
      <Seo path="/portfolio" title="أعمالنا"
        description="مشاريع نفخر بها — مواقع وتطبيقات وهويات بصرية أنجزتها أثر لعملاء في قطر والخليج. شاهد أعمالنا ونتائجها." />

      {/* Video Lightbox */}
      <AnimatePresence>
        {lightboxProject && (
          <VideoLightbox
            key="lightbox"
            project={lightboxProject}
            onClose={() => setLightboxProject(null)}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <motion.div {...up()} className="mb-16">
          <span className="text-[#7A1630] text-xs font-black tracking-[0.25em] uppercase block mb-4">أعمالنا</span>
          <h1 className="text-5xl md:text-6xl font-black text-[#2A0913] mb-5">
            مشاريع{" "}
            <span style={{ background:"linear-gradient(135deg,#C9A35F,#8F6A2F)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              نفخر بها
            </span>
          </h1>
          <p className="text-[#2A0913]/65 text-xl max-w-2xl">كل مشروع يمثل التزامنا بالجودة والإبداع والنتائج الحقيقية.</p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div {...up(0.1)} className="flex gap-2 flex-wrap mb-12">
          {CATS.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                filter === c
                  ? "text-[#7A1630] shadow-lg"
                  : "border border-[#4A0E1E]/15 text-[#2A0913]/65 hover:border-[#4A0E1E]/25 hover:text-[#2A0913]"
              }`}
              style={filter === c ? { background: "linear-gradient(135deg,#E9D29D,#C9A35F)", boxShadow: "0 0 20px rgba(122,22,48,0.3)" } : {}}>
              {c}
            </button>
          ))}
        </motion.div>

        {/* Hint */}
        <motion.p {...up(0.15)} className="text-[#2A0913]/50 text-xs mb-6 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          افتح أي مشروع لمشاهدة التفاصيل والمعاينة الكاملة — الفيديوهات الطولية تظهر بدون قص
        </motion.p>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, i) => (
              <ProjectCard
                key={p._id}
                p={p as any}
                index={i}
                onOpenLightbox={setLightboxProject}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#2A0913]/55">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold">لا توجد مشاريع في هذا التصنيف</p>
          </div>
        )}

        {/* Portfolio facts sourced from the projects currently shown */}
        <motion.div {...up(0.2)} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: String(projects.length), l: "مشروع منشور" },
            { n: String(new Set(projects.map(p => p.category)).size), l: "مجالات عمل" },
            { n: String(projects.filter(p => p.videoUrl).length), l: "معاينات فيديو" },
            { n: String(projects.filter(p => p.liveUrl).length), l: "مشاريع قابلة للزيارة" },
          ].map((s, i) => (
            <motion.div key={s.l} {...up(0.25 + i * 0.07)}
              className="p-6 rounded-2xl text-center border border-[#4A0E1E]/15 hover:border-[#7A1630]/20 transition-all"
              style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)" }}>
              <div className="text-3xl font-black mb-1" dir="ltr"
                style={{ background:"linear-gradient(135deg,#C9A35F,#8F6A2F)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                {s.n}
              </div>
              <div className="text-sm text-[#2A0913]/65">{s.l}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
