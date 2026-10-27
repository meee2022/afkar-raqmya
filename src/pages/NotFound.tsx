import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Seo from "../components/Seo";
export default function NotFound() {
  return (
    <div className="container not-found">
      <Seo
        title="الصفحة غير موجودة"
        description="الصفحة غير موجودة. عد إلى أثر للتقنية والتصميم لاستكشاف الخدمات والأعمال."
        noIndex
      />
      <span className="error-number" dir="ltr">
        404
      </span>
      <h1>هذا الطريق لا يصل إلى الصفحة.</h1>
      <p>
        ربما تغيّر الرابط أو لم تعد الصفحة متاحة. يمكنك العودة للرئيسية أو
        استكشاف أعمالنا.
      </p>
      <div className="hero-actions">
        <Link className="button" to="/">
          العودة للرئيسية <ArrowRight size={19} aria-hidden="true" />
        </Link>
        <Link className="text-link" to="/portfolio">
          استكشف الأعمال
        </Link>
      </div>
    </div>
  );
}
