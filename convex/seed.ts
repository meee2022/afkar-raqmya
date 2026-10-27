import { internalMutation } from "./_generated/server";
import { PROJECT_CATALOG, catalogMatch } from "../shared/projects";

// Additive bootstrap. Preserve edits, archived rows, and uploaded media.
export const seedProjects = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("agencyProjects").collect();
    let added = 0,
      enriched = 0;
    for (const p of PROJECT_CATALOG) {
      const row = existing.find(
        (r) =>
          r.seedKey === p.seedKey || catalogMatch(r)?.seedKey === p.seedKey,
      );
      const media = {
        seedKey: p.seedKey,
        slug: p.slug,
        phone: p.phone ?? false,
        previewImage: p.imageUrl ?? undefined,
        previewVideo: p.videoUrl ?? undefined,
        featured: p.featured ?? false,
      };
      if (row) {
        const patch = Object.fromEntries(
          Object.entries(media).filter(
            ([key, value]) =>
              value !== undefined && row[key as keyof typeof row] === undefined,
          ),
        );
        if (Object.keys(patch).length) {
          await ctx.db.patch(row._id, patch);
          enriched++;
        }
      } else {
        await ctx.db.insert("agencyProjects", {
          ...media,
          titleAr: p.titleAr,
          descriptionAr: p.descriptionAr,
          category: p.category,
          result: p.result,
          liveUrl: p.liveUrl,
          challenge: p.challenge,
          solution: p.solution,
          outcome: p.outcome,
          tags: p.tags ?? [],
          sortOrder: p.sortOrder ?? added,
          isActive: true,
          createdAt: Date.now(),
        });
        added++;
      }
    }
    return { added, enriched };
  },
});
