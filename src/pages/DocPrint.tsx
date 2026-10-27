import { Component, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import InvoiceDocument from "../components/InvoiceDocument";

// Convex queries throw when the admin session has expired; show that instead of a blank page.
class SessionGuard extends Component<
  { children: ReactNode },
  { error?: Error }
> {
  state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <p dir="rtl" style={{ padding: 40, fontFamily: "Tajawal" }}>
        تعذّر فتح المستند، ربما انتهت الجلسة. سجّل الدخول إلى لوحة الإدارة مرة
        أخرى.
      </p>
    );
  }
}

// Print view for one invoice/quote: /admin/doc/:id  (Ctrl+P → Save as PDF)
export default function DocPrint() {
  return (
    <SessionGuard>
      <DocView />
    </SessionGuard>
  );
}

function DocView() {
  const { id } = useParams();
  const token = localStorage.getItem("afkar_admin_token") || "";
  const doc = useQuery(
    api.documents.get,
    token && id ? { token, id: id as any } : "skip",
  );
  const billing = useQuery(
    api.documents.getBilling,
    token ? { token } : "skip",
  );
  const contact = useQuery(api.settings.get);

  if (!token)
    return (
      <p style={{ padding: 40, fontFamily: "Tajawal" }}>
        سجّل الدخول إلى لوحة الإدارة أولًا.
      </p>
    );
  if (doc === undefined || billing === undefined)
    return (
      <p style={{ padding: 40, fontFamily: "Tajawal" }}>جارٍ التحميل...</p>
    );
  if (!doc)
    return (
      <p style={{ padding: 40, fontFamily: "Tajawal" }}>المستند غير موجود.</p>
    );

  return (
    <div
      style={{ background: "#EDE3D3", minHeight: "100vh", padding: "24px 0" }}
    >
      <style>{`
        @page { size: A4; margin: 0; }
        @media print {
          body { background: #fff !important; }
          .no-print { display: none !important; }
          .print-wrap { padding: 0 !important; background: #fff !important; }
          .athr-doc { box-shadow: none !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
      <div
        className="no-print"
        dir="rtl"
        style={{
          maxWidth: "210mm",
          margin: "0 auto 16px",
          display: "flex",
          gap: 10,
          justifyContent: "flex-start",
          fontFamily: "Tajawal",
        }}
      >
        <button
          onClick={() => window.print()}
          style={{
            background: "linear-gradient(135deg,#7A1630,#4A0E1E)",
            color: "#F3E2B6",
            border: 0,
            borderRadius: 999,
            padding: "10px 22px",
            font: "700 14px Tajawal",
            cursor: "pointer",
          }}
        >
          طباعة / حفظ PDF
        </button>
        <button
          onClick={() => window.close()}
          style={{
            background: "#fff",
            color: "#4A0E1E",
            border: "1px solid #E6D7BE",
            borderRadius: 999,
            padding: "10px 22px",
            font: "700 14px Tajawal",
            cursor: "pointer",
          }}
        >
          إغلاق
        </button>
      </div>
      <div className="print-wrap">
        <InvoiceDocument
          doc={doc}
          billing={billing}
          contact={contact ?? null}
        />
      </div>
    </div>
  );
}
