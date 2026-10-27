import { Link } from "react-router-dom";
import { ArrowUpLeft } from "lucide-react";
import Seo from "../components/Seo";
import { PageIntro, ServiceIcon, StudioCta } from "../components/Studio";
import { SERVICES } from "../data/site";
export default function Services() {
  return (
    <>
      <Seo
        title="خدماتنا"
        path="/services"
        description="خدمات أثر للتقنية والتصميم: تطوير المواقع والتطبيقات والهوية البصرية والعروض التقديمية والفيديو والدعوات الرقمية."
      />
      <div className="container">
        <PageIntro title="من الفكرة، إلى كل تفاصيلها.">
          خدمات تتكامل لتمنح مشروعك حضورًا واضحًا ومتناسقًا. اختر ما تحتاجه
          الآن، ونرتّب معك الخطوة التالية.
        </PageIntro>
        <div className="service-editorial-list">
          {SERVICES.map((s) => (
            <section className="service-editorial" key={s.title}>
              <div className="service-heading">
                <ServiceIcon name={s.icon} />
                <h2>{s.title}</h2>
              </div>
              <div>
                <p>{s.description}</p>
                <ul>
                  {s.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <Link
                className="service-request"
                to={`/contact?service=${encodeURIComponent(s.title)}`}
              >
                ناقش هذه الخدمة <ArrowUpLeft size={22} aria-hidden="true" />
              </Link>
            </section>
          ))}
        </div>
      </div>
      <StudioCta />
    </>
  );
}
