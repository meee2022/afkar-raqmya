export type DocumentStatus =
  "draft" | "sent" | "accepted" | "paid" | "cancelled";
export function nextStatuses(
  kind: "invoice" | "quote",
  current: DocumentStatus,
): DocumentStatus[] {
  if (current === "draft") return ["sent", "cancelled"];
  if (current === "sent")
    return kind === "quote" ? ["accepted", "cancelled"] : ["paid", "cancelled"];
  return [];
}
