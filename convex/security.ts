import type { MutationCtx } from "./_generated/server";

export async function hash(value: string) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

export async function hasCapacity(
  ctx: MutationCtx,
  bucket: string,
  limit: number,
) {
  const row = await ctx.db
    .query("agencyRateLimits")
    .withIndex("by_bucket", (q) => q.eq("bucket", bucket))
    .unique();
  return !row || row.resetAt <= Date.now() || row.count < limit;
}

// A fixed window stored transactionally; callers must RETURN errors, since throwing rolls back writes.
export async function consumeLimit(
  ctx: MutationCtx,
  bucket: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();
  const row = await ctx.db
    .query("agencyRateLimits")
    .withIndex("by_bucket", (q) => q.eq("bucket", bucket))
    .unique();
  if (!row) {
    await ctx.db.insert("agencyRateLimits", {
      bucket,
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }
  if (row.resetAt <= now) {
    await ctx.db.patch(row._id, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (row.count >= limit) return false;
  await ctx.db.patch(row._id, { count: row.count + 1 });
  return true;
}

export function webUrl(value: string | undefined) {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch {
    /* invalid URL */
  }
  throw new Error("اكتب رابطًا صحيحًا يبدأ بـ https://");
}
