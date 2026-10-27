import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useMutation } from "convex/react";
import {
  ArrowUpLeft,
  MessageCircle,
  Phone,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import { api } from "../../convex/_generated/api";
import { useSettings } from "../hooks/useSettings";
import { SERVICES } from "../data/site";
import Seo from "../components/Seo";
import { PageIntro } from "../components/Studio";
const EMPTY = {
  name: "",
  phone: "",
  email: "",
  service: "",
  budget: "",
  timeline: "",
  message: "",
  website: "",
};
export default function Contact() {
  const settings = useSettings();
  const submit = useMutation(api.contact.submit);
  const [params] = useSearchParams();
  const requested = params.get("package") || params.get("service") || "";
  const [form, setForm] = useState({ ...EMPTY, service: requested });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setForm((f) => ({ ...f, service: requested }));
  }, [requested]);
  const set = (key: keyof typeof EMPTY, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "", submit: "" }));
  };
  async function send(e: FormEvent) {
    e.preventDefault();
    if (loading) return;
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "اكتب اسمك، حرفين على الأقل.";
    if (
      !/^\+?[\d\s()-]{8,24}$/.test(form.phone) ||
      form.phone.replace(/\D/g, "").length < 8 ||
      form.phone.replace(/\D/g, "").length > 15
    )
      next.phone = "اكتب رقم جوال صحيحًا مع رمز الدولة.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "اكتب بريدًا إلكترونيًا صحيحًا.";
    if (form.message.trim().length < 10)
      next.message = "أضف تفاصيل عن مشروعك، 10 أحرف على الأقل.";
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => {
        errorRef.current?.focus();
        document.getElementById(Object.keys(next)[0])?.focus();
      });
      return;
    }
    setLoading(true);
    try {
      const result = await submit({
        ...form,
        email: form.email || undefined,
        service: form.service || undefined,
        budget: form.budget || undefined,
        timeline: form.timeline || undefined,
      });
      if (!result.ok) {
        setErrors({ submit: result.error });
        requestAnimationFrame(() => errorRef.current?.focus());
        return;
      }
      setSent(true);
      setForm(EMPTY);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setErrors({
        submit: "تعذر إرسال طلبك. حاول مرة أخرى أو تواصل معنا عبر واتساب.",
      });
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally {
      setLoading(false);
    }
  }
  const options = [
    ...new Set([
      ...SERVICES.map((s) => s.title),
      "خدمة مفردة",
      "باقة الأعمال",
      "الإطلاق الرقمي الكامل",
      "أخرى",
      ...(requested ? [requested] : []),
    ]),
  ];
  return (
    <>
      <Seo
        title="تواصل معنا"
        path="/contact"
        description="تحدث مع أثر للتقنية والتصميم عن مشروعك عبر النموذج أو واتساب. مواقع وتطبيقات وهوية بصرية في قطر."
      />
      <div className="container contact-page">
        <PageIntro title="الأفكار الكبيرة، تبدأ بمحادثة.">
          احكِ لنا عن مشروعك وما تريد الوصول إليه. نقرأ التفاصيل ونرتّب معك
          الخطوة التالية.
        </PageIntro>
        <div className="contact-layout">
          <aside className="contact-aside">
            <h2>يسعدنا أن نسمع فكرتك.</h2>
            <p>
              فكرة أولية أو مشروع جاهز للتطوير؟ نساعدك على تحديد نقطة البداية.
            </p>
            <a
              className="contact-channel"
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={23} aria-hidden="true" />
              <span>
                محادثة عبر واتساب<small>تواصل مباشر مع أثر</small>
              </span>
              <ArrowUpLeft size={20} aria-hidden="true" />
            </a>
            <a
              className="contact-channel"
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
            >
              <Phone size={22} aria-hidden="true" />
              <span>
                اتصل بنا<small dir="ltr">{settings.phone}</small>
              </span>
              <ArrowUpLeft size={20} aria-hidden="true" />
            </a>
            {settings.email && (
              <a
                className="contact-email"
                href={`mailto:${settings.email}`}
                dir="ltr"
              >
                {settings.email}
              </a>
            )}
            <p className="contact-location">
              الدوحة، قطر
              <br />
              نرد عادةً خلال أقل من 24 ساعة.
            </p>
            <img
              src="/athr-mark.svg"
              alt=""
              width={130}
              height={130}
              className="contact-mark"
              aria-hidden="true"
            />
          </aside>
          <div className="contact-form-panel">
            {sent ? (
              <div className="contact-success" ref={successRef} tabIndex={-1}>
                <CheckCircle2 size={48} strokeWidth={1.3} aria-hidden="true" />
                <h2>وصلت فكرتك إلى أثر.</h2>
                <p>
                  شكرًا لمشاركة التفاصيل. سنتواصل معك عبر البيانات التي أرسلتها
                  لمناقشة الخطوة التالية.
                </p>
                <button
                  className="button"
                  type="button"
                  onClick={() => setSent(false)}
                >
                  إرسال طلب آخر
                </button>
                <Link className="text-link" to="/portfolio">
                  اكتشف أعمالنا
                </Link>
              </div>
            ) : (
              <form onSubmit={send} noValidate aria-busy={loading}>
                <h2>لنبدأ بتفاصيل مشروعك.</h2>
                <p className="form-hint">الحقول المعلّمة بنجمة مطلوبة.</p>
                {Object.values(errors).some(Boolean) && (
                  <div
                    className="form-error"
                    role="alert"
                    tabIndex={-1}
                    ref={errorRef}
                  >
                    {errors.submit || "راجع الحقول الموضحة أدناه لإرسال الطلب."}
                  </div>
                )}
                <div className="form-grid">
                  {[
                    {
                      key: "name",
                      label: "الاسم",
                      type: "text",
                      auto: "name",
                      placeholder: "اسمك الكريم…",
                      required: true,
                    },
                    {
                      key: "phone",
                      label: "رقم الجوال",
                      type: "tel",
                      auto: "tel",
                      placeholder: "+974 …",
                      required: true,
                    },
                    {
                      key: "email",
                      label: "البريد الإلكتروني",
                      type: "email",
                      auto: "email",
                      placeholder: "name@example.com",
                      required: false,
                    },
                  ].map((f) => (
                    <div
                      className={`field ${f.key === "email" ? "field-full" : ""}`}
                      key={f.key}
                    >
                      <label htmlFor={f.key}>
                        {f.label}
                        {f.required && <span aria-hidden="true"> *</span>}
                      </label>
                      <input
                        id={f.key}
                        name={f.key}
                        type={f.type}
                        autoComplete={f.auto}
                        required={f.required}
                        maxLength={
                          f.key === "name" ? 100 : f.key === "email" ? 254 : 24
                        }
                        placeholder={f.placeholder}
                        dir={f.type === "text" ? "rtl" : "ltr"}
                        spellCheck={false}
                        value={form[f.key as keyof typeof form]}
                        onChange={(e) =>
                          set(f.key as keyof typeof form, e.target.value)
                        }
                        aria-invalid={!!errors[f.key]}
                        aria-describedby={
                          errors[f.key] ? `${f.key}-error` : undefined
                        }
                      />
                      {errors[f.key] && (
                        <p className="field-error" id={`${f.key}-error`}>
                          {errors[f.key]}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="field field-full">
                    <label htmlFor="service">الخدمة أو الباقة</label>
                    <select
                      id="service"
                      name="service"
                      value={form.service}
                      onChange={(e) => set("service", e.target.value)}
                    >
                      <option value="">اختر الخدمة المناسبة…</option>
                      {options.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {[
                    {
                      key: "budget",
                      label: "الميزانية التقريبية — اختياري",
                      options: [
                        "أقل من 1,500 ر.ق",
                        "1,500–5,000 ر.ق",
                        "5,000–15,000 ر.ق",
                        "أكثر من 15,000 ر.ق",
                        "نحددها معًا",
                      ],
                    },
                    {
                      key: "timeline",
                      label: "الموعد المطلوب — اختياري",
                      options: [
                        "خلال أسبوعين",
                        "خلال شهر",
                        "خلال 1–3 أشهر",
                        "مرن، حسب نطاق العمل",
                      ],
                    },
                  ].map((f) => (
                    <div className="field" key={f.key}>
                      <label htmlFor={f.key}>{f.label}</label>
                      <select
                        id={f.key}
                        name={f.key}
                        value={form[f.key as "budget" | "timeline"]}
                        onChange={(e) =>
                          set(f.key as "budget" | "timeline", e.target.value)
                        }
                      >
                        <option value="">اختر إن رغبت…</option>
                        {f.options.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <div className="field field-full">
                    <label htmlFor="message">
                      عن مشروعك <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      minLength={10}
                      maxLength={5000}
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      placeholder="ما الفكرة؟ ولمن تقدمها؟ وما الذي تحتاج إلى تنفيذه؟"
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "message-error" : undefined
                      }
                    />
                    {errors.message && (
                      <p className="field-error" id="message-error">
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="honeypot" aria-hidden="true">
                  <label htmlFor="website">اترك هذا الحقل فارغًا</label>
                  <input
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                  />
                </div>
                <button
                  className="button submit-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <LoaderCircle
                        className="loading-spin"
                        size={20}
                        aria-hidden="true"
                      />{" "}
                      جارٍ إرسال الطلب…
                    </>
                  ) : (
                    <>
                      أرسل تفاصيل مشروعك{" "}
                      <ArrowUpLeft size={20} aria-hidden="true" />
                    </>
                  )}
                </button>
                <p className="form-privacy">
                  نستخدم بياناتك للرد على طلبك ومناقشة مشروعك.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
