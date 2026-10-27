import { useSearchParams } from "react-router-dom";
import Seo from "../components/Seo";
import {
  PageIntro,
  ProjectTile,
  ProjectSkeletons,
  StudioCta,
} from "../components/Studio";
import { useProjects } from "../hooks/useProjects";

export default function Portfolio() {
  const { projects, loading } = useProjects();
  const [params, setParams] = useSearchParams();
  const categories = ["الكل", ...new Set(projects.map((p) => p.category))];
  const active = params.get("category") || "الكل";
  const filtered =
    active === "الكل"
      ? projects
      : projects.filter((p) => p.category === active);
  return (
    <>
      <Seo
        title="أعمالنا"
        path="/portfolio"
        description="اكتشف أعمال أثر للتقنية والتصميم: مواقع وتطبيقات وهويات بصرية، مع صور المشاريع وتفاصيل تنفيذها."
      />
      <div className="container">
        <PageIntro title="لكل مشروع حكاية. ولنا فيه أثر.">
          مجموعة من المواقع والتطبيقات والتجارب التي صممناها وطورناها. افتح أي
          مشروع لتعرفه عن قرب.
        </PageIntro>
        <div className="portfolio-toolbar">
          <div
            className="filters"
            role="group"
            aria-label="تصفية الأعمال حسب المجال"
          >
            {categories.map((c) => (
              <button
                type="button"
                key={c}
                aria-pressed={active === c}
                onClick={() => {
                  const next = new URLSearchParams(params);
                  c === "الكل"
                    ? next.delete("category")
                    : next.set("category", c);
                  setParams(next);
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <p aria-live="polite">
            {loading ? "جارٍ تحميل الأعمال…" : `${filtered.length} مشروع`}
          </p>
        </div>
        {loading ? (
          <ProjectSkeletons />
        ) : filtered.length ? (
          <div className="project-grid portfolio-grid">
            {filtered.map((p) => (
              <ProjectTile key={p._id} project={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>لا توجد أعمال في هذا التصنيف حاليًا.</h2>
            <button className="button" onClick={() => setParams({})}>
              عرض كل الأعمال
            </button>
          </div>
        )}
      </div>
      <StudioCta />
    </>
  );
}
