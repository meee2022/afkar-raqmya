import { Component, type ReactNode } from "react";
export default class ErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="container not-found" dir="rtl">
        <h1>تعذر تحميل هذه الصفحة.</h1>
        <p>
          قد يكون الاتصال انقطع أو انتهت جلسة الإدارة. أعد تحميل الصفحة، أو سجّل
          الدخول مرة أخرى.
        </p>
        <div className="hero-actions">
          <button className="button" onClick={() => window.location.reload()}>
            إعادة المحاولة
          </button>
          <a className="text-link" href="/">
            الرئيسية
          </a>
          {window.location.pathname.startsWith("/admin") && (
            <a
              className="text-link"
              href="/admin"
              onClick={() => {
                localStorage.removeItem("afkar_admin_token");
              }}
            >
              تسجيل الدخول
            </a>
          )}
        </div>
      </main>
    );
  }
}
