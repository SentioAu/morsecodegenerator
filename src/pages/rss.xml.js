// RSS / Atom feed for the blog. Generated at build time.
// Endpoint via Astro's "Endpoints" feature: a .js file under pages/
// exports a `GET` handler that returns a Response. The build statically
// renders it to dist/rss.xml.

import { posts } from "../data/blog-posts.js";
import { bodies } from "../data/blog-bodies.js";

const SITE = "https://morsecodegenerator.com";
const FEED_URL = `${SITE}/rss.xml`;
const TITLE = "MorseCodeGenerator.com Blog";
const DESCRIPTION =
  "Long-form articles about Morse code: learning plans, history, comparisons, emergency use, aviation, and more.";

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

// Pull the first paragraph of a post body as a description fallback if
// the registry excerpt is too short for a feed reader.
function firstParagraph(html) {
  const m = String(html || "").match(/<p>([\s\S]*?)<\/p>/);
  if (!m) return "";
  return m[1].replace(/<[^>]+>/g, "").trim();
}

function pubDateRFC822(yyyy_mm_dd) {
  // Convert YYYY-MM-DD to an RFC-822 datetime at noon UTC.
  const d = new Date(`${yyyy_mm_dd}T12:00:00Z`);
  return d.toUTCString();
}

export async function GET() {
  const sorted = [...posts].sort((a, b) =>
    String(b.published).localeCompare(String(a.published))
  );

  const lastBuildDate = new Date().toUTCString();

  const items = sorted
    .map((p) => {
      const link = `${SITE}/blog/${p.slug}/`;
      const desc = p.excerpt || firstParagraph(bodies[p.slug]);
      return `
    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <pubDate>${pubDateRFC822(p.published)}</pubDate>
      <description>${esc(desc)}</description>
      ${p.tags.map((t) => `<category>${esc(t)}</category>`).join("\n      ")}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(TITLE)}</title>
    <link>${esc(SITE)}/blog/</link>
    <atom:link href="${esc(FEED_URL)}" rel="self" type="application/rss+xml" />
    <description>${esc(DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>Astro (MorseCodeGenerator.com)</generator>${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
    },
  });
}
