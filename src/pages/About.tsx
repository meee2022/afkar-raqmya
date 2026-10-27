import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Seo from "../components/Seo";
import { PageIntro, StudioCta } from "../components/Studio";
import { useProjects } from "../hooks/useProjects";
export default function About() {
  const { projects, loading } = useProjects();
  return (
    <>
      <Seo
        title="عن أثر"
        path="/about"
        description="تعرّف على أثر للتقنية والتصميم: نجمع فهم الفكرة والتصميم والتطوير لبناء حضور رقمي يعكس قيمة مشروعك."
      />
      <div className="container">
        <PageIntro title="نؤمن أن التفاصيل تصنع الأثر.">
          أثر للتقنية والتصميم. نحول الأفكار إلى مواقع وتطبيقات وهويات بصرية،
          بعناية تمتد من أول محادثة إلى لحظة الإطلاق.
        </PageIntro>
        <section className="about-manifesto">
          <div>
            <h2>
              مشروعك له شخصيته.
              <br />
              وتصميمه ينبغي أن يشبهه.
            </h2>
            <p>
              نبدأ بفهم ما تقدمه، ولمن تقدمه، وما الذي تريد الوصول إليه. ثم نجمع
              التصميم والتقنية والمحتوى لنمنح الفكرة شكلًا واضحًا وتجربة سهلة
              الاستخدام.
            </p>
            <p>
              من الدوحة، نعمل على حلول رقمية للأعمال والأفراد، مع تواصل مباشر
              ونطاق عمل واضح ومتابعة حسب الاتفاق.
            </p>
            <Link className="text-link" to="/portfolio">
              شاهد أثر ذلك في أعمالنا <ArrowLeft size={19} aria-hidden="true" />
            </Link>
          </div>
          <div className="about-brand">
            <img
              src="/athr-mark-ondark.svg"
              alt="شعار أثر للتقنية والتصميم"
              width={280}
              height={280}
            />
            <span>نبتكر لنترك أثرًا.</span>
          </div>
        </section>
        <section className="section">
          <div className="section-heading">
            <h2>ما نعتمد عليه، في كل مشروع.</h2>
          </div>
          <div className="values-grid">
            {[
              {
                t: "فهم قبل التنفيذ",
                d: "نحدد الاحتياج والأولويات ونطاق المشروع قبل الدخول في التفاصيل.",
              },
              {
                t: "هوية متناسقة",
                d: "نربط الشكل والمحتوى وطريقة الاستخدام في تجربة واحدة.",
              },
              {
                t: "وضوح في العمل",
                d: "نتفق على المخرجات والمدة وآلية المراجعات والتواصل.",
              },
              {
                t: "عناية بالتجربة",
                d: "نراجع الاستخدام على الأجهزة المختلفة ونرتّب تفاصيل التسليم.",
              },
            ].map((v) => (
              <div key={v.t}>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="about-proof">
          <div>
            <h2>أعمال متنوعة، واهتمام بالتفاصيل.</h2>
            <p>
              من تجارب التعليم واللياقة إلى الضيافة والتجارة، تختلف المجالات
              وتبقى العناية بالمشروع.
            </p>
          </div>
          {!loading && projects.length > 0 && (
            <p className="proof-note">
              استكشف {projects.length} مشروعًا في{" "}
              {new Set(projects.map((p) => p.category)).size} مجالات.
            </p>
          )}
          <Link className="button button-outline" to="/portfolio">
            استكشف الأعمال <ArrowLeft size={19} aria-hidden="true" />
          </Link>
        </section>
      </div>
      <StudioCta />
    </>
  );
}
