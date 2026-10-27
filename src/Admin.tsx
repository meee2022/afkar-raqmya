import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import DocumentsPanel from "./admin/DocumentsPanel";
import WebsiteRegistry from "./admin/WebsiteRegistry";
import { useSearchParams } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Search, X } from "lucide-react";
import { ConvexError } from "convex/values";
import "./admin/admin.css";

const STATUS_MAP = {
  new: {
    label: "جديد",
    cls: "bg-[#EBDDC6]/15 text-[var(--admin-accent)] border border-[#EBDDC6]/30",
  },
  contacted: {
    label: "تم التواصل",
    cls: "bg-[#26724c]/15 text-[#26724c] border border-[#26724c]/30",
  },
  closed: {
    label: "مغلق",
    cls: "bg-[var(--admin-subtle)] text-[var(--admin-muted)] border border-[var(--admin-line)]",
  },
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  content: (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  projects: (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path d="M3 7h4l2-4h6l2 4h4v13H3V7z" />
    </svg>
  ),
  messages: (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  settings: (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  bell: (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  menu: (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  plus: (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  edit: (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  trash: (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  ),
  logout: (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  website: (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  ),
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="admin-stat">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="admin-stat-icon" aria-hidden="true">
          {icon}
        </span>
        {sub && (
          <span className="text-xs text-[var(--admin-muted)]">{sub}</span>
        )}
      </div>
      <div className="admin-stat-value" dir="ltr">
        {value}
      </div>
      <div className="admin-stat-label">{label}</div>
    </div>
  );
}

// ─── Input helper ─────────────────────────────────────────────────────────────
const inputCls =
  "w-full px-4 py-3 rounded-xl text-sm text-[var(--admin-ink)] placeholder:text-[var(--admin-muted)] outline-none transition-colors";
const inputStyle = {
  background: "var(--admin-surface)",
  border: "1px solid var(--admin-input-line)",
};
function focusIn(
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
) {
  e.currentTarget.style.borderColor = "var(--admin-accent)";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(122,22,48,0.1)";
}
function focusOut(
  e: React.FocusEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
) {
  e.currentTarget.style.borderColor = "var(--admin-input-line)";
  e.currentTarget.style.boxShadow = "none";
}

// ─── Settings Panel ───────────────────────────────────────────────────────────
function SettingsPanel({ token }: { token: string }) {
  const saved = useQuery(api.settings.get);
  const upsert = useMutation(api.settings.upsert);
  const [form, setForm] = useState({
    whatsapp: "",
    phone: "",
    email: "",
    instagramUrl: "",
    twitterUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  useEffect(() => {
    if (saved)
      setForm({
        whatsapp: saved.whatsapp ?? "",
        phone: saved.phone ?? "",
        email: saved.email ?? "",
        instagramUrl: saved.instagramUrl ?? "",
        twitterUrl: saved.twitterUrl ?? "",
      });
  }, [saved]);
  const fields = [
    { id: "whatsapp", label: "رقم واتساب", hint: "97433000000", type: "tel" },
    { id: "phone", label: "رقم الهاتف", hint: "+974 3300 0000", type: "tel" },
    {
      id: "email",
      label: "بريد التواصل العام",
      hint: "hello@example.com",
      type: "email",
    },
    {
      id: "instagramUrl",
      label: "رابط إنستغرام",
      hint: "https://instagram.com/…",
      type: "url",
    },
    { id: "twitterUrl", label: "رابط X", hint: "https://x.com/…", type: "url" },
  ] as const;
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (saving || saved === undefined) return;
    setSaving(true);
    setSaveError("");
    setSuccess(false);
    try {
      await upsert({ token, ...form });
      setSuccess(true);
    } catch {
      setSaveError("تعذّر الحفظ. راجع البيانات واتصالك ثم حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <section
      className="admin-section admin-settings"
      aria-labelledby="settings-title"
    >
      <div className="admin-section-heading">
        <div>
          <h2 id="settings-title">إعدادات الموقع</h2>
          <p>بيانات التواصل التي تظهر للزوار. التغييرات تظهر بعد الحفظ.</p>
        </div>
      </div>
      {saved === undefined ? (
        <div className="admin-panel admin-empty" role="status">
          جارٍ تحميل الإعدادات…
        </div>
      ) : (
        <div className="admin-settings-layout">
          <form
            onSubmit={handleSave}
            className="admin-panel admin-form"
            aria-busy={saving}
          >
            {[
              { title: "بيانات التواصل", items: fields.slice(0, 3) },
              { title: "حسابات التواصل الاجتماعي", items: fields.slice(3) },
            ].map((group) => (
              <fieldset className="admin-fieldset" key={group.title}>
                <legend>{group.title}</legend>
                <div className="admin-form-grid">
                  {group.items.map((f) => (
                    <label className="admin-field" key={f.id}>
                      <span>{f.label}</span>
                      <input
                        name={f.id}
                        type={f.type}
                        value={form[f.id]}
                        onChange={(e) => {
                          setForm({ ...form, [f.id]: e.target.value });
                          setSuccess(false);
                        }}
                        placeholder={f.hint}
                        dir="ltr"
                        autoComplete="off"
                        spellCheck={false}
                        className={inputCls}
                        style={inputStyle}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
            <p className="admin-form-hint">
              هذه بيانات التواصل العامة، ولا تغيّر بريد تسجيل دخول الإدارة.
            </p>
            {saveError && (
              <p className="admin-feedback admin-feedback-error" role="alert">
                {saveError}
              </p>
            )}
            <div className="admin-form-actions">
              <button
                type="submit"
                disabled={saving}
                className="admin-button admin-button-primary"
              >
                {saving ? "جارٍ الحفظ…" : "حفظ الإعدادات"}
              </button>
              {success && (
                <p role="status" className="admin-success">
                  تم حفظ الإعدادات.
                </p>
              )}
            </div>
          </form>
          <aside
            className="admin-panel admin-settings-preview"
            aria-label="معاينة بيانات التواصل"
          >
            <h3>معاينة بيانات التواصل</h3>
            <p>راجع الأرقام والروابط قبل الحفظ.</p>
            <dl>
              {fields.map((f) => (
                <div key={f.id}>
                  <dt>{f.label}</dt>
                  <dd>
                    <bdi>{form[f.id] || "لم يُحدد"}</bdi>
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      )}
    </section>
  );
}

// ─── Projects Panel ───────────────────────────────────────────────────────────
const CATS_AR = ["مواقع", "تطبيقات", "هوية", "نظم"];

function ProjectsPanel({ token }: { token: string }) {
  const projects = useQuery(api.projects.listAll, { token });
  const [projectSearch, setProjectSearch] = useState("");
  const [projectCategory, setProjectCategory] = useState("all");
  const [projectVisibility, setProjectVisibility] = useState("all");
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const removeProject = useMutation(api.projects.remove);
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<"image" | "video" | null>(null);
  const [projectError, setProjectError] = useState("");
  const [savingProject, setSavingProject] = useState(false);
  const emptyProject = {
    titleAr: "",
    descriptionAr: "",
    category: "مواقع",
    result: "",
    tags: "",
    imageStorageId: "",
    videoStorageId: "",
    liveUrl: "",
    challenge: "",
    solution: "",
    outcome: "",
    role: "",
    duration: "",
    featured: false,
  };
  const [form, setForm] = useState(emptyProject);

  function resetForm() {
    setForm(emptyProject);
    setEditId(null);
    setShowForm(false);
  }

  function startEdit(p: NonNullable<typeof projects>[0]) {
    setForm({
      titleAr: p.titleAr,
      descriptionAr: p.descriptionAr,
      category: p.category,
      result: p.result ?? "",
      tags: p.tags.join("، "),
      imageStorageId: (p.imageStorageId as string) ?? "",
      videoStorageId: (p.videoStorageId as string) ?? "",
      liveUrl: p.liveUrl ?? "",
      challenge: p.challenge ?? "",
      solution: p.solution ?? "",
      outcome: p.outcome ?? "",
      role: p.role ?? "",
      duration: p.duration ?? "",
      featured: p.featured ?? false,
    });
    setEditId(p._id);
    setShowForm(true);
  }

  async function uploadFile(file: File, type: "image" | "video") {
    setProjectError("");
    const allowed =
      type === "image"
        ? ["image/jpeg", "image/png", "image/webp", "image/avif"]
        : ["video/mp4", "video/webm"];
    if (
      !allowed.includes(file.type) ||
      file.size > (type === "image" ? 10 : 50) * 1024 * 1024
    ) {
      setProjectError(
        type === "image"
          ? "ارفع صورة JPG أو PNG أو WebP أو AVIF، حتى 10 ميجابايت."
          : "ارفع فيديو MP4 أو WebM، حتى 50 ميجابايت.",
      );
      return;
    }
    setUploading(type);
    try {
      const url = await generateUploadUrl({ token });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("upload failed");
      const { storageId } = await res.json();
      if (!storageId) throw new Error("missing upload id");
      setForm((f) => ({
        ...f,
        [type === "image" ? "imageStorageId" : "videoStorageId"]: storageId,
      }));
    } catch {
      setProjectError("تعذّر رفع الملف. راجع الاتصال وحاول مرة أخرى.");
    } finally {
      setUploading(null);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (savingProject || uploading) return;
    setSavingProject(true);
    setProjectError("");
    const data = {
      titleAr: form.titleAr,
      descriptionAr: form.descriptionAr,
      category: form.category,
      result: form.result || undefined,
      tags: form.tags
        ? form.tags
            .split(/[,،]/)
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      imageStorageId: (form.imageStorageId as any) || undefined,
      videoStorageId: (form.videoStorageId as any) || undefined,
      liveUrl: form.liveUrl || undefined,
      challenge: form.challenge || undefined,
      solution: form.solution || undefined,
      outcome: form.outcome || undefined,
      role: form.role || undefined,
      duration: form.duration || undefined,
      featured: form.featured,
    };
    try {
      if (editId) {
        await updateProject({
          token,
          id: editId as any,
          ...data,
          liveUrl: form.liveUrl,
        });
      } else {
        await createProject({
          token,
          ...data,
          sortOrder:
            Math.max(0, ...(projects ?? []).map((p) => p.sortOrder)) + 1,
        });
      }
      resetForm();
    } catch {
      setProjectError("تعذّر حفظ المشروع. راجع البيانات وحاول مرة أخرى.");
    } finally {
      setSavingProject(false);
    }
  }

  async function toggleArchive(p: NonNullable<typeof projects>[0]) {
    setProjectError("");
    try {
      if (p.isActive) await removeProject({ token, id: p._id });
      else await updateProject({ token, id: p._id, isActive: true });
    } catch {
      setProjectError("تعذّر تغيير ظهور المشروع. حاول مرة أخرى.");
    }
  }

  const visibleProjects = (projects ?? []).filter(
    (p) =>
      (projectCategory === "all" || p.category === projectCategory) &&
      (projectVisibility === "all" ||
        p.isActive === (projectVisibility === "active")) &&
      [p.titleAr, p.descriptionAr, ...p.tags]
        .join(" ")
        .toLocaleLowerCase("ar")
        .includes(projectSearch.trim().toLocaleLowerCase("ar")),
  );

  return (
    <section className="admin-section" aria-labelledby="projects-title">
      <div className="admin-section-heading">
        <div>
          <h2 id="projects-title">إدارة المشاريع</h2>
          <p className="text-sm text-[var(--admin-muted)]">
            {projects ? projects.length : "—"} مشروع —{" "}
            {projects
              ? projects.filter((p) => p.isActive && (p.imageUrl || p.videoUrl))
                  .length
              : "—"}{" "}
            معروض للزوار. الأرشفة تخفي المشروع ويمكن استعادته.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="admin-button admin-button-primary"
        >
          {Icons.plus} إضافة مشروع
        </button>
      </div>

      <div
        className="admin-toolbar"
        role="search"
        aria-label="البحث في المشاريع"
      >
        <label className="admin-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">ابحث عن مشروع</span>
          <input
            type="search"
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            placeholder="ابحث باسم المشروع أو الوسم…"
            autoComplete="off"
          />
        </label>
        <label className="admin-filter">
          <span>التصنيف</span>
          <select
            value={projectCategory}
            onChange={(e) => setProjectCategory(e.target.value)}
          >
            <option value="all">كل التصنيفات</option>
            {CATS_AR.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="admin-filter">
          <span>الظهور</span>
          <select
            value={projectVisibility}
            onChange={(e) => setProjectVisibility(e.target.value)}
          >
            <option value="all">الكل</option>
            <option value="active">مفعّل</option>
            <option value="archived">مؤرشف</option>
          </select>
        </label>
      </div>

      {projectError && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-800"
        >
          {projectError}
        </p>
      )}
      {/* Form */}
      {showForm && (
        <div
          className="rounded-2xl border border-[var(--admin-line)] p-6 mb-6"
          style={{
            background: "var(--admin-surface)",
          }}
        >
          <h3 className="font-bold text-[var(--admin-ink)] mb-5">
            {editId ? "تعديل المشروع" : "مشروع جديد"}
          </h3>
          <form onSubmit={handleSave} className="admin-form space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs font-bold text-[var(--admin-muted)] mb-1.5"
                  htmlFor="project-titleAr"
                >
                  اسم المشروع *
                </label>
                <input
                  id="project-titleAr"
                  name="titleAr"
                  autoComplete="off"
                  required
                  value={form.titleAr}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, titleAr: e.target.value }))
                  }
                  placeholder="Adrenaline — مطعم"
                  className={inputCls}
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-bold text-[var(--admin-muted)] mb-1.5"
                  htmlFor="project-category"
                >
                  التصنيف
                </label>
                <select
                  id="project-category"
                  name="category"
                  autoComplete="off"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className={inputCls}
                  style={{
                    ...inputStyle,
                    background: "var(--admin-surface)",
                  }}
                  onFocus={focusIn}
                  onBlur={focusOut}
                >
                  {CATS_AR.map((c) => (
                    <option key={c} className="bg-[var(--admin-surface)]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label
                  className="block text-xs font-bold text-[var(--admin-muted)] mb-1.5"
                  htmlFor="project-liveUrl"
                >
                  رابط المشروع
                </label>
                <input
                  id="project-liveUrl"
                  name="liveUrl"
                  autoComplete="off"
                  type="url"
                  value={form.liveUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, liveUrl: e.target.value }))
                  }
                  placeholder="https://example.com"
                  dir="ltr"
                  className={inputCls}
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-bold text-[var(--admin-muted)] mb-1.5"
                  htmlFor="project-role"
                >
                  دورنا في المشروع
                </label>
                <input
                  id="project-role"
                  name="role"
                  autoComplete="off"
                  value={form.role}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, role: e.target.value }))
                  }
                  placeholder="تصميم وتطوير كامل"
                  className={inputCls}
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-bold text-[var(--admin-muted)] mb-1.5"
                  htmlFor="project-duration"
                >
                  مدة التنفيذ
                </label>
                <input
                  id="project-duration"
                  name="duration"
                  autoComplete="off"
                  value={form.duration}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, duration: e.target.value }))
                  }
                  placeholder="3 أسابيع"
                  className={inputCls}
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  key: "challenge",
                  label: "التحدي",
                  ph: "ما المشكلة التي واجهها العميل؟",
                },
                { key: "solution", label: "الحل", ph: "كيف حللناها؟" },
                {
                  key: "outcome",
                  label: "النتيجة",
                  ph: "ما الأثر بعد التنفيذ؟",
                },
              ].map((item) => (
                <div key={item.key}>
                  <label
                    htmlFor={"project-" + item.key}
                    className="block text-xs font-bold text-[var(--admin-muted)] mb-1.5"
                  >
                    {item.label}
                  </label>
                  <textarea
                    rows={3}
                    id={"project-" + item.key}
                    name={item.key}
                    value={(form as any)[item.key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [item.key]: e.target.value }))
                    }
                    placeholder={item.ph}
                    className={inputCls + " resize-none"}
                    style={inputStyle}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
              ))}
            </div>
            <label className="inline-flex min-h-11 items-center gap-3 cursor-pointer text-sm text-[var(--admin-muted)]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm((f) => ({ ...f, featured: e.target.checked }))
                }
                className="w-5 h-5 accent-[#EBDDC6]"
              />
              عرض المشروع ضمن الأعمال المختارة في الرئيسية
            </label>
            <div>
              <label
                className="block text-xs font-bold text-[var(--admin-muted)] mb-1.5"
                htmlFor="project-descriptionAr"
              >
                وصف قصير *
              </label>
              <textarea
                id="project-descriptionAr"
                name="descriptionAr"
                autoComplete="off"
                required
                rows={2}
                value={form.descriptionAr}
                onChange={(e) =>
                  setForm((f) => ({ ...f, descriptionAr: e.target.value }))
                }
                placeholder="وصف قصير عن المشروع..."
                className={inputCls + " resize-none"}
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs font-bold text-[var(--admin-muted)] mb-1.5"
                  htmlFor="project-result"
                >
                  النتيجة (اختياري)
                </label>
                <input
                  id="project-result"
                  name="result"
                  autoComplete="off"
                  value={form.result}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, result: e.target.value }))
                  }
                  placeholder="نتيجة فعلية موثقة للمشروع…"
                  className={inputCls}
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-bold text-[var(--admin-muted)] mb-1.5"
                  htmlFor="project-tags"
                >
                  الوسوم (مفصولة بفاصلة)
                </label>
                <input
                  id="project-tags"
                  name="tags"
                  autoComplete="off"
                  value={form.tags}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tags: e.target.value }))
                  }
                  placeholder="React, Figma"
                  dir="ltr"
                  className={inputCls}
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
            </div>

            {/* Uploads */}
            <div className="grid md:grid-cols-2 gap-4">
              {(["image", "video"] as const).map((type) => {
                const stored =
                  type === "image" ? form.imageStorageId : form.videoStorageId;
                const isUploading = uploading === type;
                return (
                  <div key={type}>
                    <label
                      htmlFor={`project-upload-${type}`}
                      className="block text-xs font-bold text-[var(--admin-muted)] mb-1.5"
                    >
                      {type === "image"
                        ? "صورة المشروع (screenshot)"
                        : "فيديو المشروع (اختياري)"}
                    </label>
                    <label
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                        stored
                          ? "border-[#26724c]/50"
                          : "border-[var(--admin-line)] hover:border-[#EBDDC6]/40"
                      }`}
                      style={{
                        background: stored
                          ? "rgba(74,222,128,0.06)"
                          : "var(--admin-surface)",
                      }}
                    >
                      <input
                        type="file"
                        id={`project-upload-${type}`}
                        name={`project-${type}`}
                        accept={
                          type === "image"
                            ? "image/jpeg,image/png,image/webp,image/avif"
                            : "video/mp4,video/webm"
                        }
                        className="sr-only"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          uploadFile(e.target.files[0], type)
                        }
                      />
                      {isUploading ? (
                        <>
                          <svg
                            className="w-4 h-4 animate-spin text-[var(--admin-accent)]"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          <span className="text-xs text-[var(--admin-muted)]">
                            جاري الرفع...
                          </span>
                        </>
                      ) : stored ? (
                        <>
                          <svg
                            className="w-4 h-4 text-[#26724c]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-xs text-[#26724c] font-bold">
                            تم الرفع ✓
                          </span>
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 text-[var(--admin-muted)]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-[var(--admin-muted)]">
                            اختر {type === "image" ? "PNG/JPG" : "MP4"}
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={savingProject || uploading !== null}
                className="admin-button admin-button-primary"
              >
                {savingProject
                  ? "جارٍ حفظ المشروع…"
                  : editId
                    ? "حفظ التعديلات"
                    : "إضافة المشروع"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-[var(--admin-muted)] border border-[var(--admin-line)] hover:border-[var(--admin-line)] hover:text-[var(--admin-muted)] transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      {projects === undefined && (
        <p className="admin-panel admin-empty" role="status">
          جارٍ تحميل المشاريع…
        </p>
      )}
      {projects && visibleProjects.length === 0 && (
        <div className="admin-panel admin-empty">
          <h3>لا توجد مشاريع تطابق البحث</h3>
          <p>جرّب اسمًا آخر أو اختر كل التصنيفات وحالات الظهور.</p>
        </div>
      )}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleProjects.map((p) => (
          <div
            key={p._id}
            className="admin-project-card group rounded-2xl border border-[var(--admin-line)] overflow-hidden"
            style={{
              background: "var(--admin-surface)",
            }}
          >
            <div
              className="relative bg-[var(--admin-subtle)]"
              style={{ aspectRatio: "16/9" }}
            >
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.titleAr}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--admin-muted)] text-xs">
                  لا توجد صورة
                </div>
              )}
              <span
                className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: "var(--admin-surface)",
                  color: "var(--admin-accent)",
                  border: "1px solid var(--admin-line)",
                }}
              >
                {p.category}
              </span>
              {p.videoUrl && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--admin-surface)] text-[var(--admin-accent)] flex items-center gap-1">
                  <svg
                    className="w-2.5 h-2.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  فيديو
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[var(--admin-ink)] text-sm mb-1">
                {p.titleAr}{" "}
                {!p.isActive && <span className="text-amber-200">— مؤرشف</span>}
              </h3>
              <p className="text-xs text-[var(--admin-muted)] line-clamp-2 mb-3">
                {p.descriptionAr}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(p)}
                  className="flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-[var(--admin-line)] text-[var(--admin-muted)] hover:border-[#EBDDC6]/40 hover:text-[var(--admin-accent)] transition-colors"
                >
                  {Icons.edit} تعديل
                </button>
                <button
                  onClick={() => toggleArchive(p)}
                  aria-label={`${p.isActive ? "أرشفة" : "استعادة"} ${p.titleAr}`}
                  className="py-2 px-3 rounded-lg text-xs font-bold border border-[var(--admin-line)] text-[var(--admin-muted)] hover:border-red-500/40 hover:text-red-800 transition-colors"
                >
                  {p.isActive ? "أرشفة" : "استعادة"}
                </button>
              </div>
            </div>
          </div>
        ))}
        {projects?.length === 0 && (
          <div className="md:col-span-3 text-center py-16 text-[var(--admin-muted)]">
            <svg
              className="w-12 h-12 mx-auto mb-3 opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path d="M3 7h4l2-4h6l2 4h4v13H3V7z" />
            </svg>
            لا توجد مشاريع بعد — أضف أول مشروع
          </div>
        )}
      </div>
    </section>
  );
}

function AdminLogin({ onSuccess }: { onSuccess: (token: string) => void }) {
  const login = useMutation(api.adminAuth.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const result = await login({ email: email.trim(), password });
      if (result.error || !result.token) {
        setError(result.error || "تعذّر تسجيل الدخول");
        return;
      }
      localStorage.setItem("afkar_admin_token", result.token);
      setPassword("");
      onSuccess(result.token);
    } catch (err) {
      setError(
        err instanceof ConvexError && typeof err.data === "string"
          ? err.data
          : "تعذّر تسجيل الدخول. تحقق من اتصالك وحاول مرة أخرى.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="admin-theme min-h-screen bg-[var(--admin-bg)] text-[var(--admin-ink)] flex items-center justify-center px-5 py-8"
      dir="rtl"
    >
      <section className="relative w-full max-w-md rounded-3xl border border-[var(--admin-line)] bg-[var(--admin-surface)] p-7 sm:p-9">
        <div
          className="w-12 h-12 rounded-2xl bg-[#EBDDC6] text-[#7A1630] flex items-center justify-center mb-6"
          aria-hidden="true"
        >
          <svg viewBox="0 0 20 20" className="w-6 h-6" fill="currentColor">
            <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">تسجيل دخول الإدارة</h1>
        <p className="text-[var(--admin-muted)] text-sm leading-7 mb-7">
          أدخل البريد الإلكتروني وكلمة المرور لحساب الإدارة للوصول إلى لوحة أثر.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm font-bold text-[var(--admin-muted)] mb-2"
            >
              البريد الإلكتروني
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              dir="ltr"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby={error ? "admin-login-error" : undefined}
              className="w-full min-h-12 rounded-xl border border-[var(--admin-line)] bg-[var(--admin-subtle)] px-4 text-base outline-none focus-visible:border-[var(--admin-accent)] focus-visible:ring-4 focus-visible:ring-[#7A1630]/10"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-bold text-[var(--admin-muted)] mb-2"
            >
              كلمة المرور
            </label>
            <div className="relative" dir="ltr">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby={error ? "admin-login-error" : undefined}
                className="w-full min-h-12 rounded-xl border border-[var(--admin-line)] bg-[var(--admin-subtle)] ps-4 pe-14 text-base outline-none focus-visible:border-[var(--admin-accent)] focus-visible:ring-4 focus-visible:ring-[#7A1630]/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((show) => !show)}
                aria-label={
                  showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                }
                aria-pressed={showPassword}
                aria-controls="admin-password"
                className="absolute end-1 top-1/2 -translate-y-1/2 flex min-h-11 min-w-11 items-center justify-center rounded-lg text-[var(--admin-accent)] hover:bg-[var(--admin-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--admin-accent)]"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          {error && (
            <p
              role="alert"
              id="admin-login-error"
              ref={errorRef}
              tabIndex={-1}
              className="rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-800"
            >
              {error}
            </p>
          )}
          <button
            disabled={loading}
            className="admin-primary w-full min-h-12 rounded-xl font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--admin-accent)] disabled:opacity-50"
          >
            {loading ? "جارٍ التحقق…" : "دخول لوحة التحكم"}
          </button>
        </form>
        <a
          href="/"
          className="mt-5 inline-flex min-h-11 items-center rounded text-sm text-[var(--admin-muted)] hover:text-[var(--admin-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--admin-accent)]"
        >
          العودة إلى الموقع
        </a>
      </section>
    </main>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Admin() {
  const [adminToken, setAdminToken] = useState(
    () => localStorage.getItem("afkar_admin_token") || "",
  );
  const sessionValid = useQuery(
    (api as any).adminAuth.validate,
    adminToken ? { token: adminToken } : "skip",
  );
  const logoutMutation = useMutation((api as any).adminAuth.logout);
  const [adminSearch, setAdminSearch] = useSearchParams();
  const activeNav = [
    "dashboard",
    "projects",
    "messages",
    "documents",
    "registry",
    "settings",
  ].includes(adminSearch.get("section") ?? "")
    ? adminSearch.get("section")!
    : "dashboard";
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeNav]);
  const [registryDirty, setRegistryDirty] = useState(false);
  function setActiveNav(section: string) {
    if (
      section !== activeNav &&
      registryDirty &&
      !window.confirm(
        "لديك بيانات لم تُحفظ في سجل المواقع. هل تريد المغادرة دون حفظ؟",
      )
    )
      return;
    setAdminSearch(section === "dashboard" ? {} : { section });
    if (window.innerWidth < 800) setSidebarOpen(false);
  }
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 1024,
  );
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 799px)");
    const adapt = () => setSidebarOpen(!mobile.matches);
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSidebarOpen(false);
    };
    mobile.addEventListener("change", adapt);
    window.addEventListener("keydown", escape);
    return () => {
      mobile.removeEventListener("change", adapt);
      window.removeEventListener("keydown", escape);
    };
  }, []);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [messageSearch, setMessageSearch] = useState("");
  const [messageStatus, setMessageStatus] = useState("all");
  const [notifOpen, setNotifOpen] = useState(false);

  const inquiries =
    useQuery(
      api.contact.list,
      adminToken && sessionValid ? { token: adminToken } : "skip",
    ) ?? [];
  const updateStatusMutation = useMutation(api.contact.updateStatus);
  const newCount = inquiries.filter((i: any) => i.status === "new").length;
  const visibleInquiries = inquiries.filter(
    (i) =>
      (messageStatus === "all" || i.status === messageStatus) &&
      [i.name, i.phone, i.service ?? "", i.email ?? ""]
        .join(" ")
        .toLocaleLowerCase("ar")
        .includes(messageSearch.trim().toLocaleLowerCase("ar")),
  );

  // وقت نسبي بالعربي (منذ دقيقة / منذ 3 ساعات / أمس ...)
  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000),
      h = Math.floor(diff / 3600000),
      d = Math.floor(diff / 86400000);
    if (m < 1) return "الآن";
    if (m < 60) return `منذ ${m} دقيقة`;
    if (h < 24) return `منذ ${h} ساعة`;
    if (d === 1) return "أمس";
    return `منذ ${d} يوم`;
  };

  // النشاط الأخير الحقيقي — مبني على آخر الاستفسارات الواردة
  const recentActivity = [...inquiries]
    .sort((a: any, b: any) => b.createdAt - a.createdAt)
    .slice(0, 5)
    .map((i: any) => ({
      icon: "mail",
      text: `رسالة جديدة من ${i.name}`,
      user: i.service || "استفسار",
      time: timeAgo(i.createdAt),
    }));

  const navItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: Icons.dashboard },
    { id: "projects", label: "المشاريع", icon: Icons.projects },
    {
      id: "messages",
      label: "الرسائل",
      icon: Icons.messages,
      badge: newCount || undefined,
    },
    { id: "documents", label: "الفواتير وعروض الأسعار", icon: Icons.content },
    {
      id: "registry",
      label: "سجل المواقع",
      icon: <LockKeyhole className="w-5 h-5" aria-hidden="true" />,
    },
    { id: "settings", label: "الإعدادات", icon: Icons.settings },
  ];

  async function updateStatus(
    id: string,
    status: "new" | "contacted" | "closed",
  ) {
    await updateStatusMutation({ token: adminToken, id: id as any, status });
    if (selectedInquiry?._id === id)
      setSelectedInquiry((prev: any) => (prev ? { ...prev, status } : null));
  }

  async function handleLogout() {
    try {
      await logoutMutation({ token: adminToken });
    } catch {}
    localStorage.removeItem("afkar_admin_token");
    setAdminToken("");
  }

  useEffect(() => {
    if (adminToken && sessionValid === false) {
      localStorage.removeItem("afkar_admin_token");
      setAdminToken("");
    }
  }, [adminToken, sessionValid]);

  if (!adminToken || sessionValid === false)
    return <AdminLogin onSuccess={setAdminToken} />;
  if (sessionValid === undefined)
    return (
      <div className="admin-theme min-h-screen bg-[var(--admin-bg)] text-[var(--admin-ink)] flex items-center justify-center">
        جارٍ التحقق...
      </div>
    );

  return (
    <div
      className="admin-theme admin-shell min-h-screen flex"
      dir="rtl"
      style={{ fontFamily: "'Tajawal','Cairo',sans-serif" }}
    >
      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <button
          className="admin-mobile-backdrop"
          type="button"
          aria-label="إغلاق قائمة الإدارة"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        id="admin-navigation"
        data-open={sidebarOpen}
        className={`admin-sidebar ${sidebarOpen ? "w-64" : "w-20"} flex-shrink-0 flex flex-col transition-colors duration-300 fixed inset-y-0 right-0 z-30 border-l border-[var(--admin-line)]`}
        style={{
          background: "var(--admin-surface)",
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-[var(--admin-line)]">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src="/athr-mark-ondark.svg"
              alt="ATHR"
              className="w-9 h-9 object-contain flex-shrink-0"
            />
            {sidebarOpen && (
              <div>
                <div
                  className="font-bold text-[var(--admin-ink)] text-sm leading-tight"
                  style={{ fontFamily: "Lexend" }}
                >
                  ATHR
                </div>
                <div className="text-xs text-[var(--admin-muted)]">
                  لوحة الإدارة
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            className="admin-nav-close"
            aria-label="إغلاق القائمة الجانبية"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              aria-label={item.label}
              title={item.label}
              aria-current={activeNav === item.id ? "page" : undefined}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors group relative ${
                activeNav === item.id
                  ? "text-[#7A1630]"
                  : "text-[var(--admin-muted)] hover:text-[var(--admin-ink)] hover:bg-[var(--admin-subtle)]"
              }`}
              style={
                activeNav === item.id
                  ? {
                      background: "var(--admin-soft)",
                    }
                  : {}
              }
            >
              <span
                className={`flex-shrink-0 ${activeNav === item.id ? "text-[#7A1630]" : ""}`}
              >
                {item.icon}
              </span>
              {sidebarOpen && (
                <span className="flex-1 text-right">{item.label}</span>
              )}
              {sidebarOpen && item.badge ? (
                <span className="w-5 h-5 rounded-full bg-red-700 text-[#ffffff] text-xs font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-[var(--admin-line)] space-y-1">
          <a
            href="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[var(--admin-muted)] hover:text-[var(--admin-ink)] hover:bg-[var(--admin-subtle)] transition-colors"
          >
            <span className="flex-shrink-0">{Icons.website}</span>
            {sidebarOpen && <span>عرض الموقع</span>}
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-800 hover:text-red-800 hover:bg-red-500/[0.06] transition-colors"
          >
            <span className="flex-shrink-0">{Icons.logout}</span>
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      <div
        className={`admin-main relative z-10 flex-1 min-w-0 flex flex-col min-h-screen transition-colors duration-300 ${sidebarOpen ? "mr-64" : "mr-20"}`}
      >
        {/* Header */}
        <header
          className="h-16 flex items-center justify-between px-6 sticky top-0 z-20 border-b border-[var(--admin-line)]"
          style={{
            background: "var(--admin-surface)",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={
                sidebarOpen ? "طي قائمة الإدارة" : "فتح قائمة الإدارة"
              }
              aria-expanded={sidebarOpen}
              aria-controls="admin-navigation"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[var(--admin-muted)] hover:text-[var(--admin-ink)] hover:bg-[var(--admin-subtle)] transition-colors"
            >
              {Icons.menu}
            </button>
            <div>
              <h1 className="font-bold text-[var(--admin-ink)] text-sm">
                {navItems.find((item) => item.id === activeNav)?.label ??
                  "لوحة التحكم"}
              </h1>
              <p className="text-xs text-[var(--admin-muted)]">
                أثر للتقنية والتصميم — الإدارة
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                aria-label="التنبيهات"
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[var(--admin-muted)] hover:text-[var(--admin-ink)] hover:bg-[var(--admin-subtle)] transition-colors"
              >
                {Icons.bell}
                {newCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-700 border border-[var(--admin-surface)]" />
                )}
              </button>
              {notifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotifOpen(false)}
                  />
                  <div
                    className="absolute left-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl border border-[var(--admin-line)] shadow-lg z-50"
                    style={{
                      background: "var(--admin-surface)",
                    }}
                  >
                    <div className="px-4 py-3 border-b border-[var(--admin-line)] flex items-center justify-between">
                      <span className="font-bold text-[var(--admin-ink)] text-sm">
                        التنبيهات
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#EBDDC6]/15 text-[var(--admin-accent)]">
                        {newCount} جديد
                      </span>
                    </div>
                    {newCount === 0 ? (
                      <div className="py-10 text-center text-[var(--admin-muted)] text-xs">
                        لا توجد تنبيهات جديدة
                      </div>
                    ) : (
                      inquiries
                        .filter((i: any) => i.status === "new")
                        .sort((a: any, b: any) => b.createdAt - a.createdAt)
                        .map((i: any) => (
                          <button
                            key={i._id}
                            onClick={() => {
                              setSelectedInquiry(i);
                              setActiveNav("messages");
                              setNotifOpen(false);
                            }}
                            className="w-full text-right flex gap-3 px-4 py-3 hover:bg-[var(--admin-subtle)] transition-colors border-b border-[var(--admin-line)]"
                          >
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[#a32d43]"
                              style={{ background: "rgba(248,113,113,0.12)" }}
                            >
                              {Icons.messages}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-[var(--admin-ink)] font-semibold truncate">
                                رسالة جديدة من {i.name}
                              </p>
                              <p className="text-xs text-[var(--admin-muted)] mt-0.5">
                                {i.service || "استفسار"} ·{" "}
                                {timeAgo(i.createdAt)}
                              </p>
                            </div>
                          </button>
                        ))
                    )}
                  </div>
                </>
              )}
            </div>
            <div
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[var(--admin-line)]"
              style={{ background: "var(--admin-surface)" }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-[#7A1630]"
                style={{
                  background: "var(--admin-soft)",
                }}
              >
                أ
              </div>
              <span className="text-sm font-semibold text-[var(--admin-ink)]">
                حساب الإدارة
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {activeNav === "settings" && <SettingsPanel token={adminToken} />}
          {activeNav === "projects" && <ProjectsPanel token={adminToken} />}
          {activeNav === "documents" && <DocumentsPanel token={adminToken} />}
          {activeNav === "registry" && (
            <WebsiteRegistry
              token={adminToken}
              onDirtyChange={setRegistryDirty}
            />
          )}

          {(activeNav === "dashboard" || activeNav === "messages") && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                  label="إجمالي الاستفسارات"
                  value={String(inquiries.length)}

                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
                <StatCard
                  label="استفسارات جديدة"
                  value={String(newCount)}
                  sub={newCount > 0 ? "تحتاج رد" : "لا يوجد جديد"}

                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  }
                />
                <StatCard
                  label="تم التواصل"
                  value={String(
                    inquiries.filter((i: any) => i.status === "contacted")
                      .length,
                  )}

                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  }
                />
                <StatCard
                  label="مغلقة"
                  value={String(
                    inquiries.filter((i: any) => i.status === "closed").length,
                  )}

                  icon={
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              </div>

              <div
                className={
                  activeNav === "dashboard"
                    ? "grid lg:grid-cols-3 gap-5"
                    : "grid gap-5"
                }
              >
                {/* Inquiries */}
                <div
                  className={
                    (activeNav === "dashboard" ? "lg:col-span-2 " : "") +
                    "rounded-2xl border border-[var(--admin-line)] overflow-hidden"
                  }
                  style={{
                    background: "var(--admin-surface)",
                  }}
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--admin-line)]">
                    <h2 className="font-bold text-[var(--admin-ink)] text-sm">
                      الاستفسارات
                    </h2>
                    <span className="text-xs text-[var(--admin-muted)]">
                      {inquiries.length} رسالة
                    </span>
                  </div>
                  <div
                    className="admin-toolbar admin-message-tools"
                    role="search"
                    aria-label="البحث في الرسائل"
                  >
                    <label className="admin-search">
                      <Search size={18} aria-hidden="true" />
                      <span className="sr-only">ابحث عن رسالة</span>
                      <input
                        type="search"
                        autoComplete="off"
                        value={messageSearch}
                        onChange={(e) => setMessageSearch(e.target.value)}
                        placeholder="ابحث بالاسم، الهاتف أو الخدمة…"
                      />
                    </label>
                    <label className="admin-filter">
                      <span>الحالة</span>
                      <select
                        value={messageStatus}
                        onChange={(e) => setMessageStatus(e.target.value)}
                      >
                        <option value="all">كل الرسائل</option>
                        <option value="new">جديد</option>
                        <option value="contacted">تم التواصل</option>
                        <option value="closed">مغلق</option>
                      </select>
                    </label>
                  </div>
                  {visibleInquiries.length === 0 ? (
                    <div className="py-16 text-center text-[var(--admin-muted)] text-sm">
                      {inquiries.length
                        ? "لا توجد رسائل تطابق البحث أو الحالة المختارة."
                        : "لا توجد استفسارات بعد. ستظهر طلبات العملاء هنا."}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ background: "var(--admin-surface)" }}>
                            <th className="text-right px-5 py-3 text-xs font-bold text-[var(--admin-muted)]">
                              الاسم
                            </th>
                            <th className="text-right px-5 py-3 text-xs font-bold text-[var(--admin-muted)]">
                              الخدمة
                            </th>
                            <th className="text-right px-5 py-3 text-xs font-bold text-[var(--admin-muted)]">
                              الحالة
                            </th>
                            <th className="text-right px-5 py-3 text-xs font-bold text-[var(--admin-muted)]">
                              التاريخ
                            </th>
                            <th className="px-5 py-3" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--admin-line)]">
                          {visibleInquiries.map((inq: any) => (
                            <tr
                              key={inq._id}
                              className="hover:bg-[var(--admin-subtle)] transition-colors cursor-pointer"
                              onClick={() =>
                                setSelectedInquiry(
                                  selectedInquiry?._id === inq._id ? null : inq,
                                )
                              }
                            >
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 text-[#7A1630]"
                                    style={{
                                      background: "var(--admin-soft)",
                                    }}
                                  >
                                    {inq.name.charAt(0)}
                                  </div>
                                  <button
                                    type="button"
                                    className="min-h-11 text-right font-semibold text-[var(--admin-accent)] text-sm"
                                    aria-expanded={
                                      selectedInquiry?._id === inq._id
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedInquiry(
                                        selectedInquiry?._id === inq._id
                                          ? null
                                          : inq,
                                      );
                                    }}
                                  >
                                    {inq.name}
                                  </button>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-[var(--admin-muted)]">
                                {inq.service ?? "—"}
                              </td>
                              <td className="px-5 py-3.5">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_MAP[inq.status as keyof typeof STATUS_MAP].cls}`}
                                >
                                  {
                                    STATUS_MAP[
                                      inq.status as keyof typeof STATUS_MAP
                                    ].label
                                  }
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-[var(--admin-muted)]">
                                {new Date(inq.createdAt).toLocaleDateString(
                                  "ar-QA",
                                )}
                              </td>
                              <td className="px-5 py-3.5">
                                <div
                                  className="flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() =>
                                      updateStatus(inq._id, "contacted")
                                    }
                                    aria-label="تحديد الاستفسار كتم التواصل"
                                    className="min-h-11 min-w-11 rounded-lg text-[var(--admin-muted)] hover:text-[#26724c] hover:bg-[#26724c]/10 transition-colors"
                                  >
                                    {Icons.edit}
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateStatus(inq._id, "closed")
                                    }
                                    aria-label="إغلاق الاستفسار"
                                    className="min-h-11 min-w-11 rounded-lg text-[var(--admin-muted)] hover:text-red-800 hover:bg-red-500/10 transition-colors"
                                  >
                                    {Icons.trash}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {selectedInquiry && (
                    <div
                      className="admin-inquiry-details border-t border-[var(--admin-line)] px-6 py-4"
                      style={{ background: "var(--admin-surface)" }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-[var(--admin-ink)] text-sm">
                          {selectedInquiry.name}
                        </h3>
                        <button
                          onClick={() => setSelectedInquiry(null)}
                          aria-label="إغلاق تفاصيل الاستفسار"
                          className="min-h-11 min-w-11 text-[var(--admin-muted)] hover:text-[var(--admin-ink)] transition-colors"
                        >
                          <X size={18} aria-hidden="true" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                        <div>
                          <span className="text-[var(--admin-muted)]">
                            الخدمة:{" "}
                          </span>
                          <span className="font-semibold text-[var(--admin-muted)]">
                            {selectedInquiry.service ?? "—"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[var(--admin-muted)]">
                            الجوال:{" "}
                          </span>
                          <span
                            className="font-semibold text-[var(--admin-muted)]"
                            dir="ltr"
                          >
                            {selectedInquiry.phone}
                          </span>
                        </div>
                        <div>
                          <span className="text-[var(--admin-muted)]">
                            التاريخ:{" "}
                          </span>
                          <span className="font-semibold text-[var(--admin-muted)]">
                            {new Date(
                              selectedInquiry.createdAt,
                            ).toLocaleDateString("ar-QA")}
                          </span>
                        </div>
                        {selectedInquiry.email && (
                          <div>
                            <span className="text-[var(--admin-muted)]">
                              البريد:{" "}
                            </span>
                            <a
                              className="text-[var(--admin-ink)]"
                              href={`mailto:${selectedInquiry.email}`}
                              dir="ltr"
                            >
                              {selectedInquiry.email}
                            </a>
                          </div>
                        )}
                        {selectedInquiry.budget && (
                          <div>
                            <span className="text-[var(--admin-muted)]">
                              الميزانية:{" "}
                            </span>
                            <span className="text-[var(--admin-ink)]">
                              {selectedInquiry.budget}
                            </span>
                          </div>
                        )}
                        {selectedInquiry.timeline && (
                          <div>
                            <span className="text-[var(--admin-muted)]">
                              الموعد المطلوب:{" "}
                            </span>
                            <span className="text-[var(--admin-ink)]">
                              {selectedInquiry.timeline}
                            </span>
                          </div>
                        )}
                      </div>
                      {selectedInquiry.message && (
                        <p
                          className="text-xs text-[var(--admin-muted)] rounded-xl p-3 mb-3 leading-relaxed border border-[var(--admin-line)]"
                          style={{ background: "var(--admin-surface)" }}
                        >
                          {selectedInquiry.message}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <a
                          href={`https://wa.me/${selectedInquiry.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#247344] text-[#ffffff] text-xs font-bold hover:bg-[#1da554] transition-colors"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                          </svg>
                          واتساب
                        </a>
                        <button
                          onClick={() =>
                            updateStatus(selectedInquiry._id, "contacted")
                          }
                          className="px-3 py-2 rounded-xl text-xs font-bold border border-[#26724c]/30 text-[#26724c] hover:bg-[#26724c]/10 transition-colors"
                        >
                          تم التواصل
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(selectedInquiry._id, "closed")
                          }
                          className="px-3 py-2 rounded-xl text-xs font-bold border border-[var(--admin-line)] text-[var(--admin-muted)] hover:border-[var(--admin-line)] hover:text-[var(--admin-muted)] transition-colors"
                        >
                          إغلاق
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard shortcuts */}
                {activeNav === "dashboard" && (
                  <div className="space-y-4">
                    {/* Quick Actions */}
                    <div
                      className="rounded-2xl border border-[var(--admin-line)] p-5"
                      style={{
                        background: "var(--admin-surface)",
                      }}
                    >
                      <h2 className="font-bold text-[var(--admin-ink)] text-sm mb-4">
                        إجراءات سريعة
                      </h2>
                      <div className="space-y-2">
                        <button
                          onClick={() => setActiveNav("projects")}
                          className="admin-primary w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors"
                        >
                          {Icons.plus} إضافة مشروع جديد
                        </button>
                        <button
                          onClick={() => setActiveNav("settings")}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-[var(--admin-muted)] border border-[var(--admin-line)] hover:border-[var(--admin-line)] hover:text-[var(--admin-ink)] transition-colors"
                        >
                          {Icons.settings} تحديث الإعدادات
                        </button>
                        <button
                          onClick={() => setActiveNav("messages")}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-[var(--admin-muted)] border border-[var(--admin-line)] hover:border-[var(--admin-line)] hover:text-[var(--admin-ink)] transition-colors"
                        >
                          {Icons.messages} عرض الرسائل
                        </button>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div
                      className="rounded-2xl border border-[var(--admin-line)] p-5"
                      style={{
                        background: "var(--admin-surface)",
                      }}
                    >
                      <h2 className="font-bold text-[var(--admin-ink)] text-sm mb-4">
                        النشاط الأخير
                      </h2>
                      <div className="space-y-4">
                        {recentActivity.length === 0 && (
                          <p className="text-xs text-[var(--admin-muted)] py-6 text-center">
                            لا يوجد نشاط بعد — ستظهر الاستفسارات الجديدة هنا
                          </p>
                        )}
                        {recentActivity.map((a, i) => (
                          <div key={i} className="flex gap-3">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[var(--admin-accent)]"
                              style={{ background: "rgba(235,221,198,0.1)" }}
                            >
                              {a.icon === "edit"
                                ? Icons.edit
                                : a.icon === "plus"
                                  ? Icons.plus
                                  : a.icon === "mail"
                                    ? Icons.messages
                                    : Icons.settings}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-[var(--admin-muted)] leading-relaxed font-medium">
                                {a.text}
                              </p>
                              <p className="text-xs text-[var(--admin-muted)] mt-0.5">
                                {a.time} · {a.user}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
