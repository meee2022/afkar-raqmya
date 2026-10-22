import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const SESSION_MS = 1000 * 60 * 60 * 12;

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function requireAdmin(ctx: any, token: string) {
  if (!token) throw new Error("غير مصرح");
  const tokenHash = await sha256(token);
  const session = await ctx.db
    .query("agencyAdminSessions")
    .withIndex("by_tokenHash", (q: any) => q.eq("tokenHash", tokenHash))
    .unique();

  if (!session || session.expiresAt <= Date.now()) {
    // Queries get a read-only db, so only mutations can clean up the expired row.
    if (session && typeof ctx.db.delete === "function") await ctx.db.delete(session._id);
    throw new Error("انتهت الجلسة، سجّل الدخول مرة أخرى");
  }
  return session;
}

export const login = mutation({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    const expected = (globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env?.ADMIN_PASSWORD;
    if (!expected) throw new Error("لم يتم إعداد كلمة مرور الإدارة في Convex");
    if (password.length < 8 || password !== expected) {
      throw new Error("كلمة المرور غير صحيحة");
    }

    const token = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
    await ctx.db.insert("agencyAdminSessions", {
      tokenHash: await sha256(token),
      expiresAt: Date.now() + SESSION_MS,
      createdAt: Date.now(),
    });
    return { token, expiresAt: Date.now() + SESSION_MS };
  },
});

export const validate = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    if (!token) return false;
    const tokenHash = await sha256(token);
    const session = await ctx.db
      .query("agencyAdminSessions")
      .withIndex("by_tokenHash", (q) => q.eq("tokenHash", tokenHash))
      .unique();
    return Boolean(session && session.expiresAt > Date.now());
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    if (!token) return;
    const tokenHash = await sha256(token);
    const session = await ctx.db
      .query("agencyAdminSessions")
      .withIndex("by_tokenHash", (q) => q.eq("tokenHash", tokenHash))
      .unique();
    if (session) await ctx.db.delete(session._id);
  },
});
