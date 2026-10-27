import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Packages = lazy(() => import("./pages/Packages"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import("./Admin"));
const DocPrint = lazy(() => import("./pages/DocPrint"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#7A1630] flex items-center justify-center font-bold">
      جارٍ التحميل...
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!pathname.startsWith("/admin")) return;
    document.title = "الإدارة | أثر للتقنية والتصميم";
    const meta = document.querySelector('meta[name="robots"]');
    meta?.setAttribute("content", "noindex, nofollow");
    return () => {
      meta?.setAttribute("content", "index, follow");
    };
  }, [pathname]);
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/doc/:id" element={<DocPrint />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<ProjectDetail />} />
          <Route path="packages" element={<Packages />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
