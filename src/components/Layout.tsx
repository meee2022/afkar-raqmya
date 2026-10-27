import { Suspense, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  ArrowUpLeft,
  Menu,
  X,
  MessageCircle,
  Camera as Instagram,
  Phone,
} from "lucide-react";
import { NAV, SITE_NAME } from "../data/site";
import { useSettings } from "../hooks/useSettings";
import Logo from "./Logo";

export default function Layout({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const settings = useSettings();
  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  return (
    <div className="site-shell" dir="rtl">
      <a className="skip-link" href="#main-content">
        تخطّ إلى المحتوى
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link
            to="/"
            aria-label={`${SITE_NAME} — الرئيسية`}
            className="brand-link"
          >
            <Logo size={30} sub />
          </Link>
          <nav className="desktop-nav" aria-label="التنقل الرئيسي">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/contact" className="header-contact">
            لنصنع أثرًا <ArrowUpLeft size={19} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="mobile-toggle"
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="التنقل على الجوال"
          >
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to}>
                {n.label}
                <ArrowUpLeft size={18} aria-hidden="true" />
              </NavLink>
            ))}
          </nav>
        )}
      </header>
      <main id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="container section" role="status">
              جارٍ تحميل الصفحة…
            </div>
          }
        >
          {children ?? <Outlet />}
        </Suspense>
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <Link to="/" aria-label={SITE_NAME}>
                <Logo size={26} sub inverse />
              </Link>
              <p>نصمم ونطوّر حضورًا رقميًا يشبهك، ويترك أثرًا.</p>
            </div>
            <nav className="footer-nav" aria-label="روابط التذييل">
              {NAV.map((n) => (
                <Link to={n.to} key={n.to}>
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="footer-contact">
              <div className="footer-contact-details">
                <a
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                  className="footer-phone"
                  dir="ltr"
                >
                  {settings.phone}
                </a>
                <span className="footer-location">الدوحة، قطر</span>
              </div>
              {settings.email && (
                <a
                  className="footer-email"
                  href={`mailto:${settings.email}`}
                  dir="ltr"
                >
                  {settings.email}
                </a>
              )}
              <div className="footer-socials">
                <a
                  aria-label="تواصل عبر واتساب"
                  href={`https://wa.me/${settings.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle size={20} aria-hidden="true" />
                </a>
                {settings.instagramUrl && (
                  <a
                    aria-label="أثر على إنستغرام"
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram size={20} aria-hidden="true" />
                  </a>
                )}
                <a
                  aria-label="اتصل بأثر"
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                >
                  <Phone size={19} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} {SITE_NAME}. جميع الحقوق محفوظة.
            </span>
          </div>
        </div>
      </footer>
      <a
        className="contact-float"
        aria-label="تحدث معنا عبر واتساب"
        href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent("مرحبًا أثر، أود التحدث عن مشروعي.")}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={24} aria-hidden="true" />
        <span>نتحدث؟</span>
      </a>
    </div>
  );
}
