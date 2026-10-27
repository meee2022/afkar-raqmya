export const REGISTRY_STATUSES = {
  unknown: "لم تُحدد",
  live: "يعمل",
  development: "قيد التطوير",
  paused: "متوقف",
} as const;
export type RegistryStatus = keyof typeof REGISTRY_STATUSES;
export type ServiceAccount = {
  provider: string;
  account: string;
  project: string;
  dashboardUrl: string;
};
export type RegistryInput = {
  name: string;
  client: string;
  siteUrl: string;
  domain: string;
  domainProvider: string;
  renewalDate: string;
  repositoryUrl: string;
  repositoryName: string;
  localPath?: string;
  credentialReference: string;
  services: ServiceAccount[];
  notes: string;
  tags: string[];
  status: RegistryStatus;
  needsReview: boolean;
  pinned: boolean;
  recordKey?: string;
};
export type RegistryRecord = RegistryInput & {
  _id: string;
  archived: boolean;
  revision: number;
  createdAt: number;
  updatedAt: number;
  linkedProjectId?: string;
};
export type RegistryBackupRecord = RegistryInput & { archived?: boolean };
export const emptyRegistryInput = (): RegistryInput => ({
  name: "",
  client: "",
  siteUrl: "",
  domain: "",
  domainProvider: "",
  renewalDate: "",
  repositoryUrl: "",
  repositoryName: "",
  localPath: "",
  credentialReference: "",
  services: [],
  notes: "",
  tags: [],
  status: "unknown",
  needsReview: true,
  pinned: false,
});
export function registryInput(row: RegistryInput): RegistryInput {
  return {
    name: row.name,
    client: row.client,
    siteUrl: row.siteUrl,
    domain: row.domain,
    domainProvider: row.domainProvider,
    renewalDate: row.renewalDate,
    repositoryUrl: row.repositoryUrl,
    repositoryName: row.repositoryName,
    localPath: row.localPath ?? "",
    credentialReference: row.credentialReference,
    services: row.services,
    notes: row.notes,
    tags: row.tags,
    status: row.status,
    needsReview: row.needsReview,
    pinned: row.pinned,
    ...(row.recordKey ? { recordKey: row.recordKey } : {}),
  };
}
export function validCalendarDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export function renewalDays(value: string, now = Date.now()) {
  if (!validCalendarDate(value)) return null;
  const today = new Date(now + 3 * 3600_000).toISOString().slice(0, 10);
  return Math.round((Date.parse(value) - Date.parse(today)) / 86_400_000);
}
export function registrySearch(row: RegistryInput, term: string) {
  const query = term.trim().toLocaleLowerCase("ar");
  return (
    !query ||
    [
      row.name,
      row.client,
      row.siteUrl,
      row.domain,
      row.domainProvider,
      row.repositoryName,
      row.repositoryUrl,
      row.localPath ?? "",
      row.notes,
      ...row.tags,
      ...row.services.flatMap((s) => [s.provider, s.account, s.project]),
    ]
      .join(" ")
      .toLocaleLowerCase("ar")
      .includes(query)
  );
}
export const REGISTRY_BACKUP_FORMAT = "athr-private-site-registry";
