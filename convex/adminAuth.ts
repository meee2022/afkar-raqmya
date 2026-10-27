import {
  mutation,
  query,
  type QueryCtx,
  type MutationCtx,
} from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";
import { consumeLimit } from "./security";

const SESSION_MS = 1000 * 60 * 60 * 12;

function adminEnv(name: "ADMIN_EMAIL" | "ADMIN_PASSWORD") {
  return (
    globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined> };
    }
  ).process?.env?.[name];
}

function configuredEmail() {
  const email = adminEnv("ADMIN_EMAIL")?.trim().toLowerCase();
  return email &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? email
    : null;
}

function validSession(session: Doc<"agencyAdminSessions"> | null) {
  const email = configuredEmail();
  return Boolean(
    email && session?.email === email && session.expiresAt > Date.now(),
  );
}

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx, token: string) {
  if (!token) throw new Error("غير مصرح");
  const tokenHash = await sha256(token);
  const session = await ctx.db
    .query("agencyAdminSessions")
    .withIndex("by_tokenHash", (q) => q.eq("tokenHash", tokenHash))
    .unique();

  if (!validSession(session)) {
    throw new Error("انتهت الجلسة، سجّل الدخول مرة أخرى");
  }
  return session;
}

export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, { email, password }) => {
    const expected = adminEnv("ADMIN_PASSWORD");
    const adminEmail = configuredEmail();
    if (!adminEmail || !expected || expected.length < 8)
      throw new ConvexError(
        "تسجيل دخول الإدارة غير مُعدّ حاليًا. راجع إعدادات حساب الإدارة.",
      );
    if (!(await consumeLimit(ctx, "admin-login", 20, 5 * 60_000))) {
      return { error: "محاولات كثيرة. انتظر خمس دقائق ثم حاول مرة أخرى." };
    }
    if (email.trim().toLowerCase() !== adminEmail || password !== expected) {
      return {
        error:
          "البريد الإلكتروني أو كلمة المرور غير صحيحة. راجع البيانات وحاول مرة أخرى.",
      };
    }

    const token = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
    await ctx.db.insert("agencyAdminSessions", {
      tokenHash: await sha256(token),
      email: adminEmail,
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
    return validSession(session);
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
