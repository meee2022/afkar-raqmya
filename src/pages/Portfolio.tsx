import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const CATS = ["الكل", "مواقع", "تطبيقات", "هوية", "نظم"];

const STATIC_PROJECTS = [
  { _id: "s1", titleAr: "Adrenaline — مطعم", descriptionAr: "موقع مطعم عصري متكامل بقائمة طعام تفاعلية، نظام حجز طاولات، وعروض ترويجية ديناميكية.", category: "مواقع", result: "تجربة مستخدم فاخرة", imageUrl: null, videoUrl: null, color: "from-orange-600 to-red-900", accent: "#f97316" },
  { _id: "s2", titleAr: "DarkFit — نادي رياضي", descriptionAr: "موقع نادي لياقة بدنية بتصميم داكن وقوي، يشمل برامج التدريب والاشتراكات وحجز الجلسات.", category: "مواقع", result: "↑ 55% اشتراكات جديدة", imageUrl: null, videoUrl: null, color: "from-zinc-700 to-black", accent: "#a3e635" },
  { _id: "s3", titleAr: "Smart Arena — منصة رياضية", descriptionAr: "منصة إدارة رياضية متكاملة تشمل جداول المباريات، ترتيب الفرق، وإحصائيات اللاعبين.", category: "تطبيقات", result: "إدارة شاملة للدوري", imageUrl: null, videoUrl: null, color: "from-green-700 to-emerald-900", accent: "#4ade80" },
  { _id: "s4", titleAr: "ابن تيمية — أكاديمية", descriptionAr: "موقع أكاديمية إسلامية متخصص يعرض المناهج والمحاضرات والتسجيل في الدورات التعليمية.", category: "مواقع", result: "↑ 70% تسجيلات", imageUrl: null, videoUrl: null, color: "from-amber-700 to-yellow-900", accent: "#fbbf24" },
  { _id: "s5", titleAr: "Arirang Bakery — مخبز", descriptionAr: "موقع مخبز كوري-عربي فاخر بعرض المنتجات، الطلبات المسبقة، وهوية بصرية مميزة.", category: "هوية", result: "هوية بصرية متكاملة", imageUrl: null, videoUrl: null, color: "from-pink-600 to-rose-900", accent: "#f472b6" },
  { _id: "s6", titleAr: "العلاهي — مؤسسة أكاديمية", descriptionAr: "موقع مؤسسة تعليمية يضم المناهج والكوادر الأكاديمية وبوابة التسجيل الإلكتروني.", category: "مواقع", result: "بوابة رقمية متكاملة", imageUrl: null, videoUrl: null, color: "from-blue-700 to-indigo-900", accent: "#60a5fa" },
  { _id: "s7", titleAr: "دار ابن الجزري", descriptionAr: "موقع دار علمية إسلامية متخصص في تعليم علوم القرآن والتجويد، بتصميم راقٍ وهوية أصيلة.", category: "مواقع", result: "↑ 3× عدد الطلاب", imageUrl: null, videoUrl: null, color: "from-teal-700 to-cyan-900", accent: "#2dd4bf" },
  { _id: "s8", titleAr: "نظام ERP متكامل", descriptionAr: "نظام إدارة موارد مؤسسية شامل يغطي المخزون، الفواتير، الموارد البشرية، والتقارير التحليلية.", category: "نظم", result: "↑ 80% كفاءة تشغيلية", imageUrl: null, videoUrl: null, color: "from-violet-700 to-purple-900", accent: "#a78bfa" },
];

const ACCENT_COLORS: Record<string, string> = {
  "مواقع": "#fed65b", "تطبيقات": "#4ade80", "هوية": "#f472b6", "نظم": "#a78bfa",
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
}

function VideoLightbox({
  project,
  onClose,
}: {
  project: LightboxProject;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
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
        className="relative z-10 w-full max-w-5xl rounded-3xl overflow-hidden"
        initial={{ scale: 0.88, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 40 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "rgba(5,10,7,0.95)",
          border: `1px solid ${project.accent}30`,
          boxShadow: `0 0 80px ${project.accent}25, 0 40px 120px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-50 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video / Image */}
        <div className="relative" style={{ aspectRatio: "16/9" }}>
          {project.videoUrl ? (
            <video
              ref={videoRef}
              src={project.videoUrl}
              className="w-full h-full object-cover"
              autoPlay
              controls
              playsInline
            />
          ) : project.imageUrl ? (
            <img src={project.imageUrl} alt={project.titleAr} className="w-full h-full object-cover" />
          ) : (
            /* Cinematic placeholder when no media */
            <div className="w-full h-full flex flex-col items-center justify-center gap-6"
              style={{ background: `linear-gradient(135deg, #050a07 0%, ${project.accent}15 50%, #050a07 100%)` }}>
              <div className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: project.accent + "20", border: `2px solid ${project.accent}40`, boxShadow: `0 0 40px ${project.accent}30` }}>
                <svg className="w-10 h-10" style={{ color: project.accent }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-white/40 text-sm">لم يُضف فيديو بعد — يمكنك إضافة رابط الفيديو من لوحة التحكم</p>
            </div>
          )}
          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(5,10,7,0.9), transparent)" }} />
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
            <h2 className="text-xl font-black text-white">{project.titleAr}</h2>
            <p className="text-white/45 text-sm mt-1 leading-relaxed">{project.descriptionAr}</p>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 flex-shrink-0"
            style={{ background: project.accent + "20", color: project.accent, border: `1px solid ${project.accent}40` }}
          >
            إغلاق
          </button>
        </div>

        {/* Top glow bar */}
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: `linear-gradient(90deg,transparent,${project.accent}80,transparent)` }} />
      </motion.div>

      {/* ESC hint */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/25 text-xs"
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
  const accent = (p as any).accent ?? ACCENT_COLORS[p.category] ?? "#fed65b";
  const color = (p as any).color ?? "from-[#003527] to-[#050a07]";

  // Autoplay muted preview on hover
  useEffect(() => {
    const vid = videoPreviewRef.current;
    if (!vid) return;
    if (isHovering) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isHovering]);

  const handleCardClick = () => {
    onOpenLightbox({ ...p, accent } as LightboxProject);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" as const }}
      className="group relative rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/20 hover:-translate-y-2 transition-all duration-500 flex flex-col cursor-pointer"
      style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleCardClick}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 30%,${accent}12 0%,transparent 60%)` }} />

      {/* Media area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
        {/* Muted video preview on hover (if videoUrl) */}
        {p.videoUrl && (
          <video
            ref={videoPreviewRef}
            src={p.videoUrl}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovering ? "opacity-100" : "opacity-0"}`}
            muted
            playsInline
            loop
          />
        )}

        {p.imageUrl ? (
          <>
            <div className="absolute top-0 inset-x-0 z-10 flex items-center gap-1.5 px-3 py-2 bg-[#151515]/90 backdrop-blur-sm border-b border-white/[0.05]">
              <div className="w-2 h-2 rounded-full bg-[#ff5f57]"/>
              <div className="w-2 h-2 rounded-full bg-[#febc2e]"/>
              <div className="w-2 h-2 rounded-full bg-[#28c840]"/>
              <div className="flex-1 mx-2 h-4 rounded bg-white/[0.06] flex items-center px-2">
                <div className="w-1.5 h-1.5 rounded-full mr-1" style={{ background: accent }}/>
                <div className="h-1 w-16 rounded bg-white/15"/>
              </div>
            </div>
            <img src={p.imageUrl} alt={p.titleAr}
              className={`w-full h-full object-cover object-top transition-opacity duration-500 ${p.videoUrl && isHovering ? "opacity-0" : "opacity-100"}`} />
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center relative ${p.videoUrl && isHovering ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}>
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
            <span className="text-white/20 text-xs font-bold relative z-10">لم تُضف صورة بعد</span>
          </div>
        )}

        {/* Play overlay — always shows on hover */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }}>
          <motion.div
            initial={false}
            animate={isHovering ? { scale: 1, opacity: 1 } : { scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", damping: 16, stiffness: 300 }}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: accent + "30",
              border: `2px solid ${accent}60`,
              boxShadow: `0 0 30px ${accent}40`,
              backdropFilter: "blur(8px)",
            }}>
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

        {/* Video badge */}
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

      {/* Info */}
      <div className="relative z-10 p-5 flex-1 flex flex-col">
        <h3 className="font-black text-white mb-1.5 group-hover:text-[#fed65b] transition-colors duration-300">{p.titleAr}</h3>
        <p className="text-white/45 text-sm leading-relaxed mb-4 flex-1">{p.descriptionAr}</p>
        {p.result && (
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: accent + "18" }}>
              <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
              <span className="text-xs font-black" style={{ color: accent }}>{p.result}</span>
            </div>
            <span className="text-white/25 text-xs opacity-0 group-hover:opacity-100 transition-opacity">انقر للمعاينة ←</span>
          </div>
        )}
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg,transparent,${accent}60,transparent)` }} />
    </motion.article>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [filter, setFilter] = useState("الكل");
  const [lightboxProject, setLightboxProject] = useState<LightboxProject | null>(null);
  const convexProjects = useQuery(api.projects.list);

  const projects = convexProjects && convexProjects.length > 0
    ? convexProjects.map(p => ({ ...p, color: undefined }))
    : STATIC_PROJECTS;

  const filtered = filter === "الكل" ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen pt-20" style={{ fontFamily: "'Tajawal','Cairo',sans-serif" }}>

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
          <span className="text-[#fed65b] text-xs font-black tracking-[0.25em] uppercase block mb-4">أعمالنا</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-5">
            مشاريع{" "}
            <span style={{ background:"linear-gradient(135deg,#fed65b,#ffa726)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              نفخر بها
            </span>
          </h1>
          <p className="text-white/50 text-xl max-w-2xl">كل مشروع يمثل التزامنا بالجودة والإبداع والنتائج الحقيقية.</p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div {...up(0.1)} className="flex gap-2 flex-wrap mb-12">
          {CATS.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                filter === c
                  ? "text-[#003527] shadow-lg"
                  : "border border-white/[0.1] text-white/50 hover:border-white/25 hover:text-white"
              }`}
              style={filter === c ? { background: "linear-gradient(135deg,#fed65b,#ffa726)", boxShadow: "0 0 20px rgba(254,214,91,0.3)" } : {}}>
              {c}
            </button>
          ))}
        </motion.div>

        {/* Hint */}
        <motion.p {...up(0.15)} className="text-white/25 text-xs mb-6 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
          انقر على أي مشروع لمعاينته — المشاريع التي تحتوي على فيديو تعرض معاينة عند التحويم
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
          <div className="text-center py-20 text-white/30">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold">لا توجد مشاريع في هذا التصنيف</p>
          </div>
        )}

        {/* Stats strip */}
        <motion.div {...up(0.2)} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: "+50", l: "مشروع منجز" },
            { n: "+30", l: "عميل سعيد" },
            { n: "٦", l: "خدمات متخصصة" },
            { n: "٣+", l: "سنوات خبرة" },
          ].map((s, i) => (
            <motion.div key={s.l} {...up(0.25 + i * 0.07)}
              className="p-6 rounded-2xl text-center border border-white/[0.07] hover:border-[#fed65b]/20 transition-all"
              style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
              <div className="text-3xl font-black mb-1" dir="ltr"
                style={{ background:"linear-gradient(135deg,#fed65b,#ffa726)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                {s.n}
              </div>
              <div className="text-sm text-white/50">{s.l}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
