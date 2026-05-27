import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const MOCK_ACTIVITY = [
  { icon: "edit", text: 'تم تعديل مشروع "منصة تواصل"', user: "أحمد", time: "منذ دقيقة" },
  { icon: "plus", text: 'إضافة خدمة "التحول الرقمي"', user: "سارة", time: "منذ ساعة" },
  { icon: "mail", text: "رسالة جديدة من فيصل القحطاني", user: "النظام", time: "منذ ٣ ساعات" },
  { icon: "settings", text: "تحديث بيانات الاتصال", user: "النظام", time: "أمس" },
];

const STATUS_MAP = {
  new:       { label: "جديد",        cls: "bg-[#fed65b]/15 text-[#fed65b] border border-[#fed65b]/30" },
  contacted: { label: "تم التواصل", cls: "bg-[#4ade80]/15 text-[#4ade80] border border-[#4ade80]/30" },
  closed:    { label: "مغلق",        cls: "bg-white/[0.06] text-white/40 border border-white/10" },
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  content:   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  projects:  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M3 7h4l2-4h6l2 4h4v13H3V7z"/></svg>,
  messages:  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  settings:  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  bell:      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>,
  menu:      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
  plus:      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 5v14M5 12h14"/></svg>,
  edit:      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
  trash:     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>,
  logout:    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>,
  website:   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; accent: string;
}) {
  return (
    <div className="relative rounded-2xl p-5 border border-white/[0.07] hover:border-white/20 transition-all duration-300 group overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)" }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 30%,${accent}10 0%,transparent 60%)` }} />
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: accent + "18", color: accent, border: `1px solid ${accent}30` }}>
          {icon}
        </div>
        {sub && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: accent + "15", color: accent }}>
            {sub}
          </span>
        )}
      </div>
      <div className="relative z-10 text-2xl font-black text-white mb-1" dir="ltr">{value}</div>
      <div className="relative z-10 text-sm text-white/40">{label}</div>
    </div>
  );
}

// ─── Input helper ─────────────────────────────────────────────────────────────
const inputCls = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all"
const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }
function focusIn(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "rgba(254,214,91,0.4)";
  e.currentTarget.style.boxShadow  = "0 0 0 3px rgba(254,214,91,0.06)";
}
function focusOut(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
  e.currentTarget.style.boxShadow  = "none";
}

// ─── Settings Panel ───────────────────────────────────────────────────────────
function SettingsPanel() {
  const saved = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);
  const [form, setForm] = useState({ whatsapp:"", phone:"", email:"", instagramUrl:"", twitterUrl:"" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (saved) setForm({ whatsapp:saved.whatsapp??"", phone:saved.phone??"", email:saved.email??"", instagramUrl:saved.instagramUrl??"", twitterUrl:saved.twitterUrl??"" });
  }, [saved]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true);
    await upsert({ ...form, email:form.email||undefined, instagramUrl:form.instagramUrl||undefined, twitterUrl:form.twitterUrl||undefined });
    setSaving(false); setSuccess(true); setTimeout(()=>setSuccess(false),3000);
  }

  const fields = [
    { id:"whatsapp", label:"رقم واتساب", hint:"97433000000", type:"tel", color:"#25D366" },
    { id:"phone", label:"رقم الهاتف", hint:"+974 33 000 000", type:"tel", color:"#60a5fa" },
    { id:"email", label:"البريد الإلكتروني", hint:"hello@example.com", type:"email", color:"#a78bfa" },
    { id:"instagramUrl", label:"رابط إنستغرام", hint:"https://instagram.com/...", type:"url", color:"#f472b6" },
    { id:"twitterUrl", label:"رابط تويتر / X", hint:"https://x.com/...", type:"url", color:"#60a5fa" },
  ] as const;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-black text-white mb-1">إعدادات الموقع</h2>
        <p className="text-sm text-white/40">التعديلات تظهر فوراً على الموقع بعد الحفظ.</p>
      </div>

      <form onSubmit={handleSave} className="rounded-2xl border border-white/[0.07] p-6 space-y-5"
        style={{ background:"rgba(255,255,255,0.03)", backdropFilter:"blur(10px)" }}>
        {fields.map(f => (
          <div key={f.id}>
            <label className="block text-xs font-bold text-white/50 mb-2">{f.label}</label>
            <input type={f.type} value={(form as any)[f.id]}
              onChange={e => setForm({...form,[f.id]:e.target.value})}
              placeholder={f.hint} dir="ltr"
              className={inputCls} style={inputStyle}
              onFocus={focusIn} onBlur={focusOut} />
          </div>
        ))}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm text-[#003527] disabled:opacity-60 transition-all hover:scale-[1.02]"
            style={{ background:"linear-gradient(135deg,#fed65b,#ffa726)", boxShadow:"0 0 20px rgba(254,214,91,0.3)" }}>
            {saving
              ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7"/></svg>}
            {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
          </button>
          {success && (
            <span className="flex items-center gap-1.5 text-sm font-bold text-[#4ade80]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7"/></svg>
              تم الحفظ!
            </span>
          )}
        </div>
      </form>

      {/* Preview */}
      <div className="mt-5 rounded-2xl border border-white/[0.07] p-5"
        style={{ background:"rgba(255,255,255,0.03)", backdropFilter:"blur(10px)" }}>
        <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">معاينة — كيف سيظهر على الموقع</div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background:"rgba(37,211,102,0.08)", border:"1px solid rgba(37,211,102,0.15)" }}>
            <div className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.1.546 4.072 1.5 5.786L0 24l6.387-1.467A11.951 11.951 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.951 9.951 0 01-5.17-1.4l-.37-.22-3.793.872.938-3.682-.24-.382A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            </div>
            <div>
              <div className="text-xs font-bold text-white">واتساب</div>
              <div className="text-xs text-white/40" dir="ltr">+{form.whatsapp || "—"}</div>
            </div>
          </div>
          {form.email && (
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.15)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:"rgba(167,139,250,0.2)", color:"#a78bfa" }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <div className="text-xs font-bold text-white">البريد</div>
                <div className="text-xs text-white/40">{form.email}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Projects Panel ───────────────────────────────────────────────────────────
const CATS_AR = ["مواقع","تطبيقات","هوية","نظم"];

function ProjectsPanel() {
  const projects = useQuery(api.projects.list);
  const createProject  = useMutation(api.projects.create);
  const updateProject  = useMutation(api.projects.update);
  const removeProject  = useMutation(api.projects.remove);
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);

  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<string|null>(null);
  const [uploading, setUploading] = useState<"image"|"video"|null>(null);
  const [form, setForm] = useState({ titleAr:"", descriptionAr:"", category:"مواقع", result:"", tags:"", imageStorageId:"", videoStorageId:"" });

  function resetForm() { setForm({ titleAr:"",descriptionAr:"",category:"مواقع",result:"",tags:"",imageStorageId:"",videoStorageId:"" }); setEditId(null); setShowForm(false); }

  function startEdit(p: NonNullable<typeof projects>[0]) {
    setForm({ titleAr:p.titleAr,descriptionAr:p.descriptionAr,category:p.category,result:p.result??"",tags:p.tags.join("، "),imageStorageId:(p.imageStorageId as string)??"",videoStorageId:(p.videoStorageId as string)??"" });
    setEditId(p._id); setShowForm(true);
  }

  async function uploadFile(file: File, type: "image"|"video") {
    setUploading(type);
    try {
      const url = await generateUploadUrl();
      const res = await fetch(url, { method:"POST", headers:{"Content-Type":file.type}, body:file });
      const { storageId } = await res.json();
      setForm(f => ({ ...f, [type==="image"?"imageStorageId":"videoStorageId"]: storageId }));
    } finally { setUploading(null); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const data = { titleAr:form.titleAr, descriptionAr:form.descriptionAr, category:form.category, result:form.result||undefined, tags:form.tags?form.tags.split(/[,،]/).map(t=>t.trim()).filter(Boolean):[], imageStorageId:(form.imageStorageId as any)||undefined, videoStorageId:(form.videoStorageId as any)||undefined };
    if (editId) { await updateProject({id:editId as any,...data}); }
    else { await createProject({...data, sortOrder:(projects?.length??0)+1}); }
    resetForm();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white mb-1">إدارة المشاريع</h2>
          <p className="text-sm text-white/40">{projects?.length??0} مشروع في الأعمال</p>
        </div>
        <button onClick={()=>setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm text-[#003527] hover:scale-[1.02] transition-all"
          style={{ background:"linear-gradient(135deg,#fed65b,#ffa726)", boxShadow:"0 0 15px rgba(254,214,91,0.25)" }}>
          {Icons.plus} إضافة مشروع
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl border border-white/[0.07] p-6 mb-6"
          style={{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(10px)" }}>
          <h3 className="font-black text-white mb-5">{editId?"تعديل المشروع":"مشروع جديد"}</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/50 mb-1.5">اسم المشروع *</label>
                <input required value={form.titleAr} onChange={e=>setForm(f=>({...f,titleAr:e.target.value}))} placeholder="Adrenaline — مطعم"
                  className={inputCls} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 mb-1.5">التصنيف</label>
                <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
                  className={inputCls} style={{ ...inputStyle, background:"rgba(255,255,255,0.06)" }}
                  onFocus={focusIn} onBlur={focusOut}>
                  {CATS_AR.map(c=><option key={c} className="bg-[#0d1a0f]">{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 mb-1.5">وصف قصير *</label>
              <textarea required rows={2} value={form.descriptionAr} onChange={e=>setForm(f=>({...f,descriptionAr:e.target.value}))} placeholder="وصف قصير عن المشروع..."
                className={inputCls+" resize-none"} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-white/50 mb-1.5">النتيجة (اختياري)</label>
                <input value={form.result} onChange={e=>setForm(f=>({...f,result:e.target.value}))} placeholder="↑ 55% اشتراكات"
                  className={inputCls} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 mb-1.5">الوسوم (مفصولة بفاصلة)</label>
                <input value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} placeholder="React, Figma" dir="ltr"
                  className={inputCls} style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
              </div>
            </div>

            {/* Uploads */}
            <div className="grid md:grid-cols-2 gap-4">
              {(["image","video"] as const).map(type => {
                const stored = type==="image" ? form.imageStorageId : form.videoStorageId;
                const isUploading = uploading===type;
                return (
                  <div key={type}>
                    <label className="block text-xs font-bold text-white/50 mb-1.5">
                      {type==="image" ? "صورة المشروع (screenshot)" : "فيديو المشروع (اختياري)"}
                    </label>
                    <label className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                      stored ? "border-[#4ade80]/50" : "border-white/10 hover:border-[#fed65b]/40"
                    }`} style={{ background: stored ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,0.02)" }}>
                      <input type="file" accept={type==="image"?"image/*":"video/*"} className="hidden"
                        onChange={e=>e.target.files?.[0]&&uploadFile(e.target.files[0],type)} />
                      {isUploading ? (
                        <><svg className="w-4 h-4 animate-spin text-[#fed65b]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg><span className="text-xs text-white/50">جاري الرفع...</span></>
                      ) : stored ? (
                        <><svg className="w-4 h-4 text-[#4ade80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 13l4 4L19 7"/></svg><span className="text-xs text-[#4ade80] font-bold">تم الرفع ✓</span></>
                      ) : (
                        <><svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg><span className="text-xs text-white/30">اختر {type==="image"?"PNG/JPG":"MP4"}</span></>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit"
                className="px-5 py-2.5 rounded-xl font-black text-sm text-[#003527] hover:scale-[1.02] transition-all"
                style={{ background:"linear-gradient(135deg,#fed65b,#ffa726)" }}>
                {editId?"حفظ التعديلات":"إضافة المشروع"}
              </button>
              <button type="button" onClick={resetForm}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-white/50 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {(projects??[]).map(p => (
          <div key={p._id} className="group rounded-2xl border border-white/[0.07] hover:border-white/20 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{ background:"rgba(255,255,255,0.03)", backdropFilter:"blur(10px)" }}>
            <div className="relative bg-white/[0.03]" style={{ aspectRatio:"16/9" }}>
              {p.imageUrl
                ? <img src={p.imageUrl} alt={p.titleAr} className="w-full h-full object-cover object-top"/>
                : <div className="w-full h-full flex items-center justify-center text-white/20 text-xs">لا توجد صورة</div>
              }
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background:"rgba(254,214,91,0.2)", color:"#fed65b", border:"1px solid rgba(254,214,91,0.3)" }}>
                {p.category}
              </span>
              {p.videoUrl && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/50 text-white flex items-center gap-1">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>فيديو
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-black text-white text-sm mb-1">{p.titleAr}</h3>
              <p className="text-xs text-white/35 line-clamp-2 mb-3">{p.descriptionAr}</p>
              <div className="flex gap-2">
                <button onClick={()=>startEdit(p)}
                  className="flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-white/10 text-white/50 hover:border-[#fed65b]/40 hover:text-[#fed65b] transition-all">
                  {Icons.edit} تعديل
                </button>
                <button onClick={()=>removeProject({id:p._id})}
                  className="py-2 px-3 rounded-lg text-xs font-bold border border-white/10 text-white/30 hover:border-red-500/40 hover:text-red-400 transition-all">
                  {Icons.trash}
                </button>
              </div>
            </div>
          </div>
        ))}
        {projects?.length===0 && (
          <div className="md:col-span-3 text-center py-16 text-white/25">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="M3 7h4l2-4h6l2 4h4v13H3V7z"/></svg>
            لا توجد مشاريع بعد — أضف أول مشروع
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Admin() {
  const [activeNav, setActiveNav]         = useState("dashboard");
  const [sidebarOpen, setSidebarOpen]     = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);

  const inquiries = useQuery(api.contact.list) ?? [];
  const updateStatusMutation = useMutation(api.contact.updateStatus);
  const newCount = inquiries.filter((i: any) => i.status === "new").length;

  const navItems = [
    { id:"dashboard", label:"لوحة التحكم", icon:Icons.dashboard },
    { id:"projects",  label:"المشاريع",    icon:Icons.projects },
    { id:"messages",  label:"الرسائل",     icon:Icons.messages, badge:newCount||undefined },
    { id:"settings",  label:"الإعدادات",   icon:Icons.settings },
  ];

  async function updateStatus(id: string, status: "new"|"contacted"|"closed") {
    await updateStatusMutation({ id:id as any, status });
    if (selectedInquiry?._id===id) setSelectedInquiry((prev:any)=>prev?{...prev,status}:null);
  }

  return (
    <div className="min-h-screen flex" dir="rtl" style={{ fontFamily:"'Tajawal','Cairo',sans-serif" }}>

      {/* Global bg (same as site) */}
      <style>{`
        @keyframes adminBg { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .admin-bg { background-size:200% 200%; animation:adminBg 8s ease infinite; }
      `}</style>
      <div className="fixed inset-0 z-0 pointer-events-none admin-bg"
        style={{ background:"linear-gradient(135deg,#050a07 0%,#003527 30%,#001a14 60%,#050a07 100%)" }} />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background:"radial-gradient(circle,rgba(254,214,91,0.1) 0%,transparent 70%)", animation:"adminBg 4s ease-in-out infinite" }} />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ background:"radial-gradient(circle,rgba(0,53,39,0.35) 0%,transparent 70%)" }} />
      </div>

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <aside className={`${sidebarOpen?"w-64":"w-20"} flex-shrink-0 flex flex-col transition-all duration-300 fixed inset-y-0 right-0 z-30 border-l border-white/[0.07]`}
        style={{ background:"rgba(5,10,7,0.85)", backdropFilter:"blur(20px)" }}>

        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-white/[0.07]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background:"linear-gradient(135deg,#fed65b,#ffa726)", boxShadow:"0 0 15px rgba(254,214,91,0.3)" }}>
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" fill="#003527"/>
              </svg>
            </div>
            {sidebarOpen && (
              <div>
                <div className="font-black text-white text-sm leading-tight">أفكار رقمية</div>
                <div className="text-[10px] text-white/30">لوحة الإدارة</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={()=>setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group relative ${
                activeNav===item.id ? "text-[#003527]" : "text-white/40 hover:text-white hover:bg-white/[0.05]"
              }`}
              style={activeNav===item.id ? { background:"linear-gradient(135deg,#fed65b,#ffa726)", boxShadow:"0 0 15px rgba(254,214,91,0.25)" } : {}}>
              <span className={`flex-shrink-0 ${activeNav===item.id?"text-[#003527]":""}`}>{item.icon}</span>
              {sidebarOpen && <span className="flex-1 text-right">{item.label}</span>}
              {sidebarOpen && item.badge ? (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-white/[0.07] space-y-1">
          <a href="/" target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/40 hover:text-white hover:bg-white/[0.05] transition-all">
            <span className="flex-shrink-0">{Icons.website}</span>
            {sidebarOpen && <span>عرض الموقع</span>}
          </a>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400/60 hover:text-red-400 hover:bg-red-500/[0.06] transition-all">
            <span className="flex-shrink-0">{Icons.logout}</span>
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      <div className={`relative z-10 flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen?"mr-64":"mr-20"}`}>

        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-20 border-b border-white/[0.07]"
          style={{ background:"rgba(5,10,7,0.85)", backdropFilter:"blur(20px)" }}>
          <div className="flex items-center gap-3">
            <button onClick={()=>setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
              {Icons.menu}
            </button>
            <div>
              <h1 className="font-black text-white text-sm">لوحة التحكم</h1>
              <p className="text-xs text-white/30">أفكار رقمية — الإدارة</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
              {Icons.bell}
              {newCount>0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-[#050a07]"/>}
            </button>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-white/[0.07]"
              style={{ background:"rgba(255,255,255,0.04)" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-[#003527]"
                style={{ background:"linear-gradient(135deg,#fed65b,#ffa726)" }}>أ</div>
              <span className="text-sm font-semibold text-white/80">أحمد</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">

          {activeNav==="settings" && <SettingsPanel />}
          {activeNav==="projects" && <ProjectsPanel />}

          {(activeNav==="dashboard"||activeNav==="messages") && <>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="إجمالي الاستفسارات" value={String(inquiries.length)} accent="#60a5fa"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}/>
            <StatCard label="استفسارات جديدة" value={String(newCount)} sub={newCount>0?"تحتاج رد":"لا يوجد جديد"} accent="#f87171"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>}/>
            <StatCard label="تم التواصل" value={String(inquiries.filter((i:any)=>i.status==="contacted").length)} accent="#4ade80"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M5 13l4 4L19 7"/></svg>}/>
            <StatCard label="مغلقة" value={String(inquiries.filter((i:any)=>i.status==="closed").length)} accent="#a78bfa"
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}/>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">

            {/* Inquiries */}
            <div className="lg:col-span-2 rounded-2xl border border-white/[0.07] overflow-hidden"
              style={{ background:"rgba(255,255,255,0.03)", backdropFilter:"blur(10px)" }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <h2 className="font-black text-white text-sm">الاستفسارات</h2>
                <span className="text-xs text-white/30">{inquiries.length} رسالة</span>
              </div>
              {inquiries.length===0 ? (
                <div className="py-16 text-center text-white/20 text-sm">لا توجد استفسارات بعد</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background:"rgba(255,255,255,0.02)" }}>
                        <th className="text-right px-5 py-3 text-xs font-bold text-white/30">الاسم</th>
                        <th className="text-right px-5 py-3 text-xs font-bold text-white/30">الخدمة</th>
                        <th className="text-right px-5 py-3 text-xs font-bold text-white/30">الحالة</th>
                        <th className="text-right px-5 py-3 text-xs font-bold text-white/30">التاريخ</th>
                        <th className="px-5 py-3"/>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {inquiries.map((inq:any) => (
                        <tr key={inq._id}
                          className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                          onClick={()=>setSelectedInquiry(selectedInquiry?._id===inq._id?null:inq)}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 text-[#003527]"
                                style={{ background:"linear-gradient(135deg,#fed65b,#ffa726)" }}>
                                {inq.name.charAt(0)}
                              </div>
                              <span className="font-semibold text-white/80 text-xs">{inq.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-white/40">{inq.service??"—"}</td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_MAP[inq.status as keyof typeof STATUS_MAP].cls}`}>
                              {STATUS_MAP[inq.status as keyof typeof STATUS_MAP].label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-white/30">{new Date(inq.createdAt).toLocaleDateString("ar-QA")}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1" onClick={e=>e.stopPropagation()}>
                              <button onClick={()=>updateStatus(inq._id,"contacted")}
                                className="p-1.5 rounded-lg text-white/30 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-colors">{Icons.edit}</button>
                              <button onClick={()=>updateStatus(inq._id,"closed")}
                                className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">{Icons.trash}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedInquiry && (
                <div className="border-t border-white/[0.07] px-6 py-4" style={{ background:"rgba(255,255,255,0.02)" }}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-black text-white text-sm">{selectedInquiry.name}</h3>
                    <button onClick={()=>setSelectedInquiry(null)} className="text-white/30 hover:text-white transition-colors">✕</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div><span className="text-white/30">الخدمة: </span><span className="font-semibold text-white/70">{selectedInquiry.service??"—"}</span></div>
                    <div><span className="text-white/30">الجوال: </span><span className="font-semibold text-white/70" dir="ltr">{selectedInquiry.phone}</span></div>
                    <div><span className="text-white/30">التاريخ: </span><span className="font-semibold text-white/70">{new Date(selectedInquiry.createdAt).toLocaleDateString("ar-QA")}</span></div>
                  </div>
                  {selectedInquiry.message && (
                    <p className="text-xs text-white/50 rounded-xl p-3 mb-3 leading-relaxed border border-white/[0.06]"
                      style={{ background:"rgba(255,255,255,0.03)" }}>{selectedInquiry.message}</p>
                  )}
                  <div className="flex gap-2">
                    <a href={`https://wa.me/${selectedInquiry.phone.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#1da554] transition-colors">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/></svg>
                      واتساب
                    </a>
                    <button onClick={()=>updateStatus(selectedInquiry._id,"contacted")}
                      className="px-3 py-2 rounded-xl text-xs font-bold border border-[#4ade80]/30 text-[#4ade80] hover:bg-[#4ade80]/10 transition-colors">
                      تم التواصل
                    </button>
                    <button onClick={()=>updateStatus(selectedInquiry._id,"closed")}
                      className="px-3 py-2 rounded-xl text-xs font-bold border border-white/10 text-white/40 hover:border-white/20 hover:text-white/60 transition-colors">
                      إغلاق
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="rounded-2xl border border-white/[0.07] p-5"
                style={{ background:"rgba(255,255,255,0.03)", backdropFilter:"blur(10px)" }}>
                <h2 className="font-black text-white text-sm mb-4">إجراءات سريعة</h2>
                <div className="space-y-2">
                  <button onClick={()=>setActiveNav("projects")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-[#003527] hover:scale-[1.01] transition-all"
                    style={{ background:"linear-gradient(135deg,#fed65b,#ffa726)" }}>
                    {Icons.plus} إضافة مشروع جديد
                  </button>
                  <button onClick={()=>setActiveNav("settings")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-white/60 border border-white/[0.07] hover:border-white/20 hover:text-white transition-all">
                    {Icons.settings} تحديث الإعدادات
                  </button>
                  <button onClick={()=>setActiveNav("messages")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-white/60 border border-white/[0.07] hover:border-white/20 hover:text-white transition-all">
                    {Icons.messages} عرض الرسائل
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-2xl border border-white/[0.07] p-5"
                style={{ background:"rgba(255,255,255,0.03)", backdropFilter:"blur(10px)" }}>
                <h2 className="font-black text-white text-sm mb-4">النشاط الأخير</h2>
                <div className="space-y-4">
                  {MOCK_ACTIVITY.map((a,i)=>(
                    <div key={i} className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[#fed65b]"
                        style={{ background:"rgba(254,214,91,0.1)" }}>
                        {a.icon==="edit"?Icons.edit:a.icon==="plus"?Icons.plus:a.icon==="mail"?Icons.messages:Icons.settings}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/70 leading-relaxed font-medium">{a.text}</p>
                        <p className="text-[10px] text-white/25 mt-0.5">{a.time} · {a.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="rounded-2xl border border-[#fed65b]/15 p-5 relative overflow-hidden"
                style={{ background:"linear-gradient(135deg,rgba(0,53,39,0.6),rgba(5,10,7,0.8))" }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background:"radial-gradient(ellipse at 50% 0%,rgba(254,214,91,0.08) 0%,transparent 60%)" }} />
                <div className="relative z-10">
                  <div className="text-xs font-bold text-white/40 mb-1">الاستفسارات هذا الأسبوع</div>
                  <div className="text-3xl font-black text-white mb-4">{inquiries.length}</div>
                  <div className="flex items-end gap-1.5 h-12">
                    {[4,7,3,9,5,8,6].map((h,i)=>(
                      <div key={i} className="flex-1 rounded-sm transition-colors"
                        style={{ height:`${h*10}%`, background:`rgba(254,214,91,${0.15+i*0.04})` }}/>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-white/25">
                    {["أ","ث","ث","خ","ج","س","ح"].map((d,i)=><span key={i}>{d}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>}
        </main>
      </div>
    </div>
  );
}
