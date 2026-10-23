import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { money, totals, type DocItem } from "../components/InvoiceDocument";

const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-white/25 outline-none focus:border-[#EBDDC6]/40";
const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" };
const goldBtn = { background: "linear-gradient(135deg,#EBDDC6,#C9A97A)" };

const STATUS: Record<string, { label: string; cls: string }> = {
  draft:     { label: "مسودة",  cls: "bg-white/10 text-white/60" },
  sent:      { label: "مُرسلة", cls: "bg-sky-400/15 text-sky-300" },
  accepted:  { label: "مقبول",  cls: "bg-emerald-400/15 text-emerald-300" },
  paid:      { label: "مدفوعة", cls: "bg-emerald-400/15 text-emerald-300" },
  cancelled: { label: "ملغاة",  cls: "bg-red-400/15 text-red-300" },
};

// Local calendar date (toISOString would give yesterday between midnight and 3am in Qatar)
const ymd = (x: Date) => `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
const today = () => ymd(new Date());
const addDays = (d: string, n: number) => { const x = new Date(d + "T12:00:00"); x.setDate(x.getDate() + n); return ymd(x); };
const emptyItem = (): DocItem => ({ description: "", qty: 1, unitPrice: 0 });
const emptyForm = () => ({
  kind: "quote" as "invoice" | "quote", clientName: "", clientCompany: "", clientPhone: "", clientEmail: "",
  issueDate: today(), dueDate: "", items: [emptyItem()], discount: 0, paidAmount: 0, notes: "",
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

  const openPrint = (id: string) => window.open(`/admin/doc/${id}`, "_blank");
  // Open the tab inside the click handler so popup blockers allow it, then navigate after the await.
  async function printAfter(task: () => Promise<unknown>) {
    const w = window.open("about:blank", "_blank");
    try { const id = await task(); if (w) w.location.href = `/admin/doc/${id}`; }
    catch (e: any) { w?.close(); alert(e?.message ?? "تعذر الحفظ"); }
  }
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const setItem = (i: number, k: keyof DocItem, v: any) =>
    setForm(f => ({ ...f, items: f.items.map((it, j) => j === i ? { ...it, [k]: k === "description" ? v : Number(v) || 0 } : it) }));

  function startNew(kind: "invoice" | "quote") {
    const f = emptyForm(); f.kind = kind;
    if (kind === "quote") f.dueDate = addDays(f.issueDate, billing?.quoteValidityDays ?? 15);
    setForm(f); setEditId(null); setOpen(true);
  }
  function startEdit(d: any) {
    setForm({ kind: d.kind, clientName: d.clientName, clientCompany: d.clientCompany ?? "", clientPhone: d.clientPhone ?? "",
      clientEmail: d.clientEmail ?? "", issueDate: d.issueDate, dueDate: d.dueDate ?? "", items: d.items, discount: d.discount, paidAmount: d.paidAmount ?? 0, notes: d.notes ?? "" });
    setEditId(d._id); setOpen(true);
  }

  async function save(print: boolean) {
    if (!form.clientName.trim() || !form.items.some(i => i.description.trim())) return alert("اكتب اسم العميل وبندًا واحدًا على الأقل");
    if (form.discount > subtotal) return alert("الخصم أكبر من المجموع");
    if (form.paidAmount > total) return alert("المدفوع مقدمًا أكبر من الإجمالي");
    setSaving(true);
    const { kind, ...rest } = form;
    const data = {
      ...rest,
      items: rest.items.filter(i => i.description.trim()),
      clientCompany: rest.clientCompany || undefined, clientPhone: rest.clientPhone || undefined,
      clientEmail: rest.clientEmail || undefined, dueDate: rest.dueDate || undefined, notes: rest.notes || undefined,
      paidAmount: rest.paidAmount || undefined,
    };
    const run = async () => {
      const id = editId ? (await update({ token, id: editId as any, ...data }), editId) : await create({ token, kind, ...data });
      setOpen(false); setEditId(null);
      return id;
    };
    try { print ? await printAfter(run) : await run(); }
    catch (e: any) { alert(e?.message ?? "تعذر الحفظ"); }
    finally { setSaving(false); }
  }

  const { subtotal, total } = totals(form);
  const shown = (docs ?? []).filter(d => filter === "all" || d.kind === filter);
  const convertedFrom = new Set((docs ?? []).map(d => d.sourceQuoteId).filter(Boolean));

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-black text-white mb-1">الفواتير وعروض الأسعار</h2>
          <p className="text-sm text-white/40">أنشئ، عدّل، واطبع PDF بهوية أثر.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBilling(v => !v)} className="px-4 py-2.5 rounded-xl text-sm font-bold text-white/70 border border-white/10 hover:text-white">بيانات الفوترة</button>
          <button onClick={() => startNew("quote")} className="px-4 py-2.5 rounded-xl text-sm font-black text-[#7A1630]" style={goldBtn}>+ عرض سعر</button>
          <button onClick={() => startNew("invoice")} className="px-4 py-2.5 rounded-xl text-sm font-black text-[#7A1630]" style={goldBtn}>+ فاتورة</button>
        </div>
      </div>

      {showBilling && <BillingForm token={token} billing={billing} onDone={() => setShowBilling(false)} />}

      {open && (
        <div className="rounded-2xl border border-white/[0.07] p-6 mb-6 space-y-5" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white">{editId ? "تعديل" : "جديد"}: {form.kind === "invoice" ? "فاتورة" : "عرض سعر"}</h3>
            <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white text-sm">إلغاء</button>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <input className={inputCls} style={inputStyle} placeholder="اسم العميل *" value={form.clientName} onChange={e => set("clientName", e.target.value)} />
            <input className={inputCls} style={inputStyle} placeholder="الشركة / الجهة" value={form.clientCompany} onChange={e => set("clientCompany", e.target.value)} />
            <input className={inputCls} style={inputStyle} placeholder="رقم الجوال" dir="ltr" value={form.clientPhone} onChange={e => set("clientPhone", e.target.value)} />
            <input className={inputCls} style={inputStyle} placeholder="البريد الإلكتروني" dir="ltr" value={form.clientEmail} onChange={e => set("clientEmail", e.target.value)} />
            <label className="text-xs text-white/50">التاريخ
              <input type="date" className={inputCls + " mt-1"} style={inputStyle} value={form.issueDate} onChange={e => set("issueDate", e.target.value)} />
            </label>
            <label className="text-xs text-white/50">{form.kind === "invoice" ? "تاريخ الاستحقاق" : "صالح حتى"}
              <input type="date" className={inputCls + " mt-1"} style={inputStyle} value={form.dueDate} onChange={e => set("dueDate", e.target.value)} />
            </label>
          </div>

          <div>
            <div className="grid grid-cols-[1fr_80px_120px_110px_36px] gap-2 text-xs font-bold text-white/40 mb-2 px-1">
              <span>البند / الوصف</span><span>الكمية</span><span>سعر الوحدة</span><span>المبلغ</span><span />
            </div>
            <div className="space-y-2">
              {form.items.map((it, i) => (
                <div key={i} className="grid grid-cols-[1fr_80px_120px_110px_36px] gap-2 items-start">
                  <textarea rows={1} className={inputCls + " resize-y"} style={inputStyle} placeholder="مثال: تصميم وتطوير موقع إلكتروني" value={it.description} onChange={e => setItem(i, "description", e.target.value)} />
                  <input type="number" min={0} className={inputCls} style={inputStyle} dir="ltr" value={it.qty} onChange={e => setItem(i, "qty", Math.max(0, Number(e.target.value) || 0))} />
                  <input type="number" min={0} step="0.01" className={inputCls} style={inputStyle} dir="ltr" value={it.unitPrice} onChange={e => setItem(i, "unitPrice", Math.max(0, Number(e.target.value) || 0))} />
                  <div className="py-2.5 text-sm font-bold text-white text-center" dir="ltr">{money(it.qty * it.unitPrice)}</div>
                  <button onClick={() => set("items", form.items.length > 1 ? form.items.filter((_, j) => j !== i) : [emptyItem()])}
                    className="h-10 rounded-xl text-red-300/70 hover:text-red-300 hover:bg-red-500/10" aria-label="حذف البند">✕</button>
                </div>
              ))}
            </div>
            <button onClick={() => set("items", [...form.items, emptyItem()])} className="mt-3 text-sm font-bold text-[#EBDDC6] hover:underline">+ إضافة بند</button>
          </div>

          <div className="grid sm:grid-cols-[1fr_280px] gap-4">
            <textarea rows={3} className={inputCls} style={inputStyle} placeholder="ملاحظات تظهر في المستند (اختياري)" value={form.notes} onChange={e => set("notes", e.target.value)} />
            <div className="rounded-xl p-4 space-y-2 text-sm" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="flex justify-between text-white/60"><span>المجموع</span><span dir="ltr">{money(subtotal)}</span></div>
              <label className="flex justify-between items-center text-white/60 gap-3"><span>الخصم</span>
                <input type="number" min={0} className="w-28 px-3 py-1.5 rounded-lg text-sm text-white outline-none" style={inputStyle} dir="ltr" value={form.discount} onChange={e => set("discount", Math.max(0, Number(e.target.value) || 0))} />
              </label>
              <div className="flex justify-between font-black text-white text-base pt-2 border-t border-white/10"><span>الإجمالي</span><span dir="ltr">{money(total)} QAR</span></div>
              {form.kind === "invoice" && <label className="flex justify-between items-center text-white/60 gap-3"><span>المدفوع مقدمًا</span>
                <input type="number" min={0} className="w-28 px-3 py-1.5 rounded-lg text-sm text-white outline-none" style={inputStyle} dir="ltr" value={form.paidAmount} onChange={e => set("paidAmount", Math.max(0, Number(e.target.value) || 0))} />
              </label>}
              {form.kind === "invoice" && form.paidAmount > 0 && <div className="flex justify-between font-bold text-[#EBDDC6]"><span>المتبقي</span><span dir="ltr">{money(total - form.paidAmount)} QAR</span></div>}
            </div>
          </div>

          <div className="flex gap-2">
            <button disabled={saving} onClick={() => save(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white border border-white/15 disabled:opacity-50">حفظ</button>
            <button disabled={saving} onClick={() => save(true)} className="px-5 py-2.5 rounded-xl text-sm font-black text-[#7A1630] disabled:opacity-50" style={goldBtn}>حفظ وطباعة PDF</button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-3">
        {([["all", "الكل"], ["quote", "عروض الأسعار"], ["invoice", "الفواتير"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${filter === k ? "bg-[#EBDDC6] text-[#7A1630]" : "text-white/50 hover:text-white"}`}>{l}</button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/[0.07] overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
        {docs === undefined ? <p className="p-6 text-white/40 text-sm">جارٍ التحميل...</p>
          : shown.length === 0 ? <p className="p-6 text-white/40 text-sm">لا توجد مستندات بعد. ابدأ بعرض سعر أو فاتورة.</p>
          : (
          <table className="w-full text-sm">
            <thead className="text-white/40 text-xs">
              <tr className="border-b border-white/[0.07]">
                <th className="p-3 text-right">الرقم</th><th className="p-3 text-right">العميل</th><th className="p-3 text-right">التاريخ</th>
                <th className="p-3 text-right">الإجمالي</th><th className="p-3 text-right">الحالة</th><th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {shown.map(d => (
                <tr key={d._id} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                  <td className="p-3 font-bold text-white" dir="ltr" style={{ textAlign: "right" }}>{d.number}</td>
                  <td className="p-3 text-white/80">{d.clientName}{d.clientCompany && <span className="text-white/40"> · {d.clientCompany}</span>}</td>
                  <td className="p-3 text-white/50" dir="ltr" style={{ textAlign: "right" }}>{d.issueDate}</td>
                  <td className="p-3 font-bold text-white" dir="ltr" style={{ textAlign: "right" }}>{money(totals(d).total)}</td>
                  <td className="p-3">
                    <select value={d.status} onChange={e => setStatus({ token, id: d._id, status: e.target.value as any }).catch(err => alert(err.message))}
                      className={`px-2 py-1 rounded-lg text-xs font-bold outline-none ${STATUS[d.status].cls}`} style={{ border: 0 }}>
                      {(d.kind === "invoice" ? ["draft", "sent", "paid", "cancelled"] : ["draft", "sent", "accepted", "cancelled"]).filter(s => s !== "draft" || d.status === "draft").map(s => <option key={s} value={s}>{STATUS[s].label}</option>)}
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1 justify-end flex-wrap">
                      <button onClick={() => openPrint(d._id)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#7A1630]" style={goldBtn}>PDF</button>
                      {d.status === "draft" && <button onClick={() => startEdit(d)} className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white/70 border border-white/10">تعديل</button>}
                      {d.kind === "quote" && d.status !== "cancelled" && (convertedFrom.has(d._id)
                        ? <span className="px-2.5 py-1.5 text-xs font-bold text-emerald-300/70">محوّل لفاتورة ✓</span>
                        : <button onClick={() => printAfter(() => convert({ token, id: d._id }))} className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-emerald-300 border border-emerald-400/20">تحويل لفاتورة</button>)}
                      {d.status === "draft" && !convertedFrom.has(d._id) && (
                        <button onClick={() => confirm(`حذف ${d.number}؟`) && remove({ token, id: d._id }).catch(e => alert(e.message))} className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-300/80 border border-red-400/20">حذف</button>
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

function BillingForm({ token, billing, onDone }: { token: string; billing: any; onDone: () => void }) {
  const upsert = useMutation(api.documents.upsertBilling);
  const [f, setF] = useState({ crNumber: "", bankName: "", accountName: "", iban: "", paymentTerms: "", quoteValidityDays: 15 });
  useEffect(() => {
    if (billing) setF({ crNumber: billing.crNumber ?? "", bankName: billing.bankName ?? "", accountName: billing.accountName ?? "",
      iban: billing.iban ?? "", paymentTerms: billing.paymentTerms ?? "", quoteValidityDays: billing.quoteValidityDays ?? 15 });
  }, [billing]);
  const opt = (s: string) => s.trim() || undefined;

  return (
    <div className="rounded-2xl border border-white/[0.07] p-6 mb-6 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
      <h3 className="text-lg font-black text-white">بيانات الفوترة (تظهر في كل مستند)</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <input className={inputCls} style={inputStyle} placeholder="رقم السجل التجاري" dir="ltr" value={f.crNumber} onChange={e => setF({ ...f, crNumber: e.target.value })} />
        <input className={inputCls} style={inputStyle} placeholder="اسم البنك" value={f.bankName} onChange={e => setF({ ...f, bankName: e.target.value })} />
        <input className={inputCls} style={inputStyle} placeholder="اسم صاحب الحساب" value={f.accountName} onChange={e => setF({ ...f, accountName: e.target.value })} />
        <input className={inputCls} style={inputStyle} placeholder="IBAN" dir="ltr" value={f.iban} onChange={e => setF({ ...f, iban: e.target.value })} />
        <label className="text-xs text-white/50">صلاحية عرض السعر (أيام)
          <input type="number" min={1} className={inputCls + " mt-1"} style={inputStyle} dir="ltr" value={f.quoteValidityDays} onChange={e => setF({ ...f, quoteValidityDays: Number(e.target.value) || 15 })} />
        </label>
      </div>
      <textarea rows={3} className={inputCls} style={inputStyle} placeholder="شروط الدفع — مثال: 50% دفعة مقدمة عند الاتفاق، و50% عند التسليم." value={f.paymentTerms} onChange={e => setF({ ...f, paymentTerms: e.target.value })} />
      <button onClick={async () => { await upsert({ token, crNumber: opt(f.crNumber), bankName: opt(f.bankName), accountName: opt(f.accountName), iban: opt(f.iban), paymentTerms: opt(f.paymentTerms), quoteValidityDays: f.quoteValidityDays }); onDone(); }}
        className="px-5 py-2.5 rounded-xl text-sm font-black text-[#7A1630]" style={goldBtn}>حفظ البيانات</button>
    </div>
  );
}
