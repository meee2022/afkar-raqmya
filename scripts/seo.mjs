import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { loadEnv } from "vite";
import { ConvexHttpClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";

const env = {
  ...loadEnv("production", process.cwd(), "VITE_"),
  ...process.env,
};
const origin = env.VITE_SITE_URL?.replace(/\/$/, "");
if (
  origin &&
  (!origin.startsWith("https://") || new URL(origin).origin !== origin)
)
  throw new Error(
    "VITE_SITE_URL must be the official HTTPS origin without a path.",
  );
const site = "أثر للتقنية والتصميم";
const routes = [
  {
    path: "/",
    title: "ATHR",
    description:
      "أثر للتقنية والتصميم. نصمم ونطوّر المواقع والتطبيقات والهوية البصرية والمحتوى المرئي، من الفكرة إلى الإطلاق.",
  },
  {
    path: "/services",
    title: "خدماتنا",
    description:
      "خدمات أثر للتقنية والتصميم: المواقع والتطبيقات والهوية البصرية والعروض التقديمية والفيديو والدعوات الرقمية.",
  },
  {
    path: "/portfolio",
    title: "أعمالنا",
    description:
      "اكتشف أعمال أثر للتقنية والتصميم، من المواقع والتطبيقات إلى الهويات البصرية.",
  },
  {
    path: "/packages",
    title: "الباقات والأسعار",
    description:
      "اختر الباقة المناسبة لمشروعك مع أثر للتقنية والتصميم، وناقش نطاق العمل والمخرجات.",
  },
  {
    path: "/about",
    title: "عن أثر",
    description:
      "تعرّف على أثر للتقنية والتصميم وطريقتنا في تحويل الأفكار إلى تجارب رقمية.",
  },
  {
    path: "/contact",
    title: "تواصل معنا",
    description:
      "شارك أثر للتقنية والتصميم تفاصيل مشروعك عبر النموذج أو تواصل مباشرة عبر واتساب.",
  },
];
const escape = (value) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const dist = resolve("dist");
const template = await readFile(resolve(dist, "index.html"), "utf8");
if (origin && env.VITE_CONVEX_URL) {
  try {
    const client = new ConvexHttpClient(env.VITE_CONVEX_URL);
    const rows = await Promise.race([
      client.query(makeFunctionReference("projects:list"), {}),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 8000),
      ),
    ]);
    for (const row of rows)
      if (row.slug && /^[a-zA-Z0-9-]+$/.test(row.slug))
        routes.push({
          path: `/portfolio/${row.slug}`,
          title: row.titleAr,
          description: row.descriptionAr,
          image: row.imageUrl,
        });
  } catch {
    console.warn(
      "Project SEO snapshots skipped: public project data unavailable. Main routes generated.",
    );
  }
}
for (const route of routes) {
  const title = `${route.title} | ${site}`;
  let html = template.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escape(title)}</title>`,
  );
  for (const key of ["description", "og:description", "twitter:description"])
    html = html.replace(
      new RegExp(
        `(<meta[^>]+(?:name|property)="${key}"[^>]+content=")[^"]*(")`,
      ),
      `$1${escape(route.description)}$2`,
    );
  for (const key of ["og:title", "twitter:title"])
    html = html.replace(
      new RegExp(
        `(<meta[^>]+(?:name|property)="${key}"[^>]+content=")[^"]*(")`,
      ),
      `$1${escape(title)}$2`,
    );
  if (origin) {
    const image = route.image
      ? new URL(route.image, origin).href
      : `${origin}/og-image.png`;
    html = html.replace(
      /((?:property="og:image"|name="twitter:image")\s+content=")[^"]*/g,
      `$1${escape(image)}`,
    );
    const org = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: site,
      url: origin,
      logo: `${origin}/athr-mark.svg`,
      areaServed: "QA",
    }).replace(/</g, "\\u003c");
    html = html.replace(
      "</head>",
      `<link rel="canonical" href="${escape(origin + route.path)}" /><meta property="og:url" content="${escape(origin + route.path)}" /><script type="application/ld+json">${org}</script></head>`,
    );
  }
  const dir = route.path === "/" ? dist : resolve(dist, route.path.slice(1));
  await mkdir(dir, { recursive: true });
  await writeFile(resolve(dir, "index.html"), html);
}
await writeFile(
  resolve(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\n${origin ? `\nSitemap: ${origin}/sitemap.xml\n` : ""}`,
);
if (origin)
  await writeFile(
    resolve(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r) => `<url><loc>${escape(origin + r.path)}</loc></url>`).join("")}</urlset>`,
  );
else {
  await rm(resolve(dist, "sitemap.xml"), { force: true });
  console.warn(
    "Official domain is not set. Configure VITE_SITE_URL before publishing; legacy domains are never assumed.",
  );
}
console.log(`SEO metadata prepared for ${routes.length} routes.`);
