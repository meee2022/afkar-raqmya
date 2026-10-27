import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseEnv } from "node:util";
async function files(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await files(path)));
    else out.push(path);
  }
  return out;
}
const output = await files(resolve("dist"));
if (
  output.some((path) =>
    /[\\/]\.private[\\/]|website-registry-import\.json|[\\/]\.artifacts[\\/]/i.test(
      path,
    ),
  )
)
  throw new Error(
    "A private or preview file was included in the production build.",
  );
const records = [];
for (const name of ["website-registry-import.json", "all-sites-prepared.json"]) {
  try {
    const draft = JSON.parse(await readFile(resolve(".private", name), "utf8"));
    records.push(...(draft.records ?? []));
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
}
const accounts = [
  ...new Set(
    records.flatMap((r) =>
      (r.services ?? [])
        .map((s) => s.account)
        .filter(
          (account) => typeof account === "string" && account.includes("@"),
        ),
    ),
  ),
];
const localPaths = records.flatMap((r) =>
  typeof r.localPath === "string" && r.localPath
    ? [r.localPath, JSON.stringify(r.localPath).slice(1, -1)]
    : [],
);
const secrets = [];
if (process.env.CONVEX_DEPLOY_KEY) secrets.push(process.env.CONVEX_DEPLOY_KEY);
try {
  const env = parseEnv(await readFile(resolve(".env.local"), "utf8"));
  if (env.CONVEX_DEPLOY_KEY) secrets.push(env.CONVEX_DEPLOY_KEY);
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}
for (const path of output.filter((path) =>
  /\.(js|css|html|json|xml|txt)$/i.test(path),
)) {
  const text = (await readFile(path, "utf8")).toLowerCase();
  if (
    [...accounts, ...localPaths, ...secrets].some((value) =>
      text.includes(value.toLowerCase()),
    )
  )
    throw new Error(
      "Private registry data or a deployment credential appeared in a production asset. Build rejected.",
    );
}
console.log(
  accounts.length
    ? "Private-build check passed: account data, local project folders and deployment credentials are excluded."
    : "Private-build structure verified; no local private draft to compare.",
);
