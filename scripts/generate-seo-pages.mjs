// Пререндер публичных страниц после `vite build` и `vite build --ssr`:
// для каждого маршрута из src/data/seoPages.json пишет dist/<path>/index.html
// со своими мета-тегами и готовой HTML-разметкой страницы внутри #root.
import { readFile, mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const distDirectory = join(projectRoot, "dist");
const ssrDirectory = join(projectRoot, "dist-ssr");
const pages = JSON.parse(await readFile(join(projectRoot, "src", "data", "seoPages.json"), "utf8"));
const template = await readFile(join(distDirectory, "index.html"), "utf8");
const { render } = await import(pathToFileURL(join(ssrDirectory, "entry-server.js")).href);
const siteUrl = "https://infokurort.ru";
const imageUrl = `${siteUrl}/logo.png`;
const rootTag = '<div id="root"></div>';

if (!template.includes(rootTag)) {
  throw new Error(`index.html does not contain ${rootTag}`);
}

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

const renderPage = (page, { noIndex = false, renderUrl = page.path, prerender = true } = {}) => {
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
  if (prerender) {
    // Функция замены, чтобы символы `$` в разметке не трактовались как шаблон
    html = html.replace(rootTag, () => `<div id="root">${render(renderUrl)}</div>`);
  }
  return html;
};

const report = [];
for (const page of pages) {
  const prerender = page.prerender !== false;
  const html = renderPage(page, { prerender });
  const outputPath = page.path === "/"
    ? join(distDirectory, "index.html")
    : join(distDirectory, page.path.slice(1), "index.html");
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
  const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  report.push(`${page.path.padEnd(16)} ${prerender ? "prerendered" : "shell only "} ${String(Buffer.byteLength(html)).padStart(7)} B html, ${text.length} chars text`);
}

await writeFile(
  join(distDirectory, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    pages.map((page) => `  <url><loc>${siteUrl}${page.path}</loc></url>`).join("\n") +
    `\n</urlset>\n`,
);

const notFoundPage = renderPage({
  path: "/404.html",
  title: "Страница не найдена | Инфокурорт",
  description: "Запрошенная страница не найдена.",
}, { noIndex: true, renderUrl: "/404" });
await writeFile(join(distDirectory, "404.html"), notFoundPage);

// Серверная сборка нужна только на этапе генерации и в образ не попадает
await rm(ssrDirectory, { recursive: true, force: true });

console.log(report.join("\n"));
