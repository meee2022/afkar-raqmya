import {
  useState,
  useRef,
  useEffect,
  useDeferredValue,
  Component,
  type ReactNode,
  type FormEvent,
} from "react";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import {
  LockKeyhole,
  Globe2,
  Search,
  Plus,
  ArrowUpLeft,
  Copy,
  Check,
  Eye,
  EyeOff,
  Pencil,
  Archive,
  RotateCcw,
  Download,
  Upload,
  FolderInput,
  CalendarDays,
  ShieldCheck,
  X,
  LoaderCircle,
  Pin,
  Server,
  GitBranch,
} from "lucide-react";
import { registryApi } from "./registryApi";
import type { Id } from "../../convex/_generated/dataModel";
import {
  emptyRegistryInput,
  registryInput,
  registrySearch,
  renewalDays,
  REGISTRY_STATUSES,
  type RegistryInput,
  type RegistryRecord,
  type RegistryBackupRecord,
} from "../../shared/siteRegistry";
import {
  registryBackup,
  parseRegistryBackup,
} from "../../shared/registryBackup";
import "./websiteRegistry.css";

interface RegistryActions {
  save: (input: RegistryInput, row?: RegistryRecord) => Promise<string>;
  archive: (row: RegistryRecord) => Promise<void>;
  importRows: (
    rows: RegistryBackupRecord[],
  ) => Promise<{ added: number; skipped: number }>;
  fromPortfolio: () => Promise<{ added: number }>;
}
function errorMessage(error: unknown) {
  return error instanceof ConvexError && typeof error.data === "string"
    ? error.data
    : error instanceof Error && error.name === "RegistryFileError"
      ? error.message
      : "تعذّر تنفيذ العملية. راجع اتصالك أو سجّل الدخول مرة أخرى ثم حاول.";
}
class RegistryBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <section className="registry">
        <div className="registry-feedback registry-error" role="alert">
          <div>
            <h2>سجل المواقع غير متاح حاليًا.</h2>
            <p>
              تحقق من جلسة الإدارة، ومن نشر تحديث السجل إلى بيئة Convex
              المعتمدة. بقية أقسام الإدارة متاحة من القائمة.
            </p>
            <button
              className="registry-button"
              onClick={() => window.location.reload()}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </section>
    ) : (
      this.props.children
    );
  }
}
export default function WebsiteRegistry(props: {
  token: string;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  return (
    <RegistryBoundary>
      <RegistryConnected {...props} />
    </RegistryBoundary>
  );
}
function RegistryConnected({
  token,
  onDirtyChange,
}: {
  token: string;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const rows = useQuery(registryApi.list, { token });
  const create = useMutation(registryApi.create),
    update = useMutation(registryApi.update),
    archive = useMutation(registryApi.setArchived),
    importRows = useMutation(registryApi.importRecords),
    fromPortfolio = useMutation(registryApi.addFromPortfolio);
  const actions: RegistryActions = {
    save: async (input, row) => {
      if (row) {
        await update({
          token,
          id: row._id as Id<"agencyWebsiteRegistry">,
          revision: row.revision,
          ...input,
        });
        return row._id;
      }
      return create({ token, ...input });
    },
    archive: async (row) => {
      await archive({
        token,
        id: row._id as Id<"agencyWebsiteRegistry">,
        revision: row.revision,
        archived: !row.archived,
      });
    },
    importRows: async (records) => importRows({ token, records }),
    fromPortfolio: async () => fromPortfolio({ token }),
  };
  return (
    <RegistryWorkspace
      records={rows}
      actions={actions}
      onDirtyChange={onDirtyChange}
    />
  );
}

export function RegistryWorkspace({
  records,
  actions,
  onDirtyChange,
}: {
  records: RegistryRecord[] | undefined;
  actions: RegistryActions;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [search, setSearch] = useState(""),
    deferredSearch = useDeferredValue(search);
  const [filter, setFilter] = useState("all"),
    [selectedId, setSelectedId] = useState<string | null>(null),
    [editing, setEditing] = useState(false),
    [creating, setCreating] = useState(false);
  const [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [backupOpen, setBackupOpen] = useState(false);
  const [editingSnapshot, setEditingSnapshot] = useState<
    RegistryRecord | undefined
  >();
  const fileRef = useRef<HTMLInputElement>(null),
    inspectorRef = useRef<HTMLDivElement>(null);
  const rows = records ?? [],
    active = rows.filter((r) => !r.archived);
  const due = (r: RegistryRecord) => {
    const days = renewalDays(r.renewalDate);
    return days !== null && days <= 30;
  };
  const shown = rows
    .filter((r) => (filter === "archived" ? r.archived : !r.archived))
    .filter((r) =>
      filter === "review"
        ? r.needsReview
        : filter === "due"
          ? due(r)
          : filter === "pinned"
            ? r.pinned
            : true,
    )
    .filter((r) => registrySearch(r, deferredSearch))
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt,
    );
  const selected = rows.find((r) => r._id === selectedId) ?? null;
  const selectedVisible = shown.some((r) => r._id === selectedId);
  useEffect(() => {
    if (!editing && selected && !selectedVisible) setSelectedId(null);
  }, [editing, selectedId, selectedVisible, selected]);
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);
  useEffect(() => {
    if (editing)
      requestAnimationFrame(() =>
        inspectorRef.current?.focus({ preventScroll: window.innerWidth > 900 }),
      );
  }, [editing]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) setBackupOpen(false);
    };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, []);
  const canLeave = () => {
    if (!dirty) return true;
    setError("لديك تعديلات لم تُحفظ. احفظها أو اختر إلغاء التعديل أولًا.");
    return false;
  };
  const select = (id: string) => {
    if (!canLeave()) return;
    setSelectedId(id);
    setEditing(false);
    setCreating(false);
    setError("");
    requestAnimationFrame(() =>
      inspectorRef.current?.focus({ preventScroll: window.innerWidth > 900 }),
    );
  };
  const newRecord = () => {
    if (!canLeave()) return;
    setFilter("all");
    setSearch("");
    setCreating(true);
    setEditing(true);
    setSelectedId(null);
    setError("");
  };
  async function run(task: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await task();
    } catch (e) {
      setNotice("");
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function readFile(file: File) {
    await run(async () => {
      if (!canLeave()) return;
      if (file.size > 10 * 1024 * 1024) {
        const e = new Error("الملف أكبر من 10 ميجابايت. قسّمه إلى ملفات أصغر.");
        e.name = "RegistryFileError";
        throw e;
      }
      let incoming: RegistryBackupRecord[];
      try {
        incoming = parseRegistryBackup(JSON.parse(await file.text()));
      } catch (err) {
        const e = new Error(
          err instanceof Error ? err.message : "تعذّر قراءة الملف.",
        );
        e.name = "RegistryFileError";
        throw e;
      }
      let added = 0,
        skipped = 0;
      for (let offset = 0; offset < incoming.length; offset += 200) {
        const result = await actions.importRows(
          incoming.slice(offset, offset + 200),
        );
        added += result.added;
        skipped += result.skipped;
        setNotice(
          `جارٍ الاستيراد… ${Math.min(offset + 200, incoming.length)} من ${incoming.length}`,
        );
      }
      setNotice(
        `اكتمل الاستيراد: أضيف ${added}، وتم تجاوز ${skipped} سجل موجود دون تغيير بياناته.`,
      );
      setBackupOpen(false);
    });
  }
  function download() {
    if (!canLeave()) return;
    const blob = new Blob([JSON.stringify(registryBackup(rows), null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob),
      link = document.createElement("a");
    link.href = url;
    link.download = `athr-private-sites-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setBackupOpen(false);
    setNotice("تم تجهيز النسخة الخاصة للتنزيل.");
  }
  const cancel = () => {
    setEditing(false);
    setCreating(false);
    setDirty(false);
    setError("");
  };
  return (
    <section
      className="registry"
      aria-labelledby="registry-title"
      aria-busy={records === undefined || busy}
      dir="rtl"
    >
      <div className="registry-heading">
        <div>
          <div className="registry-title-row">
            <LockKeyhole size={26} strokeWidth={1.6} aria-hidden="true" />
            <h2 id="registry-title">سجل المواقع</h2>
            <span className="registry-private">خاص بالإدارة</span>
          </div>
          <p>مرجعك للمواقع والحسابات والاستضافة والتجديدات، في مكان واحد.</p>
        </div>
        <button
          className="registry-button registry-primary"
          type="button"
          onClick={newRecord}
          disabled={busy}
        >
          <Plus size={19} aria-hidden="true" /> إضافة موقع
        </button>
      </div>
      <div className="registry-summary">
        <span>
          <strong>{records === undefined ? "—" : active.length}</strong> موقع
          مسجّل
        </span>
        <span>
          <strong>
            {records === undefined
              ? "—"
              : active.filter((r) => r.needsReview).length}
          </strong>{" "}
          تحتاج مراجعة
        </span>
        <span className={active.some(due) ? "registry-due-text" : ""}>
          <CalendarDays size={17} aria-hidden="true" />
          <strong>
            {records === undefined ? "—" : active.filter(due).length}
          </strong>{" "}
          تجديد خلال 30 يومًا أو متأخر
        </span>
      </div>
      <div className="registry-tools">
        <label className="registry-search">
          <Search size={19} aria-hidden="true" />
          <span className="sr-only">ابحث عن موقع أو حساب أو خدمة</span>
          <input
            type="search"
            name="registry-search"
            autoComplete="off"
            placeholder="ابحث باسم الموقع، الحساب أو الخدمة…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="registry-tool-actions">
          <button
            className="registry-button"
            disabled={busy || records === undefined}
            onClick={() =>
              run(async () => {
                if (!canLeave()) return;
                const result = await actions.fromPortfolio();
                setNotice(
                  result.added
                    ? `أضيف ${result.added} موقع من المعرض للمراجعة.`
                    : "كل مشاريع المعرض موجودة بالفعل في السجل.",
                );
              })
            }
          >
            <FolderInput size={17} aria-hidden="true" /> من معرض الأعمال
          </button>
          <button
            className="registry-button"
            aria-expanded={backupOpen}
            aria-controls="registry-backup"
            onClick={() => setBackupOpen((v) => !v)}
            disabled={busy}
          >
            <Download size={17} aria-hidden="true" /> النسخ والاستيراد
          </button>
        </div>
      </div>
      {backupOpen && (
        <div className="registry-backup" id="registry-backup">
          <div>
            <h3>نسخة خاصة تحتفظ بها عندك.</h3>
            <p>
              الملف يتضمن الحسابات والملاحظات. احفظه في مكان خاص. الاستيراد يضيف
              السجلات الجديدة ويحافظ على السجلات الموجودة.
            </p>
          </div>
          <div>
            <button
              className="registry-button"
              onClick={download}
              disabled={!rows.length || busy}
            >
              <Download size={17} aria-hidden="true" /> تنزيل نسخة JSON
            </button>
            <button
              className="registry-button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
            >
              <Upload size={17} aria-hidden="true" /> استيراد ملف
            </button>
          </div>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        className="sr-only"
        tabIndex={-1}
        aria-label="ملف نسخة سجل المواقع"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void readFile(file);
          e.currentTarget.value = "";
        }}
      />
      {error && (
        <div className="registry-feedback registry-error" role="alert">
          {error}
        </div>
      )}
      {notice && (
        <div className="registry-feedback" role="status">
          {busy && (
            <LoaderCircle
              className="loading-spin"
              size={17}
              aria-hidden="true"
            />
          )}
          {notice}
        </div>
      )}
      <div
        className="registry-filters"
        role="group"
        aria-label="تصفية سجل المواقع"
      >
        {[
          { id: "all", label: "كل المواقع" },
          { id: "pinned", label: "المثبتة" },
          { id: "review", label: "تحتاج مراجعة" },
          { id: "due", label: "التجديدات" },
          { id: "archived", label: "الأرشيف" },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="registry-workspace">
        <div className="registry-list" aria-label="قائمة المواقع">
          {records === undefined ? (
            <div className="registry-loading" role="status">
              <LoaderCircle
                size={24}
                className="loading-spin"
                aria-hidden="true"
              />
              جارٍ تحميل سجلك الخاص…
            </div>
          ) : shown.length ? (
            shown.map((r) => (
              <button
                type="button"
                className={`registry-site-row ${selectedId === r._id && !creating ? "is-selected" : ""}`}
                aria-pressed={selectedId === r._id && !creating}
                key={r._id}
                onClick={() => select(r._id)}
              >
                <span className="registry-row-icon">
                  <Globe2 size={21} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="registry-row-content">
                  <span className="registry-row-name">
                    {r.name}
                    {r.pinned && <Pin size={13} aria-label="مثبت" />}
                  </span>
                  <span className="registry-row-domain" dir="auto">
                    {r.domain || r.siteUrl || "رابط الموقع لم يُضف بعد"}
                  </span>
                  <span className="registry-row-providers">
                    {r.services.length
                      ? r.services
                          .map((s) => s.provider)
                          .filter((s, i, a) => a.indexOf(s) === i)
                          .join(" / ")
                      : "حسابات الخدمات لم تُضف بعد"}
                  </span>
                  <span className="registry-row-badges">
                    <span
                      className={`registry-status registry-status-${r.status}`}
                    >
                      {REGISTRY_STATUSES[r.status]}
                    </span>
                    {r.needsReview && (
                      <span className="registry-review-tag">تحتاج مراجعة</span>
                    )}
                    {due(r) && (
                      <span className="registry-renewal-tag">تجديد مسجّل</span>
                    )}
                  </span>
                </span>
              </button>
            ))
          ) : (
            <div className="registry-list-empty">
              <Globe2 size={32} strokeWidth={1.3} aria-hidden="true" />
              <h3>
                {rows.length ? "لا توجد نتائج مطابقة." : "ابدأ بأول موقع."}
              </h3>
              <p>
                {rows.length
                  ? "جرّب اسمًا أو حسابًا آخر، أو غيّر التصفية."
                  : "أضف موقعًا، أو اجلب مشاريع معرض الأعمال وأكمل بياناتها."}
              </p>
              {!rows.length && (
                <button className="registry-button" onClick={newRecord}>
                  إضافة موقع
                </button>
              )}
            </div>
          )}
        </div>
        <div className="registry-inspector" ref={inspectorRef} tabIndex={-1}>
          {editing ? (
            <RegistryEditor
              key={creating ? "new" : selected?._id}
              initial={creating ? undefined : editingSnapshot}
              busy={busy}
              onDirty={setDirty}
              onCancel={cancel}
              onSave={(input) =>
                run(async () => {
                  const id = await actions.save(
                    input,
                    creating ? undefined : editingSnapshot,
                  );
                  setSelectedId(id);
                  setCreating(false);
                  setEditing(false);
                  setDirty(false);
                  setNotice("تم حفظ بيانات الموقع.");
                })
              }
            />
          ) : selected ? (
            <RegistryDetails
              key={selected._id}
              row={selected}
              busy={busy}
              onEdit={() => {
                setEditingSnapshot(selected);
                setEditing(true);
                setError("");
              }}
              onArchive={() =>
                run(async () => {
                  await actions.archive(selected);
                  setNotice(
                    selected.archived
                      ? "تمت استعادة الموقع."
                      : "نُقل الموقع للأرشيف. يمكنك استعادته في أي وقت.",
                  );
                })
              }
            />
          ) : (
            <div className="registry-welcome">
              <div className="registry-welcome-mark">
                <LockKeyhole size={42} strokeWidth={1.2} aria-hidden="true" />
              </div>
              <h3>تفاصيل موقعك، وقت ما تحتاجها.</h3>
              <p>
                اختر موقعًا من القائمة لتجد روابطه، حساباته، وملاحظاته. هذه
                البيانات منفصلة عن معرض الأعمال العام.
              </p>
              <button
                className="registry-button registry-primary"
                onClick={newRecord}
              >
                <Plus size={18} aria-hidden="true" /> إضافة موقع جديد
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="registry-footnote">
        <ShieldCheck size={16} aria-hidden="true" /> هذا القسم مرتبط بجلسة
        الإدارة ولا تُعرض بياناته في صفحات الموقع العامة.
      </p>
    </section>
  );
}

function CopyValue({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false),
    [failed, setFailed] = useState(false);
  return (
    <span className="registry-copy-wrap">
      <button
        type="button"
        className="registry-icon-button"
        aria-label={`نسخ ${label}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          } catch {
            setFailed(true);
          }
        }}
      >
        {copied ? (
          <Check size={16} aria-hidden="true" />
        ) : (
          <Copy size={16} aria-hidden="true" />
        )}
      </button>
      <span
        role="status"
        className={failed ? "registry-copy-error" : "sr-only"}
      >
        {copied
          ? "تم النسخ"
          : failed
            ? "تعذر النسخ؛ حدد النص وانسخه يدويًا."
            : ""}
      </span>
    </span>
  );
}
function DetailValue({
  label,
  value,
  url = false,
}: {
  label: string;
  value: string;
  url?: boolean;
}) {
  return (
    <div className="registry-detail-value">
      <dt>{label}</dt>
      <dd>
        {value ? (
          <>
            <span dir="auto">
              {url && /^https?:\/\//.test(value) ? (
                <a href={value} target="_blank" rel="noopener noreferrer">
                  {value}
                  <ArrowUpLeft size={15} aria-hidden="true" />
                </a>
              ) : (
                value
              )}
            </span>
            <CopyValue label={label} value={value} />
          </>
        ) : (
          <span className="registry-unset">لم يُضف بعد</span>
        )}
      </dd>
    </div>
  );
}
function RegistryDetails({
  row,
  busy,
  onEdit,
  onArchive,
}: {
  row: RegistryRecord;
  busy: boolean;
  onEdit: () => void;
  onArchive: () => void;
}) {
  const [reveal, setReveal] = useState(false);
  useEffect(() => {
    if (!reveal) return;
    const timer = setTimeout(() => setReveal(false), 2 * 60_000);
    return () => clearTimeout(timer);
  }, [reveal]);
  const days = renewalDays(row.renewalDate);
  useEffect(() => {
    const hide = () => {
      if (document.hidden) setReveal(false);
    };
    document.addEventListener("visibilitychange", hide);
    return () => document.removeEventListener("visibilitychange", hide);
  }, []);
  return (
    <div className="registry-details">
      <div className="registry-detail-heading">
        <div>
          <h3>{row.name}</h3>
          <p>{row.client || "اسم العميل لم يُضف بعد"}</p>
        </div>
        <button
          className="registry-button registry-edit"
          onClick={onEdit}
          disabled={busy}
        >
          <Pencil size={16} aria-hidden="true" /> تعديل
        </button>
      </div>
      <div className="registry-detail-badges">
        <span className={`registry-status registry-status-${row.status}`}>
          {REGISTRY_STATUSES[row.status]}
        </span>
        {row.archived && <span className="registry-review-tag">مؤرشف</span>}
        {row.needsReview && (
          <span className="registry-review-tag">تحتاج مراجعة</span>
        )}
      </div>
      <section className="registry-detail-section">
        <h4>
          <Globe2 size={18} aria-hidden="true" /> الموقع والدومين
        </h4>
        <dl>
          <DetailValue label="رابط الموقع" value={row.siteUrl} url />
          <DetailValue label="الدومين" value={row.domain} />
          <DetailValue label="مزود الدومين" value={row.domainProvider} />
        </dl>
        {row.renewalDate && (
          <p
            className={`registry-renewal ${days !== null && days <= 30 ? "is-due" : ""}`}
          >
            <CalendarDays size={17} aria-hidden="true" />
            <span>
              التجديد المسجّل:{" "}
              {new Intl.DateTimeFormat("ar-QA", {
                dateStyle: "medium",
                timeZone: "UTC",
              }).format(new Date(row.renewalDate))}
              {days !== null && (
                <small>
                  {days < 0
                    ? `مرّ عليه ${Math.abs(days)} يومًا`
                    : days === 0
                      ? "الموعد اليوم"
                      : `بعد ${days} يومًا`}
                </small>
              )}
            </span>
          </p>
        )}
      </section>
      <section className="registry-detail-section">
        <h4>
          <GitBranch size={18} aria-hidden="true" /> المستودع
        </h4>
        <dl>
          <DetailValue label="اسم المستودع" value={row.repositoryName} />
          <DetailValue label="رابط المستودع" value={row.repositoryUrl} url />
          <DetailValue
            label="مجلد المشروع على الجهاز"
            value={row.localPath ?? ""}
          />
        </dl>
      </section>
      <section className="registry-detail-section">
        <div className="registry-section-heading">
          <h4>
            <Server size={18} aria-hidden="true" /> حسابات الخدمات
          </h4>
          {row.services.length > 0 && (
            <button
              type="button"
              className="registry-reveal"
              onClick={() => setReveal((v) => !v)}
              aria-pressed={reveal}
            >
              {reveal ? (
                <EyeOff size={16} aria-hidden="true" />
              ) : (
                <Eye size={16} aria-hidden="true" />
              )}
              {reveal ? "إخفاء الحسابات" : "إظهار الحسابات"}
            </button>
          )}
        </div>
        {row.services.length ? (
          row.services.map((s, i) => (
            <div className="registry-service" key={`${s.provider}-${i}`}>
              <h5>{s.provider}</h5>
              <div className="registry-account-line">
                <span dir="auto">
                  {reveal
                    ? s.account || "الحساب لم يُضف"
                    : s.account
                      ? "••••••••••••"
                      : "الحساب لم يُضف"}
                </span>
                {reveal && s.account && (
                  <CopyValue label={`حساب ${s.provider}`} value={s.account} />
                )}
              </div>
              {s.project && (
                <p>
                  المشروع: <bdi>{s.project}</bdi>
                </p>
              )}
              {s.dashboardUrl && /^https?:\/\//.test(s.dashboardUrl) && (
                <a
                  className="registry-service-link"
                  href={s.dashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  لوحة {s.provider}
                  <ArrowUpLeft size={15} aria-hidden="true" />
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="registry-unset">
            أضف خدمات الاستضافة وقاعدة البيانات والحساب المستخدم لكل منها.
          </p>
        )}
      </section>
      <section className="registry-detail-section">
        <h4>مرجع بيانات الدخول</h4>
        <p className="registry-preserve-text">
          {row.credentialReference ||
            "يمكنك تسجيل اسم الإدخال في مدير كلمات المرور لتصل إليه لاحقًا."}
        </p>
      </section>
      <section className="registry-detail-section">
        <h4>ملاحظاتك</h4>
        <p className="registry-preserve-text">
          {row.notes || "لا توجد ملاحظات بعد."}
        </p>
        {row.tags.length > 0 && (
          <ul className="registry-tags" aria-label="وسوم الموقع">
            {row.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
      </section>
      <div className="registry-detail-footer">
        <small>
          آخر تعديل:{" "}
          {new Intl.DateTimeFormat("ar-QA", {
            dateStyle: "medium",
            timeZone: "Asia/Qatar",
          }).format(row.updatedAt)}
        </small>
        <button
          className="registry-archive"
          type="button"
          onClick={onArchive}
          disabled={busy}
        >
          {row.archived ? (
            <RotateCcw size={16} aria-hidden="true" />
          ) : (
            <Archive size={16} aria-hidden="true" />
          )}
          {row.archived ? "استعادة الموقع" : "نقل للأرشيف"}
        </button>
      </div>
    </div>
  );
}

function RegistryEditor({
  initial,
  busy,
  onDirty,
  onCancel,
  onSave,
}: {
  initial?: RegistryRecord;
  busy: boolean;
  onDirty: (dirty: boolean) => void;
  onCancel: () => void;
  onSave: (input: RegistryInput) => Promise<void>;
}) {
  const [form, setForm] = useState<RegistryInput>(() =>
      initial ? registryInput(initial) : emptyRegistryInput(),
    ),
    [tags, setTags] = useState(initial?.tags.join("، ") ?? "");
  const set = <K extends keyof RegistryInput>(
    key: K,
    value: RegistryInput[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    onDirty(true);
  };
  const changeService = (
    index: number,
    key: keyof RegistryInput["services"][number],
    value: string,
  ) =>
    set(
      "services",
      form.services.map((s, i) => (i === index ? { ...s, [key]: value } : s)),
    );
  function submit(e: FormEvent) {
    e.preventDefault();
    void onSave({
      ...form,
      tags: tags
        .split(/[,،]/)
        .map((t) => t.trim())
        .filter(Boolean),
    });
  }
  const textField = (
    key:
      | "name"
      | "client"
      | "siteUrl"
      | "domain"
      | "domainProvider"
      | "renewalDate"
      | "repositoryName"
      | "localPath"
      | "repositoryUrl"
      | "credentialReference",
    label: string,
    type = "text",
    placeholder = "",
  ) => (
    <div
      className={`registry-field ${["siteUrl", "repositoryUrl", "credentialReference", "localPath"].includes(key) ? "is-full" : ""}`}
      key={key}
    >
      <label htmlFor={`registry-${key}`}>
        {label}
        {key === "name" ? " *" : ""}
      </label>
      <input
        id={`registry-${key}`}
        name={key}
        type={type}
        required={key === "name"}
        maxLength={type === "url" ? 2000 : key === "localPath" ? 1000 : 250}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        dir={
          type === "url" || key === "domain" || key === "localPath" || type === "date" ? "ltr" : "auto"
        }
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
      />
    </div>
  );
  return (
    <form className="registry-editor" onSubmit={submit}>
      <div className="registry-detail-heading">
        <div>
          <h3>{initial ? "تعديل بيانات الموقع" : "موقع جديد في سجلك"}</h3>
          <p>ابدأ بالاسم، وأكمل بقية البيانات عندما تتوفر.</p>
        </div>
        <button
          type="button"
          className="registry-icon-button"
          aria-label="إلغاء التعديل"
          onClick={onCancel}
          disabled={busy}
        >
          <X size={19} aria-hidden="true" />
        </button>
      </div>
      <fieldset>
        <legend>بيانات الموقع</legend>
        <div className="registry-form-grid">
          {textField(
            "name",
            "اسم الموقع أو التطبيق",
            "text",
            "اسم يسهل تذكره…",
          )}
          {textField("client", "العميل أو صاحب المشروع", "text", "اختياري…")}
          {textField("siteUrl", "رابط الموقع", "url", "https://example.com")}
          <div className="registry-field">
            <label htmlFor="registry-status">حالة الموقع</label>
            <select
              id="registry-status"
              name="status"
              value={form.status}
              onChange={(e) =>
                set("status", e.target.value as RegistryInput["status"])
              }
            >
              {Object.entries(REGISTRY_STATUSES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="registry-field">
            <label htmlFor="registry-tags">وسوم للترتيب</label>
            <input
              id="registry-tags"
              name="tags"
              placeholder="تعليمي، عميل، شخصي…"
              value={tags}
              onChange={(e) => {
                setTags(e.target.value);
                onDirty(true);
              }}
            />
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>الدومين والتجديد</legend>
        <div className="registry-form-grid">
          {textField("domain", "الدومين", "text", "example.com")}
          {textField(
            "domainProvider",
            "مزود الدومين",
            "text",
            "Cloudflare، Q Host…",
          )}
          {textField("renewalDate", "تاريخ التجديد المسجّل", "date")}
        </div>
      </fieldset>
      <fieldset>
        <legend>المستودع</legend>
        <div className="registry-form-grid">
          {textField("repositoryName", "اسم المستودع", "text", "اسم المشروع…")}
          {textField(
            "localPath",
            "مجلد المشروع على الجهاز",
            "text",
            "E:\\projects\\project-name",
          )}
          {textField(
            "repositoryUrl",
            "رابط المستودع",
            "url",
            "https://github.com/owner/repository",
          )}
        </div>
      </fieldset>
      <fieldset>
        <legend>حسابات الخدمات والاستضافة</legend>
        <p className="registry-field-hint">
          اكتب الخدمة والحساب المستخدم، مثل GitHub أو Convex أو Supabase أو
          Cloudflare. كلمات المرور والمفاتيح تُحفظ في مدير كلمات المرور.
        </p>
        <datalist id="registry-providers">
          {[
            "GitHub",
            "Convex",
            "Supabase",
            "Cloudflare",
            "Vercel",
            "Netlify",
            "Q Host",
            "Google Play",
            "Apple Developer",
          ].map((p) => (
            <option value={p} key={p} />
          ))}
        </datalist>
        {form.services.map((s, i) => (
          <div className="registry-service-editor" key={i}>
            <div className="registry-service-editor-title">
              <h5>حساب خدمة {i + 1}</h5>
              <button
                className="registry-icon-button"
                type="button"
                aria-label={`إزالة حساب الخدمة ${i + 1}`}
                disabled={busy}
                onClick={() =>
                  set(
                    "services",
                    form.services.filter((_, n) => n !== i),
                  )
                }
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>
            <div className="registry-form-grid">
              {[
                {
                  key: "provider",
                  label: "الخدمة",
                  placeholder: "اسم الخدمة…",
                },
                {
                  key: "account",
                  label: "البريد أو اسم الحساب",
                  placeholder: "name@example.com",
                },
                {
                  key: "project",
                  label: "المشروع داخل الخدمة",
                  placeholder: "اختياري…",
                },
                {
                  key: "dashboardUrl",
                  label: "رابط لوحة الخدمة",
                  placeholder: "https://…",
                },
              ].map((f) => (
                <div className="registry-field" key={f.key}>
                  <label htmlFor={`registry-service-${i}-${f.key}`}>
                    {f.label}
                  </label>
                  <input
                    id={`registry-service-${i}-${f.key}`}
                    name={`service-${i}-${f.key}`}
                    type={f.key === "dashboardUrl" ? "url" : "text"}
                    required={f.key === "provider"}
                    list={
                      f.key === "provider" ? "registry-providers" : undefined
                    }
                    maxLength={f.key === "dashboardUrl" ? 2000 : 250}
                    value={s[f.key as keyof typeof s]}
                    onChange={(e) =>
                      changeService(i, f.key as keyof typeof s, e.target.value)
                    }
                    autoComplete="off"
                    spellCheck={false}
                    dir={
                      f.key === "account" || f.key === "dashboardUrl"
                        ? "ltr"
                        : "auto"
                    }
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          className="registry-button registry-add-service"
          type="button"
          disabled={busy || form.services.length >= 20}
          onClick={() =>
            set("services", [
              ...form.services,
              { provider: "", account: "", project: "", dashboardUrl: "" },
            ])
          }
        >
          <Plus size={17} aria-hidden="true" /> إضافة حساب خدمة
        </button>
      </fieldset>
      <fieldset>
        <legend>ما تحب أن تتذكره لاحقًا</legend>
        <div className="registry-form-grid">
          {textField(
            "credentialReference",
            "مرجع بيانات الدخول في مدير كلمات المرور",
            "text",
            "مثال: اسم الإدخال أو المجلد…",
          )}
          <div className="registry-field is-full">
            <label htmlFor="registry-notes">ملاحظات التشغيل والتسليم</label>
            <textarea
              id="registry-notes"
              name="notes"
              rows={5}
              maxLength={12000}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="خطوات النشر، حساب المالك، ما يحتاج مراجعة، وأي تفاصيل تريد الرجوع إليها…"
            />
          </div>
        </div>
        <div className="registry-checks">
          <label>
            <input
              type="checkbox"
              checked={form.needsReview}
              onChange={(e) => set("needsReview", e.target.checked)}
            />{" "}
            البيانات تحتاج مراجعة أو استكمالًا
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => set("pinned", e.target.checked)}
            />{" "}
            تثبيت الموقع في أعلى القائمة
          </label>
        </div>
      </fieldset>
      <div className="registry-form-actions">
        <button
          className="registry-button registry-primary"
          disabled={busy}
          type="submit"
        >
          {busy ? (
            <LoaderCircle
              className="loading-spin"
              size={18}
              aria-hidden="true"
            />
          ) : (
            <Check size={18} aria-hidden="true" />
          )}
          {busy ? "جارٍ الحفظ…" : "حفظ بيانات الموقع"}
        </button>
        <button
          className="registry-button"
          type="button"
          onClick={onCancel}
          disabled={busy}
        >
          إلغاء التعديل
        </button>
      </div>
    </form>
  );
}
