import {
  emptyRegistryInput,
  REGISTRY_BACKUP_FORMAT,
  REGISTRY_STATUSES,
  registryInput,
  type RegistryBackupRecord,
  type RegistryRecord,
  type RegistryStatus,
} from "./siteRegistry";

export function registryBackup(records: RegistryRecord[]) {
  return {
    format: REGISTRY_BACKUP_FORMAT,
    version: 1,
    exportedAt: new Date().toISOString(),
    records: records.map((r) => ({
      ...registryInput(r),
      recordKey: r.recordKey ?? `registry:${r._id}`,
      archived: r.archived,
    })),
  };
}
export function parseRegistryBackup(raw: unknown): RegistryBackupRecord[] {
  if (!raw || typeof raw !== "object")
    throw new Error("ملف الاستيراد غير صالح.");
  const file = raw as Record<string, unknown>;
  if (
    file.format !== REGISTRY_BACKUP_FORMAT ||
    file.version !== 1 ||
    !Array.isArray(file.records) ||
    !file.records.length ||
    file.records.length > 2000
  )
    throw new Error("اختر نسخة سجل مواقع أثر، بإصدار 1 وحتى 2000 سجل.");
  return file.records.map((value: unknown) => {
    if (!value || typeof value !== "object")
      throw new Error("يوجد سجل غير صالح في الملف.");
    const r = value as Record<string, unknown>,
      d = emptyRegistryInput();
    for (const key of [
      "name",
      "client",
      "siteUrl",
      "domain",
      "domainProvider",
      "renewalDate",
      "repositoryUrl",
      "repositoryName",
      "localPath",
      "credentialReference",
      "notes",
    ] as const) {
      if (r[key] !== undefined && typeof r[key] !== "string")
        throw new Error("بعض حقول السجل ليست نصوصًا صالحة.");
      d[key] = (r[key] as string | undefined) ?? "";
    }
    if (!d.name.trim())
      throw new Error("يوجد سجل دون اسم. راجعه قبل الاستيراد.");
    if (
      r.status !== undefined &&
      (typeof r.status !== "string" ||
        !Object.prototype.hasOwnProperty.call(REGISTRY_STATUSES, r.status))
    )
      throw new Error("توجد حالة موقع غير معروفة في الملف.");
    d.status = (r.status as RegistryStatus | undefined) ?? "unknown";
    for (const key of ["pinned", "needsReview"] as const) {
      if (r[key] !== undefined && typeof r[key] !== "boolean")
        throw new Error("بعض خيارات السجل غير صالحة.");
      if (r[key] !== undefined) d[key] = r[key] as boolean;
    }
    if (
      r.tags !== undefined &&
      (!Array.isArray(r.tags) || r.tags.some((t) => typeof t !== "string"))
    )
      throw new Error("وسوم السجل غير صالحة.");
    d.tags = (r.tags as string[] | undefined) ?? [];
    if (r.services !== undefined && !Array.isArray(r.services))
      throw new Error("حسابات الخدمات غير صالحة.");
    d.services = ((r.services as unknown[]) ?? []).map((value) => {
      if (!value || typeof value !== "object")
        throw new Error("يوجد حساب خدمة غير صالح.");
      const s = value as Record<string, unknown>;
      if (
        ["provider", "account", "project", "dashboardUrl"].some(
          (k) => s[k] !== undefined && typeof s[k] !== "string",
        )
      )
        throw new Error("حقول حساب الخدمة يجب أن تكون نصية.");
      return {
        provider: (s.provider as string) ?? "",
        account: (s.account as string) ?? "",
        project: (s.project as string) ?? "",
        dashboardUrl: (s.dashboardUrl as string) ?? "",
      };
    });
    if (r.recordKey !== undefined && typeof r.recordKey !== "string")
      throw new Error("مرجع الاستيراد غير صالح.");
    if (r.archived !== undefined && typeof r.archived !== "boolean")
      throw new Error("حالة الأرشفة غير صالحة.");
    return {
      ...d,
      ...(r.recordKey ? { recordKey: r.recordKey as string } : {}),
      archived: (r.archived as boolean | undefined) ?? false,
    };
  });
}
