// Printable A4 invoice / quotation in the ATHR identity (Arabic + English).
export type DocItem = { description: string; qty: number; unitPrice: number };
export type DocData = {
  kind: "invoice" | "quote";
  number: string;
  status?: string;
  clientName: string;
  clientCompany?: string;
  clientPhone?: string;
  clientEmail?: string;
  issueDate: string;
  dueDate?: string;
  items: DocItem[];
  discount: number;
  paidAmount?: number;
  notes?: string;
};
export type Billing = {
  crNumber?: string;
  bankName?: string;
  accountName?: string;
  iban?: string;
  paymentTerms?: string;
} | null;
export type Contact = {
  phone?: string;
  whatsapp?: string;
  email?: string;
} | null;

const M = "#4A0E1E",
  MAROON = "#7A1630",
  GOLD = "#C9A35F",
  GD = "#8F6A2F",
  INK = "#2A0913";
export const money = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
export const totals = (d: Pick<DocData, "items" | "discount">) => {
  const subtotal = d.items.reduce(
    (s, i) => s + (i.qty || 0) * (i.unitPrice || 0),
    0,
  );
  return { subtotal, total: Math.max(0, subtotal - (d.discount || 0)) };
};

const Label = ({ ar, en }: { ar: string; en: string }) => (
  <div style={{ lineHeight: 1.2 }}>
    <div style={{ font: "700 11px Tajawal", color: GD }}>{ar}</div>
    <div
      style={{
        font: "500 8.5px Lexend",
        letterSpacing: ".12em",
        color: GD,
        opacity: 0.8,
        direction: "ltr",
        textAlign: "right",
      }}
    >
      {en}
    </div>
  </div>
);

export default function InvoiceDocument({
  doc,
  billing,
  contact,
}: {
  doc: DocData;
  billing: Billing;
  contact: Contact;
}) {
  const isInvoice = doc.kind === "invoice";
  const { subtotal, total } = totals(doc);
  const cell: React.CSSProperties = {
    padding: "10px 10px",
    borderBottom: "1px solid #EFE4D2",
    font: "500 12.5px Tajawal",
    color: INK,
    verticalAlign: "top",
  };
  const num: React.CSSProperties = {
    ...cell,
    font: "500 12px Lexend",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  return (
    <div
      className="athr-doc"
      dir="rtl"
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        background: "#fff",
        color: INK,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 60px rgba(74,14,30,.15)",
      }}
    >
      <style>{`@media print { .athr-doc { display:block!important; min-height:0!important; } .athr-doc thead { display:table-header-group; } .athr-doc tr { break-inside:avoid; } .athr-doc td { overflow-wrap:anywhere; } }`}</style>
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${MAROON}, ${M})`,
          color: "#F3E2B6",
          padding: "26px 34px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/athr-mark-ondark.svg" alt="" style={{ height: 74 }} />
          <div>
            <div style={{ font: "800 22px Tajawal" }}>أثر للتقنية والتصميم</div>
            <div
              style={{
                font: "600 11px Lexend",
                letterSpacing: ".32em",
                marginTop: 4,
                direction: "ltr",
                textAlign: "right",
                color: GOLD,
              }}
            >
              ATHR TECHNOLOGY &amp; DESIGN
            </div>
          </div>
        </div>
        <div style={{ textAlign: "left" }}>
          <div style={{ font: "800 26px Tajawal" }}>
            {isInvoice ? "فاتورة" : "عرض سعر"}
          </div>
          <div
            style={{
              font: "600 12px Lexend",
              letterSpacing: ".3em",
              color: GOLD,
            }}
          >
            {isInvoice ? "INVOICE" : "QUOTATION"}
          </div>
        </div>
      </div>
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${GD}, #F3E2B6, ${GD})`,
        }}
      />

      <div
        style={{
          padding: "26px 34px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Meta + client */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 22 }}
        >
          <div
            style={{
              border: "1px solid #EFE4D2",
              borderRadius: 12,
              padding: "14px 16px",
              background: "#FBF7F0",
            }}
          >
            <Label
              ar={isInvoice ? "فاتورة إلى" : "مقدَّم إلى"}
              en={isInvoice ? "BILL TO" : "PREPARED FOR"}
            />
            <div style={{ font: "800 16px Tajawal", marginTop: 8 }}>
              {doc.clientName}
            </div>
            {doc.clientCompany && (
              <div style={{ font: "500 13px Tajawal", marginTop: 2 }}>
                {doc.clientCompany}
              </div>
            )}
            {doc.clientPhone && (
              <div
                style={{
                  font: "500 12px Lexend",
                  marginTop: 4,
                  direction: "ltr",
                  textAlign: "right",
                }}
              >
                {doc.clientPhone}
              </div>
            )}
            {doc.clientEmail && (
              <div
                style={{
                  font: "500 12px Lexend",
                  marginTop: 2,
                  direction: "ltr",
                  textAlign: "right",
                }}
              >
                {doc.clientEmail}
              </div>
            )}
          </div>
          <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
            {[
              { ar: "الرقم", en: "NO.", v: doc.number },
              { ar: "التاريخ", en: "DATE", v: doc.issueDate },
              doc.dueDate
                ? {
                    ar: isInvoice ? "تاريخ الاستحقاق" : "صالح حتى",
                    en: isInvoice ? "DUE DATE" : "VALID UNTIL",
                    v: doc.dueDate,
                  }
                : null,
            ]
              .filter(Boolean)
              .map((r: any) => (
                <div
                  key={r.en}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px dashed #E6D7BE",
                    paddingBottom: 7,
                  }}
                >
                  <Label ar={r.ar} en={r.en} />
                  <span style={{ font: "600 13px Lexend", color: M }}>
                    {r.v}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Items */}
        <table
          style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}
        >
          <thead>
            <tr style={{ background: M, color: "#F3E2B6" }}>
              {[
                ["#", "#"],
                ["الوصف", "DESCRIPTION"],
                ["الكمية", "QTY"],
                ["سعر الوحدة", "UNIT PRICE"],
                ["المبلغ", "AMOUNT"],
              ].map(([ar, en], i) => (
                <th
                  key={en}
                  style={{
                    padding: "9px 10px",
                    textAlign: i === 1 ? "right" : "center",
                    width: i === 0 ? 34 : i === 1 ? "auto" : 92,
                    borderRadius:
                      i === 0 ? "0 10px 0 0" : i === 4 ? "10px 0 0 0" : 0,
                  }}
                >
                  <div style={{ font: "700 12px Tajawal" }}>{ar}</div>
                  {i > 0 && (
                    <div
                      style={{
                        font: "500 8px Lexend",
                        letterSpacing: ".12em",
                        color: GOLD,
                      }}
                    >
                      {en}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {doc.items.map((it, i) => (
              <tr key={i} style={{ background: i % 2 ? "#FCF9F4" : "#fff" }}>
                <td style={num}>{i + 1}</td>
                <td style={{ ...cell, whiteSpace: "pre-wrap" }}>
                  {it.description}
                </td>
                <td style={num}>{it.qty}</td>
                <td style={num}>{money(it.unitPrice)}</td>
                <td style={{ ...num, fontWeight: 700 }}>
                  {money(it.qty * it.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: 16,
          }}
        >
          <div style={{ width: 290, marginInlineStart: "auto" }}>
            {[
              { ar: "المجموع", en: "SUBTOTAL", v: subtotal },
              ...(doc.discount
                ? [{ ar: "الخصم", en: "DISCOUNT", v: -doc.discount }]
                : []),
            ].map((r) => (
              <div
                key={r.en}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "7px 4px",
                  borderBottom: "1px solid #EFE4D2",
                }}
              >
                <Label ar={r.ar} en={r.en} />
                <span style={{ font: "600 13px Lexend", direction: "ltr" }}>
                  {money(r.v)}
                </span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 8,
                padding: "12px 14px",
                borderRadius: 12,
                background: `linear-gradient(135deg, ${MAROON}, ${M})`,
                color: "#F3E2B6",
              }}
            >
              <div>
                <div style={{ font: "800 14px Tajawal" }}>الإجمالي</div>
                <div
                  style={{
                    font: "500 8.5px Lexend",
                    letterSpacing: ".14em",
                    color: GOLD,
                  }}
                >
                  TOTAL (QAR)
                </div>
              </div>
              <span style={{ font: "700 19px Lexend", direction: "ltr" }}>
                {money(total)}{" "}
                <span style={{ fontSize: 11, color: GOLD }}>QAR</span>
              </span>
            </div>
            {isInvoice &&
              !!doc.paidAmount &&
              [
                {
                  ar: "المدفوع مقدمًا",
                  en: "PAID IN ADVANCE",
                  v: -doc.paidAmount,
                },
                {
                  ar: "المبلغ المتبقي",
                  en: "BALANCE DUE",
                  v: total - doc.paidAmount,
                },
              ].map((r, i) => (
                <div
                  key={r.en}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 4px",
                    borderBottom: i ? 0 : "1px solid #EFE4D2",
                    marginTop: i ? 0 : 6,
                  }}
                >
                  <Label ar={r.ar} en={r.en} />
                  <span
                    style={{
                      font: i ? "700 15px Lexend" : "600 13px Lexend",
                      color: i ? MAROON : INK,
                      direction: "ltr",
                    }}
                  >
                    {money(r.v)}
                    {i ? " QAR" : ""}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Notes / terms / bank */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
            marginTop: 26,
          }}
        >
          <div>
            {doc.notes && (
              <>
                <Label ar="ملاحظات" en="NOTES" />
                <p
                  style={{
                    font: "500 12px/1.7 Tajawal",
                    margin: "6px 0 14px",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {doc.notes}
                </p>
              </>
            )}
            {billing?.paymentTerms && (
              <>
                <Label ar="شروط الدفع" en="PAYMENT TERMS" />
                <p
                  style={{
                    font: "500 12px/1.7 Tajawal",
                    margin: "6px 0 0",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {billing.paymentTerms}
                </p>
              </>
            )}
          </div>
          {(billing?.iban || billing?.bankName) && (
            <div
              style={{
                border: "1px solid #EFE4D2",
                borderRadius: 12,
                padding: "12px 14px",
                background: "#FBF7F0",
                alignSelf: "start",
              }}
            >
              <Label ar="بيانات التحويل البنكي" en="BANK DETAILS" />
              <div
                style={{
                  marginTop: 8,
                  display: "grid",
                  gap: 4,
                  font: "500 12px Tajawal",
                }}
              >
                {billing.bankName && (
                  <div>
                    البنك: <b>{billing.bankName}</b>
                  </div>
                )}
                {billing.accountName && (
                  <div>
                    اسم الحساب: <b>{billing.accountName}</b>
                  </div>
                )}
                {billing.iban && (
                  <div>
                    IBAN:{" "}
                    <b
                      style={{
                        fontFamily: "Lexend",
                        direction: "ltr",
                        unicodeBidi: "embed",
                      }}
                    >
                      {billing.iban}
                    </b>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stamp & signature */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 30,
            marginTop: "auto",
            paddingTop: 34,
          }}
        >
          {[
            ["الختم", "STAMP"],
            ["التوقيع", "SIGNATURE"],
          ].map(([ar, en]) => (
            <div key={en}>
              <div
                style={{ height: 70, borderBottom: `1.5px solid ${GOLD}` }}
              />
              <div style={{ marginTop: 6 }}>
                <Label ar={ar} en={en} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: `3px solid ${GOLD}`,
          background: "#FBF7F0",
          padding: "12px 34px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          font: "500 11px Tajawal",
          color: M,
        }}
      >
        <span>
          نبتكر لنترك أثرًا ✦{" "}
          <span
            style={{
              fontFamily: "Lexend",
              letterSpacing: ".08em",
              fontSize: 9.5,
              color: GD,
            }}
          >
            INNOVATE TO MAKE AN IMPACT
          </span>
        </span>
        <span
          style={{
            fontFamily: "Lexend",
            direction: "ltr",
            display: "flex",
            gap: 14,
          }}
        >
          {contact?.phone && <span>{contact.phone}</span>}
          {contact?.email && <span>{contact.email}</span>}
          {billing?.crNumber && <span>C.R. {billing.crNumber}</span>}
        </span>
      </div>
    </div>
  );
}
