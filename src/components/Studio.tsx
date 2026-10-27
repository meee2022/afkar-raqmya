import {
  ArrowLeft,
  ArrowUpLeft,
  Monitor,
  Smartphone,
  PenTool,
  Presentation,
  Clapperboard,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { AgencyProject } from "../../shared/projects";

export function ServiceIcon({ name }: { name: string }) {
  const Icon =
    {
      web: Monitor,
      app: Smartphone,
      brand: PenTool,
      slides: Presentation,
      video: Clapperboard,
      invite: Mail,
    }[name] ?? Monitor;
  return <Icon size={25} strokeWidth={1.5} aria-hidden="true" />;
}
export function PageIntro({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="page-intro">
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
  );
}
export function ProjectTile({
  project,
  large = false,
}: {
  project: AgencyProject;
  large?: boolean;
}) {
  return (
    <article className={`project-tile ${large ? "project-tile-large" : ""}`}>
      <Link
        className={`project-image ${project.phone ? "project-image-phone" : ""}`}
        to={`/portfolio/${project.slug || project._id}`}
        aria-label={`تفاصيل مشروع ${project.titleAr}`}
      >
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={`واجهة ${project.titleAr}`}
            loading="lazy"
            decoding="async"
            width={1200}
            height={800}
          />
        ) : (
          <div className="project-image-empty">
            <ServiceIcon name="web" />
            <span>{project.titleAr}</span>
          </div>
        )}
        <span className="project-open" aria-hidden="true">
          <ArrowUpLeft size={24} />
        </span>
      </Link>
      <div className="project-caption">
        <div>
          <span className="project-category">{project.category}</span>
          <h3>
            <Link to={`/portfolio/${project.slug || project._id}`}>
              {project.titleAr.split(" — ")[0]}
            </Link>
          </h3>
          <p>{project.descriptionAr}</p>
        </div>
        <ArrowUpLeft size={24} strokeWidth={1.4} aria-hidden="true" />
      </div>
    </article>
  );
}
export function ProjectSkeletons() {
  return (
    <div className="project-grid" role="status" aria-label="جارٍ تحميل الأعمال">
      <div className="skeleton-project" />
      <div className="skeleton-project" />
      <span className="sr-only">جارٍ تحميل الأعمال…</span>
    </div>
  );
}
export function StudioCta() {
  return (
    <section className="studio-cta">
      <div className="container cta-inner">
        <div>
          <h2>
            لفكرتك مكان.
            <br />
            ولحضورك أثر.
          </h2>
          <p>شاركنا ما تطمح إليه، ولنبدأ من الخطوة المناسبة لمشروعك.</p>
        </div>
        <Link className="button button-cream" to="/contact">
          نتحدث عن مشروعك <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <img
          src="/athr-mark-ondark.svg"
          alt=""
          className="cta-mark"
          width={330}
          height={330}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
