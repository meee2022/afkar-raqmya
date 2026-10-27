import { Link, useParams } from "react-router-dom";
import { ArrowRight, ArrowUpLeft, ArrowLeft } from "lucide-react";
import Seo from "../components/Seo";
import { StudioCta, ProjectTile } from "../components/Studio";
import { useProjects } from "../hooks/useProjects";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { projects, loading } = useProjects();
  const p = projects.find((item) => (item.slug || item._id) === slug);
  if (loading)
    return (
      <div className="container section" role="status">
        <div className="skeleton-project" />
        <p>جارٍ تحميل المشروع…</p>
      </div>
    );
  if (!p)
    return (
      <div className="container section empty-state">
        <Seo
          title="المشروع غير متاح"
          description="هذا المشروع غير متاح حاليًا. اكتشف بقية أعمال أثر للتقنية والتصميم."
          noIndex
        />
        <h1>هذا المشروع غير متاح حاليًا.</h1>
        <Link className="button" to="/portfolio">
          العودة إلى الأعمال <ArrowRight size={18} />
        </Link>
      </div>
    );
  const related = projects
    .filter((item) => item._id !== p._id && item.category === p.category)
    .slice(0, 2);
  const live =
    p.liveUrl && /^https?:\/\//.test(p.liveUrl) ? p.liveUrl : undefined;
  return (
    <>
      <Seo
        title={p.titleAr}
        description={p.descriptionAr}
        path={`/portfolio/${p.slug || p._id}`}
        image={p.imageUrl ?? undefined}
      />
      <article className="container project-detail">
        <Link className="text-link back-link" to="/portfolio">
          <ArrowRight size={18} aria-hidden="true" /> جميع الأعمال
        </Link>
        <div className="project-detail-heading">
          <div>
            <h1>{p.titleAr}</h1>
            <p>{p.descriptionAr}</p>
          </div>
          {live && (
            <a
              className="button button-outline"
              href={live}
              target="_blank"
              rel="noopener noreferrer"
            >
              زيارة المشروع <ArrowUpLeft size={19} aria-hidden="true" />
            </a>
          )}
        </div>
        <div
          className={`project-detail-media ${p.phone ? "portrait-media" : ""}`}
        >
          {p.videoUrl ? (
            <video
              controls
              playsInline
              preload="none"
              poster={p.imageUrl || undefined}
              src={p.videoUrl}
              aria-label={`فيديو يستعرض واجهات ${p.titleAr}`}
            />
          ) : p.imageUrl ? (
            <img
              src={p.imageUrl}
              alt={`تصميم ${p.titleAr}`}
              width={1400}
              height={900}
            />
          ) : (
            <p>تواصل معنا لمعرفة تفاصيل المشروع.</p>
          )}
        </div>
        <div className="project-story">
          <aside>
            <h2>عن المشروع</h2>
            <dl>
              <div>
                <dt>المجال</dt>
                <dd>{p.category}</dd>
              </div>
              {p.role && (
                <div>
                  <dt>دور أثر</dt>
                  <dd>{p.role}</dd>
                </div>
              )}
              {p.duration && (
                <div>
                  <dt>المدة</dt>
                  <dd>{p.duration}</dd>
                </div>
              )}
              {p.result && !/[%٪]/.test(p.result) && (
                <div>
                  <dt>المخرجات</dt>
                  <dd>{p.result}</dd>
                </div>
              )}
            </dl>
            {p.tags && p.tags.length > 0 && (
              <ul className="tags" aria-label="تقنيات المشروع">
                {p.tags.map((t) => (
                  <li key={t} dir="auto">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </aside>
          <div>
            {[
              { title: "التحدي", content: p.challenge },
              { title: "الحل", content: p.solution },
              { title: "النتيجة", content: p.outcome },
            ]
              .filter((s) => s.content)
              .map((s) => (
                <section key={s.title}>
                  <h2>{s.title}</h2>
                  <p>{s.content}</p>
                </section>
              ))}
            <section>
              <h2>نفكّر في مشروعك القادم؟</h2>
              <p>شاركنا فكرتك، ونحدد معًا ما يناسبها من تصميم وتطوير.</p>
              <Link
                className="text-link"
                to={`/contact?service=${encodeURIComponent(p.category)}`}
              >
                ناقش مشروعك معنا <ArrowLeft size={19} aria-hidden="true" />
              </Link>
            </section>
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section className="container section project-related">
          <div className="section-heading">
            <h2>أعمال أخرى تستحق المشاهدة.</h2>
          </div>
          <div className="project-grid">
            {related.map((item) => (
              <ProjectTile project={item} key={item._id} />
            ))}
          </div>
        </section>
      )}
      <StudioCta />
    </>
  );
}
