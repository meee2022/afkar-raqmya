import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Packages = lazy(() => import("./pages/Packages"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import("./Admin"));
const DocPrint = lazy(() => import("./pages/DocPrint"));

function PageLoader() {
  return <div className="min-h-screen bg-[#F6F0E6] text-[#7A1630] flex items-center justify-center font-bold">جارٍ التحميل...</div>;
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/doc/:id" element={<DocPrint />} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/services" element={<Layout><Services /></Layout>} />
        <Route path="/portfolio" element={<Layout><Portfolio /></Layout>} />
        <Route path="/packages" element={<Layout><Packages /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </Suspense>
  );
}
