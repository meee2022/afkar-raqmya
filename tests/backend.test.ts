import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { convexTest } from "convex-test";
import schema from "../convex/schema";
import { api, internal } from "../convex/_generated/api";
import { hash } from "../convex/security";
import { seedProjects } from "../convex/seed";
const modules = import.meta.glob([
  "../convex/**/*.ts",
  "../convex/**/*.js",
  "!../convex/**/*.d.ts",
]);
const setup = () => convexTest(schema, modules);
const adminEmail = "admin@example.com";
beforeEach(() => vi.stubEnv("ADMIN_EMAIL", adminEmail));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});
async function admin(t: ReturnType<typeof setup>) {
  const token = "test-admin-token";
  const tokenHash = await hash(token);
  await t.run((ctx) =>
    ctx.db.insert("agencyAdminSessions", {
      tokenHash,
      email: adminEmail,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600_000,
    }),
  );
  return token;
}
const contact = {
  name: "عميل أثر",
  phone: "+974 1234 5678",
  message: "أريد مناقشة تصميم موقع إلكتروني لمشروعي.",
};
const document = {
  kind: "quote" as const,
  clientName: "عميل",
  issueDate: "2026-10-26",
  items: [{ description: "موقع", qty: 1, unitPrice: 1500 }],
  discount: 0,
};

describe("admin authorization and throttling", () => {
  it("rejects unauthorized access to private data and changes", async () => {
    const t = setup();
    await expect(
      t.query(api.contact.list, { token: "invalid" }),
    ).rejects.toThrow();
    await expect(
      t.query(api.projects.listAll, { token: "invalid" }),
    ).rejects.toThrow();
    await expect(
      t.mutation(api.documents.create, { ...document, token: "invalid" }),
    ).rejects.toThrow();
  });
  it("persists failed login counts and resets the window", async () => {
    const t = setup();
    vi.stubEnv("ADMIN_PASSWORD", "test-password-long");
    const now = Date.now();
    const clock = vi.spyOn(Date, "now").mockReturnValue(now);
    for (let i = 0; i < 20; i++)
      expect(
        await t.mutation(api.adminAuth.login, {
          email: `wrong-${i}@example.com`,
          password: "wrong-password",
        }),
      ).toHaveProperty("error");
    expect(
      (
        await t.mutation(api.adminAuth.login, {
          email: adminEmail,
          password: "test-password-long",
        })
      ).error,
    ).toContain("محاولات");
    clock.mockReturnValue(now + 5 * 60_000 + 1);
    const result = await t.mutation(api.adminAuth.login, {
      email: adminEmail,
      password: "test-password-long",
    });
    expect(result.token).toBeTruthy();
    expect(
      await t.query(api.adminAuth.validate, { token: result.token! }),
    ).toBe(true);
    await t.mutation(api.adminAuth.logout, { token: result.token! });
    expect(
      await t.query(api.adminAuth.validate, { token: result.token! }),
    ).toBe(false);
  });
  it("rejects expired sessions", async () => {
    const t = setup();
    const token = await admin(t);
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 3600_001);
    await expect(t.query(api.contact.list, { token })).rejects.toThrow();
  });
  it("requires both credentials and does not disclose which one is wrong", async () => {
    const t = setup();
    vi.stubEnv("ADMIN_PASSWORD", "test-password-long");
    const wrongEmail = await t.mutation(api.adminAuth.login, {
      email: "other@example.com",
      password: "test-password-long",
    });
    const wrongPassword = await t.mutation(api.adminAuth.login, {
      email: adminEmail,
      password: "wrong-password",
    });
    expect(wrongEmail.error).toBe(wrongPassword.error);
    expect(wrongEmail.token).toBeUndefined();
    expect(wrongPassword.token).toBeUndefined();
    await expect(
      t.mutation(api.adminAuth.login, {
        password: "test-password-long",
      } as any),
    ).rejects.toThrow();
    expect(
      await t.run((ctx) => ctx.db.query("agencyAdminSessions").collect()),
    ).toHaveLength(0);
    const result = await t.mutation(api.adminAuth.login, {
      email: "  ADMIN@EXAMPLE.COM  ",
      password: "test-password-long",
    });
    expect(result.token).toBeTruthy();
    const sessions = await t.run((ctx) =>
      ctx.db.query("agencyAdminSessions").collect(),
    );
    expect(sessions[0].email).toBe(adminEmail);
    expect(sessions[0].tokenHash).not.toBe(result.token);
  });
  it("fails closed when the administrator email is not configured", async () => {
    const t = setup();
    vi.stubEnv("ADMIN_PASSWORD", "test-password-long");
    vi.stubEnv("ADMIN_EMAIL", "");
    await expect(
      t.mutation(api.adminAuth.login, {
        email: adminEmail,
        password: "test-password-long",
      }),
    ).rejects.toThrow();
    expect(
      await t.run((ctx) => ctx.db.query("agencyAdminSessions").collect()),
    ).toHaveLength(0);
  });
  it("rejects old password-only sessions and sessions for a different administrator", async () => {
    const t = setup();
    const oldToken = "old-password-only-session";
    await t.run(async (ctx) => {
      await ctx.db.insert("agencyAdminSessions", {
        tokenHash: await hash(oldToken),
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600_000,
      });
    });
    expect(await t.query(api.adminAuth.validate, { token: oldToken })).toBe(
      false,
    );
    await expect(
      t.query(api.contact.list, { token: oldToken }),
    ).rejects.toThrow();
    const token = await admin(t);
    vi.stubEnv("ADMIN_EMAIL", "new-admin@example.com");
    expect(await t.query(api.adminAuth.validate, { token })).toBe(false);
    await expect(t.query(api.contact.list, { token })).rejects.toThrow();
  });
});
describe("project source of truth", () => {
  it("uses an internal additive seed and never resurrects archived rows", async () => {
    const t = setup();
    expect(seedProjects).toHaveProperty("isInternal", true);
    await t.mutation(internal.seed.seedProjects, {});
    const before = await t.query(api.projects.list, {});
    expect(before.length).toBeGreaterThan(0);
    expect(before.find((p) => p.seedKey === "s2")?.videoUrl).toBe(
      "/nafahat.mp4",
    );
    const token = await admin(t),
      first = before[0];
    await t.mutation(api.projects.update, {
      token,
      id: first._id,
      titleAr: "مشروع بعد تعديل الإدارة",
    });
    await t.mutation(api.projects.remove, { token, id: first._id });
    await t.mutation(internal.seed.seedProjects, {});
    expect(
      (await t.query(api.projects.list, {})).some((p) => p._id === first._id),
    ).toBe(false);
    const all = await t.query(api.projects.listAll, { token });
    expect(all.find((p) => p._id === first._id)?.titleAr).toBe(
      "مشروع بعد تعديل الإدارة",
    );
    expect(all).toHaveLength(before.length);
    await t.mutation(api.projects.update, {
      token,
      id: first._id,
      isActive: true,
    });
    expect(await t.query(api.projects.list, {})).toHaveLength(before.length);
  });
  it("rejects executable project links", async () => {
    const t = setup(),
      token = await admin(t);
    await expect(
      t.mutation(api.projects.create, {
        token,
        titleAr: "اختبار",
        descriptionAr: "وصف",
        category: "مواقع",
        tags: [],
        sortOrder: 1,
        liveUrl: "javascript:alert(1)",
      }),
    ).rejects.toThrow();
  });
});
describe("contact validation and duplicate protection", () => {
  it("does not create fresh phone buckets when the shared limit is full", async () => {
    const t = setup();
    await t.run((ctx) =>
      ctx.db.insert("agencyRateLimits", {
        bucket: "contact:global",
        count: 100,
        resetAt: Date.now() + 3600_000,
      }),
    );
    expect((await t.mutation(api.contact.submit, contact)).ok).toBe(false);
    expect(
      await t.run((ctx) => ctx.db.query("agencyRateLimits").collect()),
    ).toHaveLength(1);
  });
  it("validates on the server and silently discards honeypots", async () => {
    const t = setup();
    expect(
      (await t.mutation(api.contact.submit, { ...contact, message: " " })).ok,
    ).toBe(false);
    expect(
      (
        await t.mutation(api.contact.submit, {
          ...contact,
          website: "bot.example",
        })
      ).ok,
    ).toBe(true);
    expect(
      await t.run((ctx) => ctx.db.query("agencyContactRequests").collect()),
    ).toHaveLength(0);
  });
  it("keeps the selected package and blocks repeated requests", async () => {
    const t = setup();
    for (let i = 0; i < 3; i++)
      expect(
        (
          await t.mutation(api.contact.submit, {
            ...contact,
            service: "باقة الأعمال",
            budget: "1,500–5,000 ر.ق",
          })
        ).ok,
      ).toBe(true);
    expect((await t.mutation(api.contact.submit, contact)).ok).toBe(false);
    const rows = await t.run((ctx) =>
      ctx.db.query("agencyContactRequests").collect(),
    );
    expect(rows).toHaveLength(3);
    expect(rows[0].service).toBe("باقة الأعمال");
  });
});
describe("invoice and quotation invariants", () => {
  it("locks sent amounts and converts accepted quotations once", async () => {
    const t = setup(),
      token = await admin(t);
    const id = await t.mutation(api.documents.create, { token, ...document });
    await t.mutation(api.documents.setStatus, { token, id, status: "sent" });
    const { kind: _kind, ...editable } = document;
    await expect(
      t.mutation(api.documents.update, { token, id, ...editable }),
    ).rejects.toThrow("لا يمكن تعديل مستند بعد إرساله");
    await t.mutation(api.documents.setStatus, {
      token,
      id,
      status: "accepted",
    });
    const invoice = await t.mutation(api.documents.convertToInvoice, {
      token,
      id,
    });
    expect(
      await t.mutation(api.documents.convertToInvoice, { token, id }),
    ).toBe(invoice);
  });
  it("rejects invalid dates and invalid state transitions", async () => {
    const t = setup(),
      token = await admin(t);
    await expect(
      t.mutation(api.documents.create, {
        token,
        ...document,
        issueDate: "2026-02-31",
      }),
    ).rejects.toThrow();
    const id = await t.mutation(api.documents.create, { token, ...document });
    await expect(
      t.mutation(api.documents.setStatus, { token, id, status: "paid" }),
    ).rejects.toThrow();
  });
});
