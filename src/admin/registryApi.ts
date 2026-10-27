import { makeFunctionReference } from "convex/server";
import type { Id } from "../../convex/_generated/dataModel";
import type {
  RegistryInput,
  RegistryBackupRecord,
  RegistryRecord,
} from "../../shared/siteRegistry";
type Auth = { token: string };
type RecordId = { id: Id<"agencyWebsiteRegistry"> };
// Explicit references keep the private module typed without changing generated files.
export const registryApi = {
  list: makeFunctionReference<"query", Auth, RegistryRecord[]>(
    "siteRegistry:list",
  ),
  get: makeFunctionReference<"query", Auth & RecordId, RegistryRecord | null>(
    "siteRegistry:get",
  ),
  create: makeFunctionReference<
    "mutation",
    Auth & RegistryInput,
    Id<"agencyWebsiteRegistry">
  >("siteRegistry:create"),
  update: makeFunctionReference<
    "mutation",
    Auth & RegistryInput & RecordId & { revision: number },
    void
  >("siteRegistry:update"),
  setArchived: makeFunctionReference<
    "mutation",
    Auth & RecordId & { revision: number; archived: boolean },
    void
  >("siteRegistry:setArchived"),
  importRecords: makeFunctionReference<
    "mutation",
    Auth & { records: RegistryBackupRecord[] },
    { added: number; skipped: number }
  >("siteRegistry:importRecords"),
  addFromPortfolio: makeFunctionReference<"mutation", Auth, { added: number }>(
    "siteRegistry:addFromPortfolio",
  ),
};
