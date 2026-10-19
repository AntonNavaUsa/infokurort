import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDirectory = join(projectRoot, "dist");
const pages = JSON.parse(await readFile(join(projectRoot, "src", "data", "seoPages.json"), "utf8"));
const template = await readFile(join(distDirectory, "index.html"), "utf8");
const siteUrl = "https://infokurort.ru";
const imageUrl = `${siteUrl}/logo.png`;

const escapeHtml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const setMeta = (html, attribute, key, content) => {
  const tagPattern = new RegExp(`<meta\\b(?=[^>]*\\b${attribute}=["']${key}["'])[^>]*>`, "i");
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  return tagPattern.test(html) ? html.replace(tagPattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
};

const renderPage = (page, { noIndex = false } = {}) => {
  const canonicalUrl = new URL(page.path, siteUrl).href;
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);
  html = setMeta(html, "name", "description", page.description);
  html = setMeta(html, "property", "og:title", page.title);
  html = setMeta(html, "property", "og:description", page.description);
  html = setMeta(html, "property", "og:url", canonicalUrl);
  html = setMeta(html, "property", "og:image", imageUrl);
  html = setMeta(html, "name", "twitter:title", page.title);
  html = setMeta(html, "name", "twitter:description", page.description);
  html = setMeta(html, "name", "twitter:image", imageUrl);
  html = setMeta(html, "name", "robots", noIndex ? "noindex, follow" : "index, follow");
  const canonicalTag = `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`;
  const canonicalPattern = /<link\b[^>]*\brel=["']canonical["'][^>]*>/i;
  html = canonicalPattern.test(html)
    ? html.replace(canonicalPattern, canonicalTag)
    : html.replace("</head>", `    ${canonicalTag}\n  </head>`);
  return html;
};

for (const page of pages) {
  const outputPath = page.path === "/"
    ? join(distDirectory, "index.html")
    : join(distDirectory, page.path.slice(1), "index.html");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderPage(page));
}

await writeFile(
  join(distDirectory, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    pages.map((page) => `  <url><loc>${siteUrl}${page.path === "/" ? "/" : page.path}</loc></url>`).join("\n") +
    `\n</urlset>\n`,
);

const notFoundPage = renderPage({
  path: "/404.html",
  title: "Страница не найдена | Инфокурорт",
  description: "Запрошенная страница не найдена.",
}, { noIndex: true });
await writeFile(join(distDirectory, "404.html"), notFoundPage);
