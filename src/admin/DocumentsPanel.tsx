import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { money, totals, type DocItem } from "../components/InvoiceDocument";
import { nextStatuses } from "../../shared/documentStatus";
import AdminField from "./AdminField";
import { X } from "lucide-react";

const inputCls =
  "w-full px-4 py-2.5 rounded-xl text-sm text-[var(--admin-ink)] placeholder:text-[var(--admin-muted)] outline-none focus:border-[#EBDDC6]/40";
const inputStyle = {
  background: "var(--admin-surface)",
  border: "1px solid var(--admin-input-line)",
};
const goldBtn = { background: "var(--admin-soft)" };

const STATUS: Record<string, { label: string; cls: string }> = {
  draft: {
    label: "مسودة",
    cls: "bg-[var(--admin-subtle)] text-[var(--admin-muted)]",
  },
  sent: { label: "مُرسلة", cls: "bg-sky-400/15 text-sky-800" },
  accepted: { label: "مقبول", cls: "bg-emerald-400/15 text-emerald-800" },
  paid: { label: "مدفوعة", cls: "bg-emerald-400/15 text-emerald-800" },
  cancelled: { label: "ملغاة", cls: "bg-red-400/15 text-red-800" },
};

// Local calendar date (toISOString would give yesterday between midnight and 3am in Qatar)
const ymd = (x: Date) =>
  `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
const today = () => ymd(new Date());
const addDays = (d: string, n: number) => {
  const x = new Date(d + "T12:00:00");
  x.setDate(x.getDate() + n);
  return ymd(x);
};
const emptyItem = (): DocItem => ({ description: "", qty: 1, unitPrice: 0 });
const emptyForm = () => ({
  kind: "quote" as "invoice" | "quote",
  clientName: "",
  clientCompany: "",
  clientPhone: "",
  clientEmail: "",
  issueDate: today(),
  dueDate: "",
  items: [emptyItem()],
  discount: 0,
  paidAmount: 0,
  notes: "",
});

export default function DocumentsPanel({ token }: { token: string }) {
  const docs = useQuery(api.documents.list, { token });
  const billing = useQuery(api.documents.getBilling, { token });
  const create = useMutation(api.documents.create);
  const update = useMutation(api.documents.update);
  const setStatus = useMutation(api.documents.setStatus);
  const remove = useMutation(api.documents.remove);
  const convert = useMutation(api.documents.convertToInvoice);

  const [form, setForm] = useState(emptyForm());
  const [editId, setEditId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [filter, setFilter] = useState<"all" | "invoice" | "quote">("all");
  const [saving, setSaving] = useState(false);
  const [docError, setDocError] = useState("");
  const [docNotice, setDocNotice] = useState("");
  useEffect(() => {
    if (!open) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [open]);

  const openPrint = (id: string) => window.open(`/admin/doc/${id}`, "_blank");
  // Open the tab inside the click handler so popup blockers allow it, then navigate after the await.
  async function printAfter(task: () => Promise<unknown>) {
    const w = window.open("about:blank", "_blank");
    try {
      const id = await task();
      if (w) w.location.href = `/admin/doc/${id}`;
    } catch (e: any) {
      w?.close();
      setDocError("تعذّر حفظ المستند. راجع البيانات واتصالك ثم حاول مرة أخرى.");
    }
  }
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const setItem = (i: number, k: keyof DocItem, v: any) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((it, j) =>
        j === i ? { ...it, [k]: k === "description" ? v : Number(v) || 0 } : it,
      ),
    }));

  function startNew(kind: "invoice" | "quote") {
    setDocError("");
    setDocNotice("");
    const f = emptyForm();
    f.kind = kind;
    if (kind === "quote")
      f.dueDate = addDays(f.issueDate, billing?.quoteValidityDays ?? 15);
    setForm(f);
    setEditId(null);
    setOpen(true);
  }
  function startEdit(d: any) {
    setDocError("");
    setDocNotice("");
    setForm({
      kind: d.kind,
      clientName: d.clientName,
      clientCompany: d.clientCompany ?? "",
      clientPhone: d.clientPhone ?? "",
      clientEmail: d.clientEmail ?? "",
      issueDate: d.issueDate,
      dueDate: d.dueDate ?? "",
      items: d.items,
      discount: d.discount,
      paidAmount: d.paidAmount ?? 0,
      notes: d.notes ?? "",
    });
    setEditId(d._id);
    setOpen(true);
  }

  async function save(print: boolean) {
    if (saving) return;
    setDocError("");
    setDocNotice("");
    if (
      !form.clientName.trim() ||
      !form.items.some((i) => i.description.trim())
    )
      return setDocError("اكتب اسم العميل ووصف بند واحد على الأقل قبل الحفظ.");
    if (form.discount > subtotal)
      return setDocError("الخصم أكبر من المجموع. راجع قيمة الخصم.");
    if (form.paidAmount > total)
      return setDocError("المدفوع مقدمًا أكبر من الإجمالي. راجع المبلغ.");
    setSaving(true);
    const { kind, ...rest } = form;
    const data = {
      ...rest,
      items: rest.items.filter((i) => i.description.trim()),
      clientCompany: rest.clientCompany || undefined,
      clientPhone: rest.clientPhone || undefined,
      clientEmail: rest.clientEmail || undefined,
      dueDate: rest.dueDate || undefined,
      notes: rest.notes || undefined,
      paidAmount: rest.paidAmount || undefined,
    };
    const run = async () => {
      const id = editId
        ? (await update({ token, id: editId as any, ...data }), editId)
        : await create({ token, kind, ...data });
      setOpen(false);
      setEditId(null);
      setDocNotice("تم حفظ المستند.");
      return id;
    };
    try {
      print ? await printAfter(run) : await run();
    } catch (e: any) {
      setDocError("تعذّر حفظ المستند. راجع البيانات واتصالك ثم حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  }

  const { subtotal, total } = totals(form);
  const shown = (docs ?? []).filter(
    (d) => filter === "all" || d.kind === filter,
  );
  const convertedFrom = new Set(
    (docs ?? []).map((d) => d.sourceQuoteId).filter(Boolean),
  );

  return (
    <div className="admin-section max-w-6xl">
      <div className="admin-section-heading">
        <div>
          <h2 className="text-xl font-bold text-[var(--admin-ink)] mb-1">
            الفواتير وعروض الأسعار
          </h2>
          <p className="text-sm text-[var(--admin-muted)]">
            أنشئ، عدّل، واطبع PDF بهوية أثر.
          </p>
        </div>
        <div className="admin-actions">
          <button
            onClick={() => setShowBilling((v) => !v)}
            className="admin-button"
          >
            بيانات الفوترة
          </button>
          <button
            onClick={() => startNew("quote")}
            className="admin-button admin-button-primary"
          >
            + عرض سعر
          </button>
          <button onClick={() => startNew("invoice")} className="admin-button">
            + فاتورة
          </button>
        </div>
      </div>

      {docError && (
        <p role="alert" className="admin-feedback admin-feedback-error">
          {docError}
        </p>
      )}
      {docNotice && (
        <p role="status" className="admin-feedback admin-success">
          {docNotice}
        </p>
      )}

      {showBilling && (
        <BillingForm
          token={token}
          billing={billing}
          onDone={() => setShowBilling(false)}
        />
      )}

      {open && (
        <div
          className="admin-panel mb-6 space-y-5"
          style={{ background: "var(--admin-surface)" }}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--admin-ink)]">
              {editId ? "تعديل" : "جديد"}:{" "}
              {form.kind === "invoice" ? "فاتورة" : "عرض سعر"}
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-[var(--admin-muted)] hover:text-[var(--admin-ink)] text-sm"
            >
              إلغاء
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <AdminField label="اسم العميل *">
              <input
                name="clientName"
                autoComplete="off"
                className={inputCls}
                style={inputStyle}
                placeholder="اسم العميل *"
                value={form.clientName}
                onChange={(e) => set("clientName", e.target.value)}
              />
            </AdminField>
            <AdminField label="الشركة / الجهة">
              <input
                name="clientCompany"
                autoComplete="off"
                className={inputCls}
                style={inputStyle}
                placeholder="الشركة / الجهة"
                value={form.clientCompany}
                onChange={(e) => set("clientCompany", e.target.value)}
              />
            </AdminField>
            <AdminField label="رقم الجوال">
              <input
                type="tel"
                name="clientPhone"
                autoComplete="off"
                className={inputCls}
                style={inputStyle}
                placeholder="رقم الجوال"
                dir="ltr"
                value={form.clientPhone}
                onChange={(e) => set("clientPhone", e.target.value)}
              />
            </AdminField>
            <AdminField label="البريد الإلكتروني">
              <input
                type="email"
                spellCheck={false}
                name="clientEmail"
                autoComplete="off"
                className={inputCls}
                style={inputStyle}
                placeholder="البريد الإلكتروني"
                dir="ltr"
                value={form.clientEmail}
                onChange={(e) => set("clientEmail", e.target.value)}
              />
            </AdminField>
            <label className="admin-field">
              التاريخ
              <input
                type="date"
                className={inputCls + " mt-1"}
                style={inputStyle}
                value={form.issueDate}
                onChange={(e) => set("issueDate", e.target.value)}
              />
            </label>
            <label className="admin-field">
              {form.kind === "invoice" ? "تاريخ الاستحقاق" : "صالح حتى"}
              <input
                type="date"
                className={inputCls + " mt-1"}
                style={inputStyle}
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
              />
            </label>
          </div>

          <div>
            <h4 className="admin-subheading">بنود المستند</h4>
            <div className="space-y-2">
              {form.items.map((it, i) => (
                <div key={i} className="admin-document-item">
                  <AdminField label="البند / الوصف">
                    <textarea
                      rows={1}
                      className={inputCls + " resize-y"}
                      style={inputStyle}
                      placeholder="مثال: تصميم وتطوير موقع إلكتروني"
                      value={it.description}
                      onChange={(e) =>
                        setItem(i, "description", e.target.value)
                      }
                    />
                  </AdminField>
                  <AdminField label="الكمية">
                    <input
                      type="number"
                      min={0}
                      className={inputCls}
                      style={inputStyle}
                      dir="ltr"
                      value={it.qty}
                      onChange={(e) =>
                        setItem(
                          i,
                          "qty",
                          Math.max(0, Number(e.target.value) || 0),
                        )
                      }
                    />
                  </AdminField>
                  <AdminField label="سعر الوحدة">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      className={inputCls}
                      style={inputStyle}
                      dir="ltr"
                      value={it.unitPrice}
                      onChange={(e) =>
                        setItem(
                          i,
                          "unitPrice",
                          Math.max(0, Number(e.target.value) || 0),
                        )
                      }
                    />
                  </AdminField>
                  <div className="admin-item-amount" dir="ltr">
                    <span>المبلغ</span>
                    <strong>{money(it.qty * it.unitPrice)}</strong>
                  </div>
                  <button
                    onClick={() =>
                      set(
                        "items",
                        form.items.length > 1
                          ? form.items.filter((_, j) => j !== i)
                          : [emptyItem()],
                      )
                    }
                    className="admin-item-remove"
                    aria-label={`حذف البند ${i + 1}`}
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => set("items", [...form.items, emptyItem()])}
              className="admin-button mt-4"
            >
              + إضافة بند
            </button>
          </div>

          <div className="grid sm:grid-cols-[1fr_280px] gap-4">
            <AdminField label="ملاحظات المستند (اختياري)">
              <textarea
                name="notes"
                autoComplete="off"
                rows={3}
                className={inputCls}
                style={inputStyle}
                placeholder="ملاحظات تظهر في المستند (اختياري)"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </AdminField>
            <div
              className="rounded-xl p-4 space-y-2 text-sm"
              style={{ background: "var(--admin-surface)" }}
            >
              <div className="flex justify-between text-[var(--admin-muted)]">
                <span>المجموع</span>
                <span dir="ltr">{money(subtotal)}</span>
              </div>
              <label className="flex justify-between items-center text-[var(--admin-muted)] gap-3">
                <span>الخصم</span>
                <input
                  type="number"
                  min={0}
                  className="w-28 px-3 py-1.5 rounded-lg text-sm text-[var(--admin-ink)] outline-none"
                  style={inputStyle}
                  dir="ltr"
                  value={form.discount}
                  onChange={(e) =>
                    set("discount", Math.max(0, Number(e.target.value) || 0))
                  }
                />
              </label>
              <div className="flex justify-between font-bold text-[var(--admin-ink)] text-base pt-2 border-t border-[var(--admin-line)]">
                <span>الإجمالي</span>
                <span dir="ltr">{money(total)} QAR</span>
              </div>
              {form.kind === "invoice" && (
                <label className="flex justify-between items-center text-[var(--admin-muted)] gap-3">
                  <span>المدفوع مقدمًا</span>
                  <input
                    type="number"
                    min={0}
                    className="w-28 px-3 py-1.5 rounded-lg text-sm text-[var(--admin-ink)] outline-none"
                    style={inputStyle}
                    dir="ltr"
                    value={form.paidAmount}
                    onChange={(e) =>
                      set(
                        "paidAmount",
                        Math.max(0, Number(e.target.value) || 0),
                      )
                    }
                  />
                </label>
              )}
              {form.kind === "invoice" && form.paidAmount > 0 && (
                <div className="flex justify-between font-bold text-[var(--admin-accent)]">
                  <span>المتبقي</span>
                  <span dir="ltr">{money(total - form.paidAmount)} QAR</span>
                </div>
              )}
            </div>
          </div>

          <div className="admin-form-actions">
            <button
              disabled={saving}
              onClick={() => save(false)}
              className="admin-button"
            >
              {saving ? "جارٍ الحفظ…" : "حفظ المستند"}
            </button>
            <button
              disabled={saving}
              onClick={() => save(true)}
              className="admin-button admin-button-primary"
            >
              حفظ وطباعة PDF
            </button>
          </div>
        </div>
      )}

      <div className="admin-tabs" role="group" aria-label="تصفية المستندات">
        {(
          [
            ["all", "الكل"],
            ["quote", "عروض الأسعار"],
            ["invoice", "الفواتير"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            aria-pressed={filter === k}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${filter === k ? "bg-[#EBDDC6] text-[#7A1630]" : "text-[var(--admin-muted)] hover:text-[var(--admin-ink)]"}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div
        className="admin-table-wrap"
        style={{ background: "var(--admin-surface)" }}
      >
        {docs === undefined ? (
          <p className="p-6 text-[var(--admin-muted)] text-sm">
            جارٍ التحميل...
          </p>
        ) : shown.length === 0 ? (
          <p className="p-6 text-[var(--admin-muted)] text-sm">
            لا توجد مستندات بعد. ابدأ بعرض سعر أو فاتورة.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-[var(--admin-muted)] text-xs">
              <tr className="border-b border-[var(--admin-line)]">
                <th className="p-3 text-right">الرقم</th>
                <th className="p-3 text-right">العميل</th>
                <th className="p-3 text-right">التاريخ</th>
                <th className="p-3 text-right">الإجمالي</th>
                <th className="p-3 text-right">الحالة</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {shown.map((d) => (
                <tr
                  key={d._id}
                  className="border-b border-[var(--admin-line)] hover:bg-[var(--admin-subtle)]"
                >
                  <td
                    className="p-3 font-bold text-[var(--admin-ink)]"
                    dir="ltr"
                    style={{ textAlign: "right" }}
                  >
                    {d.number}
                  </td>
                  <td className="p-3 text-[var(--admin-ink)]">
                    {d.clientName}
                    {d.clientCompany && (
                      <span className="text-[var(--admin-muted)]">
                        {" "}
                        · {d.clientCompany}
                      </span>
                    )}
                  </td>
                  <td
                    className="p-3 text-[var(--admin-muted)]"
                    dir="ltr"
                    style={{ textAlign: "right" }}
                  >
                    {d.issueDate}
                  </td>
                  <td
                    className="p-3 font-bold text-[var(--admin-ink)]"
                    dir="ltr"
                    style={{ textAlign: "right" }}
                  >
                    {money(totals(d).total)}
                  </td>
                  <td className="p-3">
                    <select
                      value={d.status}
                      onChange={(e) =>
                        setStatus({
                          token,
                          id: d._id,
                          status: e.target.value as any,
                        }).catch((err) => alert(err.message))
                      }
                      className={`px-2 py-1 rounded-lg text-xs font-bold outline-none ${STATUS[d.status].cls}`}
                      style={{ border: 0 }}
                    >
                      {[d.status, ...nextStatuses(d.kind, d.status)].map(
                        (s) => (
                          <option key={s} value={s}>
                            {STATUS[s].label}
                          </option>
                        ),
                      )}
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 justify-end flex-wrap">
                      <button
                        onClick={() => openPrint(d._id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#7A1630]"
                        style={goldBtn}
                      >
                        PDF
                      </button>
                      {d.status === "draft" && (
                        <button
                          onClick={() => startEdit(d)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[var(--admin-muted)] border border-[var(--admin-line)]"
                        >
                          تعديل
                        </button>
                      )}
                      {d.kind === "quote" &&
                        d.status === "accepted" &&
                        (convertedFrom.has(d._id) ? (
                          <span className="px-2.5 py-1.5 text-xs font-bold text-emerald-800/70">
                            محوّل لفاتورة ✓
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              printAfter(() => convert({ token, id: d._id }))
                            }
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-800 border border-emerald-400/20"
                          >
                            تحويل لفاتورة
                          </button>
                        ))}
                      {d.status === "draft" && !convertedFrom.has(d._id) && (
                        <button
                          onClick={() =>
                            confirm(`حذف ${d.number}؟`) &&
                            remove({ token, id: d._id }).catch((e) =>
                              alert(e.message),
                            )
                          }
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-800/80 border border-red-400/20"
                        >
                          حذف
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function BillingForm({
  token,
  billing,
  onDone,
}: {
  token: string;
  billing: any;
  onDone: () => void;
}) {
  const upsert = useMutation(api.documents.upsertBilling);
  const [billingSaving, setBillingSaving] = useState(false);
  const [billingError, setBillingError] = useState("");
  const [f, setF] = useState({
    crNumber: "",
    bankName: "",
    accountName: "",
    iban: "",
    paymentTerms: "",
    quoteValidityDays: 15,
  });
  useEffect(() => {
    if (billing)
      setF({
        crNumber: billing.crNumber ?? "",
        bankName: billing.bankName ?? "",
        accountName: billing.accountName ?? "",
        iban: billing.iban ?? "",
        paymentTerms: billing.paymentTerms ?? "",
        quoteValidityDays: billing.quoteValidityDays ?? 15,
      });
  }, [billing]);
  const opt = (s: string) => s.trim() || undefined;

  return (
    <div
      className="admin-panel mb-6 space-y-5"
      style={{ background: "var(--admin-surface)" }}
    >
      <h3 className="text-lg font-bold text-[var(--admin-ink)]">
        بيانات الفوترة (تظهر في كل مستند)
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <AdminField label="رقم السجل التجاري">
          <input
            name="crNumber"
            autoComplete="off"
            className={inputCls}
            style={inputStyle}
            placeholder="رقم السجل التجاري"
            dir="ltr"
            value={f.crNumber}
            onChange={(e) => setF({ ...f, crNumber: e.target.value })}
          />
        </AdminField>
        <AdminField label="اسم البنك">
          <input
            name="bankName"
            autoComplete="off"
            className={inputCls}
            style={inputStyle}
            placeholder="اسم البنك"
            value={f.bankName}
            onChange={(e) => setF({ ...f, bankName: e.target.value })}
          />
        </AdminField>
        <AdminField label="اسم صاحب الحساب">
          <input
            name="accountName"
            autoComplete="off"
            className={inputCls}
            style={inputStyle}
            placeholder="اسم صاحب الحساب"
            value={f.accountName}
            onChange={(e) => setF({ ...f, accountName: e.target.value })}
          />
        </AdminField>
        <AdminField label="IBAN">
          <input
            name="iban"
            autoComplete="off"
            className={inputCls}
            style={inputStyle}
            placeholder="IBAN"
            dir="ltr"
            value={f.iban}
            onChange={(e) => setF({ ...f, iban: e.target.value })}
          />
        </AdminField>
        <label className="admin-field">
          صلاحية عرض السعر (أيام)
          <input
            type="number"
            min={1}
            className={inputCls + " mt-1"}
            style={inputStyle}
            dir="ltr"
            value={f.quoteValidityDays}
            onChange={(e) =>
              setF({ ...f, quoteValidityDays: Number(e.target.value) || 15 })
            }
          />
        </label>
      </div>
      <AdminField label="شروط الدفع">
        <textarea
          name="paymentTerms"
          autoComplete="off"
          rows={3}
          className={inputCls}
          style={inputStyle}
          placeholder="شروط الدفع — مثال: 50% دفعة مقدمة عند الاتفاق، و50% عند التسليم."
          value={f.paymentTerms}
          onChange={(e) => setF({ ...f, paymentTerms: e.target.value })}
        />
      </AdminField>
      <button
        onClick={async () => {
          if (billingSaving) return;
          setBillingSaving(true);
          setBillingError("");
          try {
            await upsert({
              token,
              crNumber: opt(f.crNumber),
              bankName: opt(f.bankName),
              accountName: opt(f.accountName),
              iban: opt(f.iban),
              paymentTerms: opt(f.paymentTerms),
              quoteValidityDays: f.quoteValidityDays,
            });
            onDone();
          } catch {
            setBillingError(
              "تعذّر حفظ بيانات الفوترة. راجع القيم وحاول مرة أخرى.",
            );
          } finally {
            setBillingSaving(false);
          }
        }}
        disabled={billingSaving}
        className="admin-button admin-button-primary"
      >
        {billingSaving ? "جارٍ الحفظ…" : "حفظ بيانات الفوترة"}
      </button>
      {billingError && (
        <p role="alert" className="admin-feedback admin-feedback-error">
          {billingError}
        </p>
      )}
    </div>
  );
}
