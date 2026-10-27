// @vitest-environment node
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { expect, it } from "vitest";
import { PROJECT_CATALOG, normalizeProject } from "../shared/projects";
it("every bootstrap project has unique navigation and working local media", () => {
  expect(new Set(PROJECT_CATALOG.map((p) => p.slug)).size).toBe(
    PROJECT_CATALOG.length,
  );
  for (const p of PROJECT_CATALOG) {
    expect(p.slug).toMatch(/^[a-z0-9-]+$/);
    for (const asset of [p.imageUrl, p.videoUrl].filter(Boolean) as string[]) {
      expect(
        existsSync(resolve("public", asset.slice(1))),
        `${p.titleAr}: ${asset}`,
      ).toBe(true);
    }
  }
});

it("enriches legacy rows without replacing edited content or creating extra projects", () => {
  const p = normalizeProject({
    _id: "database-id",
    titleAr: "DarkFit — نادي رياضي",
    descriptionAr: "وصف معدل",
    category: "مواقع",
    imageUrl: null,
    videoUrl: null,
    isActive: false,
  });
  expect(p.imageUrl).toBe("/previews/darkfit-m.jpg");
  expect(p.descriptionAr).toBe("وصف معدل");
  expect(p.isActive).toBe(false);
  expect(p._id).toBe("database-id");
});
