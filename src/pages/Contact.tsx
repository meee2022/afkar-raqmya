import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSettings } from "../hooks/useSettings";

const SERVICES = [
  "تصميم وتطوير المواقع", "تطبيقات الجوال", "العروض التقديمية",
  "الفيديو الترويجي", "الدعوات الرقمية", "الهوية البصرية", "باقة متكاملة", "أخرى",
];

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export default function Contact() {
  const settings = useSettings();
  const submitContact = useMutation(api.contact.submit);
  const [form, setForm] = useState({ name: "", phone: "", service: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;
    setLoading(true);
    try {
      await submitContact({
        name: form.name,
        phone: form.phone,
        service: form.service || undefined,
        message: form.message,
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20" style={{ fontFamily: "'Tajawal','Cairo',sans-serif" }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <motion.div {...up()} className="mb-16 max-w-2xl">
          <span className="text-[#fed65b] text-xs font-black tracking-[0.25em] uppercase block mb-4">تواصل معنا</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-5">
            ابدأ مشروعك{" "}
            <span style={{ background:"linear-gradient(135deg,#fed65b,#ffa726)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              اليوم
            </span>
          </h1>
          <p className="text-white/50 text-xl leading-relaxed">هل لديك فكرة؟ شاركنا بها ونحن نتولى الباقي. نرد خلال 24 ساعة.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* Left: Contact Info */}
          <div className="space-y-4">
            {/* WhatsApp */}
            <motion.a {...up(0.1)}
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-5 p-6 rounded-2xl border border-white/[0.07] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 30% 50%,rgba(37,211,102,0.08) 0%,transparent 60%)" }} />
              <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#25D366", boxShadow: "0 0 20px rgba(37,211,102,0.3)" }}>
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.546 4.072 1.5 5.786L0 24l6.387-1.467A11.951 11.951 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.951 9.951 0 01-5.17-1.4l-.37-.22-3.793.872.938-3.682-.24-.382A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
              </div>
              <div className="relative z-10 flex-1">
                <div className="font-black text-white mb-0.5">واتساب</div>
                <div className="text-white/50 text-sm" dir="ltr">+{settings.whatsapp}</div>
              </div>
              <svg className="relative z-10 w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:-translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </motion.a>

            {/* Email */}
            <motion.a {...up(0.15)}
              href={`mailto:${settings.email}`}
              className="flex items-center gap-5 p-6 rounded-2xl border border-white/[0.07] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 30% 50%,rgba(96,165,250,0.08) 0%,transparent 60%)" }} />
              <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.25)", color: "#60a5fa" }}>
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div className="relative z-10 flex-1">
                <div className="font-black text-white mb-0.5">البريد الإلكتروني</div>
                <div className="text-white/50 text-sm">{settings.email}</div>
              </div>
              <svg className="relative z-10 w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:-translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </motion.a>

            {/* Hours */}
            <motion.div {...up(0.2)}
              className="p-6 rounded-2xl border border-white/[0.07]"
              style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(254,214,91,0.15)", color: "#fed65b" }}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <span className="text-xs font-black text-white/40 uppercase tracking-widest">ساعات العمل</span>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { days: "الأحد — الخميس", hours: "9:00 — 17:00", active: true },
                  { days: "السبت", hours: "10:00 — 14:00", active: true },
                  { days: "الجمعة", hours: "مغلق", active: false },
                ].map(r => (
                  <div key={r.days} className="flex items-center justify-between">
                    <span className="text-white/50">{r.days}</span>
                    <span className={`font-semibold text-xs px-2.5 py-1 rounded-full ${
                      r.active ? "text-[#4ade80]" : "text-white/25"
                    }`} style={r.active ? { background: "rgba(74,222,128,0.1)" } : {}}>
                      {r.hours}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Location */}
            <motion.div {...up(0.25)}
              className="p-6 rounded-2xl border border-white/[0.07] flex items-center gap-4"
              style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(10px)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(254,214,91,0.12)", color: "#fed65b", border: "1px solid rgba(254,214,91,0.2)" }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
              </div>
              <div>
                <div className="font-black text-white mb-0.5 text-sm">الموقع</div>
                <div className="text-white/40 text-sm">الدوحة، قطر 🇶🇦</div>
              </div>
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div {...up(0.12)}
            className="rounded-3xl border border-white/[0.07] p-8 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 80% 20%,rgba(254,214,91,0.04) 0%,transparent 60%)" }} />

            {sent ? (
              <div className="relative z-10 text-center py-16">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "rgba(74,222,128,0.15)", border: "2px solid rgba(74,222,128,0.3)" }}>
                  <svg className="w-10 h-10 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7"/></svg>
                </motion.div>
                <h3 className="text-2xl font-black text-white mb-2">تم إرسال رسالتك! ✦</h3>
                <p className="text-white/50 mb-8">سنتواصل معك خلال 24 ساعة.</p>
                <button onClick={() => { setSent(false); setForm({ name:"", phone:"", service:"", message:"" }); }}
                  className="text-sm font-bold px-6 py-2.5 rounded-full border border-[#fed65b]/30 text-[#fed65b] hover:bg-[#fed65b]/10 transition-all">
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10">
                <h2 className="text-xl font-black text-white mb-6">أرسل لنا رسالة</h2>
                <div className="space-y-4">
                  {/* Name + Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { id:"name", label:"الاسم", type:"text", ph:"اسمك الكريم", req:true },
                      { id:"phone", label:"رقم الجوال", type:"tel", ph:"+974 XXXX XXXX", req:true },
                    ].map(f => (
                      <div key={f.id}>
                        <label htmlFor={f.id} className="block text-xs font-bold text-white/50 mb-2">
                          {f.label} {f.req && <span className="text-[#fed65b]">*</span>}
                        </label>
                        <input id={f.id} type={f.type} required={f.req} placeholder={f.ph}
                          value={(form as any)[f.id]}
                          onChange={e => setForm({...form, [f.id]: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder:text-white/20 transition-all outline-none"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                          onFocus={e => { e.currentTarget.style.borderColor = "rgba(254,214,91,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(254,214,91,0.06)"; }}
                          onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Service */}
                  <div>
                    <label htmlFor="service" className="block text-xs font-bold text-white/50 mb-2">الخدمة المطلوبة</label>
                    <select id="service" value={form.service} onChange={e => setForm({...form, service: e.target.value})}
                      className="w-full px-4 py-3.5 rounded-xl text-sm text-white transition-all outline-none"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}>
                      <option value="" className="bg-[#0a1208]">اختر الخدمة...</option>
                      {SERVICES.map(s => <option key={s} value={s} className="bg-[#0a1208]">{s}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-white/50 mb-2">
                      رسالتك <span className="text-[#fed65b]">*</span>
                    </label>
                    <textarea id="message" required rows={5}
                      placeholder="اكتب لنا فكرتك أو ما تحتاجه بالتفصيل..."
                      value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                      className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder:text-white/20 transition-all outline-none resize-none"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = "rgba(254,214,91,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(254,214,91,0.06)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={loading}
                    className="w-full py-4 rounded-2xl font-black text-sm disabled:opacity-60 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg,#fed65b,#ffa726)", color: "#003527", boxShadow: "0 0 30px rgba(254,214,91,0.3)" }}>
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>إرسال الرسالة ✦</>
                    )}
                  </button>

                  <p className="text-center text-xs text-white/25">نرد عادةً خلال أقل من 24 ساعة</p>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
