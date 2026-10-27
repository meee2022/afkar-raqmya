import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpLeft, Check, Plus, Minus } from "lucide-react";
import Seo from "../components/Seo";
import { PageIntro, StudioCta } from "../components/Studio";
const PACKAGES = [
  {
    title: "خدمة مفردة",
    description: "لخطوة محددة تحتاجها في مشروعك.",
    price: "200",
    unit: "ر.ق",
    featured: false,
    features: [
      "خدمة واحدة حسب الاختيار",
      "مراجعتان مجانيتان",
      "تسليم خلال 5–7 أيام",
      "ملفات المشروع كاملة",
      "دعم فني لأسبوع",
    ],
  },
  {
    title: "باقة الأعمال",
    description: "حضور متناسق لمشروعك التجاري.",
    price: "1,500",
    unit: "ر.ق",
    featured: true,
    features: [
      "موقع إلكتروني احترافي",
      "هوية بصرية أساسية",
      "3 قوالب سوشيال ميديا",
      "دعم تقني شهر كامل",
      "مراجعات غير محدودة ضمن النطاق المتفق عليه",
      "تسليم خلال 14 يومًا",
    ],
  },
  {
    title: "الإطلاق الرقمي الكامل",
    description: "تجربة متكاملة، نحدد نطاقها معك.",
    price: "حسب مشروعك",
    unit: "",
    featured: false,
    features: [
      "موقع وتطبيق جوال",
      "هوية بصرية شاملة",
      "فيديو ترويجي احترافي",
      "قوالب سوشيال كاملة",
      "دعم تقني 3 أشهر",
      "مدير مشروع مخصص",
    ],
  },
];
const FAQS = [
  {
    q: "كم يستغرق تسليم المشروع؟",
    a: "يعتمد على حجم المشروع ونطاقه وتوفير المحتوى. الخدمة المفردة عادةً 5–7 أيام، وباقة الأعمال 14 يومًا، والإطلاق الكامل حسب الاتفاق.",
  },
  {
    q: "هل يمكن التعديل بعد التسليم؟",
    a: "نعم، حسب المراجعات والدعم المشمولين في الباقة. نحدد نطاق التعديلات معك قبل بدء العمل، وتتوفر خيارات دعم مستمر.",
  },
  {
    q: "ما طرق الدفع المتاحة؟",
    a: "التحويل البنكي وNAPS وOoredoo Money، مع تأكيد الوسيلة المتاحة عند الاتفاق. ويمكن الاتفاق على دفعات مرحلية للمشاريع الكبيرة.",
  },
  {
    q: "هل تعملون مع عملاء خارج قطر؟",
    a: "نعم، يمكن تنفيذ المشاريع والتواصل والمتابعة عن بُعد لعملاء الخليج والدول العربية.",
  },
  {
    q: "هل تشمل الباقات الاستضافة والدومين؟",
    a: "الاستضافة والدومين منفصلان، ونساعدك في اختيار المناسب. نوضح تكاليفهما قبل التنفيذ.",
  },
  {
    q: "كيف يتم التواصل خلال المشروع؟",
    a: "عبر واتساب والبريد عند توفره، مع الاتفاق على مواعيد المتابعة والمراجعات قبل البدء.",
  },
];
export default function Packages() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <Seo
        title="الباقات والأسعار"
        path="/packages"
        description="باقات أثر للتقنية والتصميم: خدمة مفردة، باقة الأعمال، أو إطلاق رقمي متكامل. تعرف على المخرجات واطلب العرض المناسب."
      />
      <div className="container">
        <PageIntro title="البداية التي تناسب مشروعك.">
          باقات مرنة، ومخرجات واضحة. نحدد التفاصيل معك قبل البدء، لتعرف ما الذي
          ستحصل عليه.
        </PageIntro>
        <div className="pricing-grid">
          {PACKAGES.map((p) => (
            <section
              key={p.title}
              className={`pricing-card ${p.featured ? "pricing-featured" : ""}`}
            >
              {p.featured && (
                <span className="pricing-recommendation">
                  لحضور رقمي متكامل
                </span>
              )}
              <h2>{p.title}</h2>
              <p>{p.description}</p>
              <div className="price-block">
                {p.unit && <span>يبدأ من</span>}
                <strong dir={p.unit ? "ltr" : "rtl"}>
                  {p.price} <small>{p.unit}</small>
                </strong>
              </div>
              <ul>
                {p.features.map((f) => (
                  <li key={f}>
                    <Check size={18} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                className={`button ${p.featured ? "button-cream" : "button-outline"}`}
                to={`/contact?package=${encodeURIComponent(p.title)}`}
              >
                ناقش هذه الباقة <ArrowUpLeft size={18} aria-hidden="true" />
              </Link>
            </section>
          ))}
        </div>
        <p className="pricing-note">
          الأسعار بالريال القطري. السعر النهائي والمدة يتحددان حسب نطاق العمل
          والمحتوى. الاستضافة والدومين منفصلان.
        </p>
        <section className="faq-section section">
          <div>
            <h2>أسئلة قبل البداية.</h2>
            <p>تفاصيل تساعدك على اختيار الخطوة المناسبة.</p>
            <Link className="text-link" to="/contact">
              لديك سؤال آخر؟ <ArrowUpLeft size={18} />
            </Link>
          </div>
          <div>
            {FAQS.map((f, i) => (
              <div className="faq-item" key={f.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open === i}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    {f.q}
                    {open === i ? (
                      <Minus size={19} aria-hidden="true" />
                    ) : (
                      <Plus size={19} aria-hidden="true" />
                    )}
                  </button>
                </h3>
                <div id={`faq-${i}`} hidden={open !== i}>
                  <p>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <StudioCta />
    </>
  );
}
