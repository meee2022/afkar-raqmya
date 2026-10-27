import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import type { Id } from "../convex/_generated/dataModel";
import { hash } from "../convex/security";
import { api } from "../convex/_generated/api";
import { registryApi } from "../src/admin/registryApi";
import {
  emptyRegistryInput,
  registryInput,
  registrySearch,
  type RegistryRecord,
} from "../shared/siteRegistry";
import { parseRegistryBackup, registryBackup } from "../shared/registryBackup";
const modules = import.meta.glob([
  "../convex/**/*.ts",
  "../convex/**/*.js",
  "!../convex/**/*.d.ts",
]);
const setup = () => convexTest(schema, modules);
beforeEach(() => vi.stubEnv("ADMIN_EMAIL", "admin@example.com"));
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});
async function login(t: ReturnType<typeof setup>) {
  const token = "registry-test-session";
  const tokenHash = await hash(token);
  await t.run((ctx) =>
    ctx.db.insert("agencyAdminSessions", {
      tokenHash,
      email: "admin@example.com",
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600_000,
    }),
  );
  return token;
}
const sample = () => ({
  ...emptyRegistryInput(),
  name: "موقع اختبار",
  siteUrl: "https://example.com/",
  domain: "example.com",
  services: [
    {
      provider: "Convex",
      account: "private-owner@example.com",
      project: "test",
      dashboardUrl: "https://dashboard.convex.dev/",
    },
  ],
  notes: "ملاحظة خاصة لا تظهر للزائر",
});

describe("private website registry", () => {
  it("rejects anonymous reads, writes, imports and project imports", async () => {
    const t = setup(),
      token = await login(t),
      id = await t.mutation(registryApi.create, { token, ...sample() });
    await expect(t.query(registryApi.list, { token: "" })).rejects.toThrow();
    await expect(
      t.query(registryApi.get, { token: "invalid", id }),
    ).rejects.toThrow();
    await expect(
      t.mutation(registryApi.create, { token: "invalid", ...sample() }),
    ).rejects.toThrow();
    await expect(
      t.mutation(registryApi.update, {
        token: "invalid",
        id,
        revision: 1,
        ...sample(),
      }),
    ).rejects.toThrow();
    await expect(
      t.mutation(registryApi.setArchived, {
        token: "invalid",
        id,
        revision: 1,
        archived: true,
      }),
    ).rejects.toThrow();
    await expect(
      t.mutation(registryApi.importRecords, {
        token: "invalid",
        records: [sample()],
      }),
    ).rejects.toThrow();
    await expect(
      t.mutation(registryApi.addFromPortfolio, { token: "invalid" }),
    ).rejects.toThrow();
  });
  it("does not leak registry data through public projects or settings", async () => {
    const t = setup(),
      token = await login(t);
    await t.mutation(registryApi.create, { token, ...sample() });
    const publicData = JSON.stringify({
      projects: await t.query(api.projects.list, {}),
      settings: await t.query(api.settings.get, {}),
    });
    expect(publicData).not.toContain("private-owner@example.com");
    expect(publicData).not.toContain("ملاحظة خاصة");
  });
  it("blocks expired and revoked sessions for registry access", async () => {
    const t = setup(),
      token = await login(t),
      id = await t.mutation(registryApi.create, { token, ...sample() });
    await t.mutation(api.adminAuth.logout, { token });
    await expect(t.query(registryApi.get, { token, id })).rejects.toThrow();
    const renewed = await login(t);
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 3600_001);
    await expect(
      t.query(registryApi.list, { token: renewed }),
    ).rejects.toThrow();
  });
  it("preserves newer changes rather than overwriting a stale edit", async () => {
    const t = setup(),
      token = await login(t),
      id = await t.mutation(registryApi.create, { token, ...sample() });
    await t.mutation(registryApi.update, {
      token,
      id,
      revision: 1,
      ...sample(),
      notes: "الأحدث",
    });
    await expect(
      t.mutation(registryApi.update, {
        token,
        id,
        revision: 1,
        ...sample(),
        notes: "تعديل قديم",
      }),
    ).rejects.toThrow("جلسة أخرى");
    expect((await t.query(registryApi.get, { token, id }))?.notes).toBe(
      "الأحدث",
    );
  });
  it("archives and restores without removing account details", async () => {
    const t = setup(),
      token = await login(t),
      id = await t.mutation(registryApi.create, { token, ...sample() });
    await t.mutation(registryApi.setArchived, {
      token,
      id,
      revision: 1,
      archived: true,
    });
    const archived = await t.query(registryApi.get, { token, id });
    expect(archived?.archived).toBe(true);
    expect(archived?.services[0].account).toBe("private-owner@example.com");
    await t.mutation(registryApi.setArchived, {
      token,
      id,
      revision: 2,
      archived: false,
    });
    expect(await t.query(registryApi.list, { token })).toHaveLength(1);
  });
  it("rejects executable URLs, secrets in URLs, invalid dates, and oversized notes", async () => {
    const t = setup(),
      token = await login(t);
    for (const url of [
      "javascript:alert(1)",
      "https://user:password@example.com",
      "https://example.com?api_key=secret",
    ]) {
      await expect(
        t.mutation(registryApi.create, { token, ...sample(), siteUrl: url }),
      ).rejects.toThrow();
    }
    await expect(
      t.mutation(registryApi.create, {
        token,
        ...sample(),
        renewalDate: "2026-02-31",
      }),
    ).rejects.toThrow();
    await expect(
      t.mutation(registryApi.create, {
        token,
        ...sample(),
        notes: "x".repeat(12001),
      }),
    ).rejects.toThrow();
  });
  it("validates an entire import before writing any records", async () => {
    const t = setup(),
      token = await login(t);
    await expect(
      t.mutation(registryApi.importRecords, {
        token,
        records: [sample(), { ...sample(), name: "" }],
      }),
    ).rejects.toThrow();
    expect(await t.query(registryApi.list, { token })).toHaveLength(0);
  });
  it("reimports a backup without duplicating renamed rows or reviving archived rows", async () => {
    const t = setup(),
      token = await login(t),
      id = await t.mutation(registryApi.create, { token, ...sample() });
    const original = await t.query(registryApi.list, { token });
    const backup = parseRegistryBackup(registryBackup(original));
    await t.mutation(registryApi.update, {
      token,
      id,
      revision: 1,
      ...sample(),
      name: "اسم جديد",
    });
    await t.mutation(registryApi.setArchived, {
      token,
      id,
      revision: 2,
      archived: true,
    });
    expect(
      await t.mutation(registryApi.importRecords, { token, records: backup }),
    ).toEqual({ added: 0, skipped: 1 });
    const current = await t.query(registryApi.list, { token });
    expect(current).toHaveLength(1);
    expect(current[0].name).toBe("اسم جديد");
    expect(current[0].archived).toBe(true);
  });
  it("preserves archive state when restoring a backup into an empty registry", async () => {
    const t = setup(),
      token = await login(t);
    await t.mutation(registryApi.importRecords, {
      token,
      records: [{ ...sample(), archived: true }],
    });
    expect((await t.query(registryApi.list, { token }))[0].archived).toBe(true);
  });
  it("imports portfolio records only once and keeps private accounts separate", async () => {
    const t = setup(),
      token = await login(t);
    await t.run((ctx) =>
      ctx.db.insert("agencyProjects", {
        titleAr: "مشروع المعرض",
        descriptionAr: "وصف عام",
        category: "مواقع",
        liveUrl: "https://example.com",
        tags: [],
        sortOrder: 1,
        isActive: true,
        createdAt: Date.now(),
      }),
    );
    expect(await t.mutation(registryApi.addFromPortfolio, { token })).toEqual({
      added: 1,
    });
    const [row] = await t.query(registryApi.list, { token });
    await t.mutation(registryApi.update, {
      token,
      id: row._id as Id<"agencyWebsiteRegistry">,
      revision: row.revision,
      ...registryInput(row),
      name: "عنوان خاص",
      services: sample().services,
    });
    expect(await t.mutation(registryApi.addFromPortfolio, { token })).toEqual({
      added: 0,
    });
    expect(
      (await t.query(api.projects.list, {})).some(
        (p) => p.titleAr === "عنوان خاص",
      ),
    ).toBe(false);
  });
});

describe("registry backup projection", () => {
  it("exports only approved registry fields, never a session token", () => {
    const r = {
      ...sample(),
      _id: "test",
      archived: false,
      revision: 1,
      createdAt: 1,
      updatedAt: 1,
      token: "session-must-not-be-exported",
    } as RegistryRecord;
    expect(JSON.stringify(registryBackup([r]))).not.toContain(
      "session-must-not-be-exported",
    );
  });
  it("accepts minimal screenshot drafts, but rejects unsupported or malformed files", () => {
    const parsed = parseRegistryBackup({
      format: "athr-private-site-registry",
      version: 1,
      records: [
        {
          name: "سجل من صورة",
          services: [{ provider: "GitHub", account: "example@example.com" }],
        },
      ],
    });
    expect(parsed[0].needsReview).toBe(true);
    expect(parsed[0].services[0].project).toBe("");
    expect(() =>
      parseRegistryBackup({ format: "other", version: 1, records: [] }),
    ).toThrow();
    expect(() =>
      parseRegistryBackup({
        format: "athr-private-site-registry",
        version: 1,
        records: [{ name: "مثال", services: [{ provider: 55 }] }],
      }),
    ).toThrow();
  });
});

describe("private local project references", () => {
  it("round-trips local paths privately and rejects multi-line paths", async () => {
    const t = setup(),
      token = await login(t);
    const localPath = "E:/projects/private-local-app";
    await t.mutation(registryApi.create, { token, ...sample(), localPath });
    const records = await t.query(registryApi.list, { token });
    expect(records[0].localPath).toBe(localPath);
    expect(registrySearch(records[0], "private-local-app")).toBe(true);
    const restored = parseRegistryBackup(
      registryBackup(records as RegistryRecord[]),
    );
    expect(restored[0].localPath).toBe(localPath);
    expect(JSON.stringify(await t.query(api.projects.list, {}))).not.toContain(
      localPath,
    );
    await expect(
      t.mutation(registryApi.create, {
        token,
        ...sample(),
        localPath: "E:/projects/a\nE:/projects/b",
      }),
    ).rejects.toThrow();
  });
});
