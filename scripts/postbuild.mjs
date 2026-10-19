// Gives every case study a real URL on GitHub Pages and per-page link previews.
// Writes dist/projects/<slug>/index.html with its own title, description and canonical URL,
// dist/404.html as the SPA fallback, and dist/sitemap.xml.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SITE = "https://eslamusamaaa.github.io";
const html = readFileSync("dist/index.html", "utf8");
const data = readFileSync("src/data.ts", "utf8");

const projects = [];
const re = /slug: "([^"]+)",\s*\n\s*title: "([^"]+)",[\s\S]*?summary:\s*\n?\s*"([^"]+)"/g;
for (const m of data.matchAll(re)) projects.push({ slug: m[1], title: m[2], summary: m[3] });

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function page({ title, description, path }) {
  const url = `${SITE}${path}`;
  return html
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(title)}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${esc(description)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`);
}

for (const p of projects) {
  const dir = `dist/projects/${p.slug}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, page({ title: `${p.title} · Eslam Usama`, description: p.summary, path: `/projects/${p.slug}` }));
}
writeFileSync("dist/404.html", html);

const urls = ["/", ...projects.map((p) => `/projects/${p.slug}`)];
writeFileSync(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${SITE}${u}</loc></url>`)
    .join("\n")}\n</urlset>\n`
);
console.log(`postbuild: ${projects.length} case-study pages, 404.html, sitemap.xml`);
