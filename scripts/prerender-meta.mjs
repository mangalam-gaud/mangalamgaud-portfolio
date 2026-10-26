/**
 * Writes one static HTML per route into dist/ so link previews (WhatsApp,
 * LinkedIn, X) get the right title, description and image without running JS.
 * Vercel serves these files before the SPA rewrite, so routing is unchanged.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createServer } from "vite";

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const setMeta = (html, attr, key, value) => {
  const re = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`missing meta ${attr}="${key}" in dist/index.html`);
  return html.replace(re, `$1${esc(value)}$2`);
};

const setLink = (html, rel, value) => {
  const re = new RegExp(`(<link rel="${rel}" href=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`missing link rel="${rel}" in dist/index.html`);
  return html.replace(re, `$1${esc(value)}$2`);
};

const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
const { buildMeta, prerenderPaths } = await server.ssrLoadModule("/src/lib/meta.ts");
const { siteUrl } = await server.ssrLoadModule("/src/data.ts");
await server.close();

const template = await readFile("dist/index.html", "utf8");
let written = 0;

for (const path of prerenderPaths) {
  const meta = buildMeta(path);
  const url = path === "/" ? siteUrl : `${siteUrl}${path}`;

  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);
  html = setLink(html, "canonical", `${url}${path === "/" ? "/" : ""}`);
  html = setMeta(html, "name", "description", meta.desc);
  html = setMeta(html, "property", "og:url", url);
  html = setMeta(html, "property", "og:title", meta.title);
  html = setMeta(html, "property", "og:description", meta.desc);
  html = setMeta(html, "property", "og:image", meta.image);
  html = setMeta(html, "property", "og:image:width", String(meta.imageWidth));
  html = setMeta(html, "property", "og:image:height", String(meta.imageHeight));
  html = setMeta(html, "name", "twitter:title", meta.title);
  html = setMeta(html, "name", "twitter:description", meta.desc);
  html = setMeta(html, "name", "twitter:image", meta.image);

  const file = path === "/" ? "dist/index.html" : join("dist", path, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  written++;
}

console.log(`prerender-meta: wrote ${written} route pages`);
