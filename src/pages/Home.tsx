import { ArrowLeft, ArrowUpLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import {
  ProjectTile,
  ProjectSkeletons,
  ServiceIcon,
  StudioCta,
} from "../components/Studio";
import { useProjects } from "../hooks/useProjects";
import { SERVICES } from "../data/site";

export default function Home() {
  const { projects, loading } = useProjects();
  const selected = [
    ...projects.filter((p) => p.featured),
    ...projects.filter((p) => !p.featured),
  ].slice(0, 3);
  const hero =
    projects.find((p) => p.seedKey === "s0" || p.slug === "marasi-boats") ??
    selected[0];
  return (
    <>
      <Seo
        title="أثر"
        path="/"
        description="أثر للتقنية والتصميم في قطر. تصميم وتطوير المواقع والتطبيقات والهوية البصرية والمحتوى المرئي، من الفكرة إلى الإطلاق."
      />
      <section className="home-hero container">
        <div className="hero-copy">
          <h1>
            نصنع حضورًا
            <br />
            يترك أثرًا.
          </h1>
          <p>
            بين الفكرة وأثرها، نصمّم ونطوّر.
            <br />
            مواقع، تطبيقات وهويات بصرية تحكي مشروعك
            <br className="desktop-break" /> بالطريقة التي يستحقها.
          </p>
          <div className="hero-actions">
            <Link className="button" to="/contact">
              ابدأ مشروعك <ArrowUpLeft size={21} aria-hidden="true" />
            </Link>
            <Link className="text-link" to="/portfolio">
              اكتشف أعمالنا <ArrowLeft size={19} aria-hidden="true" />
            </Link>
          </div>
          <div className="hero-note">
            <span className="gold-line" /> من قطر، لأفكار تستحق أن تُرى.
          </div>
        </div>
        <div className="hero-stage">
          <div className="hero-arch">
            <img
              className="hero-mark"
              src="/athr-mark-ondark.svg"
              alt=""
              width={320}
              height={320}
              aria-hidden="true"
            />
            <div className="hero-window">
              <div className="window-bar">
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <b dir="ltr">ATHR / SELECTED WORK</b>
              </div>
              {hero?.imageUrl ? (
                <img
                  src={hero.imageUrl}
                  alt={`معاينة ${hero.titleAr}`}
                  width={1000}
                  height={720}
                  loading="eager"
                />
              ) : (
                <div className="hero-brand-placeholder">
                  <img
                    src="/athr-mark.svg"
                    alt="أثر للتقنية والتصميم"
                    width={160}
                    height={180}
                  />
                </div>
              )}
            </div>
            <div className="hero-seal" aria-hidden="true">
              <img src="/athr-mark.svg" alt="" width={55} height={55} />
              <span>نبتكر لنترك أثرًا</span>
            </div>
          </div>
          <div className="hero-project-caption">
            <span>
              {hero?.titleAr.split(" — ")[0] || "أثر للتقنية والتصميم"}
            </span>
            <span>
              تصميم وتطوير <ArrowUpLeft size={17} aria-hidden="true" />
            </span>
          </div>
        </div>
      </section>
      <div className="expertise-strip">
        <div className="container">
          {["التصميم", "التقنية", "الهوية", "التجربة", "الأثر"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <section className="section container" aria-labelledby="home-work-title">
        <div className="section-heading">
          <div>
            <h2 id="home-work-title">أعمال نعتزّ بأثرها.</h2>
            <p>أفكار مختلفة. عناية واحدة بكل تفصيلة.</p>
          </div>
          <Link className="text-link" to="/portfolio">
            كل الأعمال <ArrowLeft size={19} aria-hidden="true" />
          </Link>
        </div>
        {loading ? (
          <ProjectSkeletons />
        ) : selected.length ? (
          <div className="selected-grid">
            {selected.map((p, i) => (
              <ProjectTile key={p._id} project={p} large={i === 0} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>تواصل معنا للاطلاع على الأعمال المناسبة لمشروعك.</p>
            <Link to="/contact" className="text-link">
              تواصل مع أثر <ArrowLeft size={18} />
            </Link>
          </div>
        )}
      </section>
      <section className="home-services section">
        <div className="container service-overview">
          <div className="service-overview-intro">
            <h2>
              كل ما تحتاجه
              <br />
              ليكتمل حضورك.
            </h2>
            <p>
              نجمع التصميم والتقنية والمحتوى في تجربة متناسقة، تبدأ بفهم مشروعك
              وتصل إلى التفاصيل التي تصنع الفرق.
            </p>
            <Link className="text-link" to="/services">
              تعرّف على خدماتنا <ArrowLeft size={19} aria-hidden="true" />
            </Link>
          </div>
          <div className="service-links">
            {SERVICES.map((s) => (
              <Link
                to={`/contact?service=${encodeURIComponent(s.title)}`}
                key={s.title}
              >
                <span className="service-link-icon">
                  <ServiceIcon name={s.icon} />
                </span>
                <span>{s.short}</span>
                <ArrowUpLeft size={22} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section container approach">
        <div>
          <h2>
            فكرة واضحة.
            <br />
            تنفيذ يليق بها.
          </h2>
          <p>
            نستمع أولًا، نضع الطريق معك، ثم نحول التفاصيل إلى تجربة يمكنك رؤيتها
            واستخدامها.
          </p>
          <Link className="text-link" to="/about">
            عن أثر <ArrowLeft size={19} aria-hidden="true" />
          </Link>
        </div>
        <ol className="process-list">
          {[
            {
              t: "نفهم مشروعك",
              d: "نتعرف على الفكرة والجمهور والأولويات ونحدد نطاق العمل.",
            },
            {
              t: "نصمّم التجربة",
              d: "نرتب المحتوى ونبني لغة بصرية تعكس هوية مشروعك.",
            },
            {
              t: "نطوّر ونختبر",
              d: "نحول التصميم إلى منتج ونراجع التجربة على الأجهزة.",
            },
            {
              t: "نطلق ونتابع",
              d: "نسلّم المشروع ونتابع معك حسب نطاق الدعم المتفق عليه.",
            },
          ].map((s, i) => (
            <li key={s.t}>
              <span className="process-number" dir="ltr">
                0{i + 1}
              </span>
              <div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
              <Check size={18} aria-hidden="true" />
            </li>
          ))}
        </ol>
      </section>
      <StudioCta />
    </>
  );
}
